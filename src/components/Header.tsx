import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Phone, User, Search, Heart, ShoppingCart, Menu } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function UserLink() {
  const { user } = useAuth();
  return (
    <Link to={user ? '/profile' : '/login'} className="flex items-center gap-1.5 hover:text-orange-500">
      <User className="w-4 h-4 text-gray-400" />
      <span>{user ? user.email?.split('@')[0] : 'ВОЙТИ'}</span>
    </Link>
  );
}

export default function Header() {
  const navigate = useNavigate();
  const { count } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [sticky, setSticky] = useState(false);

  useEffect(() => {
    const onScroll = () => setSticky(window.scrollY > 36);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <header className="w-full font-sans">
      {/* Top Bar */}
      <div className={`bg-[#f8f8f8] border-b border-gray-200 py-1.5 text-[11px] sm:text-[13px] text-gray-600 ${sticky ? 'hidden' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-3 sm:gap-6">
            <a href="https://go.2gis.com/O6tAe" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-orange-500">
              <MapPin className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-gray-400" />
              <span className="hidden xs:inline">Алматы</span>
            </a>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-1">
                <Phone className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-gray-400" />
                <span className="font-semibold text-gray-900 text-[11px] sm:text-[13px]">8-701-309-9969</span>
              </div>
              <Link to="/zvonok" className="text-[#ef7d00] border-b border-dashed border-[#ef7d00] hover:border-solid text-[11px] sm:text-[13px]">ЗАКАЗАТЬ ЗВОНОК</Link>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:gap-6">
            <a href="https://go.2gis.com/O6tAe" target="_blank" rel="noopener noreferrer" className="items-center gap-1 hover:text-orange-500 hidden sm:flex">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>Алматы қ. Асыл-Арман 20</span>
            </a>
            <div className="hidden sm:block"><UserLink /></div>
          </div>
        </div>
      </div>

      <div className={`${sticky ? 'fixed top-0 left-0 right-0 z-50 shadow-md' : ''} bg-white transition-all duration-300`}>
        {/* Middle Bar */}
        <div className="bg-white py-3 sm:py-5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-row justify-between items-center gap-3 sm:gap-8">
            {/* Logo */}
            <div className="flex flex-col items-start shrink-0">
              <Link to="/" className="font-extrabold tracking-tight whitespace-nowrap text-xl sm:text-3xl">
                <span className="text-[#1a3673]">VENDINGTRADE</span><span className="text-[#ef7d00]">.KZ</span>
              </Link>
              <span className="text-gray-500 tracking-wider text-[10px] mt-0.5">ЛУЧШИЕ РЕШЕНИЯ ДЛЯ ВАШЕГО БИЗНЕСА</span>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 min-w-0 max-w-2xl">
              <div className="flex border border-gray-100 sm:border-2 rounded-sm overflow-hidden bg-white focus-within:border-gray-300 shadow-sm h-9 sm:h-11">
                <input 
                  type="text" 
                  placeholder="Поиск"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-3 py-1 bg-transparent outline-none placeholder-gray-400 text-sm"
                />
                <div className="flex items-center bg-white">
                  <div className="h-4 w-px bg-gray-200 mx-1"></div>
                  <select className="bg-transparent border-none outline-none cursor-pointer appearance-none text-sm pl-3 pr-1">
                    <option>Каталог</option>
                  </select>
                  <div className="px-1 text-gray-400 pointer-events-none">
                     <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                  <button type="submit" className="h-full flex items-center text-gray-400 hover:text-orange-500 transition-colors ml-1 px-4">
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </form>

            {/* Icons */}
            <div className="flex items-center shrink-0 gap-2 sm:gap-6">
              <div className="flex items-center gap-2 sm:gap-5">
                <Link to="/profile" className="relative text-gray-400 hover:text-[#ef7d00] transition-colors">
                  <Heart className="w-5 sm:w-6 h-5 sm:h-6" />
                </Link>
              </div>
              <div className="bg-gray-200 h-6 sm:h-8 w-px"></div>
              <Link to="/cart" className="relative text-gray-400 hover:text-[#ef7d00] transition-colors">
                <ShoppingCart className="w-6 sm:w-7 h-6 sm:h-7" />
                {count > 0 && <span className="absolute -top-1.5 -right-2 bg-[#ef7d00] text-white text-[10px] font-bold min-w-[1rem] h-4 flex items-center justify-center rounded-full px-1">{count}</span>}
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation Bar */}
        <div className="bg-[#ef7d00] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ul className="flex flex-nowrap items-center font-bold uppercase tracking-wider overflow-visible whitespace-nowrap scrollbar-none gap-0 sm:gap-0.5 text-[8px] sm:text-[13px]">
              {/* Каталог */}
              <li className="flex-none">
                <Link to="/katalog" className="flex items-center justify-center bg-[#d66f00] hover:bg-[#c26400] transition-colors duration-300 gap-0.5 sm:gap-1 py-2 px-1 sm:px-3">
                  <Menu className="hidden sm:inline shrink-0 w-4 h-4" />
                  <span>КАТАЛОГ</span>
                </Link>
              </li>

              {/* Как заказать */}
              <li className="flex-none">
                <Link to="/kak-zakazat" className="hover:bg-[#d66f00] transition-colors duration-300 text-center block py-2 px-1 sm:px-3">КАК ЗАКАЗАТЬ</Link>
              </li>

              {/* О компании */}
              <li className="flex-none">
                <Link to="/o-kompanii" className="hover:bg-[#d66f00] transition-colors duration-300 text-center block py-2 px-1 sm:px-3">О КОМПАНИИ</Link>
              </li>

              {/* Контакты */}
              <li className="flex-none">
                <Link to="/kontakty" className="hover:bg-[#d66f00] transition-colors duration-300 text-center block py-2 px-1 sm:px-3">КОНТАКТЫ</Link>
              </li>
            </ul>

          </div>
        </div>
    </div>
    {sticky && <div className="h-[92px] sm:h-[120px]" />}
    </header>
  );
}



