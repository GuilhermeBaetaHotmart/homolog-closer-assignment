/* ══════════════════════════════════════════════
   utils.js — Funções utilitárias puras
   Sem dependência de DOM, estado global ou API.
   ══════════════════════════════════════════════ */


import { SEGS } from './api.js';


/* Classifica um valor de cliente em segmento + subgrupo */
export function classify(v) {
  for (const [sk, seg] of Object.entries(SEGS))
    for (const sg of seg.sub)
      if (v >= sg.min && v <= sg.max) return { segKey: sk, subKey: sg.key, subLabel: sg.label };
  return null;
}

/* Formata valor em R$ compacto (ex: R$ 1.5M, R$ 600k) */
export function fmtBRL(v) {
  if (v >= 1000000) return 'R$ ' + (v / 1000000).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + 'M';
  if (v >= 1000)    return 'R$ ' + (v / 1000).toFixed(0) + 'k';
  return 'R$ ' + v;
}

/* Formata valor em R$ compacto — variante usada na animação de login */
export function fv(v) {
  if (v >= 1000000) return 'R$ ' + (v / 1000000).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + 'M';
  if (v >= 1000)    return 'R$ ' + (v / 1000).toFixed(0) + 'k';
  return 'R$ ' + v;
}

/* Retorna a segunda-feira da semana corrente + offset de semanas */
export function getMon(offset) {
  var now = new Date(); var day = now.getDay();
  var mon = new Date(now); mon.setDate(now.getDate() - (day === 0 ? 6 : day - 1) + offset * 7);
  return mon;
}

/* ── Photo map — atribuição de foto por email ─── */
const PHOTO_POOL = [
  'https://i.ibb.co/bgsrKmys/ana-victoria.png',
  'https://i.ibb.co/0pmymzHK/beatriz-perrotta.png',
  'https://i.ibb.co/fdPPCMn4/camila-harumi.png',
  'https://i.ibb.co/Y4PW73ww/debora-holmo.png',
  'https://i.ibb.co/bM95vJhy/deborah-eulalio.png',
  'https://i.ibb.co/4g1wy3kt/gustavo-duarte.png',
  'https://i.ibb.co/cSxtn8Qh/izabella-neves.png',
  'https://i.ibb.co/gFdjBLSY/jeanne-marie.png',
  'https://i.ibb.co/9mJ1NVt8/lucas-guerrero.png',
  'https://i.ibb.co/0jPmQjJf/maria-dabbur.png',
  'https://i.ibb.co/G3fyz6qm/olivio-blach.png',
  'https://i.ibb.co/tpdTWvbX/rafael-rufino.png',
  'https://i.ibb.co/SXRSkt9K/rayane-natalia.png',
  'https://i.ibb.co/xKpDM2Zj/roberta-candido.png',
  'https://i.ibb.co/5gN7LzcL/thaissa-pinho.png',
  'https://i.ibb.co/XxKxSg2K/fernanda-cardoso.png',
  'https://i.ibb.co/pr54Kv1X/gabriel-botini.png',
  'https://i.ibb.co/x8Cwt2p6/guilherme-baeta.png',
  'https://i.ibb.co/chsMF3QP/lucas-foureaux.png',
  'https://i.ibb.co/8L0nypP8/mateus-pereira.png',
  'https://i.ibb.co/kstjMmVq/sarah-andrade.png',
  'https://i.ibb.co/v6YDZV9P/matheus-vilela.png',
];

const PHOTO_BY_EMAIL = {
  'fernanda.cardoso@hotmart.com': 'https://i.ibb.co/XxKxSg2K/fernanda-cardoso.png',
  'gabriel.botini@hotmart.com':   'https://i.ibb.co/pr54Kv1X/gabriel-botini.png',
  'guilherme.baeta@hotmart.com':  'https://i.ibb.co/x8Cwt2p6/guilherme-baeta.png',
  'lucas.damasceno@hotmart.com':  'https://i.ibb.co/chsMF3QP/lucas-foureaux.png',
  'mateus.pereira@hotmart.com':   'https://i.ibb.co/8L0nypP8/mateus-pereira.png',
  'sarah.sena@hotmart.com':       'https://i.ibb.co/kstjMmVq/sarah-andrade.png',
  'matheus.vilela@hotmart.com':   'https://i.ibb.co/v6YDZV9P/matheus-vilela.png',
};

export function getCloserPhoto(email) {
  if (PHOTO_BY_EMAIL[email]) return PHOTO_BY_EMAIL[email];
  var h = 0;
  for (var i = 0; i < (email || '').length; i++) h = (h * 31 + email.charCodeAt(i)) & 0xFFFF;
  return PHOTO_POOL[h % PHOTO_POOL.length];
}

/* ── Helpers de canvas usados pela animação ───── */
export function rr2(ctx,x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.arcTo(x+w,y,x+w,y+r,r);ctx.lineTo(x+w,y+h-r);ctx.arcTo(x+w,y+h,x+w-r,y+h,r);ctx.lineTo(x+r,y+h);ctx.arcTo(x,y+h,x,y+h-r,r);ctx.lineTo(x,y+r);ctx.arcTo(x,y,x+r,y,r);ctx.closePath();}
export function eio2(t){return t<0.5?2*t*t:-1+(4-2*t)*t;}
export function cl2(v,a,b){return Math.max(a,Math.min(b,v));}
export function dperson(ctx,px,py,sz,alpha,col,ring){ctx.save();ctx.globalAlpha=cl2(alpha,0,1);if(ring){ctx.beginPath();ctx.arc(px,py,sz,0,Math.PI*2);ctx.strokeStyle=col;ctx.lineWidth=1.5;ctx.globalAlpha=cl2(alpha*.55,0,1);ctx.stroke();ctx.globalAlpha=cl2(alpha,0,1);}ctx.beginPath();ctx.arc(px,py-sz*.22,sz*.28,0,Math.PI*2);ctx.fillStyle=col;ctx.fill();ctx.beginPath();ctx.arc(px,py+sz*.26,sz*.42,Math.PI*1.1,Math.PI*1.9,false);ctx.fillStyle=col;ctx.fill();ctx.restore();}

export function Pt(sx,sy,tx,ty,col,delay,r){this.sx=sx;this.sy=sy;this.tx=tx;this.ty=ty;this.x=sx;this.y=sy;this.color=col;this.delay=delay;this.r=r||4;this.t=0;this.done=false;this.cpx=(sx+tx)/2+(Math.random()-.5)*26;this.cpy=(sy+ty)/2+(Math.random()-.5)*42;}
