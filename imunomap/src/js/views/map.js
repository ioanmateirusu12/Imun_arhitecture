// ============================================================================
// views/map.js — Harta interactivă a sistemului imun (Cytoscape)
// ============================================================================

import { CELLS, LINEAGE_COLORS } from '../../data/cells.js';
import { ANTIBODIES, MHC, CYTOKINES, CD_MARKERS } from '../../data/molecules.js';
import { INTERACTIONS, INTERACTION_STYLES } from '../../data/interactions.js';

let cy = null;
let allNodes = [];
let allEdges = [];

// ----------------------------------------------------------------------------
// Build nodes and edges
// ----------------------------------------------------------------------------
function buildGraphData() {
  const nodes = [];
  const edges = [];

  // === Celule ===
  for (const c of CELLS) {
    nodes.push({
      data: {
        id: c.id,
        label: c.id,
        kind: 'cell',
        lineage: c.lineage || 'unknown',
        name_ro: c.name_ro,
        rec: c
      },
      classes: 'node-cell lineage-' + (c.lineage || 'unknown')
    });
  }

  // === Anticorpi ===
  for (const ab of ANTIBODIES) {
    nodes.push({
      data: { id: ab.id, label: ab.id, kind: 'antibody', rec: ab },
      classes: 'node-antibody'
    });
  }

  // === MHC ===
  for (const m of MHC) {
    nodes.push({
      data: { id: m.id, label: (m.id.replace(/_/g, ' ')), kind: 'mhc', rec: m },
      classes: 'node-mhc'
    });
  }

  // === Citokine semnificative (doar câteva pentru claritate) ===
  const keyCytokines = ['IL-2', 'IL-4', 'IL-6', 'IL-10', 'IL-12', 'IL-17', 'TNF-α', 'IFN-γ', 'TGF-β'];
  for (const ck of CYTOKINES.filter(c => keyCytokines.includes(c.id))) {
    nodes.push({
      data: { id: ck.id, label: ck.id, kind: 'cytokine', rec: ck },
      classes: 'node-cytokine'
    });
  }

  // === Edges ===
  const nodeIds = new Set(nodes.map(n => n.data.id));
  for (const it of INTERACTIONS) {
    if (nodeIds.has(it.s) && nodeIds.has(it.t)) {
      edges.push({
        data: {
          id: `${it.s}->${it.t}:${it.type}`,
          source: it.s,
          target: it.t,
          type: it.type,
          label: it.lbl || ''
        },
        classes: 'edge-' + it.type
      });
    }
  }

  return { nodes, edges };
}

