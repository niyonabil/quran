# Database Setup Instructions

## Connection String
```
postgresql://postgres.avwdhirkpcavmpygooee:Roa0629605450@aws-1-eu-west-3.pooler.supabase.com:6543/postgres
```

## Option 1: Using Prisma
1. Make sure the `.env` file contains the DATABASE_URL
2. Run: `npx prisma db push`

## Option 2: Manual SQL Execution
If Prisma has issues, you can manually execute the SQL script:

1. Go to your Supabase Dashboard → SQL Editor
2. Copy and paste the contents of `init_db.sql`
3. Click "Run" to create all tables

## Tables Created
- `users` - User accounts
- `prayer_settings` - Prayer calculation settings per user  
- `favorites` - Saved favorite verses
- `reading_history` - Reading history tracking

## Testing Connection
You can test the connection using:
```bash
$env:DATABASE_URL='postgresql://postgres.avwdhirkpcavmpygooee:Roa0629605450@aws-1-eu-west-3.pooler.supabase.com:6543/postgres'
node test-db.js
```

## Known Issues with Prisma 7
If you encounter module resolution errors, this is a known issue with Prisma 7 client generation. The tables can still be created using the SQL script directly in Supabase.
