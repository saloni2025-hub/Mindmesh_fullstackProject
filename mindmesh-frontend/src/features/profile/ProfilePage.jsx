// import { useParams } from 'react-router-dom';
// import { MessageSquare, Video, Star, MapPin } from 'lucide-react';
// const dummyProfile = {
//   name: 'Sarah Chen',
//   title: 'Frontend Developer & UI Designer',
//   avatar: 'https://i.pravatar.cc/150?img=1',
//   rating: 4.9,
//   reviews: 34,
//   location: 'San Francisco, CA',
//   about:
//     'I love building beautiful web applications. Looking to improve my backend skills and learn conversational French for my upcoming trip.',
//   teaches: ['React', 'CSS/Tailwind', 'Figma'],
//   wantsToLearn: ['Node.js', 'French', 'SQL'],
// };
// function ProfilePage() {
//   const { username } = useParams();
//   const profile = dummyProfile; 
//   return (
//     <div className="max-w-4xl mx-auto px-8 py-8">
//       {/* Header card */}
//       <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden mb-6">
//         {/* Cover gradient */}
//         <div className="h-32 bg-gradient-to-r from-orange-500 via-zinc-700 to-teal-500"></div>

//         <div className="px-6 pb-6">
//           <div className="flex justify-between items-end -mt-12 mb-4">
//             <img
//               src={profile.avatar}
//               alt={profile.name}
//               className="w-24 h-24 rounded-full border-4 border-zinc-900 object-cover"
//             />
//             <div className="flex gap-3">
//               <button className="flex items-center gap-2 border border-zinc-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-800 transition">
//                 <MessageSquare size={16} />
//                 Message
//               </button>
//               <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
//                 <Video size={16} />
//                 Request Session
//               </button>
//             </div>
//           </div>

//           <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
//           <p className="text-zinc-400 mb-2">{profile.title}</p>

//           <div className="flex items-center gap-3 text-sm text-zinc-400 mb-5">
//             <div className="flex items-center gap-1">
//               <Star size={14} className="text-orange-500 fill-orange-500" />
//               <span className="text-white">{profile.rating}</span>
//               <span>({profile.reviews})</span>
//             </div>
//             <span>•</span>
//             <div className="flex items-center gap-1">
//               <MapPin size={14} />
//               <span>{profile.location}</span>
//             </div>
//           </div>

//           <h3 className="text-white font-semibold mb-1">About</h3>
//           <p className="text-zinc-400 leading-relaxed">{profile.about}</p>
//         </div>
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
//           <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
//             <span className="w-1 h-5 bg-orange-500 rounded-full"></span>
//             Skills I can teach
//           </h3>
//           <div className="flex flex-wrap gap-2">
//             {profile.teaches.map((skill) => (
//               <span
//                 key={skill}
//                 className="text-sm bg-orange-500/10 text-orange-400 px-3 py-1.5 rounded-full"
//               >
//                 {skill}
//               </span>
//             ))}
//           </div>
//         </div>

//         <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
//           <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
//             <span className="w-1 h-5 bg-teal-500 rounded-full"></span>
//             Skills I want to learn
//           </h3>
//           <div className="flex flex-wrap gap-2">
//             {profile.wantsToLearn.map((skill) => (
//               <span
//                 key={skill}
//                 className="text-sm bg-teal-500/10 text-teal-400 px-3 py-1.5 rounded-full"
//               >
//                 {skill}
//               </span>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ProfilePage;

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MessageSquare, Video, Pencil } from 'lucide-react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/authContext.jsx'
import TagInput from '../../components/common/TagInput';
import RequestSessionModal from '../schedule/RequestSessionModal';

