import passport from 'passport';
import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';

export const oauthCallback = (provider) => async (req, res) => {
  if (!req.user) return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth`);
  const token = generateToken(req.user, true);
  res.cookie(process.env.SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000
  });
  res.redirect(`${process.env.FRONTEND_URL}/`);
};
