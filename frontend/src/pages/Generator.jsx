import React, { useEffect, useState } from "react";

import { getUser } from "../auth";

const user = getUser();
const FAVORITES_KEY = user
  ? `fitmatch_favorite_outfits_${user.id}`
  : "fitmatch_favorite_outfits_guest";

export default function Profile() {
  const [favoriteOutfits, setFavoriteOutfits] = useState([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  function loadFavorites() {
    try {
      const saved = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
      setFavoriteOutfits(saved);
    } catch (error) {
      console.error("Failed to load favorite outfits:", error);
      setFavoriteOutfits([]);
    }
  }

  function getOutfitSignature(outfit) {
    const topId = outfit?.top?._id || outfit?.top?.id || outfit?.top?.name || "top";
    const bottomId =
      outfit?.bottom?._id || outfit?.bottom?.id || outfit?.bottom?.name || "bottom";
    const shoesId =
      outfit?.shoes?._id || outfit?.shoes?.id || outfit?.shoes?.name || "shoes";

    return `${topId}-${bottomId}-${shoesId}`;
  }

  function removeFavorite(outfitToRemove) {
    try {
      const saved = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");

      const updated = saved.filter(
        (outfit) =>
          getOutfitSignature(outfit) !== getOutfitSignature(outfitToRemove),
      );

      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      setFavoriteOutfits(updated);
    } catch (error) {
      console.error("Failed to remove favorite outfit:", error);
    }
  }

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
            background: "#ffffff",
            borderRadius: "28px",
            padding: "36px",
            boxShadow: "0 14px 34px rgba(0,0,0,0.08)",
          }}
        >
          <h1
            style={{
              fontSize: "3rem",
              margin: 0,
              color: "#1f1f1f",
            }}
          >
            Profile
          </h1>

          <p
            style={{
              marginTop: "12px",
              color: "#666",
              fontSize: "1.1rem",
            }}
          >
            Your saved favorite outfits.
          </p>

          <div style={{ marginTop: "28px" }}>
            {favoriteOutfits.length === 0 ? (
              <div
                style={{
                  background: "#f3f1ef",
                  borderRadius: "20px",
                  padding: "28px",
                  color: "#777",
                }}
              >
                No favorite outfits saved yet.
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                  gap: "24px",
                }}
              >
                {favoriteOutfits.map((outfit, index) => (
                  <article
                    key={outfit.favoriteId || outfit.id || index}
                    style={{
                      background: "#f8f6f3",
                      borderRadius: "24px",
                      padding: "20px",
                      position: "relative",
                    }}
                  >
                    <button
                      onClick={() => removeFavorite(outfit)}
                      style={{
                        position: "absolute",
                        top: "18px",
                        right: "18px",
                        width: "42px",
                        height: "42px",
                        borderRadius: "50%",
                        border: "none",
                        background: "#d94b63",
                        color: "#fff",
                        fontSize: "1rem",
                        cursor: "pointer",
                        boxShadow: "0 8px 18px rgba(0,0,0,0.14)",
                      }}
                    >
                      ♥
                    </button>

                    <h2
                      style={{
                        margin: "0 0 16px 0",
                        fontSize: "1.6rem",
                        color: "#1f1f1f",
                        paddingRight: "56px",
                      }}
                    >
                      Saved Look {index + 1}
                    </h2>

                    <div
                      style={{
                        display: "grid",
                        gap: "16px",
                      }}
                    >
                      <OutfitPiece label="Top" item={outfit.top} type="top" />
                      <OutfitPiece
                        label="Bottom"
                        item={outfit.bottom}
                        type="bottom"
                      />
                      <OutfitPiece label="Shoes" item={outfit.shoes} type="shoes" />
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function OutfitPiece({ label, item, type }) {
  const imageStyleByType = {
    top: { maxWidth: "82%", maxHeight: "180px" },
    bottom: { maxWidth: "58%", maxHeight: "185px" },
    shoes: { maxWidth: "78%", maxHeight: "105px" },
  };

  const imageStyle = imageStyleByType[type] || {
    maxWidth: "75%",
    maxHeight: "160px",
  };

  return (
    <section
      style={{
        background: "#ece8e3",
        borderRadius: "20px",
        padding: "14px",
      }}
    >
      <p
        style={{
          margin: "0 0 10px 0",
          textAlign: "center",
          fontWeight: "700",
          fontSize: "1.05rem",
          color: "#444",
        }}
      >
        {label}
      </p>

      <div
        style={{
          background: "#fbfbfb",
          borderRadius: "16px",
          minHeight: "220px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "18px",
        }}
      >
        {item?.image ? (
          <img
            src={item.image}
            alt={item?.name || label}
            style={{
              ...imageStyle,
              width: "100%",
              height: "auto",
              objectFit: "contain",
              display: "block",
            }}
          />
        ) : (
          <div style={{ color: "#999" }}>Missing item</div>
        )}
      </div>

      <p
        style={{
          margin: "12px 0 0 0",
          textAlign: "center",
          color: "#222",
          fontSize: "0.98rem",
        }}
      >
        {item?.name || "Unnamed item"}
      </p>
    </section>
  );
}