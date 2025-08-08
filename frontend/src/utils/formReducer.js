import { generateId, getDefaultSettings } from './formHelpers.js';

// Reducer function
export const formReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_FORM':
      return {
        ...state,
        ...action.payload
      };

    case 'ADD_QUESTION': {
      const newQuestion = {
        id: generateId(),
        type: action.questionType,
        title: `New ${action.questionType} question`,
        description: '',
        image: '',
        required: false,
        settings: getDefaultSettings(action.questionType)
      };
      
      return {
        ...state,
        questions: [...state.questions, newQuestion]
      };
    }

    case 'UPDATE_QUESTION':
      return {
        ...state,
        questions: state.questions.map(question => {
          if (question.id === action.questionId) {
            return { ...question, ...action.updates };
          }
          return question;
        })
      };

    case 'DELETE_QUESTION':
      return {
        ...state,
        questions: state.questions.filter(question => question.id !== action.questionId)
      };

    case 'REORDER_QUESTIONS':
      return {
        ...state,
        questions: action.newOrder
      };

    case 'RESET_FORM':
      return {
        title: 'Untitled Form',
        description: '',
        headerImage: '',
        questions: []
      };

    default:
      return state;
  }
};

