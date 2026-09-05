/**
 * UI Controls Overlay Component Controller
 * Binds menu shape layout buttons, search input filters, and dataset statistics header.
 */
import { setupModalListeners, showEntityModal } from "./modal.js";

/**
 * Initializes UI control listeners and calculates header summary statistics.
 * @param {SceneManager} sceneManager - 3D Scene Manager instance
 * @param {Array<Object>} data - Array of candidate record objects
 */
export function setupUIControls(sceneManager, data = []) {
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

  // Calculate statistics if data is available
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

