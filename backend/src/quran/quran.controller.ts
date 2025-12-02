import { Controller, Get, Param, Query } from '@nestjs/common';
import { QuranService } from './quran.service';

@Controller('quran')
export class QuranController {
    constructor(private quranService: QuranService) { }

    @Get('surahs')
    getSurahs() {
        return this.quranService.getSurahs();
    }

    @Get('surahs/:id')
    getSurah(@Param('id') id: string) {
        return this.quranService.getSurah(Number(id));
    }

    @Get('surahs/:id/info')
    getSurahInfo(@Param('id') id: string) {
        return this.quranService.getSurahInfo(Number(id));
    }

    @Get('verses')
    getVerses(
        @Query('surah') surah: string,
        @Query('translation') translation?: string,
    ) {
        return this.quranService.getVerses(Number(surah), translation);
    }

    @Get('ayah')
    getAyah(
        @Query('surah') surah: string,
        @Query('ayah') ayah: string,
        @Query('edition') edition: string,
    ) {
        return this.quranService.getAyah(Number(surah), Number(ayah), edition);
    }

    @Get('search')
    search(
        @Query('query') query: string,
        @Query('type') type?: string,
    ) {
        if (!query) {
            throw new Error('Query parameter is required');
        }
        return this.quranService.search(query, type);
    }

    @Get('mushafs')
    getMushafs() {
        return this.quranService.getMushafs();
    }

    @Get('mushafs/:id')
    getMushaf(@Param('id') id: string) {
        return this.quranService.getMushaf(Number(id));
    }
}
