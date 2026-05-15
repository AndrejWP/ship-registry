import { FormEvent, useEffect, useState } from 'react';
import { api } from '../api/client';
import { ShipForm } from '../components/ShipForm';
import { Ship, ShipPayload } from '../types';
import { storage } from '../utils/storage';

export function ShipsPage() {
  const [ships, setShips] = useState<Ship[]>([]);
  const [search, setSearch] = useState(storage.getShipFilter());
  const [selectedShip, setSelectedShip] = useState<Ship | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [error, setError] = useState('');
  const role = storage.getRole();
  const canEdit = role === 'ADMIN' || role === 'DISPATCHER';
  const canDelete = role === 'ADMIN';

  const loadShips = async (nextSearch = search) => {
    setError('');
    try {
      const data = await api.getShips(nextSearch);
      setShips(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки кораблей');
    }
  };

  useEffect(() => {
    loadShips();
  }, []);

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    storage.setShipFilter(search);
    loadShips(search);
  };

  const createShip = () => {
    setSelectedShip(null);
    setIsFormOpen(true);
  };

  const saveShip = async (payload: ShipPayload) => {
    if (selectedShip) {
      await api.updateShip(selectedShip.id, payload);
    } else {
      await api.createShip(payload);
    }

    setIsFormOpen(false);
    setSelectedShip(null);
    await loadShips();
  };

  const deleteShip = async (ship: Ship) => {
    if (!window.confirm(`Удалить корабль "${ship.name}"?`)) {
      return;
    }

    try {
      await api.deleteShip(ship.id);
      await loadShips();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка удаления');
    }
  };

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h1>Корабли</h1>
          <p>Реестр кораблей с поиском по названию и IMO номеру.</p>
        </div>
        {canEdit && (
          <button className="primary-button" onClick={createShip}>
            Добавить
          </button>
        )}
      </div>

      <form className="toolbar" onSubmit={submitSearch}>
        <input
          placeholder="Поиск по названию или IMO"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <button className="secondary-button">Найти</button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {isFormOpen && (
        <ShipForm
          initialShip={selectedShip}
          onSubmit={saveShip}
          onCancel={() => {
            setIsFormOpen(false);
            setSelectedShip(null);
          }}
        />
      )}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Название</th>
              <th>Тип</th>
              <th>IMO</th>
              <th>Год</th>
              <th>Вместимость</th>
              <th>Статус</th>
              {(canEdit || canDelete) && <th>Действия</th>}
            </tr>
          </thead>
          <tbody>
            {ships.map((ship) => (
              <tr key={ship.id}>
                <td>{ship.id}</td>
                <td>{ship.name}</td>
                <td>{ship.type}</td>
                <td>{ship.imoNumber}</td>
                <td>{ship.buildYear}</td>
                <td>{ship.capacity}</td>
                <td>
                  <span className={`badge ${ship.status.toLowerCase()}`}>{ship.status}</span>
                </td>
                {(canEdit || canDelete) && (
                  <td>
                    <div className="row-actions">
                      {canEdit && (
                        <button
                          className="secondary-button"
                          onClick={() => {
                            setSelectedShip(ship);
                            setIsFormOpen(true);
                          }}
                        >
                          Изменить
                        </button>
                      )}
                      {canDelete && (
                        <button className="danger-button" onClick={() => deleteShip(ship)}>
                          Удалить
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
