import mongoose, { models , Document} from "mongoose";

export interface IUser {
  name: string;
  email: string;
  bio?: string;
  image?: string;
  portfolio?: string;
  reputation?: number;
}
export interface IUserDoc extends IUser , Document {}

const UserSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    bio: { type: String },
    image: { type: String },
    portfolio: { type: String },
    reputation: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const User = models?.User || mongoose.model<IUser>("User", UserSchema);

export default User;
