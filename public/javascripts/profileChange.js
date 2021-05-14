const profileForm = document.getElementById('profileForm');
const toggler = document.getElementById('toggler');

const nicknameSwitch = document.querySelectorAll('.nickname');
const usernameSwitch = document.querySelectorAll('.username');
const nameSwitch = document.querySelectorAll('.name');
const telSwitch = document.querySelectorAll('.tel');
const addressSwitch = document.querySelectorAll('.address');
const somethingSwitch = document.querySelectorAll('.something');

const nicknameText = document.getElementById('nicknameText');
const nameText = document.getElementById('nameText');
const telText = document.getElementById('telText');
const addressText = document.getElementById('addressText');
const somethingText = document.getElementById('somethingText');

const nicknameInput = document.getElementById('nicknameInput');
// const usernameInput = document.getElementById('usernameInput');
const nameInput = document.getElementById('nameInput');
const telInput = document.getElementById('telInput');
const addressInput = document.getElementById('addressInput');
const somethingInput = document.getElementById('somethingInput');

const submit = document.getElementById('submitProfile');
const addBox = document.getElementById('addBox');
const addSelect = document.getElementById('addSelect');

const telOpt = document.getElementById('telOpt');
const addressOpt = document.getElementById('addressOpt');
const smthOpt = document.getElementById('smthOpt');

const telDiv = document.getElementById('telDiv');
const addressDiv = document.getElementById('addressDiv');
const smthDiv = document.getElementById('smthDiv');

const selectedString = '---Choose field to add---';

let executed = false;

toggler.addEventListener('click', (e) => {
	e.preventDefault();
	document.getElementById('selected').selected = true;
	nicknameSwitch.forEach((el) => el.classList.toggle('none'));
	// usernameSwitch.forEach((el) => el.classList.toggle('none'));
	nameSwitch.forEach((el) => el.classList.toggle('none'));
	telSwitch.forEach((el) => el.classList.toggle('none'));
	addressSwitch.forEach((el) => el.classList.toggle('none'));
	somethingSwitch.forEach((el) => el.classList.toggle('none'));
	submit.classList.toggle('none');
	addBox.classList.toggle('none');
	addSelect.classList.toggle('none');

	if (!telText.innerText.length) {
		telDiv.classList.add('none');
		telOpt.classList.remove('none');
	} else telOpt.classList.add('none');

	if (!addressText.innerText.length) {
		addressDiv.classList.add('none');
		addressOpt.classList.remove('none');
	} else addressOpt.classList.add('none');

	if (!somethingText.innerText.length) {
		smthDiv.classList.add('none');
		smthOpt.classList.remove('none');
	} else smthOpt.classList.add('none');

	if (addSelect.innerText !== selectedString) {
		addSelect.hidden = false;
		addBox.hidden = false;
	}
});

addBox.addEventListener('click', () => {
	const addValue = addSelect.value;
	if (addValue == 'tel') {
		telDiv.classList.remove('none');
		telOpt.classList.toggle('none');
	}
	if (addValue == 'address') {
		addressDiv.classList.remove('none');
		addressOpt.classList.toggle('none');
	}
	if (addValue == 'smth') {
		smthDiv.classList.remove('none');
		smthOpt.classList.toggle('none');
	}
	if (addSelect.innerText === selectedString) {
		addSelect.hidden = true;
		addBox.hidden = true;
	}
	document.getElementById('selected').selected = true;
});

profileForm.addEventListener('submit', (e) => {
	e.preventDefault();

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
		.then((json) => {
			nicknameText.innerHTML = json.nickname;
			nameText.innerHTML = json.name;
			telText.innerHTML = json.tel;
			addressText.innerHTML = json.address;
			somethingText.innerHTML = json.something;

			toggler.click();
		})
		.catch((err) => console.log(err));
});

if (!executed) {
	submit.click();
	toggler.click();
	executed = true;
}
