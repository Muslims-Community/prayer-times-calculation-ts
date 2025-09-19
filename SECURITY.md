# Security Policy

## Supported Versions

We actively maintain and provide security updates for the following versions of the Prayer Times Calculation SDK:

| Version | Supported          | Status |
| ------- | ------------------ | ------ |
| 1.x.x   | ✅ Yes             | Active development |
| 0.x.x   | ❌ No              | Legacy (no longer supported) |

## Security Considerations

### SDK Design Principles

The Prayer Times Calculation SDK is designed with security in mind:

#### ✅ Secure by Design

- **Zero Dependencies**: No external libraries that could introduce vulnerabilities
- **Offline Operation**: No network requests or external API calls
- **No Data Storage**: Calculations are performed in memory only
- **No User Data Collection**: No personal information is processed or stored
- **Stateless Operations**: Each calculation is independent and doesn't persist data

#### ✅ Input Validation

- **Coordinate Validation**: Latitude and longitude bounds checking
- **Parameter Sanitization**: All inputs are validated and sanitized
- **Type Safety**: Full TypeScript type checking prevents many vulnerabilities
- **Error Handling**: Graceful handling of invalid inputs without exposing internals

#### ✅ Safe Mathematical Operations

- **Boundary Checks**: All mathematical operations include boundary validation
- **Overflow Protection**: Safe handling of extreme coordinate values
- **NaN Handling**: Proper handling of non-computable results

### Potential Security Considerations

While the SDK is designed to be secure, users should be aware of these considerations:

#### Input Validation in Applications

When integrating the SDK, ensure proper validation of user inputs:

```typescript
// ❌ Dangerous - direct user input
const userLat = parseFloat(userInput); // Could be malicious
const sdk = new PrayerTimesSDK(userLat, lng, date, tz, options);

// ✅ Safe - validated input
function validateCoordinate(coord: number, min: number, max: number): number {
  if (isNaN(coord) || coord < min || coord > max) {
    throw new Error(`Invalid coordinate: ${coord}`);
  }
  return coord;
}

const safeLat = validateCoordinate(parseFloat(userInput), -90, 90);
const sdk = new PrayerTimesSDK(safeLat, lng, date, tz, options);
```

#### Server-Side Usage

When using the SDK in server applications:

- **Rate Limiting**: Implement rate limiting for API endpoints
- **Input Sanitization**: Validate all user inputs before processing
- **Error Handling**: Don't expose internal errors to users
- **Logging**: Log suspicious activity without exposing sensitive data

#### Client-Side Usage

When using the SDK in web applications:

- **CSP Headers**: Use Content Security Policy headers
- **Input Validation**: Validate user inputs on both client and server
- **HTTPS Only**: Always use HTTPS for web applications
- **No Sensitive Data**: Don't pass sensitive information to the SDK

## Reporting Security Vulnerabilities

### DO NOT Report Security Issues Publicly

Please **DO NOT** report security vulnerabilities through public GitHub issues, discussions, or any other public forum.

### Responsible Disclosure Process

1. **Email**: Send details to **security@prayer-times-sdk.org** (replace with actual email)
2. **Subject**: Include "SECURITY" in the subject line
3. **Description**: Provide detailed information about the vulnerability
4. **Wait**: Allow time for assessment before public disclosure

### What to Include in Your Report

Please include as much information as possible:

- **Description**: Clear description of the vulnerability
- **Impact**: Potential impact and severity assessment
- **Reproduction**: Step-by-step instructions to reproduce
- **Environment**: Affected versions and environments
- **Fix Suggestions**: Any potential fixes or mitigations you've identified

**Example Report:**
```
Subject: SECURITY - Input validation vulnerability in coordinate parsing

Description:
The SDK doesn't properly validate extreme coordinate values, potentially
leading to incorrect calculations or DoS through computational overflow.

Impact:
- Incorrect prayer time calculations
- Potential application crashes
- Resource exhaustion

Reproduction:
1. Create SDK instance with latitude value of Number.MAX_VALUE
2. Call getTimes() method
3. Observe [specific behavior]

Environment:
- SDK Version: 1.0.0
- Node.js Version: 18.x
- Operating System: Linux

Suggested Fix:
Add proper bounds checking for coordinate values before mathematical operations.
```

