import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { useMotion } from '../hooks/useMotion';

const Card = ({ innerRef, image, title, amount, color, subtext, zIndex = 30 }) => (
    <div
        ref={innerRef}
        className="absolute overflow-hidden shadow-2xl rounded-2xl bg-gray-100 flex flex-col pointer-events-auto"
        style={{ zIndex }}
    >
        <div className="flex-1 relative overflow-hidden">
            <img src={image} className="w-full h-full object-cover" alt={title} />
            <div className="absolute inset-0 bg-black/5"></div>
        </div>
        <div className="bg-white p-3 flex items-center justify-between border-t border-gray-100 h-[60px] overflow-hidden">
            <div className="flex items-center gap-2 overflow-hidden">
                <div className={`${color} w-8 h-8 rounded-full flex items-center justify-center shrink-0`}>
                    <img src="/pin24.svg" className="w-4 h-4 brightness-0 invert" alt="" />
                </div>
                <div className="overflow-hidden text-left">
                    <p className="text-[11px] font-bold text-gray-900 truncate uppercase tracking-tight">{title}</p>
                    <p className="text-[9px] text-gray-400 font-medium truncate">{subtext}</p>
                </div>
            </div>
            <p className="text-xs font-black text-gray-900 ml-2">{amount}</p>
        </div>
    </div>
);

