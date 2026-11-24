// Login logic (uses helpers from js/main.js)

// Built-in demo account so the project can be tried without signing up
const DEMO_USER = { name: "Admin", email: "admin@gmail.com", password: "12345" };

// Only allow redirects to pages inside this project
function getNextPage() {
    const next = new URLSearchParams(location.search).get("next");
    const allowed = ["payment.html", "cart.html", "menu.html", "orders.html", "index.html", "admin.html"];
    if (allowed.includes(next)) return next;
    return isAdmin(readJSON("currentUser", null)) ? "admin.html" : "index.html";
}

document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const message = document.getElementById("loginMessage");

    let user = null;

    if (email === DEMO_USER.email && password === DEMO_USER.password) {
        user = { name: DEMO_USER.name, email: DEMO_USER.email };
    } else {
        const users = readJSON("users", []);
        const saved = users.find(u => u.email === email);

        if (saved && saved.hash === await hashPassword(password)) {
            user = { name: saved.name, email: saved.email };
        }
    }

    if (!user) {
        message.textContent = "Invalid email or password.";
        message.style.color = "red";
        return;
    }

    writeJSON("currentUser", user);

    message.textContent = "Login successful!";
    message.style.color = "green";

    setTimeout(function () {
        window.location.href = getNextPage();
    }, 800);
});
