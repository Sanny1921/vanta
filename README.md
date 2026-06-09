# VANTA - Temporary Communication Platform

A production-ready full-stack web application built with React, Node.js, Express, and Socket.IO for temporary room-based communication.

##  Project Structure

```
vanta/
├── frontend/                  # React Frontend Application
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/            # Page components
│   │   ├── context/          # React Context
│   │   ├── services/         # Socket.IO service
│   │   ├── config/           # Constants
│   │   ├── css/              # Stylesheets
│   │   ├── App.jsx           # Main app
│   │   └── main.jsx          # Entry point
│   ├── index.html            # HTML template
│   ├── vite.config.js        # Vite config
│   ├── package.json          # Dependencies
│   ├── .env.example          # Environment template
│   └── README.md             # Frontend docs
│
├── server/                    # Node.js Backend Server
│   ├── src/
│   │   ├── managers/         # Business logic
│   │   ├── config/
│   │   ├── utils/
│   │   └── server.js
│   ├── package.json          # Dependencies
│   ├── .env.example          # Environment template
│   └── README.md             # Backend docs
│
└── README.md                 # This file
```

##  Quick Start

### 1. Install Dependencies

**Frontend:**
```bash
cd frontend
npm install
```

**Backend:**
```bash
cd server
npm install
```

### 2. Start Development Servers

**Terminal 1 - Frontend:**
```bash
cd frontend
npm run dev
```
Runs on: `http://localhost:5173`

**Terminal 2 - Backend:**
```bash
cd server
npm run dev
```
Runs on: `http://localhost:3001`

### 3. Open Browser
Visit: `http://localhost:5173`

## Core Philosophy

- **Temporary Everything**: Rooms are temporary, messages are temporary, users are temporary
- **No Permanent Storage**: No permanent room history or message storage
- **Lightweight & Fast**: Text-focused, mobile-friendly platform
- **Not a Clone**: Not meant to replicate Discord, WhatsApp, or similar platforms

## Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Socket.IO Client** - Real-time communication
- **CSS3** - Responsive styling

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **Socket.IO** - WebSocket library
- **In-Memory Storage** - JavaScript Maps (designed for MongoDB integration)

## Features

### Room Management
- Create temporary rooms with optional password protection
- Join rooms via Room ID or invite link
- Member limits (configurable, default: 5)
- Token system for perks (extended room lifespan, higher user limits)
- Automatic room deletion based on lifecycle rules

### User System
- Unique room user IDs for each participant
- Display names (can repeat across different rooms)
- Host privileges (room creator)
- No kick/ban system in V1

### Chat System
- Text-only messaging (no reactions, threads, GIFs)
- Automatic message expiration
- Join/leave system messages
- Typing indicators
- Real-time message synchronization

### Room Lifecycle Rules
1. **Empty Room Timeout**: Rooms with no users for 5 minutes are deleted
2. **Single User Timeout**: Rooms with only 1 user for 3 minutes are deleted
3. **Lifespan Expiration**: Rooms delete when lifespan expires (default: 30 minutes)
4. **Host Termination**: Host can manually terminate rooms with grace period

## Setup & Installation

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create environment file:**
```bash
cp .env.example .env.local
```

4. **Run development server:**
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Backend Setup

1. **Navigate to server directory:**
```bash
cd server
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create environment file:**
```bash
cp .env.example .env
```

4. **Run development server:**
```bash
npm run dev
```

The backend will be available at `http://localhost:3001`

### Running Both Services

**Terminal 1 (Frontend):**
```bash
cd frontend
npm run dev
```

**Terminal 2 (Backend):**
```bash
cd server
npm run dev
```

## Frontend Architecture

### Components
- **ChatArea.jsx** - Display messages and system events
- **MessageInput.jsx** - Input form for sending messages
- **ParticipantList.jsx** - Modal showing room participants
- **RoomHeader.jsx** - Header bar with room info and host controls

### Pages
- **Home.jsx** - Create/Join room interface
- **Room.jsx** - Main chat room with real-time messaging
- **PasswordVerify.jsx** - Password verification page

### State Management
- **RoomContext.jsx** - Global state management using React Context

### Services
- **socketService.js** - Singleton Socket.IO client wrapper

## Backend Architecture

### Managers
- **RoomManager.js** - Handle room creation, joining, deletion, user management
- **SocketManager.js** - Handle all Socket.IO events and real-time communication
- **LifecycleManager.js** - Monitor and enforce room lifecycle rules
- **TokenManager.js** - Token validation and perks application
- **MessageManager.js** - Store, manage, and expire messages

### Server
- **server.js** - Express app setup and Socket.IO initialization
- **config/constants.js** - Define all server-side constants
- **utils/helpers.js** - Utility functions for ID generation and validation

## API Endpoints

### HTTP
- `GET /api/health` - Server health check

## Socket.IO Events

### Room Events
- `create-room` - Create a new room
- `join-room` - Join an existing room
- `leave-room` - Leave current room
- `verify-password` - Verify room password
- `terminate-room` - Host termination

### Message Events
- `message-send` - Send a message
- `message-received` - Receive a message
- `message-deleted` - Message deletion notification

### User Events
- `user-joined` - User joined room
- `user-left` - User left room
- `get-participants` - Get room participants

### Typing Events
- `typing-start` - User started typing
- `typing-stop` - User stopped typing

### Room Lifecycle
- `room-termination-warning` - Host termination warning
- `room-terminated` - Room terminated
- `room-deleted` - Room deleted

## Token System

### Example Tokens
- `PREMIUM-001-XYZ` - 2 hours, 15 min auto-delete, 100 users
- `EXTENDED-002-ABC` - 1 hour, 5 min auto-delete, 50 users
- `STANDARD-003-DEF` - 45 min, 2 min auto-delete, 20 users

### Default Settings (No Token)
- Room lifespan: 30 minutes
- Message auto-delete: 1 minute
- Max users: 5

## Security Considerations

- All validation is **server-side only**
- Frontend never decides room limits, token perks, or message lifespan
- Passwords are validated on server
- Socket.IO connections are authenticated by server state

## Future Enhancements

### For MongoDB Integration
The architecture is designed for easy MongoDB integration:
- `RoomManager` - Store rooms in MongoDB collection
- `MessageManager` - Store messages in MongoDB (with TTL indexes)
- `TokenManager` - Store tokens and perks in MongoDB

### Potential Features
- Persistent room history (opt-in)
- Direct messaging between users
- Room search/discovery
- User profiles
- Message reactions (if needed)
- Room analytics

## Development

### Code Style
- ES6+ JavaScript
- React Hooks for state management
- Modular component structure
- Separation of concerns (managers, services, components)

### Building for Production

**Frontend:**
```bash
npm run build
npm run preview
```

**Backend:**
```bash
cd server
NODE_ENV=production npm start
```

## Troubleshooting

### Socket Connection Issues
1. Check if backend is running on correct port (default: 3001)
2. Verify `VITE_SOCKET_URL` in frontend `.env.local`
3. Check CORS settings in server

### Messages Not Appearing
- Ensure Socket.IO is connected
- Check browser console for errors
- Verify room is active

### Room Deletion Issues
- Check server logs for lifecycle events
- Verify room lifecycle timings in constants

## License

MIT

## Contributing

This is a reference implementation. Feel free to fork, modify, and deploy!
