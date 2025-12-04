const https = require('https');
const fs = require('fs');

const url = 'https://azkar-api-kappa.vercel.app/azkar.json';

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        const json = JSON.parse(data);
        let sql = `-- Fix for app_versions and global_settings
DROP TABLE IF EXISTS "app_versions";
DROP TABLE IF EXISTS "global_settings";

CREATE TABLE "app_versions" (
    "id" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "buildNumber" INTEGER NOT NULL,
    "forceUpdate" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "app_versions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "app_versions_version_key" ON "app_versions"("version");

CREATE TABLE "global_settings" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "global_settings_pkey" PRIMARY KEY ("key")
);

-- Azkar Table
DROP TABLE IF EXISTS "azkar";
CREATE TABLE "azkar" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "category" TEXT NOT NULL,
    "count" INTEGER DEFAULT 1,
    "description" TEXT,
    "reference" TEXT,
    "content" TEXT NOT NULL
);

INSERT INTO "azkar" ("category", "count", "description", "reference", "content") VALUES
`;

        const values = [];
        for (const category in json) {
            json[category].forEach(item => {
                const count = parseInt(item.count) || 1;
                const desc = (item.description || '').replace(/'/g, "''");
                const ref = (item.reference || '').replace(/'/g, "''");
                const content = (item.content || '').replace(/'/g, "''");
                const cat = (item.category || category).replace(/'/g, "''");

                values.push(`('${cat}', ${count}, '${desc}', '${ref}', '${content}')`);
            });
        }

        sql += values.join(',\n') + ';';

        fs.writeFileSync('migration.sql', sql);
        console.log('migration.sql created');
    });
}).on('error', (err) => {
    console.error('Error:', err.message);
});
