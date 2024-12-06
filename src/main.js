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

   // Clone du menu list wrapper
   const menuListWrapper = document.querySelector('.menu__list__wrapper');
   const menuListClone = menuListWrapper.cloneNode(true);
   menuListWrapper.appendChild(menuListClone);

   // Gestion du menu principal
   const mainMenuWrapper = document.querySelector('.menu__wrapper');
   const showMenuButton = document.querySelector('.show-menu');

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
           wrapper: mainMenuWrapper, // Spécifier le wrapper du menu
           content: mainMenuWrapper.querySelector('.menu__list__wrapper') // Spécifier le contenu à scroller
       });

       function rafMenuScroll(time) {
           mainMenuLenisInstance.raf(time);
           requestAnimationFrame(rafMenuScroll);
       }
       requestAnimationFrame(rafMenuScroll);
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

   // Animation des restaurants
   const restaurantItems = document.querySelectorAll('.restaurant__item');
   restaurantItems.forEach(item => {
       let isExpanded = false;
       let originalHeight;
       
       item.addEventListener('click', () => {
           const bannerResto = item.querySelector('.banner-resto');
           
           if (!isExpanded) {
               originalHeight = item.offsetHeight;
               lenisInstance.stop();
               
               gsap.to(item, {
                   height: '50vh',
                   duration: 0.8,
                   ease: 'power2.out',
               });

               // Animation de la bannière
               gsap.to(bannerResto, {
                   height: '100%',
                   duration: 0.8,
                   ease: 'power2.out',
                   onComplete: () => {
                       lenisInstance.start();
                   }
               });
           } else {
               lenisInstance.stop();
               
               gsap.to(item, {
                   height: originalHeight,
                   duration: 0.8,
                   ease: 'power2.out',
               });

               // Retour à la hauteur initiale de la bannière
               gsap.to(bannerResto, {
                   height: '0%',
                   duration: 0.8,
                   ease: 'power2.out',
                   onComplete: () => {
                       item.style.height = 'auto';
                       lenisInstance.start();
                   }
               });
           }
           
           isExpanded = !isExpanded;
       });
   });

   // Gestion des dropdowns du menu ville
   const dropdowns = document.querySelectorAll('.menu-ville__dropdown');
   let activeDropdown = null;

   dropdowns.forEach(dropdown => {
       // Définir la hauteur initiale
       dropdown.style.height = '8.2rem';

       dropdown.addEventListener('click', (e) => {
           e.stopPropagation(); // Empêche la propagation du clic

           if (activeDropdown && activeDropdown !== dropdown) {
               // Fermer le dropdown actif
               gsap.to(activeDropdown, {
                   height: '8.2rem',
                   duration: 0.4,
                   ease: 'power2.out'
               });
           }

           if (activeDropdown === dropdown) {
               // Fermer le dropdown actuel
               gsap.to(dropdown, {
                   height: '8.2rem',
                   duration: 0.4,
                   ease: 'power2.out'
               });
               activeDropdown = null;
           } else {
               // Ouvrir le nouveau dropdown
               const autoHeight = dropdown.scrollHeight;
               gsap.to(dropdown, {
                   height: autoHeight,
                   duration: 0.4,
                   ease: 'power2.out'
               });
               activeDropdown = dropdown;
           }
       });
   });
});