### Response Timeline

We are committed to responding to security reports promptly:

- **24 hours**: Initial acknowledgment of your report
- **72 hours**: Preliminary assessment and triage
- **7 days**: Detailed assessment and remediation plan
- **30 days**: Fix implementation and release (if needed)

### Coordinated Disclosure

- We follow **responsible disclosure** practices
- **90-day** disclosure timeline from initial report
- **Coordination** with reporters on disclosure timing
- **Credit** given to reporters (if desired) in security advisories

## Security Best Practices

### For SDK Users

#### Input Validation

```typescript
// Always validate user inputs
function validatePrayerTimeInput(
  lat: number,
  lng: number,
  timezone: number
): void {
  if (lat < -90 || lat > 90) {
    throw new Error('Invalid latitude');
  }
  if (lng < -180 || lng > 180) {
    throw new Error('Invalid longitude');
  }
  if (timezone < -12 || timezone > 14) {
    throw new Error('Invalid timezone');
  }
}
```

#### Error Handling

```typescript
// Safe error handling
try {
  const sdk = new PrayerTimesSDK(lat, lng, date, timezone, options);
  const times = sdk.getTimes();
  return times;
} catch (error) {
  // Log error details securely
  logger.error('Prayer time calculation failed', {
    error: error.message,
    // Don't log sensitive user data
  });

  // Return safe error to user
  throw new Error('Prayer time calculation failed');
}
```

#### Rate Limiting (Server Applications)

```typescript
// Express.js example with rate limiting
const rateLimit = require('express-rate-limit');

const prayerTimesLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many prayer time requests'
});

app.use('/api/prayer-times', prayerTimesLimit);
```

### For Developers

#### Secure Development

- **Regular Updates**: Keep dependencies updated
- **Code Review**: Review all code changes for security implications
- **Testing**: Include security test cases
- **Static Analysis**: Use tools like ESLint, TypeScript strict mode

#### Environment Security

- **Dependency Scanning**: Regularly scan for vulnerable dependencies
- **Build Security**: Secure CI/CD pipelines
- **Access Control**: Limit access to production systems

## Known Security Considerations

### Current Limitations

1. **Large Number Handling**: Very large coordinate values may cause precision issues
2. **Date Range**: Extreme dates (far past/future) may not calculate correctly
3. **Performance**: Complex calculations with invalid inputs could cause delays

### Mitigations

- Input validation prevents most edge cases
- TypeScript type system catches many potential issues
- Comprehensive testing covers boundary conditions
- Performance monitoring in test suite

## Security Contacts

### Primary Contact

- **Email**: security@prayer-times-sdk.org (replace with actual)
- **PGP Key**: [Link to public key if available]

### Maintainer Contacts

- **Lead Maintainer**: [Name] - [secure contact method]
- **Security Team**: [Team contact information]

### Response Team

Our security response team includes:

- Lead maintainer
- Core contributors
- Security specialist (if applicable)
- Community representatives

## Legal

### Vulnerability Disclosure Policy

This vulnerability disclosure policy applies to:

- The Prayer Times Calculation SDK codebase
- Official distribution channels (npm, GitHub)
- Official documentation and examples

### Safe Harbor

We support safe harbor for security researchers who:

- Follow responsible disclosure practices
- Don't access or modify data without permission
- Don't cause disruption to our services
- Report findings through proper channels

### Bug Bounty

Currently, we do not offer a formal bug bounty program. However, we:

- **Acknowledge** security researchers in our releases
- **Credit** reporters in security advisories (if desired)
- **Prioritize** security fixes over other development

## Updates to This Policy

This security policy may be updated to reflect:

- Changes in supported versions
- Updates to contact information
- Improvements to our security processes
- Community feedback and requirements

**Last Updated**: December 2023
**Version**: 1.0

---

Thank you for helping keep the Prayer Times Calculation SDK and our community safe! 🔒