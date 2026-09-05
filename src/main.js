/**
 * Kasatria 3D Data Visualizer - Main Entrypoint
 */
import { CONFIG } from "./config.js";
import { fetchSheetData } from "./services/sheetService.js";
import { initGoogleAuth, logoutSession } from "./auth/googleAuth.js";
import { SceneManager } from "./scene/sceneManager.js";
import { setupUIControls } from "./components/uiControls.js";
import "./styles/main.css";

let sceneManagerInstance = null;

/**
 * Initializes and starts the 3D visualizer app after authentication.
 * @param {string} token - Session or Google OAuth authentication token
 */
async function startApp(token) {
  const loginScreen = document.getElementById("login-screen");
  const uiOverlay = document.getElementById("ui-overlay");

  if (loginScreen) loginScreen.style.display = "none";
  if (uiOverlay) uiOverlay.style.display = "flex";

  if (!sceneManagerInstance) {
    // Fetch and process dataset records
    const data = await fetchSheetData(CONFIG.SHEET_CSV_URL);

    // Initialize 3D Scene Manager
    sceneManagerInstance = new SceneManager("container");
    sceneManagerInstance.init(data);

    // Setup UI event listeners, search filters, and statistics
    setupUIControls(sceneManagerInstance, data);

    // Setup Sign Out handler
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", logoutSession);
    }
  }
}

/**
 * Primary entrypoint execution checking document readiness.
 */
function init() {
  initGoogleAuth(CONFIG.GOOGLE_CLIENT_ID, (token) => {
    startApp(token);
  });
}

if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", init);
} else {
  init();
}


