import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('categories').select('*, subcategories(*)').order('sort_order').then(({ data }) => {
      if (data) setCategories(data);
    });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Категории</h1>
      {categories.length === 0 ? (
        <div className="bg-white rounded shadow p-8 text-center text-gray-400 text-sm">Нет категорий</div>
      ) : (
        <div className="space-y-4">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white rounded shadow">
              <div className="px-4 py-3 font-medium text-gray-900 border-b border-gray-100">{cat.name}</div>
              <div className="divide-y divide-gray-50">
                {cat.subcategories?.map((sub: any) => (
                  <div key={sub.id} className="px-4 py-2.5 text-sm text-gray-600 flex items-center justify-between">
                    <span>{sub.name}</span>
                    <span className="text-xs text-gray-400">{sub.slug}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
