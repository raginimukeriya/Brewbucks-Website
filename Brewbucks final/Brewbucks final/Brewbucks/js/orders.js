// My Orders page (reads the "orders" table from js/db.js)

const user = getCurrentUser();

if (!user) {
    window.location.replace("login.html?next=orders.html");
} else {
    const orders = DB.find("orders", { userEmail: user.email }).reverse(); // newest first
    const list = document.getElementById("orders-list");
    const none = document.getElementById("no-orders");

    if (orders.length === 0) {
        none.style.display = "block";
    } else {
        none.style.display = "none";

        orders.forEach(function (order) {
            const date = new Date(order.createdAt).toLocaleString("en-IN");
            const methods = { razorpay: "Online (Razorpay)", cod: "Cash on Delivery" };

            const items = order.items.map(function (item) {
                return `<li>${escapeHTML(item.name)} &times; ${item.quantity}
                        <span>&#8377;${item.price * item.quantity}</span></li>`;
            }).join("");

            list.innerHTML += `
                <div class="order-card">
                    <div class="order-head">
                        <strong>Order ${escapeHTML(order.orderId)}</strong>
                        <span class="order-status">${escapeHTML(order.status)}</span>
                    </div>
                    <p class="order-meta">${escapeHTML(date)} &middot; ${escapeHTML(methods[order.method] || order.method)}</p>
                    <ul class="order-items">${items}</ul>
                    <p class="order-total">Total: &#8377;${order.total}</p>
                </div>
            `;
        });
    }
}
