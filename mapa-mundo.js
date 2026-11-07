/**
 * mapa-mundo.js — Mapa-mundo vivo (redesign "avançado", 07/11/2026)
 *
 * Troca a grade de quadros dos reinos por um MAPA ILUSTRADO de verdade:
 *   - cada reino vira um LUGAR desenhado (portal, vilarejo, condado com
 *     moinho, ponte estaiada, forja, torre treliçada, cidadela e a ilha);
 *   - uma estrada liga os reinos na ordem 0 → 6 e ACENDE em ouro conforme
 *     cada reino é concluído; reinos ainda não visitados ficam sob névoa;
 *   - um alfinete "Você está aqui" marca o próximo reino da jornada;
 *   - no computador (≥ 1024 px) o mapa é uma carta de 16:10; ao entrar num
 *     reino a "câmera" voa até ele e o quadro das runas abre AO LADO, por
 *     cima do mapa; ao fechar, a câmera volta;
 *   - no celular/tablet o mapa vira uma TRILHA vertical em zigue-zague: cada
 *     reino é uma parada da trilha e o quadro das runas abre ali mesmo.
 *
 * Nenhum .js existente é editado: este arquivo só ENCADEIA funções globais
 * (renderizarListaBlocos e aposRenderizarBlocos) e decora o DOM que o
 * app.js já desenha. Os contratos com os testes e com os outros arquivos
 * ficam intactos: [data-bloco-id], .tile-reino, .tile-cabecalho,
 * .cabecalho-bloco, .painel-runas-aberto e os botões de Julgamento.
 * Tudo o que é desenho é aria-hidden; o nome acessível continua sendo o
 * aria-label do .tile-cabecalho (desktop) e o <h2> do reino.
 *
 * Carregar POR ÚLTIMO (depois do vida.js): assim o encadeamento de
 * aposRenderizarBlocos roda depois de jogo.js, cadeados.js, painel-reino.js,
 * horizonte.js, revelar.js e vida.js já terem mexido nos quadros.
 * CSS: estilos/mapa-mundo.css.
 */
