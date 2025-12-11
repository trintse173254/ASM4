import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createArticle, updateArticle, deleteArticle } from '../../store/slices/articleSlice';

const ManageArticles = () => {
  const dispatch = useDispatch();
  const { list: articles } = useSelector((state) => state.articles);
  const [articleForm, setArticleForm] = useState({ title: '', body: '' });
  const [editingArticleId, setEditingArticleId] = useState(null);
  const [editingArticleForm, setEditingArticleForm] = useState({ title: '', body: '' });

  const handleCreateArticle = (e) => {
    e.preventDefault();
    dispatch(createArticle(articleForm)).then(() => {
      setArticleForm({ title: '', body: '' });
    });
  };

  const startEditArticle = (article) => {
    setEditingArticleId(article._id);
    setEditingArticleForm({ title: article.title, body: article.body });
  };

  const handleUpdateArticle = (e) => {
    e.preventDefault();
    if (!editingArticleId) return;
    dispatch(
      updateArticle({
        id: editingArticleId,
        title: editingArticleForm.title,
        body: editingArticleForm.body
      })
    ).then(() => {
      setEditingArticleId(null);
      setEditingArticleForm({ title: '', body: '' });
    });
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="fw-bold">Manage Articles</h2>
        <p className="text-muted">Create and manage educational content</p>
      </div>

      <div className="row g-4">
        {/* Create/Edit Form */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm sticky-top" style={{ top: '20px' }}>
            <div className="card-body">
              <h5 className="card-title fw-bold mb-3">
                {editingArticleId ? '✏️ Edit Article' : '➕ Add New Article'}
              </h5>
              <form onSubmit={editingArticleId ? handleUpdateArticle : handleCreateArticle}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Article Title</label>
                  <input
                    className="form-control"
                    placeholder="Enter article title..."
                    value={editingArticleId ? editingArticleForm.title : articleForm.title}
                    onChange={(e) =>
                      editingArticleId
                        ? setEditingArticleForm({ ...editingArticleForm, title: e.target.value })
                        : setArticleForm({ ...articleForm, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Content</label>
                  <textarea
                    className="form-control"
                    rows="10"
                    placeholder="Write your article content here..."
                    value={editingArticleId ? editingArticleForm.body : articleForm.body}
                    onChange={(e) =>
                      editingArticleId
                        ? setEditingArticleForm({ ...editingArticleForm, body: e.target.value })
                        : setArticleForm({ ...articleForm, body: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-primary flex-grow-1" type="submit">
                    {editingArticleId ? 'Save Changes' : 'Add Article'}
                  </button>
                  {editingArticleId && (
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => {
                        setEditingArticleId(null);
                        setEditingArticleForm({ title: '', body: '' });
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Articles List */}
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title fw-bold mb-3">Published Articles ({articles.length})</h5>
              {articles.length === 0 ? (
                <div className="text-center py-5">
                  <div className="mb-3" style={{ fontSize: '3rem' }}>📰</div>
                  <p className="text-muted">No articles yet. Create your first article!</p>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {articles.map((article) => (
                    <div key={article._id} className="list-group-item px-0 py-3">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1 me-3">
                          <h6 className="mb-2 fw-semibold">{article.title}</h6>
                          <p className="text-muted mb-2 small" style={{ 
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {article.body}
                          </p>
                          <small className="text-muted">
                            {new Date(article.createdAt).toLocaleDateString()}
                          </small>
                        </div>
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-secondary"
                            onClick={() => startEditArticle(article)}
                            title="Edit Article"
                          >
                            <span>✏️</span>
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this article?')) {
                                dispatch(deleteArticle(article._id));
                              }
                            }}
                            title="Delete Article"
                          >
                            <span>🗑️</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageArticles;

