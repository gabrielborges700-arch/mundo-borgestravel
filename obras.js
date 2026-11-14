/**
 * obras.js — OBRAS DO REINO: a Mesa de Projeto (etapa A1 do "Reino Vivo", 12/11/2026)
 * O visual fica em estilos/obras.css.
 *
 * O QUE ELE FAZ
 *  Cada reino pode ganhar UMA obra, projetada numa MESA DE PROJETO:
 *   - a criança escolhe CARTAS de material e de ancoragem, e a planta da obra
 *     (um desenho em escala, em SVG) muda na hora;
 *   - ajusta dois parâmetros contínuos, a FLECHA do cabo e a ESPESSURA do
 *     cabo, com CUSTO contra um orçamento do reino;
 *   - "Erguer e testar" monta a obra e aplica 3 estágios de carga (aldeões,
 *     carroças, tempestade), com MEDIDORES de verdade: carga total (kN),
 *     tensão no cabo (MPa) contra o limite do material, fator de segurança,
 *     flecha do tabuleiro (cm) e puxão na ancoragem (kN);
 *   - no fim sai um LAUDO DA OBRA selado: APROVADA, COM RESSALVA (obra fraca,
 *     que a grande tempestade da etapa B derruba) ou INTERDITADA (ferida);
 *   - o resultado FICA: no save e desenhado DENTRO do lugar do reino no mapa
 *     (ponte com gente atravessando, ruína com fumaça, ou o terreno com a
 *     placa de obra). De pé dá +20 PR uma vez; dentro de 80% do orçamento,
 *     medalha de ouro da economia (+10 PR uma vez). Ferida não tira ponto.
 *     Reformar é de graça; reconstruída depois de queda ganha placa de bronze.
 *
 *  Nesta etapa só existe a Ponte dos Tendões (Reino NEXUS, bloco3). As
 *  outras 6 obras entram na etapa A2, na mesma lista OBRAS.
 *
 * O MODELO FÍSICO (simplificado, mas de verdade)
 *  Cabo parabólico com carga uniforme w (kN/m) num vão L = 60 m:
 *   puxão horizontal H = w·L² / (8·f); tração máxima T = H·√(1 + (4f/L)²);
 *   tensão σ = T / A (dois cabos de diâmetro d); fator de segurança = limite / σ;
 *   alongamento ΔL = T·Lc / (E·A) e flecha extra ≈ (3L / 16f)·ΔL.
 *  Material frágil (ferro fundido) não escoa: rompe seco, e com carga
 *  dinâmica (solavanco, rajada) a tensão conta ×1,5. Valores de material
 *  típicos e arredondados (aço estrutural escoa ≈ 250 MPa; ferro forjado
 *  ≈ 200 MPa; ferro fundido cinzento rompe à tração ≈ 150 MPa).
 *  Fatos e runas: tensão = força/área (4.1), limite elástico (3.4), ação e
 *  reação na ancoragem (3.2), dúctil × frágil (2.3), fator de segurança (4.5),
 *  o peso do vento (2.2). Nada aqui contradiz o que o site já verificou.
 *
 * REGRAS
 *  - Nenhum arquivo existente é alterado: este arquivo encadeia
 *    aposRenderizarBlocos (carregado DEPOIS do mapa-mundo.js, para os lugares
 *    do mapa já existirem) e só usa as funções globais com typeof.
 *  - Chave nova no localStorage: borgestravel_obras, pelo wrapper do
 *    navegacao.js. Nenhuma chave antiga muda de nome ou formato.
 *  - Poder Rúnico nunca diminui. Só opacity e transform se animam; com
 *    "reduzir movimento" tudo aparece na hora.
 *
 * PARA TESTES
 *  window.obrasReino: OBRAS, calcular(cfg) (função pura), obterEstadoObras,
 *  abrirModalObra, fecharModalObra, decorar, DURACAO_ESTAGIO (ms por estágio;
 *  padrão 1800) e DURACAO_ERGUER (ms da montagem; padrão 1400).
 */
