import { useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { useDroppable } from '@dnd-kit/core';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

// Draggable Item for Categorize
function DraggableItem({ item, index }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `draggable-${index}`,
    data: item
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="px-3 py-2 bg-purple-100 text-purple-800 rounded-md cursor-grab hover:bg-purple-200"
    >
      {item.text}
    </div>
  );
}

// Droppable Category for Categorize
function DroppableCategory({ category, index, items, onDrop }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `category-${index}`,
  });

  const categoryItems = items.filter(item => item.categoryId === index.toString());

  return (
    <div
      ref={setNodeRef}
      className={`p-4 border-2 border-dashed rounded-md min-h-[100px] ${
        isOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      }`}
    >
      <h3 className="font-medium mb-2">{category}</h3>
      <div className="space-y-2">
        {categoryItems.map((item, itemIndex) => (
          <div key={itemIndex} className="px-2 py-1 bg-gray-100 rounded text-sm">
            {item.text}
          </div>
        ))}
      </div>
    </div>
  );
}

// Categorize Preview
function CategorizePreview({ question }) {
  const [items, setItems] = useState(question.settings?.items || []);
  const categories = question.settings?.categories || [];

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (!over) return;

    const itemIndex = parseInt(active.id.split('-')[1]);
    const categoryIndex = parseInt(over.id.split('-')[1]);
    
    const newItems = [...items];
    newItems[itemIndex] = { ...newItems[itemIndex], categoryId: categoryIndex.toString() };
    setItems(newItems);
  };

  const unassignedItems = items.filter(item => !item.categoryId || item.categoryId === '');

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{question.title}</h2>
      {question.description && (
        <p className="text-gray-600">{question.description}</p>
      )}
      
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {unassignedItems.map((item, index) => (
              <DraggableItem key={index} item={item} index={index} />
            ))}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {categories.map((category, index) => (
              <DroppableCategory
                key={index}
                category={category}
                index={index}
                items={items}
              />
            ))}
          </div>
        </div>
      </DndContext>
    </div>
  );
}

// Cloze Preview
function ClozePreview({ question }) {
  const [answers, setAnswers] = useState({});
  const passage = question.settings?.passage || '';
  const selectedWords = question.settings?.selectedWords || [];

  const handleAnswerChange = (word, value) => {
    setAnswers(prev => ({ ...prev, [word]: value }));
  };

  const renderPassage = () => {
    const words = passage.split(/(\s+)/);
    return words.map((word, index) => {
      const trimmedWord = word.trim();
      if (selectedWords.includes(trimmedWord)) {
        return (
          <span key={index}>
            <input
              type="text"
              value={answers[trimmedWord] || ''}
              onChange={(e) => handleAnswerChange(trimmedWord, e.target.value)}
              className="w-20 px-2 py-1 border-b-2 border-blue-500 focus:outline-none focus:border-blue-700"
              placeholder="____"
            />
            {word.replace(trimmedWord, '')}
          </span>
        );
      }
      return <span key={index}>{word}</span>;
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{question.title}</h2>
      <div className="text-lg leading-relaxed">
        {renderPassage()}
      </div>
    </div>
  );
}

// Comprehension Preview
function ComprehensionPreview({ question }) {
  const [answers, setAnswers] = useState({});
  const passage = question.settings?.passage || '';
  const mcqs = question.settings?.mcqs || [];

  const handleAnswerChange = (mcqIndex, value) => {
    setAnswers(prev => ({ ...prev, [mcqIndex]: value }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{question.title}</h2>
      
      <div className="bg-gray-50 p-4 rounded-md">
        <h3 className="font-medium mb-2">Reading Passage:</h3>
        <div className="text-gray-700 leading-relaxed">
          {passage}
        </div>
      </div>

      <div className="space-y-4">
        {mcqs.map((mcq, mcqIndex) => (
          <div key={mcqIndex} className="border rounded-md p-4">
            <h4 className="font-medium mb-3">
              {mcqIndex + 1}. {mcq.question}
            </h4>
            <div className="space-y-2">
              {mcq.options.map((option, optionIndex) => (
                <label key={optionIndex} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`mcq-${mcqIndex}`}
                    value={optionIndex}
                    checked={answers[mcqIndex] === optionIndex}
                    onChange={(e) => handleAnswerChange(mcqIndex, parseInt(e.target.value))}
                    className="w-4 h-4"
                  />
                  <span>{option.text}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function QuestionPreview({ question }) {
  switch (question.type) {
    case 'categorize':
      return <CategorizePreview question={question} />;
    case 'cloze':
      return <ClozePreview question={question} />;
    case 'comprehension':
      return <ComprehensionPreview question={question} />;
    default:
      return <div>Unknown question type</div>;
  }
}

