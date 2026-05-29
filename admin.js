// admin.js — Admin page logic

const OWNER_PASSWORD_HASH = 'YnJvd25ub3RlMjAyNQ=='; // base64 of "brownnote2025"

import {
  loadProducts,
  saveProductToFirebase,
  deleteProductFromFirebase
} from "./firebase.js";

async function uploadToCloudinary(file) {
  const formData = new FormData();

  formData.append('file', file);

  formData.append(
    'upload_preset',
    'brownnote_unsigned'
  );

  const response = await fetch(
    'https://api.cloudinary.com/v1_1/db1zdfo3j/image/upload',
    {
      method: 'POST',
      body: formData
    }
  );

  const data = await response.json();

  return data.secure_url;
}

let editingId       = null;
let modalImageData  = null;
let activeCampaign  = null;
let saleProductIds  = [];
let globalDiscountPct = 0;
let heroColor       = '#2a1a0e';

// ── Auth ──
function checkLogin() {
  const pw = document.getElementById('loginPassword').value;
  if (btoa(pw) === OWNER_PASSWORD_HASH) {
    sessionStorage.setItem('owner', 'true');
    document.getElementById('loginModal').classList.remove('open');
    document.getElementById('loginPassword').value = '';
    document.getElementById('loginError').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    showAdminView('admin');
    renderAdminList();
    showToast('Welcome back ✦');
  } else {
    document.getElementById('loginError').style.display = 'block';
    document.getElementById('loginPassword').value = '';
    document.getElementById('loginPassword').focus();
  }
}

function ownerLogout() {
  sessionStorage.removeItem('owner');
  window.location.href = '/';
}

function showAdminView(view) {
  document.getElementById('view-admin').style.display = view === 'admin' ? 'block' : 'none';
  document.getElementById('view-promo').style.display = view === 'promo' ? 'block' : 'none';
}

// ── Product list ──
async function renderAdminList() {
  const products = await loadProducts();
  const el = document.getElementById('adminProductList');
  const cards = products.map(p => `
    <div class="upload-card">
      <div class="upload-card-header">
        <div>
          <div class="upload-card-brand">${p.brand}</div>
          <div class="upload-card-name">${p.name}</div>
        </div>
        <div style="display:flex;gap:8px;">
          <button onclick="editProduct(${p.id})" class="card-action-btn">Edit</button>
          <button onclick="deleteProduct(${p.id})" class="card-action-btn card-delete-btn">✕</button>
        </div>
      </div>
      <div class="upload-zone" style="position:relative;">
        <input type="file" accept="image/*" onchange="uploadProductImage(${p.id},this)">
        ${p.image
          ? `<img src="${p.image}" style="max-height:160px;object-fit:contain;display:block;margin:0 auto;">`
          : `<span class="upload-icon">📷</span><p class="upload-zone-text">Click to upload photo<br><span style="font-size:9px;">JPG, PNG, WEBP</span></p>`}
      </div>
      <div style="margin-top:10px;display:flex;justify-content:space-between;align-items:center;">
        <span style="font-family:'Cormorant Garamond',serif;font-size:16px;color:var(--brown);">₦${Number(p.price).toLocaleString()}</span>
        <span style="font-size:9px;color:var(--muted);letter-spacing:.1em;">${p.sizes.join(' · ')}</span>
      </div>
    </div>`).join('');

  el.innerHTML = cards + `
    <div class="admin-add-product" onclick="openAddModal()">
      <span class="admin-add-icon">+</span>
      <span class="admin-add-text">Add New Fragrance</span>
    </div>`;

  // Add inline styles for card action buttons (avoids adding to CSS)
  el.querySelectorAll('.card-action-btn').forEach(btn => {
    btn.style.cssText = 'font-size:9px;letter-spacing:.2em;text-transform:uppercase;background:none;border:1px solid var(--brown-pale);color:var(--brown);padding:6px 12px;cursor:pointer;font-family:"Tenor Sans",sans-serif;transition:all .3s;';
    btn.addEventListener('mouseover', () => { btn.style.background = 'var(--brown)'; btn.style.color = 'var(--white)'; });
    btn.addEventListener('mouseout',  () => { btn.style.background = 'none'; btn.style.color = 'var(--brown)'; });
  });
  el.querySelectorAll('.card-delete-btn').forEach(btn => {
    btn.style.color = 'var(--muted)';
    btn.addEventListener('mouseover', () => { btn.style.borderColor = '#c0392b'; btn.style.color = '#c0392b'; btn.style.background = 'none'; });
    btn.addEventListener('mouseout',  () => { btn.style.borderColor = 'var(--brown-pale)'; btn.style.color = 'var(--muted)'; });
  });
}



