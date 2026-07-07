import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import type { SkuVariant } from '../../types';

interface Product {
  id: number;
  name: string;
  slug: string;
  article: string | null;
  price: number;
  price_wholesale: number | null;
  price_opt: number | null;
  stock_status: string;
  quantity: number;
  description: string | null;
  is_active: boolean;
  subcategory_id: number | null;
  images: string[];
  sku_variants: SkuVariant[];
}

interface SubCat {
  id: number;
  name: string;
  slug: string;
  category_name?: string;
  category_id: number;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [subcategories, setSubcategories] = useState<SubCat[]>([]);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState<Partial<Product> | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const skuFileRef = useRef<HTMLInputElement>(null);
  const [skuUploadIdx, setSkuUploadIdx] = useState<number | null>(null);

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('id', { ascending: false });
    if (data) setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
    supabase.from('subcategories').select('id, name, slug, category_id').order('sort_order').then(({ data }) => {
      if (data) {
        supabase.from('categories').select('id, name').then(({ data: cats }) => {
          if (cats && data) {
            const map = Object.fromEntries(cats.map((c) => [c.id, c.name]));
            setSubcategories(data.map((s) => ({ ...s, category_name: map[s.category_id] || '' })));
          }
        });
      }
    });
  }, []);

  const toggleActive = async (id: number, current: boolean) => {
    await supabase.from('products').update({ is_active: !current }).eq('id', id);
    fetchProducts();
  };

  const deleteProduct = async (id: number) => {
    if (!confirm('Удалить товар?')) return;
    await supabase.from('products').delete().eq('id', id);
    fetchProducts();
  };

  const uploadFile = async (file: File, prefix = 'product'): Promise<string | null> => {
    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}.${ext}`;
    const { error } = await supabase.storage.from('products').upload(path, file);
    if (error) { alert('Ошибка загрузки: ' + error.message); setUploading(false); return null; }
    const { data: urlData } = supabase.storage.from('products').getPublicUrl(path);
    setUploading(false);
    return urlData?.publicUrl || null;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    const urls: string[] = [];
    for (const file of Array.from(files) as File[]) {
      const url = await uploadFile(file);
      if (url) urls.push(url);
    }
    setEdit({ ...edit!, images: [...(edit.images || []), ...urls] });
    if (fileRef.current) fileRef.current.value = '';
  };

  const removeImage = (idx: number) => {
    setEdit({ ...edit!, images: (edit.images || []).filter((_, i) => i !== idx) });
  };

  const handleSkuImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const file = e.target.files?.[0];
    if (!file || skuUploadIdx === null) return;
    const url = await uploadFile(file, 'sku');
    if (url) {
      const variants = [...(edit?.sku_variants || [])];
      variants[idx] = { ...variants[idx], image: url };
      setEdit({ ...edit!, sku_variants: variants });
    }
    setSkuUploadIdx(null);
    if (skuFileRef.current) skuFileRef.current.value = '';
  };

  const removeSkuImage = (idx: number) => {
    const variants = [...(edit?.sku_variants || [])];
    variants[idx] = { ...variants[idx], image: undefined };
    setEdit({ ...edit!, sku_variants: variants });
  };

  const save = async () => {
    if (!edit || !edit.name) return;
    setSaving(true);
    const payload = {
      name: edit.name,
      slug: edit.slug || edit.name.toLowerCase().replace(/[^a-zа-яё0-9]+/g, '-').replace(/-+$/, ''),
      article: edit.article || null,
      price: edit.price ?? 0,
      price_wholesale: edit.price_wholesale || null,
      price_opt: edit.price_opt || null,
      stock_status: edit.stock_status || 'in_stock',
      quantity: edit.quantity ?? 0,
      description: edit.description || null,
      is_active: edit.is_active ?? true,
      subcategory_id: edit.subcategory_id || null,
      images: edit.images || [],
      sku_variants: edit.sku_variants || [],
    };
    if (edit.id) {
      await supabase.from('products').update(payload).eq('id', edit.id);
    } else {
      await supabase.from('products').insert(payload);
    }
    setSaving(false);
    setEdit(null);
    fetchProducts();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Товары</h1>
        <button onClick={() => setEdit({ name: '', price: 0, stock_status: 'in_stock', quantity: 0, is_active: true, images: [], sku_variants: [] })} className="bg-[#ef7d00] text-white px-4 py-2 text-sm rounded hover:bg-[#d66f00]">+ Добавить</button>
      </div>

      {edit && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={() => setEdit(null)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4">{edit.id ? 'Редактировать' : 'Новый'} товар</h2>
            <div className="space-y-4">
              {/* Name + Slug */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Название *</label>
                  <input value={edit.name || ''} onChange={(e) => setEdit({ ...edit, name: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#ef7d00]" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">URL (slug)</label>
                  <input value={edit.slug || ''} onChange={(e) => setEdit({ ...edit, slug: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#ef7d00]" />
                </div>
              </div>

              {/* Article + Subcategory */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Артикул</label>
                  <input value={edit.article || ''} onChange={(e) => setEdit({ ...edit, article: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#ef7d00]" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Подкатегория</label>
                  <select value={edit.subcategory_id ?? ''} onChange={(e) => setEdit({ ...edit, subcategory_id: e.target.value ? Number(e.target.value) : null })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#ef7d00]">
                    <option value="">— без подкатегории —</option>
                    {subcategories.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}{s.category_name ? ` (${s.category_name})` : ''}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Prices */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Цена *</label>
                  <input type="number" step="0.01" value={edit.price ?? ''} onChange={(e) => setEdit({ ...edit, price: parseFloat(e.target.value) || 0 })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#ef7d00]" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Мелкоопт</label>
                  <input type="number" step="0.01" value={edit.price_wholesale ?? ''} onChange={(e) => setEdit({ ...edit, price_wholesale: parseFloat(e.target.value) || null })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#ef7d00]" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Опт</label>
                  <input type="number" step="0.01" value={edit.price_opt ?? ''} onChange={(e) => setEdit({ ...edit, price_opt: parseFloat(e.target.value) || null })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#ef7d00]" />
                </div>
              </div>

              {/* Stock status + Quantity */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Статус</label>
                  <select value={edit.stock_status || 'in_stock'} onChange={(e) => setEdit({ ...edit, stock_status: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#ef7d00]">
                    <option value="in_stock">В наличии</option>
                    <option value="out_of_stock">Нет в наличии</option>
                    <option value="on_order">Под заказ</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Количество на складе</label>
                  <input type="number" min="0" value={edit.quantity ?? 0} onChange={(e) => setEdit({ ...edit, quantity: parseInt(e.target.value) || 0 })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#ef7d00]" />
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Фото товара</label>
                <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
                <div className="flex flex-wrap gap-2 mb-2">
                  {(edit.images || []).map((img, i) => (
                    <div key={i} className="relative group w-16 h-16 border border-gray-200 rounded overflow-hidden">
                      <img src={img} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeImage(i)}
                        className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white text-xs rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">×</button>
                    </div>
                  ))}
                  <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                    className="w-16 h-16 border-2 border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400 hover:border-[#ef7d00] hover:text-[#ef7d00] transition-colors text-lg">
                    {uploading ? <span className="text-xs text-blue-500">...</span> : '+'}
                  </button>
                </div>
              </div>

              {/* SKU Variants */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Варианты (SKU)</label>
                {(edit.sku_variants || []).map((v, i) => (
                  <div key={i} className="flex items-center gap-2 mb-2 p-2 bg-gray-50 rounded border border-gray-200">
                    <div className="relative w-10 h-10 shrink-0 border border-gray-200 rounded overflow-hidden bg-white">
                      {v.image ? (
                        <>
                          <img src={v.image} className="w-full h-full object-cover" />
                          <button type="button" onClick={() => removeSkuImage(i)}
                            className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">×</button>
                        </>
                      ) : (
                        <button type="button" onClick={() => { setSkuUploadIdx(i); skuFileRef.current?.click(); }}
                          className="w-full h-full flex items-center justify-center text-gray-300 hover:text-gray-500 text-lg">+</button>
                      )}
                    </div>
                    <input placeholder="Артикул" value={v.article} onChange={(e) => {
                      const variants = [...(edit.sku_variants || [])];
                      variants[i] = { ...variants[i], article: e.target.value };
                      setEdit({ ...edit!, sku_variants: variants });
                    }} className="w-24 border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-[#ef7d00]" />
                    <input placeholder="Название" value={v.label} onChange={(e) => {
                      const variants = [...(edit.sku_variants || [])];
                      variants[i] = { ...variants[i], label: e.target.value };
                      setEdit({ ...edit!, sku_variants: variants });
                    }} className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-[#ef7d00]" />
                    <input placeholder="Цена" type="number" value={v.price ?? ''} onChange={(e) => {
                      const variants = [...(edit.sku_variants || [])];
                      variants[i] = { ...variants[i], price: e.target.value ? parseFloat(e.target.value) : undefined };
                      setEdit({ ...edit!, sku_variants: variants });
                    }} className="w-20 border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-[#ef7d00]" />
                    <button type="button" onClick={() => {
                      setEdit({ ...edit!, sku_variants: (edit.sku_variants || []).filter((_, j) => j !== i) });
                    }} className="shrink-0 text-red-400 hover:text-red-600 text-lg leading-none">×</button>
                  </div>
                ))}
                <input ref={skuFileRef} type="file" accept="image/*" className="hidden" onChange={(e) => skuUploadIdx !== null && handleSkuImageUpload(e, skuUploadIdx)} />
                <button type="button" onClick={() => {
                  setEdit({ ...edit!, sku_variants: [...(edit.sku_variants || []), { article: '', label: '' }] });
                }} className="text-xs text-[#ef7d00] hover:underline">+ Добавить вариант</button>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Описание</label>
                <textarea rows={4} value={edit.description || ''} onChange={(e) => setEdit({ ...edit, description: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#ef7d00]" />
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={edit.is_active ?? true} onChange={(e) => setEdit({ ...edit, is_active: e.target.checked })} />
                Активен
              </label>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={save} disabled={saving || !edit.name} className="bg-[#ef7d00] text-white px-5 py-2 text-sm rounded hover:bg-[#d66f00] disabled:opacity-50">
                {saving ? 'Сохранение...' : 'Сохранить'}
              </button>
              <button onClick={() => setEdit(null)} className="px-5 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50">Отмена</button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-gray-400 text-sm">Загрузка...</div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded shadow p-8 text-center text-gray-400 text-sm">Нет товаров</div>
      ) : (
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Название</th>
                <th className="text-left px-4 py-3 font-medium">Артикул</th>
                <th className="text-left px-4 py-3 font-medium">Цена</th>
                <th className="text-left px-4 py-3 font-medium">Статус</th>
                <th className="text-left px-4 py-3 font-medium">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{p.name}</td>
                  <td className="px-4 py-3 text-gray-500">{p.article || '—'}</td>
                  <td className="px-4 py-3">{p.price} ₽</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded ${p.stock_status === 'in_stock' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {p.stock_status === 'in_stock' ? 'В наличии' : p.stock_status === 'out_of_stock' ? 'Нет' : 'Под заказ'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => setEdit(p)} className="px-3 py-1.5 text-xs border border-blue-200 text-blue-600 rounded hover:bg-blue-50 transition-colors">Ред.</button>
                      <button onClick={() => toggleActive(p.id, p.is_active)} className={`px-3 py-1.5 text-xs border rounded transition-colors ${p.is_active ? 'border-gray-200 text-gray-500 hover:bg-gray-50' : 'border-green-200 text-green-600 hover:bg-green-50'}`}>
                        {p.is_active ? 'Скрыть' : 'Показать'}
                      </button>
                      <button onClick={() => deleteProduct(p.id)} className="px-3 py-1.5 text-xs border border-red-200 text-red-500 rounded hover:bg-red-50 transition-colors">Удал.</button>
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
