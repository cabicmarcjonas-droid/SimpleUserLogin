document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const logoutBtn = document.getElementById("logoutBtn");
  const welcomeMsg = document.getElementById("welcomeMsg");
  const welcomeTitle = document.getElementById("welcomeTitle");

  let users = [];
  try {
    users = JSON.parse(localStorage.getItem("users") || "[]");
  } catch (e) {
    users = [];
  }

  function saveUsers() {
    localStorage.setItem("users", JSON.stringify(users));
  }

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;

      users.push({ email: email, password: password });
      saveUsers();
      localStorage.setItem("currentUser", email || "guest");

      window.location.href = "LandingPage.html";
    });
  }

  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("signupEmail").value;
      const password = document.getElementById("signupPassword").value;
      const confirmPassword = document.getElementById(
        "signupConfirmPassword",
      ).value;

      users.push({
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      });
      saveUsers();
      localStorage.setItem("currentUser", email || "guest");

      window.location.href = "LandingPage.html";
    });
  }

  if (welcomeMsg || welcomeTitle) {
    const user = localStorage.getItem("currentUser");
    if (user && welcomeTitle) {
      welcomeTitle.textContent = `Welcome, ${user}! You are logged in.`;
    }
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("currentUser");
      window.location.href = "LoginPage.html";
    });
  }
});
