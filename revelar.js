/**
 * revelar.js — REDESIGN, ETAPA 3 de 3: "vida no mapa" (as animações que
 * precisam de JavaScript). As animações que são só CSS ficam no
 * estilos/pergaminho-3-animacoes.css.
 *
 * O QUE ELE FAZ
 *  1. "Aparecer ao rolar": os quadros dos reinos (e as placas do mapa no
 *     computador, uma a uma na ordem da trilha), a galeria, o castelo e o
 *     rodapé surgem suavemente quando entram na tela. O que já apareceu fica
 *     guardado numa lista na memória: quando o app.js redesenha os reinos
 *     (toda runa lida, todo abrir/fechar), nada some nem pisca de novo.
 *  2. "Distribuir as cartas": só quando um reino ABRE, as cartas entram em
 *     cascata. Ler runa ou favoritar não repete.
 *  3. A fita dourada do reino completo brilha UMA vez (quando a placa aparece).
 *
 * SEGURANÇA (nada pode ficar invisível)
 *  - Sai sem fazer NADA se o navegador não tiver IntersectionObserver (o
 *    teste automático, navegadores muito velhos) ou se o aparelho pedir
 *    "menos movimento". O estado escondido só existe com a classe
 *    "revelar-ativo" no <html>, que é este arquivo que põe.
 *  - Rede de segurança: 3 s depois de cada desenho, o que ainda estiver
 *    esperando E já estiver dentro da tela aparece (ou TUDO aparece, se o
 *    observador nunca respondeu).
 *  - Se o foco do teclado cair num quadro escondido, ele aparece na hora.
 *
 * Sem bibliotecas e sem "module": funciona abrindo o index.html direto.
 * Carregar DEPOIS do horizonte.js: encadeia aposRenderizarBlocos sem
 * substituir os invólucros do cadeados.js, painel-reino.js e horizonte.js.
 * Nenhum outro .js do site é editado.
 *
 * EXTRAS (o dono ainda pode vetar): estrela cadente rara e faíscas ao
 * completar um reino. Ficam no fim, na seção "EXTRAS"; para tirar, apague
 * aquela seção (e a do CSS com o mesmo nome).
 */
