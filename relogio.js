/**
 * relogio.js — O RELÓGIO DO REINO (etapa B1 do "Reino Vivo", 24/11/2026)
 * O visual fica em estilos/relogio.css.
 *
 * O QUE ELE FAZ
 *  O reino segue a hora real do aparelho:
 *   - amanhecer (5h–6h59), dia (7h–16h59), entardecer (17h–18h59) e noite
 *     (19h–4h59) viram o atributo <html data-hora-reino="...">;
 *   - o CSS pinta um véu leve na carta e no fundo da página com a cor da
 *     hora (o texto nunca fica sob o véu) e, à noite, acende as janelas dos
 *     reinos e salpica estrelas na carta;
 *   - um medalhão de sol ou lua no canto da carta diz o período e a hora.
 *  Confere a hora a cada minuto e ao voltar para a aba.
 *
 * REGRAS
 *  - Nenhum arquivo antigo é alterado: encadeia aposRenderizarBlocos (o
 *    render refaz a lista dos reinos) e só usa globais com typeof.
 *  - Nada é salvo: a hora vem sempre do relógio do aparelho.
 *
 * PARA TESTES
 *  ?hora=amanhecer|dia|entardecer|noite na URL fixa um período; e
 *  window.relogioReino: periodo(), definir(periodo | null), decorar(),
 *  PERIODOS, periodoDaHora(h).
 */
