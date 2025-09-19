# Pull Request

## Description

<!-- Provide a brief description of the changes in this PR -->

**Summary of Changes:**
-
-
-

**Related Issue(s):**
- Fixes #(issue number)
- Relates to #(issue number)
- Part of #(issue number)

---

## Type of Change

<!-- Mark the relevant option with an [x] -->

- [ ] 🐛 **Bug fix** (non-breaking change that fixes an issue)
- [ ] ✨ **New feature** (non-breaking change that adds functionality)
- [ ] 💥 **Breaking change** (fix or feature that causes existing functionality to change)
- [ ] 📝 **Documentation update** (changes to documentation only)
- [ ] 🎨 **Code style/formatting** (changes that don't affect functionality)
- [ ] ♻️ **Refactoring** (code changes that neither fix bugs nor add features)
- [ ] ⚡ **Performance improvement** (changes that improve performance)
- [ ] 🧪 **Testing** (adding or updating tests)
- [ ] 🔧 **Build/CI** (changes to build process or CI configuration)

---

## Testing

### Test Coverage
<!-- Describe the tests you've added or run -->

- [ ] I have added unit tests that prove my fix is effective or my feature works
- [ ] I have added integration tests where appropriate
- [ ] I have run the existing test suite and all tests pass
- [ ] I have tested the changes manually

### Test Results
```bash
# Paste test results here
npm test
# Test results...
```

### Manual Testing
<!-- Describe any manual testing you've performed -->

**Test Environment:**
- Node.js version:
- npm version:
- OS:

**Test Cases:**
1.
2.
3.

---

## Changes Made

### Code Changes
<!-- Describe the technical changes in detail -->

**Files Modified:**
- `src/file1.ts` - Description of changes
- `src/file2.ts` - Description of changes
- `tests/file.test.ts` - Added tests for...

**Key Changes:**
1. **Function/Method Changes:**
   - Modified `functionName()` to handle...
   - Added new method `newMethod()` that...

2. **Algorithm/Logic Updates:**
   - Updated calculation logic for...
   - Fixed edge case handling in...

3. **API Changes (if any):**
   - Added new parameter `newParam` to...
   - Modified return type of...

### Performance Impact
<!-- If applicable, describe any performance implications -->

- [ ] No performance impact
- [ ] Performance improvement (describe)
- [ ] Potential performance degradation (justify)

**Benchmarks (if applicable):**
```
Before: X ms
After:  Y ms
Change: Z% improvement/degradation
```

---

## Documentation

### Documentation Updates
- [ ] I have updated the README.md file
- [ ] I have updated the API documentation
- [ ] I have added/updated code comments
- [ ] I have added/updated examples
- [ ] I have updated the CHANGELOG.md (for maintainers)

### New Documentation
- [ ] Added JSDoc comments for new functions
- [ ] Added usage examples for new features
- [ ] Updated type definitions
- [ ] Added migration guide for breaking changes

---

## Compatibility

### Breaking Changes
<!-- If this is a breaking change, describe the impact and migration path -->

- [ ] This PR introduces breaking changes
- [ ] Migration guide provided
- [ ] Deprecated features marked for removal

**Breaking Changes Details:**
-
-

**Migration Path:**
```typescript
// Before
const oldWay = new PrayerTimesSDK(/* old parameters */);

// After
const newWay = new PrayerTimesSDK(/* new parameters */);
```

### Platform Compatibility
<!-- Check all platforms that have been tested -->

- [ ] Node.js (14+)
- [ ] Web browsers (Chrome, Firefox, Safari, Edge)
- [ ] React Native
- [ ] Electron
- [ ] TypeScript compilation

---

## Code Quality

### Code Review Checklist
- [ ] Code follows the project's style guidelines
- [ ] Self-review of code has been performed
- [ ] Code is properly commented, especially complex areas
- [ ] No console.log or debug statements left in code
- [ ] No commented-out code blocks
- [ ] Error handling is appropriate and consistent

### Static Analysis
- [ ] ESLint passes without errors
- [ ] TypeScript compilation is successful
- [ ] No new TypeScript errors introduced
- [ ] Code formatting is consistent (Prettier)

```bash
# Static analysis results
npm run lint
# No errors

npm run build
# Build successful
```

---

## Islamic/Religious Considerations

<!-- If applicable, address religious or cultural aspects -->

- [ ] Changes maintain accuracy of Islamic calculations
- [ ] Religious sources consulted for algorithmic changes
- [ ] Regional/cultural practices considered
- [ ] No conflicts with established Islamic jurisprudence

**Religious Sources (if applicable):**
-
-

---

## Additional Context

### Screenshots/Visual Changes
<!-- If applicable, add screenshots or visual examples -->

### Dependencies
- [ ] No new dependencies added
- [ ] New dependencies are necessary and well-justified
- [ ] Dependencies are compatible with zero-dependency goal

**New Dependencies (if any):**
-

### Backwards Compatibility
- [ ] Changes are backwards compatible
- [ ] Deprecation warnings added for removed features
- [ ] Version bump is appropriate

### Security Considerations
- [ ] No security vulnerabilities introduced
- [ ] Input validation maintained/improved
- [ ] No sensitive data exposure

---

## Reviewer Notes

### Areas for Review
<!-- Highlight specific areas where you'd like focused review -->

- [ ] Algorithm correctness in `src/calculations.ts:45-67`
- [ ] Error handling in `src/validation.ts`
- [ ] Performance impact of new feature
- [ ] API design for new functionality

### Questions for Reviewers
1.
2.
3.

### Known Limitations
<!-- Any known limitations or technical debt -->

-
-

---

## Final Checklist

<!-- Ensure all items are checked before requesting review -->

### Code Quality
- [ ] All tests pass locally
- [ ] Code builds without errors
- [ ] Linting passes without errors
- [ ] No merge conflicts with main branch

### Documentation
- [ ] Documentation updated appropriately
- [ ] Examples provided for new features
- [ ] Comments added for complex logic

### Review Readiness
- [ ] PR description is clear and complete
- [ ] Commits are atomic and well-described
- [ ] Ready for code review
- [ ] CI/CD checks are passing

---

## Additional Information

<!-- Any other information that reviewers should know -->

**Related PRs:**
-

**Future Work:**
-
-

**References:**
-
-

---

<!--
Thank you for contributing to the Prayer Times Calculation SDK!
Your contribution helps provide accurate prayer times to Muslims worldwide. 🕌
-->