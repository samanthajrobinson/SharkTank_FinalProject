import React, { createContext, useContext, useEffect, useState } from "react";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("fitmatch_favorites");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("fitmatch_favorites", JSON.stringify(favorites));
  }, [favorites]);

  function addFavorite(outfit) {
    const favoriteOutfit = {
      ...outfit,
      favoriteId: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    };

    setFavorites((prev) => [...prev, favoriteOutfit]);
  }

  function removeFavorite(favoriteId) {
    setFavorites((prev) => prev.filter((item) => item.favoriteId !== favoriteId));
  }

  function isFavorited(outfit) {
    return favorites.some(
      (fav) =>
        fav.top?._id === outfit.top?._id &&
        fav.bottom?._id === outfit.bottom?._id &&
        fav.shoes?._id === outfit.shoes?._id,
    );
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorited,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}