// index.js — Home page logic

let currentFilter = 'all';
let bannerDismissed = false;

async function renderHomeProducts() {
  const products = await loadProducts();
  const filtered = currentFilter === 'all'
    ? products.slice(0, 8)
    : products.filter(p => p.cat === currentFilter).slice(0, 8);
  document.getElementById('homePGrid').innerHTML = filtered.map(buildCard).join('');
  updateCatCounts();
}

function filterProducts(btn, cat) {
  document.querySelectorAll('#homeFilterTabs .filter-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentFilter = cat;
  renderHomeProducts();
}

async function updateCatCounts() {
  const products = await loadProducts();
  const h = document.getElementById('himCount');
  const r = document.getElementById('herCount');
  const u = document.getElementById('unisexCount');
  if (h) h.textContent = products.filter(p => p.cat === 'him').length + ' Fragrances';
  if (r) r.textContent = products.filter(p => p.cat === 'her').length + ' Fragrances';
  if (u) u.textContent = products.filter(p => p.cat === 'unisex').length + ' Fragrances';
}

// openDetail on home page — redirect to shop detail
async function openDetail(id) {
  window.location.href = 'shop.html?detail=' + id;
}
window.openDetail = openDetail;

function dismissBanner() {
  document.getElementById('promoBanner').classList.remove('active');
  bannerDismissed = true;
}

// Restore owner float if logged in
if (sessionStorage.getItem('owner') === 'true') {
  document.getElementById('ownerFloat').style.display = 'flex';
}

document.addEventListener('DOMContentLoaded', () => {
  renderHomeProducts();
  initScrollReveal();

  // Drag & drop on upload zones (if any on this page)
  document.addEventListener('dragover', e => {
    const zone = e.target.closest('.modal-upload-zone');
    if (zone) { e.preventDefault(); zone.classList.add('dragover'); }
  });
  document.addEventListener('dragleave', e => {
    const zone = e.target.closest('.modal-upload-zone');
    if (zone) zone.classList.remove('dragover');
  });
});