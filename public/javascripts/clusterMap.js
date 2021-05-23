function getCookie(name) {
	let matches = document.cookie.match(
		new RegExp(
			'(?:^|; )' +
				name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') +
				'=([^;]*)'
		)
	);
	return matches ? decodeURIComponent(matches[1]) : undefined;
}
const geoCookie = getCookie('geolocation') + '';
let geo;
let geoCheck = false;
if (geoCookie) {
	geo = JSON.parse(JSON.stringify(geoCookie));
	if (
		geo.country_name != '' &&
		geo.country_name != 'Not found' &&
		typeof geo == 'object'
	) {
		geoCheck = true;
	}
}
const geoLong = geoCheck ? geo.longitude : 34.566667;
const geoLat = geoCheck ? geo.latitude : 40.866667;
const zoom = geoCheck ? 7 : 1.5;

mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
	container: 'cluster-map',
	style: 'mapbox://styles/vana02/cko2ik0or1v3p18le4vd6aqdo',
	center: [geoLong, geoLat],
	zoom: zoom,
	maxBounds: [
		[-180, -85],
		[180, 85]
	]
});

map.addControl(new mapboxgl.FullscreenControl(), 'bottom-right');
map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

map.on('load', function () {
	// Add a new source from our GeoJSON data and
	// set the 'cluster' option to true. GL-JS will
	// add the point_count property to your source data.
	map.addSource('campgrounds', {
		type: 'geojson',
		// Point to GeoJSON data.
		data: campgrounds,
		cluster: true,
		clusterMaxZoom: 14, // Max zoom to cluster points on
		clusterRadius: 25 // Radius of each cluster when clustering points (defaults to 50)
	});

	map.addLayer({
		id: 'clusters',
		type: 'circle',
		source: 'campgrounds',
		filter: ['has', 'point_count'],
		paint: {
			// Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
			// with three steps to implement three types of circles:
			'circle-color': [
				'step',
				['get', 'point_count'],
				'#ffff00',
				3,
				'#80ff00',
				6,
				'#00ff00',
				12,
				'#00ff80',
				24,
				'#00ffff',
				48,
				'#0080ff',
				96,
				'#0000ff',
				192,
				'#8000ff',
				384,
				'#ff00ff',
				768,
				'#ff0080',
				1024,
				'#ff0000',
				1500,
				'#ff8000'
			],
			'circle-radius': [
				'step',
				['get', 'point_count'],
				10,
				10,
				12,
				25,
				15,
				50,
				17,
				100,
				20,
				150,
				22,
				250,
				25,
				400,
				27,
				650,
				30,
				1000,
				32
			]
		}
	});

	map.addLayer({
		id: 'cluster-count',
		type: 'symbol',
		source: 'campgrounds',
		filter: ['has', 'point_count'],
		layout: {
			'text-field': '{point_count_abbreviated}',
			'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
			'text-size': 12
		}
	});

	map.addLayer({
		id: 'unclustered-point',
		type: 'symbol',
		source: 'campgrounds',
		filter: ['!', ['has', 'point_count']],
		layout: {
			'icon-image': 'campsite-15',
			'icon-size': 1
		}
	});

	// inspect a cluster on click
	map.on('click', 'clusters', function (e) {
		const features = map.queryRenderedFeatures(e.point, {
			layers: ['clusters']
		});
		const clusterId = features[0].properties.cluster_id;
		map
			.getSource('campgrounds')
			.getClusterExpansionZoom(clusterId, function (err, zoom) {
				if (err) return;

				map.easeTo({
					center: features[0].geometry.coordinates,
					zoom: zoom
				});
			});
	});

	// When a click event occurs on a feature in
	// the unclustered-point layer, open a popup at
	// the location of the feature, with
	// description HTML from its properties.
	map.on('click', 'unclustered-point', function (e) {
		const { popupMarkup } = e.features[0].properties;
		const coordinates = e.features[0].geometry.coordinates.slice();

		// Ensure that if the map is zoomed out such that
		// multiple copies of the feature are visible, the
		// popup appears over the copy being pointed to.
		while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
			coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
		}

		new mapboxgl.Popup().setLngLat(coordinates).setHTML(popupMarkup).addTo(map);
	});

	map.on('mouseenter', 'clusters', function () {
		map.getCanvas().style.cursor = 'pointer';
	});
	map.on('mouseleave', 'clusters', function () {
		map.getCanvas().style.cursor = '';
	});
	map.on('mouseenter', 'unclustered-point', function () {
		map.getCanvas().style.cursor = 'pointer';
	});
	map.on('mouseleave', 'unclustered-point', function () {
		map.getCanvas().style.cursor = '';
	});
});
