const title = document.querySelector('.heading-bold').textContent;
const author = document.querySelector('.author-name').textContent;
const url = document.location.href;
const shareButton = document.querySelector('.share-button');
const shareDialog = document.querySelector('.share-dialog');
const closeButton = document.querySelector('.close-button');

shareButton.addEventListener('click', (event) => {
	if (navigator.share) {
		// Web Share API is supported
		navigator
			.share({
				title,
				url,
				text: `Checkout this Blog By ${author} at WordNook`,
			})
			.then(() => {
				console.log('Thanks for sharing!');
			})
			.catch(console.error);
	} else {
		// Fallback
		shareDialog.classList.add('is-open');
	}
});

closeButton.addEventListener('click', (event) => {
	shareDialog.classList.remove('is-open');
});

function copy() {
	/* Get the text field */
	var copyText = document.getElementById('link');

	/* Select the text field */
	copyText.select();
	copyText.setSelectionRange(0, 99999); /* For mobile devices */

	/* Copy the text inside the text field */
	document.execCommand('copy');

	/* Alert the copied text */
	alert('Copied the text: ' + copyText.value);
}
