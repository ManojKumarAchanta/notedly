// routes/category.js
import express from "express";
import Category from "../models/category.model.js";
const router = express.Router();

// Create category
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.userId; // Assuming middleware sets `req.user`
    const category = await Category.create({ name, userId });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
//delete category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId; // Assuming middleware sets `req.user`
    const category = await Category.findOneAndDelete({ _id: id, userId });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Get categories for user
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ userId: req.user.userId });
    if (!categories) {
      return res.status(204).json({ message: "No Categories found" });
    }
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
