/**
 * UI Controls Overlay Component Controller
 * Binds menu shape layout buttons, search input filters, dataset statistics header, and data refresh.
 */
import { setupModalListeners, showEntityModal } from "./modal.js";
import { fetchSheetData } from "../services/sheetService.js";
import { CONFIG } from "../config.js";

/**
 * Recalculates and updates header summary statistics.
 * @param {Array<Object>} data - Array of record objects
 */
export function updateUIStats(data = []) {
  if (data && data.length > 0) {
    const totalCountEl = document.getElementById("stat-total");
    const avgWorthEl = document.getElementById("stat-avg");

    if (totalCountEl) totalCountEl.textContent = data.length.toLocaleString();

    if (avgWorthEl) {
      const totalWorth = data.reduce((acc, curr) => acc + (curr.netWorth || 0), 0);
      const avg = totalWorth / data.length;
      avgWorthEl.textContent = "$" + Math.round(avg).toLocaleString();
    }
  }
}

/**
 * Initializes UI control listeners, refresh trigger, CSV upload, and calculates header summary statistics.
 * @param {SceneManager} sceneManager - 3D Scene Manager instance
 * @param {Array<Object>} initialData - Array of candidate record objects
 */
export function setupUIControls(sceneManager, initialData = []) {
  setupModalListeners();

  const menuButtons = ["table", "sphere", "helix", "grid"];

  menuButtons.forEach((mode) => {
    const btn = document.getElementById(mode);
    if (btn) {
      btn.addEventListener("click", () => {
        document.querySelectorAll("#menu button").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        sceneManager.setLayout(mode);
      });
    }
  });

  // Setup Search Input Filter
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      sceneManager.filterCards(e.target.value);
    });

    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const query = searchInput.value.trim();
        if (query !== "") {
          const matchItem = sceneManager.getFirstMatchItem(query);
          if (matchItem) {
            showEntityModal(matchItem);
          }
        }
      }
    });
  }

  // Setup Refresh Data Button (SVG Icon)
  const refreshBtn = document.getElementById("refresh-btn");
  let isRefreshing = false;

  async function handleRefresh() {
    if (isRefreshing) return;
    isRefreshing = true;

    if (refreshBtn) {
      refreshBtn.classList.add("refreshing");
      const span = refreshBtn.querySelector("span");
      if (span) span.textContent = "Refreshing...";
    }

    try {
      const newData = await fetchSheetData(CONFIG.SHEET_CSV_URL);
      sceneManager.updateData(newData);
      updateUIStats(newData);
    } catch (err) {
      console.error("Failed to refresh sheet data:", err);
    } finally {
      isRefreshing = false;
      if (refreshBtn) {
        refreshBtn.classList.remove("refreshing");
        const span = refreshBtn.querySelector("span");
        if (span) span.textContent = "Refresh";
      }
    }
  }

  if (refreshBtn) {
    refreshBtn.addEventListener("click", handleRefresh);
  }



  // Auto-refresh Google Sheet data every 60 seconds automatically
  setInterval(() => {
    handleRefresh();
  }, 60000);

  // Initial stats update
  updateUIStats(initialData);
}

