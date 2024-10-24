"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const user_1 = __importDefault(require("../models/user"));
class UserService {
    // Retrieve all users, selecting only username and email fields
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield user_1.default.find().select('username email');
            }
            catch (error) {
                console.error('Error fetching users:', error);
                throw new Error('Unable to retrieve users');
            }
        });
    }
    // Update user details by ID and return the updated user
    updateUser(userId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedUser = yield user_1.default.findByIdAndUpdate(userId, updateData, { new: true });
                return updatedUser;
            }
            catch (error) {
                console.error('Error updating user:', error);
                throw new Error('Unable to update user');
            }
        });
    }
    // Delete user by ID and return the deleted user
    deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield user_1.default.findByIdAndDelete(userId);
            }
            catch (error) {
                console.error('Error deleting user:', error);
                throw new Error('Unable to delete user');
            }
        });
    }
}
exports.userService = new UserService();
