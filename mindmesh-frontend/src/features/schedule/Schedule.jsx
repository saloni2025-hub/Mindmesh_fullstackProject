// import { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { Clock, Video } from 'lucide-react';

// // Dummy data — baad mein backend se aayega
// const allSessions = [
//   {
//     id: 1,
//     title: 'React Advanced Patterns',
//     month: 'OCT',
//     day: '24',
//     start: '10:00',
//     end: '11:00',
//     with: 'Sarah Chen',
//     status: 'upcoming',
//   },
//   {
//     id: 2,
//     title: 'Conversational Spanish',
//     month: 'OCT',
//     day: '12',
//     start: '16:00',
//     end: '17:00',
//     with: 'Elena Rodriguez',
//     status: 'past',
//   },
//   {
//     id: 3,
//     title: 'Intro to Python',
//     month: 'OCT',
//     day: '05',
//     start: '11:00',
//     end: '12:00',
//     with: 'Marcus Johnson',
//     status: 'past',
//   },
// ];

// const initialAvailability = [
//   { day: 'Mon', start: '09:00', end: '17:00' },
//   { day: 'Tue', start: '09:00', end: '17:00' },
//   { day: 'Wed', start: '09:00', end: '17:00' },
//   { day: 'Thu', start: '09:00', end: '17:00' },
//   { day: 'Fri', start: '09:00', end: '17:00' },
// ];

// // "14:30" -> "2:30 PM"
// const formatTime = (time) => {
//   const [hours, minutes] = time.split(':').map(Number);
//   const period = hours >= 12 ? 'PM' : 'AM';
//   const hour12 = hours % 12 || 12;
//   return `${hour12}:${String(minutes).padStart(2, '0')} ${period}`;
// };

// function Schedule() {
//   const [tab, setTab] = useState('upcoming');
//   const [availability, setAvailability] = useState(initialAvailability);
//   const [isEditing, setIsEditing] = useState(false);

//   const sessions = allSessions.filter((s) => s.status === tab);

//   const updateAvailability = (index, field, value) => {
//     setAvailability((prev) =>
//       prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
//     );
//   };

//   const handleSave = () => {
//     setIsEditing(false);
//     console.log('Availability saved:', availability);
//     // Yahan baad mein backend API call aayegi
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-8 py-8">
//       <h1 className="text-3xl font-bold text-white mb-6">Schedule</h1>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Left - Sessions */}
//         <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
//           <div className="flex justify-between items-center mb-5">
//             <h2 className="text-xl font-bold text-white">
//               {tab === 'upcoming' ? 'Upcoming Sessions' : 'Past Sessions'}
//             </h2>

//             <div className="flex gap-2">
//               <button
//                 onClick={() => setTab('past')}
//                 className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
//                   tab === 'past'
//                     ? 'bg-orange-500 text-white'
//                     : 'border border-zinc-700 text-white hover:bg-zinc-800'
//                 }`}
//               >
//                 Past
//               </button>
//               <button
//                 onClick={() => setTab('upcoming')}
//                 className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
//                   tab === 'upcoming'
//                     ? 'bg-orange-500 text-white'
//                     : 'border border-zinc-700 text-white hover:bg-zinc-800'
//                 }`}
//               >
//                 Upcoming
//               </button>
//             </div>
//           </div>

//           <div className="space-y-4">
//             {sessions.map((session) => (
//               <div
//                 key={session.id}
//                 className="flex items-center gap-4 bg-zinc-950/50 border border-zinc-800 rounded-xl p-4"
//               >
//                 {/* Date badge */}
//                 <div className="bg-orange-500/20 text-orange-400 rounded-lg w-14 h-14 flex flex-col items-center justify-center shrink-0">
//                   <span className="text-xs font-bold">{session.month}</span>
//                   <span className="text-xl font-bold leading-none">{session.day}</span>
//                 </div>

//                 {/* Details */}
//                 <div className="flex-1 min-w-0">
//                   <h3 className="text-white font-semibold text-lg">{session.title}</h3>
//                   <div className="flex items-center gap-1.5 text-zinc-400 text-sm mt-0.5">
//                     <Clock size={14} />
//                     {formatTime(session.start)} - {formatTime(session.end)}
//                   </div>
//                   <p className="text-zinc-400 text-sm mt-1">with {session.with}</p>
//                 </div>

//                 {/* Actions */}
//                 {session.status === 'upcoming' ? (
//                   <div className="flex flex-col gap-2 shrink-0">
//                     <Link
//                       to={`/session/${session.id}`}
//                       className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition"
//                     >
//                       <Video size={14} />
//                       Join Call
//                     </Link>
//                     <button className="border border-zinc-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-zinc-800 transition">
//                       Reschedule
//                     </button>
//                   </div>
//                 ) : (
//                   <span className="text-xs bg-zinc-800 text-zinc-400 px-3 py-1 rounded-full shrink-0">
//                     Completed
//                   </span>
//                 )}
//               </div>
//             ))}

