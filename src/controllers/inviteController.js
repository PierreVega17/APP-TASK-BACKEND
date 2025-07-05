
import Board from '../models/Board.js';
import User from '../models/User.js';

export const inviteUser = async (req, res) => {
  const { boardId } = req.params;
  const { email } = req.body;
  try {
    const board = await Board.findById(boardId);
    if (!board) return res.status(404).json({ message: 'Tablero no encontrado' });
    if (!board.owner.equals(req.user.id)) return res.status(403).json({ message: 'Solo el propietario puede invitar' });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    if (board.members.includes(user._id)) return res.status(400).json({ message: 'El usuario ya es miembro' });
    // Añadir invitación pendiente al usuario
    user.invites.push({ board: board._id, from: req.user.id });
    await user.save();
    // Emitir notificación en vivo al usuario invitado
    const io = req.app.get('io');
    if (io) io.to(user._id.toString()).emit('notificationsUpdated');
    res.json({ message: 'Invitación enviada', user: { _id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Error al invitar usuario', error: err.message });
  }
};
