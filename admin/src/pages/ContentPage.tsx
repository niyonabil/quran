import { useState } from 'react';
import { Card, CardHeader, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { FileText, Upload, Music } from 'lucide-react';
import { AdhanManagementPage } from './AdhanManagement';

export function ContentPage() {
    const [activeTab, setActiveTab] = useState<'adhan' | 'translations' | 'reciters'>('adhan');

    const tabs = [
        { id: 'adhan', label: 'Gestion Adhan', icon: Music },
        { id: 'translations', label: 'Traductions', icon: FileText },
        { id: 'reciters', label: 'Récitateurs', icon: Upload },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Gestion du Contenu</h1>
                <p className="text-gray-600 mt-2">Gérer les fichiers audio, traductions et récitateurs</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${activeTab === tab.id
                                    ? 'border-indigo-600 text-indigo-600 font-medium'
                                    : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <Icon size={18} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Tab Content */}
            <div>
                {activeTab === 'adhan' && <AdhanManagementPage />}

                {activeTab === 'translations' && (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Gestion des Traductions
                            </h3>
                            <p className="text-gray-600 mb-4">Fonctionnalité disponible prochainement</p>
                        </CardContent>
                    </Card>
                )}

                {activeTab === 'reciters' && (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Gestion des Récitateurs
                            </h3>
                            <p className="text-gray-600 mb-4">Fonctionnalité disponible prochainement</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
