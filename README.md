# ShipRegistry

ShipRegistry - учебное клиент-серверное приложение для учета кораблей, портов, капитанов, рейсов и обслуживания кораблей.

Данные курсовой работы:

- Группа: БИВТ-24-2
- Студент: Потрикеев А.С.
- Вариант: 19
- Тема: Корабль

## Стек технологий

- Backend: NestJS, TypeScript
- Frontend: React, TypeScript, Vite
- База данных: PostgreSQL
- ORM: TypeORM
- Валидация: class-validator, class-transformer
- Документация API: Swagger
- Авторизация: JWT + роли
- Клиентское хранение: LocalStorage

## Структура проекта в репозитории

```text
ship-registry/
├── backend/
├── frontend/
├── database/
├── docker-compose.yml
├── README.md
├── .env.example
└── .gitignore
```

В архиве для сдачи в Moodle исходный код помещен в каталог Source в соответствии с требованиями курсовой работы.

## Запуск PostgreSQL

Команды выполнять из папки `Source`.

```powershell
Copy-Item .env.example .env
docker compose up -d
```

При первом запуске контейнер PostgreSQL выполнит `database/init.sql` и создаст таблицы, связи, тестовые данные, представления, функции, процедуры и триггеры.

Параметры БД по умолчанию:

- Host: `localhost`
- Port: `5432`
- Database: `ship_registry`
- User: `ship_user`
- Password: `ship_password`

## Запуск backend

```powershell
cd backend
npm install
npm run start:dev
```

Backend будет доступен на `http://localhost:3000`.

Swagger UI: `http://localhost:3000/api/docs`.

## Запуск frontend

Во втором терминале из папки `Source`:

```powershell
cd frontend
npm install
npm run dev
```

Frontend будет доступен на `http://localhost:5173`.

## Тестовые пользователи

| Роль | Email | Пароль |
| --- | --- | --- |
| ADMIN | admin@ship.local | admin123 |
| DISPATCHER | dispatcher@ship.local | dispatcher123 |
| VIEWER | viewer@ship.local | viewer123 |

## Роли доступа

| Роль | Права |
| --- | --- |
| ADMIN | Полный доступ, включая удаление кораблей и рейсов |
| DISPATCHER | Просмотр, создание и редактирование кораблей и рейсов |
| VIEWER | Только просмотр |

## LocalStorage

Frontend хранит в LocalStorage:

- `shipRegistry:accessToken` - JWT-токен;
- `shipRegistry:role` - роль пользователя;
- `shipRegistry:userName` - имя пользователя;
- `shipRegistry:userEmail` - email пользователя;
- `shipRegistry:theme` - выбранная тема интерфейса;
- `shipRegistry:lastShipFilter` - последний фильтр списка кораблей.

## Основные API endpoints

Учебные endpoints без базы данных, данные хранятся только в памяти:

- `GET /users`
- `GET /users/:id`
- `POST /users`

Авторизация:

- `POST /auth/login`

Корабли:

- `GET /ships`
- `GET /ships/:id`
- `POST /ships`
- `PATCH /ships/:id`
- `DELETE /ships/:id`

Рейсы:

- `GET /voyages`
- `GET /voyages/:id`
- `POST /voyages`
- `PATCH /voyages/:id`
- `DELETE /voyages/:id`

Справочники:

- `GET /ports`
- `GET /captains`
- `GET /maintenance-records`

## Примеры API-запросов

Логин:

```powershell
curl -X POST http://localhost:3000/auth/login `
  -H "Content-Type: application/json" `
  -d "{\"email\":\"admin@ship.local\",\"password\":\"admin123\"}"
```

Получить корабли:

```powershell
curl http://localhost:3000/ships `
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

Создать корабль:

```powershell
curl -X POST http://localhost:3000/ships `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" `
  -d "{\"name\":\"North Sea\",\"type\":\"Tanker\",\"imoNumber\":\"IMO1112223\",\"buildYear\":2020,\"capacity\":15000,\"status\":\"ACTIVE\"}"
```

Создать memory user:

```powershell
curl -X POST http://localhost:3000/users `
  -H "Content-Type: application/json" `
  -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"age\":22}"
```

## База данных

Основные таблицы:

- `users` - пользователи для авторизации;
- `ships` - корабли;
- `ports` - порты;
- `captains` - капитаны;
- `voyages` - рейсы;
- `maintenance_records` - обслуживание кораблей;
- `audit_logs` - журнал изменений кораблей.

Представления:

- `v_ship_registry` - общий реестр кораблей;
- `v_active_voyages` - активные и запланированные рейсы;
- `v_port_statistics` - статистика по портам.

Функции:

- `calculate_ship_age(build_year)`;
- `get_ship_voyage_count(ship_id)`;
- `get_port_voyage_count(port_id)`.

Процедуры:

- `add_ship(...)`;
- `schedule_voyage(...)`;
- `complete_voyage(voyage_id)`.

Триггеры:

- `trg_ships_updated_at` - автоматически обновляет `updated_at` у кораблей;
- `trg_voyages_validate_dates` - проверяет, что дата прибытия позже даты отправления;
- `trg_ships_audit` - записывает изменения по кораблям в `audit_logs`.

## Проверка сборки

Backend:

```powershell
cd backend
npm install
npm run build
```

Frontend:

```powershell
cd frontend
npm install
npm run build
```

Полный запуск проекта:

```powershell
cd Source
Copy-Item .env.example .env
docker compose up -d
cd backend
npm install
npm run start:dev
```

Во втором терминале:

```powershell
cd Source/frontend
npm install
npm run dev
```

Если нужно заново пересоздать БД с начальными данными:

```powershell
docker compose down -v
docker compose up -d
```
