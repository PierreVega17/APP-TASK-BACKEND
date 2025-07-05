import mongoose from 'mongoose';


const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['pendiente', 'en_proceso', 'en_revision', 'terminado'], default: 'pendiente' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assigned: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  board: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Task', taskSchema);
