export const utilService = {
    makeId,
    convertMillisToDate
}

function makeId() {
    var txt = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return txt;
}

function convertMillisToDate(milliseconds) {
    const dateObject = new Date(milliseconds)
    return dateObject.toLocaleString()
}