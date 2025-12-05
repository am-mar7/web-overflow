import mongoose, { models, Schema, Types, Document } from "mongoose";

export interface IViewQuestion {
  viewer: Types.ObjectId;
  questionId: Types.ObjectId;
}

export interface IViewQuestionDoc extends IViewQuestion, Document {}

const ViewQuestionSchema = new mongoose.Schema<IViewQuestion>(
  {
    viewer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    questionId: {
      type: Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
  },
  { timestamps: true }
);

const ViewQuestion =
  models?.ViewQuestion ||
  mongoose.model<IViewQuestion>("ViewQuestion", ViewQuestionSchema);

export default ViewQuestion;