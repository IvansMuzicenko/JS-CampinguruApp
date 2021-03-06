const citiesSelect = document.querySelectorAll('.cityClass');
const fullSearchForm = document.getElementById('fullSearchForm');
const selectedCountry = document.getElementById('currentCountry');
const searchCollapse = document.getElementById('searchCollapse');
const filterToggler = document.getElementById('filterToggler');
const submitSearch = document.getElementById('submitSearch');
const sortTitle = document.getElementById('sortTitle');
const sortPrice = document.getElementById('sortPrice');
const sortRating = document.getElementById('sortRating');

const country = document.getElementById('country');
let citySelect = document.getElementById(country.value);
const priceMin = document.getElementById('priceMin');
const priceMax = document.getElementById('priceMax');

const searchParams = new URLSearchParams(document.location.search.substring(1));
const searchCountry = searchParams.get('country');
const searchCity = searchParams.get('city');
const searchPriceMin = searchParams.get('priceMin');
const searchPriceMax = searchParams.get('priceMax');

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

citiesSelect.forEach((el) => {
	el.value = '';
	el.classList.add('none');
	el.disabled = true;
});

if (document.location.search.includes('country=')) {
	searchCollapse.classList.remove('none');
	country.disabled = false;
	priceMin.disabled = false;
	priceMax.disabled = false;
	country.value = searchCountry;
	valueChange();
	if (country.value.length) citySelect.value = searchCity;
	priceMin.value = searchPriceMin;
	priceMax.value = searchPriceMax;
}

if (!country.value == '') {
	citySelect.classList.remove('none');
	citySelect.disabled = false;
}

country.addEventListener('change', valueChange);

filterToggler.addEventListener('click', (e) => {
	searchCollapse.classList.toggle('none');
	if (searchCollapse.className.includes('none')) {
		country.disabled = true;
		priceMin.disabled = true;
		priceMax.disabled = true;

		citiesSelect.forEach((el) => {
			el.disabled = true;
		});
	} else {
		country.disabled = false;
		priceMin.disabled = false;
		priceMax.disabled = false;
		valueChange();
	}
});

submitSearch.addEventListener('click', (e) => {
	if (!citySelect.value.length) {
		citySelect.disabled = true;
	}
	if (!priceMin.value.length) {
		priceMin.disabled = true;
	}
	if (!priceMax.value.length) {
		priceMax.disabled = true;
	}
});
//----------------------Sorting-------------
if (searchParams.has('sortTitle')) {
	const currSort = searchParams.get('sortTitle');
	searchParams.delete('sortTitle');
	searchParams.delete('sortPrice');
	searchParams.delete('sortRating');
	searchParams.delete('page');
	sortPrice.href = '?' + searchParams + '&sortPrice=desc';
	sortRating.href = '?' + searchParams + '&sortRating=desc';
	if (currSort == 'desc') {
		searchParams.set('sortTitle', 'asc');
		sortTitle.innerHTML += ' &#x2B07';
	} else if (currSort == 'asc') {
		searchParams.set('sortTitle', 'desc');
		sortTitle.innerHTML += ' &#x2B06';
	}
	sortTitle.href = `?${searchParams}`;
} else if (searchParams.has('sortPrice')) {
	const currSort = searchParams.get('sortPrice');
	searchParams.delete('sortTitle');
	searchParams.delete('sortPrice');
	searchParams.delete('sortRating');
	searchParams.delete('page');
	sortTitle.href = '?' + searchParams + '&sortTitle=desc';
	sortRating.href = '?' + searchParams + '&sortRating=desc';
	if (currSort == 'desc') {
		searchParams.set('sortPrice', 'asc');
		sortPrice.innerHTML += ' &#x2B07';
	} else if (currSort == 'asc') {
		searchParams.set('sortPrice', 'desc');
		sortPrice.innerHTML += ' &#x2B06';
	}
	sortPrice.href = `?${searchParams}`;
} else if (searchParams.has('sortRating')) {
	const currSort = searchParams.get('sortRating');
	searchParams.delete('sortTitle');
	searchParams.delete('sortPrice');
	searchParams.delete('sortRating');
	searchParams.delete('page');
	sortTitle.href = '?' + searchParams + '&sortTitle=desc';
	sortPrice.href = '?' + searchParams + '&sortPrice=desc';
	if (currSort == 'desc') {
		searchParams.set('sortRating', 'asc');
		sortRating.innerHTML += ' &#x2B07';
	} else if (currSort == 'asc') {
		searchParams.set('sortRating', 'desc');
		sortRating.innerHTML += ' &#x2B06';
	}
	sortRating.href = `?${searchParams}`;
} else {
	searchParams.delete('sortTitle');
	searchParams.delete('sortPrice');
	searchParams.delete('sortRating');
	searchParams.delete('page');
	sortTitle.href = '?' + searchParams + '&sortTitle=desc';
	sortPrice.href = '?' + searchParams + '&sortPrice=desc';
	sortRating.href = '?' + searchParams + '&sortRating=desc';
}
