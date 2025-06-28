import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// ❗ Make category name unique per user (compound index)
CategorySchema.index({ userId: 1, name: 1 }, { unique: true });

const Category = mongoose.model("Category", CategorySchema);
export default Category;
