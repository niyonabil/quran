import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const TRANSLATIONS = [
    { id: 'none', name: 'Texte Arabe Original', language: 'العربية', flag: '🇸🇦', edition: 'quran-simple' },
    // Français
    { id: 'fr.hamidullah', name: 'Muhammad Hamidullah', language: 'Français', flag: '🇫🇷', edition: 'fr.hamidullah' },
    // English
    { id: 'en.sahih', name: 'Saheeh International', language: 'English', flag: '🇬🇧', edition: 'en.sahih' },
    { id: 'en.yusufali', name: 'Yusuf Ali', language: 'English', flag: '🇬🇧', edition: 'en.yusufali' },
    { id: 'en.pickthall', name: 'Pickthall', language: 'English', flag: '🇬🇧', edition: 'en.pickthall' },
    { id: 'en.asad', name: 'Muhammad Asad', language: 'English', flag: '🇬🇧', edition: 'en.asad' },
    // Español
    { id: 'es.cortes', name: 'Julio Cortes', language: 'Español', flag: '🇪🇸', edition: 'es.cortes' },
    // Deutsch
    { id: 'de.bubenheim', name: 'Bubenheim & Elyas', language: 'Deutsch', flag: '🇩🇪', edition: 'de.bubenheim' },
    // Türkçe
    { id: 'tr.diyanet', name: 'Diyanet İşleri', language: 'Türkçe', flag: '🇹🇷', edition: 'tr.diyanet' },
    // اردو
    { id: 'ur.jalandhry', name: 'Fateh Muhammad Jalandhry', language: 'اردو', flag: '🇵🇰', edition: 'ur.jalandhry' },
    // Italiano
    { id: 'it.piccardo', name: 'H Roberto Piccardo', language: 'Italiano', flag: '🇮🇹', edition: 'it.piccardo' },
    // Русский
    { id: 'ru.kuliev', name: 'Elmir Kuliev', language: 'Русский', flag: '🇷🇺', edition: 'ru.kuliev' },
    // 中文
    { id: 'zh.jian', name: 'Ma Jian', language: '中文', flag: '🇨🇳', edition: 'zh.jian' },
    // Indonesia
    { id: 'id.indonesian', name: 'Bahasa Indonesia', language: 'Indonesia', flag: '🇮🇩', edition: 'id.indonesian' },
];

export function QuranTranslationsPage() {
    const { surahId } = useParams();
    const [selectedTranslation, setSelectedTranslation] = useState('quran-simple');
    const [versesArabic, setVersesArabic] = useState<any[]>([]);
    const [versesTranslation, setVersesTranslation] = useState<any[]>([]);
    const [surahInfo, setSurahInfo] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (surahId) {
            loadSurah();
        }
    }, [surahId, selectedTranslation]);

    const loadSurah = async () => {
        try {
            setLoading(true);

            // Load Arabic text
            const arabicResponse = await axios.get(`https://api.alquran.cloud/v1/surah/${surahId}/quran-simple`);
            if (arabicResponse.data && arabicResponse.data.data) {
                setVersesArabic(arabicResponse.data.data.ayahs || []);
                setSurahInfo(arabicResponse.data.data);
            }

            // Load translation if not Arabic only
            if (selectedTranslation !== 'quran-simple') {
                const translationResponse = await axios.get(`https://api.alquran.cloud/v1/surah/${surahId}/${selectedTranslation}`);
                if (translationResponse.data && translationResponse.data.data) {
                    setVersesTranslation(translationResponse.data.data.ayahs || []);
                }
            } else {
                setVersesTranslation([]);
            }

            setLoading(false);
        } catch (error) {
            console.error('Error loading surah:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="text-6xl mb-4 animate-pulse">📖</div>
                <h2 className="text-2xl font-bold text-emerald-dark mb-2">Chargement...</h2>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            {surahInfo && (
                <div className="islamic-card p-6 bg-gradient-to-br from-emerald-50 via-cream to-gold-50">
                    <div className="flex items-center justify-between mb-4">
                        <Link to="/quran" className="text-emerald-600 hover:text-emerald-700">
                            ← Retour aux Sourates
                        </Link>
                        <div className="text-center flex-1">
                            <h1 className="text-3xl font-bold text-emerald-dark arabic-text mb-2">
                                {surahInfo.name}
                            </h1>
                            <p className="text-navy/70">
                                {surahInfo.englishName} - {surahInfo.numberOfAyahs} versets
                            </p>
                        </div>
                        <div className="w-32"></div>
                    </div>

                    {/* Translation Selector */}
                    <div className="flex items-center gap-4 justify-center">
                        <label className="font-semibold text-navy">
                            🌐 Traduction:
                        </label>
                        <select
                            value={selectedTranslation}
                            onChange={(e) => setSelectedTranslation(e.target.value)}
                            className="px-4 py-2 rounded-lg border-2 border-emerald-200 focus:border-emerald-500 focus:outline-none min-w-[300px]"
                        >
                            {TRANSLATIONS.map((trans) => (
                                <option key={trans.id} value={trans.edition}>
                                    {trans.flag} {trans.name} - {trans.language}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            {/* Verses */}
            <div className="space-y-4">
                {versesArabic.map((verse, index) => (
                    <div
                        key={verse.number}
                        id={`verse-${verse.numberInSurah}`}
                        className="islamic-card p-6 hover:shadow-lg transition-shadow"
                    >
                        {/* Verse Number */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-bold">
                                {verse.numberInSurah}
                            </div>
                            <div className="h-px flex-1 bg-emerald-200"></div>
                        </div>

                        {/* Arabic Text */}
                        <p className="text-3xl arabic-text text-emerald-dark leading-[2.5] text-right mb-6">
                            {verse.text}
                        </p>

                        {/* Translation */}
                        {versesTranslation[index] && (
                            <div className="mt-4 pt-4 border-t border-emerald-100">
                                <p className="text-lg text-navy/80 leading-relaxed">
                                    {versesTranslation[index].text}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
