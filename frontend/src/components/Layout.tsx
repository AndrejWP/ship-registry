import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { ThemeName, storage } from '../utils/storage';

interface LayoutProps {
  theme: ThemeName;
  onThemeChange: (theme: ThemeName) => void;
}

export function Layout({ theme, onThemeChange }: LayoutProps) {
  const navigate = useNavigate();
  const role = storage.getRole();
  const name = storage.getUserName();

  const logout = () => {
    storage.clearAuth();
    navigate('/login', { replace: true });
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">SR</div>
          <div>
            <strong>ShipRegistry</strong>
            <span>{role}</span>
          </div>
        </div>

        <nav className="nav">
          <NavLink to="/ships">Корабли</NavLink>
          <NavLink to="/voyages">Рейсы</NavLink>
          <NavLink to="/ports">Справочники</NavLink>
          <NavLink to="/settings">Профиль</NavLink>
        </nav>

        <div className="sidebar-footer">
          <span>{name}</span>
          <select value={theme} onChange={(event) => onThemeChange(event.target.value as ThemeName)}>
            <option value="light">Светлая</option>
            <option value="dark">Темная</option>
          </select>
          <button className="secondary-button" onClick={logout}>
            Выйти
          </button>
        </div>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

