const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

const connectDB = require('./config/db');
const { initSocket } = require('./socket');

const app = express();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Middleware
app.use(
  (req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
  }
);
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL || 'http://localhost:5173',
      'http://localhost:5174'
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(uploadDir));

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Document Management Dashboard API Running',
    service: 'Document Management Dashboard API',
    version: '1.0.0',
    timestamp: new Date(),
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ success: true, status: 'healthy', database: 'connected' });
});

// API routes
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/documents', require('./routes/documentRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO after server creation
initSocket(server);

// Connect to MongoDB and log environment info
connectDB();
console.log('MongoDB Connected');
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);

// Detailed startup logs after socket init
console.log('Socket.IO initialized');

// Port configuration
const PORT = process.env.PORT || 5000;

// Attach error handling before starting the server
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❗️ Port ${PORT} is already in use.`);
  } else {
    console.error('Server error:', err);
  }
  process.exit(1);
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Graceful shutdown handlers (already present, keep them)
process.on('SIGINT', () => {
  console.log('💤 Received SIGINT – shutting down server');
  server.close(() => {
    console.log('🛑 Server closed');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('💤 Received SIGTERM – shutting down server');
  server.close(() => {
    console.log('🛑 Server closed');
    process.exit(0);
  });
});

process.once('SIGUSR2', () => {
  console.log('🔁 Nodemon restart signal received – closing server');
  server.close(() => {
    // Let nodemon restart the process
    process.kill(process.pid, 'SIGUSR2');
  });
});

module.exports = { app, server };
