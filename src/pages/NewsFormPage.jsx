import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { NewsService } from "../services/api";

const NewsFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ title: "", body: "", image: "" });

  useEffect(() => {
    if (id) {
      NewsService.getNewsById(id).then((data) => {
        setFormData({ title: data.title, body: data.body, image: data.image || "" });
      });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.body.length < 20) {
      alert("Content must be at least 20 characters.");
      return;
    }

    try {
      if (id) {
        await NewsService.updateNews(id, formData);
      } else {
        await NewsService.createNews({
          ...formData,
        });
      }
      navigate("/");
    } catch (error) {
      alert("Failed to save article");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container animate-enter" style={{ padding: '2rem 1rem' }}>
      <div className="card" style={{ maxWidth: "800px", width: "100%", margin: "0 auto", padding: 'clamp(1.5rem, 5vw, 3rem)' }}>
        <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: '2rem', fontWeight: 800 }}>{id ? "Edit Story" : "Publish New Story"}</h2>

        <form onSubmit={handleSubmit} className="flex-col gap-6">
          <div className="flex-col gap-2">
            <label className="text-xs font-bold text-muted uppercase">Headline</label>
            <input
              type="text"
              name="title"
              className="input-field"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter a captivating headline"
              style={{ fontSize: '1.1rem', padding: '1rem' }}
            />
          </div>

          <div className="flex-col gap-2">
            <label className="text-xs font-bold text-muted uppercase">Cover Image URL</label>
            <input
              type="url"
              name="image"
              className="input-field"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
            <span className="text-xs text-muted">Provide a direct link to an image (optional)</span>
          </div>

          <div className="flex-col gap-2">
            <label className="text-xs font-bold text-muted uppercase">Content</label>
            <textarea
              className="input-field"
              name="body"
              rows="12"
              value={formData.body}
              onChange={handleChange}
              required
              placeholder="Write your story here..."
              style={{ lineHeight: 1.6, resize: 'vertical', minHeight: '200px' }}
            ></textarea>
            <div style={{ textAlign: 'right', fontSize: '0.8rem', color: formData.body.length < 20 ? 'var(--danger)' : 'var(--success)' }}>
              {formData.body.length} / 20 characters minimum
            </div>
          </div>

          <div className="flex-between" style={{ paddingTop: '2rem', borderTop: '1px solid var(--border-light)', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="btn btn-outline"
              style={{ flex: '1 1 auto' }}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem', flex: '1 1 auto' }}>
              {id ? "Update Story" : "Publish Story"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewsFormPage;