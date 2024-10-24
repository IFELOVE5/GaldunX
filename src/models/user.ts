import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface defining the User document structure
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

// Type for creating a new user, excluding auto-generated fields
export type CreateUserData = Omit<IUser, '_id' | 'createdAt' | 'updatedAt'>;

// Schema for the User model
const userSchema: Schema<IUser> = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true }
  },
  { timestamps: true } // Automatically manage createdAt and updatedAt
);

// Create and export the User model
const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
export default User;
