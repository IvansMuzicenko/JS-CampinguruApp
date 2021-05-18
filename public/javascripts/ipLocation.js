fetch('https://extreme-ip-lookup.com/json/')
	.then((response) => response.json())
	.then((json) => {
		console.log('Country: ', json.country);
	})
	.catch((data, status) => {
		console.log('Request failed');
	});
