export function Documentation() {
    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="islamic-card p-8 text-center">
                <div className="text-4xl mb-4">📚</div>
                <h1 className="text-4xl font-bold gradient-text mb-4">
                    Documentation API
                </h1>
                <p className="text-navy/70 text-lg">
                    Guide complet d'utilisation de la plateforme
                </p>
            </div>

            {/* API QuranPedia */}
            <div className="islamic-card p-6">
                <h2 className="text-2xl font-bold text-emerald-dark mb-6 flex items-center gap-2">
                    <span>📖</span>
                    API QuranPedia
                </h2>

                <div className="space-y-6">
                    {/* Sourates */}
                    <div className="border-l-4 border-emerald-500 pl-4">
                        <h3 className="text-xl font-semibold text-navy mb-2">Sourates</h3>
                        <div className="space-y-2 text-sm">
                            <div className="bg-cream p-3 rounded font-mono">
                                GET /api/quran/surahs
                            </div>
                            <p className="text-navy/70">Récupère la liste de toutes les sourates (114)</p>
                        </div>
                    </div>

                    {/* Versets */}
                    <div className="border-l-4 border-emerald-500 pl-4">
                        <h3 className="text-xl font-semibold text-navy mb-2">Versets</h3>
                        <div className="space-y-2 text-sm">
                            <div className="bg-cream p-3 rounded font-mono">
                                GET /api/quran/verses?surah=2&translation=en
                            </div>
                            <p className="text-navy/70">
                                <strong>Paramètres:</strong> surah (required), translation (ar/en)
                            </p>
                        </div>
                    </div>

                    {/* Recherche Avancée */}
                    <div className="border-l-4 border-gold pl-4">
                        <h3 className="text-xl font-semibold text-navy mb-2">Recherche Avancée</h3>
                        <div className="space-y-2 text-sm">
                            <div className="bg-cream p-3 rounded font-mono">
                                GET /api/quran/search?query=البقرة&type=notes
                            </div>
                            <p className="text-navy/70">
                                <strong>Types disponibles:</strong>
                            </p>
                            <ul className="list-disc list-inside text-navy/70 space-y-1 ml-4">
                                <li><code className="bg-emerald-50 px-2 py-1 rounded">notes</code> - Notes explicatives</li>
                                <li><code className="bg-emerald-50 px-2 py-1 rounded">fatwas</code> - Avis juridiques islamiques</li>
                                <li><code className="bg-emerald-50 px-2 py-1 rounded">topics</code> - Thèmes Quraniques</li>
                                <li><code className="bg-emerald-50 px-2 py-1 rounded">books</code> - Livres islamiques</li>
                            </ul>
                        </div>
                    </div>

                    {/* Mushafs */}
                    <div className="border-l-4 border-gold pl-4">
                        <h3 className="text-xl font-semibold text-navy mb-2">Mushafs (Récitations)</h3>
                        <div className="space-y-2 text-sm">
                            <div className="bg-cream p-3 rounded font-mono">
                                GET /api/quran/mushafs
                            </div>
                            <p className="text-navy/70">Liste de 10 récitations disponibles</p>
                            <div className="mt-2 bg-cream p-3 rounded font-mono">
                                GET /api/quran/mushafs/1
                            </div>
                            <p className="text-navy/70">Détails d'un mushaf spécifique</p>
                        </div>
                    </div>

                    {/* Informations Sourate */}
                    <div className="border-l-4 border-gold pl-4">
                        <h3 className="text-xl font-semibold text-navy mb-2">Informations Détaillées</h3>
                        <div className="space-y-2 text-sm">
                            <div className="bg-cream p-3 rounded font-mono">
                                GET /api/quran/surahs/2/info
                            </div>
                            <p className="text-navy/70">
                                Retourne: introduction, vertus (fadl), hadith du Prophète ﷺ,
                                causes de révélation (asbab al-nuzul), thèmes principaux
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* API Prayer Times */}
            <div className="islamic-card p-6">
                <h2 className="text-2xl font-bold text-emerald-dark mb-6 flex items-center gap-2">
                    <span>🕌</span>
                    API Horaires de Prière
                </h2>

                <div className="space-y-6">
                    {/* Par Ville */}
                    <div className="border-l-4 border-emerald-500 pl-4">
                        <h3 className="text-xl font-semibold text-navy mb-2">Par Ville</h3>
                        <div className="space-y-2 text-sm">
                            <div className="bg-cream p-3 rounded font-mono">
                                GET /api/prayer/city?city=Paris&country=France&method=12
                            </div>
                            <p className="text-navy/70">
                                <strong>Paramètres:</strong> city, country, method (optional)
                            </p>
                        </div>
                    </div>

                    {/* Par Coordonnées */}
                    <div className="border-l-4 border-emerald-500 pl-4">
                        <h3 className="text-xl font-semibold text-navy mb-2">Par Coordonnées GPS</h3>
                        <div className="space-y-2 text-sm">
                            <div className="bg-cream p-3 rounded font-mono">
                                GET /api/prayer/coordinates?latitude=48.8566&longitude=2.3522
                            </div>
                        </div>
                    </div>

                    {/* Calendrier */}
                    <div className="border-l-4 border-gold pl-4">
                        <h3 className="text-xl font-semibold text-navy mb-2">Calendrier Mensuel</h3>
                        <div className="space-y-2 text-sm">
                            <div className="bg-cream p-3 rounded font-mono">
                                GET /api/prayer/calendar?city=Paris&country=France&month=12&year=2025
                            </div>
                        </div>
                    </div>

                    {/* Méthodes de Calcul */}
                    <div className="border-l-4 border-gold pl-4">
                        <h3 className="text-xl font-semibold text-navy mb-2">Méthodes de Calcul</h3>
                        <div className="grid md:grid-cols-2 gap-3 text-sm">
                            <div className="bg-emerald-50 p-3 rounded">
                                <strong>1</strong> - University of Islamic Sciences, Karachi
                            </div>
                            <div className="bg-emerald-50 p-3 rounded">
                                <strong>2</strong> - Islamic Society of North America
                            </div>
                            <div className="bg-emerald-50 p-3 rounded">
                                <strong>3</strong> - Muslim World League
                            </div>
                            <div className="bg-emerald-50 p-3 rounded">
                                <strong>4</strong> - Umm Al-Qura University, Makkah
                            </div>
                            <div className="bg-emerald-50 p-3 rounded">
                                <strong>5</strong> - Egyptian General Authority
                            </div>
                            <div className="bg-emerald-50 p-3 rounded">
                                <strong>12</strong> - Union des Organisations Islamiques de France
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Guide de Recherche */}
            <div className="islamic-card p-6 bg-gradient-to-br from-emerald-50 to-gold-50">
                <h2 className="text-2xl font-bold text-emerald-dark mb-6 flex items-center gap-2">
                    <span>🔍</span>
                    Guide de Recherche
                </h2>

                <div className="space-y-4">
                    <div>
                        <h3 className="font-semibold text-navy mb-2">🌟 Recherche en Arabe</h3>
                        <p className="text-navy/70">
                            Utilisez l'alphabet arabe pour rechercher des sourates, versets, ou termes islamiques.
                            Exemple: <code className="bg-white px-2 py-1 rounded">البقرة</code>,
                            <code className="bg-white px-2 py-1 rounded">الصلاة</code>
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-navy mb-2">🌟 Recherche en Français</h3>
                        <p className="text-navy/70">
                            Recherchez par nom français ou phonétique.
                            Exemple: <code className="bg-white px-2 py-1 rounded">Baqara</code>,
                            <code className="bg-white px-2 py-1 rounded">Fatiha</code>
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-navy mb-2">🌟 Recherche par Numéro</h3>
                        <p className="text-navy/70">
                            Entrez le numéro de sourate (1-114) ou de verset.
                            Exemple: Sourate <code className="bg-white px-2 py-1 rounded">2</code> = Al-Baqara
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-navy mb-2">🌟 Filtres Avancés</h3>
                        <p className="text-navy/70">
                            Utilisez les filtres pour affiner votre recherche : type (notes/fatwas/topics/books),
                            langue, méthode de calcul pour les prières, etc.
                        </p>
                    </div>
                </div>
            </div>

            {/* Exemples d'Utilisation */}
            <div className="islamic-card p-6">
                <h2 className="text-2xl font-bold text-emerald-dark mb-6 flex items-center gap-2">
                    <span>💡</span>
                    Exemples d'Utilisation
                </h2>

                <div className="space-y-4">
                    <div className="bg-cream p-4 rounded-lg">
                        <h4 className="font-semibold text-navy mb-2">Exemple 1: Lire une sourate</h4>
                        <ol className="list-decimal list-inside text-navy/70 space-y-1">
                            <li>Aller sur la page "Quran"</li>
                            <li>Cliquer sur la sourate désirée</li>
                            <li>Choisir la langue (Arabe/Anglais)</li>
                            <li>Ajouter des versets aux favoris avec ⭐</li>
                        </ol>
                    </div>

                    <div className="bg-cream p-4 rounded-lg">
                        <h4 className="font-semibold text-navy mb-2">Exemple 2: Recherche d'une Fatwa</h4>
                        <ol className="list-decimal list-inside text-navy/70 space-y-1">
                            <li>Aller sur "Recherche Avancée"</li>
                            <li>Sélectionner type "Fatwas"</li>
                            <li>Entrer votre question en arabe ou français</li>
                            <li>Consulter les résultats pertinents</li>
                        </ol>
                    </div>

                    <div className="bg-cream p-4 rounded-lg">
                        <h4 className="font-semibold text-navy mb-2">Exemple 3: Horaires de Prière</h4>
                        <ol className="list-decimal list-inside text-navy/70 space-y-1">
                            <li>Aller sur "Horaires de Prière"</li>
                            <li>Entrer votre ville et pays</li>
                            <li>Choisir la méthode de calcul (UOIF pour France)</li>
                            <li>Consulter les horaires du jour</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
}
