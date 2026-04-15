// brands.js — Brands page logic

const ALL_BRANDS = [
  {name:'Armani',            count:6,  desc:'Italian luxury fashion house'},
  {name:'Azzaro',            count:4,  desc:'French luxury menswear brand'},
  {name:'Bvlgari',           count:5,  desc:'Italian jewellery & fragrance house'},
  {name:'Burberry',          count:4,  desc:'British luxury fashion brand'},
  {name:'Calvin Klein',      count:7,  desc:'American fashion icon'},
  {name:'Carolina Herrera',  count:3,  desc:'Venezuelan-American couture house'},
  {name:'Chanel',            count:9,  desc:'French haute couture pioneer'},
  {name:'Creed',             count:6,  desc:'Anglo-French royal perfume house'},
  {name:'Dior',              count:10, desc:'French luxury fashion & fragrance'},
  {name:'Dolce & Gabbana',   count:5,  desc:'Italian luxury fashion brand'},
  {name:'Givenchy',          count:4,  desc:'French luxury fashion house'},
  {name:'Gucci',             count:6,  desc:'Italian luxury fashion brand'},
  {name:'Hermès',            count:7,  desc:'French luxury goods manufacturer'},
  {name:'Hugo Boss',         count:5,  desc:'German luxury fashion brand'},
  {name:'Issey Miyake',      count:3,  desc:'Japanese fashion & fragrance designer'},
  {name:'Jimmy Choo',        count:3,  desc:'British luxury fashion brand'},
  {name:'Jo Malone',         count:8,  desc:'British niche fragrance brand'},
  {name:'Kenzo',             count:3,  desc:'French luxury fashion brand'},
  {name:'Lancôme',           count:5,  desc:'French luxury cosmetics brand'},
  {name:'Marc Jacobs',       count:4,  desc:'American luxury fashion designer'},
  {name:'Mont Blanc',        count:5,  desc:'German luxury goods brand'},
  {name:'Narciso Rodriguez', count:3,  desc:'American fashion designer'},
  {name:'Nina Ricci',        count:3,  desc:'French luxury fashion house'},
  {name:'Paco Rabanne',      count:5,  desc:'Spanish-French fashion designer'},
  {name:'Prada',             count:6,  desc:'Italian luxury fashion brand'},
  {name:'Ralph Lauren',      count:5,  desc:'American luxury fashion designer'},
  {name:'Thierry Mugler',    count:4,  desc:'French fashion & fragrance house'},
  {name:'Tom Ford',          count:8,  desc:'American fashion designer & filmmaker'},
  {name:'Valentino',         count:4,  desc:'Italian luxury fashion brand'},
  {name:'Versace',           count:6,  desc:'Italian luxury fashion brand'},
  {name:'Viktor & Rolf',     count:3,  desc:'Dutch fashion house'},
  {name:'YSL',               count:7,  desc:'French luxury fashion & fragrance'},
];

function renderBrands(query = '') {
  const filtered = query
    ? ALL_BRANDS.filter(b => b.name.toLowerCase().includes(query.toLowerCase()))
    : ALL_BRANDS;

  const grouped = {};
  filtered.forEach(b => {
    const letter = b.name[0].toUpperCase();
    if (!grouped[letter]) grouped[letter] = [];
    grouped[letter].push(b);
  });

  const html = Object.keys(grouped).sort().map(letter => `
    <div class="brand-alphabet-section">
      <div class="brand-alpha-letter">${letter}</div>
      <div class="brand-alpha-list">
        ${grouped[letter].map(b => `
          <div class="brand-alpha-item" onclick="filterByBrand('${b.name}')">
            <span class="brand-alpha-name">${b.name}</span>
            <span class="brand-alpha-count">${b.count} fragrances · ${b.desc}</span>
          </div>`).join('')}
      </div>
    </div>`).join('');

  document.getElementById('brandsDirectory').innerHTML =
    html || '<p style="color:var(--muted);font-style:italic;font-size:15px;">No brands found.</p>';
}

function filterBrands(q) {
  renderBrands(q);
}

// Clicking a brand → go to shop filtered by brand name
function filterByBrand(brand) {
  window.location.href = 'shop.html?brand=' + encodeURIComponent(brand);
}

document.addEventListener('DOMContentLoaded', () => {
  renderBrands();
});