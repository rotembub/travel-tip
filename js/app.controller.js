import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'
import { storageService } from './services/storage.service.js'

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onMapClick = onMapClick; ////////////
window.onDeleteLocation = onDeleteLocation; ////////////
window.onChangeName = onChangeName; ////////////

function onInit() {
    var locs = storageService.load('locations');
    if (locs) {
        locService.setLocations(locs);
        renderTable(locs);
    }
    mapService.initMap()
        .then((res) => {
            let infoWindow = new google.maps.InfoWindow({
                content: "Click the map to get Lat/Lng!",
                position: { lat: 32.0749831, lng: 34.9120554 },
            });
            res.addListener("click", (mapsMouseEvent) => {
                locService.addLocation(prompt('enter the name'), mapsMouseEvent.latLng.lat(), mapsMouseEvent.latLng.lng(), 'cold');
                onGetLocs();
                console.log(mapsMouseEvent.latLng.lat(), mapsMouseEvent.latLng.lng()); ////////////
                // Close the current InfoWindow.
                infoWindow.close();
                // Create a new InfoWindow.
                infoWindow = new google.maps.InfoWindow({
                    position: mapsMouseEvent.latLng,
                });
                infoWindow.setContent(
                    JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
                );
                infoWindow.open(res);
            });


            console.log(res);
            console.log('Map is ready');
        })
        .catch(() => console.log('Error: cannot init map'));
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddMarker() {
    console.log('Adding a marker');
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
}

function onGetLocs() {
    var locations = storageService.load('locations');
    if (locations) {
        renderTable(locations);
        return;
    }
    locService.getLocs()
        .then(locs => {
            console.log('Locations:', locs)
                // onSortTable(locs); ///////////////
            renderTable(locs); ////////
            // document.querySelector('.locs').innerText = JSON.stringify(locs)
        })
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords);
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            document.querySelector('.user-pos').innerText =
                `Latitude: ${lat} - Longitude: ${lng}`
            onPanTo(lat, lng);
        })
        .catch(err => {
            console.log('err!!!', err);
        })
}

function onPanTo(lat, lng) {
    console.log('Panning the Map');
    mapService.panTo(lat, lng);
}
// make it better:
function onMapClick(ev) {
    console.log('hi im here');
    console.log(ev);

}

function renderTable(locs) {
    const strHtml = locs.map(location => {
        return `
       <tr>
       <td>${location.id}</td>
       <td>${location.name}</td>
       <td>${location.lat}</td>
       <td>${location.lng}</td>
       <td>${location.weather}</td>
       <td>${location.createdAt}</td>
       <td>${location.updatedAt}</td>
       <td><button onclick="onPanTo(${location.lat},${location.lng})">Go To!</td>
       <td><button onclick="onDeleteLocation('${location.id}')">Delete</td>
       <td><button onclick="onChangeName('${location.id}')">Change Name</td>
       </tr> 
       `
    });
    document.querySelector('.table-details').innerHTML = strHtml.join('');
}
/////////////////////////////////////////
var fakePlaces = [
        { id: 1, name: 'Greatplace', lat: 32.947104, lng: 34.832384, weather: 'cold', createdAt: 'today', updatedAt: 'now' },
        { id: 2, name: 'white', lat: 32.047104, lng: 33.132222, weather: 'cold', createdAt: 'today', updatedAt: 'now' },
        { id: 3, name: 'notnow', lat: 31.147104, lng: 34.800000, weather: 'cold', createdAt: 'today', updatedAt: 'now' },
        { id: 4, name: 'asdwe', lat: 32.547104, lng: 33.932384, weather: 'cold', createdAt: 'today', updatedAt: 'now' },
    ] /////////////////////////////////////////////

// REMINDER: I think its all needs to be done with promises just like onGetLocs not 100% sure tho
function onDeleteLocation(id) {
    locService.removeLocationById(id); // might need to be a promise 
    onGetLocs();
}

function onChangeName(id) {
    locService.updateLocDateById(id);
}




function onSortTable(locs) {
    // var locs = locService.getLocs()
    switch (gSortBy) {
        case 'Id':
            locs.sort((a, b) => { a.id < b.id });
            break;
        case 'Name':
            locs.sort((a, b) => {
                if ((a.name).toUpperCase() > (b.name).toUpperCase()) return 1;
                else return -1;
            });
            break;
        case 'Lat':
            locs.sort((a, b) => a.id - b.id);
            break;
        case 'Lng':
            locs.sort((a, b) => a.id - b.id);
            break;
        case 'Weather':
            locs.sort((a, b) => a.id - b.id);
            break;
        case 'Created':
            locs.sort((a, b) => a.id - b.id);
            break;
        case 'UpdatedAt':
            locs.sort((a, b) => a.id - b.id);
            break;
    }
    renderTable(locs)
}



function onUserNameInput() {

}

function onAskName() {
    //opens modal
    return Promise.resolve
}

function onSetName() {
    onAskName()
        .then(name => { name })
    locService.addLocation(prompt('enter the name'), mapsMouseEvent.latLng.lat(), mapsMouseEvent.latLng.lng(), 'cold')
}

function toggleModal() {
    document.querySelector('.modal');
}











// function onDecision(decision) {
//     gResolve(decision);
//     toggleDeleteModal();
// }

// function askUser() {
//     toggleDeleteModal();
//     return new Promise((resolve, reject) => {
//         gResolve = resolve;
//     })
// }

// function onDeleteHistory() {
//     askUser()
//         .then(decision => {
//             if (decision) {
//                 console.log('Deleting history');
//                 gSearches = [];
//                 renderSearchWords();
//             } else console.log('History kept!');
//         })
//         .catch(err => {
//             console.log('Error:', err);
//         })
// }