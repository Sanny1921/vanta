import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import '../css/MessageInput.css';

export default function MessageInput({
  onSendMessage,
  onTypingStart,
  onTypingStop,
  disabled
}) {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  const handleChange = (e) => {
    const value = e.target.value;
    setMessage(value);

    // Typing indicators
    if (!isTyping && value.trim()) {
      setIsTyping(true);
      onTypingStart();
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        onTypingStop();
      }
    }, 1000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!message.trim() || disabled) return;

    onSendMessage(message.trim());
    setMessage('');
    setIsTyping(false);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    onTypingStop();
  };

  return (
    <form className="message-input-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="message-input"
        placeholder={disabled ? 'Room deleted...' : 'Type a message...'}
        value={message}
        onChange={handleChange}
        disabled={disabled}
      />
      <button
        type="submit"
        className="btn-send"
        disabled={!message.trim() || disabled}
        title="Send message"
      >
        Send
      </button>
    </form>
  );
}

MessageInput.propTypes = {
  onSendMessage: PropTypes.func.isRequired,
  onTypingStart: PropTypes.func.isRequired,
  onTypingStop: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};
