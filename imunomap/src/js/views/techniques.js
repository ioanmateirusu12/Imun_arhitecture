// ============================================================================
// views/techniques.js — Tehnici utilizate în imunologie (Cianga)
// ============================================================================

import { TECHNIQUES, TECHNIQUE_CATEGORIES } from '../../data/techniques.js';
import { showDetail } from './map.js';

export function initTechniques() {
  const host = document.getElementById('view-techniques');
  host.innerHTML = `
    <div class="view-content">
      <h1>🔬 Tehnici utilizate în imunologie</h1>
      <p class="subtitle">Arsenal complet al laboratorului imunologic · adaptat din Cianga (PIM 2008) + Appendix I Janeway 9e</p>

      <div style="display:flex;gap:8px;margin-bottom:20px;flex-wrap:wrap;align-items:center">
        <span style="color:#8892b0;font-size:12px">Filtru:</span>
        <button class="btn-ghost tech-cat-btn active" data-cat="all">Toate (${TECHNIQUES.length})</button>
        ${TECHNIQUE_CATEGORIES.map(c => {
          const count = TECHNIQUES.filter(t => t.category === c.id).length;
          return `<button class="btn-ghost tech-cat-btn" data-cat="${esc(c.id)}" style="border-color:${c.color}33">
            ${c.icon} ${esc(c.id)} <span style="opacity:0.6">(${count})</span>
          </button>`;
        }).join('')}
      </div>

      <div class="card-grid" id="tech-grid">
        ${renderCards(TECHNIQUES)}
      </div>
    </div>
  `;

  // Filtrare per categorie
  host.querySelectorAll('.tech-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      host.querySelectorAll('.tech-cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.cat;
      const filtered = cat === 'all' ? TECHNIQUES : TECHNIQUES.filter(t => t.category === cat);
      document.getElementById('tech-grid').innerHTML = renderCards(filtered);
      bindCardClicks(host);
    });
  });

  bindCardClicks(host);
}

function renderCards(techs) {
  return techs.map(t => {
    const cat = TECHNIQUE_CATEGORIES.find(c => c.id === t.category);
    const catColor = cat?.color || '#5b8cff';
    const catIcon = cat?.icon || '•';
    const shortDesc = t.principle
      ? (t.principle.length > 150 ? t.principle.slice(0, 150) + '…' : t.principle)
      : (t.method ? (Array.isArray(t.method) ? t.method.slice(0, 2).join('; ') : t.method).slice(0, 150) + '…' : '');
    return `
      <div class="card" data-tid="${esc(t.id)}">
        <div class="card-cat" style="background:${catColor}22;color:${catColor};border:1px solid ${catColor}44">
          ${catIcon} ${esc(t.category)}
        </div>
        <div class="card-title">${esc(t.name)}</div>
        <div class="card-body">${esc(shortDesc)}</div>
      </div>
    `;
  }).join('');
}

function bindCardClicks(host) {
  host.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.tid;
      const tech = TECHNIQUES.find(t => t.id === id);
      if (tech) showTechniqueDetail(tech);
    });
  });
}

function showTechniqueDetail(t) {
  const body = renderTechniqueBody(t);
  showDetail(t.name, body);
}

function renderTechniqueBody(t) {
  const parts = [];
  parts.push(`<p><span class="badge">${esc(t.category)}</span></p>`);

  if (t.principle) parts.push(`<h4>Principiu</h4><p>${esc(t.principle)}</p>`);

  // Toate celelalte câmpuri
  const skip = new Set(['id', 'category', 'name', 'principle']);
  for (const k of Object.keys(t)) {
    if (skip.has(k)) continue;
    const v = t[k];
    if (v === null || v === undefined) continue;
    const label = k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    if (Array.isArray(v)) {
      parts.push(`<h4>${esc(label)}</h4><ul>${v.map(x => `<li>${formatValue(x)}</li>`).join('')}</ul>`);
    } else if (typeof v === 'object') {
      parts.push(`<h4>${esc(label)}</h4>`);
      for (const [kk, vv] of Object.entries(v)) {
        parts.push(`<p><strong>${esc(kk)}</strong>: ${formatValue(vv)}</p>`);
      }
    } else {
      parts.push(`<h4>${esc(label)}</h4><p>${esc(String(v))}</p>`);
    }
  }
  return parts.join('\n');
}

function formatValue(v) {
  if (Array.isArray(v)) return v.map(esc).join(', ');
  if (typeof v === 'object' && v !== null) return Object.entries(v).map(([k, vv]) => `<code>${esc(k)}</code>: ${esc(String(vv))}`).join('; ');
  return esc(String(v));
}

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
