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

            {/* Flow Layout Container — gap ensures no overlapping at any size */}
            <div className="relative z-20 w-full h-full flex flex-col items-center justify-between gap-4 pt-[clamp(1.5rem,8%,5rem)] pb-[clamp(0.5rem,4%,2rem)] px-4 overflow-hidden">

                {/* Header Area — shrink-0 keeps its height, text scales down */}
                <div className="w-full max-w-4xl text-center shrink-0">
                    <h2 className="text-white text-[clamp(1.5rem,5vw,4.5rem)] font-black mb-1 md:mb-4 tracking-tight animate-in fade-in zoom-in-95 duration-700 font-onest leading-tight">
                        {activeCategory.title}
                    </h2>
                    <p className="hidden md:block text-sm md:text-xl text-white/80 font-medium leading-relaxed max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 font-onest">
                        {activeCategory.description}
                    </p>
                </div>

                {/* Central Card */}
                <div className="flex-1 min-h-0 flex items-center justify-center w-full">
                    <div className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[450px] aspect-[3/4] max-h-[55vh] md:max-h-[600px] rounded-[2rem] md:rounded-[3rem] bg-black/10 backdrop-blur-xl flex flex-col items-center justify-center text-center overflow-hidden border border-white/20 shadow-2xl shrink-0 my-auto">
                        <div className="p-4 md:p-10 flex flex-col items-center justify-center h-full w-full">
                            <p className="text-white/60 text-[10px] md:text-xs uppercase font-bold tracking-widest mb-1 md:mb-4 font-funnel">{activeProduct.label}</p>
                            <h3 className="text-white text-[clamp(1.5rem,6vw,4.5rem)] font-black tracking-tighter mb-3 md:mb-10 font-funnel leading-none">
                                {activeProduct.price}
                            </h3>
                            <button
                                onClick={() => handleDeepLink(`product/${activeCategory.id}`)}
                                className="bg-white text-black px-6 py-2 md:px-12 md:py-5 rounded-full text-xs md:text-lg font-black hover:scale-105 transition-transform font-onest"
                            >
                                Vezi detalii
                            </button>
                        </div>

                        {/* Bottom Circular Action Buttons */}
                        <div className="absolute bottom-3 md:bottom-6 flex gap-3 md:gap-6 items-center">
                            {[
                                { path: '/navbar/navbar-favorites.svg', bg: 'bg-white/10', size: 'w-8 h-8 md:w-12 md:h-12', link: 'favorites' },
                                { path: '/navbar/navbar-new-ad.svg', bg: 'bg-white', invert: true, size: 'w-10 h-10 md:w-16 md:h-16', imgSize: 'w-5 h-5 md:w-8 md:h-8', link: 'new-ad' },
                                { path: '/UI/conversation.svg', bg: 'bg-white/10', size: 'w-8 h-8 md:w-12 md:h-12', link: 'chat' }
                            ].map((icon, i) => (
                                <div
                                    key={i}
                                    onClick={() => handleDeepLink(icon.link)}
                                    className={cn(
                                        "rounded-full backdrop-blur-xl border border-white/10 flex items-center justify-center cursor-pointer hover:scale-110 transition-all shadow-none",
                                        icon.bg,
                                        icon.size
                                    )}
                                >
                                    <img
                                        src={icon.path}
                                        className={cn(
                                            icon.imgSize || "w-4 h-4 md:w-6 md:h-6",
                                            icon.invert ? "brightness-0" : "brightness-0 invert"
                                        )}
                                        alt=""
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Category Pill Switcher — shrink-0 keeps its height */}
                <div className="w-full flex flex-col items-center shrink-0">
                    <div className="flex flex-nowrap gap-2 md:gap-4 justify-center overflow-x-auto no-scrollbar py-2 md:py-4 px-2 md:px-16 max-w-full w-full">
                        {CATEGORIES.map((cat, index) => {
                            const isActive = index === activeIndex;
                            return (
                                <div key={cat.id} className="relative group shrink-0">
                                    <button
                                        onClick={() => handleCategoryClick(index)}
                                        className={cn(
                                            "px-3 py-2 md:px-8 md:py-4 rounded-full text-[10px] md:text-sm font-black transition-all relative border flex items-center gap-1.5 md:gap-3 overflow-hidden shadow-none",
                                            isActive
                                                ? "bg-white text-black border-white scale-105 z-10"
                                                : "bg-black/30 text-white/70 border-white/10 hover:border-white/30 hover:text-white"
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
                                            className={cn(
                                                "w-3.5 h-3.5 md:w-5 md:h-5 transition-all shrink-0",
                                                isActive ? "brightness-0" : "brightness-0 invert opacity-70"
                                            )}
                                            alt=""
                                        />
                                        <span className="whitespace-nowrap font-funnel uppercase tracking-tight hidden min-[1150px]:inline">{cat.name}</span>
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

