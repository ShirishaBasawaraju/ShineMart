/* ---------- Product Catalog ---------- */
const products = [
  { id: 1, name: "Dot & Key Watermelon Sunscreen", price: 400, brand: "Dot & Key", category: "Skincare", stock: true, discount: "10% off", rating: 4.5, description: "Brightens skin, reduces spots, evens tone.", img: "./images/d.k watermleon suncreen.jpg", skinTypes: ["normal","oily","combination"] },
  { id: 2, name: "Dot & Key CICA + Niacinamide Oil-Free Moisturizer", price: 380, brand: "Dot & Key", category: "Skincare", stock: true, discount: "10% off", rating: 4.6, description: "Oil-free moisturizer for oily & acne-prone skin.", img: "images/dk oil-free moisture.jpg", skinTypes: ["oily","sensitive","combination"] },
  { id: 3, name: "Dot & Key Vitamin C + E Sorbet Super Bright Moisturizer", price: 420, brand: "Dot & Key", category: "Skincare", stock: true, discount: null, rating: 4.5, description: "Vitamin C cream that fades pigmentation & dullness.", img: "images/dk vitaminc+e mositure.jpg", skinTypes: ["all"] },
  { id: 4, name: "Good Vibes De-Tan Glow Night Cream Ubtan", price: 299, brand: "Good Vibes", category: "Skincare", stock: true, discount: "5% off", rating: 4.2, description: "Night cream that brightens, reduces tan & pigmentation.", img: "images/goodvibes de-tan.jpg", skinTypes: ["normal","dry","combination"] },
  { id: 5, name: "Good Vibes Anti-Blemish Vitamin C Glow Night Cream", price: 289, brand: "Good Vibes", category: "Skincare", stock: true, discount: null, rating: 4.3, description: "Vitamin C night cream for spotless, bright skin.", img: "images/goodvibes nigth cream.jpg", skinTypes: ["all"] },
  { id: 6, name: "Good Vibes Beetroot Plumping Lip Balm", price: 199, brand: "Good Vibes", category: "Lipcare", stock: true, discount: "10% off", rating: 4.4, description: "Tinted beetroot lip balm with SPF. Hydrates & nourishes.", img: "images/goodvibes bb lipblam.jpg", skinTypes: ["all"] },
  { id: 7, name: "Plum Green Tea Oil-Free Moisturizer", price: 399, brand: "Plum", category: "Skincare", stock: true, discount: "15% off", rating: 4.5, description: "Hydration with Niacinamide & Hyaluronic Acid.", img: "images/plum green tree oilfreeM.jpg", skinTypes: ["oily","combination"] },
  { id: 8, name: "Plum 10% Niacinamide Face Serum", price: 499, brand: "Plum", category: "Skincare", stock: true, discount: null, rating: 4.6, description: "Serum with rice ferment to brighten skin.", img: "images/plum serum.jpg", skinTypes: ["all"] },
  { id: 9, name: "Plum Coconut Milk & Peptides Strength & Shine Shampoo", price: 699, brand: "Plum", category: "Haircare", stock: true, discount: null, rating: 4.3, description: "Strengthens hair & adds shine.", img: "images/plum hair shampoo.jpg", skinTypes: ["all"] },
  { id: 10, name: "Plum Coconut Milk & Peptides Strength & Shine Conditioner", price: 599, brand: "Plum", category: "Haircare", stock: true, discount: null, rating: 4.4, description: "Prevents breakage & nourishes hair.", img: "images", skinTypes: ["all"] }
];

/* ---------- Cart & Wishlist State ---------- */
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

function saveState() {
  localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

/* ---------- Update Counts ---------- */
function updateCounts() {
  document.querySelectorAll("#cart-count").forEach(el => el.textContent = cart.length);
  document.querySelectorAll("#wishlist-count").forEach(el => el.textContent = wishlist.length);
}

/* ---------- Flash Message ---------- */
function flashMessage(text) {
  const m = document.createElement("div");
  m.textContent = text;
  Object.assign(m.style, {
    position: "fixed", right: "18px", top: "18px",
    background: "#221034", color: "white",
    padding: "8px 12px", borderRadius: "8px", zIndex: 9999,
    boxShadow: "0 6px 20px rgba(0,0,0,0.4)"
  });
  document.body.appendChild(m);
  setTimeout(() => m.style.opacity = "0", 1200);
  setTimeout(() => m.remove(), 1600);
}

/* ---------- Render Products Page (with filters) ---------- */
function renderProductsPage(filteredProducts = products) {
  const container = document.getElementById("product-list");
  if (!container) return;

  container.innerHTML = "";
  if (filteredProducts.length === 0) {
    container.innerHTML = `<p>No products found.</p>`;
    return;
  }

  filteredProducts.forEach(p => {
    container.insertAdjacentHTML("beforeend", `
      <div class="product-card fade-in">
        <img src="${p.img}" alt="${p.name}" class="thumbnail">
        <h2>${p.name}</h2>
        <p class="brand">${p.brand} • <span class="category">${p.category}</span></p>
        <p class="description">${p.description}</p>
        <p class="price">₹${p.price}</p>
        <p class="stock ${p.stock ? "" : "out-of-stock"}">${p.stock ? "In Stock" : "Out of Stock"}</p>
        <div class="rating">⭐ ${p.rating}/5</div>
        <div class="card-actions">
          <button onclick="addToCart(${p.id})" ${p.stock ? "" : "disabled"}>Add to Cart</button>
          <button onclick="addToWishlist(${p.id})">Wishlist</button>
        </div>
      </div>
    `);
  });
}

/* ---------- Filters & Search ---------- */
function setupFilters() {
  const searchInput = document.getElementById("search-bar");
  const brandFilter = document.getElementById("brand-filter");
  const categoryFilter = document.getElementById("category-filter");

  function applyFilters() {
    const query = searchInput?.value.toLowerCase() || "";
    const brand = brandFilter?.value || "all";
    const category = categoryFilter?.value || "all";

    let filtered = products.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
    );

    if (brand !== "all") filtered = filtered.filter(p => p.brand === brand);
    if (category !== "all") filtered = filtered.filter(p => p.category === category);

    renderProductsPage(filtered);
  }

  searchInput?.addEventListener("input", applyFilters);
  brandFilter?.addEventListener("change", applyFilters);
  categoryFilter?.addEventListener("change", applyFilters);

  applyFilters(); // initial load
}

