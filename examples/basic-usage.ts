import { PrayerTimesSDK } from '../src/index';

// Basic usage example for Riyadh, Saudi Arabia
function basicExample(): void {
  console.log('=== Basic Prayer Times Calculation ===');

  const prayerTimes = new PrayerTimesSDK(
    24.7136,  // Riyadh latitude
    46.6753,  // Riyadh longitude
    new Date(), // Current date
    3,        // UTC+3 timezone
    {
      method: 'MWL',
      asrJurisdiction: 'Standard'
    }
  );

  const times = prayerTimes.getTimes();

  console.log('Prayer times for Riyadh:');
  console.log(`Fajr:    ${times.fajr}`);
  console.log(`Sunrise: ${times.sunrise}`);
  console.log(`Dhuhr:   ${times.dhuhr}`);
  console.log(`Asr:     ${times.asr}`);
  console.log(`Maghrib: ${times.maghrib}`);
  console.log(`Isha:    ${times.isha}`);
}

// Example with different calculation methods
function differentMethodsExample(): void {
  console.log('\n=== Different Calculation Methods ===');

  const coords = { lat: 40.7128, lng: -74.0060, tz: -5 }; // New York
  const date = new Date();

  const methods = ['MWL', 'ISNA', 'Egypt', 'Makkah', 'Karachi'] as const;

  methods.forEach(method => {
    const sdk = new PrayerTimesSDK(coords.lat, coords.lng, date, coords.tz, {
      method,
      asrJurisdiction: 'Standard'
    });

    const times = sdk.getTimes();
    console.log(`\n${method} Method:`);
    console.log(`Fajr: ${times.fajr}, Isha: ${times.isha}`);
  });
}

// Example with custom angles
function customAnglesExample(): void {
  console.log('\n=== Custom Angles Example ===');

  const sdk = new PrayerTimesSDK(
    51.5074, -0.1278, // London coordinates
    new Date(),
    0, // GMT
    {
      method: 'Custom',
      fajrAngle: 18,
      ishaAngle: 16,
      asrJurisdiction: 'Hanafi'
    }
  );

  const times = sdk.getTimes();

  console.log('Custom angles (Fajr: 18°, Isha: 16°, Hanafi Asr):');
  console.log(`Fajr:    ${times.fajr}`);
  console.log(`Sunrise: ${times.sunrise}`);
  console.log(`Dhuhr:   ${times.dhuhr}`);
  console.log(`Asr:     ${times.asr}`);
  console.log(`Maghrib: ${times.maghrib}`);
  console.log(`Isha:    ${times.isha}`);
}

// Example comparing Standard vs Hanafi Asr
function asrComparisonExample(): void {
  console.log('\n=== Asr Jurisdiction Comparison ===');

  const coords = { lat: 24.7136, lng: 46.6753, tz: 3 }; // Riyadh

  const standardSdk = new PrayerTimesSDK(coords.lat, coords.lng, new Date(), coords.tz, {
    method: 'MWL',
    asrJurisdiction: 'Standard'
  });

  const hanafiSdk = new PrayerTimesSDK(coords.lat, coords.lng, new Date(), coords.tz, {
    method: 'MWL',
    asrJurisdiction: 'Hanafi'
  });

  const standardTimes = standardSdk.getTimes();
  const hanafiTimes = hanafiSdk.getTimes();

  console.log(`Standard Asr: ${standardTimes.asr}`);
  console.log(`Hanafi Asr:   ${hanafiTimes.asr}`);
}

// Performance testing example
function performanceExample(): void {
  console.log('\n=== Performance Test ===');

  const sdk = new PrayerTimesSDK(24.7136, 46.6753, new Date(), 3, {
    method: 'MWL',
    asrJurisdiction: 'Standard'
  });

  const iterations = 1000;
  const startTime = performance.now();

  for (let i = 0; i < iterations; i++) {
    sdk.getTimes();
  }

  const endTime = performance.now();
  const totalTime = endTime - startTime;
  const avgTime = totalTime / iterations;

  console.log(`Calculated ${iterations} times in ${totalTime.toFixed(2)}ms`);
  console.log(`Average time per calculation: ${avgTime.toFixed(3)}ms`);
}

// Multiple locations example
function multipleLocationsExample(): void {
  console.log('\n=== Multiple Locations ===');

  const locations = [
    { name: 'Mecca', lat: 21.4225, lng: 39.8262, tz: 3 },
    { name: 'Medina', lat: 24.4673, lng: 39.6142, tz: 3 },
    { name: 'Istanbul', lat: 41.0082, lng: 28.9784, tz: 3 },
    { name: 'Cairo', lat: 30.0444, lng: 31.2357, tz: 2 },
    { name: 'Jakarta', lat: -6.2088, lng: 106.8456, tz: 7 },
  ];

  locations.forEach(location => {
    const sdk = new PrayerTimesSDK(location.lat, location.lng, new Date(), location.tz, {
      method: 'MWL',
      asrJurisdiction: 'Standard'
    });

    const times = sdk.getTimes();
    console.log(`\n${location.name}:`);
    console.log(`  Fajr: ${times.fajr}, Dhuhr: ${times.dhuhr}, Maghrib: ${times.maghrib}`);
  });
}

// Run all examples
if (require.main === module) {
  basicExample();
  differentMethodsExample();
  customAnglesExample();
  asrComparisonExample();
  performanceExample();
  multipleLocationsExample();
}