const toggler = document.getElementById('toggler');
const nickname = document.querySelectorAll('.nickname');
const username = document.querySelectorAll('.username');
const name = document.querySelectorAll('.name');
const submit = document.getElementById('submitProfile');
const addBox = document.getElementById('addBox');
const addSelect = document.getElementById('addSelect');
const telDiv = document.getElementById('telDiv');
const addressDiv = document.getElementById('addressDiv');
const smthDiv = document.getElementById('smthDiv');
const tel = document.querySelectorAll('.tel');
const address = document.querySelectorAll('.address');
const something = document.querySelectorAll('.something');

toggler.addEventListener('click', (e) => {
	e.preventDefault();
	nickname.forEach((el) => el.classList.toggle('none'));
	username.forEach((el) => el.classList.toggle('none'));
	name.forEach((el) => el.classList.toggle('none'));
	tel.forEach((el) => el.classList.toggle('none'));
	address.forEach((el) => el.classList.toggle('none'));
	something.forEach((el) => el.classList.toggle('none'));
	submit.classList.toggle('none');
	addBox.classList.toggle('none');
	addSelect.classList.toggle('none');
});

addBox.addEventListener('click', () => {
	const addValue = addSelect.value;
	if (addValue == 'tel') {
		telDiv.classList.remove('none');
		document.getElementById('telOpt').remove();
	}
	if (addValue == 'address') {
		addressDiv.classList.remove('none');
		document.getElementById('addressOpt').remove();
	}
	if (addValue == 'smth') {
		smthDiv.classList.remove('none');
		document.getElementById('smthOpt').remove();
	}
	if (!addSelect.innerText.length) {
		addSelect.remove();
		addBox.remove();
	}
});
