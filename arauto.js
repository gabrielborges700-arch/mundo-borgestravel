/**
 * arauto.js — O ARAUTO DO REINO (etapa B1 do "Reino Vivo", 24/11/2026)
 * Usa o visual do pergaminho do clima (estilos/clima.css, classes cl-* e ar-*).
 * Carregar DEPOIS do clima.js.
 *
 * O QUE ELE FAZ
 *  Ao abrir o site num DIA NOVO (e só para quem já tem algum progresso), um
 *  pergaminho conta, com dados reais do save e nada inventado:
 *   - a grande tempestade, se passou hoje ou enquanto a pessoa esteve fora
 *     (o que caiu e o que resistiu; vem do clima.js);
 *   - quantos dias a pessoa ficou fora e como está a Chama do Forjador (🔥);
 *   - as obras em ruína que esperam reforma de graça;
 *   - o próximo passo (sugerirProximoPasso do jogo.js);
 *   - o clima de hoje e, se ainda vier, o dia da tempestade da semana.
 *  Um pergaminho por dia; se uma tempestade chega com o site aberto, ele
 *  aparece de novo só para ela.
 *
 * REGRAS
 *  - Nenhum arquivo antigo é alterado; só usa globais com typeof.
 *  - Chave nova: borgestravel_arauto { ultimaVisita, ultimoArauto }.
 *
 * PARA TESTES
 *  window.arautoReino: abrir(forcar), conteudo(), deveAbrir(), ATRASO (ms).
 */
