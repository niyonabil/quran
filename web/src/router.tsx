import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { LoginPage } from './pages/Login';
import { RegisterPage } from './pages/Register';
import { QuranPage } from './pages/Quran';
import { SurahPage } from './pages/Surah';
import { PrayerPage } from './pages/Prayer';
import { ProfilePage } from './pages/Profile';
import { Documentation } from './pages/Documentation';
import { SearchPage } from './pages/Search';
import { MushafsPage } from './pages/Mushafs';
import { AdhanPage } from './pages/Adhan';
import { CalendarPage } from './pages/Calendar';
import { QuranPlayerPage } from './pages/QuranPlayer';
import { QuranTranslationsPage } from './pages/QuranTranslations';
import { AdhanManagementPage } from './pages/AdhanManagement';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            { index: true, element: <Home /> },
            { path: 'quran', element: <QuranPage /> },
            { path: 'quran/:surahId', element: <SurahPage /> },
            { path: 'prayer', element: <PrayerPage /> },
            { path: 'profile', element: <ProfilePage /> },
            { path: 'documentation', element: <Documentation /> },
            { path: 'search', element: <SearchPage /> },
            { path: 'mushafs', element: <MushafsPage /> },
            { path: 'adhan', element: <AdhanPage /> },
            { path: 'calendar', element: <CalendarPage /> },
            { path: 'quran-player', element: <QuranPlayerPage /> },
            { path: 'quran-translations/:surahId', element: <QuranTranslationsPage /> },
            { path: 'adhan-management', element: <AdhanManagementPage /> },
        ],
    },
    { path: '/login', element: <LoginPage /> },
    { path: '/register', element: <RegisterPage /> },
]);
