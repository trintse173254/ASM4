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

  if (!current) return <div className="container py-4">Loading...</div>;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>{current.title}</h2>
        <button className="btn btn-link" onClick={() => navigate('/dashboard')}>
          Back
        </button>
      </div>
      <p className="text-muted">{current.description}</p>

      {score === null ? (
        <div className="list-group">
          {current.questions.map((q, idx) => (
            <div className="list-group-item mb-3" key={q._id}>
              <h5 className="mb-2">
                {idx + 1}. {q.text}
              </h5>
              {q.options.map((opt, i) => (
                <div className="form-check" key={i}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name={q._id}
                    checked={answers[q._id] === i}
                    onChange={() => setAnswers({ ...answers, [q._id]: i })}
                    id={`${q._id}-${i}`}
                  />
                  <label className="form-check-label" htmlFor={`${q._id}-${i}`}>
                    {opt}
                  </label>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-success">
          Quiz Completed. Your score: {score} / {current.questions.length}
        </div>
      )}

      <div className="d-flex gap-2 mt-3">
        {score === null ? (
          <button className="btn btn-primary" onClick={submit}>
            Submit Answer
          </button>
        ) : (
          <button className="btn btn-outline-primary" onClick={restart}>
            Restart Quiz
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizPage;

