import { useForm } from '../../hooks/useForm';
import { useState } from 'react';
import { DndContext, closestCenter, DragOverlay } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Button from '../ui/Button';
import Input from '../ui/Input';

// Draggable Category Component
function DraggableCategory({ category, index, onUpdate, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: `category-${index}` });

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
      <Input
        value={category}
        onChange={(e) => onUpdate(index, e.target.value)}
        className="flex-1"
        placeholder="Category name"
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

// Draggable Item Component
function DraggableItem({ item, index, onUpdate, onDelete, onCategoryChange, categories }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: `item-${index}` });

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
      <Input
        value={item.text}
        onChange={(e) => onUpdate(index, { ...item, text: e.target.value })}
        className="flex-1"
        placeholder="Item text"
      />
      <select
        value={item.categoryId || ''}
        onChange={(e) => onCategoryChange(index, e.target.value)}
        className="px-2 py-1 border rounded text-sm"
      >
        <option value="">Select category</option>
        {categories.map((cat, idx) => (
          <option key={idx} value={idx}>
            {cat}
          </option>
        ))}
      </select>
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

export default function CategorizeQuestion({ question }) {
  const { updateQuestion } = useForm();
  const [activeId, setActiveId] = useState(null);

  const categories = question.settings?.categories || ['Category 1', 'Category 2'];
  const items = question.settings?.items || [];

  const handleTitleChange = (event) => {
    updateQuestion(question.id, {
      title: event.target.value
    });
  };

  const handleDescriptionChange = (event) => {
    updateQuestion(question.id, {
      description: event.target.value
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

  const addCategory = () => {
    const newCategories = [...categories, `Category ${categories.length + 1}`];
    updateQuestion(question.id, {
      settings: {
        ...question.settings,
        categories: newCategories
      }
    });
  };

  const updateCategory = (index, value) => {
    const newCategories = [...categories];
    newCategories[index] = value;
    updateQuestion(question.id, {
      settings: {
        ...question.settings,
        categories: newCategories
      }
    });
  };

  const deleteCategory = (index) => {
    const newCategories = categories.filter((_, i) => i !== index);
    updateQuestion(question.id, {
      settings: {
        ...question.settings,
        categories: newCategories
      }
    });
  };

  const addItem = () => {
    const newItems = [...items, { text: `Item ${items.length + 1}`, categoryId: '' }];
    updateQuestion(question.id, {
      settings: {
        ...question.settings,
        items: newItems
      }
    });
  };

  const updateItem = (index, item) => {
    const newItems = [...items];
    newItems[index] = item;
    updateQuestion(question.id, {
      settings: {
        ...question.settings,
        items: newItems
      }
    });
  };

  const deleteItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    updateQuestion(question.id, {
      settings: {
        ...question.settings,
        items: newItems
      }
    });
  };

  const handleCategoryDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    const oldIndex = parseInt(active.id.split('-')[1]);
    const newIndex = parseInt(over.id.split('-')[1]);

    const newCategories = arrayMove(categories, oldIndex, newIndex);
    updateQuestion(question.id, {
      settings: {
        ...question.settings,
        categories: newCategories
      }
    });
  };

  const handleItemDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    const oldIndex = parseInt(active.id.split('-')[1]);
    const newIndex = parseInt(over.id.split('-')[1]);

    const newItems = arrayMove(items, oldIndex, newIndex);
    updateQuestion(question.id, {
      settings: {
        ...question.settings,
        items: newItems
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
        
        <textarea
          className="input h-16 resize-none"
          placeholder="Add question description (optional)..."
          value={question.description}
          onChange={handleDescriptionChange}
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

      {/* Categories Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-lg">Categories</h3>
          <Button onClick={addCategory} size="sm">
            Add Category
          </Button>
        </div>

        <DndContext
          collisionDetection={closestCenter}
          onDragStart={({ active }) => setActiveId(active.id)}
          onDragEnd={handleCategoryDragEnd}
        >
          <SortableContext items={categories.map((_, i) => `category-${i}`)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {categories.map((category, index) => (
                <DraggableCategory
                  key={index}
                  category={category}
                  index={index}
                  onUpdate={updateCategory}
                  onDelete={deleteCategory}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* Items Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-lg">Items</h3>
          <Button onClick={addItem} size="sm">
            Add Item
          </Button>
        </div>

        <DndContext
          collisionDetection={closestCenter}
          onDragStart={({ active }) => setActiveId(active.id)}
          onDragEnd={handleItemDragEnd}
        >
          <SortableContext items={items.map((_, i) => `item-${i}`)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {items.map((item, index) => (
                <DraggableItem
                  key={index}
                  item={item}
                  index={index}
                  categories={categories}
                  onUpdate={updateItem}
                  onDelete={deleteItem}
                  onCategoryChange={(itemIndex, categoryId) => {
                    const newItems = [...items];
                    newItems[itemIndex] = { ...newItems[itemIndex], categoryId };
                    updateQuestion(question.id, {
                      settings: {
                        ...question.settings,
                        items: newItems
                      }
                    });
                  }}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
