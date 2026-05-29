// ═══════════════════════════════════════════
// SHARED.JS — loaded by every page
// Products data, cart, toast, cursor, mobile menu
// ═══════════════════════════════════════════

import { 
        loadProducts,
        saveProductToFirebase,
        deleteProductFromFirebase
 } from './firebase.js';

// ── Default product catalogue ──
const DEFAULT_PRODUCTS = [
  {id:1,  brand:'Dior',              name:'Sauvage',              type:'Eau de Parfum',   cat:'him',    price:38000,  sizes:['60ml','100ml','200ml'],      notes:['Bergamot','Ambroxan','Cedar','Pepper'],             desc:'A radically fresh composition — raw and noble all at once. Bergamot from Calabria, pepper, lavender and vetiver create an intensely masculine signature.',                                  tag:'Best Seller', bg:'linear-gradient(150deg,#2a1a0c 0%,#3a2414 60%,#4a3020 100%)', image:null},
  {id:2,  brand:'Chanel',            name:'Chance Eau Tendre',    type:'Eau de Parfum',   cat:'her',    price:52000,  sizes:['50ml','100ml'],               notes:['Grapefruit','Jasmine','White Musk','Cedar'],         desc:'A tender, delicate, feminine twist on Chance. A fresh, floral fragrance featuring quince and jasmine for a romantic, light effect.',                                                      tag:'New In',      bg:'linear-gradient(150deg,#f0ebe0 0%,#ded0bc 60%,#c8b090 100%)', image:null},
  {id:3,  brand:'YSL',               name:'Black Opium',          type:'Eau de Parfum',   cat:'her',    price:44500,  sizes:['30ml','50ml','90ml'],          notes:['Coffee','Vanilla','White Flowers','Cedar'],          desc:'The first rock and roll womens fragrance. Addictive, intoxicating, and full of contrasts — black coffee and white flowers wrapped in patchouli and vanilla.',                             tag:'',            bg:'linear-gradient(150deg,#241828 0%,#362040 60%,#462a50 100%)', image:null},
  {id:4,  brand:'Tom Ford',          name:'Ombre Leather',        type:'Eau de Parfum',   cat:'unisex', price:68000,  sizes:['50ml','100ml'],               notes:['Leather','Jasmine','Amber','Patchouli'],             desc:'A bold, sensual fragrance inspired by the American Southwest. Floral facets of jasmine and cardamom are anchored by black leather and amber accords.',                                    tag:'Best Seller', bg:'linear-gradient(150deg,#1a2018 0%,#263022 60%,#32402a 100%)', image:null},
  {id:5,  brand:'Creed',             name:'Aventus',              type:'Eau de Parfum',   cat:'him',    price:125000, sizes:['50ml','100ml','250ml'],        notes:['Pineapple','Birch','Musk','Oakmoss'],                desc:"Celebrating strength, power, vision and success. Napoleon's ambitions and romances inspired this timeless, legendary masculine fragrance.",                                                 tag:'Best Seller', bg:'linear-gradient(150deg,#1c1612 0%,#2a2018 60%,#382c22 100%)', image:null},
  {id:6,  brand:'Jo Malone',         name:'Wood Sage & Sea Salt', type:'Cologne',         cat:'unisex', price:48000,  sizes:['30ml','100ml'],               notes:['Sea Salt','Sage','Grapefruit','Ambrette'],           desc:'A fragrance as wild and free as a windswept clifftop. Earthy sage and driftwood meet mineral sea salt in an effortlessly natural blend.',                                                 tag:'New In',      bg:'linear-gradient(150deg,#e8eae0 0%,#d8dac8 60%,#c4c8b0 100%)', image:null},
  {id:7,  brand:'Armani',            name:'Acqua di Giò',         type:'Eau de Toilette', cat:'him',    price:32000,  sizes:['50ml','100ml','180ml'],        notes:['Marine','Bergamot','Rosemary','Patchouli'],          desc:'A marine fragrance inspired by the sea, island vegetation and sun of Pantelleria. Fresh, natural, and effortlessly sophisticated.',                                                       tag:'',            bg:'linear-gradient(150deg,#c8d8e0 0%,#a8bcc8 60%,#8aaab8 100%)', image:null},
  {id:8,  brand:'Versace',           name:'Eros',                 type:'Eau de Toilette', cat:'him',    price:29000,  sizes:['50ml','100ml','200ml'],        notes:['Mint','Green Apple','Vanilla','Oakmoss'],            desc:'Named after the Greek god of love, Eros is a clash of mint, green apple, and lemon with vanilla wood and oakmoss — bold, sensual, unforgettable.',                                       tag:'',            bg:'linear-gradient(150deg,#1a2840 0%,#243660 60%,#2e4480 100%)', image:null},
  {id:9,  brand:'Gucci',             name:'Bloom',                type:'Eau de Parfum',   cat:'her',    price:38500,  sizes:['30ml','50ml','100ml'],         notes:['Tuberose','Jasmine','Rangoon Creeper','Sandalwood'], desc:'A rich, white floral fragrance — an ode to femininity. A garden that blossoms even in the most unexpected places.',                                                                      tag:'New In',      bg:'linear-gradient(150deg,#f0e0e8 0%,#e0c0d0 60%,#d0a0b8 100%)', image:null},
  {id:10, brand:'Hermès',            name:"Terre d'Hermès",       type:'Eau de Parfum',   cat:'him',    price:56000,  sizes:['75ml','100ml','150ml'],        notes:['Grapefruit','Pepper','Vetiver','Flint'],             desc:'An ode to the earth. A mineral architecture of contrasts: grapefruit meets pepper and earth-toned vetiver in a raw, powerful harmony.',                                                   tag:'',            bg:'linear-gradient(150deg,#3a2c1a 0%,#4a3824 60%,#5a4830 100%)', image:null},
  {id:11, brand:'Paco Rabanne',      name:'1 Million',            type:'Eau de Toilette', cat:'him',    price:26000,  sizes:['50ml','100ml','200ml'],        notes:['Blood Mandarin','Rose','Cinnamon','Leather'],        desc:'A million-dollar fragrance for the man who has everything. Spicy, leather, and fresh — a dazzling gold bar in a bottle.',                                                                tag:'',            bg:'linear-gradient(150deg,#c8900a 0%,#e0a820 60%,#d4af37 100%)', image:null},
  {id:12, brand:'Lancôme',           name:'La Vie Est Belle',     type:'Eau de Parfum',   cat:'her',    price:41000,  sizes:['30ml','50ml','100ml'],         notes:['Iris','Patchouli','Gourmand','Praline'],             desc:'Life is beautiful. An invitation to break free and choose your own path to happiness. Iris and patchouli with a gourmand sweetness that lingers.',                                       tag:'Best Seller', bg:'linear-gradient(150deg,#e8d0e0 0%,#d4a0c8 60%,#c090b8 100%)', image:null},
  {id:13, brand:'Dior',              name:'Miss Dior',            type:'Eau de Parfum',   cat:'her',    price:49000,  sizes:['30ml','50ml','100ml'],         notes:['Rose','Peony','Patchouli','Musk'],                   desc:'A floral declaration of love. Miss Dior is an ode to the women who love passionately, who live freely, and who always smell extraordinary.',                                             tag:'Best Seller', bg:'linear-gradient(150deg,#f5dce0 0%,#ecc0c8 60%,#d8a0b0 100%)', image:null},
  {id:14, brand:'Chanel',            name:'Bleu de Chanel',       type:'Eau de Parfum',   cat:'him',    price:58000,  sizes:['50ml','100ml','150ml'],        notes:['Citrus','Labdanum','Sandalwood','Frankincense'],      desc:'An ode to masculine freedom — a woody, aromatic fragrance for the man who defies convention. Timeless, refined, and utterly confident.',                                                  tag:'',            bg:'linear-gradient(150deg,#1a1e2a 0%,#252c3a 60%,#303848 100%)', image:null},
  {id:15, brand:'Tom Ford',          name:'Black Orchid',         type:'Eau de Parfum',   cat:'unisex', price:82000,  sizes:['50ml','100ml'],               notes:['Black Orchid','Dark Chocolate','Ylang Ylang','Patchouli'], desc:'A luxurious and sensual fragrance of rich, dark accords and an alluring potion of black orchids and voluptuous dark florals.',                                                          tag:'New In',      bg:'linear-gradient(150deg,#1a0a1a 0%,#281428 60%,#381e38 100%)', image:null},
  {id:16, brand:'Valentino',         name:'Voce Viva',            type:'Eau de Parfum',   cat:'her',    price:43000,  sizes:['30ml','50ml','100ml'],         notes:['Bergamot','Tuberose','Jasmine','Musk'],              desc:'Inspired by the vibrant Italian spirit — a bold, radiant fragrance for the woman who lives life at full volume.',                                                                        tag:'New In',      bg:'linear-gradient(150deg,#f0e8f0 0%,#dcc8dc 60%,#c8a8c8 100%)', image:null},
  {id:17, brand:'Givenchy',          name:'Gentleman Society',    type:'Eau de Parfum',   cat:'him',    price:36500,  sizes:['60ml','100ml'],               notes:['Bergamot','Iris','Tonka Bean','Vetiver'],            desc:'A contemporary take on masculine elegance. Iris and bergamot open into a warm tonka bean and vetiver base — refined, modern, unforgettable.',                                           tag:'',            bg:'linear-gradient(150deg,#1c1c20 0%,#28282e 60%,#34343a 100%)', image:null},
  {id:18, brand:'Burberry',          name:'Her',                  type:'Eau de Parfum',   cat:'her',    price:34000,  sizes:['30ml','50ml','100ml'],         notes:['Blackcurrant','Strawberry','Amber','Musk'],          desc:'A vibrant celebration of London femininity. Fresh fruity top notes of blackcurrant and strawberry bloom into a warm, sensual amber and musk base.',                                    tag:'',            bg:'linear-gradient(150deg,#e8d0e0 0%,#d8b0c8 60%,#c890b0 100%)', image:null},
  {id:19, brand:'Montblanc',         name:'Explorer',             type:'Eau de Parfum',   cat:'him',    price:28500,  sizes:['60ml','100ml'],               notes:['Bergamot','Ambroxan','Vetiver','Leather'],           desc:'An ode to the modern explorer. Inspired by the most remote destinations on earth — fresh, bold, and adventurous.',                                                                       tag:'',            bg:'linear-gradient(150deg,#1a2818 0%,#263822 60%,#32482c 100%)', image:null},
  {id:20, brand:'Hugo Boss',         name:'Boss Bottled',         type:'Eau de Parfum',   cat:'him',    price:24000,  sizes:['50ml','100ml','200ml'],        notes:['Apple','Cinnamon','Sandalwood','Vanilla'],           desc:'The original fragrance for the man of today. A confident blend of apple, cinnamon and sandalwood that has stood the test of time.',                                                     tag:'',            bg:'linear-gradient(150deg,#1a1a1e 0%,#262628 60%,#323234 100%)', image:null},
  {id:21, brand:'Dolce & Gabbana',   name:'Light Blue',           type:'Eau de Toilette', cat:'her',    price:31000,  sizes:['25ml','50ml','100ml'],         notes:['Sicilian Lemon','Apple','Bamboo','White Rose'],      desc:'An eternal summer. The crisp, fresh scent of a Sicilian lemon grove meets bamboo and apple in a fragrance as light as the Mediterranean breeze.',                                      tag:'',            bg:'linear-gradient(150deg,#cce0f0 0%,#a8c8e0 60%,#84b0d0 100%)', image:null},
  {id:22, brand:'Narciso Rodriguez', name:'For Her',              type:'Eau de Parfum',   cat:'her',    price:39000,  sizes:['30ml','50ml','100ml'],         notes:['Musk','Rose','Amber','Vetiver'],                     desc:'A skin-close, intimate fragrance. Inspired by the idea that a womens most seductive accessory is her own skin. Pure, warm, irresistibly feminine.',                                     tag:'Best Seller', bg:'linear-gradient(150deg,#2a1a20 0%,#3a2430 60%,#4a2e3a 100%)', image:null},
  {id:23, brand:'Issey Miyake',      name:"L'Eau d'Issey",        type:'Eau de Toilette', cat:'her',    price:33000,  sizes:['25ml','50ml','100ml'],         notes:['Cyclamen','Lotus','Peony','Musk'],                   desc:'A watery floral inspired by the purity of water. Clean, fresh and infinitely feminine — one of the most iconic fragrances of its generation.',                                          tag:'',            bg:'linear-gradient(150deg,#e8f0f4 0%,#d0e4ec 60%,#b8d4e4 100%)', image:null},
  {id:24, brand:'Viktor & Rolf',     name:'Flowerbomb',           type:'Eau de Parfum',   cat:'her',    price:47000,  sizes:['30ml','50ml','100ml'],         notes:['Jasmine','Rose','Freesia','Patchouli'],              desc:'An explosion of flowers. An oriental floral fragrance that is an antidote to reality — a weapon of mass seduction wrapped in a grenade-shaped bottle.',                                 tag:'New In',      bg:'linear-gradient(150deg,#f0d0dc 0%,#deb0c4 60%,#cc90ac 100%)', image:null},
];


