window.onload = () => {
	// Background Image/video
	const bgChange = document.getElementById('bgChange');

	if (window.innerWidth > 768) {
		bgChange.innerHTML =
			'<video id="bg-video" src="https://res.cloudinary.com/cateyken/video/upload/v1619159209/campinguru/BG-video1_we4c93.mp4" muted loop autoplay></video>';
	} else {
		bgChange.innerHTML =
			'<img id="bg-image" src="https://res.cloudinary.com/cateyken/image/upload/v1619697900/campinguru/photo-1448234033678-91c13d8cbbad_qpttag.jpg" alt="" />';
	}
	//  if ($('#some-element').css('display') == 'none') {
	// 		is_mobile = true;
	// 	}

	// Navbar active links

	document
		.querySelectorAll('nav a[href^="' + location.pathname + '"]')[0]
		.classList.toggle('active');
};
