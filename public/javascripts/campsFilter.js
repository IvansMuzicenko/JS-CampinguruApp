const country = document.getElementById('country');
const countryValue = country.value;
const countryChildren = country.children;
const cityClass = document.querySelectorAll('.cityClass');
let city = document.getElementById(country.value);

if (!country.value == '') {
	city.hidden = false;
}

cityClass.forEach((el) => {
	el.value = '';
});

const valueChange = () => {
	city = document.getElementById(country.value);

	cityClass.forEach((el) => {
		el.hidden = true;
		el.value = '';
	});
	if (country.value != '') {
		city.hidden = false;
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
	const cookieSlice = geoCookie.slice(2);
	geo = JSON.parse(cookieSlice);
}
if (!document.location.search.includes('s=')) {
	country.value = geo.country_name;
}
valueChange();

country.addEventListener('change', valueChange);
