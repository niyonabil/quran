import { createClient } from '@supabase/supabase-js';
// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not found. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database
export interface AdhanAudio {
    id: string;
    muezzin_name: string;
    muezzin_name_ar: string;
    location: string;
    file_url: string;
    file_size: number;
    duration: number;
    is_default: boolean;
    created_at: string;
    updated_at: string;
}

export interface PrayerTime {
    id: string;
    user_id: string;
    city: string;
    country: string;
    method: number;
    adhan_audio_id: string | null;
    notifications_enabled: boolean;
    created_at: string;
    updated_at: string;
}

// Adhan Audio CRUD operations
export const adhanAudioService = {
    // Get all adhan audios
    async getAll() {
        const { data, error } = await supabase
            .from('adhan_audios')
            .select('*')
            .order('is_default', { ascending: false })
            .order('muezzin_name');

        if (error) throw error;
        return data as AdhanAudio[];
    },

    // Get by ID
    async getById(id: string) {
        const { data, error } = await supabase
            .from('adhan_audios')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data as AdhanAudio;
    },

    // Create new adhan audio
    async create(adhanAudio: Omit<AdhanAudio, 'id' | 'created_at' | 'updated_at'>) {
        const { data, error } = await supabase
            .from('adhan_audios')
            .insert(adhanAudio)
            .select()
            .single();

        if (error) throw error;
        return data as AdhanAudio;
    },

    // Update adhan audio
    async update(id: string, updates: Partial<AdhanAudio>) {
        const { data, error } = await supabase
            .from('adhan_audios')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as AdhanAudio;
    },

    // Delete adhan audio
    async delete(id: string) {
        const { error } = await supabase
            .from('adhan_audios')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // Upload audio file to Supabase Storage
    async uploadFile(file: File, muezzinName: string) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${muezzinName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.${fileExt}`;
        const filePath = `adhan/${fileName}`;

        const { data, error } = await supabase.storage
            .from('audio-files')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) throw error;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('audio-files')
            .getPublicUrl(filePath);

        return { path: data.path, url: publicUrl };
    },

    // Delete file from storage
    async deleteFile(filePath: string) {
        const { error } = await supabase.storage
            .from('audio-files')
            .remove([filePath]);

        if (error) throw error;
    }
};

// Prayer Times CRUD operations
export const prayerTimesService = {
    // Get user's prayer time settings
    async getUserSettings(userId: string) {
        const { data, error } = await supabase
            .from('prayer_times')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data as PrayerTime | null;
    },

    // Create or update user settings
    async upsert(settings: Omit<PrayerTime, 'id' | 'created_at' | 'updated_at'>) {
        const { data, error } = await supabase
            .from('prayer_times')
            .upsert(settings, { onConflict: 'user_id' })
            .select()
            .single();

        if (error) throw error;
        return data as PrayerTime;
    }
};
