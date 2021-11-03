export const locService = {
    getLocs,
    addLocation,
    removeLocationById,
    loadLocations,
    updateLocDateById,
    setLocations
}

import { storageService } from './storage-service.js'
import { utilService } from './util.service.js'
// was const
var locs = [
    // { name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
    // { name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
]

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 2000)
    });
}

function addLocation(name, lat, lng, weather) {
    const id = utilService.makeId();
    const currTime = utilService.convertMillisToDate(Date.now());
    locs.push({ id, name, lat, lng, weather, createdAt: currTime, updatedAt: currTime });
    storageService.save('locations', locs)
}

function removeLocationById(id) {
    const index = locs.findIndex(loc => loc.id === id);
    locs.splice(index, 1);
    storageService.save('locations', locs)
}

function loadLocations() {
    locs = storageService.load('locations');
}

//unit-test
// addLocation('evg', 123.123, 234.234, 'cold');
// console.log('locs', locs);
// setTimeout(() => {
//     updateLocDateById('evg');
//     console.log('locs', locs);
// }, 5000);

//FIX TO ID
function updateLocDateById(id) {
    var location = locs.find(loc => loc.id === id);
    location.updatedAt = utilService.convertMillisToDate(Date.now());
    storageService.save('locations', locs);
}

function setLocations(locations) {
    locs = locations;
}