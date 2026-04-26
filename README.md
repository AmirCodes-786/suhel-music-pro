# 🎵 Suhel Music Pro

## 📖 1. Project Overview
**Suhel Music Pro** is a premium, full-stack music streaming web application. It offers a seamless, high-performance listening experience by combining YouTube's vast music library with high-quality, royalty-free tracks from Jamendo. 

This source code is perfect for **developers, students, startups, and entrepreneurs** looking to launch their own premium music streaming platform, learn advanced full-stack development, or use as a powerful foundational template for their next big project.

---

## ✨ 2. Features
- **Multi-Source Streaming**: Stream audio directly from YouTube and Jamendo.
- **Premium User Interface**: Modern, responsive design featuring sleek glassmorphism effects, dynamic animations, and a polished aesthetic.
- **Robust Audio Engine**: Custom-built dual-engine streaming backend utilizing both `play-dl` and `yt-dlp` to bypass blocks and ensure reliable playback.
- **Dynamic Queue Management**: Seamlessly add, remove, shuffle, and repeat tracks.
- **State Management**: Highly optimized global state using Zustand.
- **Responsive Layout**: Fully functional on desktop, tablet, and mobile devices.
- **Advanced Search**: Search across multiple platforms with automated fallbacks if API limits are reached.

---

## 🛠️ 3. Tech Stack
**Frontend:**
- React.js (Vite)
- Zustand (State Management)
- Framer Motion (Animations)
- Lucide React (Icons)
- Vanilla CSS (Custom modern styling)

**Backend:**
- Node.js
- Express.js
- `play-dl` & `youtube-dl-exec` (`yt-dlp` integration)
- Axios & CORS

---

## ⚙️ 4. Requirements Before Running
Before you start, ensure you have the following installed on your machine:
- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)
- **YouTube Data API v3 Key** (Free from Google Cloud Console)
- **Jamendo API Client ID** (Free from Jamendo Developer Portal)

---

## 🚀 5. Installation Steps
Follow these step-by-step instructions to get the project running locally:

1. **Download and Extract**: Download the provided `.zip` file and extract it to your desired folder.
2. **Open in Editor**: Open the extracted folder in Visual Studio Code (or your preferred IDE).
3. **Open Terminal**: Open an integrated terminal in VS Code (`Ctrl + ~` or `Cmd + ~`).
4. **Install Root Dependencies**:
   ```bash
   npm install
   ```
5. **Install Backend Dependencies**:
   ```bash
   cd server
   npm install
   cd ..
   ```
> **Note**: The `node_modules` folders are intentionally not included in the download to keep the file size small. Running `npm install` will automatically download all necessary libraries.

---

## 🔐 6. Environment Variables Setup
For security reasons, the `.env` file containing private API keys is not included in the source code. You will need to create your own.

1. In the root directory of the project, locate the `.env.example` file.
2. Create a new file named exactly `.env` in the same directory.
3. Copy the contents of `.env.example` into your new `.env` file.
4. Replace the placeholder values with your actual keys:

```env
# Frontend
VITE_API_URL=http://localhost:5000
VITE_JAMENDO_CLIENT_ID=your_jamendo_client_id_here

# Backend
PORT=5000
FRONTEND_URL=http://localhost:5173
YOUTUBE_API_KEY=your_youtube_data_api_key_here
JAMENDO_CLIENT_ID=your_jamendo_client_id_here
```

---

## 💻 7. Running the Project
Once installed and configured, you can start the entire application (both frontend and backend) with a single command from the root directory:

```bash
npm run dev
```

This will automatically start:
- **Frontend App**: Available at `http://localhost:5173`
- **Backend API**: Running quietly in the background at `http://localhost:5000`

---

## 📦 8. Build Instructions
If you are ready to prepare the frontend for production deployment, run the following command in the root directory:

```bash
npm run build
```
This will automatically optimize your code and generate a `dist` folder containing your production-ready static files.

---

## 🎨 9. Editable Sections for Customization
This project is built to be easily customizable. Here is what you can easily change:
- **API Keys**: Update your keys anytime in the `.env` file.
- **Colors & Styles**: Modify the CSS variables inside `src/index.css` to instantly change the theme (colors, fonts, glassmorphism blur levels).
- **UI Text & Branding**: Change the app name, logos, and static text directly within the components inside the `src/components/` and `src/pages/` directories.
- **Images/Assets**: Replace default cover art or logos inside the `public/` directory.

---

## 📁 10. Folder Structure Overview
Here is a quick guide to navigating the source code:

- `/public`: Contains static assets like the `index.html` and logos.
- `/server`: The complete Node.js/Express backend environment.
  - `/routes`: API endpoints for searching and streaming.
  - `/utils`: Helper functions and engine logic.
- `/src`: The React frontend application.
  - `/api`: Axios clients connecting to YouTube and Jamendo.
  - `/components`: Reusable UI pieces (Cards, Layout, Player).
  - `/pages`: Main views (Home, Search, Library).
  - `/store`: Zustand state management files.
- `package.json`: Manages scripts and dependencies.
- `vite.config.js`: Configuration for the Vite bundler and local proxy.

---

## 🌍 11. Deployment Guide
When you are ready to go live, follow this standard approach:

**1. Backend (Render / Railway / Heroku)**
- Connect your GitHub repository to your hosting provider.
- Set the root directory to `server`.
- Add your Environment Variables (YouTube Key, Jamendo ID, Frontend URL).
- Deploy using `npm install` and `npm start`.

**2. Frontend (Vercel / Netlify)**
- Connect your GitHub repository.
- Ensure the framework preset is set to **Vite**.
- Add your Environment Variables (`VITE_API_URL` pointing to your deployed backend URL).
- Deploy!

---

## 🛠️ 12. Troubleshooting
Here are common issues and how to fix them:

- **If `npm install` fails**: Ensure you are using an updated version of Node.js (v18+). Try running `npm cache clean --force` and then `npm install` again.
- **If the port is already running**: If you see `Port 5173 is in use` or backend connection errors, you likely have a hidden terminal running the app. Close all terminals and try `npm run dev` again.
- **If YouTube songs aren't playing**: Ensure your `YOUTUBE_API_KEY` is correct and hasn't exceeded its daily quota. Check the terminal running the backend for specific extraction errors.
- **"Network Error" in Browser**: Make sure both the frontend and backend are running. The built-in Vite proxy expects the backend to be running on port 5000.

---

## ⚠️ 13. Important Note
**For security and performance reasons, this source code does NOT include API keys or the `node_modules` folders.** 
You must generate your own API keys from Google and Jamendo, and run `npm install` to download the dependencies locally before running the application.

---

## 📞 14. Contact & Support
If you encounter any bugs, need help with installation, or have questions about customizing the code, please feel free to reach out.

**Support Email:** your-email@example.com
