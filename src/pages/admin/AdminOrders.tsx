import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('orders').select('*').order('id', { ascending: false }).then(({ data }) => {
      if (data) setOrders(data);
    });
  }, []);

  const statusColors: Record<string, string> = {
    new: 'bg-blue-100 text-blue-700',
    processing: 'bg-yellow-100 text-yellow-700',
    shipped: 'bg-purple-100 text-purple-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  const statusLabels: Record<string, string> = {
    new: 'Новый',
    processing: 'В обработке',
    shipped: 'Отправлен',
    completed: 'Завершен',
    cancelled: 'Отменен',
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Заказы</h1>
      {orders.length === 0 ? (
        <div className="bg-white rounded shadow p-8 text-center text-gray-400 text-sm">Нет заказов</div>
      ) : (
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3 font-medium">№</th>
                <th className="text-left px-4 py-3 font-medium">Клиент</th>
                <th className="text-left px-4 py-3 font-medium">Телефон</th>
                <th className="text-left px-4 py-3 font-medium">Сумма</th>
                <th className="text-left px-4 py-3 font-medium">Статус</th>
                <th className="text-left px-4 py-3 font-medium">Дата</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">#{o.id}</td>
                  <td className="px-4 py-3">{o.customer_name}</td>
                  <td className="px-4 py-3 text-gray-500">{o.customer_phone}</td>
                  <td className="px-4 py-3">{o.total ? `${o.total} ₽` : '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded ${statusColors[o.status] || 'bg-gray-100 text-gray-500'}`}>
                      {statusLabels[o.status] || o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{new Date(o.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
