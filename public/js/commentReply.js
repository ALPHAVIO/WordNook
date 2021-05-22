const replyToggleBtns = document.getElementsByClassName('reply-toggle');

for (let i = 0; i < replyToggleBtns.length; i++) {
	replyToggleBtns[i].addEventListener('click', function (e) {
		if (this.innerHTML === 'Show Replies') {
			this.innerHTML = 'Hide Replies';
			showReplies(i);
		} else {
			this.innerHTML = 'Show Replies';
			hideReplies(i);
		}
	});
}
function showReplies(i) {
	const replyDialog = document.getElementById(`reply-id-${i}`);
	replyDialog.classList.add('show');
}
function hideReplies(i) {
	const replyDialog = document.getElementById(`reply-id-${i}`);
	replyDialog.classList.remove('show');
}
