import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface Sub {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  sort_order: number;
}

interface Cat {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  opt_tooltip: string | null;
  sort_order: number;
  subcategories: Sub[];
}

const emptyCat = { name: '', slug: '', image: '', opt_tooltip: '', sort_order: 0 };
const emptySub = { name: '', slug: '', image: '', sort_order: 0 };

export default function AdminCategories() {
  const [categories, setCategories] = useState<Cat[]>([]);
  const [editingCat, setEditingCat] = useState<any>(null);
  const [catForm, setCatForm] = useState<any>(emptyCat);
  const [editingSub, setEditingSub] = useState<any>(null);
  const [subForm, setSubForm] = useState<any>(emptySub);
  const [activeCatId, setActiveCatId] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data } = await supabase.from('categories').select('*, subcategories(*)').order('sort_order');
    if (data) setCategories(data);
  }

  function openCatEdit(cat?: any) {
    setEditingCat(cat ? 'edit' : 'new');
    setCatForm(cat || { ...emptyCat });
  }

  async function saveCat() {
    const payload = { name: catForm.name, slug: catForm.slug, image: catForm.image || null, opt_tooltip: catForm.opt_tooltip || null, sort_order: catForm.sort_order || 0 };
    if (editingCat === 'edit') {
      await supabase.from('categories').update(payload).eq('id', catForm.id);
    } else {
      await supabase.from('categories').insert(payload);
    }
    setEditingCat(null);
    load();
  }

  async function deleteCat(id: number) {
    if (confirmDelete !== `cat_${id}`) { setConfirmDelete(`cat_${id}`); return; }
    await supabase.from('categories').delete().eq('id', id);
    setConfirmDelete(null);
    load();
  }

  function openSubEdit(catId: number, sub?: any) {
    setActiveCatId(catId);
    setEditingSub(sub ? 'edit' : 'new');
    setSubForm(sub || { ...emptySub });
  }

  async function saveSub() {
    const payload = { category_id: activeCatId, name: subForm.name, slug: subForm.slug, image: subForm.image || null, sort_order: subForm.sort_order || 0 };
    if (editingSub === 'edit') {
      await supabase.from('subcategories').update(payload).eq('id', subForm.id);
    } else {
      await supabase.from('subcategories').insert(payload);
    }
    setEditingSub(null);
    load();
  }

  async function deleteSub(id: number) {
    if (confirmDelete !== `sub_${id}`) { setConfirmDelete(`sub_${id}`); return; }
    await supabase.from('subcategories').delete().eq('id', id);
    setConfirmDelete(null);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Категории</h1>
        <button onClick={() => openCatEdit()} className="text-sm bg-[#ef7d00] text-white px-4 py-2 rounded hover:bg-[#d66f00] transition-colors">+ Добавить</button>
      </div>

      {categories.length === 0 ? (
        <div className="bg-white rounded shadow p-8 text-center text-gray-400 text-sm">Нет категорий</div>
      ) : (
        <div className="space-y-4">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white rounded shadow">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-900">{cat.name}</span>
                  <span className="text-xs text-gray-400">slug: {cat.slug}</span>
                  <span className="text-xs text-gray-400">ID: {cat.id}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => openSubEdit(cat.id)} className="text-xs text-gray-500 hover:text-[#ef7d00]">+ Подкатегорию</button>
                  <button onClick={() => openCatEdit(cat)} className="text-xs text-[#ef7d00] hover:underline">Редактировать</button>
                  <button onClick={() => deleteCat(cat.id)} className={`text-xs ${confirmDelete === `cat_${cat.id}` ? 'text-red-600 font-bold' : 'text-red-400 hover:text-red-600'}`}>
                    {confirmDelete === `cat_${cat.id}` ? 'Удалить?' : 'Удалить'}
                  </button>
                </div>
              </div>
              <div className="divide-y divide-gray-50">
                {cat.subcategories?.length === 0 && <div className="px-4 py-3 text-xs text-gray-400">Нет подкатегорий</div>}
                {cat.subcategories?.map((sub: any) => (
                  <div key={sub.id} className="px-4 py-2.5 text-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-700">{sub.name}</span>
                      <span className="text-xs text-gray-400">slug: {sub.slug}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => openSubEdit(cat.id, sub)} className="text-xs text-[#ef7d00] hover:underline">Ред.</button>
                      <button onClick={() => deleteSub(sub.id)} className={`text-xs ${confirmDelete === `sub_${sub.id}` ? 'text-red-600 font-bold' : 'text-red-400 hover:text-red-600'}`}>
                        {confirmDelete === `sub_${sub.id}` ? 'Удалить?' : 'Удалить'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Category modal */}
      {editingCat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setEditingCat(null)}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-900 mb-4">{editingCat === 'edit' ? 'Редактировать' : 'Добавить'} категорию</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Название</label>
                <input value={catForm.name} onChange={(e) => setCatForm({ ...catForm, name: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#ef7d00]" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Slug</label>
                <input value={catForm.slug} onChange={(e) => setCatForm({ ...catForm, slug: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#ef7d00]" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Изображение (URL)</label>
                <input value={catForm.image || ''} onChange={(e) => setCatForm({ ...catForm, image: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#ef7d00]" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Порядок сортировки</label>
                <input type="number" value={catForm.sort_order} onChange={(e) => setCatForm({ ...catForm, sort_order: Number(e.target.value) })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#ef7d00]" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Подсказка для оптовой цены</label>
                <textarea value={catForm.opt_tooltip || ''} onChange={(e) => setCatForm({ ...catForm, opt_tooltip: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#ef7d00] resize-none" rows={3} />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button onClick={() => setEditingCat(null)} className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2">Отмена</button>
              <button onClick={saveCat} className="text-sm bg-[#ef7d00] text-white px-4 py-2 rounded hover:bg-[#d66f00] transition-colors">Сохранить</button>
            </div>
          </div>
        </div>
      )}

      {/* Subcategory modal */}
      {editingSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setEditingSub(null)}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-900 mb-4">{editingSub === 'edit' ? 'Редактировать' : 'Добавить'} подкатегорию</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Название</label>
                <input value={subForm.name} onChange={(e) => setSubForm({ ...subForm, name: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#ef7d00]" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Slug</label>
                <input value={subForm.slug} onChange={(e) => setSubForm({ ...subForm, slug: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#ef7d00]" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Изображение (URL)</label>
                <input value={subForm.image || ''} onChange={(e) => setSubForm({ ...subForm, image: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#ef7d00]" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Порядок сортировки</label>
                <input type="number" value={subForm.sort_order} onChange={(e) => setSubForm({ ...subForm, sort_order: Number(e.target.value) })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#ef7d00]" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button onClick={() => setEditingSub(null)} className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2">Отмена</button>
              <button onClick={saveSub} className="text-sm bg-[#ef7d00] text-white px-4 py-2 rounded hover:bg-[#d66f00] transition-colors">Сохранить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
