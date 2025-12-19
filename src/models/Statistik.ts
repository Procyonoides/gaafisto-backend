import mongoose, { Schema, Document } from 'mongoose';

export interface IStatistik extends Document {
  ip: string;
  tanggal: string;
  hits: number;
  online: number;
}

const StatistikSchema: Schema = new Schema({
  ip: { type: String, required: true },
  tanggal: { type: String, required: true },
  hits: { type: Number, default: 1 },
  online: { type: Number, required: true }
});

// Compound index untuk ip dan tanggal
StatistikSchema.index({ ip: 1, tanggal: 1 }, { unique: true });

export const Statistik = mongoose.model<IStatistik>('Statistik', StatistikSchema);

// Middleware untuk tracking pengunjung
export const trackVisitor = async (req: any, res: any, next: any) => {
  try {
    const ip = req.ip || req.connection.remoteAddress;
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const currentTime = Math.floor(Date.now() / 1000);

    // Cek apakah IP sudah ada untuk hari ini
    const existingStat = await Statistik.findOne({ ip, tanggal: today });

    if (existingStat) {
      // Update hits dan online time
      await Statistik.updateOne(
        { ip, tanggal: today },
        { 
          $inc: { hits: 1 },
          online: currentTime
        }
      );
    } else {
      // Buat record baru
      await Statistik.create({
        ip,
        tanggal: today,
        hits: 1,
        online: currentTime
      });
    }

    next();
  } catch (error) {
    // Jika error, tetap lanjutkan request
    next();
  }
};

// Function untuk mendapatkan statistik
export const getStatistics = async () => {
  const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const fiveMinutesAgo = Math.floor(Date.now() / 1000) - 300;

  // Pengunjung hari ini (unique IP)
  const todayVisitors = await Statistik.countDocuments({ tanggal: today });

  // Total hits hari ini
  const todayHits = await Statistik.aggregate([
    { $match: { tanggal: today } },
    { $group: { _id: null, total: { $sum: '$hits' } } }
  ]);

  // Total pengunjung (all time)
  const totalVisitors = await Statistik.countDocuments();

  // Total hits (all time)
  const totalHits = await Statistik.aggregate([
    { $group: { _id: null, total: { $sum: '$hits' } } }
  ]);

  // Pengunjung online (dalam 5 menit terakhir)
  const onlineVisitors = await Statistik.countDocuments({ 
    online: { $gt: fiveMinutesAgo } 
  });

  return {
    todayVisitors,
    todayHits: todayHits[0]?.total || 0,
    totalVisitors,
    totalHits: totalHits[0]?.total || 0,
    onlineVisitors
  };
};