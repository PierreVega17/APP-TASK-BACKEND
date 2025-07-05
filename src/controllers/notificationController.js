import User from '../models/User.js';
import Board from '../models/Board.js';

export const getInvites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('invites.board').populate('invites.from');
    res.json(user.invites.filter(i => i.status === 'pending'));
  } catch (err) {
    res.status(500).json([]);
  }
};

export const respondInvite = async (req, res) => {
  const { inviteId } = req.params;
  const { action } = req.body; // 'accepted' o 'rejected'
  try {
    const user = await User.findById(req.user.id);
    const invite = user.invites.id(inviteId);
    if (!invite) return res.status(404).json({ message: 'Invitación no encontrada' });
    invite.status = action;
    await user.save();
    if (action === 'accepted') {
      const board = await Board.findById(invite.board);
      if (board && !board.members.includes(user._id)) {
        board.members.push(user._id);
        await board.save();
      }
    }
    // Emitir notificación en vivo al usuario que responde
    const io = req.app.get('io');
    if (io) io.to(user._id.toString()).emit('notificationsUpdated');
    // Si acepta, notificar a todos los miembros del board para refrescar tableros
    if (action === 'accepted' && board) {
      board.members.forEach(memberId => {
        io.to(memberId.toString()).emit('boardsUpdated');
      });
      io.to(board.owner.toString()).emit('boardsUpdated');
    }
    res.json({ message: 'Respuesta registrada' });
  } catch (err) {
    res.status(500).json({ message: 'Error al responder invitación' });
  }
};
