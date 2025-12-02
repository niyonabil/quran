import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { userApi, authApi } from '@/lib/api';
import { usePrayerTimes } from '@/contexts/PrayerTimesContext';

export function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [favorites, setFavorites] = useState<any[]>([]);
    const { timezone, setTimezone } = usePrayerTimes();
    const [availableTimezones, setAvailableTimezones] = useState<string[]>([]);

    useEffect(() => {
        authApi.getProfile().then(({ data }) => {
            setUser(data);
        });

        userApi.getFavorites().then(({ data }) => {
            setFavorites(data);
        });

        // Get available timezones
        if (typeof Intl !== 'undefined' && 'supportedValuesOf' in Intl) {
            setAvailableTimezones(Intl.supportedValuesOf('timeZone'));
        } else {
            // Fallback
            setAvailableTimezones([
                'UTC',
                'Europe/Paris',
                'Europe/London',
                'America/New_York',
                'Asia/Dubai',
                'Asia/Riyadh',
                'Asia/Tokyo'
            ]);
        }
    }, []);

    const removeFavorite = async (id: string) => {
        try {
            await userApi.removeFavorite(id);
            setFavorites(favorites.filter((fav) => fav.id !== id));
        } catch (error) {
            console.error('Failed to remove favorite', error);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-4xl font-bold text-emerald-800">Profile</h1>

            <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4">User Information</h2>
                    {user && (
                        <div className="space-y-2">
                            <p><strong>Name:</strong> {user.name || 'N/A'}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Role:</strong> {user.role}</p>
                        </div>
                    )}
                </Card>

                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Prayer Settings</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Timezone
                            </label>
                            <select
                                value={timezone}
                                onChange={(e) => setTimezone(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                            >
                                {availableTimezones.map((tz) => (
                                    <option key={tz} value={tz}>
                                        {tz}
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-500 mt-1">
                                Select your current timezone to ensure accurate prayer time countdowns.
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Favorites</h2>
                {favorites.length > 0 ? (
                    <div className="space-y-2">
                        {favorites.map((fav) => (
                            <div
                                key={fav.id}
                                className="flex justify-between items-center p-3 bg-emerald-50 rounded"
                            >
                                <span>
                                    Surah {fav.surahNumber}, Ayah {fav.ayahNumber}
                                </span>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => removeFavorite(fav.id)}
                                >
                                    Remove
                                </Button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600">No favorites yet</p>
                )}
            </Card>
        </div>
    );
}
