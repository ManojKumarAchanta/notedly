import { Router } from "express";
import {
  createNote,
  deleteNote,
  updateNote,
} from "../controllers/note.controller.js";

const noteRouter = Router();

noteRouter.post("/create", createNote);
noteRouter.put("/update", updateNote);
noteRouter.delete("/delete", deleteNote);

export default noteRouter;
