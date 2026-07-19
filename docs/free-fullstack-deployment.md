# Free Full-Stack Deployment

Use this path when the portfolio must run frontend, backend, and database from a public free URL.

## Recommended Free URL

```text
https://malikabdulfarhan-portfolio.vercel.app
```

Vercel gives this URL from the project name `malikabdulfarhan-portfolio`.
If that project name is already taken, use the shortest available fallback:

```text
https://malikabdulfarhan-clientops.vercel.app
```

## Hosting Shape

- Vercel Hobby: React frontend and Node/Express API from one URL.
- Neon Free Postgres: SQL database for the project data without card setup.
- GitHub public repo: source code review for clients.

## Required Vercel Environment Variables

```text
NODE_ENV=production
DATABASE_PROVIDER=postgres
POSTGRES_AUTO_MIGRATE=true
POSTGRES_SSL=true
JWT_EXPIRES_IN_SECONDS=3600
JWT_SECRET=<long-random-secret>
DATABASE_URL=<your-neon-connection-string>
```

When `POSTGRES_AUTO_MIGRATE=true`, the API creates the required tables, indexes, and demo rows during startup if they do not exist yet.

## Steps

1. Create a public GitHub repository named `malikabdulfarhan`.
2. Push this project folder to that repository.
3. Create a Neon project named `malikabdulfarhan`.
4. Copy the Neon production branch connection string.
5. Import the GitHub repo into Vercel.
6. Use `malikabdulfarhan-portfolio` as the Vercel project name.
7. Set the environment variables above.
8. Deploy and open `/api/system/health` to verify Postgres is active.

## Verification URLs

```text
https://malikabdulfarhan-portfolio.vercel.app
https://malikabdulfarhan-portfolio.vercel.app/api/system/health
```
