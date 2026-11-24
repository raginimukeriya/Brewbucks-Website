// Admin panel: lists every order saved in the "orders" table (js/db.js)

const STATUSES = ["Placed", "Preparing", "Delivered", "Cancelled"];
const METHOD_LABEL = { razorpay: "Razorpay", cod: "Cash on Delivery" };

if (!isAdmin(getCurrentUser())) {
    window.location.replace("login.html?next=admin.html");
}

function render() {
    const q = document.getElementById("search").value.trim().toLowerCase();
    const st = document.getElementById("filterStatus").value;
    const me = document.getElementById("filterMethod").value;

    const all = DB.all("orders").slice().reverse(); // newest first

    const rows = all.filter(function (o) {
        if (st && o.status !== st) return false;
        if (me && o.method !== me) return false;
        if (!q) return true;
        return [o.orderId, o.userName, o.userEmail]
            .some(v => String(v || "").toLowerCase().includes(q));
    });

    const live = all.filter(o => o.status !== "Cancelled");
    const collected = live.filter(o => o.paymentStatus === "Paid").reduce((s, o) => s + o.total, 0);
    const codDue = live.filter(o => o.paymentStatus === "COD").reduce((s, o) => s + o.total, 0);

    document.getElementById("stats").innerHTML = [
        ["Total orders", live.length],
        ["To prepare / deliver", live.filter(o => ["Placed", "Preparing"].includes(o.status)).length],
        ["Collected", "&#8377;" + collected],
        ["COD to collect", "&#8377;" + codDue]
    ].map(s => `<div class="stat"><span>${s[0]}</span><strong>${s[1]}</strong></div>`).join("");

    const body = document.getElementById("ordersBody");
    if (rows.length === 0) {
        body.innerHTML = '<tr><td colspan="7" class="admin-empty">No orders found.</td></tr>';
        return;
    }

    body.innerHTML = rows.map(function (o) {
        const items = o.items.map(i => `${escapeHTML(i.name)} &times; ${i.quantity}`).join("<br>");
        const options = STATUSES.map(s =>
            `<option value="${s}"${s === o.status ? " selected" : ""}>${s}</option>`).join("");
        const pay = o.paymentStatus || (o.method === "cod" ? "COD" : "Paid");

        return `<tr>
            <td><strong>${escapeHTML(o.orderId)}</strong></td>
            <td>${escapeHTML(new Date(o.createdAt).toLocaleString("en-IN"))}</td>
            <td>${escapeHTML(o.userName || "-")}<br><small>${escapeHTML(o.userEmail)}</small></td>
            <td>${items}</td>
            <td>&#8377;${o.total}</td>
            <td>${escapeHTML(METHOD_LABEL[o.method] || o.method)}<br>
                <span class="pay-badge pay-${escapeHTML(pay)}">${escapeHTML(pay)}</span>
                ${o.razorpayPaymentId ? "<br><small>" + escapeHTML(o.razorpayPaymentId) + "</small>" : ""}</td>
            <td><select class="status-select" data-id="${escapeHTML(o.id)}">${options}</select></td>
        </tr>`;
    }).join("");
}

document.getElementById("ordersBody").addEventListener("change", function (event) {
    const select = event.target.closest(".status-select");
    if (!select) return;

    const order = DB.findOne("orders", { id: select.dataset.id });
    const changes = { status: select.value };
    if (order && order.method === "cod" && select.value === "Delivered") changes.paymentStatus = "Paid";

    DB.update("orders", select.dataset.id, changes);
    showToast("Status: " + select.value);
    render();
});

const sel = document.getElementById("filterStatus");
STATUSES.forEach(s => sel.add(new Option(s, s)));

["search", "filterStatus", "filterMethod"].forEach(id =>
    document.getElementById(id).addEventListener("input", render));

// Pick up orders placed in another tab
window.addEventListener("storage", render);

render();
