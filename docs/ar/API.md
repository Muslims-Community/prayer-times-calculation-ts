# مرجع الواجهة البرمجية

## جدول المحتويات
- [فئة PrayerTimesSDK](#فئة-prayertimessdk)
- [الأنواع](#الأنواع)
- [طرق الحساب](#طرق-الحساب)
- [الأدوات المساعدة](#الأدوات-المساعدة)
- [معالجة الأخطاء](#معالجة-الأخطاء)

## فئة PrayerTimesSDK

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

| المعامل | النوع | الوصف | النطاق |
|---------|------|-------|-------|
| `latitude` | `number` | خط العرض الجغرافي | -90 إلى 90 |
| `longitude` | `number` | خط الطول الجغرافي | -180 إلى 180 |
| `date` | `Date` | تاريخ الحساب (اختياري) | أي تاريخ صالح |
| `timezone` | `number` | الإزاحة من UTC بالساعات | -12 إلى 14 |
| `options` | `CalculationOptions` | كائن إعدادات الحساب | راجع أدناه |

#### مثال

```typescript
const sdk = new PrayerTimesSDK(
  24.7136,    // خط عرض الرياض
  46.6753,    // خط طول الرياض
  new Date(), // التاريخ الحالي
  3,          // UTC+3
  {
    method: 'MWL',
    asrJurisdiction: 'Standard'
  }
);
```

### الطرق

#### `getTimes(): PrayerTimes`

يحسب ويعيد مواقيت الصلاة كنصوص منسقة.

**العائد:** كائن `PrayerTimes` يحتوي على جميع مواقيت الصلاة كنصوص منسقة.

**مثال:**

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

## الأنواع

### CalculationOptions

```typescript
interface CalculationOptions {
  method: CalculationMethod;
  fajrAngle?: number;      // مطلوب عند method = 'Custom'
  ishaAngle?: number;      // مطلوب عند method = 'Custom'
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
  fajr: string;     // صلاة الفجر (بصيغة HH:mm)
  sunrise: string;  // وقت الشروق (بصيغة HH:mm)
  dhuhr: string;    // صلاة الظهر (بصيغة HH:mm)
  asr: string;      // صلاة العصر (بصيغة HH:mm)
  maghrib: string;  // صلاة المغرب (بصيغة HH:mm)
  isha: string;     // صلاة العشاء (بصيغة HH:mm)
}
```

### MethodAngles

```typescript
interface MethodAngles {
  fajr: number;     // زاوية الفجر بالدرجات
  isha: number;     // زاوية العشاء بالدرجات
}
```

## طرق الحساب

### الطرق المحددة مسبقاً

| الطريقة | المنظمة | زاوية الفجر | زاوية العشاء | الوصف |
|---------|-------------|------------|------------|-------------|
| `MWL` | رابطة العالم الإسلامي | 18° | 17° | الأكثر استخداماً على نطاق واسع |
| `ISNA` | الجمعية الإسلامية لأمريكا الشمالية | 15° | 15° | شائع في أمريكا الشمالية |
| `Egypt` | الهيئة المصرية العامة للمساحة | 19.5° | 17.5° | يُستخدم في مصر والمناطق المحيطة |
| `Makkah` | جامعة أم القرى | 18.5° | 18.5° | يُستخدم في السعودية |
| `Karachi` | جامعة العلوم الإسلامية | 18° | 18° | يُستخدم في باكستان والهند |

### الطريقة المخصصة

عند استخدام `method: 'Custom'`، يجب توفير `fajrAngle` و `ishaAngle`:

```typescript
const customOptions: CalculationOptions = {
  method: 'Custom',
  fajrAngle: 19.0,
  ishaAngle: 16.0,
  asrJurisdiction: 'Standard'
};
```

### مذاهب العصر

- **العادي** (الشافعي/المالكي/الحنبلي): وقت العصر عندما يساوي طول الظل طول الجسم
- **الحنفي**: وقت العصر عندما يساوي طول الظل ضعف طول الجسم

## الأدوات المساعدة

### `getMethodAngles(method, customFajr?, customIsha?): MethodAngles`

يعيد زاويتي الفجر والعشاء لطريقة حساب معينة.

```typescript
import { getMethodAngles } from 'prayer-times-calculation';

// الحصول على زوايا طريقة محددة مسبقاً
const mwlAngles = getMethodAngles('MWL');
console.log(mwlAngles); // { fajr: 18, isha: 17 }

// الحصول على زوايا مخصصة
const customAngles = getMethodAngles('Custom', 20, 16);
console.log(customAngles); // { fajr: 20, isha: 16 }
```

### ثابت `CALCULATION_METHODS`

كائن يحتوي على جميع طرق الحساب المحددة مسبقاً وزواياها.

```typescript
import { CALCULATION_METHODS } from 'prayer-times-calculation';

console.log(CALCULATION_METHODS.MWL); // { fajr: 18, isha: 17 }
console.log(CALCULATION_METHODS.ISNA); // { fajr: 15, isha: 15 }
```

## معالجة الأخطاء

### الأخطاء الشائعة

#### طريقة مخصصة غير صالحة

```typescript
// ❌ هذا سيؤدي إلى خطأ
const sdk = new PrayerTimesSDK(24.7136, 46.6753, new Date(), 3, {
  method: 'Custom',
  asrJurisdiction: 'Standard'
  // فقدان fajrAngle و ishaAngle
});

// ✅ الاستخدام الصحيح
const sdk = new PrayerTimesSDK(24.7136, 46.6753, new Date(), 3, {
  method: 'Custom',
  fajrAngle: 18,
  ishaAngle: 17,
  asrJurisdiction: 'Standard'
});
```

#### إحداثيات غير صالحة

```typescript
// ❌ خط عرض غير صالح (يجب أن يكون بين -90 و 90)
const sdk = new PrayerTimesSDK(95, 46.6753, new Date(), 3, options);

// ❌ خط طول غير صالح (يجب أن يكون بين -180 و 180)
const sdk = new PrayerTimesSDK(24.7136, 185, new Date(), 3, options);
```

### نتائج NaN

في المواقع القصوى (خطوط العرض العالية جداً) أو تواريخ معينة، قد لا يمكن حساب بعض مواقيت الصلاة. في هذه الحالات، تعيد المكتبة `"NaN:NaN"` لتلك الأوقات المحددة.

```typescript
const times = sdk.getTimes();
if (times.fajr === 'NaN:NaN') {
  console.log('وقت الفجر غير قابل للحساب لهذا الموقع/التاريخ');
}
```

## اعتبارات الأداء

- **وقت التنفيذ**: < 10 مللي ثانية على الأجهزة المتوسطة
- **استخدام الذاكرة**: < 100 كيلوبايت
- **استخدام المعالج**: الحد الأدنى، مناسب للحسابات المتكررة
- **أمان الخيوط**: كل نسخة من SDK مستقلة

## أمثلة حسب حالة الاستخدام

### تكامل تطبيق الجوال

```typescript
// الحصول على موقع المستخدم وحساب مواقيت الصلاة
navigator.geolocation.getCurrentPosition((position) => {
  const sdk = new PrayerTimesSDK(
    position.coords.latitude,
    position.coords.longitude,
    new Date(),
    -new Date().getTimezoneOffset() / 60, // كشف المنطقة الزمنية تلقائياً
    { method: 'MWL', asrJurisdiction: 'Standard' }
  );

  const times = sdk.getTimes();
  displayPrayerTimes(times);
});
```

### معالجة مجمعة من جانب الخادم

```typescript
// حساب مواقيت الصلاة لعدة مدن
const cities = [
  { name: 'الرياض', lat: 24.7136, lng: 46.6753, tz: 3 },
  { name: 'القاهرة', lat: 30.0444, lng: 31.2357, tz: 2 },
  { name: 'إسطنبول', lat: 41.0082, lng: 28.9784, tz: 3 }
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

### مكون React

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
```

## الأسئلة الشائعة

### س: كيف أعرف أي طريقة حساب أستخدم؟

ج: يعتمد الأمر على موقعك والسلطات الدينية المحلية:
- **MWL**: الأكثر استخداماً عالمياً، مقبول في معظم البلدان
- **ISNA**: شائع في أمريكا الشمالية
- **Egypt**: مُستخدم في مصر والمنطقة العربية
- **Makkah**: الطريقة الرسمية في السعودية
- **Karachi**: شائع في شبه القارة الهندية

### س: ما الفرق بين طرق حساب العصر؟

ج:
- **العادي**: يتبع المذاهب الشافعي والمالكي والحنبلي - العصر عند ظل = طول الجسم
- **الحنفي**: يتبع المذهب الحنفي - العصر عند ظل = ضعف طول الجسم

### س: هل يمكنني الوثوق بدقة الحسابات؟

ج: نعم، الحسابات دقيقة ضمن هامش ±1 دقيقة ومُختبرة مقابل مصادر رسمية. تستخدم المكتبة:
- معادلات فلكية معيارية
- حسابات ميل الشمس ومعادلة الوقت الدقيقة
- تصحيحات للإحداثيات الجغرافية
- معايير مقبولة من السلطات الإسلامية

### س: ماذا يحدث في المناطق القطبية؟

ج: في المناطق ذات خطوط العرض العالية جداً، قد لا يمكن حساب بعض الصلوات (خاصة الفجر والعشاء) في أوقات معينة من السنة. في هذه الحالات، تعيد المكتبة `"NaN:NaN"` وعليك استخدام طرق بديلة مثل:
- استخدام أقرب مكان يمكن حساب الصلاة فيه
- الاعتماد على السلطات الدينية المحلية
- استخدام جداول زمنية محددة للمنطقة

### س: كيف أتعامل مع التوقيت الصيفي؟

ج: يجب تحديث قيمة `timezone` عند تغيير التوقيت الصيفي:

```typescript
// التوقيت العادي (UTC+3)
const winterSdk = new PrayerTimesSDK(lat, lng, winterDate, 3, options);

// التوقيت الصيفي (UTC+4)
const summerSdk = new PrayerTimesSDK(lat, lng, summerDate, 4, options);
```

### س: هل المكتبة تدعم التقويم الهجري؟

ج: لا، المكتبة تركز على حساب مواقيت الصلاة فقط وتستخدم التقويم الميلادي. لكن يمكنك استخدام مكتبات أخرى لتحويل التواريخ الهجرية إلى ميلادية ثم استخدام هذه المكتبة:

```typescript
// مثال باستخدام مكتبة تحويل التواريخ الهجرية
const hijriDate = new HijriDate(1445, 5, 15); // مثال
const gregorianDate = hijriDate.toGregorian();

const sdk = new PrayerTimesSDK(lat, lng, gregorianDate, timezone, options);
```