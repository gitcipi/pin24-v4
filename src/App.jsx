import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Categories } from './components/Categories';
import { Philosophy } from './components/Philosophy';
import { Install } from './components/Install';
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="bg-background text-foreground min-h-screen selection:bg-accent selection:text-white">
      <Navbar />
      <main>
        <div className="h-screen overflow-hidden">
          <Hero />
        </div>
        <Categories />
        <Philosophy />
        <Install />
      </main>
      <Footer />
    </div>
  );
}

export default App;
