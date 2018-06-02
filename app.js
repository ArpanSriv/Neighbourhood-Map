$(document).ready(function () {
    $('#sidebarCollapse').on('click', function () {
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
                title: 'Celebration, Mercure Lavassa',
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
                title: places[i].title

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

var AppViewModel = function() {
    let self = this;

    self.areas = areas; 

}

ko.applyBindings(new AppViewModel());
