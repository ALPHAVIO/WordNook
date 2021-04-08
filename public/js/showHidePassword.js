let state = false;
function togglePassword() {
    if (state) {
        document.getElementById('password').setAttribute('type', 'password');
        document.getElementById('eye').classList.remove('fa-eye-slash');
    } else {
        document.getElementById('password').setAttribute('type', 'text');
        document.getElementById('eye').classList.add('fa-eye-slash');
    }
    state = !state;
}
