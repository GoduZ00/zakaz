import React from 'react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="flex flex-col lg:flex-row gap-16 items-center">
        <div className="lg:w-1/2">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">О КОМПАНИИ</div>
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-8">VENDINGTRADE — 1 ГОД РАЗВИТИЯ И ДОВЕРИЯ</h2>
          <div className="text-gray-500 space-y-5 mb-10 leading-[1.8] text-[14px]">
            <p>
              Более года назад мы начали свой путь в сфере механического вендинга с
              простой целью — сделать запуск собственного бизнеса более доступным,
              понятным и эффективным.
            </p>
            <p>
              Сегодня Vendingtrade — это механические торговые автоматы и наполнители
              для них, а также решения для тех, кто хочет развивать собственное
              направление в сфере вендинга.
            </p>
            <p>
              За более года работы мы приобрели ценный опыт, выстроили отношения с
              клиентами и партнёрами и реализовали проекты, которые стали важной
              частью нашей истории.
            </p>
            <p>
              Мы благодарны каждому, кто выбрал Vendingtrade и доверил нам часть
              своего бизнеса.
            </p>
            <p>
              Для нас один год — это не итог, а первый важный этап большого пути.
            </p>
            <p>
              Мы продолжаем развиваться, расширять ассортимент и создавать новые
              возможности для наших клиентов.
            </p>
          </div>
          <Link to="/o-kompanii" className="inline-block bg-[#ef7d00] text-white text-[12px] font-bold uppercase tracking-wider px-8 py-3.5 rounded-sm hover:bg-[#d66f00] transition-colors shadow-sm">
            ПОДРОБНОСТИ
          </Link>
        </div>
        <div className="lg:w-1/2">
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-full h-full border border-gray-200 z-0"></div>
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"
              alt="О компании Vendingtrade"
              loading="lazy"
              decoding="async"
              className="relative z-10 w-full h-auto object-cover shadow-sm grayscale hover:grayscale-0 transition-all duration-700"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
