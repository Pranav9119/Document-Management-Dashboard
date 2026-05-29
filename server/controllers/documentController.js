const path = require('path');
const Document = require('../models/Document');

// GET /api/documents — fetch all documents, sorted newest first
const getDocuments = async (req, res) => {
  try {
    const docs = await Document.find().sort({ uploadedAt: -1 });
    return res.json(docs);
  } catch (err) {
    console.error('getDocuments error:', err);
    return res.status(500).json({ error: 'Failed to fetch documents.' });
  }
};

// GET /api/documents/:id/download — stream file to client as download
const downloadDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);

    if (!doc) {
      return res.status(404).json({ error: 'Document not found.' });
    }

    return res.download(doc.path, doc.originalName, (err) => {
      if (err) {
        console.error('Download error:', err);
        if (!res.headersSent) {
          return res.status(500).json({ error: 'File download failed.' });
        }
      }
    });
  } catch (err) {
    console.error('downloadDocument error:', err);
    return res.status(500).json({ error: 'Download failed.' });
  }
};

module.exports = { getDocuments, downloadDocument };
