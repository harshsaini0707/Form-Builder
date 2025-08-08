import Button from '../ui/Button';
import { useForm } from '../../hooks/useForm';

const questionTypes = [
  { id: 'categorize', label: 'Categorize' },
  { id: 'cloze', label: 'Cloze' },
  { id: 'comprehension', label: 'Comprehension' }
];

export default function QuestionSidebar() {
  const { addQuestion } = useForm();

  function handleAddQuestion(type) {
    addQuestion(type);
  }

  return (
    <aside className="w-52 border-r bg-white p-4 space-y-3">
      <h2 className="font-medium mb-2">Add Question</h2>
      
      {questionTypes.map(type => (
        <Button
          key={type.id}
          variant="secondary"
          className="w-full text-left"
          onClick={() => handleAddQuestion(type.id)}
        >
          {type.label}
        </Button>
      ))}
    </aside>
  );
}
