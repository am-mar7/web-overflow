import mongoose, { models, Schema, Types } from "mongoose";

export interface IVote {
  author: Types.ObjectId;
  targetId: Types.ObjectId;
  targetType: "question" | "answer";
  voteType: "upvote" | "downvote";
}

const VoteSchema = new mongoose.Schema<IVote>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    targetId: { type: Schema.Types.ObjectId, required: true },
    targetType: { type: String, enum:["question" , "answer"] , required: true },
    voteType: {type: String , enum:["upvote" , "downvote"] , required:true},
  },
  { timestamps: true }
);

const Vote = models?.Vote || mongoose.model<IVote>("Vote", VoteSchema);

export default Vote;
