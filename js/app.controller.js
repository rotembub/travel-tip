import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'
import { storageService } from './services/storage.service.js'

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onDeleteLocation = onDeleteLocation;
window.onGetCoordByAddress = onGetCoordByAddress;
window.onCopyLink = onCopyLink;
window.onUserNameInput = onUserNameInput;

var gResolve;

function onInit() {
    console.log('Init....')
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
                onAddMarker(mapsMouseEvent.latLng.lat(), mapsMouseEvent.latLng.lng());
                // locService.addLocation(prompt('enter the name'), mapsMouseEvent.latLng.lat(), mapsMouseEvent.latLng.lng(), 'cold');
                onGetLocs();
                onSetName(mapsMouseEvent.latLng.lat(), mapsMouseEvent.latLng.lng());
                // Close the current InfoWindow.
                infoWindow.close();
                infoWindow = new google.maps.InfoWindow({
                    position: mapsMouseEvent.latLng,
                });
                // Evgeny I put these next lines of code in a comment so we wont have that annoying lil window opens everytime we click on the map

                // infoWindow.setContent(
                //     JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
                // );
                // infoWindow.open(res);

            });


            console.log(res);
            console.log('Map is ready');
            loadCurrLocationFromURL();
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

function onAddMarker(lat, lng) {
    console.log('Adding a marker');
    mapService.addMarker({ lat, lng });
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
            renderTable(locs);
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

function renderTable(locs) {
    const strHtml = locs.map(location => {
        return `
       <tr>
       <td>${location.id}</td>
       <td>${location.name}</td>
       <td>${location.lat.toFixed(2)}</td>
       <td>${location.lng.toFixed(2)}</td>
       <td>${location.weather}</td>
       <td>${location.createdAt}</td>
       <td><button onclick="onPanTo(${location.lat},${location.lng})">Go To!</td>
       <td><button onclick="onDeleteLocation('${location.id}')">Delete</td>
       </tr> 
       `
    });
    document.querySelector('.table-details').innerHTML = strHtml.join('');
}

function onDeleteLocation(id) {
    locService.removeLocationById(id);
    onGetLocs();
}

function onGetCoordByAddress() {
    var address = document.querySelector('.address-input').value;
    console.log(address);
    if (!address) return;
    mapService.getCoordByAddress(address)
        .then(res => {
            onPanTo(res.lat, res.lng);
            locService.addLocation(address, res.lat, res.lng, 'windy');
            onGetLocs();
        })
        .catch(console.log)
}

function onCopyLink() {
    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords);
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            navigator.clipboard.writeText(`https://rotembub.github.io/travel-tip/?lat=${lat}?lng=${lng}`);
        })
        .catch(err => {
            console.log('err!!!', err);
        })
    /* Copy the text inside the text field */
}

function loadCurrLocationFromURL() {
    const params = new URLSearchParams(window.location.search);
    console.log('params', params);
    console.log('has lat : ' + params.has('lat'));
    console.log('has lng : ' + params.has('lng'));
    if (params.has('lat') && params.has('lng')) {
        const lat = +params.get('lat');
        const lng = +params.get('lng');
        console.log('lat', lat);
        console.log('lng', lng);
        onPanTo(lat, lng);
    }
}

// modal
function onUserNameInput(confirm) {
    if (!confirm) {
        toggleModal();
        return;
    }
    var name = document.querySelector('.modal input').value;
    if (!name) return;
    gResolve(name);
    toggleModal();
}

function onAskName() {
    //opens modal
    toggleModal();
    return new Promise((resolve, reject) => {
        gResolve = resolve;
    })
}

function onSetName(lat, lng) {
    onAskName()
        .then(name => {
            locService.addLocation(name, lat, lng, 'cold');
            onGetLocs(); // need to change to render later
        })
        .catch(err => {
            console.log('ERROR:', err);
        })
}

function toggleModal() {
    document.querySelector('.modal').classList.toggle('show');
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