export function SettingsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Settings
                </h1>
                <p className="text-gray-600 mt-2">Configure system settings and preferences</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">⚙️</div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">Settings Coming Soon</h2>
                    <p className="text-gray-600">
                        System settings and configuration options will be available here.
                    </p>
                </div>
            </div>
        </div>
    );
}
