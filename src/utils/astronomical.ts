export function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function radiansToDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

export function normalizeAngle(angle: number): number {
  angle = angle % 360;
  return angle < 0 ? angle + 360 : angle;
}

export function julianDate(date: Date): number {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  let adjustedYear = year;
  let adjustedMonth = month;

  if (month <= 2) {
    adjustedYear -= 1;
    adjustedMonth += 12;
  }

  const a = Math.floor(adjustedYear / 100);
  const b = 2 - a + Math.floor(a / 4);

  return Math.floor(365.25 * (adjustedYear + 4716)) +
         Math.floor(30.6001 * (adjustedMonth + 1)) +
         day + b - 1524.5;
}

export function equationOfTime(jd: number): number {
  const n = jd - 2451545.0;
  const l = normalizeAngle(280.460 + 0.9856474 * n);
  const g = degreesToRadians(normalizeAngle(357.528 + 0.9856003 * n));
  const lambda = degreesToRadians(l + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g));

  const alpha = Math.atan2(Math.cos(degreesToRadians(23.439)) * Math.sin(lambda), Math.cos(lambda));
  const deltaAlpha = l - radiansToDegrees(alpha);

  if (deltaAlpha > 180) return (deltaAlpha - 360) * 4;
  if (deltaAlpha < -180) return (deltaAlpha + 360) * 4;
  return deltaAlpha * 4;
}

export function sunDeclination(jd: number): number {
  const n = jd - 2451545.0;
  const l = normalizeAngle(280.460 + 0.9856474 * n);
  const g = degreesToRadians(normalizeAngle(357.528 + 0.9856003 * n));
  const lambda = degreesToRadians(l + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g));

  return radiansToDegrees(Math.asin(Math.sin(degreesToRadians(23.439)) * Math.sin(lambda)));
}

export function calculateHourAngle(latitude: number, declination: number, angle: number): number {
  const latRad = degreesToRadians(latitude);
  const decRad = degreesToRadians(declination);
  const angleRad = degreesToRadians(angle);

  const cosHourAngle = (Math.cos(angleRad) - Math.sin(decRad) * Math.sin(latRad)) /
                       (Math.cos(decRad) * Math.cos(latRad));

  if (Math.abs(cosHourAngle) > 1) {
    return NaN;
  }

  return radiansToDegrees(Math.acos(cosHourAngle));
}

export function timeFromAngle(hourAngle: number): number {
  return hourAngle / 15;
}

export function formatTime(hours: number): string {
  if (isNaN(hours)) return 'NaN:NaN';
  const totalMinutes = Math.round(hours * 60);
  const h = Math.floor(totalMinutes / 60) % 24;
  const m = totalMinutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

export function addMinutes(timeStr: string, minutes: number): string {
  const parts = timeStr.split(':').map(Number);
  const hours = parts[0] ?? 0;
  const mins = parts[1] ?? 0;
  let totalMinutes = hours * 60 + mins + minutes;

  while (totalMinutes < 0) {
    totalMinutes += 24 * 60;
  }

  const newHours = Math.floor(totalMinutes / 60) % 24;
  const newMins = totalMinutes % 60;
  return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`;
}