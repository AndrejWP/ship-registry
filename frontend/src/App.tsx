import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { PortsPage } from './pages/PortsPage';
import { SettingsPage } from './pages/SettingsPage';
import { ShipsPage } from './pages/ShipsPage';
import { VoyagesPage } from './pages/VoyagesPage';
import { storage, ThemeName } from './utils/storage';

export default function App() {
  const [theme, setTheme] = useState<ThemeName>(storage.getTheme());

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    storage.setTheme(theme);
  }, [theme]);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout theme={theme} onThemeChange={setTheme} />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/ships" replace />} />
        <Route path="ships" element={<ShipsPage />} />
        <Route path="voyages" element={<VoyagesPage />} />
        <Route path="ports" element={<PortsPage />} />
        <Route path="settings" element={<SettingsPage theme={theme} onThemeChange={setTheme} />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

