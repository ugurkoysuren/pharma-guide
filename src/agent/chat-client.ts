import OpenAI from 'openai';
import 'dotenv/config';

type ChatCompletionParams = Parameters<OpenAI['chat']['completions']['create']>[0];
type ChatCompletionResponse = Awaited<ReturnType<OpenAI['chat']['completions']['create']>>;

export interface ChatCompletionsClient {
  chat: {
    completions: {
      create: (params: ChatCompletionParams) => Promise<ChatCompletionResponse>;
    };
  };
}

const defaultClient = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

let chatClient: ChatCompletionsClient = defaultClient;

export function getChatCompletionsClient(): ChatCompletionsClient {
  return chatClient;
}

export function setChatCompletionsClient(client: ChatCompletionsClient): void {
  chatClient = client;
}

export function resetChatCompletionsClient(): void {
  chatClient = defaultClient;
}
