import mongoose from 'mongoose';
import { config } from '../config/config';

export const connectDB = () => {
	console.log('Connected to MongoDB');
	return mongoose.connect(config.mongo.url);
};
