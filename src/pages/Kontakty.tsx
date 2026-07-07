import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

const contacts = [
  { icon: <Phone className="w-5 h-5" />, title: 'Телефон', value: '+7 (701) 309-9969', href: 'tel:+77013099969' },
  { icon: <Mail className="w-5 h-5" />, title: 'E-mail', value: 'b23almas@gmail.com', href: 'mailto:b23almas@gmail.com' },
  { icon: <MapPin className="w-5 h-5" />, title: 'Адрес', value: 'Алматы қ., Асыл-Арман 20', href: 'https://go.2gis.com/DjDsW' },
  { icon: <Clock className="w-5 h-5" />, title: 'Режим работы', value: 'Пн–Пт: 9:00 – 18:00' },
];

export default function Kontakty() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-[#ef7d00] transition-colors">Главная</Link>
        <span className="mx-2">—</span>
        <span className="text-gray-900">Контакты</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">КОНТАКТЫ</h1>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="space-y-4">
          {contacts.map((c) => (
            <div key={c.title} className="flex items-center gap-4 bg-[#f9f9f9] rounded-lg p-5">
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-[#ef7d00] shrink-0">{c.icon}</div>
              <div>
                <div className="text-xs text-gray-400 mb-0.5">{c.title}</div>
                {c.href ? (
                  <a href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined} className="text-sm font-medium text-gray-900 hover:text-[#ef7d00] transition-colors">{c.value}</a>
                ) : (
                  <div className="text-sm font-medium text-gray-900">{c.value}</div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#f9f9f9] rounded-lg p-6 flex flex-col justify-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Напишите нам</h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-4">
            Вы можете отправить нам письмо в произвольной форме на e-mail, и мы обязательно ответим в рабочее время.
          </p>
          <a href="mailto:b23almas@gmail.com" className="inline-flex items-center gap-2 text-sm font-medium text-[#ef7d00] hover:underline">
            <Mail className="w-4 h-4" /> b23almas@gmail.com
          </a>
        </div>
      </div>


    </div>
  );
}