// ----------------------------------------------------------------------------
// Cytoscape styles
// ----------------------------------------------------------------------------
function getStyles() {
  const styles = [
    // Base node style
    {
      selector: 'node',
      style: {
        'label': 'data(label)',
        'color': '#e5e9f5',
        'font-size': '11px',
        'font-family': '-apple-system, system-ui, sans-serif',
        'font-weight': '600',
        'text-valign': 'center',
        'text-halign': 'center',
        'text-outline-color': '#060a1a',
        'text-outline-width': 2,
        'width': 46, 'height': 46,
        'background-color': '#5b8cff',
        'border-width': 2,
        'border-color': '#3b64d9',
        'overlay-padding': 6
      }
    },
    // Cell nodes colored by lineage
    ...Object.entries(LINEAGE_COLORS || {}).map(([lineage, color]) => ({
      selector: `.lineage-${lineage}`,
      style: { 'background-color': color, 'border-color': color }
    })),
    {
      selector: '.node-antibody',
      style: { 'background-color': '#f59e0b', 'border-color': '#d97706', 'shape': 'round-rectangle', 'width': 52 }
    },
    {
      selector: '.node-mhc',
      style: { 'background-color': '#a855f7', 'border-color': '#7e22ce', 'shape': 'hexagon', 'width': 50 }
    },
    {
      selector: '.node-cytokine',
      style: { 'background-color': '#22d3ee', 'border-color': '#0891b2', 'shape': 'diamond', 'width': 40, 'height': 40 }
    },
    // Selected / hovered
    {
      selector: ':selected',
      style: { 'border-color': '#fff', 'border-width': 4, 'overlay-opacity': 0.2 }
    },
    {
      selector: '.faded',
      style: { 'opacity': 0.2 }
    },
    {
      selector: '.highlight',
      style: { 'border-color': '#fff', 'border-width': 3 }
    },

    // Base edge
    {
      selector: 'edge',
      style: {
        'width': 2,
        'line-color': '#3b4668',
        'target-arrow-color': '#3b4668',
        'target-arrow-shape': 'triangle',
        'curve-style': 'bezier',
        'opacity': 0.75,
        'font-size': '9px',
        'color': '#8892b0'
      }
    }
  ];

  // Edge types with specific colors
  const STYLE_MAP = {
    differentiation:  { color: '#6b7280', arrow: 'triangle',            style: 'solid',  width: 2 },
    presentation:     { color: '#0ea5e9', arrow: 'triangle',            style: 'solid',  width: 3 },
    co_stimulation:   { color: '#22d3ee', arrow: 'diamond',             style: 'dashed', width: 2 },
    co_localization:  { color: '#64748b', arrow: 'none',                style: 'dotted', width: 1 },
    activation:       { color: '#22c55e', arrow: 'triangle',            style: 'solid',  width: 2 },
    inhibition:       { color: '#ef4444', arrow: 'tee',                 style: 'solid',  width: 2 },
    secretion:        { color: '#f59e0b', arrow: 'circle',              style: 'solid',  width: 2 },
    cytotoxicity:     { color: '#dc2626', arrow: 'triangle-backcurve',  style: 'solid',  width: 3 },
    help:             { color: '#a855f7', arrow: 'triangle',            style: 'solid',  width: 2 },
    recruitment:      { color: '#06b6d4', arrow: 'triangle',            style: 'dashed', width: 2 },
    effector:         { color: '#ec4899', arrow: 'triangle',            style: 'solid',  width: 2 },
    binding:          { color: '#eab308', arrow: 'diamond',             style: 'dashed', width: 2 }
  };
  for (const [type, cfg] of Object.entries(STYLE_MAP)) {
    styles.push({
      selector: `.edge-${type}`,
      style: {
        'line-color': cfg.color,
        'target-arrow-color': cfg.color,
        'target-arrow-shape': cfg.arrow,
        'line-style': cfg.style,
        'width': cfg.width
      }
    });
  }

  return styles;
}

// ----------------------------------------------------------------------------
// Init
// ----------------------------------------------------------------------------
export function initMap() {
  if (typeof cytoscape === 'undefined') {
    document.getElementById('cy-container').innerHTML =
      '<div style="padding:24px;color:#ff7c7c">⚠ Cytoscape nu s-a încărcat. Verifică conexiunea sau rulează npm install.</div>';
    return;
  }

  // Înregistrează layout-ul extension dacă există
  if (typeof cytoscapeCoseBilkent !== 'undefined') {
    try { cytoscape.use(cytoscapeCoseBilkent); } catch (e) { /* already registered */ }
  }

  const data = buildGraphData();
  allNodes = data.nodes;
  allEdges = data.edges;

  cy = cytoscape({
    container: document.getElementById('cy-container'),
    elements: [...data.nodes, ...data.edges],
    style: getStyles(),
    layout: {
      name: typeof cytoscapeCoseBilkent !== 'undefined' ? 'cose-bilkent' : 'cose',
      animate: true,
      animationDuration: 600,
      nodeRepulsion: 8000,
      idealEdgeLength: 120,
      edgeElasticity: 0.45,
      gravity: 0.1,
      numIter: 2500
    },
    minZoom: 0.2,
    maxZoom: 2.5,
    wheelSensitivity: 0.2
  });

  // === Event listeners ===
  cy.on('tap', 'node', (evt) => {
    const n = evt.target;
    highlightNeighborhood(n);
    showDetailForNode(n.data('rec'), n.data('kind'));
  });

  cy.on('tap', (evt) => {
    if (evt.target === cy) {
      cy.elements().removeClass('faded highlight');
      hideDetail();
    }
  });

  // Toolbar bindings
  document.querySelectorAll('.map-toolbar input[data-filter]').forEach(chk => {
    chk.addEventListener('change', applyFilters);
  });
  document.getElementById('layout-select')?.addEventListener('change', (e) => {
    const name = e.target.value;
    cy.layout({ name, animate: true, animationDuration: 500 }).run();
  });
  document.getElementById('btn-fit')?.addEventListener('click', () => cy.fit(null, 40));
  document.getElementById('btn-reset')?.addEventListener('click', () => {
    cy.elements().removeClass('faded highlight');
    document.querySelectorAll('.map-toolbar input[data-filter]').forEach(c => c.checked = true);
    applyFilters();
    cy.fit(null, 40);
  });

  // Global search hook
  if (window.imunomap) {
    window.imunomap.dispatchEvent = (type, payload) => {
      if (type === 'search') searchInMap(payload);
    };
  }
}

