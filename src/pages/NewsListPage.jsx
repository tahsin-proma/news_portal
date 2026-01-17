import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { NewsService } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Loading";

const NewsListPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { user: currentUser } = useAuth();

  useEffect(() => {
    NewsService.getAllNews()
      .then(setNews)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (e, id) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to remove this story?")) {
      await NewsService.deleteNews(id);
      setNews(news.filter((n) => n.id !== id));
    }
  };

  const filteredNews = news.filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Loading />;

  const featured = filteredNews[0];
  const others = filteredNews.slice(1);

  return (
    <div className="container animate-enter" style={{ padding: "2rem 1rem" }}>
      {/* Search Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="flex-col">
          <h2 className="text-gradient" style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>Welcome back.</h2>
          <p className="text-muted">Here is what happened while you were away.</p>
        </div>
        <div style={{ position: "relative", width: "100%", maxWidth: "400px", flex: '1 1 300px' }}>
          <input
            type="text"
            className="input-field"
            placeholder="Search stories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ borderRadius: '99px', paddingLeft: '3rem', background: 'var(--bg-card)', width: '100%' }}
          />
          <span style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}>🔍</span>
        </div>
      </div>

      {!search && featured && (
        <section className="mb-12">
          <Link to={`/news/${featured.id}`} className="card" style={{ padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Featured Image - Responsive Aspect Ratio */}
            <div style={{ width: '100%', minHeight: '250px', maxHeight: '500px', height: 'auto', overflow: 'hidden' }}>
              <img
                src={featured.image || "https://images.unsplash.com/photo-1585829365234-781fcd04c838?auto=format&fit=crop&w=1200&q=80"}
                alt={featured.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              />
            </div>

            <div className="card-body" style={{ padding: 'clamp(1.5rem, 4vw, 3rem)' }}>
              <div className="flex-between mb-4">
                <span className="badge" style={{ background: 'var(--primary)', color: 'white', border: 'none' }}>Featured</span>
                <span className="text-sm text-dim">{new Date(featured.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
              </div>
              <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', marginBottom: '1rem', lineHeight: 1.1 }}>{featured.title}</h1>
              <p className="text-muted" style={{ fontSize: '1.1rem', maxWidth: '800px', marginBottom: '2rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {featured.body}
              </p>
              <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
                <div className="flex-center gap-3">
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', flexShrink: 0 }} className="flex-center font-bold">
                    {featured.author?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontWeight: 600 }}>{featured.author?.name}</span>
                </div>
                <span style={{ color: 'var(--primary)', fontWeight: 700 }}>Read full story →</span>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Responsive Grid System using Auto-Fit */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {(search ? filteredNews : others).map((item) => (
          <Link to={`/news/${item.id}`} key={item.id} className="card flex-col" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ width: '100%', aspectRatio: '16/9', overflow: 'hidden', borderTopLeftRadius: 'var(--radius-md)', borderTopRightRadius: 'var(--radius-md)' }}>
              <img
                src={item.image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80"}
                alt={item.title}
                style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
                onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
            </div>

            <div className="card-body flex-col" style={{ flex: 1, padding: '1.5rem' }}>
              <div className="flex-between mb-3">
                <span className="badge">News</span>
                <span className="text-sm text-dim">
                  {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Just now"}
                </span>
              </div>

              <h3 className="mb-3" style={{ fontSize: "1.25rem", lineHeight: 1.3 }}>
                {item.title}
              </h3>

              <p className="text-muted mb-6" style={{ fontSize: "0.9rem", flex: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                {item.body}
              </p>

              <div className="flex-between pt-4" style={{ borderTop: "1px solid var(--border-light)", marginTop: 'auto' }}>
                <div className="flex-center gap-2">
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)', fontSize: '10px', fontWeight: 'bold', flexShrink: 0 }} className="flex-center">
                    {item.author?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium truncate" style={{ maxWidth: '120px' }}>{item.author?.name || "Editor"}</span>
                </div>

                {((currentUser && item.author?.id && String(currentUser.id) === String(item.author.id)) ||
                  (currentUser && currentUser.role === "admin")) && (
                    <div className="flex gap-3" onClick={(e) => e.preventDefault()}>
                      <Link to={`/edit/${item.id}`} className="text-sm text-dim hover:text-white">Edit</Link>
                      <button onClick={(e) => handleDelete(e, item.id)} className="text-sm" style={{ color: 'var(--danger)' }}> Delete</button>
                    </div>
                  )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredNews.length === 0 && (
        <div style={{ textAlign: "center", padding: "6rem 1rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem", opacity: 0.2 }}>🏜️</div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No stories found</h3>
          <p className="text-muted">We couldn't find any stories matching your search.</p>
          <button onClick={() => setSearch("")} className="btn btn-primary mt-8">Clear filters</button>
        </div>
      )}
    </div>
  );
};

export default NewsListPage;