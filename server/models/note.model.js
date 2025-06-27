import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true, unique: true },
    content: String,
    tags: [String],
    isPinned: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
    color: { type: String, default: "#ffffff" },
    attatchments: [
      {
        filename: String,
        url: String,
        size: Number,
        mimeType: String,
      },
    ],
  },
  { timestamps: true } // ✅ auto-adds createdAt and updatedAt
);

const Note = mongoose.model("Note", NoteSchema);
export default Note;
