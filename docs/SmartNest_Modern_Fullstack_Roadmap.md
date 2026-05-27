# SmartNest: современная fullstack-дорожная карта

IoT-платформа умного дома для развития до уровня уверенного fullstack JS/TS разработчика и последующего трудоустройства.

Дата обновления: май 2026

## 1. Цель Проекта

SmartNest — портфолио-проект, который должен демонстрировать не количество технологий само по себе, а способность проектировать, реализовывать, тестировать и документировать production-like fullstack-систему.

Главная цель: построить работающий end-to-end продукт, где пользователь может зарегистрироваться, создать дом, добавить устройства, получать телеметрию в реальном времени, отправлять команды и настраивать автоматизацию.

Успешная реализация этого плана не гарантирует трудоустройство сама по себе, но даст сильную техническую базу и набор доказательств, которые можно показывать работодателю: рабочий demo flow, чистую архитектуру, тесты, CI, документацию, инфраструктуру и способность объяснять инженерные решения.

## 2. Принципы Реализации

1. Сначала вертикальные фичи, потом расширение инфраструктуры.
2. Каждая крупная фича должна иметь тесты и быть демонстрируемой через UI или API.
3. Shared-код используется только там, где он реально снижает дублирование: DTO, Zod-схемы, event constants, API contracts.
4. Backend является основным источником бизнес-правил: авторизация, ownership checks, валидация, транзакции.
5. Frontend использует Server Components для initial data и client state только для интерактива/realtime.
6. Инфраструктура внедряется по мере необходимости: Redis после auth/cache, Kafka после рабочего CRUD и realtime MVP.
7. Документация пишется как часть фичи, а не в конце проекта.
8. Каждая технология должна иметь видимую роль в продукте и объяснимую причину выбора.

## 3. Результаты, Ориентированные На Трудоустройство

После реализации roadmap проект должен доказывать навыки, которые чаще всего ожидаются от fullstack JS/TS разработчика.

| Навык                 | Чем подтверждается в проекте                                                                 |
| --------------------- | -------------------------------------------------------------------------------------------- |
| TypeScript            | Строгий TS config, shared contracts, типизированные API boundaries, безопасная бизнес-логика |
| Backend-архитектура   | Feature modules, DI, guards, services, чистые controllers, Prisma migrations                 |
| API design            | Версионированный REST API, Swagger/OpenAPI, единый формат ошибок, валидация                  |
| Auth и безопасность   | JWT refresh rotation, hashed secrets, RBAC, ownership checks, rate limiting                  |
| Работа с базой данных | Реляционная схема, indexes, migrations, transactions, TimescaleDB для telemetry              |
| Frontend-архитектура  | Next.js App Router, Server Components, client boundaries, realtime UI                        |
| State management      | Server state отделен от realtime client state, Redux используется только там, где оправдан   |
| Тестирование          | Unit, integration, infra integration и e2e tests с осмысленными сценариями                   |
| DevOps basics         | Docker Compose, CI quality gates, health checks, production-like builds                      |
| Коммуникация          | README, architecture docs, API examples, interview talking points                            |

Минимальный портфолио-результат для откликов на вакансии: backend + web + database + auth + homes/devices + realtime demo + tests + README + CI. Kafka, mobile и automation усиливают проект, но не должны блокировать первую публичную версию.

## 4. Актуальный Стек

| Слой             | Технологии                                              | Назначение                                                              |
| ---------------- | ------------------------------------------------------- | ----------------------------------------------------------------------- |
| Monorepo         | pnpm workspaces, позже Turborepo                        | Управление apps/packages, единые scripts, кеширование задач             |
| Backend          | NestJS 11, TypeScript                                   | REST API, auth, domain logic, WebSocket gateway                         |
| Database         | PostgreSQL / TimescaleDB, Prisma 7                      | Основные данные, миграции, типизированный доступ, telemetry hypertables |
| Cache / Realtime | Redis                                                   | Session cache, rate limiting, device state cache, WS fan-out            |
| Event Bus        | Kafka                                                   | Телеметрия, события устройств, команды, ACK, automation triggers        |
| Web              | Next.js 16, React 19, Tailwind CSS 4                    | Dashboard, App Router, Server Components, realtime UI                   |
| Web State        | Server Components, URL state, Redux Toolkit for WS only | Разделение server state и realtime client state                         |
| Mobile           | Expo, React Native, Expo Router                         | Мобильный клиент после стабильного web/backend core                     |
| Validation       | Zod in shared package, Nest validation pipes            | Runtime validation и shared contracts                                   |
| Testing          | Jest, Supertest, Testcontainers, Playwright             | Unit, integration, infra integration, e2e                               |
| API Docs         | OpenAPI / Swagger                                       | Документация REST API и возможная генерация клиента                     |
| Observability    | pino, request id, health checks, optional OpenTelemetry | Production-like диагностика                                             |
| CI/CD            | GitHub Actions, Docker                                  | Lint, typecheck, tests, build, migration checks                         |

