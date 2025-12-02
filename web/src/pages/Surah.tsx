import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { quranApi } from '@/lib/api';

const RECITERS = [
    { id: 'ar.alafasy', name: 'Mishary Rashid Alafasy' },
    { id: 'ar.abdulbasitmurattal', name: 'Abdul Basit (Murattal)' },
    { id: 'ar.abdullahbasfar', name: 'Abdullah Basfar' },
    { id: 'ar.abdurrahmaansudais', name: 'Abdurrahmaan As-Sudais' },
    { id: 'ar.abdulsamad', name: 'Abdul Samad' },
    { id: 'ar.shaatree', name: 'Abu Bakr Ash-Shaatree' },
    { id: 'ar.ahmedajamy', name: 'Ahmed ibn Ali al-Ajamy' },
    { id: 'ar.hanirifai', name: 'Hani Rifai' },
    { id: 'ar.husary', name: 'Mahmoud Khalil Al-Husary' },
    { id: 'ar.husarymujawwad', name: 'Husary (Mujawwad)' },
    { id: 'ar.hudhaify', name: 'Ali Al-Hudhaify' },
    { id: 'ar.ibrahimakhbar', name: 'Ibrahim Akhdar' },
    { id: 'ar.mahermuaiqly', name: 'Maher Al Muaiqly' },
    { id: 'ar.minshawi', name: 'Mohamed Siddiq Al-Minshawi' },
    { id: 'ar.minshawimujawwad', name: 'Minshawi (Mujawwad)' },
    { id: 'ar.muhammadayyoub', name: 'Muhammad Ayyoub' },
    { id: 'ar.muhammadjibreel', name: 'Muhammad Jibreel' },
    { id: 'ar.saoodshuraym', name: 'Saood Ash-Shuraym' },
    { id: 'ar.parhizgar', name: 'Shahriar Parhizgar' },
    { id: 'ar.aymanswoaid', name: 'Ayman Sowaid' },
    { id: 'en.walk', name: 'Ibrahim Walk (English)' },
];

