import http from "http";
import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import dotenv from "dotenv";
import crypto from "crypto";
import mysql from "mysql2/promise";

dotenv.config();

const {
  MYSQL_HOST = "localhost",
  MYSQL_PORT = 3306,
  MYSQL_USER = "saab_app",
  MYSQL_PASSWORD = "saab_app",
  MYSQL_DATABASE = "saab_links",
  SESSION_SECRET = "change-me",
} = process.env;

const pool = mysql.createPool({
  host: MYSQL_HOST,
  port: Number(MYSQL_PORT),
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
});

async function ensureSchema() {
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(80) UNIQUE NOT NULL,
      password_hash VARBINARY(255) NOT NULL,
      role ENUM('admin','editor','viewer') DEFAULT 'viewer',
      salt VARBINARY(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS sections (
      id INT AUTO_INCREMENT PRIMARY KEY,
      slug VARCHAR(80) UNIQUE NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      position INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS resources (
      id INT AUTO_INCREMENT PRIMARY KEY,
      section_id INT NOT NULL,
      label VARCHAR(255) NOT NULL,
      url VARCHAR(1024) NOT NULL,
      blurb TEXT,
      position INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  const [rows] = await pool.execute("SELECT COUNT(*) as count FROM users WHERE role='admin'");
  const { count } = rows[0];
  if (count === 0) {
    const username = process.env.ADMIN_USER || "admin";
    const password = process.env.ADMIN_PASSWORD || "changeme";
    const { hash, salt } = hashPassword(password);
    await pool.execute(
      "INSERT INTO users (username, password_hash, salt, role) VALUES (?,?,?, 'admin')",
      [username, hash, salt]
    );
    console.log(`Seeded admin user '${username}' with the configured password.`);
  }
}

function hashPassword(password, salt = crypto.randomBytes(16)) {
  const hash = crypto.scryptSync(password, salt, 64);
  return { hash, salt };
}

function verifyPassword(password, hash, salt) {
  const verify = crypto.scryptSync(password, salt, 64);
  return crypto.timingSafeEqual(hash, verify);
}

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const [rows] = await pool.execute("SELECT * FROM users WHERE username = ?", [username]);
      if (!rows.length) return done(null, false, { message: "Invalid credentials" });
      const user = rows[0];
      if (!verifyPassword(password, user.password_hash, user.salt)) {
        return done(null, false, { message: "Invalid credentials" });
      }
      return done(null, { id: user.id, username: user.username, role: user.role });
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const [rows] = await pool.execute("SELECT id, username, role FROM users WHERE id = ?", [id]);
    if (!rows.length) return done(null, false);
    done(null, rows[0]);
  } catch (error) {
    done(error);
  }
});

const app = express();
app.use(express.json());
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, sameSite: "lax" },
  })
);
app.use(passport.initialize());
app.use(passport.session());

function requireAuth(req, res, next) {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin role required" });
  }
  next();
}

app.post("/api/auth/login", passport.authenticate("local"), (req, res) => {
  res.json({ user: req.user });
});

app.post("/api/auth/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ success: true });
  });
});

app.get("/api/auth/me", (req, res) => {
  res.json({ user: req.user || null });
});

app.get("/api/sections", async (_req, res, next) => {
  try {
    const [sections] = await pool.execute("SELECT * FROM sections ORDER BY position, id");
    const [resources] = await pool.execute("SELECT * FROM resources ORDER BY position, id");
    const grouped = sections.map((section) => ({
      ...section,
      resources: resources.filter((r) => r.section_id === section.id),
    }));
    res.json(grouped);
  } catch (error) {
    next(error);
  }
});

app.post("/api/sections", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { slug, title, description, position = 0 } = req.body;
    await pool.execute(
      "INSERT INTO sections (slug, title, description, position) VALUES (?,?,?,?)",
      [slug, title, description, position]
    );
    res.status(201).json({ success: true });
  } catch (error) {
    next(error);
  }
});

app.post("/api/resources", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { sectionId, label, url, blurb = "", position = 0 } = req.body;
    await pool.execute(
      "INSERT INTO resources (section_id, label, url, blurb, position) VALUES (?,?,?,?,?)",
      [sectionId, label, url, blurb, position]
    );
    res.status(201).json({ success: true });
  } catch (error) {
    next(error);
  }
});

app.put("/api/resources/:id", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { label, url, blurb, position } = req.body;
    await pool.execute(
      "UPDATE resources SET label = ?, url = ?, blurb = ?, position = ? WHERE id = ?",
      [label, url, blurb, position ?? 0, id]
    );
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

app.delete("/api/resources/:id", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.execute("DELETE FROM resources WHERE id = ?", [id]);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Server error", detail: err.message });
});

async function start() {
  try {
    await ensureSchema();
    const server = http.createServer(app);
    const port = process.env.PORT || 3001;
    server.listen(port, () => {
      console.log(`API listening on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
}

start();
