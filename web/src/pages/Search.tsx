import { useState } from 'react';
import { quranApi } from '../lib/api';

type SearchType = 'notes' | 'fatwas' | 'topics' | 'books' | 'all';

export function SearchPage() {
    const [query, setQuery] = useState('');
    const [searchType, setSearchType] = useState<SearchType>('all');
    const [results, setResults] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        try {
            const { data } = await quranApi.search(
                query,
                searchType === 'all' ? undefined : searchType
            );
            setResults(data);
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="islamic-card p-8 text-center">
                <div className="text-4xl mb-4">🔍</div>
                <h1 className="text-4xl font-bold gradient-text mb-4">
                    Recherche Avancée
                </h1>
                <p className="text-navy/70 text-lg">
                    Explorez Notes, Fatwas, Thèmes et Livres Islamiques
                </p>
            </div>

            {/* Search Form */}
            <div className="islamic-card p-6">
                <form onSubmit={handleSearch} className="space-y-4">
                    {/* Search Input */}
                    <div>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Entrez votre recherche... (ex: البقرة, Prière, Jeûne)"
                            className="w-full px-4 py-3 rounded-lg border-2 border-emerald-200 focus:border-emerald-500 focus:outline-none text-lg"
                            dir="auto"
                        />
                    </div>

                    {/* Type Selector */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {[
                            { value: 'all', label: 'Tout', icon: '🌟' },
                            { value: 'notes', label: 'Notes', icon: '📝' },
                            { value: 'fatwas', label: 'Fatwas', icon: '⚖️' },
                            { value: 'topics', label: 'Thèmes', icon: '📚' },
                            { value: 'books', label: 'Livres', icon: '📖' },
                        ].map((type) => (
                            <button
                                key={type.value}
                                type="button"
                                onClick={() => setSearchType(type.value as SearchType)}
                                className={`p-3 rounded-lg border-2 transition-all ${searchType === type.value
                                        ? 'bg-emerald-500 text-white border-emerald-600'
                                        : 'bg-white text-navy border-emerald-200 hover:border-emerald-400'
                                    }`}
                            >
                                <div className="text-2xl mb-1">{type.icon}</div>
                                <div className="text-sm font-semibold">{type.label}</div>
                            </button>
                        ))}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all hover-glow disabled:opacity-50"
                    >
                        {loading ? 'Recherche en cours...' : '🔍 Rechercher'}
                    </button>
                </form>
            </div>

            {/* Results */}
            {results && (
                <div className="space-y-6">
                    {/* Notes */}
                    {results.notes?.items?.length > 0 && (
                        <div className="islamic-card p-6">
                            <h2 className="text-2xl font-bold text-emerald-dark mb-4 flex items-center gap-2">
                                <span>📝</span>
                                Notes ({results.notes.total})
                            </h2>
                            <div className="space-y-4">
                                {results.notes.items.slice(0, 5).map((note: any, idx: number) => (
                                    <div key={idx} className="bg-emerald-50 p-4 rounded-lg">
                                        <div className="arabic-text text-lg mb-2">{note.note}</div>
                                        {note.ayahs && (
                                            <div className="text-sm text-navy/60">
                                                📍 Versets: {note.ayahs}
                                            </div>
                                        )}
                                        {note.category && (
                                            <div className="text-sm text-emerald-700 mt-2">
                                                🏷️ {note.category.name}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Fatwas */}
                    {results.fatwas?.items?.length > 0 && (
                        <div className="islamic-card p-6">
                            <h2 className="text-2xl font-bold text-emerald-dark mb-4 flex items-center gap-2">
                                <span>⚖️</span>
                                Fatwas ({results.fatwas.total})
                            </h2>
                            <div className="space-y-4">
                                {results.fatwas.items.slice(0, 5).map((fatwa: any) => (
                                    <div key={fatwa.id} className="bg-gold-50 p-4 rounded-lg">
                                        <h3 className="font-bold text-navy mb-2">{fatwa.ar_title}</h3>
                                        <p className="text-sm text-navy/70 mb-2 line-clamp-3">
                                            {fatwa.ar_question}
                                        </p>
                                        {fatwa.mufti && (
                                            <div className="text-sm text-gold-dark">
                                                👤 {fatwa.mufti}
                                            </div>
                                        )}
                                        {fatwa.ar_source_url && (
                                            <a
                                                href={fatwa.ar_source_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-emerald-600 hover:underline mt-2 inline-block"
                                            >
                                                🔗 Voir la source
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Topics */}
                    {results.topics?.items?.length > 0 && (
                        <div className="islamic-card p-6">
                            <h2 className="text-2xl font-bold text-emerald-dark mb-4 flex items-center gap-2">
                                <span>📚</span>
                                Thèmes ({results.topics.total})
                            </h2>
                            <div className="grid md:grid-cols-2 gap-3">
                                {results.topics.items.slice(0, 10).map((topic: any) => (
                                    <div key={topic.id} className="bg-emerald-50 p-3 rounded-lg">
                                        <div className="font-semibold text-navy">{topic.name}</div>
                                        {topic.ayahs && (
                                            <div className="text-sm text-navy/60">📍 {topic.ayahs}</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Books */}
                    {results.books?.items?.length > 0 && (
                        <div className="islamic-card p-6">
                            <h2 className="text-2xl font-bold text-emerald-dark mb-4 flex items-center gap-2">
                                <span>📖</span>
                                Livres ({results.books.total})
                            </h2>
                            <div className="space-y-4">
                                {results.books.items.slice(0, 5).map((book: any, idx: number) => (
                                    <div key={idx} className="bg-cream p-4 rounded-lg">
                                        <h3 className="font-bold text-navy mb-2">
                                            {book.book_info?.name}
                                        </h3>
                                        {book.book_info?.author && (
                                            <div className="text-sm text-navy/70">
                                                ✍️ {book.book_info.author}
                                            </div>
                                        )}
                                        {book.book_info?.category && (
                                            <div className="text-sm text-emerald-700 mt-1">
                                                🏷️ {book.book_info.category}
                                            </div>
                                        )}
                                        {book.highlighted_text && (
                                            <div
                                                className="text-sm text-navy/60 mt-2 line-clamp-2"
                                                dangerouslySetInnerHTML={{ __html: book.highlighted_text }}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* No Results */}
                    {!results.notes?.items?.length &&
                        !results.fatwas?.items?.length &&
                        !results.topics?.items?.length &&
                        !results.books?.items?.length && (
                            <div className="islamic-card p-8 text-center">
                                <div className="text-6xl mb-4">🔍</div>
                                <h3 className="text-2xl font-bold text-navy mb-2">
                                    Aucun résultat trouvé
                                </h3>
                                <p className="text-navy/70">
                                    Essayez avec d'autres mots-clés ou changez le type de recherche
                                </p>
                            </div>
                        )}
                </div>
            )}
        </div>
    );
}
