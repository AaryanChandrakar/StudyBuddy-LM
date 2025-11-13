import multer from "multer";
import path from "path";
import fs from "fs";

// Create upload directory if it doesn't exist
const createUploadDir = (userId) => {
  const uploadPath = path.join("uploads", `user_${userId}`);
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
  return uploadPath;
};

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = createUploadDir(req.user.id);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Create unique filename: userId_timestamp_originalname
    const uniqueName = `${req.user.id}_${Date.now()}_${file.originalname}`;
    cb(null, uniqueName);
  },
});

// Allow only PDF and TXT files
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["application/pdf", "text/plain", "text/markdown"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, TXT, and MD files are allowed"), false);
  }
};

// Configure upload middleware
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: fileFilter,
});

export default upload;
