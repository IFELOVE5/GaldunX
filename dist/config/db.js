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
const mongoose_1 = __importDefault(require("mongoose"));
// Async function to connect to the MongoDB database
const dbConnect = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const MONGO_URL = process.env.MONGO_URL; // Get MongoDB URL from environment variables
        const connectOptions = {
            autoIndex: true, // Automatically build indexes
            serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds if unable to connect
        };
        yield mongoose_1.default.connect(MONGO_URL, connectOptions); // Establish connection
        console.log('MongoDB connected successfully!');
    }
    catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit process on connection failure
    }
});
exports.default = dbConnect;
