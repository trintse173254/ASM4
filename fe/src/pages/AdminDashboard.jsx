import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchQuizzes,
  fetchQuizById,
  createQuiz,
  deleteQuiz,
  createQuestion,
  deleteQuestion
} from '../store/slices/quizSlice';
import {
  fetchArticles,
  createArticle,
  updateArticle,
  deleteArticle
} from '../store/slices/articleSlice';
import { logout } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { list: quizzes, current } = useSelector((state) => state.quizzes);
  const { list: articles } = useSelector((state) => state.articles);
  const [tab, setTab] = useState('home');
  const [quizForm, setQuizForm] = useState({ title: '', description: '' });
  const [questionForm, setQuestionForm] = useState({
    text: '',
    options: ['', '', '', ''],
    correctIndex: 0
  });
  const [articleForm, setArticleForm] = useState({ title: '', body: '' });

  useEffect(() => {
    dispatch(fetchQuizzes());
    dispatch(fetchArticles());
  }, [dispatch]);

  const handleCreateQuiz = (e) => {
    e.preventDefault();
    dispatch(createQuiz(quizForm)).then(() => setQuizForm({ title: '', description: '' }));
  };

  const handleSelectQuiz = (id) => {
    dispatch(fetchQuizById(id));
    setTab('questions');
  };

  const handleCreateQuestion = (e) => {
    e.preventDefault();
    if (!current?._id) return;
    dispatch(
      createQuestion({
        quizId: current._id,
        text: questionForm.text,
        options: questionForm.options,
        correctIndex: Number(questionForm.correctIndex)
      })
    ).then(() =>
      setQuestionForm({ text: '', options: ['', '', '', ''], correctIndex: 0 })
    );
  };

  const handleCreateArticle = (e) => {
    e.preventDefault();
    dispatch(createArticle(articleForm)).then(() => setArticleForm({ title: '', body: '' }));
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Admin Dashboard</h2>
        <div>
          <span className="me-3">Welcome, {user?.username}</span>
          <button className="btn btn-outline-secondary btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${tab === 'home' ? 'active' : ''}`}
            onClick={() => setTab('home')}
          >
            Home
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${tab === 'quizzes' ? 'active' : ''}`}
            onClick={() => setTab('quizzes')}
          >
            Manage Quizzes
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${tab === 'questions' ? 'active' : ''}`}
            onClick={() => setTab('questions')}
            disabled={!current}
          >
            Manage Questions
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${tab === 'articles' ? 'active' : ''}`}
            onClick={() => setTab('articles')}
          >
            Manage Articles
          </button>
        </li>
      </ul>

      {tab === 'home' && <p>Select a tab to manage content.</p>}

      {tab === 'quizzes' && (
        <div className="row g-3">
          <div className="col-md-5">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Add Quiz</h5>
                <form onSubmit={handleCreateQuiz}>
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                      className="form-control"
                      value={quizForm.title}
                      onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <input
                      className="form-control"
                      value={quizForm.description}
                      onChange={(e) => setQuizForm({ ...quizForm, description: e.target.value })}
                    />
                  </div>
                  <button className="btn btn-primary">Add Quiz</button>
                </form>
              </div>
            </div>
          </div>
          <div className="col-md-7">
            <h5>Existing Quizzes</h5>
            <div className="list-group">
              {quizzes.map((q) => (
                <div
                  key={q._id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <div className="fw-semibold">{q.title}</div>
                    <small className="text-muted">{q.description}</small>
                  </div>
                  <div className="btn-group btn-group-sm">
                    <button className="btn btn-outline-primary" onClick={() => handleSelectQuiz(q._id)}>
                      Questions
                    </button>
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => dispatch(deleteQuiz(q._id))}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {!quizzes.length && <p className="mb-0">No quizzes yet.</p>}
            </div>
          </div>
        </div>
      )}

      {tab === 'questions' && current && (
        <div className="row g-3">
          <div className="col-md-5">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Add Question to {current.title}</h5>
                <form onSubmit={handleCreateQuestion}>
                  <div className="mb-2">
                    <label className="form-label">Question Text</label>
                    <input
                      className="form-control"
                      value={questionForm.text}
                      onChange={(e) => setQuestionForm({ ...questionForm, text: e.target.value })}
                      required
                    />
                  </div>
                  {questionForm.options.map((opt, idx) => (
                    <div className="mb-2" key={idx}>
                      <label className="form-label">Option {idx + 1}</label>
                      <input
                        className="form-control"
                        value={opt}
                        onChange={(e) => {
                          const opts = [...questionForm.options];
                          opts[idx] = e.target.value;
                          setQuestionForm({ ...questionForm, options: opts });
                        }}
                        required
                      />
                    </div>
                  ))}
                  <div className="mb-3">
                    <label className="form-label">Correct Answer Index (0-based)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={questionForm.correctIndex}
                      onChange={(e) => setQuestionForm({ ...questionForm, correctIndex: e.target.value })}
                      min="0"
                      max={questionForm.options.length - 1}
                      required
                    />
                  </div>
                  <button className="btn btn-primary">Add Question</button>
                </form>
              </div>
            </div>
          </div>
          <div className="col-md-7">
            <h5>Questions</h5>
            <div className="list-group">
              {current.questions?.map((q) => (
                <div key={q._id} className="list-group-item">
                  <div className="d-flex justify-content-between">
                    <div>
                      <div className="fw-semibold">{q.text}</div>
                      <ul className="mb-1">
                        {q.options.map((o, i) => (
                          <li key={i}>
                            {o} {i === q.correctIndex && <span className="badge bg-success">Correct</span>}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => dispatch(deleteQuestion(q._id))}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {!current.questions?.length && <p className="mb-0">No questions yet.</p>}
            </div>
          </div>
        </div>
      )}

      {tab === 'articles' && (
        <div className="row g-3">
          <div className="col-md-5">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Add Article</h5>
                <form onSubmit={handleCreateArticle}>
                  <div className="mb-2">
                    <label className="form-label">Title</label>
                    <input
                      className="form-control"
                      value={articleForm.title}
                      onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Body</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      value={articleForm.body}
                      onChange={(e) => setArticleForm({ ...articleForm, body: e.target.value })}
                      required
                    />
                  </div>
                  <button className="btn btn-primary">Add Article</button>
                </form>
              </div>
            </div>
          </div>
          <div className="col-md-7">
            <h5>Articles</h5>
            <div className="list-group">
              {articles.map((a) => (
                <div
                  key={a._id}
                  className="list-group-item d-flex justify-content-between align-items-start"
                >
                  <div>
                    <div className="fw-semibold">{a.title}</div>
                    <p className="mb-1 text-muted">{a.body}</p>
                  </div>
                  <div className="btn-group btn-group-sm">
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => dispatch(updateArticle({ id: a._id, title: a.title, body: a.body }))}
                    >
                      Refresh
                    </button>
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => dispatch(deleteArticle(a._id))}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {!articles.length && <p className="mb-0">No articles yet.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

