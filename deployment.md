# 🚀 Deployment Guide: Suhel Music Pro

Follow these steps to deploy your full-stack music streaming application.

---

## 🏗️ 1. Backend Deployment (Render)

The Node.js server handles YouTube searching and audio streaming.

### Configuration
1. **New Web Service**: Connect your GitHub repo to [Render](https://render.com/).
2. **Root Directory**: `server`
3. **Build Command**: `npm install`
4. **Start Command**: `npm start`

### Environment Variables
| Key | Value / Description |
| :--- | :--- |
| `FRONTEND_URL` | Your Vercel URL (e.g., `https://suhel-music.vercel.app`) |
| `YOUTUBE_API_KEY` | Your Google Cloud YouTube Data API Key |
| `JAMENDO_CLIENT_ID`| Your Jamendo Client ID |

---

## 🎨 2. Frontend Deployment (Vercel)

The React frontend provides the premium user interface.

### Configuration
1. **New Project**: Connect your GitHub repo to [Vercel](https://vercel.com/).
2. **Framework Preset**: `Vite`
3. **Root Directory**: `./` (Root)
4. **Build Command**: `npm run build`
5. **Output Directory**: `dist`

### Environment Variables
| Key | Value / Description |
| :--- | :--- |
| `VITE_API_URL` | Your Render URL (e.g., `https://suhel-music-api.onrender.com`) |
| `VITE_JAMENDO_CLIENT_ID` | Your Jamendo Client ID |

---

## 🛠️ 3. Post-Deployment Checklist

### ✅ Verify CORS
Ensure the `FRONTEND_URL` in Render matches your Vercel domain exactly (no trailing slash). This prevents "Blocked by CORS" errors.

### ✅ Verify API Connectivity
Once both are deployed, open your Vercel site and try searching for a song. If results appear, the connection is successful.

### ✅ Shareable Links
The application uses dynamic routing. Links shared via the player (e.g., `/play?source=youtube&id=...`) are handled by `vercel.json` and will load the specific track automatically.

---

## 📂 Project Structure Note
*   **Root**: Contains the React frontend and Vercel configuration.
*   **`/server`**: Contains the Express backend and Render configuration.
*   **`.env.example`**: Use this as a template for your production environment variables.

---
*Created by Antigravity AI*
