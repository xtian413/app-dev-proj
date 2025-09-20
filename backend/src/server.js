import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';  

import { initDB } from './config/db.js';
import studentsRouter from './routes/studentsRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());    
app.use(express.json());

app.use('/api/students', studentsRouter);


initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server is listening on http://localhost:${PORT}`);
    });
})

