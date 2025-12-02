import { useState, useEffect } from 'react';
import { quranApi } from '../lib/api';

export function MushafsPage() {
    const [mushafs, setMushafs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMushaf, setSelectedMushaf] = useState<any>(null);
    const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSurah, setCurrentSurah] = useState(1);

    useEffect(() => {
        quranApi.getMushafs().then(({ data }) => {
            const mushafsList = Array.isArray(data) ? data : (data.data || []);
            setMushafs(mushafsList);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        return () => {
            // Cleanup audio on unmount
            if (currentAudio) {
                currentAudio.pause();
                setCurrentAudio(null);
            }
        };
    }, [currentAudio]);

    const playRecitation = (mushafId: number, surahNumber: number) => {
        // Stop current audio if playing
        if (currentAudio) {
            currentAudio.pause();
            setCurrentAudio(null);
            setIsPlaying(false);
        }

        // Mapping mushaf IDs to alquran.cloud editions - Vérifiés sur l'API
        const editions: any = {
            1: 'ar.abdulbasitmurattal',      // Abdul Basit (Murattal)
            2: 'ar.abdullahbasfar',          // Abdullah Basfar
            3: 'ar.abdurrahmaansudais',      // Abdurrahmaan As-Sudais
            4: 'ar.abdulsamad',              // Abdul Samad
            5: 'ar.shaatree',                // Abu Bakr Ash-Shaatree
            6: 'ar.ahmedajamy',              // Ahmed ibn Ali al-Ajamy
            7: 'ar.alafasy',                 // Mishary Alafasy
            8: 'ar.hanirifai',               // Hani Rifai
            9: 'ar.husary',                  // Mahmoud Khalil Al-Husary
            10: 'ar.husarymujawwad',         // Husary (Mujawwad)
            11: 'ar.hudhaify',               // Ali Al-Hudhaify
            12: 'ar.ibrahimakhbar',          // Ibrahim Akhdar
            13: 'ar.mahermuaiqly',           // Maher Al Muaiqly
            14: 'ar.minshawi',               // Mohamed Siddiq Al-Minshawi
            15: 'ar.minshawimujawwad',       // Minshawi (Mujawwad)
            16: 'ar.muhammadayyoub',         // Muhammad Ayyoub
            17: 'ar.muhammadjibreel',        // Muhammad Jibreel
            18: 'ar.saoodshuraym',           // Saood Ash-Shuraym
            19: 'ar.parhizgar',              // Shahriar Parhizgar
            20: 'ar.aymanswoaid',            // Ayman Sowaid
            21: 'en.walk',                   // Ibrahim Walk
        };

        const edition = editions[mushafId] || 'ar.alafasy';

        // Calculate global verse number (ayah number)
        // For Surah 1 (Al-Fatiha), first ayah global ID is 1
        const surahStartIds: { [key: number]: number } = {
            1: 1,    // Al-Fatiha starts at 1
            2: 8,    // Al-Baqarah starts at 8
            3: 294,  // Al-Imran starts at 294
            // Add more if needed
        };

        const globalVerseId = surahStartIds[surahNumber] || 1;

        // Format: https://cdn.alquran.cloud/media/audio/ayah/{edition}/{globalAyahNumber}
        const audioUrl = `https://cdn.alquran.cloud/media/audio/ayah/${edition}/${globalVerseId}`;

        console.log('Playing audio:', audioUrl);

        const audio = new Audio(audioUrl);
        audio.play()
            .then(() => {
                setCurrentAudio(audio);
                setIsPlaying(true);
                setCurrentSurah(surahNumber);
            })
            .catch((error) => {
                console.error('Error playing audio:', error);
                alert('Erreur lors de la lecture audio. Veuillez réessayer.');
            });

        audio.addEventListener('ended', () => {
            setIsPlaying(false);
        });
    };

    const stopRecitation = () => {
        if (currentAudio) {
            currentAudio.pause();
            setCurrentAudio(null);
            setIsPlaying(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="text-4xl mb-4">⏳</div>
                <p className="text-navy/70">Chargement des récitations...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="islamic-card p-8 text-center">
                <div className="text-4xl mb-4">📖</div>
                <h1 className="text-4xl font-bold gradient-text mb-4">
                    Mushafs - Récitations du Quran
                </h1>
                <p className="text-navy/70 text-lg">
                    10 récitations authentiques disponibles
                </p>
            </div>

            {/* Audio Player (if playing) */}
            {isPlaying && (
                <div className="islamic-card p-6 sticky top-4 z-10 bg-gradient-to-r from-emerald-50 to-gold-50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="text-3xl animate-pulse">🎵</div>
                            <div>
                                <h3 className="font-bold text-emerald-dark">Lecture en cours</h3>
                                <p className="text-sm text-navy/70">Sourate {currentSurah}</p>
                            </div>
                        </div>
                        <button
                            onClick={stopRecitation}
                            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold"
                        >
                            ⏹️ Arrêter
                        </button>
                    </div>
                </div>
            )}

            {/* Mushafs Grid */}
            <div className="grid md:grid-cols-2 gap-6">
                {mushafs.map((mushaf) => (
                    <div
                        key={mushaf.id}
                        className="islamic-card p-6 hover-glow"
                    >
                        <div className="flex items-start gap-4">
                            {/* Icon */}
                            <div className="text-5xl">🎙️</div>

                            {/* Content */}
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-emerald-dark mb-2">
                                    {mushaf.name}
                                </h3>
                                <p className="text-navy/70 text-sm mb-3">
                                    {mushaf.description}
                                </p>

                                {/* Rawi Info */}
                                {mushaf.rawi && (
                                    <div className="bg-emerald-50 p-3 rounded-lg mb-3">
                                        <div className="text-sm font-semibold text-emerald-700 mb-1">
                                            📜 Récitateur: {mushaf.rawi.name}
                                        </div>
                                        {mushaf.rawi.qiraa && (
                                            <div className="text-xs text-navy/60">
                                                Qiraa: {mushaf.rawi.qiraa.full_name}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex gap-2 flex-wrap">
                                    {/* Play Button */}
                                    <button
                                        onClick={() => playRecitation(mushaf.id, 1)}
                                        className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition font-semibold flex items-center gap-2"
                                    >
                                        ▶️ Écouter Al-Fatiha
                                    </button>

                                    {/* View Details */}
                                    <button
                                        onClick={() => setSelectedMushaf(mushaf)}
                                        className="px-4 py-2 bg-gold text-navy rounded-lg hover:bg-gold-dark transition font-semibold"
                                    >
                                        📋 Détails
                                    </button>

                                    {/* Download Links */}
                                    {mushaf.images && (
                                        <a
                                            href={mushaf.images}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-3 py-2 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            📥 SVG
                                        </a>
                                    )}
                                    {mushaf.images_png && (
                                        <a
                                            href={mushaf.images_png}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-3 py-2 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            📥 PNG
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Selected Mushaf Modal */}
            {selectedMushaf && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                    onClick={() => setSelectedMushaf(null)}
                >
                    <div
                        className="islamic-card p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-start mb-6">
                            <h2 className="text-2xl font-bold text-emerald-dark">
                                {selectedMushaf.name}
                            </h2>
                            <button
                                onClick={() => setSelectedMushaf(null)}
                                className="text-2xl text-navy/50 hover:text-navy"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">
                            <p className="text-navy/70">{selectedMushaf.description}</p>

                            {selectedMushaf.rawi && (
                                <div className="bg-emerald-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-emerald-700 mb-2">
                                        Récitateur
                                    </h3>
                                    <p className="text-navy mb-1">
                                        <strong>{selectedMushaf.rawi.name}</strong>
                                    </p>
                                    <p className="text-sm text-navy/70">
                                        {selectedMushaf.rawi.full_name}
                                    </p>
                                    {selectedMushaf.rawi.qiraa && (
                                        <div className="mt-3 pt-3 border-t border-emerald-200">
                                            <p className="text-sm text-navy/70 mb-1">Qiraa:</p>
                                            <p className="text-sm font-semibold">
                                                {selectedMushaf.rawi.qiraa.full_name}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {selectedMushaf.bismillah && (
                                <div className="bg-cream p-4 rounded-lg">
                                    <h3 className="font-semibold text-navy mb-2">Bismillah</h3>
                                    <p className="arabic-text text-2xl text-emerald-dark">
                                        {selectedMushaf.bismillah}
                                    </p>
                                </div>
                            )}

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => {
                                        playRecitation(selectedMushaf.id, 1);
                                        setSelectedMushaf(null);
                                    }}
                                    className="flex-1 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition font-semibold"
                                >
                                    ▶️ Écouter
                                </button>
                                {selectedMushaf.images && (
                                    <a
                                        href={selectedMushaf.images}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 py-3 bg-gray-500 text-white rounded-lg text-center hover:bg-gray-600 transition font-semibold"
                                    >
                                        📥 Télécharger SVG
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
