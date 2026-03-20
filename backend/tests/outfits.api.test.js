import "./setup.js";
import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";

const { default: app } = await import("../src/app.js");

let token = "";
const email = `apitestuser_${Date.now()}@example.com`;

test("registers a user and returns a token", async () => {
  const response = await request(app).post("/api/auth/register").send({
    username: "apitestuser",
    email,
    password: "password123",
  });

  assert.equal(response.status, 200);
  assert.ok(response.body.token);
  token = response.body.token;
});

test("returns 400 from generate-multiple when required clothing categories are missing", async () => {
  const response = await request(app)
    .get("/api/outfits/generate-multiple")
    .set("Authorization", `Bearer ${token}`);

  assert.equal(response.status, 400);
  assert.ok(response.body.error);
});