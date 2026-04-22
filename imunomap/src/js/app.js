// ============================================================================
// app.js — Router-ul principal al aplicației + inițializare view-uri
// ============================================================================

import { initMap, showDetail, hideDetail } from './views/map.js';
import { initGenetics } from './views/genetics.js';
import { initBiochemistry } from './views/biochemistry.js';
import { initTechniques } from './views/techniques.js';
import { initIDE } from './views/ide.js';
import { initSimulator } from './views/simulator.js';

// ----------------------------------------------------------------------------
// State
// ----------------------------------------------------------------------------
const state = {
  currentView: 'map',
  initialized: new Set()
};

const VIEW_TITLES = {
  map:          'Harta imună',
  genetics:     'Genetică',
  biochemistry: 'Biochimie',
  techniques:   'Tehnici',
  ide:          'ImmunoScript IDE',
  simulator:    'Simulator'
};

const VIEW_INITIALIZERS = {
  map:          initMap,
  genetics:     initGenetics,
  biochemistry: initBiochemistry,
  techniques:   initTechniques,
  ide:          initIDE,
  simulator:    initSimulator
};

// ----------------------------------------------------------------------------
// Router
// ----------------------------------------------------------------------------
function switchView(view) {
  if (!VIEW_TITLES[view]) return;
  state.currentView = view;

  // Toggle vizibil
  document.querySelectorAll('.view').forEach(el => el.classList.add('hidden'));
  const target = document.getElementById('view-' + view);
  if (target) target.classList.remove('hidden');

  // Active state în sidebar
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  const navItem = document.querySelector(`.nav-item[data-view="${view}"]`);
  if (navItem) navItem.classList.add('active');

  // Breadcrumb
  document.getElementById('bc-current').textContent = VIEW_TITLES[view];

  // Lazy init
  if (!state.initialized.has(view)) {
    const init = VIEW_INITIALIZERS[view];
    if (init) init();
    state.initialized.add(view);
  }

  // Ascunde panoul de detalii la schimbarea viewului
  hideDetail();
}

// Expune global (folosit și de alte module)
window.imunomap = window.imunomap || {};
window.imunomap.switchView = switchView;
window.imunomap.showDetail = showDetail;

// ----------------------------------------------------------------------------
// Event listeners
// ----------------------------------------------------------------------------
function bindNavigation() {
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => switchView(btn.dataset.view));
  });
}

function bindKeyboard() {
  document.addEventListener('keydown', (e) => {
    const mod = e.metaKey || e.ctrlKey;
    if (!mod) return;
    const keyToView = { '1': 'map', '2': 'genetics', '3': 'biochemistry', '4': 'techniques', '5': 'ide', '6': 'simulator' };
    if (keyToView[e.key]) {
      e.preventDefault();
      switchView(keyToView[e.key]);
    }
    if (e.key === 'r' && state.currentView === 'ide') {
      e.preventDefault();
      const btn = document.getElementById('btn-run');
      if (btn) btn.click();
    }
  });
}

function bindDetailPanel() {
  const closeBtn = document.getElementById('detail-close');
  if (closeBtn) closeBtn.addEventListener('click', hideDetail);
}

function bindGlobalSearch() {
  const inp = document.getElementById('global-search');
  if (!inp) return;
  inp.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const q = inp.value.trim().toLowerCase();
      if (!q) return;
      // Router rudimentar: dacă e număr între 1-6 → view; altfel caută pe hartă
      if (state.currentView !== 'map') switchView('map');
      // comunică către map.js
      window.imunomap.dispatchEvent?.('search', q);
    }
  });
}

// ----------------------------------------------------------------------------
// IPC Electron (dacă e rulat ca Electron; altfel ignoră)
// ----------------------------------------------------------------------------
function bindElectronIPC() {
  if (typeof window.imuno !== 'object' || !window.imuno.on) return;
  window.imuno.on('view:map',          () => switchView('map'));
  window.imuno.on('view:genetics',     () => switchView('genetics'));
  window.imuno.on('view:biochemistry', () => switchView('biochemistry'));
  window.imuno.on('view:techniques',   () => switchView('techniques'));
  window.imuno.on('view:ide',          () => switchView('ide'));
  window.imuno.on('view:simulator',    () => switchView('simulator'));
}

// ----------------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  bindNavigation();
  bindKeyboard();
  bindDetailPanel();
  bindGlobalSearch();
  bindElectronIPC();
  switchView('map'); // vizualizare implicită
});
