import { createClient } from '@supabase/supabase-js';

// These should be in .env, but for now we'll use the same as web app if not present
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not found. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface AdhanAudio {
    id: string;
    name: string;
    reciter_name: string;
    file_url: string;
    is_default: boolean;
    created_at: string;
}

export const adhanAudioService = {
    getAll: async () => {
        const { data, error } = await supabase
            .from('adhan_audios')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as AdhanAudio[];
    },

    uploadFile: async (file: File, reciterName: string) => {
        const fileName = `${Date.now()}-${file.name}`;

        // 1. Upload file to storage
        const { data: storageData, error: storageError } = await supabase.storage
            .from('audio-files')
            .upload(fileName, file);

        if (storageError) throw storageError;

        // 2. Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('audio-files')
            .getPublicUrl(fileName);

        // 3. Save metadata to database
        const { data, error } = await supabase
            .from('adhan_audios')
            .insert({
                name: file.name,
                reciter_name: reciterName,
                file_url: publicUrl,
                is_default: false
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    delete: async (id: string, fileUrl: string) => {
        // 1. Delete from database
        const { error: dbError } = await supabase
            .from('adhan_audios')
            .delete()
            .eq('id', id);

        if (dbError) throw dbError;

        // 2. Delete from storage
        const fileName = fileUrl.split('/').pop();
        if (fileName) {
            const { error: storageError } = await supabase.storage
                .from('audio-files')
                .remove([fileName]);

            if (storageError) console.error('Error deleting file from storage:', storageError);
        }
    },

    setDefault: async (id: string) => {
        // 1. Reset all to false
        await supabase
            .from('adhan_audios')
            .update({ is_default: false })
            .neq('id', '00000000-0000-0000-0000-000000000000'); // Update all

        // 2. Set selected to true
        const { error } = await supabase
            .from('adhan_audios')
            .update({ is_default: true })
            .eq('id', id);

        if (error) throw error;
    }
};
