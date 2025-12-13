import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";

type Resource = {
  id: number;
  section_id?: number;
  label: string;
  url: string;
  blurb?: string;
  position?: number;
};

type Section = {
  id: number;
  slug: string;
  title: string;
  description?: string;
  resources?: Resource[];
};

type User = {
  id: number;
  username: string;
  role: string;
};

const Loader = () => <div className="muted">Loading...</div>;

function useSections() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/sections", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load sections");
      const data = (await res.json()) as Section[];
      setSections(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return { sections, loading, error, reload: load };
}

function Home() {
  const { sections, loading, error, reload } = useSections();
  const [navOpen, setNavOpen] = useState(false);

  const navItems = useMemo(
    () => sections.map((s) => ({ id: s.slug, title: s.title })),
    [sections]
  );

  return (
    <div className="wrap">
      <header>
        <div className="kicker">
          <div className="pill">Saab parts survival guide</div>
          <div className="pill">Database-backed links</div>
        </div>
        <h1>Stop scrapping Saabs</h1>
        <p className="sub">
          Every resource on this page is now driven from the MySQL-backed API. Sections and links can be maintained from the
          admin console without editing code.
        </p>
      </header>

      <div className="grid">
        <nav className={navOpen ? "" : "collapsed"}>
          <button className="nav-toggle" onClick={() => setNavOpen((v) => !v)}>
            Navigation
          </button>
          <h3>Sections</h3>
          <ol>
            {navItems.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} onClick={() => setNavOpen(false)}>
                  {item.title}
                </a>
              </li>
            ))}
          </ol>
          <div className="muted">Need to edit? Head to the admin console.</div>
        </nav>

        <main>
          {loading && <Loader />}
          {error && (
            <div className="callout error">
              <b>Could not load sections:</b> {error}
              <div>
                <button onClick={reload}>Try again</button>
              </div>
            </div>
          )}
          {!loading && sections.length === 0 && <div className="muted">No sections have been added yet.</div>}
          {sections.map((section) => (
            <section key={section.id} id={section.slug} className="card">
              <div className="card-header">
                <h2>{section.title}</h2>
                {section.description && <p className="muted">{section.description}</p>}
              </div>
              <div className="resource-list">
                {section.resources?.map((resource) => (
                  <article key={resource.id} className="resource">
                    <div className="resource-heading">
                      <a href={resource.url} target="_blank" rel="noopener">
                        {resource.label}
                      </a>
                    </div>
                    {resource.blurb && <p className="muted">{resource.blurb}</p>}
                  </article>
                ))}
                {!section.resources?.length && <p className="muted">No links are available for this section.</p>}
              </div>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}

function Admin() {
  const { sections, loading, error, reload } = useSections();
  const [user, setUser] = useState<User | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [sectionForm, setSectionForm] = useState({ slug: "", title: "", description: "", position: 0 });
  const [resourceForm, setResourceForm] = useState({ sectionId: "", label: "", url: "", blurb: "", position: 0 });

  const loadUser = async () => {
    const res = await fetch("/api/auth/me", { credentials: "include" });
    const data = await res.json();
    setUser(data.user);
  };

  useEffect(() => {
    loadUser();
  }, []);

  const onLogin = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(credentials),
      });
      if (!res.ok) throw new Error("Invalid username or password");
      const data = await res.json();
      setUser(data.user);
    } catch (err) {
      setAuthError((err as Error).message);
    }
  };

  const onLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setUser(null);
  };

  const submitSection = async (e: FormEvent) => {
    e.preventDefault();
    const payload = { ...sectionForm, position: Number(sectionForm.position) };
    await fetch("/api/sections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    setSectionForm({ slug: "", title: "", description: "", position: 0 });
    reload();
  };

  const submitResource = async (e: FormEvent) => {
    e.preventDefault();
    const payload = {
      ...resourceForm,
      sectionId: Number(resourceForm.sectionId),
      position: Number(resourceForm.position),
    };
    await fetch("/api/resources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    setResourceForm({ sectionId: "", label: "", url: "", blurb: "", position: 0 });
    reload();
  };

  return (
    <div className="wrap">
      <header>
        <div className="kicker">
          <div className="pill">Admin console</div>
          <div className="pill">MySQL-backed</div>
        </div>
        <h1>Manage Saab link data</h1>
        <p className="sub">Create sections, add links, and keep the main page updated without redeploying the site.</p>
      </header>

      {!user && (
        <form className="card" onSubmit={onLogin}>
          <h2>Sign in</h2>
          {authError && <div className="callout error">{authError}</div>}
          <label>
            Username
            <input
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            />
          </label>
          <button type="submit">Login</button>
        </form>
      )}

      {user && (
        <div className="card">
          <div className="kicker">
            Signed in as <b>{user.username}</b> ({user.role})
          </div>
          <button onClick={onLogout}>Log out</button>
        </div>
      )}

      {user && user.role === "admin" && (
        <>
          <form className="card" onSubmit={submitSection}>
            <h3>Add section</h3>
            <label>
              Slug
              <input value={sectionForm.slug} onChange={(e) => setSectionForm({ ...sectionForm, slug: e.target.value })} />
            </label>
            <label>
              Title
              <input value={sectionForm.title} onChange={(e) => setSectionForm({ ...sectionForm, title: e.target.value })} />
            </label>
            <label>
              Description
              <textarea
                value={sectionForm.description}
                onChange={(e) => setSectionForm({ ...sectionForm, description: e.target.value })}
              />
            </label>
            <label>
              Position
              <input
                type="number"
                value={sectionForm.position}
                onChange={(e) => setSectionForm({ ...sectionForm, position: Number(e.target.value) })}
              />
            </label>
            <button type="submit">Save section</button>
          </form>

          <form className="card" onSubmit={submitResource}>
            <h3>Add resource</h3>
            <label>
              Section
              <select
                value={resourceForm.sectionId}
                onChange={(e) => setResourceForm({ ...resourceForm, sectionId: e.target.value })}
              >
                <option value="">Choose a section</option>
                {sections.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Label
              <input value={resourceForm.label} onChange={(e) => setResourceForm({ ...resourceForm, label: e.target.value })} />
            </label>
            <label>
              URL
              <input value={resourceForm.url} onChange={(e) => setResourceForm({ ...resourceForm, url: e.target.value })} />
            </label>
            <label>
              Blurb
              <textarea
                value={resourceForm.blurb}
                onChange={(e) => setResourceForm({ ...resourceForm, blurb: e.target.value })}
              />
            </label>
            <label>
              Position
              <input
                type="number"
                value={resourceForm.position}
                onChange={(e) => setResourceForm({ ...resourceForm, position: Number(e.target.value) })}
              />
            </label>
            <button type="submit">Save resource</button>
          </form>
        </>
      )}

      <div className="card">
        <div className="card-header">
          <h3>Preview</h3>
          <p className="muted">Current section and link data.</p>
        </div>
        {loading && <Loader />}
        {error && <div className="callout error">{error}</div>}
        {!loading && (
          <ul>
            {sections.map((section) => (
              <li key={section.id}>
                <b>{section.title}</b> ({section.slug}) — {section.resources?.length ?? 0} links
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route
          path="*"
          element={
            <>
              <Home />
              <div className="wrap">
                <div className="card">
                  <h3>Want to edit?</h3>
                  <p className="muted">Visit the <Link to="/admin">admin console</Link> to manage MySQL-backed content.</p>
                </div>
              </div>
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
