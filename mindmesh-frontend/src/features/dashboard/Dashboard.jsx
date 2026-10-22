// import { Video } from 'lucide-react';
// import { Link } from 'react-router-dom';
// import PeerCard from '../../components/cards/Peercard'


// const recommendedPeers = [
//   {
//     username: 'sarahchen',
//     name: 'Sarah Chen',
//     title: 'Frontend Developer & UI Designer',
//     rating: 4.9,
//     reviews: 34,
//     online: true,
//     avatar: 'https://i.pravatar.cc/150?img=1',
//     teaches: ['React', 'CSS/Tailwind', 'Figma'],
//   },
//   {
//     username: 'marcusj',
//     name: 'Marcus Johnson',
//     title: 'Data Scientist & Music Enthusiast',
//     rating: 4.7,
//     reviews: 18,
//     online: false,
//     avatar: 'https://i.pravatar.cc/150?img=3',
//     teaches: ['Python', 'Machine Learning', 'Data Analysis'],
//   },
//   {
//     username: 'elenarodriguez',
//     name: 'Elena Rodriguez',
//     title: 'Native Spanish Speaker & Chef',
//     rating: 5.0,
//     reviews: 56,
//     online: true,
//     avatar: 'https://i.pravatar.cc/150?img=5',
//     teaches: ['Spanish', 'Cooking', 'Baking'],
//   },
//   {
//     username: 'davidkim',
//     name: 'David Kim',
//     title: 'Product Manager & Startup Advisor',
//     rating: 4.8,
//     reviews: 42,
//     online: true,
//     avatar: 'https://i.pravatar.cc/150?img=8',
//     teaches: ['Product Strategy', 'Pitching'],
//   },
// ];

// function Dashboard() {
//   const userName = 'Alex';

//   return (
//     <div className="px-8 py-8 max-w-7xl mx-auto">
//       <h1 className="text-3xl font-bold text-white mb-1">Welcome back, {userName}!</h1>
//       <p className="text-zinc-400 mb-8">You have 1 upcoming session today.</p>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         <div className="lg:col-span-2">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-lg font-bold text-white">Recommended Peers</h2>
//             <Link to="/discover" className="text-orange-500 text-sm font-medium hover:underline">
//               View all
//             </Link>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {recommendedPeers.map((peer) => (
//               <PeerCard key={peer.username} peer={peer} />
//             ))}
//           </div>
//         </div>

//         <div className="space-y-6">

//           <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
//             <h3 className="text-white font-bold mb-4">Upcoming Session</h3>

//             <div className="bg-zinc-800/50 rounded-lg p-4">
//               <div className="flex justify-between items-center mb-3">
//                 <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full font-medium">
//                   LEARNING
//                 </span>
//                 <span className="text-xs text-zinc-500">in 45m</span>
//               </div>

//               <h4 className="text-white font-semibold mb-1">React Advanced Patterns</h4>
//               <div className="flex items-center gap-2 mb-4">
//                 <img
//                   src="https://i.pravatar.cc/150?img=1"
//                   alt="Sarah Chen"
//                   className="w-5 h-5 rounded-full"
//                 />
//                 <span className="text-zinc-400 text-sm">with Sarah Chen</span>
//               </div>

//               <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition">
//                 <Video size={16} />
//                 Join Call
//               </button>
//             </div>
//           </div>

//           <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
//             <h3 className="text-white font-bold mb-4">Quick Stats</h3>

//             <div className="flex justify-between items-center">
//               <span className="text-zinc-400 text-sm">Hours Taught</span>
//               <span className="text-white font-bold text-lg">12.5</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;

import { useEffect, useState } from 'react';
import { Video } from 'lucide-react';
import { Link } from 'react-router-dom';
import PeerCard from '../../components/cards/Peercard';
import { api } from '../../lib/api.js';
import { useAuth } from '../../context/authContext.jsx';
import { callLink, timeUntil } from '../../lib/Format.js';

function Dashboard() {
  const { user } = useAuth();
  const [peers, setPeers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/users/recommended'), api.get('/sessions')])
      .then(([p, s]) => {
        setPeers(p.users);
        setSessions(s.sessions);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const now = Date.now();
  const upcoming = sessions.filter(
    (s) => s.status === 'accepted' && new Date(s.date).getTime() + s.durationMins * 60000 > now
  );
  const next = upcoming[0];
  const todayCount = upcoming.filter((s) => new Date(s.date).toDateString() === new Date().toDateString()).length;
  const pending = sessions.filter((s) => s.status === 'pending').length;
  const completed = sessions.filter((s) => s.status === 'completed');
  const hoursLearned = completed
    .filter((s) => s.role === 'learning')
    .reduce((sum, s) => sum + s.durationMins / 60, 0);

  return (
    <div className="px-8 py-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-1">Welcome back, {user.name.split(' ')[0]}!</h1>
      <p className="text-zinc-400 mb-8">
        You have {todayCount} upcoming session{todayCount === 1 ? '' : 's'} today.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-white">Recommended Peers</h2>
            <Link to="/discover" className="text-orange-500 text-sm font-medium hover:underline">View all</Link>
          </div>

          {loading ? (
            <p className="text-zinc-500">Loading...</p>
          ) : peers.length === 0 ? (
            <p className="text-zinc-500">No other members yet. Invite a friend to sign up!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {peers.map((peer) => (
                <PeerCard key={peer.username} peer={peer} />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <h3 className="text-white font-bold mb-4">Upcoming Session</h3>
            {next ? (
              <div className="bg-zinc-800/50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full font-medium uppercase">
                    {next.role === 'teaching' ? 'Teaching' : 'Learning'}
                  </span>
                  <span className="text-xs text-zinc-500">{timeUntil(next.date)}</span>
                </div>
                <h4 className="text-white font-semibold mb-1">{next.skill}</h4>
                <div className="flex items-center gap-2 mb-4">
                  <img src={next.peer.avatar} alt={next.peer.name} className="w-5 h-5 rounded-full" />
                  <span className="text-zinc-400 text-sm">with {next.peer.name}</span>
                </div>
                <a
                  href={callLink(next.id)}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition"
                >
                  <Video size={16} />
                  Join Call
                </a>
              </div>
            ) : (
              <p className="text-zinc-500 text-sm">
                No upcoming sessions. <Link to="/discover" className="text-orange-500 hover:underline">Find a peer</Link> to book one.
              </p>
            )}
            {pending > 0 && (
              <Link to="/schedule" className="block mt-3 text-sm text-orange-500 hover:underline">
                {pending} pending request{pending === 1 ? '' : 's'}
              </Link>
            )}
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
            <h3 className="text-white font-bold mb-1">Quick Stats</h3>
            {[
              ['Hours Taught', Math.round(user.hoursTaught * 10) / 10],
              ['Hours Learned', Math.round(hoursLearned * 10) / 10],
              ['Sessions Completed', completed.length],
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between items-center">
                <span className="text-zinc-400 text-sm">{label}</span>
                <span className="text-white font-bold text-lg">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;