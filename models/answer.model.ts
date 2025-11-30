import mongoose, { models, Schema, Types , Document} from "mongoose";

export interface IAnswer {
  author: Types.ObjectId;
  question: Types.ObjectId;
  content: string;
  upvotes: number;
  downvotes: number;
}
export interface IAnswerDoc extends IAnswer , Document {}
const AnswerSchema = new mongoose.Schema<IAnswer>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
    content: {type : String , required: true},
    upvotes: {type : Number , default:0},
    downvotes: {type : Number , default:0},
  },
  { timestamps: true }
);

const Answer =
  models?.Answer || mongoose.model<IAnswer>("Answer", AnswerSchema);

export default Answer;
