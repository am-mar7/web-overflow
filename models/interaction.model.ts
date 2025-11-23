import mongoose, { models, Schema, Types } from "mongoose";

export interface IInteraction {
  user: Types.ObjectId;
  actionId: Types.ObjectId;
  action: string;
  actionType: string;
}
export const InteractionActionEnums = [
  "view",
  "upvote",
  "downvote",
  "bookmark",
  "post",
  "edit",
  "delete",
  "search",
];
const InteractionSchema = new mongoose.Schema<IInteraction>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    actionId: { type: Schema.Types.ObjectId, required: true }, // 'questionId', 'answerId',
    action: { type: String, enum: InteractionActionEnums, required: true },
    actionType: { type: String, enum: ["question", "answer"], required: true },
  },
  { timestamps: true }
);

const Interaction =
  models?.Interaction ||
  mongoose.model<IInteraction>("Interaction", InteractionSchema);

export default Interaction;
