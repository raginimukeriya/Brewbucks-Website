/* BrewBucks - shared helpers (cart, auth, navbar, toast) */

// ---------- Safe storage ----------
function readJSON(key, fallback) {
    try {
        const value = JSON.parse(localStorage.getItem(key));
        return value === null || value === undefined ? fallback : value;
    } catch (e) {
        return fallback;
    }
}

function writeJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = String(text);
    return div.innerHTML;
}

// ---------- Cart ----------
function getCart() {
    const cart = readJSON("cart", []);
    return Array.isArray(cart) ? cart : [];
}

function saveCartData(cart) {
    writeJSON("cart", cart);
    updateCartBadge();
}

function addToCart(name, price) {
    const cart = getCart();
    const existing = cart.find(item => item.name === name);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ name: name, price: price, quantity: 1 });
    }

    saveCartData(cart);
    showToast(name + " added to cart");
}

function updateCartBadge() {
    const badge = document.getElementById("cartBadge");
    if (!badge) return;

    const count = getCart().reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = count;
    badge.hidden = count === 0;
}

// ---------- Auth ----------
function getCurrentUser() {
    return readJSON("currentUser", null);
}

function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
}

// Admin = the built-in admin account (see login.js)
function isAdmin(user) {
    return !!user && user.email === "admin@gmail.com";
}

async function hashPassword(password) {
    // SHA-256 where the browser allows it (https / localhost / file).
    // Demo project only: real apps must hash on a server.
    try {
        const bytes = new TextEncoder().encode(password);
        const digest = await crypto.subtle.digest("SHA-256", bytes);
        return Array.from(new Uint8Array(digest))
            .map(b => b.toString(16).padStart(2, "0"))
            .join("");
    } catch (e) {
        return "plain:" + password;
    }
}

// ---------- Navbar ----------
function setupNavbar() {
    const page = location.pathname.split("/").pop() || "index.html";

    // Logged-in users get a "My Orders" link
    const authItem = document.getElementById("authLink");
    const me = getCurrentUser();
    if (authItem && me) {
        const links = [["orders.html", "My Orders"]];
        if (isAdmin(me)) links.push(["admin.html", "Admin"]);
        links.forEach(function (l) {
            const li = document.createElement("li");
            li.innerHTML = '<a href="' + l[0] + '">' + l[1] + '</a>';
            authItem.parentElement.before(li);
        });
    }

    document.querySelectorAll(".nav-links a").forEach(link => {
        if (link.getAttribute("href") === page) {
            link.setAttribute("aria-current", "page");
        }
    });

    const authLink = document.getElementById("authLink");
    const user = getCurrentUser();

    if (authLink && user) {
        authLink.textContent = "Logout (" + user.name.split(" ")[0] + ")";
        authLink.href = "#";
        authLink.addEventListener("click", function (event) {
            event.preventDefault();
            logout();
        });
    }

    updateCartBadge();
}

// ---------- Toast ----------
function showToast(message) {
    let toast = document.getElementById("toast");

    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        toast.setAttribute("role", "status");
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(function () {
        toast.classList.remove("show");
    }, 1800);
}

document.addEventListener("DOMContentLoaded", setupNavbar);
