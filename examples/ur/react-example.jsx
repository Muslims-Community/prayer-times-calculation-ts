import React, { useState, useEffect, useCallback } from 'react';
import './PrayerTimesApp.css'; // CSS فائل کا نام

// Prayer Times SDK کا import - حقیقی استعمال میں
// import { PrayerTimesSDK } from 'prayer-times-calculation';

// محاکاۃ کے لیے SDK (development کے دوران)
class PrayerTimesSDK {
  constructor(lat, lng, date, timezone, options) {
    this.lat = lat;
    this.lng = lng;
    this.date = date;
    this.timezone = timezone;
    this.options = options;
  }

  getTimes() {
    // یہ صرف مثال کے لیے ہے - حقیقی SDK اصل حسابات کرے گا
    return {
      fajr: "05:30",
      sunrise: "06:45",
      dhuhr: "12:15",
      asr: "15:30",
      maghrib: "18:00",
      isha: "19:30"
    };
  }
}

/**
 * نماز کے اوقات کا React Component
 */
function PrayerTimesApp() {
  // State variables
  const [times, setTimes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // فارم کی ڈیٹا
  const [location, setLocation] = useState({
    latitude: 24.8607,
    longitude: 67.0011,
    city: 'کراچی',
    timezone: 5
  });

  const [settings, setSettings] = useState({
    method: 'Karachi',
    asrJurisdiction: 'Standard',
    date: new Date().toISOString().split('T')[0]
  });

  // پاکستان کے مشہور شہر
  const pakistaniCities = [
    { name: 'کراچی', lat: 24.8607, lng: 67.0011, tz: 5 },
    { name: 'لاہور', lat: 31.5497, lng: 74.3436, tz: 5 },
    { name: 'اسلام آباد', lat: 33.6844, lng: 73.0479, tz: 5 },
    { name: 'راولپنڈی', lat: 33.5651, lng: 73.0169, tz: 5 },
    { name: 'فیصل آباد', lat: 31.4504, lng: 73.1350, tz: 5 },
    { name: 'ملتان', lat: 30.1575, lng: 71.5249, tz: 5 },
    { name: 'پشاور', lat: 34.0151, lng: 71.5249, tz: 5 },
    { name: 'کوئٹہ', lat: 30.1798, lng: 66.9750, tz: 5 },
    { name: 'حیدرآباد', lat: 25.3960, lng: 68.3578, tz: 5 },
    { name: 'گجرانوالہ', lat: 32.1877, lng: 74.1945, tz: 5 }
  ];

  // Calculation methods کی اردو میں فہرست
  const calculationMethods = {
    'Karachi': 'جامعہ علوم اسلامیہ (کراچی)',
    'MWL': 'رابطہ عالم اسلامی (MWL)',
    'ISNA': 'اسلامک سوسائٹی آف نارتھ امریکا',
    'Egypt': 'مصری عام سروے اتھارٹی',
    'Makkah': 'جامعہ ام القریٰ (مکہ مکرمہ)',
    'Custom': 'اپنے زاویے (Custom)'
  };

  // نماز کے ناموں کی اردو میں فہرست
  const prayerNames = {
    fajr: 'فجر',
    sunrise: 'طلوع آفتاب',
    dhuhr: 'ظہر',
    asr: 'عصر',
    maghrib: 'مغرب',
    isha: 'عشاء'
  };

  // موجودہ وقت کو update کرنے کے لیے
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // نماز کے اوقات calculate کرنے کا function
  const calculatePrayerTimes = useCallback(() => {
    try {
      setLoading(true);
      setError(null);

      // Input validation
      if (!location.latitude || !location.longitude) {
        throw new Error('براہ کرم خط عرض اور خط طول درج کریں');
      }

      if (location.latitude < -90 || location.latitude > 90) {
        throw new Error('خط عرض -90 سے 90 کے درمیان ہونا چاہیے');
      }

      if (location.longitude < -180 || location.longitude > 180) {
        throw new Error('خط طول -180 سے 180 کے درمیان ہونا چاہیے');
      }

      // SDK instance بنانا
      const sdk = new PrayerTimesSDK(
        parseFloat(location.latitude),
        parseFloat(location.longitude),
        new Date(settings.date),
        location.timezone,
        {
          method: settings.method,
          asrJurisdiction: settings.asrJurisdiction
        }
      );

      // اوقات calculate کرنا
      const calculatedTimes = sdk.getTimes();
      setTimes(calculatedTimes);

    } catch (err) {
      setError(err.message);
      setTimes(null);
    } finally {
      setLoading(false);
    }
  }, [location, settings]);

  // Page load ہونے پر اوقات calculate کرنا
  useEffect(() => {
    calculatePrayerTimes();
  }, [calculatePrayerTimes]);

  // شہر select کرنے کا function
  const selectCity = (city) => {
    setLocation({
      latitude: city.lat,
      longitude: city.lng,
      city: city.name,
      timezone: city.tz
    });
  };

  // موجودہ location حاصل کرنا
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6),
            city: 'آپ کی موجودہ لوکیشن',
            timezone: -new Date().getTimezoneOffset() / 60
          });
          setLoading(false);
        },
        (error) => {
          setError('لوکیشن حاصل کرنے میں خرابی: ' + error.message);
          setLoading(false);
        }
      );
    } else {
      setError('آپ کا براؤزر جغرافیائی لوکیشن کو سپورٹ نہیں کرتا');
    }
  };

  // وقت کو اردو format میں تبدیل کرنا
  const formatUrduTime = (time24) => {
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'شام' : 'صبح';
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  // موجودہ وقت کو اردو میں format کرنا
  const formatCurrentTime = (date) => {
    return date.toLocaleString('ur-PK', {
      timeZone: 'Asia/Karachi',
      hour12: true,
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="prayer-times-app" dir="rtl">
      <div className="container">
        {/* Header */}
        <header className="app-header">
          <h1>🕌 نماز کے اوقات کیلکولیٹر</h1>
          <div className="islamic-quote">
            "اور نماز قائم کرو اور زکوٰۃ دو" - القرآن الکریم
          </div>
          <div className="current-time">
            موجودہ وقت: {formatCurrentTime(currentTime)}
          </div>
        </header>

        {/* شہروں کے buttons */}
        <section className="cities-section">
          <h3>🏙️ پاکستانی شہر</h3>
          <div className="cities-grid">
            {pakistaniCities.map((city, index) => (
              <button
                key={index}
                className={`city-btn ${location.city === city.name ? 'active' : ''}`}
                onClick={() => selectCity(city)}
              >
                {city.name}
              </button>
            ))}
          </div>
        </section>

        {/* Location settings */}
        <section className="location-section">
          <h3>📍 لوکیشن کی تفصیلات</h3>

          <div className="form-group">
            <label>شہر:</label>
            <input
              type="text"
              value={location.city}
              onChange={(e) => setLocation({...location, city: e.target.value})}
              placeholder="شہر کا نام"
            />
          </div>

          <div className="coordinates-group">
            <div className="form-group">
              <label>خط عرض (Latitude):</label>
              <input
                type="number"
                step="any"
                value={location.latitude}
                onChange={(e) => setLocation({...location, latitude: e.target.value})}
                placeholder="24.8607"
              />
            </div>
            <div className="form-group">
              <label>خط طول (Longitude):</label>
              <input
                type="number"
                step="any"
                value={location.longitude}
                onChange={(e) => setLocation({...location, longitude: e.target.value})}
                placeholder="67.0011"
              />
            </div>
          </div>

          <div className="form-group">
            <label>ٹائم زون (UTC سے فرق):</label>
            <input
              type="number"
              value={location.timezone}
              onChange={(e) => setLocation({...location, timezone: parseInt(e.target.value)})}
              placeholder="5"
            />
          </div>

          <button className="location-btn" onClick={getCurrentLocation}>
            📱 میری موجودہ لوکیشن استعمال کریں
          </button>
        </section>

        {/* Calculation settings */}
        <section className="settings-section">
          <h3>⚙️ حساب کتاب کی ترتیبات</h3>

          <div className="form-group">
            <label>حساب کتاب کا طریقہ:</label>
            <select
              value={settings.method}
              onChange={(e) => setSettings({...settings, method: e.target.value})}
            >
              {Object.entries(calculationMethods).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>عصر کا طریقہ:</label>
            <select
              value={settings.asrJurisdiction}
              onChange={(e) => setSettings({...settings, asrJurisdiction: e.target.value})}
            >
              <option value="Standard">عام طریقہ (شافعی/مالکی/حنبلی)</option>
              <option value="Hanafi">حنفی طریقہ</option>
            </select>
          </div>

          <div className="form-group">
            <label>تاریخ:</label>
            <input
              type="date"
              value={settings.date}
              onChange={(e) => setSettings({...settings, date: e.target.value})}
            />
          </div>

          <button className="calculate-btn" onClick={calculatePrayerTimes} disabled={loading}>
            {loading ? '⏳ حساب لگایا جا رہا ہے...' : '🔄 دوبارہ حساب لگائیں'}
          </button>
        </section>

        {/* Error message */}
        {error && (
          <div className="error-message">
            ❌ خرابی: {error}
          </div>
        )}

        {/* Prayer times display */}
        {times && !loading && (
          <section className="prayer-times-section">
            <h3>🕐 آج کے نماز کے اوقات</h3>
            <div className="location-info">
              📍 {location.city} - {new Date(settings.date).toLocaleDateString('ur-PK')}
            </div>

            <div className="prayer-times-grid">
              {Object.entries(times).map(([prayer, time]) => (
                <div key={prayer} className="prayer-time-card">
                  <div className="prayer-name">{prayerNames[prayer]}</div>
                  <div className="prayer-time">{formatUrduTime(time)}</div>
                  <div className="prayer-time-24">{time}</div>
                </div>
              ))}
            </div>

            {/* اضافی معلومات */}
            <div className="additional-info">
              <div className="method-info">
                طریقہ کار: {calculationMethods[settings.method]}
              </div>
              <div className="asr-info">
                عصر: {settings.asrJurisdiction === 'Hanafi' ? 'حنفی طریقہ' : 'عام طریقہ'}
              </div>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="app-footer">
          <div className="islamic-message">
            "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ"
          </div>
          <div className="sdk-info">
            Prayer Times Calculation SDK استعمال کرکے بنایا گیا
          </div>
        </footer>
      </div>
    </div>
  );
}

// CSS Styles (علیحدہ فائل میں رکھیں: PrayerTimesApp.css)
const styles = `
.prayer-times-app {
  font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', 'Urdu Typesetting', Arial, sans-serif;
  direction: rtl;
  text-align: right;
  background: linear-gradient(135deg, #2E8B57 0%, #228B22 50%, #006400 100%);
  min-height: 100vh;
  color: white;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.app-header {
  text-align: center;
  margin-bottom: 30px;
}

.app-header h1 {
  font-size: 2.5em;
  margin-bottom: 15px;
  background: linear-gradient(45deg, #FFD700, #FFA500);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.islamic-quote {
  font-style: italic;
  font-size: 1.2em;
  margin-bottom: 15px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  border-right: 4px solid #FFD700;
}

.current-time {
  font-size: 1.1em;
  padding: 10px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 8px;
}

.cities-section, .location-section, .settings-section, .prayer-times-section {
  background: rgba(255, 255, 255, 0.1);
  padding: 25px;
  border-radius: 15px;
  margin-bottom: 25px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.cities-section h3, .location-section h3, .settings-section h3, .prayer-times-section h3 {
  margin-bottom: 20px;
  color: #FFD700;
  font-size: 1.4em;
}

.cities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
}

.city-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
}

.city-btn:hover {
  background: rgba(255, 215, 0, 0.3);
  border-color: #FFD700;
  transform: translateY(-2px);
}

.city-btn.active {
  background: #FFD700;
  color: #2E8B57;
  border-color: #FFD700;
  font-weight: bold;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  font-size: 1.1em;
}

.form-group input, .form-group select {
  width: 100%;
  padding: 12px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  font-size: 16px;
  text-align: right;
}

.form-group input:focus, .form-group select:focus {
  outline: none;
  border-color: #FFD700;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
}

.coordinates-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.location-btn, .calculate-btn {
  background: linear-gradient(45deg, #FFD700, #FFA500);
  color: #2E8B57;
  border: none;
  padding: 15px 25px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  width: 100%;
  transition: transform 0.2s ease;
}

.location-btn:hover, .calculate-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.location-btn:disabled, .calculate-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.error-message {
  background: rgba(255, 0, 0, 0.2);
  border: 2px solid #ff6b6b;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
  font-weight: bold;
}

.location-info {
  text-align: center;
  font-size: 1.2em;
  margin-bottom: 25px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  border-right: 4px solid #FFD700;
}

.prayer-times-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 25px;
}

.prayer-time-card {
  background: rgba(255, 255, 255, 0.15);
  padding: 25px;
  border-radius: 15px;
  text-align: center;
  transition: transform 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.prayer-time-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
}

.prayer-name {
  font-size: 20px;
  font-weight: bold;
  color: #FFD700;
  margin-bottom: 10px;
}

.prayer-time {
  font-size: 28px;
  font-weight: bold;
  color: white;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  margin-bottom: 5px;
}

.prayer-time-24 {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.additional-info {
  text-align: center;
  padding: 15px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  font-size: 14px;
}

.method-info, .asr-info {
  margin: 5px 0;
}

.app-footer {
  text-align: center;
  margin-top: 30px;
  padding: 25px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
}

.islamic-message {
  font-size: 1.2em;
  font-style: italic;
  margin-bottom: 15px;
  color: #FFD700;
}

.sdk-info {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

@media (max-width: 768px) {
  .container {
    padding: 15px;
  }

  .coordinates-group {
    grid-template-columns: 1fr;
  }

  .prayer-times-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 15px;
  }

  .app-header h1 {
    font-size: 2em;
  }
}
`;

export default PrayerTimesApp;

// استعمال کی مثال:
/*
import React from 'react';
import ReactDOM from 'react-dom';
import PrayerTimesApp from './PrayerTimesApp';
import './PrayerTimesApp.css'; // CSS فائل

ReactDOM.render(<PrayerTimesApp />, document.getElementById('root'));
*/