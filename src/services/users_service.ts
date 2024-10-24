import User, { CreateUserData, IUser } from '../models/user';
import argon2 from 'argon2'

class UserService {   

  async getAllUsers(): Promise<IUser[]> {
    try {
        return await User.find().select('username email')
    } catch (error) {
      console.error(' Error fetching users:', error);
      throw new Error('Unable to retrieve users');
    }
  }

  async updateUser(userId: string, updateData: Partial<IUser>): Promise<IUser | null> {
    try {
      const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Unable to update user');
    }
  }

  async deleteUser(userId: string): Promise<IUser | null> {
    try {
      return await User.findByIdAndDelete(userId);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('Unable to delete user');
    }
  }
}

export const userService = new UserService();
