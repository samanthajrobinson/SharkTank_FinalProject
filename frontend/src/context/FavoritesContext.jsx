import React, { createContext, useContext, useEffect, useState } from "react";

const FavoritesContext = createContext(null);

function sameOutfit(a, b) {
  return (
    a?.top?._id === b?.top?._id &&
    a?.bottom?._id === b?.bottom?._id &&
    a?.shoes?._id === b?.shoes?._id
  );
}

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("fitmatch_favorites");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("fitmatch_favorites", JSON.stringify(favorites));
  }, [favorites]);

  function addFavorite(outfit) {
    setFavorites((prev) => {
      if (prev.some((fav) => sameOutfit(fav, outfit))) return prev;

      return [
        ...prev,
        {
          ...outfit,
          favoriteId: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        },
      ];
    });
  }

  function removeFavoriteByOutfit(outfit) {
    setFavorites((prev) => prev.filter((fav) => !sameOutfit(fav, outfit)));
  }

  function removeFavorite(favoriteId) {
    setFavorites((prev) => prev.filter((item) => item.favoriteId !== favoriteId));
  }

  function isFavorited(outfit) {
    return favorites.some((fav) => sameOutfit(fav, outfit));
  }

  function setAllFavorites(nextFavorites) {
    setFavorites(Array.isArray(nextFavorites) ? nextFavorites : []);
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        removeFavoriteByOutfit,
        isFavorited,
        setAllFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error("useFavorites must be used inside FavoritesProvider");
  }

  return context;
}