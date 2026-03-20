import "./setup.js";
import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";

const { default: app } = await import("../src/app.js");

let token = "";
const email = `favoriteuser_${Date.now()}@example.com`;

test("registers another user for favorite route testing", async () => {
  const response = await request(app).post("/api/auth/register").send({
    username: "favoriteuser",
    email,
    password: "password123",
  });

  assert.equal(response.status, 200);
  assert.ok(response.body.token);
  token = response.body.token;
});

test("returns 400 when favorite route is missing top, bottom, or shoes", async () => {
  const response = await request(app)
    .post("/api/outfits/favorite")
    .set("Authorization", `Bearer ${token}`)
    .send({
      name: "Broken Favorite",
      top: { name: "Top Only" },
    });

  assert.equal(response.status, 400);
  assert.ok(response.body.error);
});