// ── Cart — persisted in sessionStorage so it survives page navigation ──
function loadCart() {
  return JSON.parse(sessionStorage.getItem('bn_cart') || '[]');
}

function saveCart(cart) {
  sessionStorage.setItem('bn_cart', JSON.stringify(cart));
}

function updateCartCount() {
  const cart = loadCart();
  document.querySelectorAll('.cart-count').forEach(el => el.textContent = cart.length);
}

function checkoutCart() {
  const cart = loadCart();
  if (!cart.length) { showToast('Your cart is empty'); return; }
  let message = 'Hi Brown Note! I want to order:\n\n';
  cart.forEach(item => {
    message += `• ${item.brand} ${item.name} (${item.selectedSize}) — ₦${Number(item.price).toLocaleString()}\n`;
  });
  message += '\nPlease confirm availability.';
  window.open('https://wa.me/2349037088407?text=' + encodeURIComponent(message), '_blank');
}

// ── Toast ──
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

// ── Mobile menu ──
function toggleMobileMenu() {
  const m = document.getElementById('mobileMenu');
  if (m) m.classList.toggle('open');
}

// ── Logo long-press → admin ──
let pressTimer;
function startPress() {
  pressTimer = setTimeout(() => { window.location.href = '/admin.html'; }, 1500);
}
function cancelPress() { clearTimeout(pressTimer); }

