import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // Reference to the User
  title: String,
  content: String, // Rich text (HTML, Slate, Quill JSON)
  tags: [String], // Array of tags for categorization
  isPinned: { type: Boolean, default: false }, // Pinning feature
  isArchived: { type: Boolean, default: false }, // Archive feature
  color: { type: String, default: "#ffffff" }, // Background color for the note
  attatchments: [
    {
      filename: String, // Name of the file
      url: String, // URL to access the file
      size: Number, // Size of the file in bytes
      mimeType: String, // MIME type of the file
    },
  ],
  createdAt: Date,
  updatedAt: Date,
});

const Note = mongoose.model("Note", NoteSchema);
NoteSchema.pre("save", function (next) {
  const now = new Date();
  if (!this.createdAt) {
    this.createdAt = now;
  }
  this.updatedAt = now;
  next();
});
export default Note;
