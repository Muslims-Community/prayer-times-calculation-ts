# 📚 API Reference - اردو

یہ Prayer Times Calculation SDK کا تفصیلی API documentation ہے۔

## فہرست

- [PrayerTimesSDK Class](#prayertimessdk-class)
- [Types اور Interfaces](#types-اور-interfaces)
- [Calculation Methods](#calculation-methods)
- [Error Handling](#error-handling)
- [Examples](#examples)

## PrayerTimesSDK Class

### Constructor

```typescript
new PrayerTimesSDK(
  latitude: number,
  longitude: number,
  date: Date,
  timezone: number,
  options: CalculationOptions
)
```

#### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `latitude` | `number` | خط عرض (-90 سے 90 تک) | ✅ |
| `longitude` | `number` | خط طول (-180 سے 180 تک) | ✅ |
| `date` | `Date` | حساب کتاب کے لیے تاریخ | ✅ |
| `timezone` | `number` | UTC سے timezone offset (گھنٹوں میں) | ✅ |
| `options` | `CalculationOptions` | حساب کتاب کے اختیارات | ✅ |

#### مثال

```typescript
const sdk = new PrayerTimesSDK(
  24.8607,    // کراچی کا latitude
  67.0011,    // کراچی کا longitude
  new Date(), // آج کی تاریخ
  5,          // UTC+5 (پاکستان کا وقت)
  {
    method: 'Karachi',
    asrJurisdiction: 'Standard'
  }
);
```

### Methods

#### `getTimes(): PrayerTimes`

تمام نماز کے اوقات calculate کر کے return کرتا ہے۔

**Return Type:** `PrayerTimes`

**مثال:**
```typescript
const times = sdk.getTimes();
console.log(times.fajr);    // "05:30"
console.log(times.dhuhr);   // "12:15"
```

## Types اور Interfaces

### `CalculationOptions`

```typescript
interface CalculationOptions {
  method: CalculationMethod;
  asrJurisdiction?: AsrJurisdiction;
  fajrAngle?: number;
  ishaAngle?: number;
}
```

#### Properties

| Property | Type | Description | Default |
|----------|------|-------------|---------|
| `method` | `CalculationMethod` | حساب کتاب کا طریقہ | Required |
| `asrJurisdiction` | `AsrJurisdiction` | عصر کا فقہی طریقہ | `'Standard'` |
| `fajrAngle` | `number` | فجر کا زاویہ (صرف Custom method کے لیے) | - |
| `ishaAngle` | `number` | عشاء کا زاویہ (صرف Custom method کے لیے) | - |

### `CalculationMethod`

```typescript
type CalculationMethod = 'MWL' | 'ISNA' | 'Egypt' | 'Makkah' | 'Karachi' | 'Custom';
```

#### Methods کی تفصیل

| Method | نام | Fajr Angle | Isha Angle | استعمال |
|--------|-----|------------|------------|----------|
| `MWL` | رابطہ عالم اسلامی | 18° | 17° | عالمی |
| `ISNA` | Islamic Society of North America | 15° | 15° | شمالی امریکہ |
| `Egypt` | مصری عام سروے اتھارٹی | 19.5° | 17.5° | مصر |
| `Makkah` | جامعہ ام القریٰ | 18.5° | 90 min after Maghrib | سعودی عرب |
| `Karachi` | جامعہ علوم اسلامیہ | 18° | 18° | پاکستان، بنگلادیش |
| `Custom` | آپ کے اپنے زاویے | User defined | User defined | خاص ضروریات |

### `AsrJurisdiction`

```typescript
type AsrJurisdiction = 'Standard' | 'Hanafi';
```

| Value | تفصیل | مذاہب |
|-------|---------|---------|
| `Standard` | پہلے سائے کا طریقہ | شافعی، مالکی، حنبلی |
| `Hanafi` | دوسرے سائے کا طریقہ | حنفی |

### `PrayerTimes`

```typescript
interface PrayerTimes {
  fajr: string;     // فجر
  sunrise: string;  // طلوع آفتاب
  dhuhr: string;    // ظہر
  asr: string;      // عصر
  maghrib: string;  // مغرب
  isha: string;     // عشاء
}
```

## Calculation Methods

### مختلف Methods کا استعمال

```typescript
// رابطہ عالم اسلامی (عالمی استعمال)
const mwlSDK = new PrayerTimesSDK(lat, lng, date, tz, { method: 'MWL' });

// جامعہ علوم اسلامیہ (پاکستان)
const karachiSDK = new PrayerTimesSDK(lat, lng, date, tz, { method: 'Karachi' });

// جامعہ ام القریٰ (سعودی عرب)
const makkahSDK = new PrayerTimesSDK(lat, lng, date, tz, { method: 'Makkah' });

// حنفی عصر
const hanafiSDK = new PrayerTimesSDK(lat, lng, date, tz, {
  method: 'Karachi',
  asrJurisdiction: 'Hanafi'
});
```

### Custom Method

```typescript
const customSDK = new PrayerTimesSDK(lat, lng, date, tz, {
  method: 'Custom',
  fajrAngle: 18,    // فجر کے لیے 18 degrees
  ishaAngle: 17,    // عشاء کے لیے 17 degrees
  asrJurisdiction: 'Hanafi'
});
```

## Error Handling

### Common Errors

#### Invalid Coordinates

```typescript
try {
  // غلط latitude
  const sdk = new PrayerTimesSDK(95, 67, new Date(), 5, { method: 'Karachi' });
} catch (error) {
  console.error('خط عرض -90 سے 90 کے درمیان ہونا چاہیے');
}
```

#### Invalid Timezone

```typescript
try {
  // غلط timezone
  const sdk = new PrayerTimesSDK(24, 67, new Date(), 25, { method: 'Karachi' });
} catch (error) {
  console.error('Timezone -12 سے +14 کے درمیان ہونا چاہیے');
}
```

#### Custom Method without Angles

```typescript
try {
  const sdk = new PrayerTimesSDK(24, 67, new Date(), 5, {
    method: 'Custom'
    // fajrAngle اور ishaAngle missing
  });
} catch (error) {
  console.error('Custom method کے لیے fajrAngle اور ishaAngle ضروری ہیں');
}
```

### Best Practices

```typescript
function calculatePrayerTimes(lat, lng, date, tz, options) {
  try {
    // Input validation
    if (typeof lat !== 'number' || lat < -90 || lat > 90) {
      throw new Error('Invalid latitude');
    }

    if (typeof lng !== 'number' || lng < -180 || lng > 180) {
      throw new Error('Invalid longitude');
    }

    const sdk = new PrayerTimesSDK(lat, lng, date, tz, options);
    return sdk.getTimes();

  } catch (error) {
    console.error('نماز کے اوقات calculate کرنے میں خرابی:', error.message);
    return null;
  }
}
```

## Examples

### پاکستان کے مختلف شہر

```typescript
// کراچی
const karachiTimes = new PrayerTimesSDK(24.8607, 67.0011, new Date(), 5, {
  method: 'Karachi'
}).getTimes();

// لاہور
const lahoreTimes = new PrayerTimesSDK(31.5497, 74.3436, new Date(), 5, {
  method: 'Karachi'
}).getTimes();

// اسلام آباد
const islamabadTimes = new PrayerTimesSDK(33.6844, 73.0479, new Date(), 5, {
  method: 'Karachi'
}).getTimes();

// پشاور
const peshawarTimes = new PrayerTimesSDK(34.0151, 71.5249, new Date(), 5, {
  method: 'Karachi'
}).getTimes();
```

### مختلف تاریخوں کے لیے

```typescript
// آج
const today = new PrayerTimesSDK(24.8607, 67.0011, new Date(), 5, {
  method: 'Karachi'
}).getTimes();

// کل
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const tomorrowTimes = new PrayerTimesSDK(24.8607, 67.0011, tomorrow, 5, {
  method: 'Karachi'
}).getTimes();

// رمضان کی پہلی تاریخ (مثال)
const ramadanStart = new Date('2025-03-10');
const ramadanTimes = new PrayerTimesSDK(24.8607, 67.0011, ramadanStart, 5, {
  method: 'Karachi'
}).getTimes();
```

### React Hook Example

```typescript
import { useState, useEffect } from 'react';
import { PrayerTimesSDK } from 'prayer-times-calculation';

function usePrayerTimes(lat, lng, timezone = 5, method = 'Karachi') {
  const [times, setTimes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      setLoading(true);
      setError(null);

      const sdk = new PrayerTimesSDK(lat, lng, new Date(), timezone, {
        method: method
      });

      setTimes(sdk.getTimes());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [lat, lng, timezone, method]);

  return { times, loading, error };
}

// استعمال
function PrayerTimesComponent() {
  const { times, loading, error } = usePrayerTimes(24.8607, 67.0011);

  if (loading) return <div>نماز کے اوقات لوڈ ہو رہے ہیں...</div>;
  if (error) return <div>خرابی: {error}</div>;

  return (
    <div>
      <h2>آج کے نماز کے اوقات</h2>
      <ul>
        <li>فجر: {times.fajr}</li>
        <li>ظہر: {times.dhuhr}</li>
        <li>عصر: {times.asr}</li>
        <li>مغرب: {times.maghrib}</li>
        <li>عشاء: {times.isha}</li>
      </ul>
    </div>
  );
}
```

## Performance Tips

### Caching Results

```typescript
class PrayerTimesCache {
  private cache = new Map();

  getTimes(lat, lng, date, tz, options) {
    const key = `${lat}-${lng}-${date.toDateString()}-${tz}-${JSON.stringify(options)}`;

    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    const sdk = new PrayerTimesSDK(lat, lng, date, tz, options);
    const times = sdk.getTimes();

    this.cache.set(key, times);
    return times;
  }
}
```

### Batch Calculations

```typescript
function calculateMonthlyTimes(lat, lng, year, month, tz, options) {
  const times = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const sdk = new PrayerTimesSDK(lat, lng, date, tz, options);
    times.push({
      date: date.toDateString(),
      times: sdk.getTimes()
    });
  }

  return times;
}
```

## یہ بھی دیکھیں

- [Main README](../../README.ur.md)
- [Examples](../../examples/ur/)
- [Contributing Guide](../../CONTRIBUTING.ur.md)