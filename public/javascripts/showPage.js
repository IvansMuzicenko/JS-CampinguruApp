const picActive = document.getElementById('picActive');
const mapActive = document.getElementById('mapActive');
const picDiv = document.getElementById('picDiv');
const mapDiv = document.getElementById('map');
const tabs = document.getElementById('tabs');
mapDiv.classList.add('none');

tabs.addEventListener('click', (e) => {
	e.preventDefault();
	if (e.target == picActive) {
		picActive.classList.toggle('active');
		mapActive.classList.toggle('active');
		picDiv.classList.remove('none');
		mapDiv.classList.add('none');
	}
	if (e.target == mapActive) {
		picActive.classList.toggle('active');
		mapActive.classList.toggle('active');
		picDiv.classList.add('none');
		mapDiv.classList.remove('none');
	}
});
