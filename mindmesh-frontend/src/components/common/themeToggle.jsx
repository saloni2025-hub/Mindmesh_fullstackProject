import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/themeContext.jsx'

function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label="Toggle theme"
      className={`p-2 rounded-lg text-zinc-400 hover:text-orange-500 hover:bg-zinc-800 transition ${className}`}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

export default ThemeToggle;