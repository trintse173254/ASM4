import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createQuiz, updateQuiz, deleteQuiz, fetchQuizById } from '../../store/slices/quizSlice';

const ManageQuizzes = ({ onViewQuestions }) => {
  const dispatch = useDispatch();
  const { list: quizzes } = useSelector((state) => state.quizzes);
  const [quizForm, setQuizForm] = useState({ title: '', description: '' });
  const [editingQuizId, setEditingQuizId] = useState(null);
  const [editingQuizForm, setEditingQuizForm] = useState({ title: '', description: '' });

  const handleCreateQuiz = (e) => {
    e.preventDefault();
    dispatch(createQuiz(quizForm)).then(() => {
      setQuizForm({ title: '', description: '' });
    });
  };

  const startEditQuiz = (quiz) => {
    setEditingQuizId(quiz._id);
    setEditingQuizForm({ title: quiz.title, description: quiz.description || '' });
  };

  const handleUpdateQuiz = (e) => {
    e.preventDefault();
    if (!editingQuizId) return;
    dispatch(
      updateQuiz({
        id: editingQuizId,
        title: editingQuizForm.title,
        description: editingQuizForm.description
      })
    ).then(() => {
      setEditingQuizId(null);
      setEditingQuizForm({ title: '', description: '' });
    });
  };

  const handleSelectQuiz = (id) => {
    dispatch(fetchQuizById(id));
    onViewQuestions(id);
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="fw-bold">Manage Quizzes</h2>
        <p className="text-muted">Create and manage your quiz collection</p>
      </div>

      <div className="row g-4">
        {/* Create/Edit Form */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm sticky-top" style={{ top: '20px' }}>
            <div className="card-body">
              <h5 className="card-title fw-bold mb-3">
                {editingQuizId ? '✏️ Edit Quiz' : '➕ Add New Quiz'}
              </h5>
              <form onSubmit={editingQuizId ? handleUpdateQuiz : handleCreateQuiz}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Quiz Title</label>
                  <input
                    className="form-control"
                    placeholder="Enter quiz title..."
                    value={editingQuizId ? editingQuizForm.title : quizForm.title}
                    onChange={(e) =>
                      editingQuizId
                        ? setEditingQuizForm({ ...editingQuizForm, title: e.target.value })
                        : setQuizForm({ ...quizForm, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Description</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Enter quiz description..."
                    value={editingQuizId ? editingQuizForm.description : quizForm.description}
                    onChange={(e) =>
                      editingQuizId
                        ? setEditingQuizForm({ ...editingQuizForm, description: e.target.value })
                        : setQuizForm({ ...quizForm, description: e.target.value })
                    }
                  />
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-primary flex-grow-1" type="submit">
                    {editingQuizId ? 'Save Changes' : 'Add Quiz'}
                  </button>
                  {editingQuizId && (
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => {
                        setEditingQuizId(null);
                        setEditingQuizForm({ title: '', description: '' });
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

        {/* Quiz List */}
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title fw-bold mb-3">Existing Quizzes ({quizzes.length})</h5>
              {quizzes.length === 0 ? (
                <div className="text-center py-5">
                  <div className="mb-3" style={{ fontSize: '3rem' }}>📝</div>
                  <p className="text-muted">No quizzes yet. Create your first quiz!</p>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {quizzes.map((quiz) => (
                    <div
                      key={quiz._id}
                      className="list-group-item px-0 py-3"
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1 me-3">
                          <h6 className="mb-1 fw-semibold">{quiz.title}</h6>
                          <p className="text-muted mb-2 small">{quiz.description || 'No description'}</p>
                          <span className="badge bg-light text-dark">
                            {quiz.questions?.length || 0} questions
                          </span>
                        </div>
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => handleSelectQuiz(quiz._id)}
                            title="Manage Questions"
                          >
                            <span>❓</span>
                          </button>
                          <button
                            className="btn btn-outline-secondary"
                            onClick={() => startEditQuiz(quiz)}
                            title="Edit Quiz"
                          >
                            <span>✏️</span>
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this quiz?')) {
                                dispatch(deleteQuiz(quiz._id));
                              }
                            }}
                            title="Delete Quiz"
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

export default ManageQuizzes;

