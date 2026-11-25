# BrewBucks - Coffee Cafe website

Open `index.html` in a browser to start. No server needed.

```
brewbucks/
├── index.html        Home
├── menu.html         Menu + Add to Cart
├── cart.html         Cart
├── login.html        Login
├── signup.html       Sign up
├── payment.html      Payment (Razorpay / Cash on Delivery)
├── admin.html        Admin panel (all orders)
├── orders.html       My Orders
├── css/
│   └── style.css     All styles
├── js/
│   ├── main.js       Shared: cart, login state, navbar, toast
│   ├── config.js     Razorpay Key ID
│   ├── db.js         Mini database (localStorage tables)
│   ├── admin.js      Admin panel
│   ├── cart.js       Cart page
│   ├── login.js      Login page
│   ├── signup.js     Sign up page
│   ├── payment.js    Payment page (saves orders)
│   └── orders.js     My Orders page
└── images/           Coffee photos, hero banner, logo
```

Data is stored in the browser's localStorage:
`cart`, `users`, `orders`, `currentUser`.

Demo login: admin@gmail.com / 12345

Admin panel: log in as admin@gmail.com / 12345, then open the Admin link in the navbar.
Razorpay: put your Key ID in js/config.js.
