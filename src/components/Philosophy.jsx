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
        <section ref={container} className="relative py-24 md:py-40 w-full bg-white flex items-center justify-center border-t border-gray-50 font-onest">
            <div ref={contentRef} className="max-w-4xl mx-auto px-6 text-center opacity-0 translate-y-5">
                <div className="space-y-10">
                    <div className="space-y-4">
                        <p className="text-[11px] uppercase tracking-[0.25em] text-blue-600 font-black mb-2 font-funnel">
                            SIGURANȚĂ ȘI CONTROL
                        </p>
                        <h2 className="text-3xl md:text-6xl font-black text-gray-900 tracking-tight leading-[1.1] font-onest">
                            O PLATFORMĂ SIGURĂ
                        </h2>
                    </div>

                    <p className="text-gray-600 text-lg md:text-2xl font-medium leading-relaxed max-w-2xl mx-auto font-onest">
                        Cu Pin24, intri într-un nou standard de siguranță pe marketplace — unde protecțiile noastre construite special pentru platformă și instrumentele de confidențialitate te ajută să folosești aplicația cu încredere, zi de zi.
                    </p>

                    <div className="pt-6">
                        <button
                            onClick={handleScrollToInstall}
                            className="bg-black text-white px-10 py-4 rounded-full text-base font-bold hover:scale-105 transition-transform shadow-none font-onest"
                        >
                            Instalează Aplicația
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

