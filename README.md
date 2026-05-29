# Document Management Dashboard

A full-stack web application built with React, Vite, Tailwind CSS, Node.js, Express, MongoDB, and Socket.IO.
It allows users to upload PDF documents, view upload progress, manage documents, and receive real-time notifications for bulk uploads.

## Tech Stack
**Frontend:** React, Vite, Tailwind CSS, Axios, Lucide React, Socket.io-client
**Backend:** Node.js, Express, MongoDB (Mongoose), Multer, Socket.IO

## Prerequisites
- Node.js (v18+)
- MongoDB running locally on `mongodb://localhost:27017`

## Setup Steps

### 1. Backend Setup
```bash
cd server
npm install
npm run dev
```
*The server will run on http://localhost:5000*

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev
```
*The client will run on http://localhost:5173*

## Environment Variables
The server expects a `.env` file in the `server/` directory:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/docmanager
CLIENT_URL=http://localhost:5173
```

## API Endpoints
- `POST /api/upload` - Single file upload
- `POST /api/upload/bulk-notify` - Trigger Socket.IO bulk notification
- `GET /api/documents` - Fetch all documents
- `GET /api/documents/:id/download` - Download a document
- `GET /api/notifications` - Fetch notifications
- `PATCH /api/notifications/:id/read` - Mark single as read
- `PATCH /api/notifications/read-all` - Mark all as read
