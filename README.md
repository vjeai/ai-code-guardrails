# Semantic Guardrail Demo

> A defence-in-depth pipeline for AI-generated code.
> Obsidian knowledge graph → CLAUDE.md policy → Claude Code generation → Semgrep enforcement → CI gate.

---

## What This Demonstrates

AI-generated code is fast but not inherently secure. This project shows how to enforce a **knowledge-driven security policy** across your entire dev workflow — where the rules live in Obsidian, flow into CLAUDE.md, and are mechanically enforced by Semgrep in CI.

---

## The Pipeline

```
Obsidian Vault (Auth_Standard.md, Security_Rules.md)
        ↓ source of truth
CLAUDE.md (policy injected into every Claude Code session)
        ↓ guides
Claude Code (generates auth-secure.js, not auth-vulnerable.js)
        ↓ checked by
Semgrep (custom rules catch what slips through)
        ↓ gates
GitHub Actions CI (blocks merge on security violations)
```

---

## Demo Flow

### Step 1 — Show the vulnerability
```bash
# Claude generates this WITHOUT CLAUDE.md
cat src/auth-vulnerable.js
```
SQL injection, stack trace exposure, PII leakage — all present.

### Step 2 — Run the guardrail
```bash
npm run scan
# Semgrep flags: js-sql-string-interpolation, js-exposed-stack-trace, js-error-message-exposed
```

### Step 3 — Show the fix (with CLAUDE.md active)
```bash
# Claude generates this WITH CLAUDE.md
cat src/auth-secure.js
```
Parameterised queries, Zod validation, generic errors — all enforced.

### Step 4 — Scan passes
```bash
npm run scan src/auth-secure.js
# No findings.
```

---

## Setup

```bash
git clone git@github.com:vjeai/ai-code-guardrails.git
cd ai-code-guardrails
npm install

# Install Semgrep
pip install semgrep

# Run security scan
npm run scan
```

---

## Obsidian Integration

Import the templates from `obsidian-templates/` into your vault:
- `Auth_Standard.md` — the golden rule for auth code
- These notes feed CLAUDE.md and can be referenced directly in Claude Code prompts

---

## Stack

| Layer | Tool | Purpose |
|---|---|---|
| Knowledge | Obsidian | Security rules as living markdown notes |
| Policy | CLAUDE.md | Injects rules into every Claude Code session |
| Generation | Claude Code | AI code generation under policy constraints |
| Enforcement | Semgrep | SAST — catches violations mechanically |
| CI Gate | GitHub Actions | Blocks merge on security findings |