async function uploadProductImage(id, input) {

  if (!input.files[0]) return;

  const file = input.files[0];

  showToast('Uploading photo…');

  try {

    const imageUrl = await uploadToCloudinary(file);

    let products = await loadProducts();

    const idx = products.findIndex(x => x.id === id);

    if (idx === -1) {

      showToast('Product not found');

      return;
    }

    products[idx].image = imageUrl;

    await saveProductToFirebase(products[idx]);

    renderAdminList();

    showToast('Photo uploaded ✦');

  } catch (err) {

    console.error(err);

    showToast('Upload failed');

  }
}
async function deleteProduct(id) {

  if (!confirm('Remove this fragrance from your catalogue?')) return;

  await deleteProductFromFirebase(id);

  renderAdminList();

  showToast('Product removed ✦');
}

// ── Modal ──
function openAddModal() {
  editingId = null;
  document.getElementById('modalTitle').textContent = 'Add New Fragrance';
  ['mBrand','mName','mPrice','mSizes','mNotes','mDesc'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('mType').value = 'Eau de Parfum';
  document.getElementById('mCat').value  = 'him';
  document.getElementById('mTag').value  = '';
  document.getElementById('mBg').value   = '#3a2818';
  clearModalImage();
  document.getElementById('addModal').classList.add('open');
}

async function editProduct(id) {
  const products = await loadProducts();
  const p = products.find(x => x.id === id);
  if (!p) return;
  editingId = id;
  document.getElementById('modalTitle').textContent = 'Edit ' + p.name;
  document.getElementById('mBrand').value = p.brand;
  document.getElementById('mName').value  = p.name;
  document.getElementById('mType').value  = p.type;
  document.getElementById('mCat').value   = p.cat;
  document.getElementById('mPrice').value = p.price;
  document.getElementById('mSizes').value = p.sizes.join(', ');
  document.getElementById('mNotes').value = p.notes.join(', ');
  document.getElementById('mDesc').value  = p.desc;
  document.getElementById('mTag').value   = p.tag || '';
  const colorMatch = p.bg.match(/#([0-9a-fA-F]{6})/);
  document.getElementById('mBg').value    = colorMatch ? colorMatch[0] : '#3a2818';
  if (p.image) {
    document.getElementById('modalPreviewImg').src = p.image;
    document.getElementById('modalPreview').style.display = 'block';
    document.getElementById('modalUploadZone').style.display = 'none';
    modalImageData = p.image;
  } else { clearModalImage(); }
  document.getElementById('addModal').classList.add('open');
}

function closeModal() {
  document.getElementById('addModal').classList.remove('open');
  editingId = null;
  modalImageData = null;
}



function clearModalImage() {
  modalImageData = null;
  document.getElementById('modalPreview').style.display = 'none';
  document.getElementById('modalUploadZone').style.display = 'block';
}

async function handleModalImage(input) {

  const file = input.files
    ? input.files[0]
    : null;

  if (!file) return;

  showToast('Uploading photo…');

  try {

    const imageUrl =
      await uploadToCloudinary(file);

    modalImageData = imageUrl;

    document.getElementById(
      'modalPreviewImg'
    ).src = imageUrl;

    document.getElementById(
      'modalPreview'
    ).style.display = 'block';

    document.getElementById(
      'modalUploadZone'
    ).style.display = 'none';

    showToast('Photo uploaded ✦');

  } catch (err) {

    console.error(err);

    showToast('Upload failed');

  }
}

async function saveProduct() {

  const brand = document.getElementById('mBrand').value.trim();

  const name = document.getElementById('mName').value.trim();

  const price =
    parseInt(document.getElementById('mPrice').value) || 0;

  if (!brand || !name || !price) {

    showToast('Please fill in Brand, Name & Price');

    return;
  }

  const bgColor = document.getElementById('mBg').value;

  const bg =
    `linear-gradient(150deg,${bgColor} 0%,${bgColor}cc 100%)`;

  const rawSizes =
    document.getElementById('mSizes')
      .value
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

  const data = {

    brand,

    name,

    type: document.getElementById('mType').value,

    cat: document.getElementById('mCat').value,

    price,

    sizes: rawSizes.length
      ? rawSizes
      : ['50ml', '100ml'],

    notes:
      document.getElementById('mNotes')
        .value
        .split(',')
        .map(s => s.trim())
        .filter(Boolean),

    desc:
      document.getElementById('mDesc').value.trim(),

    tag:
      document.getElementById('mTag').value,

    bg,

    image: modalImageData

  };


  if (editingId) {

    data.id = editingId;

    await saveProductToFirebase(data);

    showToast('Fragrance updated ✦');

  } else {

    data.id = Date.now();

    await saveProductToFirebase(data);

    showToast('Fragrance added ✦');

  }

  closeModal();

  renderAdminList();
}

// ── Promo system ──
function switchPromoTab(btn, tab) {
  document.querySelectorAll('.promo-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.promo-tab-content').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('promoTab-' + tab).classList.add('active');
  if (tab === 'products') renderPromoProductPicker();
}

function pickHeroColor(el) {
  document.querySelectorAll('#heroColorSwatches .color-swatch').forEach(s => s.classList.remove('selected'));
  el.classList.add('selected');
  heroColor = el.dataset.color;
  document.getElementById('campaignPreview').style.background = heroColor;
}
function pickHeroColorCustom(input) {
  document.querySelectorAll('#heroColorSwatches .color-swatch').forEach(s => s.classList.remove('selected'));
  heroColor = input.value;
  document.getElementById('campaignPreview').style.background = heroColor;
}

function updatePromoPreview() {
  const name  = document.getElementById('promoName').value || 'Special Offer';
  const emoji = document.getElementById('promoEmoji').value || '🎉';
  const title = document.getElementById('promoTitle').value || 'Our Sale';
  const em    = document.getElementById('promoTitleEm').value || '';
  const sub   = document.getElementById('promoSub').value || '';
  document.getElementById('prevEmoji').textContent = emoji;
  document.getElementById('prevLabel').textContent = name;
  document.getElementById('prevTitle').innerHTML = em
    ? title.replace(em, `<em style="font-style:italic;color:var(--gold);">${em}</em>`)
    : title;
  document.getElementById('prevSub').textContent = sub;
}

function updateBannerPreview() {
  const msg   = document.getElementById('bannerMsg').value || 'Special Sale — Limited Time';
  const badge = document.getElementById('bannerBadgeText').value || 'Limited Time';
  const btn   = document.getElementById('bannerBtnText').value || 'Shop Now';
  const color = document.getElementById('bannerColor').value;
  document.getElementById('bpText').textContent  = msg;
  document.getElementById('bpBadge').textContent = badge;
  document.getElementById('bpBtn').textContent   = btn;
  document.getElementById('bannerPreviewBox').style.background = color;
}

function updateDiscountPreview() {
  const pct   = parseInt(document.getElementById('globalDiscount').value) || 0;
  const label = document.getElementById('discountLabel').value;
  const orig  = 38000;
  const disc  = Math.round(orig * (1 - pct / 100));
  document.getElementById('discPricePreview').textContent = '₦' + disc.toLocaleString();
  if (pct > 0) {
    document.getElementById('discOrigPreview').textContent = '₦' + orig.toLocaleString();
    document.getElementById('discOrigPreview').style.display = 'inline';
    document.getElementById('discTagPreview').textContent = label || pct + '% OFF';
    document.getElementById('discTagPreview').style.display = 'inline-block';
  } else {
    document.getElementById('discOrigPreview').style.display = 'none';
    document.getElementById('discTagPreview').style.display  = 'none';
  }
}

async function renderPromoProductPicker() {

  const products = await loadProducts();

  document.getElementById('promoProductPicker').innerHTML =
    products.map(p => `

    <div class="promo-product-pick ${saleProductIds.includes(p.id) ? 'selected' : ''}"
         onclick="toggleSaleProduct(${p.id}, this)">

      <div class="promo-product-pick-check">
        ${saleProductIds.includes(p.id) ? '✓' : ''}
      </div>

      <div>

        <div class="promo-product-pick-brand">
          ${p.brand}
        </div>

        <div class="promo-product-pick-name">
          ${p.name}
        </div>

      </div>

    </div>

  `).join('');
}

function toggleSaleProduct(id, el) {
  if (saleProductIds.includes(id)) {
    saleProductIds = saleProductIds.filter(x => x !== id);
    el.classList.remove('selected');
    el.querySelector('.promo-product-pick-check').textContent = '';
  } else {
    saleProductIds.push(id);
    el.classList.add('selected');
    el.querySelector('.promo-product-pick-check').textContent = '✓';
  }
}

function saveCampaign() {
  const name   = document.getElementById('promoName').value.trim();
  const status = document.getElementById('promoStatus').value;
  if (!name) { showToast('Please enter a campaign name'); return; }
  activeCampaign = {
    name,
    emoji:    document.getElementById('promoEmoji').value || '🎉',
    title:    document.getElementById('promoTitle').value || name,
    titleEm:  document.getElementById('promoTitleEm').value || '',
    sub:      document.getElementById('promoSub').value || '',
    endDate:  document.getElementById('promoEndDate').value,
    status,
    heroColor
  };
  // Persist campaign so sales.html can read it
  localStorage.setItem('bn_campaign', JSON.stringify(activeCampaign));
  updatePromoLiveIndicator();
  showToast(status === 'on' ? 'Campaign is now LIVE ✦' : 'Campaign saved (not live yet) ✦');
}

function saveBanner() {
  if (!activeCampaign) { showToast('Save a Campaign first'); return; }
  activeCampaign.bannerMsg   = document.getElementById('bannerMsg').value;
  activeCampaign.bannerBadge = document.getElementById('bannerBadgeText').value;
  activeCampaign.bannerBtn   = document.getElementById('bannerBtnText').value;
  activeCampaign.bannerColor = document.getElementById('bannerColor').value;
  localStorage.setItem('bn_campaign', JSON.stringify(activeCampaign));
  showToast('Banner saved ✦');
}

function saveDiscounts() {
  globalDiscountPct = parseInt(document.getElementById('globalDiscount').value) || 0;
  if (activeCampaign) activeCampaign.discountLabel = document.getElementById('discountLabel').value;
  localStorage.setItem('bn_discount', JSON.stringify({ pct: globalDiscountPct, label: activeCampaign?.discountLabel || '' }));
  showToast('Discounts saved ✦');
}

function saveSaleProducts() {
  localStorage.setItem('bn_sale_products', JSON.stringify(saleProductIds));
  showToast('Sale products updated ✦');
}

function clearCampaign() {
  if (!confirm('Reset all promotion settings?')) return;
  activeCampaign    = null;
  saleProductIds    = [];
  globalDiscountPct = 0;
  localStorage.removeItem('bn_campaign');
  localStorage.removeItem('bn_discount');
  localStorage.removeItem('bn_sale_products');
  updatePromoLiveIndicator();
  ['promoName','promoEmoji','promoTitle','promoTitleEm','promoSub','promoEndDate',
   'bannerMsg','bannerBadgeText','bannerBtnText','globalDiscount','discountLabel']
    .forEach(id => document.getElementById(id).value = '');
  document.getElementById('promoStatus').value = 'off';
  showToast('Promotion cleared ✦');
}

function updatePromoLiveIndicator() {
  const dot  = document.getElementById('promoLiveDot');
  const text = document.getElementById('promoLiveText');
  if (activeCampaign && activeCampaign.status === 'on') {
    dot.classList.add('on');
    text.textContent = 'LIVE: ' + activeCampaign.name;
  } else if (activeCampaign) {
    dot.classList.remove('on');
    text.textContent = 'Saved (not live): ' + activeCampaign.name;
  } else {
    dot.classList.remove('on');
    text.textContent = 'No active promotion';
  }
}

// Drag & drop for modal upload zone
document.addEventListener('dragover', e => {
  const zone = e.target.closest('.modal-upload-zone');
  if (zone) { e.preventDefault(); zone.classList.add('dragover'); }
});
document.addEventListener('dragleave', e => {
  const zone = e.target.closest('.modal-upload-zone');
  if (zone) zone.classList.remove('dragover');
});
document.addEventListener('drop', e => {
  const zone = e.target.closest('.modal-upload-zone');
  if (zone && e.dataTransfer.files[0]) {
    e.preventDefault();
    zone.classList.remove('dragover');
    handleModalImage({ files: e.dataTransfer.files });
  }
});

// Make functions accessible to HTML onclick
window.checkLogin = checkLogin;
window.ownerLogout = ownerLogout;
window.showAdminView = showAdminView;

window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.uploadProductImage = uploadProductImage;

window.openAddModal = openAddModal;
window.closeModal = closeModal;

window.handleModalImage = handleModalImage;
window.saveProduct = saveProduct;

window.switchPromoTab = switchPromoTab;
window.pickHeroColor = pickHeroColor;
window.pickHeroColorCustom = pickHeroColorCustom;

window.updatePromoPreview = updatePromoPreview;
window.updateBannerPreview = updateBannerPreview;
window.updateDiscountPreview = updateDiscountPreview;

window.toggleSaleProduct = toggleSaleProduct;

window.saveCampaign = saveCampaign;
window.saveBanner = saveBanner;
window.saveDiscounts = saveDiscounts;
window.saveSaleProducts = saveSaleProducts;

window.clearCampaign = clearCampaign;
// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  // Restore saved campaign state
  const saved = localStorage.getItem('bn_campaign');
  if (saved) {
    activeCampaign = JSON.parse(saved);
    updatePromoLiveIndicator();
  }
  const savedDiscount = localStorage.getItem('bn_discount');
  if (savedDiscount) {
    const d = JSON.parse(savedDiscount);
    globalDiscountPct = d.pct;
  }
  const savedSaleProducts = localStorage.getItem('bn_sale_products');
  if (savedSaleProducts) {
    saleProductIds = JSON.parse(savedSaleProducts);
  }

  // Check auth
  if (sessionStorage.getItem('owner') === 'true') {
    document.getElementById('adminPanel').style.display = 'block';
    showAdminView('admin');
    renderAdminList();
  } else {
    document.getElementById('loginModal').classList.add('open');
    setTimeout(() => document.getElementById('loginPassword').focus(), 200);
  }
});