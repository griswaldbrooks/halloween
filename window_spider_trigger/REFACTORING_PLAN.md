# Window Spider Trigger - Refactoring Plan

**Date:** 2025-11-10
**Goal:** Make code testable and fix SonarCloud integration
**Pattern:** Follow spider_crawl_projection refactoring approach

## Problem Statement

### Issue 1: Untestable Code Structure
- **5 tests are skipped** due to module-level closure preventing proper mocking
- Lines 166-167 (port.write success path) cannot be tested
- The `port` variable is in module closure, making it impossible to inject mocks
- SonarCloud rule S1607 flags skipped tests

### Issue 2: SonarCloud Coverage Not Visible
- Achieved 97.14% coverage locally but SonarCloud doesn't see it
- Need to integrate lcov.info upload with SonarCloud via CI/CD
- Coverage reports exist but aren't being uploaded

## Current Architecture (Problematic)

```javascript
// server.js - Module-level closure (UNTESTABLE)
let port;  // <-- THIS IS THE PROBLEM
let parser;

async function initSerial() {
  port = new SerialPort({ ... });  // Module-level assignment
  parser = port.pipe(new ReadlineParser());
  // ...
}

io.on('connection', (socket) => {
  socket.on('send-command', (command) => {
    if (port?.isOpen) {  // Uses closure variable - can't be mocked
      port.write(`${command}\n`);  // Lines 166-167 - UNTESTABLE
    }
  });
});

module.exports = { app, server, io, stats, port, initSerial, findArduinoPort };
```

**Why This Is Untestable:**
1. The `port` variable is assigned in `initSerial()` at module load time
2. Tests can mock SerialPort constructor, but can't inject the mock into the running server
3. The Socket.IO handler captures `port` in closure - no way to inject mock later
4. Even though we export `port`, tests can't replace it after server initialization

## Target Architecture (Testable)

### Pattern: Dependency Injection via Class Instances

```javascript
// lib/SerialPortManager.js - Testable with DI
class SerialPortManager {
  constructor(serialPortModule, readlineParserModule, io, stats) {
    this.SerialPort = serialPortModule;
    this.ReadlineParser = readlineParserModule;
    this.io = io;
    this.stats = stats;
    this.port = null;
    this.parser = null;
  }

  async initSerial() {
    // Auto-detect or use provided port
    const portPath = await this.findArduinoPort();
    this.port = new this.SerialPort({ path: portPath, ... });
    this.parser = this.port.pipe(new this.ReadlineParser());
    this.setupEventHandlers();
  }

  writeCommand(command) {
    if (this.port?.isOpen) {
      this.port.write(`${command}\n`);  // NOW TESTABLE!
      return true;
    }
    return false;
  }
}

// lib/SocketIOHandler.js - Testable with DI
class SocketIOHandler {
  constructor(io, stats, serialPortManager) {
    this.io = io;
    this.stats = stats;
    this.serialPortManager = serialPortManager;
  }

  setupHandlers() {
    this.io.on('connection', (socket) => {
      this.handleConnection(socket);
    });
  }

  handleConnection(socket) {
    // Send initial stats
    socket.emit('stats-update', this.stats);

    // Handle commands
    socket.on('send-command', (command) => {
      const success = this.serialPortManager.writeCommand(command);
      if (!success) {
        socket.emit('error', { message: 'Serial port not connected' });
      }
    });
  }
}

// server.js - Orchestration only
const serialPortManager = new SerialPortManager(SerialPort, ReadlineParser, io, stats);
const socketIOHandler = new SocketIOHandler(io, stats, serialPortManager);

async function startServer() {
  await serialPortManager.initSerial();
  socketIOHandler.setupHandlers();
}

// Export for testing with DI
module.exports = {
  app,
  server,
  io,
  stats,
  SerialPortManager,
  SocketIOHandler,
  serialPortManager,
  socketIOHandler
};
```

**Why This Is Testable:**
1. Dependencies are injected via constructor parameters
2. Tests can create instances with mock dependencies
3. No module-level closures - everything is instance state
4. Tests can directly call methods with full control over dependencies

## Refactoring Steps

### Phase 1: Extract SerialPortManager
**Files to create:**
- `lib/SerialPortManager.js` - Serial port handling with DI

**Methods to extract:**
- `findArduinoPort()`
- `initSerial()` → `constructor() + initSerial()`
- Port event handlers (open, error, close)
- Parser data handler
- `writeCommand()` - NEW method wrapping port.write()

**Test file:**
- `lib/SerialPortManager.test.js` - Comprehensive tests with mocks

### Phase 2: Extract SocketIOHandler
**Files to create:**
- `lib/SocketIOHandler.js` - Socket.IO event handling with DI

**Methods to extract:**
- Connection handler
- `manual-trigger` handler
- `send-command` handler (uses serialPortManager.writeCommand())
- `request-stats` handler
- Disconnect handler

**Test file:**
- `lib/SocketIOHandler.test.js` - Comprehensive tests with mocks

### Phase 3: Refactor server.js
**Changes:**
- Import and instantiate SerialPortManager
- Import and instantiate SocketIOHandler
- Pass dependencies via constructors
- Keep HTTP endpoints in server.js
- Update exports for testing

