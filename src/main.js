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

   // Gestion du menu principal
   const mainMenuWrapper = document.querySelector('.menu__wrapper');
   const showMenuButton = document.querySelector('.show-menu');

   showMenuButton.addEventListener('click', () => {
       if (menuIsOpen) return; 
       menuIsOpen = true;
       mainMenuWrapper.style.display = 'block';
       
       lenisInstance.stop();

       const menuItems = gsap.utils.toArray('.menu-ville__item');
       gsap.set(menuItems, {
           clearProps: "all",
           y: function(i) {
               return i * menuItems[0].offsetHeight;
           }
       });
       
       requestAnimationFrame(() => {
           currentLoop = verticalLoop(".menu-ville__item", {
               repeat: -1,
               speed: 1.5
           });

           currentLoop.timeScale(0);

           currentObserver = Observer.create({
               target: ".menu-ville__wrapper",
               type: "wheel,touch",
               wheelSpeed: -0.5,
               onChange: self => {
                   if (!currentLoop) return;
                   const speed = -self.deltaY * 0.5;
                   currentLoop.timeScale(speed);
                   
                   gsap.to(currentLoop, {
                       timeScale: 0,
                       duration: 1.5,
                       ease: "power2.out"
                   });
               }
           });
       });
   });

   function closeMenu() {
       if (!menuIsOpen) return;
       
       lenisInstance.start();
       
       if (currentObserver) {
           currentObserver.kill();
           currentObserver = null;
       }
       
       if (currentLoop) {
           currentLoop.kill();
           currentLoop = null;
       }
       
       mainMenuWrapper.style.display = 'none';
       menuIsOpen = false;
   }

   function verticalLoop(items, config) {
       items = gsap.utils.toArray(items);
       config = config || {};
       let tl = gsap.timeline({
           repeat: config.repeat,
           paused: config.paused,
           defaults: {ease: "none"},
           onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100)
       });

       let length = items.length,
           startY = items[0].offsetTop,
           times = [],
           heights = [],
           yPercents = [],
           pixelsPerSecond = (config.speed || 1) * 100,
           snap = config.snap === false ? v => v : gsap.utils.snap(config.snap || 1);

       gsap.set(items, {
           yPercent: (i, el) => {
               let h = heights[i] = parseFloat(gsap.getProperty(el, "height", "px"));
               yPercents[i] = snap(parseFloat(gsap.getProperty(el, "y", "px")) / h * 100 + gsap.getProperty(el, "yPercent"));
               return yPercents[i];
           }
       });

       gsap.set(items, {y: 0});

       let totalHeight = items[length-1].offsetTop + yPercents[length-1] / 100 * heights[length-1] - startY + 
                        items[length-1].offsetHeight * gsap.getProperty(items[length-1], "scaleY");

       items.forEach((item, i) => {
           let curY = yPercents[i] / 100 * heights[i];
           let distanceToStart = item.offsetTop + curY - startY;
           let distanceToLoop = distanceToStart + heights[i] * gsap.getProperty(item, "scaleY");

           tl.to(item, {
               yPercent: snap((curY - distanceToLoop) / heights[i] * 100),
               duration: distanceToLoop / pixelsPerSecond
           }, 0)
           .fromTo(item, 
               {yPercent: snap((curY - distanceToLoop + totalHeight) / heights[i] * 100)},
               {yPercent: yPercents[i], duration: (curY - distanceToLoop + totalHeight - curY) / pixelsPerSecond, immediateRender: false},
               distanceToLoop / pixelsPerSecond
           );
       });

       return tl;
   }

   document.addEventListener('keydown', (event) => {
       if (event.key === 'Escape') {
           closeMenu();
       }
   });

   // Gestion des clics sur les restaurants
   const restaurantItems = document.querySelectorAll('.restaurant__item');
   restaurantItems.forEach(item => {
       item.addEventListener('click', () => {
           // Retire la classe active de tous les restaurants
           restaurantItems.forEach(restaurant => {
               restaurant.classList.remove('active');
           });
           
           // Ajoute la classe active au restaurant cliqué
           item.classList.add('active');
       });
   });
});


  