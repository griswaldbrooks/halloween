/**
 * Spider Window Scare - Node.js Server
 *
 * Listens to Arduino serial port for motion triggers
 * and communicates with web client via Socket.IO
 */

const express = require('express');
const http = require('node:http');
const socketIo = require('socket.io');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const path = require('node:path');
const SerialPortManager = require('./lib/SerialPortManager');
const SocketIOHandler = require('./lib/SocketIOHandler');

// Load environment variables from .env file
require('dotenv').config();

// Configuration
const PORT = process.env.PORT || 3000;
const SERIAL_PORT = process.env.SERIAL_PORT || 'auto'; // Set to 'auto' for auto-detection
const BAUD_RATE = Number.parseInt(process.env.BAUD_RATE) || 9600;
const ARDUINO_VENDOR_ID = process.env.ARDUINO_VENDOR_ID || '2341'; // Arduino vendor ID

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from 'public' directory
app.use(express.static('public'));

// Serve index.html at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Statistics tracking
let stats = {
  triggers: 0,
  lastTriggerTime: null,
  startTime: new Date(),
  connected: false
};

// Serial port configuration
const serialConfig = {
  serialPort: SERIAL_PORT,
  baudRate: BAUD_RATE,
  arduinoVendorId: ARDUINO_VENDOR_ID
};

// Create managers with dependency injection
let serialPortManager;
let socketIOHandler;

/**
 * Initialize serial port and Socket.IO handlers
 * Exposed for testing with dependency injection
 */
async function initSerial(serialPortModule = SerialPort, readlineParserModule = ReadlineParser) {
  serialPortManager = new SerialPortManager(
    serialPortModule,
    readlineParserModule,
    io,
    stats,
    serialConfig
  );

  await serialPortManager.initSerial();
  return serialPortManager;
}

/**
 * Setup Socket.IO handlers
 * Exposed for testing with dependency injection
 */
function setupSocketIO(ioInstance = io, statsObj = stats, serialMgr = serialPortManager) {
  socketIOHandler = new SocketIOHandler(ioInstance, statsObj, serialMgr);
  socketIOHandler.setupHandlers();
  return socketIOHandler;
}

// Setup Socket.IO handlers (will be initialized after serial port)
// Note: Actual setup happens in startServer() below

// API endpoint for stats
app.get('/api/stats', (req, res) => {
  res.json(stats);
});

// API endpoint to trigger manually (for testing)
app.post('/api/trigger', (req, res) => {
  console.log('🎮 Manual trigger via API');
  stats.triggers++;
  stats.lastTriggerTime = new Date();
  io.emit('trigger-video');
  io.emit('stats-update', stats);
  res.json({ success: true });
});

// Start server (only if not in test mode)
/* istanbul ignore next */
if (require.main === module) {
  server.listen(PORT, async () => {
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║     🕷️  SPIDER WINDOW SCARE - SERVER RUNNING 🕷️       ║');
    console.log('╚════════════════════════════════════════════════════════╝');
    console.log(`  Web interface: http://localhost:${PORT}`);
    console.log(`  Serial port: ${SERIAL_PORT} @ ${BAUD_RATE} baud`);
    console.log('');

    // Initialize serial connection and Socket.IO handlers
    await initSerial();
    setupSocketIO();
  });

  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\nShutting down...');
    if (serialPortManager?.isOpen()) {
      serialPortManager.close();
    }
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });
}

// Export for testing
module.exports = {
  app,
  server,
  io,
  stats,
  initSerial,
  setupSocketIO,
  getSerialPortManager: () => serialPortManager,
  getSocketIOHandler: () => socketIOHandler
};
