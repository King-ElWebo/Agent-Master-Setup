# 🤖 Multi-Agent Orchestration Matrix

This project utilizes a strict separation of AI roles. Every agent operates with a specific model engine and must draw context from its designated configuration sheets inside `.ai-instructions.md`, `.ai-agents/`, `CONTEXT.md`, or `DESIGN.md`.

## 1. Agent Profiles & Engine Coupling

* **Planner Agent**
    * *Engine:* `gemini-3.1-pro-preview` (Open Design Core)
    * *Scope:* Breaks down raw customer requirements into file steps, architecture impacts, and acceptance criteria.
    * *Rule Base:* `.ai-instructions.md`, `.ai-agents/app-architecture.md`, `CONTEXT.md`

* **Implementation Agent**
    * *Engine:* `gemini-3.1-pro-preview` (Open Design Core)
    * *Scope:* Writes pure presentation UI layouts (`(public)`) or highly structured database modules (`(admin)`).
    * *Rule Base:* `.ai-instructions.md`, `.ai-agents/backend-rules.md`, `.ai-agents/app-architecture.md`, `.ai-agents/design-to-code.md`

* **UX / Refactor Agent**
    * *Engine:* `chatgpt-pro` (Codex Engine)
    * *Scope:* Code cleanup, micro-interactions, hardware-acceleration audits, and alignment with Emil Kowalski metrics.
    * *Rule Base:* `DESIGN.md` (incorporating scroll animations in `.ai-agents/design-to-code.md`) and `.ai-agents/ui-ux-pro-max-skill/`

* **Security & Migration Agent**
    * *Engine:* `gemini-3-pro-preview` (Antigravity Engine)
    * *Scope:* Enforces Edge Middleware boundaries, Zod payload schema parsing, and type-safe database migrations.
    * *Rule Base:* `.ai-instructions.md` (Section 7, 8, 9), `.ai-agents/backend-rules.md`, `.ai-agents/app-architecture.md` (Section 4)
