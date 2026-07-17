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

## GitHub vs Bitbucket

Use GitHub for this portfolio repo. It is more recognizable to freelance clients, has strong public profile value, and the free plan is enough for this project. Bitbucket is still good for Atlassian/Jira-heavy teams, but it is less useful as a public portfolio signal.