export function Hero() {
    const comp = useRef(null);
    const canAnimate = useMotion();

    const heroImageRef = useRef(null);
    const heroImgEl = useRef(null);
    const hero1Text = useRef(null);
    const cardFooterRef = useRef(null);

    const cardRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

    const state = useRef('landscape');
    const isAnimating = useRef(false);
    const hasCompleted = useRef(false); // Once true, NEVER lock scroll again

    useLayoutEffect(() => {
        if (!canAnimate) return;

        let tl;
        let resizeTimer;

        const lock = () => {
            document.body.style.overflow = 'hidden';
            document.body.style.touchAction = 'none';
            document.body.style.overscrollBehaviorY = 'none';
            document.documentElement.style.overflow = 'hidden';
        };

        const unlock = () => {
            document.body.style.overflow = '';
            document.body.style.touchAction = '';
            document.body.style.overscrollBehaviorY = '';
            document.documentElement.style.overflow = '';
        };

        // Initial lock
        lock();
        window.scrollTo(0, 0);

        const init = () => {
            if (tl) tl.kill();

            const isMobile = window.innerWidth < 1024;
            const rect = comp.current.getBoundingClientRect();

            const cardW = isMobile ? Math.min(rect.width - 48, 340) : 230;
            const cardH = isMobile ? Math.min(rect.height * 0.55, 520) : 460;
            const footerH = 64;

            const topInsetPx = (rect.height - cardH) / 2;
            const leftInsetPx = (rect.width - cardW) / 2;
            const bottomInsetPx = topInsetPx;
            const rightInsetPx = leftInsetPx;

            gsap.set(heroImageRef.current, {
                clipPath: 'inset(0px 0px 0px 0px round 0px)',
                filter: 'drop-shadow(0 0 0px rgba(0,0,0,0))',
            });
            gsap.set(heroImgEl.current, { scale: 1 });
            gsap.set(cardFooterRef.current, {
                opacity: 0, y: 15,
                width: cardW, height: footerH,
                bottom: `${bottomInsetPx}px`,
                left: '50%', xPercent: -50,
            });
            gsap.set(hero1Text.current, { opacity: 1, y: 0, scale: 1 });
            gsap.set(cardRefs.map(r => r.current), {
                opacity: 0, scale: 0.5, xPercent: -50, yPercent: -50, left: '50%', top: '50%',
            });

            tl = gsap.timeline({ paused: true });

            tl.to(hero1Text.current, {
                opacity: 0, scale: 0.9, y: -30,
                duration: 0.35, ease: 'power2.in',
            }, 0);

            tl.to(heroImageRef.current, {
                clipPath: `inset(${topInsetPx}px ${leftInsetPx}px ${bottomInsetPx}px ${rightInsetPx}px round 24px)`,
                filter: 'drop-shadow(0 20px 50px rgba(0,0,0,0.25))',
                duration: 0.8, ease: 'power3.inOut',
            }, 0.05);

            tl.to(heroImgEl.current, {
                scale: 1.15, duration: 0.8, ease: 'power3.inOut',
            }, 0.05);

            tl.to(cardFooterRef.current, {
                opacity: 1, y: 0, duration: 0.3, ease: 'power2.out',
            }, 0.4);

            if (!isMobile) {
                const ft = '50%';
                tl.to(cardRefs[0].current, { opacity: 1, scale: 0.95, xPercent: -180, top: ft, width: '210px', height: '370px', duration: 0.6, ease: 'power2.out' }, 0.3);
                tl.to(cardRefs[2].current, { opacity: 1, scale: 0.95, xPercent: 80, top: ft, width: '210px', height: '370px', duration: 0.6, ease: 'power2.out' }, 0.3);
                tl.to(cardRefs[1].current, { opacity: 0.6, scale: 0.85, xPercent: -320, top: ft, width: '190px', height: '340px', duration: 0.6, ease: 'power2.out' }, 0.4);
                tl.to(cardRefs[3].current, { opacity: 0.6, scale: 0.85, xPercent: 220, top: ft, width: '190px', height: '340px', duration: 0.6, ease: 'power2.out' }, 0.4);
            }

            tl.fromTo('.hero-final-text',
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' },
                0.6,
            );
        };

        setTimeout(init, 50);

        // ─── PLAY FORWARD: landscape → portrait ───
        const playForward = () => {
            if (isAnimating.current || state.current !== 'landscape' || !tl) return;
            isAnimating.current = true;
            state.current = 'portrait';

            tl.timeScale(1).play().then(() => {
                isAnimating.current = false;
                hasCompleted.current = true;  // Animation done — NEVER lock again
                unlock();                      // Free the user to scroll
            });
        };

        // ─── PLAY REVERSE: portrait → landscape (only from scrollY=0) ───
        const playReverse = () => {
            if (isAnimating.current || state.current !== 'portrait' || !tl) return;
            if (window.scrollY > 5) return;
            isAnimating.current = true;
            state.current = 'landscape';
            hasCompleted.current = false;

            // Temporarily lock just during the reverse animation
            document.body.style.overflow = 'hidden';
            document.body.style.touchAction = 'none';
            document.documentElement.style.overflow = 'hidden';

            tl.timeScale(1.3).reverse().then(() => {
                isAnimating.current = false;
                // Re-lock everything once back in landscape state to prevent refresh pull
                lock();
            });
        };

        // ─── WHEEL (Desktop) ───
        const handleWheel = (e) => {
            if (isAnimating.current) { e.preventDefault(); return; }

            const r = comp.current?.getBoundingClientRect();
            if (!r) return;

            if (e.deltaY > 0 && state.current === 'landscape' && r.top > -50 && r.top < 50) {
                e.preventDefault();
                playForward();
            } else if (e.deltaY < 0 && state.current === 'portrait' && window.scrollY < 5) {
                e.preventDefault();
                playReverse();
            }
        };

        // ─── TOUCH (Mobile) ───
        let touchStartY = 0;
        let touchHandled = false;

        const handleTouchStart = (e) => {
            touchStartY = e.touches[0].clientY;
            touchHandled = false;
        };

        const handleTouchMove = (e) => {
            if (touchHandled || isAnimating.current) return;

            const dy = touchStartY - e.touches[0].clientY;

            // If the animation already completed and we're in portrait, let the user scroll freely
            if (hasCompleted.current && state.current === 'portrait') {
                // If we reach the absolute top of the page, enable overscroll-behavior-y: none 
                // to prevent pull-to-refresh and prepare for a clean reverse transition
                if (window.scrollY < 10) {
                    document.body.style.overscrollBehaviorY = 'none';
                } else {
                    document.body.style.overscrollBehaviorY = '';
                }

                // Only intercept if user is at top and swiping DOWN (to reverse)
                // Note: finger moves from top to bottom, so dy is negative
                if (dy < -10 && window.scrollY < 5) {
                    touchHandled = true;
                    e.preventDefault();
                    playReverse();
                }
                return; // Let normal scrolling happen
            }

            // In landscape state: intercept swipe down to play animation
            if (dy > 15 && state.current === 'landscape') {
                touchHandled = true;
                e.preventDefault();
                playForward();
            }
        };

        // ─── POINTER (PC emulator click-drag) ───
        let pointerStartY = 0;
        const handlePointerDown = (e) => { pointerStartY = e.clientY; };
        const handlePointerMove = (e) => {
            if (e.pointerType === 'touch' || e.buttons !== 1 || isAnimating.current) return;
            const dy = pointerStartY - e.clientY;
            if (dy > 15 && state.current === 'landscape') {
                playForward();
            }
        };

        // ─── RESIZE ───
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (!hasCompleted.current) {
                state.current = 'landscape';
                lock();
                window.scrollTo(0, 0);
            }
            init();
        }, 200);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove, { passive: false });
    window.addEventListener('resize', onResize);

    return () => {
        clearTimeout(resizeTimer);
        unlock();
        window.removeEventListener('wheel', handleWheel);
        window.removeEventListener('touchstart', handleTouchStart);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('pointerdown', handlePointerDown);
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('resize', onResize);
        if (tl) tl.kill();
    };
}, [canAnimate]);

