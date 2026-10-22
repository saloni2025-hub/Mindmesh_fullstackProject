import { useState } from 'react';
import { X } from 'lucide-react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/authContext.jsx'

function RequestSessionModal({ peer, onClose, onCreated }) {
  const { user } = useAuth();
  const [iTeach, setITeach] = useState(false);
  const [skill, setSkill] = useState('');
  const [date, setDate] = useState('');
  const [durationMins, setDurationMins] = useState(60);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const suggestions = iTeach ? user.teaches : peer.teaches || [];

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await api.post('/sessions', {
        peerUsername: peer.username,
        skill,
        date: new Date(date).toISOString(),
        durationMins,
        note,
        iTeach,
      });
      onCreated?.();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const input = 'w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500';
  const label = 'text-sm text-zinc-400 mb-1 block';

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <form onSubmit={submit} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-md space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-white font-bold text-lg">Request session with {peer.name}</h2>
          <button type="button" onClick={onClose} className="text-zinc-400 hover:text-white"><X size={18} /></button>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-2">{error}</div>}

        <div className="flex gap-2">
          {[['I want to learn', false], ['I will teach', true]].map(([text, val]) => (
            <button
              type="button"
              key={text}
              onClick={() => setITeach(val)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium border transition ${
                iTeach === val ? 'bg-orange-500 border-orange-500 text-white' : 'border-zinc-700 text-zinc-300 hover:bg-zinc-800'
              }`}
            >
              {text}
            </button>
          ))}
        </div>

        <div>
          <label className={label}>Skill / topic</label>
          <input list="skill-options" value={skill} onChange={(e) => setSkill(e.target.value)} required className={input} placeholder="e.g. React Hooks" />
          <datalist id="skill-options">
            {suggestions.map((s) => <option key={s} value={s} />)}
          </datalist>
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className={label}>Date & time</label>
            <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} required className={input} />
          </div>
          <div className="w-28">
            <label className={label}>Duration</label>
            <select value={durationMins} onChange={(e) => setDurationMins(Number(e.target.value))} className={input}>
              {[30, 45, 60, 90, 120].map((m) => <option key={m} value={m}>{m} min</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className={label}>Note (optional)</label>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} maxLength={500} className={input} />
        </div>

        <button disabled={saving} className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-medium py-2 rounded-lg transition">
          {saving ? 'Sending...' : 'Send request'}
        </button>
      </form>
    </div>
  );
}

export default RequestSessionModal;