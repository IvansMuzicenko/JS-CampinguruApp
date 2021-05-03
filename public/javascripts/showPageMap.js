mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/vana02/cko2ik0or1v3p18le4vd6aqdo',
	center: campground.geometry.coordinates,
	zoom: 8
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker().setLngLat(campground.geometry.coordinates).addTo(map);
