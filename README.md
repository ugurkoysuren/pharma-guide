# PharmaGuide - AI Pharmacist Assistant

---

## **For a detailed walkthrough, visit my blog post:**

# **[https://ugurkoysuren.com/wonderful-job-application](https://ugurkoysuren.com/wonderful-job-application)**

---

An AI-powered pharmacist assistant for ACME Retail Pharmacy. Supports chat and voice channels, provides factual medication information, checks inventory, and verifies prescription requirements.

![Home](assets/flows/home.png)

## Quick Start

```bash
bun install
bun run build
bun start
```

Server runs at `http://localhost:3000`

## Features

- **Multi-channel support** - Chat (markdown) and Voice (concise)
- **Bilingual** - English and German
- **Three core tools** - Medication info, inventory check, prescription verification
- **Safety guardrails** - Medical advice blocking, emergency detection

---

## Flow Showcases

### Flow 1: Medication Information

User asks about medication details, dosage instructions, and prescription requirements.

**English - Chat Mode:**
![Flow 1 English](assets/flows/flow1-medication-info/flow1-en.png)

**English - Voice Mode:**
![Flow 1 English Voice](assets/flows/flow1-medication-info/flow1-en-voice.png)

**German - Chat Mode:**
![Flow 1 German](assets/flows/flow1-medication-info/flow1-de.png)

**Console - Tool Calls:**
![Flow 1 Console](assets/flows/flow1-medication-info/console-tool-call.png)

---

### Flow 2: Stock Availability

Multi-step flow: agent asks for missing store info, checks inventory, verifies prescription.

**English - Chat Mode:**
![Flow 2 English](assets/flows/flow2-stock-availability/flow2-en.png)

**English - Voice Mode:**
![Flow 2 English Voice](assets/flows/flow2-stock-availability/flow2-en-voice.png)

**German - Chat Mode:**
![Flow 2 German](assets/flows/flow2-stock-availability/flow2-de.png)

---

### Flow 3: Allergy & Safety

Safety disclaimers for allergy-related queries, medical advice refusal, redirect to professionals.

**English - Chat Mode:**
![Flow 3 English](assets/flows/flow3-allergy-safety/flow3-en.png)

**Medical Advice Refusal:**
![Flow 3 English 02](assets/flows/flow3-allergy-safety/flow3-en-02.png)

**English - Voice Mode:**
![Flow 3 English Voice](assets/flows/flow3-allergy-safety/flow3-en-voice.png)

---

### Flow 4: Crisis & Emergency Guardrails

Emergency detection (overdose, crisis) triggers immediate escalation - no LLM involved.

**English - Emergency Response:**
![Flow 4 English](assets/flows/flow4-crisis-guardrails/flow4-en.png)

**German - Emergency Response:**
![Flow 4 German](assets/flows/flow4-crisis-guardrails/flow4-de.png)

**Console - Guardrail Output:**
![Flow 4 Console](assets/flows/flow4-crisis-guardrails/console-output.png)

---

## Architecture

```
src/
├── server.ts              # Express server (OpenAI-compatible)
├── agent/
│   ├── llm-agent.ts       # Claude LLM with tool calling
│   └── guardrails.ts      # Medical advice/emergency filters
├── tools/                 # get_medication, check_inventory, verify_prescription
├── mocks/                 # Medications, inventory, prescriptions data
└── types/                 # TypeScript definitions
```

## Commands

| Command | Description |
|---------|-------------|
| `bun run dev` | Development mode |
| `bun run build` | Compile TypeScript |
| `bun start` | Production mode |
| `bun test` | Run 26 tests |

## Policy Constraints

- Never provide medical advice or diagnosis
- Always cite data source (tool name)
- Redirect to healthcare professionals
- Direct to emergency services (911/112) for crises

---

**Read the full story:** [https://ugurkoysuren.com/wonderful-job-application](https://ugurkoysuren.com/wonderful-job-application)