export function SurahPage() {
    const { surahId } = useParams();
    const [verses, setVerses] = useState<any[]>([]);
    const [surahInfo, setSurahInfo] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Audio State
    const [activeVerse, setActiveVerse] = useState<number | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [reciter, setReciter] = useState('ar.alafasy');
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Tafsir State
    const [expandedTafsir, setExpandedTafsir] = useState<number | null>(null);
    const [tafsirData, setTafsirData] = useState<string>('');
    const [loadingTafsir, setLoadingTafsir] = useState(false);

    useEffect(() => {
        if (!surahId) return;

        setLoading(true);
        setError('');

        quranApi.getVerses(Number(surahId))
            .then(({ data }) => {
                if (data && data.data) {
                    setSurahInfo(data.data);
                    setVerses(data.data.ayahs || []);
                } else {
                    setVerses([]);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error loading verses:', err);
                setError('Erreur de chargement des versets');
                setLoading(false);
            });

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
            }
        };
    }, [surahId]);

    const playVerse = (verseNumber: number) => {
        const verse = verses.find(v => v.numberInSurah === verseNumber);
        if (!verse) {
            console.error('Verse not found:', verseNumber);
            return;
        }

        console.log(`Playing audio: Surah ${surahId}, Verse ${verseNumber} (Global: ${verse.number}), Reciter ${reciter}`);
        // Use global verse number for CDN: https://cdn.alquran.cloud/media/audio/ayah/{edition}/{globalAyahNumber}
        const audioUrl = `https://cdn.alquran.cloud/media/audio/ayah/${reciter}/${verse.number}`;
        console.log('Audio URL:', audioUrl);

        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        audio.play().then(() => {
            setIsPlaying(true);
            setActiveVerse(verseNumber);

            // Scroll to verse
            const element = document.getElementById(`verse-${verseNumber}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }).catch(err => {
            console.error("Audio play error:", err);
            // Try fallback format if global ID fails
            const fallbackUrl = `https://cdn.alquran.cloud/media/audio/ayah/${reciter}/${surahId}/${verseNumber}`;
            console.log('Trying fallback URL:', fallbackUrl);
            const fallbackAudio = new Audio(fallbackUrl);
            audioRef.current = fallbackAudio;
            fallbackAudio.play().then(() => {
                setIsPlaying(true);
                setActiveVerse(verseNumber);
            }).catch(e => {
                console.error("Fallback audio error:", e);
                alert(`Impossible de lire l'audio. Veuillez vérifier votre connexion.`);
            });
        });

        audio.onended = () => {
            setIsPlaying(false);
            // Auto-play next verse
            const nextVerse = verseNumber + 1;
            if (nextVerse <= (surahInfo?.numberOfAyahs || 0)) {
                playVerse(nextVerse);
            } else {
                setActiveVerse(null);
            }
        };
    };

    const togglePlayPause = () => {
        if (!audioRef.current && verses.length > 0) {
            playVerse(activeVerse || 1);
            return;
        }

        if (isPlaying) {
            audioRef.current?.pause();
            setIsPlaying(false);
        } else {
            audioRef.current?.play();
            setIsPlaying(true);
        }
    };

    const handleTafsir = async (verseNumber: number) => {
        if (expandedTafsir === verseNumber) {
            setExpandedTafsir(null);
            return;
        }

        setExpandedTafsir(verseNumber);
        setLoadingTafsir(true);
        try {
            // Using ar.muyassar for simple tafsir
            const { data } = await quranApi.getAyah(Number(surahId), verseNumber, 'ar.muyassar');
            setTafsirData(data.data.text);
        } catch (error) {
            console.error('Error fetching tafsir:', error);
            setTafsirData('Tafsir non disponible pour le moment.');
        } finally {
            setLoadingTafsir(false);
        }
    };

    if (loading) {
        return (
            <div className="islamic-card p-12 text-center">
                <div className="text-6xl mb-4 animate-pulse">📖</div>
                <h2 className="text-2xl font-bold text-emerald-dark mb-2">Chargement...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="islamic-card p-12 text-center border-red-200 bg-red-50">
                <div className="text-6xl mb-4">⚠️</div>
                <h2 className="text-2xl font-bold text-red-700 mb-2">Erreur</h2>
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-24">
            {/* Sticky Header Controls */}
            <div className="sticky top-4 z-20 islamic-card p-4 shadow-xl bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-emerald-200">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <h2 className="font-bold text-emerald-800 hidden md:block">
                            {surahInfo?.name}
                        </h2>
                        <select
                            value={reciter}
                            onChange={(e) => setReciter(e.target.value)}
                            className="px-3 py-2 rounded-lg border border-emerald-200 text-sm focus:outline-none focus:border-emerald-500"
                        >
                            {RECITERS.map(r => (
                                <option key={r.id} value={r.id}>{r.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            onClick={() => {
                                const prev = (activeVerse || 1) - 1;
                                if (prev >= 1) playVerse(prev);
                            }}
                            variant="outline"
                            size="icon"
                            disabled={!activeVerse || activeVerse <= 1}
                        >
                            ⏮️
                        </Button>

                        <Button
                            onClick={togglePlayPause}
                            className={`w-12 h-12 rounded-full ${isPlaying ? 'bg-emerald-600' : 'bg-emerald-500'} text-white shadow-lg hover:bg-emerald-700 transition-all transform hover:scale-105`}
                        >
                            {isPlaying ? '⏸️' : '▶️'}
                        </Button>

                        <Button
                            onClick={() => {
                                const next = (activeVerse || 1) + 1;
                                if (next <= (surahInfo?.numberOfAyahs || 0)) playVerse(next);
                            }}
                            variant="outline"
                            size="icon"
                            disabled={!activeVerse || activeVerse >= (surahInfo?.numberOfAyahs || 0)}
                        >
                            ⏭️
                        </Button>
                    </div>

                    {activeVerse && (
                        <div className="text-sm font-mono text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                            Verset {activeVerse}
                        </div>
                    )}
                </div>
            </div>

            {/* Surah Header Info */}
            {surahInfo && (
                <div className="islamic-card p-8 text-center">
                    <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-full w-16 h-16 flex items-center justify-center font-bold text-2xl mx-auto mb-4 shadow-lg">
                        {surahInfo.number}
                    </div>
                    <h1 className="text-4xl font-bold gradient-text mb-2 arabic-text">
                        {surahInfo.name}
                    </h1>
                    <p className="text-xl text-navy mb-2">{surahInfo.englishName}</p>
                    <p className="text-sm text-navy/70">
                        {surahInfo.englishNameTranslation} • {surahInfo.numberOfAyahs} versets • {surahInfo.revelationType}
                    </p>
                </div>
            )}

            {/* Bismillah */}
            {surahId !== '1' && surahId !== '9' && (
                <div className="islamic-card p-6 text-center bg-gradient-to-r from-emerald-50 to-gold-50">
                    <p className="arabic-text text-3xl text-emerald-dark">
                        بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                    </p>
                </div>
            )}

            {/* Verses List */}
            <div className="space-y-4">
                {verses.map((verse) => (
                    <div
                        key={verse.number}
                        id={`verse-${verse.numberInSurah}`}
                        className={`islamic-card p-6 transition-all duration-500 ${activeVerse === verse.numberInSurah
                            ? 'border-emerald-500 shadow-emerald-100 ring-2 ring-emerald-100 scale-[1.01]'
                            : 'hover:shadow-lg'
                            }`}
                    >
                        <div className="flex items-start gap-4">
                            <button
                                onClick={() => playVerse(verse.numberInSurah)}
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0 transition-colors ${activeVerse === verse.numberInSurah
                                    ? 'bg-emerald-500 text-white animate-pulse'
                                    : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                    }`}
                            >
                                {verse.numberInSurah}
                            </button>

                            <div className="flex-1 space-y-4">
                                <p className={`text-3xl arabic-text text-right leading-[2.5] ${activeVerse === verse.numberInSurah ? 'text-emerald-800' : 'text-emerald-dark'
                                    }`}>
                                    {verse.text}
                                </p>

                                {verse.translation && (
                                    <p className="text-navy/80 border-t pt-3 text-lg">
                                        {verse.translation}
                                    </p>
                                )}

                                <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                                    <Button
                                        onClick={() => handleTafsir(verse.numberInSurah)}
                                        variant="ghost"
                                        size="sm"
                                        className={`text-xs gap-2 ${expandedTafsir === verse.numberInSurah ? 'bg-emerald-50 text-emerald-700' : 'text-navy/60'}`}
                                    >
                                        📖 {expandedTafsir === verse.numberInSurah ? 'Masquer Tafsir' : 'Lire Tafsir'}
                                    </Button>

                                    <button
                                        onClick={() => playVerse(verse.numberInSurah)}
                                        className="text-xs text-navy/60 hover:text-emerald-600 flex items-center gap-1"
                                    >
                                        ▶️ Écouter
                                    </button>
                                </div>

                                {/* Tafsir Panel */}
                                {expandedTafsir === verse.numberInSurah && (
                                    <div className="mt-4 bg-amber-50 p-4 rounded-lg border border-amber-100 animate-in slide-in-from-top-2">
                                        <h4 className="font-bold text-amber-800 mb-2 text-sm">Tafsir Al-Muyassar</h4>
                                        {loadingTafsir ? (
                                            <p className="text-sm text-amber-700 animate-pulse">Chargement du tafsir...</p>
                                        ) : (
                                            <p className="text-lg arabic-text text-amber-900 leading-loose">
                                                {tafsirData}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
