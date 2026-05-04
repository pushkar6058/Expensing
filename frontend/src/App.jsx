import { Provider } from 'react-redux';
import { store } from './app/store';
import AppRoutes from './app/AppRoutes';
import { Toaster } from 'react-hot-toast';
import ThemeController from './features/theme/ThemeController';

export default function App() {
  return (
    <Provider store={store}>
      <ThemeController />
      <AppRoutes />
      <Toaster />
    </Provider>
  );
}
