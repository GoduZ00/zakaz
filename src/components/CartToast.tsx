import { useCart } from '../context/CartContext';
import { useState } from 'react';

const SUPABASE_URL = 'https://wrlmvvfypehesqycgfjw.supabase.co';

export default function CartToast() {
  const { toast, clearToast } = useCart();
  const [imgErr, setImgErr] = useState(false);

  if (!toast) return null;

  const imgUrl = toast.image && !imgErr
    ? `${SUPABASE_URL}/storage/v1/object/public/products/${toast.image}`
    : null;

  return (
    <div className="fixed bottom-6 right-6 z-50 transition-all duration-300">
      <div className="bg-white border border-green-200 rounded-sm shadow-lg px-4 py-3 flex items-center gap-3 animate-slide-up max-w-sm">
        {imgUrl && (
          <img
            src={imgUrl}
            alt=""
            className="w-12 h-12 object-contain rounded border border-gray-100 shrink-0"
            onError={() => setImgErr(true)}
          />
        )}
        <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <span className="text-sm text-gray-800">{toast.text}</span>
        <button onClick={clearToast} className="text-gray-400 hover:text-gray-600 ml-auto shrink-0">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
