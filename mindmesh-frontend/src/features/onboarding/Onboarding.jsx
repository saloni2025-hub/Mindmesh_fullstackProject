import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Network } from 'lucide-react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/authContext.jsx';
import TagInput from '../../components/common/TagInput';

function Onboarding() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState(user.title || '');
  const [bio, setBio] = useState(user.bio || '');
  const [teaches, setTeaches] = useState(user.teaches || []);
  const [wantsToLearn, setWantsToLearn] = useState(user.wantsToLearn || []);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const save = async (skip = false) => {
    setSaving(true);
    setError('');
    try {
      const body = skip ? { onboarded: true } : { title, bio, teaches, wantsToLearn, onboarded: true };
      const d = await api.put('/users/me', body);
      setUser(d.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const label = 'text-sm text-zinc-400 mb-1 block';

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Network className="text-orange-500" />
          <span className="text-orange-500 font-bold text-xl">MindMesh</span>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 space-y-5">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Set up your profile</h1>
            <p className="text-zinc-400">Tell peers what you can teach and what you want to learn.</p>
          </div>
          {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-2">{error}</div>}
          <div>
            <label className={label}>Headline</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Frontend Developer & Guitarist"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500" />
          </div>
          <div>
            <label className={label}>About you</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} maxLength={500}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500" />
          </div>
          <div>
            <label className={label}>Skills I can teach (press Enter to add)</label>
            <TagInput value={teaches} onChange={setTeaches} placeholder="React, Spanish, Guitar..." />
          </div>
          <div>
            <label className={label}>Skills I want to learn</label>
            <TagInput value={wantsToLearn} onChange={setWantsToLearn} placeholder="Python, Cooking..." />
          </div>
          <button onClick={() => save(false)} disabled={saving}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-medium py-2 rounded-lg transition">
            {saving ? 'Saving...' : 'Finish'}
          </button>
          <button onClick={() => save(true)} className="w-full text-zinc-500 text-sm hover:text-white">Skip for now</button>
        </div>
      </div>
    </div>
  );
}

export default Onboarding;