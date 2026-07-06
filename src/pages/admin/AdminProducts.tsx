import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface Product {
  id: number;
  name: string;
  article: string;
  price: number;
  stock_status: string;
  is_active: boolean;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('id', { ascending: false });
    if (data) setProducts(data);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const toggleActive = async (id: number, current: boolean) => {
    await supabase.from('products').update({ is_active: !current }).eq('id', id);
    fetchProducts();
  };

  const deleteProduct = async (id: number) => {
    if (!confirm('Удалить товар?')) return;
    await supabase.from('products').delete().eq('id', id);
    fetchProducts();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Товары</h1>
        <button className="bg-[#ef7d00] text-white px-4 py-2 text-sm rounded hover:bg-[#d66f00]">+ Добавить</button>
      </div>
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
                      {p.stock_status === 'in_stock' ? 'В наличии' : 'Нет'}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button className="text-xs text-blue-600 hover:underline">Ред.</button>
                    <button onClick={() => toggleActive(p.id, p.is_active)} className={`text-xs ${p.is_active ? 'text-gray-500' : 'text-green-600'} hover:underline`}>
                      {p.is_active ? 'Скрыть' : 'Показать'}
                    </button>
                    <button onClick={() => deleteProduct(p.id)} className="text-xs text-red-500 hover:underline">Удал.</button>
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
