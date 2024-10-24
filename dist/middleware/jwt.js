"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth = (req, res, next) => {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
        res.status(401).json({ message: 'Unauthorized access' });
        return;
    }
    if (!authorizationHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: "Invalid token format. It should start with 'Bearer '" });
        return;
    }
    const token = authorizationHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_KEY);
        req.user = decoded;
        next();
    }
    catch (error) {
        console.error('Token verification failed:', error);
        res.status(401).json({ message: 'Invalid or expired token' });
        return;
    }
};
exports.auth = auth;
