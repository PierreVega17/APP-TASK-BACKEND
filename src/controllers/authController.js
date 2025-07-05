import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt.js';

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'El correo ya está registrado' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    res.status(201).json({ message: 'Usuario registrado', user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Error en el registro', error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password, rememberMe } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Usuario o contraseña incorrectos' });
    if (!user.password) return res.status(400).json({ message: 'Usa el login social para este correo' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: 'Usuario o contraseña incorrectos' });
    const token = generateToken(user, rememberMe);
    res.cookie(process.env.SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000
    });
    res.json({ message: 'Login exitoso', user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Error en el login', error: err.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie(process.env.SESSION_COOKIE_NAME);
  res.json({ message: 'Sesión cerrada' });
};
