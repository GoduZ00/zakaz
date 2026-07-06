import React from 'react';

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="flex flex-col lg:flex-row gap-16 items-center">
        <div className="lg:w-1/2">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">О КОМПАНИИ</div>
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-8">Компания Вендорс</h2>
          <div className="text-gray-500 space-y-5 mb-10 leading-[1.8] text-[14px]">
            <p>
              Компания «ВЕНДОРС» работает на рынке более 25 лет. Сбалансированное 
              соотношение цены и качества. Благодаря работе напрямую с поставщиками 
              мы всегда достигаем справедливого сочетания цены и качества.
            </p>
            <p>
              Бесперебойное снабжение. Оперативная доставка товаров в любую точку 
              страны. Индивидуальный подход. Мы стараемся максимально учитывать 
              потребности каждого нашего клиента. Менеджеры компании всегда готовы 
              дать необходимую консультацию и выработать индивидуальные решения.
            </p>
          </div>
          <button className="bg-[#ef7d00] text-white text-[12px] font-bold uppercase tracking-wider px-8 py-3.5 rounded-sm hover:bg-[#d66f00] transition-colors shadow-sm">
            ПОДРОБНОСТИ
          </button>
        </div>
        <div className="lg:w-1/2">
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-full h-full border border-gray-200 z-0"></div>
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800" 
              alt="Офис компании Вендорс" 
              className="relative z-10 w-full h-auto object-cover shadow-sm grayscale hover:grayscale-0 transition-all duration-700"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