(function () {
  "use strict";
  if (typeof document === "undefined") return;

  var PERIODOS = {
    amanhecer: { nome: "Amanhecer", astro: "sol" },
    dia: { nome: "Dia", astro: "sol" },
    entardecer: { nome: "Entardecer", astro: "sol" },
    noite: { nome: "Noite", astro: "lua" },
  };
  var fixo = null; // período fixado para testes (null = hora real)
  try {
    var pedido = new URLSearchParams(window.location.search).get("hora");
    if (pedido && PERIODOS[pedido]) fixo = pedido;
  } catch (e) { /* navegador antigo: segue a hora real */ }

  function periodoDaHora(h) {
    if (h >= 5 && h < 7) return "amanhecer";
    if (h >= 7 && h < 17) return "dia";
    if (h >= 17 && h < 19) return "entardecer";
    return "noite";
  }
  function periodo() { return fixo || periodoDaHora(new Date().getHours()); }
  function horaTexto() {
    var d = new Date(), m = String(d.getMinutes());
    return d.getHours() + ":" + (m.length < 2 ? "0" + m : m);
  }

  // Janelas acesas de cada ilustração do mapa (mesmo viewBox 160×120 do
  // mapa-mundo.js): [x, y, largura, altura]. A Ilha amaldiçoada fica escura.
  var JANELAS = {
    bloco0: [[49, 62, 6, 9], [105, 62, 6, 9]],
    bloco1: [[92, 64, 7, 7], [120, 64, 7, 7], [45, 66, 6, 7]],
    bloco2: [[77, 60, 6, 8], [34, 86, 4, 4]],
    bloco3: [[28, 84, 4, 3], [128, 84, 4, 3], [77, 9, 6, 6]],
    bloco4: [[38, 68, 8, 7], [104, 68, 8, 7]],
    bloco5: [[73, 19, 14, 6]],
    bloco6: [[22, 70, 6, 9], [132, 70, 6, 9], [64, 54, 6, 9], [90, 54, 6, 9]],
  };
  function svgJanelas(id) {
    var lista = JANELAS[id];
    if (!lista) return "";
    return '<svg class="rr-janelas-svg" viewBox="0 0 160 120" aria-hidden="true" focusable="false">' +
      lista.map(function (j, i) {
        return '<rect class="rr-janela rr-janela-' + (i % 3) + '" x="' + j[0] + '" y="' + j[1] + '" width="' + j[2] + '" height="' + j[3] + '" rx="1"/>';
      }).join("") + "</svg>";
  }

  function svgAstro(astro) {
    if (astro === "lua") {
      return '<svg class="rr-astro" viewBox="0 0 40 40" aria-hidden="true" focusable="false">' +
        '<circle class="rr-astro-disco" cx="20" cy="20" r="15"/>' +
        '<path class="rr-lua" d="M24 7a13 13 0 1 0 9 22a11 11 0 1 1-9-22z"/>' +
        '<path class="rr-estrelinha" d="M10 10l1 2.4 2.4 1-2.4 1-1 2.4-1-2.4-2.4-1 2.4-1z"/></svg>';
    }
    var raios = "";
    for (var i = 0; i < 8; i++) {
      var a = i * Math.PI / 4, c = Math.cos(a), s = Math.sin(a);
      raios += "M" + (20 + c * 11).toFixed(1) + " " + (20 + s * 11).toFixed(1) + "L" + (20 + c * 16).toFixed(1) + " " + (20 + s * 16).toFixed(1);
    }
    return '<svg class="rr-astro" viewBox="0 0 40 40" aria-hidden="true" focusable="false">' +
      '<circle class="rr-astro-disco" cx="20" cy="20" r="17"/>' +
      '<path class="rr-sol-raios" d="' + raios + '"/><circle class="rr-sol" cx="20" cy="20" r="8"/></svg>';
  }

  function medalhao(p) {
    // no computador vai dentro da carta (selo na borda de baixo); no celular, no topo da trilha
    var lista = document.querySelector("#lista-blocos .mm-mapa") || document.getElementById("lista-blocos");
    if (!lista) return;
    var el = lista.querySelector(":scope > .rr-medalhao");
    document.querySelectorAll("#lista-blocos .rr-medalhao").forEach(function (m) { if (m !== el) m.remove(); });
    if (!el) {
      el = document.createElement("div");
      el.className = "rr-medalhao";
      el.setAttribute("role", "img");
      lista.insertBefore(el, lista.firstChild);
    }
    var info = PERIODOS[p], hora = horaTexto();
    // o clima do dia (clima.js), se existir, vai ao lado da hora
    var clima = null;
    try { clima = window.climaReino && typeof window.climaReino.hoje === "function" ? window.climaReino.hoje() : null; } catch (e) { clima = null; }
    var chave = p + "|" + hora + "|" + (clima ? clima.id : "");
    if (el.getAttribute("data-rr-chave") === chave) return;
    el.setAttribute("data-rr-chave", chave);
    el.setAttribute("aria-label", info.nome + " no reino, " + hora + (clima ? ", " + clima.nome.toLowerCase() : ""));
    el.innerHTML = svgAstro(info.astro) + '<span class="rr-medalhao-texto"><strong>' + info.nome + "</strong><span>" + hora +
      (clima ? ' · <span class="rr-clima">' + clima.icone + " " + clima.nome + "</span>" : "") + "</span></span>";
  }

  function veus() {
    if (!document.querySelector("body > .rr-veu-pagina")) {
      var v = document.createElement("div");
      v.className = "rr-veu-pagina";
      v.setAttribute("aria-hidden", "true");
      var fundo = document.getElementById("fundo-magico");
      if (fundo && fundo.parentNode === document.body) fundo.insertAdjacentElement("afterend", v);
      else document.body.insertBefore(v, document.body.firstChild);
    }
    // véu da carta: logo depois do terreno (fica por cima dele e por baixo dos reinos)
    document.querySelectorAll("#lista-blocos .mm-mapa > .mm-terreno").forEach(function (t) {
      var prox = t.nextElementSibling;
      if (prox && prox.classList.contains("rr-veu-carta")) return;
      var v = document.createElement("div");
      v.className = "rr-veu-carta";
      v.setAttribute("aria-hidden", "true");
      t.insertAdjacentElement("afterend", v);
    });
  }

  function janelas() {
    Object.keys(JANELAS).forEach(function (id) {
      document.querySelectorAll('#lista-blocos [data-bloco-id="' + id + '"] .mm-local').forEach(function (local) {
        if (local.querySelector(":scope > .rr-janelas")) return;
        var span = document.createElement("span");
        span.className = "rr-janelas";
        span.setAttribute("aria-hidden", "true");
        span.innerHTML = svgJanelas(id);
        local.appendChild(span);
      });
    });
  }

  function decorar() {
    var p = periodo();
    if (document.documentElement.getAttribute("data-hora-reino") !== p) document.documentElement.setAttribute("data-hora-reino", p);
    try { veus(); medalhao(p); janelas(); } catch (e) { /* enfeite: nunca derruba o mapa */ }
  }

  if (typeof aposRenderizarBlocos === "function") {
    var aposOriginal = aposRenderizarBlocos;
    aposRenderizarBlocos = function () {
      var resultado = aposOriginal.apply(this, arguments);
      try { decorar(); } catch (e) {}
      return resultado;
    };
  }
  decorar();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", decorar);
  setInterval(decorar, 60000);
  document.addEventListener("visibilitychange", function () { if (!document.hidden) decorar(); });

  window.relogioReino = {
    PERIODOS: PERIODOS, periodoDaHora: periodoDaHora, periodo: periodo, decorar: decorar,
    definir: function (p) { fixo = p && PERIODOS[p] ? p : null; decorar(); return periodo(); },
  };
})();
