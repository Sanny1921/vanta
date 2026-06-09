import PropTypes from 'prop-types';
import '../css/ChatArea.css';

export default function ChatArea({
  messages,
  currentUserId,
  isRoomDeleted,
  messagesEndRef
}) {
  return (
    <div className={`chat-area ${isRoomDeleted ? 'room-deleted' : ''}`}>
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-chat">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.messageId}
              className={`message ${msg.type} ${
                msg.senderId === currentUserId ? 'own' : ''
              }`}
            >
              {msg.type === 'system' ? (
                <div className="system-message">
                  <span>{msg.content}</span>
                </div>
              ) : (
                <>
                  <div className="message-sender">
                    <strong>{msg.senderDisplayName}</strong>
                    {msg.isHost && <span className="host-badge">👑</span>}
                  </div>
                  <div className="message-content">
                    {msg.content}
                  </div>
                  <div className="message-time">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {isRoomDeleted && (
        <div className="room-deleted-overlay">
          <div className="room-deleted-message">
            Room has been deleted. Redirecting to home...
          </div>
        </div>
      )}
    </div>
  );
}

ChatArea.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.object).isRequired,
  currentUserId: PropTypes.string.isRequired,
  isRoomDeleted: PropTypes.bool.isRequired,
  messagesEndRef: PropTypes.object
};