## 5. Целевая Структура Монорепозитория

```text
smartnest/
├── apps/
│   ├── backend/              # NestJS API
│   ├── web/                  # Next.js dashboard
│   └── mobile/               # Expo app
├── packages/
│   └── shared/               # types, constants, validators, API contracts
├── docs/                     # architecture, roadmap, API notes
├── infra/
│   ├── nginx/
│   ├── kafka/
│   └── observability/        # optional: prometheus/grafana/otel configs
├── docker-compose.yml        # local infra only
├── docker-compose.prod.yml   # production-like deployment later
├── pnpm-workspace.yaml
└── turbo.json                # optional after core scripts stabilize
```

## 6. Архитектура Backend

### 6.1. Модули NestJS

```text
src/
├── main.ts
├── app.module.ts
├── common/
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   └── pipes/
├── config/
├── health/
├── prisma/
├── auth/
├── users/
├── homes/
├── rooms/
├── devices/
├── events/
├── commands/
├── realtime/
├── redis/
├── kafka/
├── automation/
└── notifications/
```

### 6.2. Требования К Backend

- Глобальный `ValidationPipe` или Zod-based validation.
- Централизованный exception filter с единым форматом error response.
- Request logging с correlation/request id.
- `ConfigModule` с schema validation для environment variables.
- `PrismaModule` как общий infrastructure module.
- Версионирование REST API под `/api/v1`.
- Swagger доступен в non-production окружениях.
- Health checks для API, database, Redis и Kafka, когда Kafka будет внедрена.
- RBAC и ownership guards для всех home/device ресурсов.
- В controllers не должно быть прямой бизнес-логики.

### 6.3. Базовый Уровень Безопасности

- Passwords, refresh tokens, PINs и verification codes должны хешироваться перед сохранением.
- Access tokens должны быть короткоживущими; refresh tokens должны ротироваться при каждом refresh.
- Повторное использование refresh token должно по возможности инвалидировать связанную session family.
- Все write operations должны проверять ownership и role, а не только факт authentication.
- Public endpoints должны быть явно помечены; предпочтителен подход protected-by-default.
- Rate limits должны покрывать login, verification, command sending и invite flows.
- CORS должен разрешать только известные origins в non-local окружениях.
- Error responses не должны раскрывать sensitive details.

### 6.4. Базовый Уровень Производительности И Доступа К Данным

- Добавить indexes для частых фильтров: `homeId`, `deviceId`, `createdAt`, `status`, membership lookups.
- Использовать pagination для events, commands и telemetry history с первой реализации.
- Избегать N+1 queries через проектирование service methods вокруг явных includes/selects.
- Использовать transactions для многошаговых записей: create home + owner membership, command + audit entry, invite accept flows.
- Кешировать projections в Redis только после того, как database source of truth реализован корректно.

## 7. Дорожная Карта Модели Данных Prisma

Prisma 7 должна использовать `prisma.config.ts` для datasource configuration. Schema должна избегать устаревших примеров на основе `url = env("DATABASE_URL")` внутри `schema.prisma`, если проект сознательно не откатывается к старому стилю.

### Фаза 1: Auth

- `User`
- `Session`
- `VerificationCode`

### Фаза 2: Core Domain

- `Home`
- `HomeMember`
- `Room`
- `Device`
- `Gateway`

### Фаза 3: Events And Commands

- `DeviceEvent`
- `DeviceCommand`
- `DeviceTelemetry` или raw Timescale hypertable, управляемая через SQL migration

### Фаза 4: Automation

- `Scene`
- `SceneAction`
- `AutomationRule`
- `AutomationExecutionLog`

### Фаза 5: Notifications

- `NotificationSetting`
- `NotificationDelivery`

## 8. Архитектура Frontend

### 8.1. Структура Next.js App Router

```text
src/app/
├── layout.tsx
├── page.tsx                  # Landing
├── proxy.ts                  # Next.js 16 auth boundary if needed
├── (auth)/
│   ├── login/page.tsx
│   └── verify/page.tsx
└── (dashboard)/
    ├── layout.tsx
    ├── homes/page.tsx
    ├── homes/[homeId]/page.tsx
    ├── homes/[homeId]/devices/page.tsx
    ├── homes/[homeId]/events/page.tsx
    ├── homes/[homeId]/automation/page.tsx
    └── profile/page.tsx
```

