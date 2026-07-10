import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Helmet } from 'react-helmet-async';

export default function Login() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const { error: err } = await signIn(email, password);
    setSubmitting(false);
    if (err) setError(err.message === 'Invalid login credentials' ? 'Неверный email или пароль' : err.message);
    else navigate('/profile');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans">
      <Helmet><title>Вход — Vending Trade</title><meta name="description" content="Вход в личный кабинет Vending Trade." /></Helmet>
      <nav className="text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-[#ef7d00] transition-colors">Главная</Link>
        <span className="mx-2">—</span>
        <span className="text-gray-900">Вход</span>
      </nav>
      <div className="max-w-sm mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Вход</h1>
        {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded mb-4 border border-red-200">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-[#ef7d00]" required />
          <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-[#ef7d00]" required />
          <button type="submit" disabled={submitting}
            className="w-full bg-[#ef7d00] text-white py-2.5 text-sm rounded-sm hover:bg-[#d66f00] transition-colors font-medium disabled:opacity-50">
            {submitting ? 'Вход...' : 'Войти'}
          </button>
        </form>
        <p className="text-sm text-gray-500 text-center mt-5">
          Нет аккаунта? <Link to="/register" className="text-[#ef7d00] hover:underline">Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  );
}
