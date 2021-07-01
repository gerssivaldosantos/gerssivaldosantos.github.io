$(document).ready(function(){

    /* Animation for scroll down page navbar */
    $(window).scroll(function(){
        if(this.scrollY > 25){
            $('.navbar').addClass("sticky")
        }
        else{
            $('.navbar').removeClass("sticky")
        }
    })

    /* Animation navbar resposive toggle menu */
    $('.menu-btn').click(function(){
        $('.navbar .menu').toggleClass("active")
    })


});