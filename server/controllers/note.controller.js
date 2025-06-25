import Note from "../models/note.model.js";

export const createNote = async (req, res) => {
  try {
    const { title, content, tags, isPinned, isArchived, color } = req.body;

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
