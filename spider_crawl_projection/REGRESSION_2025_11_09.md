# Critical Regression - November 9, 2025

## Summary
SonarCloud "modernization" fixes broke browser functionality in spider_crawl_projection, causing spiders to not appear and menu options to disappear.

## Root Cause
Commits 7930d44 (Phase 2) and 402c018 (Phase 3) changed browser detection pattern from `typeof window !== 'undefined'` to `globalThis.window !== undefined`, breaking browser exports.

## Breaking Changes

### Commit 7930d44 (Phase 2)
Changed all instances of:
```javascript
// Working code
if (typeof window !== 'undefined') {
    window.Leg2D = Leg2D;
}
```

To:
```javascript
// Broken code
if (globalThis.window !== undefined) {
    globalThis.Leg2D = Leg2D;
}
```

### Commit 402c018 (Phase 3)
Further "modernization" that compounded the browser export issues.

## Impact
1. No spiders appearing in browser
2. Hopping menu missing many options
3. Classes (Leg2D, SpiderBody, etc.) not exported to window object
4. Browser console likely showing undefined errors

## Resolution
Reverted entire spider_crawl_projection directory to commit c08fc8f (last known working state):
```bash
git checkout c08fc8f -- spider_crawl_projection/
```

## Lessons Learned

### 1. Browser Compatibility is Critical
The `typeof` operator is NOT optional for browser/Node.js dual compatibility:
- `typeof window !== 'undefined'` - CORRECT (safe in all environments)
- `globalThis.window !== undefined` - WRONG (breaks browser exports)
- `window !== undefined` - WRONG (may cause reference errors)

### 2. SonarCloud Fixes Can Introduce Regressions
Not all SonarCloud suggestions improve code:
- S1607 "Use globalThis instead of window" is WRONG for dual-mode code
- Modernization for the sake of modernization can break functionality
- Always test in target environment (browser) after "fixes"

### 3. Test Coverage Doesn't Catch All Issues
- Unit tests passed after the breaking changes
- Browser functionality was broken despite passing tests
- Need integration/E2E tests for browser functionality
- Manual browser testing is still required

### 4. Revert is Often Safer Than Fix-Forward
When multiple interrelated changes break functionality:
- Full directory revert to known-good state is safer
- Trying to fix each broken file individually risks missing interactions
- Can re-apply good changes (like test improvements) incrementally after

## Prevention

### Code Review Checklist
Before accepting "modernization" changes:
- [ ] Does this change browser/Node.js dual-mode code?
- [ ] Has browser functionality been tested manually?
- [ ] Is the "improvement" actually necessary?
- [ ] Does the change align with project conventions (CLAUDE.md)?
- [ ] Are there existing patterns being used for this exact use case?

### Testing Requirements
For browser-based projects:
- [ ] Unit tests must pass
- [ ] Manual browser testing required
- [ ] Check browser console for errors
- [ ] Verify all UI elements appear correctly
- [ ] Test in multiple browsers if possible

### Documentation
Added CRITICAL section to CLAUDE.md warning about browser compatibility:
- Explicitly documents the correct pattern
- Shows examples of WRONG patterns
- References this regression as a cautionary tale

## Files Affected
All files in spider_crawl_projection/ reverted to c08fc8f:
- leg-kinematics.js
- spider-model.js
- spider-animation.js
- optimize-foot-positions.js
- optimize-individual-legs.js
- test-ik-accuracy.js
- test-integration.js
- spider-editor.html
- test-minimal.html
- test-page-simple.html
- test-visual-output.html
- run-all-tests.sh
- pixi.toml
- README.md
- CHANGELOG.md
- AGENT_HANDOFF.md

## Verification
After revert:
- All 9 tests pass
- Browser export pattern restored: `if (typeof window !== 'undefined')`
- Ready for manual browser testing by user

## Action Items
1. User must verify browser functionality is restored
2. Future agents: Read CLAUDE.md browser compatibility section before making changes
3. Consider adding browser E2E tests to catch these regressions automatically
4. Be skeptical of SonarCloud suggestions that change working patterns
