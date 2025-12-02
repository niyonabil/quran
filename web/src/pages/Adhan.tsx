import { useState } from 'react';
import { Button } from '@/components/ui/button';

// Liste des muezzins célèbres avec leurs Adhan
const MUEZZINS = [
    {
        id: 1,
        name: 'الشيخ علي أحمد ملا',
        transliteration: 'Sheikh Ali Ahmed Mulla',
        country: 'Arabie Saoudite',
        location: 'La Mecque - المسجد الحرام',
        description: 'Muezzin officiel de la Grande Mosquée de La Mecque',
        audioUrl: 'https://server11.mp3quran.net/a_jbr/Rewayat-Qalon-A-n-Nafi/001.mp3', // Placeholder
        image: '🕌'
    },
    {
        id: 2,
        name: 'الشيخ عصام بن علي خان',
        transliteration: 'Sheikh Essam Bin Ali Khan',
        country: 'Arabie Saoudite',
        location: 'La Mecque - المسجد الحرام',
        description: 'Muezzin de la Grande Mosquée de La Mecque',
        audioUrl: 'https://server11.mp3quran.net/a_jbr/Rewayat-Qalon-A-n-Nafi/002.mp3',
        image: '🕌'
    },
    {
        id: 3,
        name: 'الشيخ محمد العمودي',
        transliteration: 'Sheikh Mohammed Al-Amoudi',
        country: 'Arabie Saoudite',
        location: 'Médine - المسجد النبوي',
        description: 'Muezzin de la Mosquée du Prophète',
        audioUrl: 'https://server11.mp3quran.net/a_jbr/Rewayat-Qalon-A-n-Nafi/003.mp3',
        image: '🕌'
    },
    {
        id: 4,
        name: 'الشيخ حمد الدغريري',
        transliteration: 'Sheikh Hamad Al-Deghreri',
        country: 'Arabie Saoudite',
        location: 'Médine - المسجد النبوي',
        description: 'Ancien muezzin de la Mosquée du Prophète',
        audioUrl: 'https://server11.mp3quran.net/a_jbr/Rewayat-Qalon-A-n-Nafi/004.mp3',
        image: '🕌'
    },
    {
        id: 5,
        name: 'الشيخ منصور الزهراني',
        transliteration: 'Sheikh Mansour Al-Zahrani',
        country: 'Arabie Saoudite',
        location: 'La Mecque',
        description: 'Muezzin célèbre pour sa voix mélodieuse',
        audioUrl: 'https://server11.mp3quran.net/a_jbr/Rewayat-Qalon-A-n-Nafi/005.mp3',
        image: '🕌'
    }
];

// Méthodes de calcul des horaires de prière
const PRAYER_METHODS = [
    { id: 3, name: 'Muslim World League', countries: 'International' },
    { id: 2, name: 'ISNA', countries: 'Amérique du Nord' },
    { id: 5, name: 'Egyptian General Authority', countries: 'Égypte' },
    { id: 4, name: 'Umm Al-Qura', countries: 'Arabie Saoudite' },
    { id: 1, name: 'University of Karachi', countries: 'Pakistan' },
    { id: 7, name: 'Institute of Tehran', countries: 'Iran' },
    { id: 0, name: 'Shia Ithna-Ashari', countries: 'Chiite' },
    { id: 8, name: 'Gulf Region', countries: 'Golfe' },
    { id: 9, name: 'Kuwait', countries: 'Koweït' },
    { id: 10, name: 'Qatar', countries: 'Qatar' },
    { id: 11, name: 'Singapore', countries: 'Singapour' },
    { id: 12, name: 'France (UOIF)', countries: 'France' },
    { id: 13, name: 'Turkey', countries: 'Turquie' },
    { id: 14, name: 'Russia', countries: 'Russie' },
    { id: 16, name: 'Dubai', countries: 'Émirats Arabes Unis' },
    { id: 17, name: 'JAKIM', countries: 'Malaisie' },
    { id: 18, name: 'Tunisia', countries: 'Tunisie' },
    { id: 19, name: 'Algeria', countries: 'Algérie' },
    { id: 20, name: 'KEMENAG', countries: 'Indonésie' },
    { id: 21, name: 'Morocco', countries: 'Maroc' },
    { id: 22, name: 'Portugal', countries: 'Portugal' },
    { id: 23, name: 'Jordan', countries: 'Jordanie' },
];

