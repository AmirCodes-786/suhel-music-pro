# 🚀 Deployment Guide: Suhel Tunes

This guide outlines the steps to deploy your music streaming application with the **Frontend on Vercel** and the **Backend on Render**.

---

## 1. Backend Deployment (Render)

Render will host your Express server.

### Steps:
1.  **Create a New Web Service**: Sign in to [Render](https://render.com/) and click **New > Web Service**.
2.  **Connect GitHub**: Select your repository.
3.  **Configure Service**:
    *   **Name**: `suhel-tunes-api` (or your choice)
    *   **Root Directory**: `server` 
    *   **Runtime**: `Node`
    *   **Build Command**: `npm install`
    *   **Start Command**: `npm start`
4.  **Add Environment Variables**: Click **Advanced > Add Environment Variable**:
    *   `JAMENDO_CLIENT_ID`: Your Jamendo API Key.
    *   `YOUTUBE_API_KEY`: Your YouTube Data API v3 Key.
    *   `FRONTEND_URL`: Your deployed Vercel URL (e.g., `https://suhel-tunes.vercel.app`).
5.  **Deploy**: Click **Create Web Service**. 
    *   *Note: Note down the URL provided by Render (e.g., `https://suhel-tunes-api.onrender.com`).*

---

## 2. Frontend Deployment (Vercel)

Vercel will host your React (Vite) application.

### Steps:
1.  **Import Project**: Sign in to [Vercel](https://vercel.com/) and click **Add New > Project**.
2.  **Configure Project**:
    *   **Framework Preset**: `Vite`
    *   **Root Directory**: Leave as `./` (the root of the repo).
    *   **Build Command**: `npm run build`
    *   **Output Directory**: `dist`
3.  **Add Environment Variables**:
    *   `VITE_API_URL`: The URL of your **Render** backend (e.g., `https://suhel-tunes-api.onrender.com`).
    *   `VITE_JAMENDO_CLIENT_ID`: Your Jamendo API Key.
4.  **Deploy**: Click **Deploy**.

---

## 🔑 Summary of Environment Variables

| Variable | Location | Used By | Description |
| :--- | :--- | :--- | :--- |
| `VITE_API_URL` | Vercel | Frontend | Tells the frontend where to find the backend API. |
| `VITE_JAMENDO_CLIENT_ID`| Vercel | Frontend | Public key for Jamendo API calls. |
| `FRONTEND_URL` | Render | Backend | Allows your frontend to bypass CORS security. |
| `YOUTUBE_API_KEY` | Render | Backend | Secret key for YouTube search. |
| `JAMENDO_CLIENT_ID` | Render | Backend | Secret key for backend fallback search. |

---

## 🔗 How Shared Links Work

The app is configured to use `window.location.origin` for sharing. 
*   When you click "Share", it generates a link like: `https://your-app.vercel.app/play?source=youtube&id=XYZ`
*   The `vercel.json` file handles the routing, so even if the user refreshes or opens the link directly, Vercel will point them to the correct React route.
*   The `ShareLinkHandler.jsx` component then reads the ID and asks your **Render** backend for the stream.

---

## 🛠️ Troubleshooting

*   **Mixed Content Error**: Ensure your `VITE_API_URL` starts with `https://`.
*   **CORS Error**: Double-check that `FRONTEND_URL` in Render matches your Vercel URL exactly (no trailing slash).
*   **Search Fails**: Check the Render logs to see if your YouTube API key has reached its daily quota.
