import express, { Request, Response } from 'express';

const userRoute = express.Router();
import { deleteUserById, getAllUsers, userLogin, registerUser } from '../controllers/users_controller';
import { auth } from '../middleware/jwt';


userRoute.get('/all', auth,  getAllUsers);

userRoute.post(`/register`, registerUser)

userRoute.post(`/login`, userLogin)

userRoute.delete(`/delete/:id`, auth, deleteUserById)



export default userRoute;
