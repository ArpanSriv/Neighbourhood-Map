$(document).ready(function () {
    $('#sidebarCollapse').on('click', function () {
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

    var AppViewModel = function() {
        let self = this;

        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 13,
            mapTypeControl: true,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                position: google.maps.ControlPosition.TOP_RIGHT
            },
            zoomControl: true,
            zoomControlOptions: {
                position: google.maps.ControlPosition.TOP_RIGHT
            },
            scaleControl: true,
            streetViewControl: true,
            streetViewControlOptions: {
                position: google.maps.ControlPosition.TOP_RIGHT
            }
        });

        detailInfoWindow = new google.maps.InfoWindow();
        let bounds = new google.maps.LatLngBounds();

        for (let j = 0; j < areas.length; j++) {
            let area = areas[j];
            for (let i = 0; i < area.places.length; i++) {
                let places = area.places;
                let marker = new google.maps.Marker({
                    position: places[i].location,
                    title: places[i].title,
                    animation: google.maps.Animation.DROP
                })
                markers.push(marker);
            }
        }

        for (let i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
            bounds.extend(markers[i].position);
            map.fitBounds(bounds);

            
            markers[i].addListener('mouseover', function() {

                console.log(this.title);

                clearMarkersOnMap(self.currentMarkerArray());

                self.currentMarkerArray([this])

                this.setMap(map);

                map.panTo(this.position)

                let place = getPlaceByMarker(this);

                self.currentPlace(place);

                console.log(place);

                self.displayInfoWindow(false);
            })
        }

        function getPlaceByMarker(marker) {
            for (let j = 0; j < areas.length; j++) {
                let area = areas[j];
                for (let i = 0; i < area.places.length; i++) {
                    let place = area.places[i];
                    if (place.title == marker.title) {
                        return place;
                    }
                }
            }
        }

        function toggleBounce(marker) {
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function () {
                marker.setAnimation(null);
            }, 1000)
        }

        function dropAnimate(marker) {
            marker.setAnimation(google.maps.Animation.DROP);
        }

        function getMarkerByTitle(placeName) {
            for (let i = 0; i < markers.length; i++) {
                let marker = markers[i];
                if (marker.title == placeName) {
                    return marker;
                }
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

        function clearMarkersOnMap(markersArray) {
            for (let i = 0; i < markersArray.length; i++) {
                let marker = markersArray[i];
                marker.setMap(null);
            }
        }

        function showArea(area, bounceType) {

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

        function getAreaIndexByName(areaName) {
            for (let i = 0; i < areas.length; i++) {
                let area = areas[i];

                if (area.areaName == areaName) {
                    return i;
                }
            }

            return -1;
        }

        function getMarkersByArea(areaName) {
            let areaMarkers = [];

            for (let i = 0; i < areas.length; i++) {
                let area = areas[i]
                if (area.areaName == areaName) {
                    for (let j = 0; j < area.places.length; j++) {
                        areaMarkers.push(getMarkerByTitle(area.places[j].title));
                    }
                }
            }

            return areaMarkers;
        }

        function getZomatoContent(marker) {

            //FETCH res_id
            let restaurantId = -1;

            for (let i = 0; i < areas.length; i++) {
                let area = areas[i];
                for (let j = 0; j < area.places.length; j++) {
                    let place = area.places[j];

                    if (place.title == marker.title) {
                        restaurantId = place.restaurantId;
                        break;
                    }
                }
            }

            $.ajax({
                url: "https://developers.zomato.com/api/v2.1/reviews",
                data: {
                    res_id : restaurantId
                },
                type: "GET",
                headers: {
                    'Accept' : 'application/json',
                    'user-key' : '9a501ae2899cab58f5d70ed7afe99f3a'
                },
                dataType: 'json',
                contentType: 'application/json',
                success: function(json) {
                    console.log(json);

                    let title = '<strong class="lead">' + marker.title + '</strong> <br /><br />'

                    let reviews = '<ul class="review list-group">'
                    for (var i = 0; i < json.user_reviews.length; i++) {
                        let review = json.user_reviews[i].review.review_text.substring(0, 100) + "...";

                        reviews += '<li class="list-group-item">' + review + '</li>'
                    }
                    reviews += '</ul>'

                    let footer = '<br />Powered by <a href="https://www.zomato.com"><u>Zomato</u></a>.'

                    self.currentPlaceData(title + reviews + footer);
                },
                failure: function(json) {
                    self.currentPlaceData("EDJKJEDKSJDKJD")
                }
            })
        }

        function displayMarkers(animationType) {

            let bounds = new google.maps.LatLngBounds();

            for (let i = 0; i < self.currentMarkerArray().length; i++) {
                let marker = self.currentMarkerArray()[i];
                marker.setMap(map);
                bounds.extend(marker.position);
                map.fitBounds(bounds);
                if (animationType == 'bounce') toggleBounce(marker);
                else if (animationType == 'drop') dropAnimate(marker);
            }
        }

        self.displayAreas = ko.observableArray(areas);

        self.currentArea = ko.observable();

        self.currentPlace = ko.observable();

        self.currentMarkerArray = ko.observableArray(markers);

        self.currentPlaceData = function(data) {
            detailInfoWindow.setContent(data);

            return data;
        }

        self.previewAreaOnly = function() {
            console.log(this.areaName);

            clearMarkersOnMap(self.currentMarkerArray());

            let areaMarkers = getMarkersByArea(this.areaName)

            self.currentMarkerArray(areaMarkers)

            displayMarkers('bounce');
        }

        self.showAreaOnly = function() {
            console.log(this.areaName);

            clearMarkersOnMap(self.currentMarkerArray());

            let filteredMarkers = [];

            for (let j = 0; j < self.displayAreas().length; j++) {
                let area = self.displayAreas()[j]

                if (area.areaName == this.areaName) {
                    filteredMarkers.push(...getFilteredMarkers(area.places));
                }
            }

            self.currentMarkerArray(filteredMarkers)

            displayMarkers('drop');
        }

        self.previewPlaceOnly = function() {
            console.log(this.title);

            self.currentArea(this);

            clearMarkersOnMap(self.currentMarkerArray());

            self.currentMarkerArray([getMarkerByTitle(this.title)])

            displayMarkers('bounce');

            self.displayInfoWindow(true);

            map.setZoom(13);
        }

        self.showPlaceOnly = function() {
            console.log(this.title);

            self.currentArea(this);

            clearMarkersOnMap(self.currentMarkerArray());

            let marker = getMarkerByTitle(this.title);
            marker.addListener('click', function() {
                self.displayInfoWindow(false);
            })
            self.currentMarkerArray([marker])

            displayMarkers('drop');

            self.displayInfoWindow(false);

            map.setZoom(13);
        }

        self.showAll = function() {
            detailInfoWindow.close()

            clearMarkersOnMap(self.currentMarkerArray())

            self.currentMarkerArray(markers)

            displayMarkers('drop')
        }

        self.displayInfoWindow = function(short) {
            if (self.currentMarkerArray().length == 1) {
                let currentMarker = self.currentMarkerArray()[0];

                if (short) {
                    if (detailInfoWindow.marker != currentMarker) detailInfoWindow.marker = currentMarker;

                    detailInfoWindow.setContent('<div class="info-window">' + currentMarker.title + "<br><b>Click on the title to expand</b>" + '</div>');
                    detailInfoWindow.open(map, currentMarker);
                    detailInfoWindow.addListener('closeclick', function () {
                        detailInfoWindow.setMarker = null;
                    });

                } else {
                    // detailInfoWindow.close();

                    getZomatoContent(currentMarker);
                    if (detailInfoWindow.marker != currentMarker) {
                        detailInfoWindow.marker = currentMarker;
                    }

                    detailInfoWindow.setContent('<div class="info-window"><div class="loader">' + '</div></div>');
                    detailInfoWindow.open(map, currentMarker);
                    detailInfoWindow.addListener('closeclick', function () {
                        detailInfoWindow.setMarker = null;
                    });
                }
            }
        }

        $('#search-bar').keyup(function(event) {
            let searchTerm = $('#search-bar').val();

            self.showAll();

            if (searchTerm == '') return;

            let filteredMarkers = []

            for (var i = 0; i < markers.length; i++) {
                let marker = markers[i];

                if (marker.title.includes(searchTerm)) {
                    filteredMarkers.push(marker);
                }
            }

            console.log(filteredMarkers);
            clearMarkersOnMap(self.currentMarkerArray())
            self.currentMarkerArray(filteredMarkers);
            displayMarkers('bounce')
        })

        $('#map').click(function() {
            detailInfoWindow.close()
        })
    }

    ko.applyBindings(new AppViewModel());
}
