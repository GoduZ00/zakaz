import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useEffect, useState } from 'react';

const navItems = [
  { label: 'Дашборд', path: '/admin' },
  { label: 'Товары', path: '/admin/products' },
  { label: 'Категории', path: '/admin/categories' },
  { label: 'Акции', path: '/admin/promotions' },
  { label: 'Заказы', path: '/admin/orders' },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate('/admin/login');
      else setUser(data.session.user);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <aside className="w-56 bg-[#1a3673] text-white shrink-0 flex flex-col">
        <div className="p-5 border-b border-white/10">
          <Link to="/" className="text-lg font-bold">TORGAVTOMAT</Link>
          <div className="text-xs text-white/60 mt-1">Админ-панель</div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-4 py-2.5 text-sm rounded transition-colors ${
                location.pathname === item.path
                  ? 'bg-white/15 text-white font-medium'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="text-sm text-white/80 truncate">{user.email}</div>
          <button onClick={handleLogout} className="text-xs text-white/50 hover:text-white mt-1">Выйти</button>
        </div>
      </aside>
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
