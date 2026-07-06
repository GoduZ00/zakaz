import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, categories: 0, orders: 0, promotions: 0 });

  useEffect(() => {
    Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('categories').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('promotions').select('*', { count: 'exact', head: true }),
    ]).then(([p, c, o, pr]) => {
      setStats({
        products: p.count || 0,
        categories: c.count || 0,
        orders: o.count || 0,
        promotions: pr.count || 0,
      });
    });
  }, []);

  const cards = [
    { label: 'Товары', value: stats.products, color: 'bg-blue-500' },
    { label: 'Категории', value: stats.categories, color: 'bg-green-500' },
    { label: 'Заказы', value: stats.orders, color: 'bg-purple-500' },
    { label: 'Акции', value: stats.promotions, color: 'bg-orange-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Дашборд</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded shadow p-5">
            <div className={`w-10 h-10 ${card.color} rounded flex items-center justify-center text-white text-lg font-bold mb-3`}>
              {card.value}
            </div>
            <div className="text-sm text-gray-600">{card.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
