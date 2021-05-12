const toggler = document.getElementById('toggler');
const nickname = document.querySelectorAll('.nickname');
const username = document.querySelectorAll('.username');
const name = document.querySelectorAll('.name');
const submit = document.getElementById('submitProfile');

toggler.addEventListener('click', (e) => {
	e.preventDefault();
	nickname.forEach((el) => el.classList.toggle('none'));
	username.forEach((el) => el.classList.toggle('none'));
	name.forEach((el) => el.classList.toggle('none'));
	submit.classList.toggle('none');
});
