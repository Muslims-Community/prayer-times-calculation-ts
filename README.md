# Prayer Times Calculation SDK

<div align="center">

[![npm version](https://badge.fury.io/js/@muslims-community%2Fprayer-times-calculation.svg)](https://badge.fury.io/js/@muslims-community%2Fprayer-times-calculation)
[![npm downloads](https://img.shields.io/npm/dm/@muslims-community/prayer-times-calculation.svg)](https://www.npmjs.com/package/@muslims-community/prayer-times-calculation)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-14%2B-green.svg)](https://nodejs.org/)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero-brightgreen.svg)](#)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@muslims-community/prayer-times-calculation.svg)](https://bundlephobia.com/package/@muslims-community/prayer-times-calculation)
[![GitHub stars](https://img.shields.io/github/stars/Muslims-Community/prayer-times-calculation-ts.svg?style=social&label=Star)](https://github.com/Muslims-Community/prayer-times-calculation-ts)

*A minimalist, offline TypeScript SDK for calculating Islamic prayer times without any external dependencies.*

[Installation](#installation) •
[Quick Start](#quick-start) •
[API Reference](#api-reference) •
[Examples](#examples) •
[Documentation](#documentation)

</div>

---

## 🌟 Features

- ✅ **Zero Dependencies**: No external libraries required
- ✅ **Offline**: Works completely offline without internet connection
- ✅ **Fast**: Calculations complete in <10ms
- ✅ **Lightweight**: <50KB package size
- ✅ **Accurate**: ±1 minute accuracy compared to official sources
- ✅ **Flexible**: Support for multiple calculation methods and custom angles
- ✅ **TypeScript**: Full TypeScript support with type definitions
- ✅ **Universal**: Works in Node.js and all modern browsers
- ✅ **Well-tested**: Comprehensive test suite with 19+ test cases

## 📦 Installation

```bash
npm install @muslims-community/prayer-times-calculation
```

```bash
yarn add @muslims-community/prayer-times-calculation
```

```bash
pnpm add @muslims-community/prayer-times-calculation
```

## 🚀 Quick Start

```typescript
import { PrayerTimesSDK } from '@muslims-community/prayer-times-calculation';

// Riyadh coordinates
const latitude = 24.7136;
const longitude = 46.6753;
const timezone = 3; // UTC+3
const date = new Date(); // Current date

const prayerTimes = new PrayerTimesSDK(latitude, longitude, date, timezone, {
  method: 'MWL',
  asrJurisdiction: 'Standard'
});

const times = prayerTimes.getTimes();
console.log(times);
// {
//   fajr: "04:32",
//   sunrise: "05:52",
//   dhuhr: "12:15",
//   asr: "15:42",
//   maghrib: "18:38",
//   isha: "20:08"
// }
```

## 📚 API Reference

### Constructor

```typescript
new PrayerTimesSDK(
  latitude: number,
  longitude: number,
  date: Date = new Date(),
  timezone: number,
  options: CalculationOptions
)
```

#### Parameters

- `latitude`: Geographic latitude (-90 to 90)
- `longitude`: Geographic longitude (-180 to 180)
- `date`: Date for calculation (optional, defaults to current date)
- `timezone`: UTC offset in hours (e.g., 3 for UTC+3, -5 for UTC-5)
- `options`: Calculation configuration object

### CalculationOptions

```typescript
interface CalculationOptions {
  method: 'MWL' | 'ISNA' | 'Egypt' | 'Makkah' | 'Karachi' | 'Custom';
  fajrAngle?: number;      // Required when method is 'Custom'
  ishaAngle?: number;      // Required when method is 'Custom'
  asrJurisdiction: 'Standard' | 'Hanafi';
}
```

### Methods

#### `getTimes(): PrayerTimes`

Returns prayer times as formatted strings (HH:mm).

```typescript
interface PrayerTimes {
  fajr: string;     // Dawn prayer
  sunrise: string;  // Sunrise time
  dhuhr: string;    // Noon prayer
  asr: string;      // Afternoon prayer
  maghrib: string;  // Sunset prayer
  isha: string;     // Night prayer
}
```

## ⚙️ Calculation Methods

| Method | Fajr Angle | Isha Angle | Description |
|--------|------------|------------|-------------|
| **MWL** | 18° | 17° | Muslim World League |
| **ISNA** | 15° | 15° | Islamic Society of North America |
| **Egypt** | 19.5° | 17.5° | Egyptian General Authority |
| **Makkah** | 18.5° | 18.5° | Umm Al-Qura University |
| **Karachi** | 18° | 18° | University of Islamic Sciences, Karachi |
| **Custom** | Custom | Custom | User-defined angles |

## 🕌 Asr Calculation

- **Standard** (Shafi/Maliki/Hanbali): Shadow length = object height
- **Hanafi**: Shadow length = 2 × object height

## 💡 Examples

### Different Calculation Methods

```typescript
// Muslim World League method (Most common)
const mwl = new PrayerTimesSDK(24.7136, 46.6753, new Date(), 3, {
  method: 'MWL',
  asrJurisdiction: 'Standard'
});

// Islamic Society of North America method
const isna = new PrayerTimesSDK(40.7128, -74.0060, new Date(), -5, {
  method: 'ISNA',
  asrJurisdiction: 'Standard'
});

// Custom angles for specific requirements
const custom = new PrayerTimesSDK(51.5074, -0.1278, new Date(), 0, {
  method: 'Custom',
  fajrAngle: 18,
  ishaAngle: 16,
  asrJurisdiction: 'Hanafi'
});
```

### Different Locations Around the World

```typescript
// New York, USA
const nyTimes = new PrayerTimesSDK(40.7128, -74.0060, new Date(), -5, {
  method: 'ISNA',
  asrJurisdiction: 'Standard'
});

// London, UK
const londonTimes = new PrayerTimesSDK(51.5074, -0.1278, new Date(), 0, {
  method: 'MWL',
  asrJurisdiction: 'Standard'
});

// Tokyo, Japan
const tokyoTimes = new PrayerTimesSDK(35.6762, 139.6503, new Date(), 9, {
  method: 'MWL',
  asrJurisdiction: 'Standard'
});

// Cairo, Egypt
const cairoTimes = new PrayerTimesSDK(30.0444, 31.2357, new Date(), 2, {
  method: 'Egypt',
  asrJurisdiction: 'Standard'
});
```

### Specific Date Calculations

```typescript
// Calculate for Ramadan 2024
const ramadanStart = new Date('2024-03-11');
const ramadanTimes = new PrayerTimesSDK(24.7136, 46.6753, ramadanStart, 3, {
  method: 'MWL',
  asrJurisdiction: 'Standard'
});

// Calculate for next Friday
const nextFriday = new Date();
nextFriday.setDate(nextFriday.getDate() + (5 - nextFriday.getDay() + 7) % 7);
const fridayTimes = new PrayerTimesSDK(40.7128, -74.0060, nextFriday, -5, {
  method: 'ISNA',
  asrJurisdiction: 'Standard'
});
```

### React.js Integration Example

```typescript
import React, { useState, useEffect } from 'react';
import { PrayerTimesSDK } from '@muslims-community/prayer-times-calculation';

const PrayerTimesWidget: React.FC = () => {
  const [times, setTimes] = useState<any>(null);

  useEffect(() => {
    // Get user's location
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      const timezone = -new Date().getTimezoneOffset() / 60;

      const prayerTimes = new PrayerTimesSDK(latitude, longitude, new Date(), timezone, {
        method: 'MWL',
        asrJurisdiction: 'Standard'
      });

      setTimes(prayerTimes.getTimes());
    });
  }, []);

  if (!times) return <div>Loading prayer times...</div>;

  return (
    <div>
      <h2>Today's Prayer Times</h2>
      <ul>
        <li>Fajr: {times.fajr}</li>
        <li>Sunrise: {times.sunrise}</li>
        <li>Dhuhr: {times.dhuhr}</li>
        <li>Asr: {times.asr}</li>
        <li>Maghrib: {times.maghrib}</li>
        <li>Isha: {times.isha}</li>
      </ul>
    </div>
  );
};
```

## 📊 Performance

The SDK is designed for high performance:

| Metric | Value |
|--------|-------|
| **Execution Time** | <10ms on average hardware |
| **Memory Usage** | <100KB |
| **Package Size** | <50KB (uncompressed) |
| **Bundle Size** | <15KB (minified + gzipped) |

## 🎯 Accuracy

Prayer times are calculated with **±1 minute accuracy** compared to official Islamic authorities. The calculations use:

- ✓ Standard astronomical formulas
- ✓ Proper solar declination and equation of time
- ✓ Geographic coordinate corrections
- ✓ Timezone adjustments
- ✓ Atmospheric refraction corrections

## 🌐 Browser Support

Works in all modern browsers and Node.js environments:

| Environment | Minimum Version |
|-------------|----------------|
| **Chrome/Edge** | 88+ |
| **Firefox** | 78+ |
| **Safari** | 14+ |
| **Node.js** | 14+ |
| **React Native** | 0.60+ |

## 🧪 Testing

The package includes comprehensive tests:

```bash
npm test          # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

## 📖 Documentation

### Available Languages

- [English](README.md) (This file)
- [العربية (Arabic)](README.ar.md)
- [اردو (Urdu)](README.ur.md)

### Additional Resources

- [API Documentation](https://github.com/Muslims-Community/prayer-times-calculation-ts/wiki)
- [Examples Repository](https://github.com/Muslims-Community/prayer-times-calculation-ts/tree/main/examples)
- [Migration Guide](https://github.com/Muslims-Community/prayer-times-calculation-ts/wiki/Migration-Guide)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](https://github.com/Muslims-Community/prayer-times-calculation-ts/blob/main/CONTRIBUTING.md) for details.

### Development Setup

```bash
git clone https://github.com/Muslims-Community/prayer-times-calculation-ts.git
cd prayer-times-calculation-ts
npm install
npm run dev
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Support

If you find this package helpful, please consider:

- ⭐ Starring the repository
- 🐛 Reporting bugs via [GitHub Issues](https://github.com/Muslims-Community/prayer-times-calculation-ts/issues)
- 💡 Suggesting features
- 🔄 Contributing code

## 📞 Contact

- **Author**: Mahmoud Alsamman
- **Email**: memoibraheem1@gmail.com
- **GitHub**: [@mahmoudalsaman](https://github.com/mahmoudalsaman)
- **NPM**: [@muslims-community/prayer-times-calculation](https://www.npmjs.com/package/@muslims-community/prayer-times-calculation)

---

<div align="center">

**Made with ❤️ for the Muslim community worldwide**

[![Follow on GitHub](https://img.shields.io/github/followers/mahmoudalsaman.svg?style=social&label=Follow)](https://github.com/mahmoudalsaman)

</div>