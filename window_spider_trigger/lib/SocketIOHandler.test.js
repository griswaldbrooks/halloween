/**
 * Tests for SocketIOHandler
 *
 * Tests Socket.IO event handling logic in isolation using dependency injection.
 * All dependencies (Socket.IO, SerialPortManager) are mocked.
 */

const SocketIOHandler = require('./SocketIOHandler');

describe('SocketIOHandler', () => {
  let mockIo;
  let mockSocket;
  let mockStats;
  let mockSerialPortManager;
  let connectionHandler;
  let socketEventHandlers;

  beforeEach(() => {
    // Reset event handlers
    socketEventHandlers = {};

    // Mock socket
    mockSocket = {
      id: 'test-socket-id',
      emit: jest.fn(),
      on: jest.fn((event, callback) => {
        socketEventHandlers[event] = callback;
      })
    };

    // Mock Socket.IO server
    mockIo = {
      emit: jest.fn(),
      on: jest.fn((event, callback) => {
        if (event === 'connection') {
          connectionHandler = callback;
        }
      })
    };

    // Mock stats
    mockStats = {
      triggers: 0,
      lastTriggerTime: null,
      connected: false
    };

    // Mock SerialPortManager
    mockSerialPortManager = {
      writeCommand: jest.fn(() => true),
      isOpen: jest.fn(() => true)
    };
  });

  describe('Constructor', () => {
    test('should initialize with all dependencies', () => {
      const handler = new SocketIOHandler(mockIo, mockStats, mockSerialPortManager);

      expect(handler.io).toBe(mockIo);
      expect(handler.stats).toBe(mockStats);
      expect(handler.serialPortManager).toBe(mockSerialPortManager);
    });
  });

  describe('setupHandlers', () => {
    test('should setup connection handler', () => {
      const handler = new SocketIOHandler(mockIo, mockStats, mockSerialPortManager);
      handler.setupHandlers();

      expect(mockIo.on).toHaveBeenCalledWith('connection', expect.any(Function));
    });

    test('should call handleConnection when client connects', () => {
      const handler = new SocketIOHandler(mockIo, mockStats, mockSerialPortManager);
      const handleConnectionSpy = jest.spyOn(handler, 'handleConnection');

      handler.setupHandlers();
      connectionHandler(mockSocket);

      expect(handleConnectionSpy).toHaveBeenCalledWith(mockSocket);
    });
  });

  describe('handleConnection', () => {
    test('should send stats-update on connection', () => {
      const handler = new SocketIOHandler(mockIo, mockStats, mockSerialPortManager);
      handler.handleConnection(mockSocket);

      expect(mockSocket.emit).toHaveBeenCalledWith('stats-update', mockStats);
    });

    test('should send serial-status on connection', () => {
      mockStats.connected = true;
      const handler = new SocketIOHandler(mockIo, mockStats, mockSerialPortManager);
      handler.handleConnection(mockSocket);

      expect(mockSocket.emit).toHaveBeenCalledWith('serial-status', { connected: true });
    });

    test('should setup socket event handlers', () => {
      const handler = new SocketIOHandler(mockIo, mockStats, mockSerialPortManager);
      handler.handleConnection(mockSocket);

      expect(mockSocket.on).toHaveBeenCalledWith('manual-trigger', expect.any(Function));
      expect(mockSocket.on).toHaveBeenCalledWith('send-command', expect.any(Function));
      expect(mockSocket.on).toHaveBeenCalledWith('request-stats', expect.any(Function));
      expect(mockSocket.on).toHaveBeenCalledWith('disconnect', expect.any(Function));
    });

    test('should handle disconnect event', () => {
      const handler = new SocketIOHandler(mockIo, mockStats, mockSerialPortManager);
      handler.handleConnection(mockSocket);

      // Trigger disconnect
      expect(() => socketEventHandlers.disconnect()).not.toThrow();
    });
  });

  describe('setupSocketEventHandlers', () => {
    test('should register all socket event handlers', () => {
      const handler = new SocketIOHandler(mockIo, mockStats, mockSerialPortManager);
      handler.setupSocketEventHandlers(mockSocket);

      expect(mockSocket.on).toHaveBeenCalledWith('manual-trigger', expect.any(Function));
      expect(mockSocket.on).toHaveBeenCalledWith('send-command', expect.any(Function));
      expect(mockSocket.on).toHaveBeenCalledWith('request-stats', expect.any(Function));
    });
  });

  describe('handleManualTrigger', () => {
    test('should increment trigger count', () => {
      const handler = new SocketIOHandler(mockIo, mockStats, mockSerialPortManager);
      const initialTriggers = mockStats.triggers;

      handler.handleManualTrigger();

      expect(mockStats.triggers).toBe(initialTriggers + 1);
    });

    test('should update lastTriggerTime', () => {
      const handler = new SocketIOHandler(mockIo, mockStats, mockSerialPortManager);
      handler.handleManualTrigger();

      expect(mockStats.lastTriggerTime).toBeInstanceOf(Date);
    });

    test('should emit trigger-video event', () => {
      const handler = new SocketIOHandler(mockIo, mockStats, mockSerialPortManager);
      handler.handleManualTrigger();

      expect(mockIo.emit).toHaveBeenCalledWith('trigger-video');
    });

    test('should emit stats-update event', () => {
      const handler = new SocketIOHandler(mockIo, mockStats, mockSerialPortManager);
      handler.handleManualTrigger();

      expect(mockIo.emit).toHaveBeenCalledWith('stats-update', mockStats);
    });

    test('should be called when manual-trigger event received', () => {
      const handler = new SocketIOHandler(mockIo, mockStats, mockSerialPortManager);
      const handleManualTriggerSpy = jest.spyOn(handler, 'handleManualTrigger');

      handler.handleConnection(mockSocket);
      socketEventHandlers['manual-trigger']();

      expect(handleManualTriggerSpy).toHaveBeenCalled();
    });
  });

  describe('handleSendCommand', () => {
    test('should call writeCommand on serialPortManager', () => {
      const handler = new SocketIOHandler(mockIo, mockStats, mockSerialPortManager);
      handler.handleSendCommand(mockSocket, 'TEST');

      expect(mockSerialPortManager.writeCommand).toHaveBeenCalledWith('TEST');
    });

    test('should not emit error when command succeeds', () => {
      mockSerialPortManager.writeCommand.mockReturnValue(true);
      const handler = new SocketIOHandler(mockIo, mockStats, mockSerialPortManager);
      handler.handleSendCommand(mockSocket, 'TEST');

      expect(mockSocket.emit).not.toHaveBeenCalledWith('error', expect.anything());
    });

    test('should emit error when serial port not connected', () => {
      mockSerialPortManager.writeCommand.mockReturnValue(false);
      const handler = new SocketIOHandler(mockIo, mockStats, mockSerialPortManager);
      handler.handleSendCommand(mockSocket, 'TEST');

      expect(mockSocket.emit).toHaveBeenCalledWith('error', {
        message: 'Serial port not connected'
      });
    });

    test('should be called when send-command event received', () => {
      const handler = new SocketIOHandler(mockIo, mockStats, mockSerialPortManager);
      const handleSendCommandSpy = jest.spyOn(handler, 'handleSendCommand');

      handler.handleConnection(mockSocket);
      socketEventHandlers['send-command']('TEST');

      expect(handleSendCommandSpy).toHaveBeenCalledWith(mockSocket, 'TEST');
    });

    test('should handle various command types', () => {
      const handler = new SocketIOHandler(mockIo, mockStats, mockSerialPortManager);

      handler.handleSendCommand(mockSocket, 'RESET');
      handler.handleSendCommand(mockSocket, 'STATUS');
      handler.handleSendCommand(mockSocket, 'START');

      expect(mockSerialPortManager.writeCommand).toHaveBeenCalledWith('RESET');
      expect(mockSerialPortManager.writeCommand).toHaveBeenCalledWith('STATUS');
      expect(mockSerialPortManager.writeCommand).toHaveBeenCalledWith('START');
    });
  });

  describe('request-stats event', () => {
    test('should emit stats-update when request-stats received', () => {
      const handler = new SocketIOHandler(mockIo, mockStats, mockSerialPortManager);
      handler.handleConnection(mockSocket);

      mockSocket.emit.mockClear();
      socketEventHandlers['request-stats']();

      expect(mockSocket.emit).toHaveBeenCalledWith('stats-update', mockStats);
    });
  });

  describe('Integration scenarios', () => {
    test('should handle multiple manual triggers', () => {
      const handler = new SocketIOHandler(mockIo, mockStats, mockSerialPortManager);
      const initialTriggers = mockStats.triggers;

      handler.handleManualTrigger();
      handler.handleManualTrigger();
      handler.handleManualTrigger();

      expect(mockStats.triggers).toBe(initialTriggers + 3);
      expect(mockIo.emit).toHaveBeenCalledTimes(6); // 3x trigger-video + 3x stats-update
    });

    test('should handle rapid command sending', () => {
      const handler = new SocketIOHandler(mockIo, mockStats, mockSerialPortManager);

      handler.handleSendCommand(mockSocket, 'CMD1');
      handler.handleSendCommand(mockSocket, 'CMD2');
      handler.handleSendCommand(mockSocket, 'CMD3');

      expect(mockSerialPortManager.writeCommand).toHaveBeenCalledTimes(3);
    });

    test('should handle mixed success and failure commands', () => {
      mockSerialPortManager.writeCommand
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(true);

      const handler = new SocketIOHandler(mockIo, mockStats, mockSerialPortManager);

      handler.handleSendCommand(mockSocket, 'CMD1');
      handler.handleSendCommand(mockSocket, 'CMD2');
      handler.handleSendCommand(mockSocket, 'CMD3');

      expect(mockSocket.emit).toHaveBeenCalledTimes(1); // Only one error
      expect(mockSocket.emit).toHaveBeenCalledWith('error', {
        message: 'Serial port not connected'
      });
    });

    test('should maintain stats consistency across triggers', () => {
      const handler = new SocketIOHandler(mockIo, mockStats, mockSerialPortManager);

      const time1 = mockStats.lastTriggerTime;
      handler.handleManualTrigger();
      const time2 = mockStats.lastTriggerTime;

      expect(time2).not.toBe(time1);
      expect(mockStats.triggers).toBe(1);
    });
  });

  describe('Error handling', () => {
    test('should handle null command gracefully', () => {
      const handler = new SocketIOHandler(mockIo, mockStats, mockSerialPortManager);

      expect(() => handler.handleSendCommand(mockSocket, null)).not.toThrow();
    });

    test('should handle undefined command gracefully', () => {
      const handler = new SocketIOHandler(mockIo, mockStats, mockSerialPortManager);

      expect(() => handler.handleSendCommand(mockSocket, undefined)).not.toThrow();
    });

    test('should handle empty command gracefully', () => {
      const handler = new SocketIOHandler(mockIo, mockStats, mockSerialPortManager);

      expect(() => handler.handleSendCommand(mockSocket, '')).not.toThrow();
    });
  });
});
