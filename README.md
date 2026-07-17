# Malik Skills Showcase

`ClientOps Studio` is a portfolio-grade product demo that proves practical full-stack skills through a real authenticated application.

## What It Demonstrates

- React + Material UI dashboard implementation
- JWT authentication and protected API routes
- Layered Express API: routes -> controllers -> services -> providers
- Pagination, filtering, sorting, and observable API response shapes
- MSSQL-ready database provider with schema, seed data, and Docker setup
- Deployment-friendly demo mode when a hosted SQL Server is not configured

## Demo Login

```text
Email: malik@example.com
Password: Portfolio@2026
```

## Run Locally

```bash
cd malik-skills-showcase
npm run build
npm start
```

Open `http://localhost:4200`.

## SQL Server Setup

```bash
docker compose up -d
```

Then run `database/schema.sql` and `database/seed.sql` against the `ClientOpsStudio` database. Set `DATABASE_PROVIDER=mssql` in `.env` when you want the API to read/write SQL Server.

For hosted MSSQL, set `MSSQL_AUTO_MIGRATE=true` so the API creates the required tables, indexes, and demo rows on startup.

## Free Full-Stack URL

The shortest recommended free public URL is:

```text
https://malikabdulfarhan.onrender.com
```

Use Render for the React + Node/Express app and Azure SQL Free for MSSQL. See `docs/free-fullstack-deployment.md` for the deployment checklist and required environment variables.

## GitHub vs Bitbucket

Use GitHub for this portfolio repo. It is more recognizable to freelance clients, has strong public profile value, and the free plan is enough for this project. Bitbucket is still good for Atlassian/Jira-heavy teams, but it is less useful as a public portfolio signal.
