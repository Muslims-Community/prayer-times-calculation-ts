# Examples and Use Cases

This document provides comprehensive examples of how to use the Prayer Times Calculation SDK in various scenarios and platforms.

## Table of Contents

- [Basic Usage](#basic-usage)
- [Web Applications](#web-applications)
- [Mobile Applications](#mobile-applications)
- [Server Applications](#server-applications)
- [Real-World Use Cases](#real-world-use-cases)
- [Performance Examples](#performance-examples)
- [Error Handling](#error-handling)

## Basic Usage

### Simple Prayer Time Calculation

```typescript
import { PrayerTimesSDK } from 'prayer-times-calculation';

// Basic usage - Riyadh, Saudi Arabia
const sdk = new PrayerTimesSDK(
  24.7136,  // latitude
  46.6753,  // longitude
  new Date(), // current date
  3,        // UTC+3 timezone
  {
    method: 'MWL',
    asrJurisdiction: 'Standard'
  }
);

const times = sdk.getTimes();
console.log(times);
// Output: {
//   fajr: "04:32",
//   sunrise: "05:52",
//   dhuhr: "12:15",
//   asr: "15:42",
//   maghrib: "18:38",
//   isha: "20:08"
// }
```

### Different Calculation Methods

```typescript
// Compare different calculation methods
const locations = [
  { name: 'Riyadh', lat: 24.7136, lng: 46.6753, tz: 3 },
  { name: 'New York', lat: 40.7128, lng: -74.0060, tz: -5 },
  { name: 'London', lat: 51.5074, lng: -0.1278, tz: 0 }
];

const methods = ['MWL', 'ISNA', 'Egypt', 'Makkah', 'Karachi'] as const;

locations.forEach(location => {
  console.log(`\n=== ${location.name} ===`);

  methods.forEach(method => {
    const sdk = new PrayerTimesSDK(
      location.lat,
      location.lng,
      new Date(),
      location.tz,
      { method, asrJurisdiction: 'Standard' }
    );

    const times = sdk.getTimes();
    console.log(`${method}: Fajr ${times.fajr}, Isha ${times.isha}`);
  });
});
```

### Custom Calculation Angles

```typescript
// Using custom angles
const customSdk = new PrayerTimesSDK(
  21.4225, // Mecca coordinates
  39.8262,
  new Date(),
  3,
  {
    method: 'Custom',
    fajrAngle: 19.0,  // Custom Fajr angle
    ishaAngle: 16.5,  // Custom Isha angle
    asrJurisdiction: 'Hanafi'
  }
);

const customTimes = customSdk.getTimes();
console.log('Custom calculation:', customTimes);
```

## Web Applications

### Vanilla JavaScript/HTML

```html
<!DOCTYPE html>
<html>
<head>
    <title>Prayer Times</title>
</head>
<body>
    <div id="prayer-times"></div>

    <script type="module">
        import { PrayerTimesSDK } from 'prayer-times-calculation';

        // Get user's location
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            const timezone = -new Date().getTimezoneOffset() / 60;

            const sdk = new PrayerTimesSDK(latitude, longitude, new Date(), timezone, {
                method: 'ISNA',
                asrJurisdiction: 'Standard'
            });

            const times = sdk.getTimes();

            document.getElementById('prayer-times').innerHTML = `
                <h2>Prayer Times for Today</h2>
                <ul>
                    <li>Fajr: ${times.fajr}</li>
                    <li>Sunrise: ${times.sunrise}</li>
                    <li>Dhuhr: ${times.dhuhr}</li>
                    <li>Asr: ${times.asr}</li>
                    <li>Maghrib: ${times.maghrib}</li>
                    <li>Isha: ${times.isha}</li>
                </ul>
            `;
        });
    </script>
</body>
</html>
```

### React Application

```tsx
import React, { useState, useEffect } from 'react';
import { PrayerTimesSDK, PrayerTimes } from 'prayer-times-calculation';

interface LocationState {
  lat: number;
  lng: number;
  timezone: number;
  city?: string;
}

const PrayerTimesApp: React.FC = () => {
  const [location, setLocation] = useState<LocationState | null>(null);
  const [times, setTimes] = useState<PrayerTimes | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get user location on mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  // Calculate prayer times when location changes
  useEffect(() => {
    if (location) {
      calculatePrayerTimes();
    }
  }, [location]);

  const getCurrentLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported');
      setLoading(false);
      return;
    }

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

  const calculatePrayerTimes = () => {
    if (!location) return;

    try {
      const sdk = new PrayerTimesSDK(
        location.lat,
        location.lng,
        new Date(),
        location.timezone,
        {
          method: 'MWL',
          asrJurisdiction: 'Standard'
        }
      );

      const calculatedTimes = sdk.getTimes();
      setTimes(calculatedTimes);
    } catch (err) {
      setError('Failed to calculate prayer times: ' + (err as Error).message);
    }
  };

  const updateLocation = (lat: number, lng: number, timezone: number) => {
    setLocation({ lat, lng, timezone });
  };

  if (loading) {
    return <div className="loading">Getting your location...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="prayer-times-app">
      <h1>Prayer Times</h1>

      {location && (
        <div className="location-info">
          <p>Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}</p>
          <p>Timezone: UTC{location.timezone >= 0 ? '+' : ''}{location.timezone}</p>
        </div>
      )}

      {times && (
        <div className="prayer-times">
          <h2>Today's Prayer Times</h2>
          <div className="times-grid">
            <PrayerTimeCard name="Fajr" time={times.fajr} />
            <PrayerTimeCard name="Sunrise" time={times.sunrise} />
            <PrayerTimeCard name="Dhuhr" time={times.dhuhr} />
            <PrayerTimeCard name="Asr" time={times.asr} />
            <PrayerTimeCard name="Maghrib" time={times.maghrib} />
            <PrayerTimeCard name="Isha" time={times.isha} />
          </div>
        </div>
      )}

      <LocationInput onLocationUpdate={updateLocation} />
    </div>
  );
};

const PrayerTimeCard: React.FC<{ name: string; time: string }> = ({ name, time }) => (
  <div className="prayer-time-card">
    <h3>{name}</h3>
    <div className="time">{time}</div>
  </div>
);

const LocationInput: React.FC<{
  onLocationUpdate: (lat: number, lng: number, timezone: number) => void;
}> = ({ onLocationUpdate }) => {
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [timezone, setTimezone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLocationUpdate(parseFloat(lat), parseFloat(lng), parseFloat(timezone));
  };

  return (
    <form onSubmit={handleSubmit} className="location-form">
      <h3>Manual Location Entry</h3>
      <input
        type="number"
        step="any"
        placeholder="Latitude"
        value={lat}
        onChange={(e) => setLat(e.target.value)}
      />
      <input
        type="number"
        step="any"
        placeholder="Longitude"
        value={lng}
        onChange={(e) => setLng(e.target.value)}
      />
      <input
        type="number"
        step="any"
        placeholder="Timezone (UTC offset)"
        value={timezone}
        onChange={(e) => setTimezone(e.target.value)}
      />
      <button type="submit">Calculate</button>
    </form>
  );
};

export default PrayerTimesApp;
```

### Vue.js Application

```vue
<template>
  <div class="prayer-times-app">
    <h1>Prayer Times Calculator</h1>

    <div v-if="loading" class="loading">
      Calculating prayer times...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else-if="prayerTimes" class="prayer-times">
      <h2>Prayer Times for {{ formatDate(selectedDate) }}</h2>

      <div class="location-info">
        <p>{{ location.city || 'Current Location' }}</p>
        <p>{{ location.lat.toFixed(4) }}, {{ location.lng.toFixed(4) }}</p>
      </div>

      <div class="times-grid">
        <div v-for="(time, prayer) in prayerTimes" :key="prayer" class="time-card">
          <h3>{{ formatPrayerName(prayer) }}</h3>
          <div class="time">{{ time }}</div>
        </div>
      </div>

      <div class="controls">
        <select v-model="calculationMethod" @change="calculateTimes">
          <option value="MWL">Muslim World League</option>
          <option value="ISNA">ISNA</option>
          <option value="Egypt">Egypt</option>
          <option value="Makkah">Makkah</option>
          <option value="Karachi">Karachi</option>
        </select>

        <select v-model="asrJurisdiction" @change="calculateTimes">
          <option value="Standard">Standard Asr</option>
          <option value="Hanafi">Hanafi Asr</option>
        </select>

        <input
          type="date"
          v-model="selectedDate"
          @change="calculateTimes"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { PrayerTimesSDK } from 'prayer-times-calculation';

export default {
  name: 'PrayerTimesApp',
  data() {
    return {
      location: { lat: 0, lng: 0, timezone: 0, city: '' },
      prayerTimes: null,
      loading: false,
      error: null,
      calculationMethod: 'MWL',
      asrJurisdiction: 'Standard',
      selectedDate: new Date().toISOString().split('T')[0]
    };
  },

  mounted() {
    this.getUserLocation();
  },

  methods: {
    async getUserLocation() {
      this.loading = true;

      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        this.location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          timezone: -new Date().getTimezoneOffset() / 60
        };

        await this.calculateTimes();
      } catch (err) {
        this.error = 'Unable to get location: ' + err.message;
      } finally {
        this.loading = false;
      }
    },

    calculateTimes() {
      try {
        const sdk = new PrayerTimesSDK(
          this.location.lat,
          this.location.lng,
          new Date(this.selectedDate),
          this.location.timezone,
          {
            method: this.calculationMethod,
            asrJurisdiction: this.asrJurisdiction
          }
        );

        this.prayerTimes = sdk.getTimes();
        this.error = null;
      } catch (err) {
        this.error = 'Failed to calculate prayer times: ' + err.message;
      }
    },

    formatPrayerName(prayer) {
      const names = {
        fajr: 'Fajr',
        sunrise: 'Sunrise',
        dhuhr: 'Dhuhr',
        asr: 'Asr',
        maghrib: 'Maghrib',
        isha: 'Isha'
      };
      return names[prayer] || prayer;
    },

    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString();
    }
  }
};
</script>

<style scoped>
.prayer-times-app {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.times-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin: 20px 0;
}

.time-card {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.time {
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
}

.controls {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.controls select,
.controls input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.loading, .error {
  text-align: center;
  padding: 40px;
}

.error {
  color: #e74c3c;
}
</style>
```

## Mobile Applications

### React Native Example

```typescript
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Platform
} from 'react-native';
import { PrayerTimesSDK, PrayerTimes } from 'prayer-times-calculation';
import * as Location from 'expo-location'; // If using Expo

interface LocationState {
  latitude: number;
  longitude: number;
  timezone: number;
}

const PrayerTimesScreen: React.FC = () => {
  const [location, setLocation] = useState<LocationState | null>(null);
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (location) {
      calculatePrayerTimes();
    }
  }, [location]);

  const getCurrentLocation = async () => {
    setLoading(true);

    try {
      // Request permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required');
        return;
      }

      // Get location
      const position = await Location.getCurrentPositionAsync({});

      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        timezone: -new Date().getTimezoneOffset() / 60
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to get location');
    } finally {
      setLoading(false);
    }
  };

  const calculatePrayerTimes = () => {
    if (!location) return;

    try {
      const sdk = new PrayerTimesSDK(
        location.latitude,
        location.longitude,
        new Date(),
        location.timezone,
        {
          method: 'MWL',
          asrJurisdiction: 'Standard'
        }
      );

      const times = sdk.getTimes();
      setPrayerTimes(times);
    } catch (error) {
      Alert.alert('Error', 'Failed to calculate prayer times');
    }
  };

  const prayerNames = {
    fajr: 'Fajr',
    sunrise: 'Sunrise',
    dhuhr: 'Dhuhr',
    asr: 'Asr',
    maghrib: 'Maghrib',
    isha: 'Isha'
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Prayer Times</Text>
        {location && (
          <Text style={styles.location}>
            {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
          </Text>
        )}
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <Text>Getting your location...</Text>
        </View>
      ) : prayerTimes ? (
        <View style={styles.timesContainer}>
          {Object.entries(prayerTimes).map(([prayer, time]) => (
            <View key={prayer} style={styles.timeCard}>
              <Text style={styles.prayerName}>
                {prayerNames[prayer as keyof typeof prayerNames]}
              </Text>
              <Text style={styles.prayerTime}>{time}</Text>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.centerContainer}>
          <TouchableOpacity style={styles.button} onPress={getCurrentLocation}>
            <Text style={styles.buttonText}>Get Prayer Times</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#2c3e50',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  location: {
    fontSize: 14,
    color: '#ecf0f1',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  timesContainer: {
    padding: 20,
  },
  timeCard: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  prayerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  prayerTime: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  button: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PrayerTimesScreen;
```

## Server Applications

### Express.js API

```typescript
import express from 'express';
import { PrayerTimesSDK } from 'prayer-times-calculation';

const app = express();
app.use(express.json());

// Get prayer times for coordinates
app.get('/api/prayer-times', (req, res) => {
  try {
    const { lat, lng, timezone, method = 'MWL', asr = 'Standard', date } = req.query;

    // Validate inputs
    if (!lat || !lng || timezone === undefined) {
      return res.status(400).json({
        error: 'Missing required parameters: lat, lng, timezone'
      });
    }

    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lng as string);
    const timezoneOffset = parseFloat(timezone as string);

    if (isNaN(latitude) || isNaN(longitude) || isNaN(timezoneOffset)) {
      return res.status(400).json({
        error: 'Invalid coordinates or timezone'
      });
    }

    // Calculate prayer times
    const calculationDate = date ? new Date(date as string) : new Date();
    const sdk = new PrayerTimesSDK(latitude, longitude, calculationDate, timezoneOffset, {
      method: method as any,
      asrJurisdiction: asr as any
    });

    const times = sdk.getTimes();

    res.json({
      location: { latitude, longitude, timezone: timezoneOffset },
      date: calculationDate.toISOString().split('T')[0],
      method,
      asrJurisdiction: asr,
      times
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to calculate prayer times: ' + (error as Error).message
    });
  }
});

// Batch calculation for multiple locations
app.post('/api/prayer-times/batch', (req, res) => {
  try {
    const locations = req.body;

    if (!Array.isArray(locations)) {
      return res.status(400).json({
        error: 'Request body must be an array of locations'
      });
    }

    const results = locations.map((location, index) => {
      try {
        const { lat, lng, timezone, method = 'MWL', asrJurisdiction = 'Standard', date } = location;

        const sdk = new PrayerTimesSDK(
          lat, lng,
          date ? new Date(date) : new Date(),
          timezone,
          { method, asrJurisdiction }
        );

        return {
          index,
          location: { latitude: lat, longitude: lng, timezone },
          times: sdk.getTimes(),
          success: true
        };
      } catch (error) {
        return {
          index,
          error: (error as Error).message,
          success: false
        };
      }
    });

    res.json({
      results,
      summary: {
        total: locations.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length
      }
    });

  } catch (error) {
    res.status(500).json({
      error: 'Batch calculation failed: ' + (error as Error).message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Prayer Times API running on port ${PORT}`);
});
```

## Real-World Use Cases

### Mosque Website Widget

```typescript
class MosquePrayerTimesWidget {
  private container: HTMLElement;
  private sdk: PrayerTimesSDK;

  constructor(
    containerId: string,
    private latitude: number,
    private longitude: number,
    private timezone: number
  ) {
    this.container = document.getElementById(containerId)!;
    this.sdk = new PrayerTimesSDK(latitude, longitude, new Date(), timezone, {
      method: 'MWL',
      asrJurisdiction: 'Standard'
    });

    this.render();
    this.startAutoUpdate();
  }

  private render(): void {
    const times = this.sdk.getTimes();
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    // Find next prayer
    const nextPrayer = this.findNextPrayer(times, currentTime);

    this.container.innerHTML = `
      <div class="mosque-prayer-widget">
        <h3>Today's Prayer Times</h3>
        <div class="prayer-times">
          ${Object.entries(times).map(([prayer, time]) => `
            <div class="prayer-time ${nextPrayer === prayer ? 'next' : ''}">
              <span class="prayer-name">${this.formatPrayerName(prayer)}</span>
              <span class="time">${time}</span>
            </div>
          `).join('')}
        </div>
        <div class="current-time">
          Current Time: ${currentTime}
          ${nextPrayer ? `<br>Next: ${this.formatPrayerName(nextPrayer)} at ${times[nextPrayer as keyof typeof times]}` : ''}
        </div>
      </div>
    `;
  }

  private findNextPrayer(times: any, currentTime: string): string | null {
    const prayers = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];

    for (const prayer of prayers) {
      if (times[prayer] > currentTime) {
        return prayer;
      }
    }

    return 'fajr'; // Next day's Fajr
  }

  private formatPrayerName(prayer: string): string {
    const names: Record<string, string> = {
      fajr: 'Fajr',
      sunrise: 'Sunrise',
      dhuhr: 'Dhuhr',
      asr: 'Asr',
      maghrib: 'Maghrib',
      isha: 'Isha'
    };
    return names[prayer] || prayer;
  }

  private startAutoUpdate(): void {
    // Update every minute
    setInterval(() => {
      this.render();
    }, 60000);

    // Update daily at midnight
    setInterval(() => {
      this.sdk = new PrayerTimesSDK(
        this.latitude,
        this.longitude,
        new Date(),
        this.timezone,
        { method: 'MWL', asrJurisdiction: 'Standard' }
      );
      this.render();
    }, 24 * 60 * 60 * 1000);
  }
}

// Usage
const widget = new MosquePrayerTimesWidget(
  'prayer-times-container',
  40.7128, // Mosque latitude
  -74.0060, // Mosque longitude
  -5 // Timezone
);
```

### Travel Prayer Times App

```typescript
class TravelPrayerTimesApp {
  private currentLocation: { lat: number; lng: number; timezone: number } | null = null;
  private savedLocations: Array<{ name: string; lat: number; lng: number; timezone: number }> = [];

  constructor() {
    this.loadSavedLocations();
  }

  async detectLocation(): Promise<void> {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      this.currentLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        timezone: -new Date().getTimezoneOffset() / 60
      };

      // Auto-detect timezone more accurately
      this.currentLocation.timezone = await this.getTimezoneFromCoordinates(
        this.currentLocation.lat,
        this.currentLocation.lng
      );

    } catch (error) {
      console.error('Failed to get location:', error);
      throw new Error('Unable to detect location');
    }
  }

  private async getTimezoneFromCoordinates(lat: number, lng: number): Promise<number> {
    // In a real app, you might use a timezone API
    // For now, we'll use a simple approximation
    const timezoneOffset = Math.round(lng / 15);
    return Math.max(-12, Math.min(14, timezoneOffset));
  }

  calculatePrayerTimesForCurrentLocation(method: string = 'MWL'): any {
    if (!this.currentLocation) {
      throw new Error('Location not detected');
    }

    const sdk = new PrayerTimesSDK(
      this.currentLocation.lat,
      this.currentLocation.lng,
      new Date(),
      this.currentLocation.timezone,
      {
        method: method as any,
        asrJurisdiction: 'Standard'
      }
    );

    return {
      location: this.currentLocation,
      times: sdk.getTimes(),
      method
    };
  }

  calculatePrayerTimesForSavedLocation(locationName: string): any {
    const location = this.savedLocations.find(loc => loc.name === locationName);
    if (!location) {
      throw new Error('Location not found in saved locations');
    }

    const sdk = new PrayerTimesSDK(
      location.lat,
      location.lng,
      new Date(),
      location.timezone,
      {
        method: 'MWL',
        asrJurisdiction: 'Standard'
      }
    );

    return {
      location,
      times: sdk.getTimes()
    };
  }

  saveCurrentLocation(name: string): void {
    if (!this.currentLocation) {
      throw new Error('No current location to save');
    }

    const newLocation = {
      name,
      ...this.currentLocation
    };

    this.savedLocations.push(newLocation);
    this.saveSavedLocations();
  }

  private loadSavedLocations(): void {
    const saved = localStorage.getItem('saved-prayer-locations');
    if (saved) {
      this.savedLocations = JSON.parse(saved);
    }
  }

  private saveSavedLocations(): void {
    localStorage.setItem('saved-prayer-locations', JSON.stringify(this.savedLocations));
  }

  getSavedLocations(): Array<{ name: string; lat: number; lng: number; timezone: number }> {
    return [...this.savedLocations];
  }

  deleteSavedLocation(name: string): void {
    this.savedLocations = this.savedLocations.filter(loc => loc.name !== name);
    this.saveSavedLocations();
  }
}

// Usage
const travelApp = new TravelPrayerTimesApp();

// Detect current location and get prayer times
travelApp.detectLocation().then(() => {
  const currentTimes = travelApp.calculatePrayerTimesForCurrentLocation();
  console.log('Current location prayer times:', currentTimes);

  // Save current location
  travelApp.saveCurrentLocation('Current City');
}).catch(error => {
  console.error('Error:', error);
});
```

## Performance Examples

### Batch Processing Performance

```typescript
// Performance test for batch calculations
function performanceTest() {
  const locations = [
    { name: 'New York', lat: 40.7128, lng: -74.0060, tz: -5 },
    { name: 'London', lat: 51.5074, lng: -0.1278, tz: 0 },
    { name: 'Tokyo', lat: 35.6762, lng: 139.6503, tz: 9 },
    { name: 'Dubai', lat: 25.2048, lng: 55.2708, tz: 4 },
    { name: 'Sydney', lat: -33.8688, lng: 151.2093, tz: 11 }
  ];

  console.log('Performance Test: Calculating prayer times for', locations.length, 'cities');

  const startTime = performance.now();

  const results = locations.map(location => {
    const sdk = new PrayerTimesSDK(
      location.lat,
      location.lng,
      new Date(),
      location.tz,
      {
        method: 'MWL',
        asrJurisdiction: 'Standard'
      }
    );

    return {
      city: location.name,
      times: sdk.getTimes()
    };
  });

  const endTime = performance.now();
  const totalTime = endTime - startTime;
  const avgTime = totalTime / locations.length;

  console.log(`Total time: ${totalTime.toFixed(2)}ms`);
  console.log(`Average time per calculation: ${avgTime.toFixed(2)}ms`);
  console.log(`Calculations per second: ${(1000 / avgTime).toFixed(0)}`);

  return results;
}

// Memory usage test
function memoryUsageTest() {
  const initialMemory = performance.memory?.usedJSHeapSize || 0;

  // Create multiple SDK instances
  const sdks = [];
  for (let i = 0; i < 1000; i++) {
    const sdk = new PrayerTimesSDK(
      Math.random() * 180 - 90, // Random latitude
      Math.random() * 360 - 180, // Random longitude
      new Date(),
      Math.floor(Math.random() * 25) - 12, // Random timezone
      {
        method: 'MWL',
        asrJurisdiction: 'Standard'
      }
    );
    sdks.push(sdk);
  }

  const afterCreation = performance.memory?.usedJSHeapSize || 0;

  // Calculate prayer times
  sdks.forEach(sdk => sdk.getTimes());

  const afterCalculation = performance.memory?.usedJSHeapSize || 0;

  console.log('Memory Usage Test:');
  console.log(`Initial: ${(initialMemory / 1024 / 1024).toFixed(2)} MB`);
  console.log(`After creating 1000 SDKs: ${(afterCreation / 1024 / 1024).toFixed(2)} MB`);
  console.log(`After calculations: ${(afterCalculation / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Memory per SDK: ${((afterCreation - initialMemory) / 1000 / 1024).toFixed(2)} KB`);
}

// Run performance tests
performanceTest();
memoryUsageTest();
```

## Error Handling

### Comprehensive Error Handling

```typescript
class PrayerTimesService {
  private validateCoordinates(lat: number, lng: number): void {
    if (isNaN(lat) || lat < -90 || lat > 90) {
      throw new Error(`Invalid latitude: ${lat}. Must be between -90 and 90.`);
    }

    if (isNaN(lng) || lng < -180 || lng > 180) {
      throw new Error(`Invalid longitude: ${lng}. Must be between -180 and 180.`);
    }
  }

  private validateTimezone(timezone: number): void {
    if (isNaN(timezone) || timezone < -12 || timezone > 14) {
      throw new Error(`Invalid timezone: ${timezone}. Must be between -12 and 14.`);
    }
  }

  private validateDate(date: Date): void {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      throw new Error('Invalid date provided');
    }
  }

  calculatePrayerTimes(
    lat: number,
    lng: number,
    date: Date,
    timezone: number,
    options: any
  ): any {
    try {
      // Validate inputs
      this.validateCoordinates(lat, lng);
      this.validateTimezone(timezone);
      this.validateDate(date);

      // Create SDK instance
      const sdk = new PrayerTimesSDK(lat, lng, date, timezone, options);

      // Calculate times
      const times = sdk.getTimes();

      // Validate results
      this.validateResults(times);

      return {
        success: true,
        data: {
          location: { latitude: lat, longitude: lng, timezone },
          date: date.toISOString().split('T')[0],
          times
        }
      };

    } catch (error) {
      return {
        success: false,
        error: {
          message: (error as Error).message,
          type: this.getErrorType(error as Error),
          suggestions: this.getErrorSuggestions(error as Error)
        }
      };
    }
  }

  private validateResults(times: any): void {
    const timeRegex = /^(\d{2}:\d{2}|NaN:NaN)$/;

    for (const [prayer, time] of Object.entries(times)) {
      if (!timeRegex.test(time as string)) {
        throw new Error(`Invalid time format for ${prayer}: ${time}`);
      }
    }
  }

  private getErrorType(error: Error): string {
    if (error.message.includes('latitude') || error.message.includes('longitude')) {
      return 'INVALID_COORDINATES';
    }
    if (error.message.includes('timezone')) {
      return 'INVALID_TIMEZONE';
    }
    if (error.message.includes('date')) {
      return 'INVALID_DATE';
    }
    if (error.message.includes('Custom method')) {
      return 'INVALID_CUSTOM_ANGLES';
    }
    return 'CALCULATION_ERROR';
  }

  private getErrorSuggestions(error: Error): string[] {
    const type = this.getErrorType(error);

    switch (type) {
      case 'INVALID_COORDINATES':
        return [
          'Ensure latitude is between -90 and 90',
          'Ensure longitude is between -180 and 180',
          'Use decimal degrees format (e.g., 40.7128, not 40°42\'46\"N)'
        ];

      case 'INVALID_TIMEZONE':
        return [
          'Use UTC offset in hours (e.g., 3 for UTC+3)',
          'Timezone must be between -12 and +14',
          'Consider using automatic timezone detection'
        ];

      case 'INVALID_DATE':
        return [
          'Provide a valid Date object',
          'Use new Date() for current date',
          'Check date format if parsing from string'
        ];

      case 'INVALID_CUSTOM_ANGLES':
        return [
          'Provide both fajrAngle and ishaAngle for custom method',
          'Angles should be positive numbers (typically 15-20 degrees)',
          'Consider using a predefined method instead'
        ];

      default:
        return [
          'Check input parameters',
          'Try a different calculation method',
          'Verify coordinates are for a valid location'
        ];
    }
  }
}

// Usage with error handling
const prayerService = new PrayerTimesService();

// Example with invalid coordinates
const result1 = prayerService.calculatePrayerTimes(
  95, // Invalid latitude
  46.6753,
  new Date(),
  3,
  { method: 'MWL', asrJurisdiction: 'Standard' }
);

if (!result1.success) {
  console.error('Error:', result1.error.message);
  console.log('Suggestions:', result1.error.suggestions);
}

// Example with valid inputs
const result2 = prayerService.calculatePrayerTimes(
  24.7136,
  46.6753,
  new Date(),
  3,
  { method: 'MWL', asrJurisdiction: 'Standard' }
);

if (result2.success) {
  console.log('Prayer times:', result2.data.times);
} else {
  console.error('Calculation failed:', result2.error);
}
```

This comprehensive examples document covers various real-world scenarios and implementations of the Prayer Times Calculation SDK across different platforms and use cases. Each example includes proper error handling, performance considerations, and best practices for integration.