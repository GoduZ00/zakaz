import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ClipboardList, CreditCard, Truck, Store } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const sections = [
  {
    id: 'oformlenie-zakaza',
    icon: <ClipboardList className="w-6 h-6" />,
    title: 'Оформление заказа',
    blocks: [
      'Добавьте нужные товары в корзину, выбрав количество упаковок.',
      'Перейдите в корзину и заполните данные для оформления заказа.',
      'Укажите имя, контактный телефон, способ оплаты и доставки.',
      'Менеджер свяжется с вами для подтверждения заказа и уточнения деталей.',
    ],
  },
  {
    id: 'sposoby-oplaty',
    icon: <CreditCard className="w-6 h-6" />,
    title: 'Способы оплаты',
    blocks: [
      'Наличный расчёт — при самовывозе или курьеру при получении.',
      'Банковской картой — Kaspi Bank и другие платёжные системы.',
      'Безналичный расчёт для юридических лиц — выставление счёта по реквизитам компании.',
    ],
  },
  {
    id: 'dostavka',
    icon: <Truck className="w-6 h-6" />,
    title: 'Доставка',
    blocks: [
      'Бесплатная доставка по Казахстану от 20 000 ₸.',
      'Осуществляем доставку во все регионы страны транспортными компаниями.',
      'Оперативно отправляем заказы после подтверждения.',
    ],
  },
  {
    id: 'samovyvoz',
    icon: <Store className="w-6 h-6" />,
    title: 'Самовывоз',
    blocks: [
      'Забрать заказ можно в нашем офисе: г. Алматы, ЖМ АСЫЛ-АРМАН, дом 20.',
      'Режим работы: Пн–Пт 9:00–18:00.',
    ],
  },
];

export default function KakZakazat() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) { window.scrollTo({ top: 0 }); return; }
    const el = document.getElementById(hash.slice(1));
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [hash]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Helmet><title>Как заказать — Vending Trade</title><meta name="description" content="Как заказать товары для вендинга в Vending Trade. Доставка по Казахстану." /></Helmet>
      <nav className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-[#ef7d00] transition-colors">Главная</Link>
        <span className="mx-2">—</span>
        <span className="text-gray-900">Как заказать</span>
      </nav>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">КАК ЗАКАЗАТЬ</h1>

      <div className="prose prose-gray max-w-3xl text-gray-700 space-y-6 mb-12">
        <p className="text-base leading-relaxed">
          У нас могут приобрести товар как юридические, так и физические лица.
        </p>
        <p className="text-base leading-relaxed">
          На сайте доступен заказ, а также справочная информация о стоимости доставки по регионам Казахстана с возможностью выбора удобного для вас способа оплаты: выставлением счета, кредитной картой, наличными. Заказ через корзину доступен как зарегистрированным, так и незарегистрированным пользователям.
        </p>
        <p className="text-base leading-relaxed">
          Также вы можете заказать продукцию по телефону{' '}
          <a href="tel:+77013099969" className="text-[#ef7d00] hover:underline font-medium">+7 (701) 309-9969</a>
          , или посредством отправки на наш e-mail <a href="mailto:b23almas@gmail.com" className="text-[#ef7d00] hover:underline font-medium">b23almas@gmail.com</a> письма в произвольной форме.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {sections.map((s) => (
          <div key={s.id} id={s.id} className="bg-[#f9f9f9] rounded-lg p-6 scroll-mt-32">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-full bg-orange-50 flex items-center justify-center text-[#ef7d00] shrink-0">{s.icon}</div>
              <h2 className="text-lg font-semibold text-gray-900">{s.title}</h2>
            </div>
            <ul className="space-y-2">
              {s.blocks.map((b) => (
                <li key={b} className="flex gap-2 text-sm text-gray-600 leading-relaxed">
                  <span className="text-[#ef7d00] shrink-0">•</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