### 8.2. Правила Frontend

- Использовать Server Components для initial dashboard data.
- Использовать client components только для forms, controls, optimistic updates и WebSocket state.
- Не складывать все server data в Redux.
- Использовать Redux Toolkit только для realtime device/event state и WebSocket middleware.
- Использовать typed API helpers, сгенерированные или выведенные из shared contracts.
- Использовать `next/image` и `next/font` для assets и fonts.
- Добавлять Suspense boundaries вокруг client hooks, которые могут вызывать CSR bailout.
- Использовать `proxy.ts` вместо старого `middleware.ts` для auth routing в Next.js 16.

### 8.3. UX-Требования

- Первый экран dashboard должен ясно показывать ценность системы: home status, online/offline devices, latest events и command status.
- Loading, empty, error и unauthorized states должны быть реализованы намеренно, а не оставлены browser/default errors.
- Forms должны иметь field-level validation, accessible labels и понятные server error messages.
- Realtime updates должны быть видны без необходимости refresh страницы.
- Mobile layout должен быть пригоден для web dashboard еще до появления native mobile app.

## 9. Область Ответственности Shared Package

`packages/shared` должен содержать:

- API DTO types.
- Zod validation schemas.
- Device event codes.
- Device command codes.
- Domain enums, которые должны совпадать на backend и frontend.
- Легковесные helpers, которые являются pure и framework-agnostic.

`packages/shared` не должен содержать:

- NestJS-specific classes.
- React components.
- Prisma client usage.
- Environment-specific code.

## 10. Realtime И Event-Driven Design

### 10.1. Сначала Redis

Redis должен внедряться раньше Kafka для конкретных задач:

- Auth/session cache.
- Verification code throttle.
- Device state cache.
- Command rate limit.
- WebSocket fan-out между API instances.

### 10.2. Kafka После Core MVP

Kafka должна внедряться только после auth, homes/devices CRUD и базового dashboard.

Topics:

| Topic                 | Producer             | Consumers                             | Purpose                  |
| --------------------- | -------------------- | ------------------------------------- | ------------------------ |
| `device.telemetry`    | Gateway simulator    | EventsService, RuleEngine             | Sensor measurements      |
| `device.events`       | EventsService        | RealtimeGateway, NotificationsService | Domain events            |
| `device.commands`     | CommandsService      | Gateway simulator                     | Commands to devices      |
| `device.command.ack`  | Gateway simulator    | CommandsService                       | Command acknowledgements |
| `automation.triggers` | RuleEngine           | AutomationService                     | Automation execution     |
| `notifications`       | NotificationsService | Push/email workers                    | Async notifications      |

Partitioning key: `homeId`, чтобы сохранить порядок событий внутри одного дома.

## 11. Стратегия Тестирования

| Уровень           | Инструмент                   | Область проверки                   | Когда обязателен                   |
| ----------------- | ---------------------------- | ---------------------------------- | ---------------------------------- |
| Unit              | Jest                         | Pure services, rule engine, guards | Каждый business module             |
| Integration       | Supertest                    | REST endpoints с test DB           | Auth, homes, devices, commands     |
| Infra integration | Testcontainers               | Redis/Kafka flows                  | Realtime и event pipeline          |
| E2E               | Playwright                   | Критические пользовательские пути  | Dashboard MVP и release candidates |
| Static checks     | TypeScript, ESLint, Prettier | Весь monorepo                      | Каждый PR                          |

Минимальные critical paths:

1. Зарегистрировать или залогинить пользователя.
2. Создать дом.
3. Добавить устройство.
4. Получить simulated telemetry.
5. Увидеть realtime update в dashboard.
6. Отправить command.
7. Получить command ACK или timeout.

Coverage должен использоваться как quality signal, а не как единственная цель. Важная business logic должна быть протестирована, даже если global coverage временно ниже 80%.

### 11.1. Стандарты Тестирования

- Tests должны проверять behavior и security boundaries, а не implementation details.
- Каждый guard должен иметь positive и negative tests.
- Каждый endpoint, который читает или пишет home-scoped data, должен проверять запрет cross-home access.
- Business services должны быть unit-testable без запуска всего Nest application.
- E2E tests должны покрывать только critical user paths, чтобы оставаться стабильными и maintainable.

## 12. Дорожная Карта CI/CD

### Этап 1: Текущий Baseline

- `pnpm install --frozen-lockfile`
- Format check.
- Lint.
- Backend build and tests.
- Web build.

### Этап 2: Core Product

