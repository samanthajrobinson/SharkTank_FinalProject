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

      const res = await fetch(`${API_BASE}/api/clothes`, {
        headers: authHeaders(),
      });

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
      setForm((prev) => ({ ...prev, image: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  async function handleUpload(e) {
    e.preventDefault();
    if (isUploading) return;

    try {
      setIsUploading(true);
      setErrorMessage("");

      const data = new FormData();
      data.append("name", form.name);
      data.append("type", form.type);

      if (!form.image) {
        setErrorMessage("Image is required");
        setIsUploading(false);
        return;
      }

      data.append("image", form.image);

      const res = await fetch(`${API_BASE}/api/clothes`, {
        method: "POST",
        headers: authHeaders(),
        body: data,
      });

      const result = await res.json();

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
      name: item.name || "",
      type: item.type || "top",
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

      const res = await fetch(`${API_BASE}/api/clothes/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify(editForm),
      });

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
    <main className="site-page">
      <section className="site-container">
        <section style={{ marginBottom: "28px" }}>
          <h1
            style={{
              fontSize: "3.5rem",
              margin: 0,
              color: "#1f1f1f",
              letterSpacing: "-1px",
            }}
          >
            Your Closet
          </h1>
          <p
            style={{
              marginTop: "10px",
              marginBottom: 0,
              color: "#666",
              fontSize: "1.1rem",
            }}
          >
            Add pieces to your closet and browse by category.
          </p>
        </section>

        {errorMessage ? <div className="status-error">{errorMessage}</div> : null}

        <div className="closet-layout">
          <aside className="closet-sidebar">
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

            <div className="filter-stack">
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
                className="form-grid"
              >
                <input
                  className="field"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Item name"
                />

                <select
                  className="field"
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                >
                  <option value="top">Top</option>
                  <option value="bottom">Bottom</option>
                  <option value="shoes">Shoes</option>
                </select>

                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    color: "#555",
                    fontSize: "0.95rem",
                  }}
                >
                  <input type="checkbox" />
                  Wardrobe essential
                </label>

                <input
                  type="file"
                  name="image"
                  onChange={handleChange}
                  required
                />

                <button
                  type="submit"
                  disabled={isUploading}
                  className="primary-pill"
                  style={{
                    opacity: isUploading ? 0.7 : 1,
                    cursor: isUploading ? "not-allowed" : "pointer",
                  }}
                >
                  {isUploading ? "Uploading..." : "Upload Item"}
                </button>
              </form>
            </div>
          </aside>

          <section className="closet-panel">
            <div className="section-header">
              <div>
                <h2
                  className="section-title"
                  style={{
                    fontSize: "2rem",
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
              </div>

              <span className="section-subtext">
                {filteredClothes.length} item
                {filteredClothes.length === 1 ? "" : "s"}
              </span>
            </div>

            {filteredClothes.length === 0 ? (
              <div className="empty-state">No items in this category yet.</div>
            ) : (
              <div className="closet-grid">
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
          </section>
        </div>

        <footer className="footer">
          <span style={{ color: "#1f57b8", fontWeight: "700" }}>FitMatch</span>
          {" • "}CS 341{" • "}Samantha Robinson
        </footer>
      </section>
    </main>
  );
}

function FilterButton({ label, active, onClick }) {
  return (
    <button
      type="button"
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
  return (
    <article className="closet-card">
      <button
        type="button"
        onClick={onStartEdit}
        aria-label={`Edit ${item.name || "item"}`}
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
          borderRadius: "18px",
        }}
      >
        <img
          src={item.image}
          alt={item.name || "Clothing item"}
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
            className="field"
            placeholder="Item name"
          />

          <select
            value={editForm.type}
            onChange={(e) =>
              setEditForm((prev) => ({ ...prev, type: e.target.value }))
            }
            className="field"
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
              type="button"
              onClick={onSaveEdit}
              className="primary-pill"
              style={{
                flex: 1,
                padding: "10px 14px",
              }}
            >
              Save
            </button>

            <button
              type="button"
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
            {item.name || "Unnamed item"}
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