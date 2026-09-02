document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const logoutBtn = document.getElementById("logoutBtn");
  const welcomeMsg = document.getElementById("welcomeMsg");
  const welcomeTitle = document.getElementById("welcomeTitle");

  let fakeUsers = [];
  try {
    fakeUsers = JSON.parse(localStorage.getItem("fakeUsers") || "[]");
  } catch (e) {
    fakeUsers = [];
  }

  function saveFakeUsers() {
    localStorage.setItem("fakeUsers", JSON.stringify(fakeUsers));
  }

  //LOGIN
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;

      fakeUsers.push({ email: email, password: password });
      saveFakeUsers();
      localStorage.setItem("fakeLoggedInUser", email || "guest");

      window.location.href = "LandingPage.html";
    });
  }

  //SIGN UP
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("signupEmail").value;
      const password = document.getElementById("signupPassword").value;
      const confirmPassword = document.getElementById(
        "signupConfirmPassword",
      ).value;

      fakeUsers.push({
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      });
      saveFakeUsers();
      localStorage.setItem("fakeLoggedInUser", email || "guest");

      window.location.href = "LandingPage.html";
    });
  }

  // LANDING PAGE
  if (welcomeMsg || welcomeTitle) {
    const user = localStorage.getItem("fakeLoggedInUser");
    if (user && welcomeTitle) {
      welcomeTitle.textContent = `Welcome, ${user}! You are logged in.`;
    }
  }

  // ADMIN PAGE — read-only view of "logged in users" (intentionally insecure)
  const adminTable = document.getElementById("adminUserTable");
  const adminCurrentUser = document.getElementById("adminCurrentUser");
  const adminCount = document.getElementById("adminCount");
  if (adminTable) {
    // INSECURE: no admin check — any visitor can read fakeUsers from localStorage
    // INSECURE: plaintext passwords rendered, innerHTML without sanitization (XSS demo)
    // Future: add delete / clear / search / role toggle here
    function renderAdminTable() {
      const current = localStorage.getItem("fakeLoggedInUser");
      if (adminCurrentUser) {
        adminCurrentUser.textContent = current || "(none — not logged in)";
        // highlight current user entry visually via text only (keep insecure)
      }
      if (adminCount) {
        adminCount.textContent = `${fakeUsers.length} user(s) recorded`;
      }
      if (fakeUsers.length === 0) {
        adminTable.innerHTML = `<tr><td colspan="4" class="empty">No users yet — sign up or log in to create entries.</td></tr>`;
        return;
      }
      adminTable.innerHTML = fakeUsers
        .map((u, i) => {
          const isCurrent = current && u.email === current ? ` class="is-current"` : "";
          // INSECURE: directly interpolating user-controlled values into innerHTML
          return `<tr${isCurrent}><td>${i + 1}</td><td>${u.email || ""}</td><td>${u.password || ""}</td><td>${u.confirmPassword || ""}</td></tr>`;
        })
        .join("");
    }
    renderAdminTable();
    // expose for future admin actions / console demo
    window.__renderAdminTable = renderAdminTable;
    window.__fakeUsers = fakeUsers;
  }

  //LOGOUT
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("fakeLoggedInUser");
      window.location.href = "LoginPage.html";
    });
  }
});
