import Task from '../models/Task.js';
import Board from '../models/Board.js';

// Helper para emitir actualización en tiempo real
async function emitTasksUpdate(boardId, req) {
  const io = req.app.get('io');
  if (io) {
    const tasks = await Task.find({ board: boardId }).sort({ order: 1 });
    io.to(boardId.toString()).emit('tasksUpdated', tasks);
  }
}

export const getTasks = async (req, res) => {
  try {
    // Buscar tableros donde el usuario es owner o miembro
    const boards = await Board.find({ $or: [
      { owner: req.user.id },
      { members: req.user.id }
    ] }).select('_id');
    const boardIds = boards.map(b => b._id);
    const tasks = await Task.find({ board: { $in: boardIds } }).sort({ order: 1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener tareas', error: err.message });
  }
};

export const createTask = async (req, res) => {
  const { title, description, status, order, board, assigned } = req.body;
  try {
    // Verifica que el usuario tenga acceso al board
    const boardDoc = await Board.findOne({ _id: board, $or: [
      { owner: req.user.id },
      { members: req.user.id }
    ] });
    if (!boardDoc) return res.status(403).json({ message: 'No autorizado para agregar tareas a este tablero' });
    const task = await Task.create({
      title,
      description,
      status,
      order,
      board,
      user: req.user.id,
      assigned
    });
    res.status(201).json(task);
    emitTasksUpdate(board, req);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear tarea', error: err.message });
  }
};

export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, status, order, assigned } = req.body;
  try {
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: 'Tarea no encontrada' });
    const board = await Board.findById(task.board);
    if (!board) return res.status(404).json({ message: 'Tablero no encontrado' });
    // Permisos: owner puede todo, miembros pueden mover/autoasignar
    const isOwner = board.owner.equals(req.user.id);
    const isMember = board.members.includes(req.user.id);
    // Si se intenta cambiar título o descripción, solo owner
    if ((title !== undefined && title !== task.title) || (description !== undefined && description !== task.description)) {
      if (!isOwner) return res.status(403).json({ message: 'Solo el owner puede editar título o descripción' });
      task.title = title;
      task.description = description;
    }
    // Cambios de status, order o assigned: owner o miembro
    if (status !== undefined) task.status = status;
    if (order !== undefined) task.order = order;
    if (assigned !== undefined) task.assigned = assigned;
    if (!isOwner && !isMember && !(task.assigned && task.assigned.equals(req.user.id))) {
      return res.status(403).json({ message: 'No autorizado' });
    }
    await task.save();
    res.json(task);
    emitTasksUpdate(task.board, req);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar tarea', error: err.message });
  }
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: 'Tarea no encontrada' });
    const board = await Board.findById(task.board);
    if (!board) return res.status(404).json({ message: 'Tablero no encontrado' });
    const isAllowed = board.owner.equals(req.user.id) || (task.assigned && task.assigned.equals(req.user.id));
    if (!isAllowed) return res.status(403).json({ message: 'No autorizado' });
    await task.deleteOne();
    res.json({ message: 'Tarea eliminada' });
    emitTasksUpdate(task.board, req);
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar tarea', error: err.message });
  }
};
