/**
 * clima.js — O CLIMA DO DIA (etapa B1 do "Reino Vivo", 24/11/2026)
 * O visual fica em estilos/clima.css. Carregar DEPOIS do obras.js e do relogio.js.
 *
 * O QUE ELE FAZ
 *  - Sorteia o clima do dia PELA DATA (o mesmo dia dá o mesmo clima em
 *    qualquer aparelho): toda semana (segunda a domingo) tem exatamente UM
 *    dia de TEMPESTADE; nos outros, sol, vento, chuva ou neblina.
 *  - Vira <html data-clima-reino="sol|vento|chuva|neblina|tempestade">: o
 *    CSS desenha chuva, névoa e relâmpago no fundo e na carta (nunca sobre o
 *    texto) e o medalhão do relogio.js mostra o clima ao lado da hora.
 *  - Na tempestade, toda obra "de pé, com ressalva" CAI DE VERDADE (decisão
 *    do dono, 12/11) e vira ruína; a reforma na Mesa é de graça e, de pé de
 *    novo, ganha a placa de bronze. Poder Rúnico nunca diminui. Vale também
 *    para a tempestade que passou enquanto a pessoa esteve fora (decisão do
 *    dono, 24/11), contada a partir do último dia em que o site conferiu.
 *    O aviso vai no pergaminho do Arauto (arauto.js); sem ele, este arquivo
 *    mostra um pergaminho próprio.
 *
 * REGRAS
 *  - Nenhum arquivo antigo é alterado. Usa o save das obras
 *    (borgestravel_obras, mesmo formato) pelo wrapper do navegacao.js e
 *    guarda só o que já passou em borgestravel_clima:
 *    { ultimaVerificacao, ultimaTempestade: "AAAA-MM-DD",
 *      aviso: { dia, ausente, tempestades, caidas, resistiram, visto } }.
 *
 * PARA TESTES
 *  ?clima=tempestade (ou sol, vento, chuva, neblina) na URL fixa o clima; e
 *  window.climaReino: hoje(), climaDoDia(data), diaDaTempestade(data),
 *  tempestadesEntre(de, ate), aplicarTempestade(), htmlTempestade(aviso),
 *  mostrarAviso(), definir(id | null), CLIMAS.
 */
