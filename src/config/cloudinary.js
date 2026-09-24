const cloudinary = require("cloudinary").v2;

// server.js requires its route modules before calling dotenv.config(),
// so configuring Cloudinary at require-time would read empty env vars.
// Configuring lazily (called from the controller right before use)
// guarantees dotenv has already run.
const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  return cloudinary;
};

module.exports = configureCloudinary;
