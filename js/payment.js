// Payment page logic (uses helpers from js/main.js)

const cart = getCart();

// Guard: need items in the cart and a logged-in user
if (cart.length === 0) {
    window.location.replace("cart.html");
} else if (!getCurrentUser()) {
    window.location.replace("login.html?next=payment.html");
}

// ---------- Order summary ----------
let total = 0;
const paymentItems = document.getElementById("paymentItems");

cart.forEach(function (item) {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    paymentItems.innerHTML += `
        <div class="payment-item">
            <span>${escapeHTML(item.name)} &times; ${item.quantity}</span>
            <span>&#8377;${itemTotal}</span>
        </div>
    `;
});

document.getElementById("paymentTotal").textContent = total;

// ---------- Helpers ----------
const message = document.getElementById("paymentMessage");
const payBtn = document.getElementById("payBtn");

function fail(text) {
    message.textContent = text;
    message.style.color = "red";
    payBtn.disabled = false;
}

function saveOrder(orderId, method, extra) {
    const user = getCurrentUser();
    DB.insert("orders", Object.assign({
        orderId: orderId,
        userEmail: user.email,
        userName: user.name,
        items: cart,
        total: total,
        method: method,
        paymentStatus: method === "cod" ? "COD" : "Paid",
        status: "Placed"
    }, extra || {}));

    localStorage.removeItem("cart");
    updateCartBadge();

    message.textContent = (method === "cod"
        ? "Order placed! Pay in cash on delivery. Order ID: "
        : "Payment successful! Order ID: ") + orderId;
    message.style.color = "green";

    setTimeout(function () { window.location.href = "orders.html"; }, 2500);
}

function payWithRazorpay(orderId) {
    const user = getCurrentUser();

    const rzp = new Razorpay({
        key: RAZORPAY_KEY_ID,
        amount: total * 100,              // paise
        currency: "INR",
        name: "BrewBucks",
        description: "Order " + orderId,
        prefill: { name: user.name, email: user.email },
        theme: { color: "#4b2e24" },
        modal: { ondismiss: function () { fail("Payment cancelled. You can try again."); } },
        handler: function (response) {
            saveOrder(orderId, "razorpay", { razorpayPaymentId: response.razorpay_payment_id });
        }
    });

    rzp.on("payment.failed", function (resp) {
        fail("Payment failed: " + ((resp.error && resp.error.description) || "please try again."));
    });

    rzp.open();
}

// ---------- Submit ----------
document.getElementById("paymentForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const method = document.getElementById("paymentMethod").value;

    if (method === "") return fail("Please select a payment method.");

    const orderId = "BB" + Date.now().toString().slice(-8);
    payBtn.disabled = true;

    if (method === "cod") {
        saveOrder(orderId, "cod");
        return;
    }

    if (typeof Razorpay === "undefined") return fail("Could not load Razorpay. Check your internet connection.");
    if (RAZORPAY_KEY_ID.indexOf("XXXX") !== -1) return fail("Razorpay key is not set. Add it in js/config.js.");

    payWithRazorpay(orderId);
});
