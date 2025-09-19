# 🕌 نماز کے اوقات کیلکولیٹر SDK

[![npm version](https://badge.fury.io/js/prayer-times-calculation.svg)](https://badge.fury.io/js/prayer-times-calculation)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![Test Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)](https://github.com/your-username/prayer-times-calculation)

ایک ہلکا پھلکا، تیز اور درست TypeScript library نماز کے اوقات کا حساب لگانے کے لیے۔ بغیر انٹرنیٹ کنکشن کے کام کرتا ہے اور کوئی external dependencies نہیں ہے۔

## ✨ خصوصیات

- 🚀 **تیز**: <10ms میں تمام نماز کے اوقات
- 📦 **ہلکا**: <50KB package سائز
- 🎯 **درست**: ±1 منٹ کی درستگی
- 🌐 **آف لائن**: کوئی انٹرنیٹ کی ضرورت نہیں
- 🔧 **Zero Dependencies**: کوئی external libraries نہیں
- 📱 **Cross-platform**: تمام JavaScript environments میں کام کرتا ہے
- 🕌 **اسلامی طریقے**: متعدد معتبر calculation methods
- 🌍 **عالمی**: دنیا بھر کے کسی بھی مقام کے لیے

## 🕐 نماز کے اوقات

- **فجر** - صبح کی نماز
- **طلوع آفتاب** - سورج کا طلوع
- **ظہر** - دوپہر کی نماز
- **عصر** - بعد دوپہر کی نماز
- **مغرب** - شام کی نماز
- **عشاء** - رات کی نماز

## 📋 فہرست

- [انسٹالیشن](#انسٹالیشن)
- [استعمال](#استعمال)
- [Calculation Methods](#calculation-methods)
- [API Reference](#api-reference)
- [مثالیں](#مثالیں)
- [Performance](#performance)
- [Contributing](#contributing)
- [License](#license)

## 📦 انسٹالیشن

```bash
npm install prayer-times-calculation
```

```bash
yarn add prayer-times-calculation
```

```bash
pnpm add prayer-times-calculation
```

## 🚀 استعمال

### بنیادی استعمال

```typescript
import { PrayerTimesSDK } from 'prayer-times-calculation';

// کراچی، پاکستان کے لیے
const sdk = new PrayerTimesSDK(
  24.8607,  // latitude (خط عرض)
  67.0011,  // longitude (خط طول)
  new Date(), // تاریخ
  5,        // timezone (UTC+5)
  {
    method: 'Karachi',
    asrJurisdiction: 'Standard'
  }
);

const times = sdk.getTimes();
console.log(times);
```

**نتیجہ:**
```javascript
{
  fajr: "05:30",
  sunrise: "06:45",
  dhuhr: "12:15",
  asr: "15:30",
  maghrib: "18:00",
  isha: "19:30"
}
```

### مختلف شہروں کی مثالیں

```typescript
// اسلام آباد، پاکستان
const islamabadSDK = new PrayerTimesSDK(33.6844, 73.0479, new Date(), 5, {
  method: 'Karachi'
});

// لاہور، پاکستان
const lahoreSDK = new PrayerTimesSDK(31.5497, 74.3436, new Date(), 5, {
  method: 'Karachi'
});

// کوئٹہ، پاکستان
const quettaSDK = new PrayerTimesSDK(30.1798, 66.9750, new Date(), 5, {
  method: 'Karachi'
});
```

## 🕌 Calculation Methods

| Method | تفصیل | استعمال |
|--------|---------|---------|
| **MWL** | Muslim World League (رابطہ عالم اسلامی) | عالمی استعمال |
| **ISNA** | Islamic Society of North America | شمالی امریکہ |
| **Egypt** | Egyptian General Authority of Survey | مصر |
| **Makkah** | Umm Al-Qura University (جامعہ ام القریٰ) | سعودی عرب |
| **Karachi** | University of Islamic Sciences (جامعہ علوم اسلامیہ) | پاکستان، بنگلادیش، بھارت |
| **Custom** | آپ کے اپنے angles | خاص ضروریات |

### عصر کے طریقے

- **Standard** - شافعی، مالکی، حنبلی مذاہب
- **Hanafi** - حنفی مذہب (دیر سے عصر)

## 📚 API Reference

### `PrayerTimesSDK`

```typescript
constructor(
  latitude: number,     // خط عرض (-90 to 90)
  longitude: number,    // خط طول (-180 to 180)
  date: Date,          // تاریخ
  timezone: number,    // UTC سے فرق (hours میں)
  options: CalculationOptions
)
```

### `CalculationOptions`

```typescript
interface CalculationOptions {
  method: 'MWL' | 'ISNA' | 'Egypt' | 'Makkah' | 'Karachi' | 'Custom';
  asrJurisdiction?: 'Standard' | 'Hanafi';
  fajrAngle?: number;  // Custom method کے لیے
  ishaAngle?: number;  // Custom method کے لیے
}
```

### Methods

#### `getTimes(): PrayerTimes`

تمام نماز کے اوقات واپس کرتا ہے۔

```typescript
interface PrayerTimes {
  fajr: string;     // فجر کا وقت
  sunrise: string;  // طلوع آفتاب
  dhuhr: string;    // ظہر کا وقت
  asr: string;      // عصر کا وقت
  maghrib: string;  // مغرب کا وقت
  isha: string;     // عشاء کا وقت
}
```

## 💻 مثالیں

### React Component

```jsx
import React, { useState, useEffect } from 'react';
import { PrayerTimesSDK } from 'prayer-times-calculation';

function PrayerTimesApp() {
  const [times, setTimes] = useState(null);
  const [location, setLocation] = useState({ lat: 24.8607, lng: 67.0011 });

  useEffect(() => {
    const sdk = new PrayerTimesSDK(
      location.lat,
      location.lng,
      new Date(),
      5,
      { method: 'Karachi' }
    );

    setTimes(sdk.getTimes());
  }, [location]);

  return (
    <div className="prayer-times" dir="rtl">
      <h1>آج کے نماز کے اوقات</h1>
      {times && (
        <div className="times-grid">
          <div className="time-card">
            <h3>فجر</h3>
            <span>{times.fajr}</span>
          </div>
          <div className="time-card">
            <h3>ظہر</h3>
            <span>{times.dhuhr}</span>
          </div>
          <div className="time-card">
            <h3>عصر</h3>
            <span>{times.asr}</span>
          </div>
          <div className="time-card">
            <h3>مغرب</h3>
            <span>{times.maghrib}</span>
          </div>
          <div className="time-card">
            <h3>عشاء</h3>
            <span>{times.isha}</span>
          </div>
        </div>
      )}
    </div>
  );
}
```

### Node.js Server

```javascript
const express = require('express');
const { PrayerTimesSDK } = require('prayer-times-calculation');

const app = express();

app.get('/prayer-times/:lat/:lng', (req, res) => {
  try {
    const { lat, lng } = req.params;
    const timezone = req.query.tz || 5;
    const method = req.query.method || 'Karachi';

    const sdk = new PrayerTimesSDK(
      parseFloat(lat),
      parseFloat(lng),
      new Date(),
      parseInt(timezone),
      { method }
    );

    const times = sdk.getTimes();
    res.json({ success: true, times });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.listen(3000, () => {
  console.log('نماز کے اوقات کا سرور port 3000 پر چل رہا ہے');
});
```

### Custom Angles کا استعمال

```typescript
const customSDK = new PrayerTimesSDK(
  24.8607, 67.0011, new Date(), 5,
  {
    method: 'Custom',
    fajrAngle: 18,  // فجر کے لیے 18 degrees
    ishaAngle: 17,  // عشاء کے لیے 17 degrees
    asrJurisdiction: 'Hanafi'
  }
);
```

## ⚡ Performance

- **رفتار**: تمام calculations <10ms میں
- **میموری**: <100KB RAM استعمال
- **سائز**: Package سائز <50KB
- **درستگی**: ±1 منٹ کی accuracy

## 🧪 Testing

```bash
npm test
npm run test:coverage
npm run test:watch
```

## 🌍 Supported Platforms

- ✅ Node.js (14+)
- ✅ تمام modern browsers
- ✅ React Native
- ✅ Electron
- ✅ Progressive Web Apps

## 📖 مزید وسائل

- [API Documentation](./docs/ur/API.md)
- [Examples](./examples/ur/)
- [Contributing Guide](./CONTRIBUTING.ur.md)
- [Code of Conduct](./CODE_OF_CONDUCT.ur.md)

## 🤝 Contributing

ہم community کی مدد کو خوش آمدید کہتے ہیں! براہ کرم [Contributing Guide](./CONTRIBUTING.ur.md) پڑھیں۔

## 📄 License

یہ project MIT License کے تحت ہے - [LICENSE](./LICENSE) فائل دیکھیں۔

## 🙏 تشکر

- اسلامی calculation methods کے لیے مختلف اسلامی اداروں کا شکریہ
- Astronomical algorithms کے لیے Jean Meeus کی کتاب
- Muslim ڈویلپرز کی community

## 📞 رابطہ

- GitHub Issues: [Bug Reports & Feature Requests](https://github.com/your-username/prayer-times-calculation/issues)
- Email: team@prayer-times-sdk.org

---

<div align="center">

**🕌 "اور نماز قائم کرو اور زکوٰۃ دو" - القرآن الکریم**

Made with ❤️ for Muslim developers worldwide

</div>