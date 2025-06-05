// it will end when the date starts
export function secondsLeft(date:Date|undefined) {
    // Get current date and time
    let currentDate = new Date();
    // Clone the input date to prevent modifying the original
    let endDate = date ? new Date(date) : new Date();
    // Set the time to the end of the day (23:59:59:999)
    endDate.setHours(23, 59, 59, 999);
    console.log("the end date is",endDate);
    console.log("the current date is",currentDate);
    
    // Calculate the difference in milliseconds between now and the end of the input date's day
    let difference = endDate.getTime() - currentDate.getTime();
    
    // Convert milliseconds to seconds and return
    return Math.ceil(difference / 1000); // Round up to the nearest second
}

export function getFormattedDate(date:Date) {
    var year = date.getFullYear();
    var month = (date.getMonth() + 1).toString().padStart(2, '0');
    var day = date.getDate().toString().padStart(2, '0');
    return `${day}/${month}/${year}`;
}
