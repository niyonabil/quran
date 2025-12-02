import { useState, useEffect } from 'react';
import { adhanAudioService } from '@/lib/supabase';
import type { AdhanAudio } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

export function AdhanManagementPage() {
    const [adhanAudios, setAdhanAudios] = useState<AdhanAudio[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [showForm, setShowForm] = useState(false);

    // Form state
    const [muezzinName, setMuezzinName] = useState('');
    const [muezzinNameAr, setMuezzinNameAr] = useState('');
    const [location, setLocation] = useState('');
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [isDefault, setIsDefault] = useState(false);

    useEffect(() => {
        loadAdhanAudios();
    }, []);

    const loadAdhanAudios = async () => {
        try {
            const data = await adhanAudioService.getAll();
            setAdhanAudios(data);
        } catch (error) {
            console.error('Error loading adhan audios:', error);
            alert('Erreur lors du chargement des adhans');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.type.startsWith('audio/')) {
                setAudioFile(file);
            } else {
                alert('Veuillez sélectionner un fichier audio valide');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!audioFile || !muezzinName || !location) {
            alert('Veuillez remplir tous les champs requis');
            return;
        }

        setUploading(true);
        try {
            // Upload file
            const { url } = await adhanAudioService.uploadFile(audioFile, muezzinName);

            // Get file duration (approximate from size)
            const audioDuration = Math.floor(audioFile.size / 32000); // Approximate

            // Create database entry
            await adhanAudioService.create({
                muezzin_name: muezzinName,
                muezzin_name_ar: muezzinNameAr || '',
                location: location,
                file_url: url,
                file_size: audioFile.size,
                duration: audioDuration,
                is_default: isDefault
            });

            alert('Adhan ajouté avec succès!');

            // Reset form
            setMuezzinName('');
            setMuezzinNameAr('');
            setLocation('');
            setAudioFile(null);
            setIsDefault(false);
            setShowForm(false);

            // Reload list
            loadAdhanAudios();
        } catch (error) {
            console.error('Error uploading adhan:', error);
            alert('Erreur lors de l\'ajout de l\'adhan');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string, fileUrl: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cet adhan ?')) return;

        try {
            // Extract file path from URL
            const urlParts = fileUrl.split('/');
            const filePath = `adhan/${urlParts[urlParts.length - 1]}`;

            // Delete from storage
            await adhanAudioService.deleteFile(filePath);

            // Delete from database
            await adhanAudioService.delete(id);

            alert('Adhan supprimé avec succès');
            loadAdhanAudios();
        } catch (error) {
            console.error('Error deleting adhan:', error);
            alert('Erreur lors de la suppression');
        }
    };

    const toggleDefault = async (id: string, currentDefault: boolean) => {
        try {
            await adhanAudioService.update(id, { is_default: !currentDefault });
            loadAdhanAudios();
        } catch (error) {
            console.error('Error updating default:', error);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="text-6xl mb-4 animate-pulse">🔊</div>
                <h2 className="text-2xl font-bold text-emerald-dark">Chargement...</h2>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="islamic-card p-8 text-center bg-gradient-to-br from-emerald-50 via-cream to-gold-50">
                <div className="text-6xl mb-4">🔊</div>
                <h1 className="text-4xl font-bold gradient-text mb-2">
                    🕌 Gestion des Adhans
                </h1>
                <p className="text-xl text-navy">
                    Gérer les fichiers audio d'appel à la prière
                </p>
            </div>

            {/* Add Button */}
            <div className="flex justify-end">
                <Button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold"
                >
                    {showForm ? '❌ Annuler' : '➕ Ajouter un Adhan'}
                </Button>
            </div>

            {/* Upload Form */}
            {showForm && (
                <div className="islamic-card p-6">
                    <h2 className="text-2xl font-bold text-emerald-dark mb-4">
                        📤 Ajouter un nouvel Adhan
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-navy font-semibold mb-2">
                                Nom du Muezzin (EN) *
                            </label>
                            <input
                                type="text"
                                value={muezzinName}
                                onChange={(e) => setMuezzinName(e.target.value)}
                                required
                                className="w-full px-4 py-2 rounded-lg border-2 border-emerald-200 focus:border-emerald-500 focus:outline-none"
                                placeholder="Sheikh Abdullah Al-Zaili"
                            />
                        </div>

                        <div>
                            <label className="block text-navy font-semibold mb-2">
                                Nom du Muezzin (AR)
                            </label>
                            <input
                                type="text"
                                value={muezzinNameAr}
                                onChange={(e) => setMuezzinNameAr(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border-2 border-emerald-200 focus:border-emerald-500 focus:outline-none"
                                placeholder="الشيخ عبد الله الزيلعي"
                                dir="rtl"
                            />
                        </div>

                        <div>
                            <label className="block text-navy font-semibold mb-2">
                                Lieu *
                            </label>
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                required
                                className="w-full px-4 py-2 rounded-lg border-2 border-emerald-200 focus:border-emerald-500 focus:outline-none"
                                placeholder="Masjid Al-Haram, Makkah"
                            />
                        </div>

                        <div>
                            <label className="block text-navy font-semibold mb-2">
                                Fichier Audio (MP3) *
                            </label>
                            <input
                                type="file"
                                accept="audio/*"
                                onChange={handleFileChange}
                                required
                                className="w-full px-4 py-2 rounded-lg border-2 border-emerald-200 focus:border-emerald-500 focus:outline-none"
                            />
                            {audioFile && (
                                <p className="text-sm text-navy/70 mt-2">
                                    Fichier sélectionné: {audioFile.name} ({(audioFile.size / 1024 / 1024).toFixed(2)} MB)
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isDefault"
                                checked={isDefault}
                                onChange={(e) => setIsDefault(e.target.checked)}
                                className="w-4 h-4"
                            />
                            <label htmlFor="isDefault" className="text-navy">
                                Définir comme adhan par défaut
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={uploading}
                            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition"
                        >
                            {uploading ? '⏳ Téléchargement en cours...' : '✅ Ajouter l\'Adhan'}
                        </button>
                    </form>
                </div>
            )}

            {/* Adhan List */}
            <div className="islamic-card p-6">
                <h2 className="text-2xl font-bold text-emerald-dark mb-4">
                    📋 Liste des Adhans ({adhanAudios.length})
                </h2>

                {adhanAudios.length === 0 ? (
                    <div className="text-center py-8 text-navy/70">
                        Aucun adhan disponible. Ajoutez-en un!
                    </div>
                ) : (
                    <div className="space-y-4">
                        {adhanAudios.map((adhan) => (
                            <div
                                key={adhan.id}
                                className="bg-cream p-4 rounded-lg border-2 border-emerald-100 hover:border-emerald-300 transition"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="font-bold text-navy text-lg">
                                                {adhan.muezzin_name}
                                            </h3>
                                            {adhan.is_default && (
                                                <span className="bg-gold text-navy px-2 py-1 rounded text-xs font-semibold">
                                                    ⭐ PAR DÉFAUT
                                                </span>
                                            )}
                                        </div>
                                        {adhan.muezzin_name_ar && (
                                            <p className="text-emerald-700 arabic-text mb-2">
                                                {adhan.muezzin_name_ar}
                                            </p>
                                        )}
                                        <p className="text-sm text-navy/70">
                                            📍 {adhan.location}
                                        </p>
                                        {adhan.file_size && (
                                            <p className="text-xs text-navy/50 mt-1">
                                                💾 Taille: {(adhan.file_size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <audio
                                            src={adhan.file_url}
                                            controls
                                            className="w-64"
                                            preload="metadata"
                                        >
                                            Votre navigateur ne supporte pas l'élément audio.
                                        </audio>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => toggleDefault(adhan.id, adhan.is_default)}
                                                className="px-3 py-1 bg-gold hover:bg-gold-dark text-navy rounded text-sm font-semibold transition"
                                            >
                                                {adhan.is_default ? '⭐' : '☆'} Défaut
                                            </button>
                                            <button
                                                onClick={() => handleDelete(adhan.id, adhan.file_url)}
                                                className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm font-semibold transition"
                                            >
                                                🗑️ Supprimer
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Instructions */}
            <div className="islamic-card p-6 bg-blue-50 border-2 border-blue-200">
                <h3 className="font-bold text-navy mb-3">📚 Sources recommandées pour télécharger des MP3 d'Adhan :</h3>
                <ul className="list-disc list-inside space-y-2 text-navy/80">
                    <li><strong>IslamicFinder.org</strong> - Section Audio/Adhan</li>
                    <li><strong>Archive.org</strong> - Collection islamique (rechercher "adhan")</li>
                    <li><strong>YouTube to MP3</strong> - Convertir des adhans célèbres</li>
                    <li><strong>Dar Al-Islam</strong> - Ressources audio officielles</li>
                </ul>

                <h3 className="font-bold text-navy mt-4 mb-2">🎙️ Muezzins recommandés:</h3>
                <ul className="list-disc list-inside space-y-1 text-navy/80">
                    <li>Sheikh Abdullah Al-Zaili (Masjid Al-Haram, Makkah)</li>
                    <li>Sheikh Ali Ahmed Mulla (Masjid Al-Nabawi, Madinah)</li>
                    <li>Sheikh Mansour Al-Zahrani (Makkah)</li>
                    <li>Sheikh Hamad Deghreri (Madinah)</li>
                    <li>Sheikh Mishary Al-Khamis (Koweït)</li>
                </ul>
            </div>
        </div>
    );
}
