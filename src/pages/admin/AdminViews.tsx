import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function AdminViews() {
  const [views, setViews] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('page_views').select('*').order('viewed_at', { ascending: false }).limit(50).then(({ data }) => {
      if (data) setViews(data);
    });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Просмотры товаров</h1>
      {views.length === 0 ? (
        <div className="bg-white rounded shadow p-8 text-center text-gray-400 text-sm">Нет данных</div>
      ) : (
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Товар</th>
                <th className="text-left px-4 py-3 font-medium">URL</th>
                <th className="text-left px-4 py-3 font-medium">Время</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {views.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{v.product_name || '—'}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{v.url || '—'}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{new Date(v.viewed_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