//             {/* Empty state */}
//             {sessions.length === 0 && (
//               <div className="border-2 border-dashed border-zinc-800 rounded-xl py-10 text-center text-zinc-500">
//                 No {tab} sessions.
//               </div>
//             )}

//             {tab === 'upcoming' && sessions.length > 0 && (
//               <div className="border-2 border-dashed border-zinc-800 rounded-xl py-10 text-center text-zinc-500">
//                 No other upcoming sessions.
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Right - Availability */}
//         <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 h-fit">
//           <h2 className="text-xl font-bold text-white mb-1">Availability</h2>
//           <p className="text-zinc-400 text-sm mb-6">
//             Set your weekly hours so peers know when they can request sessions with you.
//           </p>

//           <div className="space-y-3 mb-6">
//             {availability.map((row, index) => (
//               <div key={row.day} className="flex items-center gap-3">
//                 <span className="text-zinc-400 text-sm w-10">{row.day}</span>

//                 {isEditing ? (
//                   <div className="flex-1 flex items-center gap-2">
//                     <input
//                       type="time"
//                       value={row.start}
//                       onChange={(e) => updateAvailability(index, 'start', e.target.value)}
//                       className="flex-1 min-w-0 bg-zinc-950 border border-zinc-700 rounded-lg px-2 py-1.5 text-sm text-white focus:outline-none focus:border-orange-500"
//                     />
//                     <span className="text-zinc-500">-</span>
//                     <input
//                       type="time"
//                       value={row.end}
//                       onChange={(e) => updateAvailability(index, 'end', e.target.value)}
//                       className="flex-1 min-w-0 bg-zinc-950 border border-zinc-700 rounded-lg px-2 py-1.5 text-sm text-white focus:outline-none focus:border-orange-500"
//                     />
//                   </div>
//                 ) : (
//                   <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg py-2 text-center text-sm text-white">
//                     {formatTime(row.start)} - {formatTime(row.end)}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>

