import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function AdminPromotions() {
  const [promotions, setPromotions] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('promotions').select('*').order('id', { ascending: false }).then(({ data }) => {
      if (data) setPromotions(data);
    });
  }, []);

  const toggleActive = async (id: number, current: boolean) => {
    await supabase.from('promotions').update({ is_active: !current }).eq('id', id);
    const { data } = await supabase.from('promotions').select('*').order('id', { ascending: false });
    if (data) setPromotions(data);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Акции</h1>
        <button className="bg-[#ef7d00] text-white px-4 py-2 text-sm rounded hover:bg-[#d66f00]">+ Добавить</button>
      </div>
      {promotions.length === 0 ? (
        <div className="bg-white rounded shadow p-8 text-center text-gray-400 text-sm">Нет акций</div>
      ) : (
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Название</th>
                <th className="text-left px-4 py-3 font-medium">Скидка</th>
                <th className="text-left px-4 py-3 font-medium">Статус</th>
                <th className="text-left px-4 py-3 font-medium">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {promotions.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{p.title}</td>
                  <td className="px-4 py-3 text-[#ef7d00] font-medium">{p.discount}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {p.is_active ? 'Активна' : 'Неактивна'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button className="px-3 py-1.5 text-xs border border-blue-200 text-blue-600 rounded hover:bg-blue-50 transition-colors">Ред.</button>
                      <button onClick={() => toggleActive(p.id, p.is_active)} className="px-3 py-1.5 text-xs border border-gray-200 text-gray-500 rounded hover:bg-gray-50 transition-colors">
                        {p.is_active ? 'Деактив.' : 'Актив.'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
