import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import HomePage from './pages/HomePage.jsx';
import GeneratorPage from './pages/GeneratorPage.jsx';
import SavedPage from './pages/SavedPage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import Footer from './components/Footer.jsx';
import { useOutfit } from './context/OutfitContext.jsx';

function ProtectedRoute({ children }) {
  const { token } = useOutfit();
  return token ? children : <Navigate to="/auth" replace />;
}

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/generator" element={<GeneratorPage />} />
        <Route
          path="/saved"
          element={
            <ProtectedRoute>
              <SavedPage />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </div>
  );
}
