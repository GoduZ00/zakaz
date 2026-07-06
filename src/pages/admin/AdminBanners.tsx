import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';

interface Banner {
  id: number;
  image_url: string;
  button_link: string;
  is_active: boolean;
}

export default function AdminBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [edit, setEdit] = useState<Partial<Banner> | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetch = () => supabase.from('banners').select('*').order('id').then(({ data }) => {
    if (data) setBanners(data);
  });

  useEffect(() => { fetch(); }, []);

  const uploadFile = async (file: File) => {
    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `banner_${Date.now()}.${ext}`;
    const { data, error } = await supabase.storage.from('banners').upload(path, file);
    if (error) { alert('Ошибка загрузки: ' + error.message); setUploading(false); return; }
    const { data: urlData } = supabase.storage.from('banners').getPublicUrl(path);
    setUploading(false);
    return urlData?.publicUrl || '';
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadFile(file);
    if (url) setEdit({ ...edit!, image_url: url });
  };

  const save = async () => {
    if (!edit || !edit.image_url) return;
    setSaving(true);
    if (edit.id) {
      await supabase.from('banners').update(edit).eq('id', edit.id);
    } else {
      await supabase.from('banners').insert(edit);
    }
    setSaving(false);
    setEdit(null);
    fetch();
  };

  const remove = async (id: number) => {
    if (!confirm('Удалить баннер?')) return;
    await supabase.from('banners').delete().eq('id', id);
    fetch();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Баннеры</h1>
        <button onClick={() => setEdit({ image_url: '', button_link: '/catalog', is_active: true })} className="bg-[#ef7d00] text-white px-4 py-2 text-sm rounded hover:bg-[#d66f00]">+ Добавить</button>
      </div>

      {edit && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={() => setEdit(null)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4">{edit.id ? 'Редактировать' : 'Новый'} баннер</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Фото</label>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="w-full text-sm" />
                {uploading && <div className="text-xs text-blue-500 mt-1">Загрузка...</div>}
                {edit.image_url && !uploading && <img src={edit.image_url} className="mt-2 h-20 rounded object-cover" />}
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Куда направляет</label>
                <input placeholder="/catalog/igrushki" value={edit.button_link || ''} onChange={(e) => setEdit({ ...edit, button_link: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#ef7d00]" />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={edit.is_active ?? true} onChange={(e) => setEdit({ ...edit, is_active: e.target.checked })} />
                Активен
              </label>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={save} disabled={saving || !edit.image_url} className="bg-[#ef7d00] text-white px-5 py-2 text-sm rounded hover:bg-[#d66f00] disabled:opacity-50">
                {saving ? 'Сохранение...' : 'Сохранить'}
              </button>
              <button onClick={() => setEdit(null)} className="px-5 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50">Отмена</button>
            </div>
          </div>
        </div>
      )}

      {banners.length === 0 ? (
        <div className="bg-white rounded shadow p-8 text-center text-gray-400 text-sm">Нет баннеров</div>
      ) : (
        <div className="space-y-3">
          {banners.map((b) => (
            <div key={b.id} className="bg-white rounded shadow p-4 flex items-center gap-4">
              <img src={b.image_url} className="w-20 h-12 object-cover rounded shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-500 truncate">{b.button_link || 'Нет ссылки'}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-xs px-2 py-0.5 rounded ${b.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {b.is_active ? 'Активен' : 'Нет'}
                </span>
                <div className="flex gap-1">
                  <button onClick={() => setEdit(b)} className="px-3 py-1.5 text-xs border border-blue-200 text-blue-600 rounded hover:bg-blue-50 transition-colors">Ред.</button>
                  <button onClick={() => remove(b.id)} className="px-3 py-1.5 text-xs border border-red-200 text-red-500 rounded hover:bg-red-50 transition-colors">Удал.</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
