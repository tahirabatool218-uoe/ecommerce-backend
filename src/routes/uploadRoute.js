const express = require("express");
const multer = require("multer");

const { uploadProductImage } = require("../controllers/uploadController");
const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Wraps multer so its errors (bad file type, too large) come back as the
// same { message } JSON shape the rest of the API uses, instead of an
// unhandled exception.
const handleUpload = (req, res, next) => {
  upload.single("image")(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      const message =
        error.code === "LIMIT_FILE_SIZE"
          ? "Image must be smaller than 5MB"
          : error.message;
      return res.status(400).json({ message });
    }
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    next();
  });
};

// Admin-only: uploads a product image to Cloudinary and returns its URL.
router.post("/product-image", protect, admin, handleUpload, uploadProductImage);

module.exports = router;
