import { Moon, Sun } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from './themeSlice';

export default function ThemeToggle() {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.theme.mode);
  const isDarkMode = mode === 'dark';

  return (
    <button
      type='button'
      onClick={() => dispatch(toggleTheme())}
      className='fixed top-4 right-4 z-50 p-3 rounded-2xl border-2 dark:border-zinc-700 border-gray-300 dark:bg-zinc-900/90 bg-white/90 dark:text-white text-black shadow-lg backdrop-blur transition hover:scale-105 dark:hover:bg-zinc-800 hover:bg-gray-100'
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDarkMode}
    >
      {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
