import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { useMotion } from '../hooks/useMotion';
import { ShoppingBag, Tag, Home, Briefcase } from 'lucide-react';
import { cn } from '../utils';

const Card = ({ innerRef, image, title, icon: Icon, color, zIndex = 30 }) => (
    <div
        ref={innerRef}
        className="absolute overflow-hidden rounded-[32px] bg-transparent flex flex-col pointer-events-auto border-none shadow-none"
        style={{ zIndex }}
    >
        <img src={image} className="absolute inset-0 w-full h-full object-cover object-top" alt={title} />
        <div className="absolute left-4 right-4 bottom-4 bg-white/95 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between shadow-none">
            <div className="flex items-center gap-3">
                <div className={`${color} w-9 h-9 rounded-full flex items-center justify-center shrink-0`}>
                    {typeof Icon === 'string' ? (
                        <img src={Icon} alt="" className="w-5 h-5 brightness-0 invert" />
                    ) : (
                        <Icon className="w-5 h-5 text-white" />
                    )}
                </div>
                <div className="text-left">
                    <p className="text-[12px] font-bold text-black uppercase tracking-tight font-funnel">{title}</p>
                    <p className="text-[10px] text-gray-500 font-medium">Video Feed</p>
                </div>
            </div>
            <p className="text-sm font-black text-black font-funnel tracking-tighter">LIVE</p>
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

    const cardRefs = [useRef(null), useRef(null), useRef(null)];

    const state = useRef('landscape');
    const isAnimating = useRef(false);
    const hasCompleted = useRef(false);

    const heroImage = "/new hero/Chat securizat.jpg"; // Angajezi în mijloc
    const sideCardsData = [
        { image: "/new hero/Gasesti Rapid ce Cauti.jpg", title: "Cumperi", icon: "/UI/empty@4x.png", color: "bg-blue-600" }, // stânga
        { image: "/new hero/Faci bani mai ușor.jpg", title: "Vinzi", icon: "/UI/empty@4x.png", color: "bg-emerald-500" }     // dreapta
    ];

    useLayoutEffect(() => {
        if (!canAnimate) return;

        let tl;
        let resizeTimer;
        let rotationInterval;

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

        const unlockInternal = () => {
            if (hasCompleted.current) return;
            hasCompleted.current = true;
            state.current = 'portrait';
            if (tl) tl.progress(1);
            unlock();
        };

        if (!hasCompleted.current) {
            lock();
            window.scrollTo(0, 0);
        }

        window.addEventListener('pin24-unlock', unlockInternal);

        const init = () => {
            if (tl) tl.kill();

            const isMobile = window.innerWidth < 1024;
            const rect = comp.current.getBoundingClientRect();

            const cardH = isMobile
                ? Math.min(rect.height * 0.55, 480)
                : Math.min(rect.height * 0.55, 550);
            const cardW = cardH * 0.75;

            const bottomInsetPx = isMobile ? 5 : 20;
            const topInsetPx = rect.height - cardH - bottomInsetPx;
            const leftInsetPx = (rect.width - cardW) / 2;
            const rightInsetPx = leftInsetPx;
            const ft = `${rect.height - (cardH / 2) - bottomInsetPx}px`;

            // ── ALWAYS set to LANDSCAPE (start) state ──
            gsap.set(heroImageRef.current, {
                clipPath: 'inset(0px 0px 0px 0px round 0px)',
            });
            gsap.set(heroImgEl.current, { scale: 1 });
            gsap.set(cardFooterRef.current, {
                opacity: 0, y: 15,
                width: cardW - 32,
                bottom: `${bottomInsetPx + 16}px`,
                left: '50%', xPercent: -50,
            });
            // Outline is static at card size (no animation)
            gsap.set('.hero-mask-outline', {
                opacity: 1,
                top: topInsetPx, left: leftInsetPx,
                width: cardW, height: cardH,
                borderRadius: '32px', borderWidth: '2.5px',
                borderColor: 'rgba(255, 255, 255, 0.4)'
            });
            gsap.set(hero1Text.current, { opacity: 1, y: 0, scale: 1 });
            gsap.set(cardRefs[0].current, {
                opacity: 0, scale: 0.5, xPercent: -200, yPercent: -50,
                left: '50%', top: '50%', pointerEvents: 'none',
                width: cardW, height: cardH,
            });
            gsap.set(cardRefs[1].current, {
                opacity: 0, scale: 0.5, xPercent: 100, yPercent: -50,
                left: '50%', top: '50%', pointerEvents: 'none',
                width: cardW, height: cardH,
            });
            gsap.set('.hero-final-text', { opacity: 0, y: 20 });

            // ── Timeline: landscape → portrait ──
            tl = gsap.timeline({ paused: true });

            tl.to(hero1Text.current, {
                opacity: 0, scale: 0.9, y: -30,
                duration: 0.35, ease: 'power2.in',
            }, 0);

            tl.to(heroImageRef.current, {
                clipPath: `inset(${topInsetPx}px ${leftInsetPx}px ${bottomInsetPx}px ${rightInsetPx}px round 32px)`,
                duration: 0.8, ease: 'power3.inOut',
            }, 0.05);

            // Image zooms in 20% during scroll for a dynamic crop effect
            tl.to(heroImgEl.current, {
                scale: 1.2, duration: 0.8, ease: 'power3.inOut',
            }, 0.05);

            tl.to(cardFooterRef.current, {
                opacity: 1, y: 0, duration: 0.3, ease: 'power2.out',
            }, 0.4);

            if (!isMobile) {
                tl.to(cardRefs[0].current, {
                    opacity: 1, scale: 0.88, xPercent: -152,
                    top: ft, width: cardW, height: cardH,
                    pointerEvents: 'auto', duration: 0.6, ease: 'power2.out'
                }, 0.3);
                tl.to(cardRefs[1].current, {
                    opacity: 1, scale: 0.88, xPercent: 52,
                    top: ft, width: cardW, height: cardH,
                    pointerEvents: 'auto', duration: 0.6, ease: 'power2.out'
                }, 0.3);
            }

            tl.to('.hero-final-text', {
                opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out'
            }, 0.6);

            // If already in portrait, snap to the end immediately
            if (state.current === 'portrait') {
                tl.progress(1);
            }
        };

        const playForward = () => {
            if (isAnimating.current || state.current !== 'landscape' || !tl) return;
            isAnimating.current = true;
            state.current = 'portrait';

            tl.timeScale(1).play().then(() => {
                isAnimating.current = false;
                hasCompleted.current = true;
                unlock();
            });
        };

        const playReverse = () => {
            if (isAnimating.current || state.current !== 'portrait' || !tl) return;
            if (window.scrollY > 5) return;
            isAnimating.current = true;
            state.current = 'landscape';
            hasCompleted.current = false;

            document.body.style.overflow = 'hidden';
            document.body.style.touchAction = 'none';
            document.documentElement.style.overflow = 'hidden';

            tl.timeScale(1.3).reverse().then(() => {
                isAnimating.current = false;
                lock();
            });
        };

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

        let touchStartY = 0;
        let touchHandled = false;
        const handleTouchStart = (e) => { touchStartY = e.touches[0].clientY; touchHandled = false; };
        const handleTouchMove = (e) => {
            if (isAnimating.current) {
                e.preventDefault();
                return;
            }
            if (touchHandled) return;

            const dy = touchStartY - e.touches[0].clientY;
            if (hasCompleted.current && state.current === 'portrait') {
                if (window.scrollY < 10) document.body.style.overscrollBehaviorY = 'none';
                else document.body.style.overscrollBehaviorY = '';

                if (dy < -10 && window.scrollY < 5) {
                    touchHandled = true;
                    e.preventDefault();
                    playReverse();
                }
                return;
            }
            if (dy > 15 && state.current === 'landscape') {
                touchHandled = true;
                e.preventDefault();
                playForward();
            }
        };

        let pointerStartY = 0;
        const handlePointerDown = (e) => { pointerStartY = e.clientY; };
        const handlePointerMove = (e) => {
            if (e.pointerType === 'touch' || e.buttons !== 1) return;
            if (isAnimating.current) {
                e.preventDefault();
                return;
            }
            const dy = pointerStartY - e.clientY;
            if (dy > 15 && state.current === 'landscape') {
                e.preventDefault();
                playForward();
            }
        };

        let lastHeight = window.innerHeight;
        let lastWidth = window.innerWidth;
        const onResize = () => {
            const currentWidth = window.innerWidth;
            const currentHeight = window.innerHeight;
            // Only trigger if changes are significant (ignore small mobile address bar jumps)
            if (Math.abs(currentWidth - lastWidth) < 10 && Math.abs(currentHeight - lastHeight) < 50) return;

            lastWidth = currentWidth;
            lastHeight = currentHeight;

            if (resizeTimer) clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                // Keep progress state relative to current state
                const wasPortrait = state.current === 'portrait';
                init();
                if (wasPortrait && tl) tl.progress(1);
            }, 250);
        };

        window.addEventListener('wheel', handleWheel, { passive: false });
        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchmove', handleTouchMove, { passive: false });
        window.addEventListener('pointerdown', handlePointerDown);
        window.addEventListener('pointermove', handlePointerMove, { passive: false });
        window.addEventListener('resize', onResize);

        setTimeout(init, 50);

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
        <section ref={comp} className="w-full h-screen bg-white overflow-hidden relative font-onest">
            {/* Initial Text Overlay */}
            <div ref={hero1Text} className="absolute inset-0 flex flex-col items-center justify-start pt-[12vh] z-[50] text-center px-6 pointer-events-none">
                <h1 className="text-black text-5xl sm:text-7xl lg:text-8xl font-black leading-[1.05] mb-6 font-onest">
                    Mai puține vorbe.<br />Mai mult video.
                </h1>
                <p className="text-gray-900 text-lg sm:text-2xl font-semibold max-w-2xl opacity-90">
                    Un marketplace cu vibe de social: vezi video full-screen, dai share și urmărești favoriții.
                </p>
            </div>

            <div ref={heroImageRef} className="absolute inset-0 z-20 pointer-events-none">
                {/* Thin Outline Rama - Always present underneath the text */}
                <div className="hero-mask-outline absolute border border-white/40 pointer-events-none z-30"></div>
                <img
                    ref={heroImgEl}
                    src={heroImage}
                    className="w-full h-full object-cover object-top"
                    alt="Pin24 Hero"
                />

                <div ref={cardFooterRef} className="absolute bg-white/95 backdrop-blur-md flex items-center justify-between rounded-2xl p-4 shadow-none">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 bg-yellow-500">
                            <img src="/categories/jobs.png" alt="" className="w-5 h-5 brightness-0 invert" />
                        </div>
                        <div className="text-left">
                            <p className="text-[12px] font-bold text-black uppercase tracking-tight font-funnel">Angajezi</p>
                            <p className="text-[10px] text-gray-500 font-medium">Video Feed</p>
                        </div>
                    </div>
                    <p className="text-sm font-black text-black font-funnel tracking-tighter">LIVE</p>
                </div>
            </div>

            {/* Final Background Text */}
            <div className="absolute z-10 top-[20%] lg:top-[25%] text-center w-full px-6 pointer-events-none">
                <h2 className="hero-final-text text-4xl sm:text-6xl font-black text-gray-900 mb-4 opacity-0 font-onest tracking-tight">
                    Pin24, reimaginat.
                </h2>
                <p className="hero-final-text text-gray-500 font-medium text-lg sm:text-xl opacity-0 max-w-xl mx-auto font-onest leading-snug">
                    Descoperă anunțuri video full-screen și urmărește ceea ce te interesează cu adevărat.
                </p>
            </div>

            {/* Side Cards (Matching Revolut Style) */}
            <div className="hidden lg:block absolute inset-0 z-15 pointer-events-none">
                <Card
                    innerRef={cardRefs[0]}
                    image={sideCardsData[0].image}
                    title={sideCardsData[0].title}
                    icon={sideCardsData[0].icon}
                    color={sideCardsData[0].color}
                />
                <Card
                    innerRef={cardRefs[1]}
                    image={sideCardsData[1].image}
                    title={sideCardsData[1].title}
                    icon={sideCardsData[1].icon}
                    color={sideCardsData[1].color}
                />
            </div>


        </section>
    );
}