/* ---------- Add to Cart / Wishlist ---------- */
function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;
  cart.push(product);
  saveState();
  updateCounts();
  flashMessage(`${product.name} added to cart`);
}

function addToWishlist(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;
  if (!wishlist.find(w => w.id === id)) {
    wishlist.push(product);
    saveState();
    updateCounts();
    flashMessage(`${product.name} added to wishlist`);
  }
}

/* ---------- Cart Rendering ---------- */
function renderCart() {
  const container = document.getElementById("cart-items");
  if (!container) return;

  container.innerHTML = "";
  let subtotal = 0;
  let discountTotal = 0;

  if (cart.length === 0) {
    container.innerHTML = `<p style="color:#444">Your cart is empty.</p>`;
    return;
  }

  cart.forEach((p, idx) => {
    const discountValue = p.discount ? (parseInt(p.discount) / 100) * p.price : 0;
    discountTotal += discountValue;
    subtotal += p.price - discountValue;

    container.insertAdjacentHTML("beforeend", `
      <div class="cart-item">
        <img src="${p.img}" alt="${p.name}">
        <div class="cart-details">
          <h4>${p.name}</h4>
          <p>₹${p.price}</p>
        </div>
        <div class="cart-actions">
          <button onclick="removeFromCart(${idx})">Remove</button>
        </div>
      </div>
    `);
  });

  document.getElementById("cart-total").innerHTML = `
    <p><strong>Discount Saved:</strong> ₹${discountTotal.toFixed(2)}</p>
    <p><strong>Total:</strong> ₹${subtotal.toFixed(2)}</p>
  `;
}

/* ---------- Cart Remove ---------- */
function removeFromCart(index) {
  cart.splice(index, 1);
  saveState();
  updateCounts();
  renderCart();
}

/* ---------- Wishlist Rendering ---------- */
function renderWishlist() {
  const container = document.getElementById("wishlist-items");
  if (!container) return;

  container.innerHTML = "";
  if (wishlist.length === 0) {
    container.innerHTML = `<p style="color:#444">Your wishlist is empty.</p>`;
    return;
  }

  wishlist.forEach((p, idx) => {
    container.insertAdjacentHTML("beforeend", `
      <div class="wishlist-item">
        <img src="${p.img}" alt="${p.name}">
        <div class="wishlist-details">
          <h4>${p.name}</h4>
          <p>₹${p.price}</p>
        </div>
        <div class="wishlist-actions">
          <button onclick="moveToCart(${idx})">Move to Cart</button>
          <button onclick="removeFromWishlist(${idx})">Remove</button>
        </div>
      </div>
    `);
  });
}

function moveToCart(index) {
  const product = wishlist[index];
  if (!product) return;
  cart.push(product);
  wishlist.splice(index, 1);
  saveState();
  updateCounts();
  renderCart();
  renderWishlist();
  flashMessage(`${product.name} moved to cart`);
}

function removeFromWishlist(index) {
  wishlist.splice(index, 1);
  saveState();
  updateCounts();
  renderWishlist();
}

/* ---------- Address Form Handling ---------- */
function handleAddressForm() {
  const form = document.getElementById("address-form");
  const preview = document.getElementById("address-preview");

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;

    localStorage.setItem("shippingAddress", JSON.stringify({ name, phone, address }));

    preview.innerHTML = `
      <div class="preview-card">
        <h4>Saved Address</h4>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Address:</strong> ${address}</p>
      </div>
    `;

    flashMessage("Address Saved Successfully!");
    form.reset();
  });
}

/* ---------- DOM Load ---------- */
document.addEventListener("DOMContentLoaded", () => {
  updateCounts();
  renderCart();
  renderWishlist();
  renderProductsPage();
  setupFilters();
  handleAddressForm();
});
