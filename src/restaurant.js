import gsap from 'gsap';

window.addEventListener('load', () => {
    const container = document.querySelector('.restau-hero__wrapper');
    const ctaFooter = document.querySelector('.cta__wrap__footer');
    
    gsap.set([container, ctaFooter], { opacity: 0 });
    
    setTimeout(() => {
        gsap.to([container, ctaFooter], { 
            opacity: 1, 
            duration: 1,
            ease: 'power2.out'
        });
    }, 200);
});

const swiper = new Swiper(".swiper", {
    slidesPerView: 3.5,
    spaceBetween: 30,
    grabCursor: true,
    loop: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });


