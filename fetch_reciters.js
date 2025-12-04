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

async function generateReciters() {
    try {
        console.log('Fetching ayah reciters...');
        const ayahData = await fetchJson('https://cdn.islamic.network/quran/info/by-ayah/info.json');

        console.log('Fetching surah reciters...');
        const surahData = await fetchJson('https://cdn.islamic.network/quran/info/by-surah/info.json');

        const ayahReciters = ayahData.map(r => ({
            identifier: r.identifier,
            name: r.englishName,
            language: r.language,
            englishName: r.englishName
        }));

        const surahReciters = surahData.map(r => ({
            identifier: r.identifier,
            name: r.englishName
        }));

        const content = `export const AYAH_RECITERS = ${JSON.stringify(ayahReciters, null, 2)};\n\nexport const FULL_QURAN_RECITERS = ${JSON.stringify(surahReciters, null, 2)};`;

        const outputPath = path.join('e:', 'quran', 'quran', 'mobile', 'src', 'constants', 'reciters.ts');
        // Ensure directory exists
        const dir = path.dirname(outputPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(outputPath, content);
        console.log(`Successfully generated reciters.ts at ${outputPath}`);
        console.log(`Total Ayah Reciters: ${ayahReciters.length}`);
        console.log(`Total Surah Reciters: ${surahReciters.length}`);

    } catch (error) {
        console.error('Error:', error);
    }
}

generateReciters();
