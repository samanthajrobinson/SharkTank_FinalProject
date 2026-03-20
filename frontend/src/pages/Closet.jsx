import React, { useEffect, useMemo, useState } from "react";
import { authHeaders } from "../auth";
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

export default function Closet() {
  const [clothes, setClothes] = useState([]);
  const [form, setForm] = useState({
    name: "",
    type: "top",
    image: null,
  });
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    type: "top",
  });
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadClothes();
  }, []);

  async function loadClothes() {
    try {
      setErrorMessage("");

      const res = await fetch(
        `${API_BASE}/api/clothes`,
        { headers: authHeaders() },
      );

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Failed to load closet.");
        setClothes([]);
        return;
      }

      setClothes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to load closet.");
      setClothes([]);
    }
  }

  function handleChange(e) {
    const { name, value, files } = e.target;

    if (name === "image") {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  }

  async function handleUpload(e) {
    e.preventDefault();

    if (isUploading) return;

    try {
      setIsUploading(true);
      setErrorMessage("");
      console.log("submit clicked");

      const data = new FormData();
      data.append("name", form.name);
      data.append("type", form.type);

      if (!form.image) {
        setErrorMessage("Image is required");
        setIsUploading(false);
        return;
      }

      data.append("image", form.image);

      const res = await fetch(
        `${API_BASE}/api/clothes`,
        {
          method: "POST",
          headers: authHeaders(),
          body: data,
        },
      );

      console.log("response arrived", res.status);

      const result = await res.json();
      console.log("UPLOAD STATUS:", res.status);
      console.log("UPLOAD RESPONSE:", result);

      if (!res.ok) {
        setErrorMessage(result.error || "Failed to upload item.");
        return;
      }

      setClothes((prev) => [...prev, result]);

      setForm({
        name: "",
        type: "top",
        image: null,
      });

      const fileInput = document.querySelector('input[name="image"]');
      if (fileInput) fileInput.value = "";
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      setErrorMessage("Failed to upload item.");
    } finally {
      setIsUploading(false);
    }
  }

  function startEdit(item) {
    setEditingId(item._id);
    setEditForm({
      name: item.name,
      type: item.type,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm({
      name: "",
      type: "top",
    });
  }

  async function saveEdit(id) {
    try {
      setErrorMessage("");

      const res = await fetch(
        `${API_BASE}/api/clothes/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...authHeaders(),
          },
          body: JSON.stringify(editForm),
        },
      );

      const updatedItem = await res.json();

      if (!res.ok) {
        setErrorMessage(updatedItem.error || "Failed to update item.");
        return;
      }

      setClothes((prev) =>
        prev.map((item) => (item._id === id ? updatedItem : item)),
      );

      cancelEdit();
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to update item.");
    }
  }

  const filteredClothes = useMemo(() => {
    if (!Array.isArray(clothes)) return [];
    if (selectedFilter === "all") return clothes;
    return clothes.filter((item) => item.type === selectedFilter);
  }, [clothes, selectedFilter]);

  const counts = useMemo(() => {
    if (!Array.isArray(clothes)) {
      return { all: 0, top: 0, bottom: 0, shoes: 0 };
    }

    return {
      all: clothes.length,
      top: clothes.filter((item) => item.type === "top").length,
      bottom: clothes.filter((item) => item.type === "bottom").length,
      shoes: clothes.filter((item) => item.type === "shoes").length,
    };
  }, [clothes]);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f7f5f2",
        padding: "32px",
      }}
    >
      <section style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ marginBottom: "28px" }}>
          <h1
            style={{
              fontSize: "2.4rem",
              margin: 0,
              color: "#1f1f1f",
            }}
          >
            Your Closet
          </h1>
          <p
            style={{
              marginTop: "8px",
              color: "#666",
              fontSize: "1rem",
            }}
          >
            Add pieces to your closet and browse by category.
          </p>
        </div>

        {errorMessage && (
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

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "250px 1fr",
            gap: "28px",
            alignItems: "start",
          }}
        >
          <aside
            style={{
              background: "#ffffff",
              borderRadius: "24px",
              padding: "20px",
              boxShadow: "0 10px 28px rgba(0,0,0,0.07)",
              position: "sticky",
              top: "24px",
            }}
          >
            <h2
              style={{
                marginTop: 0,
                marginBottom: "16px",
                fontSize: "1.2rem",
                color: "#1f1f1f",
              }}
            >
              View Closet
            </h2>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                marginBottom: "24px",
              }}
            >
              <FilterButton
                label={`All Items (${counts.all})`}
                active={selectedFilter === "all"}
                onClick={() => setSelectedFilter("all")}
              />
              <FilterButton
                label={`Tops (${counts.top})`}
                active={selectedFilter === "top"}
                onClick={() => setSelectedFilter("top")}
              />
              <FilterButton
                label={`Bottoms (${counts.bottom})`}
                active={selectedFilter === "bottom"}
                onClick={() => setSelectedFilter("bottom")}
              />
              <FilterButton
                label={`Shoes (${counts.shoes})`}
                active={selectedFilter === "shoes"}
                onClick={() => setSelectedFilter("shoes")}
              />
            </div>

            <div
              style={{
                borderTop: "1px solid #ece7e2",
                paddingTop: "20px",
              }}
            >
              <h3
                style={{
                  marginTop: 0,
                  marginBottom: "14px",
                  fontSize: "1rem",
                  color: "#333",
                }}
              >
                Add New Item
              </h3>

              <form
                onSubmit={handleUpload}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="top">Top</option>
                  <option value="bottom">Bottom</option>
                  <option value="shoes">Shoes</option>
                </select>

                <input
                  type="file"
                  name="image"
                  onChange={handleChange}
                  required
                  style={fileStyle}
                />

                <button
                  type="submit"
                  disabled={isUploading}
                  style={{
                    ...primaryButtonStyle,
                    opacity: isUploading ? 0.7 : 1,
                    cursor: isUploading ? "not-allowed" : "pointer",
                  }}
                >
                  {isUploading ? "Uploading..." : "Upload Item"}
                </button>
              </form>
            </div>
          </aside>

          <section>
            <div
              style={{
                background: "#ffffff",
                borderRadius: "24px",
                padding: "20px",
                boxShadow: "0 10px 28px rgba(0,0,0,0.07)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    fontSize: "1.4rem",
                    color: "#1f1f1f",
                  }}
                >
                  {selectedFilter === "all"
                    ? "All Clothing"
                    : selectedFilter === "top"
                      ? "Tops"
                      : selectedFilter === "bottom"
                        ? "Bottoms"
                        : "Shoes"}
                </h2>

                <span
                  style={{
                    color: "#777",
                    fontSize: "0.95rem",
                  }}
                >
                  {filteredClothes.length} item
                  {filteredClothes.length === 1 ? "" : "s"}
                </span>
              </div>

              {filteredClothes.length === 0 ? (
                <div
                  style={{
                    background: "#f8f5f2",
                    borderRadius: "18px",
                    padding: "28px",
                    textAlign: "center",
                    color: "#777",
                  }}
                >
                  No items in this category yet.
                </div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                    gap: "20px",
                  }}
                >
                  {filteredClothes.map((item) => (
                    <ClosetCard
                      key={item._id}
                      item={item}
                      isEditing={editingId === item._id}
                      editForm={editForm}
                      setEditForm={setEditForm}
                      onStartEdit={() => startEdit(item)}
                      onCancelEdit={cancelEdit}
                      onSaveEdit={() => saveEdit(item._id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function FilterButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        textAlign: "left",
        border: "none",
        borderRadius: "16px",
        padding: "14px 16px",
        background: active ? "#1f1f1f" : "#f3efea",
        color: active ? "#ffffff" : "#2d2d2d",
        fontSize: "0.95rem",
        fontWeight: "600",
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

function ClosetCard({
  item,
  isEditing,
  editForm,
  setEditForm,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
}) {
  const imageStyleByType = {
    top: { maxWidth: "80%", maxHeight: "170px" },
    bottom: { maxWidth: "58%", maxHeight: "175px" },
    shoes: { maxWidth: "78%", maxHeight: "105px" },
  };

  const imageStyle = imageStyleByType[item.type] || {
    maxWidth: "75%",
    maxHeight: "160px",
  };

  return (
    <article
      style={{
        background: "#f3f1ef",
        borderRadius: "22px",
        padding: "16px",
        position: "relative",
      }}
    >
      <button
        onClick={onStartEdit}
        aria-label={`Edit ${item.name}`}
        style={{
          position: "absolute",
          top: "12px",
          left: "12px",
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          border: "none",
          background: "#1f1f1f",
          color: "#fff",
          fontSize: "1rem",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 6px 14px rgba(0,0,0,0.16)",
          zIndex: 2,
        }}
      >
        ✎
      </button>

      <div
        style={{
          background: "#fbfbfb",
          minHeight: "220px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={item.image}
          alt={item.name}
          style={{
            width: "95%",
            height: "95%",
            objectFit: "contain",
          }}
        />
      </div>

      {isEditing ? (
        <div
          style={{
            marginTop: "14px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <input
            value={editForm.name}
            onChange={(e) =>
              setEditForm((prev) => ({ ...prev, name: e.target.value }))
            }
            style={inputStyle}
            placeholder="Item name"
          />

          <select
            value={editForm.type}
            onChange={(e) =>
              setEditForm((prev) => ({ ...prev, type: e.target.value }))
            }
            style={inputStyle}
          >
            <option value="top">Top</option>
            <option value="bottom">Bottom</option>
            <option value="shoes">Shoes</option>
          </select>

          <div
            style={{
              display: "flex",
              gap: "8px",
            }}
          >
            <button
              onClick={onSaveEdit}
              style={{
                flex: 1,
                border: "none",
                borderRadius: "999px",
                padding: "10px 14px",
                background: "#1f1f1f",
                color: "#fff",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Save
            </button>

            <button
              onClick={onCancelEdit}
              style={{
                flex: 1,
                border: "none",
                borderRadius: "999px",
                padding: "10px 14px",
                background: "#ddd6ce",
                color: "#222",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <p
            style={{
              margin: "14px 0 4px 0",
              fontSize: "1rem",
              color: "#222",
              textAlign: "center",
            }}
          >
            {item.name}
          </p>

          <p
            style={{
              margin: 0,
              textAlign: "center",
              color: "#777",
              fontSize: "0.9rem",
              textTransform: "capitalize",
            }}
          >
            {item.type}
          </p>
        </>
      )}
    </article>
  );
}

const inputStyle = {
  width: "100%",
  border: "1px solid #ddd6ce",
  borderRadius: "14px",
  padding: "12px 14px",
  fontSize: "0.95rem",
  background: "#fff",
  boxSizing: "border-box",
};

const fileStyle = {
  width: "100%",
  fontSize: "0.92rem",
};

const primaryButtonStyle = {
  border: "none",
  borderRadius: "999px",
  padding: "12px 18px",
  background: "#1f1f1f",
  color: "#fff",
  fontSize: "0.95rem",
  fontWeight: "600",
  cursor: "pointer",
};
