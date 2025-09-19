export type CalculationMethod = 'MWL' | 'ISNA' | 'Egypt' | 'Makkah' | 'Karachi' | 'Custom';

export type AsrJurisdiction = 'Standard' | 'Hanafi';

export interface CalculationOptions {
  method: CalculationMethod;
  fajrAngle?: number;
  ishaAngle?: number;
  asrJurisdiction: AsrJurisdiction;
}

export interface PrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

export interface MethodAngles {
  fajr: number;
  isha: number;
}