import { generateId, generateRoomUrl, getCurrentTimestamp } from '../utils/helpers.js';
import { DEFAULT_ROOM_SETTINGS } from '../config/constants.js';
import tokenManager from './TokenManager.js';

class RoomManager {
  constructor() {
    // Map to store rooms: roomId -> room object
    this.rooms = new Map();
    // Map to store room users: roomId -> [users]
    this.roomUsers = new Map();
    // Map to track socket to room/user: socketId -> { roomId, userId }
    this.socketMap = new Map();
  }

  /**
   * Create a new room
   */
  createRoom(hostId, hostDisplayName, token = null, memberLimit = null) {
    const roomId = generateId('ROOM');
    const createdAt = getCurrentTimestamp();

    // Validate token and get perks
    let settings;
    if (token) {
      const tokenValidation = tokenManager.validateToken(token);
      if (tokenValidation.valid) {
        settings = {
          ...tokenValidation.perks
        };
      } else {
        settings = { ...DEFAULT_ROOM_SETTINGS };
      }
    } else {
      settings = { ...DEFAULT_ROOM_SETTINGS };
    }

    // Override maxUsers if memberLimit is provided and is less than settings
    if (memberLimit && memberLimit < settings.maxUsers) {
      settings.maxUsers = memberLimit;
    }

    const room = {
      roomId,
      hostId,
      hostDisplayName,
      createdAt,
      roomLifespanMs: settings.roomLifespanMinutes * 60 * 1000,
      autoDeleteMs: settings.autoDeleteMinutes * 60 * 1000,
      maxUsers: settings.maxUsers,
      password: null,
      settings,
      isTerminating: false,
      terminatingAt: null
    };

    this.rooms.set(roomId, room);
    this.roomUsers.set(roomId, []);

    return {
      roomId,
      roomUrl: generateRoomUrl(roomId),
      hostId,
      createdAt,
      settings: {
        roomLifespanMinutes: settings.roomLifespanMinutes,
        autoDeleteMinutes: settings.autoDeleteMinutes,
        maxUsers: settings.maxUsers
      }
    };
  }

  /**
   * Set password for a room
   */
  setRoomPassword(roomId, password) {
    const room = this.rooms.get(roomId);
    if (room) {
      room.password = password;
      return true;
    }
    return false;
  }

  /**
   * Get room by ID
   */
  getRoom(roomId) {
    return this.rooms.get(roomId);
  }

  /**
   * Check if room exists and is active
   */
  isRoomActive(roomId) {
    const room = this.rooms.get(roomId);
    if (!room) return false;

    const createdAt = room.createdAt;
    const roomLifespanMs = room.roomLifespanMs;
    const now = getCurrentTimestamp();

    // Check if room has expired
    if (now - createdAt > roomLifespanMs) {
      return false;
    }

    return true;
  }

  /**
   * Add user to room
   */
  addUserToRoom(roomId, socketId, displayName) {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    const users = this.roomUsers.get(roomId) || [];

    // Check if room is full
    if (users.length >= room.maxUsers) {
      return { error: 'ROOM_FULL', maxUsers: room.maxUsers, currentUsers: users.length };
    }

    const roomUserId = generateId('USER');
    const user = {
      roomUserId,
      socketId,
      displayName,
      joinedAt: getCurrentTimestamp()
    };

    if (socketId === room.hostId) {
      room.hostUserId = roomUserId;
    }

    users.push(user);
    this.roomUsers.set(roomId, users);
    this.socketMap.set(socketId, { roomId, userId: roomUserId });

    return {
      roomUserId,
      displayName,
      isHost: user.roomUserId === room.hostUserId,
      totalUsers: users.length
    };
  }

  /**
   * Remove user from room
   */
  removeUserFromRoom(roomId, socketId) {
    const users = this.roomUsers.get(roomId) || [];
    const userIndex = users.findIndex(u => u.socketId === socketId);

    if (userIndex !== -1) {
      const user = users[userIndex];
      users.splice(userIndex, 1);
      this.roomUsers.set(roomId, users);
      this.socketMap.delete(socketId);
      return user;
    }
    return null;
  }

  /**
   * Get all users in a room
   */
  getRoomUsers(roomId) {
    const room = this.rooms.get(roomId);
    const users = this.roomUsers.get(roomId) || [];

    if (!room) return [];

    return users.map(user => ({
      roomUserId: user.roomUserId,
      displayName: user.displayName,
      isHost: user.roomUserId === room.hostUserId,
      joinedAt: user.joinedAt
    }));
  }

  /**
   * Get user count in room
   */
  getRoomUserCount(roomId) {
    const users = this.roomUsers.get(roomId) || [];
    return users.length;
  }

  /**
   * Get socket info
   */
  getSocketInfo(socketId) {
    return this.socketMap.get(socketId);
  }

  /**
   * Get users in room by roomId
   */
  getUsersInRoom(roomId) {
    return this.roomUsers.get(roomId) || [];
  }

  /**
   * Mark room as terminating
   */
  markRoomTerminating(roomId) {
    const room = this.rooms.get(roomId);
    if (room) {
      room.isTerminating = true;
      room.terminatingAt = getCurrentTimestamp();
      return true;
    }
    return false;
  }

  /**
   * Delete room
   */
  deleteRoom(roomId) {
    this.rooms.delete(roomId);
    this.roomUsers.delete(roomId);

    // Clean up socket map
    for (const [socketId, info] of this.socketMap.entries()) {
      if (info.roomId === roomId) {
        this.socketMap.delete(socketId);
      }
    }

    return true;
  }

  /**
   * Get all rooms (for debugging)
   */
  getAllRooms() {
    return Array.from(this.rooms.values());
  }

  /**
   * Get expired rooms
   */
  getExpiredRooms() {
    const now = getCurrentTimestamp();
    const expired = [];

    for (const [roomId, room] of this.rooms.entries()) {
      if (now - room.createdAt > room.roomLifespanMs) {
        expired.push(roomId);
      }
    }

    return expired;
  }

  /**
   * Get rooms with no users for a duration
   */
  getEmptyRooms(durationMs) {
    const now = getCurrentTimestamp();
    const empty = [];

    for (const [roomId, room] of this.rooms.entries()) {
      const users = this.roomUsers.get(roomId) || [];
      if (users.length === 0 && now - room.createdAt > durationMs) {
        empty.push(roomId);
      }
    }

    return empty;
  }

  /**
   * Get rooms with single user for a duration
   */
  getSingleUserRooms(durationMs) {
    const now = getCurrentTimestamp();
    const singleUser = [];

    for (const [roomId, room] of this.rooms.entries()) {
      const users = this.roomUsers.get(roomId) || [];
      if (users.length === 1) {
        const user = users[0];
        if (now - user.joinedAt > durationMs) {
          singleUser.push(roomId);
        }
      }
    }

    return singleUser;
  }
}

export default new RoomManager();
