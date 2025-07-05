export const deleteBoard = async (req, res) => {
  const { id } = req.params;
  try {
    const board = await Board.findById(id);
    if (!board) return res.status(404).json({ message: 'Tablero no encontrado' });
    if (!board.owner.equals(req.user.id)) return res.status(403).json({ message: 'Solo el owner puede eliminar el tablero' });
    // Eliminar tareas asociadas
    await (await import('../models/Task.js')).default.deleteMany({ board: id });
    await board.deleteOne();
    // Emitir evento de actualización de tableros
    const io = req.app.get('io');
    if (io) io.to(req.user.id.toString()).emit('boardsUpdated');
    res.json({ message: 'Tablero eliminado' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar tablero', error: err.message });
  }
};

import Board from '../models/Board.js';
import User from '../models/User.js';

export const getBoards = async (req, res) => {
  try {
    // Tableros donde el usuario es owner o miembro
    const boards = await Board.find({ $or: [
      { owner: req.user.id },
      { members: req.user.id }
    ] });
    res.json(boards);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener tableros', error: err.message });
  }
};

export const createBoard = async (req, res) => {
  const { name, members = [] } = req.body;
  try {
    // Solo permite miembros válidos
    const validMembers = await User.find({ _id: { $in: members } });
    const memberIds = validMembers.map(u => u._id);
    const board = await Board.create({ name, owner: req.user.id, members: memberIds });
    res.status(201).json(board);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear tablero', error: err.message });
  }
};

export const getBoardUsers = async (req, res) => {
  const { id } = req.params;
  try {
    const board = await Board.findById(id).populate('owner').populate('members');
    if (!board) return res.status(404).json([]);
    const users = [board.owner, ...board.members];
    res.json(users.map(u => ({ _id: u._id, name: u.name, email: u.email })));
  } catch (err) {
    res.status(500).json([]);
  }
};
