import dotenv from 'dotenv';

dotenv.config();

const MONGO_USERNAME = process.env.MONGO_USERNAME || '';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || '';
const MONGO_CLUSTER = process.env.MONGO_CLUSTER || '';
const MONGO_DBNAME = process.env.MONGO_DBNAME || '';

const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_CLUSTER}.f9epbba.mongodb.net/${MONGO_DBNAME}?retryWrites=true&w=majority`;

const SERVER_PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 1337;

export const config = {
	mongo: {
		url: MONGO_URL,
	},
	server: {
		port: SERVER_PORT,
	},
};
