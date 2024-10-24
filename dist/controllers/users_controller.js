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
exports.deleteUserById = exports.userLogin = exports.registerUser = exports.getAllUsers = void 0;
const users_service_1 = require("../services/users_service");
const argon2_1 = __importDefault(require("argon2"));
const user_1 = __importDefault(require("../models/user"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Get all users from the database
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield users_service_1.userService.getAllUsers();
        if (users.length === 0) {
            res.status(404).json({ status: 'false', message: 'No users found' });
            return;
        }
        res.status(200).json({ status: 'true', data: users });
    }
    catch (error) {
        console.error('Error in getAllUsers:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});
exports.getAllUsers = getAllUsers;
// Register a new user
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        // Validate email and password format
        if (!/\S+@\S+\.\S+/.test(email)) {
            res.status(400).json({ message: 'Invalid email format' });
            return;
        }
        if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
            res.status(400).json({ message: 'Password must contain at least 8 characters, one letter, and one number' });
            return;
        }
        // Check if user already exists
        const existingUser = yield user_1.default.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            res.status(400).json({ message: 'Username or email already exists' });
            return;
        }
        // Hash password and save user
        const hashedPassword = yield argon2_1.default.hash(password);
        const user = new user_1.default({ username, email, password: hashedPassword });
        yield user.save();
        res.status(201).json({
            message: 'User registered successfully',
            user: { username, email },
        });
    }
    catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
exports.registerUser = registerUser;
// Handle user login
const userLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ status: false, message: 'All fields are required to login' });
        return;
    }
    try {
        // Check if user exists
        const existingUser = yield user_1.default.findOne({ email: email.toLowerCase() });
        if (!existingUser) {
            res.status(404).json({ status: false, message: "User account doesn't exist, kindly sign up" });
            return;
        }
        // Verify password
        const verifiedPassword = yield argon2_1.default.verify(existingUser.password, password);
        if (!verifiedPassword) {
            res.status(404).json({ status: false, message: 'Incorrect password, authentication failed' });
            return;
        }
        // Generate access and refresh tokens
        const accessToken = jsonwebtoken_1.default.sign({ id: existingUser.id, email: existingUser.email }, process.env.JWT_KEY, {
            expiresIn: '1h',
        });
        const refreshToken = jsonwebtoken_1.default.sign({ id: existingUser.id }, process.env.JWT_REFRESH_SECRET, {
            expiresIn: '7d',
        });
        // Set refresh token in cookie
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
        res.status(200).json({
            status: true,
            message: `User login successful, welcome ${existingUser.username}`,
            accessToken,
            expiresIn: 3600,
        });
    }
    catch (error) {
        console.error('Database query failed:', error);
        res.status(500).json({ status: false, message: 'An internal error occurred' });
    }
});
exports.userLogin = userLogin;
// Delete a user by ID
const deleteUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deletedUser = yield user_1.default.findByIdAndDelete(id);
        if (!deletedUser) {
            res.status(404).json({ status: false, message: 'User not found' });
            return;
        }
        res.status(200).json({ status: true, message: `User with id ${id} deleted successfully.` });
    }
    catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ status: false, message: 'Error occurred while deleting the user.' });
    }
});
exports.deleteUserById = deleteUserById;
