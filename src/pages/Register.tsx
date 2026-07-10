import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Helmet } from 'react-helmet-async';

export default function Register() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (password !== confirm) { setError('Пароли не совпадают'); return; }
    if (password.length < 6) { setError('Пароль должен быть минимум 6 символов'); return; }
    setSubmitting(true);
    const { error: err } = await signUp(email, password);
    setSubmitting(false);
    if (err) setError(err.message);
    else {
      setSuccess('Регистрация прошла успешно! Проверьте вашу почту для подтверждения.');
      setEmail('');
      setPassword('');
      setConfirm('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans">
      <Helmet><title>Регистрация — Vending Trade</title><meta name="description" content="Регистрация на сайте Vending Trade." /></Helmet>
      <nav className="text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-[#ef7d00] transition-colors">Главная</Link>
        <span className="mx-2">—</span>
        <span className="text-gray-900">Регистрация</span>
      </nav>
      <div className="max-w-sm mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Регистрация</h1>
        {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded mb-4 border border-red-200">{error}</div>}
        {success && <div className="bg-green-50 text-green-700 text-sm p-3 rounded mb-4 border border-green-200">{success}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-[#ef7d00]" required />
          <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-[#ef7d00]" required />
          <input type="password" placeholder="Подтвердите пароль" value={confirm} onChange={(e) => setConfirm(e.target.value)}
            className="w-full border border-gray-300 rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-[#ef7d00]" required />
          <button type="submit" disabled={submitting}
            className="w-full bg-[#ef7d00] text-white py-2.5 text-sm rounded-sm hover:bg-[#d66f00] transition-colors font-medium disabled:opacity-50">
            {submitting ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>
        <p className="text-sm text-gray-500 text-center mt-5">
          Уже есть аккаунт? <Link to="/login" className="text-[#ef7d00] hover:underline">Войти</Link>
        </p>
      </div>
    </div>
  );
}
