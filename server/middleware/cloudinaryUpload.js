import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "easynotes",
    allowed_formats: ["jpg", "png", "pdf", "docx", "txt"],
  },
});

const upload = multer({ storage });

export default upload;
