import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { VoyageForm } from '../components/VoyageForm';
import { Captain, Port, Ship, Voyage, VoyagePayload } from '../types';
import { storage } from '../utils/storage';

export function VoyagesPage() {
  const [voyages, setVoyages] = useState<Voyage[]>([]);
  const [ships, setShips] = useState<Ship[]>([]);
  const [captains, setCaptains] = useState<Captain[]>([]);
  const [ports, setPorts] = useState<Port[]>([]);
  const [selectedVoyage, setSelectedVoyage] = useState<Voyage | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [error, setError] = useState('');
  const role = storage.getRole();
  const canEdit = role === 'ADMIN' || role === 'DISPATCHER';
  const canDelete = role === 'ADMIN';

  const loadPage = async () => {
    setError('');
    try {
      const [voyagesData, shipsData, captainsData, portsData] = await Promise.all([
        api.getVoyages(),
        api.getShips(),
        api.getCaptains(),
        api.getPorts(),
      ]);
      setVoyages(voyagesData);
      setShips(shipsData);
      setCaptains(captainsData);
      setPorts(portsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки рейсов');
    }
  };

  useEffect(() => {
    loadPage();
  }, []);

  const saveVoyage = async (payload: VoyagePayload) => {
    if (selectedVoyage) {
      await api.updateVoyage(selectedVoyage.id, payload);
    } else {
      await api.createVoyage(payload);
    }

    setIsFormOpen(false);
    setSelectedVoyage(null);
    await loadPage();
  };

  const deleteVoyage = async (voyage: Voyage) => {
    if (!window.confirm(`Удалить рейс #${voyage.id}?`)) {
      return;
    }

    try {
      await api.deleteVoyage(voyage.id);
      await loadPage();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка удаления');
    }
  };

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h1>Рейсы</h1>
          <p>Планирование и контроль рейсов кораблей.</p>
        </div>
        {canEdit && (
          <button
            className="primary-button"
            onClick={() => {
              setSelectedVoyage(null);
              setIsFormOpen(true);
            }}
          >
            Добавить
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {isFormOpen && (
        <VoyageForm
          initialVoyage={selectedVoyage}
          ships={ships}
          captains={captains}
          ports={ports}
          onSubmit={saveVoyage}
          onCancel={() => {
            setIsFormOpen(false);
            setSelectedVoyage(null);
          }}
        />
      )}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Корабль</th>
              <th>Капитан</th>
              <th>Откуда</th>
              <th>Куда</th>
              <th>Отправление</th>
              <th>Прибытие</th>
              <th>Статус</th>
              {(canEdit || canDelete) && <th>Действия</th>}
            </tr>
          </thead>
          <tbody>
            {voyages.map((voyage) => (
              <tr key={voyage.id}>
                <td>{voyage.id}</td>
                <td>{voyage.ship?.name ?? voyage.shipId}</td>
                <td>{voyage.captain?.fullName ?? voyage.captainId}</td>
                <td>{voyage.departurePort?.name ?? voyage.departurePortId}</td>
                <td>{voyage.arrivalPort?.name ?? voyage.arrivalPortId}</td>
                <td>{voyage.departureDate}</td>
                <td>{voyage.arrivalDate}</td>
                <td>
                  <span className={`badge ${voyage.status.toLowerCase()}`}>{voyage.status}</span>
                </td>
                {(canEdit || canDelete) && (
                  <td>
                    <div className="row-actions">
                      {canEdit && (
                        <button
                          className="secondary-button"
                          onClick={() => {
                            setSelectedVoyage(voyage);
                            setIsFormOpen(true);
                          }}
                        >
                          Изменить
                        </button>
                      )}
                      {canDelete && (
                        <button className="danger-button" onClick={() => deleteVoyage(voyage)}>
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
