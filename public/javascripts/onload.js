let isMobile = false;
const pagination = document.querySelectorAll('.pagnav');
const pagination2 = document.querySelectorAll('.pagnav2');

if (window.innerWidth < 768) {
	isMobile = true;
}

if (pagination) {
	if (isMobile) {
		pagination2.forEach((el) => {
			el.classList.remove('none');
		});
	} else {
		pagination.forEach((el) => {
			el.classList.remove('none');
		});
	}
}
window.onload = () => {
	// Background Image/video
	const bgChange = document.getElementById('bgChange');
	const backgrounds = [
		'https://res.cloudinary.com/cateyken/video/upload/v1621595036/campinguru/Backgounds/BG-video1_febayi.mp4',
		'https://res.cloudinary.com/cateyken/video/upload/v1621595035/campinguru/Backgounds/Pexels_Videos_2330708_tfonr4.mp4',
		'https://res.cloudinary.com/cateyken/video/upload/v1621595035/campinguru/Backgounds/Pexels_Videos_4097_mc8s0f.mp4',
		'https://res.cloudinary.com/cateyken/video/upload/v1621595034/campinguru/Backgounds/Pexels_Videos_4100_x2rsog.mp4'
	];
	const randomBg = Math.floor(Math.random() * backgrounds.length);

	if (!isMobile) {
		bgChange.innerHTML = `<video id="bg-video" src="${backgrounds[randomBg]}" muted loop autoplay></video>`;
	} else {
		bgChange.innerHTML = `<img id="bg-image" src="https://source.unsplash.com/collection/2184453" alt="" />`;
	}

	// Navbar active links
	const active = document
		.querySelectorAll('nav a[href="' + location.pathname + '"]')
		.forEach((el) => {
			el.classList.toggle('active');
		});

	// Registered modal
	const modalToggle = document.getElementById('modalToggle');
	if (modalToggle) {
		modalToggle.click();
	}
};
