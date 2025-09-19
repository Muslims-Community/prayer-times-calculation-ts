# API Reference

## Table of Contents
- [PrayerTimesSDK Class](#prayertimessdk-class)
- [Types](#types)
- [Calculation Methods](#calculation-methods)
- [Utilities](#utilities)
- [Error Handling](#error-handling)

## PrayerTimesSDK Class

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

| Parameter | Type | Description | Range |
|-----------|------|-------------|-------|
| `latitude` | `number` | Geographic latitude | -90 to 90 |
| `longitude` | `number` | Geographic longitude | -180 to 180 |
| `date` | `Date` | Date for calculation (optional) | Any valid Date |
| `timezone` | `number` | UTC offset in hours | -12 to 14 |
| `options` | `CalculationOptions` | Calculation configuration | See below |

#### Example

```typescript
const sdk = new PrayerTimesSDK(
  24.7136,    // Riyadh latitude
  46.6753,    // Riyadh longitude
  new Date(), // Current date
  3,          // UTC+3
  {
    method: 'MWL',
    asrJurisdiction: 'Standard'
  }
);
```

### Methods

#### `getTimes(): PrayerTimes`

Calculates and returns prayer times for the configured location and date.

**Returns:** `PrayerTimes` object containing all prayer times as formatted strings.

**Example:**

```typescript
const times = sdk.getTimes();
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

## Types

### CalculationOptions

```typescript
interface CalculationOptions {
  method: CalculationMethod;
  fajrAngle?: number;      // Required when method is 'Custom'
  ishaAngle?: number;      // Required when method is 'Custom'
  asrJurisdiction: AsrJurisdiction;
}
```

### CalculationMethod

```typescript
type CalculationMethod = 'MWL' | 'ISNA' | 'Egypt' | 'Makkah' | 'Karachi' | 'Custom';
```

### AsrJurisdiction

```typescript
type AsrJurisdiction = 'Standard' | 'Hanafi';
```

### PrayerTimes

```typescript
interface PrayerTimes {
  fajr: string;     // Dawn prayer (HH:mm format)
  sunrise: string;  // Sunrise time (HH:mm format)
  dhuhr: string;    // Noon prayer (HH:mm format)
  asr: string;      // Afternoon prayer (HH:mm format)
  maghrib: string;  // Sunset prayer (HH:mm format)
  isha: string;     // Night prayer (HH:mm format)
}
```

### MethodAngles

```typescript
interface MethodAngles {
  fajr: number;     // Fajr angle in degrees
  isha: number;     // Isha angle in degrees
}
```

## Calculation Methods

### Predefined Methods

| Method | Organization | Fajr Angle | Isha Angle | Description |
|--------|-------------|------------|------------|-------------|
| `MWL` | Muslim World League | 18° | 17° | Most widely used method |
| `ISNA` | Islamic Society of North America | 15° | 15° | Popular in North America |
| `Egypt` | Egyptian General Authority | 19.5° | 17.5° | Used in Egypt and surrounding regions |
| `Makkah` | Umm Al-Qura University | 18.5° | 18.5° | Used in Saudi Arabia |
| `Karachi` | University of Islamic Sciences | 18° | 18° | Used in Pakistan and India |

### Custom Method

When using `method: 'Custom'`, you must provide both `fajrAngle` and `ishaAngle`:

```typescript
const customOptions: CalculationOptions = {
  method: 'Custom',
  fajrAngle: 19.0,
  ishaAngle: 16.0,
  asrJurisdiction: 'Standard'
};
```

### Asr Jurisdictions

- **Standard** (Shafi/Maliki/Hanbali): Asr time when shadow length equals object height
- **Hanafi**: Asr time when shadow length equals twice the object height

## Utilities

### `getMethodAngles(method, customFajr?, customIsha?): MethodAngles`

Returns the fajr and isha angles for a given calculation method.

```typescript
import { getMethodAngles } from 'prayer-times-calculation';

// Get predefined method angles
const mwlAngles = getMethodAngles('MWL');
console.log(mwlAngles); // { fajr: 18, isha: 17 }

// Get custom angles
const customAngles = getMethodAngles('Custom', 20, 16);
console.log(customAngles); // { fajr: 20, isha: 16 }
```

### `CALCULATION_METHODS` Constant

Object containing all predefined calculation methods and their angles.

```typescript
import { CALCULATION_METHODS } from 'prayer-times-calculation';

console.log(CALCULATION_METHODS.MWL); // { fajr: 18, isha: 17 }
console.log(CALCULATION_METHODS.ISNA); // { fajr: 15, isha: 15 }
```

## Error Handling

### Common Errors

#### Invalid Custom Method

```typescript
// ❌ This will throw an error
const sdk = new PrayerTimesSDK(24.7136, 46.6753, new Date(), 3, {
  method: 'Custom',
  asrJurisdiction: 'Standard'
  // Missing fajrAngle and ishaAngle
});

// ✅ Correct usage
const sdk = new PrayerTimesSDK(24.7136, 46.6753, new Date(), 3, {
  method: 'Custom',
  fajrAngle: 18,
  ishaAngle: 17,
  asrJurisdiction: 'Standard'
});
```

#### Invalid Coordinates

```typescript
// ❌ Invalid latitude (must be -90 to 90)
const sdk = new PrayerTimesSDK(95, 46.6753, new Date(), 3, options);

// ❌ Invalid longitude (must be -180 to 180)
const sdk = new PrayerTimesSDK(24.7136, 185, new Date(), 3, options);
```

### NaN Results

In extreme locations (very high latitudes) or certain dates, some prayer times may not be calculable. In these cases, the SDK returns `"NaN:NaN"` for those specific times.

```typescript
const times = sdk.getTimes();
if (times.fajr === 'NaN:NaN') {
  console.log('Fajr time is not calculable for this location/date');
}
```

## Performance Considerations

- **Execution time**: < 10ms on average hardware
- **Memory usage**: < 100KB
- **CPU usage**: Minimal, suitable for frequent calculations
- **Thread safety**: Each SDK instance is independent

## Examples by Use Case

### Mobile App Integration

```typescript
// Get user's location and calculate prayer times
navigator.geolocation.getCurrentPosition((position) => {
  const sdk = new PrayerTimesSDK(
    position.coords.latitude,
    position.coords.longitude,
    new Date(),
    -new Date().getTimezoneOffset() / 60, // Auto-detect timezone
    { method: 'MWL', asrJurisdiction: 'Standard' }
  );

  const times = sdk.getTimes();
  displayPrayerTimes(times);
});
```

### Server-side Batch Processing

```typescript
// Calculate prayer times for multiple cities
const cities = [
  { name: 'Riyadh', lat: 24.7136, lng: 46.6753, tz: 3 },
  { name: 'Cairo', lat: 30.0444, lng: 31.2357, tz: 2 },
  { name: 'Istanbul', lat: 41.0082, lng: 28.9784, tz: 3 }
];

const results = cities.map(city => {
  const sdk = new PrayerTimesSDK(city.lat, city.lng, new Date(), city.tz, {
    method: 'MWL',
    asrJurisdiction: 'Standard'
  });

  return {
    city: city.name,
    times: sdk.getTimes()
  };
});
```

### React Component

```typescript
import React, { useState, useEffect } from 'react';
import { PrayerTimesSDK } from 'prayer-times-calculation';

const PrayerTimesComponent = ({ latitude, longitude, timezone }) => {
  const [times, setTimes] = useState(null);

  useEffect(() => {
    const sdk = new PrayerTimesSDK(latitude, longitude, new Date(), timezone, {
      method: 'MWL',
      asrJurisdiction: 'Standard'
    });

    setTimes(sdk.getTimes());
  }, [latitude, longitude, timezone]);

  if (!times) return <div>Loading...</div>;

  return (
    <div>
      <h2>Prayer Times</h2>
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