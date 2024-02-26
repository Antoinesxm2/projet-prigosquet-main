Vue.createApp({
    data() {
        return {
            lat_or:'',
            lon_or:'',
            lat: '',
            lon: '',
            map: null,
            pointLayer: null,
            followPoint: false,
            intervalId: null,
            selectedZoom:'',
            url:'',
        };
    },
    mounted() {
        this.initMap();
        this.startFetching();
    },
    methods: {
        initMap() {
            this.map = new ol.Map({
                target: 'map',
                view: new ol.View({
                    center: ol.proj.fromLonLat([2.35, 48.85]),
                    zoom: 3,
                }),
                layers: [
                    new ol.layer.Tile({
                        source: new ol.source.XYZ({
                            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                            maxZoom: 19,
                            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                        }),
                    }),
                ],
            });

            this.pointLayer = new ol.layer.Vector({
                source: new ol.source.Vector(),
                style: new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 5,
                        fill: new ol.style.Fill({
                            color: 'red',
                        }),
                        stroke: new ol.style.Stroke({
                            color: 'white',
                            width: 2,
                        }),
                    }),
                }),
            });

            this.orbitLayer = new ol.layer.Vector({
                source: new ol.source.Vector(),
                style: new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: 'orange',
                        width: 2,
                    }),
                }),
            });
            this.map.addLayer(this.pointLayer);
            this.map.addLayer(this.orbitLayer);
        },

        
        
        toggleFollowPoint() {
            // Toggle the followPoint flag
            this.followPoint = !this.followPoint;
        },

        Tweet() {
            var form = document.getElementById('tweet');
            console.log(form)
            var listener = form.addEventListener('submit', (event) => {
                this.url = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/" + this.lat + "/" + this.lon + "/" + this.selectedZoom;
                console.log(this.url);
                event.preventDefault();
                
                // Optionally, you can perform other actions here before preventing submission,
                // such as form validation or data manipulation.
        
                // If you don't want any action to occur, you can leave this event handler empty.
            });
        },

        startFetching() {
            this.intervalId = setInterval(() => {
                this.recherche();
                this.recherche_orbite();
            }, 1000);
        },
        
        stopFetching() {
            clearInterval(this.intervalId);
        },
        updatePoint() {
            if (this.map && this.lat !== '' && this.lon !== '') {
                const tile = this.getTile([parseFloat(this.lat), parseFloat(this.lon)]);
                const lonlat = [parseFloat(this.lon), parseFloat(this.lat)];
                const transformedCoordinates = ol.proj.fromLonLat(lonlat);

                this.pointLayer.getSource().clear();

                const feature = new ol.Feature({
                    geometry: new ol.geom.Point(transformedCoordinates),
                });

                this.pointLayer.getSource().addFeature(feature);
                if (this.followPoint) {
                    // Center the map view around the point
                    this.map.getView().setCenter(transformedCoordinates);
                }
            }
        },

        recherche() {
            this.apiUrl = "http://api.open-notify.org/iss-now.json";
            fetch(this.apiUrl)
                .then(response => response.json())
                .then(data => {
                    const { latitude, longitude } = data.iss_position;

                    this.lat = latitude;
                    this.lon = longitude;


                    this.updatePoint();
                })
                .catch(error => {
                    console.error('Error fetching ISS coordinates:', error);
                });

        
        },

        recherche_orbite() {
            this.apiUrl = "https://dev.iamvdo.me/orbit.php";
            fetch(this.apiUrl)
                .then(response => response.json())
                .then(data => {
                    // Extract latitude and longitude arrays from orbitPoints
                    const orbitPoints = data.map(point => ({
                        latitude: point.lat,
                        longitude: point.lng
                    }));
        
                    // Create an array to hold the coordinates for the orbit
                    const coordinates = orbitPoints.map(point => [parseFloat(point.latitude), parseFloat(point.longitude)]);
        
                    // Container to store all coordinate values
                    const coordinateValues = [];
        
                    // Iterate over the coordinates array and store values in the container
                    for (let i = 0; i < coordinates.length; i++) {
                        const [latitude, longitude] = coordinates[i];
                        coordinateValues.push([longitude, latitude]); // Swap the order for ol.geom.LineString
                    }
        
                    if (coordinates.length > 0) {
                        // Create a new polyline feature using coordinateValues
                        const polylineFeature = new ol.Feature({
                            geometry: new ol.geom.LineString(coordinateValues).transform('EPSG:4326', 'EPSG:3857')
                        });
        
                        // Clear existing orbit layer source and add the new polyline feature
                        this.orbitLayer.getSource().clear();
                        this.orbitLayer.getSource().addFeature(polylineFeature);
        
                        // Update the view to fit the new orbit
                        
                    } else {
                        console.warn('No orbit coordinates available.');
                    }
        
                    
                })
                .catch(error => {
                    console.error('Error fetching orbit points:', error);
                });
        },

        getTile(latlng, zoom) {
            let xy = this.project(latlng[0], latlng[1], zoom);
            return {
                x: xy.x,
                y: xy.y,
                z: zoom
            };
        },


        project(lat, lng, zoom) {
            const R = 6378137;
            let sphericalScale = 0.5 / (Math.PI * R);
            let d = Math.PI / 180,
                max = 1 - 1E-15,
                sin = Math.max(Math.min(Math.sin(lat * d), max), -max),
                scale = 256 * Math.pow(2, zoom);

            let point = {
                x: R * lng * d,
                y: R * Math.log((1 + sin) / (1 - sin)) / 2
            };

            point.x = this.tiled(scale * (sphericalScale * point.x + 0.5));
            point.y = this.tiled(scale * (-sphericalScale * point.y + 0.5));

            return point;
        },
        tiled(num) {
            return Math.floor(num / 256);
        },

        

    },
    beforeUnmount() {
        this.stopFetching();
    }
}).mount('#app');