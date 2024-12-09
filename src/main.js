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

let lenisInstance;
let menuVilleLenisInstance;
let mainMenuLenisInstance;

let hasChangedColors = false;
let currentColorIndex = 0;

const colorPalettes = [
    {
        light: '#f9cfe7',
        dark: '#C7361C'   
    },
    {
        light: '#d3edef',
        dark: '#314b98'   
    },
    {
        light: '#ff6a00',
        dark: '#f8da52'   
    },
    {
        light: '#bdd0a0',
        dark: '#004632'   
    }
];

let currentLoop = null;
let currentObserver = null;
let menuIsOpen = false;

window.addEventListener('load', () => {
   document.documentElement.style.setProperty('transition', 'all 0.3s ease-in-out');
   
   const svgs = document.querySelectorAll('svg');
   svgs.forEach(svg => {
       svg.style.transition = 'all 0.3s ease-in-out';
       svg.style.willChange = 'transform';
   });

   lenisInstance = new Lenis({
      duration: 1,
      orientation: 'vertical',
      smoothWheel: true,
      smoothTouch: false,
      touchMultiplier: 1.5,
      infinite: true,
      easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))
   });

   function rafMainScroll(time) {
       lenisInstance.raf(time);
       requestAnimationFrame(rafMainScroll);
   }
   requestAnimationFrame(rafMainScroll);

   lenisInstance.on('scroll', () => {
       const footer = document.querySelector('.section.footer');
       const footerTop = footer.getBoundingClientRect().top;
       const footerHeight = footer.offsetHeight;
       const triggerPoint = window.innerHeight - (footerHeight * 0.9);
       
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
       dropdown.style.height = '8.2rem';
       const clickElement = dropdown.querySelector('.menu-ville__click');
       const restaurantItems = dropdown.querySelectorAll('.restaurant__item');

       restaurantItems.forEach(restaurant => {
           restaurant.style.height = '6rem';
           const bannerResto = restaurant.querySelector('.banner-resto');
           const restaurantLinkAbsolute = restaurant.querySelector('.restaurant-link-absolute');
           
           if (bannerResto) {
               bannerResto.style.height = '0';
           }
           
           restaurant.addEventListener('click', (e) => {
               e.stopPropagation();
               
               if (activeRestaurant && activeRestaurant !== restaurant) {
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

           restaurantLinkAbsolute.addEventListener('click', (e) => {
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
           e.stopPropagation();

           if (activeRestaurant) {
               const banner = activeRestaurant.querySelector('.banner-resto');
               if (banner) {
                   gsap.to(banner, {
                       height: '0',
                       duration: 0.8,
                       ease: 'power2.inOut'
                   });
               }
               gsap.to(activeRestaurant, {
                   height: '8.2rem',
                   duration: 0.8,
                   ease: 'power2.inOut'
               });
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

   // Configuration du Flip
   const showMenu = document.querySelector('.show-menu');
   const starBloc = document.querySelector('.star-bloc');
   const starBloc2 = document.querySelector('.star-bloc-2');
   const starBloc3 = document.querySelector('.star-bloc-3');
   const flipSection = document.querySelector('.flip-1');
   const flipSection2 = document.querySelector('.flip-2');
   const gridBgSection = document.querySelector('.flip-3');

   // Fonction pour vérifier si l'écran est en mode mobile
   const isMobile = () => window.innerWidth <= 768;

   // Premier ScrollTrigger modifié
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
           
           starBloc.appendChild(showMenu); // Retour vers star-bloc
           
           Flip.from(state, {
               duration: 1.5,
               ease: "power2.inOut",
               absolute: true,
               scale: true,
               spin: true,
           });
       }
   });

   // Troisième ScrollTrigger modifié
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
               spin: true,
           });
       }
   });
});


