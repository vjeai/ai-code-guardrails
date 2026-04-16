import express from 'express';
import Database from 'better-sqlite3';
import bcrypt from 'bcrypt';
import { z } from 'zod';

const router = express.Router();
const db = new Database('users.db');

const LoginSchema = z.object({
  username: z.string().min(1).max(64).trim(),
  password: z.string().min(1).max(128),
});

router.post('/login', async (req, res) => {
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  const { username, password } = parsed.data;

  try {
    const user = db.prepare('SELECT id, password_hash FROM users WHERE username = ?').get(username);

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({ success: true, userId: user.id });
  } catch {
    res.status(500).json({ error: 'Authentication failed' });
  }
});

export default router;
