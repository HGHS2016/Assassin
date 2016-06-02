// repeat the following code for each countdown timer on your page
var month = '*'; // 1 through 12 or '*' within the next month, '0' for the current month
var day = '1';   // day of month or + day offset
var dow = 0;     // day of week sun=1 sat=7 or 0 for whatever day it falls on
var hour = 14;    // 0 through 23 for the hour of the day
var min = 0;    // 0 through 59 for minutes after the hour
var tz = 10;     // offset in hours from UTC to your timezone
var lab = 'cd';  // id of the entry on the page where the counter is to be inserted
//display
// end of code to be repeated

// Countdown Javascript
// copyright 20th April 2005, 11th March 2011 by Stephen Chapman
// permission to use this Javascript on your web page is granted
// provided that all of the code in this script (including these
// comments) is used without any alteration
// you may change the start function if required

function setC(month, day, dow, hour, tz) {
    "use strict";
    var toDate = new Date(),
        fromDate = new Date(),
        diffDate = new Date(0),
        day1 = parseInt(day.substr(1), 10);
    if (day.substr(0, 1) === '+') {
        //var day1 = parseInt(day.substr(1), 10);//10 was added, not sure what it means, but it got rid of the error
        toDate.setDate(toDate.getDate() + day1);
    } else {
        toDate.setDate(day);
    }
    if (month === '*') {
        toDate.setMonth(toDate.getMonth() + 1);
    } else if (month > 0) {
        if (month <= toDate.getMonth()) {
            toDate.setFullYear(toDate.getFullYear() + 1);
        }
        toDate.setMonth(month - 1);
    }
    if (dow > 0) {
        toDate.setDate(toDate.getDate() + (dow - 1 - toDate.getDay()) % 7);
    }
    toDate.setHours(hour);
    toDate.setMinutes(min - (tz * 60));
    toDate.setSeconds(0);
    //var fromDate = new Date(),
        //diffDate = new Date(0);
    fromDate.setMinutes(fromDate.getMinutes() + fromDate.getTimezoneOffset());
    //var diffDate = new Date(0);
    diffDate.setMilliseconds(toDate - fromDate);
    return Math.floor(diffDate.valueOf() / 1000);
}
function setCountdown(month, day, dow, hour, min, tz) {
    "use strict";
    var m = month,
        c = setC(m, day, dow, hour, tz);
    if (month === '*') {
        m = 0;
    }
    //var c = setC(m, day, dow, hour, tz);
    if (month === '*' && c < 0) {
        c = setC('*', day, dow, hour, tz);
    }
    return c;
}
function displayCountdown(countdn, cd) {
    "use strict";
    if (countdn < 0) {
        document.getElementById(cd).innerHTML = "Sorry, you are too late.";
    } else {
        var secs = countdn % 60,
            countdn1 = (countdn - secs) / 60,
            mins = countdn1 % 60,
            hours = countdn1 % 24,
            days = (countdn1 - hours) / 24;
        if (secs < 10) {
            secs = '0' + secs;
        }
        //var countdn1 = (countdn - secs) / 60;
        //var mins = countdn1 % 60;
        if (mins < 10) {
            mins = '0' + mins;
        }
        countdn1 = (countdn1 - mins) / 60;
        //var hours = countdn1 % 24;
        //var days = (countdn1 - hours) / 24;
        document.getElementById(cd).innerHTML = days + ' days + ' + hours + ' : ' + mins + ' : ' + secs;
        setTimeout('displayCountdown(' + (countdn - 1) + ',\'' + cd + '\');', 999);
    }
}
displayCountdown(setCountdown(month, day, dow, hour, min, tz), lab);