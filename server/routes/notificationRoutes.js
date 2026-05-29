const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markRead,
  markAllRead,
} = require('../controllers/notificationController');

// GET /api/notifications
router.get('/', getNotifications);

// PATCH /api/notifications/read-all — must come BEFORE /:id/read
router.patch('/read-all', markAllRead);

// PATCH /api/notifications/:id/read
router.patch('/:id/read', markRead);

module.exports = router;
