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
        '<path class="mm-chama mm-chama-2" d="M132 70q-5-6 0-13q5 7 0 13z" fill="#e8902a" stroke="#7a2e0e" stroke-width=".8"/>';
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
        '<path d="M65 96V86M77 96V86M62 87h18l-9-5z"' + T + ' fill="#8a5a2b"/>';
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
        '<circle cx="124" cy="56" r="2.6" fill="' + TINTA + '"/>';
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
        '<circle cx="80" cy="12" r="3" fill="#fbf3dc"' + T + '/>';
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
        '<path d="M100 98q0-7 8-7h18q-6 3-6 7z" fill="#5c5c5c"' + T + '/>';
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
        '<path d="M76 10l4-6l4 6z" fill="' + TINTA + '"/>';
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
        '<path d="M50 94h60v6H50z" fill="' + PEDRA2 + '"' + T + '/>';
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
        '<g class="mm-nevoa-ilha"><ellipse cx="50" cy="100" rx="22" ry="5"/><ellipse cx="110" cy="102" rx="20" ry="4"/></g>';
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
  // ---------------------------------------------------------------------
  var LARG = 1600, ALT = 1000;
  function emCarta(id) { var p = POSICOES[id]; return [p[0] / 100 * LARG, p[1] / 100 * ALT]; }

  var segmentosEstrada = catmullRom(ORDEM.map(emCarta));
  // A estrada cruza o rio no meio do trecho 4 → 5: ali fica a pontezinha
  var pontoPonte = pontoBezier(segmentosEstrada[4], 0.5);
  var pontoPonteAntes = pontoBezier(segmentosEstrada[4], 0.47);
  var anguloPonte = Math.atan2(pontoPonte[1] - pontoPonteAntes[1], pontoPonte[0] - pontoPonteAntes[0]) * 180 / Math.PI;

  function arvores(lista) {
    return lista.map(function (a) {
      var x = a[0], y = a[1], s = a[2] || 1;
      return '<path d="M' + x + " " + (y - 30 * s) + "l" + (-11 * s) + " " + (22 * s) + "h" + (22 * s) + "z" +
        "M" + x + " " + (y - 20 * s) + "l" + (-13 * s) + " " + (24 * s) + "h" + (26 * s) + 'z" class="mm-arvore"/>' +
        '<path d="M' + x + " " + (y + 4 * s) + "v" + (-6 * s) + '" class="mm-tronco"/>';
    }).join("");
  }
  function montanhas(lista) {
    return lista.map(function (m) {
      var x = m[0], y = m[1], w = m[2], h = m[3];
      return '<path class="mm-montanha" d="M' + (x - w / 2) + " " + y + "L" + x + " " + (y - h) + "L" + (x + w / 2) + " " + y + 'z"/>' +
        '<path class="mm-montanha-sombra" d="M' + x + " " + (y - h) + "L" + (x + w / 2) + " " + y + "L" + (x + w * 0.12) + " " + y + 'z"/>' +
        '<path class="mm-neve" d="M' + (x - w * 0.11) + " " + (y - h * 0.78) + "L" + x + " " + (y - h) + "L" + (x + w * 0.11) + " " + (y - h * 0.78) +
        "l" + (-w * 0.05) + " " + (h * 0.06) + "l" + (-w * 0.06) + " " + (-h * 0.05) + 'z"/>';
    }).join("");
  }

  function htmlTerreno() {
    var dRio = caminhoContinuo(catmullRom([
      [pontoPonte[0] + 60, 40], [pontoPonte[0] + 70, pontoPonte[1] - 170], pontoPonte,
      [pontoPonte[0] - 40, pontoPonte[1] + 200], [1060, 780], [1030, 960],
    ]));

    var mar = "M980 1000C1010 930 1080 880 1150 840S1290 760 1380 740S1520 690 1600 660V1000Z";
    var ilhaTerra = "M1180 840C1190 790 1260 760 1320 770S1440 800 1440 845S1360 905 1300 900S1172 885 1180 840Z";
    var ondas = [[1060, 960], [1140, 905], [1250, 880], [1470, 760], [1530, 820], [1420, 930], [1540, 950], [1110, 990]]
      .map(function (o) { return '<path class="mm-onda-mar" d="M' + o[0] + " " + o[1] + "q12-8 24 0t24 0\"/>"; }).join("");

    var html =
      '<svg class="mm-terreno" viewBox="0 0 ' + LARG + " " + ALT + '" preserveAspectRatio="none" aria-hidden="true" focusable="false">' +
        // mar e costa (contorno duplo, como nas cartas antigas)
        '<path class="mm-mar" d="' + mar + '"/>' +
        '<path class="mm-costa-eco" d="M960 1000C990 920 1064 866 1136 826S1278 742 1372 722S1516 672 1600 640"/>' +
        '<path class="mm-costa" d="M980 1000C1010 930 1080 880 1150 840S1290 760 1380 740S1520 690 1600 660"/>' +
        ondas +
        '<path class="mm-ilha-terra" d="' + ilhaTerra + '"/>' +
        // navio
        '<g class="mm-navio"><path d="M1470 872h56l-10 14h-38z" fill="#7a4a24" stroke="' + TINTA + '" stroke-width="2"/>' +
          '<path d="M1498 872v-44M1498 830l22 30h-22zM1496 834l-18 26h18z" fill="#f6ecd2" stroke="' + TINTA + '" stroke-width="2"/></g>' +
        // rio
        '<path class="mm-rio-margem" d="' + dRio + '"/>' +
        '<path class="mm-rio" d="' + dRio + '"/>' +
        // montanhas e florestas
        montanhas([[150, 120, 150, 90], [250, 140, 170, 120], [700, 120, 150, 95], [820, 150, 210, 140], [930, 130, 160, 100],
                   [1250, 120, 170, 110], [1360, 100, 150, 80], [1545, 520, 120, 80], [1470, 545, 150, 100]]) +
        arvores([[450, 560, 1], [480, 585, 1.15], [515, 560, 0.9], [630, 820, 1], [665, 845, 1.2], [700, 815, 0.9],
                 [340, 470, 0.9], [985, 610, 1], [1020, 640, 1.1], [1180, 470, 0.9], [1215, 495, 1.05], [80, 520, 1.1], [115, 545, 0.9],
                 [800, 330, 0.85], [1330, 520, 1], [1365, 540, 0.85]]) +
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
        // cartucho do título e escala
        '<g class="mm-cartucho"><path d="M40 930h300l14 22l-14 22H40l-14-22z"/>' +
          '<text x="190" y="960" text-anchor="middle">Terras de Borgestrável</text></g>' +
        '<g class="mm-escala"><path d="M1400 70h160M1400 64v12M1440 66v8M1480 64v12M1520 66v8M1560 64v12"/>' +
          '<path d="M1400 70h40" stroke-width="6"/><path d="M1480 70h40" stroke-width="6"/>' +
          '<text x="1480" y="52" text-anchor="middle">uma légua mágica</text></g>' +
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
