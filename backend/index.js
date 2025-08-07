import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';


dotenv.config();

const app = express();

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({ 
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



const PORT = process.env.PORT || 5000;

try {
  await connectDB();
  console.log('DB connected successfully!');

  app.listen(PORT, () => {
    console.log(`Server started`);
  });

} catch (err) {
  console.error(' Failed to connect to DB:', err.message);
  process.exit(1);
}

export default app;
