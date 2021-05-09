const loginForm = document.getElementById('loginForm');

const validate = (e) => {
	e.preventDefault();

	const username = document.getElementById('username').value;
	const password = document.getElementById('password').value;
	const userInput = document.getElementById('username');
	const passwordInput = document.getElementById('password');
	const invalidFeedback = document.getElementById('invalidFeedback');
	const body = { username, password };

	fetch('/login-check', {
		method: 'POST',
		body: JSON.stringify(body),
		headers: { 'Content-type': 'application/json; charset=UTF-8' }
	})
		.then((response) => response.json())
		.then((json) => {
			if (!json.length) {
				loginForm.classList.add('was-validated');
				invalidUser.innerHTML = '';
				invalidPassword.innerHTML = '';
				userInput.classList.remove('is-valid', 'is-invalid');
				passwordInput.classList.remove('is-valid', 'is-invalid');
				userInput.classList.add('is-valid');
				passwordInput.classList.add('is-valid');
				loginForm.submit();
			} else {
				invalidFeedback.innerHTML = 'Incorrect login or password';
				loginForm.classList.remove('was-validated');
				userInput.classList.remove('is-valid', 'is-invalid');
				passwordInput.classList.remove('is-valid', 'is-invalid');
			}
		})
		.catch((err) => console.log(err));
};

loginForm.addEventListener('submit', validate);
