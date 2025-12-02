import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { prayerApi } from '@/lib/api';
import { adhanAudioService } from '@/lib/supabase';
import { toZonedTime } from 'date-fns-tz';

interface PrayerTimesContextType {
    prayerTimes: any;
    nextPrayer: string | null;
    timeToNextPrayer: string;
    city: string;
    country: string;
    method: number;
    timezone: string;
    loading: boolean;
    notificationsEnabled: boolean;
    audioEnabled: boolean;
    setCity: (city: string) => void;
    setCountry: (country: string) => void;
    setMethod: (method: number) => void;
    setTimezone: (timezone: string) => void;
    toggleNotifications: () => void;
    toggleAudio: () => void;
    refreshTimes: () => void;
}

const PrayerTimesContext = createContext<PrayerTimesContextType | undefined>(undefined);

export function PrayerTimesProvider({ children }: { children: React.ReactNode }) {
    const [prayerTimes, setPrayerTimes] = useState<any>(null);
    const [nextPrayer, setNextPrayer] = useState<string | null>(null);
    const [timeToNextPrayer, setTimeToNextPrayer] = useState<string>('');
    const [city, setCity] = useState(localStorage.getItem('prayer_city') || 'Paris');
    const [country, setCountry] = useState(localStorage.getItem('prayer_country') || 'FR');
    const [method, setMethod] = useState(Number(localStorage.getItem('prayer_method')) || 2);
    const [timezone, setTimezone] = useState(localStorage.getItem('prayer_timezone') || Intl.DateTimeFormat().resolvedOptions().timeZone);
    const [loading, setLoading] = useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = useState(localStorage.getItem('notifications_enabled') !== 'false');
    const [audioEnabled, setAudioEnabled] = useState(localStorage.getItem('audio_enabled') !== 'false');

    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Save settings
    useEffect(() => {
        localStorage.setItem('prayer_city', city);
        localStorage.setItem('prayer_country', country);
        localStorage.setItem('prayer_method', String(method));
        localStorage.setItem('prayer_timezone', timezone);
        localStorage.setItem('notifications_enabled', String(notificationsEnabled));
        localStorage.setItem('audio_enabled', String(audioEnabled));
    }, [city, country, method, timezone, notificationsEnabled, audioEnabled]);

    // Request notification permission
    useEffect(() => {
        if (notificationsEnabled && 'Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, [notificationsEnabled]);

    const fetchPrayerTimes = async () => {
        setLoading(true);
        try {
            const { data } = await prayerApi.getByCity(city, country, method);
            setPrayerTimes(data.data);
            calculateNextPrayer(data.data);
        } catch (error) {
            console.error('Failed to fetch prayer times', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrayerTimes();
    }, [city, country, method]);

    // Timer logic
    useEffect(() => {
        const timer = setInterval(() => {
            if (prayerTimes) {
                calculateNextPrayer(prayerTimes);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [prayerTimes, timezone]);

    const calculateNextPrayer = (data: any) => {
        if (!data?.timings) return;

        const now = new Date();
        // Get current time in selected timezone
        const zonedNow = toZonedTime(now, timezone);

        const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
        let next = null;
        let minDiff = Infinity;

        for (const prayer of prayers) {
            const timeStr = data.timings[prayer].split(' ')[0];
            const [hours, minutes] = timeStr.split(':').map(Number);

            // Create date object for prayer time in selected timezone
            const prayerDate = new Date(zonedNow);
            prayerDate.setHours(hours, minutes, 0, 0);

            // Compare timestamps
            let diff = prayerDate.getTime() - zonedNow.getTime();

            if (diff < 0) {
                continue;
            }

            if (diff < minDiff) {
                minDiff = diff;
                next = prayer;
            }
        }

        // Handle case where all prayers passed (Next is Fajr tomorrow)
        if (!next) {
            next = 'Fajr';
            const timeStr = data.timings['Fajr'].split(' ')[0];
            const [hours, minutes] = timeStr.split(':').map(Number);

            const prayerDate = new Date(zonedNow);
            prayerDate.setDate(prayerDate.getDate() + 1);
            prayerDate.setHours(hours, minutes, 0, 0);

            minDiff = prayerDate.getTime() - zonedNow.getTime();
        }

        setNextPrayer(next);

        // Format countdown
        const hours = Math.floor(minDiff / (1000 * 60 * 60));
        const minutes = Math.floor((minDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((minDiff % (1000 * 60)) / 1000);
        setTimeToNextPrayer(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);

        // Trigger notification if time is 0 (or close to it)
        if (hours === 0 && minutes === 0 && seconds === 0) {
            triggerAdhan(next);
        }
    };

    const triggerAdhan = async (prayerName: string) => {
        // Notification
        if (notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
            new Notification(`C'est l'heure de ${prayerName}`, {
                body: `Il est temps pour la prière de ${prayerName}`,
                icon: '/icon.png'
            });
        }

        // Audio
        if (audioEnabled) {
            try {
                const defaultAdhan = await adhanAudioService.getAll();
                const adhan = defaultAdhan.find(a => a.is_default) || defaultAdhan[0];

                if (adhan && adhan.file_url) {
                    if (audioRef.current) {
                        audioRef.current.pause();
                    }
                    audioRef.current = new Audio(adhan.file_url);
                    audioRef.current.play().catch(e => console.error("Audio play failed", e));
                }
            } catch (error) {
                console.error("Failed to play adhan", error);
            }
        }
    };

    return (
        <PrayerTimesContext.Provider value={{
            prayerTimes,
            nextPrayer,
            timeToNextPrayer,
            city,
            country,
            method,
            timezone,
            loading,
            notificationsEnabled,
            audioEnabled,
            setCity,
            setCountry,
            setMethod,
            setTimezone,
            toggleNotifications: () => setNotificationsEnabled(!notificationsEnabled),
            toggleAudio: () => setAudioEnabled(!audioEnabled),
            refreshTimes: fetchPrayerTimes
        }}>
            {children}
        </PrayerTimesContext.Provider>
    );
}

export function usePrayerTimes() {
    const context = useContext(PrayerTimesContext);
    if (context === undefined) {
        throw new Error('usePrayerTimes must be used within a PrayerTimesProvider');
    }
    return context;
}
