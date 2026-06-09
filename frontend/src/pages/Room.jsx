import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRoom } from '../context/RoomContext';
import socketService from '../services/socketService';
import { SOCKET_EVENTS, SYSTEM_MESSAGE_TYPES } from '../config/constants';
import ParticipantList from '../components/ParticipantList';
import ChatArea from '../components/ChatArea';
import MessageInput from '../components/MessageInput';
import RoomHeader from '../components/RoomHeader';
import '../css/Room.css';

export default function Room() {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const {
    currentRoom,
    roomUserId,
    displayName,
    isHost,
    participants,
    messages,
    totalUsers,
    roomSettings,
    addMessage,
    deleteMessage,
    addUser,
    removeUser,
    updateParticipants,
    addTypingUser,
    removeTypingUser,
    clearRoom,
    terminateRoom,
    leaveRoom,
    joinRoom
  } = useRoom();

  const [showParticipants, setShowParticipants] = useState(false);
  const [roomDeleted, setRoomDeleted] = useState(false);
  const messagesEndRef = useRef(null);
  const [rejoining, setRejoining] = useState(() => {
    const cachedRoomId = sessionStorage.getItem('vanta_room_id');
    const cachedDisplayName = sessionStorage.getItem('vanta_display_name');
    return (!currentRoom && cachedRoomId === roomId && cachedDisplayName);
  });

  // Setup socket listeners
  useEffect(() => {
    socketService.on(SOCKET_EVENTS.MESSAGE_RECEIVED, (data) => {
      const message = {
        messageId: data.messageId,
        roomId: data.roomId,
        senderId: data.senderId,
        senderDisplayName: data.senderDisplayName,
        content: data.content,
        createdAt: data.createdAt,
        expiresAt: data.expiresAt,
        type: 'user'
      };
      addMessage(message);
    });

    socketService.on(SOCKET_EVENTS.MESSAGE_DELETED, (data) => {
      deleteMessage(data.messageId);
    });

    socketService.on(SOCKET_EVENTS.USER_JOINED, (data) => {
      if (data.type === SYSTEM_MESSAGE_TYPES.USER_JOINED) {
        addMessage({
          messageId: `sys-${Date.now()}`,
          type: 'system',
          content: data.message,
          createdAt: Date.now()
        });
        addUser(data.user);
      }
    });

    socketService.on(SOCKET_EVENTS.USER_LEFT, (data) => {
      if (data.type === SYSTEM_MESSAGE_TYPES.USER_LEFT) {
        addMessage({
          messageId: `sys-${Date.now()}`,
          type: 'system',
          content: data.message,
          createdAt: Date.now()
        });
        removeUser(data.user.roomUserId);
      }
    });

    socketService.on(SOCKET_EVENTS.TYPING_START, (data) => {
      addTypingUser(data.displayName);
    });

    socketService.on(SOCKET_EVENTS.TYPING_STOP, (data) => {
      removeTypingUser(data.displayName);
    });

    socketService.on(SOCKET_EVENTS.ROOM_TERMINATION_WARNING, (data) => {
      if (data.type === SYSTEM_MESSAGE_TYPES.ROOM_TERMINATION_WARNING) {
        addMessage({
          messageId: `sys-${Date.now()}`,
          type: 'system',
          content: data.message,
          createdAt: Date.now()
        });
      }
    });

    socketService.on(SOCKET_EVENTS.ROOM_TERMINATED, (data) => {
      if (data.type === SYSTEM_MESSAGE_TYPES.ROOM_TERMINATED) {
        addMessage({
          messageId: `sys-${Date.now()}`,
          type: 'system',
          content: data.message,
          createdAt: Date.now()
        });
      }
    });

    socketService.on(SOCKET_EVENTS.ROOM_USERS_UPDATED, (data) => {
      updateParticipants(data.participants, data.totalUsers);
    });

    socketService.on(SOCKET_EVENTS.ROOM_DELETED, () => {
      setRoomDeleted(true);
      addMessage({
        messageId: `sys-${Date.now()}`,
        type: 'system',
        content: 'Room has been deleted.',
        createdAt: Date.now()
      });
      setTimeout(() => {
        clearRoom();
        navigate('/');
      }, 3000);
    });

    return () => {
      socketService.off(SOCKET_EVENTS.MESSAGE_RECEIVED);
      socketService.off(SOCKET_EVENTS.MESSAGE_DELETED);
      socketService.off(SOCKET_EVENTS.USER_JOINED);
      socketService.off(SOCKET_EVENTS.USER_LEFT);
      socketService.off(SOCKET_EVENTS.ROOM_USERS_UPDATED);
      socketService.off(SOCKET_EVENTS.TYPING_START);
      socketService.off(SOCKET_EVENTS.TYPING_STOP);
      socketService.off(SOCKET_EVENTS.ROOM_TERMINATION_WARNING);
      socketService.off(SOCKET_EVENTS.ROOM_TERMINATED);
      socketService.off(SOCKET_EVENTS.ROOM_DELETED);
    };
  }, [addMessage, deleteMessage, addUser, removeUser, updateParticipants, addTypingUser, removeTypingUser, clearRoom, navigate]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle session recovery and redirects
  useEffect(() => {
    const cachedRoomId = sessionStorage.getItem('vanta_room_id');
    const cachedRoomUserId = sessionStorage.getItem('vanta_room_user_id');
    const cachedDisplayName = sessionStorage.getItem('vanta_display_name');
    const cachedHostAccessToken = sessionStorage.getItem('vanta_host_access_token');

    if (!currentRoom) {
      if (cachedRoomId === roomId && cachedDisplayName) {
        setRejoining(true);
        // Connect socket
        socketService.connect();

        joinRoom({
          roomId,
          displayName: cachedDisplayName,
          roomUserId: cachedRoomUserId,
          hostAccessToken: cachedHostAccessToken
        })
          .then(() => {
            setRejoining(false);
          })
          .catch((err) => {
            console.error('[Room] Rejoin failed:', err);
            sessionStorage.removeItem('vanta_room_id');
            sessionStorage.removeItem('vanta_room_user_id');
            sessionStorage.removeItem('vanta_display_name');
            sessionStorage.removeItem('vanta_host_access_token');
            navigate(`/join/${roomId}`);
          });
      } else {
        // No session exists, redirect to home page join modal
        navigate(`/join/${roomId}`);
      }
    } else if (currentRoom !== roomId) {
      // Room mismatch
      navigate('/');
    }
  }, [currentRoom, roomId, joinRoom, navigate]);

  const handleLeaveRoom = () => {
    leaveRoom();
    navigate('/');
  };

  const handleTerminateRoom = () => {
    if (window.confirm('Are you sure you want to terminate the room? All participants will be disconnected.')) {
      terminateRoom();
    }
  };

  if (rejoining) {
    return (
      <div className="room-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '20px' }}>
        <div className="spinner"></div>
        <p style={{ color: 'var(--vanta-text-secondary)', fontSize: '14px', fontWeight: '500' }}>Restoring Vanta Session...</p>
      </div>
    );
  }

  return (
    <div className="room-container">
      <div className="room-content-wrapper">
        <RoomHeader
          roomId={roomId}
          totalUsers={totalUsers}
          maxUsers={roomSettings?.maxUsers}
          onParticipantsClick={() => setShowParticipants(!showParticipants)}
          isHost={isHost}
          onTerminate={handleTerminateRoom}
        />

        {showParticipants && (
          <ParticipantList
            participants={participants}
            isHost={isHost}
            onClose={() => setShowParticipants(false)}
          />
        )}

        <ChatArea
          messages={messages}
          currentUserId={roomUserId}
          currentDisplayName={displayName}
          isRoomDeleted={roomDeleted}
          messagesEndRef={messagesEndRef}
        />

        <MessageInput
          onSendMessage={(content) => {
            // Send message via socket
            socketService.sendMessage({
              roomId: currentRoom,
              senderDisplayName: displayName,
              content
            });
          }}
          onTypingStart={() => socketService.typingStart({ roomId: currentRoom, displayName })}
          onTypingStop={() => socketService.typingStop({ roomId: currentRoom, displayName })}
          disabled={roomDeleted}
        />

        <div className="room-actions">
          <button className="btn-leave" onClick={handleLeaveRoom}>
            Leave Room
          </button>
        </div>
      </div>
    </div>
  );
}