return (
    <section ref={comp} className="w-full h-[100dvh] bg-white overflow-hidden relative">
        <div ref={hero1Text} className="absolute inset-0 flex flex-col items-center justify-center z-[50] text-center px-6 pointer-events-none">
            <h1 className="text-white text-4xl sm:text-7xl lg:text-9xl font-black leading-[1.1] mb-6 drop-shadow-2xl">
                Lumea ta, Pin24.
            </h1>
            <p className="text-white/90 text-base sm:text-2xl font-bold max-w-2xl drop-shadow-lg">
                Experiență completă, acum la scară largă.
            </p>
        </div>

        <div ref={heroImageRef} className="absolute inset-0 z-20">
            <img ref={heroImgEl} src="/new hero page.png" className="w-full h-full object-cover origin-center" alt="Pin24 Hero" />
            <div ref={cardFooterRef} className="absolute bg-white flex items-center justify-between rounded-b-[24px] px-4 shadow-inner border-t border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                        <img src="/pin24.svg" className="w-4 h-4 brightness-0 invert" alt="" />
                    </div>
                    <div className="text-left">
                        <p className="text-[11px] font-bold text-gray-900 uppercase tracking-tight">Pin24 Home</p>
                        <p className="text-[9px] text-gray-400 font-medium">Locații noi</p>
                    </div>
                </div>
                <p className="text-xs font-black text-gray-900">12.4k</p>
            </div>
        </div>

        <div className="absolute z-30 top-[8%] lg:top-[12%] text-center w-full px-6 pointer-events-none">
            <h2 className="hero-final-text text-3xl sm:text-5xl font-black text-gray-900 mb-3 opacity-0">
                Pin24, reimaginat.
            </h2>
            <p className="hero-final-text text-gray-500 font-medium text-base sm:text-lg opacity-0 max-w-xl mx-auto">
                Gestionează-ți favoritele și vizualizează hărțile în timp real.
            </p>
        </div>

        <div className="hidden lg:block absolute inset-0 z-15 pointer-events-none">
            <Card innerRef={cardRefs[0]} image="/CATEGORIES.jpeg" title="Căutare" subtext="Filtre active" amount="Harta" color="bg-indigo-600" />
            <Card innerRef={cardRefs[1]} image="/favorite page.jpeg" title="Favorite" subtext="Actualizat" amount="4" color="bg-rose-500" />
            <Card innerRef={cardRefs[2]} image="/listing example details.jpeg" title="Detalii" subtext="Preț actual" amount="€2.5k" color="bg-emerald-500" />
            <Card innerRef={cardRefs[3]} image="/listing example.jpeg" title="Recent" subtext="Postat azi" amount="Nou" color="bg-orange-500" />
        </div>
    </section>
);
}
