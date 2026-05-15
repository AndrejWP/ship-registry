import { FormEvent, useEffect, useState } from 'react';
import { Ship, ShipPayload, ShipStatus } from '../types';

const defaultShip: ShipPayload = {
  name: '',
  type: '',
  imoNumber: '',
  buildYear: new Date().getFullYear(),
  capacity: 1,
  status: 'ACTIVE',
};

interface ShipFormProps {
  initialShip?: Ship | null;
  onSubmit: (payload: ShipPayload) => Promise<void>;
  onCancel: () => void;
}

export function ShipForm({ initialShip, onSubmit, onCancel }: ShipFormProps) {
  const [form, setForm] = useState<ShipPayload>(defaultShip);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setForm(
      initialShip
        ? {
            name: initialShip.name,
            type: initialShip.type,
            imoNumber: initialShip.imoNumber,
            buildYear: initialShip.buildYear,
            capacity: initialShip.capacity,
            status: initialShip.status,
          }
        : defaultShip,
    );
  }, [initialShip]);

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
      <h2>{initialShip ? 'Редактирование корабля' : 'Новый корабль'}</h2>
      <div className="form-grid">
        <label>
          Название
          <input
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            required
          />
        </label>
        <label>
          Тип
          <input
            value={form.type}
            onChange={(event) => setForm({ ...form, type: event.target.value })}
            required
          />
        </label>
        <label>
          IMO номер
          <input
            value={form.imoNumber}
            onChange={(event) => setForm({ ...form, imoNumber: event.target.value })}
            required
          />
        </label>
        <label>
          Год постройки
          <input
            type="number"
            value={form.buildYear}
            onChange={(event) => setForm({ ...form, buildYear: Number(event.target.value) })}
            required
          />
        </label>
        <label>
          Вместимость
          <input
            type="number"
            value={form.capacity}
            onChange={(event) => setForm({ ...form, capacity: Number(event.target.value) })}
            required
          />
        </label>
        <label>
          Статус
          <select
            value={form.status}
            onChange={(event) => setForm({ ...form, status: event.target.value as ShipStatus })}
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="MAINTENANCE">MAINTENANCE</option>
            <option value="DECOMMISSIONED">DECOMMISSIONED</option>
          </select>
        </label>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="button-row">
        <button className="primary-button" disabled={isSaving}>
          {isSaving ? 'Сохранение...' : 'Сохранить'}
        </button>
        <button type="button" className="secondary-button" onClick={onCancel}>
          Отмена
        </button>
      </div>
    </form>
  );
}

