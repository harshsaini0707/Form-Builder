// Helper to generate unique IDs
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Default settings for each question type
export const getDefaultSettings = (type) => {
  switch (type) {
    case 'categorize':
      return {
        categories: ['Category 1', 'Category 2'],
        items: [
          { text: 'Item 1', categoryId: '0' },
          { text: 'Item 2', categoryId: '1' }
        ],
        points: 1
      };
    case 'cloze':
      return {
        passage: 'A quick brown fox jumped over a fence',
        selectedWords: ['brown', 'fence'],
        options: [
          { text: 'brown', selected: true },
          { text: 'fence', selected: true },
          { text: 'quick', selected: false }
        ],
        points: 1
      };
    case 'comprehension':
      return {
        passage: 'Water is essential for life on Earth. It helps to regulate the planet\'s temperature, shapes its landscapes, and provides habitat for millions of species. What makes water so special is the water cycle, also known as the hydrological cycle.',
        mcqs: [
          {
            question: 'According to the passage, one key feature of the water cycle is that:',
            options: [
              { text: 'Water evaporates from the surface into the atmosphere.', correct: true },
              { text: 'Water only exists in liquid form.', correct: false },
              { text: 'Water moves from the surface to deep underground.', correct: false },
              { text: 'Water remains in the clouds forever.', correct: false }
            ]
          }
        ],
        points: 1
      };
    default:
      return {};
  }
};
