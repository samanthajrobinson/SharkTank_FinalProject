import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import clothesRoutes from "./routes/clothes.js";
import outfitRoutes from "./routes/outfits.js";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://shark-tank-final-project.vercel.app",
    ],
    credentials: true,
  }),
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/clothes", clothesRoutes);
app.use("/api/outfits", outfitRoutes);

export default app;