import { MethodAngles, CalculationMethod } from './types';

export const CALCULATION_METHODS: Record<CalculationMethod, MethodAngles | null> = {
  MWL: { fajr: 18, isha: 17 },
  ISNA: { fajr: 15, isha: 15 },
  Egypt: { fajr: 19.5, isha: 17.5 },
  Makkah: { fajr: 18.5, isha: 18.5 },
  Karachi: { fajr: 18, isha: 18 },
  Custom: null,
};

export function getMethodAngles(method: CalculationMethod, customFajr?: number, customIsha?: number): MethodAngles {
  if (method === 'Custom') {
    if (customFajr === undefined || customIsha === undefined) {
      throw new Error('Custom method requires both fajrAngle and ishaAngle to be specified');
    }
    return { fajr: customFajr, isha: customIsha };
  }

  const angles = CALCULATION_METHODS[method];
  if (!angles) {
    throw new Error(`Invalid calculation method: ${method}`);
  }

  return angles;
}