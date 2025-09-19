import { CalculationOptions, PrayerTimes, AsrJurisdiction } from './types';
import { getMethodAngles } from './methods';
import {
  julianDate,
  sunDeclination,
  equationOfTime,
  calculateHourAngle,
  timeFromAngle,
  formatTime,
  addMinutes,
  degreesToRadians,
  radiansToDegrees,
} from './utils/astronomical';

export class PrayerTimesSDK {
  private latitude: number;
  private longitude: number;
  private date: Date;
  private timezone: number;
  private options: CalculationOptions;

  constructor(
    latitude: number,
    longitude: number,
    date: Date = new Date(),
    timezone: number,
    options: CalculationOptions
  ) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.date = date;
    this.timezone = timezone;
    this.options = options;
  }

  public getTimes(): PrayerTimes {
    const jd = julianDate(this.date);
    const declination = sunDeclination(jd);
    const eqTime = equationOfTime(jd);
    const angles = getMethodAngles(this.options.method, this.options.fajrAngle, this.options.ishaAngle);

    const dhuhr = this.calculateDhuhr(eqTime);
    const sunrise = this.calculateSunrise(declination, eqTime);
    const sunset = this.calculateSunset(declination, eqTime);
    const fajr = this.calculateFajr(declination, eqTime, angles.fajr);
    const isha = this.calculateIsha(declination, eqTime, angles.isha);
    const asr = this.calculateAsr(declination, eqTime, this.options.asrJurisdiction);

    const sunsetTime = formatTime(sunset);
    const maghribTime = sunsetTime === 'NaN:NaN' ? 'NaN:NaN' : addMinutes(sunsetTime, 1);

    return {
      fajr: formatTime(fajr),
      sunrise: formatTime(sunrise),
      dhuhr: formatTime(dhuhr),
      asr: formatTime(asr),
      maghrib: maghribTime,
      isha: formatTime(isha),
    };
  }

  private calculateDhuhr(eqTime: number): number {
    const timeCorrection = eqTime + 4 * this.longitude - 60 * this.timezone;
    const solarNoon = 12 - timeCorrection / 60;
    return solarNoon + 2 / 60;
  }

  private calculateSunrise(declination: number, eqTime: number): number {
    const hourAngle = calculateHourAngle(this.latitude, declination, -0.833);
    if (isNaN(hourAngle)) return NaN;

    const timeCorrection = eqTime + 4 * this.longitude - 60 * this.timezone;
    const sunrise = 12 - timeFromAngle(hourAngle) - timeCorrection / 60;

    return sunrise >= 0 ? sunrise : sunrise + 24;
  }

  private calculateSunset(declination: number, eqTime: number): number {
    const hourAngle = calculateHourAngle(this.latitude, declination, -0.833);
    if (isNaN(hourAngle)) return NaN;

    const timeCorrection = eqTime + 4 * this.longitude - 60 * this.timezone;
    const sunset = 12 + timeFromAngle(hourAngle) - timeCorrection / 60;
    return sunset >= 0 ? sunset : sunset + 24;
  }

  private calculateFajr(declination: number, eqTime: number, fajrAngle: number): number {
    const hourAngle = calculateHourAngle(this.latitude, declination, -fajrAngle);
    if (isNaN(hourAngle)) return NaN;

    const timeCorrection = eqTime + 4 * this.longitude - 60 * this.timezone;
    const fajr = 12 - timeFromAngle(hourAngle) - timeCorrection / 60;
    return fajr >= 0 ? fajr : fajr + 24;
  }

  private calculateIsha(declination: number, eqTime: number, ishaAngle: number): number {
    const hourAngle = calculateHourAngle(this.latitude, declination, -ishaAngle);
    if (isNaN(hourAngle)) return NaN;

    const timeCorrection = eqTime + 4 * this.longitude - 60 * this.timezone;
    const isha = 12 + timeFromAngle(hourAngle) - timeCorrection / 60;
    return isha >= 0 ? isha : isha + 24;
  }

  private calculateAsr(declination: number, eqTime: number, jurisdiction: AsrJurisdiction): number {
    const shadowFactor = jurisdiction === 'Hanafi' ? 2 : 1;
    const latRad = degreesToRadians(this.latitude);
    const decRad = degreesToRadians(declination);

    const tanAltitude = 1 / (shadowFactor + Math.tan(Math.abs(latRad - decRad)));
    const altitude = radiansToDegrees(Math.atan(tanAltitude));

    const hourAngle = calculateHourAngle(this.latitude, declination, 90 - altitude);
    if (isNaN(hourAngle)) return NaN;

    const timeCorrection = eqTime + 4 * this.longitude - 60 * this.timezone;
    const asr = 12 + timeFromAngle(hourAngle) - timeCorrection / 60;
    return asr >= 0 ? asr : asr + 24;
  }
}