import './styles/style.css'
import Lenis from '@studio-freight/lenis'
import gsap from 'gsap'
import { Observer } from "gsap/Observer";

// Enregistrer le plugin
gsap.registerPlugin(Observer);

// Affiche les informations de contact du développeur dans la console
console.log(
    '%c Dev by Thomas Carré\n' + 
    '🌐 Website: https://carre.studio.com\n' +
    '🐦 Twitter/X: https://x.com/ThomasCarre_' +
    '📸 Instagram: https://www.instagram.com/carre__studio/\n' +
    '💼 LinkedIn: https://www.linkedin.com/in/thomas-carre/' ,
    'background-color: #0b0b0b; color: #8B9A46; font-size:10px; padding:6px 10px 6px; border-radius:4px; line-height: 1.5;'
)

// Instances des scrolls fluides Lenis
let lenisInstance;
let menuVilleLenisInstance;
let mainMenuLenisInstance;

// Variables pour la gestion du changement de couleurs
let hasChangedColors = false;
let currentColorIndex = 0;

// Palettes de couleurs pour les transitions
const colorPalettes = [
    {
        light: '#f9cfe7', // Rouge brique
        dark: '#C7361C'   // Rose très pâle / Blanc rosé
    },
    {
        light: '#d3edef', // Bleu glacier clair
        dark: '#314b98'   // Bleu royal
    },
    {
        light: '#ff6a00', // Orange vif
        dark: '#f8da52'   // Crème / Jaune pâle
    },
    {
        light: '#bdd0a0', // Vert pâle / Sauge
        dark: '#004632'   // Vert forêt foncé
    }
];

// Variables pour stocker les instances d'animation
let currentLoop = null;
let currentObserver = null;
let menuIsOpen = false;

// Initialisation principale au chargement de la page
window.addEventListener('load', () => {
   // Configuration des transitions globales
   document.documentElement.style.setProperty('transition', 'all 0.3s ease-in-out');
   
   // Configuration des transitions pour les SVG
   const svgs = document.querySelectorAll('svg');
   svgs.forEach(svg => {
       svg.style.transition = 'all 0.3s ease-in-out';
       svg.style.willChange = 'transform';
   });

   // Initialisation du scroll principal
   lenisInstance = new Lenis({
      duration: 1,
      orientation: 'vertical',
      smoothWheel: true,
      smoothTouch: false,
      touchMultiplier: 1.5,
      infinite: true,
      easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))
   });

   // Fonction d'animation pour le scroll principal
   function rafMainScroll(time) {
       lenisInstance.raf(time);
       requestAnimationFrame(rafMainScroll);
   }
   requestAnimationFrame(rafMainScroll);


   // Gestion du changement de couleurs au scroll vers le footer
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

//    Clone du menu list wrapper
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

   // Gestion du menu principal
   const mainMenuWrapper = document.querySelector('.menu__wrapper');
   const showMenuButtons = document.querySelectorAll('.show-menu');

   showMenuButtons.forEach(showMenuButton => {
       showMenuButton.addEventListener('click', () => {
           if (menuIsOpen) return; 
           menuIsOpen = true;
           mainMenuWrapper.style.display = 'block';
           
           lenisInstance.stop();

           // Initialisation du scroll pour le menu
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
       
       lenisInstance.start();
       
       if (mainMenuLenisInstance) {
           mainMenuLenisInstance.destroy();
           mainMenuLenisInstance = null;
       }
       
       mainMenuWrapper.style.display = 'none';
       menuIsOpen = false;
   }

   document.addEventListener('keydown', (event) => {
       if (event.key === 'Escape') {
           closeMenu();
       }
   });

   // Gestion des dropdowns du menu ville
   const dropdowns = document.querySelectorAll('.menu-ville__dropdown');
   let activeDropdown = null;
   let activeRestaurant = null;

   dropdowns.forEach(dropdown => {
       dropdown.style.height = '8.2rem';
       const clickElement = dropdown.querySelector('.menu-ville__click');
       const restaurantItems = dropdown.querySelectorAll('.restaurant__item');

       // Gestion des restaurants
       restaurantItems.forEach(restaurant => {
           restaurant.style.height = '6rem';
           const bannerResto = restaurant.querySelector('.banner-resto');
           const restaurantLinkAbsolute = restaurant.querySelector('.restaurant-link-absolute');
           
           if (bannerResto) {
               bannerResto.style.height = '0';
           }
           
           // Gestion du restaurant item
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
                   oldRestaurantLinkAbsolute.classList.remove('active'); // Retire active de l'ancien
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
                           restaurantLinkAbsolute.classList.remove('active'); // Retire active à la fermeture
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
                   restaurantLinkAbsolute.classList.add('active'); // Ajoute active à l'ouverture
               }
           });

           // Gestion du clic sur le lien absolu
           restaurantLinkAbsolute.addEventListener('click', (e) => {
               e.preventDefault();
               e.stopPropagation();
               
               if (restaurant === activeRestaurant) {
                   // Fade out du restaurant-link
                   const restaurantLink = restaurant.querySelector('.restaurant-link');
                   gsap.to(restaurantLink, {
                       opacity: 0,
                       duration: 0.8,
                       ease: 'power2.out'
                   });

                   mainMenuLenisInstance.scrollTo(restaurant, {
                       offset: 0,
                       duration: 1,
                       immediate: false,
                       onComplete: () => {
                           const banner = restaurant.querySelector('.banner-resto');
                           
                           gsap.to(restaurant, {
                               height: '100vh',
                               duration: 1.2,
                               ease: 'power2.inOut'
                           });
                           
                           gsap.to(banner, {
                               height: '100%',
                               duration: 1.2,
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

       // Gestion du dropdown
       clickElement.addEventListener('click', (e) => {
           e.stopPropagation();

           // Réinitialiser tous les restaurants et bannières
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
               // Calculer la hauteur finale avant l'animation
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
});
