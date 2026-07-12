import { Link } from 'react-router-dom';

const categories = [
  { title: 'Торговые автоматы', slug: 'torgovye-avtomaty' },
  { title: 'Жевательная резинка', slug: 'zhevatelnaya-rezinka' },
  { title: 'Конфеты', slug: 'konfety' },
  { title: 'Мячи-прыгуны', slug: 'myachi-pryguny' },
  { title: 'Игрушки', slug: 'igrushki' },
  { title: 'Бахилы в капсулах', slug: 'bakhily-v-kapsulakh' },
  { title: 'Капсулы пустые', slug: 'kapsuly-pustye' },
  { title: 'Стойки, кронштейны, швеллеры', slug: 'stoyki-kronshteyny-shvellery' },
  { title: 'Детали и части', slug: 'detali-i-chasti' },
];

export default function Categories() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 mb-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            to={`/catalog/${cat.slug}`}
            className="flex flex-col items-center group bg-white border border-gray-100 p-6 rounded hover:shadow-lg transition-shadow"
          >
            <div className="w-36 h-36 rounded-full bg-[#fdf4e7] flex items-center justify-center mb-6 overflow-hidden border border-[#fae5cc]">
              <img
                src=""
                alt={cat.title}
                loading="lazy"
                decoding="async"
                className="w-24 h-24 object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <h3 className="text-[13px] font-medium text-center text-gray-700 leading-relaxed group-hover:text-[#ef7d00] transition-colors">
              {cat.title}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  );
}
