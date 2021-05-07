const checkRegister = document.getElementById('checkRegister');
const registerForm = document.getElementById('registerForm');

const validate = (e) => {
	e.preventDefault();
	if (!registerForm.checkValidity()) {
		return;
	}
	const username = document.getElementById('username').value;
	const email = document.getElementById('email').value;
	const body = { username, email };

	fetch('http://localhost:3000/register-check', {
		method: 'POST',
		body: JSON.stringify(body),
		headers: { 'Content-type': 'application/json; charset=UTF-8' }
	})
		.then((response) => response.json())
		.then((json) => {
			if (!json.length) {
				registerForm.submit();
			} else {
				json.forEach((el) => {
					console.log(el.message);
				});
			}
		})
		.catch((err) => console.log(err));
};

registerForm.addEventListener('submit', validate);
// checkRegister.addEventListener('click', validate);
