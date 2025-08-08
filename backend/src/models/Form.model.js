import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  id: String,
  type: { type: String, enum: ["categorize", "cloze", "comprehension"] },
  title: String,
  description: String,
  image: String,
  required: Boolean,
  settings: mongoose.Schema.Types.Mixed
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