function applyFilters() {
  const active = new Set();
  document.querySelectorAll('.map-toolbar input[data-filter]').forEach(c => {
    if (c.checked) active.add(c.dataset.filter);
  });
  cy.nodes().forEach(n => {
    const kind = n.data('kind');
    if (active.has(kind)) n.show();
    else n.hide();
  });
  cy.edges().forEach(e => {
    if (e.source().visible() && e.target().visible()) e.show();
    else e.hide();
  });
}

function highlightNeighborhood(node) {
  cy.elements().addClass('faded');
  const nh = node.neighborhood().union(node);
  nh.removeClass('faded').addClass('highlight');
}

function searchInMap(q) {
  const term = q.toLowerCase();
  const matches = cy.nodes().filter(n => {
    const id = String(n.data('id') || '').toLowerCase();
    const rec = n.data('rec');
    const ro = rec?.name_ro?.toLowerCase() || '';
    const nm = rec?.name?.toLowerCase() || '';
    return id.includes(term) || ro.includes(term) || nm.includes(term);
  });
  if (matches.length > 0) {
    cy.elements().addClass('faded');
    matches.removeClass('faded').addClass('highlight');
    cy.animate({ center: { eles: matches }, zoom: 1.2 }, { duration: 500 });
    if (matches.length === 1) showDetailForNode(matches[0].data('rec'), matches[0].data('kind'));
  }
}

// ----------------------------------------------------------------------------
// Detail panel
// ----------------------------------------------------------------------------
function showDetailForNode(rec, kind) {
  if (!rec) return;
  const title = rec.id || rec.name || 'Detaliu';
  const body = renderDetailBody(rec, kind);
  showDetail(title, body);
}

function renderDetailBody(rec, kind) {
  const parts = [];
  if (rec.name_ro && rec.name_ro !== rec.id)  parts.push(`<p><em>${escape(rec.name_ro)}</em></p>`);
  if (rec.full_name) parts.push(`<p><em>${escape(rec.full_name)}</em></p>`);

  const pushList = (title, items) => {
    if (!items) return;
    const arr = Array.isArray(items) ? items : [items];
    if (arr.length === 0) return;
    parts.push(`<h4>${title}</h4><ul>${arr.map(i => `<li>${escape(typeof i === 'object' ? JSON.stringify(i) : String(i))}</li>`).join('')}</ul>`);
  };
  const pushBadges = (title, items) => {
    if (!items) return;
    const arr = Array.isArray(items) ? items : [items];
    parts.push(`<h4>${title}</h4>${arr.map(i => `<span class="badge">${escape(String(i))}</span>`).join('')}`);
  };

  pushBadges('Lineage',         rec.lineage);
  pushBadges('Markeri fenotipici', rec.markers);
  pushList('Citokine produse',     rec.cytokines);
  pushList('Factori de transcripție', rec.master_tf);
  pushList('Funcții',              rec.functions);
  pushList('Aplicații clinice',    rec.clinical);
  pushList('Subclase',             rec.subclasses ? Object.entries(rec.subclasses).map(([k,v]) => `${k}: ${v}`) : null);

  // Câmpuri generice
  const skip = new Set(['id','cd','name','name_ro','full_name','rec','kind','lineage','markers','cytokines','master_tf','functions','clinical','subclasses']);
  for (const k of Object.keys(rec)) {
    if (skip.has(k)) continue;
    const v = rec[k];
    if (v === null || v === undefined) continue;
    const label = k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    if (Array.isArray(v)) pushList(label, v);
    else if (typeof v === 'object') {
      const lines = Object.entries(v).map(([kk, vv]) => `${kk}: ${typeof vv === 'object' ? JSON.stringify(vv) : vv}`);
      pushList(label, lines);
    } else parts.push(`<h4>${label}</h4><p>${escape(String(v))}</p>`);
  }

  return parts.join('\n');
}

// ----------------------------------------------------------------------------
// Exports pentru alte view-uri / global
// ----------------------------------------------------------------------------
export function showDetail(title, htmlBody) {
  const panel = document.getElementById('detail-panel');
  document.getElementById('detail-title').textContent = title;
  document.getElementById('detail-body').innerHTML = htmlBody;
  panel.classList.remove('hidden');
}

export function hideDetail() {
  const panel = document.getElementById('detail-panel');
  if (panel) panel.classList.add('hidden');
}

function escape(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
