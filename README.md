## Description

This is a simple Expense tracker Node.JS App using ExpressJS and Angular with TypeScript wrapped on Docker. It allows to create Expense sheets and attach categorized expense entries.

## Architecture

Backend side it exposes an ExpressJS REST API with PostgresSQL DB and redis to cache user details all handled with docker-compose. App architecture uses Clean Architecture approach which allows us to isolate our business logic (use cases) from infrastructure details like Database or 3rd party integrations. Also using vertical slicing architecture where we define domain/entities which hold their own logic isolated from external layers. Reference: [https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html]. Also DI used to make these entities implementation agnostic and based on contracts.

Frontend side it uses a basic Angular application with login/signin implementation using components mapped with routes.

## Additional Features

- JWT Auth
- Authorization with role validation
- Services input validation using **ZOD**
- Decoupling application components through dependency injection using **InversifyJS**. see infra/loaders/diContainer.ts and modules/<module-name>/diConfig.ts
- **Docker-compose** simplifies multi-service setup.
- Simple DB management with **Knex** with transactions
- Multi-layer trace ID for logging with **winston**
- Graceful shutdown for **express.js** server
- rate limitting implementation

### Before install

Make sure that you have docker installed [https://docs.docker.com/engine/install/](https://docs.docker.com/engine/install/)

How to run locally:

1. Copy `.env.sample` and rename it to `.env`. Only JWT_SECRET is needed as rest of params are defined on docker-compose
2. Start the app using `npm run docker:run`\* If windows user make sure entrypoint.dev.sh has LF endings to be able to execute properly.
3. By default, App is available at `http://localhost:8080/`

### Test users

Since there's configurated seeds we have default users with mock data to test. to access used following users:

Admin user (Can visualize all expense sheets):

- email: admin@expenses-api.com password: 123456

Regular user:

- email: marc@expenses-api.com password: 123456
- email: hicham@expenses-api.com password: 123456

## Development

If you want real time code changes, follow next steps:
`cd client && npm i && npm run start`
For Server:
`npm i && npm run docker:run`

4. Client should be at `http://localhost:4200/` and server at `http://localhost:8080/`

### Application structure

```bash
expense-tracker-demo
├─ package.json
├─ src
│  ├─modules (domain components)
│  │ ├─ expense
│  │ │ ├─ tests
│  │ │ ├─ repository
│  │ │ ├─ routes
│  │ │ ├─ controllers
│  │ │ ├─ *.service (business logic implementation)
│  │ ├─ expense-sheet
│  │ ├─ category
│  ├─ users
│  ├─ ...
│  │
├─ infra (generic cross-component functionality)
│  ├─ data (migrations, seeds)
│  ├─ integrations (services responsible for integrations with 3rd party services)
│  ├─ loaders
│  ├─ middlewares
```

## API Docs

Attached a Postman collection to call REST APIs.

### API Endpoints

List of available routes:

**Auth routes**:\
`POST /api/signup` - register\
`POST /api/signin` - login\
`POST /api/signout` - logout

**User routes**:\
`GET /api/users` - get all users (requires admin access rights)\
`GET /api/users/me` - get current user

**Sheet routes**:\
`GET /api/sheet/admin` - get all sheets (requires admin access rights)\
`GET /api/sheet` - get user sheets\
`POST /api/sheet` - create a sheet\
`GET /api/sheet/<sheet-id>/expenses?expand=category` - get expenses for a specific sheet. expand=category allows to return sheet with category data\
`DELETE /api/sheet/<sheet-id>` - delete sheet

**Expense routes**:\
`POST /api/expense` - create an expense\
`DELETE /api/expense/<expense-id>` - delete expense

**Category routes**:\
`GET /api/category` - Get all expense categories\
`POST /api/category` - create category
