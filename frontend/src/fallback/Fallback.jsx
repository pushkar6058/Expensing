import { useEffect, useState } from 'react';
import logo from '../assets/logo.png';

export function Fallback() {
  const [text, setText] = useState('');
  const fullText = 'expensing';

  useEffect(() => {
    let i = 0;
    let timeout;

    const type = () => {
      if (i <= fullText.length) {
        setText(fullText.slice(0, i));
        i++;
        timeout = setTimeout(type, 120);
      } else {
        // pause when full word is typed
        timeout = setTimeout(() => {
          i = 0;
          setText("");
          type();
        }, 1200);
      }
    };

    type();
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-white px-4 dark:bg-black'>
      {/* <img src={logo} alt='Expensing logo' className='mb-5 h-24 w-24 animate-float object-contain' /> */}

      <h1 className='mb-2 flex items-center gap-1 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 bg-[length:200%_auto] bg-clip-text text-4xl font-semibold text-transparent animate-gradient-flow'>
        {text}
        <span className='h-6 w-[2px] animate-blink bg-blue-500' />
      </h1>

      <p className='animate-fade-up text-center text-xs tracking-[0.35em] text-gray-500 uppercase dark:text-zinc-400'>
        TRACK. MANAGE. SAVE.
      </p>
    </div>
  );
}
