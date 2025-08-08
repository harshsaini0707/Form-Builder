import { useForm } from '../../hooks/useForm';
import { useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Button from '../ui/Button';
import Input from '../ui/Input';

// Rich Text Editor Toolbar
function RichTextToolbar({ onFormat, onInsert }) {
  const formats = [
    { label: 'B', action: 'bold', icon: 'B' },
    { label: 'I', action: 'italic', icon: 'I' },
    { label: 'U', action: 'underline', icon: 'U' },
    { label: 'Sup', action: 'superscript', icon: 'x²' },
    { label: 'Sub', action: 'subscript', icon: 'x₂' }
  ];

  const insertOptions = [
    { label: 'Link', action: 'link', icon: '🔗' },
    { label: 'Image', action: 'image', icon: '🖼️' },
    { label: 'List', action: 'list', icon: '📝' }
  ];

  return (
    <div className="flex items-center gap-1 p-2 bg-gray-100 rounded-t-md border-b">
      <div className="flex items-center gap-1">
        {formats.map((format) => (
          <button
            key={format.action}
            onClick={() => onFormat(format.action)}
            className="px-2 py-1 text-sm border rounded hover:bg-white"
            title={format.label}
          >
            {format.icon}
          </button>
        ))}
      </div>
      <div className="w-px h-6 bg-gray-300 mx-2"></div>
      <div className="flex items-center gap-1">
        {insertOptions.map((option) => (
          <button
            key={option.action}
            onClick={() => onInsert(option.action)}
            className="px-2 py-1 text-sm border rounded hover:bg-white"
            title={option.label}
          >
            {option.icon}
          </button>
        ))}
      </div>
    </div>
  );
}

// Draggable MCQ Component
function DraggableMCQ({ mcq, index, onUpdate, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: `mcq-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  const addOption = () => {
    const newOptions = [...mcq.options, { text: `Option ${mcq.options.length + 1}`, correct: false }];
    onUpdate(index, { ...mcq, options: newOptions });
  };

  const updateOption = (optionIndex, option) => {
    const newOptions = [...mcq.options];
    newOptions[optionIndex] = option;
    onUpdate(index, { ...mcq, options: newOptions });
  };

  const deleteOption = (optionIndex) => {
    const newOptions = mcq.options.filter((_, i) => i !== optionIndex);
    onUpdate(index, { ...mcq, options: newOptions });
  };

  const toggleCorrect = (optionIndex) => {
    const newOptions = mcq.options.map((opt, i) => ({
      ...opt,
      correct: i === optionIndex
    }));
    onUpdate(index, { ...mcq, options: newOptions });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border rounded-md p-4 bg-white space-y-4"
    >
      <div className="flex items-center gap-2">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab text-gray-400 hover:text-gray-600"
        >
          ☰
        </div>
        <Input
          value={mcq.question}
          onChange={(e) => onUpdate(index, { ...mcq, question: e.target.value })}
          className="flex-1"
          placeholder="Enter question..."
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(index)}
          className="text-red-600 hover:text-red-700"
        >
          ×
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Options:</label>
          <Button onClick={addOption} size="sm">
            Add Option
          </Button>
        </div>
        {mcq.options.map((option, optionIndex) => (
          <div key={optionIndex} className="flex items-center gap-2">
            <input
              type="radio"
              name={`mcq-${index}`}
              checked={option.correct}
              onChange={() => toggleCorrect(optionIndex)}
              className="w-4 h-4"
            />
            <Input
              value={option.text}
              onChange={(e) => updateOption(optionIndex, { ...option, text: e.target.value })}
              className="flex-1"
              placeholder="Option text"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteOption(optionIndex)}
              className="text-red-600 hover:text-red-700"
            >
              ×
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ComprehensionQuestion({ question }) {
  const { updateQuestion } = useForm();
  const [activeId, setActiveId] = useState(null);

  const passage = question.settings?.passage || 'Enter the reading passage here...';
  const mcqs = question.settings?.mcqs || [];

  const handleTitleChange = (event) => {
    updateQuestion(question.id, {
      title: event.target.value
    });
  };

  const handlePointsChange = (event) => {
    updateQuestion(question.id, {
      settings: {
        ...question.settings,
        points: parseInt(event.target.value) || 1
      }
    });
  };

  const handlePassageChange = (event) => {
    updateQuestion(question.id, {
      settings: {
        ...question.settings,
        passage: event.target.value
      }
    });
  };

  const addMCQ = () => {
    const newMCQs = [...mcqs, {
      question: `Question ${mcqs.length + 1}`,
      options: [
        { text: 'Option 1', correct: true },
        { text: 'Option 2', correct: false },
        { text: 'Option 3', correct: false },
        { text: 'Option 4', correct: false }
      ]
    }];
    updateQuestion(question.id, {
      settings: {
        ...question.settings,
        mcqs: newMCQs
      }
    });
  };

  const updateMCQ = (index, mcq) => {
    const newMCQs = [...mcqs];
    newMCQs[index] = mcq;
    updateQuestion(question.id, {
      settings: {
        ...question.settings,
        mcqs: newMCQs
      }
    });
  };

  const deleteMCQ = (index) => {
    const newMCQs = mcqs.filter((_, i) => i !== index);
    updateQuestion(question.id, {
      settings: {
        ...question.settings,
        mcqs: newMCQs
      }
    });
  };

  const handleMCQDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    const oldIndex = parseInt(active.id.split('-')[1]);
    const newIndex = parseInt(over.id.split('-')[1]);

    const newMCQs = arrayMove(mcqs, oldIndex, newIndex);
    updateQuestion(question.id, {
      settings: {
        ...question.settings,
        mcqs: newMCQs
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Question Header */}
      <div className="space-y-4">
        <Input
          type="text"
          className="text-xl font-semibold"
          placeholder="Enter question title..."
          value={question.title}
          onChange={handleTitleChange}
        />
      </div>

      {/* Points */}
      <div className="flex items-center gap-2">
        <label className="font-medium">Points:</label>
        <Input
          type="number"
          value={question.settings?.points || 1}
          onChange={handlePointsChange}
          className="w-20"
          min="1"
        />
      </div>

      {/* Passage Section */}
      <div className="space-y-2">
        <h3 className="font-medium text-lg">Reading Passage</h3>
        <div className="border rounded-md">
          <RichTextToolbar 
            onFormat={(format) => console.log('Format:', format)}
            onInsert={(insert) => console.log('Insert:', insert)}
          />
          <textarea
            className="input h-32 resize-none border-0 rounded-b-md"
            placeholder="Enter the reading passage here..."
            value={passage}
            onChange={handlePassageChange}
          />
        </div>
      </div>

      {/* Multiple Choice Questions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-lg">Multiple Choice Questions</h3>
          <Button onClick={addMCQ} size="sm">
            Add Question
          </Button>
        </div>

        <DndContext
          collisionDetection={closestCenter}
          onDragStart={({ active }) => setActiveId(active.id)}
          onDragEnd={handleMCQDragEnd}
        >
          <SortableContext items={mcqs.map((_, i) => `mcq-${i}`)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {mcqs.map((mcq, index) => (
                <DraggableMCQ
                  key={index}
                  mcq={mcq}
                  index={index}
                  onUpdate={updateMCQ}
                  onDelete={deleteMCQ}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
