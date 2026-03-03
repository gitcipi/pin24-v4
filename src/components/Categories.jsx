import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../utils';
import gsap from 'gsap';

const CATEGORIES = [
    {
        id: 'auto',
        name: 'Auto & Moto',
        icon: '/categories/auto.svg',
        title: 'Performanță pură.',
        description: 'Găsește vehiculul care transformă fiecare drum într-o experiență. Putere, eleganță și fiabilitate.',
        bgImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2000',
        products: [
            {
                title: 'BMW 740 2023',
                price: '77.300 €',
                label: 'Auto & Moto',
                location: 'Sibiu',
            }
        ]
    },
    {
        id: 'electronics',
        name: 'Electronice',
        icon: '/categories/electronics.svg',
        title: 'Tehnologia de mâine.',
        description: 'Echipamente care îți simplifică viața și te mențin conectat. Performanță de top pentru pasiunile tale.',
        bgImage: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=2000',
        products: [
            {
                title: 'iPhone 15 Pro Max',
                price: '5.400 lei',
                label: 'Electronice',
                location: 'Cluj',
            }
        ]
    },
    {
        id: 'imobiliare',
        name: 'Imobiliare',
        icon: '/categories/imobiliare.svg',
        title: 'Spațiul tău, definit.',
        description: 'Descoperă proprietăți care îți reflectă stilul de viață. De la apartamente urbane la reședințe exclusiviste.',
        bgImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000',
        products: [
            {
                title: 'Vilă Modernă Lux',
                price: '2.400.000 €',
                label: 'Imobiliare',
                location: 'Sibiu',
            }
        ]
    },
    {
        id: 'jobs',
        name: 'Joburi',
        icon: '/categories/jobs.svg',
        title: 'Cariera ta, viitorul tău.',
        description: 'Conectăm talentele cu oportunitățile care contează. Găsește următorul pas în evoluția ta profesională.',
        bgImage: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=2000',
        products: [
            {
                title: 'Senior Developer',
                price: '9.000 €/lună',
                label: 'Joburi',
                location: 'Remote',
            }
        ]
    },
    {
        id: 'fashion',
        name: 'Modă',
        icon: '/categories/fashion.svg',
        title: 'Stil care inspiră.',
        description: 'Definește-ți identitatea prin piese vestimentare unice. Vintage sau contemporan, totul este la un click distanță.',
        bgImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000',
        products: [
            {
                title: 'Geacă Acne Studios',
                price: '2.100 lei',
                label: 'Modă',
                location: 'București',
            }
        ]
    }
];

const AUTOPLAY_DURATION = 6000;

