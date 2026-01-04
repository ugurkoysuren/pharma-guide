# Repository Guidelines

## Project Structure & Module Organization
TypeScript sources live in `src/`. `src/server.ts` exposes the OpenAI-compatible API using Bun's native HTTP server, `src/agent/` holds LLM orchestration, `src/tools/` owns callable functions, and helpers/mocks live in `src/utils/`, `src/types/`, and `src/mocks/`. `tests/` mirrors the tool layout (for example, `tests/tools/check-store-inventory.test.ts`) so every callable has matching coverage. `assets/` houses flows/transcripts, `docs/` captures reference guides, and `dist/` stores build outputs—never edit generated files.

## Build, Test, and Development Commands
All workflows use Bun:

```
bun install
bun run dev
bun run src/server.ts
bun build src/server.ts --outdir dist --target node && bun run dist/server.js
bun test | bun test --watch | bun test --coverage
bunx prettier --check "**/*.{md,json,ts}" && bunx markdownlint "**/*.md"
docker compose up --build
```

## Coding Style & Naming Conventions
Formatting is enforced by Prettier (two-space indentation, single quotes, trailing semicolons). Use `PascalCase` for types/classes, `camelCase` for variables/functions, and snake_case tool identifiers to match the OpenAI tool schema. Keep business logic pure and place `process.env` access behind helper modules so the guardrails stay testable. Before committing, run `bunx prettier --write` and `bun run lint:md`.

## Testing Guidelines
`bun test` powers automated coverage with Jest compatibility. Name specs `<feature>.test.ts` and colocate them in the parallel `tests/` tree to mirror their production counterpart; reuse shared fixtures in `src/mocks/`. Every new tool needs unit tests that cover success, validation failures, and safety clauses. CI expects coverage stability through `bun test --coverage`, so backfill tests when modifying `src/agent` or channel guardrails. Showcase journeys from `assets/flows` live in `tests/e2e/agent-flows.test.ts`—run them on demand with `bun run test:e2e` (sets `RUN_E2E=1`).

## Commit & Pull Request Guidelines
History follows Conventional Commits (e.g., `feat: add locale detection guardrail`, `fix: handle missing store id`). Keep subjects under 72 characters, write imperative summaries, and add detail paragraphs describing risk or rollout notes. Pull requests should reference the ticket, describe behavior changes, attach API samples or screenshots when responses change, and list the commands you ran (`bun test`, `bun build`, etc.). Flag any `.env` additions or Docker port changes in both the PR body and `docs/`.

## Security & Configuration Tips
Store `OPENROUTER_API_KEY`, `PORT`, and store IDs in `.env`; never hard-code secrets or upload transcripts containing PHI. Keep logs free of sensitive data by redacting session IDs before emitting console statements. When introducing new tools, register them explicitly in `src/agent/llm-agent.ts` and describe required configuration in `docs/openwebui-setup.md` so deployments remain reproducible.
