import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface FilterGroup {
  id: number;
  category_id: number;
  name: string;
  characteristic_label: string;
  sort_order: number;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function AdminFilterGroups() {
  const [groups, setGroups] = useState<FilterGroup[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [edit, setEdit] = useState<Partial<FilterGroup> | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    const [{ data: groupsData }, { data: catsData }] = await Promise.all([
      supabase.from('category_filter_groups').select('*').order('sort_order'),
      supabase.from('categories').select('id, name, slug').order('id'),
    ]);
    if (groupsData) setGroups(groupsData);
    if (catsData) setCategories(catsData);
  };

  useEffect(() => { fetchData(); }, []);

  const save = async () => {
    if (!edit || !edit.name || !edit.characteristic_label || !edit.category_id) return;
    setSaving(true);
    if (edit.id) {
      await supabase.from('category_filter_groups').update({ name: edit.name, characteristic_label: edit.characteristic_label, category_id: edit.category_id, sort_order: edit.sort_order ?? 0 }).eq('id', edit.id);
    } else {
      await supabase.from('category_filter_groups').insert({ name: edit.name, characteristic_label: edit.characteristic_label, category_id: edit.category_id, sort_order: edit.sort_order ?? 0 });
    }
    setSaving(false);
    setEdit(null);
    fetchData();
  };

  const remove = async (id: number) => {
    if (!confirm('Удалить группу фильтров?')) return;
    await supabase.from('category_filter_groups').delete().eq('id', id);
    fetchData();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Группы фильтров</h1>
        <button onClick={() => setEdit({ name: '', characteristic_label: '', category_id: categories[0]?.id, sort_order: 0 })}
          className="bg-[#ef7d00] text-white px-4 py-2 text-sm rounded hover:bg-[#d66f00]">+ Добавить</button>
      </div>

      {edit && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={() => setEdit(null)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4">{edit.id ? 'Редактировать' : 'Новая'} группу фильтров</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Категория</label>
                <select value={edit.category_id || ''} onChange={(e) => setEdit({ ...edit, category_id: Number(e.target.value) })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#ef7d00]">
                  {categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Название (показывается в фильтре)</label>
                <input value={edit.name || ''} onChange={(e) => setEdit({ ...edit, name: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#ef7d00]" placeholder="Диаметр капсулы" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Метка характеристики</label>
                <input value={edit.characteristic_label || ''} onChange={(e) => setEdit({ ...edit, characteristic_label: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#ef7d00]" placeholder="Диаметр капсулы" />
                <div className="text-[11px] text-gray-400 mt-1">Должна совпадать с label в характеристиках товара</div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Порядок сортировки</label>
                <input type="number" value={edit.sort_order ?? 0} onChange={(e) => setEdit({ ...edit, sort_order: Number(e.target.value) })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#ef7d00]" />
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={save} disabled={saving || !edit.name || !edit.characteristic_label}
                className="bg-[#ef7d00] text-white px-5 py-2 text-sm rounded hover:bg-[#d66f00] disabled:opacity-50">
                {saving ? 'Сохранение...' : 'Сохранить'}
              </button>
              <button onClick={() => setEdit(null)} className="px-5 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50">Отмена</button>
            </div>
          </div>
        </div>
      )}

      {groups.length === 0 ? (
        <div className="bg-white rounded shadow p-8 text-center text-gray-400 text-sm">Нет групп фильтров</div>
      ) : (
        <div className="space-y-2">
          {categories.map((cat) => {
            const catGroups = groups.filter((g) => g.category_id === cat.id);
            if (!catGroups.length) return null;
            return (
              <div key={cat.id} className="bg-white rounded shadow overflow-hidden">
                <div className="px-4 py-2 bg-gray-50 text-sm font-medium text-gray-700 border-b">{cat.name}</div>
                {catGroups.map((g) => (
                  <div key={g.id} className="flex items-center gap-4 px-4 py-2.5 border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-800">{g.name}</div>
                      <div className="text-[11px] text-gray-400">Характеристика: {g.characteristic_label} · Порядок: {g.sort_order}</div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => setEdit(g)} className="px-3 py-1.5 text-xs border border-blue-200 text-blue-600 rounded hover:bg-blue-50">Ред.</button>
                      <button onClick={() => remove(g.id)} className="px-3 py-1.5 text-xs border border-red-200 text-red-500 rounded hover:bg-red-50">Удал.</button>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
