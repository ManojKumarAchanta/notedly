import { Router } from "express";
import {
  archiveUnarchiveNote,
  createNote,
  deleteManyNotes,
  deleteNote,
  enhanceNoteWithAI,
  getArchivedNotes,
  getNote,
  getPinnedNotes,
  pinUnpinNote,
  updateNote,
  removeAttachment,
  addAttachments,
  filterNotesByCategory,
} from "../controllers/note.controller.js";
import { getNotes } from "../controllers/note.controller.js";
import upload from "../middleware/cloudinaryUpload.js"; // Your multer-cloudinary config
import {
  createCategory,
  getAllCategories,
} from "../controllers/category.controller.js";

const noteRouter = Router();

// GET routes
// GET routes
noteRouter.get("/notes", getNotes);
noteRouter.get("/notes/categories/:categoryId", filterNotesByCategory); // Make this more specific
noteRouter.get("/getarchives", getArchivedNotes);
noteRouter.get("/getpinned", getPinnedNotes);
noteRouter.get("/categories", getAllCategories);
noteRouter.get("/note/:id", getNote); // Put this last among GETs

// POST routes
noteRouter.post("/create-category", createCategory);
noteRouter.post("/create", upload.array("attachments", 5), createNote);
noteRouter.post("/enhance", enhanceNoteWithAI);
noteRouter.post(
  "/:id/attachments",
  upload.array("attachments", 5),
  addAttachments
); // Add attachments to existing note

// PUT routes
noteRouter.put("/update/:id", upload.array("attachments", 5), updateNote);
noteRouter.put("/togglepin/:id", pinUnpinNote);
noteRouter.put("/togglearchive/:id", archiveUnarchiveNote);

// DELETE routes
noteRouter.delete("/delete/:id", deleteNote);
noteRouter.delete("/delete", deleteManyNotes);
noteRouter.delete("/:noteId/attachments/:attachmentIndex", removeAttachment); // Remove specific attachment

export default noteRouter;
