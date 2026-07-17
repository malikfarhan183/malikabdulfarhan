# Free Full-Stack Deployment

Use this path when the portfolio must run frontend, backend, and database from a public free URL.

## Recommended Free URL

```text
https://malikabdulfarhan.onrender.com
```

Render gives this URL when the web service name `malikabdulfarhan` is available. If it is already taken, use the shortest available fallback:

```text
https://malikabdulfarhan-clientops.onrender.com
```

## Hosting Shape

- Render Free Web Service: React frontend and Node/Express API from one URL.
- Azure SQL Database Free Offer: MSSQL database for the project data.
- GitHub public repo: source code review for clients.

## Required Render Environment Variables

```text
NODE_ENV=production
DATABASE_PROVIDER=mssql
MSSQL_AUTO_MIGRATE=true
MSSQL_ENCRYPT=true
MSSQL_PORT=1433
JWT_EXPIRES_IN_SECONDS=3600
JWT_SECRET=<Render can generate this>
MSSQL_SERVER=<your-azure-sql-server>.database.windows.net
MSSQL_DATABASE=ClientOpsStudio
MSSQL_USER=<your-sql-admin-user>
MSSQL_PASSWORD=<your-sql-admin-password>
```

When `MSSQL_AUTO_MIGRATE=true`, the API creates the required tables, indexes, and demo rows during startup if they do not exist yet.

## Steps

1. Create a public GitHub repository named `malikabdulfarhan`.
2. Push this project folder to that repository.
3. Create an Azure SQL database named `ClientOpsStudio`.
4. Allow Azure SQL firewall access from Azure services and Render outbound traffic as needed.
5. Create a Render Web Service from the GitHub repo.
6. Use `malikabdulfarhan` as the Render service name.
7. Set the environment variables above.
8. Deploy and open `/api/system/health` to verify MSSQL is active.

## Verification URLs

```text
https://malikabdulfarhan.onrender.com
https://malikabdulfarhan.onrender.com/api/system/health
```
