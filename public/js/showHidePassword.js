let state = false;
function togglePassword(target = 'password', icon = 'eye') {
	if (state) {
		document.getElementById(target).setAttribute('type', 'password');
		document.getElementById(icon).classList.remove('fa-eye-slash');
	} else {
		document.getElementById(target).setAttribute('type', 'text');
		document.getElementById(icon).classList.add('fa-eye-slash');
	}
	state = !state;
}
