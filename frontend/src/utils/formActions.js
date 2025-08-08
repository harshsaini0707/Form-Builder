// Helper functions for form actions
export const createFormActions = (dispatch) => ({
  updateForm: (updates) => {
    dispatch({ type: 'UPDATE_FORM', payload: updates });
  },

  addQuestion: (questionType) => {
    dispatch({ type: 'ADD_QUESTION', questionType });
  },

  updateQuestion: (questionId, updates) => {
    dispatch({ type: 'UPDATE_QUESTION', questionId, updates });
  },

  deleteQuestion: (questionId) => {
    dispatch({ type: 'DELETE_QUESTION', questionId });
  },

  reorderQuestions: (newOrder) => {
    dispatch({ type: 'REORDER_QUESTIONS', newOrder });
  },

  resetForm: () => {
    dispatch({ type: 'RESET_FORM' });
  }
});

