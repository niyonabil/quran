import { usePrayerTimes } from '@/contexts/PrayerTimesContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CitySelector } from '@/components/CitySelector';

export function PrayerPage() {
    const {
        prayerTimes,
        nextPrayer,
        timeToNextPrayer,
        city,
        country,
        loading,
        setCity,
        setCountry,
        refreshTimes,
        notificationsEnabled,
        toggleNotifications,
        audioEnabled,
        toggleAudio
    } = usePrayerTimes();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="islamic-card p-8 text-center">
                <div className="text-4xl mb-4">🕌</div>
                <h1 className="text-4xl font-bold gradient-text mb-4">
                    Horaires de Prière
                </h1>
                <p className="text-navy/70 text-lg">
                    {city}, {country}
                </p>

                {/* Next Prayer Timer */}
                {nextPrayer && (
                    <div className="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100 inline-block">
                        <p className="text-sm text-emerald-600 font-semibold mb-1">
                            Prochaine prière: {nextPrayer}
                        </p>
                        <div className="text-4xl font-bold font-mono text-emerald-800">
                            {timeToNextPrayer}
                        </div>
                    </div>
                )}
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Settings Card */}
                <div className="md:col-span-1 space-y-6">
                    <Card className="p-6 islamic-card">
                        <h2 className="text-xl font-bold text-emerald-dark mb-6 flex items-center gap-2">
                            <span>⚙️</span> Paramètres
                        </h2>

                        <div className="space-y-6">
                            <CitySelector
                                city={city}
                                country={country}
                                onCityChange={setCity}
                                onCountryChange={setCountry}
                            />

                            <div className="text-xs text-gray-500 px-1">
                                <span className="font-medium">Fuseau horaire:</span> {usePrayerTimes().timezone}
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-cream rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <span className="text-navy font-medium">🔔 Notifications</span>
                                        <button
                                            onClick={() => new Notification('Test Notification', { body: 'Ceci est un test' })}
                                            className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded hover:bg-emerald-200"
                                            title="Tester la notification"
                                        >
                                            Test
                                        </button>
                                    </div>
                                    <button
                                        onClick={toggleNotifications}
                                        className={`w-12 h-6 rounded-full transition-colors ${notificationsEnabled ? 'bg-emerald-500' : 'bg-gray-300'}`}
                                    >
                                        <div className={`w-4 h-4 bg-white rounded-full transform transition-transform ${notificationsEnabled ? 'translate-x-7' : 'translate-x-1'} mt-1`} />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-cream rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <span className="text-navy font-medium">🔊 Adhan Audio</span>
                                        <button
                                            onClick={() => {
                                                const audio = new Audio('https://cdn.alquran.cloud/media/audio/ayah/ar.alafasy/1/1'); // Test audio
                                                audio.play();
                                            }}
                                            className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded hover:bg-emerald-200"
                                            title="Tester l'audio"
                                        >
                                            Test
                                        </button>
                                    </div>
                                    <button
                                        onClick={toggleAudio}
                                        className={`w-12 h-6 rounded-full transition-colors ${audioEnabled ? 'bg-emerald-500' : 'bg-gray-300'}`}
                                    >
                                        <div className={`w-4 h-4 bg-white rounded-full transform transition-transform ${audioEnabled ? 'translate-x-7' : 'translate-x-1'} mt-1`} />
                                    </button>
                                </div>
                            </div>

                            <Button
                                onClick={refreshTimes}
                                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                                disabled={loading}
                            >
                                {loading ? 'Chargement...' : 'Mettre à jour'}
                            </Button>
                        </div>
                    </Card>
                </div>

                {/* Times Display */}
                <div className="md:col-span-2">
                    {prayerTimes ? (
                        <div className="space-y-6">
                            <div className="islamic-card p-6 text-center bg-gradient-to-r from-emerald-50 to-gold-50">
                                <h2 className="text-2xl font-bold text-emerald-dark mb-2">
                                    {prayerTimes.date?.readable}
                                </h2>
                                <p className="text-navy/60 font-mono">
                                    {prayerTimes.date?.hijri?.day} {prayerTimes.date?.hijri?.month?.en} {prayerTimes.date?.hijri?.year}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {Object.entries(prayerTimes.timings || {})
                                    .filter(([name]) => ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].includes(name))
                                    .map(([name, time]: any) => (
                                        <div
                                            key={name}
                                            className={`islamic-card p-6 text-center transition-all duration-300 ${name === nextPrayer
                                                ? 'ring-2 ring-emerald-500 bg-emerald-50 scale-105 shadow-lg'
                                                : 'hover-glow hover:-translate-y-1'
                                                }`}
                                        >
                                            <div className="text-3xl mb-2">
                                                {name === 'Fajr' && '🌅'}
                                                {name === 'Sunrise' && '☀️'}
                                                {name === 'Dhuhr' && '🕛'}
                                                {name === 'Asr' && '🌤️'}
                                                {name === 'Maghrib' && '🌇'}
                                                {name === 'Isha' && '🌙'}
                                            </div>
                                            <p className="text-sm font-semibold text-navy/60 mb-1 uppercase tracking-wider">
                                                {name}
                                            </p>
                                            <p className="text-3xl font-bold text-emerald-600 font-mono">
                                                {time.split(' ')[0]}
                                            </p>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    ) : (
                        <div className="islamic-card p-12 text-center h-full flex flex-col items-center justify-center">
                            <div className="text-6xl mb-4 animate-pulse">🕌</div>
                            <p className="text-navy/70">Chargement des horaires...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
