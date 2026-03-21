import React, { useEffect, useState } from "react";
import { authHeaders } from "../auth";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

export default function Profile() {
  const [favoriteOutfits, setFavoriteOutfits] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadFavorites();
  }, []);

  async function loadFavorites() {
    try {
      setMessage("");

      const res = await fetch(`${API_BASE}/api/outfits/mine`, {
        headers: {
          ...authHeaders(),
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Failed to load favorite outfits.");
        setFavoriteOutfits([]);
        return;
      }

      const favoritesOnly = (Array.isArray(data) ? data : []).filter(
        (outfit) => outfit.favorite,
      );

      setFavoriteOutfits(favoritesOnly);
    } catch (error) {
      console.error("Failed to load favorite outfits:", error);
      setMessage("Failed to load favorite outfits.");
      setFavoriteOutfits([]);
    }
  }

  async function removeFavorite(outfitToRemove) {
    try {
      const res = await fetch(`${API_BASE}/api/outfits/unfavorite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify({
          top: outfitToRemove.top,
          bottom: outfitToRemove.bottom,
          shoes: outfitToRemove.shoes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Failed to remove favorite outfit.");
        return;
      }

      setFavoriteOutfits((prev) =>
        prev.filter((outfit) => outfit._id !== outfitToRemove._id),
      );
    } catch (error) {
      console.error("Failed to remove favorite outfit:", error);
      setMessage("Failed to remove favorite outfit.");
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

          {message ? (
            <div
              style={{
                background: "#fbeaea",
                color: "#9f2d2d",
                borderRadius: "16px",
                padding: "14px 16px",
                marginTop: "20px",
              }}
            >
              {message}
            </div>
          ) : null}

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
                    key={outfit._id || index}
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
                      {outfit.name || `Saved Look ${index + 1}`}
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
                      <OutfitPiece
                        label="Shoes"
                        item={outfit.shoes}
                        type="shoes"
                      />
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

function OutfitPiece({ label, item }) {
  return (
    <div
      style={{
        width: "220px",
        background: "#f5f3ef",
        borderRadius: "18px",
        padding: "14px",
        textAlign: "center",
      }}
    >
      <p
        style={{
          marginBottom: "8px",
          fontWeight: "600",
          color: "#555",
        }}
      >
        {label}
      </p>

      <div
        style={{
          height: "160px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {item?.image ? (
          <img
            src={item.image}
            alt={item?.name}
            style={{
              maxHeight: "100%",
              maxWidth: "100%",
              objectFit: "contain",
            }}
          />
        ) : (
          <span style={{ color: "#aaa" }}>Missing</span>
        )}
      </div>
    </div>
  );
}