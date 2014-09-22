Botinder.calculateAge = function(date) {
  var ageDifMs = Date.now() - date.getTime();
  return Math.abs(new Date(ageDifMs).getUTCFullYear() - 1970);
};

Botinder.formatDate = function(date, time) {
    var currDate = date.getDate();
    var monthName = getMonthName(date.getMonth());
    var year = date.getFullYear();
    var hours = date.getHours();
    var minutes = date.getMinutes();

    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;

    return currDate + ' ' + monthName + ' ' + year + (time ? (', ' + hours + ':' + minutes) : '');
};

function getMonthName(month) {
    var ar = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
    return ar[month];
}

Botinder.formatBio = function(raw_text) {
    return formatted_text.replace(/\n/g, '<br />');
}
