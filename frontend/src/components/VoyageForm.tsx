import { FormEvent, useEffect, useState } from 'react';
import { Captain, Port, Ship, Voyage, VoyagePayload, VoyageStatus } from '../types';

interface VoyageFormProps {
  initialVoyage?: Voyage | null;
  ships: Ship[];
  captains: Captain[];
  ports: Port[];
  onSubmit: (payload: VoyagePayload) => Promise<void>;
  onCancel: () => void;
}

export function VoyageForm({
  initialVoyage,
  ships,
  captains,
  ports,
  onSubmit,
  onCancel,
}: VoyageFormProps) {
  const [form, setForm] = useState<VoyagePayload>({
    shipId: 0,
    captainId: 0,
    departurePortId: 0,
    arrivalPortId: 0,
    departureDate: '',
    arrivalDate: '',
    status: 'SCHEDULED',
  });
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialVoyage) {
      setForm({
        shipId: initialVoyage.shipId,
        captainId: initialVoyage.captainId,
        departurePortId: initialVoyage.departurePortId,
        arrivalPortId: initialVoyage.arrivalPortId,
        departureDate: initialVoyage.departureDate,
        arrivalDate: initialVoyage.arrivalDate,
        status: initialVoyage.status,
      });
      return;
    }

    setForm({
      shipId: ships[0]?.id ?? 0,
      captainId: captains[0]?.id ?? 0,
      departurePortId: ports[0]?.id ?? 0,
      arrivalPortId: ports[1]?.id ?? ports[0]?.id ?? 0,
      departureDate: '',
      arrivalDate: '',
      status: 'SCHEDULED',
    });
  }, [initialVoyage, ships, captains, ports]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setIsSaving(true);

    try {
      await onSubmit(form);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка сохранения');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form className="form-panel" onSubmit={submit}>
      <h2>{initialVoyage ? 'Редактирование рейса' : 'Новый рейс'}</h2>

      <div className="form-grid">
        <label>
          Корабль
          <select
            value={form.shipId}
            onChange={(event) => setForm({ ...form, shipId: Number(event.target.value) })}
            required
          >
            {ships.map((ship) => (
              <option key={ship.id} value={ship.id}>
                {ship.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Капитан
          <select
            value={form.captainId}
            onChange={(event) => setForm({ ...form, captainId: Number(event.target.value) })}
            required
          >
            {captains.map((captain) => (
              <option key={captain.id} value={captain.id}>
                {captain.fullName}
              </option>
            ))}
          </select>
        </label>

        <label>
          Порт отправления
          <select
            value={form.departurePortId}
            onChange={(event) => setForm({ ...form, departurePortId: Number(event.target.value) })}
            required
          >
            {ports.map((port) => (
              <option key={port.id} value={port.id}>
                {port.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Порт прибытия
          <select
            value={form.arrivalPortId}
            onChange={(event) => setForm({ ...form, arrivalPortId: Number(event.target.value) })}
            required
          >
            {ports.map((port) => (
              <option key={port.id} value={port.id}>
                {port.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Дата отправления
          <input
            type="date"
            value={form.departureDate}
            onChange={(event) => setForm({ ...form, departureDate: event.target.value })}
            required
          />
        </label>

        <label>
          Дата прибытия
          <input
            type="date"
            value={form.arrivalDate}
            onChange={(event) => setForm({ ...form, arrivalDate: event.target.value })}
            required
          />
        </label>

        <label>
          Статус
          <select
            value={form.status}
            onChange={(event) => setForm({ ...form, status: event.target.value as VoyageStatus })}
          >
            <option value="SCHEDULED">SCHEDULED</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </label>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="button-row">
        <button className="primary-button" disabled={isSaving || !ships.length || !captains.length || !ports.length}>
          {isSaving ? 'Сохранение...' : 'Сохранить'}
        </button>
        <button type="button" className="secondary-button" onClick={onCancel}>
          Отмена
        </button>
      </div>
    </form>
  );
}

