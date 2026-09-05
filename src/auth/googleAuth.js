/**
 * Google Identity Services Authentication & Session Management
 */
const SESSION_KEY = "kasatria_session";

/**
 * Initializes Google OAuth 2.0 Client and handles persistent session checks.
 * @param {string} clientId - Google OAuth Client ID
 * @param {Function} onSuccess - Callback invoked on successful authentication with token
 */
export function initGoogleAuth(clientId, onSuccess) {
  // Check if session token already exists in localStorage
  const savedToken = localStorage.getItem(SESSION_KEY);
  if (savedToken) {
    onSuccess(savedToken);
    return;
  }

  if (typeof google === "undefined" || !google.accounts) {
    console.warn("Google Identity Services SDK script not loaded.");
    return;
  }

  try {
    google.accounts.id.initialize({
      client_id: clientId,
      callback: (response) => {
        if (response.credential) {
          localStorage.setItem(SESSION_KEY, response.credential);
          onSuccess(response.credential);
        }
      }
    });

    const googleBtnContainer = document.getElementById("google-btn");
    if (googleBtnContainer) {
      google.accounts.id.renderButton(
        googleBtnContainer,
        { theme: "filled_blue", size: "large", width: 280, shape: "pill" }
      );
    }
  } catch (err) {
    console.warn("Google OAuth initialization notice:", err);
  }
}

/**
 * Clears saved authentication session and reloads application state.
 */
export function logoutSession() {
  localStorage.removeItem(SESSION_KEY);
  window.location.reload();
}


