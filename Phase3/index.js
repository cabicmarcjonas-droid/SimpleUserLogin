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

  //LOGOUT
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("fakeLoggedInUser");
      window.location.href = "LoginPage.html";
    });
  }
});
