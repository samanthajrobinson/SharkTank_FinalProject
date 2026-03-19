
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.js";
import clothesRoutes from "./routes/clothes.js";
import outfitRoutes from "./routes/outfits.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PATCH", "DELETE"],
  credentials: true
}));app.use(express.json());

mongoose.connect(process.env.MONGO_URI).then(()=>console.log("DB connected"));

app.use("/api/auth", authRoutes);
app.use("/api/clothes", clothesRoutes);
app.use("/api/outfits", outfitRoutes);

app.listen(process.env.PORT, () => console.log("Server running"));
