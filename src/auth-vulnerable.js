// DEMO FILE — intentionally vulnerable. Used to demonstrate guardrail interception.
// DO NOT deploy. Compare with auth-secure.js to see what the guardrail enforces.

import express from 'express';
import Database from 'better-sqlite3';

const router = express.Router();
const db = new Database('users.db');

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // VULNERABILITY: SQL injection via string concatenation
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

  try {
    const user = db.prepare(query).get();
    if (user) {
      // VULNERABILITY: exposes full user object including password hash
      res.json({ success: true, user: user });
    } else {
      // VULNERABILITY: leaks whether username exists
      res.status(401).json({ error: `Invalid credentials. User '${username}' not found.` });
    }
  } catch (err) {
    // VULNERABILITY: exposes internal error and stack trace
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

export default router;
