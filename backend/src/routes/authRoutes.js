import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/database.js';
import { sanitizeText } from '../utils/sanitize.js';

const router = Router();

function createToken(user) {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured.');
  }

  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
}

router.post('/register', (req, res) => {
  const username = sanitizeText(req.body.username);
  const email = sanitizeText(req.body.email).toLowerCase();
  const password = sanitizeText(req.body.password);

  if (!username || !email.includes('@') || password.length < 6) {
    return res.status(400).json({ message: 'Provide a valid username, email, and password of at least 6 characters.' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE username = ? OR email = ?').get(username, email);
  if (existing) {
    return res.status(409).json({ message: 'That username or email is already in use.' });
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const result = db
    .prepare('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)')
    .run(username, email, passwordHash);

  const user = { id: result.lastInsertRowid, username, email };
  res.status(201).json({ token: createToken(user), user });
});

router.post('/login', (req, res) => {
  const identifier = sanitizeText(req.body.username).toLowerCase();
  const password = sanitizeText(req.body.password);

  const user = db
    .prepare('SELECT * FROM users WHERE lower(username) = ? OR lower(email) = ?')
    .get(identifier, identifier);

  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ message: 'Invalid username/email or password.' });
  }

  res.json({
    token: createToken(user),
    user: { id: user.id, username: user.username, email: user.email }
  });
});

export default router;
