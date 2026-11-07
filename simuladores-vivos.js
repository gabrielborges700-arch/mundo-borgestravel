/**
 * simuladores-vivos.js — Cenas animadas para os simuladores (redesign
 * "avançado", 07/11/2026)
 *
 * Cada simulador de física ganha uma CENA desenhada que reage aos
 * controles com a física certa:
 *   0.3  torre no vento: empurrão cresce com v², o pêndulo amortecedor
 *        engole o BALANÇO mas não o desvio médio;
 *   0.7  viga sobre duas colunas: sobra de força faz a viga descer/subir,
 *        momentos desiguais fazem a viga girar;
 *   0.8  arco romano: as pedras entram na ordem, o cimbre de madeira segura
 *        tudo até a pedra de fecho e depois sai; aparecem o caminho da
 *        compressão e o empurrão para fora nos pilares;
 *   0.9  viga biapoiada com carga no meio: compressão (ciano) em cima,
 *        tração (vermelho) embaixo, linha neutra no meio, mais forte onde o
 *        momento é maior (no meio do vão) e zero nos apoios;
 *   1    pilar de alvenaria/concreto/madeira encurtando, trincando do jeito
 *        de cada material e rompendo acima da resistência;
 *   2    régua com lupa: cursor, alvo e a faixa de tolerância ±1 mm;
 *   3    mola/tendão com a reta F = k·x num gráfico;
 *   4    barra presa num torno, dobrando a cada ciclo, com a trinca
 *        crescendo cada vez mais rápido e a curva S–N do aço e do alumínio;
 *   5    viga com a carga no meio, as reações P/2, a flecha (que cresce
 *        com L³) e o diagrama de momento fletor triangular (P·L/4);
 *   6    a cidade da Grande Aliança: segurança abaixo do mínimo da norma
 *        balança e racha; estética baixa deixa tudo cinza.
 *
 * REGRA DE OURO (a mesma do simuladores-polimento.js): nenhum controle,
 * faixa, número, fórmula ou texto do simulador muda — os desafios das
 * runas mandam a criança LER esses números. As cenas só LEEM o que o
 * simulador já escreveu no DOM (valores dos sliders e textos dos
 * mostradores) e são aria-hidden. Os desenhos antigos (decorativos) ficam
 * escondidos por CSS, sem sair do DOM.
 *
 * Carregar logo DEPOIS do simuladores-polimento.js: encadeia a função
 * global criarPainelSimulacao. CSS: estilos/simuladores-vivos.css.
 */
