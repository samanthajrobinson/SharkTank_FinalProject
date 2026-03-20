import React, { useEffect, useMemo, useState } from "react";
import { authHeaders, getUser } from "../auth";

export default function Generator() {
  const user = getUser();
  const FAVORITES_KEY = user
    ? `fitmatch_favorite_outfits_${user.id}`
    : "fitmatch_favorite_outfits_guest";

  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadFavoriteIds();
    generateMultipleOutfits();
  }, []);

  function loadFavoriteIds() {
    try {
      const saved = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
      const ids = saved
        .map((outfit) => getOutfitSignature(outfit))
        .filter(Boolean);
      setFavoriteIds(ids);
    } catch (error) {
      console.error("Failed to load favorites:", error);
      setFavoriteIds([]);
    }
  }

  async function generateMultipleOutfits() {
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch(
        '${import.meta.env.VITE_API_BASE_URL}/outfits/generate-multiple',
        {
          method: "GET",
          headers: {
            ...authHeaders(),
          },
        },
      );

      const data = await res.json();

      if (!res.ok) {
        setOutfits([]);
        setErrorMessage(
          data.error ||
            "No outfits could be generated yet. Make sure you have at least one top, one bottom, and one pair of shoes.",
        );
        return;
      }

      setOutfits(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setOutfits([]);
      setErrorMessage("Failed to generate outfits.");
    } finally {
      setLoading(false);
    }
  }

  function getOutfitSignature(outfit) {
    const topId =
      outfit?.top?._id || outfit?.top?.id || outfit?.top?.name || "top";
    const bottomId =
      outfit?.bottom?._id ||
      outfit?.bottom?.id ||
      outfit?.bottom?.name ||
      "bottom";
    const shoesId =
      outfit?.shoes?._id || outfit?.shoes?.id || outfit?.shoes?.name || "shoes";

    return `${topId}-${bottomId}-${shoesId}`;
  }

  function isFavorited(outfit) {
    return favoriteIds.includes(getOutfitSignature(outfit));
  }

  function toggleFavorite(outfit) {
    try {
      const existing = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
      const signature = getOutfitSignature(outfit);

      const alreadySaved = existing.some(
        (savedOutfit) => getOutfitSignature(savedOutfit) === signature,
      );

      let updated;

      if (alreadySaved) {
        updated = existing.filter(
          (savedOutfit) => getOutfitSignature(savedOutfit) !== signature,
        );
      } else {
        updated = [
          ...existing,
          {
            ...outfit,
            favoriteId: signature,
            savedAt: new Date().toISOString(),
          },
        ];
      }

      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      loadFavoriteIds();
    } catch (error) {
      console.error("Failed to update favorites:", error);
    }
  }

  const favoriteCount = useMemo(() => favoriteIds.length, [favoriteIds]);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f7f5f2",
        padding: "32px",
      }}
    >
      <section style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "28px",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "2.6rem",
                margin: 0,
                color: "#1f1f1f",
                letterSpacing: "-0.8px",
              }}
            >
              Outfit Generator
            </h1>
            <p
              style={{
                marginTop: "8px",
                color: "#666",
                fontSize: "1rem",
              }}
            >
              Curated looks from your closet.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                color: "#666",
                fontSize: "0.95rem",
              }}
            >
              {favoriteCount} favorite{favoriteCount === 1 ? "" : "s"}
            </span>

            <button
              onClick={generateMultipleOutfits}
              style={{
                background: "#1f1f1f",
                color: "white",
                border: "none",
                borderRadius: "999px",
                padding: "12px 20px",
                fontSize: "0.95rem",
                cursor: "pointer",
              }}
            >
              Regenerate Looks
            </button>
          </div>
        </div>

        {loading && <p>Generating outfits...</p>}

        {!loading && errorMessage && (
          <div
            style={{
              background: "#fbeaea",
              color: "#9f2d2d",
              borderRadius: "16px",
              padding: "14px 16px",
              marginBottom: "20px",
            }}
          >
            {errorMessage}
          </div>
        )}

        {!loading && !errorMessage && outfits.length > 0 && (
          <div
            style={{
              columnCount: 3,
              columnGap: "22px",
            }}
          >
            {outfits.map((outfit, index) => {
              const favorited = isFavorited(outfit);
              const shoeSide = index % 2 === 0 ? "left" : "right";

              return (
                <article
                  key={getOutfitSignature(outfit) + index}
                  style={{
                    breakInside: "avoid",
                    WebkitColumnBreakInside: "avoid",
                    marginBottom: "22px",
                    background: "#ffffff",
                    borderRadius: "30px",
                    padding: "18px",
                    boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
                    position: "relative",
                  }}
                >
                  <button
                    onClick={() => toggleFavorite(outfit)}
                    aria-label={
                      favorited ? "Remove from favorites" : "Save to favorites"
                    }
                    style={{
                      position: "absolute",
                      top: "16px",
                      right: "16px",
                      width: "44px",
                      height: "44px",
                      borderRadius: "50%",
                      border: "none",
                      background: favorited ? "#d94b63" : "#1f1f1f",
                      color: "#fff",
                      fontSize: "1.1rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 8px 18px rgba(0,0,0,0.12)",
                      zIndex: 3,
                    }}
                  >
                    ♥
                  </button>

                  <div
                    style={{
                      fontSize: "1.8rem",
                      fontWeight: "700",
                      color: "#1f1f1f",
                      marginBottom: "14px",
                      letterSpacing: "-0.6px",
                    }}
                  >
                    Look {index + 1}
                  </div>

                  <div
                    style={{
                      background: "#f3f1ee",
                      borderRadius: "24px",
                      padding: "22px",
                      minHeight: "700px",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {outfit.top && (
                      <div
                        style={{
                          position: "absolute",
                          top: "22px",
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: "82%",
                          height: "260px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          zIndex: 2,
                        }}
                      >
                        <img
                          src={outfit.top.image}
                          alt=""
                          style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contain",
                            display: "block",
                          }}
                        />
                      </div>
                    )}

                    {outfit.bottom && (
                      <div
                        style={{
                          position: "absolute",
                          top: "240px",
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: "68%",
                          height: "300px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          zIndex: 1,
                        }}
                      >
                        <img
                          src={outfit.bottom.image}
                          alt=""
                          style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contain",
                            display: "block",
                          }}
                        />
                      </div>
                    )}

                    {outfit.shoes && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: "34px",
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: "42%",
                          height: "130px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          zIndex: 2,
                        }}
                      >
                        <img
                          src={outfit.shoes.image}
                          alt=""
                          style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contain",
                            display: "block",
                          }}
                        />
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
