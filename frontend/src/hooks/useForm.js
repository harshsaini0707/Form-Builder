import { useContext } from 'react';
import { FormContext } from '../context/FormContext.jsx';

// Custom hook to use the context
export function useForm() {
  const context = useContext(FormContext);
  
  if (!context) {
    throw new Error('useForm must be used within FormProvider');
  }
  
  return context;
}

