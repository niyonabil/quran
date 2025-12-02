import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router } from './router';
import './index.css';

const queryClient = new QueryClient();

import { PrayerTimesProvider } from './contexts/PrayerTimesContext';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PrayerTimesProvider>
        <RouterProvider router={router} />
      </PrayerTimesProvider>
    </QueryClientProvider>
  );
}

export default App;
