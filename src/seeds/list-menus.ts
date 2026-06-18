import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  await mongoose.connect(process.env.MONGO_URI || '');
  const menus = await mongoose.connection.collection('menus').find({}).sort({ parentId: 1, sort: 1 }).toArray();
  console.log(JSON.stringify(menus.map(m => ({
    _id: m._id,
    name: m.name,
    path: m.path,
    parentId: m.parentId,
    sort: m.sort,
    status: m.status,
  })), null, 2));
  await mongoose.disconnect();
}
main();
