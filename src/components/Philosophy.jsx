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
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: contentRef.current,
                        start: 'top 85%',
                    }
                }
            );

        }, container);
        return () => ctx.revert();
    }, [canAnimate]);

    return (
        <section ref={container} className="relative py-24 md:py-32 w-full bg-white flex items-center justify-center border-t border-gray-50">
            <div ref={contentRef} className="max-w-3xl mx-auto px-6 text-center opacity-0 translate-y-5">

                {/* Minimalist Approach */}
                <div className="space-y-12">
                    <div className="space-y-3">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-8">
                            Filozofia noastră
                        </p>
                        <p className="text-gray-400 text-lg md:text-xl font-medium leading-relaxed">
                            Majoritatea piețelor se concentrează pe: <br />
                            <span className="text-gray-300">anunțuri infinite și filtre zgomotoase.</span>
                        </p>
                    </div>

                    <div className="w-12 h-[1px] bg-gray-100 mx-auto"></div>

                    <p className="text-gray-900 text-xl md:text-2xl font-medium leading-relaxed max-w-2xl mx-auto">
                        Noi ne concentrăm pe: <br />
                        <span className="text-black italic">descoperire fără efort</span> și anunțuri de încredere.
                    </p>
                </div>

            </div>
        </section >
    );
}
