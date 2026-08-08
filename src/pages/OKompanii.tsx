import { Link } from 'react-router-dom';
import { Shield, Truck, Award, Users } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function OKompanii() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Helmet><title>О компании — Vending Trade</title><meta name="description" content="Vending Trade — поставщик товаров для вендинг-бизнеса в Казахстане." /></Helmet>
      <nav className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-[#ef7d00] transition-colors">Главная</Link>
        <span className="mx-2">—</span>
        <span className="text-gray-900">О компании</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">VENDINGTRADE — 1 ГОД РАЗВИТИЯ И ДОВЕРИЯ</h1>

      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <div>
          <p className="text-gray-600 leading-relaxed mb-4">
            Более года назад мы начали свой путь в сфере механического вендинга с простой целью — сделать запуск собственного бизнеса более доступным, понятным и эффективным.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            Сегодня Vendingtrade — это механические торговые автоматы и наполнители для них, а также решения для тех, кто хочет развивать собственное направление в сфере вендинга.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            За более года работы мы приобрели ценный опыт, выстроили отношения с клиентами и партнёрами и реализовали проекты, которые стали важной частью нашей истории.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            Мы благодарны каждому, кто выбрал Vendingtrade и доверил нам часть своего бизнеса.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            Для нас один год — это не итог, а первый важный этап большого пути.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Мы продолжаем развиваться, расширять ассортимент и создавать новые возможности для наших клиентов.
          </p>
        </div>
        <div className="bg-[#f9f9f9] rounded-lg p-8 flex items-center justify-center">
          <img src="/images/categories/10.png" alt="О компании" className="rounded-lg max-w-full h-auto" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6 text-[#ef7d00]" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Качество продукции</h3>
            <p className="text-sm text-gray-500 leading-relaxed">Мы сотрудничаем только с проверенными производителями, гарантируя высокое качество каждого товара.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
            <Truck className="w-6 h-6 text-[#ef7d00]" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Доставка по Казахстану</h3>
            <p className="text-sm text-gray-500 leading-relaxed">Осуществляем доставку во все регионы Казахстана удобными для вас транспортными компаниями.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
            <Shield className="w-6 h-6 text-[#ef7d00]" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Гарантия надёжности</h3>
            <p className="text-sm text-gray-500 leading-relaxed">Предоставляем гарантию на всё оборудование. Всегда готовы помочь с заменой или возвратом.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6 text-[#ef7d00]" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Поддержка клиентов</h3>
            <p className="text-sm text-gray-500 leading-relaxed">Наши менеджеры всегда готовы проконсультировать и помочь с выбором продукции.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
