import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface FooterLink {
  label: string;
  url: string;
}

interface FooterSection {
  id: number;
  title: string;
  links: FooterLink[];
  sort_order: number;
}

export default function AdminFooter() {
  const [sections, setSections] = useState<FooterSection[]>([]);
  const [edit, setEdit] = useState<Partial<FooterSection> | null>(null);
  const [saving, setSaving] = useState(false);

  const fetch = async () => {
    const { data } = await supabase.from('footer_sections').select('*').order('sort_order');
    if (data) setSections(data);
  };

  useEffect(() => { fetch(); }, []);

  const save = async () => {
    if (!edit || !edit.title) return;
    setSaving(true);
    const payload = {
      title: edit.title,
      links: edit.links || [],
      sort_order: edit.sort_order ?? 0,
    };
    if (edit.id) {
      await supabase.from('footer_sections').update(payload).eq('id', edit.id);
    } else {
      await supabase.from('footer_sections').insert(payload);
    }
    setSaving(false);
    setEdit(null);
    fetch();
  };

  const deleteSection = async (id: number) => {
    if (!confirm('Удалить раздел футтера?')) return;
    await supabase.from('footer_sections').delete().eq('id', id);
    fetch();
  };

  const addLink = () => {
    if (!edit) return;
    setEdit({ ...edit, links: [...(edit.links || []), { label: '', url: '#' }] });
  };

  const updateLink = (idx: number, field: keyof FooterLink, value: string) => {
    if (!edit) return;
    const links = [...(edit.links || [])];
    links[idx] = { ...links[idx], [field]: value };
    setEdit({ ...edit, links });
  };

  const removeLink = (idx: number) => {
    if (!edit) return;
    const links = (edit.links || []).filter((_, i) => i !== idx);
    setEdit({ ...edit, links });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Футтер</h1>
        <button onClick={() => setEdit({ title: '', links: [{ label: '', url: '#' }], sort_order: sections.length + 1 })}
          className="bg-[#ef7d00] text-white px-4 py-2 text-sm rounded hover:bg-[#d66f00]">+ Добавить раздел</button>
      </div>

      {edit && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={() => setEdit(null)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4">{edit.id ? 'Редактировать' : 'Новый'} раздел</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Название раздела *</label>
                <input value={edit.title || ''} onChange={(e) => setEdit({ ...edit, title: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#ef7d00]" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Порядок сортировки</label>
                <input type="number" value={edit.sort_order ?? 0} onChange={(e) => setEdit({ ...edit, sort_order: parseInt(e.target.value) || 0 })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#ef7d00]" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs text-gray-500">Ссылки</label>
                  <button onClick={addLink} className="text-xs text-[#ef7d00] hover:underline">+ Добавить ссылку</button>
                </div>
                <div className="space-y-2">
                  {(edit.links || []).map((link, idx) => (
                    <div key={idx} className="flex gap-2 items-start border border-gray-200 rounded p-2">
                      <div className="flex-1 space-y-1">
                        <input placeholder="Текст ссылки" value={link.label}
                          onChange={(e) => updateLink(idx, 'label', e.target.value)}
                          className="w-full border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-[#ef7d00]" />
                        <input placeholder="URL (например /catalog/tovary)" value={link.url}
                          onChange={(e) => updateLink(idx, 'url', e.target.value)}
                          className="w-full border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-[#ef7d00]" />
                      </div>
                      <button onClick={() => removeLink(idx)} className="text-red-400 hover:text-red-600 mt-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
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
              <th className="text-left px-4 py-3 font-medium">Название</th>
              <th className="text-left px-4 py-3 font-medium">Ссылок</th>
              <th className="text-left px-4 py-3 font-medium">Порядок</th>
              <th className="text-left px-4 py-3 font-medium">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sections.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{s.title}</td>
                <td className="px-4 py-3 text-gray-500">{s.links?.length || 0}</td>
                <td className="px-4 py-3 text-gray-500">{s.sort_order}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button onClick={() => setEdit(s)} className="px-3 py-1.5 text-xs border border-blue-200 text-blue-600 rounded hover:bg-blue-50">Ред.</button>
                    <button onClick={() => deleteSection(s.id)} className="px-3 py-1.5 text-xs border border-red-200 text-red-500 rounded hover:bg-red-50">Удал.</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {sections.length === 0 && (
          <p className="text-gray-400 text-center py-8">Нет разделов. Нажмите «+ Добавить раздел»</p>
        )}
      </div>
    </div>
  );
}