// Principales villes disponibles
const MAJOR_CITIES = [
    { name: 'Paris', country: 'France' },
    { name: 'Marseille', country: 'France' },
    { name: 'Lyon', country: 'France' },
    { name: 'Toulouse', country: 'France' },
    { name: 'Nice', country: 'France' },
    { name: 'Lille', country: 'France' },
    { name: 'Mecca', country: 'Saudi Arabia' },
    { name: 'Medina', country: 'Saudi Arabia' },
    { name: 'Riyadh', country: 'Saudi Arabia' },
    { name: 'Jeddah', country: 'Saudi Arabia' },
    { name: 'Dubai', country: 'UAE' },
    { name: 'Abu Dhabi', country: 'UAE' },
    { name: 'Cairo', country: 'Egypt' },
    { name: 'Alexandria', country: 'Egypt' },
    { name: 'Istanbul', country: 'Turkey' },
    { name: 'Ankara', country: 'Turkey' },
    { name: 'London', country: 'UK' },
    { name: 'Manchester', country: 'UK' },
    { name: 'New York', country: 'USA' },
    { name: 'Los Angeles', country: 'USA' },
    { name: 'Casablanca', country: 'Morocco' },
    { name: 'Rabat', country: 'Morocco' },
    { name: 'Algiers', country: 'Algeria' },
    { name: 'Tunis', country: 'Tunisia' },
    { name: 'Kuala Lumpur', country: 'Malaysia' },
    { name: 'Jakarta', country: 'Indonesia' },
    { name: 'Karachi', country: 'Pakistan' },
    { name: 'Lahore', country: 'Pakistan' },
    { name: 'Tehran', country: 'Iran' },
    { name: 'Baghdad', country: 'Iraq' },
];

