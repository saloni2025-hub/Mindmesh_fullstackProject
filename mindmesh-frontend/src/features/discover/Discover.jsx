// import { useState } from 'react';
// import { Search, SlidersHorizontal } from 'lucide-react';
// import PeerCard from '../../components/cards/Peercard'

// const popularTags = ['React', 'Spanish', 'Python', 'Guitar', 'Cooking'];

// const dummyPeers = [
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

// function Discover() {
//   const [search, setSearch] = useState('');

//   return (
//     <div className="px-8 py-8 max-w-7xl mx-auto">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold text-white">Discover Peers</h1>

//         <div className="flex items-center gap-3">
//           <div className="relative">
//             <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
//             <input
//               type="text"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="Search skills, names..."
//               className="bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 w-64"
//             />
//           </div>
//           <button className="border border-zinc-800 p-2.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition">
//             <SlidersHorizontal size={16} />
//           </button>
//         </div>
//       </div>
//       <div className="flex items-center gap-2 mb-8">
//         <span className="text-zinc-500 text-sm">Popular:</span>
//         {popularTags.map((tag) => (
//           <button
//             key={tag}
//             className="text-sm bg-zinc-900 border border-zinc-800 text-zinc-300 px-3 py-1.5 rounded-full hover:border-orange-500 hover:text-orange-500 transition"
//           >
//             {tag}
//           </button>
//         ))}
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {dummyPeers.map((peer) => (
//           <PeerCard key={peer.username} peer={peer} />
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Discover;

import { useEffect, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import PeerCard from '../../components/cards/Peercard';
import { api } from '../../lib/api';

const popularTags = ['React', 'Spanish', 'Python', 'Guitar', 'Cooking'];

function Discover() {
  const [search, setSearch] = useState('');
  const [skill, setSkill] = useState('');
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [peers, setPeers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      api
        .get(`/users?q=${encodeURIComponent(search)}&skill=${encodeURIComponent(skill)}`)
        .then((d) => { setPeers(d.users); setError(''); })
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(t);
  }, [search, skill]);

  const shown = onlineOnly ? peers.filter((p) => p.online) : peers;

  return (
    <div className="px-8 py-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Discover Peers</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search skills, names..."
              className="bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 w-64"
            />
          </div>
          <button
            onClick={() => setOnlineOnly((v) => !v)}
            title="Online only"
            className={`border p-2.5 rounded-lg transition ${
              onlineOnly ? 'border-orange-500 text-orange-500' : 'border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <SlidersHorizontal size={16} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-8 flex-wrap">
        <span className="text-zinc-500 text-sm">Popular:</span>
        {popularTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSkill(skill === tag ? '' : tag)}
            className={`text-sm border px-3 py-1.5 rounded-full transition ${
              skill === tag
                ? 'border-orange-500 text-orange-500 bg-orange-500/10'
                : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-orange-500 hover:text-orange-500'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {error && <p className="text-red-400 mb-4">{error}</p>}
      {loading ? (
        <p className="text-zinc-500">Loading...</p>
      ) : shown.length === 0 ? (
        <p className="text-zinc-500">No peers found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shown.map((peer) => (
            <PeerCard key={peer.username} peer={peer} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Discover;