/* ══════════════════════════════════════════════
   ui.js — Componentes de UI genéricos (toast, tema).
   ══════════════════════════════════════════════ */



import { API, SEGS } from './api.js';
import { session, st } from './state.js';
import { fmtBRL, classify, getCloserPhoto, getMon } from './utils.js';
import { showToast } from './ui.js';

export function showToast(msg, type, duration) {
  type     = type     || 'success';
  duration = duration || 3000;
  var container = document.getElementById('toastContainer');
  var toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  toast.innerHTML = '<div class="toast-dot"></div><span>' + msg + '</span>';
  container.appendChild(toast);
  setTimeout(function() {
    toast.classList.add('toast-out');
    setTimeout(function() { toast.remove(); }, 260);
  }, duration);
}

export function toggleTheme() {
  var isLight = document.body.classList.toggle('light');
  var btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = isLight ? '☀️' : '🌙';
  try { localStorage.setItem('ca_theme', isLight ? 'light' : 'dark'); } catch(e) {}
}

