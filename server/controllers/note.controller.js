import Note from "../models/note.model.js";

export const createNote = async (req, res) => {
  try {
    const { title, content, tags, isPinned, isArchived, color } = req.body;
    console.log(req.user.userId);
    const newNote = new Note({
      userId: req.user.userId,
      title,
      content,
      tags,
      isPinned,
      isArchived,
      color,
    });

    if (req.files && req.files.length > 0) {
      newNote.attatchments = req.files.map((file) => ({
        filename: file.originalname,
        url: file.path,
        size: file.size,
        mimeType: file.mimetype,
      }));
    }

    await newNote.save();
    res.status(201).json(newNote);
  } catch (err) {
    console.error("Create note error:", err);
    res.status(500).json({ error: "Failed to create note" });
  }
};

export const pinUnpinNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    //toggle pin status
    const note = await Note.findOne({
      _id: noteId,
      userId: req.user.userId,
    });
    if (!note) return res.status(404).json({ error: "Note not found" });
    note.isPinned = !note.isPinned;
    note.updatedAt = new Date();
    await note.save();
    res.json({
      message: `Note ${note.isPinned ? "pinned" : "unpinned"} successfully`,
      note,
    });
  } catch (err) {
    console.error("Pin note error:", err);
    res.status(500).json({ error: "Failed to pin note" });
  }
};

export const getPinnedNotes = async (req, res) => {
  try {
    const notes = await Note.find({
      userId: req.user.userId,
      isPinned: true,
    }).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error("Get pinned notes error:", err);
    res.status(500).json({ error: "Failed to fetch pinned notes" });
  }
};

export const archiveUnarchiveNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    //toggle archive status
    const note = await Note.findOne({
      _id: noteId,
      userId: req.user.userId,
    });
    if (!note) return res.status(404).json({ error: "Note not found" });
    note.isArchived = !note.isArchived;
    note.updatedAt = new Date();
    await note.save();
    res.json({
      message: `Note ${
        note.isArchived ? "archived" : "unarchived"
      } successfully`,
      note,
    });
  } catch (err) {
    console.error("Archive note error:", err);
    res.status(500).json({ error: "Failed to archive note" });
  }
};
export const getArchivedNotes = async (req, res) => {
  try {
    const notes = await Note.find({
      userId: req.user.userId,
      isArchived: true,
    }).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error("Get archived notes error:", err);
    res.status(500).json({ error: "Failed to fetch archived notes" });
  }
};

export const deleteManyNotes = async (req, res) => {
  try {
    const { noteIds } = req.body; // Expecting an array of note IDs to
    console.log(noteIds)
    if (!Array.isArray(noteIds) || noteIds.length === 0) {
      return res.status(400).json({ error: "Invalid note IDs" });
    }
    const deletedNotes = await Note.deleteMany({
      _id: { $in: noteIds },
      userId: req.user.userId,
    });
    if (deletedNotes.deletedCount === 0) {
      return res.status(404).json({ error: "No notes found to delete" });
    }
    res.json({
      message: `${deletedNotes.deletedCount} notes deleted successfully`,
    });
  } catch (err) {
    console.error("Delete many notes error:", err);
    res.status(500).json({ error: "Failed to delete notes" });
  }
};
// This function fetches a single note by its ID
export const getNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const note = await Note.findOne({
      _id: noteId,
      userId: req.user.userId,
    });
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.json(note);
  } catch (err) {
    console.error("Get note error:", err);
    res.status(500).json({ error: "Failed to fetch note" });
  }
};
export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.userId }).sort({
      updatedAt: -1,
    });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notes" });
  }
};

export const updateNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const updates = req.body;

    const updated = await Note.findOneAndUpdate(
      { _id: noteId, userId: req.user.userId },
      { ...updates, updatedAt: new Date() },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Note not found" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update note" });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const noteId = req.params.id;

    const deleted = await Note.findOneAndDelete({
      _id: noteId,
      userId: req.user.userId,
    });

    if (!deleted) return res.status(404).json({ error: "Note not found" });

    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete note" });
  }
};
