# Prayer Times Calculation SDK

A minimalist, offline TypeScript SDK for calculating Islamic prayer times without any external dependencies.

## Features

- ✅ **Zero Dependencies**: No external libraries required
- ✅ **Offline**: Works completely offline without internet connection
- ✅ **Fast**: Calculations complete in <10ms
- ✅ **Lightweight**: <50KB package size
- ✅ **Accurate**: ±1 minute accuracy compared to official sources
- ✅ **Flexible**: Support for multiple calculation methods and custom angles
- ✅ **TypeScript**: Full TypeScript support with type definitions

## Installation

```bash
npm install prayer-times-calculation
```

## Quick Start

```typescript
import { PrayerTimesSDK } from 'prayer-times-calculation';

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

## API Reference

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

## Calculation Methods

| Method | Fajr Angle | Isha Angle | Description |
|--------|------------|------------|-------------|
| MWL | 18° | 17° | Muslim World League |
| ISNA | 15° | 15° | Islamic Society of North America |
| Egypt | 19.5° | 17.5° | Egyptian General Authority |
| Makkah | 18.5° | 18.5° | Umm Al-Qura University |
| Karachi | 18° | 18° | University of Islamic Sciences, Karachi |
| Custom | Custom | Custom | User-defined angles |

## Asr Calculation

- **Standard** (Shafi/Maliki/Hanbali): Shadow length = object height
- **Hanafi**: Shadow length = 2 × object height

## Examples

### Different Calculation Methods

```typescript
// Muslim World League method
const mwl = new PrayerTimesSDK(24.7136, 46.6753, new Date(), 3, {
  method: 'MWL',
  asrJurisdiction: 'Standard'
});

// Islamic Society of North America method
const isna = new PrayerTimesSDK(40.7128, -74.0060, new Date(), -5, {
  method: 'ISNA',
  asrJurisdiction: 'Standard'
});

// Custom angles
const custom = new PrayerTimesSDK(51.5074, -0.1278, new Date(), 0, {
  method: 'Custom',
  fajrAngle: 18,
  ishaAngle: 16,
  asrJurisdiction: 'Hanafi'
});
```

### Different Locations

```typescript
// New York
const nyTimes = new PrayerTimesSDK(40.7128, -74.0060, new Date(), -5, {
  method: 'ISNA',
  asrJurisdiction: 'Standard'
});

// London
const londonTimes = new PrayerTimesSDK(51.5074, -0.1278, new Date(), 0, {
  method: 'MWL',
  asrJurisdiction: 'Standard'
});

// Tokyo
const tokyoTimes = new PrayerTimesSDK(35.6762, 139.6503, new Date(), 9, {
  method: 'MWL',
  asrJurisdiction: 'Standard'
});
```

### Specific Date Calculation

```typescript
// Calculate for a specific date
const specificDate = new Date('2023-12-25');
const prayerTimes = new PrayerTimesSDK(24.7136, 46.6753, specificDate, 3, {
  method: 'MWL',
  asrJurisdiction: 'Standard'
});
```

## Performance

The SDK is designed for high performance:
- Execution time: <10ms on average hardware
- Memory usage: <100KB
- Package size: <50KB (uncompressed)

## Accuracy

Prayer times are calculated with ±1 minute accuracy compared to official Islamic authorities. The calculations use:
- Standard astronomical formulas
- Proper solar declination and equation of time
- Geographic coordinate corrections
- Timezone adjustments

## Browser Support

Works in all modern browsers and Node.js environments:
- Chrome/Edge 88+
- Firefox 78+
- Safari 14+
- Node.js 14+

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please visit our [GitHub repository](https://github.com/your-username/prayer-times-calculation).