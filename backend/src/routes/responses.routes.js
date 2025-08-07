import { Router } from 'express';
import { body } from 'express-validator';
import { submitResponse } from '../controllers/responseController.js';

const router = Router();

const validateResp = [
  body('answers').isArray(),
  body('answers.*.questionId').notEmpty(),
  body('answers.*.questionType').isIn(['categorize','cloze','comprehension']),
  body('answers.*.answer').notEmpty()
];

router.post('/:formId', validateResp, submitResponse);

export default router;
