import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Network, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/authContext';
import ThemeToggle from '../common/themeToggle.jsx'

const links = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
];

function LandingHeader() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-black/80 backdrop-blur border-b border-zinc-800">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-8 py-4">
        <Link to="/" className="flex items-center gap-2">
          <Network className="text-orange-500" />
          <span className="text-orange-500 font-bold text-xl">MindMesh</span>
        </Link>

        {/* desktop menu */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-zinc-400 hover:text-white transition">
              {l.label}
            </a>
          ))}
          <Link to="/discover" className="text-sm font-medium text-zinc-400 hover:text-white transition">
            Browse Peers
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          {user ? (
            <Link to="/dashboard" className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-full font-semibold transition">
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-white hover:text-orange-500 transition">Log in</Link>
              <Link to="/signup" className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-full font-semibold transition">
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* mobile: toggle + menu button */}
        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button onClick={() => setOpen(!open)} className="text-zinc-300 hover:text-white p-2" aria-label="Menu">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* mobile menu */}
      {open && (
        <div className="md:hidden border-t border-zinc-800 bg-black px-4 py-4 space-y-4">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block text-zinc-300 hover:text-white">
              {l.label}
            </a>
          ))}
          <Link to="/discover" onClick={() => setOpen(false)} className="block text-zinc-300 hover:text-white">
            Browse Peers
          </Link>
          <div className="flex gap-3 pt-2">
            {user ? (
              <Link to="/dashboard" className="flex-1 text-center bg-orange-500 text-white py-2 rounded-lg font-semibold">Dashboard</Link>
            ) : (
              <>
                <Link to="/login" className="flex-1 text-center border border-zinc-700 text-white py-2 rounded-lg">Log in</Link>
                <Link to="/signup" className="flex-1 text-center bg-orange-500 text-white py-2 rounded-lg font-semibold">Sign up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default LandingHeader;