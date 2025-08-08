import { useForm } from '../../hooks/useForm';
import { useState, useMemo } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Button from '../ui/Button';
import Input from '../ui/Input';

// Draggable Option Component
function DraggableOption({ option, index, onUpdate, onDelete, onToggle }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: `option-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 p-2 bg-white border rounded-md shadow-sm"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab text-gray-400 hover:text-gray-600"
      >
        ☰
      </div>
      <input
        type="checkbox"
        checked={option.selected}
        onChange={() => onToggle(index)}
        className="w-4 h-4"
      />
      <Input
        value={option.text}
        onChange={(e) => onUpdate(index, { ...option, text: e.target.value })}
        className="flex-1"
        placeholder="Option text"
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
  );
}

// Text Editor with Highlighting
function TextEditor({ text, onTextChange, selectedWords, onWordToggle }) {
  const words = useMemo(() => {
    return text.split(/(\s+)/).map((word, index) => {
      const isSelected = selectedWords.includes(word.trim());
      return {
        text: word,
        index,
        isSelected: isSelected && word.trim() !== ''
      };
    });
  }, [text, selectedWords]);

  const handleWordClick = (word) => {
    if (word.trim() !== '') {
      onWordToggle(word.trim());
    }
  };

  return (
    <div className="border rounded-md p-4 bg-white">
      <div className="text-sm text-gray-600 mb-2">Click on words to mark them as blanks</div>
      <div className="min-h-[100px] leading-relaxed">
        {words.map((word, index) => (
          <span
            key={index}
            onClick={() => handleWordClick(word.text)}
            className={`cursor-pointer px-1 rounded ${
              word.isSelected 
                ? 'bg-blue-200 text-blue-800 underline' 
                : 'hover:bg-gray-100'
            }`}
          >
            {word.text}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function ClozeQuestion({ question }) {
  const { updateQuestion } = useForm();
  const [activeId, setActiveId] = useState(null);

  const passage = question.settings?.passage || 'Enter your passage here...';
  const options = question.settings?.options || [];
  const selectedWords = question.settings?.selectedWords || [];

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

  const handleWordToggle = (word) => {
    const newSelectedWords = selectedWords.includes(word)
      ? selectedWords.filter(w => w !== word)
      : [...selectedWords, word];

    updateQuestion(question.id, {
      settings: {
        ...question.settings,
        selectedWords: newSelectedWords
      }
    });
  };

  const addOption = () => {
    const newOptions = [...options, { text: `Option ${options.length + 1}`, selected: false }];
    updateQuestion(question.id, {
      settings: {
        ...question.settings,
        options: newOptions
      }
    });
  };

  const updateOption = (index, option) => {
    const newOptions = [...options];
    newOptions[index] = option;
    updateQuestion(question.id, {
      settings: {
        ...question.settings,
        options: newOptions
      }
    });
  };

  const deleteOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    updateQuestion(question.id, {
      settings: {
        ...question.settings,
        options: newOptions
      }
    });
  };

  const toggleOption = (index) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], selected: !newOptions[index].selected };
    updateQuestion(question.id, {
      settings: {
        ...question.settings,
        options: newOptions
      }
    });
  };

  const handleOptionDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    const oldIndex = parseInt(active.id.split('-')[1]);
    const newIndex = parseInt(over.id.split('-')[1]);

    const newOptions = arrayMove(options, oldIndex, newIndex);
    updateQuestion(question.id, {
      settings: {
        ...question.settings,
        options: newOptions
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

      {/* Preview Section */}
      <div className="space-y-2">
        <h3 className="font-medium text-lg">Preview</h3>
        <div className="p-4 bg-gray-50 rounded-md">
          {passage.split(/(\s+)/).map((word, index) => {
            const isSelected = selectedWords.includes(word.trim());
            return (
              <span
                key={index}
                className={isSelected ? 'bg-blue-200 text-blue-800 px-1 rounded' : ''}
              >
                {isSelected ? '[blank]' : word}
              </span>
            );
          })}
        </div>
      </div>

      {/* Sentence Editor */}
      <div className="space-y-2">
        <h3 className="font-medium text-lg">Sentence</h3>
        <TextEditor
          text={passage}
          onTextChange={handlePassageChange}
          selectedWords={selectedWords}
          onWordToggle={handleWordToggle}
        />
        <textarea
          className="input h-24 resize-none mt-2"
          placeholder="Or type your passage here..."
          value={passage}
          onChange={handlePassageChange}
        />
      </div>

      {/* Options Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-lg">Options</h3>
          <Button onClick={addOption} size="sm">
            Add Option
          </Button>
        </div>

        <DndContext
          collisionDetection={closestCenter}
          onDragStart={({ active }) => setActiveId(active.id)}
          onDragEnd={handleOptionDragEnd}
        >
          <SortableContext items={options.map((_, i) => `option-${i}`)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {options.map((option, index) => (
                <DraggableOption
                  key={index}
                  option={option}
                  index={index}
                  onUpdate={updateOption}
                  onDelete={deleteOption}
                  onToggle={toggleOption}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
