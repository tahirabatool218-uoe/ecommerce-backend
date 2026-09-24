const { Readable } = require("stream");
const getCloudinary = require("../config/cloudinary");

// Streams the in-memory buffer multer gave us straight to Cloudinary — the
// image binary is never written to disk or saved in MongoDB.
const uploadToCloudinary = (buffer) => {
  const cloudinary = getCloudinary();

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "ecommerce-products",
        resource_type: "image"
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    Readable.from(buffer).pipe(uploadStream);
  });
};

// POST /api/upload/product-image (Admin) — accepts a single "image" file
// and returns the Cloudinary-hosted URL to save on the product.
const uploadProductImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No image file provided"
      });
    }

    const result = await uploadToCloudinary(req.file.buffer);

    res.status(200).json({
      message: "Image uploaded successfully",
      url: result.secure_url
    });
  } catch (error) {
    res.status(500).json({
      message: "Image upload failed",
      error: error.message
    });
  }
};

module.exports = {
  uploadProductImage
};
