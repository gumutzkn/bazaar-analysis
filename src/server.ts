import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors'
import routes from './routes/routes';
import { config } from './config/config';
import { connectDB } from './db/connect';

dotenv.config();

const app = express();

connectDB()
  .then(() => {
    const server = app.listen(config.server.port, () => {
      console.log(`Server started on port ${config.server.port}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); 
  });

// cors
app.use(cors());

app.use('/api', routes);