(function () {
  "use strict";

  function combina(consulta) {
    try { return !!(window.matchMedia && window.matchMedia(consulta).matches); } catch (e) { return false; }
  }
  if (!("IntersectionObserver" in window) || typeof Set === "undefined") return;
  if (combina("(prefers-reduced-motion: reduce)")) return;

  var raiz = document.documentElement;
  var ativo = true;
  raiz.classList.add("revelar-ativo");

  var ESPERANDO = "revelar-pendente";
  var jaApareceram = new Set();   // ids (data-bloco-id) dos quadros que já surgiram nesta visita
  var esperando = new Set();      // elementos ainda escondidos, esperando entrar na tela
  var cartasAntes = new Set();    // 1ª runa de cada lista de cartas visível no desenho anterior
  var completosAntes = null;      // reinos completos no desenho anterior (null = 1º desenho)
  var celebrarDepois = [];        // reinos completados com uma janela aberta por cima
  var observadorRespondeu = false;
  var portalAte = 0;              // até quando (relógio da página) dura o portal de abertura
  var timerRede = null;

  function agora() { return (window.performance && performance.now) ? performance.now() : Date.now(); }
  function portalNaTela() { return !!document.querySelector(".portal-magico:not(.portal-reduzido)"); }

  // ---------- 1. Aparecer ao rolar ----------
  var observador = new IntersectionObserver(function (entradas) {
    observadorRespondeu = true;
    var lote = [];
    entradas.forEach(function (e) {
      if (e.isIntersecting && e.target.classList.contains(ESPERANDO)) lote.push(e.target);
    });
    // ordem do documento = ordem da trilha do mapa (0 → 6 e a Ilha por último)
    lote.sort(function (a, b) { return a.compareDocumentPosition(b) & 4 ? -1 : 1; });
    var base = Math.max(0, portalAte - agora()); // as placas esperam o portal de abertura acabar
    lote.forEach(function (el, i) { revelar(el, base + Math.min(i * 90, 720)); });
  }, { rootMargin: "0px 0px -6% 0px", threshold: 0 });

  function esperar(el, desliza) {
    if (!el || el.classList.contains(ESPERANDO)) return;
    el.classList.add(ESPERANDO);
    if (desliza) el.classList.add("revelar-desliza");
    esperando.add(el);
    observador.observe(el);
  }

  function revelar(el, atraso) {
    observador.unobserve(el);
    esperando.delete(el);
    if (!el.classList.contains(ESPERANDO)) return;
    var id = el.getAttribute("data-bloco-id");
    if (id) jaApareceram.add(id);
    var classe = el.classList.contains("revelar-desliza") ? "revelar-deslizando" : "revelar-surgindo";
    el.style.setProperty("--revelar-atraso", Math.round(atraso) + "ms");
    el.classList.remove(ESPERANDO);
    el.classList.add(classe);
    // placa de reino completo: a fita dourada brilha 1 vez, logo depois de surgir
    if (id && el.classList.contains("estado-completo")) brilharFita(el, atraso + 350);
    el.addEventListener("animationend", function fim(ev) {
      if (ev.target !== el || ev.pseudoElement) return;
      el.removeEventListener("animationend", fim);
      el.classList.remove(classe);
    });
  }

  function brilharFita(el, atraso) {
    el.style.setProperty("--fita-atraso", Math.round(atraso || 0) + "ms");
    el.classList.add("revelar-fita-brilho");
  }

  // Rede de segurança (ver o cabeçalho)
  function agendarRede() {
    clearTimeout(timerRede);
    timerRede = setTimeout(function () {
      var altura = window.innerHeight || raiz.clientHeight;
      esperando.forEach(function (el) {
        if (!el.isConnected) { observador.unobserve(el); esperando.delete(el); return; }
        var r = el.getBoundingClientRect();
        if (!observadorRespondeu || (r.bottom > 0 && r.top < altura)) revelar(el, 0);
      });
    }, 3000);
  }

  // Teclado: um quadro escondido que recebe o foco aparece na hora
  document.addEventListener("focusin", function (ev) {
    var alvo = ev.target && ev.target.closest ? ev.target.closest("." + ESPERANDO) : null;
    if (alvo) revelar(alvo, 0);
  }, true);

  // ---------- 2. A cada desenho dos reinos (app.js → aposRenderizarBlocos) ----------
  function aoDesenhar() {
    if (!ativo) return;
    var lista = document.getElementById("lista-blocos");
    if (!lista) return;
    if (completosAntes === null && portalNaTela()) portalAte = agora() + 850; // 1º desenho

    // Quadros: só opacidade (mexer na posição estragaria a conta de rolagem do irParaBloco)
    lista.querySelectorAll("[data-bloco-id]").forEach(function (el) {
      if (!jaApareceram.has(el.getAttribute("data-bloco-id"))) esperar(el, false);
    });
    esperando.forEach(function (el) {
      if (!el.isConnected) { observador.unobserve(el); esperando.delete(el); }
    });

    distribuirCartas(lista);
    conferirReinosCompletos();
    agendarRede();
  }

  // Cartas: a "chave" de uma lista aberta é a 1ª runa dela (vale no acordeão e no mapa).
  // Chave nova = reino que ACABOU de abrir → cascata de 40 ms por carta (no máximo 600 ms).
  // A cascata é só animação (sem quadro final): a carta lida termina nos 0,7 que o app.js escreve.
  function distribuirCartas(lista) {
    var abertasAgora = new Set();
    var base = portalNaTela() ? 350 : 0; // com o portal na frente, começa quando o véu clareia
    lista.querySelectorAll(".lista-runas").forEach(function (grade) {
      if (grade.style.display === "none") return;
      var cartas = grade.querySelectorAll(".espada-card");
      var numero = cartas.length ? cartas[0].querySelector(".runa-numero") : null;
      var chave = numero ? numero.textContent.trim() : "";
      if (!chave) return;
      abertasAgora.add(chave);
      if (cartasAntes.has(chave)) return;
      for (var i = 0; i < cartas.length; i++) {
        cartas[i].style.setProperty("--carta-atraso", (base + Math.min(i * 40, 600)) + "ms");
        cartas[i].classList.add("revelar-carta");
      }
      var painel = grade.closest(".painel-runas-aberto");
      if (painel) painel.classList.add("revelar-abrindo");
    });
    cartasAntes = abertasAgora;
  }

  // Encadeia sem substituir os outros invólucros; um erro aqui nunca derruba o jogo
  if (typeof aposRenderizarBlocos === "function") {
    var aposRenderizarBlocosSemRevelar = aposRenderizarBlocos;
    aposRenderizarBlocos = function () {
      aposRenderizarBlocosSemRevelar.apply(this, arguments);
      try { aoDesenhar(); } catch (erro) {}
    };
  }

  // Galeria e rodapé já existem; o castelo nasce no DOMContentLoaded do horizonte.js (antes deste)
  esperar(document.getElementById("galeria-conquistas"), true);
  esperar(document.querySelector("body > footer"), true);
  document.addEventListener("DOMContentLoaded", function () {
    if (!ativo) return;
    esperar(document.querySelector(".horizonte-reino"), true);
    agendarRede();
    agendarEstrelaCadente();
  });

  // Se a pessoa ligar "menos movimento" com a página aberta: tudo aparece e para
  function desligar() {
    if (!combina("(prefers-reduced-motion: reduce)")) return;
    ativo = false;
    esperando.forEach(function (el) { observador.unobserve(el); el.classList.remove(ESPERANDO); });
    esperando.clear();
    raiz.classList.remove("revelar-ativo");
  }
  try {
    var consultaReduzir = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (consultaReduzir.addEventListener) consultaReduzir.addEventListener("change", desligar);
    else if (consultaReduzir.addListener) consultaReduzir.addListener(desligar);
  } catch (e) {}

  // =====================================================================
  // EXTRAS (o dono pode vetar): apagar daqui até o fim do arquivo, menos
  // o "})();" da última linha, e a seção EXTRAS do pergaminho-3. Apague
  // também as 2 chamadas lá em cima: conferirReinosCompletos() e
  // agendarEstrelaCadente().
  // =====================================================================

  // (c) Faíscas douradas quando a criança COMPLETA um reino nesta visita.
  // O 1º desenho só anota o que já estava completo (nada estoura ao carregar).
  // Como a última runa é lida com a janela aberta, o estouro espera ela fechar.
  function reinosCompletos() {
    var feitos = new Set();
    var lidas = typeof obterRunasLidas === "function" ? obterRunasLidas() : [];
    if (typeof reinosDados !== "undefined") reinosDados.forEach(function (b) {
      if (b.subtemas.length && b.subtemas.every(function (st) { return lidas.indexOf(st.id) >= 0; })) feitos.add(b.id);
    });
    if (typeof ilhaAmaldicoada !== "undefined" && typeof calcularProgressoIlha === "function" &&
        calcularProgressoIlha().completo) feitos.add(ilhaAmaldicoada.id);
    return feitos;
  }

  function conferirReinosCompletos() {
    var feitos = reinosCompletos();
    if (completosAntes) feitos.forEach(function (id) {
      if (!completosAntes.has(id) && celebrarDepois.indexOf(id) < 0) celebrarDepois.push(id);
    });
    completosAntes = feitos;
    // o app.js redesenha ANTES de abrir a janela da runa: espera ela existir
    if (celebrarDepois.length) setTimeout(tentarCelebrar, 80);
  }

  function janelaAberta() {
    return !!document.querySelector('#modal-overlay, [id^="modal-"][id$="-overlay"], .cronica-overlay, .portal-magico');
  }

  function tentarCelebrar() {
    if (!ativo || !celebrarDepois.length || janelaAberta()) return;
    var ids = celebrarDepois;
    celebrarDepois = [];
    ids.forEach(function (id) {
      var el = document.querySelector('#lista-blocos [data-bloco-id="' + id + '"]');
      if (!el) return;
      if (el.classList.contains("estado-completo")) brilharFita(el, 120);
      estourarFaiscas(el);
    });
  }

  // As janelas (modais) são filhas diretas do <body>: quando uma sai, tenta de novo
  new MutationObserver(function () { if (celebrarDepois.length) tentarCelebrar(); })
    .observe(document.body, { childList: true });

  function estourarFaiscas(el) {
    var r = el.getBoundingClientRect();
    var estouro = document.createElement("div");
    estouro.className = "revelar-faiscas";
    estouro.setAttribute("aria-hidden", "true");
    estouro.style.left = Math.round(r.left + r.width / 2 + window.pageXOffset) + "px";
    estouro.style.top = Math.round(r.top + window.pageYOffset + 6) + "px";
    var html = '<span class="revelar-faiscas-anel booms-faisca"></span>';
    for (var i = 0; i < 12; i++) {
      html += '<span class="revelar-faisca" style="--angulo:' + (i * 30 + 8) + "deg; --distancia:" + (30 + (i % 3) * 12) + 'px"></span>';
    }
    estouro.innerHTML = html;
    document.body.appendChild(estouro);
    setTimeout(function () { if (estouro.parentNode) estouro.parentNode.removeChild(estouro); }, 1200);
  }

  // (a) Estrela cadente RARA no céu do pergaminho: só de 768 px para cima,
  // no máximo 1 a cada 45–60 s, só opacidade + deslocamento, num único
  // elemento (aria-hidden) dentro do #fundo-magico. Aba escondida = não cai.
  var estrela = null;
  function agendarEstrelaCadente() {
    setTimeout(soltarEstrelaCadente, 45000 + Math.random() * 15000);
  }
  function soltarEstrelaCadente() {
    if (!ativo) return;
    var fundo = document.getElementById("fundo-magico");
    if (fundo && !document.hidden && combina("(min-width: 768px)") && !janelaAberta()) {
      if (!estrela) {
        estrela = document.createElement("div");
        estrela.className = "revelar-estrela-cadente";
        estrela.setAttribute("aria-hidden", "true");
        fundo.appendChild(estrela);
      }
      estrela.classList.remove("cair");
      estrela.style.top = (6 + Math.random() * 30).toFixed(1) + "%";
      estrela.style.left = (35 + Math.random() * 55).toFixed(1) + "%";
      void estrela.offsetWidth; // recomeça a animação do zero
      estrela.classList.add("cair");
    }
    agendarEstrelaCadente();
  }
})();
