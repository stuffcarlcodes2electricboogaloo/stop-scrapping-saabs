# stop-scrapping-saabs

React single-page app that renders the Saab parts sourcing guide with the original styling and interactive behaviors for expanding resources and toggling the mobile navigation. Link data is now loaded from a MySQL-backed API so sections and links can be updated without redeploying the site. An admin console is provided for authenticated administrators to manage sections and resources.

## Development

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and update the MySQL credentials if needed.
3. Ensure the MySQL database is reachable and the configured user can create tables. The API will create `users`, `sections`, and `resources` tables on startup and seed an admin user from the environment variables.
4. Start both the API and Vite dev server: `npm run dev` (the dev proxy forwards `/api` to the API running on port 3001).
5. Build for production: `npm run build`

### API notes

- Default admin credentials come from `ADMIN_USER` and `ADMIN_PASSWORD` in `.env`.
- To run only the API, use `npm run dev:server`.
- The admin console lives at `/admin` and requires the admin role to add sections or resources.
