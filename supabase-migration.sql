-- Supabase SQL Migration Script for Adhan Management
-- Run this in your Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create adhan_audios table
CREATE TABLE IF NOT EXISTS adhan_audios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    muezzin_name VARCHAR(255) NOT NULL,
    muezzin_name_ar VARCHAR(255),
    location VARCHAR(255),
    file_url TEXT NOT NULL,
    file_size INTEGER,
    duration INTEGER,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create prayer_times table for user settings
CREATE TABLE IF NOT EXISTS prayer_times (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    city VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    method INTEGER DEFAULT 2,
    adhan_audio_id UUID REFERENCES adhan_audios(id) ON DELETE SET NULL,
    notifications_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_adhan_audios_is_default ON adhan_audios(is_default);
CREATE INDEX IF NOT EXISTS idx_prayer_times_user_id ON prayer_times(user_id);

-- Create storage bucket for audio files
INSERT INTO storage.buckets (id, name, public)
VALUES ('audio-files', 'audio-files', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies
CREATE POLICY "Public read access for audio files"
ON storage.objects FOR SELECT
USING (bucket_id = 'audio-files');

CREATE POLICY "Authenticated users can upload audio files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'audio-files' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update their own audio files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'audio-files' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete their own audio files"
ON storage.objects FOR DELETE
USING (bucket_id = 'audio-files' AND auth.role() = 'authenticated');

-- Insert default adhan audios (placeholder URLs - replace with actual files)
INSERT INTO adhan_audios (muezzin_name, muezzin_name_ar, location, file_url, is_default) VALUES
('Sheikh Abdullah Al-Zaili', 'الشيخ عبد الله الزيلعي', 'Masjid Al-Haram, Makkah', 'https://your-storage-url/adhan/zaili.mp3', true),
('Sheikh Ali Ahmed Mulla', 'الشيخ علي أحمد ملا', 'Masjid Al-Nabawi, Madinah', 'https://your-storage-url/adhan/mulla.mp3', false),
('Sheikh Mansour Al-Zahrani', 'الشيخ منصور الزهراني', 'Makkah', 'https://your-storage-url/adhan/zahrani.mp3', false),
('Sheikh Hamad Deghreri', 'الشيخ حمد الدغريري', 'Madinah', 'https://your-storage-url/adhan/deghreri.mp3', false),
('Sheikh Mishary Al-Khamis', 'الشيخ مشاري الخميس', 'Kuwait', 'https://your-storage-url/adhan/khamis.mp3', false)
ON CONFLICT DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_adhan_audios_updated_at
    BEFORE UPDATE ON adhan_audios
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prayer_times_updated_at
    BEFORE UPDATE ON prayer_times
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions (adjust based on your needs)
ALTER TABLE adhan_audios ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_times ENABLE ROW LEVEL SECURITY;

-- RLS Policies for adhan_audios (public read, authenticated write)
CREATE POLICY "Anyone can read adhan audios"
ON adhan_audios FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can insert adhan audios"
ON adhan_audios FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update adhan audios"
ON adhan_audios FOR UPDATE
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete adhan audios"
ON adhan_audios FOR DELETE
USING (auth.role() = 'authenticated');

-- RLS Policies for prayer_times (users can only access their own settings)
CREATE POLICY "Users can read their own prayer times"
ON prayer_times FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own prayer times"
ON prayer_times FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own prayer times"
ON prayer_times FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own prayer times"
ON prayer_times FOR DELETE
USING (auth.uid() = user_id);
