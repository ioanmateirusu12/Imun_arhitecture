// ============================================================================
// views/biochemistry.js — Căi de semnalizare și biochimie imună
// ============================================================================

import {
  TCR_PATHWAY, BCR_PATHWAY, CD28_COSTIM,
  JAK_STAT, NFKB_PATHWAY, ANTIGEN_PROCESSING,
  APOPTOSIS, INFLAMMASOME, RESPIRATORY_BURST, LEUKOCYTE_ADHESION
} from '../../data/biochemistry.js';
import { COMPLEMENT, PRRs } from '../../data/molecules.js';

export function initBiochemistry() {
  const host = document.getElementById('view-biochemistry');
  host.innerHTML = `
    <div class="view-content">
      <h1>⚗ Biochimia semnalizării imune</h1>
      <p class="subtitle">Căi moleculare · Signaling · Cascadele apoptotice și ale complementului · Farmacologie imună</p>

      ${pathway('🎯 Calea TCR — Activarea LT (semnal 1)', TCR_PATHWAY)}
      ${pathway('🤝 CD28 & Checkpoints (semnal 2 / inhibitorii)', CD28_COSTIM)}
      ${pathway('🧲 Calea BCR — Activarea LB', BCR_PATHWAY)}
      ${jakstat()}
      ${nfkb()}
      ${antigenProcessing()}
      ${apoptosis()}
      ${inflammasome()}
      ${respiratoryBurst()}
      ${adhesion()}
      ${complement()}
      ${prrs()}
    </div>
  `;
}

function pathway(title, obj) {
  let content = `<div class="pathway-box"><h3>${title}</h3>`;
  for (const [k, v] of Object.entries(obj)) {
    if (k === 'name') continue;
    const label = k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    if (Array.isArray(v)) {
      content += `<h4>${esc(label)}</h4><ol>${v.map(s => `<li>${esc(s)}</li>`).join('')}</ol>`;
    } else if (typeof v === 'object' && v !== null) {
      content += `<h4>${esc(label)}</h4>`;
      for (const [kk, vv] of Object.entries(v)) {
        content += `<p><code>${esc(kk)}</code>: ${fmt(vv)}</p>`;
      }
    } else {
      content += `<p><strong>${esc(label)}:</strong> ${esc(String(v))}</p>`;
    }
  }
  content += '</div>';
  return content;
}

function jakstat() {
  return `<div class="pathway-box">
    <h3>📡 JAK-STAT — semnalizarea citokinelor</h3>
    <p>${esc(JAK_STAT.principle)}</p>
    <h4>JAKs</h4>${JAK_STAT.JAKs.map(j => `<span class="pill">${esc(j)}</span>`).join('')}
    <h4>STATs</h4>${JAK_STAT.STATs.map(s => `<span class="pill">${esc(s)}</span>`).join('')}
    <h4>Cuplări citokine → STAT</h4>
    ${Object.entries(JAK_STAT.cytokine_pairings).map(([ck, st]) =>
      `<p><code>${esc(ck)}</code> → ${esc(st)}</p>`
    ).join('')}
    <h4>Inhibitori JAK (medicamente)</h4>
    <ul>${Object.entries(JAK_STAT.drugs).map(([d, i]) =>
      `<li><code>${esc(d)}</code>: ${esc(i)}</li>`
    ).join('')}</ul>
    <h4>Deficite clinice</h4>
    <ul>${Object.entries(JAK_STAT.clinical_deficits).map(([d, i]) =>
      `<li><strong>${esc(d)}</strong>: ${esc(i)}</li>`
    ).join('')}</ul>
  </div>`;
}

function nfkb() {
  return `<div class="pathway-box">
    <h3>🔥 NF-κB — inflamație și supraviețuire</h3>
    <h4>Subunități</h4>${NFKB_PATHWAY.subunits.map(s => `<span class="pill">${esc(s)}</span>`).join('')}
    <h4>Calea canonică</h4>
    <p><strong>Activatori:</strong> ${esc(NFKB_PATHWAY.canonical.activators.join(', '))}</p>
    <ol>${NFKB_PATHWAY.canonical.cascade.map(s => `<li>${esc(s)}</li>`).join('')}</ol>
    <h4>Calea non-canonică</h4>
    <p><strong>Activatori:</strong> ${esc(NFKB_PATHWAY.non_canonical.activators.join(', '))}</p>
    <ol>${NFKB_PATHWAY.non_canonical.cascade.map(s => `<li>${esc(s)}</li>`).join('')}</ol>
    <h4>Deficite clinice</h4>
    ${Object.entries(NFKB_PATHWAY.deficits_clinical).map(([d, i]) =>
      `<p><strong>${esc(d)}</strong>: ${esc(i)}</p>`
    ).join('')}
  </div>`;
}

