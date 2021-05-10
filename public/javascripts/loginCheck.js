const loginForm = document.getElementById('loginForm');

const validate = (e) => {
	e.preventDefault();

	const userInput = document.getElementById('login');
	const passwordInput = document.getElementById('password');
	const username = userInput.value;
	const password = passwordInput.value;
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
				invalidFeedback.innerHTML = '';
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
