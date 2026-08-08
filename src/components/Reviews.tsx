import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import ReviewForm from './ReviewForm';

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

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [current, setCurrent] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  async function load() {
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    if (data) setReviews(data);
  }

  useEffect(() => { load(); }, []);
  useEffect(() => { setCurrent(0); }, [reviews.length]);

  const review = reviews[current] || null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 border-b border-gray-200 pb-4 gap-4">
        <h2 className="text-3xl font-light text-gray-900">О нас пишут</h2>
        <div className="flex items-center gap-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 hover:text-[#ef7d00] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            ОСТАВИТЬ ОТЗЫВ
          </button>
          <Link to="/otzyvy" className="hover:text-[#ef7d00] transition-colors">ВСЕ ОТЗЫВЫ</Link>
        </div>
      </div>

      {review ? (
        <div className="relative px-4 sm:px-16">
          <button
            onClick={() => setCurrent((c) => (c - 1 + reviews.length) % reviews.length)}
            className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-800 transition-colors hidden sm:block"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <div className="bg-white">
            <div className="flex flex-col md:flex-row gap-8 lg:gap-16 items-start max-w-4xl mx-auto">
              <div className="flex flex-col items-center md:items-start gap-4 shrink-0 min-w-[200px]">
                <div className="w-20 h-20 rounded-full bg-[#ef7d00]/10 border border-orange-100 flex items-center justify-center text-2xl font-semibold text-[#ef7d00]">
                  {review.name.trim().charAt(0).toUpperCase()}
                </div>
                <div className="text-center md:text-left">
                  <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-1.5">{formatDate(review.created_at)}</div>
                  <div className="text-lg font-medium text-gray-900">{review.name}</div>
                </div>
              </div>

              <div className="flex-1 pt-2">
                <div className="flex mb-6 gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className={`w-5 h-5 ${i <= review.rating ? 'text-[#e5c05c] fill-[#e5c05c]' : 'text-gray-300'}`} />
                  ))}
                </div>
                <div className="relative">
                  <span className="absolute -left-10 -top-4 text-7xl text-gray-200 font-serif leading-none select-none">"</span>
                  <p className="text-gray-600 leading-relaxed relative z-10 text-[15px] max-w-2xl">
                    {review.text}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setCurrent((c) => (c + 1) % reviews.length)}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-800 hover:text-[#ef7d00] transition-colors hidden sm:block"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400 text-sm">
          Пока нет отзывов. Будьте первым!
        </div>
      )}

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg w-full max-w-md p-6 relative shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold text-gray-900 mb-5">Оставить отзыв</h3>
            <ReviewForm
              onSubmitted={() => {
                setModalOpen(false);
                load();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
