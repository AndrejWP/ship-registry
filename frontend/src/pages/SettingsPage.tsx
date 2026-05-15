import { ThemeName, storage } from '../utils/storage';

interface SettingsPageProps {
  theme: ThemeName;
  onThemeChange: (theme: ThemeName) => void;
}

export function SettingsPage({ theme, onThemeChange }: SettingsPageProps) {
  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h1>Профиль и настройки</h1>
          <p>Текущий пользователь и параметры интерфейса из LocalStorage.</p>
        </div>
      </div>

      <div className="details-grid">
        <div className="detail-row">
          <span>Имя</span>
          <strong>{storage.getUserName()}</strong>
        </div>
        <div className="detail-row">
          <span>Email</span>
          <strong>{storage.getUserEmail()}</strong>
        </div>
        <div className="detail-row">
          <span>Роль</span>
          <strong>{storage.getRole()}</strong>
        </div>
        <div className="detail-row">
          <span>Тема</span>
          <select value={theme} onChange={(event) => onThemeChange(event.target.value as ThemeName)}>
            <option value="light">Светлая</option>
            <option value="dark">Темная</option>
          </select>
        </div>
        <div className="detail-row">
          <span>Последний фильтр кораблей</span>
          <strong>{storage.getShipFilter() || 'не задан'}</strong>
        </div>
      </div>
    </section>
  );
}

