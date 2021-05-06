let isMobile = false;
const pagination = document.getElementById('pagination');
const pagination2 = document.getElementById('pagination2');

if (window.innerWidth < 768) {
	isMobile = true;
}

if (pagination) {
	if (isMobile) {
		pagination2.classList.remove('none');
	} else {
		pagination.classList.remove('none');
	}
}
window.onload = () => {
	// Background Image/video
	const bgChange = document.getElementById('bgChange');
	const backgrounds = [
		'https://res.cloudinary.com/cateyken/video/upload/v1619159209/campinguru/Backgounds/BG-video1_we4c93.mp4',
		'https://res.cloudinary.com/cateyken/video/upload/v1620107779/campinguru/Backgounds/Pexels_Videos_4100_arvbbe.mp4',
		'https://res.cloudinary.com/cateyken/video/upload/v1620107780/campinguru/Backgounds/Pexels_Videos_4097_skricj.mp4',
		'https://res.cloudinary.com/cateyken/video/upload/v1620107780/campinguru/Backgounds/Pexels_Videos_2330708_ktnute.mp4',
		'https://res.cloudinary.com/cateyken/video/upload/v1620107795/campinguru/Backgounds/Pexels_Videos_2491282_mripfr.mp4'
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
};
