import { Router } from "express";
import {
  archiveUnarchiveNote,
  createNote,
  deleteManyNotes,
  deleteNote,
  getArchivedNotes,
  getNote,
  getPinnedNotes,
  pinUnpinNote,
  updateNote,
} from "../controllers/note.controller.js";
import { getNotes } from "../controllers/note.controller.js";

const noteRouter = Router();

noteRouter.get("/notes", getNotes);
noteRouter.get("/:id", getNote);
noteRouter.get("/getarchives", getArchivedNotes);
noteRouter.get("/getpinned", getPinnedNotes);

noteRouter.post("/create", createNote);

noteRouter.put("/update/:id", updateNote);
noteRouter.put("/togglepin/:id", pinUnpinNote);
noteRouter.put("/togglearchive/:id", archiveUnarchiveNote);

noteRouter.delete("/delete/:id", deleteNote);
noteRouter.delete("/delete", deleteManyNotes);

export default noteRouter;
