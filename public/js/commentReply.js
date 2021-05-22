const replyToggleBtn = document.getElementById('reply-toggle');
const replyDialog = document.getElementById('reply-id');
replyToggleBtn.addEventListener('click', function (e) {
	if (this.innerHTML === 'Show Replies') {
		this.innerHTML = 'Hide Replies';
		showReplies();
	} else {
		this.innerHTML = 'Show Replies';
		hideReplies();
	}
});
function showReplies() {
	replyDialog.classList.add('show');
}
function hideReplies() {
	replyDialog.classList.remove('show');
}