// ── Wishlist toggle ──
function wishlist(btn) {
  btn.textContent = btn.textContent === '♡' ? '♥' : '♡';
  btn.style.color = btn.textContent === '♥' ? 'var(--brown)' : '';
  showToast(btn.textContent === '♥' ? 'Added to wishlist ✦' : 'Removed from wishlist');
}

// ── Custom cursor ──
function initCursor() {
  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursorRing');
  if (!cursor || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  (function loop() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(loop);
  })();

  function bindHover() {
    document.querySelectorAll('a, button, .product-card, .brand-alpha-item, [onclick]').forEach(el => {
      if (el.dataset.ch) return;
      el.dataset.ch = '1';
      el.addEventListener('mouseenter', () => {
        ring.style.transform   = 'translate(-50%,-50%) scale(1.5)';
        cursor.style.transform = 'translate(-50%,-50%) scale(0.5)';
      });
      el.addEventListener('mouseleave', () => {
        ring.style.transform   = 'translate(-50%,-50%) scale(1)';
        cursor.style.transform = 'translate(-50%,-50%) scale(1)';
      });
    });
  }

  bindHover();
  new MutationObserver(bindHover).observe(document.body, { childList: true, subtree: true });
}

// ── Scroll reveal ──
function initScrollReveal() {
  const io = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
    { threshold: 0.1 }
  );
  document.querySelectorAll('.fade-up').forEach(el => { el.classList.remove('visible'); io.observe(el); });
}

