import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { imgUrl } from '../utils/images';

export interface ViewedItem {
  id: string;
  name: string;
  price: string;
  img: string;
  url: string;
}

export default function ViewedItems() {
  const [items, setItems] = useState<ViewedItem[]>([]);
  const location = useLocation();

  useEffect(() => {
    const stored = localStorage.getItem('viewedItems');
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch {}
    }
  }, [location.pathname]);

  if (items.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h3 className="font-bold text-gray-900 text-base mb-5">Ранее вы смотрели</h3>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {items.map((item) => (
          <Link
            key={item.id}
            to={item.url}
            className="flex gap-3 items-start border border-gray-200 rounded-lg p-3 min-w-[280px] shrink-0 hover:shadow-md transition-shadow bg-white"
          >
            <img src={imgUrl(item.img, 128)} alt={item.name} loading="lazy" decoding="async" className="w-16 h-16 object-contain shrink-0 rounded" />
            <div className="min-w-0">
              <div className="text-xs text-gray-700 leading-tight line-clamp-2">{item.name}</div>
              <div className="text-sm font-bold text-gray-900 mt-1">{item.price}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function trackViewed(product: ViewedItem) {
  try {
    const stored = localStorage.getItem('viewedItems');
    let viewed: ViewedItem[] = stored ? JSON.parse(stored) : [];
    viewed = viewed.filter((v) => v.id !== product.id);
    viewed.unshift(product);
    if (viewed.length > 10) viewed = viewed.slice(0, 10);
    localStorage.setItem('viewedItems', JSON.stringify(viewed));
  } catch {}
}
