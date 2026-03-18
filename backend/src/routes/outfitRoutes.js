import { Router } from 'express';
import db from '../config/database.js';
import { requireAuth } from '../middleware/auth.js';
import { buildGeneratedOutfit } from '../utils/generator.js';
import { sanitizeArray, sanitizeText } from '../utils/sanitize.js';

const router = Router();

function rowToOutfit(row) {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    occasion: row.occasion,
    weather: row.weather,
    vibe: row.vibe,
    colorPreference: row.color_preference,
    description: row.description,
    items: JSON.parse(row.items),
    accessories: JSON.parse(row.accessories || '[]'),
    imageUrl: row.image_url,
    favorite: Boolean(row.favorite),
    createdAt: row.created_at
  };
}

router.post('/generate', (req, res) => {
  const outfit = buildGeneratedOutfit(req.body);
  res.json(outfit);
});

router.get('/', requireAuth, (req, res) => {
  const rows = db.prepare('SELECT * FROM outfits WHERE user_id = ? ORDER BY datetime(created_at) DESC, id DESC').all(req.user.id);
  res.json(rows.map(rowToOutfit));
});

router.post('/', requireAuth, (req, res) => {
  const name = sanitizeText(req.body.name);
  const occasion = sanitizeText(req.body.occasion);
  const weather = sanitizeText(req.body.weather);
  const vibe = sanitizeText(req.body.vibe);
  const colorPreference = sanitizeText(req.body.colorPreference);
  const description = sanitizeText(req.body.description);
  const imageUrl = sanitizeText(req.body.imageUrl);
  const items = sanitizeArray(req.body.items);
  const accessories = sanitizeArray(req.body.accessories);
  const favorite = req.body.favorite ? 1 : 0;

  if (!name || !occasion || !weather || !vibe || items.length < 2) {
    return res.status(400).json({ message: 'Outfit must include a name, metadata, and at least two items.' });
  }

  const result = db.prepare(`
    INSERT INTO outfits (user_id, name, occasion, weather, vibe, color_preference, description, items, accessories, image_url, favorite)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    req.user.id,
    name,
    occasion,
    weather,
    vibe,
    colorPreference,
    description,
    JSON.stringify(items),
    JSON.stringify(accessories),
    imageUrl,
    favorite
  );

  const row = db.prepare('SELECT * FROM outfits WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(rowToOutfit(row));
});

router.put('/:id', requireAuth, (req, res) => {
  const row = db.prepare('SELECT * FROM outfits WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!row) {
    return res.status(404).json({ message: 'Outfit not found.' });
  }

  const nextFavorite = req.body.favorite ? 1 : 0;
  db.prepare('UPDATE outfits SET favorite = ? WHERE id = ? AND user_id = ?').run(nextFavorite, req.params.id, req.user.id);
  const updated = db.prepare('SELECT * FROM outfits WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  res.json(rowToOutfit(updated));
});

router.delete('/:id', requireAuth, (req, res) => {
  const result = db.prepare('DELETE FROM outfits WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
  if (!result.changes) {
    return res.status(404).json({ message: 'Outfit not found.' });
  }
  res.json({ message: 'Outfit deleted.' });
});

export default router;
