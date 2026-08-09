import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface NewsItem {
  id: number;
  title: string;
  date: string;
  image_url: string | null;
  badge: string | null;
  content: string | null;
  is_active: boolean;
}

export default function News() {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    supabase.from('news').select('*').eq('is_active', true).order('id', { ascending: false }).then(({ data }) => {
      if (data) setNews(data.slice(0, 4));
    });
  }, []);

  return (
    <div className="bg-[#f9f9f9] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-4">
          <h2 className="text-3xl font-light text-gray-900">Новости</h2>
          <a href="#" className="text-[11px] font-bold text-gray-400 uppercase tracking-wider hover:text-[#ef7d00] transition-colors mb-1">
            ВСЕ НОВОСТИ
          </a>
        </div>

        {news.length === 0 ? (
          <div className="text-gray-400 text-sm text-center py-12">Нет новостей</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {news.map((item) => (
              <div key={item.id} className="bg-white rounded overflow-hidden border border-gray-100 hover:shadow-md transition-shadow group cursor-pointer flex flex-col">
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-50 flex items-center justify-center p-4">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover rounded mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300 text-4xl font-bold">?</div>
                  )}
                  {item.badge && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="bg-white/95 text-gray-900 font-bold px-4 py-2 rounded shadow-sm text-sm text-center transform -rotate-2 border border-gray-100">
                        {item.badge}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-5 flex-grow border-t border-gray-50">
                  <div className="text-[11px] text-gray-400 mb-2 uppercase tracking-wider">{item.date}</div>
                  <h3 className="text-[13px] font-medium text-gray-800 leading-relaxed group-hover:text-[#ef7d00] transition-colors mb-2">
                    {item.title}
                  </h3>
                  {item.content && (
                    <p className="text-[13px] text-gray-500 leading-relaxed whitespace-pre-line">
                      {item.content}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 flex justify-center">
          <button className="text-[12px] font-bold text-[#ef7d00] uppercase tracking-wider border border-[#ef7d00] rounded-sm px-10 py-3.5 hover:bg-[#ef7d00] hover:text-white transition-colors">
            ЗАГРУЗИТЬ ЕЩЕ
          </button>
        </div>
      </div>
    </div>
  );
}
