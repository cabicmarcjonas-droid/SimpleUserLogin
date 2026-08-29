// index.js — Phase 3 intentionally insecure auth (educational demo)
// Shared script for LoginPage.html, SignupPage.html, LandingPage.html
// Uses localStorage only to simulate a user store — never for real auth checks.

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");
    const logoutBtn = document.getElementById("logoutBtn");
    const welcomeMsg = document.getElementById("welcomeMsg");
    const welcomeTitle = document.getElementById("welcomeTitle");

    // Simulated user store (insecure — client-side only, no hashing, no server)
    // In a secure app this would be a server-side database.
    let fakeUsers = [];
    try {
        fakeUsers = JSON.parse(localStorage.getItem("fakeUsers") || "[]");
    } catch (e) {
        fakeUsers = [];
    }

    function saveFakeUsers() {
        localStorage.setItem("fakeUsers", JSON.stringify(fakeUsers));
    }

    // --- LOGIN (intentionally insecure) ---
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const email = document.getElementById("loginEmail").value;
            const password = document.getElementById("loginPassword").value;

            // SECURE TODO: Validate that email/username is not empty and has valid email format
            // SECURE TODO: Validate that password is not empty and meets strength requirements
            // SECURE TODO: Sanitize inputs to prevent XSS/injection

            // SECURE TODO: Look up user in real database / server, hash-compare password,
            //              return error if credentials are invalid instead of always succeeding
            // SECURE TODO: Implement rate limiting / lockout after failed attempts

            // INSECURE: No validation at all — even blank values are accepted
            // INSECURE: No authentication check — any input succeeds
            fakeUsers.push({ email: email, password: password });
            saveFakeUsers();
            localStorage.setItem("fakeLoggedInUser", email || "guest");

            // INSECURE: Always redirect to LandingPage regardless of input
            window.location.href = "LandingPage.html";
        });
    }

    // --- SIGN UP (intentionally insecure) ---
    if (signupForm) {
        signupForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const email = document.getElementById("signupEmail").value;
            const password = document.getElementById("signupPassword").value;
            const confirmPassword = document.getElementById("signupConfirmPassword").value;

            // SECURE TODO: Validate email format (e.g., regex or HTML5 type="email" + required)
            // SECURE TODO: Validate password strength (min length, complexity)
            // SECURE TODO: Check that password === confirmPassword and show error if not
            // SECURE TODO: Check for duplicate email/username and reject if already exists
            // SECURE TODO: Sanitize inputs

            // SECURE TODO: Hash password (bcrypt/argon2) on server before storing — never store plaintext
            // SECURE TODO: Create user via secure backend API, handle errors properly

            // INSECURE: No validation — blank, mismatched, or weak passwords all accepted
            // INSECURE: No duplicate check — same email can sign up infinitely
            // INSECURE: Passwords stored in plaintext in localStorage (visible in DevTools)
            fakeUsers.push({ email: email, password: password, confirmPassword: confirmPassword });
            saveFakeUsers();
            localStorage.setItem("fakeLoggedInUser", email || "guest");

            // INSECURE: Always redirect to LandingPage regardless of input
            window.location.href = "LandingPage.html";
        });
    }

    // --- LANDING PAGE (intentionally unprotected) ---
    if (welcomeMsg || welcomeTitle) {
        // SECURE TODO: Check session/token/cookie to verify user is actually authenticated
        // SECURE TODO: If not authenticated, redirect to LoginPage.html immediately
        // SECURE TODO: Fetch user profile from server securely instead of trusting localStorage
        // INSECURE: No auth guard at all — page renders as "logged in" for anyone

        const user = localStorage.getItem("fakeLoggedInUser");
        if (user && welcomeTitle) {
            // Cosmetic only — still shows logged-in state even when accessed directly without login
            welcomeTitle.textContent = `Welcome, ${user}! You are logged in.`;
        }
        // INSECURE: Even if `user` is null (direct URL access, no login), we keep the default
        //           "You are logged in" message instead of redirecting to login.
    }

    // --- LOGOUT ---
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            // SECURE TODO: Invalidate server session / JWT / cookie on backend
            e.preventDefault();
            // For demo, just clear the fake marker and go to login
            localStorage.removeItem("fakeLoggedInUser");
            window.location.href = "LoginPage.html";
        });
    }
});
