import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { authCheckFailed, authCheckStarted, authCheckSucceeded } from '../store/userSlice';

const API_BASE = import.meta.env.VITE_BACKEND_URL;

export default function ProtectedRoute() {
  const dispatch = useDispatch();
  const { hasCheckedAuth, isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if (hasCheckedAuth) return;

    dispatch(authCheckStarted());

    fetch(`${API_BASE}/auth/me`, {
      method: "GET",
      credentials: 'include',

    })
      .then((res) => {
        if (!res.ok) throw new Error('Not authenticated');
        return res.json();
      })
      .then((user) => dispatch(authCheckSucceeded(user)))
      .catch(() => dispatch(authCheckFailed()));
  }, [dispatch, hasCheckedAuth]);

  if (!hasCheckedAuth) {
    return (
      <div className='min-h-screen dark:bg-black bg-white flex items-center justify-center'>
        <p className='text-2xl dark:text-zinc-400 text-gray-500'>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to='/auth' replace />;
  }

  return <Outlet />;
}
