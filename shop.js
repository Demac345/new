const products = [
  { id: 1, name: "Studio tee", category: "shirts", price: 42, image: "images/tshirt.jpg", tag: "New" },
  { id: 2, name: "Heavyweight hoodie", category: "hoodies", price: 88, image: "images/sweeter.jpg", tag: "Bestseller" },
  { id: 3, name: "Utility cargo", category: "trousers", price: 96, image: "images/cargo.jpg", tag: "Limited" },
  { id: 4, name: "Everyday trouser", category: "trousers", price: 84, image: "images/trouser.jpg", tag: "" },
  { id: 5, name: "Core cap", category: "caps", price: 34, image: "images/cap.jpg", tag: "New" },
  { id: 6, name: "Washed black tee", category: "shirts", price: 46, image: "images/black.jpg", tag: "" },
  { id: 7, name: "Daylight cap", category: "caps", price: 36, image: "images/guy-cap.jpg", tag: "" },
  { id: 8, name: "Relaxed fit", category: "shirts", price: 58, image: "images/guy.jpg", tag: "" }
];

const state = { category: "all", search: "", sort: "featured", cart: JSON.parse(localStorage.getItem("dez-cart") || "[]") };
const grid = document.getElementById("product-grid");
const emptyState = document.getElementById("empty-state");
const money = value => `$${value.toFixed(2)}`;

function visibleProducts() {
  let result = products.filter(product => (state.category === "all" || product.category === state.category) && product.name.toLowerCase().includes(state.search.toLowerCase()));
  if (state.sort === "low") result.sort((a, b) => a.price - b.price);
  if (state.sort === "high") result.sort((a, b) => b.price - a.price);
  return result;
}

function renderProducts() {
  const result = visibleProducts();
  emptyState.hidden = result.length > 0;
  grid.innerHTML = result.map(product => `
    <article class="product-card">
      <button class="product-image" data-quick-view="${product.id}" aria-label="Quick view ${product.name}">
        ${product.tag ? `<span class="product-tag">${product.tag}</span>` : ""}
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <span class="quick-label">Quick view</span>
      </button>
      <div class="product-info"><div><p class="product-category">${product.category}</p><h2>${product.name}</h2></div><strong>${money(product.price)}</strong></div>
      <button class="add-button" data-add-to-cart="${product.id}">Add to bag <i class="fa-solid fa-plus"></i></button>
    </article>`).join("");
}

function renderCart() {
  const count = state.cart.reduce((total, item) => total + item.quantity, 0);
  document.getElementById("cart-count").textContent = count;
  document.getElementById("cart-items").innerHTML = state.cart.length ? state.cart.map(item => `<div class="cart-item"><img src="${item.image}" alt=""><div><h3>${item.name}</h3><p>${item.quantity} × ${money(item.price)}</p></div><button data-remove="${item.id}" aria-label="Remove ${item.name}">&times;</button></div>`).join("") : '<p class="cart-empty">Your bag is waiting for something good.</p>';
  document.getElementById("cart-total").textContent = money(state.cart.reduce((total, item) => total + item.price * item.quantity, 0));
  localStorage.setItem("dez-cart", JSON.stringify(state.cart));
}

function openCart() { document.getElementById("cart-drawer").classList.add("is-open"); document.getElementById("drawer-backdrop").classList.add("is-visible"); document.getElementById("cart-drawer").setAttribute("aria-hidden", "false"); }
function closeCart() { document.getElementById("cart-drawer").classList.remove("is-open"); document.getElementById("drawer-backdrop").classList.remove("is-visible"); document.getElementById("cart-drawer").setAttribute("aria-hidden", "true"); }

document.getElementById("hamburger").addEventListener("click", () => document.getElementById("nav-links").classList.toggle("active"));
document.querySelectorAll("#nav-links a").forEach(link => link.addEventListener("click", () => document.getElementById("nav-links").classList.remove("active")));
document.querySelectorAll(".filter-button").forEach(button => button.addEventListener("click", () => { state.category = button.dataset.category; document.querySelector(".filter-button.is-active").classList.remove("is-active"); button.classList.add("is-active"); renderProducts(); }));
document.getElementById("sort-products").addEventListener("change", event => { state.sort = event.target.value; renderProducts(); });
document.getElementById("product-search").addEventListener("input", event => { state.search = event.target.value; renderProducts(); });
document.getElementById("search-button").addEventListener("click", () => { document.getElementById("search-panel").classList.add("is-visible"); document.getElementById("product-search").focus(); });
document.getElementById("search-close").addEventListener("click", () => document.getElementById("search-panel").classList.remove("is-visible"));
document.getElementById("bag-button").addEventListener("click", openCart);
document.getElementById("drawer-close").addEventListener("click", closeCart);
document.getElementById("drawer-backdrop").addEventListener("click", closeCart);
document.getElementById("modal-close").addEventListener("click", () => document.getElementById("quick-view").close());
document.addEventListener("click", event => {
  const addButton = event.target.closest("[data-add-to-cart]");
  const removeButton = event.target.closest("[data-remove]");
  const quickViewButton = event.target.closest("[data-quick-view]");
  if (quickViewButton) {
    const product = products.find(item => item.id === Number(quickViewButton.dataset.quickView));
    document.getElementById("quick-view-content").innerHTML = `<div class="quick-view-image"><img src="${product.image}" alt="${product.name}"></div><div class="quick-view-copy"><p class="eyebrow">${product.category}</p><h2>${product.name}</h2><strong>${money(product.price)}</strong><p>A considered everyday layer from the Dez Threads collection. Designed with a relaxed fit and made for repeat wear.</p><button class="checkout-button" data-add-to-cart="${product.id}">Add to bag <i class="fa-solid fa-plus"></i></button></div>`;
    document.getElementById("quick-view").showModal();
  }
  if (addButton) { const product = products.find(item => item.id === Number(addButton.dataset.addToCart)); const existing = state.cart.find(item => item.id === product.id); existing ? existing.quantity++ : state.cart.push({ ...product, quantity: 1 }); renderCart(); addButton.innerHTML = "Added <i class='fa-solid fa-check'></i>"; setTimeout(() => { addButton.innerHTML = "Add to bag <i class='fa-solid fa-plus'></i>"; }, 900); }
  if (removeButton) { state.cart = state.cart.filter(item => item.id !== Number(removeButton.dataset.remove)); renderCart(); }
});

renderProducts();
renderCart();