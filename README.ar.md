# مكتبة حساب مواقيت الصلاة

مكتبة TypeScript بسيطة وخفيفة لحساب مواقيت الصلاة الإسلامية بدون الحاجة لاتصال بالإنترنت.

## الميزات

- ✅ **بدون اعتماديات خارجية**: لا تحتاج لأي مكتبات خارجية
- ✅ **يعمل بدون إنترنت**: يعمل بالكامل بدون اتصال بالإنترنت
- ✅ **سريع**: العمليات الحسابية تكتمل في أقل من 10 مللي ثانية
- ✅ **خفيف**: حجم الحزمة أقل من 50 كيلوبايت
- ✅ **دقيق**: دقة ±1 دقيقة مقارنة بالمصادر الرسمية
- ✅ **مرن**: يدعم طرق حساب متعددة وزوايا مخصصة
- ✅ **دعم TypeScript**: دعم كامل لـ TypeScript مع تعريفات الأنواع

## التثبيت

```bash
npm install prayer-times-calculation
```

## البداية السريعة

```typescript
import { PrayerTimesSDK } from 'prayer-times-calculation';

// إحداثيات الرياض
const latitude = 24.7136;
const longitude = 46.6753;
const timezone = 3; // UTC+3
const date = new Date(); // التاريخ الحالي

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

## مرجع الواجهة البرمجية

### الكونستركتر

```typescript
new PrayerTimesSDK(
  latitude: number,
  longitude: number,
  date: Date = new Date(),
  timezone: number,
  options: CalculationOptions
)
```

#### المعاملات

- `latitude`: خط العرض الجغرافي (-90 إلى 90)
- `longitude`: خط الطول الجغرافي (-180 إلى 180)
- `date`: تاريخ الحساب (اختياري، افتراضياً التاريخ الحالي)
- `timezone`: الإزاحة من UTC بالساعات (مثال: 3 لـ UTC+3, -5 لـ UTC-5)
- `options`: كائن إعدادات الحساب

### CalculationOptions

```typescript
interface CalculationOptions {
  method: 'MWL' | 'ISNA' | 'Egypt' | 'Makkah' | 'Karachi' | 'Custom';
  fajrAngle?: number;      // مطلوب عند استخدام method = 'Custom'
  ishaAngle?: number;      // مطلوب عند استخدام method = 'Custom'
  asrJurisdiction: 'Standard' | 'Hanafi';
}
```

### الطرق

#### `getTimes(): PrayerTimes`

يحسب ويعيد مواقيت الصلاة كنصوص منسقة (HH:mm).

```typescript
interface PrayerTimes {
  fajr: string;     // صلاة الفجر
  sunrise: string;  // وقت الشروق
  dhuhr: string;    // صلاة الظهر
  asr: string;      // صلاة العصر
  maghrib: string;  // صلاة المغرب
  isha: string;     // صلاة العشاء
}
```

## طرق الحساب

| الطريقة | زاوية الفجر | زاوية العشاء | الوصف |
|---------|------------|------------|-------------|
| MWL | 18° | 17° | رابطة العالم الإسلامي |
| ISNA | 15° | 15° | الجمعية الإسلامية لأمريكا الشمالية |
| Egypt | 19.5° | 17.5° | الهيئة المصرية العامة للمساحة |
| Makkah | 18.5° | 18.5° | جامعة أم القرى |
| Karachi | 18° | 18° | جامعة العلوم الإسلامية، كراتشي |
| Custom | مخصص | مخصص | زوايا محددة من المستخدم |

## حساب العصر

- **العادي** (الشافعي/المالكي/الحنبلي): طول الظل = طول الجسم
- **الحنفي**: طول الظل = 2 × طول الجسم

## أمثلة

### طرق حساب مختلفة

```typescript
// طريقة رابطة العالم الإسلامي
const mwl = new PrayerTimesSDK(24.7136, 46.6753, new Date(), 3, {
  method: 'MWL',
  asrJurisdiction: 'Standard'
});

