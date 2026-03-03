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
                'fixed left-0 right-0 z-50 transition-all duration-500 ease-in-out flex justify-center pointer-events-auto',
                scrolled ? 'top-4' : 'top-2',
                visible ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'
            )}
        >
            <div className={cn(
                "w-[90%] md:w-[700px] px-5 md:px-8 py-2.5 md:py-3.5 flex items-center justify-between rounded-full border transition-all duration-500",
                scrolled
                    ? "bg-white border-black/5 shadow-none"
                    : "bg-white border-white/10 shadow-none"
            )}>
                {/* Logo Left */}
                <a
                    href="#"
                    className="hover:scale-105 transition-transform shrink-0"
                    onClick={(e) => handleScrollTo(e, 'top')}
                >
                    <img
                        src="/pin24.svg"
                        alt="Pin24 Logo"
                        className="h-5 md:h-7 w-auto transition-all duration-300"
                    />
                </a>

                {/* Desktop Links (Hidden on Mobile) */}
                <div className="hidden md:flex items-center gap-12">
                    <a
                        href="#categories-section"
                        onClick={(e) => handleScrollTo(e, 'categories-section')}
                        className="text-sm font-medium text-black hover:-translate-y-[1px] transition-transform relative group font-onest"
                    >
                        Categorii
                        <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
                    </a>

                    <a
                        href="#install-section"
                        onClick={(e) => handleScrollTo(e, 'install-section')}
                        className="text-sm font-semibold bg-black text-white px-8 py-2.5 rounded-full hover:scale-105 transition-transform duration-300 shadow-none font-onest"
                    >
                        Descarcă
                    </a>
                </div>

                {/* Mobile Button (Visible only on small screens) */}
                <a
                    href="#install-section"
                    onClick={(e) => handleScrollTo(e, 'install-section')}
                    className="md:hidden text-xs font-bold bg-black text-white px-5 py-2 rounded-full hover:scale-105 transition-transform duration-300 shadow-none font-onest"
                >
                    Descarcă
                </a>
            </div>
        </nav>
    );
}

