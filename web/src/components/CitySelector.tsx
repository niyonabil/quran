import { Label } from '@/components/ui/label';
import citiesData from '@/data/cities.json';

interface CitySelectorProps {
    city: string;
    country: string;
    onCityChange: (city: string) => void;
    onCountryChange: (country: string) => void;
}

// Sort cities alphabetically
const CITIES = citiesData.sort((a, b) => a.name.localeCompare(b.name));

export function CitySelector({ city, onCityChange, onCountryChange }: CitySelectorProps) {
    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value;
        if (selectedValue === 'custom') return;

        const selectedCity = CITIES.find(c => c.name === selectedValue);
        if (selectedCity) {
            onCityChange(selectedCity.name);
            onCountryChange(selectedCity.country);
        }
    };

    // Check if current city is in the list
    const isCustomCity = !CITIES.some(c => c.name === city);

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
                    {CITIES.map((c) => (
                        <option key={`${c.name}-${c.country}`} value={c.name}>
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
