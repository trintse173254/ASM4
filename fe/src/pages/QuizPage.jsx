import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchQuizById } from '../store/slices/quizSlice';

const QuizPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current } = useSelector((state) => state.quizzes);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);

  useEffect(() => {
    dispatch(fetchQuizById(id));
  }, [dispatch, id]);

  const submit = () => {
    if (!current) return;
    let s = 0;
    current.questions.forEach((q) => {
      if (answers[q._id] === q.correctIndex) s += 1;
    });
    setScore(s);
  };

  const restart = () => {
    setAnswers({});
    setScore(null);
  };

  if (!current) {
    return (
      <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading quiz...</p>
        </div>
      </div>
    );
  }

  const progressPercentage = score === null 
    ? (Object.keys(answers).length / current.questions.length) * 100 
    : 100;

  const scorePercentage = score !== null ? (score / current.questions.length) * 100 : 0;

  return (
    <div className="min-vh-100 bg-light">
      {/* Header */}
      <nav className="navbar navbar-light bg-white shadow-sm">
        <div className="container-fluid px-4">
          <button className="btn btn-outline-primary" onClick={() => navigate('/dashboard')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left me-2 mb-1" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
            </svg>
            Back to Dashboard
          </button>
          <div className="d-flex align-items-center">
            <span className="badge bg-primary rounded-pill px-3 py-2">
              {score === null ? `${Object.keys(answers).length} / ${current.questions.length} Answered` : 'Completed'}
            </span>
          </div>
        </div>
      </nav>

      <div className="container py-4">
        {/* Quiz Header Card */}
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body p-4">
            <div className="d-flex align-items-start mb-3">
              <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-clipboard-check text-primary" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0"/>
                  <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"/>
                  <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"/>
                </svg>
              </div>
              <div className="flex-grow-1">
                <h2 className="mb-2">{current.title}</h2>
                <p className="text-muted mb-0">{current.description}</p>
              </div>
            </div>
            
            {/* Progress Bar */}
            {score === null && (
              <div>
                <div className="d-flex justify-content-between mb-2">
                  <small className="text-muted">Progress</small>
                  <small className="text-muted fw-semibold">{Math.round(progressPercentage)}%</small>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div 
                    className="progress-bar bg-primary" 
                    role="progressbar" 
                    style={{ width: `${progressPercentage}%` }}
                    aria-valuenow={progressPercentage} 
                    aria-valuemin="0" 
                    aria-valuemax="100"
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Questions or Results */}
        {score === null ? (
          <div className="row g-4">
            {current.questions.map((q, idx) => (
              <div className="col-12" key={q._id}>
                <div className="card shadow-sm border-0">
                  <div className="card-body p-4">
                    <div className="d-flex mb-3">
                      <div className="rounded-circle bg-secondary bg-opacity-10 d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px', minWidth: '40px' }}>
                        <span className="fw-bold text-secondary">{idx + 1}</span>
                      </div>
                      <h5 className="mb-0 align-self-center">{q.text}</h5>
                    </div>
                    
                    <div className="ms-5 ps-2">
                      {q.options.map((opt, i) => (
                        <div className="form-check mb-3 p-3 rounded border" 
                             key={i}
                             style={{ 
                               backgroundColor: answers[q._id] === i ? '#f0f7ff' : '#fff',
                               borderColor: answers[q._id] === i ? '#0d6efd' : '#dee2e6',
                               cursor: 'pointer',
                               transition: 'all 0.2s'
                             }}
                             onClick={() => setAnswers({ ...answers, [q._id]: i })}
                        >
                          <input
                            className="form-check-input"
                            type="radio"
                            name={q._id}
                            checked={answers[q._id] === i}
                            onChange={() => setAnswers({ ...answers, [q._id]: i })}
                            id={`${q._id}-${i}`}
                            style={{ cursor: 'pointer' }}
                          />
                          <label className="form-check-label flex-grow-1 ms-2" htmlFor={`${q._id}-${i}`} style={{ cursor: 'pointer' }}>
                            {opt}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card shadow-sm border-0">
            <div className="card-body p-5 text-center">
              <div className={`rounded-circle d-inline-flex p-4 mb-4 ${scorePercentage >= 70 ? 'bg-success bg-opacity-10' : scorePercentage >= 50 ? 'bg-warning bg-opacity-10' : 'bg-danger bg-opacity-10'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" className={`bi ${scorePercentage >= 70 ? 'bi-trophy text-success' : scorePercentage >= 50 ? 'bi-star text-warning' : 'bi-x-circle text-danger'}`} viewBox="0 0 16 16">
                  {scorePercentage >= 70 ? (
                    <path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5q0 .807-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33 33 0 0 1 2.5.5m.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935m10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935M3.504 1q.01.775.056 1.469c.13 2.028.457 3.546.87 4.667C5.294 9.48 6.484 10 7.5 10a.5.5 0 0 1 .5.5v2.61a1 1 0 0 1-.757.97l-1.426.356a.5.5 0 0 0-.179.085L4.5 15h7l-1.638-1.229a.5.5 0 0 0-.179-.085l-1.426-.356a1 1 0 0 1-.757-.97V10.5A.5.5 0 0 1 8.5 10c1.016 0 2.206-.52 3.07-2.864.413-1.12.74-2.64.87-4.667q.045-.694.056-1.469z"/>
                  ) : scorePercentage >= 50 ? (
                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                  ) : (
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                  )}
                </svg>
              </div>
              <h2 className="mb-3">
                {scorePercentage >= 70 ? 'Excellent Work!' : scorePercentage >= 50 ? 'Good Effort!' : 'Keep Practicing!'}
              </h2>
              <div className="display-4 fw-bold mb-2">
                <span className={scorePercentage >= 70 ? 'text-success' : scorePercentage >= 50 ? 'text-warning' : 'text-danger'}>
                  {score}
                </span>
                <span className="text-muted"> / {current.questions.length}</span>
              </div>
              <p className="text-muted mb-4">
                You scored {scorePercentage.toFixed(0)}% on this quiz
              </p>
              
              <div className="progress mb-4" style={{ height: '20px' }}>
                <div 
                  className={`progress-bar ${scorePercentage >= 70 ? 'bg-success' : scorePercentage >= 50 ? 'bg-warning' : 'bg-danger'}`}
                  role="progressbar" 
                  style={{ width: `${scorePercentage}%` }}
                  aria-valuenow={scorePercentage} 
                  aria-valuemin="0" 
                  aria-valuemax="100"
                >
                  {scorePercentage.toFixed(0)}%
                </div>
              </div>
              
              <button className="btn btn-primary btn-lg px-5" onClick={restart}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-clockwise me-2 mb-1" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
                  <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
                </svg>
                Retake Quiz
              </button>
            </div>
          </div>
        )}

        {/* Submit Button - Fixed at Bottom */}
        {score === null && (
          <div className="position-sticky bottom-0 mt-4 pb-4">
            <div className="card shadow border-0">
              <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <small className="text-muted d-block">Questions Answered</small>
                    <strong>{Object.keys(answers).length} / {current.questions.length}</strong>
                  </div>
                  <button 
                    className="btn btn-primary btn-lg px-5" 
                    onClick={submit}
                    disabled={Object.keys(answers).length !== current.questions.length}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-check-circle me-2 mb-1" viewBox="0 0 16 16">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                      <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/>
                    </svg>
                    Submit Quiz
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPage;

