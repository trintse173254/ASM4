import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchQuizzes } from '../store/slices/quizSlice';
import { fetchArticles } from '../store/slices/articleSlice';
import { logout } from '../store/slices/authSlice';

const UserDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { list: quizzes } = useSelector((state) => state.quizzes);
  const { list: articles } = useSelector((state) => state.articles);
  const [tab, setTab] = useState('home');

  useEffect(() => {
    dispatch(fetchQuizzes());
    dispatch(fetchArticles());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Dashboard</h2>
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
            className={`nav-link ${tab === 'quiz' ? 'active' : ''}`}
            onClick={() => setTab('quiz')}
          >
            Quiz
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${tab === 'articles' ? 'active' : ''}`}
            onClick={() => setTab('articles')}
          >
            Articles
          </button>
        </li>
      </ul>

      {tab === 'home' && (
        <div className="p-3 bg-light rounded border">
          <p>Select a quiz from the Quiz tab to get started.</p>
        </div>
      )}

      {tab === 'quiz' && (
        <div className="row g-3">
          {quizzes.map((q) => (
            <div className="col-md-6" key={q._id}>
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{q.title}</h5>
                  <p className="card-text text-muted">{q.description}</p>
                  <Link className="btn btn-primary" to={`/dashboard/quiz/${q._id}`}>
                    Start Quiz
                  </Link>
                </div>
              </div>
            </div>
          ))}
          {!quizzes.length && <p>No quizzes available yet.</p>}
        </div>
      )}

      {tab === 'articles' && (
        <div className="list-group">
          {articles.map((a) => (
            <div className="list-group-item" key={a._id}>
              <h6>{a.title}</h6>
              <p className="mb-0 text-muted">{a.body}</p>
            </div>
          ))}
          {!articles.length && <p>No articles yet.</p>}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;

