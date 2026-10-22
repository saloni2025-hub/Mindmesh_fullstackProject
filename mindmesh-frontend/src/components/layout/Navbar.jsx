// import { Link, useLocation } from 'react-router-dom';
// import { Network, Home, Search, MessageSquare, Calendar, User } from 'lucide-react';

// function Navbar() {
//   const location = useLocation();

//   const navItems = [
//     { name: 'Dashboard', path: '/dashboard', icon: Home },
//     { name: 'Discover', path: '/discover', icon: Search },
//     { name: 'Messages', path: '/messages', icon: MessageSquare },
//     { name: 'Schedule', path: '/schedule', icon: Calendar },
//     { name: 'Profile', path: '/profile/me', icon: User },
//   ];

//   return (
//     <nav className="flex justify-between items-center px-8 py-4 bg-black border-b border-zinc-800">
//       <Link to="/dashboard" className="flex items-center gap-2">
//         <Network className="text-orange-500" />
//         <span className="text-orange-500 font-bold text-xl">MindMesh</span>
//       </Link>

//       <div className="flex items-center gap-6">
//         {navItems.map((item) => {
//           const isActive = location.pathname === item.path;
//           return (
//             <Link
//               key={item.path}
//               to={item.path}
//               className={`flex items-center gap-1.5 text-sm font-medium transition ${
//                 isActive ? 'text-orange-500' : 'text-zinc-400 hover:text-white'
//               }`}
//             >
//               <item.icon size={16} />
//               {item.name}
//             </Link>
//           );
//         })}
//       </div>
//     </nav>
//   );
// }

// export default Navbar;

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Network, Home, Search, MessageSquare, Calendar, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/authContext.jsx';
import ThemeToggle from '../common/themeToggle.jsx'

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Discover', path: '/discover', icon: Search },
    { name: 'Messages', path: '/messages', icon: MessageSquare },
    { name: 'Schedule', path: '/schedule', icon: Calendar },
    { name: 'Profile', path: '/profile/me', icon: User },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-black border-b border-zinc-800">
      <Link to="/dashboard" className="flex items-center gap-2">
        <Network className="text-orange-500" />
        <span className="text-orange-500 font-bold text-xl">MindMesh</span>
      </Link>

      <div className="flex items-center gap-6">
        {navItems.map((item) => {
          const base = item.path.split('/').slice(0, 2).join('/');
          const isActive = location.pathname.startsWith(base);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-1.5 text-sm font-medium transition ${
                isActive ? 'text-orange-500' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <item.icon size={16} />
              {item.name}
            </Link>
          );
        })}
        {/* <ThemeToggle /> */}
        {user && (
          <>
          <ThemeToggle />
          <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-red-400 transition">
            <LogOut size={16} />
            Logout
          </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;