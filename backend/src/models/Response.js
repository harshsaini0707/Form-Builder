import mongoose from "mongoose";

const responseSchema = new mongoose.Schema({
  formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form' },
  respondentEmail: String,
  answers: [{
    questionId: String,
    answer: mongoose.Schema.Types.Mixed,
    isCorrect: Boolean,
    score: Number
  }],
  totalScore: Number,
  completionTime: Number
}, {
  timestamps: true
});

export default mongoose.model("Response",responseSchema)
