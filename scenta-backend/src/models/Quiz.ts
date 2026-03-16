import mongoose, { Schema } from "mongoose";

const OptionTranslationSchema = new Schema(
  { label: String },
  { _id: false }
);

const QuizOptionSchema = new Schema(
  {
    translations: {
      type: Map,
      of: OptionTranslationSchema,
      default: {}
    },
    score: { type: Number, required: true },
    note: { type: String, required: true }
  },
  { _id: false }
);

const QuestionTranslationSchema = new Schema(
  { prompt: String },
  { _id: false }
);

const QuizQuestionSchema = new Schema(
  {
    translations: {
      type: Map,
      of: QuestionTranslationSchema,
      default: {}
    },
    options: { type: [QuizOptionSchema], default: [] },
    position: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const QuizQuestion = mongoose.model("QuizQuestion", QuizQuestionSchema);
