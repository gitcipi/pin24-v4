import React from 'react';

export function Install() {
    return (
        <section className="py-24 md:py-40 px-6 max-w-5xl mx-auto text-center relative z-10 bg-background">
            <h2 className="text-4xl md:text-7xl font-bold tracking-tight mb-12 text-balance leading-tight">
                Pin24 pe dispozitivul tău
            </h2>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                {/* App Store Button - Clean Flat */}
                <a
                    href="https://apps.apple.com/pl/app/pin24/id6756490803"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative hover:scale-105 transition-all duration-500"
                >
                    <div className="h-[54px] md:h-[60px] flex items-center justify-center">
                        <img
                            src="/app_store_blackbox_clean.png"
                            alt="Download on the App Store"
                            className="h-full w-auto block"
                        />
                    </div>
                </a>

                {/* Google Play Button - Clean Flat */}
                <a
                    href="https://play.google.com/store/apps/details?id=ro.kobidesign.pin24"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative hover:scale-105 transition-all duration-500"
                >
                    <div className="h-[54px] md:h-[60px] flex items-center justify-center">
                        <img
                            src="/google_play_icon.png"
                            alt="Get it on Google Play"
                            className="h-full w-auto block"
                        />
                    </div>
                </a>
            </div>
        </section>
    );
}
