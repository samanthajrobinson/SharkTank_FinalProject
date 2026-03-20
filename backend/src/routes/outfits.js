import express from "express";
import Clothing from "../models/Clothing.js";
import Outfit from "../models/Outfit.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

router.post("/generate", protect, async (req, res) => {
  try {
    const clothes = await Clothing.find({ userId: req.user.id });

    const tops = clothes.filter((item) => item.type === "top");
    const bottoms = clothes.filter((item) => item.type === "bottom");
    const shoes = clothes.filter((item) => item.type === "shoes");

    if (!tops.length || !bottoms.length || !shoes.length) {
      return res.status(400).json({
        error: "You need at least one top, one bottom, and one pair of shoes.",
      });
    }

    const outfit = {
      top: tops[Math.floor(Math.random() * tops.length)],
      bottom: bottoms[Math.floor(Math.random() * bottoms.length)],
      shoes: shoes[Math.floor(Math.random() * shoes.length)],
    };

    return res.json(outfit);
  } catch (error) {
    console.error("GENERATE OUTFIT ERROR:", error);
    return res.status(500).json({ error: "Failed to generate outfit" });
  }
});

router.post("/favorite", protect, async (req, res) => {
  try {
    const { top, bottom, shoes, name } = req.body;

    if (!top || !bottom || !shoes) {
      return res.status(400).json({
        error: "Top, bottom, and shoes are required",
      });
    }

    const topId = top._id || top.id || top.name || "top";
    const bottomId = bottom._id || bottom.id || bottom.name || "bottom";
    const shoesId = shoes._id || shoes.id || shoes.name || "shoes";

    const signature = `${req.user.id}-${topId}-${bottomId}-${shoesId}`;

    const outfit = await Outfit.findOneAndUpdate(
      { userId: req.user.id, signature },
      {
        userId: req.user.id,
        top,
        bottom,
        shoes,
        name: name || "",
        favorite: true,
        signature,
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    return res.json(outfit);
  } catch (error) {
    console.error("SAVE FAVORITE OUTFIT ERROR:", error);
    return res.status(500).json({ error: "Failed to save favorite outfit" });
  }
});

router.post("/unfavorite", protect, async (req, res) => {
  try {
    const { top, bottom, shoes } = req.body;

    if (!top || !bottom || !shoes) {
      return res.status(400).json({
        error: "Top, bottom, and shoes are required",
      });
    }

    const topId = top._id || top.id || top.name || "top";
    const bottomId = bottom._id || bottom.id || bottom.name || "bottom";
    const shoesId = shoes._id || shoes.id || shoes.name || "shoes";

    const signature = `${req.user.id}-${topId}-${bottomId}-${shoesId}`;

    await Outfit.findOneAndDelete({
      userId: req.user.id,
      signature,
    });

    return res.json({ message: "Outfit removed from favorites" });
  } catch (error) {
    console.error("UNFAVORITE OUTFIT ERROR:", error);
    return res.status(500).json({ error: "Failed to unfavorite outfit" });
  }
});

router.get("/mine", protect, async (req, res) => {
  try {
    const outfits = await Outfit.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    return res.json(outfits);
  } catch (error) {
    console.error("GET MY OUTFITS ERROR:", error);
    return res.status(500).json({ error: "Failed to load your outfits" });
  }
});

router.get("/generate-multiple", protect, async (req, res) => {
  try {
    const clothes = await Clothing.find({ userId: req.user.id });

    const tops = shuffle(clothes.filter((item) => item.type === "top"));
    const bottoms = shuffle(clothes.filter((item) => item.type === "bottom"));
    const shoes = shuffle(clothes.filter((item) => item.type === "shoes"));

    if (!tops.length || !bottoms.length || !shoes.length) {
      return res.status(400).json({
        error: "You need at least one top, one bottom, and one pair of shoes.",
      });
    }

    const count = Math.min(
      4,
      Math.max(tops.length, bottoms.length, shoes.length)
    );

    const outfits = [];

    for (let i = 0; i < count; i += 1) {
      outfits.push({
        top: tops[i % tops.length],
        bottom: bottoms[i % bottoms.length],
        shoes: shoes[i % shoes.length],
      });
    }

    return res.json(outfits);
  } catch (error) {
    console.error("GENERATE MULTIPLE OUTFITS ERROR:", error);
    return res.status(500).json({ error: "Failed to generate outfits" });
  }
});

router.get("/favorites/all", async (req, res) => {
  try {
    const outfits = await Outfit.find({ favorite: true })
      .populate("userId", "username email")
      .sort({ createdAt: -1 });

    return res.json(outfits);
  } catch (error) {
    console.error("GET ALL FAVORITES ERROR:", error);
    return res.status(500).json({ error: "Failed to load favorite outfits" });
  }
});

export default router;