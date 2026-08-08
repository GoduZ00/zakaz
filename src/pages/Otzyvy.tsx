import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabase';
import ReviewForm from '../components/ReviewForm';

interface Review {
  id: number;
  name: string;
  rating: number;
  text: string;
  created_at: string;
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase();
  } catch {
    return '';
  }
}

export default function Otzyvy() {
  const [reviews, setReviews] = useState<Review[]>([]);

  async function load() {
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    if (data) setReviews(data);
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Helmet><title>Отзывы — Vending Trade</title><meta name="description" content="Отзывы клиентов Vending Trade. Оставьте свой отзыв о нашей работе." /></Helmet>
      <nav className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-[#ef7d00] transition-colors">Главная</Link>
        <span className="mx-2">—</span>
        <span className="text-gray-900">Отзывы</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">ОТЗЫВЫ</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {reviews.length === 0 ? (
            <div className="text-center py-16 text-gray-400 text-sm bg-[#f9f9f9] rounded-lg">
              Пока нет отзывов. Будьте первым!
            </div>
          ) : (
            reviews.map((r) => (
              <div key={r.id} className="bg-[#f9f9f9] rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-[#ef7d00]/10 border border-orange-100 flex items-center justify-center text-lg font-semibold text-[#ef7d00]">
                      {r.name.trim().charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{r.name}</div>
                      <div className="text-[10px] text-gray-400 uppercase tracking-widest">{formatDate(r.created_at)}</div>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className={`w-4 h-4 ${i <= r.rating ? 'text-[#e5c05c] fill-[#e5c05c]' : 'text-gray-300'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed text-[15px]">{r.text}</p>
              </div>
            ))
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6 lg:sticky lg:top-24">
            <h2 className="text-lg font-semibold text-gray-900 mb-5">Оставить отзыв</h2>
            <ReviewForm onSubmitted={load} />
          </div>
        </div>
      </div>
    </div>
  );
}