function antigenProcessing() {
  const p = ANTIGEN_PROCESSING;
  return `<div class="pathway-box">
    <h3>🎯 Procesarea antigenului</h3>
    <h4>${esc(p.MHC_I_pathway.name)}</h4>
    <ol>${p.MHC_I_pathway.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol>
    <h4>Prezentare încrucișată (cross-presentation)</h4>
    <p>${esc(p.MHC_I_pathway.cross_presentation.desc)}</p>
    <p><em>${esc(p.MHC_I_pathway.cross_presentation.mechanism)}</em></p>
    <h4>${esc(p.MHC_II_pathway.name)}</h4>
    <ol>${p.MHC_II_pathway.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol>
    <h4>${esc(p.CD1_pathway.name)}</h4>
    <p>${esc(p.CD1_pathway.desc)}</p>
  </div>`;
}

function apoptosis() {
  return `<div class="pathway-box">
    <h3>💀 Apoptoza</h3>
    <h4>Calea extrinsecă</h4>
    <p><strong>Declanșatori:</strong> ${esc(APOPTOSIS.extrinsic.triggers.join(', '))}</p>
    <ol>${APOPTOSIS.extrinsic.cascade.map(s => `<li>${esc(s)}</li>`).join('')}</ol>
    <h4>Calea intrinsecă</h4>
    <p><strong>Declanșatori:</strong> ${esc(APOPTOSIS.intrinsic.triggers.join(', '))}</p>
    <p><strong>Pro-apoptotici:</strong> ${APOPTOSIS.intrinsic.regulators.pro_apoptotic.map(r => `<span class="pill">${esc(r)}</span>`).join('')}</p>
    <p><strong>Anti-apoptotici:</strong> ${APOPTOSIS.intrinsic.regulators.anti_apoptotic.map(r => `<span class="pill">${esc(r)}</span>`).join('')}</p>
    <ol>${APOPTOSIS.intrinsic.cascade.map(s => `<li>${esc(s)}</li>`).join('')}</ol>
    <h4>Metode de detectare</h4>
    <ul>${APOPTOSIS.detection.methods.map(m => `<li>${esc(m)}</li>`).join('')}</ul>
    <h4>Clinic</h4>
    ${Object.entries(APOPTOSIS.clinical).map(([k, v]) => `<p><strong>${esc(k)}</strong>: ${esc(v)}</p>`).join('')}
  </div>`;
}

function inflammasome() {
  const i = INFLAMMASOME;
  return `<div class="pathway-box">
    <h3>💥 Inflamazomul</h3>
    <p>${esc(i.principle)}</p>
    <h4>Senzori</h4>${i.sensors.map(s => `<span class="pill">${esc(s)}</span>`).join('')}
    <h4>Activarea NLRP3</h4>
    <p><strong>Semnal 1:</strong> ${esc(i.NLRP3_activation.signal_1)}</p>
    <p><strong>Semnal 2:</strong> ${esc(i.NLRP3_activation.signal_2)}</p>
    <p><strong>Declanșatori:</strong> ${esc(i.NLRP3_activation.triggers.join(', '))}</p>
    <p><strong>Asamblare:</strong> ${esc(i.assembly)}</p>
    <h4>Clinic</h4>
    ${Object.entries(i.clinical).map(([k, v]) => `<p><strong>${esc(k)}</strong>: ${esc(v)}</p>`).join('')}
  </div>`;
}

function respiratoryBurst() {
  const r = RESPIRATORY_BURST;
  return `<div class="pathway-box">
    <h3>💨 Explozia respiratorie (NADPH oxidază)</h3>
    <h4>Subunități</h4><ul>${r.subunits.map(s => `<li>${esc(s)}</li>`).join('')}</ul>
    <p><strong>Reacție:</strong> <code>${esc(r.reaction)}</code></p>
    <h4>ROS derivate</h4><ul>${r.downstream_ROS.map(s => `<li>${esc(s)}</li>`).join('')}</ul>
    <h4>Clinic — Boala granulomatoasă cronică (CGD)</h4>
    <p>${esc(r.clinical.CGD)}</p>
    <p><strong>Tratament:</strong> ${esc(r.clinical.treatment)}</p>
  </div>`;
}

