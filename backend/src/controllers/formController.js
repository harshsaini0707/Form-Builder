import Form from '../models/Form.model.js';
import { validationResult } from 'express-validator';

export async function createForm(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const form = await Form.create(req.body);
    res.status(201).json({ success: true, data: form });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getForms(_, res) {
  try {
    const forms = await Form.find().sort({ updatedAt: -1 });
    res.json({ success: true, data: forms });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getForm(req, res) {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: form });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function updateForm(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const form = await Form.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!form) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: form });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function deleteForm(req, res) {
  try {
    const form = await Form.findByIdAndDelete(req.params.id);
    if (!form) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function duplicateForm(req, res) {
  try {
    const original = await Form.findById(req.params.id);
    if (!original) return res.status(404).json({ success: false, message: 'Not found' });

    const copy = await Form.create({
      title: original.title + ' (copy)',
      description: original.description,
      headerImage: original.headerImage,
      questions: original.questions
    });
    res.status(201).json({ success: true, data: copy });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}