// ── SVG bottle builders (used on both index and shop) ──
function buildBottleSVG(p) {
  const capColor = p.cat === 'her' ? '#5A4634' : '#D4AF37';
  const textColor = p.cat === 'her' ? '#0B0B0B' : '#F4F1EC';
  const nameColor = p.cat === 'her' ? '#5A4634' : '#D4AF37';
  const isDark = /f0e|e8e|c8d|^#[ef]/.test(p.bg);
  return `
    <svg class="product-img-placeholder" viewBox="0 0 100 220" xmlns="http://www.w3.org/2000/svg">
      <rect x="35" y="5" width="30" height="27" rx="3" fill="${capColor}"/>
      <rect x="38" y="32" width="24" height="9" rx="2" fill="${capColor}" opacity=".7"/>
      <rect x="10" y="41" width="80" height="168" rx="10"
        fill="${isDark ? 'rgba(255,255,255,0.78)' : 'rgba(255,255,255,0.09)'}"
        stroke="${isDark ? 'rgba(255,255,255,0.4)' : 'rgba(212,175,55,0.16)'}" stroke-width="0.7"/>
      <rect x="20" y="90" width="60" height="76" rx="3"
        fill="${isDark ? 'rgba(255,255,255,0.82)' : 'rgba(244,241,236,0.08)'}"
        stroke="${isDark ? 'rgba(90,70,52,0.15)' : 'rgba(212,175,55,0.14)'}" stroke-width="0.5"/>
      <text x="50" y="114" font-family="serif" font-size="4.5" fill="${nameColor}" text-anchor="middle" letter-spacing="1.4">BROWN NOTE</text>
      <text x="50" y="134" font-family="serif" font-size="10" fill="${textColor}" text-anchor="middle">${p.name.length > 10 ? p.name.substring(0, 10) + '…' : p.name}</text>
      <text x="50" y="150" font-family="sans-serif" font-size="4" fill="${textColor}" text-anchor="middle" opacity=".4" letter-spacing="1">${p.sizes[0]}</text>
    </svg>`;
}