//           {isEditing ? (
//             <div className="flex gap-3">
//               <button
//                 onClick={() => {
//                   setAvailability(initialAvailability);
//                   setIsEditing(false);
//                 }}
//                 className="flex-1 border border-zinc-700 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-800 transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSave}
//                 className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-lg text-sm font-medium transition"
//               >
//                 Save
//               </button>
//             </div>
//           ) : (
//             <button
//               onClick={() => setIsEditing(true)}
//               className="w-full border border-zinc-700 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-800 transition"
//             >
//               Edit Availability
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Schedule;

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Video, Star } from 'lucide-react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/authContext.jsx';
import { callLink, formatSessionDate } from '../../lib/Format.js';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function Schedule() {
  const { user, setUser } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [tab, setTab] = useState('upcoming');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [avail, setAvail] = useState({});
  const [availMsg, setAvailMsg] = useState('');

  useEffect(() => {
    api.get('/sessions').then((d) => setSessions(d.sessions)).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const map = {};
    DAYS.forEach((d) => {
      const found = user.availability?.find((a) => a.day === d);
      map[d] = { on: !!found, from: found?.from || '09:00', to: found?.to || '17:00' };
    });
    setAvail(map);
  }, [user.availability]);

  const replace = (session) => setSessions((prev) => prev.map((s) => (s.id === session.id ? session : s)));

  const setStatus = async (id, status) => {
    setError('');
    try {
      const d = await api.patch(`/sessions/${id}`, { status });
      replace(d.session);
      if (status === 'completed' || status === 'accepted') {
        const me = await api.get('/auth/me');
        setUser(me.user);
      }
    } catch (e) {
      setError(e.message);
    }
  };

  const rate = async (id, rating) => {
    try {
      const d = await api.post(`/sessions/${id}/rate`, { rating });
      replace(d.session);
    } catch (e) {
      setError(e.message);
    }
  };

  const saveAvail = async () => {
    const availability = DAYS.filter((d) => avail[d].on).map((d) => ({ day: d, from: avail[d].from, to: avail[d].to }));
    try {
      const d = await api.put('/users/me', { availability });
      setUser(d.user);
      setAvailMsg('Saved!');
      setTimeout(() => setAvailMsg(''), 2000);
    } catch (e) {
      setAvailMsg(e.message);
    }
  };

  const now = Date.now();
  const isActive = (s) => new Date(s.date).getTime() + s.durationMins * 60000 > now;
  const groups = {
    upcoming: sessions.filter((s) => s.status === 'accepted' && isActive(s)),
    pending: sessions.filter((s) => s.status === 'pending' && isActive(s)),
    past: sessions.filter((s) => !(['accepted', 'pending'].includes(s.status) && isActive(s))).reverse(),
  };
  const list = groups[tab];

  const statusStyle = {
    pending: 'bg-yellow-500/10 text-yellow-400',
    accepted: 'bg-green-500/10 text-green-400',
    declined: 'bg-red-500/10 text-red-400',
    cancelled: 'bg-zinc-700/40 text-zinc-400',
    completed: 'bg-blue-500/10 text-blue-400',
  };

  const btn = 'px-3 py-1.5 rounded-lg text-sm font-medium transition';

  return (
    <div className="px-8 py-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">Schedule</h1>
      {error && <p className="text-red-400 mb-4">{error}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex gap-2 mb-4">
            {['upcoming', 'pending', 'past'].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`${btn} capitalize ${tab === t ? 'bg-orange-500 text-white' : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'}`}
              >
                {t} ({groups[t].length})
              </button>
            ))}
          </div>

          {loading ? (
            <p className="text-zinc-500">Loading...</p>
          ) : list.length === 0 ? (
            <p className="text-zinc-500">Nothing here yet. Book a session from <Link to="/discover" className="text-orange-500 hover:underline">Discover</Link>.</p>
          ) : (
            <div className="space-y-4">
              {list.map((s) => {
                const started = new Date(s.date).getTime() <= now;
                return (
                  <div key={s.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full font-medium uppercase mr-2">
                          {s.role}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full capitalize ${statusStyle[s.status]}`}>{s.status}</span>
                      </div>
                      <span className="text-xs text-zinc-500">{s.durationMins} min</span>
                    </div>
                    <h3 className="text-white font-semibold text-lg">{s.skill}</h3>
                    <Link to={`/profile/${s.peer.username}`} className="flex items-center gap-2 mt-1 w-fit">
                      <img src={s.peer.avatar} alt="" className="w-5 h-5 rounded-full" />
                      <span className="text-zinc-400 text-sm hover:text-white">with {s.peer.name}</span>
                    </Link>
                    <p className="text-zinc-500 text-sm mt-1">{formatSessionDate(s.date)}</p>
                    {s.note && <p className="text-zinc-400 text-sm mt-2 italic">"{s.note}"</p>}

                    <div className="flex flex-wrap items-center gap-2 mt-4">
                      {s.status === 'pending' && !s.iAmRequester && (
                        <>
                          <button onClick={() => setStatus(s.id, 'accepted')} className={`${btn} bg-orange-500 hover:bg-orange-600 text-white`}>Accept</button>
                          <button onClick={() => setStatus(s.id, 'declined')} className={`${btn} border border-zinc-700 text-white hover:bg-zinc-800`}>Decline</button>
                        </>
                      )}
                      {s.status === 'pending' && s.iAmRequester && <span className="text-zinc-500 text-sm">Waiting for response...</span>}
                      {s.status === 'accepted' && (
                        <a href={callLink(s.id)} target="_blank" rel="noreferrer" className={`${btn} bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2`}>
                          <Video size={14} /> Join Call
                        </a>
                      )}
                      {s.status === 'accepted' && started && (
                        <button onClick={() => setStatus(s.id, 'completed')} className={`${btn} border border-zinc-700 text-white hover:bg-zinc-800`}>Mark completed</button>
                      )}
                      {['pending', 'accepted'].includes(s.status) && (
                        <button onClick={() => setStatus(s.id, 'cancelled')} className={`${btn} text-red-400 hover:bg-red-500/10`}>Cancel</button>
                      )}
                      {s.status === 'completed' && s.role === 'learning' && (
                        s.rating ? (
                          <span className="text-sm text-zinc-400 flex items-center gap-1">
                            You rated <Star size={14} className="text-orange-500 fill-orange-500" /> {s.rating}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-sm text-zinc-400">
                            Rate:
                            {[1, 2, 3, 4, 5].map((n) => (
                              <button key={n} onClick={() => rate(s.id, n)} className="hover:scale-110 transition">
                                <Star size={18} className="text-orange-500" />
                              </button>
                            ))}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 h-fit">
          <h3 className="text-white font-bold mb-4">Weekly Availability</h3>
          <div className="space-y-2">
            {DAYS.map((d) => (
              <div key={d} className="flex items-center gap-2">
                <label className="flex items-center gap-2 w-16 text-sm text-zinc-300">
                  <input
                    type="checkbox"
                    checked={avail[d]?.on || false}
                    onChange={(e) => setAvail({ ...avail, [d]: { ...avail[d], on: e.target.checked } })}
                    className="accent-orange-500"
                  />
                  {d}
                </label>
                <input type="time" disabled={!avail[d]?.on} value={avail[d]?.from || '09:00'}
                  onChange={(e) => setAvail({ ...avail, [d]: { ...avail[d], from: e.target.value } })}
                  className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm text-white disabled:opacity-40" />
                <span className="text-zinc-500">–</span>
                <input type="time" disabled={!avail[d]?.on} value={avail[d]?.to || '17:00'}
                  onChange={(e) => setAvail({ ...avail, [d]: { ...avail[d], to: e.target.value } })}
                  className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm text-white disabled:opacity-40" />
              </div>
            ))}
          </div>
          <button onClick={saveAvail} className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg text-sm font-medium transition">
            Save availability
          </button>
          {availMsg && <p className="text-sm text-zinc-400 mt-2 text-center">{availMsg}</p>}
        </div>
      </div>
    </div>
  );
}

export default Schedule;