import { logout } from '../../store/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ activeTab, onTabChange }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = [
    { id: 'home', label: 'Dashboard', icon: '📊' },
    { id: 'quizzes', label: 'Manage Quizzes', icon: '📝' },
    { id: 'questions', label: 'Manage Questions', icon: '❓' },
    { id: 'articles', label: 'Manage Articles', icon: '📰' }
  ];

  return (
    <div 
      className="d-flex flex-column bg-dark text-white" 
      style={{ width: '260px', minHeight: '100vh', position: 'sticky', top: 0 }}
    >
      {/* Header */}
      <div className="p-4 border-bottom border-secondary">
        <h4 className="mb-0 fw-bold">
          <span className="me-2">⚡</span>
          Admin Panel
        </h4>
      </div>

      {/* User Info */}
      <div className="p-3 border-bottom border-secondary">
        <div className="d-flex align-items-center">
          <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2" 
               style={{ width: '40px', height: '40px' }}>
            <span className="fs-5">👤</span>
          </div>
          <div className="flex-grow-1">
            <div className="fw-semibold small">{user?.username}</div>
            <small className="text-muted">Administrator</small>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-grow-1 p-3">
        <div className="d-flex flex-column gap-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`btn text-start d-flex align-items-center gap-3 py-2 px-3 ${
                activeTab === item.id
                  ? 'btn-primary'
                  : 'btn-link text-white text-decoration-none'
              }`}
              onClick={() => onTabChange(item.id)}
              style={{
                borderRadius: '8px',
                transition: 'all 0.2s'
              }}
            >
              <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Logout Button */}
      <div className="p-3 border-top border-secondary mt-auto">
        <button
          className="btn btn-outline-light w-100 d-flex align-items-center justify-content-center gap-2"
          onClick={handleLogout}
          style={{ borderRadius: '8px' }}
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

