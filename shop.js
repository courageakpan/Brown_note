// shop.js — Shop page logic

let shopCurrentFilter = 'all';
let currentDetailId = null;

// Read URL params
const urlParams = new URLSearchParams(window.location.search);
const urlCat    = urlParams.get('cat');
const urlDetail = urlParams.get('detail');
const urlBrand = urlParams.get('brand');
if (urlBrand) shopCurrentFilter = 'brand:' + urlBrand;

if (urlCat && ['him','her','unisex','new'].includes(urlCat)) {
  shopCurrentFilter = urlCat;
}


function renderShop() {
  const products = loadProducts();
  let filtered;
  if (shopCurrentFilter.startsWith('brand:')) {
    const brand = shopCurrentFilter.replace('brand:', '');
    filtered = products.filter(p => p.brand === brand);
    document.getElementById('shopCount').textContent = filtered.length + ' fragrances by ' + brand;
    // Remove active from all tabs since this is a brand filter
    document.querySelectorAll('#shopFilterTabs .filter-tab').forEach(b => b.classList.remove('active'));
  } else {
    filtered = shopCurrentFilter === 'all'
      ? products
      : shopCurrentFilter === 'new'
      ? products.filter(p => p.tag === 'New In')
      : products.filter(p => p.cat === shopCurrentFilter);
    document.getElementById('shopCount').textContent = filtered.length + ' fragrances';
  }
  document.getElementById('shopGrid').innerHTML = filtered.map(buildCard).join('');
}

function shopFilter(btn, cat) {
  document.querySelectorAll('#shopFilterTabs .filter-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  shopCurrentFilter = cat;
  renderShop();
  // Update URL without reload
  const url = new URL(window.location);
  if (cat === 'all') { url.searchParams.delete('cat'); } else { url.searchParams.set('cat', cat); }
  history.replaceState({}, '', url);
}

function applyUrlFilter() {
  if (!urlCat) return;
  document.querySelectorAll('#shopFilterTabs .filter-tab').forEach(b => {
    const label = b.textContent.toLowerCase();
    const match = (urlCat === 'him' && label.includes('him')) ||
                  (urlCat === 'her' && label.includes('her')) ||
                  (urlCat === 'unisex' && label.includes('unisex')) ||
                  (urlCat === 'new' && label.includes('new'));
    b.classList.toggle('active', match);
  });
}

// ── Views ──
function showShopView() {
  document.getElementById('view-shop').style.display = 'block';
  document.getElementById('view-detail').style.display = 'none';
  window.scrollTo(0, 0);
  // Clear detail param from URL
  const url = new URL(window.location);
  url.searchParams.delete('detail');
  history.replaceState({}, '', url);
}

function showDetailView() {
  document.getElementById('view-shop').style.display = 'none';
  document.getElementById('view-detail').style.display = 'block';
  window.scrollTo(0, 0);
}

// ── Detail ──
function openDetail(id) {
  const products = loadProducts();
  const p = products.find(x => x.id === id);
  if (!p) return;
  currentDetailId = id;

  const imgArea = document.getElementById('detailImgArea');
  imgArea.innerHTML = p.image
    ? `<img src="${p.image}" alt="${p.name}" style="max-width:320px;max-height:500px;object-fit:contain;filter:drop-shadow(0 20px 40px rgba(90,70,52,.22));">`
    : `<div class="detail-img-placeholder">${buildBottleSVGLarge(p)}</div>`;

  document.getElementById('dBrand').textContent = p.brand;
  document.getElementById('dName').textContent  = p.name;
  document.getElementById('dType').textContent  = p.type + ' · ' + (p.cat==='him'?'For Him':p.cat==='her'?'For Her':'Unisex');
  document.getElementById('dPrice').textContent = '₦' + Number(p.price).toLocaleString();
  document.getElementById('dNotes').innerHTML   = p.notes.map(n => `<span class="note-pill">${n}</span>`).join('');
  document.getElementById('dDesc').textContent  = p.desc;
  document.getElementById('dSizes').innerHTML   = p.sizes.map((s,i) => `<button class="detail-size-btn ${i===0?'selected':''}" onclick="selectSize(this)">${s}</button>`).join('');

  // Update URL
  const url = new URL(window.location);
  url.searchParams.set('detail', id);
  history.replaceState({}, '', url);

  showDetailView();
}

function selectSize(btn) {
  document.querySelectorAll('.detail-size-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
}

// ── Cart ──
function addToCartFromDetail() {
  const products = loadProducts();
  const p = products.find(x => x.id === currentDetailId);
  if (!p) return;
  const size = document.querySelector('.detail-size-btn.selected')?.textContent || p.sizes[0];
  const cart = loadCart();
  cart.push({ ...p, selectedSize: size });
  saveCart(cart);
  updateCartCount();
  showToast(p.name + ' (' + size + ') added to cart ✦');
}

document.addEventListener('DOMContentLoaded', () => {
  applyUrlFilter();
  renderShop();

  // If URL has a detail param, open that product directly
  if (urlDetail) {
    const id = parseInt(urlDetail);
    if (id) openDetail(id);
  }
});