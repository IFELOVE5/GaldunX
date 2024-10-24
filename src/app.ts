import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import userRoute from './routes/users_route'

dotenv.config();

const app: Application = express();


app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json()); 


app.use('/api/v1/users', userRoute)

app.use((req: Request, res: Response) => {
    res.status(404).json({ message: 'Route not found!' });
  });
  
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
  });

export default app;
