import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Categories from './components/Categories';
import News from './components/News';
import About from './components/About';
import Features from './components/Features';
import Reviews from './components/Reviews';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Categories />
        <News />
        <About />
        <Features />
        <Reviews />
      </main>
      <Footer />
    </div>
  );
}
