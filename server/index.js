import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRouter from "./routes/user.router.js";
import noteRouter from "./routes/note.route.js";

const port = process.env.PORT || 5000;
dotenv.config({ path: "./.env" });
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", userRouter);
app.use("/api/note", noteRouter);

app.listen(port, () => {
  connectDB();
  console.log(`Server is running on port ${port}`);
});
