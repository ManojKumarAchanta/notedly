import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRouter from "./routes/user.router.js";
import noteRouter from "./routes/note.route.js";
import cors from "cors";
import { protect } from "./middleware/auth.middleware.js";
dotenv.config({ path: "./.env" });

const port = process.env.PORT;
const app = express();

app.use(
  cors({
    origin: ["https://notedly-delta.vercel.app", "http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", userRouter);
app.use("/api/note", protect, noteRouter);

app.listen(port, () => {
  connectDB();
  console.log(`Server is running on port ${port}`);
});
