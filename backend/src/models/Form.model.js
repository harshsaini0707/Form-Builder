import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  type: { type: String, enum: ["categorize", "cloze", "comprehension"] },
  questionText: String,
  image: String,      
  options: [String],
  categories: [String], 
  correctAnswer: mongoose.Schema.Types.Mixed, 
  passage: String, 
  blanks: [String],  
});


const formSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: String,
    headerImage: String,
    questions: [questionSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Form", formSchema);
