$(document).ready(function () {
    $('#sidebarCollapse').on('hover', function () {
        $('#sidebar').toggleClass('active');
    });
});

let map;
let markers = [];
let detailInfoWindow;

// let area = [
//     "Pune",
//     "Mumbai",
//     "Bangalore"
// ];
//
// let places = [
//     {
//         title: 'Kinara Village Dhaba, Lonavla',
//         location: {lat: 18.7620724, lng: 73.4550036},
//         areaIndex: 0
//     },
//     {
//         title: 'The Grapevine Restaurant, Mahabaleshwar',
//         location: {lat: 17.9254536, lng: 73.6581025},
//         areaIndex: 0
//     },
//     {
//         title: 'Celebration, Mercure Lavassa',
//         location: {lat: 18.410252, lng: 73.509065},
//         areaIndex: 0
//     },
//     {
//         title: 'Blue Water, Pune',
//         location: {lat: 18.636266, lng: 73.751372},
//         areaIndex: 0
//     },
//     {
//         title: 'JW Mariott, Mumbai',
//         location: {lat: 19.101910, lng: 72.826301},
//         areaIndex: 1
//     },
//     {
//         title: 'Marine Drive, Mumbai',
//         location: {lat: 18.943213, lng: 72.823000},
//         areaIndex: 1
//     },
//     {
//         title: 'ITC Maratha, Mumbai',
//         location: {lat: 19.103992, lng: 72.869819},
//         areaIndex: 1
//     },
//     {
//         title: 'Celini, Mumbai',
//         location: {lat: 19.076962, lng: 72.851678},
//         areaIndex: 1
//     },
//     {
//         title: 'Karavalli, Bangalore',
//         location: {lat: 12.972320, lng: 77.608621},
//         areaIndex: 2
//     },
//     {
//         title: 'Windmills Craftworks',
//         location: {lat: 12.982396, lng: 77.721873},
//         areaIndex: 2
//     },
// ];

let areas = [
    {
        areaName: "Pune",
        places: [
            {
                title: 'Kinara Village Dhaba, Lonavla',
                location: {lat: 18.7620724, lng: 73.4550036},
                areaIndex: 0
            },
            {
                title: 'The Grapevine Restaurant, Mahabaleshwar',
                location: {lat: 17.9254536, lng: 73.6581025},
                areaIndex: 0
            },
            {
                title: 'Celebration, Mercure, Lavassa',
                location: {lat: 18.410252, lng: 73.509065},
                areaIndex: 0
            },
            {
                title: 'Blue Water, Pune',
                location: {lat: 18.636266, lng: 73.751372},
                areaIndex: 0
            }
        ]
    },
    {
        areaName: "Mumbai",
        places: [
            {
                title: 'JW Mariott, Mumbai',
                location: {lat: 19.101910, lng: 72.826301},
                areaIndex: 1
            },
            {
                title: 'Marine Drive, Mumbai',
                location: {lat: 18.943213, lng: 72.823000},
                areaIndex: 1
            },
            {
                title: 'ITC Maratha, Mumbai',
                location: {lat: 19.103992, lng: 72.869819},
                areaIndex: 1
            },
            {
                title: 'Celini, Mumbai',
                location: {lat: 19.076962, lng: 72.851678},
                areaIndex: 1
            }
        ]
    },
    {
        areaName: "Bangalore",
        places: [
            {
                title: 'Karavalli, Bangalore',
                location: {lat: 12.972320, lng: 77.608621},
                areaIndex: 2
            },
            {
                title: 'Windmills Craftworks',
                location: {lat: 12.982396, lng: 77.721873},
                areaIndex: 2
            }
        ]
    }
]

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.TOP_RIGHT
        },
        zoomControl: true,
        zoomControlOptions: {
            position: google.maps.ControlPosition.LEFT_CENTER
        },
        scaleControl: true,
        streetViewControl: true,
        streetViewControlOptions: {
            position: google.maps.ControlPosition.BOTTOM_RIGHT
        }
    });
    detailInfoWindow = new google.maps.InfoWindow();
    initPlaces();
}

