import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import ThemeToggle from './ThemeToggle';

export default function ThemeController() {
  const mode = useSelector((state) => state.theme.mode);

  useEffect(() => {
    const root = document.documentElement;
    const isDarkMode = mode === 'dark';

    root.classList.toggle('dark', isDarkMode);
    root.style.colorScheme = isDarkMode ? 'dark' : 'light';
    localStorage.setItem('theme', mode);
  }, [mode]);

  return <ThemeToggle />;
}
