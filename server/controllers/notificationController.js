const Notification = require('../models/Notification');

// GET /api/notifications — fetch all notifications, newest first
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ timestamp: -1 });
    return res.json(notifications);
  } catch (err) {
    console.error('getNotifications error:', err);
    return res.status(500).json({ error: 'Failed to fetch notifications.' });
  }
};

// PATCH /api/notifications/:id/read — mark a single notification as read
const markRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found.' });
    }

    return res.json(notification);
  } catch (err) {
    console.error('markRead error:', err);
    return res.status(500).json({ error: 'Failed to update notification.' });
  }
};

// PATCH /api/notifications/read-all — mark all notifications as read
const markAllRead = async (req, res) => {
  try {
    await Notification.updateMany({ read: false }, { $set: { read: true } });
    return res.json({ success: true, message: 'All notifications marked as read.' });
  } catch (err) {
    console.error('markAllRead error:', err);
    return res.status(500).json({ error: 'Failed to update notifications.' });
  }
};

module.exports = { getNotifications, markRead, markAllRead };
