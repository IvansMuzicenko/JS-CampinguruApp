const checkRegister = document.getElementById('checkRegister');
const registerForm = document.getElementById('registerForm');

const validate = (e) => {
	e.preventDefault();

	const username = document.getElementById('username').value;
	const email = document.getElementById('email').value;
	const password = document.getElementById('password').value;
	const userInput = document.getElementById('username');
	const emailInput = document.getElementById('email');
	const passwordInput = document.getElementById('password');
	const invalidUser = document.getElementById('invalidUser');
	const invalidEmail = document.getElementById('invalidEmail');
	const invalidPassword = document.getElementById('invalidPassword');
	const body = { username, email, password };

	fetch('/register-check', {
		method: 'POST',
		body: JSON.stringify(body),
		headers: { 'Content-type': 'application/json; charset=UTF-8' }
	})
		.then((response) => response.json())
		.then((json) => {
			if (!json.length) {
				registerForm.classList.add('was-validated');
				invalidUser.innerHTML = '';
				invalidEmail.innerHTML = '';
				invalidPassword.innerHTML = '';
				userInput.classList.remove('is-valid', 'is-invalid');
				emailInput.classList.remove('is-valid', 'is-invalid');
				passwordInput.classList.remove('is-valid', 'is-invalid');
				userInput.classList.add('is-valid');
				emailInput.classList.add('is-valid');
				passwordInput.classList.add('is-valid');
				if (e.type == 'submit') {
					registerForm.submit();
				}
			} else {
				registerForm.classList.remove('was-validated');
				userInput.classList.remove('is-valid', 'is-invalid');
				userInput.classList.add('is-valid');
				emailInput.classList.remove('is-valid', 'is-invalid');
				emailInput.classList.add('is-valid');
				passwordInput.classList.remove('is-valid', 'is-invalid');
				passwordInput.classList.add('is-valid');
				invalidUser.innerHTML = '';
				invalidEmail.innerHTML = '';
				invalidPassword.innerHTML = '';

				json.forEach((el) => {
					if (el.input == 'username') {
						userInput.classList.remove('is-valid', 'is-invalid');
						if (!invalidUser.innerHTML.includes(el.message))
							invalidUser.innerHTML += el.message + '<br>';
						userInput.classList.add('is-invalid');
					}
					if (el.input == 'email') {
						emailInput.classList.remove('is-valid', 'is-invalid');
						if (!invalidEmail.innerHTML.includes(el.message))
							invalidEmail.innerHTML += el.message + '<br>';
						emailInput.classList.add('is-invalid');
					}
					if (el.input == 'password') {
						passwordInput.classList.remove('is-valid', 'is-invalid');
						if (!invalidPassword.innerHTML.includes(el.message))
							invalidPassword.innerHTML += el.message + '<br>';
						passwordInput.classList.add('is-invalid');
					}

					console.log(el.message);
				});
			}
		})
		.catch((err) => console.log(err));
};

registerForm.addEventListener('focusout', validate);
registerForm.addEventListener('submit', validate);
// checkRegister.addEventListener('click', validate);
