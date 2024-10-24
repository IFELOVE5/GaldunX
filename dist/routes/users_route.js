"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoute = express_1.default.Router();
const users_controller_1 = require("../controllers/users_controller");
const jwt_1 = require("../middleware/jwt");
userRoute.get('/all', jwt_1.auth, users_controller_1.getAllUsers);
userRoute.post(`/register`, users_controller_1.registerUser);
userRoute.post(`/login`, users_controller_1.userLogin);
userRoute.delete(`/delete/:id`, users_controller_1.deleteUserById);
exports.default = userRoute;
