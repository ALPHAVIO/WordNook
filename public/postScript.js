// Like display mechanism
$(document).ready(function () {
    $('.content').click(function () {
        $('.content').toggleClass('like-active');
        $('.like').toggleClass('like-active');
        $('.like_icon').toggleClass('like-active');
        if ($('.like').text() == 'Like') {
            alert($('.like').text());
        }
    });
});