export function AdhanPage() {
    const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeMusezzin, setActiveMuezzin] = useState<number | null>(null);
    const [showMethods, setShowMethods] = useState(false);
    const [showCities, setShowCities] = useState(false);

    const playAdhan = (muezzin: typeof MUEZZINS[0]) => {
        // Stop current audio if playing
        if (currentAudio) {
            currentAudio.pause();
            setCurrentAudio(null);
            setIsPlaying(false);
        }

        // Note: Les URLs sont des placeholders car il n'existe pas d'API publique pour les Adhan
        // En production, il faudrait héberger les fichiers audio des Adhan
        console.log('Playing Adhan from:', muezzin.name);

        // Simulation d'un lecteur audio
        setActiveMuezzin(muezzin.id);
        setIsPlaying(true);

        // Dans une vraie application, vous utiliseriez:
        // const audio = new Audio(muezzin.audioUrl);
        // audio.play().then(() => { ... });
    };

    const stopAdhan = () => {
        if (currentAudio) {
            currentAudio.pause();
            setCurrentAudio(null);
        }
        setIsPlaying(false);
        setActiveMuezzin(null);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="islamic-card p-8 text-center bg-gradient-to-br from-emerald-50 via-cream to-gold-50">
                <div className="text-6xl mb-4">🕌</div>
                <h1 className="text-4xl font-bold gradient-text mb-4">
                    الأذان - L'Appel à la Prière
                </h1>
                <p className="text-xl arabic-text mb-2 text-emerald-dark">
                    اللَّهُ أَكْبَرُ
                </p>
                <p className="text-navy/70">
                    Écoutez l'Adhan des muezzins les plus célèbres
                </p>
            </div>

            {/* Audio Player (if playing) */}
            {isPlaying && (
                <div className="islamic-card p-6 sticky top-4 z-10 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="text-3xl animate-pulse">🔊</div>
                            <div>
                                <h3 className="font-bold">Adhan en cours</h3>
                                <p className="text-sm text-white/90">
                                    {MUEZZINS.find(m => m.id === activeMusezzin)?.name}
                                </p>
                            </div>
                        </div>
                        <Button
                            onClick={stopAdhan}
                            className="bg-red-500 hover:bg-red-600 text-white"
                        >
                            ⏹️ Arrêter
                        </Button>
                    </div>
                </div>
            )}

            {/* Muezzins Grid */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-emerald-dark flex items-center gap-2">
                    <span>🎙️</span>
                    Muezzins (مؤذّن)
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                    {MUEZZINS.map((muezzin) => (
                        <div
                            key={muezzin.id}
                            className={`islamic-card p-6 transition-all ${activeMusezzin === muezzin.id
                                    ? 'ring-2 ring-emerald-500 shadow-emerald-100'
                                    : 'hover-glow'
                                }`}
                        >
                            <div className="flex items-start gap-4">
                                <div className="text-4xl">{muezzin.image}</div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-emerald-dark mb-1 arabic-text">
                                        {muezzin.name}
                                    </h3>
                                    <p className="text-sm text-navy/70 mb-2">
                                        {muezzin.transliteration}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs text-navy/60 mb-3">
                                        <span>📍</span>
                                        <span className="arabic-text">{muezzin.location}</span>
                                    </div>
                                    <p className="text-sm text-navy/80 mb-4">
                                        {muezzin.description}
                                    </p>
                                    <Button
                                        onClick={() => playAdhan(muezzin)}
                                        className="w-full bg-emerald-500 hover:bg-emerald-600"
                                        disabled={activeMusezzin === muezzin.id}
                                    >
                                        {activeMusezzin === muezzin.id ? '▶️ En cours...' : '▶️ Écouter l\'Adhan'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Prayer Methods */}
            <div className="islamic-card p-6">
                <button
                    onClick={() => setShowMethods(!showMethods)}
                    className="w-full flex items-center justify-between text-left"
                >
                    <h2 className="text-2xl font-bold text-emerald-dark flex items-center gap-2">
                        <span>📊</span>
                        Méthodes de Calcul ({PRAYER_METHODS.length})
                    </h2>
                    <span className="text-2xl">{showMethods ? '▲' : '▼'}</span>
                </button>

                {showMethods && (
                    <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {PRAYER_METHODS.map((method) => (
                            <div
                                key={method.id}
                                className="p-4 bg-emerald-50 rounded-lg border border-emerald-200"
                            >
                                <div className="font-semibold text-emerald-700 mb-1">
                                    {method.name}
                                </div>
                                <div className="text-xs text-navy/60">
                                    {method.countries}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Major Cities */}
            <div className="islamic-card p-6">
                <button
                    onClick={() => setShowCities(!showCities)}
                    className="w-full flex items-center justify-between text-left"
                >
                    <h2 className="text-2xl font-bold text-emerald-dark flex items-center gap-2">
                        <span>🌍</span>
                        Villes Disponibles ({MAJOR_CITIES.length}+)
                    </h2>
                    <span className="text-2xl">{showCities ? '▲' : '▼'}</span>
                </button>

                {showCities && (
                    <div className="mt-6 grid md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {MAJOR_CITIES.map((city, index) => (
                            <div
                                key={index}
                                className="p-3 bg-cream rounded-lg border border-gold-dark/20"
                            >
                                <div className="font-semibold text-navy">
                                    {city.name}
                                </div>
                                <div className="text-xs text-navy/60">
                                    {city.country}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Info Note */}
            <div className="islamic-card p-6 bg-amber-50 border-amber-200">
                <div className="flex gap-4">
                    <div className="text-3xl">ℹ️</div>
                    <div>
                        <h3 className="font-bold text-amber-800 mb-2">Note importante</h3>
                        <p className="text-sm text-amber-700">
                            Les fichiers audio des Adhan nécessitent d'être hébergés localement car il n'existe pas d'API publique pour cela.
                            Pour une implémentation complète, veuillez télécharger les enregistrements officiels des muezzins et les placer dans le dossier <code className="bg-amber-100 px-2 py-1 rounded">public/audio/adhan/</code>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
