import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: { id: string; email: string }; 
}

export const auth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    res.status(401).json({ message: 'Unauthorized access' });
    return ;
  }

  if (!authorizationHeader.startsWith('Bearer ')) {
     res.status(401).json({ message: "Invalid token format. It should start with 'Bearer '" });
     return;
  }

  const token = authorizationHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY as string) as { id: string; email: string }; 
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification failed:', error); 
    res.status(401).json({ message: 'Invalid or expired token' });
    return;
  }
};
