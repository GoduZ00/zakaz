import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [optTooltip, setOptTooltip] = useState('');

  useEffect(() => {
    supabase.from('categories').select('*, subcategories(*)').order('sort_order').then(({ data }) => {
      if (data) setCategories(data);
    });
  }, []);

  async function handleSave() {
    if (!editingCategory) return;
    await supabase.from('categories').update({ opt_tooltip: optTooltip }).eq('id', editingCategory.id);
    setCategories((prev) =>
      prev.map((c) => (c.id === editingCategory.id ? { ...c, opt_tooltip: optTooltip } : c))
    );
    setEditingCategory(null);
  }

  function handleEdit(cat: any) {
    setEditingCategory(cat);
    setOptTooltip(cat.opt_tooltip || '');
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Категории</h1>
      {categories.length === 0 ? (
        <div className="bg-white rounded shadow p-8 text-center text-gray-400 text-sm">Нет категорий</div>
      ) : (
        <div className="space-y-4">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white rounded shadow">
              <div className="px-4 py-3 font-medium text-gray-900 border-b border-gray-100 flex items-center justify-between">
                <span>{cat.name}</span>
                <button onClick={() => handleEdit(cat)} className="text-xs text-[#ef7d00] hover:underline">Редактировать</button>
              </div>
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

      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setEditingCategory(null)}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Редактировать: {editingCategory.name}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Текст подсказки для оптовой цены</label>
                <textarea
                  value={optTooltip}
                  onChange={(e) => setOptTooltip(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#ef7d00] resize-none"
                  rows={3}
                />
              </div>
              <div className="flex items-center justify-end gap-3">
                <button onClick={() => setEditingCategory(null)} className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2">Отмена</button>
                <button onClick={handleSave} className="text-sm bg-[#ef7d00] text-white px-4 py-2 rounded hover:bg-[#d66f00] transition-colors">Сохранить</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
