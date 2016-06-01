/**
 * Created by ecford on 5/31/16.
 */


$(".header").click(function () {
    window.location = $(this).find("a").attr("href");
    return false;
})
