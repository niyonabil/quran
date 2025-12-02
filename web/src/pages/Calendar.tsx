import { useState, useEffect } from 'react';

interface HijriDate {
    day: number;
    month: {
        number: number;
        en: string;
        ar: string;
    };
    year: number;
    weekday: {
        en: string;
        ar: string;
    };
}

interface GregorianDate {
    day: number;
    month: {
        number: number;
        en: string;
    };
    year: number;
}

const HIJRI_MONTHS = [
    { number: 1, ar: 'المحرم', en: 'Muharram' },
    { number: 2, ar: 'صفر', en: 'Safar' },
    { number: 3, ar: 'ربيع الأول', en: 'Rabi\' al-Awwal' },
    { number: 4, ar: 'ربيع الثاني', en: 'Rabi\' al-Thani' },
    { number: 5, ar: 'جمادى الأولى', en: 'Jumada al-Ula' },
    { number: 6, ar: 'جمادى الآخرة', en: 'Jumada al-Akhirah' },
    { number: 7, ar: 'رجب', en: 'Rajab' },
    { number: 8, ar: 'شعبان', en: 'Sha\'ban' },
    { number: 9, ar: 'رمضان', en: 'Ramadan' },
    { number: 10, ar: 'شوال', en: 'Shawwal' },
    { number: 11, ar: 'ذو القعدة', en: 'Dhu al-Qi\'dah' },
    { number: 12, ar: 'ذو الحجة', en: 'Dhu al-Hijjah' },
];

const ISLAMIC_EVENTS = [
    { month: 1, day: 1, name: 'رأس السنة الهجرية', translation: 'Islamic New Year' },
    { month: 1, day: 10, name: 'عاشوراء', translation: 'Day of Ashura' },
    { month: 3, day: 12, name: 'المولد النبوي', translation: 'Mawlid al-Nabi (Prophet\'s Birthday)' },
    { month: 7, day: 27, name: 'الإسراء والمعراج', translation: 'Isra and Mi\'raj' },
    { month: 8, day: 15, name: 'ليلة البراءة', translation: 'Laylat al-Bara\'ah' },
    { month: 9, day: 1, name: 'بداية رمضان', translation: 'Start of Ramadan' },
    { month: 9, day: 27, name: 'ليلة القدر', translation: 'Laylat al-Qadr' },
    { month: 10, day: 1, name: 'عيد الفطر', translation: 'Eid al-Fitr' },
    { month: 12, day: 9, name: 'يوم عرفة', translation: 'Day of Arafah' },
    { month: 12, day: 10, name: 'عيد الأضحى', translation: 'Eid al-Adha' },
];

