import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchQuizzes } from '../../store/slices/quizSlice';
import { fetchArticles } from '../../store/slices/articleSlice';
import Sidebar from './Sidebar';
import Home from './Home';
import ManageQuizzes from './ManageQuizzes';
import ManageQuestions from './ManageQuestions';
import ManageArticles from './ManageArticles';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('home');
  const [selectedQuizId, setSelectedQuizId] = useState(null);

  useEffect(() => {
    dispatch(fetchQuizzes());
    dispatch(fetchArticles());
  }, [dispatch]);

  const handleViewQuestions = (quizId) => {
    setSelectedQuizId(quizId);
    setActiveTab('questions');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home />;
      case 'quizzes':
        return <ManageQuizzes onViewQuestions={handleViewQuestions} />;
      case 'questions':
        return <ManageQuestions initialQuizId={selectedQuizId} />;
      case 'articles':
        return <ManageArticles />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <div className="flex-grow-1 p-4" style={{ overflowY: 'auto' }}>
        <div className="container-fluid" style={{ maxWidth: '1400px' }}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
