import mongoose from "mongoose";

const responseSchema = new mongoose.Schema({
  formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form' },
  responses: [{
    questionIdx: Number,
    answer: mongoose.Schema.Types.Mixed,
  }],
 
},{
    timestamps :  true
});

export default mongoose.model("Response",responseSchema)
