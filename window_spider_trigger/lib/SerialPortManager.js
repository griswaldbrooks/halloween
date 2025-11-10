/**
 * SerialPortManager - Manages serial port communication with Arduino
 *
 * Uses dependency injection pattern for testability:
 * - SerialPort module injected via constructor
 * - ReadlineParser module injected via constructor
 * - Socket.IO instance injected for event emission
 * - Stats object injected for state tracking
 *
 * This design allows full mocking in tests without module-level closures.
 */

class SerialPortManager {
  /**
   * Creates a new SerialPortManager instance
   *
   * @param {Object} serialPortModule - SerialPort class (injected for mocking)
   * @param {Object} readlineParserModule - ReadlineParser class (injected for mocking)
   * @param {Object} io - Socket.IO server instance
   * @param {Object} stats - Statistics object reference
   * @param {Object} config - Configuration object
   * @param {string} config.serialPort - Serial port path or 'auto' for detection
   * @param {number} config.baudRate - Baud rate for serial communication
   * @param {string} config.arduinoVendorId - Arduino vendor ID for auto-detection
   */
  constructor(serialPortModule, readlineParserModule, io, stats, config) {
    this.SerialPort = serialPortModule;
    this.ReadlineParser = readlineParserModule;
    this.io = io;
    this.stats = stats;
    this.config = config;
    this.port = null;
    this.parser = null;
  }

  /**
   * Finds an Arduino port automatically
   *
   * @returns {Promise<string>} Path to Arduino port
   * @throws {Error} If no Arduino found
   */
  async findArduinoPort() {
    const ports = await this.SerialPort.list();
    console.log('Available serial ports:');
    for (const p of ports) {
      console.log(`  ${p.path} - ${p.manufacturer || 'Unknown'}`);
    }

    // Look for Arduino by vendor ID or manufacturer name
    const arduinoPort = ports.find(p =>
      p.vendorId === this.config.arduinoVendorId ||
      p.manufacturer?.toLowerCase().includes('arduino')
    );

    if (arduinoPort) {
      console.log(`✓ Found Arduino at: ${arduinoPort.path}`);
      return arduinoPort.path;
    }

    // Fallback: try common Arduino ports
    const fallbackPorts = ['/dev/ttyACM0', '/dev/ttyUSB0', 'COM3'];
    for (const fallback of fallbackPorts) {
      if (ports.some(p => p.path === fallback)) {
        console.log(`Using fallback port: ${fallback}`);
        return fallback;
      }
    }

    throw new Error('No Arduino found. Available ports: ' + ports.map(p => p.path).join(', '));
  }

  /**
   * Initializes the serial port connection
   *
   * @returns {Promise<void>}
   */
  async initSerial() {
    try {
      // Auto-detect port if set to 'auto'
      let portPath = this.config.serialPort;
      if (this.config.serialPort === 'auto') {
        portPath = await this.findArduinoPort();
      }

      // Create serial port instance
      this.port = new this.SerialPort({
        path: portPath,
        baudRate: this.config.baudRate
      });

      // Create parser
      this.parser = this.port.pipe(new this.ReadlineParser({ delimiter: '\n' }));

      // Setup event handlers
      this.setupPortEventHandlers();
      this.setupParserEventHandlers();

    } catch (err) {
      console.error('✗ Failed to initialize serial port:', err.message);
      console.error('  Make sure:');
      console.error('  1. Arduino is connected');
      console.error('  2. Correct port is specified');
      console.error('  3. You have permission to access the port');
      console.error('     Run: sudo usermod -a -G dialout $USER');
      this.stats.connected = false;
    }
  }

  /**
   * Sets up serial port event handlers (open, error, close)
   */
  setupPortEventHandlers() {
    this.port.on('open', () => {
      console.log(`✓ Serial port ${this.port.path} opened`);
      console.log(`  Baud rate: ${this.config.baudRate}`);
      this.stats.connected = true;
      this.io.emit('serial-status', { connected: true });
    });

    this.port.on('error', (err) => {
      console.error('✗ Serial port error:', err.message);
      this.stats.connected = false;
      this.io.emit('serial-status', { connected: false, error: err.message });
    });

    this.port.on('close', () => {
      console.log('Serial port closed');
      this.stats.connected = false;
      this.io.emit('serial-status', { connected: false });
    });
  }

  /**
   * Sets up parser event handlers for Arduino messages
   */
  setupParserEventHandlers() {
    this.parser.on('data', (line) => {
      const data = line.trim();
      console.log(`Arduino: ${data}`);

      if (data === 'TRIGGER') {
        this.handleTriggerMessage();
      } else if (data === 'READY') {
        console.log('✓ Arduino ready');
        this.io.emit('arduino-status', { ready: true });
      } else if (data === 'STARTUP') {
        console.log('Arduino starting up...');
        this.io.emit('arduino-status', { startup: true });
      }
    });
  }

  /**
   * Handles TRIGGER message from Arduino
   */
  handleTriggerMessage() {
    console.log('🕷️  MOTION DETECTED - Triggering scare!');
    this.stats.triggers++;
    this.stats.lastTriggerTime = new Date();

    // Send trigger to all connected clients
    this.io.emit('trigger-video');
    this.io.emit('stats-update', this.stats);
  }

  /**
   * Writes a command to the serial port
   *
   * @param {string} command - Command to send to Arduino
   * @returns {boolean} True if command was sent, false if port not available
   */
  writeCommand(command) {
    if (this.port?.isOpen) {
      console.log(`Sending command to Arduino: ${command}`);
      this.port.write(`${command}\n`);
      return true;
    }
    return false;
  }

  /**
   * Checks if the port is open
   *
   * @returns {boolean} True if port is open
   */
  isOpen() {
    return this.port?.isOpen || false;
  }

  /**
   * Closes the serial port
   *
   * @returns {Promise<void>}
   */
  close() {
    return new Promise((resolve) => {
      if (this.port?.isOpen) {
        this.port.close(() => resolve());
      } else {
        resolve();
      }
    });
  }
}

module.exports = SerialPortManager;
