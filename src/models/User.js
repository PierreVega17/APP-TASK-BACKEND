import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Solo para login con correo
  provider: { type: String, enum: ['local', 'google', 'github'], default: 'local' },
  providerId: { type: String }, // ID de Google o GitHub
  avatar: { type: String },
  rememberMe: { type: Boolean, default: false },
  invites: [{
    board: { type: mongoose.Schema.Types.ObjectId, ref: 'Board' },
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export default mongoose.model('User', userSchema);
