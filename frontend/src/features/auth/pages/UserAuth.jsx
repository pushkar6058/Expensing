import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authFailed, authStarted, authSucceeded, clearError } from '../store/userSlice';
import toast from 'react-hot-toast';
import { Navigate, useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:3000/api';

async function fetchJSON(url, options = {}) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || error.error || response.statusText);
  }

  return response.json();
}

export default function UserAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, error } = useSelector((state) => state.user);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    dispatch(clearError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin && !formData.name.trim()) {
      toast.error('Name is required');
      return;
    }

    if (!formData.email || !formData.password) {
      toast.error('All fields are required');
      return;
    }

    dispatch(authStarted());

    try {
      const endpoint = isLogin ? 'login' : 'register';
      const body = isLogin
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, email: formData.email, password: formData.password };

      const data = await fetchJSON(`${API_BASE}/auth/${endpoint}`, {
        method: 'POST',
        body: JSON.stringify(body),
      });

      dispatch(authSucceeded(data.user));
      toast.success(isLogin ? 'Welcome back!' : 'Account created successfully!');
      navigate('/');
    } catch (err) {
      dispatch(authFailed(err.message));
    }
  };

  if (isAuthenticated) {
    return <Navigate to='/' replace />;
  }

  return (
    <div className='min-h-screen bg-black flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        <div className='text-center mb-10'>
          <h1 className='text-5xl font-bold text-emerald-400'>Expense Tracker</h1>
          <p className='text-zinc-400 mt-3 text-lg'>Track your trips and expenses effortlessly</p>
        </div>

        <div className='bg-zinc-900 border border-zinc-700 rounded-3xl p-8'>
          <div className='flex bg-zinc-800 rounded-2xl p-1 mb-8'>
            <button
              type='button'
              onClick={() => {
                setIsLogin(true);
                dispatch(clearError());
              }}
              className={`flex-1 py-3 rounded-xl text-lg font-semibold transition-all ${
                isLogin ? 'bg-emerald-500 text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type='button'
              onClick={() => {
                setIsLogin(false);
                dispatch(clearError());
              }}
              className={`flex-1 py-3 rounded-xl text-lg font-semibold transition-all ${
                !isLogin ? 'bg-emerald-500 text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className='space-y-5'>
            {!isLogin && (
              <div>
                <label className='block text-zinc-400 mb-2 text-sm'>Name</label>
                <input
                  type='text'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  placeholder='John Doe'
                  className='w-full p-4 rounded-2xl bg-zinc-800 border border-zinc-700 focus:border-emerald-500 focus:outline-none text-white placeholder-zinc-500 transition-colors'
                />
              </div>
            )}

            <div>
              <label className='block text-zinc-400 mb-2 text-sm'>Email</label>
              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                placeholder='you@example.com'
                className='w-full p-4 rounded-2xl bg-zinc-800 border border-zinc-700 focus:border-emerald-500 focus:outline-none text-white placeholder-zinc-500 transition-colors'
              />
            </div>

            <div>
              <label className='block text-zinc-400 mb-2 text-sm'>Password</label>
              <input
                type='password'
                name='password'
                value={formData.password}
                onChange={handleChange}
                placeholder='••••••••'
                className='w-full p-4 rounded-2xl bg-zinc-800 border border-zinc-700 focus:border-emerald-500 focus:outline-none text-white placeholder-zinc-500 transition-colors'
              />
            </div>

            {error && (
              <div className='bg-red-500/20 border border-red-500/50 rounded-xl p-3'>
                <p className='text-red-400 text-sm'>{error}</p>
              </div>
            )}

            <button
              type='submit'
              disabled={isLoading}
              className='w-full p-4 rounded-2xl bg-emerald-500 text-black font-bold text-lg hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
            >
              {isLoading ? (
                <span className='flex items-center justify-center gap-2'>
                  <svg className='animate-spin h-5 w-5' viewBox='0 0 24 24'>
                    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' fill='none' />
                    <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z' />
                  </svg>
                  Processing...
                </span>
              ) : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p className='text-zinc-500 text-center mt-6 text-sm'>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              type='button'
              onClick={() => {
                setIsLogin(!isLogin);
                dispatch(clearError());
              }}
              className='text-emerald-400 hover:underline'
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
