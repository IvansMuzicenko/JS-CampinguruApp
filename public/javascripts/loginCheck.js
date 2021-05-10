const alertA = document.getElementById('alert');
const alertMsg = alertA.innerHTML;
const loginForm = document.getElementById('loginForm');

const userInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const username = userInput.value;
const password = passwordInput.value;
const invalidFeedback = document.getElementById('invalidFeedback');
alertA.classList.add('none');
invalidFeedback.innerHTML = 'Incorrect login or password';
loginForm.classList.remove('was-validated');
userInput.classList.remove('is-valid', 'is-invalid');
passwordInput.classList.remove('is-valid', 'is-invalid');
userInput.classList.add('is-invalid');
passwordInput.classList.add('is-invalid');
