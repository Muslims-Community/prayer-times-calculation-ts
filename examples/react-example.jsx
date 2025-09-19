import React, { useState, useEffect } from 'react';
import { PrayerTimesSDK } from 'prayer-times-calculation';

// Main Prayer Times Component
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

  // Calculate prayer times whenever inputs change
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
      setError('Geolocation is not supported by this browser');
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
        setError('Unable to get location: ' + err.message);
        setLoading(false);
      }
    );
  };

  return (
    <div className="prayer-times-app">
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

// Header Component
const Header = () => (
  <header className="header">
    <h1>🕌 Prayer Times Calculator</h1>
    <p>Accurate Islamic prayer times for any location</p>
  </header>
);

// Location Input Component
const LocationInput = ({ location, onLocationChange, onGetCurrentLocation }) => {
  const handleChange = (field, value) => {
    onLocationChange({
      ...location,
      [field]: parseFloat(value) || 0
    });
  };

  return (
    <div className="location-input">
      <h3>📍 Location</h3>
      <div className="input-group">
        <div className="input-field">
          <label>Latitude:</label>
          <input
            type="number"
            step="any"
            value={location.lat}
            onChange={(e) => handleChange('lat', e.target.value)}
            placeholder="e.g., 24.7136"
          />
        </div>
        <div className="input-field">
          <label>Longitude:</label>
          <input
            type="number"
            step="any"
            value={location.lng}
            onChange={(e) => handleChange('lng', e.target.value)}
            placeholder="e.g., 46.6753"
          />
        </div>
        <div className="input-field">
          <label>Timezone (UTC offset):</label>
          <input
            type="number"
            step="any"
            value={location.timezone}
            onChange={(e) => handleChange('timezone', e.target.value)}
            placeholder="e.g., 3"
          />
        </div>
      </div>
      <button onClick={onGetCurrentLocation} className="location-btn">
        🎯 Use My Location
      </button>
    </div>
  );
};

// Options Panel Component
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
      <h3>⚙️ Calculation Options</h3>

      <div className="input-field">
        <label>Calculation Method:</label>
        <select
          value={options.method}
          onChange={(e) => handleMethodChange(e.target.value)}
        >
          <option value="MWL">Muslim World League (MWL)</option>
          <option value="ISNA">Islamic Society of North America (ISNA)</option>
          <option value="Egypt">Egyptian General Authority</option>
          <option value="Makkah">Umm Al-Qura University (Makkah)</option>
          <option value="Karachi">University of Islamic Sciences (Karachi)</option>
          <option value="Custom">Custom Angles</option>
        </select>
      </div>

      {showCustomAngles && (
        <div className="custom-angles">
          <div className="input-field">
            <label>Fajr Angle (degrees):</label>
            <input
              type="number"
              step="any"
              value={options.fajrAngle || ''}
              onChange={(e) => onOptionsChange({
                ...options,
                fajrAngle: parseFloat(e.target.value)
              })}
              placeholder="e.g., 18"
            />
          </div>
          <div className="input-field">
            <label>Isha Angle (degrees):</label>
            <input
              type="number"
              step="any"
              value={options.ishaAngle || ''}
              onChange={(e) => onOptionsChange({
                ...options,
                ishaAngle: parseFloat(e.target.value)
              })}
              placeholder="e.g., 17"
            />
          </div>
        </div>
      )}

      <div className="input-field">
        <label>Asr Calculation:</label>
        <select
          value={options.asrJurisdiction}
          onChange={(e) => onOptionsChange({
            ...options,
            asrJurisdiction: e.target.value
          })}
        >
          <option value="Standard">Standard (Shafi/Maliki/Hanbali)</option>
          <option value="Hanafi">Hanafi</option>
        </select>
      </div>
    </div>
  );
};

// Date Selector Component
const DateSelector = ({ date, onDateChange }) => (
  <div className="date-selector">
    <h3>📅 Date</h3>
    <input
      type="date"
      value={date.toISOString().split('T')[0]}
      onChange={(e) => onDateChange(new Date(e.target.value))}
    />
  </div>
);

// Prayer Times Display Component
const PrayerTimesDisplay = ({ times }) => {
  const prayerInfo = [
    { key: 'fajr', name: 'Fajr', description: 'Dawn Prayer', icon: '🌅' },
    { key: 'sunrise', name: 'Sunrise', description: 'Sun Rise', icon: '☀️' },
    { key: 'dhuhr', name: 'Dhuhr', description: 'Noon Prayer', icon: '🌞' },
    { key: 'asr', name: 'Asr', description: 'Afternoon Prayer', icon: '🌤️' },
    { key: 'maghrib', name: 'Maghrib', description: 'Sunset Prayer', icon: '🌅' },
    { key: 'isha', name: 'Isha', description: 'Night Prayer', icon: '🌙' }
  ];

  return (
    <div className="prayer-times-display">
      <h3>🕐 Prayer Times</h3>
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

// Method Info Component
const MethodInfo = ({ currentMethod }) => {
  const methodDetails = {
    MWL: { org: 'Muslim World League', fajr: '18°', isha: '17°' },
    ISNA: { org: 'Islamic Society of North America', fajr: '15°', isha: '15°' },
    Egypt: { org: 'Egyptian General Authority', fajr: '19.5°', isha: '17.5°' },
    Makkah: { org: 'Umm Al-Qura University', fajr: '18.5°', isha: '18.5°' },
    Karachi: { org: 'University of Islamic Sciences', fajr: '18°', isha: '18°' },
    Custom: { org: 'Custom Configuration', fajr: 'Custom', isha: 'Custom' }
  };

  const details = methodDetails[currentMethod];

  return (
    <div className="method-info">
      <h4>📖 Current Method: {currentMethod}</h4>
      <p><strong>Organization:</strong> {details.org}</p>
      <p><strong>Fajr Angle:</strong> {details.fajr} | <strong>Isha Angle:</strong> {details.isha}</p>
    </div>
  );
};

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="loading">
    <div className="spinner"></div>
    <p>Calculating prayer times...</p>
  </div>
);

// Error Message Component
const ErrorMessage = ({ message }) => (
  <div className="error-message">
    <p>❌ {message}</p>
  </div>
);

// Custom Hook for Prayer Times
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

// Alternative simpler component using the custom hook
export const SimplePrayerTimes = ({ location, options }) => {
  const { times, loading, error } = usePrayerTimes(
    location.lat,
    location.lng,
    location.timezone,
    options,
    new Date()
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!times) return <div>No data</div>;

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

// CSS-in-JS styles (you can also use a separate CSS file)
const styles = `
.prayer-times-app {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
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

// Add styles to document (in a real app, you'd use CSS modules or styled-components)
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default PrayerTimesApp;