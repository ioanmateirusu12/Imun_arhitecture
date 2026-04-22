// ============================================================================
// views/genetics.js — Genetică imună (V(D)J, HLA, AID)
// ============================================================================

import {
  IG_LOCI, TCR_LOCI, VDJ_RECOMBINATION, AID,
  HLA_SYSTEM, HLA_TYPING_METHODS, CROSSMATCH, ANIMAL_MODELS
} from '../../data/genetics.js';

export function initGenetics() {
  const host = document.getElementById('view-genetics');
  host.innerHTML = `
    <div class="view-content">
      <h1>🧬 Genetica imună</h1>
      <p class="subtitle">Recombinarea V(D)J · Sistemul HLA · Hipermutație somatică · Class switch · Modele animale</p>

      <!-- Loci Ig -->
      <div class="pathway-box">
        <h3>📍 Loci-i imunoglobulinei umane</h3>
        ${renderLoci(IG_LOCI)}
      </div>

      <div class="pathway-box">
        <h3>📍 Loci-i TCR umane</h3>
        ${renderLoci(TCR_LOCI)}
      </div>

      <!-- VDJ -->
      <div class="pathway-box">
        <h3>✂ Recombinarea V(D)J</h3>
        <ol>
          ${VDJ_RECOMBINATION.steps.map(s => `<li><strong>${esc(s.name)}</strong>: ${esc(s.desc)}</li>`).join('')}
        </ol>
        <h4 style="margin-top:16px;color:#8892b0;font-size:12px;text-transform:uppercase">Enzime-cheie</h4>
        ${Object.entries(VDJ_RECOMBINATION.enzymes).map(([name, info]) => `
          <p><code>${esc(name)}</code>: ${esc(info.fn)} ${info.clinical ? `<em style="color:#ef4444">· ${esc(info.clinical)}</em>` : ''}</p>
        `).join('')}
        <h4 style="margin-top:16px;color:#8892b0;font-size:12px;text-transform:uppercase">Diversitate teoretică</h4>
        <p>BCR: <strong>${VDJ_RECOMBINATION.diversity.theoretical_max_BCR_human}</strong> ·
        TCR: <strong>${VDJ_RECOMBINATION.diversity.theoretical_max_TCR_human}</strong></p>
      </div>

      <!-- AID -->
      <div class="pathway-box">
        <h3>🔁 AID — Hipermutație somatică (SHM) & Class Switch (CSR)</h3>
        <p><strong>Gena:</strong> <code>${esc(AID.gene)}</code> · <strong>Expresie:</strong> ${esc(AID.expression)}</p>
        <p><strong>Activitate:</strong> ${esc(AID.activity)}</p>
        <h4>SHM — pași</h4>
        <ol>${AID.processes.SHM.mechanism.map(s => `<li>${esc(s)}</li>`).join('')}</ol>
        <p><strong>Frecvență:</strong> ${esc(AID.processes.SHM.frequency)}</p>
        <h4>CSR — pași</h4>
        <ol>${AID.processes.CSR.mechanism.map(s => `<li>${esc(s)}</li>`).join('')}</ol>
        <h4>Citokine direcționare switch</h4>
        ${Object.entries(AID.processes.CSR.cytokine_directing_switch).map(([k, v]) =>
          `<p><code>${esc(k)}</code> ← ${esc(Array.isArray(v) ? v.join(', ') : v)}</p>`
        ).join('')}
        <h4>Implicații clinice</h4>
        <ul>
          <li><strong>HIGM2:</strong> ${esc(AID.clinical.HIGM2)}</li>
          <li><strong>HIGM5:</strong> ${esc(AID.clinical.HIGM5)}</li>
          <li><strong>Tumorigen:</strong> ${esc(AID.clinical.tumor_risk)}</li>
        </ul>
      </div>

      <!-- HLA -->
      <div class="pathway-box">
        <h3>🧩 Sistemul HLA</h3>
        <p><strong>Localizare:</strong> ${esc(HLA_SYSTEM.location)}</p>
        <p><strong>Transmitere:</strong> ${esc(HLA_SYSTEM.inheritance)}</p>
        <h4>Probabilități de potrivire între frați</h4>
        <ul>
          <li>HLA identici: <strong>${HLA_SYSTEM.sibling_probabilities.HLA_identical}</strong></li>
          <li>Haploidentici: <strong>${HLA_SYSTEM.sibling_probabilities.haploidentical}</strong></li>
          <li>Total incompatibili: <strong>${HLA_SYSTEM.sibling_probabilities.fully_mismatched}</strong></li>
        </ul>
        <h4>Polimorfism</h4>
        <p>${esc(HLA_SYSTEM.polymorphism.alleles_catalogued_IMGT)}</p>
        <p><em>Cele mai polimorfe:</em> ${esc(HLA_SYSTEM.polymorphism.most_polymorphic)}</p>
        <h4>Nomenclatură</h4>
        <p>Format: <code>${esc(HLA_SYSTEM.nomenclature.format)}</code></p>
        ${Object.entries(HLA_SYSTEM.nomenclature.fields).map(([k, v]) =>
          `<p><code>${esc(k)}</code>: ${esc(v)}</p>`
        ).join('')}
        <h4>Asocieri cu boli</h4>
        <table class="data">
          <thead><tr><th>HLA</th><th>Boala</th><th>RR</th></tr></thead>
          <tbody>
            ${HLA_SYSTEM.disease_associations.map(d =>
              `<tr><td><code>${esc(d.hla)}</code></td><td>${esc(d.disease)}</td><td>${esc(d.RR || '-')}</td></tr>`
            ).join('')}
          </tbody>
        </table>
      </div>

      <!-- Metode tipare HLA -->
      <div class="pathway-box">
        <h3>🧪 Metode de tipare HLA</h3>
        <div class="card-grid">
          ${HLA_TYPING_METHODS.map(m => `
            <div class="card">
              <div class="card-cat" style="background:rgba(124,92,255,0.2);color:#c4b5fd">${esc(m.id)}</div>
              <div class="card-title">${esc(m.name)}</div>
              <div class="card-body">
                <p><strong>Principiu:</strong> ${esc(m.principle)}</p>
                ${m.resolution ? `<p><strong>Rezoluție:</strong> ${esc(m.resolution)}</p>` : ''}
                ${m.advantages ? `<p><strong>Avantaje:</strong> ${esc(m.advantages.join(', '))}</p>` : ''}
                ${m.status ? `<p><em>${esc(m.status)}</em></p>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Cross-match -->
      <div class="pathway-box">
        <h3>🔁 Cross-match pre-transplant</h3>
        <p>${esc(CROSSMATCH.purpose)}</p>
        <table class="data">
          <thead><tr><th>Tip</th><th>Metodă</th><th>Sensibilitate</th></tr></thead>
          <tbody>
            ${CROSSMATCH.types.map(t => `
              <tr>
                <td><code>${esc(t.id)}</code></td>
                <td>${esc(t.method)}</td>
                <td>${esc(t.sensitivity)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <p style="margin-top:10px"><strong>DSA:</strong> ${esc(CROSSMATCH.DSA)}</p>
        <p><strong>PRA:</strong> ${esc(CROSSMATCH.PRA)}</p>
      </div>

      <!-- Modele animale -->
      <div class="pathway-box">
        <h3>🐭 Modele animale în imunologie</h3>
        <div class="card-grid">
          ${ANIMAL_MODELS.map(m => `
            <div class="card">
              <div class="card-title">${esc(m.name)}</div>
              <div class="card-body">
                <p>${esc(m.description)}</p>
                ${m.uses ? `<p><strong>Utilizări:</strong></p><ul>${m.uses.map(u => `<li>${esc(u)}</li>`).join('')}</ul>` : ''}
                ${m.examples ? `<p><strong>Exemple:</strong> ${esc(m.examples.join(', '))}</p>` : ''}
                ${m.types ? `<p><strong>Tipuri:</strong></p><ul>${m.types.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function renderLoci(loci) {
  return Object.entries(loci).map(([name, info]) => `
    <div style="margin-bottom:12px;padding:10px;background:#0b1020;border-radius:6px;border:1px solid #1f2a4d">
      <strong style="color:#22d3ee">${esc(name)}</strong>
      <span style="color:#8892b0"> · cromozom ${esc(info.chromosome)}</span><br>
      <span style="font-size:12px;color:#8892b0">Segmente:</span>
      ${Object.entries(info.segments).map(([s, v]) =>
        `<span class="pill">${esc(s)}: ${esc(typeof v === 'string' ? v : JSON.stringify(v))}</span>`
      ).join('')}
      ${info.rearrangement ? `<p style="font-size:12px;color:#8892b0;margin-top:6px">↳ ${esc(info.rearrangement)}</p>` : ''}
    </div>
  `).join('');
}

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
