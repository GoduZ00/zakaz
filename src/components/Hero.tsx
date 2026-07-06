import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Banner {
  id: number;
  image_url: string;
  button_link: string;
  is_active: boolean;
}

export default function Hero() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    supabase.from('banners').select('*').eq('is_active', true).order('id').then(({ data }) => {
      if (data && data.length > 0) setBanners(data);
    });
  }, []);

  if (banners.length === 0) return null;

  const b = banners[current];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="relative rounded overflow-hidden w-full aspect-[16/5] bg-gray-100">
        <Link to={b.button_link || '/catalog'}>
          <img
            src={b.image_url}
            alt="Баннер"
            className="w-full h-full object-cover"
          />
        </Link>

        {banners.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2.5">
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
