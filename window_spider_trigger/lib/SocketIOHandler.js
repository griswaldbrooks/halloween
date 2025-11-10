/**
 * SocketIOHandler - Manages Socket.IO client connections and events
 *
 * Uses dependency injection pattern for testability:
 * - Socket.IO server instance injected via constructor
 * - SerialPortManager instance injected via constructor
 * - Stats object injected for state tracking
 *
 * This design allows full mocking in tests without module-level closures.
 */

class SocketIOHandler {
  /**
   * Creates a new SocketIOHandler instance
   *
   * @param {Object} io - Socket.IO server instance
   * @param {Object} stats - Statistics object reference
   * @param {Object} serialPortManager - SerialPortManager instance
   */
  constructor(io, stats, serialPortManager) {
    this.io = io;
    this.stats = stats;
    this.serialPortManager = serialPortManager;
  }

  /**
   * Sets up Socket.IO connection and event handlers
   */
  setupHandlers() {
    this.io.on('connection', (socket) => {
      this.handleConnection(socket);
    });
  }

  /**
   * Handles a new Socket.IO client connection
   *
   * @param {Object} socket - Socket.IO socket instance
   */
  handleConnection(socket) {
    console.log('✓ Client connected:', socket.id);

    // Send current stats to new client
    socket.emit('stats-update', this.stats);
    socket.emit('serial-status', { connected: this.stats.connected });

    // Setup event handlers for this socket
    this.setupSocketEventHandlers(socket);

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('✗ Client disconnected:', socket.id);
    });
  }

  /**
   * Sets up event handlers for a specific socket
   *
   * @param {Object} socket - Socket.IO socket instance
   */
  setupSocketEventHandlers(socket) {
    // Handle manual test trigger
    socket.on('manual-trigger', () => {
      this.handleManualTrigger();
    });

    // Handle Arduino command requests
    socket.on('send-command', (command) => {
      this.handleSendCommand(socket, command);
    });

    // Handle stats requests
    socket.on('request-stats', () => {
      socket.emit('stats-update', this.stats);
    });
  }

  /**
   * Handles manual trigger event
   */
  handleManualTrigger() {
    console.log('🎮 Manual test trigger');
    this.stats.triggers++;
    this.stats.lastTriggerTime = new Date();
    this.io.emit('trigger-video');
    this.io.emit('stats-update', this.stats);
  }

  /**
   * Handles send-command event
   *
   * @param {Object} socket - Socket.IO socket instance
   * @param {string} command - Command to send to Arduino
   */
  handleSendCommand(socket, command) {
    const success = this.serialPortManager.writeCommand(command);
    if (!success) {
      socket.emit('error', { message: 'Serial port not connected' });
    }
  }
}

module.exports = SocketIOHandler;
