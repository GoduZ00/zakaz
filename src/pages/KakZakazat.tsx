import { Link } from 'react-router-dom';

export default function KakZakazat() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-[#ef7d00] transition-colors">Главная</Link>
        <span className="mx-2">—</span>
        <span className="text-gray-900">Как заказать</span>
      </nav>
      <h1 className="text-3xl font-bold text-gray-900">КАК ЗАКАЗАТЬ</h1>
    </div>
  );
}
