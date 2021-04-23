$('#password, #confirmPassword').on('keyup', () => {
	if ($('#password').val() === $('#confirmPassword').val()) {
		$('#CheckPasswordMatch').html('Password matches').css('color', 'green');
	} else
		$('#CheckPasswordMatch')
			.html('Password does not matches!!')
			.css('color', 'red');
});
