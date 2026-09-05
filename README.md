# Kasatria 3D Data Visualizer 🌐✨

An interactive, high-performance **3D Spatial Data Visualizer** built with **Three.js**, **CSS3DRenderer**, **Vite**, and **Google Identity Services**. 

The application transforms tabular dataset records into dynamic, interactive 3D spatial cards with smooth camera transitions, real-time search filtering, dynamic net-worth color coding, and Google OAuth 2.0 authentication.

---

## 🌟 Key Features

* **🔐 Google OAuth 2.0 & Persistent Sessions**: Secure authentication integration with session state persistence using `localStorage`. Includes a quick Sign Out mechanism.
* **🪐 4 Interactive 3D Spatial Layouts**:
  * **Periodic Table**: 18-column periodic table silhouette layout with chemical period gaps and Lanthanide/Actinide spacing.
  * **Fibonacci Sphere**: 3D spherical distribution with outward-facing card rotations.
  * **Double Helix**: Intertwined 3D double spiral structure.
  * **3D Matrix Grid**: 5 × 4 × 10 spatial block grid.
* **📊 Live Google Sheets & CSV Integration**: Synchronizes published Google Sheet CSV records seamlessly using **PapaParse** with automatic currency parsing and a 200-record fallback sample dataset generator.
* **🎨 Financial Tier Visual Highlighting**:
  * **🔴 Low (<$100K)**: Red accent border & glow.
  * **🟠 Medium ($100K – $200K)**: Orange accent border & glow.
  * **🟢 High (>$200K)**: Green accent border & glow.
* **🔍 Real-Time Search & Focal Zooming**:
  * Live filter dimming unselected cards while highlighting matches.
  * Pointer-directed camera focal zooming driven by raycasting.
* **📱 Detailed Entity Modal**: Interactive 2D modal popup displaying entity photos, country codes, primary interests, and formatted net worth.

---

## 🏗️ Technology Stack

* **Core Language**: JavaScript (ES6+ Modules)
* **3D Engine & Renderer**: Three.js (`PerspectiveCamera`, `CSS3DRenderer`, `TrackballControls`)
* **Animation**: `@tweenjs/tween.js` (Exponential & Cubic smooth camera interpolation)
* **Data Parsing**: `PapaParse`
* **Authentication**: Google Identity Services SDK (`accounts.google.com/gsi/client`)
* **Bundler & Dev Server**: Vite
* **Styling**: Modern CSS3 (Glassmorphism, custom CSS variables, CSS grid/flexbox)

---

## 📁 Project Architecture

```
kasatria-3d-visualizer/
├── index.html              # Main HTML container & Google SDK script
├── package.json            # Project dependencies & npm scripts
├── vite.config.js          # Vite development server configuration
└── src/
    ├── main.js             # Application entrypoint & readiness lifecycle
    ├── config.js           # App configuration (Google Client ID & Sheet URL)
    ├── auth/
    │   └── googleAuth.js   # OAuth initialization & session persistence
    ├── components/
    │   ├── cardElement.js  # 3D CSS card DOM element factory
    │   ├── modal.js        # 2D Entity detail popup modal logic
    │   └── uiControls.js   # Side menu, search box, and header stats
    ├── scene/
    │   ├── layouts.js      # Table, Sphere, Helix, and Grid 3D position algorithms
    │   └── sceneManager.js # Three.js scene setup, camera controls & Tween animations
    ├── services/
    │   └── sheetService.js # CSV fetching, currency parsing & mock dataset generator
    └── styles/
        └── main.css        # Global CSS stylesheet & glassmorphism theme
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have **Node.js** (v16.0 or higher) and **npm** installed on your system.

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/YourUsername/kasatria-3d-visualizer.git

# Change directory
cd kasatria-3d-visualizer

# Install dependencies
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:3000` to interact with the visualizer.

### 3. Build for Production

```bash
npm run build
```

The production-ready bundle will be generated inside the `dist/` directory.

---

## ⚙️ Configuration

Application settings can be configured inside `src/config.js`:

```javascript
export const CONFIG = {
  // Google OAuth 2.0 Client ID
  GOOGLE_CLIENT_ID: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
  
  // Public CSV Export URL from Google Sheets
  SHEET_CSV_URL: "https://docs.google.com/spreadsheets/d/e/.../pub?output=csv"
};
```

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).
