interface CalendarDaySource {
    date: string;
    status: 'working' | 'off' | 'holiday' | 'pending';
    isToday: boolean;
    isHoliday: boolean;
}

export interface MiniCalendarDayView {
    key: string;
    day: string;
    isWorkday?: boolean;
    isHoliday?: boolean;
    isToday?: boolean;
}

export const buildMiniCalendarDays = (
    days: ReadonlyArray<CalendarDaySource>,
): MiniCalendarDayView[] => {
    if (days.length === 0) return [];

    const firstDate = new Date(`${days[0].date}T00:00:00`);
    const leadingBlanks: MiniCalendarDayView[] = Array.from(
        { length: firstDate.getDay() },
        (_, i) => ({ key: `blank-${i}`, day: '' }),
    );

    const mapped: MiniCalendarDayView[] = days.map((d) => ({
        key: d.date,
        day: String(new Date(`${d.date}T00:00:00`).getDate()),
        isWorkday: d.status === 'working',
        isHoliday: d.isHoliday,
        isToday: d.isToday,
    }));

    return [...leadingBlanks, ...mapped];
};
