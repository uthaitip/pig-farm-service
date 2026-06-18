/**
 * Seed Thai province / district / sub-district data from kongvut/thai-province-data
 * Run: npx ts-node -r tsconfig-paths/register src/scripts/seed-thai-address.ts
 */

import mongoose from 'mongoose';
import * as https from 'https';
import * as dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI!;

const URLS = {
  provinces:     'https://raw.githubusercontent.com/kongvut/thai-province-data/master/data/raw/provinces.json',
  districts:     'https://raw.githubusercontent.com/kongvut/thai-province-data/master/data/raw/districts.json',
  subDistricts:  'https://raw.githubusercontent.com/kongvut/thai-province-data/master/data/raw/sub_districts.json',
};

function fetchJson(url: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

async function seed() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI);
  const db = mongoose.connection.db!;

  for (const col of ['thai_provinces', 'thai_districts', 'thai_sub_districts']) {
    await db.collection(col).drop().catch(() => {});
  }

  console.log('Fetching provinces...');
  const provinces = await fetchJson(URLS.provinces);
  await db.collection('thai_provinces').insertMany(
    provinces.map(({ id, name_th, name_en, geography_id }) => ({ id, name_th, name_en, geography_id })),
  );
  console.log(`  Inserted ${provinces.length} provinces`);

  console.log('Fetching districts...');
  const districts = await fetchJson(URLS.districts);
  await db.collection('thai_districts').insertMany(
    districts.map(({ id, name_th, name_en, province_id }) => ({ id, name_th, name_en, province_id })),
  );
  console.log(`  Inserted ${districts.length} districts`);

  console.log('Fetching sub-districts...');
  const subDistricts = await fetchJson(URLS.subDistricts);

  const BATCH = 500;
  for (let i = 0; i < subDistricts.length; i += BATCH) {
    const chunk = subDistricts.slice(i, i + BATCH).map(
      ({ id, name_th, name_en, district_id, zip_code }) => ({ id, name_th, name_en, district_id, zip_code }),
    );
    await db.collection('thai_sub_districts').insertMany(chunk);
  }
  console.log(`  Inserted ${subDistricts.length} sub-districts`);

  await db.collection('thai_provinces').createIndex({ id: 1 }, { unique: true });
  await db.collection('thai_districts').createIndex({ id: 1 }, { unique: true });
  await db.collection('thai_districts').createIndex({ province_id: 1 });
  await db.collection('thai_sub_districts').createIndex({ id: 1 }, { unique: true });
  await db.collection('thai_sub_districts').createIndex({ district_id: 1 });

  console.log('Done!');
  await mongoose.disconnect();
}

seed().catch((e) => { console.error(e); process.exit(1); });
