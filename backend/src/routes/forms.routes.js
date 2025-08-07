import { Router } from 'express';
import { body } from 'express-validator';
import {
  createForm, getForms, getForm,
  updateForm, deleteForm, duplicateForm
} from '../controllers/formController.js';

const router = Router();

const validateForm = [
  body('title').notEmpty().withMessage('Title required'),
  body('questions').isArray().withMessage('Questions must be array'),
  body('questions.*.type').isIn(['categorize','cloze','comprehension'])
];

router.post('/', validateForm, createForm);
router.get('/', getForms);
router.get('/:id', getForm);
router.put('/:id', validateForm, updateForm);
router.delete('/:id', deleteForm);
router.post('/:id/duplicate', duplicateForm);

export default router;
