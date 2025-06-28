import Note from "../models/note.model.js";

import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

import cloudinary from "../config/cloudinary.js";

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
      newNote.attachments = req.files.map((file) => ({
        filename: file.originalname,
        url: file.path,
        size: file.size,
        mimeType: file.mimetype,
      }));
    }

    await newNote.save();
    res.status(201).json(newNote);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        error: "Duplicate Title",
        message: `Note with the title "${err.keyValue.title}" already exists. Please choose a different title.`,
      });
    }

    console.error("Create note error:", err);
    res.status(500).json({
      error: "Failed to create note",
      message: err.message,
    });
  }
};


export const updateNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const updates = req.body;

    // Find the existing note first to handle file deletions if needed
    const existingNote = await Note.findOne({
      _id: noteId,
      userId: req.user.userId,
    });
    if (!existingNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    // Handle new file uploads
    if (req.files && req.files.length > 0) {
      const newAttachments = req.files.map((file) => ({
        filename: file.originalname,
        url: file.path, // Cloudinary URL
        size: file.size,
        mimeType: file.mimetype,
      }));

      // If you want to replace all attachments, use this:
      updates.attachments = newAttachments;

      // If you want to append new attachments to existing ones, use this instead:
      // updates.attachments = [...(existingNote.attachments || []), ...newAttachments];
    }

    const updated = await Note.findOneAndUpdate(
      { _id: noteId, userId: req.user.userId },
      { ...updates, updatedAt: new Date() },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error("Update note error:", err);
    res.status(500).json({ error: "Failed to update note" });
  }
};

// Optional: Function to remove specific attachments
export const removeAttachment = async (req, res) => {
  try {
    const { noteId, attachmentIndex } = req.params;

    const note = await Note.findOne({ _id: noteId, userId: req.user.userId });
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    if (!note.attachments || attachmentIndex >= note.attachments.length) {
      return res.status(404).json({ error: "Attachment not found" });
    }

    const attachment = note.attachments[attachmentIndex];

    // Delete from Cloudinary
    try {
      const publicId = attachment.url.split("/").pop().split(".")[0];
      const fullPublicId = `easynotes/${publicId}`;
      await cloudinary.uploader.destroy(fullPublicId);
    } catch (error) {
      console.error("Error deleting file from Cloudinary:", error);
    }

    // Remove from database
    note.attachments.splice(attachmentIndex, 1);
    note.updatedAt = new Date();
    await note.save();

    res.json(note);
  } catch (err) {
    console.error("Remove attachment error:", err);
    res.status(500).json({ error: "Failed to remove attachment" });
  }
};

export const enhanceNoteWithAI = async (req, res) => {
  const { note } = req.body;

  if (!req.user || !req.user.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!note) {
    return res.status(400).json({ error: "Note is required" });
  }

  const prompt = `
I am building a note-taking application. Users can write notes in a text area, but many of them contain grammar and spelling mistakes, inconsistent formatting, and poor structure.

Please:
1. Correct all grammar and spelling errors.
2. Organize the content clearly using proper structure (paragraphs, headings, lists, etc.).
3. Return the improved note as clean HTML using tags like <h1>, <p>, <ul>, <li>, etc.
4. Do not change the meaning of the content — just improve readability and structure.
5. Do not include anything other than the final HTML code.
6. Return ONLY the cleaned HTML as plain text — DO NOT wrap it inside \`\`\`html or any markdown.
---

Raw Note:
${note}
`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(prompt);
    const response = result.response;
    const html = response.text();

    if (!html) {
      return res.status(500).json({ error: "Failed to generate HTML" });
    }

    res.json({
      message: "Note sanitized and enhanced successfully",
      html,
    });
  } catch (error) {
    console.error("Gemini Error:", error.message);
    res.status(500).json({ error: "Failed to sanitize note.", error });
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
    return res.json({
      message: `Note ${note.isPinned ? "pinned" : "unpinned"} successfully`,
      isPinned: note.isPinned,
    });
  } catch (err) {
    console.error("Pin note error:", err);
    return res.status(500).json({ error: "Failed to pin note" });
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
      isArchived: note.isArchived,
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
    console.log(noteIds);
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
// Add this to your note.controller.js
export const addAttachments = async (req, res) => {
  try {
    const noteId = req.params.id;

    const note = await Note.findOne({ _id: noteId, userId: req.user.userId });
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files provided" });
    }

    const newAttachments = req.files.map((file) => ({
      filename: file.originalname,
      url: file.path, // Cloudinary URL
      size: file.size,
      mimeType: file.mimetype,
    }));

    // Add new attachments to existing ones
    note.attachments = [...(note.attachments || []), ...newAttachments];
    note.updatedAt = new Date();

    await note.save();
    res.json(note);
  } catch (err) {
    console.error("Add attachments error:", err);
    res.status(500).json({ error: "Failed to add attachments" });
  }
};