(function () {
  "use strict";
  if (typeof document === "undefined") return;

  var CHAVE = "borgestravel_clima";
  var CHAVE_OBRAS = "borgestravel_obras";
  var CLIMAS = {
    sol: { id: "sol", nome: "Sol", icone: "☀️" },
    vento: { id: "vento", nome: "Vento", icone: "💨" },
    chuva: { id: "chuva", nome: "Chuva", icone: "🌧️" },
    neblina: { id: "neblina", nome: "Neblina", icone: "🌫️" },
    tempestade: { id: "tempestade", nome: "Tempestade", icone: "⛈️" },
  };
  var fixo = null;
  try {
    var pedido = new URLSearchParams(window.location.search).get("clima");
    if (pedido && CLIMAS[pedido]) fixo = pedido;
  } catch (e) { /* navegador antigo: segue a data */ }

  // ---------- datas e sorteio (determinístico) ----------
  function iso(d) {
    var m = String(d.getMonth() + 1), dia = String(d.getDate());
    return d.getFullYear() + "-" + (m.length < 2 ? "0" + m : m) + "-" + (dia.length < 2 ? "0" + dia : dia);
  }
  function hash(texto) { // FNV-1a 32 bits
    var h = 2166136261;
    for (var i = 0; i < texto.length; i++) { h ^= texto.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    return h >>> 0;
  }
  function segundaDaSemana(d) {
    var s = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    s.setDate(s.getDate() - ((s.getDay() + 6) % 7));
    return s;
  }
  // o dia da tempestade da semana que contém a data
  function diaDaTempestade(d) {
    var seg = segundaDaSemana(d || new Date());
    var t = new Date(seg.getFullYear(), seg.getMonth(), seg.getDate() + hash("tempestade|" + iso(seg)) % 7);
    return iso(t);
  }
  function climaDoDia(d) {
    d = d || new Date();
    if (iso(d) === diaDaTempestade(d)) return CLIMAS.tempestade;
    var r = hash("clima|" + iso(d)) % 100;
    return r < 45 ? CLIMAS.sol : r < 65 ? CLIMAS.vento : r < 85 ? CLIMAS.chuva : CLIMAS.neblina;
  }
  function hoje() { return fixo ? CLIMAS[fixo] : climaDoDia(new Date()); }

  // ---------- armazenamento ----------
  function ler(chave) {
    if (typeof armazenamentoLer === "function") return armazenamentoLer(chave);
    try { return window.localStorage.getItem(chave); } catch (e) { return null; }
  }
  function gravar(chave, valor) {
    if (typeof armazenamentoGravar === "function") return armazenamentoGravar(chave, valor);
    try { window.localStorage.setItem(chave, valor); } catch (e) {}
  }
  function lerJSON(chave) {
    try { var o = JSON.parse(ler(chave) || "{}"); return o && typeof o === "object" ? o : {}; } catch (e) { return {}; }
  }
  function nomeObra(id) {
    try { return window.obrasReino.OBRAS[id].nome; } catch (e) { return id; }
  }

  // ---------- a tempestade derruba as obras com ressalva ----------
  function deIso(t) { var p = String(t).split("-"); return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2])); }
  // dias de tempestade depois de "de" (exclusive) até "ate" (inclusive), no máximo 120 dias
  function tempestadesEntre(de, ate) {
    var fim = deIso(ate), d = deIso(de), lista = [];
    for (var i = 0; i < 120; i++) {
      d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
      if (d > fim) break;
      if (iso(d) === diaDaTempestade(d)) lista.push(iso(d));
    }
    return lista;
  }
  function aplicarTempestade() {
    var hojeIso = iso(new Date());
    var clima = lerJSON(CHAVE);
    // tempestades que já passaram: a de hoje e, se a pessoa esteve fora, as desde a última conferência
    var passaram = clima.ultimaVerificacao && clima.ultimaVerificacao < hojeIso ? tempestadesEntre(clima.ultimaVerificacao, hojeIso) : [];
    if (hoje().id === "tempestade" && passaram.indexOf(hojeIso) < 0) passaram.push(hojeIso);
    passaram = passaram.filter(function (t) { return !clima.ultimaTempestade || t > clima.ultimaTempestade || (t === hojeIso && clima.ultimaTempestade !== hojeIso); });
    if (clima.ultimaVerificacao !== hojeIso) { clima.ultimaVerificacao = hojeIso; gravar(CHAVE, JSON.stringify(clima)); }
    if (!passaram.length) return clima.aviso || null;
    var dia = passaram[passaram.length - 1]; // a mais recente derruba (uma obra só cai uma vez)
    var obras = lerJSON(CHAVE_OBRAS);
    var caidas = [], resistiram = [];
    Object.keys(obras).forEach(function (id) {
      var o = obras[id];
      if (!o || o.estado !== "pe") return;
      if (o.fraca) {
        var laudo = o.laudo || {};
        caidas.push({ id: id, nome: nomeObra(id), fsMin: laudo.fsMin || null, runa: laudo.runa || "4.5" });
        o.estado = "ferida";
        o.fraca = false;
        o.quedas = (o.quedas || 0) + 1;
        o.laudo = {
          veredito: "ferida", custo: laudo.custo, fsMin: laudo.fsMin, runa: laudo.runa || "4.5",
          estagioQueda: null, tipoQueda: "tempestade", nomeQueda: "a grande tempestade passou pelo reino", ouroMotivo: laudo.ouroMotivo,
        };
        o.ouro = false;
        o.diaTempestade = dia;
      } else {
        resistiram.push({ id: id, nome: nomeObra(id) });
      }
    });
    if (caidas.length) gravar(CHAVE_OBRAS, JSON.stringify(obras));
    clima.ultimaTempestade = dia;
    clima.aviso = (caidas.length || resistiram.length) ? { dia: dia, ausente: dia < hojeIso, tempestades: passaram.length, caidas: caidas, resistiram: resistiram, visto: false } : null;
    gravar(CHAVE, JSON.stringify(clima));
    if (caidas.length && window.obrasReino && typeof window.obrasReino.decorar === "function") { try { window.obrasReino.decorar(); } catch (e) {} }
    return clima.aviso;
  }

  // ---------- o pergaminho de aviso ----------
  function escapar(t) { return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function fmt2(n) { try { return Number(n).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); } catch (e) { return String(n); } }
  var focoAnterior = null;
  function fecharAviso() {
    var o = document.getElementById("cl-aviso-overlay");
    if (!o) return;
    o.remove();
    document.removeEventListener("keydown", escAviso);
    if (focoAnterior && document.contains(focoAnterior) && typeof focoAnterior.focus === "function") { try { focoAnterior.focus(); } catch (e) {} }
    focoAnterior = null;
  }
  function escAviso(ev) { if (ev.key === "Escape") fecharAviso(); }
  function mostrarAviso(forcar) {
    var clima = lerJSON(CHAVE), aviso = clima.aviso;
    if (!aviso || (aviso.visto && !forcar) || document.getElementById("cl-aviso-overlay")) return false;
    aviso.visto = true;
    gravar(CHAVE, JSON.stringify(clima));
    var overlay = document.createElement("div");
    overlay.id = "cl-aviso-overlay";
    overlay.className = "cl-overlay";
    overlay.innerHTML =
      '<div class="painel-leitura cl-aviso" role="dialog" aria-modal="true" aria-labelledby="cl-aviso-titulo">' +
        '<span class="cl-kicker">Pergaminho do reino · ' + escapar(aviso.dia.split("-").reverse().join("/")) + "</span>" +
        '<h2 id="cl-aviso-titulo" class="font-display cl-titulo">⛈️ A grande tempestade passou</h2>' +
        htmlTempestade(aviso) +
        '<div class="cl-acoes"><button type="button" class="btn-gotico" id="cl-fechar">Fechar o pergaminho</button></div>' +
      "</div>";
    ligarAviso(overlay);
    return true;
  }
  var DIAS_SEMANA = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
  function diaPorExtenso(t) { var d = deIso(t); return DIAS_SEMANA[d.getDay()] + ", " + t.split("-").reverse().slice(0, 2).join("/"); }
  // o miolo do aviso da tempestade (também usado pelo Arauto)
  function htmlTempestade(aviso) {
    var caidas = aviso.caidas || [], resistiram = aviso.resistiram || [];
    var quando = aviso.ausente ? "Enquanto estiveste fora, a grande tempestade passou pelo reino " + (/^(domingo|sábado)/.test(diaPorExtenso(aviso.dia)) ? "no " : "na ") + escapar(diaPorExtenso(aviso.dia)) + (aviso.tempestades > 1 ? " (e já era a " + aviso.tempestades + "ª desde a tua última visita)" : "") + ". " : "";
    return (caidas.length
          ? "<p>" + quando + "O vento uivou a noite inteira e a chuva castigou as obras. " + (caidas.length === 1 ? "Uma obra que estava <strong>com ressalva</strong> não resistiu:" : "As obras que estavam <strong>com ressalva</strong> não resistiram:") + "</p>" +
            '<ul class="cl-lista">' + caidas.map(function (c) {
              return '<li><span class="cl-nome">💥 ' + escapar(c.nome) + "</span>" +
                '<span class="cl-motivo">' + (c.fsMin ? "Folga pequena: fator de segurança " + fmt2(c.fsMin) + ", abaixo de 1,50." : "Estava de pé, mas com uma ressalva no laudo.") + " A runa " + escapar(c.runa) + " ensina a consertar.</span>" +
                '<button type="button" class="btn-gotico cl-reformar" data-cl-reformar="' + escapar(c.id) + '">🔨 Reformar (de graça)</button></li>';
            }).join("") + "</ul>"
          : "<p>" + quando + "O vento uivou a noite inteira, mas <strong>nenhuma obra caiu</strong>: quem calcula com folga dorme tranquilo.</p>") +
        (resistiram.length ? '<p class="cl-resistiram">🏰 Resistiram: ' + resistiram.map(function (r) { return escapar(r.nome); }).join(", ") + ".</p>" : "") +
        '<p class="cl-licao">Por isso o engenheiro pede fator de segurança de pelo menos 1,5: a tempestade que ninguém previu sempre chega (runa 4.5).</p>';
  }
  // liga os botões de um pergaminho já montado (o do clima ou o do Arauto)
  function ligarAviso(overlay) {
    focoAnterior = document.activeElement;
    document.body.appendChild(overlay);
    overlay.addEventListener("click", function (ev) {
      if (ev.target === overlay) return fecharAviso();
      var ref = ev.target.closest ? ev.target.closest("[data-cl-reformar]") : null;
      if (ref) {
        var id = ref.getAttribute("data-cl-reformar");
        fecharAviso();
        if (window.obrasReino && typeof window.obrasReino.abrirModalObra === "function") window.obrasReino.abrirModalObra(id);
      }
    });
    overlay.querySelector("#cl-fechar").addEventListener("click", fecharAviso);
    document.addEventListener("keydown", escAviso);
    var primeiro = overlay.querySelector(".cl-reformar") || overlay.querySelector("#cl-fechar");
    if (primeiro && typeof primeiro.focus === "function") primeiro.focus();
  }
  function marcarVisto() {
    var clima = lerJSON(CHAVE);
    if (clima.aviso && !clima.aviso.visto) { clima.aviso.visto = true; gravar(CHAVE, JSON.stringify(clima)); }
  }
  function avisoPendente() { var a = lerJSON(CHAVE).aviso; return a && !a.visto ? a : null; }

  // ---------- montar ----------
  var avisoAgendado = false;
  function decorar() {
    var c = hoje();
    if (document.documentElement.getAttribute("data-clima-reino") !== c.id) document.documentElement.setAttribute("data-clima-reino", c.id);
    var aviso = null;
    try { aviso = aplicarTempestade(); } catch (e) { aviso = null; }
    if (window.relogioReino && typeof window.relogioReino.decorar === "function") { try { window.relogioReino.decorar(); } catch (e) {} }
    if (aviso && !aviso.visto && !avisoAgendado) {
      avisoAgendado = true;
      setTimeout(function () {
        avisoAgendado = false;
        if (window.arautoReino && typeof window.arautoReino.abrir === "function") return; // o Arauto mostra
        try { mostrarAviso(); } catch (e) {}
      }, 1200);
    }
  }

  decorar();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", decorar);
  setInterval(decorar, 60000);
  document.addEventListener("visibilitychange", function () { if (!document.hidden) decorar(); });

  window.climaReino = {
    CLIMAS: CLIMAS, hoje: hoje, climaDoDia: climaDoDia, diaDaTempestade: diaDaTempestade,
    tempestadesEntre: tempestadesEntre, aplicarTempestade: aplicarTempestade, htmlTempestade: htmlTempestade, ligarAviso: ligarAviso,
    avisoPendente: avisoPendente, marcarVisto: marcarVisto, diaPorExtenso: diaPorExtenso, iso: iso,
    mostrarAviso: mostrarAviso, fecharAviso: fecharAviso, decorar: decorar,
    definir: function (id) { fixo = id && CLIMAS[id] ? id : null; decorar(); return hoje().id; },
  };
})();
