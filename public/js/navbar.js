$(document).ready(function() {
	$(window).scroll(function() {
		checkScroll();
	});
});

function checkScroll(){
    var startY = $('.navbar').height() * 2; //The point where the navbar changes in px

    if($(window).scrollTop() > startY){
    	$('.navbar').removeClass("navbar-main");
        $('.navbar').addClass("scrolled");
    }else{
        $('.navbar').removeClass("scrolled");
        $('.navbar').addClass("navbar-main");
    }
}

if($('.navbar').length > 0){
    $(window).on("scroll load resize", function(){
        checkScroll();
    });
}