const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { uploadFile, bulkNotify } = require('../controllers/uploadController');

// Multer disk storage — saves to server/uploads/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

// Only accept application/pdf
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are accepted.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB max per file
});

// POST /api/upload — single file upload
router.post('/', upload.single('file'), uploadFile);

// POST /api/upload/bulk-notify — emit socket notification after bulk upload
router.post('/bulk-notify', bulkNotify);

module.exports = router;
