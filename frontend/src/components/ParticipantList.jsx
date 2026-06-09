import PropTypes from 'prop-types';
import '../css/ParticipantList.css';

export default function ParticipantList({
  participants,
  onClose
}) {
  return (
    <div className="participant-list-overlay" onClick={onClose}>
      <div className="participant-list-modal" onClick={(e) => e.stopPropagation()}>
        <div className="participant-list-header">
          <h2>Participants</h2>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        <div className="participant-list-content">
          {participants.length === 0 ? (
            <p className="no-participants">No participants</p>
          ) : (
            <ul className="participant-list">
              {participants.map((user) => (
                <li key={user.roomUserId} className="participant-item">
                  <span className="participant-name">
                    {user.displayName}
                    {user.isHost && <span className="host-badge">👑</span>}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

ParticipantList.propTypes = {
  participants: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClose: PropTypes.func.isRequired
};
