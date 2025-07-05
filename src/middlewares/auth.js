import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const token = req.cookies[process.env.SESSION_COOKIE_NAME];
  if (!token) return res.status(401).json({ message: 'No autenticado' });
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token inválido' });
  }
};
