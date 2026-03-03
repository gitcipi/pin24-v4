import React, { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '../utils';

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [visible, setVisible] = useState(true);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Check if scrolled past threshold for background change
            setScrolled(currentScrollY > 50);

            // Hide on scroll down, show on scroll up
            if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
                setVisible(false);
            } else {
                setVisible(true);
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleScrollTo = (e, id) => {
        e.preventDefault();
        // Signal the Hero to unlock immediately
        window.dispatchEvent(new CustomEvent('pin24-unlock'));

        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        } else if (id === 'top') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <nav
            className={cn(
                'fixed left-0 right-0 z-50 transition-all duration-300 ease-in-out flex justify-center pointer-events-auto',
                scrolled
                    ? 'top-0 bg-white/80 backdrop-blur-lg border-b border-black/5'
                    : 'top-0 bg-transparent',
                visible ? 'translate-y-0' : '-translate-y-full'
            )}
        >
            <div className="w-full max-w-7xl px-6 md:px-12 py-4 md:py-6 flex items-center justify-between transition-all duration-300">
                {/* Left Side: Logo + Nav */}
                <div className="flex items-center gap-8 md:gap-14">
                    <a
                        href="#"
                        className="hover:scale-105 transition-all shrink-0"
                        onClick={(e) => handleScrollTo(e, 'top')}
                    >
                        <img
                            src="/pin24.svg"
                            alt="Pin24 Logo"
                            className="h-6 md:h-8 w-auto"
                        />
                    </a>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-10">
                        <a
                            href="#categories-section"
                            onClick={(e) => handleScrollTo(e, 'categories-section')}
                            className="text-[15px] font-bold text-black/80 hover:text-black transition-colors font-onest"
                        >
                            Categorii
                        </a>
                    </div>
                </div>

                {/* Right Side: CTA */}
                <div className="flex items-center gap-6">
                    <a
                        href="#install-section"
                        onClick={(e) => handleScrollTo(e, 'install-section')}
                        className="text-[14px] font-bold bg-black text-white px-7 py-2.5 rounded-full hover:scale-105 transition-all duration-300 font-onest"
                    >
                        Descarcă
                    </a>
                </div>
            </div>
        </nav>
    );
}