function initPlaces() {

    let bounds = new google.maps.LatLngBounds();

    for (let j = 0; j < areas.length; j++) {
        let area = areas[j];
        for (let i = 0; i < area.places.length; i++) {
            let places = area.places;
            let marker = new google.maps.Marker({
                position: places[i].location,
                title: places[i].title,
                animation: google.maps.Animation.DROP
            });
            markers.push(marker);
            marker.addListener('click', function () {
                populateInfoWindow(markers[i], detailInfoWindow)
            });
        }
    }

    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
        map.fitBounds(bounds);
    }


}

function toggleBounce(marker) {
    // if (marker.getAnimation() !== null) {
    //     marker.setAnimation(null);
    // } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    // }
}

function dropAnimate(marker) {
    // if (marker.getAnimation() !== null) {
    //     marker.setAnimation(null);
    // } else {
    marker.setAnimation(google.maps.Animation.DROP);
    // }
}

function getMarkerByTitle(placeName) {
    for (let i = 0; i < markers.length; i++) {
        let marker = markers[i];
        if (marker.title == placeName) {
            return marker;
        }
    }
}

function populateInfoWindow(marker, infowindow) {
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        infowindow.setContent('<div>' + marker.title + '</div>');
        infowindow.open(map, marker);
        infowindow.addListener('closeclick', function () {
            infowindow.setMarker = null;
        });
    }
}

function getFilteredMarkers(places) {
    let filteredMarkers = [];

    for (let i = 0; i < places.length; i++) {
        let place = places[i];

        for (var j = 0; j < markers.length; j++) {
            let marker = markers[j];

            if (marker.title == place.title) {
                filteredMarkers.push(marker);
            }
        }
    }

    return filteredMarkers;
}

function clearMarkersOnMap() {
    for (let i = 0; i < markers.length; i++) {
        let marker = markers[i];
        marker.setMap(null);
    }
}

function showArea(area, bounceType) {

    let bounds = new google.maps.LatLngBounds();

    // alert(area.places.length);
    // for (let i = 0; i < area.places.length; i++) {
    //     let place = area.places[i];
    //     alert(place.title);
    // }

    clearMarkersOnMap();

    let filteredMarkers = getFilteredMarkers(area.places);

    for (let i = 0; i < filteredMarkers.length; i++) {
        let marker = filteredMarkers[i];
        marker.setMap(map);
        bounds.extend(marker.position);
        map.fitBounds(bounds);
        if (bounceType == 'bounce') toggleBounce(marker);
        else if (bounceType == 'drop') dropAnimate(marker);
    }
}

function showPlace(place, bounceType) {

    let bounds = new google.maps.LatLngBounds();

    // alert(area.places.length);
    // for (let i = 0; i < area.places.length; i++) {
    //     let place = area.places[i];
    //     alert(place.title);
    // }

    clearMarkersOnMap();

    let currentMarker = getMarkerByTitle(place.title);

    currentMarker.setMap(map);

    bounds.extend(currentMarker.position);
    map.fitBounds(bounds);
    map.setZoom(13);

    if (bounceType == 'bounce') {
        toggleBounce(marker);
    }

    else if (bounceType == 'drop') {
        dropAnimate(marker);
        populateInfoWindow(marker, infowindow);
    }
}

function showAll() {
    let bounds = new google.maps.LatLngBounds();

    for (let i = 0; i < markers.length; i++) {
        let marker = markers[i];
        marker.setMap(map);
        bounds.extend(marker.position);
        dropAnimate(marker);
    }

    map.fitBounds(bounds);
}

var AppViewModel = function() {
    let self = this;

    self.areas = areas;

    self.previewAreaOnly = function() {
        showArea(this, 'bounce');
    }

    self.showAreaOnly = function() {
        showArea(this, 'drop');
    }

    self.previewPlaceOnly = function() {
        showPlace(this, 'bounce');
    }

    self.showPlaceOnly = function() {
        showPlace(this, 'drop');
    }
}

ko.applyBindings(new AppViewModel());
