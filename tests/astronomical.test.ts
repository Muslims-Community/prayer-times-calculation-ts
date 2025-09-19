import {
  degreesToRadians,
  radiansToDegrees,
  normalizeAngle,
  julianDate,
  timeFromAngle,
  formatTime,
  addMinutes,
} from '../src/utils/astronomical';

describe('Astronomical Utilities', () => {
  describe('degreesToRadians', () => {
    it('should convert degrees to radians correctly', () => {
      expect(degreesToRadians(0)).toBe(0);
      expect(degreesToRadians(90)).toBeCloseTo(Math.PI / 2);
      expect(degreesToRadians(180)).toBeCloseTo(Math.PI);
      expect(degreesToRadians(360)).toBeCloseTo(2 * Math.PI);
    });
  });

  describe('radiansToDegrees', () => {
    it('should convert radians to degrees correctly', () => {
      expect(radiansToDegrees(0)).toBe(0);
      expect(radiansToDegrees(Math.PI / 2)).toBeCloseTo(90);
      expect(radiansToDegrees(Math.PI)).toBeCloseTo(180);
      expect(radiansToDegrees(2 * Math.PI)).toBeCloseTo(360);
    });
  });

  describe('normalizeAngle', () => {
    it('should normalize angles to 0-360 range', () => {
      expect(normalizeAngle(45)).toBe(45);
      expect(normalizeAngle(360)).toBe(0);
      expect(normalizeAngle(450)).toBe(90);
      expect(normalizeAngle(-90)).toBe(270);
      expect(normalizeAngle(-450)).toBe(270);
    });
  });

  describe('julianDate', () => {
    it('should calculate Julian date correctly', () => {
      const date = new Date('2023-01-01T00:00:00Z');
      const jd = julianDate(date);
      expect(jd).toBeCloseTo(2459945.5, 1);
    });
  });

  describe('formatTime', () => {
    it('should format decimal hours as HH:mm', () => {
      expect(formatTime(12.5)).toBe('12:30');
      expect(formatTime(6.25)).toBe('06:15');
      expect(formatTime(0.75)).toBe('00:45');
      expect(formatTime(23.95)).toBe('23:57');
    });
  });

  describe('addMinutes', () => {
    it('should add minutes to time string correctly', () => {
      expect(addMinutes('12:30', 15)).toBe('12:45');
      expect(addMinutes('23:50', 15)).toBe('00:05');
      expect(addMinutes('00:10', -15)).toBe('23:55');
    });
  });

  describe('timeFromAngle', () => {
    it('should convert hour angle to time correctly', () => {
      expect(timeFromAngle(15)).toBe(1);
      expect(timeFromAngle(30)).toBe(2);
      expect(timeFromAngle(45)).toBe(3);
    });
  });
});