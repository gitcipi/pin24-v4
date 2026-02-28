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

// ─── SCROLL LOCK HELPERS ───
function lockScroll() {
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
    document.documentElement.style.overflow = 'hidden';
}

function unlockScroll() {
    document.body.style.overflow = '';
    document.body.style.touchAction = '';
    document.documentElement.style.overflow = '';
}

export function Hero() {
    const comp = useRef(null);
    const canAnimate = useMotion();

    const heroImageRef = useRef(null);
    const heroImgEl = useRef(null);
    const hero1Text = useRef(null);
    const cardFooterRef = useRef(null);

    const cardRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

    const state = useRef('landscape');   // 'landscape' = initial, 'portrait' = card formed
    const isAnimating = useRef(false);

    useLayoutEffect(() => {
        if (!canAnimate) return;

        let tl;
        let resizeTimer;

        // ─── LOCK on load: hero is at top, user must animate before scrolling ───
        lockScroll();
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

            // ─── INITIAL STATE ───
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

            // ─── BUILD TIMELINE ───
            tl = gsap.timeline({ paused: true });

            // Text fades out
            tl.to(hero1Text.current, {
                opacity: 0, scale: 0.9, y: -30,
                duration: 0.35, ease: 'power2.in',
            }, 0);

            // Image clips into card
            tl.to(heroImageRef.current, {
                clipPath: `inset(${topInsetPx}px ${leftInsetPx}px ${bottomInsetPx}px ${rightInsetPx}px round 24px)`,
                filter: 'drop-shadow(0 20px 50px rgba(0,0,0,0.25))',
                duration: 0.8, ease: 'power3.inOut',
            }, 0.05);

            tl.to(heroImgEl.current, {
                scale: 1.15, duration: 0.8, ease: 'power3.inOut',
            }, 0.05);

            // Footer appears
            tl.to(cardFooterRef.current, {
                opacity: 1, y: 0, duration: 0.3, ease: 'power2.out',
            }, 0.4);

            // Side cards (desktop only)
            if (!isMobile) {
                const ft = '50%';
                tl.to(cardRefs[0].current, { opacity: 1, scale: 0.95, xPercent: -180, top: ft, width: '210px', height: '370px', duration: 0.6, ease: 'power2.out' }, 0.3);
                tl.to(cardRefs[2].current, { opacity: 1, scale: 0.95, xPercent: 80, top: ft, width: '210px', height: '370px', duration: 0.6, ease: 'power2.out' }, 0.3);
                tl.to(cardRefs[1].current, { opacity: 0.6, scale: 0.85, xPercent: -320, top: ft, width: '190px', height: '340px', duration: 0.6, ease: 'power2.out' }, 0.4);
                tl.to(cardRefs[3].current, { opacity: 0.6, scale: 0.85, xPercent: 220, top: ft, width: '190px', height: '340px', duration: 0.6, ease: 'power2.out' }, 0.4);
            }

            // Final text
            tl.fromTo('.hero-final-text',
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' },
                0.6,
            );

            // ─── UNLOCK scroll when forward animation is done ───
            tl.add(() => {
                isAnimating.current = false;
                unlockScroll();
            }, 0.85);
        };

        setTimeout(init, 50);

        // ─── PLAY FORWARD (landscape → portrait) ───
        const playForward = () => {
            if (isAnimating.current || state.current !== 'landscape' || !tl) return;
            isAnimating.current = true;
            state.current = 'portrait';
            lockScroll();
            window.scrollTo(0, 0);
            tl.timeScale(1).play();
        };

        // ─── PLAY REVERSE (portrait → landscape) ───
        const playReverse = () => {
            if (isAnimating.current || state.current !== 'portrait' || !tl) return;
            if (window.scrollY > 10) return; // only reverse when at the very top
            isAnimating.current = true;
            state.current = 'landscape';
            lockScroll();
            window.scrollTo(0, 0);
            tl.timeScale(1.3).reverse().then(() => {
                isAnimating.current = false;
                // Keep scroll locked in landscape state — user must swipe down to proceed
            });
        };

        // ─── WHEEL (Desktop) ───
        const handleWheel = (e) => {
            if (isAnimating.current) { e.preventDefault(); return; }

            const r = comp.current?.getBoundingClientRect();
            if (!r) return;
            const isNearTop = r.top > -150 && r.top < 150;

            if (e.deltaY > 0 && state.current === 'landscape' && isNearTop) {
                e.preventDefault();
                playForward();
            } else if (e.deltaY < 0 && state.current === 'portrait' && isNearTop && window.scrollY < 10) {
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
            if (touchHandled) return;

            const dy = touchStartY - e.touches[0].clientY;

            // Swipe DOWN (finger moves up) → play forward
            if (dy > 15 && state.current === 'landscape') {
                touchHandled = true;
                e.preventDefault();
                playForward();
                return;
            }

            // Swipe UP (finger moves down) → play reverse
            if (dy < -15 && state.current === 'portrait' && window.scrollY < 10) {
                touchHandled = true;
                e.preventDefault();
                playReverse();
                return;
            }
        };

        // ─── POINTER (PC emulator drag) ───
        let pointerStartY = 0;
        const handlePointerDown = (e) => { pointerStartY = e.clientY; };
        const handlePointerMove = (e) => {
            if (e.pointerType === 'touch') return;
            if (e.buttons !== 1) return;
            if (isAnimating.current) return;

            const dy = pointerStartY - e.clientY;
            if (dy > 15 && state.current === 'landscape') {
                playForward();
            }
        };

        // ─── KEYBOARD ───
        const handleKeyDown = (e) => {
            if (isAnimating.current) return;
            if ([' ', 'ArrowDown', 'PageDown'].includes(e.key) && state.current === 'landscape') {
                e.preventDefault();
                playForward();
            }
        };

        // ─── SCROLL SPY: re-lock when user scrolls back to top in portrait mode ───
        const handleScroll = () => {
            if (state.current === 'portrait' && window.scrollY < 5 && !isAnimating.current) {
                // User scrolled all the way back to top — they might want to reverse
                // Don't auto-lock, but be ready
            }
        };

        // ─── RESIZE ───
        const onResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                state.current = 'landscape';
                lockScroll();
                window.scrollTo(0, 0);
                init();
            }, 200);
        };

        // ─── EVENT LISTENERS ───
        window.addEventListener('wheel', handleWheel, { passive: false });
        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchmove', handleTouchMove, { passive: false });
        window.addEventListener('pointerdown', handlePointerDown);
        window.addEventListener('pointermove', handlePointerMove, { passive: false });
        window.addEventListener('keydown', handleKeyDown, { passive: false });
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', onResize);

        return () => {
            clearTimeout(resizeTimer);
            unlockScroll();
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('pointerdown', handlePointerDown);
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', onResize);
            if (tl) tl.kill();
        };
    }, [canAnimate]);

    return (
        <section ref={comp} className="w-full h-[100dvh] bg-white overflow-hidden relative">
            {/* Initial Hero text */}
            <div ref={hero1Text} className="absolute inset-0 flex flex-col items-center justify-center z-[50] text-center px-6 pointer-events-none">
                <h1 className="text-white text-4xl sm:text-7xl lg:text-9xl font-black leading-[1.1] mb-6 drop-shadow-2xl">
                    Lumea ta, Pin24.
                </h1>
                <p className="text-white/90 text-base sm:text-2xl font-bold max-w-2xl drop-shadow-lg">
                    Experiență completă, acum la scară largă.
                </p>
            </div>

            {/* Main Hero clipping container */}
            <div ref={heroImageRef} className="absolute inset-0 z-20">
                <img
                    ref={heroImgEl}
                    src="/new hero page.png"
                    className="w-full h-full object-cover origin-center"
                    alt="Pin24 Hero"
                />
                {/* Product Footer */}
                <div
                    ref={cardFooterRef}
                    className="absolute bg-white flex items-center justify-between rounded-b-[24px] px-4 shadow-inner border-t border-gray-100"
                >
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

            {/* Final Text */}
            <div className="absolute z-30 top-[8%] lg:top-[12%] text-center w-full px-6 pointer-events-none">
                <h2 className="hero-final-text text-3xl sm:text-5xl font-black text-gray-900 mb-3 opacity-0">
                    Pin24, reimaginat.
                </h2>
                <p className="hero-final-text text-gray-500 font-medium text-base sm:text-lg opacity-0 max-w-xl mx-auto">
                    Gestionează-ți favoritele și vizualizează hărțile în timp real.
                </p>
            </div>

            {/* Side cards - Desktop only */}
            <div className="hidden lg:block absolute inset-0 z-15 pointer-events-none">
                <Card innerRef={cardRefs[0]} image="/CATEGORIES.jpeg" title="Căutare" subtext="Filtre active" amount="Harta" color="bg-indigo-600" />
                <Card innerRef={cardRefs[1]} image="/favorite page.jpeg" title="Favorite" subtext="Actualizat" amount="4" color="bg-rose-500" />
                <Card innerRef={cardRefs[2]} image="/listing example details.jpeg" title="Detalii" subtext="Preț actual" amount="€2.5k" color="bg-emerald-500" />
                <Card innerRef={cardRefs[3]} image="/listing example.jpeg" title="Recent" subtext="Postat azi" amount="Nou" color="bg-orange-500" />
            </div>
        </section>
    );
}
