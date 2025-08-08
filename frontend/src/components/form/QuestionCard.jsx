import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useForm } from '../../hooks/useForm';
import { useState } from 'react';
import Button from '../ui/Button';
import CategorizeEditor from '../questions/CategorizeQuestion';
import ClozeEditor from '../questions/ClozeQuestion';
import ComprehensionEditor from '../questions/ComprehensionQuestion';
import QuestionPreview from '../preview/QuestionPreview';

// Map question types to their editors
const questionEditors = {
  categorize: CategorizeEditor,
  cloze: ClozeEditor,
  comprehension: ComprehensionEditor
};

export default function QuestionCard({ question }) {
  const { deleteQuestion } = useForm();
  const [isPreview, setIsPreview] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  const QuestionEditor = questionEditors[question.type];

  function handleDelete() {
    if (confirm('Are you sure you want to delete this question?')) {
      deleteQuestion(question.id);
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="card p-6 my-4"
    >
      {/* Question header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <h3 className="font-medium capitalize text-lg">
            {question.type} Question
          </h3>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
            {question.settings?.points || 1} point{question.settings?.points !== 1 ? 's' : ''}
          </span>
        </div>
        
        <div className="flex gap-2">
          {/* Preview toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsPreview(!isPreview)}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            {isPreview ? 'Edit' : 'Preview'}
          </Button>
          
          {/* Drag handle */}
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab text-gray-400 hover:text-gray-600 p-1"
            title="Drag to reorder"
          >
            ☰
          </div>
          
          {/* Delete button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            🗑
          </Button>
        </div>
      </div>

      {/* Question content */}
      {isPreview ? (
        <QuestionPreview question={question} />
      ) : (
        <QuestionEditor question={question} />
      )}
    </div>
  );
}
