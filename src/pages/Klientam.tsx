import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Building2, Wallet, Truck, RefreshCw, ChevronDown } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const faq = [
  { q: 'Как оформить заказ?', a: 'Вы можете оформить заказ через корзину на сайте, позвонив по телефону +7 (701) 309-9969 или отправив письмо на наш e-mail. Заказ доступен как зарегистрированным, так и незарегистрированным пользователям.' },
  { q: 'Какие способы оплаты доступны?', a: 'Мы принимаем оплату выставлением счёта (для юридических лиц), кредитными картами, а также наличными. Для постоянных клиентов доступны индивидуальные условия.' },
  { q: 'Как осуществляется доставка?', a: 'Доставляем товары во все регионы Казахстана. Стоимость и сроки доставки рассчитываются индивидуально в зависимости от вашего региона и объёма заказа.' },
  { q: 'Какой срок гарантии?', a: 'На оборудование предоставляется гарантия от 12 месяцев. На запасные части — от 6 месяцев. Гарантия распространяется на производственные дефекты.' },
  { q: 'Можно ли вернуть товар?', a: 'Да, вы можете вернуть товар в течение 14 дней при условии сохранения товарного вида и потребительских свойств. Оборудование принимается на проверку качества.' },
  { q: 'Работаете ли вы с юридическими лицами?', a: 'Да, мы работаем как с юридическими, так и с физическими лицами. Для юрлиц доступна оплата по безналичному расчёту с выставлением счёта.' },
];

const paymentMethods = [
  { icon: <Building2 className="w-6 h-6" />, title: 'Выставление счёта', desc: 'Для юридических лиц' },
  { icon: <CreditCard className="w-6 h-6" />, title: 'Кредитная карта', desc: 'Visa, Mastercard' },
  { icon: <Wallet className="w-6 h-6" />, title: 'Наличные', desc: 'При самовывозе' },
];

export default function Klientam() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Helmet><title>Клиентам — Vending Trade</title><meta name="description" content="Информация для клиентов Vending Trade: доставка, оплата, гарантия." /></Helmet>
      <nav className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-[#ef7d00] transition-colors">Главная</Link>
        <span className="mx-2">—</span>
        <span className="text-gray-900">Клиентам</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">КЛИЕНТАМ</h1>

      {/* Payment */}
      <section className="mb-16">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Как оплатить?</h2>
        <p className="text-gray-600 mb-4">Вы можете оплатить ваш заказ следующими способами:</p>
        <div className="grid sm:grid-cols-3 gap-4 mb-4">
          {paymentMethods.map((pm) => (
            <div key={pm.title} className="flex items-center gap-4 bg-[#f9f9f9] rounded-lg p-5">
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-[#ef7d00] shrink-0">{pm.icon}</div>
              <div>
                <div className="font-medium text-gray-900 text-sm">{pm.title}</div>
                <div className="text-xs text-gray-500">{pm.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-500">Цена товара не зависит от способа оплаты.</p>
      </section>

      {/* Delivery + Warranty */}
      <section className="mb-16">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Доставка и гарантия</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="flex gap-4 bg-[#f9f9f9] rounded-lg p-5">
            <Truck className="w-6 h-6 text-[#ef7d00] shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Доставка по Казахстану</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Отправляем товары во все регионы Казахстана. Стоимость доставки рассчитывается индивидуально. Свяжитесь с нами для уточнения условий.
              </p>
            </div>
          </div>
          <div className="flex gap-4 bg-[#f9f9f9] rounded-lg p-5">
            <RefreshCw className="w-6 h-6 text-[#ef7d00] shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Гарантия и возврат</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Гарантия на оборудование — от 12 месяцев. Возврат товара возможен в течение 14 дней с момента покупки при сохранении товарного вида.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Часто задаваемые вопросы</h2>
        <div className="space-y-2">
          {faq.map((item, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
              >
                {item.q}
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">{item.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
