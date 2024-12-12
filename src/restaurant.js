// // import './styles/style.css'
// // import Lenis from '@studio-freight/lenis'
// // import gsap from 'gsap'
// // import { Observer } from "gsap/Observer";
// // import { Flip } from "gsap/Flip";
// // import ScrollTrigger from "gsap/ScrollTrigger";

// // // Enregistrement des plugins GSAP
// // gsap.registerPlugin(Observer);
// // gsap.registerPlugin(Flip, ScrollTrigger);

// // // Fonction utilitaire pour vérifier si on est sur mobile
// // const isMobile = () => window.innerWidth <= 768;

// // // Ajout du ScrollTrigger pour les Lottie flips
// // ScrollTrigger.create({
// //     trigger: '.flip-1',
// //     start: "top 90%",
// //     end: "bottom center",
// //     // markers: true,
// //     onEnter: () => {
// //         if (isMobile()) return;
        
// //         // Définition de l'ordre des animations
// //         const animationOrder = ['.livraison', '.commande', '.reserver'];
        
// //         animationOrder.forEach((className, index) => {
// //             const sourceLottie = document.querySelector(`.cta__wrap__footer .lottie${className}`);
// //             const targetContainer = document.querySelector(`.lottie-cta__wrapper .link-lottie${className}`);
            
// //             // Vérification des éléments
// //             if (!sourceLottie || !targetContainer) {
// //                 console.error(`Elements not found for ${className}`, {
// //                     sourceLottie,
// //                     targetContainer
// //                 });
// //                 return;
// //             }
            
// //             const state = Flip.getState(sourceLottie, {
// //                 props: "all",
// //                 absolute: true
// //             });
            
// //             // Positionner en absolu dans le conteneur parent
// //             sourceLottie.style.position = 'absolute';
// //             sourceLottie.style.top = '0';
// //             sourceLottie.style.left = '0';
// //             sourceLottie.style.width = '100%';
// //             sourceLottie.style.height = '100%';
            
// //             targetContainer.appendChild(sourceLottie);
            
// //             Flip.from(state, {
// //                 duration: 2.5,
// //                 delay: index * 0.4,
// //                 ease: "elastic.out(0.9, 0.9)",
// //                 absolute: true,
// //                 scale: false,
// //                 onComplete: () => {
// //                     sourceLottie.style.transform = 'none';
// //                 }
// //             });
// //         });
// //     },
// //     onLeaveBack: () => {
// //         if (isMobile()) return;
        
// //         const animationOrder = ['.livraison', '.commande', '.reserver'];
        
// //         animationOrder.forEach((className, index) => {
// //             const sourceLottie = document.querySelector(`.lottie-cta__wrapper .lottie${className}`);
// //             const targetContainer = document.querySelector(`.cta__wrap__footer .link-lottie${className}`);
            
// //             if (!sourceLottie || !targetContainer) {
// //                 console.error(`Elements not found for ${className}`, {
// //                     sourceLottie,
// //                     targetContainer
// //                 });
// //                 return;
// //             }
            
// //             const state = Flip.getState(sourceLottie, {
// //                 props: "all",
// //                 absolute: true
// //             });
            
// //             // Positionner en absolu dans le conteneur parent
// //             sourceLottie.style.position = 'absolute';
// //             sourceLottie.style.top = '0';
// //             sourceLottie.style.left = '0';
// //             sourceLottie.style.width = '100%';
// //             sourceLottie.style.height = '100%';
            
// //             targetContainer.appendChild(sourceLottie);
            
// //             Flip.from(state, {
// //                 duration: 2.5,
// //                 delay: index * 0.4,
// //                 ease: "elastic.out(0.9, 0.9)",
// //                 absolute: true,
// //                 scale: false,
// //                 onComplete: () => {
// //                     sourceLottie.style.transform = 'none';
// //                 }
// //             });
// //         });
// //     }
// // });

// window.addEventListener('load', () => {
//     const container = document.querySelector('.restau-hero__wrapper');
//     const ctaFooter = document.querySelector('.cta__wrap__footer');
//     const lottieLinks = document.querySelectorAll('.link-lottie');
//     const boutiqueLottieLinks = document.querySelector('.cta-wrapper__boutique').querySelectorAll('.link-lottie');

//     gsap.set([container, ctaFooter], { opacity: 0 });
//     gsap.set(lottieLinks, { 
//         opacity: 0,
//         scale: 0.3
//     });
//     gsap.set(boutiqueLottieLinks, { 
//         opacity: 0,
//         scale: 0.3
//     });

//     setTimeout(() => {
//         gsap.to([container, ctaFooter], { 
//             opacity: 1, 
//             duration: 1,
//             ease: 'power2.out'
//         });

//         lottieLinks.forEach((link, index) => {
//             gsap.to(link, {
//                 opacity: 1,
//                 scale: 1,
//                 duration: 0.8,
//                 delay: 0.2 + (index * 0.1),
//                 ease: "elastic.out(1, 0.5)"
//             });
//         });

//         gsap.to(boutiqueLottieLinks, {
//             opacity: 1,
//             scale: 1,
//             duration: 0.8,
//             ease: "elastic.out(1, 0.5)",
//             stagger: 0.1
//         });
//     }, 100);
// });