- Typecheck script для всех packages.
- Prisma generate check.
- Prisma migration deploy/check against CI Postgres.
- Backend e2e tests.
- Shared package build before dependent apps.

### Этап 3: Production-Like

- Docker build для backend и web.
- Playwright e2e against composed stack.
- Coverage report.
- Optional affected builds through Turborepo.
- Optional deploy workflow after main branch merge.

## 13. Docker И Local Development

Текущий `docker-compose.yml` должен рассматриваться как local infrastructure compose: Postgres/TimescaleDB, Redis, Kafka, Nginx.

Рекомендуемое разделение:

- `docker-compose.yml`: local databases and infrastructure.
- `docker-compose.app.yml`: backend and web containers for integration testing.
- `docker-compose.prod.yml`: production-like setup with multi-stage builds and health checks.

Backend и web Dockerfiles стоит добавить после появления первого end-to-end product slice.

## 14. Дорожная Карта Реализации

### Фаза 0: Подготовка Project Foundation

Цель: сделать repository предсказуемым и готовым к feature work.

Задачи:

- Добавить README with quick start.
- Добавить root `typecheck` script.
- Решить, добавлять ли Turborepo сейчас или оставить `pnpm -r`, пока web/mobile surface не вырастет.
- Синхронизировать Prisma 7 documentation и generated client strategy.
- Добавить backend `PrismaModule` и database connection smoke test.
- Добавить config validation.

Критерии готовности:

- New developer может поднять infra и запустить checks по README.
- `pnpm lint`, `pnpm build`, `pnpm test` проходят локально и в CI.

### Фаза 1: Auth MVP

Цель: реальный auth flow с sessions и secure foundations.

Задачи:

- Реализовать `User`, `Session`, `VerificationCode` models и migration.
- Реализовать `AuthModule`.
- Добавить password или verification-code auth flow. Если SMS недоступны, использовать dev-only console/mock provider.
- Хешировать sensitive secrets через `argon2`.
- Реализовать JWT access token и refresh token rotation.
- Хранить hashed refresh tokens, а не raw refresh tokens.
- Добавить Redis throttle для verification attempts.
- Добавить unit и integration tests.

Критерии готовности:

- User может register/login/refresh/logout.
- Invalid credentials, expired codes и token reuse протестированы.
- Swagger документирует auth endpoints.

### Фаза 2: Homes And Devices Core

Цель: завершить CRUD core domain с authorization.

Задачи:

- Добавить `Home`, `HomeMember`, `Room`, `Device`, `Gateway` models.
- Реализовать feature modules: `homes`, `rooms`, `devices`.
- Добавить ownership и role guards.
- Минимально реализовать invite/member management.
- Добавить shared DTOs и Zod schemas.
- Добавить seed script с demo user, home, rooms и devices.
- Добавить Supertest integration tests.

Критерии готовности:

- User может создать home и управлять devices только в homes, где у него есть access.
- Unauthorized cross-home access покрыт tests.

### Фаза 3: Web Dashboard MVP

Цель: видимый продукт, а не только API.

Задачи:

- Заменить default Next.js starter page на SmartNest landing.
- Добавить auth pages.
- Добавить dashboard layout.
- Добавить homes list и home dashboard.
- Добавить devices page с device cards.
- Добавить API helper и typed response handling.
- Использовать Server Components для initial data.
- Добавить Playwright smoke test для auth/dashboard path.

Критерии готовности:

- Demo user может login и view homes/devices в browser.
- Web build проходит в CI.

### Фаза 4: Redis And WebSocket Realtime

Цель: realtime device state updates без преждевременной Kafka complexity.

Задачи:

- Добавить Redis module.
- Добавить device state cache.
- Добавить WebSocket gateway, scoped by `homeId`.
- Добавить simulator endpoint или script, который обновляет device state.
- Добавить Redux Toolkit WS middleware только для realtime state.
- Добавить integration tests для Redis-backed state flow.

Критерии готовности:

- Simulated telemetry меняет device status live on dashboard.
- Multiple clients получают одинаковый update.

### Фаза 5: Commands Pipeline

Цель: показать command lifecycle и optimistic UI.

Задачи:

- Добавить `DeviceCommand` model.
- Добавить command API.
- Добавить command rate limiting в Redis.
- Добавить command statuses: `PENDING`, `SENT`, `ACCEPTED`, `REJECTED`, `TIMEOUT`.
- Добавить optimistic UI и rollback/error state.
- Добавить tests для command permissions и status transitions.

Критерии готовности:

- User может отправить command из dashboard и увидеть final status.

### Фаза 6: Kafka Event Pipeline

