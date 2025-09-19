import { CALCULATION_METHODS, getMethodAngles } from '../src/methods';
import { CalculationMethod } from '../src/types';

describe('Calculation Methods', () => {
  describe('CALCULATION_METHODS', () => {
    it('should contain all required calculation methods', () => {
      const expectedMethods: CalculationMethod[] = ['MWL', 'ISNA', 'Egypt', 'Makkah', 'Karachi', 'Custom'];

      expectedMethods.forEach(method => {
        expect(CALCULATION_METHODS).toHaveProperty(method);
      });
    });

    it('should have correct angle values for predefined methods', () => {
      expect(CALCULATION_METHODS.MWL).toEqual({ fajr: 18, isha: 17 });
      expect(CALCULATION_METHODS.ISNA).toEqual({ fajr: 15, isha: 15 });
      expect(CALCULATION_METHODS.Egypt).toEqual({ fajr: 19.5, isha: 17.5 });
      expect(CALCULATION_METHODS.Makkah).toEqual({ fajr: 18.5, isha: 18.5 });
      expect(CALCULATION_METHODS.Karachi).toEqual({ fajr: 18, isha: 18 });
      expect(CALCULATION_METHODS.Custom).toBeNull();
    });
  });

  describe('getMethodAngles', () => {
    it('should return correct angles for predefined methods', () => {
      expect(getMethodAngles('MWL')).toEqual({ fajr: 18, isha: 17 });
      expect(getMethodAngles('ISNA')).toEqual({ fajr: 15, isha: 15 });
      expect(getMethodAngles('Egypt')).toEqual({ fajr: 19.5, isha: 17.5 });
    });

    it('should return custom angles when method is Custom', () => {
      expect(getMethodAngles('Custom', 20, 16)).toEqual({ fajr: 20, isha: 16 });
    });

    it('should throw error when Custom method is used without angles', () => {
      expect(() => getMethodAngles('Custom')).toThrow('Custom method requires both fajrAngle and ishaAngle to be specified');
      expect(() => getMethodAngles('Custom', 20)).toThrow('Custom method requires both fajrAngle and ishaAngle to be specified');
    });
  });
});