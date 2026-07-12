import { Link } from 'react-router-dom';

const categories = [
  { title: 'Торговые автоматы', slug: 'torgovye-avtomaty', image: '/images/categories/8.png' },
  { title: 'Жевательная резинка', slug: 'zhevatelnaya-rezinka', image: '/images/categories/1.jfif' },
  { title: 'Конфеты', slug: 'konfety', image: '/images/categories/2.jfif' },
  { title: 'Мячи-прыгуны', slug: 'myachi-pryguny', image: '/images/categories/3.jfif' },
  { title: 'Игрушки', slug: 'igrushki', image: '/images/categories/4.jfif' },
  { title: 'Бахилы в капсулах', slug: 'bakhily-v-kapsulakh', image: '/images/categories/5.png' },
  { title: 'Капсулы пустые', slug: 'kapsuly-pustye', image: '/images/categories/6.png' },
  { title: 'Стойки, кронштейны, швеллеры', slug: 'stoyki-kronshteyny-shvellery', image: '/images/categories/stoyki-kronshteyny-shvellery.png' },
  { title: 'Детали и части', slug: 'detali-i-chasti', image: '/images/categories/torgovye-avtomaty.png' },
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
                src={cat.image}
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
