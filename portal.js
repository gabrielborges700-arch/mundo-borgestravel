/**
 * portal.js — Transição de Portal do Mundo Borgestrável
 *
 * Um "portal mágico" curto (≈850ms) por cima da página: véu escuro, flash
 * na cor do reino, anel rúnico girando e se abrindo em 3D, redemoinho de
 * energia e um estouro de luz no centro. Adaptado do <PortalTransicao />
 * do protótipo Base44 (React + framer-motion), aqui em JS + CSS puros
 * (keyframes .portal-* na seção "Transição de Portal" do style.css).
 *
 * - Toca quando a criança ENTRA num reino (app.js chama portalAoAbrirReino)
 *   e na abertura do site, 1x por sessão (ver JANELA_SESSAO_PORTAL).
 * - Nunca prende a criança: qualquer clique, toque ou tecla pula o portal,
 *   e ao terminar o elemento SOME do DOM (pointer-events liberados).
 * - prefers-reduced-motion: reduce → nada gira nem cresce; no máximo um
 *   véu suave de 150ms que nem recebe clique.
 * - Só decoração: aria-hidden, não rouba foco, não toca som.
 *
 * Carregar DEPOIS do navegacao.js (usa armazenamentoLer/armazenamentoGravar)
 * e do dados.js (reinosDados, ilhaAmaldicoada). Funções públicas:
 *   portalAbrir(corHex, callbackOpcional) — abre o portal na cor dada; o
 *     callback roda 1x quando ele termina (ou é pulado)
 *   portalAoAbrirReino(blocoId)           — atalho: acha a cor do reino e abre
 */

const CHAVE_PORTAL_ABERTURA = "borgestravel_portal_abertura";

// Duração total da animação (o CSS usa o mesmo valor em --portal-duracao)
const DURACAO_PORTAL = 850;
const DURACAO_PORTAL_REDUZIDO = 150;
const DURACAO_PORTAL_SAIDA = 140; // fade rápido quando a criança pula

// "Sessão" do portal de abertura: se a última abertura foi há menos de
// 30 min, recarregar a página não repete o portal. O valor passa pelo
// wrapper de armazenamento (que cai pra memória se o navegador bloquear).
const JANELA_SESSAO_PORTAL = 30 * 60 * 1000;

// Cor do portal de abertura (ouro da Forja Real) e de reserva pra hex inválido
const COR_PORTAL_PADRAO = "#d4af37";

// Glifos rúnicos do anel (traços num quadradinho de ±7px centrado na origem)
const GLIFOS_PORTAL = [
  "M-3 7V-7M-3-2L4-6M-3 2L4-2", // ᚠ
  "M-3 7V-7L3-3L-3 1L3 7",      // ᚱ
  "M0 7V-7M-5-2L0-7L5-2",       // ᛏ
  "M-3 7V-7M-3-4L3 0L-3 4",     // ᚦ
  "M0 7V-7M-5-6L0-1L5-6",       // ᛉ
  "M-5 7L4-2L0-7L-4-2L5 7",     // ᛟ
];

let portalAtual = null; // { elemento, timer, callback, ... } do portal na tela

// ---------- Cores ----------