export function CalendarPage() {
    const [hijriDate, setHijriDate] = useState<HijriDate | null>(null);
    const [gregorianDate, setGregorianDate] = useState<GregorianDate | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
    const [ramadanDates, setRamadanDates] = useState<any[]>([]);

    useEffect(() => {
        fetchTodayDate();
    }, []);

    const fetchTodayDate = async () => {
        try {
            const response = await fetch('https://api.aladhan.com/v1/gToH');
            const data = await response.json();

            if (data.code === 200) {
                setHijriDate(data.data.hijri);
                setGregorianDate(data.data.gregorian);
            }
        } catch (error) {
            console.error('Error fetching date:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRamadanCalendar = async (year: number) => {
        try {
            // Fetch Ramadan calendar for the given Hijri year
            const response = await fetch(`https://api.aladhan.com/v1/hijriCalendar/9/${year}`);
            const data = await response.json();

            if (data.code === 200) {
                setRamadanDates(data.data);
            }
        } catch (error) {
            console.error('Error fetching Ramadan calendar:', error);
        }
    };

    useEffect(() => {
        if (hijriDate) {
            fetchRamadanCalendar(hijriDate.year);
        }
    }, [hijriDate]);

    const getEventsForMonth = (monthNumber: number) => {
        return ISLAMIC_EVENTS.filter(event => event.month === monthNumber);
    };

    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="text-4xl mb-4">📅</div>
                <p className="text-navy/70">Chargement du calendrier...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="islamic-card p-8 text-center bg-gradient-to-br from-emerald-50 via-cream to-gold-50">
                <div className="text-6xl mb-4">🌙</div>
                <h1 className="text-4xl font-bold gradient-text mb-4">
                    التقويم الإسلامي
                </h1>
                <p className="text-xl text-navy mb-2">
                    Calendrier Islamique (Hijri)
                </p>
            </div>

            {/* Today's Date */}
            {hijriDate && gregorianDate && (
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Hijri Date */}
                    <div className="islamic-card p-8 text-center bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                        <div className="text-5xl mb-4">☪️</div>
                        <h2 className="text-2xl font-bold mb-4">التاريخ الهجري</h2>
                        <div className="space-y-2">
                            <p className="text-4xl font-bold arabic-text">
                                {hijriDate.day} {hijriDate.month.ar} {hijriDate.year}
                            </p>
                            <p className="text-xl opacity-90">
                                {hijriDate.weekday.en}, {hijriDate.day} {hijriDate.month.en} {hijriDate.year} AH
                            </p>
                        </div>
                    </div>

                    {/* Gregorian Date */}
                    <div className="islamic-card p-8 text-center bg-gradient-to-br from-gold to-gold-dark text-navy">
                        <div className="text-5xl mb-4">📅</div>
                        <h2 className="text-2xl font-bold mb-4">التاريخ الميلادي</h2>
                        <div className="space-y-2">
                            <p className="text-4xl font-bold">
                                {gregorianDate.day} {gregorianDate.month.en} {gregorianDate.year}
                            </p>
                            <p className="text-xl">
                                {gregorianDate.day}/{gregorianDate.month.number}/{gregorianDate.year}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Hijri Months */}
            <div className="islamic-card p-6">
                <h2 className="text-2xl font-bold text-emerald-dark mb-6 flex items-center gap-2">
                    <span>📖</span>
                    الأشهر الهجرية - Mois Hijri
                </h2>
                <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {HIJRI_MONTHS.map((month) => {
                        const events = getEventsForMonth(month.number);
                        const isCurrentMonth = hijriDate?.month.number === month.number;

                        return (
                            <div
                                key={month.number}
                                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${isCurrentMonth
                                    ? 'bg-emerald-100 border-emerald-500 ring-2 ring-emerald-300'
                                    : selectedMonth === month.number
                                        ? 'bg-gold-50 border-gold-dark'
                                        : 'bg-cream border-navy/20 hover:border-emerald-300'
                                    }`}
                                onClick={() => setSelectedMonth(month.number === selectedMonth ? null : month.number)}
                            >
                                <div className="font-bold text-xl arabic-text text-emerald-dark mb-1">
                                    {month.ar}
                                </div>
                                <div className="text-sm text-navy/70 mb-2">
                                    {month.en}
                                </div>
                                {isCurrentMonth && (
                                    <div className="text-xs bg-emerald-500 text-white px-2 py-1 rounded-full inline-block">
                                        Mois actuel
                                    </div>
                                )}
                                {events.length > 0 && (
                                    <div className="mt-2 text-xs text-amber-700 font-semibold">
                                        🌟 {events.length} événement(s)
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Selected Month Events */}
                {selectedMonth && (
                    <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                        <h3 className="font-bold text-amber-800 mb-3">
                            Événements - {HIJRI_MONTHS.find(m => m.number === selectedMonth)?.ar}
                        </h3>
                        <div className="space-y-2">
                            {getEventsForMonth(selectedMonth).map((event, index) => (
                                <div key={index} className="p-3 bg-white rounded border border-amber-100">
                                    <div className="font-semibold arabic-text text-emerald-dark">
                                        {event.day} {HIJRI_MONTHS.find(m => m.number === event.month)?.ar} - {event.name}
                                    </div>
                                    <div className="text-sm text-navy/70">
                                        {event.translation}
                                    </div>
                                </div>
                            ))}
                            {getEventsForMonth(selectedMonth).length === 0 && (
                                <p className="text-sm text-navy/60">Aucun événement majeur ce mois-ci</p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Ramadan Calendar */}
            {ramadanDates.length > 0 && (
                <div className="islamic-card p-6 bg-gradient-to-br from-purple-50 to-pink-50">
                    <h2 className="text-2xl font-bold text-purple-900 mb-6 flex items-center gap-2">
                        <span>🌙</span>
                        رمضان - Calendrier du Ramadan {hijriDate?.year}
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                        {ramadanDates.map((day, index) => (
                            <div
                                key={index}
                                className={`p-3 rounded-lg border ${index + 1 === 27
                                    ? 'bg-gradient-to-br from-amber-100 to-amber-200 border-amber-500'
                                    : 'bg-white border-purple-200'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-bold text-purple-900">
                                            {index + 1} رمضان
                                        </div>
                                        <div className="text-xs text-navy/60">
                                            {day.gregorian.date}
                                        </div>
                                    </div>
                                    {index + 1 === 27 && (
                                        <div className="text-2xl">✨</div>
                                    )}
                                </div>
                                {index + 1 === 27 && (
                                    <div className="text-xs font-semibold text-amber-800 mt-1">
                                        ليلة القدر - Laylat al-Qadr
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Islamic Events List */}
            <div className="islamic-card p-6">
                <h2 className="text-2xl font-bold text-emerald-dark mb-6 flex items-center gap-2">
                    <span>⭐</span>
                    الأحداث الإسلامية - Événements Islamiques
                </h2>
                <div className="space-y-3">
                    {ISLAMIC_EVENTS.map((event, index) => (
                        <div
                            key={index}
                            className="p-4 bg-gradient-to-r from-emerald-50 to-cream rounded-lg border border-emerald-200"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="font-bold text-lg arabic-text text-emerald-dark">
                                        {event.name}
                                    </div>
                                    <div className="text-navy/70 mb-1">
                                        {event.translation}
                                    </div>
                                    <div className="text-sm text-navy/60">
                                        {event.day} {HIJRI_MONTHS.find(m => m.number === event.month)?.ar} ({HIJRI_MONTHS.find(m => m.number === event.month)?.en})
                                    </div>
                                </div>
                                <div className="text-3xl">
                                    {event.month === 9 ? '🌙' : event.month === 10 || event.month === 12 ? '🎉' : '⭐'}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