function ProfilePage() {
  const { username: param } = useParams();
  const { user: me, setUser } = useAuth();
  const username = param === 'me' ? me.username : param;
  const isMe = username === me.username;

  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    setEditing(false);
    setProfile(null);
    if (isMe) {
      setProfile(me);
    } else {
      api.get(`/users/${username}`).then((d) => setProfile(d.user)).catch((e) => setError(e.message));
    }
  }, [username]); // eslint-disable-line

  const startEdit = () => {
    setForm({
      name: profile.name,
      title: profile.title || '',
      bio: profile.bio || '',
      avatar: profile.avatar || '',
      teaches: profile.teaches || [],
      wantsToLearn: profile.wantsToLearn || [],
    });
    setEditing(true);
  };

  const save = async () => {
    setSaving(true);
    setError('');
    try {
      const d = await api.put('/users/me', form);
      setUser(d.user);
      setProfile(d.user);
      setEditing(false);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (error && !profile) return <div className="px-8 py-8 text-red-400">{error}</div>;
  if (!profile) return <div className="px-8 py-8 text-zinc-500">Loading...</div>;

  const input = 'w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500';
  const chip = 'text-xs px-2.5 py-1 rounded-full';

  return (
    <div className="px-8 py-8 max-w-4xl mx-auto">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
        <div className="flex items-start gap-5">
          <div className="relative shrink-0">
            <img src={profile.avatar} alt={profile.name} className="w-24 h-24 rounded-full object-cover" />
            {profile.online && <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-zinc-900" />}
          </div>
          <div className="flex-1">
            {editing ? (
              <div className="space-y-3">
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={input} placeholder="Name" />
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={input} placeholder="Headline" />
                <input value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })} className={input} placeholder="Avatar image URL" />
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
                <p className="text-zinc-400">{profile.title || 'No headline yet'}</p>
                <p className="text-zinc-500 text-sm">@{profile.username}</p>
                <div className="flex items-center gap-1 text-sm mt-2">
                  <Star size={14} className="text-orange-500 fill-orange-500" />
                  {profile.reviews > 0 ? (
                    <>
                      <span className="text-white">{profile.rating}</span>
                      <span className="text-zinc-500">({profile.reviews} reviews)</span>
                    </>
                  ) : (
                    <span className="text-zinc-500">No reviews yet</span>
                  )}
                </div>
              </>
            )}
          </div>
          <div className="flex gap-2">
            {isMe ? (
              editing ? (
                <>
                  <button onClick={() => setEditing(false)} className="border border-zinc-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-zinc-800">Cancel</button>
                  <button onClick={save} disabled={saving} className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white px-4 py-2 rounded-lg text-sm font-medium">
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </>
              ) : (
                <button onClick={startEdit} className="flex items-center gap-2 border border-zinc-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-zinc-800">
                  <Pencil size={14} /> Edit profile
                </button>
              )
            ) : (
              <>
                <Link to={`/messages/${profile.username}`} className="flex items-center gap-2 border border-zinc-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-zinc-800">
                  <MessageSquare size={14} /> Message
                </Link>
                <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                  <Video size={14} /> Request Session
                </button>
              </>
            )}
          </div>
        </div>
        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
        {notice && <p className="text-green-400 text-sm mt-3">{notice}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-white font-bold mb-3">About</h2>
            {editing ? (
              <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={4} maxLength={500} className={input} />
            ) : (
              <p className="text-zinc-400">{profile.bio || 'No bio yet.'}</p>
            )}
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-white font-bold mb-3">Skills to teach</h2>
            {editing ? (
              <TagInput value={form.teaches} onChange={(v) => setForm({ ...form, teaches: v })} placeholder="Add a skill and press Enter" />
            ) : profile.teaches?.length ? (
              <div className="flex flex-wrap gap-2">
                {profile.teaches.map((s) => <span key={s} className={`${chip} bg-orange-500/10 text-orange-400`}>{s}</span>)}
              </div>
            ) : (
              <p className="text-zinc-500 text-sm">Nothing added yet.</p>
            )}
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-white font-bold mb-3">Skills to learn</h2>
            {editing ? (
              <TagInput value={form.wantsToLearn} onChange={(v) => setForm({ ...form, wantsToLearn: v })} placeholder="Add a skill and press Enter" />
            ) : profile.wantsToLearn?.length ? (
              <div className="flex flex-wrap gap-2">
                {profile.wantsToLearn.map((s) => <span key={s} className={`${chip} bg-teal-500/10 text-teal-400`}>{s}</span>)}
              </div>
            ) : (
              <p className="text-zinc-500 text-sm">Nothing added yet.</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-white font-bold mb-3">Availability</h2>
            {profile.availability?.length ? (
              <ul className="space-y-1 text-sm">
                {profile.availability.map((a) => (
                  <li key={a.day} className="flex justify-between text-zinc-400">
                    <span>{a.day}</span><span>{a.from} – {a.to}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-zinc-500 text-sm">Not set.</p>
            )}
            {isMe && <Link to="/schedule" className="block mt-3 text-orange-500 text-sm hover:underline">Edit in Schedule</Link>}
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex justify-between items-center">
            <span className="text-zinc-400 text-sm">Hours taught</span>
            <span className="text-white font-bold text-lg">{Math.round(profile.hoursTaught * 10) / 10}</span>
          </div>
        </div>
      </div>

      {showModal && (
        <RequestSessionModal
          peer={profile}
          onClose={() => setShowModal(false)}
          onCreated={() => setNotice('Session request sent! Track it in Schedule.')}
        />
      )}
    </div>
  );
}

export default ProfilePage;