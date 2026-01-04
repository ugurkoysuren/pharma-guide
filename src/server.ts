import { ClaudeAgent } from './agent/llm-agent';
import { Channel, Locale } from './types';

// Store agent sessions
const sessions: Map<string, ClaudeAgent> = new Map();

// Store channel per session for persistence
const channelSessions: Map<string, Channel> = new Map();

function setChannelForSession(sessionId: string, channel: Channel): void {
  const key = `channel-${sessionId}`;
  channelSessions.set(key, channel);
  console.log(`[SESSION] Saved channel ${channel} for session ${sessionId}`);
}

function getChannelForSession(sessionId: string): Channel | null {
  const key = `channel-${sessionId}`;
  return channelSessions.get(key) || null;
}

function getOrCreateAgent(sessionId: string, channel: Channel, locale: Locale): ClaudeAgent {
  setChannelForSession(sessionId, channel);

  const key = `${sessionId}-${channel}-${locale}`;
  if (!sessions.has(key)) {
    sessions.set(key, new ClaudeAgent(channel, locale));
  }
  const agent = sessions.get(key)!;
  agent.setChannel(channel);
  agent.setLocale(locale);
  return agent;
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Session-ID, X-PharmaGuide-Channel, X-Channel',
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}

/**
 * Detect channel from multiple sources
 * Priority: Custom Header > Request Body > Message Command > Session > Default
 */
function detectChannel(headers: Headers, body: any, messages: any[]): Channel {
  // Method 1: Custom header
  const channelHeader = (headers.get('x-pharmaguide-channel') || headers.get('x-channel'))?.toLowerCase();

  if (channelHeader === 'voice') {
    console.log(`[CHANNEL] Detected from header: voice`);
    return Channel.VOICE;
  } else if (channelHeader === 'chat') {
    console.log(`[CHANNEL] Detected from header: chat`);
    return Channel.CHAT;
  }

  // Method 2: Request body parameter
  const channelParam = body.channel?.toLowerCase();
  if (channelParam === 'voice') {
    console.log(`[CHANNEL] Detected from body: voice`);
    return Channel.VOICE;
  } else if (channelParam === 'chat') {
    console.log(`[CHANNEL] Detected from body: chat`);
    return Channel.CHAT;
  }

  // Method 3: Parse from last message
  const lastMessage = messages[messages.length - 1];
  if (lastMessage?.role === 'user') {
    const content = lastMessage.content;
    if (/^\/voice\b/i.test(content.trim())) {
      console.log(`[CHANNEL] Detected from /voice command`);
      return Channel.VOICE;
    } else if (/^\/chat\b/i.test(content.trim())) {
      console.log(`[CHANNEL] Detected from /chat command`);
      return Channel.CHAT;
    }
  }

  // Method 4: Session-based persistence
  const sessionId = headers.get('x-session-id') || 'default';
  const persistedChannel = getChannelForSession(sessionId);
  if (persistedChannel) {
    console.log(`[CHANNEL] Detected from session: ${persistedChannel}`);
    return persistedChannel;
  }

  console.log(`[CHANNEL] Defaulting to: chat`);
  return Channel.CHAT;
}

/**
 * Detect locale from multiple sources
 */
function detectLocale(body: any, messages: any[]): Locale {
  // Method 1: Request body parameter
  const localeParam = body.locale?.toLowerCase();
  if (localeParam === 'de') {
    console.log(`[LOCALE] Detected from body: de`);
    return Locale.DE;
  } else if (localeParam === 'en') {
    console.log(`[LOCALE] Detected from body: en`);
    return Locale.EN;
  }

  // Method 2: Parse from last message
  const lastMessage = messages[messages.length - 1];
  if (lastMessage?.role === 'user') {
    const content = lastMessage.content;
    if (/^\/de\b/i.test(content.trim()) || /\bdeutsch\b/i.test(content)) {
      console.log(`[LOCALE] Detected from message: de`);
      return Locale.DE;
    } else if (/^\/en\b/i.test(content.trim())) {
      console.log(`[LOCALE] Detected from message: en`);
      return Locale.EN;
    }
  }

  console.log(`[LOCALE] Defaulting to: en`);
  return Locale.EN;
}

// Route handlers
async function handleModels(): Promise<Response> {
  return json({
    object: 'list',
    data: [
      {
        id: 'pharma-guide',
        object: 'model',
        created: Date.now(),
        owned_by: 'acme-pharmacy',
        description: 'PharmaGuide - AI Pharmacist Assistant powered by Claude',
      },
    ],
  });
}

