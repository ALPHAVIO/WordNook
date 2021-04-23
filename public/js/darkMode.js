const options = {
	bottom: '0.6rem', // default: '32px'
	right: 'unset', // default: '32px'
	left: '1.125rem', // default: 'unset'
	time: '0.5s', // default: '0.3s'
	mixColor: '#fff', // default: '#fff'
	backgroundColor: '#fff', // default: '#fff'
	buttonColorDark: '#100f2c', // default: '#100f2c'
	buttonColorLight: '#fff', // default: '#fff'
	saveInCookies: true, // default: true,
	label: '🌗', // default: ''
	autoMatchOsTheme: true, // default: true
};

const darkmode = new Darkmode(options);
darkmode.showWidget();

const button = document.getElementsByClassName('darkmode-toggle')[0];
button.addEventListener('click', () => {
	const image = document.getElementById('blog-image');
	image.classList.toggle('difference-fix');
});
