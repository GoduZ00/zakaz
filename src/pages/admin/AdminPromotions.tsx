import { useEffect, useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';

interface Promotion {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  discount: string | null;
  image: string | null;
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
}

export default function AdminPromotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [edit, setEdit] = useState<Partial<Promotion> | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchPromotions = async () => {
    const { data } = await supabase.from('promotions').select('*').order('id', { ascending: false });
    if (data) setPromotions(data);
  };

  useEffect(() => { fetchPromotions(); }, []);

  const uploadImage = async (): Promise<string | null> => {
    const file = fileRef.current?.files?.[0];
    if (!file) return null;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `promo_${Date.now()}_${Math.random().toString(36).slice(2, 6)}.${ext}`;
    const { error } = await supabase.storage.from('products').upload(path, file);
    if (error) { alert('Ошибка: ' + error.message); setUploading(false); return null; }
    const { data: urlData } = supabase.storage.from('products').getPublicUrl(path);
    setUploading(false);
    return urlData?.publicUrl || null;
  };

  const save = async () => {
    if (!edit || !edit.title) return;
    setSaving(true);
    let image = edit.image;
    if (fileRef.current?.files?.length) {
      const uploaded = await uploadImage();
      if (uploaded) image = uploaded;
    }
    const slug = edit.slug || edit.title.toLowerCase().replace(/[^a-zа-яё0-9]+/g, '-').replace(/-+$/, '');
    const payload: any = {
      title: edit.title,
      slug,
      description: edit.description || null,
      discount: edit.discount || null,
      image: image || null,
      is_active: edit.is_active ?? true,
      start_date: edit.start_date || null,
      end_date: edit.end_date || null,
    };
    if (edit.id) {
      await supabase.from('promotions').update(payload).eq('id', edit.id);
    } else {
      await supabase.from('promotions').insert(payload);
    }
    setSaving(false);
    setEdit(null);
    fetchPromotions();
  };

  const toggleActive = async (id: number, current: boolean) => {
    await supabase.from('promotions').update({ is_active: !current }).eq('id', id);
    fetchPromotions();
  };

  const deleteItem = async (id: number) => {
    if (!confirm('Удалить акцию?')) return;
    await supabase.from('promotions').delete().eq('id', id);
    fetchPromotions();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Акции</h1>
        <button onClick={() => setEdit({ title: '', is_active: true })}
          className="bg-[#ef7d00] text-white px-4 py-2 text-sm rounded hover:bg-[#d66f00]">+ Добавить</button>
      </div>

      {edit && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={() => setEdit(null)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4">{edit.id ? 'Редактировать' : 'Новая'} акция</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Название *</label>
                <input value={edit.title || ''} onChange={(e) => setEdit({ ...edit, title: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#ef7d00]" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Скидка (например «20%»)</label>
                <input value={edit.discount || ''} onChange={(e) => setEdit({ ...edit, discount: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#ef7d00]" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Описание</label>
                <textarea value={edit.description || ''} onChange={(e) => setEdit({ ...edit, description: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#ef7d00]" rows={3} />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">Дата начала</label>
                  <input type="date" value={edit.start_date || ''} onChange={(e) => setEdit({ ...edit, start_date: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#ef7d00]" />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">Дата окончания</label>
                  <input type="date" value={edit.end_date || ''} onChange={(e) => setEdit({ ...edit, end_date: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#ef7d00]" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Изображение</label>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" />
                <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                  className="border border-dashed border-gray-300 rounded px-4 py-2 text-sm text-gray-500 hover:border-[#ef7d00] hover:text-[#ef7d00] transition-colors">
                  {uploading ? 'Загрузка...' : 'Выберите файл'}
                </button>
                {edit.image && (
                  <div className="mt-2 flex gap-2 items-center">
                    <img src={edit.image} className="w-16 h-16 object-cover rounded border" />
                    <button onClick={() => setEdit({ ...edit, image: '' })} className="text-xs text-red-500 hover:underline">Удалить</button>
                  </div>
                )}
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={edit.is_active ?? true} onChange={(e) => setEdit({ ...edit, is_active: e.target.checked })} />
                Активна
              </label>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={save} disabled={saving || !edit.title}
                className="bg-[#ef7d00] text-white px-5 py-2 text-sm rounded hover:bg-[#d66f00] disabled:opacity-50">
                {saving ? 'Сохранение...' : 'Сохранить'}
              </button>
              <button onClick={() => setEdit(null)} className="px-5 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50">Отмена</button>
            </div>
          </div>
        </div>
      )}

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
                      <button onClick={() => setEdit(p)} className="px-3 py-1.5 text-xs border border-blue-200 text-blue-600 rounded hover:bg-blue-50 transition-colors">Ред.</button>
                      <button onClick={() => toggleActive(p.id, p.is_active)} className="px-3 py-1.5 text-xs border border-gray-200 text-gray-500 rounded hover:bg-gray-50 transition-colors">
                        {p.is_active ? 'Деактив.' : 'Актив.'}
                      </button>
                      <button onClick={() => deleteItem(p.id)} className="px-3 py-1.5 text-xs border border-red-200 text-red-500 rounded hover:bg-red-50">Удал.</button>
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
