export function calculateTimeRemaining(targetDateIso: string, nowMs?: number) {
    const target = new Date(targetDateIso).getTime();
    const now = nowMs ?? new Date().getTime();
    const difference = target - now;

    if (difference <= 0) {
        return { isPast: true, days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: difference };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return {
        isPast: false,
        days, hours, minutes, seconds,
        totalMs: difference
    };
}

export function determineUrgency(timeRemainingInfo: ReturnType<typeof calculateTimeRemaining>) {
    if (timeRemainingInfo.isPast) return 'past';

    const { days } = timeRemainingInfo;
    if (days < 1) return 'imminent';      // < 24 hours
    if (days <= 7) return 'approaching';  // <= 1 week
    if (days <= 30) return 'medium';      // <= 1 month
    return 'far';                         // > 1 month
}

export function calculateProgress(createdAtIso: string, targetDateIso: string, nowMs?: number) {
    const created = new Date(createdAtIso).getTime();
    const target = new Date(targetDateIso).getTime();
    const now = nowMs ?? new Date().getTime();

    if (now >= target) return 100;
    if (now <= created) return 0;

    const totalDuration = target - created;
    const elapsed = now - created;
    return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
}

export function formatDateTimeUI(isoStr: string) {
    const d = new Date(isoStr);
    return new Intl.DateTimeFormat('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: 'numeric', minute: '2-digit'
    }).format(d);
}