(function () {
  "use strict";
  if (typeof criarPainelSimulacao !== "function") return;

  var NS = "http://www.w3.org/2000/svg";
  var TINTA = "#3b2412";
  var CIANO = "#0097a7", CIANO_CLARO = "#00e5ff", VERMELHO = "#c62828";
  var contador = 0;

  function combina(consulta) {
    try { return !!(window.matchMedia && window.matchMedia(consulta).matches); } catch (e) { return false; }
  }
  var movimento = !combina("(prefers-reduced-motion: reduce)");

  function n1(v) { return Math.round(v * 10) / 10; }
  function limitar(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function el(tag, atributos, pai) {
    var e = document.createElementNS(NS, tag);
    if (atributos) for (var k in atributos) if (atributos[k] !== undefined && atributos[k] !== null) e.setAttribute(k, atributos[k]);
    if (pai) pai.appendChild(e);
    return e;
  }
  function attr(e, atributos) { for (var k in atributos) e.setAttribute(k, atributos[k]); }
  function valorSlider(painel, id) {
    var s = painel.querySelector("#" + id);
    return s ? Number(s.value) : NaN;
  }
  function numeroDoTexto(painel, seletor) {
    var e = painel.querySelector(seletor);
    if (!e) return NaN;
    var m = /-?\d+(?:[.,]\d+)?/.exec(e.textContent);
    return m ? Number(m[0].replace(",", ".")) : NaN;
  }
  function seta(pai, x1, y1, x2, y2, cor, largura, classe) {
    var g = el("g", { class: classe || "" }, pai);
    var ang = Math.atan2(y2 - y1, x2 - x1);
    var tam = 6 + largura * 1.6;
    var bx = x2 - Math.cos(ang) * tam, by = y2 - Math.sin(ang) * tam;
    el("line", { x1: n1(x1), y1: n1(y1), x2: n1(bx), y2: n1(by), stroke: cor, "stroke-width": largura, "stroke-linecap": "round" }, g);
    var px = Math.cos(ang + Math.PI / 2) * tam * 0.55, py = Math.sin(ang + Math.PI / 2) * tam * 0.55;
    el("path", { d: "M" + n1(x2) + " " + n1(y2) + "L" + n1(bx + px) + " " + n1(by + py) + "L" + n1(bx - px) + " " + n1(by - py) + "Z", fill: cor }, g);
    return g;
  }
  function setaD(x1, y1, x2, y2, largura) {
    // só o "d" de uma seta (linha + ponta), para atualizar sem recriar
    var ang = Math.atan2(y2 - y1, x2 - x1);
    var tam = 6 + largura * 1.6;
    var bx = x2 - Math.cos(ang) * tam, by = y2 - Math.sin(ang) * tam;
    var px = Math.cos(ang + Math.PI / 2) * tam * 0.55, py = Math.sin(ang + Math.PI / 2) * tam * 0.55;
    return {
      linha: "M" + n1(x1) + " " + n1(y1) + "L" + n1(bx) + " " + n1(by),
      ponta: "M" + n1(x2) + " " + n1(y2) + "L" + n1(bx + px) + " " + n1(by + py) + "L" + n1(bx - px) + " " + n1(by - py) + "Z",
    };
  }
  function criarSeta(pai, cor, largura, classe) {
    var g = el("g", { class: classe || "" }, pai);
    var linha = el("path", { fill: "none", stroke: cor, "stroke-width": largura, "stroke-linecap": "round" }, g);
    var ponta = el("path", { fill: cor }, g);
    return {
      g: g,
      mover: function (x1, y1, x2, y2) {
        var d = setaD(x1, y1, x2, y2, largura);
        linha.setAttribute("d", d.linha);
        ponta.setAttribute("d", d.ponta);
      },
    };
  }
  function texto(pai, x, y, conteudo, atributos) {
    var t = el("text", Object.assign({ x: x, y: y, class: "sv-texto" }, atributos || {}), pai);
    t.textContent = conteudo;
    return t;
  }
  function chao(svg, y, largura) {
    el("rect", { x: 0, y: y, width: largura, height: 400, class: "sv-chao" }, svg);
    el("line", { x1: 0, y1: y, x2: largura, y2: y, class: "sv-linha-chao" }, svg);
  }
  function hachura(pai, x, y, w, h) {
    var d = "";
    for (var i = -h; i < w; i += 8) d += "M" + (x + i) + " " + (y + h) + "l" + h + " " + (-h);
    el("rect", { x: x, y: y, width: w, height: h, fill: "#cdb991", stroke: TINTA, "stroke-width": 1.5 }, pai);
    var clipId = "svclip" + (++contador);
    var clip = el("clipPath", { id: clipId }, pai);
    el("rect", { x: x, y: y, width: w, height: h }, clip);
    el("path", { d: d, stroke: TINTA, "stroke-width": 1, opacity: 0.5, "clip-path": "url(#" + clipId + ")" }, pai);
  }
  // Hachura de gravura (linhas finas inclinadas) para as sombras das cenas
  function hachura45(svg, densa) {
    var id = "svhach" + (++contador);
    var defs = svg.querySelector("defs") || el("defs", null, svg);
    var pt = el("pattern", { id: id, width: densa ? 3 : 4, height: densa ? 3 : 4, patternUnits: "userSpaceOnUse", patternTransform: "rotate(40)" }, defs);
    el("line", { x1: 0, y1: 0, x2: 0, y2: densa ? 3 : 4, stroke: TINTA, "stroke-width": densa ? 0.9 : 0.8, "stroke-opacity": 0.6 }, pt);
    return "url(#" + id + ")";
  }
  function palco(painel, vb, larguraVB, alturaVB, onde, antesDe) {
    var caixa = document.createElement("div");
    caixa.className = "sv-palco";
    caixa.setAttribute("aria-hidden", "true");
    caixa.style.aspectRatio = larguraVB + " / " + alturaVB;
    var svg = el("svg", { viewBox: vb || "0 0 " + larguraVB + " " + alturaVB, class: "sv-cena", focusable: "false", preserveAspectRatio: "xMidYMid meet" });
    caixa.appendChild(svg);
    if (onde && antesDe) onde.insertBefore(caixa, antesDe);
    else if (onde) onde.appendChild(caixa);
    return { caixa: caixa, svg: svg };
  }
  function ocultar(painel, seletores) {
    seletores.forEach(function (s) { painel.querySelectorAll(s).forEach(function (e) { e.classList.add("sv-oculto"); }); });
  }
  function balancar(alvo) {
    if (!movimento || !alvo) return;
    alvo.classList.remove("sv-balanca");
    void alvo.getBoundingClientRect;
    setTimeout(function () { alvo.classList.add("sv-balanca"); }, 0);
    setTimeout(function () { alvo.classList.remove("sv-balanca"); }, 520);
  }

  // Laço de animação único: só roda enquanto há cena viva na tela
  var vivas = [];
  var rodando = false;
  function animar(fn, caixa) {
    if (!movimento || typeof requestAnimationFrame !== "function") return;
    vivas.push({ fn: fn, caixa: caixa });
    if (!rodando) { rodando = true; requestAnimationFrame(passo); }
  }
  var ultimoTempo = 0;
  function passo(t) {
    var dt = ultimoTempo ? Math.min(0.05, (t - ultimoTempo) / 1000) : 0.016;
    ultimoTempo = t;
    vivas = vivas.filter(function (v) { return v.caixa.isConnected; });
    vivas.forEach(function (v) {
      // não gasta bateria com cena escondida (outra página do livro)
      if (v.caixa.offsetParent !== null) { try { v.fn(t / 1000, dt); } catch (e) {} }
    });
    if (vivas.length) requestAnimationFrame(passo);
    else { rodando = false; ultimoTempo = 0; }
  }

  // ===================================================================
  // 0.3 — Torre no vento
  // ===================================================================
  function cenaVento(painel) {
    var torreAntiga = painel.querySelector("#torre");
    var caixaAntiga = torreAntiga ? torreAntiga.parentElement : null;
    if (!caixaAntiga) return null;
    ocultar(painel, ["#torre"]);
    caixaAntiga.classList.add("sv-caixa-cena");
    caixaAntiga.style.setProperty("--sv-proporcao", "600 / 250");
    var svg = el("svg", { viewBox: "0 0 600 250", class: "sv-cena sv-cena-fundo", focusable: "false", "aria-hidden": "true" });
    caixaAntiga.insertBefore(svg, caixaAntiga.firstChild);

    var gid = "svceu" + (++contador);
    var defs = el("defs", null, svg);
    var grad = el("linearGradient", { id: gid, x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    el("stop", { offset: "0", "stop-color": "#cfdcd8" }, grad);
    el("stop", { offset: "1", "stop-color": "#f1e6c8" }, grad);
    el("rect", { x: 0, y: 0, width: 600, height: 250, fill: "url(#" + gid + ")" }, svg);
    el("path", { d: "M0 212q80-40 170-18t170 4t150-16t110 10V250H0z", class: "sv-morro" }, svg);
    chao(svg, 222, 600);
    var rajadas = el("g", { class: "sv-rajadas" }, svg);
    var setasVento = [];
    for (var i = 0; i < 5; i++) setasVento.push(criarSeta(svg, "#4e7c8a", 2.4, "sv-seta-vento"));
    var torre = el("path", { class: "sv-torre" }, svg);
    var sombraTorre = el("path", { fill: hachura45(svg, true), class: "sv-sombra" }, svg);
    var andares = el("path", { class: "sv-torre-andares" }, svg);
    var topo = el("g", null, svg);
    var cupula = el("path", { class: "sv-torre-topo" }, topo);
    var pendulo = el("g", { class: "sv-pendulo" }, topo);
    var fio = el("line", { stroke: TINTA, "stroke-width": 1.5 }, pendulo);
    var massa = el("circle", { r: 5.5, fill: "#00acc1", stroke: TINTA, "stroke-width": 1.5 }, pendulo);
    texto(svg, 14, 240, "desenho exagerado para dar para ver", { class: "sv-texto sv-nota" });

    var H = 168, BASE = 222, XC = 300, LB = 40, LT = 20;
    var particulas = [];
    for (var p = 0; p < 18; p++) {
      particulas.push({ x: Math.random() * 600, y: 20 + Math.random() * 190, e: el("line", { class: "sv-particula" }, rajadas) });
    }
    var estado = { v: 30, ligado: false, desvio: 0, balanco: 0, fase: 0 };

    // linha elástica de uma torre engastada sob carga distribuída (normalizada: 1 no topo)
    function forma(xi) { return xi * xi * (6 - 4 * xi + xi * xi) / 3; }

    function desenhar(deslocTopo, anguloPendulo) {
      var esq = [], dir = [], meio = [], linhas = "";
      for (var k = 0; k <= 12; k++) {
        var xi = k / 12, y = BASE - xi * H;
        var u = deslocTopo * forma(xi);
        var w = (LB + (LT - LB) * xi) / 2;
        esq.push(n1(XC + u - w) + " " + n1(y));
        dir.unshift(n1(XC + u + w) + " " + n1(y));
        meio.push(n1(XC + u + w * 0.15) + " " + n1(y));
        if (k > 0 && k < 12 && k % 2 === 0) linhas += "M" + n1(XC + u - w + 3) + " " + n1(y) + "H" + n1(XC + u + w - 3);
      }
      torre.setAttribute("d", "M" + esq.join("L") + "L" + dir.join("L") + "Z");
      sombraTorre.setAttribute("d", "M" + meio.join("L") + "L" + dir.join("L") + "Z");
      andares.setAttribute("d", linhas);
      var ut = deslocTopo, yt = BASE - H;
      cupula.setAttribute("d", "M" + n1(XC + ut - LT / 2 - 3) + " " + yt + "L" + n1(XC + ut) + " " + (yt - 22) + "L" + n1(XC + ut + LT / 2 + 3) + " " + yt + "Z");
      // pêndulo (amortecedor de massa sintonizada) pendurado lá no alto
      var px = XC + ut, py = yt + 10;
      var mx = px + Math.sin(anguloPendulo) * 22, my = py + Math.cos(anguloPendulo) * 22;
      attr(fio, { x1: n1(px), y1: py, x2: n1(mx), y2: n1(my) });
      attr(massa, { cx: n1(mx), cy: n1(my) });
    }

    function ler() {
      estado.v = valorSlider(painel, "slider-vento") || 0;
      var botao = painel.querySelector("#botao-reforco");
      estado.ligado = !!(botao && /Ligados/.test(botao.textContent));
      // mesmas contas do simulador (0,00387·v² e a fração do balanço)
      estado.desvio = 0.00387 * estado.v * estado.v;
      estado.balanco = estado.desvio * (estado.ligado ? 0.08 : 0.4);
      pendulo.style.display = estado.ligado ? "" : "none";
      // empurrão do vento ~ v²: setas cada vez maiores
      var tam = 6 + estado.v * estado.v * 0.0042;
      for (var i = 0; i < setasVento.length; i++) {
        var y = BASE - 22 - i * 32;
        setasVento[i].mover(XC - 34 - tam - 20, y, XC - 30 - 4, y);
        setasVento[i].g.style.opacity = estado.v < 1 ? 0 : 0.85;
      }
      if (!movimento) desenhar(estado.desvio * 0.6, 0);
    }

    function atualizarQuadro(t, dt) {
      var escala = 0.6; // px por cm (exagero do desenho)
      var w = 2 * Math.PI / 2.4;
      var balanco = estado.balanco * escala * Math.sin(w * t);
      // o pêndulo balança ao contrário da torre (fica dentro do topo dela)
      var angulo = estado.ligado ? -Math.sin(w * t) * Math.min(0.3, 0.08 + estado.v / 600) : 0;
      desenhar(estado.desvio * escala + balanco, angulo);
      var velocidade = 60 + estado.v * 4.2;
      var quantas = Math.round(limitar(estado.v / 9, 0, particulas.length));
      for (var i = 0; i < particulas.length; i++) {
        var pt = particulas[i];
        if (i >= quantas) { pt.e.style.display = "none"; continue; }
        pt.e.style.display = "";
        pt.x += velocidade * dt;
        if (pt.x > 620) { pt.x = -40 - Math.random() * 80; pt.y = 20 + Math.random() * 190; }
        var comp = 10 + estado.v * 0.22;
        attr(pt.e, { x1: n1(pt.x), y1: n1(pt.y), x2: n1(pt.x + comp), y2: n1(pt.y) });
      }
    }

    ler();
    desenhar(estado.desvio * 0.6, 0);
    if (!movimento) particulas.forEach(function (pt) { pt.e.style.display = "none"; });
    animar(atualizarQuadro, caixaAntiga);
    return ler;
  }

  // ===================================================================
  // 0.7 — Equilíbrio da viga sobre duas colunas
  // ===================================================================
  function cenaEquilibrio(painel) {
    var mostrador = painel.querySelector("#soma-forcas");
    var caixaMostrador = mostrador ? mostrador.closest("div[style*='padding']") : null;
    var alvo = caixaMostrador || painel.querySelector("#resultado-equilibrio");
    if (!alvo) return null;
    var c = palco(painel, null, 600, 230, alvo.parentNode, alvo);
    var svg = c.svg;
    chao(svg, 205, 600);
    // colunas
    var hach07 = hachura45(svg);
    [150, 450].forEach(function (x) {
      el("rect", { x: x - 16, y: 150, width: 32, height: 55, class: "sv-pedra" }, svg);
      el("rect", { x: x + 4, y: 150, width: 12, height: 55, fill: hach07, class: "sv-sombra" }, svg);
      el("path", { d: "M" + (x - 16) + " 168h32M" + (x - 16) + " 186h32", class: "sv-juntas" }, svg);
    });
    var reacaoE = criarSeta(svg, CIANO, 4, "sv-seta-reacao");
    var reacaoD = criarSeta(svg, CIANO, 4, "sv-seta-reacao");
    var fantasma = el("rect", { x: 100, y: 136, width: 400, height: 14, class: "sv-fantasma" }, svg);
    var viga = el("g", { class: "sv-viga-grupo" }, svg);
    el("rect", { x: 100, y: 136, width: 400, height: 14, rx: 2, class: "sv-madeira" }, viga);
    el("path", { d: "M110 141h120M260 145h90M380 140h110", class: "sv-veio" }, viga);
    el("rect", { x: 100, y: 145, width: 400, height: 5, fill: hach07, class: "sv-sombra" }, viga);
    var pesoE = criarSeta(viga, "#c75b12", 4, "sv-seta-peso");
    var pesoD = criarSeta(viga, "#c75b12", 4, "sv-seta-peso");
    var caixaE = el("rect", { width: 30, height: 22, rx: 3, class: "sv-caixa-peso" }, viga);
    var caixaD = el("rect", { width: 30, height: 22, rx: 3, class: "sv-caixa-peso" }, viga);
    var selo = el("g", { class: "sv-selo-ok" }, svg);
    el("circle", { cx: 300, cy: 40, r: 16, fill: "#2e7d32", stroke: TINTA, "stroke-width": 1.5 }, selo);
    el("path", { d: "M292 40l6 6l10-12", stroke: "#fff", "stroke-width": 3.2, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" }, selo);
    var aviso = texto(svg, 300, 44, "", { "text-anchor": "middle", class: "sv-texto sv-aviso" });

    return function () {
      var pL = numeroDoTexto(painel, "#peso-esq"), pR = numeroDoTexto(painel, "#peso-dir");
      var cL = numeroDoTexto(painel, "#col-esq"), cR = numeroDoTexto(painel, "#col-dir");
      if ([pL, pR, cL, cR].some(isNaN)) return;
      var soma = pL + pR - cL - cR;                 // > 0: sobra peso → desce
      var giro = (cL - pL) - (cR - pR);             // > 0: esquerda sobe, direita desce
      var dy = limitar(soma * 3, -26, 26);
      var ang = limitar(giro * 2.6, -14, 14);
      viga.style.transform = "translateY(" + dy + "px) rotate(" + ang + "deg)";
      fantasma.style.opacity = soma || giro ? 0.6 : 0;
      var tam = function (kN) { return 10 + Math.min(kN, 14) * 6; };
      pesoE.mover(150, 136 - 22 - tam(pL), 150, 136 - 24);
      pesoD.mover(450, 136 - 22 - tam(pR), 450, 136 - 24);
      pesoE.g.style.opacity = pL ? 1 : 0;
      pesoD.g.style.opacity = pR ? 1 : 0;
      attr(caixaE, { x: 135, y: 136 - 22 }); attr(caixaD, { x: 435, y: 136 - 22 });
      reacaoE.mover(122, 150 + tam(cL) * 0.5, 122, 152);
      reacaoD.mover(478, 150 + tam(cR) * 0.5, 478, 152);
      reacaoE.g.style.opacity = cL ? 1 : 0;
      reacaoD.g.style.opacity = cR ? 1 : 0;
      var ok = soma === 0 && giro === 0;
      selo.style.opacity = ok ? 1 : 0;
      c.caixa.classList.toggle("sv-em-equilibrio", ok);
      aviso.textContent = ok ? "" : soma !== 0 && giro === 0 ? (soma > 0 ? "sobra peso: a viga afunda ↓" : "sobra empurrão: a viga sobe ↑")
        : soma === 0 ? "forças somam zero, mas a viga gira ↻" : "a viga desce e gira";
    };
  }

  // ===================================================================
  // 0.8 — Arco romano com cimbre
  // ===================================================================
  function cenaArco(painel) {
    var visual = painel.querySelector("#visual-arco");
    if (!visual) return null;
    ocultar(painel, ["#visual-arco"]);
    var c = palco(painel, null, 600, 230, visual.parentNode, visual);
    var svg = c.svg;
    chao(svg, 208, 600);
    var CX = 300, CY = 160, RI = 84, RE = 112;
    function ponto(r, aGraus) { var a = aGraus * Math.PI / 180; return [CX + r * Math.cos(a), CY - r * Math.sin(a)]; }
    function aduela(a1, a2, rIn, rOut) {
      var ri = rIn || RI, re = rOut || RE;
      var p1 = ponto(re, a1), p2 = ponto(re, a2), p3 = ponto(ri, a2), p4 = ponto(ri, a1);
      return "M" + n1(p1[0]) + " " + n1(p1[1]) + "A" + re + " " + re + " 0 0 " + (a1 > a2 ? 1 : 0) + " " + n1(p2[0]) + " " + n1(p2[1]) +
        "L" + n1(p3[0]) + " " + n1(p3[1]) + "A" + ri + " " + ri + " 0 0 " + (a1 > a2 ? 0 : 1) + " " + n1(p4[0]) + " " + n1(p4[1]) + "Z";
    }
    var hachArco = hachura45(svg);
    // 5 peças, na ordem dos botões: pilar E, pilar D, ombro E, ombro D, pedra de fecho
    var formas = [
      ["M" + (CX - RE - 14) + " " + CY + "H" + (CX - RI + 4) + "V208H" + (CX - RE - 14) + "Z"],
      ["M" + (CX + RI - 4) + " " + CY + "H" + (CX + RE + 14) + "V208H" + (CX + RI - 4) + "Z"],
      [aduela(180, 156), aduela(156, 132), aduela(132, 106)],
      [aduela(74, 48), aduela(48, 24), aduela(24, 0)],
      [aduela(106, 74)],
    ];
    var cimbre = el("g", { class: "sv-cimbre" }, svg);
    el("path", { d: "M" + (CX - RI + 2) + " " + CY + "A" + (RI - 2) + " " + (RI - 2) + " 0 0 1 " + (CX + RI - 2) + " " + CY, class: "sv-cimbre-arco" }, cimbre);
    el("path", { d: "M" + (CX - RI) + " " + (CY + 4) + "H" + (CX + RI), class: "sv-cimbre-viga" }, cimbre);
    var montantes = "";
    [-60, -30, 0, 30, 60].forEach(function (dx) {
      var topo = CY - Math.sqrt(Math.max(0, (RI - 2) * (RI - 2) - dx * dx));
      montantes += "M" + (CX + dx) + " " + n1(topo) + "V" + (CY + 4);
    });
    montantes += "M" + (CX - 70) + " " + (CY + 4) + "V208M" + (CX + 70) + " " + (CY + 4) + "V208";
    el("path", { d: montantes, class: "sv-cimbre-escora" }, cimbre);
    texto(cimbre, CX, CY + 30, "cimbre de madeira", { "text-anchor": "middle", class: "sv-texto sv-nota" });

    // sombras: o lado de dentro do arco (intradorso) e a face direita dos pilares
    var sombras = [
      ["M" + (CX - RI - 8) + " " + CY + "H" + (CX - RI + 4) + "V208H" + (CX - RI - 8) + "Z"],
      ["M" + (CX + RE + 2) + " " + CY + "H" + (CX + RE + 14) + "V208H" + (CX + RE + 2) + "Z"],
      [aduela(180, 156, RI, RI + 9), aduela(156, 132, RI, RI + 9), aduela(132, 106, RI, RI + 9)],
      [aduela(74, 48, RI, RI + 9), aduela(48, 24, RI, RI + 9), aduela(24, 0, RI, RI + 9)],
      [aduela(106, 74, RI, RI + 9)],
    ];
    var grupos = formas.map(function (lista, i) {
      var g = el("g", { class: "sv-peca", "data-peca": i }, svg);
      lista.forEach(function (d) {
        el("path", { d: d, class: "sv-peca-fantasma" }, g);
        el("path", { d: d, class: "sv-pedra sv-peca-pedra" }, g);
      });
      sombras[i].forEach(function (d) { el("path", { d: d, fill: hachArco, class: "sv-sombra sv-peca-pedra" }, g); });
      return g;
    });
    // empuxo: compressão descendo pelo arco e empurrando os pilares para fora
    var empuxo = el("g", { class: "sv-empuxo" }, svg);
    var rm = (RI + RE) / 2;
    el("path", { d: "M" + n1(ponto(rm, 92)[0]) + " " + n1(ponto(rm, 92)[1]) + "A" + rm + " " + rm + " 0 0 0 " + n1(CX - rm) + " " + CY, class: "sv-fluxo" }, empuxo);
    el("path", { d: "M" + n1(ponto(rm, 88)[0]) + " " + n1(ponto(rm, 88)[1]) + "A" + rm + " " + rm + " 0 0 1 " + n1(CX + rm) + " " + CY, class: "sv-fluxo" }, empuxo);
    seta(empuxo, CX - RE - 18, CY + 18, CX - RE - 62, CY + 18, CIANO, 3.5, "sv-seta-empuxo");
    seta(empuxo, CX + RE + 18, CY + 18, CX + RE + 62, CY + 18, CIANO, 3.5, "sv-seta-empuxo");
    texto(empuxo, CX - RE - 40, CY + 38, "empurra", { "text-anchor": "middle", class: "sv-texto sv-nota" });
    texto(empuxo, CX + RE + 40, CY + 38, "empurra", { "text-anchor": "middle", class: "sv-texto sv-nota" });
    var peso = el("g", { class: "sv-peso-topo" }, svg);
    el("rect", { x: CX - 16, y: CY - RE - 22, width: 32, height: 18, rx: 3, class: "sv-caixa-peso" }, peso);
    seta(peso, CX, CY - RE - 4, CX, CY - RE + 10, "#c75b12", 3);
    var aviso = texto(svg, 14, 18, "", { class: "sv-texto sv-aviso" });

    function colocadas() {
      var botoes = painel.querySelectorAll("#botoes-pedras > button");
      var n = 0;
      botoes.forEach(function (b) { if (b.style.backgroundColor === "rgb(6, 95, 70)") n++; });
      return n;
    }
    // clique fora de ordem: a peça fantasma treme
    painel.addEventListener("click", function (ev) {
      var b = ev.target.closest ? ev.target.closest("#botoes-pedras > button") : null;
      if (!b || !b.isConnected || b.style.backgroundColor === "rgb(6, 95, 70)") return;
      var i = Array.prototype.indexOf.call(b.parentNode.children, b);
      balancar(grupos[i]);
      aviso.textContent = i >= 2 && colocadas() < 2 ? "sem os pilares, essa pedra cai no chão!" : "ainda não: siga a ordem de baixo para cima";
    });

    return function () {
      var n = colocadas();
      grupos.forEach(function (g, i) {
        g.classList.toggle("sv-colocada", i < n);
        g.classList.toggle("sv-proxima", i === n);
      });
      c.caixa.classList.toggle("sv-com-cimbre", n >= 2 && n < 5);
      c.caixa.classList.toggle("sv-arco-travado", n >= 5);
      if (n >= 5) aviso.textContent = "travado! o cimbre já pode sair";
      else if (n === 4) aviso.textContent = "falta a pedra de fecho, lá no alto";
      else if (n >= 2) aviso.textContent = "o cimbre segura as pedras até o arco fechar";
      else aviso.textContent = "";
    };
  }

  // ===================================================================
  // 0.9 — Viga biapoiada: compressão, tração e linha neutra
  // ===================================================================
  function cenaViga(painel) {
    var vigaAntiga = painel.querySelector("#viga");
    var caixaAntiga = vigaAntiga ? vigaAntiga.parentElement : null;
    if (!caixaAntiga) return null;
    ocultar(painel, [".sim-viga-caixa-antiga"]);
    caixaAntiga.classList.add("sv-oculto");
    var c = palco(painel, null, 600, 220, caixaAntiga.parentNode, caixaAntiga);
    var svg = c.svg;
    var X0 = 60, X1 = 540, Y = 112, H = 30, N = 48;
    el("rect", { x: 0, y: 0, width: 600, height: 220, class: "sv-fundo-ardosia" }, svg);
    // apoios
    el("path", { d: "M" + X0 + " " + (Y + H / 2) + "l-14 26h28z", class: "sv-apoio" }, svg);
    el("path", { d: "M" + X1 + " " + (Y + H / 2) + "l-14 22h28z", class: "sv-apoio" }, svg);
    el("circle", { cx: X1 - 8, cy: Y + H / 2 + 27, r: 4, class: "sv-apoio" }, svg);
    el("circle", { cx: X1 + 8, cy: Y + H / 2 + 27, r: 4, class: "sv-apoio" }, svg);
    el("path", { d: "M" + (X0 - 24) + " " + (Y + H / 2 + 27) + "h48M" + (X1 - 24) + " " + (Y + H / 2 + 32) + "h48", stroke: "#e9dcbc", "stroke-width": 2 }, svg);
    var fatias = el("g", null, svg);
    var faixas = [];
    for (var i = 0; i < N; i++) {
      var f = [];
      for (var b = 0; b < 4; b++) f.push(el("path", { fill: b < 2 ? CIANO_CLARO : "#ff3b3b" }, fatias));
      faixas.push(f);
    }
    var contorno = el("path", { class: "sv-viga-contorno" }, svg);
    var neutra = el("path", { class: "sv-linha-neutra" }, svg);
    var carga = criarSeta(svg, "#ff6b6b", 5, "sv-seta-carga");
    texto(svg, 300, 22, "compressão: encurta  → ←", { "text-anchor": "middle", class: "sv-texto sv-claro sv-ciano" });
    texto(svg, 300, 206, "tração: estica  ← →", { "text-anchor": "middle", class: "sv-texto sv-claro sv-vermelho" });
    var rotuloNeutra = texto(svg, X1 - 150, Y - 6, "linha neutra", { class: "sv-texto sv-claro sv-nota" });

    function m(xi) { return xi <= 0.5 ? 2 * xi : 2 * (1 - xi); } // momento normalizado (triângulo)
    function w(xi) { var s = xi <= 0.5 ? xi : 1 - xi; return 3 * s - 4 * s * s * s; } // flecha normalizada

    return function () {
      var P = valorSlider(painel, "slider-forca");
      if (isNaN(P)) return;
      var delta = P * 0.3;
      var intens = P / 100;
      var topo = [], base = [];
      for (var i = 0; i < N; i++) {
        var xa = i / N, xb = (i + 1) / N;
        var pa = X0 + xa * (X1 - X0), pb = X0 + xb * (X1 - X0);
        var ya = Y + delta * w(xa), yb = Y + delta * w(xb);
        var a = 0.08 + 0.92 * m((xa + xb) / 2) * intens;
        var q = H / 4;
        for (var b = 0; b < 4; b++) {
          var y1a = ya + b * q, y1b = yb + b * q;
          faixas[i][b].setAttribute("d", "M" + n1(pa) + " " + n1(y1a) + "L" + n1(pb) + " " + n1(y1b) + "L" + n1(pb) + " " + n1(y1b + q) + "L" + n1(pa) + " " + n1(y1a + q) + "Z");
          // a tensão cresce para fora da linha neutra (faixas da borda mais fortes)
          faixas[i][b].setAttribute("fill-opacity", n1((b === 0 || b === 3 ? 1 : 0.45) * a * 100) / 100);
        }
        topo.push(n1(pa) + " " + n1(ya));
        base.unshift(n1(pa) + " " + n1(ya + H));
      }
      topo.push(X1 + " " + Y);
      base.unshift(X1 + " " + (Y + H));
      contorno.setAttribute("d", "M" + topo.join("L") + "L" + base.join("L") + "Z");
      var dNeutra = "M" + X0 + " " + (Y + H / 2);
      for (var k = 1; k <= 24; k++) { var xi = k / 24; dNeutra += "L" + n1(X0 + xi * (X1 - X0)) + " " + n1(Y + H / 2 + delta * w(xi)); }
      neutra.setAttribute("d", dNeutra);
      rotuloNeutra.setAttribute("y", n1(Y + H / 2 - 4 + delta * w(0.7)));
      var tam = 22 + P * 0.5;
      carga.mover(300, Y + delta - 6 - tam, 300, Y + delta - 4);
    };
  }

  // ===================================================================
  // BLOCO 1 — Pilar sob carga (alvenaria, concreto, madeira)
  // ===================================================================
  function cenaPilar(painel) {
    var slider = painel.querySelector("#slider-carga");
    var leitura = painel.querySelector("#valor-carga");
    var caixaLeitura = leitura ? leitura.closest("div") : null;
    if (!slider || !caixaLeitura) return null;
    var c = palco(painel, null, 600, 250, caixaLeitura.parentNode, caixaLeitura);
    var svg = c.svg;
    chao(svg, 222, 600);
    var defs = el("defs", null, svg);
    var idTijolo = "svtij" + (++contador), idConcreto = "svconc" + contador, idMadeira = "svmad" + contador, idClip = "svpilar" + contador;
    var pt = el("pattern", { id: idTijolo, width: 32, height: 16, patternUnits: "userSpaceOnUse" }, defs);
    el("rect", { width: 32, height: 16, fill: "#b5583a" }, pt);
    el("path", { d: "M0 0.5H32M0 8.5H32M8 0V8M24 8V16", stroke: "#e8dcc0", "stroke-width": 1.6 }, pt);
    var pc = el("pattern", { id: idConcreto, width: 26, height: 26, patternUnits: "userSpaceOnUse" }, defs);
    el("rect", { width: 26, height: 26, fill: "#a8a8a2" }, pc);
    el("circle", { cx: 6, cy: 7, r: 2.2, fill: "#86867f" }, pc);
    el("circle", { cx: 18, cy: 15, r: 3, fill: "#8f8f88" }, pc);
    el("circle", { cx: 9, cy: 20, r: 1.6, fill: "#77776f" }, pc);
    var pm = el("pattern", { id: idMadeira, width: 90, height: 40, patternUnits: "userSpaceOnUse" }, defs);
    el("rect", { width: 90, height: 40, fill: "#b07a43" }, pm);
    el("path", { d: "M12 0v40M30 0q4 20 0 40M52 0v40M70 0q-3 20 0 40M84 0v40", stroke: "#7d4f24", "stroke-width": 1.4, fill: "none", opacity: 0.7 }, pm);

    var X = 300, LARG = 90, TOPO0 = 64, BASE = 222;
    var grupo = el("g", { class: "sv-pilar" }, svg);
    var corpo = el("rect", { x: X - LARG / 2, width: LARG, class: "sv-pilar-corpo" }, grupo);
    var sombraPilar = el("rect", { x: X + LARG * 0.22, width: LARG * 0.28, fill: hachura45(svg, true), class: "sv-sombra" }, grupo);
    var clip = el("clipPath", { id: idClip }, defs);
    var clipRect = el("rect", { x: X - LARG / 2 - 6, width: LARG + 12 }, clip);
    var trincas = el("g", { class: "sv-trincas", "clip-path": "url(#" + idClip + ")" }, grupo);
    var cacos = el("g", { class: "sv-cacos" }, svg);
    var prensa = el("g", { class: "sv-prensa" }, svg);
    var chapa = el("rect", { x: X - 72, width: 144, height: 12, rx: 2, fill: "#4a4a4a", stroke: TINTA, "stroke-width": 1.5 }, prensa);
    var setas = [criarSeta(svg, "#c75b12", 4), criarSeta(svg, "#c75b12", 4), criarSeta(svg, "#c75b12", 4)];
    // medidor de uso da resistência
    var MX = 470, MY0 = 60, MY1 = 210;
    el("rect", { x: MX, y: MY0, width: 22, height: MY1 - MY0, rx: 4, fill: "#f3e7c9", stroke: TINTA, "stroke-width": 1.5 }, svg);
    var enche = el("rect", { x: MX + 3, width: 16, rx: 2 }, svg);
    function yMedidor(frac) { return MY1 - (MY1 - MY0) * limitar(frac / 1.25, 0, 1); }
    el("line", { x1: MX - 6, x2: MX + 28, y1: yMedidor(0.6), y2: yMedidor(0.6), stroke: "#b26a00", "stroke-width": 2, "stroke-dasharray": "4 3" }, svg);
    el("line", { x1: MX - 6, x2: MX + 28, y1: yMedidor(1), y2: yMedidor(1), stroke: VERMELHO, "stroke-width": 2.4 }, svg);
    texto(svg, MX + 32, yMedidor(0.6) + 4, "60%: sem margem", { class: "sv-texto sv-nota" });
    texto(svg, MX + 32, yMedidor(1) + 4, "100%: rompe", { class: "sv-texto sv-nota" });
    texto(svg, MX + 11, MY1 + 16, "uso", { "text-anchor": "middle", class: "sv-texto sv-nota" });
    var rotuloMat = texto(svg, 120, 90, "", { "text-anchor": "middle", class: "sv-texto sv-rotulo" });
    var explica = texto(svg, 120, 108, "", { "text-anchor": "middle", class: "sv-texto sv-nota" });

    var DESENHOS = {
      alvenaria: {
        nome: "alvenaria", fundo: idTijolo,
        modo: "trincas verticais: o tijolo racha de pé",
        trinca: function (u) {
          var d = "", n = u > 1 ? 4 : Math.ceil((u - 0.6) / 0.1);
          var xs = [X - 22, X + 14, X - 4, X + 30];
          for (var i = 0; i < n; i++) {
            var comp = (u > 1 ? 1 : (u - 0.6) / 0.4) * 110;
            var y0 = 140 - comp / 2 + i * 8, x = xs[i];
            d += "M" + x + " " + n1(y0) + "l3 " + n1(comp * 0.25) + "l-4 " + n1(comp * 0.25) + "l3 " + n1(comp * 0.25) + "l-2 " + n1(comp * 0.25);
          }
          return d;
        },
      },
      concreto: {
        nome: "concreto", fundo: idConcreto,
        modo: "trincas inclinadas: rompe em cunha",
        trinca: function (u) {
          var t = u > 1 ? 1 : (u - 0.6) / 0.4;
          var a = 44 * t;
          return "M" + (X - 40) + " 96l" + n1(a) + " " + n1(a * 1.2) + "M" + (X + 40) + " 96l" + n1(-a) + " " + n1(a * 1.2) +
            "M" + (X - 40) + " 200l" + n1(a) + " " + n1(-a * 1.2) + "M" + (X + 40) + " 200l" + n1(-a) + " " + n1(-a * 1.2);
        },
      },
      madeira: {
        nome: "madeira (fibras de pé)", fundo: idMadeira,
        modo: "as fibras enrugam e esmagam numa faixa",
        trinca: function (u) {
          var t = u > 1 ? 1 : (u - 0.6) / 0.4;
          var amp = 2 + 5 * t, d = "";
          for (var k = 0; k < 3; k++) {
            var y = 132 + k * 7;
            d += "M" + (X - 44) + " " + (y + 18) + "q10 " + n1(-amp) + " 20 -6t20 -6t20 -6t20 -6t8 -3";
          }
          return d;
        },
      },
    };

    return function () {
      var carga = valorSlider(painel, "slider-carga");
      var max = numeroDoTexto(painel, "#valor-max");
      // botão escolhido = o que o simulador pintou de #1c1e22 (mesma leitura do polimento)
      var nomeAtivo = "Alvenaria";
      painel.querySelectorAll("#botoes-material > button").forEach(function (b) {
        if (b.style.backgroundColor === "rgb(28, 30, 34)") nomeAtivo = b.textContent;
      });
      var mat = /Concreto/.test(nomeAtivo) ? DESENHOS.concreto : /Madeira/.test(nomeAtivo) ? DESENHOS.madeira : DESENHOS.alvenaria;
      if (isNaN(carga) || isNaN(max) || !max) return;
      var u = carga / max;
      var colapso = u > 1;
      var encurta = 10 * Math.min(u, 1);
      var topo = TOPO0 + encurta;
      attr(corpo, { y: n1(topo), height: n1(BASE - topo), fill: "url(#" + mat.fundo + ")" });
      attr(clipRect, { y: n1(topo), height: n1(BASE - topo) });
      attr(sombraPilar, { y: n1(topo), height: n1(BASE - topo) });
      attr(chapa, { y: n1(topo - 12) });
      [X - 46, X, X + 46].forEach(function (x, i) {
        var tam = 14 + carga * 0.22;
        setas[i].mover(x, topo - 14 - tam, x, topo - 14);
      });
      trincas.innerHTML = "";
      if (u > 0.6) el("path", { d: mat.trinca(u), class: "sv-trinca" + (colapso ? " sv-trinca-forte" : "") }, trincas);
      c.caixa.classList.toggle("sv-colapso", colapso);
      c.caixa.setAttribute("data-material", mat.nome.split(" ")[0]);
      if (colapso && !cacos.childNodes.length) {
        for (var k = 0; k < 7; k++) {
          var cx = X - 40 + Math.random() * 80, cy = 120 + Math.random() * 60;
          el("path", { d: "M" + n1(cx) + " " + n1(cy) + "l8 -3l4 7l-7 5z", class: "sv-caco", style: "--dx:" + n1((cx - X) * 1.6) + "px;--rot:" + Math.round(Math.random() * 300 - 150) + "deg" }, cacos);
        }
      } else if (!colapso && cacos.childNodes.length) cacos.innerHTML = "";
      attr(enche, { y: n1(yMedidor(u)), height: n1(MY1 - 3 - yMedidor(u)), fill: colapso ? VERMELHO : u > 0.6 ? "#e0a020" : "#3a9a5a" });
      rotuloMat.textContent = mat.nome;
      explica.textContent = u > 0.6 ? mat.modo : "firme: as tensões ainda são baixas";
    };
  }

  // ===================================================================
  // BLOCO 2 — Régua com lupa: alvo e tolerância de ±1 mm
  // ===================================================================
  function cenaRegua(painel) {
    var slider = painel.querySelector("#slider-medicao");
    if (!slider) return null;
    var c = palco(painel, null, 600, 190, slider.parentNode, slider);
    var svg = c.svg;
    var X0 = 40, X1 = 560, Y = 120, ESC = (X1 - X0) / 100;
    function px(mm) { return X0 + mm * ESC; }
    function regua(pai, escala, centro) {
      // régua desenhada em mm; na lupa ela vem ampliada em volta do cursor
      var g = el("g", null, pai);
      el("rect", { x: X0 - 14, y: Y - 2, width: X1 - X0 + 28, height: 48, rx: 4, fill: "#e8c977", stroke: TINTA, "stroke-width": 1.5 }, g);
      var d = "";
      for (var mm = 0; mm <= 100; mm++) {
        var h = mm % 10 === 0 ? 18 : mm % 5 === 0 ? 12 : 7;
        d += "M" + n1(px(mm)) + " " + (Y - 2) + "v" + h;
      }
      el("path", { d: d, stroke: TINTA, "stroke-width": 1.1 }, g);
      if (escala > 1) {
        var dd = "";
        for (var dec = 0; dec <= 1000; dec++) if (dec % 10) dd += "M" + n1(px(dec / 10)) + " " + (Y - 2) + "v3";
        el("path", { d: dd, stroke: TINTA, "stroke-width": 0.25, opacity: 0.8 }, g);
      }
      for (var k = 0; k <= 100; k += 10) texto(g, px(k), Y + 32, String(k), { "text-anchor": "middle", class: "sv-texto sv-numero" });
      el("rect", { x: px(74), y: Y - 2, width: 2 * ESC, height: 22, class: "sv-tolerancia" }, g);
      el("line", { x1: px(75), x2: px(75), y1: Y - 8, y2: Y + 22, stroke: VERMELHO, "stroke-width": escala > 1 ? 0.6 : 2 }, g);
      return g;
    }
    regua(svg, 1);
    texto(svg, px(75), Y + 58, "alvo: 75 mm (±1 mm)", { "text-anchor": "middle", class: "sv-texto sv-valor" });
    var cursor = el("g", { class: "sv-cursor" }, svg);
    el("path", { d: "M0 " + (Y - 4) + "l-9 -14h18z", fill: "#7a1f1f", stroke: TINTA, "stroke-width": 1.2 }, cursor);
    el("line", { x1: 0, x2: 0, y1: Y - 4, y2: Y + 26, stroke: "#7a1f1f", "stroke-width": 2 }, cursor);
    // lupa: um círculo que mostra a régua ampliada 4× em volta do cursor
    var R = 40, ZOOM = 4, LY = 52;
    var idClip = "svlupa" + (++contador);
    var clip = el("clipPath", { id: idClip }, svg);
    var circClip = el("circle", { r: R, cy: LY }, clip);
    var lupa = el("g", { "clip-path": "url(#" + idClip + ")" }, svg);
    el("rect", { x: 0, y: 0, width: 600, height: 190, fill: "#fbf3dc" }, lupa);
    var conteudoLupa = el("g", null, lupa);
    regua(conteudoLupa, ZOOM);
    var mira = el("line", { y1: LY - R, y2: LY + R, stroke: "#7a1f1f", "stroke-width": 1.4 }, svg);
    var aro = el("circle", { r: R, cy: LY, class: "sv-lupa-aro" }, svg);
    var cabo = el("line", { class: "sv-lupa-cabo" }, svg);

    return function () {
      var v = valorSlider(painel, "slider-medicao");
      if (isNaN(v)) return;
      var x = px(v);
      cursor.setAttribute("transform", "translate(" + n1(x) + " 0)");
      var cx = limitar(x, X0 + R, X1 - R);
      attr(circClip, { cx: n1(cx) });
      attr(aro, { cx: n1(cx) });
      attr(mira, { x1: n1(cx), x2: n1(cx) });
      attr(cabo, { x1: n1(cx + R * 0.7), y1: n1(LY + R * 0.7), x2: n1(cx + R * 1.1), y2: n1(LY + R * 1.15) });
      // amplia em volta do ponto (x, Y+8) e coloca esse ponto no centro da lupa
      conteudoLupa.setAttribute("transform", "translate(" + n1(cx) + " " + LY + ") scale(" + ZOOM + ") translate(" + n1(-x) + " " + (-(Y + 8)) + ")");
      var dentro = Math.abs(v - 75) <= 1;
      c.caixa.classList.toggle("sv-no-alvo", dentro);
    };
  }

  // ===================================================================
  // BLOCO 3 — Lei de Hooke: mola/tendão e o gráfico F × x
  // ===================================================================
  function cenaHooke(painel) {
    var grade = painel.querySelector("#slider-rigidez");
    var leitura = painel.querySelector("#valor-forca");
    var caixaLeitura = leitura ? leitura.closest("div") : null;
    if (!grade || !caixaLeitura) return null;
    var c = palco(painel, null, 600, 230, caixaLeitura.parentNode, caixaLeitura);
    var svg = c.svg;
    var Y = 150, X0 = 46, REPOUSO = 190, PX_X = 12;
    hachura(svg, 14, Y - 50, 22, 100);
    el("line", { x1: 36, y1: Y - 50, x2: 36, y2: Y + 50, stroke: TINTA, "stroke-width": 2 }, svg);
    var repouso = el("line", { x1: X0 + REPOUSO, x2: X0 + REPOUSO, y1: Y - 34, y2: Y + 44, class: "sv-tracejado" }, svg);
    texto(svg, X0 + REPOUSO, Y + 58, "sem puxar", { "text-anchor": "middle", class: "sv-texto sv-nota" });
    var mola = el("path", { class: "sv-mola" }, svg);
    var gancho = el("g", null, svg);
    var argola = el("circle", { r: 8, fill: "none", stroke: TINTA, "stroke-width": 3 }, gancho);
    var forca = criarSeta(svg, "#c75b12", 5, "sv-seta-carga");
    var cota = el("path", { class: "sv-cota" }, svg);
    var cotaTexto = texto(svg, 0, Y + 44, "x", { "text-anchor": "middle", class: "sv-texto sv-rotulo" });
    void repouso;
    // gráfico F × x
    var GX = 432, GY = 120, GW = 150, GH = 100;
    el("rect", { x: GX - 8, y: GY - GH - 12, width: GW + 18, height: GH + 32, rx: 6, fill: "#fbf3dc", stroke: TINTA, "stroke-width": 1.2 }, svg);
    el("path", { d: "M" + GX + " " + (GY - GH) + "V" + GY + "H" + (GX + GW), stroke: TINTA, "stroke-width": 1.6, fill: "none" }, svg);
    texto(svg, GX + 4, GY - GH + 8, "F", { class: "sv-texto sv-rotulo" });
    texto(svg, GX + GW - 2, GY + 14, "x", { "text-anchor": "end", class: "sv-texto sv-rotulo" });
    texto(svg, GX + GW / 2 + 8, GY - GH - 0, "F = k · x", { "text-anchor": "middle", class: "sv-texto sv-nota" });
    var reta = el("line", { x1: GX, y1: GY, stroke: CIANO, "stroke-width": 2.5 }, svg);
    var guiaX = el("line", { class: "sv-tracejado" }, svg);
    var guiaY = el("line", { class: "sv-tracejado" }, svg);
    var ponto = el("circle", { r: 5, fill: "#c75b12", stroke: TINTA, "stroke-width": 1.2 }, svg);

    return function () {
      var k = valorSlider(painel, "slider-rigidez"), x = valorSlider(painel, "slider-extensao");
      if (isNaN(k) || isNaN(x)) return;
      var F = k * x;
      var fim = X0 + REPOUSO + x * PX_X;
      var espiras = 12, amp = 15, d = "M" + X0 + " " + Y + "h14";
      var ini = X0 + 14, util = fim - 14 - ini, passo = util / (espiras * 2);
      for (var i = 0; i < espiras * 2; i++) d += "L" + n1(ini + passo * (i + 0.5)) + " " + (Y + (i % 2 ? amp : -amp));
      d += "L" + n1(fim - 14) + " " + Y + "H" + n1(fim);
      attr(mola, { d: d, "stroke-width": n1(1.6 + k * 0.42) });
      attr(argola, { cx: n1(fim + 8), cy: Y });
      var tam = 16 + F * 0.95;
      forca.mover(fim + 16, Y, Math.min(fim + 16 + tam, 420), Y);
      attr(cota, { d: "M" + (X0 + REPOUSO) + " " + (Y + 30) + "H" + n1(fim) + "M" + (X0 + REPOUSO) + " " + (Y + 25) + "v10M" + n1(fim) + " " + (Y + 25) + "v10" });
      attr(cotaTexto, { x: n1((X0 + REPOUSO + fim) / 2) });
      // gráfico: x vai de 0 a 15, F de 0 a 150
      var fx = function (xx) { return GX + xx / 15 * GW; }, fy = function (ff) { return GY - Math.min(ff, 150) / 150 * GH; };
      var xFim = Math.min(15, 150 / k);
      attr(reta, { x2: n1(fx(xFim)), y2: n1(fy(k * xFim)) });
      attr(ponto, { cx: n1(fx(x)), cy: n1(fy(F)) });
      attr(guiaX, { x1: n1(fx(x)), x2: n1(fx(x)), y1: n1(fy(F)), y2: GY });
      attr(guiaY, { x1: GX, x2: n1(fx(x)), y1: n1(fy(F)), y2: n1(fy(F)) });
    };
  }

  // ===================================================================
  // BLOCO 4 — Fadiga: barra no torno, trinca e curva S–N
  // ===================================================================
  function cenaFadiga(painel) {
    var botao = painel.querySelector("#botao-ciclo");
    var slider = painel.querySelector("#slider-estresse");
    if (!botao || !slider) return null;
    var label = slider.previousElementSibling;
    var alvo = label && label.tagName === "LABEL" ? label : slider;
    var c = palco(painel, null, 600, 220, alvo.parentNode, alvo);
    var svg = c.svg;
    var Y = 104, XT = 96, COMP = 300, ESP = 18;
    // torno
    el("rect", { x: 40, y: Y - 34, width: 56, height: 22, rx: 3, fill: "#5c5c5c", stroke: TINTA, "stroke-width": 1.5 }, svg);
    el("rect", { x: 40, y: Y + ESP + 12, width: 56, height: 22, rx: 3, fill: "#5c5c5c", stroke: TINTA, "stroke-width": 1.5 }, svg);
    el("rect", { x: 60, y: Y - 12, width: 36, height: ESP + 24, fill: "#7a7a7a", stroke: TINTA, "stroke-width": 1.5 }, svg);
    el("rect", { x: 30, y: Y + ESP + 34, width: 76, height: 70, fill: "#6a6a6a", stroke: TINTA, "stroke-width": 1.5 }, svg);
    var hachTorno = hachura45(svg, true);
    el("rect", { x: 80, y: Y - 12, width: 16, height: ESP + 24, fill: hachTorno, class: "sv-sombra" }, svg);
    el("rect", { x: 82, y: Y + ESP + 34, width: 24, height: 70, fill: hachTorno, class: "sv-sombra" }, svg);
    var barra = el("g", { class: "sv-barra" }, svg);
    barra.style.transformOrigin = XT + "px " + (Y + ESP / 2) + "px";
    var pedacoFixo = el("rect", { x: XT, y: Y, width: 14, height: ESP, class: "sv-aco" }, barra);
    var ponta = el("g", { class: "sv-barra-ponta" }, barra);
    ponta.style.transformOrigin = (XT + 14) + "px " + (Y + ESP) + "px";
    el("rect", { x: XT + 14, y: Y, width: COMP - 14, height: ESP, class: "sv-aco" }, ponta);
    el("path", { d: "M" + (XT + 30) + " " + (Y + 5) + "H" + (XT + COMP - 20), stroke: "#fff", "stroke-width": 2, opacity: 0.35 }, ponta);
    el("circle", { cx: XT + COMP - 10, cy: Y + ESP / 2, r: 4, fill: TINTA }, ponta);
    void pedacoFixo;
    var trinca = el("path", { class: "sv-trinca sv-trinca-fadiga" }, svg);
    var setaCima = criarSeta(svg, "#c75b12", 3, "sv-seta-ciclo");
    var setaBaixo = criarSeta(svg, "#c75b12", 3, "sv-seta-ciclo");
    var vidaBarra = el("rect", { x: XT, y: 196, height: 8, rx: 4 }, svg);
    el("rect", { x: XT, y: 196, width: COMP, height: 8, rx: 4, fill: "none", stroke: TINTA, "stroke-width": 1 }, svg);
    var vidaTexto = texto(svg, XT, 190, "", { class: "sv-texto sv-nota" });
    // curva S–N (formato real: aço tem joelho e limite; alumínio não)
    var GX = 440, GY = 170, GW = 140, GH = 130;
    el("rect", { x: GX - 26, y: GY - GH - 16, width: GW + 36, height: GH + 44, rx: 6, fill: "#fbf3dc", stroke: TINTA, "stroke-width": 1.2 }, svg);
    el("path", { d: "M" + GX + " " + (GY - GH) + "V" + GY + "H" + (GX + GW), stroke: TINTA, "stroke-width": 1.5, fill: "none" }, svg);
    texto(svg, GX - 20, GY - GH - 2, "tensão", { class: "sv-texto sv-nota" });
    texto(svg, GX + GW, GY + 14, "ciclos (log)", { "text-anchor": "end", class: "sv-texto sv-nota" });
    function sy(s) { return GY - (s - 10) / 90 * GH; }         // 10–100 MPa
    function lx(logN) { return GX + (logN - 3) / 5 * GW; }       // 10³–10⁸ ciclos
    var dAco = "M" + n1(lx(3)) + " " + n1(sy(100));
    for (var lg = 3; lg <= 6.01; lg += 0.25) {
      var s = Math.exp(Math.log(100) + (Math.log(25) - Math.log(100)) * (lg - 3) / 3);
      dAco += "L" + n1(lx(lg)) + " " + n1(sy(s));
    }
    dAco += "H" + n1(lx(8));
    el("path", { d: dAco, stroke: "#5a6b7a", "stroke-width": 2.4, fill: "none" }, svg);
    el("path", { d: "M" + n1(lx(3)) + " " + n1(sy(80)) + "L" + n1(lx(8)) + " " + n1(sy(14)), stroke: "#9aa3ab", "stroke-width": 1.8, "stroke-dasharray": "5 4", fill: "none" }, svg);
    texto(svg, n1(lx(6.2)), n1(sy(25) - 5), "aço: limite", { class: "sv-texto sv-nota" });
    texto(svg, n1(lx(4.7)), n1(sy(64)), "alumínio", { class: "sv-texto sv-nota sv-cinza" });
    var linhaS = el("line", { x1: GX, x2: GX + GW, class: "sv-tracejado sv-tracejado-forte" }, svg);
    var marca = el("circle", { r: 5, fill: "#c75b12", stroke: TINTA, "stroke-width": 1.2 }, svg);
    var infinito = texto(svg, GX + GW - 4, 0, "∞", { "text-anchor": "end", class: "sv-texto sv-infinito" });

    var ciclosAntes = 0;
    return function () {
      var estresse = valorSlider(painel, "slider-estresse");
      var ciclos = numeroDoTexto(painel, "#valor-ciclos");
      var limiteTxt = (painel.querySelector("#valor-limite") || {}).textContent || "";
      var semFim = /∞/.test(limiteTxt);
      var limite = semFim ? Infinity : Number(limiteTxt);
      if (isNaN(estresse) || isNaN(ciclos)) return;
      var dano = semFim ? 0 : limitar(ciclos / limite, 0, 1);
      var partiu = !semFim && ciclos >= limite;
      // trinca cresce cada vez mais rápido (dano²), como nas trincas reais
      var prof = ESP * Math.pow(dano, 2) * 0.95;
      trinca.setAttribute("d", prof > 0.5 ? "M" + (XT + 14) + " " + Y + "l-2 " + n1(prof * 0.35) + "l3 " + n1(prof * 0.3) + "l-2 " + n1(prof * 0.35) : "");
      c.caixa.classList.toggle("sv-partida", partiu);
      var amp = 4 + estresse * 0.1;
      setaCima.mover(XT + COMP - 10, Y - 10, XT + COMP - 10, Y - 10 - amp * 2);
      setaBaixo.mover(XT + COMP - 10, Y + ESP + 10, XT + COMP - 10, Y + ESP + 10 + amp * 2);
      barra.style.setProperty("--sv-giro", n1(amp * 0.5) + "deg");
      if (ciclos > ciclosAntes && movimento && !partiu) {
        barra.classList.remove("sv-ciclando");
        void barra.getBoundingClientRect();
        barra.classList.add("sv-ciclando");
        setTimeout(function () { barra.classList.remove("sv-ciclando"); }, 620);
      }
      ciclosAntes = ciclos;
      var vida = semFim ? 1 : 1 - dano;
      attr(vidaBarra, { width: n1(COMP * vida), fill: vida > 0.5 ? "#3a9a5a" : vida > 0.2 ? "#e0a020" : VERMELHO });
      vidaTexto.textContent = semFim ? "vida da peça: sem fim (abaixo do limite de fadiga)" : partiu ? "a trinca atravessou a barra!" : "vida que resta à peça";
      var yS = sy(limitar(estresse, 10, 100));
      attr(linhaS, { y1: n1(yS), y2: n1(yS) });
      if (estresse <= 25) {
        attr(marca, { cx: GX + GW - 2, cy: n1(yS) });
        infinito.setAttribute("y", n1(yS - 8));
        infinito.style.opacity = 1;
      } else {
        var lgN = 3 + 3 * (Math.log(estresse) - Math.log(100)) / (Math.log(25) - Math.log(100));
        attr(marca, { cx: n1(lx(lgN)), cy: n1(yS) });
        infinito.style.opacity = 0;
      }
    };
  }

  // ===================================================================
  // BLOCO 5 — Viga, reações P/2 e diagrama de momento fletor
  // ===================================================================
  function cenaMomento(painel) {
    var linha = painel.querySelector("#linha-momento");
    var caixaAntiga = linha ? linha.closest("div") : null;
    if (!caixaAntiga) return null;
    caixaAntiga.classList.add("sv-mostrador-compacto");
    var c = palco(painel, null, 600, 250, caixaAntiga.parentNode, caixaAntiga);
    var svg = c.svg;
    var Y = 92, CX = 300;
    var apoioE = el("path", { class: "sv-apoio-claro" }, svg);
    var apoioD = el("path", { class: "sv-apoio-claro" }, svg);
    var viga = el("path", { class: "sv-viga-simples" }, svg);
    var carga = criarSeta(svg, "#c75b12", 5, "sv-seta-carga");
    var reE = criarSeta(svg, CIANO, 4, "sv-seta-reacao");
    var reD = criarSeta(svg, CIANO, 4, "sv-seta-reacao");
    var tCarga = texto(svg, 0, 0, "", { "text-anchor": "middle", class: "sv-texto sv-valor" });
    var tReE = texto(svg, 0, 0, "", { "text-anchor": "middle", class: "sv-texto sv-nota" });
    var tReD = texto(svg, 0, 0, "", { "text-anchor": "middle", class: "sv-texto sv-nota" });
    var cota = el("path", { class: "sv-cota" }, svg);
    var tVao = texto(svg, CX, Y + 64, "", { "text-anchor": "middle", class: "sv-texto sv-nota" });
    var eixo = el("line", { class: "sv-eixo-dmf" }, svg);
    var dmf = el("path", { class: "sv-dmf" }, svg);
    var tM = texto(svg, CX, 0, "", { "text-anchor": "middle", class: "sv-texto sv-valor sv-laranja" });
    texto(svg, 16, Y + 110, "momento fletor", { class: "sv-texto sv-nota" });

    return function () {
      var L = valorSlider(painel, "slider-vao"), P = valorSlider(painel, "slider-carga-p");
      if (isNaN(L) || isNaN(P)) return;
      var meia = (70 + L * 42) / 2;
      var x0 = CX - meia, x1 = CX + meia;
      var flecha = 26 * (P * L * L * L) / (50 * 1000); // cresce com P·L³
      var d = "M" + n1(x0) + " " + Y;
      for (var k = 1; k <= 20; k++) {
        var xi = k / 20, s = xi <= 0.5 ? xi : 1 - xi;
        d += "L" + n1(x0 + xi * (x1 - x0)) + " " + n1(Y + flecha * (3 * s - 4 * s * s * s));
      }
      viga.setAttribute("d", d);
      apoioE.setAttribute("d", "M" + n1(x0) + " " + (Y + 6) + "l-11 20h22z");
      apoioD.setAttribute("d", "M" + n1(x1) + " " + (Y + 6) + "l-11 17h22zM" + n1(x1 - 11) + " " + (Y + 28) + "h22");
      var tam = 14 + P * 1.1;
      carga.mover(CX, Y - 8 - tam, CX, Y - 6 + flecha);
      attr(tCarga, { x: CX + 34, y: Y - 14 - tam * 0.5 });
      tCarga.textContent = "P = " + P + " kN";
      var tamR = 14 + P / 2 * 1.1;
      reE.mover(n1(x0), Y + 30 + tamR * 0.6, n1(x0), Y + 28);
      reD.mover(n1(x1), Y + 30 + tamR * 0.6, n1(x1), Y + 28);
      var meiaP = (P / 2).toLocaleString("pt-BR", { maximumFractionDigits: 1 }) + " kN";
      attr(tReE, { x: n1(x0 + 6), y: Y - 10 }); tReE.textContent = "P/2 = " + meiaP;
      attr(tReD, { x: n1(x1 - 6), y: Y - 10 }); tReD.textContent = "P/2 = " + meiaP;
      tReE.setAttribute("text-anchor", "start"); tReD.setAttribute("text-anchor", "end");
      cota.setAttribute("d", "M" + n1(x0) + " " + (Y + 52) + "H" + n1(x1) + "M" + n1(x0) + " " + (Y + 46) + "v12M" + n1(x1) + " " + (Y + 46) + "v12");
      tVao.textContent = "vão L = " + L + " m";
      // diagrama triangular: pico P·L/4 no meio (até 125 kN·m)
      var Y0 = Y + 104;
      var M = P * L / 4;
      var pico = 8 + 54 * M / 125;
      attr(eixo, { x1: n1(x0), x2: n1(x1), y1: Y0, y2: Y0 });
      dmf.setAttribute("d", "M" + n1(x0) + " " + Y0 + "L" + CX + " " + n1(Y0 + pico) + "L" + n1(x1) + " " + Y0 + "Z");
      attr(tM, { y: n1(Y0 + pico + 16) });
      tM.textContent = "M máx = P·L/4 = " + M.toLocaleString("pt-BR", { maximumFractionDigits: 2 }) + " kN·m";
    };
  }

  // ===================================================================
  // BLOCO 6 — A cidade: segurança × estética
  // ===================================================================
  function cenaCidade(painel) {
    var mensagem = painel.querySelector("#mensagem-orcamento");
    if (!mensagem) return null;
    var c = palco(painel, null, 600, 230, mensagem.parentNode, mensagem);
    var svg = c.svg;
    var gid = "svceu6" + (++contador);
    var defs = el("defs", null, svg);
    var grad = el("linearGradient", { id: gid, x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    var ceu1 = el("stop", { offset: "0" }, grad);
    var ceu2 = el("stop", { offset: "1" }, grad);
    el("rect", { width: 600, height: 230, fill: "url(#" + gid + ")" }, svg);
    var sol = el("circle", { cx: 520, cy: 46, r: 20, class: "sv-sol" }, svg);
    chao(svg, 200, 600);
    var cidade = el("g", { class: "sv-cidade" }, svg);
    var predios = [
      { x: 86, w: 62, h: 110 }, { x: 162, w: 58, h: 150 }, { x: 410, w: 64, h: 125 }, { x: 490, w: 72, h: 92 },
    ];
    var corposPredios = [], janelas = [], bandeiras = [], trincasP = [], travas = [];
    var hachCidade = hachura45(svg);
    predios.forEach(function (p, i) {
      var g = el("g", { class: "sv-predio" }, cidade);
      g.style.transformOrigin = (p.x + p.w / 2) + "px 200px";
      corposPredios.push({ g: g, corpo: el("rect", { x: p.x, y: 200 - p.h, width: p.w, height: p.h, stroke: TINTA, "stroke-width": 1.5 }, g), p: p });
      el("rect", { x: p.x + p.w * 0.72, y: 200 - p.h, width: p.w * 0.28, height: p.h, fill: hachCidade, class: "sv-sombra" }, g);
      var dj = "";
      for (var yy = 200 - p.h + 14; yy < 188; yy += 22) for (var xx = p.x + 10; xx < p.x + p.w - 12; xx += 18) dj += "M" + xx + " " + yy + "h9v12h-9z";
      janelas.push(el("path", { d: dj, class: "sv-janelas" }, g));
      travas.push(el("path", { d: "M" + p.x + " " + (200 - p.h) + "L" + (p.x + p.w) + " 200M" + (p.x + p.w) + " " + (200 - p.h) + "L" + p.x + " 200", class: "sv-travas" }, g));
      trincasP.push(el("path", { d: "M" + (p.x + p.w * 0.3) + " " + (200 - p.h + 8) + "l6 18l-5 12l8 20l-4 14", class: "sv-trinca" }, g));
      el("line", { x1: p.x + p.w / 2, y1: 200 - p.h, x2: p.x + p.w / 2, y2: 200 - p.h - 20, stroke: TINTA, "stroke-width": 1.5, class: "sv-mastro" }, g);
      bandeiras.push(el("path", { d: "M" + (p.x + p.w / 2) + " " + (200 - p.h - 20) + "l18 4l-18 5z", class: "sv-bandeira-cidade" }, g));
    });
    // ponte em arco no meio da cidade
    var ponte = el("g", { class: "sv-predio sv-ponte-cidade" }, cidade);
    ponte.style.transformOrigin = "315px 200px";
    var tabuleiro = el("rect", { x: 236, y: 146, width: 160, height: 10, stroke: TINTA, "stroke-width": 1.5 }, ponte);
    var arco = el("path", { d: "M240 200Q316 120 392 200", fill: "none", stroke: TINTA }, ponte);
    var pendurais = el("path", { d: "M268 156v22M292 156v-2M316 156v-5M340 156v-2M364 156v22", class: "sv-travas" }, ponte);
    var trincaPonte = el("path", { d: "M300 146l4 10", class: "sv-trinca" }, ponte);
    var flores = el("g", { class: "sv-flores" }, svg);
    [40, 150, 232, 400, 585].forEach(function (x) {
      el("circle", { cx: x, cy: 196, r: 6, fill: "#5f8a3c", stroke: TINTA, "stroke-width": 1 }, flores);
      el("circle", { cx: x + 3, cy: 193, r: 2.4, fill: "#e57373" }, flores);
    });
    // medidores: mínimo da norma em 30
    function medidor(x, rotulo) {
      el("rect", { x: x, y: 24, width: 14, height: 120, rx: 3, fill: "#f3e7c9", stroke: TINTA, "stroke-width": 1.2 }, svg);
      texto(svg, x + 7, 160, rotulo, { "text-anchor": "middle", class: "sv-texto sv-nota" });
      return el("rect", { x: x + 2.5, width: 9, rx: 2 }, svg);
    }
    var medSeg = medidor(14, "🛡️");
    var medEst = medidor(36, "🎨");
    el("line", { x1: 8, x2: 56, y1: 144 - 120 * 0.3, y2: 144 - 120 * 0.3, stroke: VERMELHO, "stroke-width": 2, "stroke-dasharray": "3 3" }, svg);
    texto(svg, 58, 144 - 120 * 0.3 + 4, "mín.", { class: "sv-texto sv-nota sv-vermelho-escuro" });

    var CORES = ["#c9734f", "#7e57c2", "#e0a83e", "#4f9a8a"];
    return function () {
      var seg = valorSlider(painel, "slider-seguranca"), est = valorSlider(painel, "slider-estetica");
      if (isNaN(seg) || isNaN(est)) return;
      var perigo = seg < 30, feio = est < 30;
      var vivo = limitar((est - 10) / 60, 0, 1);
      corposPredios.forEach(function (o, i) {
        o.corpo.setAttribute("fill", mistura("#9a9a9a", CORES[i], vivo));
        o.corpo.setAttribute("stroke-width", n1(1 + seg / 30));
      });
      tabuleiro.setAttribute("fill", mistura("#8c8c8c", "#c9a14a", vivo));
      arco.setAttribute("stroke-width", n1(2 + seg / 14));
      pendurais.style.opacity = seg >= 50 ? 1 : 0.25;
      travas.forEach(function (t) { t.style.opacity = seg >= 60 ? 0.9 : 0; });
      janelas.forEach(function (j) { j.style.opacity = feio ? 0.25 : 1; });
      bandeiras.forEach(function (b) { b.style.opacity = est >= 45 ? 1 : 0; });
      flores.style.opacity = est >= 40 ? 1 : 0;
      trincasP.concat([trincaPonte]).forEach(function (t) { t.style.opacity = perigo ? 1 : 0; });
      c.caixa.classList.toggle("sv-perigo", perigo);
      c.caixa.classList.toggle("sv-cinzento", feio);
      attr(ceu1, { "stop-color": feio ? "#b8b8b4" : "#bfd8e0" });
      attr(ceu2, { "stop-color": feio ? "#dedcd4" : "#f6ecd2" });
      sol.style.opacity = feio ? 0.25 : 1;
      attr(medSeg, { y: n1(144 - 120 * seg / 100), height: n1(120 * seg / 100 - 2), fill: perigo ? VERMELHO : "#3a9a5a" });
      attr(medEst, { y: n1(144 - 120 * est / 100), height: n1(120 * est / 100 - 2), fill: feio ? "#8c8c8c" : "#7e57c2" });
    };
  }
  function mistura(a, b, t) {
    var ca = [1, 3, 5].map(function (i) { return parseInt(a.slice(i, i + 2), 16); });
    var cb = [1, 3, 5].map(function (i) { return parseInt(b.slice(i, i + 2), 16); });
    return "#" + ca.map(function (v, i) { return Math.round(v + (cb[i] - v) * t).toString(16).padStart(2, "0"); }).join("");
  }

  // ===================================================================
  // Ligação com o simulador
  // ===================================================================
  var CENAS = {
    "0.3": cenaVento, "0.7": cenaEquilibrio, "0.8": cenaArco, "0.9": cenaViga,
    bloco1: cenaPilar, bloco2: cenaRegua, bloco3: cenaHooke, bloco4: cenaFadiga, bloco5: cenaMomento, bloco6: cenaCidade,
  };
  function chaveCena(runaId) {
    var id = String(runaId || "");
    if (CENAS[id]) return id;
    if (typeof SIMULADORES_POR_RUNA !== "undefined" && SIMULADORES_POR_RUNA[id]) return null;
    return "bloco" + id.split(".")[0];
  }

  var PRANCHAS = {
    "0.3": ["I", "Da torre açoitada pelo vento"],
    "0.7": ["II", "Do equilíbrio da viga sobre duas colunas"],
    "0.8": ["III", "Do arco romano e do seu cimbre"],
    "0.9": ["IV", "Da viga que verga sob o peso"],
    bloco1: ["V", "Do pilar e da força que o esmaga"],
    bloco2: ["VI", "Da régua e da justa medida"],
    bloco3: ["VII", "Da mola e da lei de Hooke"],
    bloco4: ["VIII", "Da barra cansada pelos ciclos"],
    bloco5: ["IX", "Do momento que dobra a viga"],
    bloco6: ["X", "Da cidade entre a beleza e a segurança"],
  };
  function legenda(painel, chave) {
    var cena = painel.querySelector(".sv-palco, .sv-caixa-cena");
    var dados = PRANCHAS[chave];
    if (!cena || !dados || painel.querySelector(".sv-legenda")) return;
    var p = document.createElement("p");
    p.className = "sv-legenda";
    p.setAttribute("aria-hidden", "true");
    p.innerHTML = "<b>Prancha " + dados[0] + "</b> " + dados[1];
    cena.parentNode.insertBefore(p, cena.nextSibling);
  }

  function montarCena(painel, runaId) {
    var chave = chaveCena(runaId);
    var construtor = chave && CENAS[chave];
    if (!construtor || painel.classList.contains("sv-vivo")) return;
    var atualizar = construtor(painel);
    if (!atualizar) return;
    legenda(painel, chave);
    painel.classList.add("sv-vivo", "sv-" + chave.replace(".", "-"));
    var agendado = false;
    function agendar() {
      if (agendado) return;
      agendado = true;
      var rodar = function () { agendado = false; try { atualizar(); } catch (e) {} };
      if (typeof requestAnimationFrame === "function") requestAnimationFrame(rodar); else setTimeout(rodar, 16);
    }
    // depois dos handlers do simulador (nos controles): o DOM já está atualizado
    painel.addEventListener("input", agendar);
    painel.addEventListener("click", agendar);
    try { atualizar(); } catch (e) {}
  }

  var criarSemCena = criarPainelSimulacao;
  criarPainelSimulacao = function (runaId) {
    var painel = criarSemCena.apply(this, arguments);
    if (painel) {
      try { montarCena(painel, runaId); } catch (e) { /* a cena nunca derruba o simulador */ }
    }
    return painel;
  };
})();
