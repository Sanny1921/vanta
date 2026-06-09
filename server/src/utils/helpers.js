/**
 * Generate a unique ID
 */
export const generateId = (prefix = '') => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return prefix ? `${prefix}${timestamp}${random}`.toUpperCase() : `${timestamp}${random}`.toUpperCase();
};

/**
 * Generate room URL
 */
export const generateRoomUrl = (roomId, baseUrl = process.env.CLIENT_URL || process.env.APP_URL) => {
  if (!baseUrl) {
    return `/join/${roomId}`;
  }
  return `${baseUrl}/join/${roomId}`;
};

/**
 * Validate password
 */
export const validatePassword = (inputPassword, storedPassword) => {
  return inputPassword === storedPassword;
};

/**
 * Get current timestamp
 */
export const getCurrentTimestamp = () => {
  return Date.now();
};

/**
 * Check if timestamp is expired based on duration
 */
export const isExpired = (createdAt, durationMs) => {
  return Date.now() - createdAt > durationMs;
};
