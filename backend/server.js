import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import user_DB from './config/user_DB.js';
import router from './routes/routes.js';

dotenv.config();
const app = express();

app.use(cors({
  origin: 'http://localhost:5173'  
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For form data
app.use("/", router)

 await user_DB(); 



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});