const profileForm = document.getElementById('profileForm');
const toggler = document.getElementById('toggler');

const nicknameSwitch = document.querySelectorAll('.nickname');
const usernameSwitch = document.querySelectorAll('.username');
const nameSwitch = document.querySelectorAll('.name');
const telSwitch = document.querySelectorAll('.tel');
const addressSwitch = document.querySelectorAll('.address');
const somethingSwitch = document.querySelectorAll('.something');

const submit = document.getElementById('submitProfile');
const addBox = document.getElementById('addBox');
const addSelect = document.getElementById('addSelect');
const telDiv = document.getElementById('telDiv');
const addressDiv = document.getElementById('addressDiv');
const smthDiv = document.getElementById('smthDiv');

toggler.addEventListener('click', (e) => {
	e.preventDefault();
	nicknameSwitch.forEach((el) => el.classList.toggle('none'));
	// usernameSwitch.forEach((el) => el.classList.toggle('none'));
	nameSwitch.forEach((el) => el.classList.toggle('none'));
	telSwitch.forEach((el) => el.classList.toggle('none'));
	addressSwitch.forEach((el) => el.classList.toggle('none'));
	somethingSwitch.forEach((el) => el.classList.toggle('none'));
	submit.classList.toggle('none');
	if (addSelect.length) {
		addBox.classList.toggle('none');
		addSelect.classList.toggle('none');
	}
});

addBox.addEventListener('click', () => {
	const addValue = addSelect.value;
	const telOpt = document.getElementById('telOpt');
	const addressOpt = document.getElementById('addressOpt');
	const smthOpt = document.getElementById('smthOpt');
	if (addValue == 'tel') {
		telDiv.classList.remove('none');
		telOpt.remove();
	}
	if (addValue == 'address') {
		addressDiv.classList.remove('none');
		addressOpt.remove();
	}
	if (addValue == 'smth') {
		smthDiv.classList.remove('none');
		smthOpt.remove();
	}
	if (!addSelect.innerText.length) {
		addSelect.remove();
		addBox.remove();
	}
});

profileForm.addEventListener('submit', (e) => {
	e.preventDefault();

	const nicknameInput = document.getElementById('nicknameInput');
	// const usernameInput = document.getElementById('usernameInput');
	const nameInput = document.getElementById('nameInput');
	const telInput = document.getElementById('telInput');
	const addressInput = document.getElementById('addressInput');
	const somethingInput = document.getElementById('somethingInput');

	const body = {};
	if (nicknameInput.value) body.nickname = nicknameInput.value;
	body.name = nameInput.value;
	body.tel = telInput.value;
	body.address = addressInput.value;
	body.something = somethingInput.value;

	fetch('/changeprofile', {
		method: 'POST',
		body: JSON.stringify(body),
		headers: { 'Content-type': 'application/json; charset=UTF-8' }
	})
		.then((response) => response.json())
		.then((json) => console.log(json))
		.catch((err) => console.log(err));
});
