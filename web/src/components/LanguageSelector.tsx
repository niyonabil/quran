import { Label } from '@/components/ui/label';

interface LanguageSelectorProps {
    language: string;
    onLanguageChange: (lang: string) => void;
}

const LANGUAGES = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
];

export function LanguageSelector({ language, onLanguageChange }: LanguageSelectorProps) {
    return (
        <div className="space-y-2">
            <Label>Langue de l'interface</Label>
            <div className="flex gap-2">
                {LANGUAGES.map((lang) => (
                    <button
                        key={lang.code}
                        onClick={() => onLanguageChange(lang.code)}
                        className={`flex-1 py-2 px-3 rounded-lg border transition-all flex items-center justify-center gap-2 ${language === lang.code
                            ? 'bg-emerald-500 text-white border-emerald-600 shadow-md'
                            : 'bg-white text-navy border-gray-200 hover:border-emerald-300 hover:bg-emerald-50'
                            }`}
                    >
                        <span className="text-xl">{lang.flag}</span>
                        <span className={`font-medium ${lang.code === 'ar' ? 'font-arabic' : ''}`}>
                            {lang.name}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
