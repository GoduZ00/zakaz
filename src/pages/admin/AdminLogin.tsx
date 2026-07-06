import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) setError(err.message);
    else navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h1 className="text-xl font-bold text-gray-900 mb-6 text-center">Вход в админ-панель</h1>
        {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded mb-4">{error}</div>}
        <input
          type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-3 focus:outline-none focus:border-[#ef7d00]"
          required
        />
        <input
          type="password" placeholder="Пароль" value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-4 focus:outline-none focus:border-[#ef7d00]"
          required
        />
        <button type="submit" className="w-full bg-[#ef7d00] text-white py-2 rounded text-sm font-medium hover:bg-[#d66f00] transition-colors">
          Войти
        </button>
      </form>
    </div>
  );
}
