import { describe, expect, test } from "vitest";
import {
  getOutfitSignature,
  hasRequiredPieces,
  filterFavoritesOnly,
  dedupeBySignature,
  buildFavoritePayload,
} from "../utils/outfitTestUtils.js";

describe("outfitTestUtils", () => {
  test("getOutfitSignature builds a stable signature from outfit pieces", () => {
    const outfit = {
      top: { _id: "top1", name: "White Tee" },
      bottom: { _id: "bottom1", name: "Jeans" },
      shoes: { _id: "shoes1", name: "Sneakers" },
    };

    expect(getOutfitSignature(outfit)).toBe("top1-bottom1-shoes1");
  });

  test("hasRequiredPieces returns true when top, bottom, and shoes exist", () => {
    const clothes = [
      { type: "top", name: "Top" },
      { type: "bottom", name: "Bottom" },
      { type: "shoes", name: "Shoes" },
    ];

    expect(hasRequiredPieces(clothes)).toBe(true);
  });

  test("hasRequiredPieces returns false when one required category is missing", () => {
    const clothes = [
      { type: "top", name: "Top" },
      { type: "bottom", name: "Bottom" },
    ];

    expect(hasRequiredPieces(clothes)).toBe(false);
  });

  test("filterFavoritesOnly returns only favorite outfits", () => {
    const outfits = [
      { name: "Look 1", favorite: true },
      { name: "Look 2", favorite: false },
      { name: "Look 3", favorite: true },
    ];

    expect(filterFavoritesOnly(outfits)).toHaveLength(2);
    expect(filterFavoritesOnly(outfits).map((o) => o.name)).toEqual([
      "Look 1",
      "Look 3",
    ]);
  });

  test("dedupeBySignature removes duplicate outfits with the same pieces", () => {
    const outfits = [
      {
        top: { _id: "t1" },
        bottom: { _id: "b1" },
        shoes: { _id: "s1" },
      },
      {
        top: { _id: "t1" },
        bottom: { _id: "b1" },
        shoes: { _id: "s1" },
      },
      {
        top: { _id: "t2" },
        bottom: { _id: "b2" },
        shoes: { _id: "s2" },
      },
    ];

    expect(dedupeBySignature(outfits)).toHaveLength(2);
  });

  test("buildFavoritePayload keeps only the fields needed by the API", () => {
    const outfit = {
      name: "Saved Look",
      top: { _id: "t1", name: "Top" },
      bottom: { _id: "b1", name: "Bottom" },
      shoes: { _id: "s1", name: "Shoes" },
      extra: "ignore me",
    };

    expect(buildFavoritePayload(outfit)).toEqual({
      name: "Saved Look",
      top: { _id: "t1", name: "Top" },
      bottom: { _id: "b1", name: "Bottom" },
      shoes: { _id: "s1", name: "Shoes" },
    });
  });
});