function buildBottleSVGLarge(p) {
  const capColor = p.cat === 'her' ? '#5A4634' : '#D4AF37';
  const textColor = p.cat === 'her' ? '#0B0B0B' : '#F4F1EC';
  const isDark = /f0e|e8e|c8d/.test(p.bg);
  return `<svg width="220" viewBox="0 0 140 320" xmlns="http://www.w3.org/2000/svg" style="filter:drop-shadow(0 28px 52px rgba(90,70,52,.25))">
    <rect x="50" y="8" width="40" height="40" rx="5" fill="${capColor}"/>
    <rect x="55" y="48" width="30" height="14" rx="3" fill="${capColor}" opacity=".7"/>
    <rect x="15" y="62" width="110" height="240" rx="16"
      fill="${isDark ? 'rgba(255,255,255,0.82)' : 'rgba(255,255,255,0.1)'}"
      stroke="${isDark ? 'rgba(90,70,52,.25)' : 'rgba(212,175,55,.2)'}" stroke-width="1"/>
    <rect x="28" y="128" width="84" height="110" rx="5"
      fill="${isDark ? 'rgba(255,255,255,0.9)' : 'rgba(244,241,236,0.08)'}"
      stroke="${isDark ? 'rgba(90,70,52,.18)' : 'rgba(212,175,55,.16)'}" stroke-width="0.8"/>
    <text x="70" y="162" font-family="serif" font-size="7" fill="${isDark ? '#5A4634' : '#D4AF37'}" text-anchor="middle" letter-spacing="2">BROWN NOTE</text>
    <line x1="36" y1="172" x2="104" y2="172" stroke="${isDark ? 'rgba(90,70,52,.25)' : 'rgba(212,175,55,.25)'}" stroke-width="0.8"/>
    <text x="70" y="196" font-family="serif" font-size="16" fill="${textColor}" text-anchor="middle" font-weight="300">${p.name.length > 12 ? p.name.substring(0, 12) + '…' : p.name}</text>
    <text x="70" y="216" font-family="sans-serif" font-size="7" fill="${textColor}" text-anchor="middle" opacity=".45" letter-spacing="1.5">${p.type.toUpperCase()}</text>
    <rect x="18" y="68" width="14" height="228" rx="7" fill="rgba(255,255,255,0.07)"/>
  </svg>`;
}

// ── Product card builder ──
function buildCard(p) {
  const imgContent = p.image
    ? `<img class="product-photo" src="${p.image}" alt="${p.name}">`
    : buildBottleSVG(p);
  const tag = p.tag ? `<span class="product-tag ${p.tag === 'New In' ? 'new' : ''}">${p.tag}</span>` : '';
  return `
    <div class="product-card" onclick="openDetail(${p.id})">
      <div class="product-img">
        <div class="product-bg" style="background:${p.bg}"></div>
        ${tag}
        <button class="product-wishlist" onclick="event.stopPropagation();wishlist(this)">♡</button>
        ${imgContent}
      </div>
      <div class="product-info">
        <div class="product-brand">${p.brand}</div>
        <h3 class="product-name">${p.name}</h3>
        <p class="product-type">${p.type} · ${p.cat === 'him' ? 'For Him' : p.cat === 'her' ? 'For Her' : 'Unisex'}</p>
        <div class="product-bottom">
          <span class="product-price">₦${Number(p.price).toLocaleString()}</span>
          <div class="product-sizes-mini">${p.sizes.slice(0, 2).map(s => `<button class="product-size-mini" onclick="event.stopPropagation()">${s}</button>`).join('')}</div>
        </div>
      </div>
    </div>`;
}

// ── Run on every page load ──
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  initCursor();
});

window.loadProducts = loadProducts;
window.saveProductToFirebase = saveProductToFirebase;
window.deleteProductFromFirebase = deleteProductFromFirebase;

window.loadCart = loadCart;
window.saveCart = saveCart;
window.updateCartCount = updateCartCount;
window.checkoutCart = checkoutCart;

window.showToast = showToast;
window.toggleMobileMenu = toggleMobileMenu;

window.startPress = startPress;
window.cancelPress = cancelPress;

window.wishlist = wishlist;

window.initCursor = initCursor;
window.initScrollReveal = initScrollReveal;

window.buildBottleSVG = buildBottleSVG;
window.buildBottleSVGLarge = buildBottleSVGLarge;
window.buildCard = buildCard;