// طريقة الجمعية الإسلامية لأمريكا الشمالية
const isna = new PrayerTimesSDK(40.7128, -74.0060, new Date(), -5, {
  method: 'ISNA',
  asrJurisdiction: 'Standard'
});

// زوايا مخصصة
const custom = new PrayerTimesSDK(51.5074, -0.1278, new Date(), 0, {
  method: 'Custom',
  fajrAngle: 18,
  ishaAngle: 16,
  asrJurisdiction: 'Hanafi'
});
```

### مواقع مختلفة

```typescript
// نيويورك
const nyTimes = new PrayerTimesSDK(40.7128, -74.0060, new Date(), -5, {
  method: 'ISNA',
  asrJurisdiction: 'Standard'
});

// لندن
const londonTimes = new PrayerTimesSDK(51.5074, -0.1278, new Date(), 0, {
  method: 'MWL',
  asrJurisdiction: 'Standard'
});

// طوكيو
const tokyoTimes = new PrayerTimesSDK(35.6762, 139.6503, new Date(), 9, {
  method: 'MWL',
  asrJurisdiction: 'Standard'
});
```

### حساب لتاريخ محدد

```typescript
// حساب لتاريخ محدد
const specificDate = new Date('2023-12-25');
const prayerTimes = new PrayerTimesSDK(24.7136, 46.6753, specificDate, 3, {
  method: 'MWL',
  asrJurisdiction: 'Standard'
});
```

## الأداء

المكتبة مصممة للأداء العالي:
- وقت التنفيذ: <10 مللي ثانية على الأجهزة المتوسطة
- استخدام الذاكرة: <100 كيلوبايت
- حجم الحزمة: <50 كيلوبايت (غير مضغوط)

## الدقة

مواقيت الصلاة محسوبة بدقة ±1 دقيقة مقارنة بالسلطات الإسلامية الرسمية. الحسابات تستخدم:
- معادلات فلكية معيارية
- ميل الشمس الصحيح ومعادلة الوقت
- تصحيحات الإحداثيات الجغرافية
- تعديلات المناطق الزمنية

## دعم المتصفحات

يعمل في جميع المتصفحات الحديثة وبيئات Node.js:
- Chrome/Edge 88+
- Firefox 78+
- Safari 14+
- Node.js 14+

## الترخيص

ترخيص MIT - راجع ملف [LICENSE](LICENSE) للتفاصيل.

## المساهمة

المساهمات مرحب بها! يرجى مراجعة [دليل المساهمة](CONTRIBUTING.ar.md) للحصول على التفاصيل.

## الدعم

للمشاكل والاستفسارات، يرجى زيارة [مستودع GitHub](https://github.com/your-username/prayer-times-calculation) الخاص بنا.

## أمثلة إضافية

### تطبيق ويب بسيط

```html
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <title>مواقيت الصلاة</title>
</head>
<body>
    <div id="prayer-times"></div>

    <script type="module">
        import { PrayerTimesSDK } from 'prayer-times-calculation';

        // الحصول على موقع المستخدم
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            const timezone = -new Date().getTimezoneOffset() / 60;

            const sdk = new PrayerTimesSDK(latitude, longitude, new Date(), timezone, {
                method: 'MWL',
                asrJurisdiction: 'Standard'
            });

            const times = sdk.getTimes();

            document.getElementById('prayer-times').innerHTML = `
                <h2>مواقيت الصلاة لليوم</h2>
                <ul>
                    <li>الفجر: ${times.fajr}</li>
                    <li>الشروق: ${times.sunrise}</li>
                    <li>الظهر: ${times.dhuhr}</li>
                    <li>العصر: ${times.asr}</li>
                    <li>المغرب: ${times.maghrib}</li>
                    <li>العشاء: ${times.isha}</li>
                </ul>
            `;
        });
    </script>
