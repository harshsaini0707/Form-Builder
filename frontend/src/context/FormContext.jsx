import { createContext, useReducer } from 'react';
import { formReducer } from '../utils/formReducer.js';
import { createFormActions } from '../utils/formActions.js';

// Initial form state
const initialState = {
  title: 'Untitled Form',
  description: '',
  headerImage: '',
  questions: []
};

// Create contexts
export const FormContext = createContext();

// Provider component
export function FormProvider({ children }) {
  const [state, dispatch] = useReducer(formReducer, initialState);

  const actions = createFormActions(dispatch);

  const value = {
    // State
    form: state,
    
    // Actions
    ...actions
  };

  return (
    <FormContext.Provider value={value}>
      {children}
    </FormContext.Provider>
  );
}
