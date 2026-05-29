const Document = require('../models/Document');
const Notification = require('../models/Notification');
const { getIO } = require('../socket');

// POST /api/upload — upload a single PDF file
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded or invalid file type.' });
    }

    const file = req.file;

    const doc = new Document({
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      path: file.path,
      status: 'complete',
    });

    await doc.save();

    return res.status(200).json({ success: true, file: doc });
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({ error: 'Upload failed. Please try again.' });
  }
};

// POST /api/upload/bulk-notify — called by frontend after all bulk files are uploaded
const bulkNotify = async (req, res) => {
  try {
    const { count } = req.body;

    if (!count || count < 1) {
      return res.status(400).json({ error: 'Invalid file count.' });
    }

    const notification = new Notification({
      message: `${count} file${count > 1 ? 's' : ''} uploaded successfully`,
      type: 'success',
      timestamp: new Date(),
      read: false,
    });

    await notification.save();

    // Emit real-time notification to all connected clients
    try {
      const io = getIO();
      io.emit('notification', {
        _id: notification._id,
        message: notification.message,
        type: notification.type,
        timestamp: notification.timestamp,
        read: notification.read,
      });
    } catch (socketErr) {
      console.error('Socket emit error:', socketErr.message);
    }

    return res.status(201).json({ success: true, notification });
  } catch (err) {
    console.error('Bulk notify error:', err);
    return res.status(500).json({ error: 'Failed to create notification.' });
  }
};

module.exports = { uploadFile, bulkNotify };
