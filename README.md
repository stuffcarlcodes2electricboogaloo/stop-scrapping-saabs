# stop-scrapping-saabs

React single-page app + Node API for a Saab technical magazine archive. The user experience focuses on searching indexed repair articles. The admin experience handles ingesting new articles and managing metadata. The API stores issue/article metadata in MySQL and exposes a vector database configuration for semantic search workflows.

## Development

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and update credentials.
3. Ensure the MySQL database is reachable and the configured user can create tables. The API will create `users`, `issues`, `articles`, and `article_chunks` tables on startup and seed an admin user from the environment variables.
4. Start both the API and Vite dev server: `npm run dev`
5. Build for production: `npm run build`

### API notes

- Default admin credentials come from `ADMIN_USER` and `ADMIN_PASSWORD` in `.env`.
- `/api/articles` provides the public search endpoint.
- `/api/admin/articles` is the authenticated endpoint for creating and listing articles.
- `/api/health` returns vector database configuration details for RAG services.

### LaunchDarkly

Set `VITE_LD_CLIENT_SIDE_ID` in `.env` to enable LaunchDarkly. The UI gates all `div` elements behind the `ui-divs-enabled` feature flag.
