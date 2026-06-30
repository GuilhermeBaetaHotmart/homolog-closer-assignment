/* ══════════════════════════════════════════════
   app.js — Orquestrador principal
   Importa todos os módulos, expõe as funções
   chamadas via onclick/onchange no HTML, e
   inicializa o estado da aplicação ao carregar.
   ══════════════════════════════════════════════ */

import { session, st, setSession } from './state.js';
import { doLogin, doLogout, setupRole, authFetch } from './auth.js';
import {
  loadActiveCompetitorsField, updateTag, goStep2, toggleSlotPicker, validateSlotPicker,
  clearSlotAndRetry, goEmergencyPool, fetchCloser, fetchSlots, renderSlots, selectSlot,
  applySlotFilters, setFilterDay, setFilterPeriod, rejectAgenda, renderRefused,
  renderQueueHint, doReserveSpecific, doReserve, showReservationState, startReservationTimer,
  doConfirmFinal, doCancelReserve, doConfirm, showSuccess, resetAll, onCompetitorChange
} from './sdr.js';
import { loadMercado, acceptLead, removeLead } from './mercado.js';
import { switchTab, switchDashTab, setAdminViewMode } from './navigation.js';
import { setPeriod, setSegFilter, loadDashboard, renderChart, renderDashboard } from './dashboard-core.js';
import { loadCapacity } from './dashboard-capacity.js';
import { loadSecurity } from './dashboard-security.js';
import { loadCampaigns, renderCampaignsGrid, addCampaign, toggleCampaign } from './dashboard-campaigns.js';
import {
  loadTimeConfig, renderTimeDefaults, renderTimeClosers, editCloserOverride,
  saveCloserOverride, clearCloserOverride, saveSegmentDefault
} from './dashboard-time.js';
import {
  loadEscalationConfig, renderEscalationLeaders, editEscalationLeader,
  saveEscalationLeader, removeEscalationLeader, addEscalationLeader
} from './dashboard-escalation.js';
import { toggleCloser } from './closers.js';
import { showToast, toggleTheme } from './ui.js';
import { fmtBRL, classify, getCloserPhoto, getMon } from './utils.js';
import './animation.js';

/* ── Expõe no window as funções chamadas via onclick/onchange no HTML ── */
Object.assign(window, {
  doLogin, doLogout,
  goStep2, toggleSlotPicker, validateSlotPicker, clearSlotAndRetry, goEmergencyPool,
  selectSlot, setFilterDay, setFilterPeriod, rejectAgenda, doReserveSpecific, doReserve,
  doConfirmFinal, doCancelReserve, resetAll, onCompetitorChange,
  changeWeek: function(dir){ st.weekOffset += dir; st.filterDay = 'all'; st.filterPeriod = 'all'; fetchSlots(); },
  loadMercado, acceptLead, removeLead,
  switchTab, switchDashTab, setAdminViewMode,
  setPeriod, setSegFilter, loadDashboard,
  loadCapacity, loadSecurity,
  loadCampaigns, addCampaign, toggleCampaign,
  loadTimeConfig, editCloserOverride, saveCloserOverride, clearCloserOverride, saveSegmentDefault,
  loadEscalationConfig, editEscalationLeader, saveEscalationLeader, removeEscalationLeader, addEscalationLeader,
  toggleCloser,
  toggleTheme,
});

/* ── Inicialização ──────────────────────────── */

// Restaura sessão salva no localStorage, se houver
(function restoreSession() {
  try {
    var saved = localStorage.getItem('ca_session');
    if (saved) {
      var d = JSON.parse(saved);
      if (d && d.email && d.success) {
        d.role = (d.role || '').toLowerCase().trim();
        setSession(d);
        var savedToken = localStorage.getItem('ca_token');
        if (savedToken) session.sessionToken = savedToken;
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('appScreen').style.display = 'block';
        document.getElementById('hdrName').textContent = d.name || d.email;
        document.getElementById('hdrEmail').textContent = d.email || '';
        document.getElementById('hdrAvatar').textContent = (d.name || d.email)[0].toUpperCase();
        setupRole(d);
      }
    }
  } catch (e) {}
})();

// Tema salvo
(function restoreTheme() {
  var saved = localStorage.getItem('ca_theme');
  if (saved === 'light') {
    document.body.classList.add('light');
    var btn = document.getElementById('themeToggle');
    if (btn) btn.textContent = '☀️';
  }
})();

// Listener de Enter no campo de senha do login
document.getElementById('loginPassword').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') doLogin();
});
