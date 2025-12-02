import { createClient } from '@supabase/supabase-js';

// Supabase configuration for backend
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || ''; // Use service key for backend

if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('⚠️ Supabase credentials not configured for backend');
    console.warn('Add SUPABASE_URL and SUPABASE_SERVICE_KEY to your .env file');
}

// Create Supabase client with service key (backend has full access)
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

// Helper function to verify user token
export async function verifySupabaseToken(token: string) {
    try {
        const { data, error } = await supabase.auth.getUser(token);

        if (error) throw error;

        return data.user;
    } catch (error) {
        console.error('Token verification failed:', error);
        return null;
    }
}

// Prayer times operations
export const prayerTimesService = {
    async getUserSettings(userId: string) {
        const { data, error } = await supabase
            .from('prayer_times')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Error fetching prayer times:', error);
            return null;
        }

        return data;
    },

    async upsertSettings(userId: string, settings: any) {
        const { data, error } = await supabase
            .from('prayer_times')
            .upsert({
                user_id: userId,
                ...settings,
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' })
            .select()
            .single();

        if (error) {
            console.error('Error upserting prayer times:', error);
            throw error;
        }

        return data;
    }
};

// Adhan audios operations
export const adhanAudioService = {
    async getAll() {
        const { data, error } = await supabase
            .from('adhan_audios')
            .select('*')
            .order('is_default', { ascending: false })
            .order('muezzin_name');

        if (error) {
            console.error('Error fetching adhan audios:', error);
            throw error;
        }

        return data;
    },

    async getDefault() {
        const { data, error } = await supabase
            .from('adhan_audios')
            .select('*')
            .eq('is_default', true)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Error fetching default adhan:', error);
        }

        return data;
    }
};

export default supabase;
