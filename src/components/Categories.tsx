import { Link } from 'react-router-dom';

const categories = [
  {
    title: 'Механические торговые\nавтоматы',
    image: '/images/categories/8.png',
    color: 'bg-[#fdf4e7]'
  },
  {
    title: 'Наполнители для торговых\nавтоматов',
    image: '/images/categories/7.png',
    color: 'bg-[#fdf4e7]'
  }
];

export default function Categories() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 mb-8">
      <div className="flex justify-center gap-4 lg:gap-8 flex-wrap">
        {categories.map((cat, idx) => (
          <Link key={idx} to={`/catalog/${idx === 0 ? 'mekhanicheskie_torgovye_avtomaty_catalog' : 'napolniteli-dlya-torgovykh-avtomatov'}`} className="flex flex-col items-center group bg-white border border-gray-100 p-6 rounded hover:shadow-lg transition-shadow w-full max-w-[250px]">
            <div className={`w-36 h-36 rounded-full ${cat.color} flex items-center justify-center mb-6 overflow-hidden border border-[#fae5cc]`}>
              <img src={cat.image} alt={cat.title} className="w-24 h-24 object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-300" />
            </div>
            <h3 className="text-[13px] font-medium text-center text-gray-700 leading-relaxed whitespace-pre-line group-hover:text-[#ef7d00] transition-colors">
              {cat.title}
            </h3>
            </Link>
          ))}
        </div>
    </div>
  );
}
