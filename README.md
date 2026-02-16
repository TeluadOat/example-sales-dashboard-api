# sales-dashboard-api

A RESTful API backend for managing data powering a sales dashboard. It organizes business metrics such as KPIs, top products, visitor insights, revenue streams, satisfaction analytics, and geographic sales figures, supporting complete CRUD operations across all dataset modules for flexible dashboard integration.

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The project exposes interactive API documentation (Swagger UI) at the root: **http://localhost:3000/**. You can download the raw OpenAPI spec from **http://localhost:3000/docs.json**.

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

## Project Structure

- `src/app.ts` – Express application bootstrap and middleware registration.
- `src/server.ts` – Application entry point.
- `src/modules/*` – Feature modules containing models, controllers, services, validators, and routes.
- `prisma/schema.prisma` – Prisma schema generated from the project specification.

## Environment Variables

Environment templates are generated in the project root. Copy the desired template and customise it before running the project.

**Default Database:** This project uses **SQLite** by default (`file:./dev.db`) for testing and development. The database file will be created automatically when you first run the project. For production, update the `DATABASE_URL` in your `.env` file to point to PostgreSQL, MySQL, or another database.

## Scripts

- `npm run dev` – Start the development server with live reload.
- `npm run build` – Compile TypeScript to JavaScript.
- `npm start` – Run the compiled application from the `dist` directory.

## Generated Modules

- **VisitorInsights** module exports router `visitorInsightsRouter`.
- **Kpis** module exports router `kpisRouter`.
- **Revenues** module exports router `revenuesRouter`.
- **TopProducts** module exports router `topProductsRouter`.
- **SalesMaps** module exports router `salesMapsRouter`.
- **CustomerSatisfactions** module exports router `customerSatisfactionsRouter`.
- **VolumeServices** module exports router `volumeServicesRouter`.
- **TargetRealities** module exports router `targetRealitiesRouter`.

## License

MIT