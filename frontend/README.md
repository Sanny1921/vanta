# Frontend Documentation

## 🚀 Quick Start

```bash
cd frontend
npm install
npm run dev
```

Server runs at: `http://localhost:5173`

## 📁 Directory Structure

```
frontend/
├── src/
│   ├── components/           # Reusable components
│   │   ├── ChatArea.jsx      # Message display
│   │   ├── MessageInput.jsx  # Input form
│   │   ├── ParticipantList.jsx  # Users modal
│   │   └── RoomHeader.jsx    # Room header
│   ├── pages/               # Page components
│   │   ├── Home.jsx         # Create/Join room
│   │   ├── Room.jsx         # Chat room
│   │   └── PasswordVerify.jsx # Password page
│   ├── context/             # State management
│   │   └── RoomContext.jsx  # Global state
│   ├── services/            # API services
│   │   └── socketService.js # Socket.IO wrapper
│   ├── config/              # Configuration
│   │   └── constants.js     # Constants
│   ├── css/                 # Styling
│   ├── App.jsx              # Root component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── index.html               # HTML template
├── vite.config.js          # Vite config
├── package.json            # Dependencies
├── .env.example            # Env template
└── README.md               # This file
```

## 🔧 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## ⚙️ Environment Configuration

Create `.env.local` file:

```
VITE_SOCKET_URL=http://localhost:3001
```

## 🎯 Key Components

### ChatArea
Displays all messages and system events with auto-scroll

### MessageInput
Input form with typing indicators

### ParticipantList
Modal showing all room participants with host badges

### RoomHeader
Header showing room info and host controls

## 🔄 State Management

Uses React Context API (`RoomContext.jsx`) for global state:
- Current room data
- User list
- Messages
- Typing indicators
- Room settings

## 🔌 Socket.IO Integration

`socketService.js` handles all Socket.IO communication:
- Room creation/joining
- Message sending/receiving
- User presence
- Typing indicators
- Room lifecycle events

## 🎨 Styling

Component-specific CSS files with mobile-first responsive design

## 📱 Responsive Design

All components are mobile-optimized with Flexbox/Grid layouts

## 🧪 Testing

No test suite configured. Add Jest + React Testing Library as needed.

## 🚢 Production Build

```bash
npm run build
npm run preview
```

Output: `dist/` folder (deploy this)

## 🆘 Troubleshooting

**Socket connection issues:**
- Verify backend is running on port 3001
- Check `VITE_SOCKET_URL` in `.env.local`
- Check browser console for errors

**Build fails:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Port 5173 already in use:**
```bash
lsof -ti:5173 | xargs kill -9
```

## 📚 Dependencies

- react: UI library
- react-dom: React DOM rendering
- react-router-dom: Client-side routing
- socket.io-client: Real-time communication
- vite: Build tool
- eslint: Code linting
