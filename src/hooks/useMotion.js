import { useState, useEffect } from 'react';

export function useMotion() {
    const [canAnimate, setCanAnimate] = useState(() => {
        if (typeof window !== 'undefined') {
            return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        }
        return true;
    });

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

        const handleChange = (e) => {
            setCanAnimate(!e.matches);
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    return canAnimate;
}
