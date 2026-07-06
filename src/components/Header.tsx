import React from 'react';
import { MapPin, Phone, User, Search, BarChart2, Heart, ShoppingCart, Menu, Zap } from 'lucide-react';

export default function Header() {
  return (
    <header className="w-full font-sans">
      {/* Top Bar */}
      <div className="bg-[#f8f8f8] border-b border-gray-200 py-1.5 text-[13px] text-gray-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 cursor-pointer hover:text-orange-500">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>Алматы</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="font-semibold text-gray-900">8 (800) 200-31-91</span>
              </div>
              <a href="#" className="text-[#ef7d00] border-b border-dashed border-[#ef7d00] hover:border-solid">ЗАКАЗАТЬ ЗВОНОК</a>
            </div>
          </div>
          <div className="flex items-center gap-6 hidden sm:flex">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>г. Москва, ул. Свободы, д. 35, стр. 5</span>
            </div>
            <a href="#" className="flex items-center gap-1.5 hover:text-orange-500">
              <User className="w-4 h-4 text-gray-400" />
              <span>ВОЙТИ</span>
            </a>
          </div>
        </div>
      </div>

      {/* Middle Bar */}
      <div className="bg-white py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">
          {/* Logo */}
          <div className="flex flex-col items-center md:items-start shrink-0">
            <div className="text-3xl font-extrabold tracking-tight">
              <span className="text-[#1a3673]">TORGAVTOMAT</span><span className="text-[#ef7d00]">.RU</span>
            </div>
            <span className="text-[10px] text-gray-500 tracking-wider mt-0.5">ЛУЧШИЕ РЕШЕНИЯ ДЛЯ ВАШЕГО БИЗНЕСА</span>
          </div>

          {/* Search */}
          <div className="w-full md:flex-1 max-w-2xl">
            <div className="flex border-2 border-gray-100 rounded-sm overflow-hidden bg-white focus-within:border-gray-300 transition-colors h-11 shadow-sm">
              <input 
                type="text" 
                placeholder="Поиск" 
                className="flex-1 px-4 py-2 bg-transparent outline-none text-sm placeholder-gray-400"
              />
              <div className="flex items-center bg-white">
                <div className="h-6 w-px bg-gray-200 mx-1"></div>
                <select className="bg-transparent border-none outline-none text-sm text-gray-600 pl-3 pr-1 cursor-pointer appearance-none">
                  <option>Каталог</option>
                </select>
                <div className="px-1 text-gray-400 pointer-events-none">
                   <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
                <button className="px-4 h-full flex items-center text-gray-400 hover:text-orange-500 transition-colors ml-2">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-6 shrink-0">
            <div className="flex items-center gap-5">
              <button className="relative text-gray-400 hover:text-[#ef7d00] transition-colors">
                <BarChart2 className="w-6 h-6" />
                <span className="absolute -top-1.5 -right-2 bg-[#ef7d00] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">0</span>
              </button>
              <button className="relative text-gray-400 hover:text-[#ef7d00] transition-colors">
                <Heart className="w-6 h-6" />
                <span className="absolute -top-1.5 -right-2 bg-[#ef7d00] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">0</span>
              </button>
            </div>
            <div className="h-8 w-px bg-gray-200"></div>
            <button className="relative text-gray-400 hover:text-[#ef7d00] transition-colors">
              <ShoppingCart className="w-7 h-7" />
              <span className="absolute -top-1.5 -right-2 bg-[#ef7d00] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">0</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-[#ef7d00] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center text-[13px] font-bold uppercase tracking-wider overflow-x-auto whitespace-nowrap hide-scrollbar">
            <li>
              <a href="#" className="flex items-center gap-2 py-4 px-6 bg-[#d66f00] hover:bg-[#c26400] transition-colors h-full">
                <Menu className="w-5 h-5" />
                КАТАЛОГ
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center gap-1.5 py-4 px-6 hover:bg-[#d66f00] transition-colors h-full">
                <Zap className="w-4 h-4 fill-white" />
                АКЦИИ
              </a>
            </li>
            <li className="flex-1 flex justify-center">
              <a href="#" className="py-4 px-6 hover:bg-[#d66f00] transition-colors w-full text-center">КАК ЗАКАЗАТЬ</a>
            </li>
            <li className="flex-1 flex justify-center">
              <a href="#" className="py-4 px-6 hover:bg-[#d66f00] transition-colors w-full text-center">КЛИЕНТАМ</a>
            </li>
            <li className="flex-1 flex justify-center">
              <a href="#" className="py-4 px-6 hover:bg-[#d66f00] transition-colors w-full text-center">О КОМПАНИИ</a>
            </li>
            <li className="flex-1 flex justify-center">
              <a href="#" className="py-4 px-6 hover:bg-[#d66f00] transition-colors w-full text-center">КОНТАКТЫ</a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
