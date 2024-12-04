import './styles/style.css'
import Lenis from '@studio-freight/lenis'
import gsap from 'gsap'

console.log(
    '%c Dev by Thomas Carré\n' + 
    '🌐 Website: https://carre.studio.com\n' +
    '🐦 Twitter/X: https://x.com/ThomasCarre_' +
    '📸 Instagram: https://www.instagram.com/carre__studio/\n' +
    '💼 LinkedIn: https://www.linkedin.com/in/thomas-carre/\n' ,
    'background-color: #0b0b0b; color: #8B9A46; font-size:10px; padding:6px 10px 6px; border-radius:4px; line-height: 1.5;'
)

let lenisInstance;
let isAlternateColors = false;
let hasChangedColors = false;

window.addEventListener('load', () => {
   lenisInstance = new Lenis({
      duration: 1,
      orientation: 'vertical',
      smoothWheel: true,
      smoothTouch: false,
      touchMultiplier: 1.5,
      infinite: true,
      easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))
   });
   
   lenisInstance.on('scroll', () => {
       const footer = document.querySelector('.section.footer');
       const footerTop = footer.getBoundingClientRect().top;
       const footerHeight = footer.offsetHeight;
       const triggerPoint = window.innerHeight - (footerHeight * 0.2);
       
       if (footerTop <= triggerPoint && !hasChangedColors) {
           const root = document.documentElement;
           
           if (isAlternateColors) {
               root.style.setProperty('--base-color-brand--light-green', '#bdd0a0');
               root.style.setProperty('--base-color-brand--green', '#004632');
           } else {
               root.style.setProperty('--base-color-brand--light-green', '#C7361C');
               root.style.setProperty('--base-color-brand--green', '#FFF3FA');
           }
           
           isAlternateColors = !isAlternateColors;
           hasChangedColors = true;
       }
       
       if (footerTop > triggerPoint) {
           hasChangedColors = false;
       }
   });

   function raf(time) {
       lenisInstance.raf(time);
       requestAnimationFrame(raf);
   }
   requestAnimationFrame(raf);
});