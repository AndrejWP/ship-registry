import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { Captain, MaintenanceRecord, Port } from '../types';

export function PortsPage() {
  const [ports, setPorts] = useState<Port[]>([]);
  const [captains, setCaptains] = useState<Captain[]>([]);
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api.getPorts(), api.getCaptains(), api.getMaintenanceRecords()])
      .then(([portsData, captainsData, recordsData]) => {
        setPorts(portsData);
        setCaptains(captainsData);
        setRecords(recordsData);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Ошибка загрузки справочников'));
  }, []);

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h1>Справочники</h1>
          <p>Порты, капитаны и записи обслуживания доступны для просмотра.</p>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <h2>Порты</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Название</th>
              <th>Страна</th>
              <th>Город</th>
            </tr>
          </thead>
          <tbody>
            {ports.map((port) => (
              <tr key={port.id}>
                <td>{port.id}</td>
                <td>{port.name}</td>
                <td>{port.country}</td>
                <td>{port.city}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Капитаны</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>ФИО</th>
              <th>Лицензия</th>
              <th>Опыт</th>
            </tr>
          </thead>
          <tbody>
            {captains.map((captain) => (
              <tr key={captain.id}>
                <td>{captain.id}</td>
                <td>{captain.fullName}</td>
                <td>{captain.licenseNumber}</td>
                <td>{captain.experienceYears} лет</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Обслуживание</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Корабль</th>
              <th>Описание</th>
              <th>Дата</th>
              <th>Стоимость</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id}>
                <td>{record.id}</td>
                <td>{record.ship?.name ?? record.shipId}</td>
                <td>{record.description}</td>
                <td>{record.maintenanceDate}</td>
                <td>{record.cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
