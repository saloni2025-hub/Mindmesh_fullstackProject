import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';

function PeerCard({ peer }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="relative">
          <img
            src={peer.avatar}
            alt={peer.name}
            className="w-14 h-14 rounded-full object-cover"
          />
          {peer.online && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-zinc-900"></span>
          )}
        </div>
        <div>
          <h3 className="text-white font-semibold">{peer.name}</h3>
          <p className="text-zinc-400 text-sm">{peer.title}</p>
          {/* <div className="flex items-center gap-1 text-sm mt-0.5">
            <Star size={14} className="text-orange-500 fill-orange-500" />
            <span className="text-white">{peer.rating}</span>
            <span className="text-zinc-500">({peer.reviews})</span>
          </div> */}
          <div className="flex items-center gap-1 text-sm mt-0.5">
            <Star size={14} className="text-orange-500 fill-orange-500" />
            {peer.reviews > 0 ? (
              <>
                <span className="text-white">{peer.rating}</span>
                <span className="text-zinc-500">({peer.reviews})</span>
              </>
            ) : (
              <span className="text-zinc-500">New</span>
            )}
          </div>
        </div>
      </div>

      <p className="text-xs text-zinc-500 mb-2">TEACHES</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {peer.teaches.map((skill) => (
          <span
            key={skill}
            className="text-xs bg-orange-500/10 text-orange-400 px-2.5 py-1 rounded-full"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="flex gap-3 pt-3 border-t border-zinc-800">
        <Link
          to={`/profile/${peer.username}`}
          className="flex-1 text-center border border-zinc-700 text-white py-2 rounded-lg text-sm font-medium hover:bg-zinc-800 transition"
        >
          Profile
        </Link>
        <Link
          to={`/messages/${peer.username}`}
          className="flex-1 text-center bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg text-sm font-medium transition"
        >
          Message
        </Link>
      </div>
    </div>
  );
}

export default PeerCard;