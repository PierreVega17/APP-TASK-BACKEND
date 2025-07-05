import jwt from 'jsonwebtoken';

export const generateToken = (user, rememberMe = false) => {
  return jwt.sign(
    { id: user._id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: rememberMe ? '30d' : '1d' }
  );
};
