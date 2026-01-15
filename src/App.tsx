import { FormEvent, useEffect, useState } from "react";
import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import FlaggedDiv from "./FlaggedDiv";

type Article = {
  id: number;
  title: string;
  summary: string;
  issue: string | null;
  pageRange: string | null;
};

type User = {
  id: number;
  username: string;
  role: "admin" | "editor" | "viewer";
};

type AdminArticleForm = {
  title: string;
  summary: string;
  content: string;
  issueTitle: string;
  publishedAt: string;
  pageRange: string;
};

const emptyArticleForm: AdminArticleForm = {
  title: "",
  summary: "",
  content: "",
  issueTitle: "",
  publishedAt: "",
  pageRange: "",
};

const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  const loadUser = async () => {
    const res = await fetch("/api/auth/me", { credentials: "include" });
    const data = await res.json();
    setUser(data.user);
  };

  useEffect(() => {
    loadUser();
  }, []);

  return { user, setUser, reload: loadUser };
};

type UseArticlesOptions = {
  endpoint: string;
  includeCredentials?: boolean;
  enabled?: boolean;
};

const useArticles = ({ endpoint, includeCredentials = false, enabled = true }: UseArticlesOptions) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadArticles = async (query?: string) => {
    if (!enabled) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (query) {
        params.set("q", query);
      }
      const suffix = params.toString() ? `?${params.toString()}` : "";
      const res = await fetch(`${endpoint}${suffix}`, {
        credentials: includeCredentials ? "include" : "same-origin",
      });
      if (!res.ok) throw new Error("Unable to load articles");
      const data = (await res.json()) as Article[];
      setArticles(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (enabled) {
      loadArticles();
    }
  }, [enabled, endpoint]);

  return { articles, loading, error, loadArticles };
};

const ArticleMeta = ({ issue, pageRange }: Pick<Article, "issue" | "pageRange">) => {
  if (!issue && !pageRange) {
    return <span className="muted">Metadata pending</span>;
  }

  return (
    <span className="muted">
      {issue ? `Issue: ${issue}` : "Issue: unknown"}
      {pageRange ? ` • Pages ${pageRange}` : ""}
    </span>
  );
};

