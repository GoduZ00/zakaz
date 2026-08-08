import { useState } from 'react';
import { Star, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ReviewFormProps {
  onSubmitted?: () => void;
}

export default function ReviewForm({ onSubmitted }: ReviewFormProps) {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [hover, setHover] = useState(0);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;
    setSending(true);
    const { error } = await supabase.from('reviews').insert([
      { name: name.trim(), rating, text: text.trim() },
    ]);
    setSending(false);
    if (error) return;
    setDone(true);
    setName('');
    setText('');
    setRating(5);
    onSubmitted?.();
  }

  if (done) {
    return (
      <div className="text-center py-8">
        <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
        <div className="text-gray-900 font-semibold mb-1">Спасибо за отзыв!</div>
        <div className="text-sm text-gray-500">Ваш отзыв опубликован на сайте.</div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">Ваше имя</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Как вас зовут?"
          className="w-full border border-gray-300 rounded-sm px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#ef7d00]"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">Оценка</label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => setRating(i)}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(0)}
              className="p-0.5"
            >
              <Star
                className={`w-7 h-7 transition-colors ${(hover || rating) >= i ? 'text-[#e5c05c] fill-[#e5c05c]' : 'text-gray-300'}`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">Ваш отзыв</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          rows={4}
          placeholder="Расскажите о вашем опыте работы с нами..."
          className="w-full border border-gray-300 rounded-sm px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#ef7d00] resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={sending}
        className="w-full h-11 rounded-sm bg-[#ef7d00] text-white text-sm font-semibold hover:bg-[#d66f00] transition-colors disabled:opacity-50"
      >
        {sending ? 'Отправка...' : 'Отправить отзыв'}
      </button>
    </form>
  );
}
