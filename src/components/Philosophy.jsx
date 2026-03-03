import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMotion } from '../hooks/useMotion';

gsap.registerPlugin(ScrollTrigger);

export function Philosophy() {
    const container = useRef(null);
    const contentRef = useRef(null);
    const canAnimate = useMotion();

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            if (!canAnimate) {
                gsap.set(contentRef.current, { opacity: 1, y: 0 });
                return;
            }

            gsap.fromTo(contentRef.current,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: contentRef.current,
                        start: 'top 85%',
                    }
                }
            );

        }, container);
        return () => ctx.revert();
    }, [canAnimate]);

    const handleScrollToInstall = () => {
        const element = document.getElementById('install-section');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section ref={container} className="relative py-32 md:py-56 w-full bg-white flex items-center justify-center border-t border-gray-50 font-onest overflow-hidden">
            {/* Subtle background decoration */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

            <div ref={contentRef} className="max-w-5xl mx-auto px-6 text-center opacity-0 translate-y-5 relative z-10">
                <div className="flex flex-col items-center">
                    {/* Minimal Badge */}
                    <div className="mb-8 py-1.5 px-4 bg-accent/10 rounded-full">
                        <p className="text-[11px] md:text-[12px] uppercase tracking-[0.3em] text-accent font-black font-funnel">
                            SIGURANȚĂ ȘI CONTROL
                        </p>
                    </div>

                    {/* Headline */}
                    <h2 className="text-4xl md:text-8xl font-black text-gray-900 tracking-tighter leading-[0.95] font-onest mb-10 md:mb-14">
                        O PLATFORMĂ SIGURĂ
                    </h2>

                    {/* Body Text - EXACT as provided */}
                    <div className="max-w-3xl mx-auto">
                        <p className="text-gray-600 text-xl md:text-3xl font-medium leading-[1.4] font-onest mb-12 md:mb-16 text-balance">
                            Cu Pin24, intri într-un nou standard de siguranță pe marketplace — unde protecțiile noastre construite special pentru platformă și instrumentele de confidențialitate te ajută să folosești aplicația cu încredere, zi de zi.
                        </p>
                    </div>

                    {/* Primary Button */}
                    <div>
                        <button
                            onClick={handleScrollToInstall}
                            className="bg-black text-white px-12 py-5 rounded-full text-lg font-black hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.3)] font-onest"
                        >
                            Instalează Aplicația
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

