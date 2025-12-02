-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255),
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create Prayer Settings Table
CREATE TABLE IF NOT EXISTS prayer_settings (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  calculation_method VARCHAR(100),
  madhab VARCHAR(50),
  latitude FLOAT,
  longitude FLOAT
);

-- Create Favorites Table
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  surah_number INT NOT NULL,
  ayah_number INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create Reading History Table
CREATE TABLE IF NOT EXISTS reading_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  surah_number INT NOT NULL,
  ayah_number INT NOT NULL,
  last_read_at TIMESTAMP DEFAULT NOW()
);
