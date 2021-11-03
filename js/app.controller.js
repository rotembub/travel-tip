import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onMapClick = onMapClick; ////////////

function onInit() {
    mapService.initMap()
        .then((res) => {
            let infoWindow = new google.maps.InfoWindow({
                content: "Click the map to get Lat/Lng!",
                position: { lat: 32.0749831, lng: 34.9120554 },
            });
            res.addListener("click", (mapsMouseEvent) => {
                // Close the current InfoWindow.
                locService.addLocation(7, prompt('enter the name'), mapsMouseEvent.latLng.lat(), mapsMouseEvent.latLng.lng(), 'cold', 'now', 'now');
                console.log(mapsMouseEvent.latLng.lat(), mapsMouseEvent.latLng.lng()); ////////////
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
    // locService.loadLocations();
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
    locService.getLocs()
        .then(locs => {
            console.log('Locations:', locs)
            document.querySelector('.locs').innerText = JSON.stringify(locs)
        })
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            onPanTo(pos.coods.latitude.pos.coods.longitude)
            console.log('User position is:', pos.coords);
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
        })
        .catch(err => {
            console.log('err!!!', err);
        })
}

function onPanTo(lat,lng) {
    console.log('Panning the Map');
    mapService.panTo(lat, lng);
}

function onMapClick(ev) {
    console.log('hi im here');
    console.log(ev);
    // console.log(infoWindow.mapsMouseEvent.latLng.lat(), infoWindow.mapsMouseEvent.latLng.lng());
}
