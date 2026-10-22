import { Link } from 'react-router-dom';
import { Network, Mail } from 'lucide-react';
import { useAuth } from '../../context/authContext';

function Footer() {
  const { user } = useAuth();

  const linkCls = 'text-zinc-400 hover:text-orange-500 transition text-sm';

  return (
    <footer className="bg-black border-t border-zinc-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <Network className="text-orange-500" />
              <span className="text-orange-500 font-bold text-xl">MindMesh</span>
            </Link>
            <p className="text-zinc-400 text-sm max-w-sm leading-relaxed">
              A peer-to-peer knowledge sharing platform. Learn something new by teaching what you already know.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-2">
              <li><Link to="/discover" className={linkCls}>Discover Peers</Link></li>
              <li><Link to="/schedule" className={linkCls}>Schedule</Link></li>
              <li><Link to="/messages" className={linkCls}>Messages</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Account</h4>
            <ul className="space-y-2">
              {user ? (
                <>
                  <li><Link to="/dashboard" className={linkCls}>Dashboard</Link></li>
                  <li><Link to="/profile/me" className={linkCls}>My Profile</Link></li>
                </>
              ) : (
                <>
                  <li><Link to="/login" className={linkCls}>Log in</Link></li>
                  <li><Link to="/signup" className={linkCls}>Sign up</Link></li>
                </>
              )}
              <li>
                <a href="mailto:hello@mindmesh.app" className={`${linkCls} flex items-center gap-2`}>
                  <Mail size={14} /> Contact us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-zinc-500 text-sm">© {new Date().getFullYear()} MindMesh. All rights reserved.</p>
          <p className="text-zinc-500 text-sm">Learn from anyone, teach everyone.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;