import React, { useState, useEffect, useRef } from 'react';
import {
    Heart,
    MapPin,
    Building2,
    Briefcase,
    Shirt,
    Car,
    Smartphone,
    Share2,
    Plus,
    Minus,
    MoreHorizontal
} from 'lucide-react';
import { cn } from '../utils';
import gsap from 'gsap';

const CATEGORIES = [
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
                label: 'Electro',
                location: 'Cluj',
            }
        ]
    }
];

const AUTOPLAY_DURATION = 6000;

export function Categories() {
    const [activeIndex, setActiveIndex] = useState(0);
    const progressBarRef = useRef(null);
    const progressTween = useRef(null);

    useEffect(() => {
        startProgress();
        return () => {
            if (progressTween.current) progressTween.current.kill();
        };
    }, [activeIndex]);

    const startProgress = () => {
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
            // Simplify to base scheme to ensure app opens successfully
            window.location.href = `intent://#Intent;scheme=pin24;package=ro.kobidesign.pin24;S.browser_fallback_url=${encodeURIComponent(androidStore)};end`;
        } else if (isIOS) {
            // iOS Custom Scheme logic
            const start = Date.now();
            window.location.href = `pin24://`; // Opening at root to prevent path errors

            // If the app is installed, the browser will background/hide. 
            // We only redirect if the user is STILL on the page after a short lag.
            const timer = setTimeout(() => {
                if (Date.now() - start < 2000 && document.visibilityState === 'visible') {
                    window.location.href = iosStore;
                }
            }, 1200);

            // Kill the timer immediately if the page starts to hide (app is opening)
            window.addEventListener('pagehide', () => clearTimeout(timer), { once: true });
        }
    };

    const activeCategory = CATEGORIES[activeIndex];
    const activeProduct = activeCategory.products[0];

    return (
        <section id="categories-section" className="relative h-screen w-full overflow-hidden flex flex-col items-center bg-black">
            {/* Background Images - 100% Opacity, NO BLUR */}
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
                        className="w-full h-full object-cover brightness-[0.7]"
                    />
                    {/* Subtle gradient to ensure text readability */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent" />
                </div>
            ))}

            {/* Left-Aligned Header Area (matching Revolut) */}
            <div className="absolute top-[6%] md:top-[12%] left-0 md:left-[10%] z-20 w-full md:max-w-xl text-center md:text-left px-6">
                <h2 className="text-white text-3xl md:text-7xl font-bold mb-3 md:mb-6 tracking-tight animate-in fade-in slide-in-from-left-8 duration-700">
                    {activeCategory.title}
                </h2>
                <p className="text-sm md:text-xl text-white/90 font-medium mb-6 md:mb-10 leading-relaxed max-w-md mx-auto md:mx-0 animate-in fade-in slide-in-from-left-8 duration-700 delay-100">
                    {activeCategory.description}
                </p>
                <button
                    onClick={() => handleDeepLink(`category/${activeCategory.id}`)}
                    className="bg-white/95 backdrop-blur-md text-black px-6 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl font-black text-sm md:text-base hover:scale-105 transition-transform shadow-2xl animate-in fade-in slide-in-from-left-8 duration-700 delay-200"
                >
                    Explorează {activeCategory.name}
                </button>
            </div>

            {/* Thin Bordered Central Frame (matching Revolut) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] md:-translate-y-[50%] z-20 w-[280px] md:w-[360px] aspect-[1/1.3] border-2 border-white/40 rounded-[2.5rem] bg-black/5 pt-6 px-6 pb-3 md:pt-8 md:px-8 md:pb-4 flex flex-col items-center justify-between text-center overflow-hidden animate-in zoom-in-95 fade-in duration-1000">
                {/* Thin Highlight Shine */}
                <div className="absolute inset-0 pointer-events-none border border-white/20 rounded-[2.5rem]" />

                <div className="mt-4 md:mt-8">
                    <p className="text-white/60 text-[9px] md:text-[10px] uppercase font-bold tracking-widest mb-1">{activeProduct.label}</p>
                    <h3 className="text-white text-3xl md:text-5xl font-black tracking-tighter mb-4">
                        {activeProduct.price}
                    </h3>
                    <button
                        onClick={() => handleDeepLink(`product/${activeCategory.id}`)}
                        className="bg-white text-black px-5 py-2 md:px-6 md:py-2 rounded-full text-xs md:text-sm font-black hover:scale-105 transition-transform shadow-xl"
                    >
                        Vezi detalii
                    </button>
                </div>

                {/* Bottom Circular Action Buttons */}
                <div className="flex gap-3 mb-0">
                    {[
                        { path: '/navbar/navbar-favorites.svg', bg: 'bg-white/10', size: 'w-9 h-9 md:w-10 md:h-10', offset: '-translate-x-[15px] translate-y-[5px]', link: 'favorites' },
                        { path: '/navbar/navbar-new-ad.svg', bg: 'bg-white/80', invert: true, size: 'w-12 h-12 md:w-13 md:h-13', imgSize: 'w-6 h-6', link: 'new-ad' },
                        { path: '/UI/conversation.svg', bg: 'bg-white/10', size: 'w-9 h-9 md:w-10 md:h-10', offset: 'translate-x-[15px] translate-y-[5px]', link: 'chat' }
                    ].map((icon, i) => (
                        <div
                            key={i}
                            onClick={() => handleDeepLink(icon.link)}
                            className={cn(
                                "rounded-full backdrop-blur-xl border border-white/20 flex items-center justify-center cursor-pointer hover:scale-110 transition-all",
                                icon.bg,
                                icon.size,
                                icon.offset
                            )}
                        >
                            <img
                                src={icon.path}
                                className={cn(
                                    icon.imgSize || "w-5 h-5",
                                    icon.invert ? "brightness-0" : "brightness-0 invert"
                                )}
                                alt=""
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Category Pill Switcher (Botom Overlay) */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center w-full overflow-visible">
                <div className="flex flex-nowrap gap-4 md:gap-10 justify-center overflow-x-auto no-scrollbar py-10 px-6 md:px-32 max-w-full overflow-y-visible">
                    {CATEGORIES.map((cat, index) => {
                        const isActive = index === activeIndex;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => handleCategoryClick(index)}
                                className={cn(
                                    "p-3 md:px-8 md:py-3 rounded-full text-xs md:text-sm font-black transition-all relative shrink-0 border-2 flex items-center md:gap-3",
                                    isActive
                                        ? "bg-white/90 text-black border-white shadow-xl scale-110 z-10"
                                        : "bg-black/40 text-white/70 border-white/10 hover:bg-black/60 hover:text-white"
                                )}
                            >
                                <img
                                    src={cat.icon}
                                    className={cn(
                                        "w-5 h-5 transition-all",
                                        isActive ? "brightness-0" : "brightness-0 invert opacity-70"
                                    )}
                                    alt=""
                                />
                                <span className="hidden md:block whitespace-nowrap">{cat.name}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
