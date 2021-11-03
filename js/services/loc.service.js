export const locService = {
    getLocs,
    addLocation,
    removeLocationById,
    loadLocations
}
import { storageService } from './storage-service.js'

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

addLocation(111, 'asd', 123.123, 325.321, 123, Date.now(), Date.now());
addLocation(222, 'asd', 123.123, 325.321, 123, Date.now(), Date.now());
addLocation(333, 'asd', 123.123, 325.321, 123, Date.now(), Date.now());
addLocation(444, 'asd', 123.123, 325.321, 123, Date.now(), Date.now());
addLocation(555, 'asd', 123.123, 325.321, 123, Date.now(), Date.now());
console.log(locs);
removeLocationById(333);
console.log(locs)

function addLocation(id, name, lat, lng, weather, createdAt, updatedAt) {
    locs.push({ id, name, lat, lng, weather, createdAt, updatedAt });
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