(function () {
  "use strict";
  if (typeof document === "undefined") return;

  var CHAVE = "borgestravel_arauto";
  var C = function () { return window.climaReino || null; };

  function ler(chave) {
    if (typeof armazenamentoLer === "function") return armazenamentoLer(chave);
    try { return window.localStorage.getItem(chave); } catch (e) { return null; }
  }
  function gravar(chave, valor) {
    if (typeof armazenamentoGravar === "function") return armazenamentoGravar(chave, valor);
    try { window.localStorage.setItem(chave, valor); } catch (e) {}
  }
  function lerEstado() { try { var o = JSON.parse(ler(CHAVE) || "{}"); return o && typeof o === "object" ? o : {}; } catch (e) { return {}; } }
  function iso(d) {
    var m = String(d.getMonth() + 1), dia = String(d.getDate());
    return d.getFullYear() + "-" + (m.length < 2 ? "0" + m : m) + "-" + (dia.length < 2 ? "0" + dia : dia);
  }
  function deIso(t) { var p = String(t).split("-"); return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2])); }
  function diasEntre(a, b) { return Math.round((deIso(b) - deIso(a)) / 86400000); }
  function escapar(t) { return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

  function obras() { try { return window.obrasReino ? window.obrasReino.obterEstadoObras() : {}; } catch (e) { return {}; } }
  function temProgresso() {
    var lidas = 0;
    try { lidas = typeof obterRunasLidas === "function" ? obterRunasLidas().length : 0; } catch (e) {}
    return lidas > 0 || Object.keys(obras()).length > 0;
  }
  function nomeObra(id) { try { return window.obrasReino.OBRAS[id].nome; } catch (e) { return id; } }

  // ---------- o conteúdo (só dados reais) ----------
  function conteudo() {
    var hojeIso = iso(new Date()), est = lerEstado(), partes = [];
    var clima = C(), aviso = clima ? clima.avisoPendente() : null;
    // 1. a tempestade
    if (aviso && clima) partes.push('<section class="ar-secao ar-tempestade"><h3 class="ar-subtitulo">⛈️ A grande tempestade</h3>' + clima.htmlTempestade(aviso) + "</section>");
    // 2. dias fora e a Chama do Forjador
    var jogo = null;
    try { jogo = typeof obterEstadoJogo === "function" ? obterEstadoJogo() : null; } catch (e) { jogo = null; }
    var chama = jogo ? (jogo.streakDias || 0) : 0, recorde = jogo ? (jogo.streakRecorde || 0) : 0;
    var fora = est.ultimaVisita && est.ultimaVisita < hojeIso ? diasEntre(est.ultimaVisita, hojeIso) : null;
    var linhaFora;
    // a frase da Chama segue o número real do jogo.js (streakDias), não um palpite
    var acesa = "A Chama do Forjador segue acesa: <strong>" + chama + " dia" + (chama === 1 ? "" : "s") + " seguido" + (chama === 1 ? "" : "s") + "</strong> 🔥";
    var recomecou = "A Chama do Forjador recomeçou hoje" + (recorde > 1 ? " (o teu recorde é de " + recorde + " dias seguidos)" : "") + ". Volta amanhã para ela crescer 🔥";
    var inicio = fora === 1 ? "Estiveste no reino ontem. " : fora > 1 ? "Ficaste <strong>" + fora + " dias</strong> longe do reino. " : "";
    linhaFora = inicio + (chama > 1 ? acesa : recomecou);
    partes.push('<section class="ar-secao"><h3 class="ar-subtitulo">🗓️ Desde a tua última visita</h3><p>' + linhaFora + ".</p></section>");
    // 3. obras em ruína (as da tempestade já estão acima)
    var caidasAgora = aviso ? (aviso.caidas || []).map(function (c) { return c.id; }) : [];
    var o = obras(), ruinas = Object.keys(o).filter(function (id) { return o[id] && o[id].estado === "ferida" && caidasAgora.indexOf(id) < 0; });
    if (ruinas.length) {
      partes.push('<section class="ar-secao"><h3 class="ar-subtitulo">🧱 Obras esperando reforma</h3><ul class="cl-lista">' + ruinas.map(function (id) {
        var l = o[id].laudo || {};
        return '<li><span class="cl-nome">💥 ' + escapar(nomeObra(id)) + "</span>" +
          '<span class="cl-motivo">Interditada' + (l.nomeQueda ? ": caiu quando " + escapar(l.nomeQueda) : "") + "." + (l.runa ? " A runa " + escapar(l.runa) + " ensina a consertar." : "") + "</span>" +
          '<button type="button" class="btn-gotico cl-reformar" data-cl-reformar="' + escapar(id) + '">🔨 Reformar (de graça)</button></li>';
      }).join("") + "</ul></section>");
    }
    // 4. o próximo passo
    var passo = null;
    try { passo = typeof sugerirProximoPasso === "function" ? sugerirProximoPasso() : null; } catch (e) { passo = null; }
    if (passo && passo.texto) {
      partes.push('<section class="ar-secao"><h3 class="ar-subtitulo">🧭 O próximo passo</h3><p class="ar-passo"><span>' + escapar(passo.texto) + "</span>" +
        (typeof passo.acao === "function" ? '<button type="button" class="btn-gotico" id="ar-proximo">Ir agora</button>' : "") + "</p></section>");
    }
    // 5. o clima de hoje e a previsão da semana
    if (clima) {
      var h = clima.hoje(), t = clima.diaDaTempestade(new Date());
      var fracas = Object.keys(o).filter(function (id) { return o[id] && o[id].estado === "pe" && o[id].fraca; }).length;
      var linha = "Hoje: <strong>" + h.icone + " " + h.nome + "</strong>.";
      if (h.id === "tempestade" && !aviso) linha += " Hoje é o dia da grande tempestade.";
      else if (t > hojeIso) linha += " Os sábios do tempo preveem a grande tempestade da semana para <strong>" + escapar(clima.diaPorExtenso(t)) + "</strong>." +
        (fracas ? " Tens " + fracas + " obra" + (fracas === 1 ? "" : "s") + " com ressalva: reforça antes que ela chegue!" : "");
      else if (t < hojeIso) linha += " A tempestade desta semana já passou.";
      partes.push('<section class="ar-secao"><h3 class="ar-subtitulo">🌦️ O tempo no reino</h3><p>' + linha + "</p></section>");
    }
    return { html: partes.join(""), passo: passo, tempestade: !!aviso };
  }

  // ---------- quando abrir ----------
  function haOutraJanela() {
    return !!document.querySelector("#cl-aviso-overlay, #modal-obra-overlay, #modal-overlay, [role='dialog'][aria-modal='true']");
  }
  function deveAbrir() {
    if (!temProgresso()) return false;
    var est = lerEstado(), hojeIso = iso(new Date());
    var clima = C();
    return est.ultimoArauto !== hojeIso || !!(clima && clima.avisoPendente());
  }
  function abrir(forcar) {
    if (!forcar && !deveAbrir()) return false;
    if (haOutraJanela()) return false;
    var clima = C();
    var c = conteudo();
    var est = lerEstado(), hojeIso = iso(new Date());
    est.ultimoArauto = hojeIso;
    est.ultimaVisita = hojeIso;
    gravar(CHAVE, JSON.stringify(est));
    if (clima) clima.marcarVisto();
    var overlay = document.createElement("div");
    overlay.id = "cl-aviso-overlay"; // o mesmo do aviso do clima: Esc, clique fora e "Reformar" já funcionam
    overlay.className = "cl-overlay ar-overlay";
    overlay.innerHTML =
      '<div class="painel-leitura cl-aviso ar-pergaminho" role="dialog" aria-modal="true" aria-labelledby="ar-titulo">' +
        '<span class="cl-kicker">Pergaminho do reino · ' + escapar(hojeIso.split("-").reverse().join("/")) + "</span>" +
        '<h2 id="ar-titulo" class="font-display cl-titulo">📯 O Arauto do Reino</h2>' +
        '<p class="ar-abertura">' + (c.tempestade ? "Ouvi, ouvi! Notícias graves do reino:" : "Ouvi, ouvi! As notícias do reino:") + "</p>" +
        c.html +
        '<div class="cl-acoes"><button type="button" class="btn-gotico" id="cl-fechar">Fechar o pergaminho</button></div>' +
      "</div>";
    if (clima && typeof clima.ligarAviso === "function") clima.ligarAviso(overlay);
    else {
      document.body.appendChild(overlay);
      overlay.querySelector("#cl-fechar").addEventListener("click", function () { overlay.remove(); });
    }
    var botao = overlay.querySelector("#ar-proximo");
    if (botao && c.passo && typeof c.passo.acao === "function") {
      botao.addEventListener("click", function () {
        if (clima) clima.fecharAviso(); else overlay.remove();
        try { c.passo.acao(); } catch (e) {}
      });
    }
    return true;
  }

  // abre um pouco depois de carregar (o jogo.js já contou a visita do dia);
  // se outra janela estiver aberta, tenta de novo mais tarde
  var tentativas = 0;
  function tentar() {
    if (abrir(false) || !deveAbrir() || tentativas++ > 20) return;
    setTimeout(tentar, 4000);
  }
  var api = { ATRASO: 1600, abrir: abrir, conteudo: conteudo, deveAbrir: deveAbrir };
  window.arautoReino = api;
  function iniciar() { setTimeout(tentar, Number(api.ATRASO) || 0); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar); else iniciar();
  setInterval(function () { if (deveAbrir()) { tentativas = 0; tentar(); } }, 60000);
  document.addEventListener("visibilitychange", function () { if (!document.hidden && deveAbrir()) { tentativas = 0; tentar(); } });
})();
