import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { FavoritesProvider } from "./context/FavoritesContext.jsx";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <FavoritesProvider>
    <App />
  </FavoritesProvider>,
);