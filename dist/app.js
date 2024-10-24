"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const users_route_1 = __importDefault(require("./routes/users_route"));
dotenv_1.default.config(); // Load environment variables
const app = (0, express_1.default)();
// Security, logging, and middleware setup
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json()); // Parse JSON request bodies
// User routes
app.use('/api/v1/users', users_route_1.default);
// Handle 404 - Route not found
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found!' });
});
// Handle 500 - Internal server errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});
exports.default = app;
