import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface FilterGroup {
  id: number;
  category_id: number | null;
  subcategory_id: number | null;
  name: string;
  characteristic_label: string;
  options: string[] | null;
  sort_order: number;
}

interface Category {
  id: number;
  name: string;
}

interface SubCategory {
  id: number;
  name: string;
  category_id: number;
}

export default function AdminFilterGroups() {
  const [groups, setGroups] = useState<FilterGroup[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subs, setSubs] = useState<SubCategory[]>([]);
  const [edit, setEdit] = useState<Partial<FilterGroup> & { scope: 'category' | 'subcategory' } | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    const [{ data: groupsData }, { data: catsData }, { data: subsData }] = await Promise.all([
      supabase.from('category_filter_groups').select('*').order('sort_order'),
      supabase.from('categories').select('id, name').order('id'),
      supabase.from('subcategories').select('id, name, category_id').order('sort_order'),
    ]);
    if (groupsData) setGroups(groupsData);
    if (catsData) setCategories(catsData);
    if (subsData) setSubs(subsData);
  };

  useEffect(() => { fetchData(); }, []);

  const filteredSubs = edit?.category_id ? subs.filter((s) => s.category_id === edit.category_id) : [];

  const save = async () => {
    if (!edit || !edit.name || !edit.characteristic_label) return;
    setSaving(true);
    const payload: any = { name: edit.name, characteristic_label: edit.characteristic_label, options: Array.isArray(edit.options) && edit.options.length ? edit.options : null, sort_order: edit.sort_order ?? 0 };
    if (edit.scope === 'subcategory') {
      payload.category_id = null;
      payload.subcategory_id = edit.subcategory_id;
    } else {
      payload.category_id = edit.category_id;
      payload.subcategory_id = null;
    }
    if (edit.id) {
      await supabase.from('category_filter_groups').update(payload).eq('id', edit.id);
    } else {
      await supabase.from('category_filter_groups').insert(payload);
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

  const openNew = () => {
    const firstCat = categories[0];
    setEdit({ name: '', characteristic_label: '', category_id: firstCat?.id, subcategory_id: undefined, sort_order: 0, scope: 'category' });
  };

  const scopeLabel = (g: FilterGroup) => {
    const sub = g.subcategory_id ? subs.find((s) => s.id === g.subcategory_id) : null;
    return sub ? sub.name : 'Все товары категории';
  };

  const catName = (g: FilterGroup) => {
    const id = g.category_id || subs.find((s) => s.id === g.subcategory_id)?.category_id;
    return categories.find((c) => c.id === id)?.name || '';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Группы фильтров</h1>
        <button onClick={openNew}
          className="bg-[#ef7d00] text-white px-4 py-2 text-sm rounded hover:bg-[#d66f00]">+ Добавить</button>
      </div>

      {edit && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={() => setEdit(null)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4">{edit.id ? 'Редактировать' : 'Новая'} группу фильтров</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Категория</label>
                <select value={edit.category_id || ''} onChange={(e) => setEdit({ ...edit, category_id: Number(e.target.value), subcategory_id: undefined, scope: 'category' })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#ef7d00]">
                  {categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Привязать к подкатегории (необязательно)</label>
                <select value={edit.scope === 'subcategory' ? edit.subcategory_id || '' : ''}
                  onChange={(e) => {
                    const val = e.target.value ? Number(e.target.value) : undefined;
                    setEdit({ ...edit, subcategory_id: val, scope: val ? 'subcategory' : 'category' });
                  }}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#ef7d00]">
                  <option value="">— Все товары категории —</option>
                  {filteredSubs.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}
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
                <label className="text-xs text-gray-500 mb-1 block">Варианты (через запятую)</label>
                <input value={Array.isArray(edit.options) ? edit.options.join(', ') : ''}
                  onChange={(e) => setEdit({ ...edit, options: e.target.value ? e.target.value.split(',').map((s) => s.trim()).filter(Boolean) : [] })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#ef7d00]" placeholder="50, 100, 100+100" />
                <div className="text-[11px] text-gray-400 mt-1">Оставьте пустым, чтобы варианты собирались из товаров</div>
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
            const catGroups = groups.filter((g) => g.category_id === cat.id || subs.some((s) => s.id === g.subcategory_id && s.category_id === cat.id));
            if (!catGroups.length) return null;
            return (
              <div key={cat.id} className="bg-white rounded shadow overflow-hidden">
                <div className="px-4 py-2 bg-gray-50 text-sm font-medium text-gray-700 border-b">{cat.name}</div>
                {catGroups.map((g) => (
                  <div key={g.id} className="flex items-center gap-4 px-4 py-2.5 border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-800">{g.name}</div>
                      <div className="text-[11px] text-gray-400">
                        {scopeLabel(g)} · Характеристика: {g.characteristic_label} · Порядок: {g.sort_order}
                        {g.options?.length ? ` · Варианты: ${g.options.join(', ')}` : ''}
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => {
                        const scope = g.subcategory_id ? 'subcategory' as const : 'category' as const;
                        setEdit({ ...g, scope });
                      }} className="px-3 py-1.5 text-xs border border-blue-200 text-blue-600 rounded hover:bg-blue-50">Ред.</button>
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
