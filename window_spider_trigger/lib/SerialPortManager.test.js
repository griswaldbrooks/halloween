/**
 * Tests for SerialPortManager
 *
 * Tests serial port communication logic in isolation using dependency injection.
 * All dependencies (SerialPort, Parser, Socket.IO) are mocked.
 */

const SerialPortManager = require('./SerialPortManager');

describe('SerialPortManager', () => {
  let mockSerialPort;
  let mockParser;
  let mockPort;
  let mockIo;
  let mockStats;
  let config;
  let portEventHandlers;
  let parserEventHandlers;

  beforeEach(() => {
    // Reset event handlers
    portEventHandlers = {};
    parserEventHandlers = {};

    // Mock parser
    mockParser = {
      on: jest.fn((event, callback) => {
        parserEventHandlers[event] = callback;
        return mockParser;
      })
    };

    // Mock port instance
    mockPort = {
      path: '/dev/ttyACM0',
      isOpen: true,
      on: jest.fn((event, callback) => {
        portEventHandlers[event] = callback;
        return mockPort;
      }),
      pipe: jest.fn(() => mockParser),
      write: jest.fn((data, callback) => {
        if (callback) callback();
        return true;
      }),
      close: jest.fn((callback) => {
        if (callback) callback();
      })
    };

    // Mock SerialPort constructor
    mockSerialPort = jest.fn(() => mockPort);
    mockSerialPort.list = jest.fn().mockResolvedValue([
      {
        path: '/dev/ttyACM0',
        manufacturer: 'Arduino',
        vendorId: '2341'
      }
    ]);

    // Mock ReadlineParser constructor
    const MockReadlineParser = jest.fn(() => mockParser);

    // Mock Socket.IO
    mockIo = {
      emit: jest.fn()
    };

    // Mock stats
    mockStats = {
      triggers: 0,
      lastTriggerTime: null,
      connected: false
    };

    // Configuration
    config = {
      serialPort: '/dev/ttyACM0',
      baudRate: 9600,
      arduinoVendorId: '2341'
    };
  });

  describe('Constructor', () => {
    test('should initialize with all dependencies', () => {
      const manager = new SerialPortManager(
        mockSerialPort,
        jest.fn(),
        mockIo,
        mockStats,
        config
      );

      expect(manager.SerialPort).toBe(mockSerialPort);
      expect(manager.io).toBe(mockIo);
      expect(manager.stats).toBe(mockStats);
      expect(manager.config).toBe(config);
      expect(manager.port).toBeNull();
      expect(manager.parser).toBeNull();
    });
  });

  describe('findArduinoPort', () => {
    test('should find Arduino by vendor ID', async () => {
      const manager = new SerialPortManager(
        mockSerialPort,
        jest.fn(),
        mockIo,
        mockStats,
        config
      );

      const port = await manager.findArduinoPort();
      expect(port).toBe('/dev/ttyACM0');
      expect(mockSerialPort.list).toHaveBeenCalled();
    });

    test('should find Arduino by manufacturer name', async () => {
      mockSerialPort.list.mockResolvedValueOnce([
        {
          path: '/dev/ttyUSB0',
          manufacturer: 'Arduino LLC',
          vendorId: 'unknown'
        }
      ]);

      const manager = new SerialPortManager(
        mockSerialPort,
        jest.fn(),
        mockIo,
        mockStats,
        config
      );

      const port = await manager.findArduinoPort();
      expect(port).toBe('/dev/ttyUSB0');
    });

    test('should use fallback port if Arduino not detected', async () => {
      mockSerialPort.list.mockResolvedValueOnce([
        {
          path: '/dev/ttyACM0',
          manufacturer: 'Unknown',
          vendorId: 'unknown'
        }
      ]);

      const manager = new SerialPortManager(
        mockSerialPort,
        jest.fn(),
        mockIo,
        mockStats,
        config
      );

      const port = await manager.findArduinoPort();
      expect(port).toBe('/dev/ttyACM0');
    });

    test('should throw error if no Arduino found', async () => {
      mockSerialPort.list.mockResolvedValueOnce([
        {
          path: '/dev/ttyS0',
          manufacturer: 'Unknown',
          vendorId: 'unknown'
        }
      ]);

      const manager = new SerialPortManager(
        mockSerialPort,
        jest.fn(),
        mockIo,
        mockStats,
        config
      );

      await expect(manager.findArduinoPort()).rejects.toThrow('No Arduino found');
    });
  });

  describe('initSerial', () => {
    test('should initialize with specified port', async () => {
      const MockParser = jest.fn(() => mockParser);
      const manager = new SerialPortManager(
        mockSerialPort,
        MockParser,
        mockIo,
        mockStats,
        config
      );

      await manager.initSerial();

      expect(mockSerialPort).toHaveBeenCalledWith({
        path: '/dev/ttyACM0',
        baudRate: 9600
      });
      expect(mockPort.pipe).toHaveBeenCalledWith(expect.any(Object));
      expect(manager.port).toBe(mockPort);
      expect(manager.parser).toBe(mockParser);
    });

    test('should auto-detect port when set to auto', async () => {
      const autoConfig = { ...config, serialPort: 'auto' };
      const MockParser = jest.fn(() => mockParser);
      const manager = new SerialPortManager(
        mockSerialPort,
        MockParser,
        mockIo,
        mockStats,
        autoConfig
      );

      await manager.initSerial();

      expect(mockSerialPort.list).toHaveBeenCalled();
      expect(mockSerialPort).toHaveBeenCalledWith({
        path: '/dev/ttyACM0',
        baudRate: 9600
      });
    });

    test('should handle initialization errors gracefully', async () => {
      const erroringSerialPort = jest.fn(() => {
        throw new Error('Port not available');
      });
      erroringSerialPort.list = mockSerialPort.list;

      const manager = new SerialPortManager(
        erroringSerialPort,
        jest.fn(),
        mockIo,
        mockStats,
        config
      );

      await manager.initSerial();

      expect(mockStats.connected).toBe(false);
    });

    test('should setup port event handlers', async () => {
      const MockParser = jest.fn(() => mockParser);
      const manager = new SerialPortManager(
        mockSerialPort,
        MockParser,
        mockIo,
        mockStats,
        config
      );

      await manager.initSerial();

      expect(mockPort.on).toHaveBeenCalledWith('open', expect.any(Function));
      expect(mockPort.on).toHaveBeenCalledWith('error', expect.any(Function));
      expect(mockPort.on).toHaveBeenCalledWith('close', expect.any(Function));
    });

    test('should setup parser event handlers', async () => {
      const MockParser = jest.fn(() => mockParser);
      const manager = new SerialPortManager(
        mockSerialPort,
        MockParser,
        mockIo,
        mockStats,
        config
      );

      await manager.initSerial();

      expect(mockParser.on).toHaveBeenCalledWith('data', expect.any(Function));
    });
  });

  describe('Port Event Handlers', () => {
    test('should handle port open event', async () => {
      const MockParser = jest.fn(() => mockParser);
      const manager = new SerialPortManager(
        mockSerialPort,
        MockParser,
        mockIo,
        mockStats,
        config
      );

      await manager.initSerial();

      // Trigger open event
      portEventHandlers.open();

      expect(mockStats.connected).toBe(true);
      expect(mockIo.emit).toHaveBeenCalledWith('serial-status', { connected: true });
    });

    test('should handle port error event', async () => {
      const MockParser = jest.fn(() => mockParser);
      const manager = new SerialPortManager(
        mockSerialPort,
        MockParser,
        mockIo,
        mockStats,
        config
      );

      await manager.initSerial();

      // Trigger error event
      const testError = new Error('Connection lost');
      portEventHandlers.error(testError);

      expect(mockStats.connected).toBe(false);
      expect(mockIo.emit).toHaveBeenCalledWith('serial-status', {
        connected: false,
        error: 'Connection lost'
      });
    });

    test('should handle port close event', async () => {
      const MockParser = jest.fn(() => mockParser);
      const manager = new SerialPortManager(
        mockSerialPort,
        MockParser,
        mockIo,
        mockStats,
        config
      );

      await manager.initSerial();

      // Trigger close event
      portEventHandlers.close();

      expect(mockStats.connected).toBe(false);
      expect(mockIo.emit).toHaveBeenCalledWith('serial-status', { connected: false });
    });
  });

  describe('Parser Event Handlers', () => {
    test('should handle TRIGGER message', async () => {
      const MockParser = jest.fn(() => mockParser);
      const manager = new SerialPortManager(
        mockSerialPort,
        MockParser,
        mockIo,
        mockStats,
        config
      );

      await manager.initSerial();

      const initialTriggers = mockStats.triggers;
      parserEventHandlers.data('TRIGGER\n');

      expect(mockStats.triggers).toBe(initialTriggers + 1);
      expect(mockStats.lastTriggerTime).toBeInstanceOf(Date);
      expect(mockIo.emit).toHaveBeenCalledWith('trigger-video');
      expect(mockIo.emit).toHaveBeenCalledWith('stats-update', mockStats);
    });

    test('should handle READY message', async () => {
      const MockParser = jest.fn(() => mockParser);
      const manager = new SerialPortManager(
        mockSerialPort,
        MockParser,
        mockIo,
        mockStats,
        config
      );

      await manager.initSerial();

      parserEventHandlers.data('READY\n');

      expect(mockIo.emit).toHaveBeenCalledWith('arduino-status', { ready: true });
    });

    test('should handle STARTUP message', async () => {
      const MockParser = jest.fn(() => mockParser);
      const manager = new SerialPortManager(
        mockSerialPort,
        MockParser,
        mockIo,
        mockStats,
        config
      );

      await manager.initSerial();

      parserEventHandlers.data('STARTUP\n');

      expect(mockIo.emit).toHaveBeenCalledWith('arduino-status', { startup: true });
    });

    test('should handle unknown messages gracefully', async () => {
      const MockParser = jest.fn(() => mockParser);
      const manager = new SerialPortManager(
        mockSerialPort,
        MockParser,
        mockIo,
        mockStats,
        config
      );

      await manager.initSerial();

      // Should not throw or emit unexpected events
      expect(() => parserEventHandlers.data('UNKNOWN\n')).not.toThrow();
    });
  });

  describe('writeCommand', () => {
    test('should write command when port is open', async () => {
      const MockParser = jest.fn(() => mockParser);
      const manager = new SerialPortManager(
        mockSerialPort,
        MockParser,
        mockIo,
        mockStats,
        config
      );

      await manager.initSerial();

      const result = manager.writeCommand('TEST');

      expect(result).toBe(true);
      expect(mockPort.write).toHaveBeenCalledWith('TEST\n');
    });

    test('should return false when port is not open', async () => {
      const MockParser = jest.fn(() => mockParser);
      const manager = new SerialPortManager(
        mockSerialPort,
        MockParser,
        mockIo,
        mockStats,
        config
      );

      await manager.initSerial();
      mockPort.isOpen = false;

      const result = manager.writeCommand('TEST');

      expect(result).toBe(false);
      expect(mockPort.write).not.toHaveBeenCalled();
    });

    test('should return false when port is null', () => {
      const manager = new SerialPortManager(
        mockSerialPort,
        jest.fn(),
        mockIo,
        mockStats,
        config
      );

      const result = manager.writeCommand('TEST');

      expect(result).toBe(false);
    });
  });

  describe('isOpen', () => {
    test('should return true when port is open', async () => {
      const MockParser = jest.fn(() => mockParser);
      const manager = new SerialPortManager(
        mockSerialPort,
        MockParser,
        mockIo,
        mockStats,
        config
      );

      await manager.initSerial();

      expect(manager.isOpen()).toBe(true);
    });

    test('should return false when port is closed', async () => {
      const MockParser = jest.fn(() => mockParser);
      const manager = new SerialPortManager(
        mockSerialPort,
        MockParser,
        mockIo,
        mockStats,
        config
      );

      await manager.initSerial();
      mockPort.isOpen = false;

      expect(manager.isOpen()).toBe(false);
    });

    test('should return false when port is null', () => {
      const manager = new SerialPortManager(
        mockSerialPort,
        jest.fn(),
        mockIo,
        mockStats,
        config
      );

      expect(manager.isOpen()).toBe(false);
    });
  });

  describe('close', () => {
    test('should close port when open', async () => {
      const MockParser = jest.fn(() => mockParser);
      const manager = new SerialPortManager(
        mockSerialPort,
        MockParser,
        mockIo,
        mockStats,
        config
      );

      await manager.initSerial();
      await manager.close();

      expect(mockPort.close).toHaveBeenCalled();
    });

    test('should resolve when port is not open', async () => {
      const MockParser = jest.fn(() => mockParser);
      const manager = new SerialPortManager(
        mockSerialPort,
        MockParser,
        mockIo,
        mockStats,
        config
      );

      await manager.initSerial();
      mockPort.isOpen = false;

      await expect(manager.close()).resolves.toBeUndefined();
    });

    test('should resolve when port is null', async () => {
      const manager = new SerialPortManager(
        mockSerialPort,
        jest.fn(),
        mockIo,
        mockStats,
        config
      );

      await expect(manager.close()).resolves.toBeUndefined();
    });
  });

  describe('handleTriggerMessage', () => {
    test('should increment triggers and update stats', async () => {
      const MockParser = jest.fn(() => mockParser);
      const manager = new SerialPortManager(
        mockSerialPort,
        MockParser,
        mockIo,
        mockStats,
        config
      );

      await manager.initSerial();

      const initialTriggers = mockStats.triggers;
      manager.handleTriggerMessage();

      expect(mockStats.triggers).toBe(initialTriggers + 1);
      expect(mockStats.lastTriggerTime).toBeInstanceOf(Date);
    });

    test('should emit trigger-video and stats-update', async () => {
      const MockParser = jest.fn(() => mockParser);
      const manager = new SerialPortManager(
        mockSerialPort,
        MockParser,
        mockIo,
        mockStats,
        config
      );

      await manager.initSerial();

      mockIo.emit.mockClear();
      manager.handleTriggerMessage();

      expect(mockIo.emit).toHaveBeenCalledWith('trigger-video');
      expect(mockIo.emit).toHaveBeenCalledWith('stats-update', mockStats);
    });
  });
});
