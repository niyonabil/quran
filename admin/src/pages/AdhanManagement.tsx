import { useState, useEffect } from 'react';
import { adhanAudioService, type AdhanAudio } from '../lib/supabase';

export function AdhanManagementPage() {
    const [adhans, setAdhans] = useState<AdhanAudio[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [reciterName, setReciterName] = useState('');
    const [playingUrl, setPlayingUrl] = useState<string | null>(null);

    useEffect(() => {
        loadAdhans();
    }, []);

    const loadAdhans = async () => {
        try {
            const data = await adhanAudioService.getAll();
            setAdhans(data);
        } catch (error) {
            console.error('Error loading adhans:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile || !reciterName) return;

        setUploading(true);
        try {
            await adhanAudioService.uploadFile(selectedFile, reciterName);
            setSelectedFile(null);
            setReciterName('');
            await loadAdhans();
            alert('Adhan uploaded successfully!');
        } catch (error: any) {
            alert('Error uploading Adhan: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string, fileUrl: string) => {
        if (!confirm('Are you sure you want to delete this Adhan?')) return;

        try {
            await adhanAudioService.delete(id, fileUrl);
            await loadAdhans();
        } catch (error: any) {
            alert('Error deleting Adhan: ' + error.message);
        }
    };

    const handleSetDefault = async (id: string) => {
        try {
            await adhanAudioService.setDefault(id);
            await loadAdhans();
        } catch (error: any) {
            alert('Error setting default: ' + error.message);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="text-6xl mb-4 animate-pulse">🔔</div>
                    <p className="text-gray-600">Loading Adhans...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    Adhan Management
                </h1>
                <p className="text-gray-600 mt-2">Upload and manage Adhan audio files</p>
            </div>

            {/* Upload Form */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Upload New Adhan</h2>
                <form onSubmit={handleUpload} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Reciter Name
                            </label>
                            <input
                                type="text"
                                value={reciterName}
                                onChange={(e) => setReciterName(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                placeholder="e.g., Sheikh Abdul Basit"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Audio File (MP3)
                            </label>
                            <input
                                type="file"
                                accept="audio/mp3,audio/mpeg"
                                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={uploading || !selectedFile || !reciterName}
                        className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {uploading ? 'Uploading...' : '📤 Upload Adhan'}
                    </button>
                </form>
            </div>

            {/* Adhans List */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-2xl font-semibold text-gray-800">Uploaded Adhans</h2>
                    <p className="text-sm text-gray-500 mt-1">{adhans.length} total adhans</p>
                </div>

                <div className="divide-y divide-gray-100">
                    {adhans.map((adhan) => (
                        <div key={adhan.id} className="p-6 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="text-3xl">🔔</div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-gray-800">{adhan.reciter_name}</h3>
                                            {adhan.is_default && (
                                                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                                                    Default
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">{adhan.name}</p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Uploaded {new Date(adhan.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setPlayingUrl(playingUrl === adhan.file_url ? null : adhan.file_url)}
                                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium text-sm"
                                    >
                                        {playingUrl === adhan.file_url ? '⏸️ Pause' : '▶️ Play'}
                                    </button>

                                    {!adhan.is_default && (
                                        <button
                                            onClick={() => handleSetDefault(adhan.id)}
                                            className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors font-medium text-sm"
                                        >
                                            Set Default
                                        </button>
                                    )}

                                    <button
                                        onClick={() => handleDelete(adhan.id, adhan.file_url)}
                                        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium text-sm"
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>
                            </div>

                            {playingUrl === adhan.file_url && (
                                <div className="mt-4">
                                    <audio
                                        src={adhan.file_url}
                                        controls
                                        autoPlay
                                        className="w-full"
                                        onEnded={() => setPlayingUrl(null)}
                                    />
                                </div>
                            )}
                        </div>
                    ))}

                    {adhans.length === 0 && (
                        <div className="p-12 text-center text-gray-500">
                            <div className="text-6xl mb-4">🔔</div>
                            <p>No Adhans uploaded yet</p>
                            <p className="text-sm mt-2">Upload your first Adhan audio file above</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
