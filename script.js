$(document).ready(function(){
    $(window).scroll(function(){
        if(this.scrollY > 20){
            $('.navbar').addClass("sticky")
        }
        else{
            $('.navbar').removeClass("sticky")
        }
    });
    /* Toggle Menu/ NavBar Script */
    $('.menu-btn').click(function(){
        $('.navbar .menu').toggleClass('active')
        $('.menu-btn i').toggleClass('active')
    })

})