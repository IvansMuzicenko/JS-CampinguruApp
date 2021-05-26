scrollUp = document.querySelector('.scrollUp');

window.onscroll = function () {
	scrollFunction();
};

function scrollFunction() {
	if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
		scrollUp.style.display = 'block';
	} else {
		scrollUp.style.display = 'none';
	}
}

function topFunction() {
	document.body.scrollTop = 0;
	document.documentElement.scrollTop = 0;
}
