import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabase';

interface NewsItem {
  id: number;
  title: string;
  date: string;
  image_url: string | null;
  badge: string | null;
  content: string | null;
}

export default function NewsDetail() {
  const { id } = useParams();
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();
      if (data) setNews(data);
      else setNotFound(true);
      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-gray-400 text-sm">Загрузка...</div>
    );
  }

  if (notFound || !news) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <p className="text-gray-500 text-lg mb-4">Новость не найдена</p>
        <Link to="/" className="text-[#ef7d00] hover:underline">На главную</Link>
      </div>
    );
  }

  const paragraphs = (news.content || '').split(/\n+/).filter(Boolean);

  return (
    <>
      <Helmet>
        <title>{news.title} — Vending Trade</title>
        <meta name="description" content={news.title} />
        <meta property="og:title" content={`${news.title} — Vending Trade`} />
      </Helmet>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-[#ef7d00] transition-colors">Главная</Link>
          <span className="mx-2">—</span>
          <span className="text-gray-900">Новости</span>
        </nav>

        <div className="text-[11px] text-gray-400 uppercase tracking-wider mb-3">{news.date}</div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">{news.title}</h1>

        {news.image_url && (
          <div className="mb-8 rounded overflow-hidden border border-gray-100">
            <img src={news.image_url} alt={news.title} className="w-full max-h-[420px] object-cover" />
          </div>
        )}

        <article className="text-[15px] text-gray-700 leading-relaxed space-y-4">
          {paragraphs.length > 0 ? (
            paragraphs.map((p, i) => <p key={i}>{p}</p>)
          ) : (
            <p>{news.title}</p>
          )}
        </article>

        <div className="mt-10">
          <Link to="/" className="text-sm text-[#ef7d00] hover:underline">← На главную</Link>
        </div>
      </div>
    </>
  );
}
