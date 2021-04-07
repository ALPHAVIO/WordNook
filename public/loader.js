let loader = document.getElementById('loader');

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

function displayContent() {
    document.getElementById('loader').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    loader = document.getElementById('loader');
    loadNow(1);
});
