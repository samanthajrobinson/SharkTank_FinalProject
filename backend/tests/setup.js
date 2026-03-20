import mongoose from "mongoose";
import dotenv from "dotenv";
import { before, after } from "node:test";

dotenv.config();

before(async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not set for tests");
  }

  if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = "test-secret";
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Test DB connected");
});

after(async () => {
  await mongoose.connection.close();
  console.log("Test DB disconnected");
});