(function () {
  "use strict";
  if (typeof reinosDados === "undefined" || typeof document === "undefined") return;

  var CHAVE = "borgestravel_obras";
  var XP_OBRA = 20;
  var XP_OURO = 10;
  var TINTA = "#3b2412";
  var NS = "http://www.w3.org/2000/svg";
  var movimento = !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  // ---------------------------------------------------------------------
  // Catálogo da Mesa: materiais, ancoragens e estágios de carga
  // ---------------------------------------------------------------------
  var MATERIAIS = {
    aco: {
      id: "aco", nome: "Aço trançado", resumo: "escoa a 250 MPa · dúctil: estica e avisa",
      limite: 250, ruptura: 400, E: 200, ductil: true, preco: 1.0, moedas: "●●●", runa: "3.4",
      seda: "Fios de aço trançados: avisam esticando antes de romper. Caros, mas honestos.",
      laudo: "aço trançado, escoamento a 250 MPa, dúctil",
    },
    forjado: {
      id: "forjado", nome: "Ferro forjado", resumo: "escoa a 200 MPa · dúctil, como as pontes de correntes antigas",
      limite: 200, ruptura: 330, E: 190, ductil: true, preco: 0.7, moedas: "●●", runa: "3.1",
      seda: "Ferro forjado, como nas velhas pontes de correntes. Honesto, mas pede espessura.",
      laudo: "ferro forjado, escoamento a 200 MPa, dúctil",
    },
    fundido: {
      id: "fundido", nome: "Ferro fundido", resumo: "rompe a 150 MPa · frágil: quebra sem aviso",
      limite: 150, ruptura: 150, E: 100, ductil: false, fragil: 1.5, preco: 0.5, moedas: "●", runa: "2.3",
      seda: "Ferro fundido? Duro como pedra... e quebra como pedra. Pergunta ao ferreiro o que acontece quando puxam.",
      laudo: "ferro fundido, ruptura à tração a 150 MPa, frágil",
    },
  };
  var ORDEM_MATERIAIS = ["aco", "forjado", "fundido"];

  var ANCORAGENS = {
    rocha: { id: "rocha", nome: "Bloco na rocha", resumo: "segura até 3.000 kN de puxão", capacidade: 3000, preco: 30, runa: "3.2", falha: "ancora",
      seda: "Rocha. Agora sim alguém segura a outra ponta do cabo." },
    areia: { id: "areia", nome: "Bloco na areia", resumo: "segura até 1.000 kN, só pelo atrito", capacidade: 1000, preco: 10, runa: "3.2", falha: "ancora",
      seda: "Areia... perto é. Firme, veremos." },
    torre: { id: "torre", nome: "Só nas torres", resumo: "segura 0 kN de puxão horizontal", capacidade: 0, preco: 0, runa: "3.2", falha: "torre",
      seda: "Amarrar só na torre? E quem puxa do outro lado, aprendiz?" },
  };
  var ORDEM_ANCORAGENS = ["rocha", "areia", "torre"];

  var ESTAGIOS = [
    { id: "aldeoes", emoji: "🚶", nome: "os aldeões atravessam", q: 12, fator: 1.0, nota: "multidão de 12 kN/m" },
    { id: "carrocas", emoji: "🐴", nome: "as carroças pesadas passam", q: 20, fator: 1.2, nota: "carroças de 20 kN/m, solavanco ×1,2" },
    { id: "tempestade", emoji: "⛈️", nome: "a tempestade castiga o vão", q: 16, fator: 1.4, nota: "vento e chuva de 16 kN/m, rajadas ×1,4" },
  ];

  // A ponte: vão, peso próprio do tabuleiro, orçamento e faixas dos ajustes
  var PONTE = {
    vao: 60, pesoProprio: 8, orcamento: 170, folgaTorre: 3, precoTorrePorMetro: 1.5, exageroDesenho: 8,
    flecha: { min: 5, max: 12, passo: 0.5, padrao: 7 },
    diametro: { min: 5, max: 14, passo: 0.5, padrao: 8 },
  };

  // ---------------------------------------------------------------------
  // As obras (etapa A1: só a Ponte dos Tendões)
  // ---------------------------------------------------------------------
  var OBRAS = {
    bloco3: {
      nome: "Ponte dos Tendões",
      icone: "🌉",
      guardia: "Seda, a Tecelã dos Tendões de Aço",
      emoji: "🪢",
      falas: {
        nova: "Vês o vão, aprendiz? Do outro lado fica o mercado, e ninguém atravessa a nado. Escolhe o cabo, escolhe onde prendê-lo, acerta a flecha e a espessura. O tesoureiro te deu 170 moedas. Os números não mentem; o ferreiro, às vezes.",
        pe: "Ela canta ao vento e não se rompe. Os cabos trabalham como tendões: puxam, avisam, aguentam. Isto é obra de quem leu os números.",
        ouro: "De pé, e ainda sobrou moeda no cofre. Engenheiro bom não é o que gasta mais: é o que sabe onde a força passa.",
        fraca: "De pé... por enquanto. Folga pequena não tem onde errar. Eu, no teu lugar, não dormiria tranquila na próxima grande tempestade.",
        ferida: "Os destroços ainda estão no rio. Não baixes os olhos: toda ponte que caiu ensinou a seguinte a ficar de pé. Lê o laudo, lê a runa e volta à mesa.",
        reconstruida: "Reconstruída! Grava isto: os melhores construtores não são os que nunca erraram, são os que voltaram ao canteiro. A placa de bronze é tua.",
        orcamento: "O tesoureiro cruzou os braços: isso custa mais do que o reino tem. Afina o projeto.",
        flechaPequena: "Cabo esticado como corda de alaúde. Sabes quanto ele vai puxar?",
        flechaGrande: "Torres altas custam pedra, mas o cabo agradece: quanto mais flecha, menos puxão.",
        cabogrosso: "Cabo grosso dorme tranquilo. O tesoureiro, não.",
        cabofino: "Fino assim? Lembra: tensão é força dividida por área. Área pequena, tensão grande.",
      },
    },
  };

  // ---------------------------------------------------------------------
  // Números em português e utilidades
  // ---------------------------------------------------------------------
  function fmt(n, casas) {
    casas = casas || 0;
    try { return Number(n).toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas }); }
    catch (e) { return String(Math.round(n * Math.pow(10, casas)) / Math.pow(10, casas)).replace(".", ","); }
  }
  function escapar(texto) {
    return String(texto).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function blocoDe(id) { return reinosDados.find(function (b) { return b.id === id; }); }
  function nomeCurto(bloco) {
    var partes = String(bloco.title).split(/\s+[—-]\s+/);
    return (partes.length > 1 ? partes.slice(1).join(" — ") : partes[0]).replace(/^[^0-9A-Za-zÀ-ÿ]+/, "").trim();
  }
  function diaDeHoje() {
    var d = new Date();
    var m = String(d.getMonth() + 1), dia = String(d.getDate());
    return d.getFullYear() + "-" + (m.length < 2 ? "0" + m : m) + "-" + (dia.length < 2 ? "0" + dia : dia);
  }
  function diaPorExtenso(iso) {
    var p = String(iso || "").split("-");
    return p.length === 3 ? p[2] + "/" + p[1] + "/" + p[0] : "";
  }
  function limitar(v, a, b) { return Math.max(a, Math.min(b, v)); }

  // ---------------------------------------------------------------------
  // Estado (localStorage, pelo wrapper do navegacao.js)
  //   { bloco3: { estado: "pe" | "ferida", fraca, cfg: { material, ancoragem,
  //               flecha, diametro }, laudo: {...}, xpDado, xpOuroDado,
  //               reconstruida, ouro, quedas, dia } }
  // ---------------------------------------------------------------------
  function ler(chave) {
    if (typeof armazenamentoLer === "function") return armazenamentoLer(chave);
    try { return window.localStorage.getItem(chave); } catch (e) { return null; }
  }
  function gravar(chave, valor) {
    if (typeof armazenamentoGravar === "function") return armazenamentoGravar(chave, valor);
    try { window.localStorage.setItem(chave, valor); } catch (e) { /* bloqueado: segue só na memória */ }
  }
  function obterEstadoObras() {
    try {
      var salvo = ler(CHAVE);
      var obj = salvo ? JSON.parse(salvo) : {};
      return obj && typeof obj === "object" ? obj : {};
    } catch (e) { return {}; }
  }
  function salvarEstadoObras(estado) {
    try { gravar(CHAVE, JSON.stringify(estado)); } catch (e) { /* nunca derruba o jogo */ }
  }
  function cfgValida(cfg) {
    return !!(cfg && MATERIAIS[cfg.material] && ANCORAGENS[cfg.ancoragem] && isFinite(cfg.flecha) && isFinite(cfg.diametro));
  }
  function situacao(dados) {
    if (!dados || !dados.estado) return "terreno";
    if (dados.estado === "ferida") return "ferida";
    return dados.fraca ? "fraca" : "pe";
  }

  // ---------------------------------------------------------------------
  // O MODELO: função pura (cfg → números, veredito e porquês)
  // ---------------------------------------------------------------------
  function calcular(cfg) {
    var mat = MATERIAIS[cfg.material], anc = ANCORAGENS[cfg.ancoragem];
    var L = PONTE.vao;
    var f = limitar(Number(cfg.flecha), PONTE.flecha.min, PONTE.flecha.max);
    var d = limitar(Number(cfg.diametro), PONTE.diametro.min, PONTE.diametro.max);
    var area = 2 * Math.PI * Math.pow(d * 10 / 2, 2); // mm², dois cabos
    var alturaTorre = f + PONTE.folgaTorre;
    var custo = {
      cabo: mat ? Math.round(mat.preco * d * d) : 0,
      ancoragem: anc ? anc.preco : 0,
      torres: Math.round(2 * alturaTorre * PONTE.precoTorrePorMetro),
    };
    custo.total = custo.cabo + custo.ancoragem + custo.torres;
    custo.orcamento = PONTE.orcamento;
    custo.dentro = custo.total <= PONTE.orcamento;
    var resultado = { custo: custo, area: area, areaCm2: area / 100, alturaTorre: alturaTorre, flecha: f, diametro: d, razaoFlecha: L / f, estagios: [], completo: !!(mat && anc) };
    if (!mat || !anc) return resultado;

    var Lc = L * (1 + (8 / 3) * Math.pow(f / L, 2)); // comprimento do cabo entre as torres
    var queda = null;
    var algumRange = false, fsMin = Infinity;
    ESTAGIOS.forEach(function (e, i) {
      var w = PONTE.pesoProprio + e.q * e.fator;
      var H = w * L * L / (8 * f);
      var T = H * Math.sqrt(1 + Math.pow(4 * f / L, 2));
      var tensao = T * 1000 / area;
      var dinamico = e.fator > 1;
      var tensaoEf = mat.ductil ? tensao : tensao * (dinamico ? mat.fragil : 1);
      var fs = mat.limite / tensaoEf;
      var dL = T * Lc / (mat.E * area); // m
      var flechaExtra = (3 * L / (16 * f)) * dL * 100; // cm
      var est = {
        id: e.id, indice: i, nome: e.nome, emoji: e.emoji, nota: e.nota,
        w: w, cargaTotal: w * L, H: H, T: T, tensao: tensao, tensaoEf: tensaoEf, limite: mat.limite, fs: fs,
        flechaExtra: flechaExtra, capacidade: anc.capacidade, resultado: "ok", falha: null,
      };
      if (!queda) {
        if (anc.capacidade < H) { est.resultado = "falha"; est.falha = anc.falha; }
        else if (tensaoEf >= mat.limite) { est.resultado = "falha"; est.falha = mat.ductil ? "escoa" : "cabo"; }
        else if (fs < 1.5) { est.resultado = "range"; algumRange = true; }
        if (est.resultado === "falha") queda = est;
        else fsMin = Math.min(fsMin, fs);
      } else {
        est.resultado = "nao"; // a ponte já caiu antes deste estágio
      }
      resultado.estagios.push(est);
    });

    var motivosFraca = [];
    if (!queda && algumRange) motivosFraca.push({ runa: "4.5", texto: "o fator de segurança ficou em " + fmt(fsMin, 2) + ", abaixo de 1,5: cabo calculado quase no exato não tem onde errar (runa 4.5)" });
    if (!queda && !mat.ductil) motivosFraca.push({ runa: "2.3", texto: "ferro fundido não avisa: pode quebrar de surpresa na grande tempestade, por mais folga que tenha (runa 2.3)" });

    resultado.veredito = queda ? "ferida" : (motivosFraca.length ? "fraca" : "pe");
    resultado.fsMin = isFinite(fsMin) ? fsMin : null;
    resultado.motivosFraca = motivosFraca;
    resultado.ouro = resultado.veredito === "pe" && custo.total <= 0.8 * PONTE.orcamento;
    if (queda) {
      var porque, runa;
      if (queda.falha === "torre") {
        porque = "Sem ancoragem, ninguém segura a outra ponta: o cabo puxa o alto das torres para dentro do vão com " + fmt(queda.H) + " kN e elas vergam antes de o primeiro aldeão chegar ao meio. Toda tração precisa de uma reação do outro lado (runa 3.2).";
        runa = "3.2";
      } else if (queda.falha === "ancora") {
        porque = "O cabo puxou a ancoragem com " + fmt(queda.H) + " kN, mas a areia só segurava " + fmt(anc.capacidade) + " kN pelo atrito. O bloco deslizou, o cabo afrouxou e o tabuleiro cedeu. A reação do chão tem de ser tão forte quanto o puxão (runa 3.2).";
        runa = "3.2";
      } else if (queda.falha === "cabo") {
        porque = "A tensão chegou a " + fmt(queda.tensao) + " MPa e, com o solavanco, vale ×1,5 para um material frágil: " + fmt(queda.tensaoEf) + " MPa contra " + fmt(mat.limite) + " MPa de ruptura. O ferro fundido partiu seco, sem esticar antes. Frágil não avisa (runa 2.3).";
        runa = "2.3";
      } else {
        porque = "O cabo chegou a " + fmt(queda.tensao) + " MPa, acima do limite de escoamento de " + fmt(mat.limite) + " MPa: passou do limite elástico, esticou de vez e não voltou. O tabuleiro afundou. Mais flecha ou cabo mais grosso (runas 3.4 e 4.1).";
        runa = "3.4";
      }
      resultado.queda = { indice: queda.indice, estagio: queda.indice + 1, tipo: queda.falha, runa: runa, porque: porque, nome: queda.nome };
    }
    return resultado;
  }

  // ---------------------------------------------------------------------
  // DESENHOS: a planta da ponte (viewBox 360×210, em escala: 3,33 px por metro)
  // ---------------------------------------------------------------------
  var ESC = 200 / 60;          // px por metro
  var X_T1 = 80, X_T2 = 280;   // torres
  var Y_DECK = 140;            // tabuleiro
  var X_A1 = 36, X_A2 = 324, Y_ANC = 150; // ancoragens

  function geometria(cfg, extraPx) {
    var f = Number(cfg.flecha), fpx = f * ESC;
    var yTop = Y_DECK - (f + PONTE.folgaTorre) * ESC;
    var xm = (X_T1 + X_T2) / 2;
    var sag = fpx + (extraPx || 0);
    var cabo = "M" + X_T1 + " " + r1(yTop) + "Q" + xm + " " + r1(yTop + 2 * sag) + " " + X_T2 + " " + r1(yTop);
    var deck = "M" + (X_T1 - 12) + " " + Y_DECK + "L" + X_T1 + " " + Y_DECK + "Q" + xm + " " + r1(Y_DECK + 2 * (extraPx || 0)) + " " + X_T2 + " " + Y_DECK + "L" + (X_T2 + 12) + " " + Y_DECK;
    var pend = "";
    for (var x = X_T1 + 20; x < X_T2; x += 20) {
      var t = (x - X_T1) / (X_T2 - X_T1);
      var yc = (1 - t) * (1 - t) * yTop + 2 * (1 - t) * t * (yTop + 2 * sag) + t * t * yTop;
      var yd = Y_DECK + 2 * (1 - t) * t * 2 * (extraPx || 0) / 2; // ponto da parábola do tabuleiro
      pend += "M" + x + " " + r1(yc) + "V" + r1(yd);
    }
    var estais = "M" + X_A1 + " " + Y_ANC + "L" + X_T1 + " " + r1(yTop) + "M" + X_A2 + " " + Y_ANC + "L" + X_T2 + " " + r1(yTop);
    // cabo partido: cada ponta segue a parábola até 1/3 do vão e depois pende
    var P0 = [X_T1, yTop], C = [xm, yTop + 2 * sag], P2 = [X_T2, yTop];
    var esq = subBezier(P0, C, P2, 0, 0.34), dir = subBezier(P0, C, P2, 0.66, 1);
    var rompido = "M" + r1(esq[0][0]) + " " + r1(esq[0][1]) + "Q" + r1(esq[1][0]) + " " + r1(esq[1][1]) + " " + r1(esq[2][0]) + " " + r1(esq[2][1]) + "q-6 22 2 38" +
      "M" + r1(dir[2][0]) + " " + r1(dir[2][1]) + "Q" + r1(dir[1][0]) + " " + r1(dir[1][1]) + " " + r1(dir[0][0]) + " " + r1(dir[0][1]) + "q6 22-2 38";
    return { yTop: yTop, cabo: cabo, deck: deck, pend: pend, estais: estais, xm: xm, rompido: rompido };
  }
  // trecho [a, b] de uma Bézier quadrática (de Casteljau): devolve 3 pontos de controle
  function subBezier(P0, C, P2, a, b) {
    function ponto(t) { return [(1 - t) * (1 - t) * P0[0] + 2 * (1 - t) * t * C[0] + t * t * P2[0], (1 - t) * (1 - t) * P0[1] + 2 * (1 - t) * t * C[1] + t * t * P2[1]]; }
    function tangente(t) { return [2 * (1 - t) * (C[0] - P0[0]) + 2 * t * (P2[0] - C[0]), 2 * (1 - t) * (C[1] - P0[1]) + 2 * t * (P2[1] - C[1])]; }
    var A = ponto(a), B = ponto(b), tA = tangente(a);
    var k = (b - a) / 2;
    return [A, [A[0] + tA[0] * k, A[1] + tA[1] * k], B];
  }
  function r1(v) { return Math.round(v * 10) / 10; }

  function larguraTraco(d) { return limitar(1.2 + (d - 5) * 0.32, 1.2, 4.2); }

  // Fundo fixo da planta: céu de papel, colinas hachuradas, margens e rio
  function svgFundoPlanta() {
    return '<rect class="ob-ceu" x="0" y="36" width="360" height="174"/>' +
      '<g class="ob-nuvens"><path d="M44 74q6-12 18-8q6-12 20-4q12-2 10 10H48q-8 0-4 2z"/><path d="M250 64q6-12 18-8q6-12 20-4q12-2 10 10H254q-8 0-4 2z"/></g>' +
      '<g class="ob-raio"><path d="M186 46l-9 20h8l-8 22 18-28h-9l8-14z"/></g>' +
      '<g class="ob-vento"><path d="M14 104q20-6 40 0t36 0"/><path d="M270 98q20-6 40 0t36 0"/><path d="M130 86q14-5 28 0t28 0"/></g>' +
      '<g class="ob-chuva"><path d="M40 96l-4 12M70 90l-4 12M104 100l-4 12M136 92l-4 12M170 98l-4 12M204 90l-4 12M236 100l-4 12M268 92l-4 12M300 98l-4 12M330 92l-4 12"/></g>' +
      '<path class="ob-colina" d="M0 150q40-26 90-14L0 160z"/><path class="ob-colina" d="M360 150q-40-26-90-14l90 24z"/>' +
      '<path class="ob-rio" d="M88 168q92 10 184 0v42H88z"/>' +
      '<path class="ob-onda" d="M120 178q8-3 16 0M180 184q8-3 16 0M240 177q8-3 16 0M150 194q8-3 16 0M210 196q8-3 16 0"/>' +
      '<path class="ob-margem" d="M0 146h88l-10 64H0z"/><path class="ob-margem" d="M360 146h-88l10 64h78z"/>' +
      '<path class="ob-margem-borda" d="M0 146h88M272 146h88"/>' +
      '<path class="ob-hachura" d="M8 156l-6 6M20 156l-8 8M32 156l-8 8M44 160l-8 8M56 160l-8 8M68 160l-8 8M80 160l-8 8M292 156l8 8M304 156l8 8M316 156l8 8M328 160l8 8M340 160l8 8M352 160l8 8"/>';
  }

  // Estrutura (muda com as cartas e os ajustes): ancoragens, torres, cabos, tabuleiro
  function svgEstrutura(cfg) {
    var g = geometria(cfg, 0);
    var mat = MATERIAIS[cfg.material], anc = ANCORAGENS[cfg.ancoragem];
    var esb = !mat || !anc; // sem as 2 cartas, a planta é só um esboço tracejado
    var traco = larguraTraco(Number(cfg.diametro));
    var classeCabo = "ob-cabo ob-cabo-" + (mat ? mat.id : "esboco");
    var s = "";
    // ancoragens
    if (anc && anc.id === "rocha") {
      s += '<path class="ob-rocha" d="M8 146l10-10 14 2 12 8-4 20H6z"/><path class="ob-rocha" d="M352 146l-10-10-14 2-12 8 4 20h30z"/>' +
        '<path class="ob-hachura-forte" d="M14 150l-6 6M26 148l-10 10M38 150l-10 10M346 150l6 6M334 148l10 10M322 150l10 10"/>' +
        '<rect class="ob-ancora ob-ancora-e" x="26" y="146" width="20" height="14" rx="1"/><rect class="ob-ancora ob-ancora-d" x="314" y="146" width="20" height="14" rx="1"/>';
    } else if (anc && anc.id === "areia") {
      s += '<path class="ob-areia" d="M4 146h80v10H4z"/><path class="ob-areia" d="M276 146h80v10h-80z"/>' +
        '<path class="ob-pontos" d="M10 150h1M20 153h1M30 149h1M50 152h1M62 149h1M74 153h1M286 150h1M298 153h1M310 149h1M330 152h1M342 149h1M352 153h1"/>' +
        '<rect class="ob-ancora ob-ancora-e" x="26" y="134" width="20" height="12" rx="1"/><rect class="ob-ancora ob-ancora-d" x="314" y="134" width="20" height="12" rx="1"/>';
    }
    // torres (origem da rotação no pé)
    var hT = Y_DECK - g.yTop + 6;
    s += '<rect class="ob-torre ob-torre-e' + (esb ? " ob-esboco" : "") + '" x="' + (X_T1 - 4) + '" y="' + r1(g.yTop) + '" width="8" height="' + r1(hT) + '"/>' +
      '<rect class="ob-torre ob-torre-d' + (esb ? " ob-esboco" : "") + '" x="' + (X_T2 - 4) + '" y="' + r1(g.yTop) + '" width="8" height="' + r1(hT) + '"/>' +
      '<path class="ob-torre-base" d="M' + (X_T1 - 8) + ' ' + (Y_DECK + 6) + 'h16v4h-16zM' + (X_T2 - 8) + ' ' + (Y_DECK + 6) + 'h16v4h-16z"/>';
    // estais de ré (só com ancoragem)
    if (anc && anc.id !== "torre") {
      s += '<path class="' + classeCabo + ' ob-estais" d="' + g.estais + '" style="stroke-width:' + traco + 'px"/>';
    } else if (anc && anc.id === "torre") {
      s += '<path class="ob-no" d="M' + (X_T1 - 6) + ' ' + r1(g.yTop + 2) + 'h12M' + (X_T2 - 6) + ' ' + r1(g.yTop + 2) + 'h12"/>';
    }
    // cabo principal, pendurais e tabuleiro
    s += '<path class="' + classeCabo + ' ob-cabo-principal' + (esb ? " ob-esboco" : "") + '" d="' + g.cabo + '" style="stroke-width:' + traco + 'px"/>';
    if (mat && mat.id === "aco") s += '<path class="ob-cabo-brilho" d="' + g.cabo + '" style="stroke-width:' + Math.max(0.6, traco * 0.35) + 'px"/>';
    if (mat && mat.id === "forjado") s += '<path class="ob-cabo-elos" d="' + g.cabo + '" style="stroke-width:' + Math.max(0.8, traco * 0.45) + 'px"/>';
    if (mat && mat.id === "fundido") s += '<path class="ob-cabo-bolhas" d="' + g.cabo + '" style="stroke-width:' + Math.max(0.8, traco * 0.4) + 'px"/>';
    s += '<path class="ob-pendurais' + (esb ? " ob-esboco" : "") + '" d="' + g.pend + '"/>' +
      '<path class="ob-tabuleiro' + (esb ? " ob-esboco" : "") + '" d="' + g.deck + '"/>' +
      '<path class="ob-trinca" d="M' + (g.xm - 6) + ' ' + (Y_DECK - 3) + 'l5 8-4 5 6 6"/>' +
      '<path class="ob-cabo-rompido" d="' + g.rompido + '" style="stroke-width:' + Math.max(1.6, traco) + 'px"/>' +
      '<path class="ob-bandeira-haste" d="M' + X_T1 + ' ' + r1(g.yTop) + 'V' + r1(g.yTop - 14) + '"/>' +
      '<path class="ob-bandeira" d="M' + X_T1 + ' ' + r1(g.yTop - 14) + 'l14 4-14 4z"/>' +
      // cotas: vão e flecha
      '<g class="ob-cotas"><path d="M' + X_T1 + ' 196V190M' + X_T2 + ' 196V190M' + X_T1 + ' 193H' + X_T2 + '"/>' +
      '<text x="' + g.xm + '" y="205" text-anchor="middle">vão ' + fmt(PONTE.vao) + ' m</text>' +
      '<path d="M' + (g.xm + 46) + ' ' + r1(g.yTop) + 'H' + (g.xm + 54) + 'M' + (g.xm + 46) + ' ' + r1(g.yTop + Number(cfg.flecha) * ESC) + 'H' + (g.xm + 54) + 'M' + (g.xm + 50) + ' ' + r1(g.yTop) + 'V' + r1(g.yTop + Number(cfg.flecha) * ESC) + '"/>' +
      '<text x="' + (g.xm + 56) + '" y="' + r1(g.yTop + Number(cfg.flecha) * ESC / 2 + 3.5) + '">f = ' + fmt(cfg.flecha, 1) + ' m</text></g>';
    // cargas (ficam escondidas até o teste)
    s += '<g class="ob-carga ob-carga-aldeoes">' + figuras(5) + "</g>" +
      '<g class="ob-carga ob-carga-carrocas">' + carrocas(2) + "</g>" +
      '<g class="ob-andantes-planta">' + figuras(3) + "</g>";
    return s;
  }
  function figuras(n) {
    var s = "";
    for (var i = 0; i < n; i++) {
      var x = i * 18;
      s += '<g class="ob-figura" transform="translate(' + x + ' 0)"><circle cx="0" cy="' + (Y_DECK - 11) + '" r="2.4"/><path d="M0 ' + (Y_DECK - 8.5) + 'V' + (Y_DECK - 3) + 'M0 ' + (Y_DECK - 3) + 'l-2.4 3M0 ' + (Y_DECK - 3) + 'l2.4 3M-2.6 ' + (Y_DECK - 6.5) + 'h5.2"/></g>';
    }
    return s;
  }
  function carrocas(n) {
    var s = "";
    for (var i = 0; i < n; i++) {
      var x = i * 46;
      s += '<g class="ob-carroca" transform="translate(' + x + ' 0)"><rect x="0" y="' + (Y_DECK - 13) + '" width="22" height="9" rx="1"/><path d="M4 ' + (Y_DECK - 13) + 'v-4h14v4"/><circle cx="5" cy="' + (Y_DECK - 2.5) + '" r="2.6"/><circle cx="17" cy="' + (Y_DECK - 2.5) + '" r="2.6"/>' +
        '<path d="M22 ' + (Y_DECK - 8) + 'h6l4-5 3 2-2 4v6M30 ' + (Y_DECK - 1) + 'v-4M34 ' + (Y_DECK - 1) + 'v-4"/></g>';
    }
    return s;
  }

  // Mostrador de tensão: meio-círculo de latão com ponteiro
  function svgMedidor() {
    return '<svg class="ob-medidor-svg" viewBox="0 0 120 72" aria-hidden="true" focusable="false">' +
      '<path class="ob-med-aro" d="M8 64A52 52 0 0 1 112 64"/>' +
      '<path class="ob-med-verde" d="M8 64A52 52 0 0 1 32.4 19.6"/>' +
      '<path class="ob-med-ambar" d="M32.4 19.6A52 52 0 0 1 86 18.9"/>' +
      '<path class="ob-med-vermelho" d="M86 18.9A52 52 0 0 1 112 64"/>' +
      '<path class="ob-med-ticks" d="M12 64h6M60 12v6M106 64h-6M30.9 23.6l3.1 4.4M86.5 18.6l-1.8 5.1"/>' +
      '<text class="ob-med-txt" x="14" y="58">0</text><text class="ob-med-txt" x="78" y="30">limite</text>' +
      '<g class="ob-med-ponteiro"><path d="M60 64L58 60 60 18 62 60z"/><circle cx="60" cy="64" r="4"/></g>' +
      "</svg>";
  }

  // ---------------------------------------------------------------------
  // O MAPA: a obra DENTRO do lugar do reino (mesmo viewBox 160×120 da
  // ilustração do mapa-mundo.js, sobreposta no canto inferior direito)
  // ---------------------------------------------------------------------
  function svgMapa(dados) {
    var sit = situacao(dados);
    var bronze = !!(dados && dados.reconstruida && dados.estado === "pe");
    var ouro = !!(dados && dados.ouro && dados.estado === "pe");
    var T = ' stroke="' + TINTA + '" stroke-linejoin="round" stroke-linecap="round"';
    var s = '<svg class="ob-mapa-svg ob-mapa-' + sit + '" viewBox="0 0 160 120" aria-hidden="true" focusable="false">';
    if (sit === "terreno") {
      s += '<path d="M98 113h58" stroke="' + TINTA + '" stroke-width="1" opacity=".45"/>' +
        '<path d="M102 113v-5M107 113v-5M102 110h5M146 113v-5M151 113v-5M146 110h5"' + T + ' stroke-width="1" opacity=".6"/>' +
        '<path d="M126 113v-9" stroke="#5a3d22" stroke-width="2.4"/>' +
        '<path d="M115 96h22l-1 9h-20z" fill="#d6c39b"' + T + ' stroke-width="1.1"/>' +
        '<path d="M118 100h16M118 102.5h10"' + T + ' stroke-width=".9" opacity=".7"/>' +
        '<path d="M131 100.5l3 3M134 100.5l-3 3"' + T + ' stroke-width=".9" opacity=".7"/>';
      return s + "</svg>";
    }
    var ferida = sit === "ferida";
    // ancoragens e torres
    s += '<rect x="94" y="109" width="7" height="5" fill="#b39c72"' + T + ' stroke-width=".8"/><rect x="151" y="109" width="7" height="5" fill="#b39c72"' + T + ' stroke-width=".8"/>' +
      '<rect class="ob-mp-torre" x="106" y="91" width="4" height="22" fill="#8f8a7f"' + T + ' stroke-width=".9"/>' +
      '<rect class="ob-mp-torre" x="144" y="91" width="4" height="22" fill="#8f8a7f"' + T + ' stroke-width=".9"' + (ferida ? ' transform="rotate(-14 146 113)"' : "") + '/>';
    if (ferida) {
      s += '<path d="M97 111L108 91Q127 120 143 99" fill="none"' + T + ' stroke-width="1.2"/>' +
        '<path d="M143 99q4 6 2 12" fill="none" stroke="#a02020" stroke-width="1.1" stroke-dasharray="2 1.5"/>' +
        '<path d="M116 100v5M126 103v3" fill="none"' + T + ' stroke-width=".6"/>' +
        '<path class="ob-mp-deck" d="M98 105h26v3H98z"' + T + ' stroke-width=".8"/>' +
        '<path class="ob-mp-deck" d="M126 108l28-6 1 3-28 7z"' + T + ' stroke-width=".8"/>' +
        '<path d="M122 103l2 4-2 3 3 3" fill="none" stroke="#a02020" stroke-width="1.2"/>' +
        '<g class="ob-mp-fumaca"><circle cx="138" cy="100" r="2.2"/><circle cx="141" cy="95" r="2.8"/><circle cx="145" cy="89" r="3.2"/></g>';
    } else {
      s += '<path d="M97 111L108 91Q127 112 146 91L157 111" fill="none"' + T + ' stroke-width="1.2"/>' +
        '<path d="M114 97.5v8M120 100.5v5M127 101.5v4M134 100.5v5M140 97.5v8" fill="none"' + T + ' stroke-width=".6"/>' +
        '<path class="ob-mp-deck' + (sit === "fraca" ? " ob-m-range" : "") + '" d="M98 105h58v3H98z"' + T + ' stroke-width=".8"/>' +
        '<g class="ob-andantes"><g class="ob-andante"><circle cx="100" cy="101.6" r="1.3"/><path d="M100 103v2.2M100 105.2l-1 1.3M100 105.2l1 1.3"/></g>' +
        '<g class="ob-andante ob-andante-2"><circle cx="100" cy="101.6" r="1.3"/><path d="M100 103v2.2M100 105.2l-1 1.3M100 105.2l1 1.3"/></g></g>';
      if (sit === "pe") {
        s += '<path d="M108 91V84"' + T + ' stroke-width=".9"/><path d="M108 84l6 2.2-6 2.2z" fill="' + (ouro ? "#d4af37" : "#fbf3dc") + '"' + T + ' stroke-width=".6"/>';
      }
      if (bronze) s += '<rect x="122" y="109" width="10" height="3.5" rx=".6" fill="#b08850"' + T + ' stroke-width=".5"/>';
    }
    return s + "</svg>";
  }

  // Sobrepõe (ou atualiza) a obra num .mm-local / .mm-cena-reino. Idempotente:
  // só redesenha se a situação mudou, para não repetir animação a cada render.
  function marcarLocal(local, id, dados) {
    var sit = situacao(dados);
    var chave = sit + (dados && dados.reconstruida ? "-bronze" : "") + (dados && dados.ouro ? "-ouro" : "");
    var atual = local.querySelector(":scope > .ob-mapa");
    if (atual && atual.getAttribute("data-ob-chave") === chave) return;
    if (!atual) {
      atual = document.createElement("span");
      atual.className = "ob-mapa";
      atual.setAttribute("aria-hidden", "true");
      local.appendChild(atual);
    }
    atual.setAttribute("data-ob-chave", chave);
    atual.setAttribute("data-ob-situacao", sit);
    atual.innerHTML = svgMapa(dados);
  }

  // Quadro do reino aberto agora (onde a placa entra)
  function paineisAbertos(id) {
    var bloco = blocoDe(id);
    if (!bloco) return [];
    var lista = [];
    document.querySelectorAll("#lista-blocos .painel-runas-aberto").forEach(function (p) {
      var cor = (p.style.getPropertyValue("--cor-reino") || "").trim().toLowerCase();
      if (cor && cor === String(bloco.hex).toLowerCase()) lista.push(p);
    });
    document.querySelectorAll('#lista-blocos > [data-bloco-id="' + id + '"]').forEach(function (p) {
      var runas = p.querySelector(":scope > .lista-runas");
      if (runas && runas.style.display !== "none" && !p.classList.contains("tile-reino")) lista.push(p);
    });
    return lista;
  }

  function textoPlaca(obra, dados) {
    var sit = situacao(dados);
    var laudo = dados && dados.laudo;
    if (sit === "terreno") return { icone: "📐", titulo: "Mesa de Projeto: " + obra.nome, sub: "Terreno pronto, " + fmt(PONTE.orcamento) + " moedas no cofre. Escolha material, ancoragem, flecha e espessura.", botao: "Projetar" };
    if (sit === "ferida") return { icone: "💥", titulo: obra.nome + ": interditada", sub: (laudo && laudo.nomeQueda ? "Caiu quando " + laudo.nomeQueda + ". " : "") + (laudo && laudo.runa ? "A runa " + laudo.runa + " ensina a consertar." : ""), botao: "Reformar" };
    if (sit === "fraca") return { icone: obra.icone, titulo: obra.nome + ": de pé, com ressalva", sub: "Passou no teste" + (laudo && laudo.fsMin ? " com fator de segurança " + fmt(laudo.fsMin, 2) : "") + ". Reforça antes da grande tempestade.", botao: "Reforçar" };
    var extras = [];
    if (laudo && laudo.fsMin) extras.push("FS " + fmt(laudo.fsMin, 2));
    if (laudo && laudo.custo) extras.push(fmt(laudo.custo) + " de " + fmt(PONTE.orcamento) + " moedas");
    return {
      icone: obra.icone,
      titulo: obra.nome + ": de pé" + (dados.ouro ? " · ouro" : "") + (dados.reconstruida ? " · reconstruída" : ""),
      sub: (extras.length ? extras.join(" · ") + ". " : "") + (dados.ouro ? "Medalha de ouro da economia." : "") + (dados.reconstruida ? " Placa de bronze: caiu uma vez e voltou mais forte." : ""),
      botao: "Ver a obra",
    };
  }

  function colocarPlaca(painel, id, obra, dados) {
    var chave = situacao(dados) + "|" + (dados && dados.reconstruida ? "b" : "") + (dados && dados.ouro ? "o" : "") + "|" + (dados && dados.laudo ? dados.laudo.custo + "-" + dados.laudo.fsMin : "");
    var atual = painel.querySelector(":scope > .ob-placa");
    if (atual && atual.getAttribute("data-ob-chave") === chave) return;
    var t = textoPlaca(obra, dados);
    var placa = document.createElement("div");
    placa.className = "ob-placa ob-placa-" + situacao(dados);
    placa.setAttribute("data-ob-chave", chave);
    placa.setAttribute("data-ob-situacao", situacao(dados));
    placa.innerHTML =
      '<span class="ob-placa-icone" aria-hidden="true">' + t.icone + "</span>" +
      '<span class="ob-placa-texto"><strong class="ob-placa-titulo">' + escapar(t.titulo) + "</strong>" +
      '<span class="ob-placa-sub">' + escapar(t.sub) + "</span></span>" +
      '<button type="button" class="btn-gotico ob-botao" data-ob-abrir="' + id + '" aria-label="' + escapar(t.botao + ": " + obra.nome) + '">' + escapar(t.botao) + "</button>";
    if (atual) atual.replaceWith(placa);
    else {
      var runas = painel.querySelector(":scope > .lista-runas");
      if (runas) painel.insertBefore(placa, runas); else painel.appendChild(placa);
    }
  }

  function decorar() {
    var estado = obterEstadoObras();
    Object.keys(OBRAS).forEach(function (id) {
      var obra = OBRAS[id], dados = estado[id];
      document.querySelectorAll('#lista-blocos [data-bloco-id="' + id + '"] .mm-local').forEach(function (local) {
        marcarLocal(local, id, dados);
      });
      paineisAbertos(id).forEach(function (painel) {
        colocarPlaca(painel, id, obra, dados);
        var cena = painel.querySelector(".mm-cena-reino");
        if (cena) marcarLocal(cena, id, dados);
      });
    });
  }

  // ---------------------------------------------------------------------
  // A MESA DE PROJETO (janela)
  // ---------------------------------------------------------------------
  var focoAnterior = null;

  function duracoes() {
    var cfg = window.obrasReino || {};
    var e = Number(cfg.DURACAO_ESTAGIO), m = Number(cfg.DURACAO_ERGUER);
    return { estagio: movimento ? (isFinite(e) ? e : 1800) : 0, erguer: movimento ? (isFinite(m) ? m : 1400) : 0 };
  }
  // interpolação simples com requestAnimationFrame (só muda atributos d)
  function tween(ms, passo, fim) {
    if (!(ms > 0) || typeof requestAnimationFrame !== "function") { passo(1); if (fim) fim(); return; }
    var t0 = null;
    function quadro(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min(1, (ts - t0) / ms);
      var s = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p; // ease in-out
      passo(s);
      if (p < 1) requestAnimationFrame(quadro); else if (fim) fim();
    }
    requestAnimationFrame(quadro);
  }

  function cartaMaterialHTML(m, selecionado) {
    var icone = {
      aco: '<svg viewBox="0 0 48 30" aria-hidden="true"><path d="M3 15q6-8 12 0t12 0 12 0 6 0" fill="none" stroke="#3b2412" stroke-width="4"/><path d="M3 15q6-8 12 0t12 0 12 0 6 0" fill="none" stroke="#fbf3dc" stroke-width="1.2" stroke-dasharray="3 3"/></svg>',
      forjado: '<svg viewBox="0 0 48 30" aria-hidden="true"><g fill="none" stroke="#3b2412" stroke-width="2.4"><rect x="3" y="9" width="12" height="12" rx="6"/><rect x="12" y="9" width="12" height="12" rx="6"/><rect x="21" y="9" width="12" height="12" rx="6"/><rect x="30" y="9" width="12" height="12" rx="6"/></g></svg>',
      fundido: '<svg viewBox="0 0 48 30" aria-hidden="true"><g fill="#6d6d6d" stroke="#3b2412" stroke-width="1.6"><rect x="3" y="8" width="13" height="14" rx="2"/><rect x="17" y="8" width="13" height="14" rx="2"/><rect x="31" y="8" width="13" height="14" rx="2"/></g><g fill="#fbf3dc" opacity=".8"><circle cx="9" cy="13" r="1.3"/><circle cx="24" cy="17" r="1.1"/><circle cx="37" cy="12" r="1.4"/></g><path d="M22 10l3 4-2 3 3 3" fill="none" stroke="#a02020" stroke-width="1.2"/></svg>',
    }[m.id];
    return '<button type="button" class="ob-carta' + (selecionado ? " ob-carta-marcada" : "") + '" data-ob-material="' + m.id + '" aria-pressed="' + (selecionado ? "true" : "false") + '">' +
      '<span class="ob-carta-icone">' + icone + "</span>" +
      '<span class="ob-carta-nome">' + escapar(m.nome) + "</span>" +
      '<span class="ob-carta-resumo">' + escapar(m.resumo) + "</span>" +
      '<span class="ob-carta-preco" title="custo relativo">' + m.moedas + "</span></button>";
  }
  function cartaAncoragemHTML(a, selecionado) {
    var icone = {
      rocha: '<svg viewBox="0 0 48 30" aria-hidden="true"><path d="M2 28l8-16 10 2 8-8 10 10 8 12z" fill="#cdbb8c" stroke="#3b2412" stroke-width="1.4"/><path d="M8 24l-3 3M16 20l-5 5M26 16l-6 6M34 20l-5 5M40 24l-3 3" stroke="#3b2412" stroke-width="1"/><rect x="18" y="16" width="12" height="9" fill="#b39c72" stroke="#3b2412" stroke-width="1.2"/></svg>',
      areia: '<svg viewBox="0 0 48 30" aria-hidden="true"><path d="M2 20h44v8H2z" fill="#e3d3ad" stroke="#3b2412" stroke-width="1.2"/><path d="M6 24h1M12 26h1M18 23h1M28 25h1M36 23h1M42 26h1" stroke="#3b2412" stroke-width="1.4"/><rect x="18" y="10" width="12" height="10" fill="#b39c72" stroke="#3b2412" stroke-width="1.2"/><path d="M30 15h8l-3-2M38 15l-3 2" fill="none" stroke="#a02020" stroke-width="1.2"/></svg>',
      torre: '<svg viewBox="0 0 48 30" aria-hidden="true"><rect x="21" y="4" width="6" height="24" fill="#8f8a7f" stroke="#3b2412" stroke-width="1.2"/><path d="M24 6q-10 6-18 22M24 6q10 6 18 22" fill="none" stroke="#3b2412" stroke-width="1.6" stroke-dasharray="3 2"/><path d="M4 26h40" stroke="#3b2412" stroke-width="1.2"/><text x="36" y="14" font-size="10" fill="#a02020">?</text></svg>',
    }[a.id];
    return '<button type="button" class="ob-carta' + (selecionado ? " ob-carta-marcada" : "") + '" data-ob-ancoragem="' + a.id + '" aria-pressed="' + (selecionado ? "true" : "false") + '">' +
      '<span class="ob-carta-icone">' + icone + "</span>" +
      '<span class="ob-carta-nome">' + escapar(a.nome) + "</span>" +
      '<span class="ob-carta-resumo">' + escapar(a.resumo) + "</span>" +
      '<span class="ob-carta-preco">' + (a.preco ? fmt(a.preco) + " moedas" : "de graça") + "</span></button>";
  }

  function abrirModalObra(id) {
    var obra = OBRAS[id], bloco = blocoDe(id);
    if (!obra || !bloco) return;
    fecharModalObra();
    focoAnterior = document.activeElement;

    var dados = obterEstadoObras()[id] || null;
    var cfg = dados && cfgValida(dados.cfg) ? {
      material: dados.cfg.material, ancoragem: dados.cfg.ancoragem,
      flecha: Number(dados.cfg.flecha), diametro: Number(dados.cfg.diametro),
    } : { material: null, ancoragem: null, flecha: PONTE.flecha.padrao, diametro: PONTE.diametro.padrao };
    var testando = false;

    var overlay = document.createElement("div");
    overlay.id = "modal-obra-overlay";
    overlay.className = "ob-overlay";
    var painel = document.createElement("div");
    painel.className = "painel-leitura ob-janela";
    painel.setAttribute("role", "dialog");
    painel.setAttribute("aria-modal", "true");
    painel.setAttribute("aria-labelledby", "ob-titulo");
    painel.style.setProperty("--cor-reino", bloco.hex);

    painel.innerHTML =
      '<button type="button" id="ob-fechar" class="btn-gotico ob-fechar" aria-label="Fechar a mesa de projeto">✕</button>' +
      '<span class="ob-kicker">Mesa de Projeto · ' + escapar(nomeCurto(bloco)) + "</span>" +
      '<h2 id="ob-titulo" class="font-display ob-titulo">' + obra.icone + " " + escapar(obra.nome) + "</h2>" +
      '<div class="ob-guardia"><span class="ob-guardia-avatar" aria-hidden="true">' + obra.emoji + "</span>" +
      '<div class="ob-guardia-balao"><strong class="font-display ob-guardia-nome">' + escapar(obra.guardia) + "</strong>" +
      '<span class="font-body" id="ob-fala" aria-live="polite"></span></div></div>' +
      // a prancha
      '<div class="ob-prancha" id="ob-prancha">' +
        '<div class="ob-prancha-cab"><span class="ob-prancha-rotulo">Prancha I · planta da ponte, em escala</span><span class="ob-prancha-escala" id="ob-escala"></span></div>' +
        '<svg class="ob-cena-svg" id="ob-cena" viewBox="0 36 360 174" aria-hidden="true" focusable="false"><g class="ob-fundo">' + svgFundoPlanta() + '</g><g class="ob-estrutura" id="ob-estrutura"></g></svg>' +
        '<p class="ob-cena-legenda" id="ob-legenda" aria-live="polite"></p>' +
      "</div>" +
      // medidores
      '<div class="ob-medidores" id="ob-medidores">' +
        '<div class="ob-medidor"><span class="ob-med-titulo">Tensão no cabo</span>' + svgMedidor() + '<strong class="ob-med-valor" id="ob-m-tensao">—</strong><span class="ob-med-sub" id="ob-m-limite">limite — MPa</span></div>' +
        '<div class="ob-tiles">' +
          '<div class="ob-tile"><span class="ob-tile-rotulo">Carga total</span><strong class="ob-tile-valor" id="ob-m-carga">—</strong><span class="ob-tile-sub" id="ob-m-carga-sub">kN sobre o vão</span></div>' +
          '<div class="ob-tile"><span class="ob-tile-rotulo">Fator de segurança</span><strong class="ob-tile-valor" id="ob-m-fs">—</strong><span class="ob-tile-sub">limite ÷ tensão (meta ≥ 1,5)</span></div>' +
          '<div class="ob-tile"><span class="ob-tile-rotulo">Flecha do tabuleiro</span><strong class="ob-tile-valor" id="ob-m-flecha">—</strong><span class="ob-tile-sub">desenho exagerado ' + PONTE.exageroDesenho + "×</span></div>" +
          '<div class="ob-tile"><span class="ob-tile-rotulo">Puxão na ancoragem</span><strong class="ob-tile-valor" id="ob-m-puxao">—</strong><span class="ob-tile-sub" id="ob-m-puxao-sub">segura — kN</span></div>' +
        "</div>" +
      "</div>" +
      '<div class="divisor-rune"></div>' +
      // as cartas
      '<div class="ob-secao" role="group" aria-labelledby="ob-sec-1"><h3 id="ob-sec-1" class="font-display ob-secao-titulo"><span class="ob-romano">I</span> O cabo: material</h3><div class="ob-cartas" id="ob-cartas-material"></div></div>' +
      '<div class="ob-secao" role="group" aria-labelledby="ob-sec-2"><h3 id="ob-sec-2" class="font-display ob-secao-titulo"><span class="ob-romano">II</span> A ancoragem: onde prender</h3><div class="ob-cartas" id="ob-cartas-ancoragem"></div></div>' +
      // os ajustes
      '<div class="ob-secao" role="group" aria-labelledby="ob-sec-3"><h3 id="ob-sec-3" class="font-display ob-secao-titulo"><span class="ob-romano">III</span> Os ajustes</h3>' +
        '<div class="ob-ajustes">' +
          '<label class="ob-ajuste"><span class="ob-ajuste-rotulo">Flecha do cabo <output id="ob-flecha-valor"></output></span><input type="range" id="ob-flecha" min="' + PONTE.flecha.min + '" max="' + PONTE.flecha.max + '" step="' + PONTE.flecha.passo + '" value="' + cfg.flecha + '"><span class="ob-ajuste-dica">Quanto o cabo desce entre as torres. Mais flecha: torres mais altas, cabo puxa menos.</span></label>' +
          '<label class="ob-ajuste"><span class="ob-ajuste-rotulo">Espessura do cabo <output id="ob-diametro-valor"></output></span><input type="range" id="ob-diametro" min="' + PONTE.diametro.min + '" max="' + PONTE.diametro.max + '" step="' + PONTE.diametro.passo + '" value="' + cfg.diametro + '"><span class="ob-ajuste-dica">Diâmetro de cada um dos 2 cabos. Tensão = força ÷ área.</span></label>' +
        "</div>" +
      "</div>" +
      // o orçamento
      '<div class="ob-orcamento" id="ob-orcamento" aria-live="polite"><div class="ob-orc-cab"><span class="ob-orc-rotulo">Custo da obra</span><strong class="ob-orc-valor" id="ob-orc-valor"></strong></div>' +
        '<div class="ob-orc-barra" aria-hidden="true"><i class="ob-orc-cabo" id="ob-orc-cabo"></i><i class="ob-orc-anc" id="ob-orc-anc"></i><i class="ob-orc-torres" id="ob-orc-torres"></i></div>' +
        '<span class="ob-orc-detalhe" id="ob-orc-detalhe"></span></div>' +
      '<button type="button" id="ob-erguer" class="btn-gotico ob-erguer" disabled>⚒️ Escolha material e ancoragem</button>' +
      '<div id="ob-laudo" class="ob-laudo-area" aria-live="polite"></div>';

    var cena = painel.querySelector("#ob-cena");
    var estrutura = painel.querySelector("#ob-estrutura");
    var legenda = painel.querySelector("#ob-legenda");
    var fala = painel.querySelector("#ob-fala");
    var botaoErguer = painel.querySelector("#ob-erguer");
    var areaLaudo = painel.querySelector("#ob-laudo");
    var slFlecha = painel.querySelector("#ob-flecha"), slDiam = painel.querySelector("#ob-diametro");

    function dizer(texto) { fala.textContent = texto; }

    function desenharCartas() {
      painel.querySelector("#ob-cartas-material").innerHTML = ORDEM_MATERIAIS.map(function (k) { return cartaMaterialHTML(MATERIAIS[k], cfg.material === k); }).join("");
      painel.querySelector("#ob-cartas-ancoragem").innerHTML = ORDEM_ANCORAGENS.map(function (k) { return cartaAncoragemHTML(ANCORAGENS[k], cfg.ancoragem === k); }).join("");
    }

    function atualizarPlanta() {
      estrutura.innerHTML = svgEstrutura(cfg);
      cena.setAttribute("class", "ob-cena-svg");
      legenda.textContent = "";
    }

    function atualizarAjustes() {
      painel.querySelector("#ob-flecha-valor").textContent = fmt(cfg.flecha, 1) + " m  (1/" + fmt(PONTE.vao / cfg.flecha, 1) + " do vão · torres de " + fmt(cfg.flecha + PONTE.folgaTorre) + " m)";
      var r = calcular(cfg);
      painel.querySelector("#ob-diametro-valor").textContent = fmt(cfg.diametro, 1) + " cm  (área dos 2 cabos: " + fmt(r.areaCm2) + " cm²)";
      painel.querySelector("#ob-escala").textContent = "1 : " + fmt(PONTE.vao * 100 / 200 * 3) + " · f/L = 1/" + fmt(PONTE.vao / cfg.flecha, 1);
      // orçamento
      var orc = r.custo;
      painel.querySelector("#ob-orc-valor").textContent = fmt(orc.total) + " de " + fmt(orc.orcamento) + " moedas";
      painel.querySelector("#ob-orc-cabo").style.width = (100 * Math.min(orc.cabo, orc.orcamento) / orc.orcamento) + "%";
      painel.querySelector("#ob-orc-anc").style.width = (100 * Math.min(orc.ancoragem, Math.max(0, orc.orcamento - orc.cabo)) / orc.orcamento) + "%";
      painel.querySelector("#ob-orc-torres").style.width = (100 * Math.min(orc.torres, Math.max(0, orc.orcamento - orc.cabo - orc.ancoragem)) / orc.orcamento) + "%";
      painel.querySelector("#ob-orc-detalhe").textContent = "cabo " + fmt(orc.cabo) + " · ancoragem " + fmt(orc.ancoragem) + " · torres " + fmt(orc.torres) + (orc.dentro ? "" : " · o tesoureiro nega: passa do orçamento");
      painel.querySelector("#ob-orcamento").classList.toggle("ob-orc-estourado", !orc.dentro);
      painel.querySelector("#ob-medidores").querySelector("#ob-m-limite").textContent = "limite " + (r.completo ? fmt(MATERIAIS[cfg.material].limite) : "—") + " MPa";
      painel.querySelector("#ob-m-puxao-sub").textContent = "segura " + (r.completo ? fmt(ANCORAGENS[cfg.ancoragem].capacidade) : "—") + " kN";
      atualizarBotao(r);
    }

    function atualizarBotao(r) {
      r = r || calcular(cfg);
      var pode = r.completo && r.custo.dentro && !testando;
      botaoErguer.disabled = !pode;
      botaoErguer.textContent = !r.completo ? "⚒️ Escolha material e ancoragem" : !r.custo.dentro ? "⚒️ Passa do orçamento: afine o projeto" : testando ? "⚒️ Erguendo e testando..." : "⚒️ Erguer e testar a ponte";
    }

    function limparMedidores() {
      ["ob-m-tensao", "ob-m-carga", "ob-m-fs", "ob-m-flecha", "ob-m-puxao"].forEach(function (i) { painel.querySelector("#" + i).textContent = "—"; });
      painel.querySelector("#ob-m-fs").className = "ob-tile-valor";
      painel.querySelector("#ob-m-carga-sub").textContent = "kN sobre o vão";
      painel.querySelector(".ob-med-ponteiro").style.transform = "rotate(-90deg)";
    }
    function mostrarMedidores(est) {
      painel.querySelector("#ob-m-tensao").textContent = fmt(est.tensaoEf) + " MPa";
      painel.querySelector("#ob-m-carga").textContent = fmt(est.cargaTotal) + " kN";
      painel.querySelector("#ob-m-carga-sub").textContent = fmt(est.w, 1) + " kN/m · " + est.nota;
      var fsEl = painel.querySelector("#ob-m-fs");
      fsEl.textContent = fmt(est.fs, 2);
      fsEl.className = "ob-tile-valor " + (est.fs >= 1.5 ? "ob-bom" : est.fs >= 1 ? "ob-atencao" : "ob-ruim");
      painel.querySelector("#ob-m-flecha").textContent = fmt(est.flechaExtra, 1) + " cm";
      painel.querySelector("#ob-m-puxao").textContent = fmt(est.H) + " kN";
      var razao = est.tensaoEf / est.limite;
      painel.querySelector(".ob-med-ponteiro").style.transform = "rotate(" + (-90 + 180 * Math.min(razao / 1.5, 1)) + "deg)";
    }

    // deforma o tabuleiro/cabo até a flecha extra do estágio (exagerada)
    var deflAtual = 0;
    function deformar(paraPx, ms, fim) {
      var de = deflAtual;
      tween(ms, function (s) {
        var px = de + (paraPx - de) * s;
        deflAtual = px;
        var g = geometria(cfg, px);
        var c = estrutura.querySelector(".ob-cabo-principal"), p = estrutura.querySelector(".ob-pendurais"), t = estrutura.querySelector(".ob-tabuleiro");
        if (c) c.setAttribute("d", g.cabo);
        ["ob-cabo-brilho", "ob-cabo-elos", "ob-cabo-bolhas"].forEach(function (k) { var e = estrutura.querySelector("." + k); if (e) e.setAttribute("d", g.cabo); });
        if (p) p.setAttribute("d", g.pend);
        if (t) t.setAttribute("d", g.deck);
      }, fim);
    }

    function erguerETestar() {
      var r = calcular(cfg);
      if (testando || !r.completo || !r.custo.dentro) return;
      testando = true;
      areaLaudo.innerHTML = "";
      atualizarPlanta();
      limparMedidores();
      atualizarBotao(r);
      var dur = duracoes();
      cena.style.setProperty("--ob-dur", (dur.estagio / 1000) + "s");
      cena.classList.add("ob-erguendo");
      legenda.textContent = "🏗️ Erguendo as torres, lançando os cabos, assentando o tabuleiro...";
      setTimeout(function () {
        cena.classList.remove("ob-erguendo");
        cena.classList.add("ob-erguida");
        estagio(0, r);
      }, dur.erguer);
    }

    function estagio(i, r) {
      var est = r.estagios[i];
      var dur = duracoes();
      cena.classList.remove("ob-est-aldeoes", "ob-est-carrocas", "ob-est-tempestade");
      cena.classList.add("ob-est-" + est.id);
      legenda.textContent = est.emoji + " Estágio " + (i + 1) + ": " + est.nome + " (" + est.nota + ")";
      mostrarMedidores(est);
      var px = limitar(est.flechaExtra / 100 * ESC * PONTE.exageroDesenho, 0, 26);
      deformar(px, Math.min(700, dur.estagio * 0.4));
      setTimeout(function () {
        if (est.resultado === "falha") return concluir(r);
        if (i + 1 >= r.estagios.length) return concluir(r);
        estagio(i + 1, r);
      }, dur.estagio);
    }

    function concluir(r) {
      var estado = obterEstadoObras();
      var antes = estado[id] || {};
      var caiu = r.veredito === "ferida";
      var novo = {
        estado: caiu ? "ferida" : "pe",
        fraca: r.veredito === "fraca",
        cfg: { material: cfg.material, ancoragem: cfg.ancoragem, flecha: cfg.flecha, diametro: cfg.diametro },
        laudo: {
          veredito: r.veredito, custo: r.custo.total, fsMin: r.fsMin, runa: caiu ? r.queda.runa : (r.motivosFraca[0] ? r.motivosFraca[0].runa : null),
          estagioQueda: caiu ? r.queda.estagio : null, tipoQueda: caiu ? r.queda.tipo : null, nomeQueda: caiu ? r.queda.nome : null,
        },
        xpDado: !!antes.xpDado, xpOuroDado: !!antes.xpOuroDado,
        reconstruida: !!antes.reconstruida || (!caiu && antes.estado === "ferida"),
        ouro: !caiu && (r.ouro || !!antes.ouro),
        quedas: (antes.quedas || 0) + (caiu ? 1 : 0),
        dia: diaDeHoje(),
      };
      var reconstruiuAgora = !caiu && antes.estado === "ferida";
      var ganhouXP = 0;
      if (!caiu && !novo.xpDado) { novo.xpDado = true; ganhouXP += XP_OBRA; }
      if (!caiu && r.ouro && !novo.xpOuroDado) { novo.xpOuroDado = true; ganhouXP += XP_OURO; }
      estado[id] = novo;
      salvarEstadoObras(estado);

      // a cena cai ou comemora
      if (caiu) {
        cena.classList.add("ob-caiu", "ob-falha-" + r.queda.tipo);
        if (r.queda.tipo === "escoa") deformar(40, 600);
        if (r.queda.tipo === "ancora") deformar(30, 600);
      } else {
        cena.classList.add(novo.fraca ? "ob-range" : "ob-ok");
        deformar(0, 500);
      }
      legenda.textContent = caiu ? "💥 Estágio " + r.queda.estagio + ": " + r.queda.nome + "... e a ponte cai." : (novo.fraca ? "⚠️ Passou nos três estágios, rangendo." : "🎉 Passou nos três estágios.");
      if (typeof somTocar === "function") { try { somTocar(caiu ? "erro" : "acerto"); } catch (e) {} }

      if (ganhouXP && typeof obterEstadoJogo === "function" && typeof salvarEstadoJogo === "function") {
        try {
          var jogo = obterEstadoJogo();
          jogo.xp += ganhouXP;
          salvarEstadoJogo(jogo);
          if (typeof atualizarBarraXP === "function") atualizarBarraXP();
          if (typeof mostrarToast === "function") mostrarToast("Obra de pé! +" + ganhouXP + " PR", r.ouro ? "🏅" : "🏗️");
          if (typeof verificarConquistas === "function") verificarConquistas();
        } catch (e) { /* o XP é um bônus: a obra continua salva */ }
      }

      areaLaudo.innerHTML = laudoHTML(obra, r, novo, reconstruiuAgora, ganhouXP);
      var falaFinal = caiu ? obra.falas.ferida : reconstruiuAgora ? obra.falas.reconstruida : novo.fraca ? obra.falas.fraca : r.ouro ? obra.falas.ouro : obra.falas.pe;
      dizer(falaFinal);

      var voltar = areaLaudo.querySelector("#ob-voltar");
      if (voltar) voltar.addEventListener("click", function () {
        areaLaudo.innerHTML = "";
        deflAtual = 0;
        atualizarPlanta();
        limparMedidores();
        dizer(caiu ? "De volta à mesa. O laudo disse onde a força venceu: mexe ali." : "De volta à mesa. Dá para fazer melhor, ou mais barato?");
        var primeira = painel.querySelector(".ob-carta");
        if (primeira) primeira.focus();
      });
      areaLaudo.querySelectorAll("[data-ob-ler]").forEach(function (b) {
        b.addEventListener("click", function () {
          var runa = b.getAttribute("data-ob-ler");
          fecharModalObra();
          if (typeof abrirModalRuna === "function") abrirModalRuna(runa);
        });
      });

      testando = false;
      atualizarBotao(r);
      try { decorar(); } catch (e) {}
      if (typeof areaLaudo.scrollIntoView === "function") { try { areaLaudo.scrollIntoView({ block: "nearest", behavior: movimento ? "smooth" : "auto" }); } catch (e) {} }
    }

    function laudoHTML(obra, r, novo, reconstruiuAgora, ganhouXP) {
      var mat = MATERIAIS[cfg.material], anc = ANCORAGENS[cfg.ancoragem];
      var carimbo = r.veredito === "pe" ? "Aprovada" : r.veredito === "fraca" ? "Com ressalva" : "Interditada";
      var linhas = r.estagios.map(function (e) {
        var marca = e.resultado === "ok" ? "✓" : e.resultado === "range" ? "⚠" : e.resultado === "falha" ? "✗" : "—";
        var cls = e.resultado === "ok" ? "ob-bom" : e.resultado === "range" ? "ob-atencao" : e.resultado === "falha" ? "ob-ruim" : "ob-neutro";
        var vazio = e.resultado === "nao";
        return "<tr><td>" + e.emoji + " " + escapar(e.nome.charAt(0).toUpperCase() + e.nome.slice(1)) + "</td>" +
          "<td>" + (vazio ? "—" : fmt(e.cargaTotal) + " kN") + "</td><td>" + (vazio ? "—" : fmt(e.tensaoEf) + " MPa") + "</td><td>" + (vazio ? "—" : fmt(e.fs, 2)) + '</td><td class="' + cls + '">' + marca + "</td></tr>";
      }).join("");
      var texto;
      if (r.veredito === "ferida") texto = r.queda.porque;
      else if (r.veredito === "fraca") texto = "Passou, mas " + r.motivosFraca.map(function (m) { return m.texto; }).join("; e ") + ". A obra fica de pé com ressalva: a grande tempestade decide.";
      else texto = "Fator de segurança de " + fmt(r.fsMin, 2) + " no pior estágio: há folga para o peso que ninguém previu." + (r.ouro ? " E custou " + fmt(r.custo.total) + " moedas, dentro de 80% do orçamento: medalha de ouro da economia." : "");
      var runaLink = r.veredito === "ferida" ? r.queda.runa : r.veredito === "fraca" ? r.motivosFraca[0].runa : null;
      return '<div class="ob-laudo ob-laudo-' + r.veredito + '">' +
        '<div class="ob-laudo-cab"><span class="ob-kicker">Laudo da Obra · ' + escapar(diaPorExtenso(novo.dia)) + "</span><h3 class=\"font-display\">" + escapar(obra.nome) + "</h3>" +
        '<span class="ob-carimbo" aria-label="Veredito: ' + carimbo + '">' + carimbo + "</span></div>" +
        '<div class="ob-laudo-tabela-caixa"><table class="ob-laudo-tabela"><thead><tr><th>Estágio</th><th>Carga</th><th>Tensão</th><th>FS</th><th></th></tr></thead><tbody>' + linhas + "</tbody></table></div>" +
        '<p class="ob-laudo-texto">' + escapar(texto) + "</p>" +
        '<ul class="ob-laudo-itens">' +
          "<li><strong>Material:</strong> " + escapar(mat.laudo) + "</li>" +
          "<li><strong>Ancoragem:</strong> " + escapar(anc.nome.toLowerCase()) + ", segura " + fmt(anc.capacidade) + " kN</li>" +
          "<li><strong>Geometria:</strong> flecha " + fmt(cfg.flecha, 1) + " m (1/" + fmt(PONTE.vao / cfg.flecha, 1) + " do vão), 2 cabos de " + fmt(cfg.diametro, 1) + " cm (área " + fmt(r.areaCm2) + " cm²), torres de " + fmt(r.alturaTorre) + " m</li>" +
          "<li><strong>Custo:</strong> " + fmt(r.custo.total) + " de " + fmt(PONTE.orcamento) + " moedas</li>" +
        "</ul>" +
        (r.ouro || reconstruiuAgora || (novo.reconstruida && !caiuAgora(r)) ? '<p class="ob-laudo-medalha">' + (r.ouro ? "🏅 Medalha de ouro da economia. " : "") + (novo.reconstruida && r.veredito !== "ferida" ? "🥉 Placa de bronze: reconstruída depois de uma queda." : "") + "</p>" : "") +
        (ganhouXP ? '<p class="ob-xp">✨ +' + ganhouXP + " Poder Rúnico</p>" : "") +
        '<p class="ob-assinatura">' + escapar(obra.guardia) + " · Mestra de Obras do reino</p>" +
        '<div class="ob-acoes">' + (runaLink ? '<button type="button" class="btn-gotico" data-ob-ler="' + escapar(runaLink) + '">📖 Ler a runa ' + escapar(runaLink) + "</button>" : "") +
          '<button type="button" class="btn-gotico" id="ob-voltar">' + (r.veredito === "ferida" ? "🔨 Reformar (de graça)" : "📐 Voltar à mesa") + "</button></div>" +
        '<p class="ob-nota">Modelo simplificado da Mesa: cabo parabólico com carga uniforme num vão de 60 m, dois cabos, valores de material típicos e arredondados.</p>' +
        "</div>";
    }
    function caiuAgora(r) { return r.veredito === "ferida"; }

    // ---- eventos ----
    painel.addEventListener("click", function (ev) {
      var carta = ev.target.closest ? ev.target.closest(".ob-carta") : null;
      if (!carta || testando) return;
      if (carta.hasAttribute("data-ob-material")) {
        cfg.material = carta.getAttribute("data-ob-material");
        dizer(MATERIAIS[cfg.material].seda);
      } else if (carta.hasAttribute("data-ob-ancoragem")) {
        cfg.ancoragem = carta.getAttribute("data-ob-ancoragem");
        dizer(ANCORAGENS[cfg.ancoragem].seda);
      }
      areaLaudo.innerHTML = "";
      deflAtual = 0;
      desenharCartas();
      atualizarPlanta();
      atualizarAjustes();
      limparMedidores();
    });
    function aoAjustar(qual) {
      if (testando) { this.value = qual === "flecha" ? cfg.flecha : cfg.diametro; return; }
      cfg[qual] = Number(this.value);
      areaLaudo.innerHTML = "";
      deflAtual = 0;
      atualizarPlanta();
      atualizarAjustes();
      limparMedidores();
      if (qual === "flecha" && cfg.flecha <= PONTE.flecha.min + 0.5) dizer(obra.falas.flechaPequena);
      else if (qual === "flecha" && cfg.flecha >= PONTE.flecha.max - 1) dizer(obra.falas.flechaGrande);
      else if (qual === "diametro" && cfg.diametro >= PONTE.diametro.max - 2) dizer(obra.falas.cabogrosso);
      else if (qual === "diametro" && cfg.diametro <= PONTE.diametro.min + 1) dizer(obra.falas.cabofino);
      else if (!calcular(cfg).custo.dentro) dizer(obra.falas.orcamento);
    }
    slFlecha.addEventListener("input", function () { aoAjustar.call(this, "flecha"); });
    slDiam.addEventListener("input", function () { aoAjustar.call(this, "diametro"); });
    botaoErguer.addEventListener("click", erguerETestar);
    painel.querySelector("#ob-fechar").addEventListener("click", fecharModalObra);
    overlay.addEventListener("click", function (ev) { if (ev.target === overlay) fecharModalObra(); });
    overlay.appendChild(painel);
    document.body.appendChild(overlay);
    document.addEventListener("keydown", fecharComEsc);

    // ---- estado inicial ----
    desenharCartas();
    atualizarPlanta();
    atualizarAjustes();
    limparMedidores();
    var sit = situacao(dados);
    if (sit === "ferida" && dados.laudo) {
      cena.classList.add("ob-erguida", "ob-caiu", "ob-falha-" + (dados.laudo.tipoQueda || "escoa"));
      if (dados.laudo.tipoQueda === "escoa") deformar(40, 0); else if (dados.laudo.tipoQueda === "ancora") deformar(30, 0);
      legenda.textContent = "💥 Interditada: caiu quando " + (dados.laudo.nomeQueda || "a carga chegou") + ". Reforme o projeto e teste de novo.";
      dizer(obra.falas.ferida);
    } else if (sit === "pe" || sit === "fraca") {
      cena.classList.add("ob-erguida", sit === "fraca" ? "ob-range" : "ob-ok");
      legenda.textContent = sit === "fraca" ? "⚠️ De pé, com ressalva. Dá para reforçar." : "🎉 De pé. Dá para refazer mais barato?";
      dizer(sit === "fraca" ? obra.falas.fraca : dados.ouro ? obra.falas.ouro : obra.falas.pe);
    } else {
      dizer(obra.falas.nova);
    }
    var fechar = painel.querySelector("#ob-fechar");
    if (fechar && typeof fechar.focus === "function") fechar.focus();
  }

  function fecharComEsc(ev) {
    if (ev.key === "Escape") fecharModalObra();
  }
  function fecharModalObra() {
    var overlay = document.getElementById("modal-obra-overlay");
    if (!overlay) return;
    overlay.remove();
    document.removeEventListener("keydown", fecharComEsc);
    if (focoAnterior && typeof focoAnterior.focus === "function" && document.contains(focoAnterior)) {
      try { focoAnterior.focus(); } catch (e) {}
    }
    focoAnterior = null;
  }

  // ---------------------------------------------------------------------
  // Encadeamentos
  // ---------------------------------------------------------------------
  document.addEventListener("click", function (ev) {
    var alvo = ev.target && ev.target.closest ? ev.target.closest("[data-ob-abrir]") : null;
    if (!alvo) return;
    ev.preventDefault();
    ev.stopPropagation(); // não abre/fecha o reino ao clicar no botão da placa
    abrirModalObra(alvo.getAttribute("data-ob-abrir"));
  });

  if (typeof aposRenderizarBlocos === "function") {
    var aposOriginal = aposRenderizarBlocos;
    aposRenderizarBlocos = function () {
      var resultado = aposOriginal.apply(this, arguments);
      try { decorar(); } catch (e) { /* a obra nunca derruba o jogo */ }
      return resultado;
    };
  }
  if (document.readyState !== "loading") { try { decorar(); } catch (e) {} }

  window.obrasReino = {
    OBRAS: OBRAS, MATERIAIS: MATERIAIS, ANCORAGENS: ANCORAGENS, ESTAGIOS: ESTAGIOS, PONTE: PONTE,
    DURACAO_ESTAGIO: 1800, DURACAO_ERGUER: 1400,
    calcular: calcular, obterEstadoObras: obterEstadoObras, situacao: situacao,
    abrirModalObra: abrirModalObra, fecharModalObra: fecharModalObra, decorar: decorar,
  };
  document.documentElement.classList.add("ob-ativo");
})();
