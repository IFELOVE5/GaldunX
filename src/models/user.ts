import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateUserData = Omit<IUser, '_id' | 'createdAt' | 'updatedAt'>;

const userSchema: Schema<IUser> = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;
