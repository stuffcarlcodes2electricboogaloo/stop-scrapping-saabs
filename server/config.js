import dotenv from "dotenv";

dotenv.config();

const mysqlConfig = {
  host: process.env.MYSQL_HOST ?? "localhost",
  port: Number(process.env.MYSQL_PORT ?? 3306),
  user: process.env.MYSQL_USER ?? "saab_app",
  password: process.env.MYSQL_PASSWORD ?? "saab_app",
  database: process.env.MYSQL_DATABASE ?? "saab_archive",
};

const vectorConfig = {
  provider: process.env.VECTOR_DB_PROVIDER ?? "qdrant",
  url: process.env.VECTOR_DB_URL ?? "http://localhost:6333",
  apiKey: process.env.VECTOR_DB_API_KEY ?? "",
  collection: process.env.VECTOR_DB_COLLECTION ?? "saab_magazine_chunks",
};

const sessionConfig = {
  secret: process.env.SESSION_SECRET ?? "change-me",
};

const adminSeed = {
  username: process.env.ADMIN_USER ?? "admin",
  password: process.env.ADMIN_PASSWORD ?? "changeme",
};

export { adminSeed, mysqlConfig, sessionConfig, vectorConfig };
