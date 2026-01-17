import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { NewsService } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Loading";

const NewsDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newsData, commentsData] = await Promise.all([
          NewsService.getNewsById(id),
          NewsService.getComments(id)
        ]);
        setArticle(newsData);
        setComments(commentsData);
        window.scrollTo(0, 0);
      } catch (error) {
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleDeleteArticle = async () => {
    if (window.confirm("Are you sure you want to delete this story?")) {
      try {
        await NewsService.deleteNews(id);
        navigate("/");
      } catch (error) {
        alert("Failed to delete article");
      }
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmitting(true);
    try {
      const newComment = await NewsService.createComment(id, { text: commentText });
      setComments([newComment, ...comments]);
      setCommentText("");
    } catch (error) {
      alert("Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;
  if (!article) return null;

  const isAuthor = user && (String(user.id) === String(article.author?.id) || user.role === 'admin');

  return (
    <div className="animate-enter">
      {/* Hero Image Header - Height scales with viewport width */}
      <div style={{ position: 'relative', width: '100%', height: 'clamp(300px, 50vh, 600px)', overflow: 'hidden' }}>
        <img
          src={article.image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1600&q=80"}
          alt={article.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, var(--bg-body) 0%, rgba(11, 15, 25, 0.6) 60%, rgba(11, 15, 25, 0.2) 100%)'
        }} />

        <div className="container" style={{ position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)', width: '100%', padding: '2rem 1rem' }}>
          <div className="flex-col gap-4">
            <span className="badge" style={{ background: '#3b82f6', color: 'white', border: 'none', width: 'fit-content' }}>Trending Analysis</span>
            <h1 style={{
              fontSize: 'clamp(2rem, 5vw, 4.5rem)',
              lineHeight: 1.1,
              letterSpacing: '-0.04em',
              maxWidth: '900px',
              textShadow: '0 4px 20px rgba(0,0,0,0.5)'
            }}>
              {article.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Layout - Using Flex Wrap for Mobile Responsiveness instead of Fixed Grid */}
      <main className="container" style={{ padding: '3rem 1rem', display: 'flex', flexWrap: 'wrap', gap: '4rem' }}>

        {/* Content Column - Flex Grow to take space, but shrink on mobile */}
        <div className="flex-col pb-12" style={{ flex: '2 1 600px', minWidth: '0' }}>
          <div className="flex-between mb-12" style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '2rem', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div className="flex-center gap-4">
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--accent-gradient)', flexShrink: 0 }} className="flex-center font-bold fs-5">
                {article.author?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-col">
                <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{article.author?.name}</span>
                <span className="text-dim text-sm">Senior Correspondent</span>
              </div>
            </div>
            <div className="flex-col" style={{ textAlign: 'left' }}>
              <span className="text-dim text-sm uppercase tracking-widest font-bold">Published</span>
              <span style={{ fontWeight: 500 }}>{new Date(article.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
            </div>
          </div>

          <article style={{ fontSize: '1.15rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.9)', letterSpacing: '0.01em' }}>
            {article.body.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-6">{paragraph}</p>
            ))}
          </article>

          {/* Meta Actions */}
          <div className="flex-between mt-8 pt-8" style={{ borderTop: '1px solid var(--border-light)', flexWrap: 'wrap', gap: '2rem' }}>
            <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
              <button className="text-muted hover:text-white" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>Share Story</button>
              <button className="text-muted hover:text-white" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>Save to List</button>
            </div>
            {isAuthor && (
              <div className="flex gap-3">
                <Link to={`/edit/${id}`} className="btn btn-outline text-sm">Edit</Link>
                <button onClick={handleDeleteArticle} className="btn btn-danger text-sm">Delete</button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Column - Drops below content on mobile */}
        <aside className="flex-col gap-8" style={{ flex: '1 1 300px' }}>
          <div className="card" style={{ padding: '2rem' }}>
            <h3 className="mb-6" style={{ fontSize: '1.25rem' }}>Discussion</h3>
            <form onSubmit={handleCommentSubmit} className="flex-col gap-4">
              <textarea
                className="input-field"
                rows="3"
                placeholder="Thoughts on this story?"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                style={{ borderRadius: 'var(--radius-md)', padding: '1rem', resize: 'vertical' }}
              ></textarea>
              <button
                type="submit"
                disabled={submitting || !commentText.trim()}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                {submitting ? "Publishing..." : "Post comment"}
              </button>
            </form>

            <div className="mt-8 flex-col gap-6">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-4 pt-6" style={{ borderTop: '1px solid var(--border-light)' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-input)', border: '1px solid var(--border-light)', flexShrink: 0 }} className="flex-center text-xs">
                    {comment.user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-col">
                    <div className="flex-center gap-2 mb-1" style={{ flexWrap: 'wrap' }}>
                      <span className="text-sm font-bold">{comment.user?.name}</span>
                      <span className="text-xs text-dim">• {new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-dim" style={{ wordBreak: 'break-word' }}>{comment.text}</p>
                  </div>
                </div>
              ))}
              {comments.length === 0 && (
                <p className="text-dim text-sm text-center py-4">No comments yet. Start the conversation.</p>
              )}
            </div>
          </div>

          <div className="flex-col gap-4 hide-on-mobile-small">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Next in Briefing</span>
            <div className="card" style={{ padding: '1.5rem', cursor: 'pointer' }}>
              <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', lineHeight: 1.4 }}>Global Markets React to New Tech Policy</h4>
              <span className="text-xs text-dim">3 min read • Today</span>
            </div>
            <div className="card" style={{ padding: '1.5rem', cursor: 'pointer' }}>
              <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', lineHeight: 1.4 }}>The Future of Renewable Energy in Cities</h4>
              <span className="text-xs text-dim">5 min read • Yesterday</span>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default NewsDetailPage;