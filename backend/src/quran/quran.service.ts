import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class QuranService {
    private readonly quranPediaUrl = 'https://api.quranpedia.net/v1';
    private readonly alQuranUrl = 'http://api.alquran.cloud/v1';

    // Using AlQuran.cloud for stable surah/verse data
    async getSurahs() {
        try {
            const response = await axios.get(`${this.alQuranUrl}/surah`);
            return response.data;
        } catch (error) {
            console.error('Error fetching surahs:', error);
            throw new Error('Failed to fetch surahs');
        }
    }

    async getSurah(id: number) {
        try {
            const response = await axios.get(`${this.alQuranUrl}/surah/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching surah ${id}:`, error);
            throw new Error(`Failed to fetch surah ${id}`);
        }
    }

    async getVerses(surah: number, translation?: string) {
        try {
            // Default to Arabic if no translation specified
            const edition = translation || 'ar.alafasy';
            const response = await axios.get(`${this.alQuranUrl}/surah/${surah}/${edition}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching verses for surah ${surah}:`, error);
            throw new Error(`Failed to fetch verses for surah ${surah}`);
        }
    }

    // NEW: Get specific Ayah (useful for Tafsir)
    async getAyah(surah: number, ayah: number, edition: string) {
        try {
            const response = await axios.get(`${this.alQuranUrl}/ayah/${surah}:${ayah}/${edition}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching ayah ${surah}:${ayah}:`, error);
            throw new Error(`Failed to fetch ayah`);
        }
    }

    // Using QuranPedia for advanced search features
    async search(query: string, type?: string) {
        try {
            const encodedQuery = encodeURIComponent(query);
            const url = type
                ? `${this.quranPediaUrl}/search/${encodedQuery}/${type}`
                : `${this.quranPediaUrl}/search/${encodedQuery}/`;
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            console.error('Error in search:', error);
            throw new Error('Failed to search');
        }
    }

    // Using QuranPedia for Mushafs
    async getMushafs() {
        try {
            const response = await axios.get(`${this.quranPediaUrl}/mushafs`);
            return response.data;
        } catch (error) {
            console.error('Error fetching mushafs:', error);
            throw new Error('Failed to fetch mushafs');
        }
    }

    async getMushaf(mushafId: number) {
        try {
            const response = await axios.get(`${this.quranPediaUrl}/mushafs/${mushafId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching mushaf ${mushafId}:`, error);
            throw new Error(`Failed to fetch mushaf ${mushafId}`);
        }
    }

    async getSurahInfo(surahNumber: number) {
        try {
            const response = await axios.get(`${this.quranPediaUrl}/surah/information/${surahNumber}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching surah info ${surahNumber}:`, error);
            throw new Error(`Failed to fetch surah info ${surahNumber}`);
        }
    }
}
