import { Link } from 'react-router-dom';
import { Shield, Truck, Award, Users } from 'lucide-react';

const stats = [
  { label: 'Лет на рынке', value: '10+' },
  { label: 'Довольных клиентов', value: '20 000+' },
  { label: 'Товаров в каталоге', value: '500+' },
  { label: 'Стран поставок', value: '5' },
];

export default function OKompanii() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-[#ef7d00] transition-colors">Главная</Link>
        <span className="mx-2">—</span>
        <span className="text-gray-900">О компании</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">О КОМПАНИИ</h1>

      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">ИП БАЙҒОЖИНОВ</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Мы — надёжный поставщик комплектующих и наполнителей для торговых автоматов на рынке Казахстана. За годы работы мы зарекомендовали себя как ответственный партнёр, предлагающий качественную продукцию по доступным ценам.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            Наш ассортимент включает механические торговые автоматы, монетоприёмники, распределители, запасные части, а также широкий выбор наполнителей: жевательную резинку, конфеты, игрушки, мячи-прыгуны, бахилы и пустые капсулы.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Мы работаем как с юридическими, так и с физическими лицами, предлагая гибкие условия оплаты и индивидуальный подход к каждому клиенту.
          </p>
        </div>
        <div className="bg-[#f9f9f9] rounded-lg p-8 flex items-center justify-center">
          <img src="/images/categories/Gemini_Generated_Image_tozt84tozt84tozt.png" alt="О компании" className="rounded-lg max-w-full h-auto" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {stats.map((s) => (
          <div key={s.label} className="text-center bg-[#f9f9f9] rounded-lg p-6">
            <div className="text-3xl font-bold text-[#ef7d00] mb-1">{s.value}</div>
            <div className="text-sm text-gray-500">{s.label}</div>
          </div>
        ))}
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