Цель: внедрить event-driven architecture с измеримой пользой.

Задачи:

- Добавить Kafka module с producer/consumer wrappers.
- Добавить gateway simulator, producing `device.telemetry`.
- Сохранять events в DB и обновлять Redis projection.
- Публиковать `device.events` для realtime и notifications.
- Добавить command ACK topic.
- Добавить Testcontainers integration tests для key flows.

Критерии готовности:

- Telemetry и commands проходят через Kafka end-to-end.
- Kafka можно объяснить через concrete code, а не только architecture diagrams.

### Фаза 7: Automation And Scenes

Цель: portfolio feature для interviews.

Задачи:

- Добавить scenes CRUD.
- Добавить automation rule model.
- Реализовать rule engine как pure service.
- Поддержать event trigger и simple conditions.
- Добавить 15+ unit tests для edge cases rule engine.
- Добавить basic UI для rules и scene execution.

Критерии готовности:

- Rule вида `if temperature > 30 and window closed, turn on AC` работает через event pipeline.

### Фаза 8: Mobile MVP

Цель: добавлять mobile только после того, как backend/web стали полезными.

Задачи:

- Заменить placeholder на Expo setup.
- Добавить Expo Router navigation.
- Переиспользовать shared contracts.
- Реализовать auth, homes list, device details, events.
- Добавить push notification integration позже, после появления notifications backend.

Критерии готовности:

- Mobile app может login и показывать те же homes/devices, что и web.

### Фаза 9: Полировка И Production Readiness

Цель: сделать repository удобным для оценки работодателем.

Задачи:

- Добавить architecture diagrams.
- Добавить API examples.
- Добавить Dockerfiles и production-like compose.
- Добавить health checks.
- Добавить structured logs.
- Добавить observability notes.
- Добавить deployment guide.
- Добавить final Playwright e2e critical path.

Критерии готовности:

- README ясно объясняет architecture, local launch, testing и demo flow.
- CI проверяет основные quality gates.

## 15. Checklist Публичного Портфолио

Перед использованием проекта в откликах на вакансии repository должен содержать:

- Отполированный README со screenshots или GIFs основного flow.
- One-command local start instructions.
- Architecture diagram, показывающую границы web, backend, database, Redis, Kafka и simulator.
- Ссылку на API documentation или instructions for Swagger.
- Понятный `.env.example` без secrets.
- Seed/demo credentials для local review.
- CI badge или visible GitHub Actions history.
- Короткий раздел, объясняющий tradeoffs и что было intentionally deferred.
- Хотя бы один e2e test, который reviewer сможет быстро понять.
- Issues или roadmap items, показывающие product thinking без сокрытия unfinished work.

## 16. Антицели

Эти задачи не стоит приоритизировать до того, как core product станет демонстрируемым:

- Строить большую design system до появления core screens.
- Добавлять microservices только ради демонстрации microservices.
- Добавлять Kafka до того, как заработает более простой Redis/WebSocket realtime flow.
- Строить mobile до стабилизации backend/web flows.
- Гнаться за высокими coverage numbers, пока важные auth и permission paths не протестированы.
- Добавлять complex deployment до того, как local development и CI стали надежными.

## 17. Темы Для Собеседований, К Которым Нужно Прийти

- Почему Server Components использованы для initial dashboard data.
- Почему Redux ограничен realtime client state.
- Как работают JWT refresh rotation и token invalidation.
- Как ownership guards предотвращают cross-home access.
- Почему Redis внедряется раньше Kafka.
- Почему Kafka partitioning использует `homeId`.
- Как command lifecycle обрабатывает ACK, timeout и rejection.
- Как event projection работает от Kafka к Redis и WebSocket.
- Как Prisma migrations и TimescaleDB hypertables сосуществуют.
- Как Testcontainers проверяет infrastructure-dependent flows.
- Как CI gates предотвращают broken builds и migrations.

## 18. Ближайшие Шаги

1. Добавить README quick start и root `typecheck` script.
2. Синхронизировать Prisma 7 setup и создать первую auth migration.
3. Реализовать `PrismaModule` и `AuthModule`.
4. Добавить shared auth DTOs/Zod schemas.
5. Заменить default Next.js landing на SmartNest-specific page после начала backend auth MVP.

## 19. Главный Риск

Главный риск — overbuilding infrastructure до появления product slice. Kafka, mobile, automation и push notifications ценны, но они не должны блокировать первый complete flow: authenticated user manages a home and sees device state in the dashboard.

Проект должен оптимизироваться под demonstrable engineering quality: clean modules, real tests, typed contracts, secure defaults, clear documentation и working demo.
