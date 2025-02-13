import './styles/style.css'
import Lenis from '@studio-freight/lenis'
import gsap from 'gsap'
import { Observer } from "gsap/Observer";
import { Flip } from "gsap/Flip";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(Observer);
gsap.registerPlugin(Flip, ScrollTrigger);

console.log(
    '%c Dev by Thomas Carré\n' + 
    '🌐 Website: https://carre.studio.com\n' +
    '🐦 Twitter/X: https://x.com/ThomasCarre_' +
    '📸 Instagram: https://www.instagram.com/carre__studio/\n' +
    '💼 LinkedIn: https://www.linkedin.com/in/thomas-carre/' ,
    'background-color: #0b0b0b; color: #8B9A46; font-size:10px; padding:6px 10px 6px; border-radius:4px; line-height: 1.5;'
)

// test


let lenisInstance;
let menuVilleLenisInstance;
let mainMenuLenisInstance;

let hasChangedColors = false;
let currentColorIndex = 0;

const colorPalettes = [
    {
        // Bleu-vert très pâle (turquoise clair) et turquoise foncé
        light: '#CEE9EB', // Couleur douce et apaisante
        dark: '#00777D'   // Turquoise profond
    },
    {
        // Jaune pâle et orange doré
        light: '#FFEEB2', // Jaune crémeux et lumineux
        dark: '#EFAF00'   // Or chaleureux
    },
    {
        // Lavande pâle et violet royal
        light: '#CECBFF', // Violet très doux
        dark: '#603198'   // Violet profond et riche
    },
    {
        // Rose pâle (même couleur pour light et dark)
        light: '#F9CEE1', // Rose tendre
        dark: '#C7361C'   // Rose tendre identique
    },
    {
        // Bleu glacier et bleu marine
        light: '#E0F5FF', // Bleu très clair, presque blanc
        dark: '#314B98'   // Bleu profond
    },
    {
        // Crème pâle et orange vif
        light: '#F9CEE1', // Blanc cassé chaleureux
        dark: '#FF6A00'   // Orange éclatant
    },
    {
        // Bleu glacier et rouge brique
        light: '#E0F5FF', // Bleu très clair, presque blanc
        dark: '#C7361C'   // Rouge terre cuite
    },
    {
        // Crème pâle et turquoise foncé
        light: '#D7B557', // Blanc cassé chaleureux
        dark: '#00777D'   // Turquoise profond
    },
    {
        // Vert olive clair et violet royal
        light: '#BDD0A0', // Vert sage doux
        dark: '#603198'   // Violet profond et riche
    },
    {
        // Jaune pâle et orange vif
        light: '#FFEEB2', // Jaune crémeux et lumineux
        dark: '#FF6A00'   // Orange éclatant
    },
    {
        // Crème pâle et bleu marine
        light: '#BDD0A0', // Blanc cassé chaleureux
        dark: '#314B98'   // Bleu profond
    },
    {
        // Rose pâle et vert forêt
        light: '#F9CEE1', // Rose tendre
        dark: '#004632'   // Vert foncé profond
    },
    {
        // Bleu glacier et vert forêt
        light: '#BDD0A0', // Bleu très clair, presque blanc
        dark: '#004632'   // Vert foncé profond
    }
];

let currentLoop = null;
let currentObserver = null;
let menuIsOpen = false;

document.documentElement.classList.add('wf-loading');

window.addEventListener('load', () => {
   document.documentElement.classList.remove('wf-loading');
   
   const loaderWrapper = document.querySelector('.loader__wrapper');
   const loaderItems = document.querySelectorAll('.loader__item');
   
   // Vérifier si nous sommes dans l'éditeur Webflow
   if (window.Webflow && window.Webflow.env('editor')) {
       console.log('Mode éditeur Webflow détecté - Lenis désactivé');
       return; // Sortir de la fonction si nous sommes dans l'éditeur
   }
   
   lenisInstance = new Lenis({
      duration: 1,
      orientation: 'vertical',
      smoothWheel: true,
      smoothTouch: true,
      touchMultiplier: 2,
      infinite: true,
      gestureOrientation: "vertical",
      easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))
   });

   function raf(time) {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
   }
   requestAnimationFrame(raf);

   lenisInstance.stop();
   
   setTimeout(() => {
       loaderItems.forEach((item, index) => {
           if (index === loaderItems.length - 1) {
               item.style.display = 'flex';
           } else {
               setTimeout(() => {
                   item.style.opacity = '0';
               }, index * 250);
           }
       });

       setTimeout(() => {
           gsap.to(loaderWrapper, {
               y: '-100%',
               duration: 1,
               ease: 'power3.inOut',
               onComplete: () => {
                   loaderWrapper.style.display = 'none';
                   lenisInstance.start();
               }
           });
       }, (loaderItems.length - 1) * 300);
   }, 150);

   document.documentElement.style.setProperty('transition', 'all 0.3s ease-in-out');
   
