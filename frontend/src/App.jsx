import { Provider } from 'react-redux';
import { store } from './app/store';
import AppRoutes from './app/AppRoutes';
import { Toaster } from 'react-hot-toast';

export default function App() {
  return (
    <Provider store={store}>
      <AppRoutes />
      <Toaster />
    </Provider>
  );
}