const passForm = document.getElementById('passForm');
const username = document.getElementById('usernameText').dataset.text;

const validate = (e) => {
	e.preventDefault();

	if (!passForm.checkValidity()) {
		return;
	}
	const passwordInput = document.getElementById('password');
	const newPasswordInput = document.getElementById('newPassword');
	const confirmPasswordInput = document.getElementById('confirmPassword');
	const password = passwordInput.value;
	const newPassword = newPasswordInput.value;
	const confirmPassword = confirmPasswordInput.value;
	const invalidPassword = document.getElementById('invalidPassword');
	const invalidNewPassword = document.getElementById('invalidNewPassword');
	const invalidConfirmPassword = document.getElementById(
		'invalidConfirmPassword'
	);
	const body = { username, password, newPassword, confirmPassword };

	fetch('/passChange', {
		method: 'POST',
		body: JSON.stringify(body),
		headers: { 'Content-type': 'application/json; charset=UTF-8' }
	})
		.then((response) => response.json())
		.then((json) => {
			if (!json.length) {
				passForm.classList.add('was-validated');
				invalidPassword.innerHTML = '';
				invalidNewPassword.innerHTML = '';
				invalidConfirmPassword.innerHTML = '';
				passwordInput.classList.remove('is-valid', 'is-invalid');
				newPasswordInput.classList.remove('is-valid', 'is-invalid');
				confirmPasswordInput.classList.remove('is-valid', 'is-invalid');
				passwordInput.classList.add('is-valid');
				newPasswordInput.classList.add('is-valid');
				confirmPasswordInput.classList.add('is-valid');
				return passForm.submit();
			} else {
				passForm.classList.remove('was-validated');
				passwordInput.classList.remove('is-valid', 'is-invalid');
				newPasswordInput.classList.remove('is-valid', 'is-invalid');
				confirmPasswordInput.classList.remove('is-valid', 'is-invalid');
				invalidPassword.innerHTML = '';
				invalidNewPassword.innerHTML = '';
				invalidConfirmPassword.innerHTML = '';

				json.forEach((el) => {
					if (el.input == 'password') {
						if (!invalidPassword.innerHTML.includes(el.message))
							invalidPassword.innerHTML += el.message + '<br>';
						passwordInput.classList.add('is-invalid');
					}
					if (el.input == 'newPassword') {
						if (!invalidNewPassword.innerHTML.includes(el.message))
							invalidNewPassword.innerHTML += el.message + '<br>';
						newPasswordInput.classList.add('is-invalid');
					}
					if (el.input == 'confirmPassword') {
						if (!invalidConfirmPassword.innerHTML.includes(el.message))
							invalidConfirmPassword.innerHTML += el.message + '<br>';
						confirmPasswordInput.classList.add('is-invalid');
					}
				});
			}
		})
		.catch((err) => console.log(err));
};

passForm.addEventListener('submit', validate);
