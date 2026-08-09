import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';

interface NewsItem {
  id: number;
  title: string;
  date: string;
  image_url: string | null;
  badge: string | null;
  content: string | null;
  is_active: boolean;
}

export default function AdminNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [edit, setEdit] = useState<Partial<NewsItem> | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchNews = async () => {
    const { data } = await supabase.from('news').select('*').order('id', { ascending: false });
    if (data) setNews(data);
  };

  useEffect(() => { fetchNews(); }, []);

  const uploadImage = async (): Promise<string | null> => {
    const file = fileRef.current?.files?.[0];
    if (!file) return null;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `news_${Date.now()}_${Math.random().toString(36).slice(2, 6)}.${ext}`;
    const { error } = await supabase.storage.from('products').upload(path, file);
    if (error) { alert('Ошибка: ' + error.message); setUploading(false); return null; }
    const { data: urlData } = supabase.storage.from('products').getPublicUrl(path);
    setUploading(false);
    return urlData?.publicUrl || null;
  };

  const save = async () => {
    if (!edit || !edit.title) return;
    setSaving(true);
    let image_url = edit.image_url;
    if (fileRef.current?.files?.length) {
      const uploaded = await uploadImage();
      if (uploaded) image_url = uploaded;
    }
    const payload = {
      title: edit.title,
      date: edit.date || new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }),
      image_url: image_url || null,
      badge: edit.badge || null,
      content: edit.content || null,
      is_active: edit.is_active ?? true,
    };
    if (edit.id) {
      await supabase.from('news').update(payload).eq('id', edit.id);
    } else {
      await supabase.from('news').insert(payload);
    }
    setSaving(false);
    setEdit(null);
    fetchNews();
  };

  const toggleActive = async (id: number, current: boolean) => {
    await supabase.from('news').update({ is_active: !current }).eq('id', id);
    fetchNews();
  };

  const deleteItem = async (id: number) => {
    if (!confirm('Удалить новость?')) return;
    await supabase.from('news').delete().eq('id', id);
    fetchNews();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Новости</h1>
        <button onClick={() => setEdit({ title: '', date: '', is_active: true })}
          className="bg-[#ef7d00] text-white px-4 py-2 text-sm rounded hover:bg-[#d66f00]">+ Добавить</button>
      </div>

      {edit && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={() => setEdit(null)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4">{edit.id ? 'Редактировать' : 'Новая'} новость</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Заголовок *</label>
                <input value={edit.title || ''} onChange={(e) => setEdit({ ...edit, title: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#ef7d00]" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Дата</label>
                <input value={edit.date || ''} onChange={(e) => setEdit({ ...edit, date: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#ef7d00]" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Бейдж (надпись на картинке)</label>
                <input value={edit.badge || ''} onChange={(e) => setEdit({ ...edit, badge: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#ef7d00]" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Текст новости</label>
                <textarea
                  value={edit.content || ''}
                  onChange={(e) => setEdit({ ...edit, content: e.target.value })}
                  rows={8}
                  placeholder="Полный текст новости. Новые абзацы — с новой строки."
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#ef7d00] resize-y"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Изображение</label>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" />
                <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                  className="border border-dashed border-gray-300 rounded px-4 py-2 text-sm text-gray-500 hover:border-[#ef7d00] hover:text-[#ef7d00] transition-colors">
                  {uploading ? 'Загрузка...' : 'Выберите файл'}
                </button>
                {edit.image_url && (
                  <div className="mt-2 flex gap-2 items-center">
                    <img src={edit.image_url} className="w-16 h-16 object-cover rounded border" />
                    <button onClick={() => setEdit({ ...edit, image_url: '' })} className="text-xs text-red-500 hover:underline">Удалить</button>
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

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Заголовок</th>
              <th className="text-left px-4 py-3 font-medium">Дата</th>
              <th className="text-left px-4 py-3 font-medium">Бейдж</th>
              <th className="text-left px-4 py-3 font-medium">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {news.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{item.title}</td>
                <td className="px-4 py-3 text-gray-500">{item.date}</td>
                <td className="px-4 py-3 text-gray-500">{item.badge || '—'}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button onClick={() => setEdit(item)} className="px-3 py-1.5 text-xs border border-blue-200 text-blue-600 rounded hover:bg-blue-50">Ред.</button>
                    <button onClick={() => toggleActive(item.id, item.is_active)}
                      className={`px-3 py-1.5 text-xs border rounded ${item.is_active ? 'border-gray-200 text-gray-500 hover:bg-gray-50' : 'border-green-200 text-green-600 hover:bg-green-50'}`}>
                      {item.is_active ? 'Скрыть' : 'Показать'}
                    </button>
                    <button onClick={() => deleteItem(item.id)} className="px-3 py-1.5 text-xs border border-red-200 text-red-500 rounded hover:bg-red-50">Удал.</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
