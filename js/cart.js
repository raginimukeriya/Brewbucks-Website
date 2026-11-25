// Cart page logic (uses helpers from js/main.js)

function displayCart() {
    const cart = getCart();
    const cartItems = document.getElementById("cart-items");
    const emptyCart = document.getElementById("empty-cart");
    const summary = document.getElementById("cart-summary");
    const totalEl = document.getElementById("cart-total");

    cartItems.innerHTML = "";

    if (cart.length === 0) {
        emptyCart.style.display = "block";
        summary.style.display = "none";
        totalEl.textContent = "0";
        return;
    }

    emptyCart.style.display = "none";
    summary.style.display = "block";

    let cartTotal = 0;

    cart.forEach(function (item, index) {
        const itemTotal = item.price * item.quantity;
        cartTotal += itemTotal;

        cartItems.innerHTML += `
            <div class="cart-item">
                <div>
                    <h3>${escapeHTML(item.name)}</h3>
                    <p>Price: &#8377;${item.price}</p>
                </div>

                <div class="quantity">
                    <button type="button" aria-label="Decrease quantity" onclick="decreaseQuantity(${index})">-</button>
                    <span>${item.quantity}</span>
                    <button type="button" aria-label="Increase quantity" onclick="increaseQuantity(${index})">+</button>
                </div>

                <div class="cart-item-total">
                    <p>&#8377;${itemTotal}</p>
                    <button type="button" class="remove-btn" onclick="removeItem(${index})">Remove</button>
                </div>
            </div>
        `;
    });

    totalEl.textContent = cartTotal;
}

function increaseQuantity(index) {
    const cart = getCart();
    cart[index].quantity++;
    saveCart(cart);
}

function decreaseQuantity(index) {
    const cart = getCart();

    if (cart[index].quantity > 1) {
        cart[index].quantity--;
    } else {
        cart.splice(index, 1);
    }

    saveCart(cart);
}

function removeItem(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
}

function saveCart(cart) {
    saveCartData(cart);
    displayCart();
}

// Checkout needs a logged-in user, then goes to the payment page
function goToPayment() {
    if (getCart().length === 0) {
        showToast("Your cart is empty");
        return;
    }

    if (!getCurrentUser()) {
        window.location.href = "login.html?next=payment.html";
        return;
    }

    window.location.href = "payment.html";
}

displayCart();
