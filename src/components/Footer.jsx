import React from 'react';

export function Footer() {
    return (
        <footer className="bg-[#050505] text-[#ededed] border-t border-white/5 px-6 py-20 relative z-10 w-full overflow-hidden">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">

                <div className="md:w-1/3 flex flex-col gap-6">
                    <div className="text-3xl font-bold tracking-tight">Pin24</div>
                    <p className="font-serif italic text-white/50 text-xl max-w-sm">
                        Piața modernă unde îți listezi lumea în câteva secunde.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16">
                    <div className="flex flex-col gap-4 text-sm">
                        <span className="font-bold opacity-100 mb-2">Platformă</span>
                        <a href="#" className="opacity-60 hover:opacity-100 transition-opacity">Descarcă</a>
                        <a href="#" className="opacity-60 hover:opacity-100 transition-opacity">Categorii</a>
                        <a href="#" className="opacity-60 hover:opacity-100 transition-opacity">Cum funcționează</a>
                    </div>

                    <div className="flex flex-col gap-4 text-sm">
                        <span className="font-bold opacity-100 mb-2">Vinde</span>
                        <a href="#" className="opacity-60 hover:opacity-100 transition-opacity">Pentru vânzători</a>
                        <a href="#" className="opacity-60 hover:opacity-100 transition-opacity">Instrumente Pro</a>
                        <a href="#" className="opacity-60 hover:opacity-100 transition-opacity">Verificare</a>
                    </div>

                    <div className="flex flex-col gap-4 text-sm">
                        <span className="font-bold opacity-100 mb-2">Companie</span>
                        <a href="#" className="opacity-60 hover:opacity-100 transition-opacity">Despre</a>
                        <a href="#" className="opacity-60 hover:opacity-100 transition-opacity">Cariere</a>
                        <a href="#" className="opacity-60 hover:opacity-100 transition-opacity">Presă</a>
                    </div>

                    <div className="flex flex-col gap-4 text-sm">
                        <span className="font-bold opacity-100 mb-2">Legal</span>
                        <a href="#" className="opacity-60 hover:opacity-100 transition-opacity">Termeni</a>
                        <a href="#" className="opacity-60 hover:opacity-100 transition-opacity">Confidențialitate</a>
                        <a href="#" className="opacity-60 hover:opacity-100 transition-opacity">Suport</a>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto border-t border-white/5 mt-20 pt-8 flex flex-col md:flex-row justify-between items-center text-xs opacity-40">
                <p>© {new Date().getFullYear()} Pin24, Inc. Toate drepturile rezervate.</p>
                <div className="flex gap-4 mt-4 md:mt-0 font-mono">
                    <span>V_1.0.0</span>
                    <span>ROM_RO</span>
                </div>
            </div>
        </footer>
    );
}
