import { Link } from 'react-router-dom';

const categories = [
  {
    id: 'mekhanicheskie_torgovye_avtomaty_catalog',
    name: 'Механические торговые автоматы',
    img: '/images/categories/8.png',
  },
  {
    id: 'napolniteli-dlya-torgovykh-avtomatov',
    name: 'Наполнители для торговых автоматов',
    img: '/images/categories/7.png',
  },
];

export default function Catalog() {
  return (
    <div className="bg-[#f8f8f8] min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="text-sm text-gray-500 mb-7">
          <Link to="/" className="hover:text-[#ef7d00] transition-colors">Главная</Link>
          <span className="mx-2">—</span>
          <span className="text-gray-900">Каталог</span>
        </nav>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/catalog/${cat.id}`}
              className="group bg-white border border-gray-200 rounded-sm shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col items-center text-center"
            >
              <div className="w-28 h-28 flex items-center justify-center mb-4">
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <span className="text-sm text-gray-800 font-medium leading-tight">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
