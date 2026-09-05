/**
 * Entity Detail Modal Controller
 * Handles 2D detail popup overlay for selected candidate records.
 */

export function showEntityModal(item) {
  const modal = document.getElementById("detail-modal");
  if (!modal || !item) return;

  const photo = document.getElementById("modal-photo");
  const name = document.getElementById("modal-name");
  const number = document.getElementById("modal-number");
  const country = document.getElementById("modal-country");
  const interest = document.getElementById("modal-interest");
  const worth = document.getElementById("modal-worth");

  const fallbackAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80";

  if (photo) {
    photo.src = item.photo || fallbackAvatar;
    photo.onerror = () => { photo.src = fallbackAvatar; };
  }

  if (name) name.textContent = item.name || "Unknown Entity";
  if (number) number.textContent = `#${item.id || 0}`;
  if (country) country.textContent = item.country || "N/A";
  if (interest) interest.textContent = item.interest || "N/A";

  if (worth) {
    const val = item.netWorth || 0;
    worth.textContent = `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    if (val < 100000) {
      worth.style.background = "#EF3022";
      worth.style.color = "#ffffff";
    } else if (val <= 200000) {
      worth.style.background = "#F7931E";
      worth.style.color = "#ffffff";
    } else {
      worth.style.background = "#3AB54A";
      worth.style.color = "#ffffff";
    }
  }

  modal.style.display = "flex";
}

export function hideEntityModal() {
  const modal = document.getElementById("detail-modal");
  if (modal) {
    modal.style.display = "none";
  }
}

export function setupModalListeners() {
  const closeBtn = document.getElementById("modal-close");
  const modal = document.getElementById("detail-modal");

  if (closeBtn) {
    closeBtn.addEventListener("click", hideEntityModal);
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        hideEntityModal();
      }
    });
  }

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      hideEntityModal();
    }
  });
}
