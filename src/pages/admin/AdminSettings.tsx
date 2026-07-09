import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface Threshold {
  id: number;
  tier: string;
  threshold: number;
}

export default function AdminSettings() {
  const [thresholds, setThresholds] = useState<Threshold[]>([]);
  const [saving, setSaving] = useState(false);

  const fetchThresholds = async () => {
    const { data } = await supabase.from('price_thresholds').select('*').order('tier');
    if (data) setThresholds(data);
  };

  useEffect(() => { fetchThresholds(); }, []);

  const save = async () => {
    setSaving(true);
    for (const t of thresholds) {
      await supabase.from('price_thresholds').update({ threshold: t.threshold }).eq('id', t.id);
    }
    setSaving(false);
    alert('Сохранено');
  };

  const label = (tier: string) => {
    if (tier === 'opt') return 'Оптовая цена (от суммы)';
    if (tier === 'large_wholesale') return 'Крупнооптовая цена (от суммы)';
    return tier;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Настройки</h1>

      <div className="bg-white rounded shadow p-6 max-w-lg">
        <h2 className="text-lg font-semibold mb-4">Пороги переключения цен в корзине</h2>
        <p className="text-sm text-gray-500 mb-4">
          Когда сумма корзины достигает порога — цены автоматически переключаются на соответствующий уровень.
        </p>
        <div className="space-y-4">
          {thresholds.map((t) => (
            <div key={t.id}>
              <label className="text-xs text-gray-500 mb-1 block">{label(t.tier)}</label>
              <div className="flex items-center gap-2">
                <input
                  type="number" min="0" step="1000"
                  value={t.threshold}
                  onChange={(e) => setThresholds(thresholds.map((x) => x.id === t.id ? { ...x, threshold: parseFloat(e.target.value) || 0 } : x))}
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#ef7d00]"
                />
                <span className="text-sm text-gray-500">₸</span>
              </div>
            </div>
          ))}
        </div>
        <button onClick={save} disabled={saving}
          className="mt-5 bg-[#ef7d00] text-white px-5 py-2 text-sm rounded hover:bg-[#d66f00] disabled:opacity-50">
          {saving ? 'Сохранение...' : 'Сохранить'}
        </button>
      </div>
    </div>
  );
}