export function Categories() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const progressBarRef = useRef(null);
    const progressTween = useRef(null);
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.3 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) observer.unobserve(sectionRef.current);
        };
    }, []);

    useEffect(() => {
        if (isVisible) {
            startProgress();
        }
        return () => {
            if (progressTween.current) progressTween.current.kill();
        };
    }, [activeIndex, isVisible]);

    const startProgress = () => {
        if (!progressBarRef.current) return;
        if (progressTween.current) progressTween.current.kill();

        progressTween.current = gsap.fromTo(progressBarRef.current,
            { scaleX: 0 },
            {
                scaleX: 1,
                duration: AUTOPLAY_DURATION / 1000,
                ease: "none",
                transformOrigin: "left center",
                onComplete: () => {
                    setActiveIndex((prev) => (prev + 1) % CATEGORIES.length);
                }
            }
        );
    };

    const handleCategoryClick = (index) => {
        setActiveIndex(index);
    };

    const handleDeepLink = (path) => {
        const ua = navigator.userAgent;
        const isIOS = /iPhone|iPad|iPod/i.test(ua);
        const isAndroid = /Android/i.test(ua);

        if (!isIOS && !isAndroid) {
            const installSection = document.getElementById('install-section');
            if (installSection) installSection.scrollIntoView({ behavior: 'smooth' });
            return;
        }

        const iosStore = "https://apps.apple.com/pl/app/pin24/id6756490803";
        const androidStore = "https://play.google.com/store/apps/details?id=ro.kobidesign.pin24";

        if (isAndroid) {
            window.location.href = `intent://#Intent;scheme=pin24;package=ro.kobidesign.pin24;S.browser_fallback_url=${encodeURIComponent(androidStore)};end`;
        } else if (isIOS) {
            const start = Date.now();
            window.location.href = `pin24://`;
            const timer = setTimeout(() => {
                if (Date.now() - start < 2000 && document.visibilityState === 'visible') {
                    window.location.href = iosStore;
                }
            }, 1200);
            window.addEventListener('pagehide', () => clearTimeout(timer), { once: true });
        }
    };

    const activeCategory = CATEGORIES[activeIndex];
    const activeProduct = activeCategory.products[0];

    return (
        <section
            id="categories-section"
            ref={sectionRef}
            className="relative h-[100dvh] w-full overflow-hidden flex flex-col items-center bg-black font-onest"
        >
            {/* Background Images */}
            {CATEGORIES.map((cat, i) => (
                <div
                    key={cat.id}
                    className={cn(
                        "absolute inset-0 transition-opacity duration-1000 ease-in-out z-0",
                        i === activeIndex ? "opacity-100" : "opacity-0 invisible"
                    )}
                >
                    <img
                        src={cat.bgImage}
                        alt={cat.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                </div>
            ))}

            {/* Revolut-style Edge-Anchored Layout */}
            <div className="relative z-20 w-full h-full flex flex-col items-center overflow-hidden px-4">

                {/* TOP ANCHORED: Header Area */}
                <div className="w-full max-w-4xl text-center pt-[clamp(1.5rem,8vh,5rem)] mb-4 shrink-0">
                    <h2 className="text-white text-[clamp(1.5rem,5vw,4.5rem)] font-black mb-1 md:mb-2 tracking-tight animate-in fade-in zoom-in-95 duration-700 font-onest leading-tight">
                        {activeCategory.title}
                    </h2>
                    <p className="hidden md:block text-sm md:text-lg text-white/70 font-medium leading-relaxed max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 font-onest">
                        {activeCategory.description}
                    </p>
                </div>

                {/* CENTERED: Floating Central Card */}
                <div className="flex-1 w-full flex items-center justify-center min-h-0 relative">
                    <div className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[450px] max-h-[90%] aspect-[3/4.2] rounded-[2.5rem] md:rounded-[3rem] bg-black/10 flex flex-col items-center justify-center text-center overflow-hidden border border-white/20 shadow-2xl transition-all duration-300">
                        {/* Internal Content Scaling Wrapper */}
                        <div className="p-4 md:p-8 flex flex-col items-center justify-center h-full w-full transform scale-[0.9] sm:scale-100 origin-center">
                            <p className="text-white/60 text-[10px] md:text-sm uppercase font-bold tracking-widest mb-1 md:mb-4 font-funnel">{activeProduct.label}</p>
                            <h3 className="text-white text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter mb-4 md:mb-10 font-funnel leading-none">
                                {activeProduct.price}
                            </h3>
                            <button
                                onClick={() => handleDeepLink(`product/${activeCategory.id}`)}
                                className="bg-white text-black px-6 py-2 md:px-12 md:py-5 rounded-full text-xs md:text-lg font-black hover:scale-105 transition-transform font-onest mb-5 md:mb-10 shrink-0"
                            >
                                Vezi detalii
                            </button>

                            {/* Bottom Circular Action Buttons */}
                            <div className="flex gap-3 md:gap-5 items-center shrink-0">
                                {[
                                    { path: '/navbar/navbar-favorites.svg', bg: 'bg-white/10', size: 'w-8 h-8 md:w-11 md:h-11', link: 'favorites' },
                                    { path: '/navbar/navbar-new-ad.svg', bg: 'bg-white', invert: true, size: 'w-10 h-10 md:w-15 md:h-15', imgSize: 'w-5 h-5 md:w-7 md:h-7', link: 'new-ad' },
                                    { path: '/UI/conversation.svg', bg: 'bg-white/10', size: 'w-8 h-8 md:w-11 md:h-11', link: 'chat' }
                                ].map((icon, i) => (
                                    <div
                                        key={i}
                                        onClick={() => handleDeepLink(icon.link)}
                                        className={cn(
                                            "rounded-full backdrop-blur-xl border border-white/10 flex items-center justify-center cursor-pointer hover:scale-110 transition-all",
                                            icon.bg,
                                            icon.size
                                        )}
                                    >
                                        <img
                                            src={icon.path}
                                            className={cn(
                                                icon.imgSize || "w-4 h-4 md:w-5 md:h-5",
                                                icon.invert ? "brightness-0" : "brightness-0 invert"
                                            )}
                                            alt=""
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* BOTTOM ANCHORED: Pill Switcher */}
                <div className="w-full flex flex-col items-center shrink-0 pb-[clamp(1rem,4vh,3rem)] pt-2 mt-auto">
                    <div className="flex flex-nowrap gap-2 md:gap-3 justify-center overflow-x-auto no-scrollbar px-2 max-w-full w-full">
                        {CATEGORIES.map((cat, index) => {
                            const isActive = index === activeIndex;
                            return (
                                <div key={cat.id} className="relative group shrink-0">
                                    <button
                                        onClick={() => handleCategoryClick(index)}
                                        className={cn(
                                            "px-4 py-2 md:px-7 md:py-3.5 rounded-full text-[10px] md:text-sm font-bold transition-all relative border flex items-center gap-2 md:gap-3 overflow-hidden",
                                            isActive
                                                ? "bg-white text-black border-white scale-105"
                                                : "bg-black/40 text-white/70 border-white/10 hover:border-white/30"
                                        )}
                                    >
                                        {isActive && (
                                            <div
                                                ref={progressBarRef}
                                                className="absolute inset-0 bg-black/10 pointer-events-none"
                                                style={{ transformOrigin: 'left center' }}
                                            />
                                        )}
                                        <img
                                            src={cat.icon}
                                            className={cn("w-3.5 h-3.5 md:w-5 md:h-5", isActive ? "brightness-0" : "brightness-0 invert opacity-70")}
                                            alt=""
                                        />
                                        <span className="whitespace-nowrap font-onest uppercase tracking-wide hidden sm:inline">{cat.name}</span>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

