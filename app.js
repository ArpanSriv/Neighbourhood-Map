$(document).ready(function () {
    $('#sidebarCollapse').on('hover', function () {
        $('#sidebar').toggleClass('active');
    });
});

let map;
let markers = [];
let detailInfoWindow;

let areas = [
    {
        areaName: "Pune", //cityID = 5 on Zomato
        places: [
            {
                title: 'Kinara Village Dhaba, Lonavla',
                location: {lat: 18.7620724, lng: 73.4550036},
                areaIndex: 0,
                restaurantId: 13054
            },
            {
                title: 'Latitude, Vivanta By Taj, Pune',
                location: {lat: 18.538199, lng: 73.886309},
                areaIndex: 0,
                restaurantId: 11080

            },
            {
                title: 'Celebration, Mercure, Lavassa',
                location: {lat: 18.410252, lng: 73.509065},
                areaIndex: 0,
                restaurantId: 6507786
            },
            {
                title: 'Blue Water, Pune',
                location: {lat: 18.636266, lng: 73.751372},
                areaIndex: 0,
                restaurantId: 18292672
            }
        ]
    },
    {
        areaName: "Mumbai", //cityID = 3 on Zomato
        places: [
            {
                title: 'JW Café, JW Mariott, Juhu',
                location: {lat: 19.103316, lng: 72.877625},
                areaIndex: 1,
                restaurantId: 16557012
            },
            {
                title: 'Pizza By The Bay, Marine Lines',
                location: {lat: 18.933390, lng: 72.823847},
                areaIndex: 1,
                restaurantId: 34396
            },
            {
                title: 'Peshawri, ITC Maratha, Mumbai',
                location: {lat: 19.103992, lng: 72.869819},
                areaIndex: 1,
                restaurantId: 38410
            },
            {
                title: 'Celini, Grand Hyatt, Mumbai',
                location: {lat: 19.076962, lng: 72.851678},
                areaIndex: 1,
                restaurantId: 38062
            }
        ]
    },
    {
        areaName: "Bangalore", //cityID = 4 on Zomato
        places: [
            {
                title: 'Karavalli, Bangalore',
                location: {lat: 12.972320, lng: 77.608621},
                areaIndex: 2,
                restaurantId: 50565
            },
            {
                title: 'Windmills Craftworks, Bangalore',
                location: {lat: 12.982396, lng: 77.721873},
                areaIndex: 2,
                restaurantId: 53872
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
                    populateInfoWindow(marker, detailInfoWindow)
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

    function getZomatoContent(marker) {
        //// TODO: Fetch data from Zomato API
        return "Data returned  by zomato comes here."
    }

    function showPlace(place, bounceType) {

        let bounds = new google.maps.LatLngBounds();

        clearMarkersOnMap();

        let currentMarker = getMarkerByTitle(place.title);

        currentMarker.setMap(map);

        bounds.extend(currentMarker.position);
        map.fitBounds(bounds);
        map.setZoom(13);

        if (bounceType == 'bounce') {
            toggleBounce(currentMarker);
        }

        else if (bounceType == 'drop') {
            dropAnimate(currentMarker);

            getZomatoContent(currentMarker);

            populateInfoWindow(currentMarker, detailInfoWindow);
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

    function getAreaIndexByName(areaName) {
        for (let i = 0; i < areas.length; i++) {
            let area = areas[i];

            if (area.areaName == areaName) {
                return i;
            }
        }

        return -1;
    }

    function displayMarkers(filteredMarkers, animationType) {
        for (let i = 0; i < filteredMarkers.length; i++) {
            let marker = filteredMarkers[i];
            marker.setMap(map);
            bounds.extend(marker.position);
            map.fitBounds(bounds);
            if (animationType == 'bounce') toggleBounce(marker);
            else if (animationType == 'drop') dropAnimate(marker);
        }
    }

    var AppViewModel = function() {
        let self = this;

        self.displayAreas = ko.observableArray(areas);

        self.currentArea = ko.observable();

        self.currentPlace = ko.observable();

        self.currentMarkerArray = ko.observableArray();

        //Index of current marker in currentMarkerArray observable.
        self.currentMarkerIndex = ko.observable();

        self.currentPlaceData = ko.computed(function() {
            let data = getZomatoContent(self.currentMarkerArray()[self.currentMarkerIndex()]);
            return data;
        })

        // self.previewAreaOnly = function() {
        //     showArea(this, 'bounce');
        // }

        self.showAreaOnly = ko.computed(function() {
            // self.displayAreas([]);
            self.displayAreas().push(area);

            // showArea(this, 'drop');

            let bounds = new google.maps.LatLngBounds();

            clearMarkersOnMap();

            for (let j = 0; j < self.displayAreas().length; j++) {
                let area = self.displayAreas()[j]

                let filteredMarkers = getFilteredMarkers(area.places);
            }

            displayMarkers(filteredMarkers, 'drop');

        })

        self.previewPlaceOnly = function() {
            // showPlace(this, 'bounce');
        }

        self.showPlaceOnly = function() {
            showPlace(this, 'drop');
        }

        self.displayInfoWindow = function() {

        }
    }

    ko.applyBindings(new AppViewModel());
}
