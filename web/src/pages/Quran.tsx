import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { quranApi } from '@/lib/api';

export function QuranPage() {
    const [surahs, setSurahs] = useState<any[]>([]);
    const [filteredSurahs, setFilteredSurahs] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'number' | 'name'>('number');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        setLoading(true);
        quranApi.getSurahs()
            .then(({ data }) => {
                console.log('API Response:', data);
                // The API returns data directly, not nested in data.data
                const surahsData = Array.isArray(data) ? data : (data.data || []);
                console.log('Surahs Data:', surahsData);
                setSurahs(surahsData);
                setFilteredSurahs(surahsData);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error loading surahs:', err);
                setError('Erreur de chargement des sourates');
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        let filtered = [...surahs];

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter((surah) =>
                surah.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                surah.englishName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                surah.number?.toString().includes(searchQuery)
            );
        }

        // Sort
        if (sortBy === 'number') {
            filtered.sort((a, b) => a.number - b.number);
        } else {
            filtered.sort((a, b) => a.englishName.localeCompare(b.englishName));
        }

        setFilteredSurahs(filtered);
    }, [searchQuery, sortBy, surahs]);

    if (loading) {
        return (
            <div className="islamic-card p-12 text-center">
                <div className="text-6xl mb-4 animate-pulse">📖</div>
                <h2 className="text-2xl font-bold text-emerald-dark mb-2">
                    Chargement des sourates...
                </h2>
                <p className="text-navy/70">Veuillez patienter</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="islamic-card p-12 text-center">
                <div className="text-6xl mb-4">❌</div>
                <h2 className="text-2xl font-bold text-red-600 mb-2">{error}</h2>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                >
                    Réessayer
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="islamic-card p-8 text-center">
                <div className="text-4xl mb-4">📖</div>
                <h1 className="text-4xl font-bold gradient-text mb-4">
                    القرآن الكريم
                </h1>
                <p className="text-navy/70 text-lg">
                    114 Sourates - Noble quran
                </p>
            </div>

            {/* Search & Filters */}
            <div className="islamic-card p-6">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="🔍 Rechercher une sourate... (ex: Fatiha, البقرة, 2)"
                        className="flex-1 px-4 py-3 rounded-lg border-2 border-emerald-200 focus:border-emerald-500 focus:outline-none"
                        dir="auto"
                    />

                    {/* Sort */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as 'number' | 'name')}
                        className="px-4 py-3 rounded-lg border-2 border-emerald-200 focus:border-emerald-500 focus:outline-none bg-white"
                    >
                        <option value="number">📊 Par numéro</option>
                        <option value="name">🔤 Par nom</option>
                    </select>
                </div>

                {searchQuery && (
                    <div className="mt-3 text-sm text-navy/70">
                        {filteredSurahs.length} résultat(s) trouvé(s)
                    </div>
                )}
            </div>

            {/* Surahs Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSurahs.map((surah) => (
                    <div key={surah.number} className="islamic-card p-6 hover-glow group">
                        <div className="flex items-center gap-4 mb-3">
                            {/* Number Badge */}
                            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg shrink-0">
                                {surah.number}
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <h3 className="arabic-text text-xl text-emerald-dark mb-1 group-hover:text-emerald-600 transition">
                                    {surah.name}
                                </h3>
                                <p className="text-sm text-navy/70">{surah.englishName}</p>
                                <p className="text-xs text-navy/50 mt-1">
                                    {surah.numberOfAyahs} versets • {surah.revelationType}
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 mt-3">
                            <Link
                                to={`/quran/${surah.number}`}
                                className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-center text-sm font-semibold transition"
                            >
                                📖 Lire en arabe
                            </Link>
                            <Link
                                to={`/quran-translations/${surah.number}`}
                                className="flex-1 px-4 py-2 bg-gold hover:bg-gold-dark text-navy rounded-lg text-center text-sm font-semibold transition"
                            >
                                🌐 Traductions
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {/* No Results */}
            {filteredSurahs.length === 0 && surahs.length > 0 && (
                <div className="islamic-card p-8 text-center">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-2xl font-bold text-navy mb-2">
                        Aucune sourate trouvée
                    </h3>
                    <p className="text-navy/70">
                        Essayez avec un autre terme de recherche
                    </p>
                </div>
            )}
        </div>
    );
}
