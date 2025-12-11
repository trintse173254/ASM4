import { useSelector } from 'react-redux';

const Home = () => {
  const { list: quizzes } = useSelector((state) => state.quizzes);
  const { list: articles } = useSelector((state) => state.articles);

  const totalQuestions = quizzes.reduce((sum, quiz) => sum + (quiz.questions?.length || 0), 0);

  const stats = [
    { title: 'Total Quizzes', value: quizzes.length, icon: '📝', color: 'primary' },
    { title: 'Total Questions', value: totalQuestions, icon: '❓', color: 'success' },
    { title: 'Total Articles', value: articles.length, icon: '📰', color: 'info' }
  ];

  return (
    <div>
      <div className="mb-4">
        <h2 className="fw-bold">Dashboard Overview</h2>
        <p className="text-muted">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        {stats.map((stat, index) => (
          <div key={index} className="col-md-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="text-muted mb-1 small">{stat.title}</p>
                    <h3 className="fw-bold mb-0">{stat.value}</h3>
                  </div>
                  <div 
                    className={`bg-${stat.color} bg-opacity-10 rounded-3 p-3`}
                    style={{ fontSize: '1.5rem' }}
                  >
                    {stat.icon}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h5 className="card-title fw-bold mb-3">Quick Start Guide</h5>
          <div className="list-group list-group-flush">
            <div className="list-group-item px-0 border-0">
              <div className="d-flex align-items-center">
                <span className="me-3 fs-4">1️⃣</span>
                <div>
                  <div className="fw-semibold">Create Quizzes</div>
                  <small className="text-muted">Start by creating quizzes in the Manage Quizzes section</small>
                </div>
              </div>
            </div>
            <div className="list-group-item px-0 border-0">
              <div className="d-flex align-items-center">
                <span className="me-3 fs-4">2️⃣</span>
                <div>
                  <div className="fw-semibold">Add Questions</div>
                  <small className="text-muted">Add questions to your quizzes with multiple choice options</small>
                </div>
              </div>
            </div>
            <div className="list-group-item px-0 border-0">
              <div className="d-flex align-items-center">
                <span className="me-3 fs-4">3️⃣</span>
                <div>
                  <div className="fw-semibold">Publish Articles</div>
                  <small className="text-muted">Share educational content with your users</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

