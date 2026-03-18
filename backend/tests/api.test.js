import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import fs from 'node:fs';

if (fs.existsSync('fitmatch.db')) {
  fs.unlinkSync('fitmatch.db');
}
process.env.JWT_SECRET = 'test-secret';
process.env.CLIENT_URL = 'http://localhost:5173';

const { default: app } = await import('../src/app.js');

let token = '';
let outfitId = '';

test('registers a user and returns a token', async () => {
  const response = await request(app).post('/api/auth/register').send({
    username: 'sammy',
    email: 'sammy@example.com',
    password: 'password123'
  });

  assert.equal(response.status, 201);
  assert.ok(response.body.token);
  token = response.body.token;
});

test('creates an outfit and lists it for the authenticated user', async () => {
  const createResponse = await request(app)
    .post('/api/outfits')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'Campus Classic',
      occasion: 'class',
      weather: 'cold',
      vibe: 'classic',
      colorPreference: 'neutral',
      description: 'A reliable school day look.',
      items: ['Jeans', 'Cardigan'],
      accessories: ['watch'],
      imageUrl: 'https://example.com/look.jpg',
      favorite: 0
    });

  assert.equal(createResponse.status, 201);
  outfitId = createResponse.body.id;

  const listResponse = await request(app)
    .get('/api/outfits')
    .set('Authorization', `Bearer ${token}`);

  assert.equal(listResponse.status, 200);
  assert.equal(listResponse.body.length, 1);
  assert.equal(listResponse.body[0].name, 'Campus Classic');
});

test('updates and deletes an outfit', async () => {
  const updateResponse = await request(app)
    .put(`/api/outfits/${outfitId}`)
    .set('Authorization', `Bearer ${token}`)
    .send({ favorite: 1 });

  assert.equal(updateResponse.status, 200);
  assert.equal(updateResponse.body.favorite, true);

  const deleteResponse = await request(app)
    .delete(`/api/outfits/${outfitId}`)
    .set('Authorization', `Bearer ${token}`);

  assert.equal(deleteResponse.status, 200);
  assert.equal(deleteResponse.body.message, 'Outfit deleted.');
});
