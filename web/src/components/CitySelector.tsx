import { Label } from '@/components/ui/label';

interface CitySelectorProps {
    city: string;
    country: string;
    onCityChange: (city: string) => void;
    onCountryChange: (country: string) => void;
}

const POPULAR_CITIES = [
    { name: 'Paris', country: 'FR', label: 'Paris, France' },
    { name: 'Lyon', country: 'FR', label: 'Lyon, France' },
    { name: 'Marseille', country: 'FR', label: 'Marseille, France' },
    { name: 'London', country: 'GB', label: 'London, UK' },
    { name: 'New York', country: 'US', label: 'New York, USA' },
    { name: 'Mecca', country: 'SA', label: 'Mecca, Saudi Arabia' },
    { name: 'Medina', country: 'SA', label: 'Medina, Saudi Arabia' },
    { name: 'Cairo', country: 'EG', label: 'Cairo, Egypt' },
    { name: 'Istanbul', country: 'TR', label: 'Istanbul, Turkey' },
    { name: 'Dubai', country: 'AE', label: 'Dubai, UAE' },
    { name: 'Jakarta', country: 'ID', label: 'Jakarta, Indonesia' },
    { name: 'Casablanca', country: 'MA', label: 'Casablanca, Morocco' },
    { name: 'Rabat', country: 'MA', label: 'Rabat, Morocco' },
    { name: 'Algiers', country: 'DZ', label: 'Algiers, Algeria' },
    { name: 'Tunis', country: 'TN', label: 'Tunis, Tunisia' },
    { name: 'Dakar', country: 'SN', label: 'Dakar, Senegal' },
    { name: 'Berlin', country: 'DE', label: 'Berlin, Germany' },
    { name: 'Brussels', country: 'BE', label: 'Brussels, Belgium' },
    { name: 'Geneva', country: 'CH', label: 'Geneva, Switzerland' },
];

export function CitySelector({ city, country, onCityChange, onCountryChange }: CitySelectorProps) {
    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value;
        if (selectedValue === 'custom') return; // Handle custom logic if needed, or just ignore

        const selectedCity = POPULAR_CITIES.find(c => c.name === selectedValue);
        if (selectedCity) {
            onCityChange(selectedCity.name);
            onCountryChange(selectedCity.country);
        }
    };

    // Check if current city is in the list
    const isCustomCity = !POPULAR_CITIES.some(c => c.name === city);

    return (
        <div className="space-y-4">
            <div>
                <Label htmlFor="city-select">Ville</Label>
                <select
                    id="city-select"
                    value={isCustomCity ? 'custom' : city}
                    onChange={handleCityChange}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                >
                    <option value="" disabled>Sélectionner une ville</option>
                    {POPULAR_CITIES.map((c) => (
                        <option key={c.name} value={c.name}>
                            {c.label}
                        </option>
                    ))}
                    {isCustomCity && city && (
                        <option value="custom">{city} (Personnalisé)</option>
                    )}
                </select>
            </div>
        </div>
    );
}