(function () {
  "use strict";

  if (typeof renderizarListaBlocos !== "function" || typeof reinosDados === "undefined") return;

  function combina(consulta) {
    try { return !!(window.matchMedia && window.matchMedia(consulta).matches); } catch (e) { return false; }
  }
  var movimento = !combina("(prefers-reduced-motion: reduce)");
  function ehMapaDesktop() {
    return typeof modoMapaDesktop === "function" ? modoMapaDesktop() : combina("(min-width: 1024px)");
  }

  var NS = "http://www.w3.org/2000/svg";
  var TINTA = "#3b2412";
  var ID_ILHA = typeof ilhaAmaldicoada !== "undefined" ? ilhaAmaldicoada.id : "ilha";
  var ORDEM = reinosDados.map(function (b) { return b.id; });

  // Âncora de cada lugar no mapa do computador (pé do desenho), em % da carta 16:10
  var POSICOES = {
    bloco0: [9, 80], bloco1: [28, 63], bloco2: [15, 31], bloco3: [37, 22],
    bloco4: [53, 53], bloco5: [69, 27], bloco6: [88, 20],
  };
  POSICOES[ID_ILHA] = [81, 79];

  // ---------------------------------------------------------------------
  // Nomes curtos ("Portal de Entrada") e rótulo pequeno ("Bloco 0")
  // ---------------------------------------------------------------------
  function dadosLugar(id) {
    if (id === ID_ILHA && typeof ilhaAmaldicoada !== "undefined") {
      var tituloIlha = String(ilhaAmaldicoada.title || "Ilha Amaldiçoada");
      return { nome: limparNome(tituloIlha.split(/\s+[—-]\s+/)[0]), rotulo: "Ilha bônus", hex: ilhaAmaldicoada.hex };
    }
    var bloco = reinosDados.find(function (b) { return b.id === id; });
    if (!bloco) return { nome: id, rotulo: "", hex: "#b8892c" };
    var partes = String(bloco.title).split(/\s+[—-]\s+/);
    return { nome: limparNome(partes.length > 1 ? partes.slice(1).join(" — ") : partes[0]), rotulo: "Bloco " + bloco.num, hex: bloco.hex };
  }
  function limparNome(texto) {
    // tira o emoji e os espaços do começo ("🗺️ Ilha..." → "Ilha...")
    return String(texto).replace(/^[^0-9A-Za-zÀ-ÿ]+/, "").trim();
  }
  function escapar(texto) {
    return String(texto).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  // ---------------------------------------------------------------------
  // Progresso (lê as funções do app.js; nada é gravado aqui)
  // ---------------------------------------------------------------------
  function blocoCompleto(id) {
    var bloco = reinosDados.find(function (b) { return b.id === id; });
    if (!bloco || typeof calcularProgressoBloco !== "function") return false;
    try { return !!calcularProgressoBloco(bloco).completo; } catch (e) { return false; }
  }
  function blocoIniciado(id) {
    var bloco = reinosDados.find(function (b) { return b.id === id; });
    if (!bloco || typeof calcularProgressoBloco !== "function") return false;
    try { return !!calcularProgressoBloco(bloco).iniciado; } catch (e) { return false; }
  }
  // "Você está aqui": o primeiro reino da jornada que ainda não foi concluído
  function reinoAtual() {
    for (var i = 0; i < ORDEM.length; i++) if (!blocoCompleto(ORDEM[i])) return ORDEM[i];
    return ORDEM[ORDEM.length - 1];
  }

  // ---------------------------------------------------------------------
  // Ilustrações dos lugares (viewBox 160×120; o pé do desenho fica em 80,104)
  // As cores do reino entram por CSS (.mm-acento usa var(--cor-reino)).
  // ---------------------------------------------------------------------
  var T = ' stroke="' + TINTA + '" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"';
  var TF = ' stroke="' + TINTA + '" stroke-width="1" stroke-linecap="round" fill="none"';
  var PEDRA = "#ecdfc2", PEDRA2 = "#d6c39b", PEDRA3 = "#b39c72";

  function chao(rx) {
    return '<ellipse class="mm-chao" cx="80" cy="105" rx="' + (rx || 60) + '" ry="9"/>' +
      '<ellipse class="mm-halo" cx="80" cy="104" rx="' + ((rx || 60) - 6) + '" ry="12"/>';
  }

  var ILUSTRAS = {
    // Portal de Entrada: arco de pedra com o redemoinho rúnico
    bloco0: function () {
      return chao(62) +
        '<path d="M30 106h100v-6H30z" fill="' + PEDRA2 + '"' + T + '/>' +
        '<path d="M38 100h84v-6H38z" fill="' + PEDRA + '"' + T + '/>' +
        '<path d="M60 94V46q0-21 20-23q20 2 20 23v48z" class="mm-acento mm-portal-fundo"/>' +
        '<g class="mm-gira mm-portal-giro">' +
          '<circle cx="80" cy="60" r="15" fill="none" stroke="#fff6d8" stroke-width="1.4" stroke-dasharray="3 5" opacity=".85"/>' +
          '<circle cx="80" cy="60" r="9" fill="none" stroke="#fff6d8" stroke-width="1.2" stroke-dasharray="2 3" opacity=".7"/>' +
          '<path d="M80 45v6M80 69v6M65 60h6M89 60h6" stroke="#fff6d8" stroke-width="1.4"/>' +
        '</g>' +
        '<circle class="mm-pulsa" cx="80" cy="60" r="5" fill="#fff6d8" opacity=".85"/>' +
        '<path d="M44 94V44h16v50zM100 94V44h16v50z" fill="' + PEDRA + '"' + T + '/>' +
        '<path d="M44 58h16M44 72h16M44 86h16M100 58h16M100 72h16M100 86h16M52 44v14M108 58v14M52 72v14M108 86v8"' + TF + ' opacity=".55"/>' +
        '<path d="M42 46q0-36 38-40q38 4 38 40h-18q0-21-20-23q-20 2-20 23z" fill="' + PEDRA2 + '"' + T + '/>' +
        '<path d="M74 5h12l-2 13h-8z" fill="' + PEDRA + '"' + T + '/>' +
        '<path d="M52 30l9 6M108 30l-9 6M62 17l6 8M98 17l-6 8"' + TF + ' opacity=".55"/>' +
        '<path d="M28 92V70M132 92V70" stroke="' + TINTA + '" stroke-width="3"/>' +
        '<path class="mm-chama" d="M28 70q-5-6 0-13q5 7 0 13z" fill="#e8902a" stroke="#7a2e0e" stroke-width=".8"/>' +
        '<path class="mm-chama mm-chama-2" d="M132 70q-5-6 0-13q5 7 0 13z" fill="#e8902a" stroke="#7a2e0e" stroke-width=".8"/>' +
        '<path class="mm-sombra" d="M108 44h8v50h-8zM80 6q38 4 38 40h-18q0-21-20-23z"/>';
    },

    // Vilarejo dos Sistemas Construtivos: enxaimel, tijolo e um poço
    bloco1: function () {
      return chao(64) +
        '<path d="M14 100q4-20 12-24q8 4 10 24z" fill="#7d8f55"' + T + '/>' +
        '<path d="M25 100v-6" stroke="' + TINTA + '" stroke-width="2"/>' +
        '<g class="mm-fumaca"><circle cx="122" cy="20" r="4"/><circle cx="127" cy="12" r="5"/><circle cx="133" cy="4" r="6"/></g>' +
        '<path d="M116 40V22h10v18z" fill="#b65c3c"' + T + '/>' +
        // casa de tijolo
        '<path d="M86 100V54h46v46z" fill="#c9734f"' + T + '/>' +
        '<path d="M86 62h46M86 70h46M86 78h46M86 86h46M86 94h46M97 54v8M115 54v8M106 62v8M124 62v8M97 70v8M115 70v8M106 78v8M124 78v8M97 86v8M115 86v8"' + TF + ' opacity=".45"/>' +
        '<path d="M80 56l29-28l29 28z" class="mm-acento"' + T + '/>' +
        '<path d="M102 100V82h14v18z" fill="#5a3a1c"' + T + '/>' +
        // casa de enxaimel
        '<path d="M30 100V62h46v38z" fill="#f3e7c9"' + T + '/>' +
        '<path d="M30 76h46M41 62v38M65 62v38M30 62l11 14M41 62l-11 14M65 76l11 24M76 76l-11 24M41 76l12 24M53 76l-12 24"' + ' stroke="#5a3a1c" stroke-width="2" stroke-linecap="round" fill="none"/>' +
        '<path d="M24 64l29-30l29 30z" class="mm-acento mm-acento-escuro"' + T + '/>' +
        '<path d="M48 100V86h10v14z" fill="#5a3a1c"' + T + '/>' +
        // poço
        '<path d="M64 104v-8h14v8z" fill="' + PEDRA2 + '"' + T + '/>' +
        '<path d="M65 96V86M77 96V86M62 87h18l-9-5z"' + T + ' fill="#8a5a2b"/>' +
        '<path class="mm-sombra" d="M120 54h12v46h-12zM109 28L138 56H109ZM66 62h10v38h-10zM53 34L82 64H53Z"/>';
    },

    // Condado de MecTec: torre do relógio com engrenagem, moinho e tenda
    bloco2: function () {
      return chao(64) +
        // tenda do mercado
        '<path d="M14 100l8-26h30l8 26z" fill="#f3e7c9"' + T + '/>' +
        '<path d="M22 74l-4 26M30 74l-2 26M38 74v26M46 74l2 26M54 74l4 26" class="mm-listra"/>' +
        '<path d="M18 76q19-14 38 0" class="mm-acento"' + T + '/>' +
        // torre do relógio
        '<path d="M64 100V34h32v66z" fill="' + PEDRA + '"' + T + '/>' +
        '<path d="M64 52h32M64 70h32M64 86h32"' + TF + ' opacity=".5"/>' +
        '<path d="M60 36l20-30l20 30z" class="mm-acento"' + T + '/>' +
        '<circle cx="80" cy="50" r="10" fill="#fbf3dc"' + T + '/>' +
        '<g class="mm-gira mm-gira-lento" style="transform-origin:80px 50px">' +
          '<path d="M80 41v4M80 55v4M71 50h4M85 50h4M73.6 43.6l2.8 2.8M83.6 53.6l2.8 2.8M86.4 43.6l-2.8 2.8M76.4 53.6l-2.8 2.8" stroke="' + TINTA + '" stroke-width="1.4"/>' +
          '<circle cx="80" cy="50" r="4" fill="none" stroke="' + TINTA + '" stroke-width="1.2"/>' +
        '</g>' +
        '<path d="M74 100V88q6-7 12 0v12z" fill="#5a3a1c"' + T + '/>' +
        // moinho
        '<path d="M112 100l5-40h14l5 40z" fill="' + PEDRA2 + '"' + T + '/>' +
        '<path d="M114 60h20l-10-10z" fill="#8a5a2b"' + T + '/>' +
        '<g class="mm-gira mm-moinho" style="transform-origin:124px 56px">' +
          '<path d="M124 56l-2-26h4zM124 56l26-2v4zM124 56l2 26h-4zM124 56l-26 2v-4z" fill="#f3e7c9"' + T + '/>' +
        '</g>' +
        '<circle cx="124" cy="56" r="2.6" fill="' + TINTA + '"/>' +
        '<path class="mm-sombra" d="M88 34h8v66h-8zM80 6L100 36H80ZM126 60h5l5 40h-10z"/>';
    },

    // Reino NEXUS (Tendões): ponte estaiada — os cabos são os tendões
    bloco3: function () {
      return '<ellipse class="mm-agua" cx="80" cy="106" rx="70" ry="10"/>' +
        '<path d="M22 108q8-3 16 0M58 111q8-3 16 0M98 109q8-3 16 0" class="mm-onda"/>' +
        '<ellipse class="mm-halo" cx="80" cy="102" rx="56" ry="12"/>' +
        '<path d="M8 88h144v6H8z" fill="#8f8a7f"' + T + '/>' +
        '<path d="M30 94v12M130 94v12" stroke="' + TINTA + '" stroke-width="3"/>' +
        '<g class="mm-cabos">' +
          '<path d="M80 16L14 88M80 16L28 88M80 16L42 88M80 16L56 88M80 22L68 88M80 22L92 88M80 16L104 88M80 16L118 88M80 16L132 88M80 16L146 88"/>' +
        '</g>' +
        '<g class="mm-cabos-brilho">' +
          '<path d="M80 16L14 88M80 16L42 88M80 16L118 88M80 16L146 88"/>' +
        '</g>' +
        '<path d="M74 106L78 10h4l4 96z" class="mm-acento"' + T + '/>' +
        '<path d="M76 40h8M76.6 64h6.8"' + TF + ' opacity=".6"/>' +
        '<circle cx="80" cy="12" r="3" fill="#fbf3dc"' + T + '/>' +
        '<path class="mm-sombra" d="M80 10h2l4 96h-6z"/>';
    },

    // Reino dos Músculos: a forja com a fornalha acesa e a bigorna
    bloco4: function () {
      return chao(64) +
        '<g class="mm-fumaca mm-fumaca-escura"><circle cx="112" cy="18" r="4"/><circle cx="117" cy="10" r="5"/><circle cx="124" cy="3" r="6"/></g>' +
        '<g class="mm-faiscas"><circle cx="110" cy="22" r="1.3"/><circle cx="116" cy="16" r="1"/><circle cx="106" cy="14" r="1.1"/></g>' +
        '<path d="M106 46V24h12v22z" fill="' + PEDRA2 + '"' + T + '/>' +
        '<path d="M28 100V52h104v48z" fill="' + PEDRA + '"' + T + '/>' +
        '<path d="M28 64h104M28 78h104M28 90h104M44 52v12M70 52v12M96 52v12M120 52v12M56 64v14M84 64v14M110 64v14"' + TF + ' opacity=".45"/>' +
        '<path d="M18 100l10-40v40zM142 100l-10-40v40z" fill="' + PEDRA2 + '"' + T + '/>' +
        '<path d="M22 54l58-26l58 26z" class="mm-acento"' + T + '/>' +
        '<path d="M60 100V78q20-22 40 0v22z" fill="#2b1608"' + T + '/>' +
        '<path class="mm-fornalha" d="M64 100V80q16-17 32 0v20z"/>' +
        '<path d="M98 104h26l-4-6h-18z" fill="#4a4a4a"' + T + '/>' +
        '<path d="M100 98q0-7 8-7h18q-6 3-6 7z" fill="#5c5c5c"' + T + '/>' +
        '<path class="mm-sombra" d="M116 52h16v48h-16zM80 28L138 54H80ZM132 60l10 40h-10z"/>';
    },

    // Reino dos Esqueletos: torre treliçada com farol no alto
    bloco5: function () {
      return chao(58) +
        '<g class="mm-gira mm-farol" style="transform-origin:80px 16px">' +
          '<path d="M80 16L36 4L36 28z" class="mm-raio"/>' +
          '<path d="M80 16L124 4L124 28z" class="mm-raio"/>' +
        '</g>' +
        '<path d="M50 104L71 26h18l21 78" fill="none"' + T + ' stroke-width="2.4"/>' +
        '<path d="M54 90h52M58 76h44M62 62h36M66 48h28M69 36h22"' + T + ' fill="none"/>' +
        '<path d="M50 104l56-14M106 104L54 90M54 90l48-14M106 90L58 76M58 76l40-14M102 76L62 62M62 62l32-14M98 62L66 48M66 48l25-12M94 48L69 36"' + ' stroke="' + TINTA + '" stroke-width="1.1" fill="none" opacity=".85"/>' +
        '<path d="M66 26h28v6H66z" class="mm-acento"' + T + '/>' +
        '<path d="M72 26v-8h16v8z" fill="#fbf3dc"' + T + '/>' +
        '<circle class="mm-pulsa" cx="80" cy="16" r="5" fill="#fff6d8" stroke="' + TINTA + '" stroke-width="1"/>' +
        '<path d="M76 10l4-6l4 6z" fill="' + TINTA + '"/>' +
        '<path class="mm-sombra" d="M89 26l21 78h-8l-17-78z"/>';
    },

    // A Grande Aliança: cidadela com cúpula, pórtico e torres com bandeiras
    bloco6: function () {
      return '<path class="mm-colina" d="M4 108q30-22 76-22t76 22z"/>' +
        '<ellipse class="mm-halo" cx="80" cy="100" rx="60" ry="12"/>' +
        '<path d="M16 94V58h18v36zM126 94V58h18v36z" fill="' + PEDRA + '"' + T + '/>' +
        '<path d="M14 60l11-22l11 22zM124 60l11-22l11 22z" class="mm-acento"' + T + '/>' +
        '<path d="M25 38V26M135 38V26" stroke="' + TINTA + '" stroke-width="1.4"/>' +
        '<path class="mm-bandeira" d="M25 26q6-3 12 0t12 0v8q-6-3-12 0t-12 0z"/>' +
        '<path class="mm-bandeira mm-bandeira-2" d="M135 26q6-3 12 0t12 0v8q-6-3-12 0t-12 0z"/>' +
        '<path d="M34 94V70h92v24z" fill="' + PEDRA + '"' + T + '/>' +
        '<path d="M34 70v-5h8v5M50 70v-5h8v5M102 70v-5h8v5M118 70v-5h8v5"' + T + ' fill="' + PEDRA + '"/>' +
        '<path d="M52 70V48h56v22" fill="' + PEDRA + '"' + T + '/>' +
        '<path d="M54 48q0-28 26-28t26 28z" class="mm-acento mm-cupula"' + T + '/>' +
        '<path d="M62 46q4-18 18-20"' + TF + ' stroke="#fff6d8" opacity=".5"/>' +
        '<path d="M80 20v-8" stroke="' + TINTA + '" stroke-width="1.6"/>' +
        '<circle cx="80" cy="10" r="2.6" fill="#e3b84a" stroke="' + TINTA + '" stroke-width="1"/>' +
        '<path d="M56 94V76M66 94V76M76 94V76M86 94V76M96 94V76M106 94V76" stroke="' + TINTA + '" stroke-width="2.4"/>' +
        '<path d="M52 76l28-12l28 12z" fill="' + PEDRA2 + '"' + T + '/>' +
        '<path d="M50 94h60v6H50z" fill="' + PEDRA2 + '"' + T + '/>' +
        '<path class="mm-sombra" d="M137 58h7v36h-7zM27 58h7v36h-7zM80 20q26 0 26 28h-26zM96 48h12v22h-12z"/>';
    },

    // Ilha Amaldiçoada: rocha-caveira, árvore morta e a ponte quebrada
    ilha: function () {
      return '<ellipse class="mm-agua" cx="80" cy="106" rx="74" ry="11"/>' +
        '<path d="M14 110q8-3 16 0M120 112q8-3 16 0M60 114q8-3 16 0" class="mm-onda"/>' +
        '<path d="M24 106q6-18 26-20q20-18 44-12q26 2 40 32z" fill="#8b7f6a"' + T + '/>' +
        '<path d="M58 86q-2-34 22-38q26 2 24 34q-2 10-8 12l-2 8h-28l-2-8q-6-2-6-8z" fill="#cfc4ad"' + T + '/>' +
        '<path class="mm-olho" d="M67 70q5-7 10 0q-5 6-10 0zM85 70q5-7 10 0q-5 6-10 0z"/>' +
        '<path d="M80 74l-3 7h6z" fill="' + TINTA + '"/>' +
        '<path d="M70 92v-5M76 93v-5M82 93v-5M88 92v-5"' + TF + '/>' +
        '<path d="M120 92q0-16-6-26M114 66l-8-6M116 72l8-8M118 80l-9-4"' + ' stroke="' + TINTA + '" stroke-width="2" fill="none" stroke-linecap="round"/>' +
        '<path d="M4 84h26l6 4M14 84v18M26 84v14"' + T + ' fill="none"/>' +
        '<path d="M36 88l4 10M38 90l-3 9" stroke="' + TINTA + '" stroke-width="1.2" fill="none"/>' +
        '<g class="mm-nevoa-ilha"><ellipse cx="50" cy="100" rx="22" ry="5"/><ellipse cx="110" cy="102" rx="20" ry="4"/></g>' +
        '<path class="mm-sombra" d="M90 50q16 6 14 32q-2 10-8 12l-2 8h-6z"/>';
    },
  };

  function htmlIlustra(id, classeExtra) {
    var desenho = ILUSTRAS[id] || ILUSTRAS.bloco0;
    return '<svg class="mm-ilustra mm-ilustra-' + id + (classeExtra ? " " + classeExtra : "") +
      '" viewBox="0 0 160 120" aria-hidden="true" focusable="false">' + desenho() + "</svg>";
  }

  // Névoa dos lugares ainda não visitados (só aparece por CSS em .estado-nao-iniciado)
  var HTML_NEVOA = '<span class="mm-nevoa" aria-hidden="true"><i></i><i></i><i></i></span>';
  var HTML_PINO =
    '<span class="mm-pino" aria-hidden="true">' +
      '<svg viewBox="0 0 30 40" focusable="false"><path d="M15 39C9 28 3 22 3 14a12 12 0 0 1 24 0c0 8-6 14-12 25z" fill="#8b1a1a" stroke="#3b0c0c" stroke-width="1.6"/>' +
      '<path d="M15 6l2.4 5 5.4.6-4 3.7 1.1 5.3L15 18l-4.9 2.6 1.1-5.3-4-3.7 5.4-.6z" fill="#f3d27a"/></svg>' +
      '<b>Você está aqui</b>' +
    "</span>";

  // ---------------------------------------------------------------------
  // Geometria: Catmull-Rom → Bézier cúbica (estrada do computador)
  // ---------------------------------------------------------------------
  function segmentoBezier(p0, p1, p2, p3) {
    return [
      p1,
      [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6],
      [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6],
      p2,
    ];
  }
  function pontoBezier(b, t) {
    var u = 1 - t;
    return [
      u * u * u * b[0][0] + 3 * u * u * t * b[1][0] + 3 * u * t * t * b[2][0] + t * t * t * b[3][0],
      u * u * u * b[0][1] + 3 * u * u * t * b[1][1] + 3 * u * t * t * b[2][1] + t * t * t * b[3][1],
    ];
  }
  function n1(v) { return Math.round(v * 10) / 10; }
  function dBezier(b) {
    return "M" + n1(b[0][0]) + " " + n1(b[0][1]) + "C" + n1(b[1][0]) + " " + n1(b[1][1]) + " " +
      n1(b[2][0]) + " " + n1(b[2][1]) + " " + n1(b[3][0]) + " " + n1(b[3][1]);
  }
  // Junta vários trechos num caminho só (sem repetir o "M" de cada trecho)
  function caminhoContinuo(segs) {
    return segs.map(function (b, i) { return i === 0 ? dBezier(b) : dBezier(b).replace(/^M[^C]*/, ""); }).join("");
  }
  function catmullRom(pontos) {
    var segs = [];
    for (var i = 0; i < pontos.length - 1; i++) {
      var p0 = pontos[Math.max(0, i - 1)], p3 = pontos[Math.min(pontos.length - 1, i + 2)];
      segs.push(segmentoBezier(p0, pontos[i], pontos[i + 1], p3));
    }
    return segs;
  }

  // ---------------------------------------------------------------------
  // Terreno da carta do computador (viewBox 1600×1000, mesma proporção 16:10)
  // Estilo das cartas náuticas do séc. XVI: moldura graduada, rosa-dos-
  // ventos com flor-de-lis no Norte, linhas de rumo (preto = 8 ventos,
  // verde = meios-ventos, vermelho = quartas), costa com linhas d'água,
  // montanhas hachuradas, caravela, serpente marinha, cartucho e escala.
  // ---------------------------------------------------------------------
  var LARG = 1600, ALT = 1000;
  function emCarta(id) { var p = POSICOES[id]; return [p[0] / 100 * LARG, p[1] / 100 * ALT]; }

  var segmentosEstrada = catmullRom(ORDEM.map(emCarta));
  // A estrada cruza o rio no meio do trecho 4 → 5: ali fica a pontezinha
  var pontoPonte = pontoBezier(segmentosEstrada[4], 0.5);
  var pontoPonteAntes = pontoBezier(segmentosEstrada[4], 0.47);
  var anguloPonte = Math.atan2(pontoPonte[1] - pontoPonteAntes[1], pontoPonte[0] - pontoPonteAntes[0]) * 180 / Math.PI;

  // Hachura de gravura usada nos desenhos dos lugares (um <defs> só para a página)
  function garantirDefsGlobais() {
    if (document.getElementById("mm-defs")) return;
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("id", "mm-defs");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    svg.setAttribute("width", "0");
    svg.setAttribute("height", "0");
    svg.style.cssText = "position:absolute;width:0;height:0;overflow:hidden";
    svg.innerHTML =
      '<defs>' +
        '<pattern id="mm-hachura" width="3.2" height="3.2" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">' +
          '<line x1="0" y1="0" x2="0" y2="3.2" stroke="' + TINTA + '" stroke-width="0.75" stroke-opacity="0.55"/></pattern>' +
        '<pattern id="mm-hachura-cruzada" width="3.6" height="3.6" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">' +
          '<path d="M0 0V3.6M0 0H3.6" stroke="' + TINTA + '" stroke-width="0.7" stroke-opacity="0.55"/></pattern>' +
      "</defs>";
    (document.body || document.documentElement).appendChild(svg);
  }

  function arvores(lista) {
    return lista.map(function (a, i) {
      var x = a[0], y = a[1], s = a[2] || 1;
      if (i % 3 === 1) {
        // árvore redonda de gravura (copa com sombra hachurada à direita)
        var r = 11 * s;
        return '<path class="mm-tronco" d="M' + x + " " + (y + 4 * s) + "v" + n1(-12 * s) + '"/>' +
          '<circle class="mm-arvore" cx="' + x + '" cy="' + n1(y - 14 * s) + '" r="' + n1(r) + '"/>' +
          '<path class="mm-arvore-sombra" d="M' + n1(x + r * 0.2) + " " + n1(y - 14 * s - r * 0.95) + "A" + n1(r) + " " + n1(r) + " 0 0 1 " + n1(x + r * 0.2) + " " + n1(y - 14 * s + r * 0.95) +
          "A" + n1(r * 0.75) + " " + n1(r) + " 0 0 0 " + n1(x + r * 0.2) + " " + n1(y - 14 * s - r * 0.95) + 'z"/>';
      }
      return '<path d="M' + x + " " + (y - 30 * s) + "l" + (-11 * s) + " " + (22 * s) + "h" + (22 * s) + "z" +
        "M" + x + " " + (y - 20 * s) + "l" + (-13 * s) + " " + (24 * s) + "h" + (26 * s) + 'z" class="mm-arvore"/>' +
        '<path d="M' + x + " " + (y - 20 * s) + "l" + n1(6.5 * s) + " " + n1(12 * s) + "M" + x + " " + (y - 12 * s) + "l" + n1(8 * s) + " " + n1(14 * s) + '" class="mm-arvore-risco"/>' +
        '<path d="M' + x + " " + (y + 4 * s) + "v" + (-6 * s) + '" class="mm-tronco"/>';
    }).join("");
  }
  function montanhas(lista) {
    return lista.map(function (m) {
      var x = m[0], y = m[1], w = m[2], h = m[3];
      var esq = x - w / 2, dir = x + w / 2, pico = y - h;
      // perfil um pouco irregular, como desenhado à pena
      var d = "M" + esq + " " + y + "L" + n1(x - w * 0.22) + " " + n1(y - h * 0.55) + "L" + n1(x - w * 0.12) + " " + n1(y - h * 0.62) +
        "L" + x + " " + pico + "L" + n1(x + w * 0.16) + " " + n1(y - h * 0.66) + "L" + n1(x + w * 0.24) + " " + n1(y - h * 0.6) + "L" + dir + " " + y + "z";
      var hach = "";
      for (var t = 0.14; t < 0.95; t += 0.11) {
        var px = x + (dir - x) * t, py = pico + (y - pico) * t;
        var comp = (y - py) * 0.62;
        hach += "M" + n1(px - 2) + " " + n1(py + 2) + "l" + n1(-comp * 0.38) + " " + n1(comp);
      }
      return '<path class="mm-montanha" d="' + d + '"/>' +
        '<path class="mm-montanha-hachura" d="' + hach + '"/>' +
        '<path class="mm-neve" d="M' + n1(x - w * 0.1) + " " + n1(y - h * 0.8) + "L" + x + " " + pico + "L" + n1(x + w * 0.1) + " " + n1(y - h * 0.8) +
        "l" + n1(-w * 0.05) + " " + n1(h * 0.06) + "l" + n1(-w * 0.05) + " " + n1(-h * 0.05) + 'z"/>';
    }).join("");
  }

  // Rosa-dos-ventos: 4 pontas maiores (meia clara, meia escura), 4 colaterais,
  // 8 menores, anel com graus, flor-de-lis no Norte e a cruz no Leste
  function rosaDosVentos(cx, cy, r, comFlor) {
    function ponta(angGraus, comp, larg, claro) {
      var a = (angGraus - 90) * Math.PI / 180, perp = a + Math.PI / 2;
      var tx = cx + Math.cos(a) * comp, ty = cy + Math.sin(a) * comp;
      var lx = cx + Math.cos(perp) * larg, ly = cy + Math.sin(perp) * larg;
      var rx = cx - Math.cos(perp) * larg, ry = cy - Math.sin(perp) * larg;
      return '<path class="mm-rosa-escura" d="M' + n1(cx) + " " + n1(cy) + "L" + n1(tx) + " " + n1(ty) + "L" + n1(lx) + " " + n1(ly) + 'z"/>' +
        '<path class="' + (claro ? "mm-rosa-clara" : "mm-rosa-meia") + '" d="M' + n1(cx) + " " + n1(cy) + "L" + n1(tx) + " " + n1(ty) + "L" + n1(rx) + " " + n1(ry) + 'z"/>';
    }
    var g = '<g class="mm-rosa">';
    g += '<circle class="mm-rosa-anel" cx="' + cx + '" cy="' + cy + '" r="' + r + '"/>';
    g += '<circle class="mm-rosa-anel-fino" cx="' + cx + '" cy="' + cy + '" r="' + n1(r * 0.86) + '"/>';
    var ticks = "";
    for (var k = 0; k < 64; k++) {
      var a = k * Math.PI / 32, t1 = r * (k % 2 ? 0.93 : 0.88);
      ticks += "M" + n1(cx + Math.cos(a) * t1) + " " + n1(cy + Math.sin(a) * t1) + "L" + n1(cx + Math.cos(a) * r) + " " + n1(cy + Math.sin(a) * r);
    }
    g += '<path class="mm-rosa-graus" d="' + ticks + '"/>';
    for (var i = 0; i < 8; i++) g += ponta(22.5 + i * 45, r * 0.62, r * 0.07, false);
    for (var j = 0; j < 4; j++) g += ponta(45 + j * 90, r * 0.8, r * 0.12, false);
    for (var c = 0; c < 4; c++) g += ponta(c * 90, r * 1.08, r * 0.17, true);
    g += '<circle class="mm-rosa-centro" cx="' + cx + '" cy="' + cy + '" r="' + n1(r * 0.09) + '"/>';
    if (comFlor) {
      var s = r / 34;
      g += '<g class="mm-flor-de-lis" transform="translate(' + cx + " " + n1(cy - r * 1.2) + ") scale(" + n1(s * 1.35) + ')">' +
        '<path d="M0-17C5.5-11 5.5-4 0 2C-5.5-4-5.5-11 0-17ZM-1.5 1C-10-1-15-10-9.5-15C-8.5-9-5.5-4.5-1 -2.5ZM1.5 1C10-1 15-10 9.5-15C8.5-9 5.5-4.5 1-2.5ZM-7.5 2H7.5V5.5H-7.5ZM-3 5.5L0 11L3 5.5Z"/></g>';
      g += '<path class="mm-cruz-leste" d="M' + n1(cx + r * 1.2) + " " + n1(cy - 8) + "v16M" + n1(cx + r * 1.2 - 6) + " " + n1(cy - 2) + 'h12"/>';
    }
    return g + "</g>";
  }
  // 32 linhas de rumo saindo da rosa, cortadas pela moldura
  function linhasDeRumo(cx, cy) {
    var preto = "", verde = "", vermelho = "";
    for (var k = 0; k < 32; k++) {
      var a = k * Math.PI / 16;
      var d = "M" + cx + " " + cy + "L" + n1(cx + Math.cos(a) * 2200) + " " + n1(cy + Math.sin(a) * 2200);
      if (k % 4 === 0) preto += d; else if (k % 2 === 0) verde += d; else vermelho += d;
    }
    return '<g class="mm-rumos" clip-path="url(#mm-recorte-carta)">' +
      '<path class="mm-rumo-preto" d="' + preto + '"/><path class="mm-rumo-verde" d="' + verde + '"/><path class="mm-rumo-vermelho" d="' + vermelho + '"/></g>';
  }
  // Moldura graduada (faixa de quadradinhos alternados, como latitude/longitude)
  function moldura() {
    var m = 10, f = 12, passo = 50;
    var marcas = "";
    for (var x = m + f; x < LARG - m - f; x += passo * 2) {
      marcas += "M" + x + " " + (m + f / 2) + "h" + Math.min(passo, LARG - m - f - x);
      marcas += "M" + x + " " + (ALT - m - f / 2) + "h" + Math.min(passo, LARG - m - f - x);
    }
    for (var y = m + f; y < ALT - m - f; y += passo * 2) {
      marcas += "M" + (m + f / 2) + " " + y + "v" + Math.min(passo, ALT - m - f - y);
      marcas += "M" + (LARG - m - f / 2) + " " + y + "v" + Math.min(passo, ALT - m - f - y);
    }
    var cantos = [[m, m], [LARG - m - f, m], [m, ALT - m - f], [LARG - m - f, ALT - m - f]].map(function (c) {
      return '<rect class="mm-moldura-canto" x="' + c[0] + '" y="' + c[1] + '" width="' + f + '" height="' + f + '"/>' +
        '<circle class="mm-moldura-rosinha" cx="' + (c[0] + f / 2) + '" cy="' + (c[1] + f / 2) + '" r="3"/>';
    }).join("");
    return '<g class="mm-moldura">' +
      '<rect class="mm-moldura-linha" x="' + m + '" y="' + m + '" width="' + (LARG - 2 * m) + '" height="' + (ALT - 2 * m) + '"/>' +
      '<rect class="mm-moldura-linha" x="' + (m + f) + '" y="' + (m + f) + '" width="' + (LARG - 2 * (m + f)) + '" height="' + (ALT - 2 * (m + f)) + '"/>' +
      '<rect class="mm-moldura-fina" x="' + (m + f + 5) + '" y="' + (m + f + 5) + '" width="' + (LARG - 2 * (m + f + 5)) + '" height="' + (ALT - 2 * (m + f + 5)) + '"/>' +
      '<path class="mm-moldura-graus" d="' + marcas + '"/>' + cantos + "</g>";
  }
  // Cartucho do título, com cantos côncavos e volutas, no alto à esquerda
  function cartucho() {
    var x0 = 52, y0 = 42, x1 = 430, y1 = 146, c = 14;
    function moldurinha(a0, b0, a1, b1, cc) {
      return "M" + (a0 + cc) + " " + b0 + "H" + (a1 - cc) + "A" + cc + " " + cc + " 0 0 0 " + a1 + " " + (b0 + cc) +
        "V" + (b1 - cc) + "A" + cc + " " + cc + " 0 0 0 " + (a1 - cc) + " " + b1 + "H" + (a0 + cc) +
        "A" + cc + " " + cc + " 0 0 0 " + a0 + " " + (b1 - cc) + "V" + (b0 + cc) + "A" + cc + " " + cc + " 0 0 0 " + (a0 + cc) + " " + b0 + "Z";
    }
    var meio = (y0 + y1) / 2, cxm = (x0 + x1) / 2;
    return '<g class="mm-cartucho">' +
      // volutas (rolos do pergaminho) dos dois lados
      '<path class="mm-voluta" d="M' + x0 + " " + (meio - 22) + "C" + (x0 - 30) + " " + (meio - 26) + " " + (x0 - 34) + " " + (meio + 18) + " " + (x0 - 12) + " " + (meio + 16) +
        "C" + (x0 - 2) + " " + (meio + 14) + " " + (x0 - 4) + " " + (meio + 2) + " " + (x0 - 12) + " " + (meio + 4) + '"/>' +
      '<path class="mm-voluta" d="M' + x1 + " " + (meio - 22) + "C" + (x1 + 30) + " " + (meio - 26) + " " + (x1 + 34) + " " + (meio + 18) + " " + (x1 + 12) + " " + (meio + 16) +
        "C" + (x1 + 2) + " " + (meio + 14) + " " + (x1 + 4) + " " + (meio + 2) + " " + (x1 + 12) + " " + (meio + 4) + '"/>' +
      // alças de cima e de baixo
      '<path class="mm-voluta" d="M' + (cxm - 34) + " " + y0 + "C" + (cxm - 30) + " " + (y0 - 18) + " " + (cxm + 30) + " " + (y0 - 18) + " " + (cxm + 34) + " " + y0 + '"/>' +
      '<path class="mm-voluta" d="M' + (cxm - 34) + " " + y1 + "C" + (cxm - 30) + " " + (y1 + 18) + " " + (cxm + 30) + " " + (y1 + 18) + " " + (cxm + 34) + " " + y1 + '"/>' +
      '<path class="mm-cartucho-fundo" d="' + moldurinha(x0, y0, x1, y1, c) + '"/>' +
      '<path class="mm-cartucho-filete" d="' + moldurinha(x0 + 8, y0 + 8, x1 - 8, y1 - 8, c - 4) + '"/>' +
      '<text class="mm-cartucho-sobre" x="' + cxm + '" y="' + (y0 + 34) + '" text-anchor="middle">Nova e fiel descrição das</text>' +
      '<text class="mm-cartucho-titulo" x="' + cxm + '" y="' + (y0 + 72) + '" text-anchor="middle">Terras de Borgestrável</text>' +
      '<text class="mm-cartucho-sob" x="' + cxm + '" y="' + (y0 + 93) + '" text-anchor="middle">pelos Mestres Construtores · MMXXVI</text>' +
      "</g>";
  }
  // Caravela com a cruz vermelha nas velas
  function caravela() {
    return '<g class="mm-navio"><g transform="translate(18 -92)">' +
      '<path class="mm-casco" d="M1450 868H1550L1542 884Q1500 894 1460 884Z"/>' +
      '<path class="mm-casco" d="M1528 868V856H1548L1551 868Z"/>' +
      '<path d="M1456 875H1546" stroke="' + TINTA + '" stroke-width="1.4"/>' +
      '<path d="M1478 868V816M1502 868V802M1526 856V822" stroke="' + TINTA + '" stroke-width="2.6"/>' +
      '<path class="mm-vela" d="M1465 824Q1478 830 1491 824L1493 852Q1478 859 1463 852Z"/>' +
      '<path class="mm-vela" d="M1487 810Q1502 817 1517 810L1519 846Q1502 854 1485 846Z"/>' +
      '<path class="mm-vela" d="M1526 824L1542 856L1522 852Z"/>' +
      '<path class="mm-cruz-vela" d="M1478 832V846M1472 838H1484M1502 820V838M1495 828H1509"/>' +
      '<path class="mm-flamula" d="M1502 802l16 3l-16 5z"/>' +
      '<path class="mm-onda-mar" d="M1440 892q14-7 28 0t28 0t28 0t28 0"/>' +
      "</g></g>";
  }
  // Serpente marinha ("aqui há dragões") nadando ao lado da ilha
  function serpente() {
    return '<g class="mm-serpente">' +
      '<path class="mm-serpente-corpo" d="M1124 972C1124 948 1150 948 1150 972Z"/>' +
      '<path class="mm-serpente-corpo" d="M1160 972C1160 952 1182 952 1182 972Z"/>' +
      '<path class="mm-serpente-corpo" d="M1190 972C1194 958 1204 950 1214 948C1206 956 1204 964 1206 972Z"/>' +
      '<path class="mm-serpente-corpo" d="M1114 972C1110 950 1102 938 1088 936C1078 935 1070 942 1072 948L1086 950C1092 952 1098 960 1100 972Z"/>' +
      '<path d="M1074 946L1084 948M1132 958l4 4M1140 956l4 4M1167 960l4 4M1174 958l4 4" stroke="' + TINTA + '" stroke-width="1.4"/>' +
      '<circle cx="1084" cy="942" r="2" fill="' + TINTA + '"/>' +
      '<path d="M1094 936l4-10l4 9M1102 939l5-9l3 10" class="mm-serpente-crista"/>' +
      '<path class="mm-onda-mar" d="M1060 976q16-8 32 0t32 0t32 0t32 0t32 0t32 0"/>' +
      "</g>";
  }
  // Escala de léguas com o compasso de pontas (divisor) por cima
  function escala() {
    var x0 = 1400, y = 934, seg = 40;
    var barras = "";
    for (var i = 0; i < 4; i++) barras += '<rect class="' + (i % 2 ? "mm-escala-clara" : "mm-escala-escura") + '" x="' + (x0 + i * seg) + '" y="' + (y - 4) + '" width="' + seg + '" height="8"/>';
    return '<g class="mm-escala">' + barras +
      '<text x="' + (x0 + 2 * seg) + '" y="' + (y + 24) + '" text-anchor="middle">escala de léguas mágicas</text>' +
      '<text class="mm-escala-num" x="' + x0 + '" y="' + (y - 10) + '" text-anchor="middle">0</text>' +
      '<text class="mm-escala-num" x="' + (x0 + 4 * seg) + '" y="' + (y - 10) + '" text-anchor="middle">4</text>' +
      // compasso de pontas
      '<g class="mm-compasso" transform="translate(' + (x0 + 2 * seg) + " " + (y - 70) + ')">' +
        '<path d="M0 0L-38 60M0 0L36 60" stroke="' + TINTA + '" stroke-width="3" stroke-linecap="round"/>' +
        '<path d="M-14 22Q0 30 13 22" fill="none" stroke="' + TINTA + '" stroke-width="1.6"/>' +
        '<circle r="5" fill="#c9a14a" stroke="' + TINTA + '" stroke-width="1.6"/><path d="M0-5V-14" stroke="' + TINTA + '" stroke-width="2"/>' +
      "</g></g>";
  }
  // Papel envelhecido: vincos de dobra e manchinhas
  function envelhecimento() {
    var manchas = [[300, 560, 60], [960, 160, 46], [1180, 600, 70], [620, 930, 40], [1500, 420, 52], [90, 260, 36]].map(function (m) {
      return '<circle cx="' + m[0] + '" cy="' + m[1] + '" r="' + m[2] + '" fill="url(#mm-mancha)"/>';
    }).join("");
    return '<g class="mm-envelhecido">' + manchas +
      '<path class="mm-vinco-claro" d="M800 22V978M22 500H1578"/>' +
      '<path class="mm-vinco-escuro" d="M802.5 22V978M22 502.5H1578"/></g>';
  }

  function htmlTerreno() {
    var dRio = caminhoContinuo(catmullRom([
      [pontoPonte[0] + 60, 40], [pontoPonte[0] + 70, pontoPonte[1] - 170], pontoPonte,
      [pontoPonte[0] - 40, pontoPonte[1] + 200], [1060, 780], [1030, 960],
    ]));

    var mar = "M980 1000C1010 930 1080 880 1150 840S1290 760 1380 740S1520 690 1600 660V1000Z";
    var costa = "M980 1000C1010 930 1080 880 1150 840S1290 760 1380 740S1520 690 1600 660";
    var ilhaTerra = "M1180 840C1190 790 1260 760 1320 770S1440 800 1440 845S1360 905 1300 900S1172 885 1180 840Z";
    // linhas d'água: cópias da costa e da ilha, cada vez mais longe e mais claras
    var linhasAgua = [14, 28, 46, 68].map(function (d, i) {
      return '<path class="mm-linha-agua" style="opacity:' + (0.55 - i * 0.12) + '" transform="translate(' + d * 0.7 + " " + d + ')" d="' + costa + '"/>';
    }).join("") + [1.07, 1.15, 1.25].map(function (s, i) {
      return '<path class="mm-linha-agua" style="opacity:' + (0.5 - i * 0.13) + '" transform="translate(1310 835) scale(' + s + ') translate(-1310 -835)" d="' + ilhaTerra + '"/>';
    }).join("");
    var ondas = [[1250, 962], [1555, 902], [1120, 905], [1430, 760]]
      .map(function (o) { return '<path class="mm-onda-mar" d="M' + o[0] + " " + o[1] + 'q12-8 24 0t24 0"/>'; }).join("");

    var html =
      '<svg class="mm-terreno" viewBox="0 0 ' + LARG + " " + ALT + '" preserveAspectRatio="none" aria-hidden="true" focusable="false">' +
        '<defs>' +
          '<clipPath id="mm-recorte-carta"><rect x="27" y="27" width="' + (LARG - 54) + '" height="' + (ALT - 54) + '"/></clipPath>' +
          '<radialGradient id="mm-mancha"><stop offset="0" stop-color="#8a5a2b" stop-opacity="0.13"/><stop offset="0.7" stop-color="#8a5a2b" stop-opacity="0.05"/><stop offset="1" stop-color="#8a5a2b" stop-opacity="0"/></radialGradient>' +
        "</defs>" +
        envelhecimento() +
        // mar com linhas d'água (como nas gravuras), costa dupla e a ilha
        '<path class="mm-mar" d="' + mar + '"/>' +
        linhasAgua +
        '<path class="mm-costa" d="' + costa + '"/>' +
        '<path class="mm-ilha-terra" d="' + ilhaTerra + '"/>' +
        // linhas de rumo saindo das duas rosas-dos-ventos (por baixo de tudo)
        linhasDeRumo(560, 850) + linhasDeRumo(1290, 440) +
        ondas +
        caravela() +
        serpente() +
        // rio
        '<path class="mm-rio-margem" d="' + dRio + '"/>' +
        '<path class="mm-rio" d="' + dRio + '"/>' +
        '<path class="mm-rio-brilho" d="' + dRio + '"/>' +
        // montanhas e florestas
        montanhas([[700, 120, 150, 95], [820, 150, 210, 140], [930, 130, 160, 100], [1250, 120, 170, 110], [1360, 100, 150, 80],
                   [1545, 560, 120, 80], [1470, 585, 150, 100], [70, 470, 110, 70]]) +
        arvores([[650, 470, 1], [690, 495, 1.15], [728, 470, 0.9], [760, 900, 1], [795, 925, 1.2], [835, 895, 0.9],
                 [330, 470, 0.9], [985, 610, 1], [1020, 640, 1.1], [1190, 470, 0.9], [1225, 495, 1.05], [80, 560, 1.1], [118, 585, 0.9],
                 [800, 330, 0.85], [370, 920, 1], [405, 945, 0.85], [1380, 520, 1], [960, 880, 0.9]]) +
        // estrada (base tracejada) e trilha morta da Ilha
        '<path class="mm-estrada-leito" d="' + caminhoContinuo(segmentosEstrada) + '"/>' +
        '<g class="mm-estrada">' +
          segmentosEstrada.map(function (b, i) {
            return '<path class="mm-estrada-seg" data-mm-seg="' + i + '" d="' + dBezier(b) + '"/>';
          }).join("") +
        "</g>" +
        '<path class="mm-trilha-morta" d="M' + n1(emCarta("bloco4")[0] + 90) + " " + n1(emCarta("bloco4")[1] + 120) + "Q1200 760 " + n1(emCarta(ID_ILHA)[0] - 60) + " " + n1(emCarta(ID_ILHA)[1] - 10) + '"/>' +
        // ponte sobre o rio
        '<g transform="translate(' + n1(pontoPonte[0]) + " " + n1(pontoPonte[1]) + ") rotate(" + n1(anguloPonte) + ')">' +
          '<path d="M-26 -11h52M-26 11h52" stroke="' + TINTA + '" stroke-width="3"/>' +
          '<path d="M-22 -11v22M-12 -11v22M-2 -11v22M8 -11v22M18 -11v22" stroke="' + TINTA + '" stroke-width="1.6"/>' +
        "</g>" +
        // rosas-dos-ventos, cartucho, escala e moldura graduada
        rosaDosVentos(560, 850, 62, true) +
        rosaDosVentos(1290, 440, 30, false) +
        cartucho() +
        escala() +
        moldura() +
      "</svg>" +
      // nuvens que passam por cima da carta (só enfeite)
      '<span class="mm-nuvem mm-nuvem-1" aria-hidden="true"></span>' +
      '<span class="mm-nuvem mm-nuvem-2" aria-hidden="true"></span>';
    return html;
  }

  function atualizarEstrada(raiz) {
    var segs = raiz.querySelectorAll("[data-mm-seg]");
    for (var i = 0; i < segs.length; i++) {
      var n = Number(segs[i].getAttribute("data-mm-seg"));
      segs[i].classList.toggle("mm-acesa", blocoCompleto(ORDEM[n]));
    }
  }

  // ---------------------------------------------------------------------
  // Peças comuns de cada lugar (ilustração, nome, névoa e alfinete)
  // ---------------------------------------------------------------------
  function decorarLugar(painel, cabecalho, id, atual) {
    if (!cabecalho) return;
    var lugar = dadosLugar(id);
    // O desenho vai dentro de um <span> (SVG não tem offsetTop/offsetWidth,
    // e a trilha do celular mede as posições por eles)
    if (!cabecalho.querySelector(":scope > .mm-local")) {
      cabecalho.insertAdjacentHTML("afterbegin", '<span class="mm-local" aria-hidden="true">' + htmlIlustra(id) + HTML_NEVOA + "</span>");
    }
    if (!cabecalho.querySelector(":scope > .mm-nome")) {
      var nome = document.createElement("span");
      nome.className = "mm-nome";
      nome.setAttribute("aria-hidden", "true");
      nome.innerHTML = '<small>' + escapar(lugar.rotulo) + "</small>" + escapar(lugar.nome);
      var local = cabecalho.querySelector(":scope > .mm-local");
      cabecalho.insertBefore(nome, local ? local.nextSibling : cabecalho.firstChild);
    }
    var pino = painel.querySelector(".mm-pino");
    if (atual && !pino) {
      var alvoPino = cabecalho.querySelector(":scope > .mm-local") || cabecalho;
      alvoPino.insertAdjacentHTML("beforeend", HTML_PINO);
    }
    if (!atual && pino) pino.remove();
    painel.classList.add("mm-lugar");
    painel.classList.toggle("mm-atual", !!atual);
    painel.classList.toggle("mm-visitado", id !== ID_ILHA && blocoIniciado(id));
  }

  // ---------------------------------------------------------------------
  // COMPUTADOR: a carta 16:10 com a câmera
  // ---------------------------------------------------------------------
  var zoomAnterior = null;      // reino em que a câmera estava no desenho anterior
  var aberturaPorClique = null; // reino aberto agora por clique/tecla no mapa
  var ESCALA_ZOOM = 1.7;

  // Translação (em % da carta) que leva o reino até o ponto de foco, sem
  // deixar a carta ampliada descobrir as bordas do palco
  function calcularCamera(id) {
    var p = POSICOES[id] || [50, 50];
    var focoX = p[0] > 50 ? 78 : 22;
    var focoY = 55;
    function limitar(desejado, foco) {
      var maximo = foco - foco / ESCALA_ZOOM;
      var minimo = foco + (100 - foco) / ESCALA_ZOOM - 100;
      return Math.max(minimo, Math.min(maximo, desejado));
    }
    return {
      focoX: focoX, focoY: focoY,
      tx: limitar(focoX - p[0], focoX), ty: limitar(focoY - p[1], focoY),
      lado: p[0] > 50 ? "esq" : "dir",
    };
  }
  function aplicarCamera(grade, id) {
    var c = calcularCamera(id);
    grade.style.setProperty("--mm-foco-x", c.focoX + "%");
    grade.style.setProperty("--mm-foco-y", c.focoY + "%");
    grade.style.setProperty("--mm-tx", n1(c.tx) + "%");
    grade.style.setProperty("--mm-ty", n1(c.ty) + "%");
    grade.style.setProperty("--mm-escala", String(ESCALA_ZOOM));
    return c;
  }
  function proximoQuadro(fn) {
    if (typeof requestAnimationFrame === "function") requestAnimationFrame(function () { requestAnimationFrame(fn); });
    else setTimeout(fn, 32);
  }

  function montarCarta(lista) {
    var grade = lista.querySelector(".mapa-reino-grid");
    if (!grade) return;
    lista.classList.remove("mm-trilha");
    var svgTrilha = lista.querySelector(":scope > .mm-trilha-svg");
    if (svgTrilha) svgTrilha.remove();

    var atual = reinoAtual();
    var novaGrade = !grade.classList.contains("mm-mapa");
    grade.classList.add("mm-mapa");
    if (!grade.querySelector(":scope > .mm-terreno")) grade.insertAdjacentHTML("afterbegin", htmlTerreno());
    atualizarEstrada(grade);

    grade.querySelectorAll(":scope > .tile-reino[data-bloco-id]").forEach(function (tile) {
      var id = tile.getAttribute("data-bloco-id");
      var p = POSICOES[id];
      if (p) {
        tile.style.setProperty("--mm-x", String(p[0]));
        tile.style.setProperty("--mm-y", String(p[1]));
        tile.classList.toggle("mm-dica-cima", p[1] > 60);
      }
      decorarLugar(tile, tile.querySelector(".tile-cabecalho"), id, id === atual);
      var titulo = tile.querySelector(".tile-titulo");
      if (titulo) titulo.classList.add("mm-so-leitor");
    });

    // Palco: segura a carta e o quadro aberto do reino por cima dela
    var palco = grade.parentElement && grade.parentElement.classList.contains("mm-palco") ? grade.parentElement : null;
    if (!palco) {
      palco = document.createElement("div");
      palco.className = "mm-palco";
      grade.parentNode.insertBefore(palco, grade);
      palco.appendChild(grade);
    }

    // Só UM reino aberto por vez na carta (o encadeamento abaixo garante isso)
    var painel = lista.querySelector(".painel-runas-aberto");
    var tileAberto = grade.querySelector(".tile-reino.tile-aberto");
    var idAberto = tileAberto ? tileAberto.getAttribute("data-bloco-id") : null;

    var veu = palco.querySelector(":scope > .mm-veu");
    if (painel && idAberto) {
      if (painel.parentElement !== palco) palco.appendChild(painel);
      var camera = aplicarCamera(grade, idAberto);
      palco.classList.toggle("mm-painel-esq", camera.lado === "esq");
      palco.classList.toggle("mm-painel-dir", camera.lado === "dir");
      palco.classList.add("mm-com-painel");
      if (!veu) {
        veu = document.createElement("div");
        veu.className = "mm-veu";
        veu.setAttribute("aria-hidden", "true");
        veu.addEventListener("click", function () {
          var fechar = palco.querySelector(".painel-runas-aberto .botao-fechar-painel");
          if (fechar) fechar.click();
        });
        palco.insertBefore(veu, painel);
      }
      decorarCabecalhoPainel(painel, idAberto);
      var mesmoReino = zoomAnterior === idAberto;
      if (!movimento || mesmoReino || !novaGrade) {
        grade.classList.add("mm-sem-transicao", "mm-zoom");
        proximoQuadro(function () { grade.classList.remove("mm-sem-transicao"); });
      } else {
        palco.classList.add("mm-chegando");
        proximoQuadro(function () {
          grade.classList.add("mm-zoom");
          setTimeout(function () { palco.classList.remove("mm-chegando"); }, 900);
        });
      }
      zoomAnterior = idAberto;
      if (aberturaPorClique === idAberto) rolarAte(palco);
    } else {
      palco.classList.remove("mm-com-painel", "mm-painel-esq", "mm-painel-dir", "mm-chegando");
      if (veu) veu.remove();
      if (zoomAnterior && novaGrade && movimento) {
        // a câmera volta: começa ampliada no reino que fechou e se afasta
        aplicarCamera(grade, zoomAnterior);
        grade.classList.add("mm-sem-transicao", "mm-zoom");
        proximoQuadro(function () {
          grade.classList.remove("mm-sem-transicao");
          grade.classList.remove("mm-zoom");
        });
      }
      zoomAnterior = null;
    }
    aberturaPorClique = null;
  }

  // Ilustração grande no cabeçalho do quadro aberto ("você chegou em...")
  function decorarCabecalhoPainel(painel, id) {
    if (painel.querySelector(".mm-cena-reino")) return;
    var cab = painel.querySelector(".painel-runas-cabecalho");
    if (!cab) return;
    var cena = document.createElement("div");
    cena.className = "mm-cena-reino";
    cena.setAttribute("aria-hidden", "true");
    cena.innerHTML = htmlIlustra(id);
    cab.insertBefore(cena, cab.firstChild);
  }

  function rolarAte(el) {
    if (!el || typeof el.getBoundingClientRect !== "function") return;
    var barra = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--altura-barra-nav")) || 64;
    var r = el.getBoundingClientRect();
    if (!r || (!r.top && !r.height)) return;
    var alvo = r.top + window.pageYOffset - barra - 12;
    // só rola se o começo do quadro não estiver bem à vista
    if (r.top < barra || r.top > window.innerHeight * 0.45) {
      try { window.scrollTo({ top: alvo, behavior: movimento ? "smooth" : "auto" }); } catch (e) { window.scrollTo(0, alvo); }
    }
  }

  // ---------------------------------------------------------------------
  // CELULAR/TABLET: trilha vertical em zigue-zague
  // ---------------------------------------------------------------------
  function montarTrilha(lista) {
    lista.classList.add("mm-trilha");
    var atual = reinoAtual();
    var paineis = lista.querySelectorAll(":scope > [data-bloco-id]");
    paineis.forEach(function (painel, i) {
      var id = painel.getAttribute("data-bloco-id");
      var aberto = !!painel.querySelector(".espada-card, .card-runa-negra, .lista-runas[style*='grid']");
      painel.classList.add("mm-no");
      painel.classList.toggle("mm-lado-dir", i % 2 === 1);
      painel.classList.toggle("mm-aberto", aberto);
      decorarLugar(painel, painel.querySelector(".cabecalho-bloco"), id, id === atual);
      if (aberto && aberturaPorClique === id) {
        painel.classList.add("mm-chegando");
        setTimeout(function () { painel.classList.remove("mm-chegando"); }, 900);
        proximoQuadro(function () { rolarAte(painel); });
      }
    });
    aberturaPorClique = null;
    desenharTrilhaDepois(lista);
  }

  function posicaoRelativa(el, raiz) {
    var x = 0, y = 0, atual = el;
    while (atual && atual !== raiz) {
      x += atual.offsetLeft || 0;
      y += atual.offsetTop || 0;
      atual = atual.offsetParent;
    }
    return atual === raiz ? { x: x, y: y } : null;
  }

  var trilhaAgendada = false;
  function desenharTrilhaDepois(lista) {
    if (trilhaAgendada) return;
    trilhaAgendada = true;
    proximoQuadro(function () { trilhaAgendada = false; desenharTrilha(lista); });
  }

  function desenharTrilha(lista) {
    if (!lista.classList.contains("mm-trilha")) return;
    var paineis = Array.prototype.slice.call(lista.querySelectorAll(":scope > [data-bloco-id]"));
    var pontos = [];
    paineis.forEach(function (painel) {
      var ilustra = painel.querySelector(".cabecalho-bloco > .mm-local");
      var pos = ilustra ? posicaoRelativa(ilustra, lista) : null;
      var posPainel = posicaoRelativa(painel, lista);
      if (!pos || !posPainel || !ilustra.offsetWidth) return;
      var entrada = [pos.x + ilustra.offsetWidth / 2, pos.y + ilustra.offsetHeight * (104 / 120)];
      var saida = painel.classList.contains("mm-aberto")
        ? [posPainel.x + painel.offsetWidth / 2, posPainel.y + painel.offsetHeight]
        : entrada;
      pontos.push({ id: painel.getAttribute("data-bloco-id"), entrada: entrada, saida: saida });
    });
    var svg = lista.querySelector(":scope > .mm-trilha-svg");
    if (pontos.length < 2) { if (svg) svg.remove(); return; }
    if (!svg) {
      svg = document.createElementNS(NS, "svg");
      svg.setAttribute("class", "mm-trilha-svg");
      svg.setAttribute("aria-hidden", "true");
      svg.setAttribute("focusable", "false");
      lista.insertBefore(svg, lista.firstChild);
    }
    var largura = lista.offsetWidth, altura = lista.offsetHeight;
    svg.setAttribute("width", largura);
    svg.setAttribute("height", altura);
    svg.setAttribute("viewBox", "0 0 " + largura + " " + altura);
    var html = "";
    for (var i = 0; i < pontos.length - 1; i++) {
      var a = pontos[i].saida, b = pontos[i + 1].entrada;
      var dy = Math.max(30, (b[1] - a[1]) * 0.55);
      var d = "M" + n1(a[0]) + " " + n1(a[1]) + "C" + n1(a[0]) + " " + n1(a[1] + dy) + " " + n1(b[0]) + " " + n1(b[1] - dy) + " " + n1(b[0]) + " " + n1(b[1]);
      var morta = pontos[i + 1].id === ID_ILHA;
      var acesa = !morta && blocoCompleto(pontos[i].id);
      html += '<path class="mm-trilha-leito" d="' + d + '"/>' +
        '<path class="' + (morta ? "mm-trilha-morta" : "mm-estrada-seg" + (acesa ? " mm-acesa" : "")) + '" d="' + d + '"/>';
    }
    svg.innerHTML = html;
  }

  // Redesenha a trilha quando a página muda de tamanho (fonte carregada,
  // giro do celular, quadro que abre e empurra os de baixo)
  var observadorTamanho = null;
  function vigiarTamanho(lista) {
    if (observadorTamanho || typeof ResizeObserver !== "function") return;
    var ultimaAltura = -1, ultimaLargura = -1;
    observadorTamanho = new ResizeObserver(function () {
      if (lista.offsetHeight === ultimaAltura && lista.offsetWidth === ultimaLargura) return;
      ultimaAltura = lista.offsetHeight;
      ultimaLargura = lista.offsetWidth;
      desenharTrilhaDepois(lista);
    });
    observadorTamanho.observe(lista);
  }

  // ---------------------------------------------------------------------
  // Encadeamentos
  // ---------------------------------------------------------------------
  function decorar() {
    var lista = document.getElementById("lista-blocos");
    if (!lista) return;
    garantirDefsGlobais();
    if (ehMapaDesktop() && lista.querySelector(".mapa-reino-grid")) montarCarta(lista);
    else if (lista.querySelector(":scope > [data-bloco-id]")) { montarTrilha(lista); vigiarTamanho(lista); }
  }

  // 1. Na carta só cabe UM quadro aberto: fica o último que a criança pediu
  var renderizarOriginal = window.renderizarListaBlocos;
  window.renderizarListaBlocos = function () {
    try {
      if (ehMapaDesktop() && typeof blocosAbertosDesktop !== "undefined" && Array.isArray(blocosAbertosDesktop)) {
        var pedido = typeof blocoAbertoId !== "undefined" && blocoAbertoId && blocosAbertosDesktop.indexOf(blocoAbertoId) === -1
          ? blocoAbertoId
          : blocosAbertosDesktop[blocosAbertosDesktop.length - 1];
        if (blocosAbertosDesktop.length > 1 || (pedido && blocosAbertosDesktop.indexOf(pedido) === -1)) {
          blocosAbertosDesktop = pedido ? [pedido] : [];
        }
      }
    } catch (e) { /* o desenho original segue mesmo se algo falhar aqui */ }
    return renderizarOriginal.apply(this, arguments);
  };

  // 2. Depois de cada desenho (e de cada vitória de Julgamento), decora
  if (typeof aposRenderizarBlocos === "function") {
    var aposOriginal = aposRenderizarBlocos;
    aposRenderizarBlocos = function () {
      var resultado = aposOriginal.apply(this, arguments);
      try { decorar(); } catch (e) { /* enfeite nunca derruba o jogo */ }
      return resultado;
    };
  }

  // 3. Clique/tecla num lugar: lembra quem foi aberto por ação da criança
  //    (para rolar até o quadro só nesse caso)
  document.addEventListener("click", function (ev) {
    var alvo = ev.target && ev.target.closest ? ev.target.closest("#lista-blocos .tile-cabecalho, #lista-blocos .cabecalho-bloco") : null;
    if (!alvo) return;
    var painel = alvo.closest("[data-bloco-id]");
    aberturaPorClique = painel ? painel.getAttribute("data-bloco-id") : null;
  }, true);
  document.addEventListener("keydown", function (ev) {
    if (ev.key === "Enter" || ev.key === " ") {
      var alvo = ev.target && ev.target.closest ? ev.target.closest("#lista-blocos .tile-cabecalho") : null;
      var painel = alvo ? alvo.closest("[data-bloco-id]") : null;
      if (painel) aberturaPorClique = painel.getAttribute("data-bloco-id");
    }
    // Esc fecha o reino aberto na carta (se nenhuma janela estiver por cima)
    if (ev.key === "Escape" && !document.querySelector('#modal-overlay, [id^="modal-"][id$="-overlay"], #cronica-overlay, .cronica-overlay')) {
      var fechar = document.querySelector(".mm-palco .painel-runas-aberto .botao-fechar-painel");
      if (fechar) fechar.click();
    }
  }, true);

  window.addEventListener("resize", function () {
    var lista = document.getElementById("lista-blocos");
    if (lista && lista.classList.contains("mm-trilha")) desenharTrilhaDepois(lista);
  });
  if (document.fonts && document.fonts.ready && typeof document.fonts.ready.then === "function") {
    document.fonts.ready.then(function () {
      var lista = document.getElementById("lista-blocos");
      if (lista && lista.classList.contains("mm-trilha")) desenharTrilhaDepois(lista);
    });
  }

  // Se o app.js já desenhou antes deste arquivo carregar, decora agora
  if (document.readyState !== "loading") { try { decorar(); } catch (e) {} }

  // Para testes e depuração
  window.mapaMundo = { decorar: decorar, reinoAtual: reinoAtual, calcularCamera: calcularCamera, ilustracao: htmlIlustra };
  document.documentElement.classList.add("mm-ativo");
})();
