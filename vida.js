/**
 * vida.js — "VIDA NO MAPA": as 20 animações que deixam o site menos parado
 * (o visual e o movimento delas estão no estilos/vida.css).
 *
 * O QUE ELE FAZ (os números são os da lista de ideias aprovada pelo dono)
 *  Mapa vivo:  1 nuvens de tinta · 2 rosa-dos-ventos girando (balança ao
 *              rolar) · 3 lua que espia · 4 serpente nadando e barquinho ·
 *              5 corvos sobre o castelo · 6 bandeiras tremulando
 *  Toque:      7 placas e cartas afundam e soltam poeira · 8 carimbo de cera
 *              na runa lida + barra de XP enchendo · 9 gema do próximo reino
 *              chamando · 10 título da runa "escrito à mão" · 11 contadores
 *              que sobem número por número
 *  Personagens: 12 Mago vivo (brilho, dicas, comemora) · 13 guardiões
 *              falando letra por letra · 14 vilões respirando
 *  Progresso:  15 trilha do mapa em tinta dourada · 16 cena de subir de
 *              nível · 17 vitral acendendo com luz · 18 Julgamento comemorado
 *  Navegação:  19 virar a página na Crônica · 20 "pouso" no reino da gema
 *
 * REGRAS SEGUIDAS
 *  - Nenhum .js existente é editado: este arquivo encadeia funções do jogo
 *    (abrirModalRuna, fecharModalRuna, irParaBloco, mostrarToast...), do
 *    mesmo jeito do painel-reino.js e do revelar.js.
 *  - Só se anima transparência e as propriedades translate/rotate/scale
 *    (nunca o "transform" que o JavaScript do jogo usa).
 *  - Quem pediu "menos movimento" no aparelho: nada se mexe. As dicas do
 *    Mago e o aviso de novo título continuam, só que parados.
 *  - Sem IntersectionObserver (o teste automático, navegador muito velho)
 *    este arquivo não faz nada.
 */
