import mongoose, { Schema } from "mongoose";

const QuizOptionSchema = new Schema(
  {
    label: { type: String, required: true },
    labelAr: String,
    score: { type: Number, required: true },
    note: { type: String, required: true }
  },
  { _id: false }
);

const QuizQuestionSchema = new Schema(
  {
    prompt: { type: String, required: true },
    promptAr: String,
    options: { type: [QuizOptionSchema], default: [] },
    position: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const QuizQuestion = mongoose.model("QuizQuestion", QuizQuestionSchema);
