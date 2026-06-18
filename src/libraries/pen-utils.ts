import { Model } from 'mongoose';
import { Pen } from 'src/schemas/pen.schema';

export async function syncPenStatus(penModel: Model<Pen>, penId: any): Promise<void> {
  const pen = await penModel.findById(penId);
  if (!pen) return;
  const statusPens = pen.capacity > 0 && pen.currentCount >= pen.capacity ? 'isFull' : 'notFull';
  await penModel.findByIdAndUpdate(penId, { statusPens });
}
