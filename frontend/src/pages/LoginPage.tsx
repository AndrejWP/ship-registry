import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { storage } from '../utils/storage';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@ship.local');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await api.login(email, password);
      storage.setToken(result.accessToken);
      storage.setRole(result.role);
      storage.setUserName(result.name);
      storage.setUserEmail(result.email);
      navigate('/ships', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка входа');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-panel" onSubmit={submit}>
        <div className="brand compact">
          <div className="brand-mark">SR</div>
          <div>
            <strong>ShipRegistry</strong>
            <span>учет кораблей и рейсов</span>
          </div>
        </div>

        <label>
          Email
          <input value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label>
          Пароль
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>

        {error && <div className="error-message">{error}</div>}

        <button className="primary-button" disabled={isLoading}>
          {isLoading ? 'Вход...' : 'Войти'}
        </button>

        <div className="hint">
          admin@ship.local / admin123
          <br />
          dispatcher@ship.local / dispatcher123
          <br />
          viewer@ship.local / viewer123
        </div>
      </form>
    </div>
  );
}

