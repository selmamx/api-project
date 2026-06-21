import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

const connectDB = async () => {
  try{
    await pool.query('SELECT 1');
    console.log('Database connected successfully');
  }catch(error) {
    console.error('Database connection error: ${error.message}');
    process.exit(1);
  }
};

export {connectDB, pool};