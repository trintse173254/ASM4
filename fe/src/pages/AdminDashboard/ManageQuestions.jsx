import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchQuizById,
  createQuestion,
  updateQuestion,
  deleteQuestion
} from '../../store/slices/quizSlice';

const ManageQuestions = ({ initialQuizId }) => {
  const dispatch = useDispatch();
  const { list: quizzes, current } = useSelector((state) => state.quizzes);
  const [selectedQuizId, setSelectedQuizId] = useState(initialQuizId || '');
  const [questionForm, setQuestionForm] = useState({
    text: '',
    options: ['', '', '', ''],
    correctIndex: 0
  });
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [editingQuestionForm, setEditingQuestionForm] = useState({
    text: '',
    options: ['', '', '', ''],
    correctIndex: 0
  });

  useEffect(() => {
    if (initialQuizId) {
      setSelectedQuizId(initialQuizId);
    } else if (!current && quizzes.length) {
      const firstId = quizzes[0]._id;
      setSelectedQuizId(firstId);
      dispatch(fetchQuizById(firstId));
    }
  }, [initialQuizId, current, quizzes, dispatch]);

  const handleChangeQuiz = (e) => {
    const id = e.target.value;
    setSelectedQuizId(id);
    if (id) dispatch(fetchQuizById(id));
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
    ).then(() => {
      setQuestionForm({ text: '', options: ['', '', '', ''], correctIndex: 0 });
    });
  };

  const startEditQuestion = (question) => {
    setEditingQuestionId(question._id);
    setEditingQuestionForm({
      text: question.text,
      options: question.options,
      correctIndex: question.correctIndex
    });
  };

  const handleUpdateQuestion = (e) => {
    e.preventDefault();
    if (!editingQuestionId) return;
    dispatch(
      updateQuestion({
        id: editingQuestionId,
        text: editingQuestionForm.text,
        options: editingQuestionForm.options,
        correctIndex: Number(editingQuestionForm.correctIndex)
      })
    ).then(() => {
      setEditingQuestionId(null);
      setEditingQuestionForm({ text: '', options: ['', '', '', ''], correctIndex: 0 });
    });
  };

  if (!quizzes.length) {
    return (
      <div>
        <div className="mb-4">
          <h2 className="fw-bold">Manage Questions</h2>
          <p className="text-muted">Add questions to your quizzes</p>
        </div>
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <div className="mb-3" style={{ fontSize: '3rem' }}>📝</div>
            <p className="text-muted">Please create a quiz first before adding questions.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <h2 className="fw-bold">Manage Questions</h2>
        <p className="text-muted">Add and edit questions for your quizzes</p>
      </div>

      {/* Quiz Selector */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <label className="form-label fw-semibold mb-2">Select Quiz</label>
          <select className="form-select" value={selectedQuizId} onChange={handleChangeQuiz}>
            <option value="">Choose a quiz...</option>
            {quizzes.map((q) => (
              <option key={q._id} value={q._id}>
                {q.title} ({q.questions?.length || 0} questions)
              </option>
            ))}
          </select>
        </div>
      </div>

      {current && (
        <div className="row g-4">
          {/* Create/Edit Form */}
          <div className="col-lg-5">
            <div className="card border-0 shadow-sm sticky-top" style={{ top: '20px' }}>
              <div className="card-body">
                <h5 className="card-title fw-bold mb-1">
                  {editingQuestionId ? '✏️ Edit Question' : '➕ Add New Question'}
                </h5>
                <p className="text-muted small mb-3">For: {current.title}</p>
                <form onSubmit={editingQuestionId ? handleUpdateQuestion : handleCreateQuestion}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Question Text</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Enter your question..."
                      value={editingQuestionId ? editingQuestionForm.text : questionForm.text}
                      onChange={(e) =>
                        editingQuestionId
                          ? setEditingQuestionForm({ ...editingQuestionForm, text: e.target.value })
                          : setQuestionForm({ ...questionForm, text: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold mb-2">Answer Options</label>
                    {(editingQuestionId ? editingQuestionForm.options : questionForm.options).map(
                      (opt, idx) => (
                        <div className="mb-2" key={idx}>
                          <div className="input-group">
                            <span className="input-group-text">{idx + 1}</span>
                            <input
                              className="form-control"
                              placeholder={`Option ${idx + 1}`}
                              value={opt}
                              onChange={(e) => {
                                const opts = editingQuestionId
                                  ? [...editingQuestionForm.options]
                                  : [...questionForm.options];
                                opts[idx] = e.target.value;
                                editingQuestionId
                                  ? setEditingQuestionForm({ ...editingQuestionForm, options: opts })
                                  : setQuestionForm({ ...questionForm, options: opts });
                              }}
                              required
                            />
                          </div>
                        </div>
                      )
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Correct Answer</label>
                    <select
                      className="form-select"
                      value={editingQuestionId ? editingQuestionForm.correctIndex : questionForm.correctIndex}
                      onChange={(e) =>
                        editingQuestionId
                          ? setEditingQuestionForm({ ...editingQuestionForm, correctIndex: e.target.value })
                          : setQuestionForm({ ...questionForm, correctIndex: e.target.value })
                      }
                      required
                    >
                      {[0, 1, 2, 3].map((i) => (
                        <option key={i} value={i}>
                          Option {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="d-flex gap-2">
                    <button className="btn btn-primary flex-grow-1" type="submit">
                      {editingQuestionId ? 'Save Changes' : 'Add Question'}
                    </button>
                    {editingQuestionId && (
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => {
                          setEditingQuestionId(null);
                          setEditingQuestionForm({ text: '', options: ['', '', '', ''], correctIndex: 0 });
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

          {/* Questions List */}
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h5 className="card-title fw-bold mb-3">
                  Questions ({current.questions?.length || 0})
                </h5>
                {!current.questions?.length ? (
                  <div className="text-center py-5">
                    <div className="mb-3" style={{ fontSize: '3rem' }}>❓</div>
                    <p className="text-muted">No questions yet. Add your first question!</p>
                  </div>
                ) : (
                  <div className="list-group list-group-flush">
                    {current.questions.map((question, qIndex) => (
                      <div key={question._id} className="list-group-item px-0 py-3">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="mb-0 fw-semibold">
                            <span className="badge bg-primary me-2">{qIndex + 1}</span>
                            {question.text}
                          </h6>
                          <div className="btn-group btn-group-sm">
                            <button
                              className="btn btn-outline-secondary"
                              onClick={() => startEditQuestion(question)}
                              title="Edit"
                            >
                              ✏️
                            </button>
                            <button
                              className="btn btn-outline-danger"
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this question?')) {
                                  dispatch(deleteQuestion(question._id));
                                }
                              }}
                              title="Delete"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                        <ul className="list-unstyled mb-0 ms-4">
                          {question.options.map((option, oIndex) => (
                            <li key={oIndex} className="mb-1">
                              <span className={oIndex === question.correctIndex ? 'text-success fw-semibold' : ''}>
                                {String.fromCharCode(65 + oIndex)}. {option}
                                {oIndex === question.correctIndex && (
                                  <span className="badge bg-success ms-2">✓ Correct</span>
                                )}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageQuestions;

