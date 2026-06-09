# Backend Documentation

## 🚀 Quick Start

```bash
cd server
npm install
npm run dev
```

Server runs at: `http://localhost:3001`

## 📁 Directory Structure

```
server/
├── src/
│   ├── managers/             # Business logic modules
│   │   ├── RoomManager.js    # Room operations
│   │   ├── SocketManager.js  # Socket.IO events
│   │   ├── LifecycleManager.js # Room lifecycle
│   │   ├── TokenManager.js   # Token validation
│   │   └── MessageManager.js # Message storage
│   ├── config/
│   │   └── constants.js      # Constants
│   ├── utils/
│   │   └── helpers.js        # Utilities
│   └── server.js             # Express setup
├── package.json              # Dependencies
├── .env.example              # Env template
└── README.md                 # This file
```

## 🔧 Available Scripts

```bash
npm run dev      # Start dev server with file watching
npm start        # Start production server
```

## ⚙️ Environment Configuration

Create `.env` file:

```
PORT=3001
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

## 📋 API Endpoints

### Health Check
- `GET /api/health` - Server health check

## 🔌 Socket.IO Events

### Room Management
- `create-room` - Create new room
- `join-room` - Join existing room
- `leave-room` - Leave current room
- `verify-password` - Verify room password
- `terminate-room` - Host termination

### Messaging
- `message-send` - Send message
- `message-received` - Receive message
- `message-deleted` - Message deleted

### User Management
- `user-joined` - User joined room
- `user-left` - User left room
- `get-participants` - Get room participants

### Typing Indicators
- `typing-start` - User started typing
- `typing-stop` - User stopped typing

### Room Lifecycle
- `room-termination-warning` - Termination warning
- `room-terminated` - Room terminated
- `room-deleted` - Room deleted

## 🧩 Manager Architecture

### RoomManager
Handles:
- Room creation and deletion
- User management (add/remove)
- Room state tracking
- Room expiration

Methods:
- `createRoom()` - Create new room
- `addUserToRoom()` - Add user to room
- `removeUserFromRoom()` - Remove user
- `isRoomActive()` - Check if active
- `deleteRoom()` - Delete room
- `getExpiredRooms()` - Get expired rooms

### SocketManager
Handles:
- All Socket.IO event handling
- Event broadcasting
- Client communication
- Connection/disconnection

Methods:
- `handleCreateRoom()` - Create room event
- `handleJoinRoom()` - Join room event
- `handleMessageSend()` - Message send event
- `handleTerminateRoom()` - Room termination
- `handleDisconnect()` - Client disconnect

### LifecycleManager
Handles:
- Room lifecycle enforcement
- Auto-deletion rules
- Grace periods
- Room monitoring

Deletion Rules:
1. Empty room for 5 min → deleted
2. Single user for 3 min → deleted
3. Lifespan expires → deleted
4. Host terminates → deleted

### TokenManager
Handles:
- Token validation
- Perks application
- Token management

Sample Tokens:
- `PREMIUM-001-XYZ` - 2h lifespan, 100 users, 15min delete
- `EXTENDED-002-ABC` - 1h lifespan, 50 users, 5min delete
- `STANDARD-003-DEF` - 45min lifespan, 20 users, 2min delete

### MessageManager
Handles:
- Message storage
- Message expiration
- Message cleanup

Methods:
- `createMessage()` - Create message
- `getActiveMessages()` - Get active messages
- `deleteExpiredMessages()` - Auto-delete
- `clearRoomMessages()` - Clear room

## 🔐 Security

- All validation is **server-side only**
- Frontend cannot override limits
- Passwords validated on server
- Socket.IO state-based authentication

## 📊 Default Settings

- Room lifespan: 30 minutes
- Message auto-delete: 1 minute
- Max users: 5
- Empty room timeout: 5 minutes
- Single user timeout: 3 minutes

## 🧪 Testing

No test suite configured. Add Jest as needed.

## 🚢 Production

```bash
NODE_ENV=production npm start
```

## 📦 Dependencies

- express: Web framework
- socket.io: Real-time communication
- cors: CORS middleware
- dotenv: Environment variables

## 🆘 Troubleshooting

**Port 3001 already in use:**
```bash
lsof -ti:3001 | xargs kill -9
```

**Dependencies error:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Socket connection errors:**
- Verify frontend connecting to correct URL
- Check `VITE_SOCKET_URL` on frontend
- Check CORS settings

## 📚 Future Enhancements

### MongoDB Integration
- Replace in-memory Maps with MongoDB collections
- Implement TTL indexes for auto-deletion
- Add message history (optional)

### Features
- Direct messaging
- Room search
- User profiles
- Message reactions
- Analytics
