import React from 'react';

export default function Hero() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="relative rounded overflow-hidden w-full aspect-[16/5] bg-blue-100 flex items-center justify-center">
        {/* Placeholder for the banner image using a vibrant toy-like background */}
        <img 
          src="https://images.unsplash.com/photo-1608889175123-8ee362201f81?auto=format&fit=crop&q=80&w=2000" 
          alt="Снижение цен на игрушки" 
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-pink-400/40 via-purple-400/30 to-blue-400/40"></div>
        
        {/* Banner Content Layout */}
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
          
          <div className="flex flex-col items-center drop-shadow-2xl">
            <div className="bg-yellow-300 text-[#ef7d00] font-black text-xl md:text-3xl px-6 py-1 rounded-full transform -rotate-3 border-[3px] border-white shadow-lg mb-2 inline-block">
              ДО 10%
            </div>
            
            <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tight text-center drop-shadow-[0_4px_4px_rgba(0,0,0,0.4)]" style={{ WebkitTextStroke: '2px #1e3a8a', paintOrder: 'stroke fill' }}>
              СНИЖЕНИЕ
            </h2>
            <h2 className="text-4xl md:text-6xl font-black text-yellow-300 uppercase tracking-tight text-center mt-[-10px] drop-shadow-[0_4px_4px_rgba(0,0,0,0.4)]" style={{ WebkitTextStroke: '2px #1e3a8a', paintOrder: 'stroke fill' }}>
              ЦЕН НА ИГРУШКИ
            </h2>
            
            <button className="mt-8 bg-white/90 backdrop-blur-sm text-blue-800 font-extrabold text-lg px-10 py-3 rounded-full shadow-[0_5px_15px_rgba(0,0,0,0.3)] border-[3px] border-blue-200 hover:bg-white hover:scale-105 transition-all transform">
              В КАТАЛОГ
            </button>
          </div>
          
        </div>

        {/* Pagination Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5">
          {[1,2,3,4,5,6,7].map((dot, i) => (
            <button 
              key={i} 
              className={`rounded-full transition-all ${i === 3 ? 'w-3 h-3 bg-white shadow-md' : 'w-2 h-2 bg-white/50 hover:bg-white/80'}`}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
}
