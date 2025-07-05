import express from 'express';
import passport from 'passport';
import { oauthCallback } from '../controllers/oauthController.js';

const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), oauthCallback('google'));

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), oauthCallback('github'));

export default router;
    