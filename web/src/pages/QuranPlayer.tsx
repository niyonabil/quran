import { useState, useEffect, useRef } from 'react';
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

export function QuranPlayerPage() {
    const [surahs, setSurahs] = useState<any[]>([]);
    const [currentSurah, setCurrentSurah] = useState<any>(null);
    const [currentVerses, setCurrentVerses] = useState<any[]>([]);
    const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
    const [selectedReciter, setSelectedReciter] = useState('ar.alafasy');
    const [isPlaying, setIsPlaying] = useState(false);
    const [loading, setLoading] = useState(true);
    const [autoPlay, setAutoPlay] = useState(true);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Use refs to avoid closure issues in audio.onended
    const reciterRef = useRef(selectedReciter);
    const versesRef = useRef<any[]>([]);
    const verseIndexRef = useRef(0);
    const surahRef = useRef<any>(null);
    const autoPlayRef = useRef(autoPlay);

    // Keep refs in sync with state
    useEffect(() => {
        reciterRef.current = selectedReciter;
    }, [selectedReciter]);

    useEffect(() => {
        versesRef.current = currentVerses;
    }, [currentVerses]);

    useEffect(() => {
        verseIndexRef.current = currentVerseIndex;
    }, [currentVerseIndex]);

    useEffect(() => {
        surahRef.current = currentSurah;
    }, [currentSurah]);

    useEffect(() => {
        autoPlayRef.current = autoPlay;
    }, [autoPlay]);

    // Load all Surahs on mount
    useEffect(() => {
        quranApi.getSurahs()
            .then(({ data }) => {
                if (data && data.data) {
                    setSurahs(data.data);
                    // Load Al-Fatiha without autoplay
                    loadSurah(1, false);
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Error loading surahs:', error);
                setLoading(false);
            });
    }, []);

    const loadSurah = async (surahNumber: number, shouldAutoPlay: boolean = false) => {
        try {
            const { data } = await quranApi.getVerses(surahNumber);
            if (data && data.data) {
                setCurrentSurah(data.data);
                setCurrentVerses(data.data.ayahs || []);
                setCurrentVerseIndex(0);

                // Only auto-play if explicitly requested
                if (shouldAutoPlay && data.data.ayahs && data.data.ayahs.length > 0) {
                    setTimeout(() => {
                        playVerse(data.data.ayahs[0], 0);
                    }, 100);
                }
            }
        } catch (error) {
            console.error('Error loading surah:', error);
        }
    };

    const playVerse = (verse: any, verseIndex: number) => {
        // Stop current audio
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }

        // Update the current verse index
        setCurrentVerseIndex(verseIndex);
        verseIndexRef.current = verseIndex;

        // Use the ref to get the latest reciter value
        const currentReciter = reciterRef.current;
        const audioUrl = `https://cdn.alquran.cloud/media/audio/ayah/${currentReciter}/${verse.number}`;
        console.log('Playing:', audioUrl, 'Verse Index:', verseIndex, 'Reciter:', currentReciter);

        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        audio.play()
            .then(() => {
                setIsPlaying(true);
                // Scroll to current verse
                const element = document.getElementById(`verse-${verse.numberInSurah}`);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            })
            .catch(err => {
                console.error('Audio play error:', err);
                setIsPlaying(false);
            });

        audio.onended = () => {
            setIsPlaying(false);
            // Use refs to avoid closure issues
            if (autoPlayRef.current) {
                setTimeout(() => {
                    handleNextVerse(verseIndexRef.current);
                }, 300);
            }
        };
    };

    const handleNextVerse = (currentIndex?: number) => {
        // Use refs to get the latest values
        const index = currentIndex !== undefined ? currentIndex : verseIndexRef.current;
        const verses = versesRef.current;
        const surah = surahRef.current;
        const shouldAutoPlay = autoPlayRef.current;

        console.log('handleNextVerse - Index:', index, 'Total verses:', verses.length, 'Surah:', surah?.number);

        if (index < verses.length - 1) {
            // Play next verse in current surah
            const nextIndex = index + 1;
            playVerse(verses[nextIndex], nextIndex);
        } else if (surah && surah.number < 114 && shouldAutoPlay) {
            // Load and play next surah only if autoplay is enabled
            console.log('Moving to next surah:', surah.number + 1);
            loadSurah(surah.number + 1, true);
        } else {
            // End of surah or Quran
            setIsPlaying(false);
            if (surah && surah.number >= 114) {
                const message = '🎉 الحمد لله\n\nتم الانتهاء من قراءة القرآن الكريم كاملاً!\n\nFélicitations  ! Vous avez terminé la lecture complète du Saint Quran.';
                alert(message);
            }
        }
    };

    const handlePreviousVerse = () => {
        if (currentVerseIndex > 0) {
            const prevIndex = currentVerseIndex - 1;
            playVerse(currentVerses[prevIndex], prevIndex);
        } else if (currentSurah && currentSurah.number > 1) {
            // Load previous surah
            loadSurah(currentSurah.number - 1, false);
        }
    };

    const togglePlayPause = () => {
        if (!audioRef.current) {
            if (currentVerses.length > 0) {
                playVerse(currentVerses[currentVerseIndex], currentVerseIndex);
            }
            return;
        }

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play();
            setIsPlaying(true);
        }
    };

    const handleReciterChange = (reciterId: string) => {
        setSelectedReciter(reciterId);
        // Restart current verse with new reciter
        if (currentVerses[currentVerseIndex]) {
            playVerse(currentVerses[currentVerseIndex], currentVerseIndex);
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
        <div className="max-w-7xl mx-auto space-y-6 pb-24">
            {/* Header */}
            <div className="islamic-card p-8 text-center bg-gradient-to-br from-emerald-50 via-cream to-gold-50">
                <div className="text-6xl mb-4">📖</div>
                <h1 className="text-4xl font-bold gradient-text mb-2">
                    القرآن الكريم كاملاً
                </h1>
                <p className="text-xl text-navy">
                    Lecteur Complet du Saint Quran
                </p>
            </div>

            {/* Sticky Player Controls */}
            <div className="sticky top-4 z-20 islamic-card p-6 shadow-2xl bg-white/95 backdrop-blur border-2 border-emerald-300">
                <div className="space-y-4">
                    {/* Current Surah Info */}
                    {currentSurah && (
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-emerald-dark arabic-text">
                                {currentSurah.name}
                            </h2>
                            <p className="text-sm text-navy/70">
                                {currentSurah.englishName} - Verset {currentVerseIndex + 1} / {currentVerses.length}
                            </p>
                        </div>
                    )}

                    {/* Reciter Selection */}
                    <div className="flex items-center gap-4">
                        <label className="font-semibold text-navy min-w-fit">
                            🎙️ Récitateur :
                        </label>
                        <select
                            value={selectedReciter}
                            onChange={(e) => handleReciterChange(e.target.value)}
                            className="flex-1 px-4 py-2 rounded-lg border-2 border-emerald-200 focus:border-emerald-500 focus:outline-none"
                        >
                            {RECITERS.map(reciter => (
                                <option key={reciter.id} value={reciter.id}>
                                    {reciter.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Playback Controls */}
                    <div className="flex items-center justify-center gap-4">
                        <button
                            onClick={() => currentSurah && currentSurah.number > 1 && loadSurah(currentSurah.number - 1, false)}
                            className="px-4 py-2 bg-navy/10 hover:bg-navy/20 rounded-lg transition"
                            disabled={!currentSurah || currentSurah.number <= 1}
                        >
                            ⏮️ Sourate Préc.
                        </button>

                        <button
                            onClick={handlePreviousVerse}
                            className="px-6 py-3 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition font-semibold"
                            disabled={currentVerseIndex === 0 && currentSurah?.number === 1}
                        >
                            ⏪ Verset Préc.
                        </button>

                        <button
                            onClick={togglePlayPause}
                            className={`w-16 h-16 rounded-full text-3xl transition-all transform hover:scale-110 shadow-lg ${isPlaying
                                ? 'bg-emerald-600 hover:bg-emerald-700'
                                : 'bg-emerald-500 hover:bg-emerald-600'
                                } text-white`}
                        >
                            {isPlaying ? '⏸️' : '▶️'}
                        </button>

                        <button
                            onClick={() => handleNextVerse()}
                            className="px-6 py-3 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition font-semibold"
                            disabled={currentVerseIndex === currentVerses.length - 1 && currentSurah?.number === 114}
                        >
                            Verset Suiv. ⏩
                        </button>

                        <button
                            onClick={() => currentSurah && currentSurah.number < 114 && loadSurah(currentSurah.number + 1, false)}
                            className="px-4 py-2 bg-navy/10 hover:bg-navy/20 rounded-lg transition"
                            disabled={!currentSurah || currentSurah.number >= 114}
                        >
                            Sourate Suiv. ⏭️
                        </button>
                    </div>

                    {/* Auto-play Toggle */}
                    <div className="flex items-center justify-center gap-2">
                        <input
                            type="checkbox"
                            id="autoplay"
                            checked={autoPlay}
                            onChange={(e) => setAutoPlay(e.target.checked)}
                            className="w-4 h-4"
                        />
                        <label htmlFor="autoplay" className="text-sm text-navy/70">
                            Lecture automatique des versets
                        </label>
                    </div>
                </div>
            </div>

            {/* Current Verse Display */}
            {currentVerses.length > 0 && (
                <div className="islamic-card p-8">
                    <div
                        id={`verse-${currentVerses[currentVerseIndex]?.numberInSurah}`}
                        className="text-center space-y-6"
                    >
                        <div className="bg-emerald-50 rounded-full inline-block px-6 py-2">
                            <span className="font-bold text-emerald-700">
                                الآية {currentVerses[currentVerseIndex]?.numberInSurah}
                            </span>
                        </div>
                        <p className="text-4xl arabic-text text-emerald-dark leading-[3] px-8">
                            {currentVerses[currentVerseIndex]?.text}
                        </p>
                    </div>
                </div>
            )}

            {/* Surah List */}
            <div className="islamic-card p-6">
                <h2 className="text-2xl font-bold text-emerald-dark mb-4 flex items-center gap-2">
                    <span>📚</span>
                    جميع السور - Toutes les Sourates (114)
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                    {surahs.map((surah) => (
                        <button
                            key={surah.number}
                            onClick={() => loadSurah(surah.number, false)}
                            className={`p-4 rounded-lg border-2 transition-all text-left ${currentSurah?.number === surah.number
                                ? 'bg-emerald-100 border-emerald-500 shadow-md'
                                : 'bg-cream border-navy/10 hover:border-emerald-300 hover:shadow'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${currentSurah?.number === surah.number
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-emerald-100 text-emerald-700'
                                    }`}>
                                    {surah.number}
                                </div>
                                <div className="flex-1">
                                    <div className="font-bold text-emerald-dark arabic-text">
                                        {surah.name}
                                    </div>
                                    <div className="text-xs text-navy/60">
                                        {surah.englishName} - {surah.numberOfAyahs} versets
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