**Verify:**
- Server still starts normally
- All functionality works
- Tests can inject mocks

### Phase 4: Update Tests
**server.test.js changes:**
- Create mock instances of SerialPortManager and SocketIOHandler
- Inject mocks into server setup
- Enable all 5 skipped tests:
  1. `manual-trigger updates stats` (line 238)
  2. `send-command writes to serial port when connected` (line 266)
  3. `send-command writes to serial port when connected` (line 869)
  4. `send-command with various command types` (line 896)
  5. `send-command logs command being sent` (line 1064)

**New test files:**
- `lib/SerialPortManager.test.js` - Test serial port logic in isolation
- `lib/SocketIOHandler.test.js` - Test Socket.IO handlers in isolation

**Expected result:**
- All 42 tests passing (0 skipped)
- Coverage remains 97%+
- Lines 166-167 now covered

### Phase 5: Fix SonarCloud Integration

**Update CI/CD (.github/workflows/coverage.yml):**
```yaml
- name: Test Window Spider Trigger with Coverage
  working-directory: ./window_spider_trigger
  run: |
    pixi install
    pixi run install
    pixi run coverage

- name: Upload Window Spider Coverage to SonarCloud
  run: |
    # Ensure lcov.info is in the right location for SonarCloud
    cp window_spider_trigger/coverage/lcov.info window_spider_trigger/lcov.info || true

- name: SonarCloud Scan
  uses: SonarSource/sonarqube-scan-action@v6
  env:
    SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
    SONAR_HOST_URL: https://sonarcloud.io
```

**Update sonar-project.properties:**
```properties
# Ensure window_spider_trigger lcov is detected
sonar.javascript.lcov.reportPaths=window_spider_trigger/coverage/lcov.info,spider_crawl_projection/coverage/lcov.info,hatching_egg/coverage-js/lcov.info
```

**Verify:**
- SonarCloud detects window_spider_trigger coverage
- Coverage shows as 97%+ in SonarCloud dashboard
- S1607 issue resolved (no skipped tests)

## Success Criteria

### Code Quality
- ✅ All code follows dependency injection pattern
- ✅ No module-level closures with external dependencies
- ✅ Classes are small, focused, single-responsibility
- ✅ All dependencies injected via constructors

### Testing
- ✅ All 42 tests passing (0 skipped)
- ✅ Coverage maintained at 97%+
- ✅ Lines 166-167 now covered
- ✅ SerialPortManager fully tested in isolation
- ✅ SocketIOHandler fully tested in isolation

### SonarCloud
- ✅ SonarCloud sees window_spider_trigger coverage (97%+)
- ✅ S1607 issue resolved (no skipped tests)
- ✅ Coverage report uploaded via CI/CD
- ✅ Dashboard shows accurate metrics

### Functionality
- ✅ Server starts and runs normally
- ✅ Serial port communication works
- ✅ Socket.IO events work
- ✅ Manual trigger works
- ✅ Arduino integration works

## Reference Implementation

**Follow patterns from:**
- `spider_crawl_projection/` - Library extraction approach
- `spider_crawl_projection/PHASE1_LESSONS_LEARNED.md` - Lessons on browser compatibility
- `hatching_egg/` - GoogleTest C++ testing with mocks

**Key principles:**
1. **Dependency Injection**: Pass dependencies via constructors
2. **Instance Methods**: No module-level closures
3. **Testability First**: Design for testing from the start
4. **Small Classes**: Single Responsibility Principle
5. **Comprehensive Tests**: Test in isolation with mocks

## Implementation Order

1. **Create SerialPortManager** (coder agent)
2. **Create SerialPortManager tests** (coder agent)
3. **Create SocketIOHandler** (coder agent)
4. **Create SocketIOHandler tests** (coder agent)
5. **Refactor server.js** (coder agent)
6. **Update server.test.js** (coder agent)
7. **Run all tests** (test-runner agent)
8. **Verify coverage** (test-runner agent)
9. **Update CI/CD** (coder agent)
10. **Push and verify SonarCloud** (manual verification)
11. **Code review** (code-reviewer agent)

## Risk Mitigation

**Potential Issues:**
1. **Breaking changes**: Server might not start after refactoring
   - Mitigation: Incremental changes, test after each step
2. **Test timing issues**: Socket.IO async events
   - Mitigation: Use proper async/await patterns in tests
3. **Mock complexity**: Mocking SerialPort is tricky
   - Mitigation: Follow existing test patterns
4. **SonarCloud config**: Coverage might not upload correctly
   - Mitigation: Test locally with sonar-scanner first

**Rollback Plan:**
- Keep git commits small and atomic
- Test after each phase
- Can revert individual commits if needed

## Time Estimate

- Phase 1 (SerialPortManager): 1-2 hours
- Phase 2 (SocketIOHandler): 1-2 hours
- Phase 3 (Refactor server.js): 1 hour
- Phase 4 (Update tests): 2-3 hours
- Phase 5 (CI/CD + SonarCloud): 1 hour
- **Total: 6-9 hours**

## Next Steps

1. Review and approve this plan
2. Begin Phase 1: Create SerialPortManager
3. Proceed incrementally with testing after each phase
4. Coordinate with specialized agents (coder, test-runner, code-reviewer)
