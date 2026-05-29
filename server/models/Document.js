const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    mimetype: {
      type: String,
      default: 'application/pdf',
    },
    path: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'uploading', 'complete', 'failed'],
      default: 'complete',
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Document', documentSchema);