//    const svgs = document.querySelectorAll('svg');
//    svgs.forEach(svg => {
//        svg.style.transition = 'all 0.3s ease-in-out';
//        svg.style.willChange = 'transform';
//    });

   lenisInstance.on('scroll', () => {
       const footer = document.querySelector('.section.footer');
       const footerTop = footer.getBoundingClientRect().top;
       const footerHeight = footer.offsetHeight;
       const triggerPoint = window.innerHeight - (footerHeight * 0.5);
       
       if (footerTop <= triggerPoint && !hasChangedColors) {
           const root = document.documentElement;
           const currentPalette = colorPalettes[currentColorIndex];
           
           root.style.setProperty('--base-color-brand--light-green', currentPalette.light);
           root.style.setProperty('--base-color-brand--green', currentPalette.dark);
           
           currentColorIndex = (currentColorIndex + 1) % colorPalettes.length;
           hasChangedColors = true;
       }
       
       if (footerTop > triggerPoint) {
           hasChangedColors = false;
       }
   });

   const menuListWrapper = document.querySelector('.menu__list__wrapper');
   const menuListClone1 = menuListWrapper.cloneNode(true);
   const menuListClone2 = menuListWrapper.cloneNode(true);
   const menuListClone3 = menuListWrapper.cloneNode(true);
   const menuListClone4 = menuListWrapper.cloneNode(true);
   const menuListClone5 = menuListWrapper.cloneNode(true);
   menuListWrapper.appendChild(menuListClone1);
   menuListWrapper.appendChild(menuListClone2);
   menuListWrapper.appendChild(menuListClone3);
   menuListWrapper.appendChild(menuListClone4);
   menuListWrapper.appendChild(menuListClone5);

   const mainMenuWrapper = document.querySelector('.menu__wrapper');
   const showMenuButtons = document.querySelectorAll('.show-menu');

   showMenuButtons.forEach(showMenuButton => {
       showMenuButton.addEventListener('click', () => {
           if (window.innerWidth <= 991) return;
           if (menuIsOpen) return; 
           menuIsOpen = true;
           
           mainMenuWrapper.style.display = 'block';
           
           const tl = gsap.timeline();
           
           tl.fromTo(mainMenuWrapper, 
               { opacity: 0 },
               { 
                   opacity: 1,
                   duration: 0.8,
                   ease: 'power2.out'
               }
           );
           
           const lines = mainMenuWrapper.querySelectorAll('.line');
           const cityNames = mainMenuWrapper.querySelectorAll('.menu-city__name');

           tl.fromTo(lines,
               { width: 0 },
               {
                   width: '100%',
                   duration: 0.4,
                   ease: 'power2.out',
                   stagger: 0.03
               },
               '-=0.4'
           ).fromTo(cityNames,
               { y: "100%" },
               {
                   y: "0%",
                   duration: 0.4,
                   ease: 'power2.out',
                   stagger: 0.03
               },
               '<'
           );

           lenisInstance.stop();

           mainMenuLenisInstance = new Lenis({
               duration: 1,
               orientation: 'vertical',
               smoothWheel: true,
               smoothTouch: false,
               wrapper: mainMenuWrapper,
               content: mainMenuWrapper.querySelector('.menu__list__wrapper')
           });

           function rafMenuScroll(time) {
               mainMenuLenisInstance.raf(time);
               requestAnimationFrame(rafMenuScroll);
           }
           requestAnimationFrame(rafMenuScroll);
       });
   });

   function closeMenu() {
       if (window.innerWidth <= 991) return;
       if (!menuIsOpen) return;
       
       const tl = gsap.timeline({
           onComplete: () => {
               mainMenuWrapper.style.display = 'none';
               menuIsOpen = false;
               
               if (mainMenuLenisInstance) {
                   mainMenuLenisInstance.destroy();
                   mainMenuLenisInstance = null;
               }
               
               lenisInstance.start();
           }
       });

       tl.to(mainMenuWrapper, {
           opacity: 0,
           duration: 0.8,
           ease: 'power2.out'
       });
   }

   document.addEventListener('keydown', (event) => {
       if (event.key === 'Escape') {
           closeMenu();
       }
   });

   const dropdowns = document.querySelectorAll('.menu-ville__dropdown');
   let activeDropdown = null;
   let activeRestaurant = null;

   dropdowns.forEach(dropdown => {
       if (window.innerWidth > 991) {
           dropdown.style.height = '8.2rem';
       }
       
       const clickElement = dropdown.querySelector('.menu-ville__click');
       const restaurantItems = dropdown.querySelectorAll('.restaurant__item');

       restaurantItems.forEach(restaurant => {
           if (window.innerWidth > 991) {
               restaurant.style.height = '6rem';
               const bannerResto = restaurant.querySelector('.banner-resto');
               if (bannerResto) {
                   bannerResto.style.height = '0';
               }
           }
           
           restaurant.addEventListener('click', (e) => {
               if (window.innerWidth <= 991) return;
               e.stopPropagation();
               
               if (activeRestaurant && activeRestaurant !== restaurant) {
                   if (window.innerWidth > 991) {
                       const oldBanner = activeRestaurant.querySelector('.banner-resto');
                       const oldRestaurantLink = activeRestaurant.querySelector('.restaurant-link');
                       const oldRestaurantLinkAbsolute = activeRestaurant.querySelector('.restaurant-link-absolute');
                       
                       if (oldBanner) {
                           gsap.to(oldBanner, {
                               height: '0',
                               duration: 0.8,
                               ease: 'power2.inOut'
                           });
                       }
                       gsap.to(activeRestaurant, {
                           height: '6rem',
                           duration: 0.8,
                           ease: 'power2.inOut'
                       });
                       oldRestaurantLink.classList.add('no-point');
                       oldRestaurantLinkAbsolute.classList.remove('active');
                   }
               }

               const restaurantLink = restaurant.querySelector('.restaurant-link');
               
               if (activeRestaurant === restaurant) {
                   const banner = restaurant.querySelector('.banner-resto');
                   gsap.to([restaurant, banner], {
                       height: '6rem',
                       duration: 0.8,
                       ease: 'power2.inOut',
                       onComplete: () => {
                           gsap.to(dropdown, {
                               height: 'auto',
                               duration: 0.1
                           });
                           restaurantLink.classList.add('no-point');
                           restaurantLinkAbsolute.classList.remove('active');
                       }
                   });
                   activeRestaurant = null;
               } else {
                   const banner = restaurant.querySelector('.banner-resto');
                   gsap.to([restaurant, banner], {
                       height: '60vh',
                       duration: 0.8,
                       ease: 'power2.inOut',
                       onComplete: () => {
                           gsap.to(dropdown, {
                               height: 'auto',
                               duration: 0.1
                           });
                       }
                   });
                   activeRestaurant = restaurant;
                   restaurantLink.classList.remove('no-point');
                   restaurantLinkAbsolute.classList.add('active');
               }
           });

           const restaurantLinkAbsolute = restaurant.querySelector('.restaurant-link-absolute');
           const cursor = restaurantLinkAbsolute.querySelector('.cursor');
           
           restaurantLinkAbsolute.addEventListener('mouseenter', () => {
               if (window.innerWidth <= 991) return;
               cursor.style.display = 'block';
               
               const followCursor = (e) => {
                   const rect = restaurantLinkAbsolute.getBoundingClientRect();
                   gsap.to(cursor, {
                       x: e.clientX - rect.left,
                       y: e.clientY - rect.top,
                       duration: 0.2,
                       ease: 'power2.out'
                   });
               };
               
               restaurantLinkAbsolute.addEventListener('mousemove', followCursor);
               restaurantLinkAbsolute.addEventListener('mouseleave', () => {
                   if (window.innerWidth <= 991) return;
                   cursor.style.display = 'none';
                   restaurantLinkAbsolute.removeEventListener('mousemove', followCursor);
               }, { once: true });
           });

           restaurantLinkAbsolute.addEventListener('click', (e) => {
               if (window.innerWidth <= 991) return;
               e.preventDefault();
               e.stopPropagation();
               
               if (restaurant === activeRestaurant) {
                   const restaurantLink = restaurant.querySelector('.restaurant-link');
                   const lines = restaurant.querySelectorAll('.line');
                   
                   gsap.to(restaurantLink, {
                       opacity: 0,
                       duration: 0.8,
                       ease: 'power2.out'
                   });

                   gsap.to(lines, {
                       height: 0,
                       duration: 0.8,
                       ease: 'power2.out',
                       onStart: () => {
                           lines.forEach(line => line.style.display = 'none');
                       }
                   });

                   mainMenuLenisInstance.scrollTo(restaurant, {
                       offset: 0,
                       duration: 1,
                       immediate: false,
                       onComplete: () => {
                           const banner = restaurant.querySelector('.banner-resto');
                           
                           gsap.to(restaurant, {
                               height: '100vh',
                               duration: 0.8,
                               ease: 'power2.inOut'
                           });
                           
                           gsap.to(banner, {
                               height: '102%',
                               duration: 0.8,
                               ease: 'power2.inOut',
                               onComplete: () => {
                                   window.location.href = restaurantLinkAbsolute.getAttribute('href');
                               }
                           });
                       }
                   });
               }
           });
       });

       clickElement.addEventListener('click', (e) => {
           if (window.innerWidth <= 991) return;
           e.stopPropagation();

           if (activeRestaurant) {
               const banner = activeRestaurant.querySelector('.banner-resto');
               const restaurantLinkAbsolute = activeRestaurant.querySelector('.restaurant-link-absolute');
               const restaurantLink = activeRestaurant.querySelector('.restaurant-link');
               
               if (banner) {
                   gsap.to(banner, {
                       height: '0',
                       duration: 0.8,
                       ease: 'power2.inOut'
                   });
               }
               gsap.to(activeRestaurant, {
                   height: '6rem',
                   duration: 0.8,
                   ease: 'power2.inOut'
               });
               
               restaurantLinkAbsolute.classList.remove('active');
               restaurantLink.classList.add('no-point');
               
               activeRestaurant = null;
           }

           if (activeDropdown && activeDropdown !== dropdown) {
               gsap.to(activeDropdown, {
                   height: '8.2rem',
                   duration: 0.8,
                   ease: 'power2.inOut'
               });
           }

           if (activeDropdown === dropdown) {
               gsap.to(dropdown, {
                   height: '8.2rem',
                   duration: 0.8,
                   ease: 'power2.inOut'
               });
               activeDropdown = null;
           } else {
               const finalHeight = dropdown.scrollHeight;
               dropdown.style.height = '8.2rem';
               
               gsap.fromTo(dropdown, 
                   { height: '8.2rem' },
                   {
                       height: finalHeight,
                       duration: 0.8,
                       ease: 'power2.inOut',
                       onComplete: () => {
                           dropdown.style.height = 'auto';
                       }
                   }
               );
               activeDropdown = dropdown;
           }
       });
   });

   const showMenu = document.querySelector('.show-menu');
   const starBloc = document.querySelector('.star-bloc');
   const starBloc2 = document.querySelector('.star-bloc-2');
   const starBloc3 = document.querySelector('.star-bloc-3');
   const flipSection = document.querySelector('.flip-1');
   const flipSection2 = document.querySelector('.flip-2');
   const gridBgSection = document.querySelector('.flip-3');

   const isMobile = () => window.innerWidth <= 768;

   ScrollTrigger.create({
       trigger: flipSection,
       start: "top 70%",
       end: "bottom center",
       onEnter: () => {
           if (isMobile()) return;
           const state = Flip.getState(showMenu, {
               props: "all"
           });
           starBloc.appendChild(showMenu);
           
           Flip.from(state, {
               duration: 2,
               ease: "power2.inOut",
               absolute: true,
               scale: true,
               spin: true,
           });
       },
       onLeaveBack: () => {
           if (isMobile()) return;
           const state = Flip.getState(showMenu);
           
           document.querySelector('.sticky-flip').appendChild(showMenu);
           
           Flip.from(state, {
               duration: 1.5,
               ease: "power2.inOut",
               absolute: true,
               scale: true,
               spin: true,
           });
       }
   });

   ScrollTrigger.create({
       trigger: flipSection2,
       start: "top center",
       end: "bottom center",
    //    markers: true, 
       onEnter: () => {
           if (isMobile()) return;
           const state = Flip.getState(showMenu, {
               props: "all"
           });
           
           starBloc2.appendChild(showMenu);
           
           Flip.from(state, {
               duration: 1.5,
               ease: "power2.inOut",
               absolute: true,
               scale: true,
               spin: true,
           });
       },
       onLeaveBack: () => {
           if (isMobile()) return;
           const state = Flip.getState(showMenu);
           
           starBloc.appendChild(showMenu); 
           
           Flip.from(state, {
               duration: 1.5,
               ease: "power2.inOut",
               absolute: true,
               scale: true,
               spin: true,
           });
       }
   });

   ScrollTrigger.create({
       trigger: gridBgSection,
       start: "top center",
       end: "bottom center",
    //    markers: true, 
       onEnter: () => {
           if (isMobile()) return;
           const state = Flip.getState(showMenu, {
               props: "all"
           });
           
           starBloc3.appendChild(showMenu);
           
           Flip.from(state, {
               duration: 2,
               ease: "power2.inOut",
               absolute: true,
               scale: true,
               spin: true,
           });
       },
       onLeaveBack: () => {
           if (isMobile()) return;
           const state = Flip.getState(showMenu);
           
           starBloc2.appendChild(showMenu);
           
           Flip.from(state, {
               duration: 2,
               ease: "power2.inOut",
               absolute: true,
               scale: true,
               spin: true,
           });
       },
       onLeave: () => {
           if (isMobile()) return;
           const state = Flip.getState(showMenu);
           
           document.querySelector('.sticky-flip').appendChild(showMenu);
           
           Flip.from(state, {
               duration: 1.5,
               ease: "power2.inOut",
               absolute: true,
               scale: true,
            //    spin: true,
           });
       }
   });

   const bigLinks = document.querySelectorAll('.big-link');
   const servicesImages = document.querySelectorAll('.services__img');

   bigLinks.forEach(link => {
       link.addEventListener('mouseenter', () => {
           const linkZoom = link.dataset.zoom;
           servicesImages.forEach(img => {
               if (img.dataset.zoom === linkZoom) {
                   img.classList.add('active');
               }
           });
       });

       link.addEventListener('mouseleave', () => {
           servicesImages.forEach(img => {
               img.classList.remove('active');
           });
       });
   });

   const videoButtons = document.querySelectorAll('.video-btn');

   videoButtons.forEach(button => {
       const video = button.parentElement.querySelector('video');
       const playBtn = button.querySelector('.play-btn');
       const pauseBtn = button.querySelector('.pause-btn');
       
       playBtn.style.display = 'flex';
       pauseBtn.style.display = 'none';
       
       button.addEventListener('click', () => {
           if (video.paused) {
               video.play();
               playBtn.style.display = 'none';
               pauseBtn.style.display = 'flex';
           } else {
               video.pause();
               playBtn.style.display = 'flex';
               pauseBtn.style.display = 'none';
           }
       });
   });

   window.addEventListener('resize', () => {
       if (window.innerWidth <= 991) {
           dropdowns.forEach(dropdown => {
               dropdown.style.height = '';
               const restaurantItems = dropdown.querySelectorAll('.restaurant__item');
               restaurantItems.forEach(restaurant => {
                   restaurant.style.height = '';
                   const bannerResto = restaurant.querySelector('.banner-resto');
                   if (bannerResto) {
                       bannerResto.style.height = '';
                   }
                   const restaurantLink = restaurant.querySelector('.restaurant-link');
                   const restaurantLinkAbsolute = restaurant.querySelector('.restaurant-link-absolute');
                   if (restaurantLink) restaurantLink.classList.remove('no-point');
                   if (restaurantLinkAbsolute) restaurantLinkAbsolute.classList.remove('active');
               });
           });
           
           if (mainMenuLenisInstance) {
               mainMenuLenisInstance.destroy();
               mainMenuLenisInstance = null;
           }
           menuIsOpen = false;
           activeDropdown = null;
           activeRestaurant = null;
       }
   });
});



