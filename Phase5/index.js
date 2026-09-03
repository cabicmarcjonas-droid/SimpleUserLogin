// Phase5 polished frontend — connected to Express + MongoDB Atlas backend
// All auth via /api/auth/*, JWT stored in localStorage as 'token'

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const logoutBtn = document.getElementById("logoutBtn");
  const welcomeTitle = document.getElementById("welcomeTitle");
  const welcomeSub = document.getElementById("welcomeSub");
  const loginError = document.getElementById("loginError");
  const signupError = document.getElementById("signupError");
  const landingError = document.getElementById("landingError");

  const TOKEN_KEY = "token";
  const USER_KEY = "currentUser"; // for display fallback

  function getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }
  function setSession(token, email) {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    if (email) localStorage.setItem(USER_KEY, email);
  }
  function clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    // clean legacy keys
    localStorage.removeItem("currentUser");
    localStorage.removeItem("users");
    localStorage.removeItem("fakeLoggedInUser");
    localStorage.removeItem("fakeUsers");
  }
  function showError(el, msg) {
    if (el) el.textContent = msg || "";
  }
  function setLoading(btn, loading) {
    if (!btn) return;
    btn.disabled = loading;
    btn.dataset.orig ||= btn.textContent;
    btn.textContent = loading ? "Please wait..." : btn.dataset.orig;
  }
  async function api(path, opts) {
    const res = await fetch(path, {
      headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
      ...opts,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`);
    return data;
  }

  // --- LOGIN ---
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      showError(loginError, "");
      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value;
      if (!email || !password) {
        showError(loginError, "Email and password are required.");
        return;
      }
      const btn = loginForm.querySelector("button[type=submit]");
      setLoading(btn, true);
      try {
        const data = await api("/api/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });
        setSession(data.token, data.user?.email || email);
        window.location.href = "LandingPage.html";
      } catch (err) {
        // 503 = DB not connected — give actionable hint
        showError(loginError, err.message.includes("503") || err.message.includes("Database not connected") ? err.message : err.message);
      } finally {
        setLoading(btn, false);
      }
    });
  }

  // --- SIGNUP ---
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      showError(signupError, "");
      const email = document.getElementById("signupEmail").value.trim();
      const password = document.getElementById("signupPassword").value;
      const confirmPassword = document.getElementById("signupConfirmPassword").value;

      if (!email || !password || !confirmPassword) {
        showError(signupError, "All fields are required.");
        return;
      }
      if (password !== confirmPassword) {
        showError(signupError, "Passwords do not match.");
        return;
      }
      if (password.length < 8) {
        showError(signupError, "Password must be at least 8 characters.");
        return;
      }

      const btn = signupForm.querySelector("button[type=submit]");
      setLoading(btn, true);
      try {
        const data = await api("/api/auth/signup", {
          method: "POST",
          body: JSON.stringify({ email, password, confirmPassword }),
        });
        setSession(data.token, data.user?.email || email);
        window.location.href = "LandingPage.html";
      } catch (err) {
        showError(signupError, err.message);
      } finally {
        setLoading(btn, false);
      }
    });
  }

  // --- LANDING (protected) ---
  if (welcomeTitle) {
    (async () => {
      const token = getToken();
      if (!token) {
        // No session — redirect to login (keep polished default hidden)
        window.location.href = "LoginPage.html";
        return;
      }
      try {
        const user = await api("/api/auth/me", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        welcomeTitle.textContent = `Welcome, ${user.email}! You are logged in.`;
        if (welcomeSub) {
          welcomeSub.style.display = "block";
          const d = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "";
          welcomeSub.textContent = d ? `Member since ${d}` : "";
        }
      } catch (err) {
        // 401 or DB not ready → back to login
        showError(landingError, err.message);
        if (err.message.toLowerCase().includes("token") || err.message.includes("401") || err.message.includes("authorization")) {
          clearSession();
          // small delay so user sees error before redirect
          setTimeout(() => (window.location.href = "LoginPage.html"), 1200);
        }
      }
    })();
  }

  // --- LOGOUT ---
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      clearSession();
      window.location.href = "LoginPage.html";
    });
  }
});
