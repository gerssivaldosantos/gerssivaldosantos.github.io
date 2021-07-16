$(document).ready(function () {
  $(window).scroll(function () {
    if (this.scrollY > 80) {
      $(".navbar").addClass("sticky");
    } else {
      $(".navbar").removeClass("sticky");
    }
  });
  /* Toggle Menu/ NavBar Script */
  $(".menu-btn").click(function () {
    $(".navbar .menu").toggleClass("active");
    $(".menu-btn i").toggleClass("active");
  });
  $(".navbar .menu li a").click(function () {
    $(".navbar .menu").toggleClass("active");
    $(".menu-btn i").toggleClass("active");
  });

  /* OWL CAROUSEL */
  $('.carousel').owlCarousel({
      margin: 20,
      loop: true,
      autoplayTimeOut: 2000,
      autoplayHoverPause: true,
      responsive:{
          0:{
              items:1,
              nav: false
          },
          600:{
            items:2,
            nav: false
        },
        1000:{
            items: 3,
            nav: false
        }
      }

  })
});
