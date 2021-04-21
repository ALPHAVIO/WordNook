let loader = document.getElementById('loader');

function displayContent() {
	document.getElementById('loader').style.display = 'none';
}

function loadNow(opacity) {
	if (opacity <= 0) {
		displayContent();
	} else {
		loader.style.opacity = opacity;
		window.setTimeout(() => {
			loadNow(opacity - 0.05);
		}, 10);
	}
}

document.addEventListener('DOMContentLoaded', () => {
	loader = document.getElementById('loader');
	loadNow(1);
});
