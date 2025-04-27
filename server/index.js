import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/Auth.js";
import db from "./db/db.js";
import taskRouter from './routes/Tasks.js';

dotenv.config();
db.connectDB()
db.connectTaskDB()
const app = express();

const port = process.env.PORT

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use(express.json());
app.use('/api/auth', authRouter)
app.use('/api/tasks', taskRouter);


app.get("/", (req, res) => {
  res.send("Your server works fine!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});