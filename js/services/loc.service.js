export const locService = {
    getLocs,
    addLocation,
    removeLocationById,
    loadLocations,
}

import { storageService } from './storage-service.js'
import { utilService } from './util.service.js'


var locs = [];

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
    locs.push({ id, name, lat, lng, weather, createdAt: currTime });
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
