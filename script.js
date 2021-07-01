$(document).ready(function(){
    $(window).scroll(function(){
        if(this.scrollY > 25){
            $('.navbar').addClass("sticky")
        }
        else{
            $('.navbar').removeClass("sticky")
        }
    })
});