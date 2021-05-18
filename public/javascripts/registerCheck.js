const registerForm = document.getElementById('registerForm');
const userInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

const validate = (e) => {
	e.preventDefault();

	if (!registerForm.checkValidity()) {
		return;
	}

	const username = userInput.value;
	const password = passwordInput.value;
	const invalidUser = document.getElementById('invalidUser');
	const invalidPassword = document.getElementById('invalidPassword');
	const body = { username, password };

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
				invalidPassword.innerHTML = '';
				userInput.classList.remove('is-valid', 'is-invalid');
				passwordInput.classList.remove('is-valid', 'is-invalid');
				userInput.classList.add('is-valid');
				passwordInput.classList.add('is-valid');
				if (e.type == 'submit') {
					registerForm.submit();
				}
			} else {
				registerForm.classList.remove('was-validated');
				userInput.classList.remove('is-valid', 'is-invalid');
				passwordInput.classList.remove('is-valid', 'is-invalid');
				invalidUser.innerHTML = '';
				invalidPassword.innerHTML = '';

				json.forEach((el) => {
					if (el.input == 'login') {
						if (!invalidUser.innerHTML.includes(el.message))
							invalidUser.innerHTML += el.message + '<br>';
						userInput.classList.add('is-invalid');
					}
					if (el.input == 'password') {
						if (!invalidPassword.innerHTML.includes(el.message))
							invalidPassword.innerHTML += el.message + '<br>';
						passwordInput.classList.add('is-invalid');
					}
				});
			}
		})
		.catch((err) => console.log(err));
};

registerForm.addEventListener('focusout', validate);
registerForm.addEventListener('submit', validate);

const passwordShow = document.getElementById('passwordShow');
const confirmShow = document.getElementById('confirmShow');

passwordShow.onmousedown = () => {
	passwordInput.type = 'text';
};
document.onmouseup = () => {
	passwordInput.type = 'password';
};
