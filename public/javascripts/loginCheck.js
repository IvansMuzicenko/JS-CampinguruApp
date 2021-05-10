const alertDiv = document.getElementById('alert');
alertDiv.classList.add('none');
const loginCheck = document.getElementById('loginCheck');
const loginForm = document.getElementById('loginForm');
const passwordInput = document.getElementById('password');
const userInput = document.getElementById('username');
window.onload = () => {
	loginForm.classList.remove('was-validated');
	userInput.classList.add('is-invalid');
	passwordInput.classList.add('is-invalid');
};

const validateLogin = (e) => {
	e.preventDefault();

	const invalidFeedback = document.getElementById('invalidFeedback');
	invalidFeedback.innerHTML = 'Incorrect e-mail or password';
	userInput.classList.add('is-invalid');
	passwordInput.classList.add('is-invalid');
	const username = userInput.value;
	const password = passwordInput.value;
	const body = { username, password };

	fetch('/login-check', {
		method: 'POST',
		body: JSON.stringify(body),
		headers: { 'Content-type': 'application/json; charset=UTF-8' }
	})
		.then((response) => {
			return response.text();
		})
		.then((html) => {
			let parser = new DOMParser();
			let doc = parser.parseFromString(html, 'text/html');

			let user = doc.getElementById('user');
			if (user) {
				loginForm.submit();
			} else {
				invalidFeedback.innerHTML = 'Incorrect e-mail or password';
				loginForm.classList.remove('was-validated');
				userInput.classList.remove('is-valid', 'is-invalid');
				passwordInput.classList.remove('is-valid', 'is-invalid');
				userInput.classList.add('is-invalid');
				passwordInput.classList.add('is-invalid');
			}
		})
		.catch((err) => {
			console.warn('Something went wrong.', err);
		});
};

loginCheck.addEventListener('mousedown', validateLogin);
loginForm.addEventListener('submit', validateLogin);
