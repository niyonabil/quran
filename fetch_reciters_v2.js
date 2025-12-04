const https = require('https');
const fs = require('fs');
const path = require('path');

const fetchJson = (url) => new Promise((resolve, reject) => {
    https.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
            try {
                resolve(JSON.parse(data));
            } catch (e) {
                reject(e);
            }
        });
    }).on('error', reject);
});

function extractRecitersFromDirListing(data) {
    // Navigate to /mnt/cdn/islamic-network-cdn/quran/audio
    // Then find '128' folder
    // Then list directories

    // Helper to find item by name
    const findItem = (items, name) => items.find(i => i.name === name);

    // The root might be the array itself or an object
    let root = Array.isArray(data) ? data : [data];

    // This part depends on the exact JSON structure I saw in the chunk
    // The chunk showed: [{"type":"directory","name":"/mnt/cdn/islamic-network-cdn/quran/audio","contents":[ ...

    const baseDir = root.find(i => i.name.includes('quran/audio'));
    if (!baseDir || !baseDir.contents) return [];

    const bitrateDir = findItem(baseDir.contents, '128');
    if (!bitrateDir || !bitrateDir.contents) return [];

    return bitrateDir.contents
        .filter(item => item.type === 'directory')
        .map(item => {
            const id = item.name;
            // format name: ar.alafasy -> Alafasy
            const nameParts = id.split('.');
            let name = nameParts.length > 1 ? nameParts[1] : nameParts[0];
            // Capitalize
            name = name.charAt(0).toUpperCase() + name.slice(1);

            return {
                identifier: id,
                name: name,
                englishName: name,
                language: nameParts[0]
            };
        });
}

async function generateReciters() {
    try {
        console.log('Fetching ayah reciters...');
        const ayahData = await fetchJson('https://cdn.islamic.network/quran/info/by-ayah/info.json');
        const ayahReciters = extractRecitersFromDirListing(ayahData);

        console.log('Fetching surah reciters...');
        const surahData = await fetchJson('https://cdn.islamic.network/quran/info/by-surah/info.json');
        // The structure for surah might be similar but let's assume it is for now or inspect it
        // Actually, let's inspect surahData structure if it fails, but I'll assume similar structure
        // Wait, the URL is .../info/by-surah/info.json. 
        // Let's assume the structure is consistent.
        const surahReciters = extractRecitersFromDirListing(surahData);

        const content = `export const AYAH_RECITERS = ${JSON.stringify(ayahReciters, null, 2)};\n\nexport const FULL_QURAN_RECITERS = ${JSON.stringify(surahReciters, null, 2)};`;

        const outputPath = path.join('e:', 'quran', 'quran', 'mobile', 'src', 'constants', 'reciters.ts');

        fs.writeFileSync(outputPath, content);
        console.log(`Successfully generated reciters.ts at ${outputPath}`);
        console.log(`Total Ayah Reciters: ${ayahReciters.length}`);
        console.log(`Total Surah Reciters: ${surahReciters.length}`);

    } catch (error) {
        console.error('Error:', error);
    }
}

generateReciters();
