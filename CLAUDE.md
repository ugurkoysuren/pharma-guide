# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

PharmaGuide is an AI pharmacist assistant for ACME Retail Pharmacy built with Bun and TypeScript. It provides an OpenAI-compatible API that supports chat and voice channels, delivers factual medication information, checks inventory, and verifies prescription requirements. It never offers medical advice.

## Tech Stack

- **Runtime**: Bun
- **Language**: TypeScript
- **LLM**: Claude (via OpenRouter)
- **Server**: Bun.serve() (native HTTP)
- **Testing**: Bun test (Jest-compatible)

## Project Structure

```
src/
├── server.ts                 # Bun.serve() HTTP server (OpenAI-compatible)
├── agent/
│   ├── llm-agent.ts          # ClaudeAgent - LLM with tool calling
│   ├── guardrails.ts         # Input/output safety filters
│   ├── prompt-config.ts      # System prompts and tool definitions
│   └── chat-client.ts        # OpenRouter API client
├── tools/
│   ├── get-medication-by-name.ts
│   ├── check-store-inventory.ts
│   └── verify-prescription-requirement.ts
├── mocks/
│   ├── medications.ts        # 10 medications with German translations
│   ├── inventory.ts          # 4 stores (NYC + TLV)
│   └── prescriptions.ts      # Prescription requirements
└── types/
    ├── tools.ts              # Tool input/output types
    └── channels.ts           # Channel and locale enums
```

## Commands

```bash
bun install              # Install dependencies
bun run dev              # Development mode
bun run server           # Run server directly
bun test                 # Run tests
bun test --watch         # Watch mode
bun test --coverage      # Coverage report
bun run fmt              # Format with Prettier
bun run lint:md          # Lint markdown files
```

## API Endpoints

**Base URL**: `http://localhost:3000`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API info |
| GET | `/health` | Health check |
| GET | `/v1/models` | List models |
| POST | `/v1/chat/completions` | Chat (OpenAI-compatible) |

## Channels & Locales

**Channels**:
- `chat` - Markdown formatting, detailed responses
- `voice` - Plain text, max 3 sentences, "mg" becomes "milligrams"

**Locales**:
- `en` - English (default)
- `de` - German

**Detection priority**: Header > Body > Message command > Session > Default

Use `/voice` or `/chat` commands in messages, or set `X-PharmaGuide-Channel` header.

## Three Core Tools

| Tool | Purpose |
|------|---------|
| `get_medication_by_name` | Medication metadata (strength, ingredients, dosage) |
| `check_store_inventory` | Stock availability by store and dosage |
| `verify_prescription_requirement` | Prescription necessity check |

## Guardrails

Located in `src/agent/guardrails.ts`:
- Blocks medical advice requests ("should I take...", "is it safe for me...")
- Detects emergencies (overdose, chest pain, can't breathe) - redirects to 911/112
- Adds safety disclaimers for allergy-related queries
- Multi-language support (English + German)

## Policy Constraints

- Never provide medical advice or diagnosis
- Always cite data source (tool name)
- Redirect to healthcare professionals for advice
- Direct to emergency services for crises
- No product upselling

## Environment Variables

```bash
OPENROUTER_API_KEY=sk-or-...  # Required: OpenRouter API key
PORT=3000                      # Server port (default: 3000)
```

## Deployment

Deployed via Docker on the server:

```bash
docker build -t pharma-guide:latest .
docker run -d --name pharma-guide -p 3001:3000 \
  -e OPENROUTER_API_KEY=... \
  pharma-guide:latest
```

Integrated with OpenWebUI at `chat.ugurkoysuren.com`.