function UserExperience() {
  const { articles, loading, error, loadArticles } = useArticles({
    endpoint: "/api/articles",
  });
  const [query, setQuery] = useState("");

  const onSearch = async (event: FormEvent) => {
    event.preventDefault();
    await loadArticles(query.trim());
  };

  return (
    <FlaggedDiv className="page">
      <header className="hero">
        <FlaggedDiv className="hero-content">
          <FlaggedDiv className="eyebrow">Saab Technical Archive</FlaggedDiv>
          <h1>Find the right repair guidance, fast.</h1>
          <p className="lead">
            Search scanned magazine articles, workshop guides, and technical bulletins from the Saab community. Each result links
            back to the original issue and page so owners can verify every answer.
          </p>
          <FlaggedDiv className="cta">
            <Link className="primary" to="/admin">
              Admin console
            </Link>
            <a className="secondary" href="#how-it-works">
              How it works
            </a>
          </FlaggedDiv>
        </FlaggedDiv>
      </header>

      <main>
        <section className="card">
          <h2>Search the archive</h2>
          <form className="search" onSubmit={onSearch}>
            <label htmlFor="query">Search query</label>
            <FlaggedDiv className="search-row">
              <input
                id="query"
                placeholder="Try: ‘900 turbo APC valve adjustment’"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <button type="submit">Search</button>
            </FlaggedDiv>
          </form>
          {loading && <p className="muted">Searching…</p>}
          {error && <p className="error">{error}</p>}
          {!loading && !error && articles.length === 0 && (
            <p className="muted">No matches yet. Try another term or check the latest additions below.</p>
          )}
          {articles.length > 0 && (
            <ul className="results">
              {articles.map((article) => (
                <li key={article.id}>
                  <FlaggedDiv className="result-card">
                    <h3>{article.title}</h3>
                    <p>{article.summary}</p>
                    <ArticleMeta issue={article.issue} pageRange={article.pageRange} />
                  </FlaggedDiv>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section id="how-it-works" className="card">
          <h2>How it works</h2>
          <FlaggedDiv className="grid">
            <article>
              <h3>1. Scan &amp; index</h3>
              <p>We OCR every magazine page and store metadata like issue, page number, and model coverage.</p>
            </article>
            <article>
              <h3>2. Semantic search</h3>
              <p>Vector embeddings find answers even when the wording in the magazine is different from your question.</p>
            </article>
            <article>
              <h3>3. Verified sources</h3>
              <p>Every suggestion links back to the original article so owners can verify the guidance themselves.</p>
            </article>
          </FlaggedDiv>
        </section>
      </main>
    </FlaggedDiv>
  );
}

function AdminExperience() {
  const { user, setUser } = useAuth();
  const { articles, loading, error, loadArticles } = useArticles({
    endpoint: "/api/admin/articles",
    includeCredentials: true,
    enabled: Boolean(user),
  });
  const [authError, setAuthError] = useState<string | null>(null);
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [articleForm, setArticleForm] = useState<AdminArticleForm>(emptyArticleForm);

  const onLogin = async (event: FormEvent) => {
    event.preventDefault();
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

  const submitArticle = async (event: FormEvent) => {
    event.preventDefault();
    await fetch("/api/admin/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(articleForm),
    });
    setArticleForm(emptyArticleForm);
    await loadArticles();
  };

  return (
    <FlaggedDiv className="page">
      <header className="hero">
        <FlaggedDiv className="hero-content">
          <FlaggedDiv className="eyebrow">Admin Console</FlaggedDiv>
          <h1>Manage the archive pipeline.</h1>
          <p className="lead">
            Track OCR ingestion, add new articles, and keep the Saab knowledge base ready for owners worldwide.
          </p>
          <FlaggedDiv className="cta">
            <Link className="secondary" to="/">
              Back to search
            </Link>
          </FlaggedDiv>
        </FlaggedDiv>
      </header>

      <main>
        {!user && (
          <section className="card">
            <h2>Sign in</h2>
            {authError && <p className="error">{authError}</p>}
            <form className="form" onSubmit={onLogin}>
              <label>
                Username
                <input
                  value={credentials.username}
                  onChange={(event) => setCredentials({ ...credentials, username: event.target.value })}
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  value={credentials.password}
                  onChange={(event) => setCredentials({ ...credentials, password: event.target.value })}
                />
              </label>
              <button type="submit">Log in</button>
            </form>
          </section>
        )}

        {user && (
          <section className="card">
            <FlaggedDiv className="card-header">
              <h2>Welcome, {user.username}</h2>
              <button type="button" onClick={onLogout}>
                Log out
              </button>
            </FlaggedDiv>
            <p className="muted">Role: {user.role}</p>
          </section>
        )}

        {user && user.role === "admin" && (
          <section className="card">
            <h2>Add a new article</h2>
            <form className="form" onSubmit={submitArticle}>
              <label>
                Article title
                <input
                  value={articleForm.title}
                  onChange={(event) => setArticleForm({ ...articleForm, title: event.target.value })}
                />
              </label>
              <label>
                Summary
                <textarea
                  value={articleForm.summary}
                  onChange={(event) => setArticleForm({ ...articleForm, summary: event.target.value })}
                />
              </label>
              <label>
                Full text
                <textarea
                  value={articleForm.content}
                  onChange={(event) => setArticleForm({ ...articleForm, content: event.target.value })}
                />
              </label>
              <FlaggedDiv className="split">
                <label>
                  Issue title
                  <input
                    value={articleForm.issueTitle}
                    onChange={(event) => setArticleForm({ ...articleForm, issueTitle: event.target.value })}
                  />
                </label>
                <label>
                  Published date
                  <input
                    type="date"
                    value={articleForm.publishedAt}
                    onChange={(event) => setArticleForm({ ...articleForm, publishedAt: event.target.value })}
                  />
                </label>
              </FlaggedDiv>
              <label>
                Page range
                <input
                  placeholder="e.g. 24-29"
                  value={articleForm.pageRange}
                  onChange={(event) => setArticleForm({ ...articleForm, pageRange: event.target.value })}
                />
              </label>
              <button type="submit">Save article</button>
            </form>
          </section>
        )}

        <section className="card">
          <h2>Latest archive entries</h2>
          {!user && <p className="muted">Sign in to see the latest admin entries.</p>}
          {loading && <p className="muted">Loading entries…</p>}
          {error && <p className="error">{error}</p>}
          {!loading && articles.length === 0 && <p className="muted">No articles yet. Add the first one above.</p>}
          {articles.length > 0 && (
            <ul className="results">
              {articles.map((article) => (
                <li key={article.id}>
                  <FlaggedDiv className="result-card">
                    <h3>{article.title}</h3>
                    <p>{article.summary}</p>
                    <ArticleMeta issue={article.issue} pageRange={article.pageRange} />
                  </FlaggedDiv>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </FlaggedDiv>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminExperience />} />
        <Route path="*" element={<UserExperience />} />
      </Routes>
    </Router>
  );
}

export default App;
