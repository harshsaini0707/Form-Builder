import Response from '../models/Response.js';
import Form from '../models/Form.js';
import { validationResult } from 'express-validator';
import {
  validateCategorize,
  validateCloze,
  clozeScore,
  validateComprehension
} from '../utils/scoring.js';

export async function submitResponse(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const form = await Form.findById(req.params.formId);
    if (!form) return res.status(404).json({ success: false, message: 'Form not found' });

    const processed = req.body.answers.map(a => {
      const q = form.questions.find(q => q.id === a.questionId);
      if (!q) return { ...a, isCorrect: false, score: 0 };

      let isCorrect = false, score = 0;

      switch (q.type) {
        case 'categorize':
          isCorrect = validateCategorize(a.answer, q.settings.correctAnswer);
          score = isCorrect ? (q.settings.points ?? 1) : 0;
          break;
        case 'cloze':
          isCorrect = validateCloze(a.answer, q.settings.correctAnswers);
          score = clozeScore(a.answer, q.settings.correctAnswers, q.settings.points ?? 1);
          break;
        case 'comprehension':
          isCorrect = validateComprehension(a.answer, q.settings.correctAnswer);
          score = isCorrect ? (q.settings.points ?? 1) : 0;
          break;
      }
      return { ...a, isCorrect, score };
    });

    const total = processed.reduce((s, a) => s + a.score, 0);
    const resp  = await Response.create({
      formId: form._id,
      respondentEmail: req.body.respondentEmail,
      answers: processed,
      totalScore: total,
      completionTime: req.body.completionTime
    });

    res.status(201).json({
      success: true,
      data: { responseId: resp._id, totalScore: total }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}
