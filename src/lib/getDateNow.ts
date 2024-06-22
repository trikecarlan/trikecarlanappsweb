export function getFormattedDate() {
    const now = new Date();

    const days = [
        'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
    ];
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayName = days[now.getDay()];
    const day = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    let hour = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hour >= 12 ? 'PM' : 'AM';

    hour = hour % 12;
    hour = hour ? hour : 12; // the hour '0' should be '12'

    return `${dayName} ${day} ${month} ${year} at ${hour}:${minutes} ${ampm}`;
}