</body>
</html>
```

### مكون React

```typescript
import React, { useState, useEffect } from 'react';
import { PrayerTimesSDK, PrayerTimes } from 'prayer-times-calculation';

const PrayerTimesComponent: React.FC = () => {
  const [times, setTimes] = useState<PrayerTimes | null>(null);

  useEffect(() => {
    // الحصول على موقع المستخدم
    navigator.geolocation.getCurrentPosition(position => {
      const sdk = new PrayerTimesSDK(
        position.coords.latitude,
        position.coords.longitude,
        new Date(),
        -new Date().getTimezoneOffset() / 60,
        {
          method: 'MWL',
          asrJurisdiction: 'Standard'
        }
      );

      setTimes(sdk.getTimes());
    });
  }, []);

  if (!times) return <div>جاري التحميل...</div>;

  return (
    <div dir="rtl">
      <h2>مواقيت الصلاة</h2>
      <ul>
        <li>الفجر: {times.fajr}</li>
        <li>الشروق: {times.sunrise}</li>
        <li>الظهر: {times.dhuhr}</li>
        <li>العصر: {times.asr}</li>
        <li>المغرب: {times.maghrib}</li>
        <li>العشاء: {times.isha}</li>
      </ul>
    </div>
  );
};

export default PrayerTimesComponent;
```

### خادم Node.js

```javascript
const express = require('express');
const { PrayerTimesSDK } = require('prayer-times-calculation');

const app = express();

app.get('/api/prayer-times', (req, res) => {
  const { lat, lng, timezone } = req.query;

  try {
    const sdk = new PrayerTimesSDK(
      parseFloat(lat),
      parseFloat(lng),
      new Date(),
      parseFloat(timezone),
      {
        method: 'MWL',
        asrJurisdiction: 'Standard'
      }
    );

    const times = sdk.getTimes();
    res.json({ times });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('خادم مواقيت الصلاة يعمل على المنفذ 3000');
});
```

## معالجة الأخطاء

```typescript
try {
  const sdk = new PrayerTimesSDK(latitude, longitude, date, timezone, options);
  const times = sdk.getTimes();
  console.log('مواقيت الصلاة:', times);
} catch (error) {
  if (error.message.includes('latitude')) {
    console.error('خطأ في خط العرض: يجب أن يكون بين -90 و 90');
  } else if (error.message.includes('longitude')) {
    console.error('خطأ في خط الطول: يجب أن يكون بين -180 و 180');
  } else if (error.message.includes('Custom method')) {
    console.error('الطريقة المخصصة تتطلب تحديد زاويتي الفجر والعشاء');
  } else {
    console.error('خطأ في الحساب:', error.message);
  }
}
```

## الأسئلة الشائعة

### س: كيف أختار طريقة الحساب المناسبة؟

ج: يعتمد ذلك على موقعك الجغرافي والسلطات الدينية المحلية:
- **MWL**: الأكثر استخداماً عالمياً
- **ISNA**: شائع في أمريكا الشمالية
- **Egypt**: يُستخدم في مصر والمنطقة المحيطة
- **Makkah**: يُستخدم في السعودية
- **Karachi**: يُستخدم في باكستان والهند

### س: ما الفرق بين العصر العادي والحنفي؟

ج:
- **العادي** (الشافعي/المالكي/الحنبلي): وقت العصر عندما يصبح ظل الجسم مساوياً لطوله
- **الحنفي**: وقت العصر عندما يصبح ظل الجسم مساوياً لضعف طوله

### س: هل المكتبة دقيقة؟

ج: نعم، المكتبة دقيقة ضمن هامش ±1 دقيقة مقارنة بالمصادر الرسمية. تستخدم معادلات فلكية معيارية ومقبولة من السلطات الإسلامية.

---

**ملاحظة**: هذه المكتبة تنفذ حسابات مبنية على مبادئ فلكية إسلامية راسخة ومنهجيات مقبولة من المنظمات الإسلامية الكبرى حول العالم.