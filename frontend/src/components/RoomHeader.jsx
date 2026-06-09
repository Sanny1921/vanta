import { useState } from 'react';
import PropTypes from 'prop-types';
import '../css/RoomHeader.css';

export default function RoomHeader({
  roomId,
  totalUsers,
  maxUsers,
  onParticipantsClick,
  isHost,
  onTerminate
}) {
  const [showMenu, setShowMenu] = useState(false);

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    alert(`${label} copied to clipboard!`);
  };

  return (
    <header className="room-header">
      <div className="room-header-left">
        <h1 className="room-title">Vanta</h1>
      </div>

      <div className="room-header-center">
        <div className="room-info">
          <span className="room-id-display">Room: {roomId}</span>
        </div>
      </div>

      <div className="room-header-right">
        <button
          className="btn-participants"
          onClick={onParticipantsClick}
          title="View participants"
        >
          <span className="user-icon">👥</span>
          <span className="user-count">Users: {totalUsers}/{maxUsers || 5}</span>
        </button>

        {isHost && (
          <div className="host-menu">
            <button
              className="btn-menu"
              onClick={() => setShowMenu(!showMenu)}
              title="Host menu"
            >
              ⋮
            </button>
            {showMenu && (
              <div className="menu-dropdown">
                <button
                  className="menu-item"
                  onClick={() => copyToClipboard(roomId, 'Room ID')}
                >
                  Copy Room ID
                </button>
                <button
                  className="menu-item danger"
                  onClick={() => {
                    setShowMenu(false);
                    onTerminate();
                  }}
                >
                  Terminate Room
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

RoomHeader.propTypes = {
  roomId: PropTypes.string.isRequired,
  totalUsers: PropTypes.number.isRequired,
  maxUsers: PropTypes.number,
  onParticipantsClick: PropTypes.func.isRequired,
  isHost: PropTypes.bool.isRequired,
  onTerminate: PropTypes.func.isRequired
};
