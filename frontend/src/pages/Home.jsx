import React, { useEffect, useState } from "react";

import { getUser } from "../auth";

const user = getUser();
const FAVORITES_KEY = user
  ? `fitmatch_favorite_outfits_${user.id}`
  : "fitmatch_favorite_outfits_guest";
  

export default function Home() {
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
            marginBottom: "28px",
          }}
        >
          <h1
            style={{
              fontSize: "3rem",
              margin: 0,
              color: "#1f1f1f",
            }}
          >
            FitMatch
          </h1>

          <p
            style={{
              marginTop: "14px",
              marginBottom: 0,
              color: "#666",
              fontSize: "1.1rem",
              maxWidth: "700px",
              lineHeight: 1.6,
            }}
          >
            Welcome to your digital closet. Browse your wardrobe, generate outfit
            ideas, and save your favorite looks in one place.
          </p>
        </div>

        <div
          style={{
            background: "#ffffff",
            borderRadius: "28px",
            padding: "28px",
            boxShadow: "0 14px 34px rgba(0,0,0,0.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "2rem",
                  color: "#1f1f1f",
                }}
              >
                Favorite Outfits
              </h2>

              <p
                style={{
                  marginTop: "8px",
                  marginBottom: 0,
                  color: "#777",
                  fontSize: "1rem",
                }}
              >
                Your saved looks appear here.
              </p>
            </div>

            <span
              style={{
                color: "#777",
                fontSize: "0.95rem",
              }}
            >
              {favoriteOutfits.length} saved look
              {favoriteOutfits.length === 1 ? "" : "s"}
            </span>
          </div>

          {favoriteOutfits.length === 0 ? (
            <div
              style={{
                background: "#f3f1ef",
                borderRadius: "20px",
                padding: "28px",
                textAlign: "center",
                color: "#777",
              }}
            >
              No favorite outfits yet. Go to the Generator page and save some looks.
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
                <FavoriteOutfitCard
                  key={outfit.favoriteId || outfit.id || index}
                  outfit={outfit}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function FavoriteOutfitCard({ outfit, index }) {
  return (
    <article
      style={{
        background: "#f8f6f3",
        borderRadius: "24px",
        padding: "20px",
      }}
    >
      <h3
        style={{
          margin: "0 0 16px 0",
          fontSize: "1.6rem",
          color: "#1f1f1f",
        }}
      >
        Saved Look {index + 1}
      </h3>

      <div
        style={{
          display: "grid",
          gap: "16px",
        }}
      >
        <OutfitPiece label="Top" item={outfit.top} type="top" />
        <OutfitPiece label="Bottom" item={outfit.bottom} type="bottom" />
        <OutfitPiece label="Shoes" item={outfit.shoes} type="shoes" />
      </div>
    </article>
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