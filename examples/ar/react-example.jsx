import React, { useState, useEffect } from 'react';
import { PrayerTimesSDK } from 'prayer-times-calculation';

// مكون مواقيت الصلاة الرئيسي
const PrayerTimesApp = () => {
  const [location, setLocation] = useState({ lat: 24.7136, lng: 46.6753, timezone: 3 });
  const [options, setOptions] = useState({
    method: 'MWL',
    asrJurisdiction: 'Standard'
  });
  const [date, setDate] = useState(new Date());
  const [times, setTimes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // حساب مواقيت الصلاة عند تغيير المدخلات
  useEffect(() => {
    calculateTimes();
  }, [location, options, date]);

  const calculateTimes = () => {
    try {
      setLoading(true);
      setError(null);

      const sdk = new PrayerTimesSDK(
        location.lat,
        location.lng,
        date,
        location.timezone,
        options
      );

      const calculatedTimes = sdk.getTimes();
      setTimes(calculatedTimes);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('تحديد الموقع الجغرافي غير مدعوم في هذا المتصفح');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          timezone: -new Date().getTimezoneOffset() / 60
        });
        setLoading(false);
      },
      (err) => {
        setError('غير قادر على الحصول على الموقع: ' + err.message);
        setLoading(false);
      }
    );
  };

  return (
    <div className="prayer-times-app" dir="rtl">
      <Header />
      <LocationInput
        location={location}
        onLocationChange={setLocation}
        onGetCurrentLocation={getCurrentLocation}
      />
      <OptionsPanel options={options} onOptionsChange={setOptions} />
      <DateSelector date={date} onDateChange={setDate} />

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}
      {times && <PrayerTimesDisplay times={times} />}

      <MethodInfo currentMethod={options.method} />
    </div>
  );
};

// مكون الرأس
const Header = () => (
  <header className="header">
    <h1>🕌 حاسبة مواقيت الصلاة</h1>
    <p>مواقيت صلاة إسلامية دقيقة لأي موقع</p>
  </header>
);

// مكون إدخال الموقع
const LocationInput = ({ location, onLocationChange, onGetCurrentLocation }) => {
  const handleChange = (field, value) => {
    onLocationChange({
      ...location,
      [field]: parseFloat(value) || 0
    });
  };

  return (
    <div className="location-input">
      <h3>📍 الموقع</h3>
      <div className="input-group">
        <div className="input-field">
          <label>خط العرض:</label>
          <input
            type="number"
            step="any"
            value={location.lat}
            onChange={(e) => handleChange('lat', e.target.value)}
            placeholder="مثال: 24.7136"
          />
        </div>
        <div className="input-field">
          <label>خط الطول:</label>
          <input
            type="number"
            step="any"
            value={location.lng}
            onChange={(e) => handleChange('lng', e.target.value)}
            placeholder="مثال: 46.6753"
          />
        </div>
        <div className="input-field">
          <label>المنطقة الزمنية (إزاحة UTC):</label>
          <input
            type="number"
            step="any"
            value={location.timezone}
            onChange={(e) => handleChange('timezone', e.target.value)}
            placeholder="مثال: 3"
          />
        </div>
      </div>
      <button onClick={onGetCurrentLocation} className="location-btn">
        🎯 استخدم موقعي الحالي
      </button>
    </div>
  );
};

// مكون لوحة الخيارات
const OptionsPanel = ({ options, onOptionsChange }) => {
  const [showCustomAngles, setShowCustomAngles] = useState(false);

  const handleMethodChange = (method) => {
    setShowCustomAngles(method === 'Custom');
    onOptionsChange({
      ...options,
      method,
      ...(method !== 'Custom' && { fajrAngle: undefined, ishaAngle: undefined })
    });
  };

  return (
    <div className="options-panel">
      <h3>⚙️ خيارات الحساب</h3>

      <div className="input-field">
        <label>طريقة الحساب:</label>
        <select
          value={options.method}
          onChange={(e) => handleMethodChange(e.target.value)}
        >
          <option value="MWL">رابطة العالم الإسلامي (MWL)</option>
          <option value="ISNA">الجمعية الإسلامية لأمريكا الشمالية (ISNA)</option>
          <option value="Egypt">الهيئة المصرية العامة للمساحة</option>
          <option value="Makkah">جامعة أم القرى (مكة)</option>
          <option value="Karachi">جامعة العلوم الإسلامية (كراتشي)</option>
          <option value="Custom">زوايا مخصصة</option>
        </select>
      </div>

      {showCustomAngles && (
        <div className="custom-angles">
          <div className="input-field">
            <label>زاوية الفجر (بالدرجات):</label>
            <input
              type="number"
              step="any"
              value={options.fajrAngle || ''}
              onChange={(e) => onOptionsChange({
                ...options,
                fajrAngle: parseFloat(e.target.value)
              })}
              placeholder="مثال: 18"
            />
          </div>
          <div className="input-field">
            <label>زاوية العشاء (بالدرجات):</label>
            <input
              type="number"
              step="any"
              value={options.ishaAngle || ''}
              onChange={(e) => onOptionsChange({
                ...options,
                ishaAngle: parseFloat(e.target.value)
              })}
              placeholder="مثال: 17"
            />
          </div>
        </div>
      )}

      <div className="input-field">
        <label>حساب العصر:</label>
        <select
          value={options.asrJurisdiction}
          onChange={(e) => onOptionsChange({
            ...options,
            asrJurisdiction: e.target.value
          })}
        >
          <option value="Standard">العادي (الشافعي/المالكي/الحنبلي)</option>
          <option value="Hanafi">الحنفي</option>
        </select>
      </div>
    </div>
  );
};

