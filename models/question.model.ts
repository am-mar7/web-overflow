import mongoose, { models, Schema, Types , Document } from "mongoose";

export interface IQuestion {
  author: Types.ObjectId;
  title: string;
  content: string;
  tags: Types.ObjectId[];
  views: number;
  answers: number;
  upvotes: number;
  downvotes: number;
}
export interface IQuestionDoc extends IQuestion , Document{}
const QuestionSchema = new mongoose.Schema<IQuestion>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    content : { type: String, required: true },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    views : { type: Number, default: 0 },
    answers : { type: Number, default: 0 },
    upvotes : { type: Number, default: 0 },
    downvotes : { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Question =
  models?.Question || mongoose.model<IQuestion>("Question", QuestionSchema);

export default Question;
