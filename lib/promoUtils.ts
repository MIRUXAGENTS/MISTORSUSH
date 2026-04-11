export async function verifyPromoDay(): Promise<boolean> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000);

  try {
    const response = await fetch(
      'https://www.timeapi.io/api/Time/current/zone?timeZone=Asia/Jerusalem',
      { cache: 'no-store', signal: controller.signal }
    );
    if (response.ok) {
      const data = await response.json();
      clearTimeout(timeoutId);
      return data.dayOfWeek === 'Friday';
    }
    throw new Error('timeapi.io failed');
  } catch {
    // Fallback
    try {
      const backupController = new AbortController();
      const backupTimeout = setTimeout(() => backupController.abort(), 3000);
      const res = await fetch('https://worldtimeapi.org/api/timezone/Asia/Jerusalem', {
        cache: 'no-store',
        signal: backupController.signal,
      });
      clearTimeout(backupTimeout);
      if (res.ok) {
        const data = await res.json();
        return data.day_of_week === 5;
      }
    } catch {
      // ignore
    }
    return new Date().getDay() === 5;
  } finally {
    clearTimeout(timeoutId);
  }
}