async function handleChatCompletions(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    const { messages, stream = false } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return json({ error: 'Messages array is required' }, 400);
    }

    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role !== 'user') {
      return json({ error: 'Last message must be from user' }, 400);
    }

    const channel = detectChannel(req.headers, body, messages);
    const locale = detectLocale(body, messages);

    let cleanContent = lastMessage.content
      .replace(/\/voice\b/gi, '')
      .replace(/\/chat\b/gi, '')
      .replace(/\/de\b/gi, '')
      .replace(/\/en\b/gi, '')
      .trim();

    if (!cleanContent) {
      cleanContent = lastMessage.content;
    }

    const sessionId = req.headers.get('x-session-id') || 'default';
    const agent = getOrCreateAgent(sessionId, channel, locale);

    const responseText = await agent.processMessage(cleanContent);

    const completionResponse = {
      id: `chatcmpl-${Date.now()}`,
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model: 'pharma-guide',
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: responseText,
          },
          finish_reason: 'stop',
        },
      ],
      usage: {
        prompt_tokens: cleanContent.length,
        completion_tokens: responseText.length,
        total_tokens: cleanContent.length + responseText.length,
      },
    };

    if (stream) {
      const chunks = responseText.match(/.{1,50}/g) || [responseText];

      const stream = new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder();

          for (const chunk of chunks) {
            const data = {
              id: `chatcmpl-${Date.now()}`,
              object: 'chat.completion.chunk',
              created: Math.floor(Date.now() / 1000),
              model: 'pharma-guide',
              choices: [{ index: 0, delta: { content: chunk }, finish_reason: null }],
            };
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
            await Bun.sleep(20);
          }

          const finalChunk = {
            id: `chatcmpl-${Date.now()}`,
            object: 'chat.completion.chunk',
            created: Math.floor(Date.now() / 1000),
            model: 'pharma-guide',
            choices: [{ index: 0, delta: {}, finish_reason: 'stop' }],
          };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(finalChunk)}\n\n`));
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        },
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
          ...corsHeaders,
        },
      });
    }

    return json(completionResponse);
  } catch (error) {
    console.error('Error processing request:', error);
    return json(
      {
        error: {
          message: error instanceof Error ? error.message : 'Internal server error',
          type: 'server_error',
        },
      },
      500
    );
  }
}

function handleHealth(): Response {
  return json({ status: 'ok', service: 'pharma-guide', agent: 'claude' });
}

function handleRoot(): Response {
  return json({
    name: 'PharmaGuide API',
    version: '2.0.0',
    description: 'AI Pharmacist Assistant powered by Claude',
    endpoints: {
      models: 'GET /v1/models',
      chat: 'POST /v1/chat/completions',
      health: 'GET /health',
    },
    parameters: {
      channel: 'voice | chat (default: chat)',
      locale: 'en | de (default: en)',
    },
    commands: {
      '/voice': 'Switch to voice mode (concise responses)',
      '/de': 'Switch to German',
    },
  });
}

const PORT = process.env.PORT || 3000;

const server = Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    const { pathname } = url;
    const method = req.method;

    // Handle CORS preflight
    if (method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // Route matching
    if (method === 'GET' && pathname === '/') {
      return handleRoot();
    }
    if (method === 'GET' && pathname === '/health') {
      return handleHealth();
    }
    if (method === 'GET' && pathname === '/v1/models') {
      return handleModels();
    }
    if (method === 'POST' && pathname === '/v1/chat/completions') {
      return handleChatCompletions(req);
    }

    return json({ error: 'Not found' }, 404);
  },
});

console.log(`
╔═══════════════════════════════════════════════════════════╗
║           PharmaGuide API Server v2.0                     ║
║           Powered by Claude + Bun                         ║
╠═══════════════════════════════════════════════════════════╣
║  Server running on: http://localhost:${PORT}                 ║
║                                                           ║
║  OpenAI-compatible endpoints:                             ║
║    GET  /v1/models                                        ║
║    POST /v1/chat/completions                              ║
║                                                           ║
║  Request body options:                                    ║
║    channel: "voice" | "chat"                              ║
║    locale: "en" | "de"                                    ║
║                                                           ║
║  Or use commands in message:                              ║
║    /voice - concise responses                             ║
║    /de - German language                                  ║
╚═══════════════════════════════════════════════════════════╝
`);

// Keep server running