(function () {
  "use strict";
  if (!("IntersectionObserver" in window) || typeof Set === "undefined") return;

  function combina(consulta) {
    try { return !!(window.matchMedia && window.matchMedia(consulta).matches); } catch (e) { return false; }
  }
  var movimento = !combina("(prefers-reduced-motion: reduce)");
  var raiz = document.documentElement;
  if (movimento) raiz.classList.add("vida-ativa");

  function janelaAberta() {
    return !!document.querySelector('#modal-overlay, [id^="modal-"][id$="-overlay"], .cronica-overlay, .portal-magico, .vida-nivel');
  }
  // Encadeia uma função global do jogo sem substituir os outros encadeamentos
  function encadear(nome, depois, antes) {
    var original = window[nome];
    if (typeof original !== "function") return;
    window[nome] = function () {
      var dado;
      try { if (antes) dado = antes.apply(this, arguments); } catch (e) {}
      var resultado = original.apply(this, arguments);
      try { if (depois) depois.call(this, arguments, dado); } catch (e) {}
      return resultado;
    };
  }
  function criar(tag, classe, pai, html) {
    var el = document.createElement(tag);
    el.className = classe;
    el.setAttribute("aria-hidden", "true");
    if (html) el.innerHTML = html;
    if (pai) pai.appendChild(el);
    return el;
  }
  function animarUmaVez(el, classe, ms) {
    if (!el) return;
    el.classList.remove(classe);
    void el.offsetWidth;
    el.classList.add(classe);
    setTimeout(function () { el.classList.remove(classe); }, ms || 1500);
  }

  // =====================================================================
  // 1, 2, 4. Céu do mapa: nuvens, rosa-dos-ventos, serpente e barquinho
  // A rosa e a serpente PARADAS da etapa 2 são trocadas pelas que se mexem
  // (o CSS só faz a troca quando a classe "vida-ceu" existe).
  // =====================================================================
  var rosaFora = null;
  function montarCeu() {
    var ceu = document.getElementById("fundo-magico");
    if (!ceu || !movimento) return;
    for (var i = 1; i <= 3; i++) criar("div", "vida-nuvem vida-nuvem-" + i, ceu);
    rosaFora = criar("div", "vida-rosa", ceu, '<div class="vida-rosa-desenho"></div>');
    criar("div", "vida-serpente", ceu);
    criar("div", "vida-barco", ceu);
    ceu.classList.add("vida-ceu");

    // A rosa balança para o lado em que a página rola (e volta devagar)
    var ultimoY = window.pageYOffset, pendente = false, volta = null;
    window.addEventListener("scroll", function () {
      if (pendente) return;
      pendente = true;
      requestAnimationFrame(function () {
        pendente = false;
        var y = window.pageYOffset;
        var giro = Math.max(-18, Math.min(18, (y - ultimoY) * 0.5));
        ultimoY = y;
        rosaFora.style.setProperty("--vida-giro", giro.toFixed(1) + "deg");
        clearTimeout(volta);
        volta = setTimeout(function () { rosaFora.style.setProperty("--vida-giro", "0deg"); }, 160);
      });
    }, { passive: true });
  }

  // =====================================================================
  // 5. Corvos de tinta voando sobre o castelo (só com o castelo na tela)
  // =====================================================================
  function montarCorvos() {
    var cena = document.querySelector(".horizonte-cena");
    if (!cena || !movimento) return;
    var bando = criar("div", "vida-corvos", cena,
      '<span class="vida-corvo"></span><span class="vida-corvo"></span><span class="vida-corvo"></span>');
    var visivel = false, timer = null;
    function voar() {
      clearTimeout(timer);
      if (!visivel || document.hidden) return;
      bando.classList.remove("voando");
      void bando.offsetWidth;
      bando.classList.add("voando");
      timer = setTimeout(voar, 24000 + Math.random() * 12000);
    }
    bando.addEventListener("animationend", function (ev) { if (ev.target === bando) bando.classList.remove("voando"); });
    new IntersectionObserver(function (entradas) {
      var agora = entradas[0].isIntersecting;
      if (agora && !visivel) { visivel = true; clearTimeout(timer); timer = setTimeout(voar, 1500); }
      if (!agora) { visivel = false; clearTimeout(timer); }
    }, { threshold: 0.2 }).observe(cena);
  }

  // =====================================================================
  // 7. Toque: poeirinha onde a criança toca (placas, cartas, gemas, quadros)
  // =====================================================================
  var ultimaPoeira = 0;
  function soltarPoeira(x, y) {
    var agora = Date.now();
    if (agora - ultimaPoeira < 120) return;
    ultimaPoeira = agora;
    var nuvem = criar("div", "vida-poeira", document.body);
    nuvem.style.left = x + "px";
    nuvem.style.top = y + "px";
    for (var i = 0; i < 7; i++) {
      var grao = document.createElement("span");
      var angulo = (i / 7) * Math.PI * 2 + Math.random() * 0.6;
      var dist = 14 + Math.random() * 14;
      grao.style.setProperty("--dx", Math.round(Math.cos(angulo) * dist) + "px");
      grao.style.setProperty("--dy", Math.round(Math.sin(angulo) * dist - 6) + "px");
      nuvem.appendChild(grao);
    }
    setTimeout(function () { if (nuvem.parentNode) nuvem.parentNode.removeChild(nuvem); }, 700);
  }
  if (movimento) {
    document.addEventListener("pointerdown", function (ev) {
      var alvo = ev.target && ev.target.closest ? ev.target.closest(".btn-gotico, .espada-card, .botao-bloco-nav, .tile-cabecalho, .cabecalho-bloco, .atlas-ponto") : null;
      if (alvo) soltarPoeira(ev.clientX, ev.clientY);
    }, { passive: true });
  }

  // =====================================================================
  // 8. Carimbo de cera: quando a janela de uma runa NOVA fecha, o ✓ da
  //    carta "bate" como um carimbo
  // 10. Título da runa escrito à mão quando a janela abre
  // =====================================================================
  var carimboPendente = null;
  function runaJaLida(id) {
    try {
      if (/^E\./.test(id)) return typeof runaNegraFoiLida === "function" && runaNegraFoiLida(id);
      return typeof obterRunasLidas === "function" && obterRunasLidas().indexOf(id) >= 0;
    } catch (e) { return true; }
  }
  function aposAbrirRuna(args, eraNova) {
    var id = args[0];
    if (eraNova) carimboPendente = id;
    var titulo = document.querySelector("#modal-overlay .painel-leitura > h2");
    if (titulo && movimento) animarUmaVez(titulo, "vida-escrever", 1200);
  }
  encadear("abrirModalRuna", aposAbrirRuna, function (id) { return !runaJaLida(id); });
  encadear("abrirModalRunaNegra", aposAbrirRuna, function (id) { return !runaJaLida(id); });
  encadear("fecharModalRuna", function (args, havia) {
    if (!havia || !carimboPendente) return;
    var id = carimboPendente;
    carimboPendente = null;
    if (!movimento) return;
    setTimeout(function () {
      var cartas = document.querySelectorAll("#lista-blocos .espada-card");
      for (var i = 0; i < cartas.length; i++) {
        var numero = cartas[i].querySelector(".runa-numero");
        if (!numero || numero.textContent.trim() !== id) continue;
        var check = cartas[i].querySelector('span[title="Já lida"], span[title="Já explorada"]');
        animarUmaVez(cartas[i], "vida-carimbada", 1000);
        if (check) animarUmaVez(check, "vida-carimbo", 1000);
        break;
      }
    }, 60);
  }, function () { return !!document.getElementById("modal-overlay"); });

  // =====================================================================
  // 8, 11, 16. Números que sobem um por um (contador de runas e Poder
  // Rúnico), barra de XP que enche com brilho e a cena do novo título
  // =====================================================================
  function contadorVivo(el, regex, aoMudar) {
    if (!el) return;
    var ultimoNumero = numeroDe(el.textContent);
    var nossoTexto = null, quadro = null;
    function numeroDe(texto) { var m = regex.exec(texto); return m ? parseInt(m[1], 10) : null; }
    new MutationObserver(function () {
      var final = el.textContent;
      if (final === nossoTexto) return; // fomos nós que escrevemos
      var para = numeroDe(final);
      var de = ultimoNumero;
      ultimoNumero = para;
      if (aoMudar) aoMudar(final);
      cancelAnimationFrame(quadro);
      if (!movimento || de === null || para === null || para <= de) return;
      var inicio = performance.now(), dur = Math.min(900, 300 + (para - de) * 20);
      el.classList.remove("vida-rolar"); void el.offsetWidth; el.classList.add("vida-rolar");
      (function passo(t) {
        var p = Math.min(1, (t - inicio) / dur);
        var n = Math.round(de + (para - de) * (1 - Math.pow(1 - p, 3)));
        nossoTexto = p < 1 ? final.replace(regex, function (todo, num) { return todo.replace(num, String(n)); }) : final;
        if (el.textContent !== nossoTexto) el.textContent = nossoTexto;
        if (p < 1) quadro = requestAnimationFrame(passo);
      })(inicio);
    }).observe(el, { childList: true, characterData: true, subtree: true });
  }

  // 16. Cena de novo título (espera a janela aberta fechar)
  var nivelAtual = null, cenaPendente = null;
  function lerNivel(texto) { var m = /Nv\.(\d+)\s+(.+?)\s+—/.exec(texto); return m ? { n: parseInt(m[1], 10), nome: m[2] } : null; }
  function aoMudarXP(texto) {
    var barra = document.getElementById("xp-barra-preenchida");
    if (barra && movimento) animarUmaVez(barra, "vida-brilho", 1200);
    var nivel = lerNivel(texto);
    if (!nivel) return;
    if (nivelAtual !== null && nivel.n > nivelAtual) { cenaPendente = nivel; tentarCena(); }
    nivelAtual = nivel.n;
  }
  function tentarCena() {
    if (!cenaPendente || janelaAberta()) return;
    var nivel = cenaPendente;
    cenaPendente = null;
    var cena = document.createElement("div");
    cena.className = "vida-nivel";
    cena.setAttribute("role", "status");
    cena.setAttribute("aria-live", "polite");
    cena.innerHTML =
      '<div class="vida-nivel-pergaminho">' +
        '<p class="vida-nivel-titulo">⭐ Novo título! ⭐</p>' +
        '<p class="vida-nivel-nome">Nv.' + nivel.n + ' — ' + nivel.nome + '</p>' +
        '<p class="vida-nivel-dica">Toque para continuar</p>' +
      '</div>';
    document.body.appendChild(cena);
    if (movimento) chuvaDeFolhas(cena, 16);
    function fechar() { if (cena.parentNode) cena.parentNode.removeChild(cena); tentarCena(); }
    cena.addEventListener("click", fechar);
    setTimeout(fechar, 4200);
  }
  // As janelas são filhas do <body>: quando uma fecha, tenta mostrar o que estava esperando
  new MutationObserver(function () { if (cenaPendente) tentarCena(); }).observe(document.body, { childList: true });

  function chuvaDeFolhas(pai, quantas) {
    var caixa = criar("div", "vida-folhas", pai);
    for (var i = 0; i < quantas; i++) {
      var folha = document.createElement("span");
      folha.style.setProperty("--x", Math.round(Math.random() * 100) + "%");
      folha.style.setProperty("--atraso", Math.round(Math.random() * 700) + "ms");
      folha.style.setProperty("--giro", Math.round(180 + Math.random() * 360) + "deg");
      folha.style.setProperty("--lado", Math.round(Math.random() * 60 - 30) + "px");
      caixa.appendChild(folha);
    }
    setTimeout(function () { if (caixa.parentNode) caixa.parentNode.removeChild(caixa); }, 3200);
  }

  // =====================================================================
  // 9. A gema do PRÓXIMO reino a explorar chama a atenção (só ela)
  // 13. Guardiões falando letra por letra (cada fala nova, uma vez)
  // 15. Trilha do mapa em tinta dourada entre os reinos conquistados
  // =====================================================================
  function proximoReino() {
    try {
      var lidas = obterRunasLidas();
      for (var i = 0; i < reinosDados.length; i++) {
        var b = reinosDados[i];
        if (b.subtemas.some(function (st) { return lidas.indexOf(st.id) < 0; })) return b.id;
      }
      if (typeof calcularProgressoIlha === "function" && !calcularProgressoIlha().completo) return ilhaAmaldicoada.id;
    } catch (e) {}
    return null;
  }
  function marcarGema() {
    var alvo = proximoReino();
    var gemas = document.querySelectorAll(".botao-bloco-nav");
    for (var i = 0; i < gemas.length; i++) gemas[i].classList.toggle("vida-gema-chamando", gemas[i].getAttribute("data-nav-bloco") === alvo);
  }

  var falasDitas = new Set();
  function guardioesFalando() {
    var baloes = document.querySelectorAll("#lista-blocos .guardiao-balao > span.font-body");
    for (var i = 0; i < baloes.length; i++) {
      var span = baloes[i];
      var texto = span.textContent;
      if (falasDitas.has(texto) || span.children.length) continue;
      falasDitas.add(texto);
      if (!movimento || !texto.trim()) continue;
      digitar(span, texto);
    }
  }
  function digitar(span, texto) {
    var html = '<span class="vida-so-leitor">' + texto.replace(/&/g, "&amp;").replace(/</g, "&lt;") + '</span><span aria-hidden="true">';
    var letras = Array.from(texto);
    letras.forEach(function (c, i) {
      var seguro = c === "<" ? "&lt;" : c === "&" ? "&amp;" : c;
      html += '<span class="vida-letra" style="--i:' + i + '">' + seguro + "</span>";
    });
    span.innerHTML = html + "</span>";
    setTimeout(function () { if (span.isConnected) span.textContent = texto; }, letras.length * 24 + 400);
  }

  var trilhasFeitas = null;
  function trilhas() {
    var tiles = document.querySelectorAll("#lista-blocos .tile-reino");
    if (!tiles.length) return;
    var completo = {};
    for (var i = 0; i < tiles.length; i++) {
      var m = /tile-pos-(\d)/.exec(tiles[i].className);
      if (m) completo[m[1]] = tiles[i].classList.contains("estado-completo");
    }
    var agora = new Set();
    for (var j = 0; j < tiles.length; j++) {
      var p = /tile-pos-(\d)/.exec(tiles[j].className);
      if (!p || p[1] === "0") continue;
      var n = parseInt(p[1], 10);
      if (!completo[n - 1]) continue;
      agora.add(n);
      tiles[j].classList.add("vida-trilha-conquistada");
      // trecho conquistado AGORA (não no carregamento): a tinta se desenha
      if (trilhasFeitas && !trilhasFeitas.has(n) && movimento) animarUmaVez(tiles[j], "vida-trilha-desenhar", 1100);
    }
    trilhasFeitas = agora;
  }

  encadear("aposRenderizarBlocos", function () { marcarGema(); guardioesFalando(); trilhas(); });

  // =====================================================================
  // 12. Mago vivo: dicas de vez em quando e comemoração nas vitórias
  // =====================================================================
  var DICAS = [
    "Psst! Nas runas, toque nas palavras sublinhadas para descobrir o que significam.",
    "Já visitou o 🗺️ Atlas das Maravilhas? Fica lá no topo do mapa!",
    "No seu 📖 Diário estão todas as palavras que você já descobriu.",
    "Leu todas as runas de um reino? Então enfrente o Julgamento dele!",
    "A 📜 Crônica do Reino conta a história do Império inteiro.",
    "Você também pode me fazer perguntas: é só me tocar!"
  ];
  var dicasMostradas = 0, proximaDica = Math.floor(Math.random() * DICAS.length);
  function chatAbertoAgora() { try { return typeof chatAberto !== "undefined" && !!chatAberto; } catch (e) { return false; } }
  function mostrarDica() {
    if (dicasMostradas >= 3) return;
    if (document.hidden || janelaAberta() || chatAbertoAgora() || document.querySelector(".vida-mago-dica") || !document.querySelector(".avatar-mago")) {
      setTimeout(mostrarDica, 20000);
      return;
    }
    dicasMostradas++;
    var dica = document.createElement("div");
    dica.className = "vida-mago-dica";
    dica.setAttribute("role", "status");
    dica.innerHTML = '<span class="vida-mago-dica-texto">' + DICAS[proximaDica % DICAS.length] + '</span>' +
      '<button type="button" class="vida-mago-dica-fechar" aria-label="Fechar a dica do Mago">✕</button>';
    proximaDica++;
    document.body.appendChild(dica);
    function fechar() { if (dica.parentNode) dica.parentNode.removeChild(dica); }
    dica.querySelector("button").addEventListener("click", fechar);
    setTimeout(fechar, 9000);
    if (dicasMostradas < 3) setTimeout(mostrarDica, 75000);
  }
  function comemorar() {
    if (!movimento) return;
    var avatar = document.querySelector("#oraculo-container .avatar-mago");
    if (avatar) animarUmaVez(avatar, "vida-comemora", 900);
  }
  encadear("mostrarToast", function (args) {
    var texto = String(args[0] || "");
    if (/superad|Conquista|destrancad/i.test(texto)) comemorar();
  });

  // =====================================================================
  // 18. Julgamento: o resultado comemora (vitória) ou treme (quase lá).
  //     Não mostra QUAIS respostas estavam erradas: o desafio continua.
  // =====================================================================
  function aposAbrirJulgamento(seletorBotao, seletorResultado) {
    var botao = document.querySelector(seletorBotao);
    if (!botao || !movimento) return;
    botao.addEventListener("click", function () {
      var caixa = document.querySelector(seletorResultado + " .painel-pergaminho-velho");
      if (!caixa) return;
      if (/superado/i.test(caixa.textContent)) {
        animarUmaVez(caixa, "vida-vitoria", 1400);
        chuvaDeFolhas(document.body, 14);
      } else {
        animarUmaVez(caixa, "vida-tremer", 700);
      }
    });
  }
  encadear("abrirModalMissao", function () { aposAbrirJulgamento("#confirmar-missao", "#resultado-missao"); });
  encadear("abrirModalMissaoBoss", function () { aposAbrirJulgamento("#confirmar-missao-boss", "#resultado-missao-boss"); });

  // =====================================================================
  // 19. Crônica: virar a página ao trocar de capítulo
  // =====================================================================
  function vigiarCronica() {
    var texto = document.querySelector(".cronica-overlay .cronica-texto");
    if (!texto || texto.getAttribute("data-vida") === "ok") return;
    texto.setAttribute("data-vida", "ok");
    var pagina = document.querySelector(".cronica-overlay .cronica-paginacao");
    var antes = pagina ? parseInt(pagina.textContent, 10) : 0;
    new MutationObserver(function () {
      var agora = pagina ? parseInt(pagina.textContent, 10) : 0;
      if (movimento && agora !== antes) animarUmaVez(texto, agora > antes ? "vida-virar-frente" : "vida-virar-tras", 600);
      antes = agora;
    }).observe(texto, { childList: true });
  }
  new MutationObserver(function () { if (document.querySelector(".cronica-overlay")) vigiarCronica(); })
    .observe(document.body, { childList: true });

  // =====================================================================
  // 20. Gema → reino: a rolagem já "voa" até ele; no fim, o quadro pisca
  //     um anel de luz para a criança ver onde chegou
  // =====================================================================
  encadear("irParaBloco", function (args) {
    if (!movimento) return;
    var id = args[0];
    setTimeout(function () {
      var alvo = document.querySelector('#lista-blocos [data-bloco-id="' + id + '"]');
      if (!alvo) return;
      var anel = criar("span", "vida-pouso", alvo);
      setTimeout(function () { if (anel.parentNode) anel.parentNode.removeChild(anel); }, 1500);
    }, 750);
  });

  // ---------- Início ----------
  function iniciar() {
    montarCeu();
    montarCorvos();
    contadorVivo(document.getElementById("contador-progresso"), /(\d+)\s*\/\s*\d+/);
    var xp = document.getElementById("xp-nivel-nome");
    if (xp) { var n = lerNivel(xp.textContent); nivelAtual = n ? n.n : null; }
    contadorVivo(xp, /(\d+)\s*PR/, aoMudarXP);
    marcarGema();
    trilhas();
    falasDitasIniciais();
    setTimeout(mostrarDica, 25000);
  }
  // As falas que já estão na tela ao abrir o site não são "digitadas"
  function falasDitasIniciais() {
    var baloes = document.querySelectorAll("#lista-blocos .guardiao-balao > span.font-body");
    for (var i = 0; i < baloes.length; i++) falasDitas.add(baloes[i].textContent);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();
})();
