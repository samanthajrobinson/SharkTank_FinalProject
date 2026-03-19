import express from "express";
import multer from "multer";
import sharp from "sharp";
import fs from "fs/promises";
import path from "path";
import { execFile } from "child_process";
import { promisify } from "util";
const REMBG_PATH = "/Users/samantha/Library/Python/3.9/bin/rembg";

import Clothing from "../models/Clothing.js";
import { protect } from "../middleware/authMiddleware.js";

const execFileAsync = promisify(execFile);
const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
});

router.post("/", protect, upload.single("image"), async (req, res) => {
  let inputPath = "";
  let outputPath = "";

  try {
    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    if (!req.body.type) {
      return res.status(400).json({ error: "Type is required" });
    }

    const tmpDir = path.resolve("tmp");
    await fs.mkdir(tmpDir, { recursive: true });

    const stamp = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    inputPath = path.join(tmpDir, `in-${stamp}.png`);
    outputPath = path.join(tmpDir, `out-${stamp}.png`);

    const normalized = await sharp(req.file.buffer)
      .rotate()
      .ensureAlpha()
      .png()
      .toBuffer();

    await fs.writeFile(inputPath, normalized);

    let processedBuffer = normalized;

    try {
      await execFileAsync("python3", [
        path.resolve("scripts/remove_bg.py"),
        inputPath,
        outputPath,
      ]);
      processedBuffer = await fs.readFile(outputPath);
      console.log("Background removal succeeded with rembg");
    } catch (err) {
      console.error("rembg failed, using original normalized image:");
      console.error(err);
    }

    const sizeMap = {
      top: 650,
      bottom: 600,
      shoes: 500,
    };

    const targetSize = sizeMap[req.body.type] || 600;

    const resized = await sharp(normalized)
      .trim()
      .ensureAlpha()
      .resize({
        width: 520,
        height: 520,
        fit: "inside",
        withoutEnlargement: true,
      })
      .png()
      .toBuffer();

    const square = await sharp({
      create: {
        width: 700,
        height: 700,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite([{ input: resized, gravity: "center" }])
      .webp({ quality: 72 })
      .toBuffer();

    const base64 = square.toString("base64");

    const item = await Clothing.create({
      userId: req.user.id,
      name: req.body.name || "",
      type: req.body.type,
      image: `data:image/webp;base64,${base64}`,
    });

    res.json(item);
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    res.status(500).json({
      error: "Failed to upload clothing item",
      details: error.message,
    });
  } finally {
    if (inputPath) await fs.unlink(inputPath).catch(() => { });
    if (outputPath) await fs.unlink(outputPath).catch(() => { });
  }
});

router.get("/", protect, async (req, res) => {
  try {
    const items = await Clothing.find({ userId: req.user.id });
    res.json(items);
  } catch (error) {
    console.error("LOAD CLOTHES ERROR:", error);
    res.status(500).json({ error: "Failed to load clothing items" });
  }
});

router.patch("/:id", protect, async (req, res) => {
  try {
    const updated = await Clothing.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json(updated);
  } catch (error) {
    console.error("PATCH ERROR:", error);
    res.status(500).json({ error: "Failed to update item" });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const deleted = await Clothing.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json({ message: "Deleted" });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    res.status(500).json({ error: "Failed to delete item" });
  }
});

export default router;