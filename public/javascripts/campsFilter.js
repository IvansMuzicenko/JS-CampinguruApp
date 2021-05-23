const country = document.getElementById('country');
const countryValue = country.value;
const countryChildren = country.children;
const citiesSelect = document.querySelectorAll('.cityClass');
let citySelect = document.getElementById(country.value);
const fullSearchForm = document.getElementById('fullSearchForm');
let searchQuery = document.location.search;
console.log(searchQuery);

if (!country.value == '') {
	citySelect.classList.remove('none');
	citySelect.disabled = false;
}

citiesSelect.forEach((el) => {
	el.value = '';
	el.classList.add('none');
	el.disabled = true;
});

const valueChange = () => {
	citySelect = document.getElementById(country.value);

	citiesSelect.forEach((el) => {
		el.classList.add('none');
		el.disabled = true;
		el.value = '';
	});
	if (country.value != '') {
		citySelect.classList.remove('none');
		citySelect.disabled = false;
	}
};

valueChange();

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
const geoCookie = getCookie('geolocation');
let geo;
if (geoCookie) {
	geo = JSON.parse(geoCookie);
}

if (document.location.search.includes(`country=${geo.country_name}`)) {
	country.value = geo.country_name;
}
if (!document.location.search.includes('s=')) {
	country.value = geo.country_name;
	fullSearchForm.submit();
}
valueChange();

country.addEventListener('change', valueChange);
