import './styles/style.css'
import Lenis from '@studio-freight/lenis'
import gsap from 'gsap'

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

   // Configuration du menu ville avec défilement infini
   const menuVilleWrapper = document.querySelector('.menu-ville__wrapper');
   const menuVilleItems = menuVilleWrapper.children;
   const itemHeight = menuVilleItems[0].offsetHeight;
   const totalHeight = itemHeight * menuVilleItems.length;

   menuVilleLenisInstance = new Lenis({
      wrapper: menuVilleWrapper,
      content: menuVilleWrapper,
      duration: 1.5,
      orientation: 'vertical',
      smoothWheel: true,
      smoothTouch: false,
      touchMultiplier: 1.5,
      infinite: true,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
   });

   // Gestion du défilement infini pour le menu ville
   menuVilleLenisInstance.on('scroll', (e) => {
       const scroll = e.scroll;
       if (scroll >= totalHeight) {
           menuVilleLenisInstance.scrollTo(0, { immediate: true });
       } else if (scroll <= 0) {
           menuVilleLenisInstance.scrollTo(totalHeight, { immediate: true });
       }
   });

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

   // Gestion du menu principal
   const mainMenuWrapper = document.querySelector('.menu__wrapper');
   const showMenuButton = document.querySelector('.show-menu');

   mainMenuWrapper.style.display = 'none';

   // Ouverture du menu principal
   showMenuButton.addEventListener('click', () => {
       mainMenuWrapper.style.display = 'block';
       
       const menuVilleWrapper = mainMenuWrapper.querySelector('.menu-ville__wrapper');
       const menuItems = [...menuVilleWrapper.children]; // Convertir en tableau
       const itemHeight = menuItems[0].offsetHeight;
       const totalHeight = itemHeight * menuItems.length;

       // Dupliquer les éléments plusieurs fois pour créer un tampon
       for (let i = 0; i < 5; i++) { // Dupliquer 5 fois
           menuItems.forEach(item => {
               const clone = item.cloneNode(true);
               menuVilleWrapper.appendChild(clone);
           });
       }

       if (mainMenuLenisInstance) mainMenuLenisInstance.destroy();
       mainMenuLenisInstance = new Lenis({
           wrapper: menuVilleWrapper,
           content: menuVilleWrapper,
           duration: 0, // Pas de durée pour un saut instantané
           orientation: 'vertical',
           smoothWheel: true,
           smoothTouch: false,
           touchMultiplier: 1.5,
           infinite: false,
           easing: (t) => t // Easing linéaire pour un défilement fluide
       });

       // Gestion du défilement infini pour le menu principal
       mainMenuLenisInstance.on('scroll', (e) => {
           const scroll = e.scroll;
           const bufferHeight = totalHeight * 5; // Utiliser un tampon beaucoup plus large

           if (scroll >= bufferHeight) {
               mainMenuLenisInstance.scrollTo(scroll - totalHeight, { immediate: true });
           } else if (scroll <= totalHeight) {
               mainMenuLenisInstance.scrollTo(scroll + totalHeight, { immediate: true });
           }
       });

       function rafMenuScroll(time) {
           if (mainMenuLenisInstance) mainMenuLenisInstance.raf(time);
           requestAnimationFrame(rafMenuScroll);
       }
       requestAnimationFrame(rafMenuScroll);
   });

   // Fermeture du menu principal avec la touche Escape
   document.addEventListener('keydown', (event) => {
       if (event.key === 'Escape') {
           mainMenuWrapper.style.display = 'none';
           if (mainMenuLenisInstance) {
               mainMenuLenisInstance.destroy();
               mainMenuLenisInstance = null;
           }
       }
   });
});
