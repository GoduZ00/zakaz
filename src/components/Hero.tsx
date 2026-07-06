import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Banner {
  id: number;
  title: string;
  subtitle: string;
  badge: string;
  button_text: string;
  button_link: string;
  image_url: string;
  is_active: boolean;
}

export default function Hero() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    supabase.from('banners').select('*').eq('is_active', true).order('sort_order').then(({ data }) => {
      if (data && data.length > 0) setBanners(data);
    });
  }, []);

  if (banners.length === 0) return null;

  const b = banners[current];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="relative rounded overflow-hidden w-full aspect-[16/5] bg-blue-100 flex items-center justify-center">
        <img
          src={b.image_url || 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?auto=format&fit=crop&q=80&w=2000'}
          alt={b.title}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-pink-400/40 via-purple-400/30 to-blue-400/40"></div>

        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
          <div className="flex flex-col items-center drop-shadow-2xl">
            {b.badge && (
              <div className="bg-yellow-300 text-[#ef7d00] font-black text-xl md:text-3xl px-6 py-1 rounded-full transform -rotate-3 border-[3px] border-white shadow-lg mb-2 inline-block">
                {b.badge}
              </div>
            )}
            <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tight text-center drop-shadow-[0_4px_4px_rgba(0,0,0,0.4)]" style={{ WebkitTextStroke: '2px #1e3a8a', paintOrder: 'stroke fill' }}>
              {b.title}
            </h2>
            {b.subtitle && (
              <h2 className="text-4xl md:text-6xl font-black text-yellow-300 uppercase tracking-tight text-center mt-[-10px] drop-shadow-[0_4px_4px_rgba(0,0,0,0.4)]" style={{ WebkitTextStroke: '2px #1e3a8a', paintOrder: 'stroke fill' }}>
                {b.subtitle}
              </h2>
            )}
            <Link to={b.button_link || '/catalog'} className="mt-8 bg-white/90 backdrop-blur-sm text-blue-800 font-extrabold text-lg px-10 py-3 rounded-full shadow-[0_5px_15px_rgba(0,0,0,0.3)] border-[3px] border-blue-200 hover:bg-white hover:scale-105 transition-all transform">
              {b.button_text || 'В КАТАЛОГ'}
            </Link>
          </div>
        </div>

        {banners.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`rounded-full transition-all ${i === current ? 'w-3 h-3 bg-white shadow-md' : 'w-2 h-2 bg-white/50 hover:bg-white/80'}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
