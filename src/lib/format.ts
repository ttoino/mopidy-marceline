const durationFormat = new Intl.DurationFormat("en", {
    fractionalDigits: 0,
    hours: "numeric",
    hoursDisplay: "auto",
    minutes: "numeric",
    minutesDisplay: "always",
    seconds: "2-digit",
    secondsDisplay: "always",
});

const dateFormat = new Intl.DateTimeFormat("en", {
    dateStyle: "long",
});

const dateTimeFormat = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
});

const dateRelativeFormat = new Intl.RelativeTimeFormat("en", {
    numeric: "auto",
    style: "short",
});

export const formatDuration = (duration: number) =>
    durationFormat.format({
        hours: Math.floor(duration / 3600000),
        milliseconds: duration % 60000,
        minutes: Math.floor(duration / 60000) % 60,
    });

export const formatDate = (date: Date) => dateFormat.format(date);

export const formatDateTime = (date: Date) => dateTimeFormat.format(date);

export const formatDateRelative = (date: Date, to = new Date()) => {
    const format = (value: number, unit: Intl.RelativeTimeFormatUnit) =>
        dateRelativeFormat.format(value, unit).split(/\./)[0];

    const secDiff = Math.floor((date.getTime() - to.getTime()) / 1000);

    if (Math.abs(secDiff) < 60) return format(secDiff, "second");

    const minDiff = Math.floor(secDiff / 60);

    if (Math.abs(minDiff) < 60) return format(minDiff, "minute");

    const hourDiff = Math.floor(minDiff / 60);

    if (Math.abs(hourDiff) < 24) return format(hourDiff, "hour");

    const dayDiff = Math.floor(hourDiff / 24);

    if (Math.abs(dayDiff) < 7) return format(dayDiff, "day");

    const weekDiff = Math.floor(dayDiff / 7);

    if (Math.abs(weekDiff) < 4) return format(weekDiff, "week");

    const monthDiff = Math.floor(dayDiff / 30);

    if (Math.abs(monthDiff) < 12) return format(monthDiff, "month");

    const yearDiff = Math.floor(dayDiff / 365);

    return format(yearDiff, "year");
};
