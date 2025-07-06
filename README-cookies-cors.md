## Notas sobre cookies y CORS en producción

- Para que la autenticación funcione correctamente entre dominios (por ejemplo, frontend en Vercel y backend en Render), las cookies de sesión se configuran con:
  - `sameSite: 'none'` y `secure: true` en producción.
- Asegúrate de que la variable de entorno `FRONTEND_URL` en Render apunte a la URL de Vercel.
- El backend ya está configurado para enviar la cookie de sesión de forma segura según el entorno (`NODE_ENV`).
- Si tienes problemas de sesión o CORS, revisa que ambas URLs (frontend y backend) sean las correctas y que el navegador no bloquee cookies de terceros.
