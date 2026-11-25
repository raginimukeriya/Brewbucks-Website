// Sign up logic (uses helpers from js/main.js)

document.getElementById("signupForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("signupEmail").value.trim().toLowerCase();
    const password = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const message = document.getElementById("signupMessage");

    function fail(text) {
        message.textContent = text;
        message.style.color = "red";
    }

    if (name === "") {
        fail("Please enter your name.");
        return;
    }

    if (password.length < 6) {
        fail("Password must be at least 6 characters.");
        return;
    }

    if (password !== confirmPassword) {
        fail("Passwords do not match.");
        return;
    }

    const users = readJSON("users", []);

    if (email === "admin@gmail.com" || users.some(u => u.email === email)) {
        fail("An account with this email already exists. Please log in.");
        return;
    }

    users.push({ name: name, email: email, hash: await hashPassword(password) });
    writeJSON("users", users);

    message.textContent = "Account created successfully! Redirecting to login...";
    message.style.color = "green";

    setTimeout(function () {
        window.location.href = "login.html";
    }, 1000);
});