// Aceita "#abc" ou "#aabbcc"; qualquer outra coisa vira o ouro padrão
function normalizarCorPortal(corHex) {
  const texto = String(corHex || "").trim();
  if (/^#[0-9a-f]{6}$/i.test(texto)) return texto.toLowerCase();
  if (/^#[0-9a-f]{3}$/i.test(texto)) {
    return ("#" + texto[1] + texto[1] + texto[2] + texto[2] + texto[3] + texto[3]).toLowerCase();
  }
  return COR_PORTAL_PADRAO;
}

function rgbDaCorPortal(hex) {
  return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
}

// Mistura com branco: os traços do anel ficam legíveis no véu escuro mesmo
// em reinos de cor fechada (a Ilha Amaldiçoada é #7a1414)
function clarearCorPortal(rgb, quanto) {
  return rgb.map((c) => Math.round(c + (255 - c) * quanto));
}

function rgbaPortal(rgb, alfa) {
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alfa})`;
}

// ---------- Desenho (SVG dos anéis) ----------

function anelExternoPortalSVG() {
  // 12 glifos na faixa entre os círculos, com 2 marquinhas entre cada par
  let marcas = "";
  for (let i = 0; i < 36; i++) {
    const angulo = (i / 36) * Math.PI * 2;
    if (i % 3 === 0) {
      const x = 130 + Math.cos(angulo) * 108;
      const y = 130 + Math.sin(angulo) * 108;
      const graus = (angulo * 180) / Math.PI + 90; // glifo "em pé" na tangente do anel
      marcas += `<path class="portal-glifo" d="${GLIFOS_PORTAL[(i / 3) % GLIFOS_PORTAL.length]}"
        transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${graus.toFixed(1)})"/>`;
    } else {
      const x1 = 130 + Math.cos(angulo) * 116;
      const y1 = 130 + Math.sin(angulo) * 116;
      const x2 = 130 + Math.cos(angulo) * 122;
      const y2 = 130 + Math.sin(angulo) * 122;
      marcas += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`;
    }
  }
  return `
    <svg class="portal-svg" width="260" height="260" viewBox="0 0 260 260" focusable="false">
      <circle cx="130" cy="130" r="124" class="portal-traco-forte"/>
      <circle cx="130" cy="130" r="94" class="portal-traco-fraco" stroke-dasharray="4 8"/>
      <g class="portal-traco-forte">${marcas}</g>
    </svg>`;
}

function anelInternoPortalSVG() {
  return `
    <svg class="portal-svg" width="180" height="180" viewBox="0 0 180 180" focusable="false">
      <circle cx="90" cy="90" r="78" class="portal-traco-fraco" stroke-dasharray="2 10"/>
      <path class="portal-traco-fraco" d="M90 24L146 122H34Z"/>
    </svg>`;
}

// ---------- Portal ----------

function portalMovimentoReduzido() {
  try {
    return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  } catch (erro) {
    return false;
  }
}

function portalAbrir(corHex, callbackOpcional) {
  // Um portal por vez: se já tem um na tela, encerra ele (e roda o callback dele)
  if (portalAtual) encerrarPortal();

  const callback = typeof callbackOpcional === "function" ? callbackOpcional : null;
  if (!document.body) {
    if (callback) setTimeout(callback, 0);
    return;
  }

  const hex = normalizarCorPortal(corHex);
  const rgb = rgbDaCorPortal(hex);
  const reduzido = portalMovimentoReduzido();

  const elemento = document.createElement("div");
  elemento.className = "portal-magico" + (reduzido ? " portal-reduzido" : "");
  elemento.setAttribute("aria-hidden", "true");
  elemento.style.setProperty("--portal-cor", hex);
  elemento.style.setProperty("--portal-cor-clara", rgbaPortal(clarearCorPortal(rgb, 0.45), 1));
  elemento.style.setProperty("--portal-cor-brilho", rgbaPortal(rgb, 0.33));
  elemento.style.setProperty("--portal-cor-forte", rgbaPortal(rgb, 0.8));
  elemento.style.setProperty("--portal-cor-media", rgbaPortal(rgb, 0.53));
  elemento.style.setProperty("--portal-duracao", (reduzido ? DURACAO_PORTAL_REDUZIDO : DURACAO_PORTAL) + "ms");

  if (reduzido) {
    // Sem giro, sem zoom: só o véu aparece e some
    elemento.innerHTML = `<div class="portal-veu"></div>`;
  } else {
    elemento.innerHTML = `
      <div class="portal-veu"></div>
      <div class="portal-flash"></div>
      <div class="portal-anel portal-anel-externo">${anelExternoPortalSVG()}</div>
      <div class="portal-redemoinho"></div>
      <div class="portal-estouro"></div>
      <div class="portal-anel portal-anel-interno">${anelInternoPortalSVG()}</div>
    `;
  }

  document.body.appendChild(elemento);

  const estado = { elemento, callback, reduzido, timer: null, timerSaida: null, aoPular: null };
  portalAtual = estado;

  // Clique, toque ou tecla pula o portal. O overlay não segura o clique (pointer-events: none),
  // então o mesmo toque também funciona na página: a criança nunca perde um clique.
  // Os ouvintes entram agora, então o clique que ABRIU o reino não conta.
  if (!reduzido) {
    estado.aoPular = () => pularPortal(estado);
    document.addEventListener("pointerdown", estado.aoPular, true);
    document.addEventListener("keydown", estado.aoPular, true);
  }

  // Fim garantido por timer (não depende de animationend, que pode não vir
  // em aba escondida ou se o CSS não carregou)
  estado.timer = setTimeout(() => {
    if (portalAtual === estado) encerrarPortal();
  }, reduzido ? DURACAO_PORTAL_REDUZIDO : DURACAO_PORTAL);
}

function pularPortal(estado) {
  if (portalAtual !== estado || estado.timerSaida) return;
  clearTimeout(estado.timer);
  soltarOuvintesPortal(estado);
  // Libera o clique na hora e some num fade curtinho
  estado.elemento.classList.add("portal-saindo");
  estado.timerSaida = setTimeout(() => {
    if (portalAtual === estado) encerrarPortal();
  }, DURACAO_PORTAL_SAIDA);
}

function soltarOuvintesPortal(estado) {
  if (!estado.aoPular) return;
  document.removeEventListener("pointerdown", estado.aoPular, true);
  document.removeEventListener("keydown", estado.aoPular, true);
  estado.aoPular = null;
}

// Tira o portal do DOM e roda o callback (síncrono quando outro portal vai entrar no lugar)
function encerrarPortal() {
  const estado = portalAtual;
  if (!estado) return;
  portalAtual = null;
  clearTimeout(estado.timer);
  clearTimeout(estado.timerSaida);
  soltarOuvintesPortal(estado);
  if (estado.elemento.parentNode) estado.elemento.parentNode.removeChild(estado.elemento);
  if (estado.callback) {
    try {
      estado.callback();
    } catch (erro) {
      // um callback com erro não pode travar o próximo portal
      setTimeout(() => { throw erro; }, 0);
    }
  }
}

// ---------- Atalhos ----------

// Acha a cor do reino pelo id ("bloco0".."bloco6" ou "ilha") e abre o portal
function portalAoAbrirReino(blocoId, callbackOpcional) {
  let cor = COR_PORTAL_PADRAO;
  if (typeof ilhaAmaldicoada !== "undefined" && blocoId === ilhaAmaldicoada.id) {
    cor = ilhaAmaldicoada.hex;
  } else if (typeof reinosDados !== "undefined") {
    const bloco = reinosDados.find((b) => b.id === blocoId);
    if (bloco) cor = bloco.hex;
  }
  portalAbrir(cor, callbackOpcional);
}

// Portal de abertura: na primeira visita e depois 1x por "sessão"
function portalDeAbertura() {
  const agora = Date.now();
  const ultima = Number(armazenamentoLer(CHAVE_PORTAL_ABERTURA)) || 0;
  if (ultima && agora - ultima >= 0 && agora - ultima < JANELA_SESSAO_PORTAL) return;
  armazenamentoGravar(CHAVE_PORTAL_ABERTURA, agora);
  portalAbrir(COR_PORTAL_PADRAO);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", portalDeAbertura);
} else {
  portalDeAbertura();
}
