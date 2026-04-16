---
tags: [security, auth, guardrail, standard]
updated: 2026-04-16
---

# Auth Standard

> Golden rule for any authentication or database access code.
> This note is the Source of Truth referenced by [[CLAUDE.md]] in the ai-code-guardrails project.

---

## SQL / DB Access

- **Always** use parameterised queries with `?` placeholders
- **Never** concatenate or interpolate user input into SQL strings
- Use prepared statements: `db.prepare('SELECT ... WHERE username = ?').get(username)`

```js
// WRONG — SQL injection risk
db.prepare(`SELECT * FROM users WHERE username = '${username}'`).get()

// CORRECT — parameterised
db.prepare('SELECT id FROM users WHERE username = ?').get(username)
```

---

## Password Handling

- Store only bcrypt hashes — never plaintext or MD5/SHA1
- Compare with `bcrypt.compare()` — never string equality on passwords
- Never log passwords or return them in any response

---

## Auth Responses

- Return generic error messages — never reveal whether a username exists
- Return only non-sensitive fields (userId) — never the full user object
- Never expose stack traces or internal error messages to the client

```js
// WRONG — leaks username existence + internal error
res.status(401).json({ error: `User '${username}' not found` })
res.status(500).json({ error: err.message, stack: err.stack })

// CORRECT — generic, safe
res.status(401).json({ error: 'Invalid credentials' })
res.status(500).json({ error: 'Authentication failed' })
```

---

## Session / Token Rules

- Tokens: httpOnly, secure, sameSite=strict cookies
- JWTs: sign with HS256 minimum, store secret in environment variable
- Never store tokens in localStorage

---

## Input Validation (use Zod)

```js
const LoginSchema = z.object({
  username: z.string().min(1).max(64).trim(),
  password: z.string().min(1).max(128),
})
const parsed = LoginSchema.safeParse(req.body)
if (!parsed.success) return res.status(400).json({ error: 'Invalid request' })
```

---

## Links

- [[Threat_Model]] — what we're defending against
- [[Security_Rules]] — full OWASP-mapped rule set
- [[Demo_Script]] — how to demonstrate this in the LinkedIn demo
