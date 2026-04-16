# Semantic Guardrail — Security Policy

> Source of truth lives in Obsidian vault: `Projects/ai-code-guardrails/`
> Key notes: [[Auth_Standard]] · [[Threat_Model]] · [[Security_Rules]]

---

## Stack

- Runtime: Node.js (ES Modules)
- Framework: Express 4
- DB: better-sqlite3 — prepared statements with `?` placeholders only
- Auth: bcrypt for hashing, jsonwebtoken for tokens
- Validation: zod at every route entry point

---

## Code Generation Rules

- Always use parameterised queries. Never concatenate user input into SQL strings.
- Never hardcode secrets, API keys, or passwords. Reference environment variables only.
- Validate and sanitise all inputs at function entry — type check, length check, format check.
- Return generic error messages to clients. Never expose stack traces, field names, or internal paths.
- Default to least privilege — request only the permissions the code actually needs.

## Auth & Sessions

- Never implement custom crypto or auth logic. Use bcrypt and jsonwebtoken only.
- Session tokens must use httpOnly, secure, sameSite=strict cookies.
- Always check authorisation, not just authentication, on every protected route.
- Never return user PII in auth responses — return only userId or a non-sensitive token.

## Input Validation

- Validate at the boundary — every req.body, req.query, req.params field.
- Use typeof checks before string operations. Never assume types from untrusted input.
- Reject inputs that exceed expected length limits.

## Error Handling

- Catch all DB errors. Never let raw error messages reach the client.
- Log full errors server-side only. Send generic messages client-side.
- Never log passwords, tokens, or PII.

## Dependencies

- Flag every new package you suggest with: **VERIFY BEFORE INSTALL**
- Prefer packages with >1M weekly downloads and active maintenance.
- Never suggest packages you are not highly confident exist.

## Code Review Flags

- Add `// SECURITY-REVIEW:` on any line you are uncertain about.
- If a function handles auth, DB queries, file I/O, or external APIs — explicitly state security assumptions made.

## Before Generating Any Code — Always Answer

1. Is this endpoint public or authenticated?
2. What is the sensitivity of data being handled?
3. What does a malicious input look like here?
4. Which OWASP Top 10 risk is most relevant to this function?
