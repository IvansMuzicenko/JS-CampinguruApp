const alertA = document.getElementById('alert');
const alertMsg = alertA.innerHTML;
const loginForm = document.getElementById('loginForm');

const userInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

const invalidFeedback = document.getElementById('invalidFeedback');
alertA.classList.add('none');
invalidFeedback.innerHTML = 'Incorrect login or password';
loginForm.classList.remove('was-validated');
userInput.classList.remove('is-valid', 'is-invalid');
passwordInput.classList.remove('is-valid', 'is-invalid');
userInput.classList.add('is-invalid');
passwordInput.classList.add('is-invalid');

const validate = (e) => {
	e.preventDefault();

	const username = userInput.value;
	const password = passwordInput.value;
	const body = { username, password };

	fetch('/login', {
		method: 'POST',
		body: JSON.stringify(body),
		headers: { 'Content-type': 'application/json; charset=UTF-8' }
	})
		.then(function (response) {
			return response.text();
		})
		.then(function (html) {
			let parser = new DOMParser();
			let doc = parser.parseFromString(html, 'text/html');

			let user = doc.getElementById('user');
			if (user) {
				loginForm.submit();
			}
		})
		.catch(function (err) {
			console.warn('Something went wrong.', err);
		});
};

loginForm.addEventListener('submit', validate);
