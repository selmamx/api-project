import "dotenv/config";
import express from 'express';
import {connectDB} from "./src/config/db.js";
import cookieParser from "cookie-parser";

import authRoutes from "./src/routes/authRoutes.js";
import ticketRoutes from './src/routes/ticketRoutes.js';
import leavesRoutes from './src/routes/leaveRoutes.js';
import announcementRoutes from './src/routes/announcementsRoutes.js';


connectDB();

const app = express();
const PORT = process.env.PORT|| 5000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/leaves', leavesRoutes);
app.use('/api/announcements', announcementRoutes);


app.listen(PORT, ()=> console.log(`Server is running on port: http://localhost:${PORT}`));