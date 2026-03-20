export function getOutfitSignature(outfit) {
  const topId = outfit?.top?._id || outfit?.top?.id || outfit?.top?.name || "top";
  const bottomId =
    outfit?.bottom?._id || outfit?.bottom?.id || outfit?.bottom?.name || "bottom";
  const shoesId =
    outfit?.shoes?._id || outfit?.shoes?.id || outfit?.shoes?.name || "shoes";

  return `${topId}-${bottomId}-${shoesId}`;
}

export function hasRequiredPieces(clothes) {
  const tops = clothes.filter((item) => item.type === "top");
  const bottoms = clothes.filter((item) => item.type === "bottom");
  const shoes = clothes.filter((item) => item.type === "shoes");

  return tops.length > 0 && bottoms.length > 0 && shoes.length > 0;
}

export function filterFavoritesOnly(outfits) {
  return outfits.filter((outfit) => outfit.favorite);
}

export function dedupeBySignature(outfits) {
  const seen = new Set();

  return outfits.filter((outfit) => {
    const signature = getOutfitSignature(outfit);
    if (seen.has(signature)) return false;
    seen.add(signature);
    return true;
  });
}

export function buildFavoritePayload(outfit) {
  return {
    name: outfit.name || "",
    top: outfit.top,
    bottom: outfit.bottom,
    shoes: outfit.shoes,
  };
}