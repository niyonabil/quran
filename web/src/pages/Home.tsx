import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { prayerApi } from '../lib/api';

export function Home() {
    const [prayerTimes, setPrayerTimes] = useState<any>(null);

    useEffect(() => {
        // Get prayer times using geolocation
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const { data } = await prayerApi.getByCoordinates(latitude, longitude);
                    setPrayerTimes(data);
                } catch (error) {
                    console.error('Error fetching prayer times:', error);
                }
            }
        );
    }, []);

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Hero Section with Islamic Design */}
            <div className="islamic-card p-8 mb-8 text-center animate-slide-up">
                <div className="text-4xl mb-4">🕌</div>
                <h1 className="text-4xl font-bold gradient-text mb-4">
                    Bienvenue dans votre Espace Spirituel
                </h1>
                <p className="text-navy/70 text-lg">
                    Explorez le Saint Quran, priez à l'heure, et restez connecté à Allah ﷻ
                </p>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid md:grid-cols-3 gap-6">
                <Link to="/quran" className="islamic-card p-6 hover-glow group">
                    <div className="text-5xl mb-4 text-center group-hover:scale-110 transition-transform">
                        📖
                    </div>
                    <h3 className="text-xl font-semibold text-emerald-dark mb-2 text-center">
                        Le Saint quran
                    </h3>
                    <p className="text-navy/60 text-center">
                        Lisez et méditez les versets sacrés
                    </p>
                </Link>

                <Link to="/prayer" className="islamic-card p-6 hover-glow group">
                    <div className="text-5xl mb-4 text-center group-hover:scale-110 transition-transform">
                        🕌
                    </div>
                    <h3 className="text-xl font-semibold text-emerald-dark mb-2 text-center">
                        Horaires de Prière
                    </h3>
                    <p className="text-navy/60 text-center">
                        Ne manquez jamais une prière
                    </p>
                </Link>

                <Link to="/profile" className="islamic-card p-6 hover-glow group">
                    <div className="text-5xl mb-4 text-center group-hover:scale-110 transition-transform">
                        ⭐
                    </div>
                    <h3 className="text-xl font-semibold text-emerald-dark mb-2 text-center">
                        Mes Favoris
                    </h3>
                    <p className="text-navy/60 text-center">
                        Vos versets préférés
                    </p>
                </Link>
            </div>

            {/* Prayer Times Card */}
            {prayerTimes && (
                <div className="islamic-card p-6 animate-fade-in">
                    <h2 className="text-2xl font-bold text-emerald-dark mb-6 flex items-center gap-2">
                        <span>🕌</span>
                        Prochaines Prières
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((prayer) => (
                            <div key={prayer} className="text-center p-4 bg-emerald-50 rounded-lg">
                                <div className="text-sm text-navy/60 mb-1">{prayer}</div>
                                <div className="text-xl font-bold text-emerald-dark">
                                    {prayerTimes.data?.timings?.[prayer] || '--:--'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Continue Reading */}
            <div className="islamic-card p-6">
                <h2 className="text-2xl font-bold text-emerald-dark mb-6 flex items-center gap-2">
                    <span>📚</span>
                    Continuer la Lecture
                </h2>
                <Link
                    to="/quran/2"
                    className="block p-4 bg-gradient-to-r from-emerald-50 to-gold-50 rounded-lg hover:shadow-lg transition-all"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="arabic-text text-2xl text-emerald-dark mb-1">
                                سورة البقرة
                            </h3>
                            <p className="text-navy/70">Sourate Al-Baqara</p>
                        </div>
                        <div className="text-3xl">→</div>
                    </div>
                </Link>
            </div>

            {/* Inspirational Quote */}
            <div className="islamic-card p-8 text-center bg-gradient-to-br from-emerald-50 to-gold-50">
                <div className="arabic-text text-3xl text-emerald-dark mb-4">
                    وَذَكِّرْ فَإِنَّ الذِّكْرَىٰ تَنفَعُ الْمُؤْمِنِينَ
                </div>
                <p className="text-navy/70">
                    "Et rappelle; car le rappel profite aux croyants"
                </p>
                <p className="text-sm text-navy/50 mt-2">Sourate Ad-Dhâriyât - 51:55</p>
            </div>
        </div>
    );
}
