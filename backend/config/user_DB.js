import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const user_DB = async () => {
  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("database connected")
  } catch (err) {
    console.error('MongoDB connection error:', err);
   
  }
};
export default user_DB;