// مكون اختيار التاريخ
const DateSelector = ({ date, onDateChange }) => (
  <div className="date-selector">
    <h3>📅 التاريخ</h3>
    <input
      type="date"
      value={date.toISOString().split('T')[0]}
      onChange={(e) => onDateChange(new Date(e.target.value))}
    />
  </div>
);

// مكون عرض مواقيت الصلاة
const PrayerTimesDisplay = ({ times }) => {
  const prayerInfo = [
    { key: 'fajr', name: 'الفجر', description: 'صلاة الفجر', icon: '🌅' },
    { key: 'sunrise', name: 'الشروق', description: 'شروق الشمس', icon: '☀️' },
    { key: 'dhuhr', name: 'الظهر', description: 'صلاة الظهر', icon: '🌞' },
    { key: 'asr', name: 'العصر', description: 'صلاة العصر', icon: '🌤️' },
    { key: 'maghrib', name: 'المغرب', description: 'صلاة المغرب', icon: '🌅' },
    { key: 'isha', name: 'العشاء', description: 'صلاة العشاء', icon: '🌙' }
  ];

  return (
    <div className="prayer-times-display">
      <h3>🕐 مواقيت الصلاة</h3>
      <div className="times-grid">
        {prayerInfo.map(prayer => (
          <div key={prayer.key} className="time-card">
            <div className="prayer-icon">{prayer.icon}</div>
            <div className="prayer-name">{prayer.name}</div>
            <div className="prayer-time">{times[prayer.key]}</div>
            <div className="prayer-description">{prayer.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// مكون معلومات الطريقة
const MethodInfo = ({ currentMethod }) => {
  const methodDetails = {
    MWL: { org: 'رابطة العالم الإسلامي', fajr: '18°', isha: '17°' },
    ISNA: { org: 'الجمعية الإسلامية لأمريكا الشمالية', fajr: '15°', isha: '15°' },
    Egypt: { org: 'الهيئة المصرية العامة للمساحة', fajr: '19.5°', isha: '17.5°' },
    Makkah: { org: 'جامعة أم القرى', fajr: '18.5°', isha: '18.5°' },
    Karachi: { org: 'جامعة العلوم الإسلامية', fajr: '18°', isha: '18°' },
    Custom: { org: 'إعداد مخصص', fajr: 'مخصص', isha: 'مخصص' }
  };

  const details = methodDetails[currentMethod];

  return (
    <div className="method-info">
      <h4>📖 الطريقة الحالية: {currentMethod}</h4>
      <p><strong>المنظمة:</strong> {details.org}</p>
      <p><strong>زاوية الفجر:</strong> {details.fajr} | <strong>زاوية العشاء:</strong> {details.isha}</p>
    </div>
  );
};

// مكون مؤشر التحميل
const LoadingSpinner = () => (
  <div className="loading">
    <div className="spinner"></div>
    <p>جاري حساب مواقيت الصلاة...</p>
  </div>
);

// مكون رسالة الخطأ
const ErrorMessage = ({ message }) => (
  <div className="error-message">
    <p>❌ {message}</p>
  </div>
);

// خطاف مخصص لمواقيت الصلاة
export const usePrayerTimes = (latitude, longitude, timezone, options, date) => {
  const [times, setTimes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!latitude || !longitude || !timezone) return;

    setLoading(true);
    setError(null);

    try {
      const sdk = new PrayerTimesSDK(latitude, longitude, date, timezone, options);
      const calculatedTimes = sdk.getTimes();
      setTimes(calculatedTimes);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [latitude, longitude, timezone, options, date]);

  return { times, loading, error };
};

// مكون بديل أبسط باستخدام الخطاف المخصص
export const SimplePrayerTimes = ({ location, options }) => {
  const { times, loading, error } = usePrayerTimes(
    location.lat,
    location.lng,
    location.timezone,
    options,
    new Date()
  );

  if (loading) return <div>جاري التحميل...</div>;
  if (error) return <div>خطأ: {error}</div>;
  if (!times) return <div>لا توجد بيانات</div>;

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

// أنماط CSS-in-JS (يمكنك أيضاً استخدام ملف CSS منفصل)
const styles = `
.prayer-times-app {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  direction: rtl;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h1 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.location-input, .options-panel, .date-selector {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.input-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.input-field {
  margin-bottom: 15px;
}

.input-field label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #34495e;
}

.input-field input, .input-field select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  text-align: right;
}

.location-btn {
  background: #3498db;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
}

.location-btn:hover {
  background: #2980b9;
}

.times-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.time-card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  border: 2px solid #ecf0f1;
}

.time-card:hover {
  border-color: #3498db;
  transform: translateY(-2px);
  transition: all 0.3s ease;
}

.prayer-icon {
  font-size: 30px;
  margin-bottom: 10px;
}

.prayer-name {
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 5px;
}

.prayer-time {
  font-size: 24px;
  color: #e74c3c;
  font-weight: bold;
  margin-bottom: 5px;
}

.prayer-description {
  font-size: 12px;
  color: #7f8c8d;
}

.method-info {
  background: #e8f5e8;
  padding: 15px;
  border-radius: 5px;
  margin-top: 20px;
}

.loading {
  text-align: center;
  padding: 40px;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  background: #fee;
  border: 1px solid #fcc;
  padding: 15px;
  border-radius: 5px;
  color: #c33;
  margin: 20px 0;
}

.custom-angles {
  background: #fff3cd;
  padding: 15px;
  border-radius: 5px;
  margin-top: 15px;
}
`;

// إضافة الأنماط للمستند (في تطبيق حقيقي، ستستخدم CSS modules أو styled-components)
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default PrayerTimesApp;