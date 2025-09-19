const express = require('express');
const { PrayerTimesSDK } = require('prayer-times-calculation');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// CORS middleware for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// API Routes

/**
 * GET /api/prayer-times
 * Calculate prayer times for given coordinates
 * Query parameters:
 * - lat: latitude (required)
 * - lng: longitude (required)
 * - timezone: UTC offset in hours (required)
 * - method: calculation method (optional, default: MWL)
 * - asr: asr jurisdiction (optional, default: Standard)
 * - date: ISO date string (optional, default: today)
 * - fajrAngle: custom fajr angle (required if method=Custom)
 * - ishaAngle: custom isha angle (required if method=Custom)
 */
app.get('/api/prayer-times', (req, res) => {
  try {
    const {
      lat,
      lng,
      timezone,
      method = 'MWL',
      asr = 'Standard',
      date,
      fajrAngle,
      ishaAngle
    } = req.query;

    // Validate required parameters
    if (!lat || !lng || !timezone) {
      return res.status(400).json({
        error: 'Missing required parameters: lat, lng, timezone'
      });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const timezoneOffset = parseFloat(timezone);

    // Validate coordinate ranges
    if (latitude < -90 || latitude > 90) {
      return res.status(400).json({
        error: 'Latitude must be between -90 and 90'
      });
    }

    if (longitude < -180 || longitude > 180) {
      return res.status(400).json({
        error: 'Longitude must be between -180 and 180'
      });
    }

    // Prepare calculation options
    const options = {
      method,
      asrJurisdiction: asr
    };

    // Handle custom angles
    if (method === 'Custom') {
      if (!fajrAngle || !ishaAngle) {
        return res.status(400).json({
          error: 'Custom method requires fajrAngle and ishaAngle parameters'
        });
      }
      options.fajrAngle = parseFloat(fajrAngle);
      options.ishaAngle = parseFloat(ishaAngle);
    }

    // Create date object
    const calculationDate = date ? new Date(date) : new Date();

    // Calculate prayer times
    const sdk = new PrayerTimesSDK(latitude, longitude, calculationDate, timezoneOffset, options);
    const times = sdk.getTimes();

    // Return results
    res.json({
      location: {
        latitude,
        longitude,
        timezone: timezoneOffset
      },
      date: calculationDate.toISOString().split('T')[0],
      method: options.method,
      asrJurisdiction: options.asrJurisdiction,
      times
    });

  } catch (error) {
    console.error('Error calculating prayer times:', error);
    res.status(500).json({
      error: 'Internal server error: ' + error.message
    });
  }
});

/**
 * POST /api/prayer-times/batch
 * Calculate prayer times for multiple locations
 * Body: array of location objects
 */
app.post('/api/prayer-times/batch', (req, res) => {
  try {
    const locations = req.body;

    if (!Array.isArray(locations)) {
      return res.status(400).json({
        error: 'Request body must be an array of location objects'
      });
    }

    const results = locations.map((location, index) => {
      try {
        const {
          lat,
          lng,
          timezone,
          method = 'MWL',
          asrJurisdiction = 'Standard',
          date,
          fajrAngle,
          ishaAngle,
          name
        } = location;

        if (!lat || !lng || timezone === undefined) {
          throw new Error('Missing required parameters: lat, lng, timezone');
        }

        const options = {
          method,
          asrJurisdiction
        };

        if (method === 'Custom') {
          if (!fajrAngle || !ishaAngle) {
            throw new Error('Custom method requires fajrAngle and ishaAngle');
          }
          options.fajrAngle = fajrAngle;
          options.ishaAngle = ishaAngle;
        }

        const calculationDate = date ? new Date(date) : new Date();
        const sdk = new PrayerTimesSDK(lat, lng, calculationDate, timezone, options);
        const times = sdk.getTimes();

        return {
          index,
          name: name || `Location ${index + 1}`,
          location: { latitude: lat, longitude: lng, timezone },
          date: calculationDate.toISOString().split('T')[0],
          method,
          asrJurisdiction,
          times,
          success: true
        };

      } catch (error) {
        return {
          index,
          name: location.name || `Location ${index + 1}`,
          error: error.message,
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
    console.error('Error in batch calculation:', error);
    res.status(500).json({
      error: 'Internal server error: ' + error.message
    });
  }
});

/**
 * GET /api/methods
 * Get available calculation methods and their angles
 */
app.get('/api/methods', (req, res) => {
  const methods = {
    MWL: { name: 'Muslim World League', fajr: 18, isha: 17 },
    ISNA: { name: 'Islamic Society of North America', fajr: 15, isha: 15 },
    Egypt: { name: 'Egyptian General Authority', fajr: 19.5, isha: 17.5 },
    Makkah: { name: 'Umm Al-Qura University', fajr: 18.5, isha: 18.5 },
    Karachi: { name: 'University of Islamic Sciences', fajr: 18, isha: 18 },
    Custom: { name: 'Custom Angles', fajr: 'user-defined', isha: 'user-defined' }
  };

  res.json({
    methods,
    asrJurisdictions: {
      Standard: 'Shafi/Maliki/Hanbali (shadow = object height)',
      Hanafi: 'Hanafi (shadow = 2 × object height)'
    }
  });
});

/**
 * GET /api/cities
 * Get prayer times for major cities
 */
app.get('/api/cities', (req, res) => {
  const majorCities = [
    { name: 'Mecca', lat: 21.4225, lng: 39.8262, timezone: 3 },
    { name: 'Medina', lat: 24.4673, lng: 39.6142, timezone: 3 },
    { name: 'Cairo', lat: 30.0444, lng: 31.2357, timezone: 2 },
    { name: 'Istanbul', lat: 41.0082, lng: 28.9784, timezone: 3 },
    { name: 'Riyadh', lat: 24.7136, lng: 46.6753, timezone: 3 },
    { name: 'Dubai', lat: 25.2048, lng: 55.2708, timezone: 4 },
    { name: 'Kuwait City', lat: 29.3759, lng: 47.9774, timezone: 3 },
    { name: 'Doha', lat: 25.2854, lng: 51.5310, timezone: 3 },
    { name: 'Jakarta', lat: -6.2088, lng: 106.8456, timezone: 7 },
    { name: 'Kuala Lumpur', lat: 3.1390, lng: 101.6869, timezone: 8 }
  ];

  try {
    const { method = 'MWL', asr = 'Standard' } = req.query;

    const results = majorCities.map(city => {
      try {
        const sdk = new PrayerTimesSDK(city.lat, city.lng, new Date(), city.timezone, {
          method,
          asrJurisdiction: asr
        });

        const times = sdk.getTimes();

        return {
          ...city,
          times,
          success: true
        };
      } catch (error) {
        return {
          ...city,
          error: error.message,
          success: false
        };
      }
    });

    res.json({
      date: new Date().toISOString().split('T')[0],
      method,
      asrJurisdiction: asr,
      cities: results
    });

  } catch (error) {
    console.error('Error calculating city prayer times:', error);
    res.status(500).json({
      error: 'Internal server error: ' + error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API documentation endpoint
app.get('/api/docs', (req, res) => {
  res.json({
    name: 'Prayer Times API',
    version: '1.0.0',
    description: 'RESTful API for calculating Islamic prayer times',
    endpoints: {
      'GET /api/prayer-times': {
        description: 'Calculate prayer times for a location',
        parameters: {
          lat: 'Latitude (-90 to 90)',
          lng: 'Longitude (-180 to 180)',
          timezone: 'UTC offset in hours',
          method: 'Calculation method (MWL, ISNA, Egypt, Makkah, Karachi, Custom)',
          asr: 'Asr jurisdiction (Standard, Hanafi)',
          date: 'ISO date string (optional)',
          fajrAngle: 'Custom fajr angle (required if method=Custom)',
          ishaAngle: 'Custom isha angle (required if method=Custom)'
        }
      },
      'POST /api/prayer-times/batch': {
        description: 'Calculate prayer times for multiple locations',
        body: 'Array of location objects'
      },
      'GET /api/methods': {
        description: 'Get available calculation methods'
      },
      'GET /api/cities': {
        description: 'Get prayer times for major cities'
      }
    },
    examples: {
      'Single location': '/api/prayer-times?lat=24.7136&lng=46.6753&timezone=3&method=MWL&asr=Standard',
      'Custom method': '/api/prayer-times?lat=24.7136&lng=46.6753&timezone=3&method=Custom&fajrAngle=18&ishaAngle=17',
      'Major cities': '/api/cities?method=MWL&asr=Standard'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    availableEndpoints: [
      'GET /api/prayer-times',
      'POST /api/prayer-times/batch',
      'GET /api/methods',
      'GET /api/cities',
      'GET /api/docs',
      'GET /health'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🕌 Prayer Times API server running on port ${PORT}`);
  console.log(`📖 API Documentation: http://localhost:${PORT}/api/docs`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
  console.log('\n📍 Example requests:');
  console.log(`   Single location: http://localhost:${PORT}/api/prayer-times?lat=24.7136&lng=46.6753&timezone=3`);
  console.log(`   Major cities: http://localhost:${PORT}/api/cities`);
  console.log(`   Methods: http://localhost:${PORT}/api/methods`);
});

module.exports = app;