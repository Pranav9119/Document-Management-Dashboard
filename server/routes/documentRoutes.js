const express = require('express');
const router = express.Router();
const { getDocuments, downloadDocument } = require('../controllers/documentController');

// GET /api/documents
router.get('/', getDocuments);

// GET /api/documents/:id/download
router.get('/:id/download', downloadDocument);

module.exports = router;
