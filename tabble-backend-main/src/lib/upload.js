const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp'); // For processing images and stripping EXIF metadata

// Ensure the uploads folder exists
const ensureUploadsFolderExists = () => {
  const dir = 'uploads';
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

ensureUploadsFolderExists();

// Helper function to validate filenames
const isValidFilename = (filename) => {
  const invalidPatterns = [
    /\0/, // Null byte
    /\.\./, // Double dots (directory traversal)
    /[<>:"/\\|?*]/, // Meta characters
    /\.{2,}/, // Double extensions
  ];
  const MAX_FILENAME_LENGTH = 255;

  // Check filename length
  if (filename.length > MAX_FILENAME_LENGTH) {
    return 'Filename is too long';
  }

  // Check for invalid patterns
  for (const pattern of invalidPatterns) {
    if (pattern.test(filename)) {
      return `Invalid filename: ${filename}`;
    }
  }

  return null; // Filename is valid
};

// Define multer storage with additional processing to strip EXIF metadata
const storage = multer.memoryStorage(); // Use memory storage to process files before saving

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 15 // Limit file size to 15 MB
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/; // Allowed file types
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (!mimetype || !extname) {
      return cb(new Error('Error: File upload only supports the following filetypes - jpeg, jpg, png'));
    }

    const validationError = isValidFilename(file.originalname);
    if (validationError) {
      return cb(new Error(validationError));
    }

    cb(null, true); // File is valid
  }
});

// Middleware to process images and strip EXIF metadata
const processImage = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).send({ error: 'No file uploaded' });
  }

  const originalName = req.file.originalname;
  const sanitizedFilename = `${Date.now()}-${path.basename(originalName)}`;
  const outputPath = path.join('uploads', sanitizedFilename);

  try {
    // Use sharp to strip EXIF metadata and save the processed image
    await sharp(req.file.buffer)
      .toFormat('jpeg') // Convert to JPEG (can also be PNG if needed)
      .toFile(outputPath);

    req.file.path = outputPath; // Save the processed file path for further use
    next();
  } catch (err) {
    console.error('Error processing image:', err);
    res.status(500).send({ error: 'Failed to process the image' });
  }
};

module.exports = { upload, processImage };