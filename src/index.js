import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import passport from 'passport';

// Rutas (se crearán después)
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/task.js';
import oauthRoutes from './routes/oauth.js';
import boardRoutes from './routes/board.js';
import inviteRoutes from './routes/invite.js';
import notificationRoutes from './routes/notification.js';
import './utils/passport.js';

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/oauth', oauthRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/invite', inviteRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/', (req, res) => {
  res.send('API de App-Task funcionando');
});


// --- SOCKET.IO ---
import { Server } from 'socket.io';
import http from 'http';

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('Usuario conectado a Socket.IO:', socket.id);
  socket.on('joinBoard', (boardId) => {
    socket.join(boardId);
  });
  // Unirse a sala personal para notificaciones/tableros
  socket.on('joinUser', (userId) => {
    socket.join(userId);
  });
  socket.on('updateNotifications', () => {
    // Solo trigger, la lógica está en los controladores
  });
  socket.on('updateBoards', () => {
    // Solo trigger, la lógica está en los controladores
  });
});

app.set('io', io); // Para acceder a io desde los controladores

const PORT = process.env.PORT || 4000;
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true
}).then(() => {
  server.listen(PORT, () => {
    console.log(`Servidor backend escuchando en puerto ${PORT}`);
  });
}).catch((err) => {
  console.error('Error conectando a MongoDB:', err);
});
