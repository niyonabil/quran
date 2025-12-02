import { Card, CardHeader, CardContent } from '../components/ui/card';
import { Settings as SettingsIcon, Key, FileText, Database } from 'lucide-react';
import { SettingsPage as OldSettings } from './Settings';

export function SystemPage() {
    const [activeTab, setActiveTab] = useState<'settings' | 'api' | 'logs' | 'backups'>('settings');

    const tabs = [
        { id: 'settings', label: 'Paramètres', icon: SettingsIcon },
        { id: 'api', label: 'Clés API', icon: Key },
        { id: 'logs', label: 'Logs', icon: FileText },
        { id: 'backups', label: 'Sauvegardes', icon: Database },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Système</h1>
                <p className="text-gray-600 mt-2">Configuration et administration du système</p>
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
                {activeTab === 'settings' && <OldSettings />}

                {activeTab === 'api' && (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <Key size={48} className="mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Gestion des Clés API
                            </h3>
                            <p className="text-gray-600 mb-4">Fonctionnalité disponible prochainement</p>
                        </CardContent>
                    </Card>
                )}

                {activeTab === 'logs' && (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Logs Système
                            </h3>
                            <p className="text-gray-600 mb-4">Fonctionnalité disponible prochainement</p>
                        </CardContent>
                    </Card>
                )}

                {activeTab === 'backups' && (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <Database size={48} className="mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Sauvegardes
                            </h3>
                            <p className="text-gray-600 mb-4">Fonctionnalité disponible prochainement</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}

import { useState } from 'react';
