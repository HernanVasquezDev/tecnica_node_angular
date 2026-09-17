# Users Directory

An Angular frontend and Node.js/Express backend for displaying users stored in PostgreSQL. The backend can connect either to a Supabase PostgreSQL database or to a local PostgreSQL instance managed with pgAdmin.

## Stack

- Angular 22 and TypeScript
- Node.js and Express 5
- PostgreSQL
- `pg` for database access
- Supabase PostgreSQL or local PostgreSQL with pgAdmin

## Project Structure

```text
backend/
	src/server.js       Express API
	.env                Local, untracked environment variables
frontend/
	src/app/            Angular application and user directory UI
```

## Prerequisites

- Node.js 20 or newer
- npm
- One PostgreSQL database, either Supabase or local PostgreSQL
- pgAdmin 4 is optional and is only needed for managing a local PostgreSQL database

## Installation

Install dependencies in both applications:

```powershell
cd backend
npm install

cd ..\frontend
npm install
```

## Environment Variables

The backend reads its configuration from `backend/.env`. This file must remain local and must never be committed. Copy `backend/.env.example` to `backend/.env` and replace the placeholder with the connection string for the database you selected.

```env
PORT=3000
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE
```

The root `.gitignore` already ignores `.env` and allows `.env.example` to be committed. If a real password or connection string has ever been exposed, rotate that database password before sharing the repository.

## Database Setup

Run the following SQL in either Supabase SQL Editor or pgAdmin Query Tool. It creates the table expected by the API and inserts sample records.

```sql
CREATE TABLE IF NOT EXISTS usuarios (
		id SERIAL PRIMARY KEY,
		nombre VARCHAR(120) NOT NULL,
		correo VARCHAR(255) NOT NULL UNIQUE,
		edad INTEGER NOT NULL CHECK (edad >= 0)
);

INSERT INTO usuarios (nombre, correo, edad)
VALUES
		('Juan Perez', 'juan@example.com', 25),
		('Maria Lopez', 'maria@example.com', 30),
		('Carlos Gomez', 'carlos@example.com', 28)
ON CONFLICT (correo) DO NOTHING;
```

### Option A: Supabase

1. Create a project at [supabase.com](https://supabase.com/).
2. Open **SQL Editor**, create a new query, and run the SQL above.
3. Open **Project Settings > Database** and copy a PostgreSQL connection string. The pooler connection string is usually convenient for application connections.
4. Put that connection string in `backend/.env` as `DATABASE_URL`.
5. Keep the password private and do not paste the real connection string into documentation or source control.

Example format:

```env
DATABASE_URL=postgresql://postgres.PROJECT_REF:PASSWORD@POOLER_HOST:5432/postgres
```

Use the exact host, user, port, and password displayed by Supabase for the project. Do not use the example values above literally.

### Option B: Local PostgreSQL with pgAdmin

1. Install PostgreSQL and pgAdmin 4.
2. In pgAdmin, register or connect to the local PostgreSQL server.
3. Create a database, for example `tecnica_db`.
4. Open **Tools > Query Tool** for `tecnica_db` and run the SQL above.
5. Set the backend connection string in `backend/.env`:

```env
PORT=3000
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/tecnica_db
```

If the local PostgreSQL installation does not accept SSL connections, update the `Pool` configuration in `backend/src/server.js` for local development by removing the `ssl` option. Supabase connections should keep SSL enabled.

## Running the Application

Start the backend in one terminal:

```powershell
cd backend
npm start
```

The API runs at `http://localhost:3000`.

Start the Angular frontend in a second terminal:

```powershell
cd frontend
npm start
```

Open `http://localhost:4200` in a browser. The frontend calls the backend at `http://localhost:3000/api/users`.

For backend development with automatic restart:

```powershell
cd backend
npm run dev
```

## Backend Build and Deployment

The backend is a plain Node.js application, so it does not require a transpilation or bundling step. Its production build validates the JavaScript syntax, while the deployable application consists of the `backend` folder and its production dependencies.

Run the backend build locally:

```powershell
cd backend
npm run build
```

The expected output is a successful Node.js syntax check. Start the production server with:

```powershell
npm start
```

### Deploying to a Node.js Platform

For Render, Railway, Fly.io, or a similar service, configure:

- **Root directory:** `backend`
- **Build command:** `npm ci && npm run build`
- **Start command:** `npm start`
- **Node version:** 20 or newer
- **Environment variables:** `DATABASE_URL` and optionally `PORT`

### Vercel-specific setup

This backend includes `backend/api/index.js` and `backend/vercel.json` so Express can run as a Vercel serverless function. When creating the Vercel project:

- Set the project root directory to `backend`.
- Deploy the project again after adding `api/index.js` and `vercel.json`.
- Add `DATABASE_URL` in the Vercel project environment variables for the Production environment.
- Use the public Production URL, not a Preview URL protected by login.
- In **Settings > Deployment Protection**, disable protection for the API project if the frontend must call it without authentication.

The API URL used by the frontend must include the protocol and endpoint, for example:

```text
https://YOUR-PRODUCTION-DOMAIN.vercel.app/api/users
```

If this URL redirects to `vercel.com/login`, the deployment is protected and the browser will not receive the API JSON response.

The platform usually assigns `PORT` automatically. The server already reads that value and falls back to port `3000` for local development. Do not upload `backend/.env`; define the variables in the platform's secret or environment-variable settings.

After deployment, verify the service using:

```text
https://YOUR-BACKEND-DOMAIN/api/health
https://YOUR-BACKEND-DOMAIN/api/db-check
https://YOUR-BACKEND-DOMAIN/api/users
```

If the frontend is deployed separately, update `frontend/src/app/services/usuario.ts` so its API URL points to the public backend URL instead of `http://localhost:3000/api/users`, then rebuild the frontend.

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/` | Lists the available endpoints |
| GET | `/api/health` | Returns API health status |
| GET | `/api/db-check` | Checks database connectivity |
| GET | `/api/users` | Returns users from the `usuarios` table |

The users endpoint returns this shape:

```json
{
	"result": [
		{
			"id": 1,
			"nombre": "Juan Perez",
			"correo": "juan@example.com",
			"edad": 25
		}
	]
}
```

The Angular service extracts `result` and exposes the user array to the component.

## Validation and Troubleshooting

Check the API directly:

```powershell
Invoke-WebRequest http://localhost:3000/api/health
Invoke-WebRequest http://localhost:3000/api/db-check
Invoke-WebRequest http://localhost:3000/api/users
```

Common issues:

- **Connection refused:** make sure the backend is running on port 3000.
- **Database error:** verify `DATABASE_URL`, the database password, and that the `usuarios` table exists.
- **The page shows zero users:** confirm `/api/users` returns HTTP 200 and contains a `result` array.
- **CORS errors:** use the local frontend URL `http://localhost:4200`; the backend currently enables CORS for development.
- **Local SSL errors:** remove the `ssl` option from the `Pool` configuration for a local-only PostgreSQL setup, as described above.

## Frontend Commands

Run these from `frontend/`:

```powershell
npm start          # Development server
npm run build      # Production build
npm run watch      # Development build in watch mode
npm test           # Unit tests
```
