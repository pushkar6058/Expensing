import { Sun } from 'lucide-react';

export default function ThemeToggle() {
  return (
    <button
      className='p-3 rounded-2xl border-2 dark:border-zinc-600 border-gray-400 dark:text-white text-black'
      title='Dark mode'
    >
      <Sun size={20} />
    </button>
  );
}