function adhesion() {
  const a = LEUKOCYTE_ADHESION;
  return `<div class="pathway-box">
    <h3>🔗 Adeziunea leucocitară (rolling → arest → transmigrare)</h3>
    <ol>
      ${a.cascade.map(step => `
        <li><strong>${esc(step.name)}</strong><br>
          <span style="font-size:12px;color:#8892b0">Molecule: ${esc((step.molecules || []).join(', '))}</span>
          ${step.ligands ? `<br><span style="font-size:12px;color:#8892b0">Liganzi: ${esc(step.ligands.join(', '))}</span>` : ''}
          ${step.outcome ? `<br><em style="font-size:12px">${esc(step.outcome)}</em>` : ''}
          ${step.directed_by ? `<br><em style="font-size:12px">Direcționat de: ${esc(step.directed_by.join(', '))}</em>` : ''}
        </li>
      `).join('')}
    </ol>
    <h4>Clinic — LAD</h4>
    ${Object.entries(a.clinical).map(([k, v]) => `<p><strong>${esc(k)}</strong>: ${esc(v)}</p>`).join('')}
  </div>`;
}

function complement() {
  return `<div class="pathway-box">
    <h3>🩸 Cascada complementului</h3>
    <h4>Căile de activare</h4>
    ${Object.entries(COMPLEMENT.pathways).map(([name, info]) => `
      <div style="margin-bottom:10px;padding:10px;background:#0b1020;border-radius:6px;border:1px solid #1f2a4d">
        <strong style="color:#22d3ee">${esc(name.toUpperCase())}</strong><br>
        <p style="font-size:12px">${esc(info.trigger)}</p>
        ${info.components ? `<p style="font-size:12px"><em>Componente:</em> ${esc(info.components.join(' · '))}</p>` : ''}
        ${info.C3_convertase ? `<p style="font-size:12px"><em>C3-convertaza:</em> <code>${esc(info.C3_convertase)}</code></p>` : ''}
        ${info.amplification_loop ? `<p style="font-size:12px"><em>Buclă de amplificare:</em> ${esc(info.amplification_loop)}</p>` : ''}
      </div>
    `).join('')}
    <h4>Calea terminală comună</h4>
    <ol>${COMPLEMENT.common_terminal.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol>
    <p><strong>MAC:</strong> ${esc(COMPLEMENT.common_terminal.MAC)}</p>
    <h4>Funcții efectorii</h4>
    ${Object.entries(COMPLEMENT.effector_functions).map(([k, v]) =>
      `<p><strong>${esc(k.replace(/_/g, ' '))}:</strong> ${esc(Array.isArray(v) ? v.join(', ') : v)}</p>`
    ).join('')}
    <h4>Patologie</h4>
    ${Object.entries(COMPLEMENT.pathology).map(([k, v]) =>
      `<p><strong>${esc(k.replace(/_/g, ' '))}</strong>: ${esc(v)}</p>`
    ).join('')}
  </div>`;
}

function prrs() {
  return `<div class="pathway-box">
    <h3>👁 PRR — Receptori de recunoaștere a patternurilor</h3>
    <h4>TLR (Toll-Like Receptors)</h4>
    <table class="data">
      <thead><tr><th>TLR</th><th>Locație</th><th>Ligand</th><th>Cale</th></tr></thead>
      <tbody>
        ${PRRs.TLR.map(t => `
          <tr><td><code>${esc(t.id)}</code></td><td>${esc(t.location)}</td>
          <td>${esc(t.ligand)}</td><td>${esc(t.pathway)}</td></tr>
        `).join('')}
      </tbody>
    </table>
    <h4>NLR (NOD-like Receptors)</h4>
    ${PRRs.NLR.map(n => `<p><code>${esc(n.id)}</code>: ${esc(n.note || n.ligand || '')} ${n.clinical ? `<em style="color:#ef4444">· ${esc(n.clinical)}</em>` : ''}</p>`).join('')}
    <h4>RLR (RIG-I-like)</h4>
    ${PRRs.RLR.map(r => `<p><code>${esc(r.id)}</code>: ${esc(r.ligand)} → ${esc(r.pathway)}</p>`).join('')}
    <h4>CLR (C-type Lectin)</h4>
    ${PRRs.CLR.map(c => `<p><code>${esc(c.id)}</code>: ${esc(c.ligand)}</p>`).join('')}
    <h4>Sensori ADN citosolici</h4>
    ${PRRs.cytosolic_DNA.map(c => `<p><code>${esc(c.id)}</code>: ${esc(c.ligand || c.note || '')} ${c.clinical ? `<em style="color:#ef4444">· ${esc(c.clinical)}</em>` : ''}</p>`).join('')}
  </div>`;
}

function fmt(v) {
  if (Array.isArray(v)) return esc(v.join(', '));
  if (typeof v === 'object' && v !== null) {
    return Object.entries(v).map(([k, vv]) => `${esc(k)}=${esc(String(vv))}`).join(', ');
  }
  return esc(String(v));
}

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
