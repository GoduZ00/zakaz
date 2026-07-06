import React from 'react';
import { Star, TrendingUp, Percent, HeartHandshake } from 'lucide-react';

const features = [
  {
    icon: <Star className="w-8 h-8" strokeWidth={1} />,
    title: 'Опытная команда менеджеров',
    desc: 'Знаем, как помочь нашим клиентам вести прибыльный бизнес. Лучшие показатели: 20.000+ довольных клиентов в пяти странах'
  },
  {
    icon: <TrendingUp className="w-8 h-8" strokeWidth={1} />,
    title: 'Не отстаем от трендов',
    desc: 'Мы постоянно работаем над разнообразием нашего ассортимента'
  },
  {
    icon: <Percent className="w-8 h-8" strokeWidth={1} />,
    title: 'Акции',
    desc: 'Мы регулярно запускаем выгодные предложения на продукцию компании'
  },
  {
    icon: <HeartHandshake className="w-8 h-8" strokeWidth={1} />,
    title: 'Забота о клиенте',
    desc: 'Менеджеры всегда оперативно отвечают и помогают разобраться во всех вопросах'
  }
];

export default function Features() {
  return (
    <div className="bg-[#f9f9f9] py-20 border-t border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {features.map((f, idx) => (
            <div key={idx} className="flex flex-col items-center text-center px-4">
              <div className="w-[72px] h-[72px] rounded-full border border-gray-300 flex items-center justify-center text-gray-800 mb-6 bg-white hover:border-[#ef7d00] hover:text-[#ef7d00] transition-colors">
                {f.icon}
              </div>
              <h4 className="text-[15px] text-gray-800 font-medium mb-4">{f.title}</h4>
              <p className="text-[13px] text-gray-500 leading-[1.8] max-w-[260px]">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
