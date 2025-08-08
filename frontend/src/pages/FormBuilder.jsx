import { useForm } from '../hooks/useForm';
import { useState } from 'react';
import Button from '../components/ui/Button';
import QuestionSidebar from '../components/form/QuestionSidebar';
import QuestionCard from '../components/form/QuestionCard';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import api from '../api/client';
import toast from 'react-hot-toast';

export default function FormBuilder() {
  const { form, updateForm, reorderQuestions } = useForm();
  const [isSaving, setIsSaving] = useState(false);

  function handleTitleChange(event) {
    updateForm({ title: event.target.value });
  }

  function handleDescriptionChange(event) {
    updateForm({ description: event.target.value });
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    
    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = form.questions.findIndex(q => q.id === active.id);
    const newIndex = form.questions.findIndex(q => q.id === over.id);
    
    const newOrder = arrayMove(form.questions, oldIndex, newIndex);
    reorderQuestions(newOrder);
  }

  async function handleSave() {
    setIsSaving(true);
    
    try {
      const response = await api.post('/forms', {
        title: form.title,
        description: form.description,
        headerImage: form.headerImage,
        questions: form.questions
      });
      
      toast.success('Form saved successfully!');
      console.log('Saved form ID:', response.data.data._id);
      
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save form');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="flex h-full">
      <QuestionSidebar />

      <div className="flex-1 overflow-y-auto p-6">
        {/* Form header */}
        <div className="mb-6">
          <input
            type="text"
            className="input text-3xl font-semibold mb-2 border-0 bg-transparent"
            placeholder="Enter form title..."
            value={form.title}
            onChange={handleTitleChange}
          />
          
          <textarea
            className="input h-20 border-0 bg-transparent resize-none"
            placeholder="Add form description..."
            value={form.description}
            onChange={handleDescriptionChange}
          />
        </div>

        {/* Questions list with drag and drop */}
        <DndContext 
          collisionDetection={closestCenter} 
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={form.questions} 
            strategy={verticalListSortingStrategy}
          >
            {form.questions.map(question => (
              <QuestionCard 
                key={question.id} 
                question={question} 
              />
            ))}
          </SortableContext>
        </DndContext>

        {/* Empty state */}
        {form.questions.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg mb-2">No questions yet</p>
            <p>Use the sidebar to add your first question</p>
          </div>
        )}

        {/* Save button */}
        <div className="mt-8 pt-6 border-t">
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="px-8"
          >
            {isSaving ? 'Saving...' : 'Save Form'}
          </Button>
        </div>
      </div>
    </div>
  );
}
