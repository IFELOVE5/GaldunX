import app from './app';
import dbConnect from './config/db';

const PORT = process.env.PORT ||3000;




console.log('Attempting to start server...');
const startServer = async (): Promise<void> => {
  try {

    await dbConnect();
   
    app.listen(PORT, () => {
      console.log(`Server running on port:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1); 
  }
};


startServer();
