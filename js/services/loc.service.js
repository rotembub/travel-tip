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