import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function KakZakazat() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Helmet><title>Как заказать — Vending Trade</title><meta name="description" content="Как заказать товары для вендинга в Vending Trade. Доставка по Казахстану." /></Helmet>
      <nav className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-[#ef7d00] transition-colors">Главная</Link>
        <span className="mx-2">—</span>
        <span className="text-gray-900">Как заказать</span>
      </nav>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">КАК ЗАКАЗАТЬ</h1>

      <div className="prose prose-gray max-w-3xl text-gray-700 space-y-6">
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
    </div>
  );
}
