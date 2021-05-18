const loginCheck = document.getElementById('loginCheck');
const loginForm = document.getElementById('loginForm');
const passwordInput = document.getElementById('password');
const userInput = document.getElementById('username');
const invalidInput = document.getElementById('invalidInput');

window.onload = () => {
	loginForm.classList.remove('was-validated');
	userInput.classList.add('is-invalid');
	passwordInput.classList.add('is-invalid');
};

const validateLogin = (e) => {
	e.preventDefault();

	if (!loginForm.checkValidity()) {
		return;
	}

	const invalidFeedback = document.getElementById('invalidFeedback');
	const username = userInput.value;
	const password = passwordInput.value;
	const body = { username, password };

	fetch('/login-check', {
		method: 'POST',
		body: JSON.stringify(body),
		headers: { 'Content-type': 'application/json; charset=UTF-8' }
	})
		.then((response) => response.json())
		.then((json) => {
			if (!json.message) {
				loginForm.classList.add('was-validated');
				invalidFeedback.innerHTML = '';
				userInput.classList.remove('is-valid', 'is-invalid');
				passwordInput.classList.remove('is-valid', 'is-invalid');
				invalidInput.classList.remove('is-valid', 'is-invalid');
				userInput.classList.add('is-valid');
				passwordInput.classList.add('is-valid');
				invalidInput.classList.add('is-valid');
				return loginForm.submit();
			}
			invalidFeedback.innerHTML = 'Incorrect e-mail or password';
			loginForm.classList.remove('was-validated');
			userInput.classList.remove('is-valid', 'is-invalid');
			passwordInput.classList.remove('is-valid', 'is-invalid');
			invalidInput.classList.remove('is-valid', 'is-invalid');
			userInput.classList.add('is-invalid');
			passwordInput.classList.add('is-invalid');
			invalidInput.classList.add('is-invalid');
		})
		.catch((err) => {
			console.warn('Something went wrong.', err);
		});
};

loginForm.addEventListener('submit', validateLogin);

const passwordShow = document.getElementById('passwordShow');

passwordShow.onmousedown = () => {
	passwordInput.type = 'text';
};
document.onmouseup = () => {
	passwordInput.type = 'password';
};
