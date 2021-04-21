$(window).scroll(function () {
	if ($(this).scrollTop() > 50) {
		$('#back-to-top').fadeIn();
	} else {
		$('#back-to-top').fadeOut();
	}
});
// scroll body to 0px on click
$('#back-to-top').click(() => {
	$('body,html').animate(
		{
			scrollTop: 0,
		},
		'slow'
	);
	return false;
});
