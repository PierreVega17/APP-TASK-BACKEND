# App-Task Backend

Este proyecto es el backend de App-Task, una aplicación tipo Trello con Node.js, Express y MongoDB.

## Tecnologías principales
- Node.js + Express
- MongoDB + Mongoose
- Passport (Google y GitHub OAuth)
- JWT + Cookies
- Socket.IO (actualizaciones en tiempo real)
- Arquitectura modular

## Scripts
- `npm run dev` — Inicia el backend en modo desarrollo (nodemon)
- `npm start` — Inicia el backend en modo producción

## Variables de entorno
- `MONGODB_URI`: URL de conexión a MongoDB Atlas
- `JWT_SECRET`: Secreto para JWT
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`: credenciales de GitHub
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`: credenciales de Google
- `FRONTEND_URL`: URL del frontend permitido (CORS)
- `SESSION_COOKIE_NAME`: Nombre de la cookie de sesión

## Estructura principal
- `/src/models`: Modelos de datos (User, Task, Board)
- `/src/controllers`: Lógica de negocio
- `/src/routes`: Rutas de la API
- `/src/utils`: Utilidades (passport, jwt)
- `/src/middlewares`: Middlewares de autenticación

## Despliegue
Puedes desplegar el backend en Render, Railway o Cyclic. Recuerda configurar las variables de entorno y conectar con MongoDB Atlas.

## Despliegue en Render (paso a paso)

1. Sube tu backend a un repositorio en GitHub, GitLab o Bitbucket.
2. Ve a [https://render.com/](https://render.com/) y crea una cuenta (puedes usar GitHub).
3. Haz clic en "New +" > "Web Service".
4. Conecta tu repositorio y selecciona la rama principal.
5. Render detectará automáticamente que es un proyecto Node.js.
6. En "Build Command" pon:
   ```bash
   npm install
   ```
   y en "Start Command":
   ```bash
   npm start
   ```
7. Agrega las variables de entorno necesarias:
   - `MONGODB_URI` (tu string de MongoDB Atlas)
   - `JWT_SECRET`
   - `GITHUB_CLIENT_ID` y `GITHUB_CLIENT_SECRET`
   - `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET`
   - `FRONTEND_URL` (URL de tu frontend desplegado)
   - `SESSION_COOKIE_NAME`
8. Haz clic en "Create Web Service".
9. Espera a que termine el build y copia la URL pública de tu backend.
10. Usa esa URL en el frontend (`VITE_API_URL`).

> Render tiene un plan gratuito con "sleep" automático si no hay tráfico, ideal para proyectos personales y MVPs.
