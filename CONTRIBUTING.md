# Contributing to Prayer Times Calculation SDK

Thank you for your interest in contributing to the Prayer Times Calculation SDK! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)
- [Release Process](#release-process)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Getting Started

### Prerequisites

- Node.js 14.0.0 or higher
- npm 6.0.0 or higher
- Git

### Types of Contributions

We welcome several types of contributions:

- 🐛 **Bug Reports**: Help us identify and fix issues
- 💡 **Feature Requests**: Suggest new functionality
- 📝 **Documentation**: Improve our docs and examples
- 🔧 **Code Contributions**: Bug fixes and new features
- 🧪 **Testing**: Add or improve test coverage
- 🌍 **Localization**: Translations and regional improvements

## Development Setup

1. **Fork the repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/prayer-times-calculation.git
   cd prayer-times-calculation
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up development environment**
   ```bash
   # Run tests to ensure everything works
   npm test

   # Build the project
   npm run build

   # Run linting
   npm run lint
   ```

4. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-number
   ```

## Contributing Guidelines

### Before You Start

1. **Check existing issues** to see if your bug/feature is already reported
2. **Open an issue** to discuss major changes before implementing
3. **Keep changes focused** - one feature/fix per pull request
4. **Follow the coding standards** outlined below

### Bug Reports

When filing a bug report, please include:

- **Clear title** and description
- **Steps to reproduce** the issue
- **Expected vs actual behavior**
- **Environment details** (Node.js version, OS, etc.)
- **Code sample** demonstrating the issue

**Bug Report Template:**
```markdown
## Bug Description
Brief description of the issue

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- Node.js version:
- npm version:
- OS:
- SDK version:

## Code Sample
```typescript
// Minimal code sample that demonstrates the issue
```

### Feature Requests

For feature requests, please include:

- **Clear description** of the proposed feature
- **Use case** - why is this needed?
- **Proposed API** (if applicable)
- **Implementation considerations**

## Pull Request Process

### Before Submitting

1. **Ensure tests pass**
   ```bash
   npm test
   ```

2. **Run linting**
   ```bash
   npm run lint
   npm run format
   ```

3. **Build successfully**
   ```bash
   npm run build
   ```

4. **Update documentation** if needed

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix (non-breaking change)
- [ ] New feature (non-breaking change)
- [ ] Breaking change (fix or feature that would cause existing functionality to change)
- [ ] Documentation update

## Testing
- [ ] I have added tests that prove my fix is effective or my feature works
- [ ] All new and existing tests pass

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
```

### Review Process

1. **Automated checks** must pass (CI/CD)
2. **Code review** by maintainers
3. **Address feedback** if any
4. **Merge** when approved

## Coding Standards

### TypeScript Guidelines

- Use **strict TypeScript** configuration
- **No `any` types** - use proper typing
- **Export types** that users might need
- **Document public APIs** with JSDoc

```typescript
/**
 * Calculates prayer times for a given location and date
 * @param latitude - Geographic latitude (-90 to 90)
 * @param longitude - Geographic longitude (-180 to 180)
 * @param date - Date for calculation
 * @param timezone - UTC offset in hours
 * @param options - Calculation options
 * @returns Prayer times object
 */
public getTimes(): PrayerTimes {
  // Implementation
}
```

### Code Style

- **2 spaces** for indentation
- **Single quotes** for strings
- **Semicolons** required
- **Trailing commas** in multiline structures
- **Max line length**: 80 characters

### File Organization

```
src/
├── types.ts           # Type definitions
├── methods.ts         # Calculation methods
├── prayer-times-sdk.ts # Main SDK class
├── utils/
│   └── astronomical.ts # Utility functions
└── index.ts           # Public exports
```

### Naming Conventions

- **Functions**: camelCase (`calculateSunrise`)
- **Classes**: PascalCase (`PrayerTimesSDK`)
- **Constants**: UPPER_SNAKE_CASE (`CALCULATION_METHODS`)
- **Types/Interfaces**: PascalCase (`CalculationOptions`)
- **Files**: kebab-case (`prayer-times-sdk.ts`)

## Testing

### Test Requirements

- **Unit tests** for all new functions
- **Integration tests** for main functionality
- **Performance tests** for critical paths
- **95%+ code coverage** for new code

### Writing Tests

```typescript
describe('PrayerTimesSDK', () => {
  describe('getTimes', () => {
    it('should calculate prayer times correctly', () => {
      const sdk = new PrayerTimesSDK(24.7136, 46.6753, new Date(), 3, {
        method: 'MWL',
        asrJurisdiction: 'Standard'
      });

      const times = sdk.getTimes();

      expect(times.fajr).toMatch(/^\d{2}:\d{2}$/);
      expect(times.sunrise).toMatch(/^\d{2}:\d{2}$/);
      // ... more assertions
    });
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Watch mode for development
npm run test:watch

# Coverage report
npm run test:coverage

# Performance benchmarks
npm run test:performance
```

## Documentation

### Documentation Requirements

- **README.md** updates for new features
- **API.md** updates for API changes
- **JSDoc comments** for public APIs
- **Examples** for new functionality
- **Migration guides** for breaking changes

### Documentation Style

- **Clear and concise** explanations
- **Code examples** for all features
- **Real-world use cases**
- **Proper markdown formatting**

## Release Process

### Versioning

We follow [Semantic Versioning](https://semver.org/):

- **PATCH** (1.0.1): Bug fixes
- **MINOR** (1.1.0): New features (backward compatible)
- **MAJOR** (2.0.0): Breaking changes

### Release Checklist

1. **Update version** in `package.json`
2. **Update CHANGELOG.md**
3. **Run full test suite**
4. **Build and verify package**
5. **Create GitHub release**
6. **Publish to npm**

## Getting Help

### Resources

- 📖 **Documentation**: [docs/](docs/)
- 💬 **Discussions**: GitHub Discussions
- 🐛 **Issues**: GitHub Issues
- 📧 **Email**: [maintainer email]

### Development Questions

- Check existing **GitHub Discussions**
- Look through **closed issues** for similar problems
- Join our **Discord/Slack** community
- **Open a discussion** for general questions

### Reporting Security Issues

Please **DO NOT** open a public issue for security vulnerabilities. Instead:

1. **Email** security@[domain].com
2. **Include** detailed information about the vulnerability
3. **Wait** for our response before public disclosure

## Recognition

### Contributors

All contributors will be:

- **Listed** in the README.md
- **Mentioned** in release notes
- **Invited** to the contributors team

### Types of Recognition

- 🎖️ **Code contributions**
- 📝 **Documentation improvements**
- 🐛 **Bug reports and testing**
- 💡 **Ideas and feedback**
- 🌟 **Community support**

## Development Workflow

### Typical Workflow

1. **Find/create issue** to work on
2. **Fork** and create feature branch
3. **Implement** changes with tests
4. **Test** thoroughly
5. **Submit** pull request
6. **Address** review feedback
7. **Merge** when approved

### Branch Naming

- `feature/description` - New features
- `fix/issue-number` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring
- `test/description` - Test improvements

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

feat(sdk): add support for custom prayer time adjustments
fix(calc): correct Asr calculation for extreme latitudes
docs(readme): update installation instructions
test(unit): add tests for edge cases
```

## FAQ

### Q: How do I add a new calculation method?

1. Add method to `CalculationMethod` type
2. Add angles to `CALCULATION_METHODS`
3. Update tests and documentation
4. Add example usage

### Q: Can I contribute translations?

Currently, the SDK is calculation-focused and doesn't include UI text. However, we welcome:
- Translated documentation
- Localized examples
- Regional calculation methods

### Q: How do I propose a breaking change?

1. **Open an issue** first to discuss
2. **Provide justification** for the change
3. **Include migration guide**
4. **Get approval** before implementing

### Q: What's the performance requirement?

Prayer time calculations must:
- Complete in **< 10ms** on average hardware
- Use **< 100KB** memory
- Have **zero dependencies**

---

Thank you for contributing to the Prayer Times Calculation SDK! Your efforts help provide accurate prayer times to Muslims worldwide. 🕌