/**
 * Menu Seed Script
 * รัน: npx tsx src/seeds/menu.seed.ts
 */
import mongoose, { Types } from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/pig-farm';

const MenuSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true },
    path:        { type: String, default: null },
    icon:        { type: String, default: null },
    parentId:    { type: String, default: null },
    sort:        { type: Number, default: 0 },
    status:      { type: String, default: 'active' },
    createdAt:   { type: String },
    updatedAt:   { type: String },
  },
  { collection: 'menus' },
);

const MenuModel = mongoose.model('Menu', MenuSchema);

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  // ลบเมนูเก่าทั้งหมดก่อน
  await MenuModel.deleteMany({});
  console.log('Cleared existing menus');

  const now = new Date().toISOString();

  // ---------- 1. สร้าง Parent menus ----------
  const parents = await MenuModel.insertMany([
    { _id: new Types.ObjectId(), name: 'แดชบอร์ด', path: '/dashboard', icon: '📊', parentId: null, sort: 1, status: 'active', createdAt: now, updatedAt: now },
    { _id: new Types.ObjectId(), name: 'ฟาร์ม',     path: null,         icon: '🐷', parentId: null, sort: 2, status: 'active', createdAt: now, updatedAt: now },
    { _id: new Types.ObjectId(), name: 'ผู้ใช้งาน', path: null,         icon: '👥', parentId: null, sort: 3, status: 'active', createdAt: now, updatedAt: now },
    { _id: new Types.ObjectId(), name: 'รายงาน',    path: '/report',    icon: '📋', parentId: null, sort: 4, status: 'active', createdAt: now, updatedAt: now },
  ]);

  const farmId = String(parents[1]._id);
  const userId = String(parents[2]._id);

  // ---------- 2. สร้าง Children menus ----------
  await MenuModel.insertMany([
    // ฟาร์ม
    { _id: new Types.ObjectId(), name: 'จัดการรุ่นหมู', path: '/pig-batches',  icon: '🐖', parentId: farmId, sort: 1, status: 'active', createdAt: now, updatedAt: now },
    { _id: new Types.ObjectId(), name: 'บันทึกการขาย',  path: '/sales',        icon: '💰', parentId: farmId, sort: 2, status: 'active', createdAt: now, updatedAt: now },
    { _id: new Types.ObjectId(), name: 'รายจ่าย',       path: '/expenses',     icon: '💸', parentId: farmId, sort: 3, status: 'active', createdAt: now, updatedAt: now },
    { _id: new Types.ObjectId(), name: 'สต็อกอาหาร',    path: '/feed-stocks',  icon: '🌾', parentId: farmId, sort: 4, status: 'active', createdAt: now, updatedAt: now },
    { _id: new Types.ObjectId(), name: 'คอกหมู',        path: '/pens',         icon: '🏠', parentId: farmId, sort: 5, status: 'active', createdAt: now, updatedAt: now },
    // ผู้ใช้งาน
    { _id: new Types.ObjectId(), name: 'ลูกค้า',        path: '/customers',    icon: '🧑‍💼', parentId: userId, sort: 1, status: 'active', createdAt: now, updatedAt: now },
    { _id: new Types.ObjectId(), name: 'ผู้ซื้อ',       path: '/buyers',       icon: '🧑‍🌾', parentId: userId, sort: 2, status: 'active', createdAt: now, updatedAt: now },
  ]);

  const total = await MenuModel.countDocuments();
  console.log(`✅ Seeded ${total} menus`);

  await mongoose.disconnect();
  console.log('Done');
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
