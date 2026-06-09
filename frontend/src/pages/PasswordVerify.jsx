import { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useRoom } from '../context/RoomContext';
import '../css/PasswordVerify.css';

export default function PasswordVerify() {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const location = useLocation();
  const { verifyPassword, error, setError } = useRoom();
  const displayName = location.state?.displayName || '';

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await verifyPassword({
        roomId: roomId.toUpperCase(),
        displayName,
        password
      });
      navigate(`/room/${roomId.toUpperCase()}`);
    } catch (err) {
      console.error('Password verification failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="password-verify-container">
      <div className="password-verify-card">
        <h1>Enter Password</h1>
        <p className="room-id">Room ID: {roomId}</p>

        {error && (
          <div className="error-message">
            {error === 'PASSWORD_INVALID' && 'Invalid password'}
            {typeof error === 'string' && error !== 'PASSWORD_INVALID' && error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="password">Room Password</label>
            <div className="password-input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide' : 'Show'}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Verifying...' : 'Enter Room'}
          </button>

          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate('/')}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
