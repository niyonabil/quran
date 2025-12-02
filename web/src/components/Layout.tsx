import { Link, Outlet, useNavigate } from 'react-router-dom';

export function Layout() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-cream">
            {/* Islamic Header with Ornament */}
            <header className="bg-white border-b-4 border-emerald shadow-md">
                <div className="container mx-auto px-4 py-4">
                    {/* Bismillah */}
                    <div className="bismillah-header">
                        بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                    </div>

                    {/* Navigation */}
                    <nav className="flex items-center justify-between mt-4">
                        <Link to="/" className="text-2xl font-bold gradient-text flex items-center gap-2">
                            <span className="text-3xl">🕌</span>
                            <span>Quran App</span>
                        </Link>

                        <div className="flex items-center gap-6">
                            <Link
                                to="/"
                                className="text-navy hover:text-emerald transition-colors font-medium"
                            >
                                🏠 Accueil
                            </Link>
                            <Link
                                to="/quran"
                                className="text-navy hover:text-emerald transition-colors font-medium"
                            >
                                📖 Quran
                            </Link>
                            <Link
                                to="/quran-player"
                                className="text-navy hover:text-emerald transition-colors font-medium"
                            >
                                🎵 Lecteur
                            </Link>
                            <Link
                                to="/search"
                                className="text-navy hover:text-emerald transition-colors font-medium"
                            >
                                🔍 Recherche
                            </Link>
                            <Link
                                to="/mushafs"
                                className="text-navy hover:text-emerald transition-colors font-medium"
                            >
                                🎙️ Récitations
                            </Link>
                            <Link
                                to="/adhan"
                                className="text-navy hover:text-emerald transition-colors font-medium"
                            >
                                🔊 Adhan
                            </Link>
                            <Link
                                to="/calendar"
                                className="text-navy hover:text-emerald transition-colors font-medium"
                            >
                                📅 Calendrier
                            </Link>
                            <Link
                                to="/prayer"
                                className="text-navy hover:text-emerald transition-colors font-medium"
                            >
                                🕌 Prière
                            </Link>
                            <Link
                                to="/documentation"
                                className="text-navy hover:text-emerald transition-colors font-medium"
                            >
                                📚 Docs
                            </Link>

                            {token ? (
                                <>
                                    <Link
                                        to="/profile"
                                        className="text-navy hover:text-emerald transition-colors font-medium"
                                    >
                                        👤 Profil
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="px-4 py-2 bg-emerald text-white rounded-lg hover:bg-emerald-dark transition-all hover-glow"
                                    >
                                        Déconnexion
                                    </button>
                                </>
                            ) : (
                                <Link
                                    to="/login"
                                    className="px-4 py-2 bg-gold text-navy rounded-lg hover:bg-gold-dark transition-all hover-glow font-semibold"
                                >
                                    Se connecter
                                </Link>
                            )}
                        </div>
                    </nav>
                </div>
            </header>

            {/* Main Content with Islamic Pattern */}
            <main className="container mx-auto px-4 py-8 islamic-pattern min-h-[calc(100vh-200px)]">
                <div className="animate-fade-in">
                    <Outlet />
                </div>
            </main>

            {/* Footer with Islamic Design */}
            <footer className="bg-navy text-cream py-8 mt-12">
                <div className="container mx-auto px-4 text-center">
                    <div className="ornament-divider mb-4">
                        <span className="text-lg font-semibold">Quran & Prayer Times</span>
                    </div>
                    <p className="text-sm opacity-80">
                        © 2025 - Plateforme Islamique Moderne
                    </p>
                    <p className="text-xs mt-2 opacity-60">
                        Powered by QuranPedia API & AlAdhan API
                    </p>
                </div>
            </footer>
        </div>
    );
}
