import { useCart } from '../context/CartContext';

export default function CartToast() {
  const { toastMessage, clearToast } = useCart();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 transition-all duration-300">
      <div className="bg-white border border-green-200 rounded-sm shadow-lg px-5 py-3 flex items-center gap-3 animate-slide-up">
        <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <span className="text-sm text-gray-800">{toastMessage}</span>
        <button onClick={clearToast} className="text-gray-400 hover:text-gray-600 ml-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
