/**
 * obras-catalogo.js — AS 7 OBRAS DO REINO (etapa A2 do "Reino Vivo", 12/11/2026)
 *
 * Este arquivo só tem DADOS e DESENHOS: para cada reino, uma obra com
 *   - cartas (2 decisões de 3 opções), ajustes (2 réguas), orçamento;
 *   - calcular(cfg): o modelo físico, função pura que devolve custo, os 3
 *     estágios de carga com números, o veredito (pe / fraca / ferida), o
 *     porquê da queda com a runa que ensina, e o que vai no laudo;
 *   - planta: o desenho em escala (SVG) e como ele se deforma e cai;
 *   - mapa(dados): a obra desenhada dentro do lugar do reino no mapa.
 * Quem usa tudo isso é o obras.js (a Mesa de Projeto, o save, a placa e o
 * mapa). Carregar ANTES do obras.js. Nenhum arquivo existente é alterado.
 *
 * Fatos: valores de material típicos e arredondados (aço estrutural escoa
 * ≈ 250 MPa, ferro forjado ≈ 200, ferro fundido rompe à tração ≈ 150,
 * alvenaria de pedra γ ≈ 24 kN/m³, tijolo ≈ 18, taipa ≈ 16; tijolo cozido
 * resiste à chuva, taipa não). Fórmulas de livro: H = wL²/8f, σ = F/A,
 * M = wL²/8, M = wc²/2, p = W/b² + 6M/b³, Mr = W·b/2. As runas citadas já
 * dizem o mesmo em palavras: 0.7, 1.1, 1.3, 1.4, 2.1, 2.2, 2.3, 2.6, 3.1,
 * 3.2, 3.4, 4.1, 4.4, 4.5, 4.6, 5.3, 5.5, 5.6, 6.1, 6.4 e E.5.
 */
(function () {
  "use strict";
  var TINTA = "#3b2412";
  var T = ' stroke="' + TINTA + '" stroke-linejoin="round" stroke-linecap="round"';

  function fmt(n, casas) {
    casas = casas || 0;
    try { return Number(n).toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas }); }
    catch (e) { return String(Math.round(n * Math.pow(10, casas)) / Math.pow(10, casas)).replace(".", ","); }
  }
  function r1(v) { return Math.round(v * 10) / 10; }
  function limitar(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function esc(texto) { return String(texto).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

  // Figuras de carga que atravessam (base dos pés em yBase)
  function figuras(n, yBase, x0) {
    var s = "";
    for (var i = 0; i < n; i++) {
      var x = (x0 || 0) + i * 18;
      s += '<g class="ob-figura" transform="translate(' + x + ' 0)"><circle cx="0" cy="' + (yBase - 11) + '" r="2.4"/><path d="M0 ' + (yBase - 8.5) + 'V' + (yBase - 3) + 'M0 ' + (yBase - 3) + 'l-2.4 3M0 ' + (yBase - 3) + 'l2.4 3M-2.6 ' + (yBase - 6.5) + 'h5.2"/></g>';
    }
    return s;
  }
  function carrocas(n, yBase, x0) {
    var s = "";
    for (var i = 0; i < n; i++) {
      var x = (x0 || 0) + i * 46;
      s += '<g class="ob-carroca" transform="translate(' + x + ' 0)"><rect x="0" y="' + (yBase - 13) + '" width="22" height="9" rx="1"/><path d="M4 ' + (yBase - 13) + 'v-4h14v4"/><circle cx="5" cy="' + (yBase - 2.5) + '" r="2.6"/><circle cx="17" cy="' + (yBase - 2.5) + '" r="2.6"/>' +
        '<path d="M22 ' + (yBase - 8) + 'h6l4-5 3 2-2 4v6M30 ' + (yBase - 1) + 'v-4M34 ' + (yBase - 1) + 'v-4"/></g>';
    }
    return s;
  }
  // Céu, nuvens, raio, vento e chuva (iguais em todas as pranchas)
  function ceu() {
    return '<rect class="ob-ceu" x="0" y="36" width="360" height="174"/>' +
      '<g class="ob-nuvens"><path d="M44 74q6-12 18-8q6-12 20-4q12-2 10 10H48q-8 0-4 2z"/><path d="M250 64q6-12 18-8q6-12 20-4q12-2 10 10H254q-8 0-4 2z"/></g>' +
      '<g class="ob-raio"><path d="M186 46l-9 20h8l-8 22 18-28h-9l8-14z"/></g>' +
      '<g class="ob-vento"><path d="M14 104q20-6 40 0t36 0"/><path d="M270 98q20-6 40 0t36 0"/><path d="M130 86q14-5 28 0t28 0"/></g>' +
      '<g class="ob-chuva"><path d="M40 96l-4 12M70 90l-4 12M104 100l-4 12M136 92l-4 12M170 98l-4 12M204 90l-4 12M236 100l-4 12M268 92l-4 12M300 98l-4 12M330 92l-4 12"/></g>';
  }
  function bandeira(x, yTop) {
    return '<path class="ob-bandeira-haste" d="M' + x + ' ' + r1(yTop) + 'V' + r1(yTop - 14) + '"/><path class="ob-bandeira" d="M' + x + ' ' + r1(yTop - 14) + 'l14 4-14 4z"/>';
  }
  function hachura(x0, y0, n, passo, comp) {
    var d = "";
    for (var i = 0; i < n; i++) d += "M" + (x0 + i * passo) + " " + y0 + "l" + (-comp) + " " + comp;
    return d;
  }
  // monta um estágio com o resultado padrão
  function estagio(def, dados) {
    var e = { id: def.id, emoji: def.emoji, nome: def.nome, nota: def.nota || "", resultado: "ok", falha: null };
    for (var k in dados) e[k] = dados[k];
    return e;
  }
  // regra comum de veredito: primeira falha derruba; FS < 1,5 = ressalva
  function fecharVeredito(r, estagios, extrasFraca) {
    var queda = null, fsMin = Infinity, range = false;
    estagios.forEach(function (e) {
      if (queda) { e.resultado = "nao"; return; }
      if (e.resultado === "falha") { queda = e; return; }
      if (e.fs < 1.5) { e.resultado = "range"; range = true; }
      fsMin = Math.min(fsMin, e.fs);
    });
    var motivos = [];
    if (!queda && range) motivos.push({ runa: "4.5", texto: "o fator de segurança ficou em " + fmt(fsMin, 2) + ", abaixo de 1,5: obra calculada quase no exato não tem onde errar (runa 4.5)" });
    if (!queda && extrasFraca) extrasFraca.forEach(function (m) { motivos.push(m); });
    r.estagios = estagios;
    r.veredito = queda ? "ferida" : (motivos.length ? "fraca" : "pe");
    r.fsMin = isFinite(fsMin) ? fsMin : null;
    r.motivosFraca = motivos;
    r.ouro = r.veredito === "pe" && r.custo.total <= 0.8 * r.custo.orcamento && !(r.ouroExtra === false);
    if (queda) r.queda = { indice: queda.indice, estagio: queda.indice + 1, nome: queda.nome, tipo: queda.falha, runa: queda.runa, porque: queda.porque };
    return r;
  }
  function custoDe(itens, orcamento) {
    var total = 0;
    itens.forEach(function (i) { total += i.valor; });
    return { itens: itens, total: Math.round(total), orcamento: orcamento, dentro: Math.round(total) <= orcamento };
  }

  var OBRAS = {};
  var ORDEM = ["bloco0", "bloco1", "bloco2", "bloco3", "bloco4", "bloco5", "bloco6"];

  // =====================================================================
  // BLOCO 3 · PONTE DOS TENDÕES (ponte pênsil)
  // =====================================================================
  (function () {
    var MAT = {
      aco: { id: "aco", nome: "Aço trançado", resumo: "escoa a 250 MPa · dúctil: estica e avisa", limite: 250, E: 200, ductil: true, preco: 1.0, moedas: "●●●", runa: "3.4", laudo: "aço trançado, escoamento a 250 MPa, dúctil",
        seda: "Fios de aço trançados: avisam esticando antes de romper. Caros, mas honestos.",
        icone: '<svg viewBox="0 0 48 30" aria-hidden="true"><path d="M3 15q6-8 12 0t12 0 12 0 6 0" fill="none" stroke="#3b2412" stroke-width="4"/><path d="M3 15q6-8 12 0t12 0 12 0 6 0" fill="none" stroke="#fbf3dc" stroke-width="1.2" stroke-dasharray="3 3"/></svg>' },
      forjado: { id: "forjado", nome: "Ferro forjado", resumo: "escoa a 200 MPa · dúctil, como as pontes de correntes antigas", limite: 200, E: 190, ductil: true, preco: 0.7, moedas: "●●", runa: "3.1", laudo: "ferro forjado, escoamento a 200 MPa, dúctil",
        seda: "Ferro forjado, como nas velhas pontes de correntes. Honesto, mas pede espessura.",
        icone: '<svg viewBox="0 0 48 30" aria-hidden="true"><g fill="none" stroke="#3b2412" stroke-width="2.4"><rect x="3" y="9" width="12" height="12" rx="6"/><rect x="12" y="9" width="12" height="12" rx="6"/><rect x="21" y="9" width="12" height="12" rx="6"/><rect x="30" y="9" width="12" height="12" rx="6"/></g></svg>' },
      fundido: { id: "fundido", nome: "Ferro fundido", resumo: "rompe a 150 MPa · frágil: quebra sem aviso", limite: 150, E: 100, ductil: false, fragil: 1.5, preco: 0.5, moedas: "●", runa: "2.3", laudo: "ferro fundido, ruptura à tração a 150 MPa, frágil",
        seda: "Ferro fundido? Duro como pedra... e quebra como pedra. Pergunta ao ferreiro o que acontece quando puxam.",
        icone: '<svg viewBox="0 0 48 30" aria-hidden="true"><g fill="#6d6d6d" stroke="#3b2412" stroke-width="1.6"><rect x="3" y="8" width="13" height="14" rx="2"/><rect x="17" y="8" width="13" height="14" rx="2"/><rect x="31" y="8" width="13" height="14" rx="2"/></g><g fill="#fbf3dc" opacity=".8"><circle cx="9" cy="13" r="1.3"/><circle cx="24" cy="17" r="1.1"/><circle cx="37" cy="12" r="1.4"/></g><path d="M22 10l3 4-2 3 3 3" fill="none" stroke="#a02020" stroke-width="1.2"/></svg>' },
    };
    var ANC = {
      rocha: { id: "rocha", nome: "Bloco na rocha", resumo: "segura até 3.000 kN de puxão", capacidade: 3000, preco: 30, falha: "ancora", moedas: "30 moedas", seda: "Rocha. Agora sim alguém segura a outra ponta do cabo.",
        icone: '<svg viewBox="0 0 48 30" aria-hidden="true"><path d="M2 28l8-16 10 2 8-8 10 10 8 12z" fill="#cdbb8c" stroke="#3b2412" stroke-width="1.4"/><path d="M8 24l-3 3M16 20l-5 5M26 16l-6 6M34 20l-5 5M40 24l-3 3" stroke="#3b2412" stroke-width="1"/><rect x="18" y="16" width="12" height="9" fill="#b39c72" stroke="#3b2412" stroke-width="1.2"/></svg>' },
      areia: { id: "areia", nome: "Bloco na areia", resumo: "segura até 1.000 kN, só pelo atrito", capacidade: 1000, preco: 10, falha: "ancora", moedas: "10 moedas", seda: "Areia... perto é. Firme, veremos.",
        icone: '<svg viewBox="0 0 48 30" aria-hidden="true"><path d="M2 20h44v8H2z" fill="#e3d3ad" stroke="#3b2412" stroke-width="1.2"/><path d="M6 24h1M12 26h1M18 23h1M28 25h1M36 23h1M42 26h1" stroke="#3b2412" stroke-width="1.4"/><rect x="18" y="10" width="12" height="10" fill="#b39c72" stroke="#3b2412" stroke-width="1.2"/><path d="M30 15h8l-3-2M38 15l-3 2" fill="none" stroke="#a02020" stroke-width="1.2"/></svg>' },
      torre: { id: "torre", nome: "Só nas torres", resumo: "segura 0 kN de puxão horizontal", capacidade: 0, preco: 0, falha: "torre", moedas: "de graça", seda: "Amarrar só na torre? E quem puxa do outro lado, aprendiz?",
        icone: '<svg viewBox="0 0 48 30" aria-hidden="true"><rect x="21" y="4" width="6" height="24" fill="#8f8a7f" stroke="#3b2412" stroke-width="1.2"/><path d="M24 6q-10 6-18 22M24 6q10 6 18 22" fill="none" stroke="#3b2412" stroke-width="1.6" stroke-dasharray="3 2"/><path d="M4 26h40" stroke="#3b2412" stroke-width="1.2"/><text x="36" y="14" font-size="10" fill="#a02020">?</text></svg>' },
    };
    var EST = [
      { id: "aldeoes", emoji: "🚶", nome: "os aldeões atravessam", q: 12, fator: 1.0, nota: "multidão de 12 kN/m" },
      { id: "carrocas", emoji: "🐴", nome: "as carroças pesadas passam", q: 20, fator: 1.2, nota: "carroças de 20 kN/m, solavanco ×1,2" },
      { id: "tempestade", emoji: "⛈️", nome: "a tempestade castiga o vão", q: 16, fator: 1.4, nota: "vento e chuva de 16 kN/m, rajadas ×1,4" },
    ];
    var L = 60, G = 8, ORC = 170, FOLGA = 3, PRECO_TORRE = 1.5, EXAG = 8;
    var ESC = 200 / 60, X1 = 80, X2 = 280, YD = 140, XA1 = 36, XA2 = 324, YA = 150;

    function geometria(cfg, extraPx) {
      var f = Number(cfg.flecha), fpx = f * ESC, yTop = YD - (f + FOLGA) * ESC, xm = (X1 + X2) / 2, sag = fpx + (extraPx || 0);
      var cabo = "M" + X1 + " " + r1(yTop) + "Q" + xm + " " + r1(yTop + 2 * sag) + " " + X2 + " " + r1(yTop);
      var deck = "M" + (X1 - 12) + " " + YD + "L" + X1 + " " + YD + "Q" + xm + " " + r1(YD + 2 * (extraPx || 0)) + " " + X2 + " " + YD + "L" + (X2 + 12) + " " + YD;
      var pend = "";
      for (var x = X1 + 20; x < X2; x += 20) {
        var t = (x - X1) / (X2 - X1);
        var yc = (1 - t) * (1 - t) * yTop + 2 * (1 - t) * t * (yTop + 2 * sag) + t * t * yTop;
        var yd = YD + 2 * (1 - t) * t * (extraPx || 0);
        pend += "M" + x + " " + r1(yc) + "V" + r1(yd);
      }
      var estais = "M" + XA1 + " " + YA + "L" + X1 + " " + r1(yTop) + "M" + XA2 + " " + YA + "L" + X2 + " " + r1(yTop);
      var P0 = [X1, yTop], C = [xm, yTop + 2 * sag], P2 = [X2, yTop];
      var e = sub(P0, C, P2, 0, 0.34), d = sub(P0, C, P2, 0.66, 1);
      var rompido = "M" + r1(e[0][0]) + " " + r1(e[0][1]) + "Q" + r1(e[1][0]) + " " + r1(e[1][1]) + " " + r1(e[2][0]) + " " + r1(e[2][1]) + "q-6 22 2 38" +
        "M" + r1(d[2][0]) + " " + r1(d[2][1]) + "Q" + r1(d[1][0]) + " " + r1(d[1][1]) + " " + r1(d[0][0]) + " " + r1(d[0][1]) + "q6 22-2 38";
      return { yTop: yTop, cabo: cabo, deck: deck, pend: pend, estais: estais, xm: xm, rompido: rompido };
    }
    function sub(P0, C, P2, a, b) {
      function p(t) { return [(1 - t) * (1 - t) * P0[0] + 2 * (1 - t) * t * C[0] + t * t * P2[0], (1 - t) * (1 - t) * P0[1] + 2 * (1 - t) * t * C[1] + t * t * P2[1]]; }
      function tg(t) { return [2 * (1 - t) * (C[0] - P0[0]) + 2 * t * (P2[0] - C[0]), 2 * (1 - t) * (C[1] - P0[1]) + 2 * t * (P2[1] - C[1])]; }
      var A = p(a), B = p(b), tA = tg(a), k = (b - a) / 2;
      return [A, [A[0] + tA[0] * k, A[1] + tA[1] * k], B];
    }
    function traco(d) { return limitar(1.2 + (d - 5) * 0.32, 1.2, 4.2); }

    OBRAS.bloco3 = {
      id: "bloco3", nome: "Ponte dos Tendões", icone: "🌉", guardia: "Seda, a Tecelã dos Tendões de Aço", emoji: "🪢", orcamento: ORC,
      falas: {
        nova: "Vês o vão, aprendiz? Do outro lado fica o mercado, e ninguém atravessa a nado. Escolhe o cabo, escolhe onde prendê-lo, acerta a flecha e a espessura. O tesoureiro te deu 170 moedas. Os números não mentem; o ferreiro, às vezes.",
        pe: "Ela canta ao vento e não se rompe. Os cabos trabalham como tendões: puxam, avisam, aguentam. Isto é obra de quem leu os números.",
        ouro: "De pé, e ainda sobrou moeda no cofre. Engenheiro bom não é o que gasta mais: é o que sabe onde a força passa.",
        fraca: "De pé... por enquanto. Folga pequena não tem onde errar. Eu, no teu lugar, não dormiria tranquila na próxima grande tempestade.",
        ferida: "Os destroços ainda estão no rio. Não baixes os olhos: toda ponte que caiu ensinou a seguinte a ficar de pé. Lê o laudo, lê a runa e volta à mesa.",
        reconstruida: "Reconstruída! Grava isto: os melhores construtores não são os que nunca erraram, são os que voltaram ao canteiro. A placa de bronze é tua.",
        orcamento: "O tesoureiro cruzou os braços: isso custa mais do que o reino tem. Afina o projeto.",
        voltarFerida: "De volta à mesa. O laudo disse onde a força venceu: mexe ali.", voltarPe: "De volta à mesa. Dá para fazer melhor, ou mais barato?",
      },
      cartas: [
        { id: "material", titulo: "O cabo: material", opcoes: MAT, ordem: ["aco", "forjado", "fundido"] },
        { id: "ancoragem", titulo: "A ancoragem: onde prender", opcoes: ANC, ordem: ["rocha", "areia", "torre"] },
      ],
      ajustes: [
        { id: "flecha", rotulo: "Flecha do cabo", min: 5, max: 12, passo: 0.5, padrao: 7, dica: "Quanto o cabo desce entre as torres. Mais flecha: torres mais altas, cabo puxa menos.",
          formatar: function (v) { return fmt(v, 1) + " m  (1/" + fmt(L / v, 1) + " do vão · torres de " + fmt(v + FOLGA) + " m)"; },
          falas: { baixo: "Cabo esticado como corda de alaúde. Sabes quanto ele vai puxar?", alto: "Torres altas custam pedra, mas o cabo agradece: quanto mais flecha, menos puxão." } },
        { id: "diametro", rotulo: "Espessura do cabo", min: 5, max: 14, passo: 0.5, padrao: 8, dica: "Diâmetro de cada um dos 2 cabos. Tensão = força ÷ área.",
          formatar: function (v) { return fmt(v, 1) + " cm  (área dos 2 cabos: " + fmt(2 * Math.PI * v * v / 4) + " cm²)"; },
          falas: { alto: "Cabo grosso dorme tranquilo. O tesoureiro, não.", baixo: "Fino assim? Lembra: tensão é força dividida por área. Área pequena, tensão grande." } },
      ],
      estagios: EST,
      medidor: { titulo: "Tensão no cabo", valor: function (e) { return fmt(e.tensaoEf) + " MPa"; }, sub: function (e, cfg) { return "limite " + fmt(MAT[cfg.material].limite) + " MPa"; } },
      tiles: [
        { rotulo: "Carga total", valor: function (e) { return fmt(e.cargaTotal) + " kN"; }, sub: function (e) { return fmt(e.w, 1) + " kN/m · " + e.nota; }, vazio: "kN sobre o vão" },
        { rotulo: "Fator de segurança", fs: true, sub: "limite ÷ tensão (meta ≥ 1,5)" },
        { rotulo: "Flecha do tabuleiro", valor: function (e) { return fmt(e.flechaExtra, 1) + " cm"; }, sub: "desenho exagerado " + EXAG + "×" },
        { rotulo: "Puxão na ancoragem", valor: function (e) { return fmt(e.H) + " kN"; }, sub: function (e, cfg) { return "segura " + fmt(ANC[cfg.ancoragem].capacidade) + " kN"; } },
      ],
      escala: function (cfg) { return "1 : 90 · f/L = 1/" + fmt(L / cfg.flecha, 1); },
      calcular: function (cfg) {
        var mat = MAT[cfg.material], anc = ANC[cfg.ancoragem];
        var f = limitar(Number(cfg.flecha), 5, 12), d = limitar(Number(cfg.diametro), 5, 14);
        var area = 2 * Math.PI * Math.pow(d * 10 / 2, 2);
        var r = { completo: !!(mat && anc), areaCm2: area / 100, alturaTorre: f + FOLGA };
        r.custo = custoDe([
          { rotulo: "cabo", valor: mat ? mat.preco * d * d : 0 }, { rotulo: "ancoragem", valor: anc ? anc.preco : 0 }, { rotulo: "torres", valor: 2 * (f + FOLGA) * PRECO_TORRE },
        ], ORC);
        if (!r.completo) return r;
        var Lc = L * (1 + (8 / 3) * Math.pow(f / L, 2));
        var ests = EST.map(function (def, i) {
          var w = G + def.q * def.fator, H = w * L * L / (8 * f), Tn = H * Math.sqrt(1 + Math.pow(4 * f / L, 2));
          var tensao = Tn * 1000 / area, din = def.fator > 1, tEf = mat.ductil ? tensao : tensao * (din ? mat.fragil : 1);
          var e = estagio(def, { indice: i, w: w, cargaTotal: w * L, H: H, T: Tn, tensao: tensao, tensaoEf: tEf, fs: mat.limite / tEf, razao: tEf / mat.limite,
            flechaExtra: (3 * L / (16 * f)) * (Tn * Lc / (mat.E * area)) * 100, cargaTexto: fmt(w * L) + " kN", esforcoTexto: fmt(tEf) + " / " + fmt(mat.limite) + " MPa" });
          e.deflPx = limitar(e.flechaExtra / 100 * ESC * EXAG, 0, 26);
          if (anc.capacidade < H) {
            e.resultado = "falha"; e.falha = anc.falha; e.runa = "3.2";
            e.porque = anc.id === "torre"
              ? "Sem ancoragem, ninguém segura a outra ponta: o cabo puxa o alto das torres para dentro do vão com " + fmt(H) + " kN e elas vergam antes de o primeiro aldeão chegar ao meio. Toda tração precisa de uma reação do outro lado (runa 3.2)."
              : "O cabo puxou a ancoragem com " + fmt(H) + " kN, mas a areia só segurava " + fmt(anc.capacidade) + " kN pelo atrito. O bloco deslizou, o cabo afrouxou e o tabuleiro cedeu. A reação do chão tem de ser tão forte quanto o puxão (runa 3.2).";
          } else if (tEf >= mat.limite) {
            e.resultado = "falha"; e.falha = mat.ductil ? "escoa" : "cabo"; e.runa = mat.ductil ? "3.4" : "2.3";
            e.porque = mat.ductil
              ? "O cabo chegou a " + fmt(tensao) + " MPa, acima do limite de escoamento de " + fmt(mat.limite) + " MPa: passou do limite elástico, esticou de vez e não voltou. O tabuleiro afundou. Mais flecha ou cabo mais grosso (runas 3.4 e 4.1)."
              : "A tensão chegou a " + fmt(tensao) + " MPa e, com o solavanco, vale ×1,5 para um material frágil: " + fmt(tEf) + " MPa contra " + fmt(mat.limite) + " MPa de ruptura. O ferro fundido partiu seco, sem esticar antes. Frágil não avisa (runa 2.3).";
          }
          return e;
        });
        var extras = mat.ductil ? [] : [{ runa: "2.3", texto: "ferro fundido não avisa: pode quebrar de surpresa na grande tempestade, por mais folga que tenha (runa 2.3)" }];
        fecharVeredito(r, ests, extras);
        r.resumo = "Fator de segurança de " + fmt(r.fsMin, 2) + " no pior estágio: há folga para o peso que ninguém previu.";
        r.itens = [
          "<strong>Material:</strong> " + esc(mat.laudo),
          "<strong>Ancoragem:</strong> " + esc(anc.nome.toLowerCase()) + ", segura " + fmt(anc.capacidade) + " kN",
          "<strong>Geometria:</strong> flecha " + fmt(f, 1) + " m (1/" + fmt(L / f, 1) + " do vão), 2 cabos de " + fmt(d, 1) + " cm (área " + fmt(area / 100) + " cm²), torres de " + fmt(f + FOLGA) + " m",
        ];
        r.nota = "Modelo simplificado da Mesa: cabo parabólico com carga uniforme num vão de 60 m, dois cabos, valores de material típicos e arredondados.";
        return r;
      },
      planta: {
        fundo: function () {
          return ceu() +
            '<path class="ob-colina" d="M0 150q40-26 90-14L0 160z"/><path class="ob-colina" d="M360 150q-40-26-90-14l90 24z"/>' +
            '<path class="ob-rio" d="M88 168q92 10 184 0v42H88z"/><path class="ob-onda" d="M120 178q8-3 16 0M180 184q8-3 16 0M240 177q8-3 16 0M150 194q8-3 16 0M210 196q8-3 16 0"/>' +
            '<path class="ob-margem" d="M0 146h88l-10 64H0z"/><path class="ob-margem" d="M360 146h-88l10 64h78z"/><path class="ob-margem-borda" d="M0 146h88M272 146h88"/>' +
            '<path class="ob-hachura" d="' + hachura(14, 162, 6, 12, 6) + hachura(298, 162, 6, 12, -6) + '"/>';
        },
        estrutura: function (cfg) {
          var g = geometria(cfg, 0), mat = MAT[cfg.material], anc = ANC[cfg.ancoragem], esb = !mat || !anc, tr = traco(Number(cfg.diametro));
          var cc = "ob-cabo ob-cabo-" + (mat ? mat.id : "esboco"), s = "";
          if (anc && anc.id === "rocha") s += '<path class="ob-rocha" d="M8 146l10-10 14 2 12 8-4 20H6z"/><path class="ob-rocha" d="M352 146l-10-10-14 2-12 8 4 20h30z"/><path class="ob-hachura-forte" d="M14 150l-6 6M26 148l-10 10M38 150l-10 10M346 150l6 6M334 148l10 10M322 150l10 10"/><rect class="ob-ancora ob-ancora-e" x="26" y="146" width="20" height="14" rx="1"/><rect class="ob-ancora ob-ancora-d" x="314" y="146" width="20" height="14" rx="1"/>';
          else if (anc && anc.id === "areia") s += '<path class="ob-areia" d="M4 146h80v10H4z"/><path class="ob-areia" d="M276 146h80v10h-80z"/><path class="ob-pontos" d="M10 150h1M20 153h1M30 149h1M50 152h1M62 149h1M74 153h1M286 150h1M298 153h1M310 149h1M330 152h1M342 149h1M352 153h1"/><rect class="ob-ancora ob-ancora-e" x="26" y="134" width="20" height="12" rx="1"/><rect class="ob-ancora ob-ancora-d" x="314" y="134" width="20" height="12" rx="1"/>';
          var hT = YD - g.yTop + 6;
          s += '<rect class="ob-torre ob-torre-e' + (esb ? " ob-esboco" : "") + '" x="' + (X1 - 4) + '" y="' + r1(g.yTop) + '" width="8" height="' + r1(hT) + '"/><rect class="ob-torre ob-torre-d' + (esb ? " ob-esboco" : "") + '" x="' + (X2 - 4) + '" y="' + r1(g.yTop) + '" width="8" height="' + r1(hT) + '"/>' +
            '<path class="ob-torre-base" d="M' + (X1 - 8) + ' ' + (YD + 6) + 'h16v4h-16zM' + (X2 - 8) + ' ' + (YD + 6) + 'h16v4h-16z"/>';
          if (anc && anc.id !== "torre") s += '<path class="' + cc + ' ob-estais" d="' + g.estais + '" style="stroke-width:' + tr + 'px"/>';
          else if (anc) s += '<path class="ob-no" d="M' + (X1 - 6) + ' ' + r1(g.yTop + 2) + 'h12M' + (X2 - 6) + ' ' + r1(g.yTop + 2) + 'h12"/>';
          s += '<path class="' + cc + ' ob-cabo-principal' + (esb ? " ob-esboco" : "") + '" d="' + g.cabo + '" style="stroke-width:' + tr + 'px"/>';
          if (mat && mat.id === "aco") s += '<path class="ob-cabo-brilho ob-def-cabo" d="' + g.cabo + '" style="stroke-width:' + Math.max(0.6, tr * 0.35) + 'px"/>';
          if (mat && mat.id === "forjado") s += '<path class="ob-cabo-elos ob-def-cabo" d="' + g.cabo + '" style="stroke-width:' + Math.max(0.8, tr * 0.45) + 'px"/>';
          if (mat && mat.id === "fundido") s += '<path class="ob-cabo-bolhas ob-def-cabo" d="' + g.cabo + '" style="stroke-width:' + Math.max(0.8, tr * 0.4) + 'px"/>';
          s += '<path class="ob-pendurais' + (esb ? " ob-esboco" : "") + '" d="' + g.pend + '"/><path class="ob-tabuleiro' + (esb ? " ob-esboco" : "") + '" d="' + g.deck + '"/>' +
            '<path class="ob-trinca" d="M' + (g.xm - 6) + ' ' + (YD - 3) + 'l5 8-4 5 6 6"/>' +
            '<path class="ob-cabo-rompido" d="' + g.rompido + '" style="stroke-width:' + Math.max(1.6, tr) + 'px"/>' + bandeira(X1, g.yTop) +
            '<g class="ob-cotas"><path d="M' + X1 + ' 196V190M' + X2 + ' 196V190M' + X1 + ' 193H' + X2 + '"/><text x="' + g.xm + '" y="205" text-anchor="middle">vão ' + fmt(L) + ' m</text>' +
            '<path d="M' + (g.xm + 46) + ' ' + r1(g.yTop) + 'H' + (g.xm + 54) + 'M' + (g.xm + 46) + ' ' + r1(g.yTop + Number(cfg.flecha) * ESC) + 'H' + (g.xm + 54) + 'M' + (g.xm + 50) + ' ' + r1(g.yTop) + 'V' + r1(g.yTop + Number(cfg.flecha) * ESC) + '"/>' +
            '<text x="' + (g.xm + 56) + '" y="' + r1(g.yTop + Number(cfg.flecha) * ESC / 2 + 3.5) + '">f = ' + fmt(cfg.flecha, 1) + ' m</text></g>' +
            '<g class="ob-carga ob-carga-aldeoes">' + figuras(5, YD) + '</g><g class="ob-carga ob-carga-carrocas">' + carrocas(2, YD) + '</g><g class="ob-andantes-planta">' + figuras(3, YD) + "</g>";
          return s;
        },
        deformar: function (el, cfg, px) {
          var g = geometria(cfg, px);
          var c = el.querySelector(".ob-cabo-principal"), p = el.querySelector(".ob-pendurais"), t = el.querySelector(".ob-tabuleiro");
          if (c) c.setAttribute("d", g.cabo);
          el.querySelectorAll(".ob-def-cabo").forEach(function (e) { e.setAttribute("d", g.cabo); });
          if (p) p.setAttribute("d", g.pend);
          if (t) t.setAttribute("d", g.deck);
        },
        quedaPx: { escoa: 40, ancora: 30 },
        legendaErguer: "🏗️ Erguendo as torres, lançando os cabos, assentando o tabuleiro...",
      },
      mapa: function (sit, dados) {
        var bronze = !!(dados && dados.reconstruida), ouro = !!(dados && dados.ouro);
        if (sit === "terreno") return '<path d="M98 113h58" stroke="' + TINTA + '" stroke-width="1" opacity=".45"/><path d="M102 113v-5M107 113v-5M102 110h5M146 113v-5M151 113v-5M146 110h5"' + T + ' stroke-width="1" opacity=".6"/><path d="M126 113v-9" stroke="#5a3d22" stroke-width="2.4"/><path d="M115 96h22l-1 9h-20z" fill="#d6c39b"' + T + ' stroke-width="1.1"/><path d="M118 100h16M118 102.5h10"' + T + ' stroke-width=".9" opacity=".7"/><path d="M131 100.5l3 3M134 100.5l-3 3"' + T + ' stroke-width=".9" opacity=".7"/>';
        var s = '<rect x="94" y="109" width="7" height="5" fill="#b39c72"' + T + ' stroke-width=".8"/><rect x="151" y="109" width="7" height="5" fill="#b39c72"' + T + ' stroke-width=".8"/>' +
          '<rect x="106" y="91" width="4" height="22" fill="#8f8a7f"' + T + ' stroke-width=".9"/><rect x="144" y="91" width="4" height="22" fill="#8f8a7f"' + T + ' stroke-width=".9"' + (sit === "ferida" ? ' transform="rotate(-14 146 113)"' : "") + "/>";
        if (sit === "ferida") return s + '<path d="M97 111L108 91Q127 120 143 99" fill="none"' + T + ' stroke-width="1.2"/><path d="M143 99q4 6 2 12" fill="none" stroke="#a02020" stroke-width="1.1" stroke-dasharray="2 1.5"/><path class="ob-mp-deck" d="M98 105h26v3H98z"' + T + ' stroke-width=".8"/><path class="ob-mp-deck" d="M126 108l28-6 1 3-28 7z"' + T + ' stroke-width=".8"/><path d="M122 103l2 4-2 3 3 3" fill="none" stroke="#a02020" stroke-width="1.2"/><g class="ob-mp-fumaca"><circle cx="138" cy="100" r="2.2"/><circle cx="141" cy="95" r="2.8"/><circle cx="145" cy="89" r="3.2"/></g>';
        s += '<path d="M97 111L108 91Q127 112 146 91L157 111" fill="none"' + T + ' stroke-width="1.2"/><path d="M114 97.5v8M120 100.5v5M127 101.5v4M134 100.5v5M140 97.5v8" fill="none"' + T + ' stroke-width=".6"/>' +
          '<path class="ob-mp-deck' + (sit === "fraca" ? " ob-m-range" : "") + '" d="M98 105h58v3H98z"' + T + ' stroke-width=".8"/>' + andantes(100, 101.6, 54);
        if (sit === "pe") s += '<path d="M108 91V84"' + T + ' stroke-width=".9"/><path d="M108 84l6 2.2-6 2.2z" fill="' + (ouro ? "#d4af37" : "#fbf3dc") + '"' + T + ' stroke-width=".6"/>';
        if (bronze) s += '<rect x="122" y="109" width="10" height="3.5" rx=".6" fill="#b08850"' + T + ' stroke-width=".5"/>';
        return s;
      },
    };
  })();

  // Dois andantes que vão e voltam num trecho do mapa (x0, y da cabeça, comprimento)
  function andantes(x0, y, comp) {
    return '<g class="ob-andantes" style="--ob-anda:' + comp + 'px"><g class="ob-andante"><circle cx="' + x0 + '" cy="' + y + '" r="1.3"/><path d="M' + x0 + ' ' + (y + 1.4) + 'v2.2M' + x0 + ' ' + (y + 3.6) + 'l-1 1.3M' + x0 + ' ' + (y + 3.6) + 'l1 1.3"/></g>' +
      '<g class="ob-andante ob-andante-2"><circle cx="' + x0 + '" cy="' + y + '" r="1.3"/><path d="M' + x0 + ' ' + (y + 1.4) + 'v2.2M' + x0 + ' ' + (y + 3.6) + 'l-1 1.3M' + x0 + ' ' + (y + 3.6) + 'l1 1.3"/></g></g>';
  }
  function fumaca(cx, cy) {
    return '<g class="ob-mp-fumaca"><circle cx="' + cx + '" cy="' + cy + '" r="2.2"/><circle cx="' + (cx + 3) + '" cy="' + (cy - 5) + '" r="2.8"/><circle cx="' + (cx + 7) + '" cy="' + (cy - 11) + '" r="3.2"/></g>';
  }
  function placaTerreno(x, y) {
    // placa de madeira "aqui cabe uma obra", com estacas (x,y = canto inferior esquerdo da área)
    return '<path d="M' + x + ' ' + y + 'h58" stroke="' + TINTA + '" stroke-width="1" opacity=".45"/><path d="M' + (x + 4) + ' ' + y + 'v-5M' + (x + 9) + ' ' + y + 'v-5M' + (x + 4) + ' ' + (y - 3) + 'h5M' + (x + 48) + ' ' + y + 'v-5M' + (x + 53) + ' ' + y + 'v-5M' + (x + 48) + ' ' + (y - 3) + 'h5"' + T + ' stroke-width="1" opacity=".6"/>' +
      '<path d="M' + (x + 28) + ' ' + y + 'v-9" stroke="#5a3d22" stroke-width="2.4"/><path d="M' + (x + 17) + ' ' + (y - 17) + 'h22l-1 9h-20z" fill="#d6c39b"' + T + ' stroke-width="1.1"/><path d="M' + (x + 20) + ' ' + (y - 13) + 'h16M' + (x + 20) + ' ' + (y - 10.5) + 'h10"' + T + ' stroke-width=".9" opacity=".7"/><path d="M' + (x + 33) + ' ' + (y - 12.5) + 'l3 3M' + (x + 36) + ' ' + (y - 12.5) + 'l-3 3"' + T + ' stroke-width=".9" opacity=".7"/>';
  }
  function bandeirinha(x, yTop, ouro) {
    return '<path d="M' + x + ' ' + yTop + 'V' + (yTop - 7) + '"' + T + ' stroke-width=".9"/><path d="M' + x + ' ' + (yTop - 7) + 'l6 2.2-6 2.2z" fill="' + (ouro ? "#d4af37" : "#fbf3dc") + '"' + T + ' stroke-width=".6"/>';
  }
  function bronzinho(x, y) { return '<rect x="' + x + '" y="' + y + '" width="10" height="3.5" rx=".6" fill="#b08850"' + T + ' stroke-width=".5"/>'; }
  var util = { fmt: fmt, r1: r1, limitar: limitar, esc: esc, figuras: figuras, carrocas: carrocas, ceu: ceu, bandeira: bandeira, hachura: hachura, estagio: estagio, fecharVeredito: fecharVeredito, custoDe: custoDe, andantes: andantes, fumaca: fumaca, placaTerreno: placaTerreno, bandeirinha: bandeirinha, bronzinho: bronzinho, T: T, TINTA: TINTA };

  // =====================================================================
  // BLOCO 0 · TORRE DE VIGIA (alvenaria sob o vento; missão: enxergar o mar)
  // =====================================================================
  (function () {
    var MAT = {
      pedra: { id: "pedra", nome: "Pedra aparelhada", resumo: "γ 24 kN/m³ · resiste 20 MPa · não teme chuva", gama: 24, res: 20, preco: 0.5, moedas: "●●●", runa: "1.4", laudo: "pedra aparelhada, 24 kN/m³, resistência 20 MPa",
        seda: "Pedra. Pesada, cara, eterna. Os primeiros construtores não erraram nela.",
        icone: '<svg viewBox="0 0 48 30" aria-hidden="true"><g fill="#cdbb8c" stroke="#3b2412" stroke-width="1.3"><rect x="3" y="4" width="20" height="10"/><rect x="25" y="4" width="20" height="10"/><rect x="3" y="16" width="12" height="10"/><rect x="17" y="16" width="28" height="10"/></g></svg>' },
      tijolo: { id: "tijolo", nome: "Tijolo cozido", resumo: "γ 18 kN/m³ · resiste 8 MPa · duro como pedra depois do forno", gama: 18, res: 8, preco: 0.35, moedas: "●●", runa: "1.1", laudo: "tijolo cozido, 18 kN/m³, resistência 8 MPa",
        seda: "Tijolo cozido: o truque do forno levou milênios para aparecer. Barato e firme.",
        icone: '<svg viewBox="0 0 48 30" aria-hidden="true"><g fill="#c9734f" stroke="#3b2412" stroke-width="1.2"><rect x="3" y="4" width="13" height="6"/><rect x="18" y="4" width="13" height="6"/><rect x="33" y="4" width="12" height="6"/><rect x="3" y="12" width="6" height="6"/><rect x="11" y="12" width="13" height="6"/><rect x="26" y="12" width="13" height="6"/><rect x="41" y="12" width="4" height="6"/><rect x="3" y="20" width="13" height="6"/><rect x="18" y="20" width="13" height="6"/><rect x="33" y="20" width="12" height="6"/></g></svg>' },
      taipa: { id: "taipa", nome: "Taipa (barro cru)", resumo: "γ 16 kN/m³ · resiste 2 MPa seca · na chuva, quase nada", gama: 16, res: 2, chuva: 0.1, preco: 0.15, moedas: "●", runa: "1.1", laudo: "taipa de barro cru, 16 kN/m³, 2 MPa seca",
        seda: "Barro cru? Há 9.000 anos se faz casa assim... e há 9.000 anos a chuva as leva.",
        icone: '<svg viewBox="0 0 48 30" aria-hidden="true"><rect x="3" y="5" width="42" height="20" rx="2" fill="#c8a877" stroke="#3b2412" stroke-width="1.3"/><path d="M8 10q6 2 12 0t12 0 10 0M8 18q6 2 12 0t12 0 10 0" fill="none" stroke="#3b2412" stroke-width=".9" opacity=".6"/><path d="M36 8l-3 7M40 7l-3 7" stroke="#5a7f9a" stroke-width="1.2"/></svg>' },
    };
    var FUN = {
      larga: { id: "larga", nome: "Sapata larga na rocha", resumo: "o solo aguenta 400 kPa", cap: 400, preco: 40, moedas: "40 moedas", seda: "Sapata larga na rocha. Base sólida: o segredo de toda torre que ficou de pé.",
        icone: '<svg viewBox="0 0 48 30" aria-hidden="true"><path d="M2 28l6-12 10 2 8-8 10 8 10 10z" fill="#cdbb8c" stroke="#3b2412" stroke-width="1.3"/><rect x="8" y="14" width="32" height="8" fill="#b39c72" stroke="#3b2412" stroke-width="1.2"/><rect x="18" y="2" width="12" height="12" fill="#d9c49a" stroke="#3b2412" stroke-width="1.2"/></svg>' },
      estreita: { id: "estreita", nome: "Sapata estreita", resumo: "o solo aguenta 200 kPa", cap: 200, preco: 15, moedas: "15 moedas", seda: "Sapata estreita: economiza pedra e aperta o chão. Até quando?",
        icone: '<svg viewBox="0 0 48 30" aria-hidden="true"><path d="M2 28h44v-8H2z" fill="#d6c39b" stroke="#3b2412" stroke-width="1.2"/><rect x="16" y="14" width="16" height="6" fill="#b39c72" stroke="#3b2412" stroke-width="1.2"/><rect x="18" y="2" width="12" height="12" fill="#d9c49a" stroke="#3b2412" stroke-width="1.2"/></svg>' },
      mole: { id: "mole", nome: "Direto no solo mole", resumo: "o solo aguenta 80 kPa", cap: 80, preco: 0, moedas: "de graça", seda: "Direto na lama? Pergunta à torre de Pisa como terminou essa economia.",
        icone: '<svg viewBox="0 0 48 30" aria-hidden="true"><path d="M2 28q8-6 16-2t14 0 14 2v2H2z" fill="#9c8a6a" stroke="#3b2412" stroke-width="1.2"/><rect x="18" y="6" width="12" height="14" fill="#d9c49a" stroke="#3b2412" stroke-width="1.2" transform="rotate(8 24 20)"/><path d="M8 24h1M38 22h1M28 26h1" stroke="#3b2412" stroke-width="1.6"/></svg>' },
    };
    var EST = [
      { id: "brisa", emoji: "🌬️", nome: "a brisa do mar empurra", q: 0.4, fator: 1.0, nota: "vento de 0,4 kPa" },
      { id: "vendaval", emoji: "💨", nome: "o vendaval aperta", q: 1.0, fator: 1.1, nota: "vento de 1,0 kPa, rajadas ×1,1" },
      { id: "tempestade", emoji: "⛈️", nome: "a tempestade castiga a torre", q: 1.8, fator: 1.3, nota: "vento de 1,8 kPa ×1,3, com chuva", chuva: true },
    ];
    var TP = 0.6, ORC = 170, ESC = 3.33, XC = 150, YC = 146, H_MAR = 12;
    OBRAS.bloco0 = {
      id: "bloco0", nome: "Torre de Vigia", icone: "🗼", guardia: "Aldric, o Porteiro do Portal", emoji: "🗝️", orcamento: ORC,
      falas: {
        nova: "O reino precisa enxergar o mar, aprendiz: 12 metros de torre, pelo menos. Mas toda torre é uma pergunta ao chão: aguentas o meu peso? Escolhe a pedra e a base, acerta altura e largura. 170 moedas no cofre.",
        pe: "Firme como a primeira pedra. O vento empurra, o chão responde, e a torre nem pisca. Enxergas o mar?",
        ouro: "De pé, vendo o mar, e com moeda sobrando. Quem conhece o chão não precisa de ouro em dobro.",
        fraca: "Está de pé... mas rangeu. Ou a folga é curta, ou a vista é curta. Reforça, ou sobe mais.",
        ferida: "Ruiu. Não te envergonhes: a torre de Pisa também começou assim, e hoje é famosa. Lê o laudo, lê a runa, e volta com uma base melhor.",
        reconstruida: "Reconstruída! A segunda torre é sempre mais sábia que a primeira. A placa de bronze é tua.",
        orcamento: "O tesoureiro cruzou os braços: isso custa mais do que o reino tem. Afina o projeto.",
        voltarFerida: "De volta à mesa. O laudo disse quem venceu: o chão, o vento ou a chuva. Mexe ali.", voltarPe: "De volta à mesa. Mais alta? Mais barata? A escolha é tua.",
      },
      cartas: [
        { id: "material", titulo: "A parede: material", opcoes: MAT, ordem: ["pedra", "tijolo", "taipa"] },
        { id: "fundacao", titulo: "A base: fundação", opcoes: FUN, ordem: ["larga", "estreita", "mole"] },
      ],
      ajustes: [
        { id: "altura", rotulo: "Altura da torre", min: 8, max: 30, passo: 1, padrao: 14, dica: "Mais alta enxerga mais longe, pesa mais e dá mais braço ao vento.",
          formatar: function (v) { return fmt(v) + " m  (" + (v >= H_MAR ? "enxerga o mar" : "não enxerga o mar: mínimo " + H_MAR + " m") + ")"; },
          falas: { alto: "Trinta metros? O vento lá em cima não tem piedade. E o peso desce todo para a base.", baixo: "Baixa assim, enxergas o quintal. O mar fica para outra vida." } },
        { id: "base", rotulo: "Largura da base", min: 3, max: 10, passo: 0.5, padrao: 6, dica: "Base larga espalha o peso no chão e segura o tombamento. Paredes de 60 cm.",
          formatar: function (v, cfg) { return fmt(v, 1) + " m  (área " + fmt(v * v, 1) + " m² · esbeltez " + fmt(cfg.altura / v, 1) + ")"; },
          falas: { baixo: "Base estreita e torre alta: um livro em pé que qualquer empurrão tomba.", alto: "Base larga dorme tranquila. Mas cada metro a mais é pedra paga." } },
      ],
      estagios: EST,
      medidor: { titulo: "Pressão no solo", valor: function (e) { return fmt(e.p) + " kPa"; }, sub: function (e, cfg) { return "o solo aguenta " + fmt(FUN[cfg.fundacao].cap) + " kPa"; } },
      tiles: [
        { rotulo: "Peso da torre", valor: function (e) { return fmt(e.W) + " kN"; }, sub: function (e) { return "paredes de 60 cm, γ " + e.gama + " kN/m³"; }, vazio: "kN sobre a base" },
        { rotulo: "Fator de segurança", fs: true, sub: "o menor entre solo, tombamento e parede (meta ≥ 1,5)" },
        { rotulo: "Momento do vento", valor: function (e) { return fmt(e.Mv) + " kN·m"; }, sub: function (e) { return "o peso resiste a " + fmt(e.Mr) + " kN·m"; } },
        { rotulo: "Tensão na parede", valor: function (e) { return fmt(e.sigma, 2) + " MPa"; }, sub: function (e) { return "resiste " + fmt(e.res, 1) + " MPa" + (e.chuva ? " (molhada)" : ""); } },
      ],
      escala: function (cfg) { return "1 : 300 · esbeltez h/b = " + fmt(cfg.altura / cfg.base, 1); },
      calcular: function (cfg) {
        var mat = MAT[cfg.material], fun = FUN[cfg.fundacao];
        var h = limitar(Number(cfg.altura), 8, 30), b = limitar(Number(cfg.base), 3, 10);
        var vol = 4 * b * TP * h;
        var r = { completo: !!(mat && fun), volume: vol };
        r.custo = custoDe([{ rotulo: "paredes", valor: mat ? mat.preco * vol : 0 }, { rotulo: "fundação", valor: fun ? fun.preco : 0 }], ORC);
        if (!r.completo) return r;
        var W = mat.gama * vol;
        var ests = EST.map(function (def, i) {
          var Mv = def.q * def.fator * b * h * h / 2, p = W / (b * b) + 6 * Mv / (b * b * b), Mr = W * b / 2;
          var sigma = W / (4 * b * TP) / 1000, res = mat.res * (def.chuva && mat.chuva ? mat.chuva : 1);
          var fsSolo = fun.cap / p, fsTomb = Mr / Mv, fsMat = res / sigma;
          var e = estagio(def, { indice: i, W: W, gama: mat.gama, Mv: Mv, Mr: Mr, p: p, sigma: sigma, res: res, chuva: !!def.chuva, fs: Math.min(fsSolo, fsTomb, fsMat), razao: p / fun.cap,
            cargaTexto: fmt(Mv) + " kN·m", esforcoTexto: fmt(p) + " / " + fmt(fun.cap) + " kPa", deflPx: 0 });
          if (p >= fun.cap) { e.resultado = "falha"; e.falha = "afunda"; e.runa = "1.4"; e.porque = "A base pediu ao chão " + fmt(p) + " kPa (peso de " + fmt(W) + " kN mais o vento), mas ele só aguentava " + fmt(fun.cap) + " kPa. O lado mais apertado afundou e a torre inclinou, como a de Pisa. Base larga ou chão firme (runas 1.4 e E.5)."; }
          else if (Mv >= Mr) { e.resultado = "falha"; e.falha = "tomba"; e.runa = "0.7"; e.porque = "O vento fez um momento de " + fmt(Mv) + " kN·m e o peso da torre só segurava " + fmt(Mr) + " kN·m. Os giros não empataram: tombou como um livro em pé empurrado pela ponta (runa 0.7)."; }
          else if (sigma >= res) { e.resultado = "falha"; e.falha = mat.chuva ? "derrete" : "esmaga"; e.runa = "1.1"; e.porque = mat.chuva ? "A chuva molhou o barro cru: a resistência caiu de 2 MPa para " + fmt(res, 1) + " MPa, menos que os " + fmt(sigma, 2) + " MPa do próprio peso. A parede amoleceu e cedeu. Tijolo só vira pedra depois do forno (runa 1.1)." : "A parede sofreu " + fmt(sigma, 2) + " MPa e só resistia " + fmt(res, 1) + ": esmagou na base (runa 1.1)."; }
          return e;
        });
        var extras = h < H_MAR ? [{ runa: null, texto: "a torre tem " + fmt(h) + " m e a missão pedia pelo menos " + H_MAR + " m para enxergar o mar: de pé, mas sem cumprir o que o reino pediu" }] : [];
        fecharVeredito(r, ests, extras);
        r.resumo = "Fator de segurança de " + fmt(r.fsMin, 2) + " no pior estágio, e a torre enxerga o mar.";
        r.itens = ["<strong>Material:</strong> " + esc(mat.laudo), "<strong>Fundação:</strong> " + esc(fun.nome.toLowerCase()) + ", solo a " + fmt(fun.cap) + " kPa",
          "<strong>Geometria:</strong> " + fmt(h) + " m de altura, base de " + fmt(b, 1) + " × " + fmt(b, 1) + " m, paredes de 60 cm (" + fmt(vol) + " m³, " + fmt(W) + " kN)"];
        r.nota = "Modelo simplificado da Mesa: torre oca de planta quadrada, vento uniforme na face, pressão no solo p = W/b² + 6M/b³, tombamento pelo peso.";
        return r;
      },
      planta: {
        fundo: function () {
          return ceu() + '<path class="ob-mar" d="M232 128q40-6 80 0t48 0v18H232z"/><path class="ob-onda" d="M250 136q8-3 16 0M290 139q8-3 16 0M330 135q8-3 16 0"/>' +
            '<path class="ob-barquinho" d="M300 128l4-10 2 10zM296 128h12l-2 4h-8z"/>' +
            '<path class="ob-margem" d="M0 146h360v64H0z"/><path class="ob-margem-borda" d="M0 146h360"/>';
        },
        estrutura: function (cfg) {
          var mat = MAT[cfg.material], fun = FUN[cfg.fundacao], esb = !mat || !fun;
          var h = Number(cfg.altura), b = Number(cfg.base), hp = h * ESC, bp = Math.max(10, b * ESC), x0 = XC - bp / 2, yT = YC - hp;
          var cor = mat ? ({ pedra: "#cdbb8c", tijolo: "#c9734f", taipa: "#c8a877" })[mat.id] : "#ddd0b0";
          var s = "";
          if (fun && fun.id === "larga") s += '<path class="ob-rocha" d="M' + (x0 - 30) + ' 146l10-8 12 2 8-6 ' + (bp + 20) + ' 0 8 6 12-2 10 8v16H' + (x0 - 30) + 'z"/><rect class="ob-fundacao" x="' + r1(x0 - 8) + '" y="146" width="' + r1(bp + 16) + '" height="10"/>';
          else if (fun && fun.id === "estreita") s += '<rect class="ob-fundacao" x="' + r1(x0 + bp * 0.1) + '" y="146" width="' + r1(bp * 0.8) + '" height="7"/>';
          else if (fun) s += '<path class="ob-lama" d="M' + (x0 - 40) + ' 146h' + (bp + 80) + 'v14H' + (x0 - 40) + 'z"/><path class="ob-pontos" d="M' + (x0 - 30) + ' 152h1M' + (x0 - 12) + ' 155h1M' + (x0 + bp + 12) + ' 151h1M' + (x0 + bp + 30) + ' 155h1"/>';
          s += '<g class="ob-tv-torre' + (esb ? " ob-esboco" : "") + '" style="transform-origin:' + r1(x0 + bp) + 'px 146px">' +
            '<rect class="ob-tv-parede" x="' + r1(x0) + '" y="' + r1(yT) + '" width="' + r1(bp) + '" height="' + r1(hp) + '" style="fill:' + cor + '"/>' +
            '<path class="ob-tv-juntas" d="' + juntas(x0, yT, bp, hp) + '"/>' +
            '<path class="ob-tv-ameias" d="M' + r1(x0 - 2) + ' ' + r1(yT) + 'h' + r1(bp + 4) + 'v-5h-4v3h-4v-3h-4v3h-4v-3h-' + r1(Math.max(0, bp - 20)) + 'v3h-4v-3z" style="fill:' + cor + '"/>' +
            '<path class="ob-tv-janela" d="M' + r1(XC - 1.5) + ' ' + r1(yT + 10) + 'v8M' + r1(XC - 1.5) + ' ' + r1(yT + hp * 0.5) + 'v8"/>' +
            '<path class="ob-tv-porta" d="M' + r1(XC - 4) + ' 146v-9q4-4 8 0v9z"/>' +
            '<path class="ob-trinca" d="M' + r1(x0 + 3) + ' ' + r1(YC - 6) + 'l6-7-3-6 6-7"/>' +
            bandeira(XC, yT - 5) + "</g>" +
            '<path class="ob-tv-vista ' + (h >= H_MAR ? "ob-tv-vista-ok" : "ob-tv-vista-nao") + '" d="M' + r1(x0 + bp) + ' ' + r1(yT) + 'L352 126"/>' +
            '<g class="ob-cotas"><path d="M' + r1(x0 - 14) + ' ' + r1(yT) + 'h6M' + r1(x0 - 14) + ' 146h6M' + r1(x0 - 11) + ' ' + r1(yT) + 'V146"/><text x="' + r1(x0 - 16) + '" y="' + r1((yT + 146) / 2 + 3) + '" text-anchor="end">h = ' + fmt(h) + ' m</text>' +
            '<path d="M' + r1(x0) + ' 168v-6M' + r1(x0 + bp) + ' 168v-6M' + r1(x0) + ' 165h' + r1(bp) + '"/><text x="' + XC + '" y="178" text-anchor="middle">b = ' + fmt(b, 1) + ' m</text></g>' +
            '<g class="ob-carga ob-carga-brisa ob-setas-vento"><path d="M30 ' + r1(yT + hp * 0.3) + 'h40l-6-4M70 ' + r1(yT + hp * 0.3) + 'l-6 4"/></g>' +
            '<g class="ob-carga ob-carga-vendaval ob-setas-vento"><path d="M20 ' + r1(yT + hp * 0.25) + 'h50l-6-4M70 ' + r1(yT + hp * 0.25) + 'l-6 4M20 ' + r1(yT + hp * 0.6) + 'h50l-6-4M70 ' + r1(yT + hp * 0.6) + 'l-6 4"/></g>' +
            '<g class="ob-carga ob-carga-tempestade ob-setas-vento ob-setas-forte"><path d="M10 ' + r1(yT + hp * 0.2) + 'h60l-6-4M70 ' + r1(yT + hp * 0.2) + 'l-6 4M10 ' + r1(yT + hp * 0.5) + 'h60l-6-4M70 ' + r1(yT + hp * 0.5) + 'l-6 4M10 ' + r1(yT + hp * 0.8) + 'h60l-6-4M70 ' + r1(yT + hp * 0.8) + 'l-6 4"/></g>' +
            '<g class="ob-andantes-planta">' + figuras(2, 146, x0 + bp + 14) + "</g>";
          return s;
        },
        legendaErguer: "🏗️ Assentando a fundação, subindo as paredes fiada a fiada, coroando com as ameias...",
      },
      mapa: function (sit, dados) {
        if (sit === "terreno") return '<path d="M138 104h20" stroke="' + TINTA + '" stroke-width="1" opacity=".45"/><path d="M140 104v-5M145 104v-5M140 101h5"' + T + ' stroke-width="1" opacity=".6"/><path d="M152 104v-8" stroke="#5a3d22" stroke-width="2.2"/><path d="M144 88h16l-1 8h-14z" fill="#d6c39b"' + T + ' stroke-width="1"/><path d="M147 91.5h10M147 94h6"' + T + ' stroke-width=".8" opacity=".7"/>';
        var caida = sit === "ferida";
        var s = '<g' + (caida ? ' transform="rotate(16 154 104)"' : "") + '><rect class="ob-mp-deck' + (sit === "fraca" ? " ob-m-range" : "") + '" x="140" y="66" width="14" height="38"' + T + ' stroke-width=".9"/>' +
          '<path d="M139 66h16v-3h-3v2h-3v-2h-4v2h-3v-2h-3z" fill="#cdbb8c"' + T + ' stroke-width=".7"/><path d="M147 72v4M147 84v4"' + T + ' stroke-width="1"/><path d="M145 104v-5q2-2 4 0v5z" fill="#3b2412"/>' +
          (caida ? '<path d="M141 100l4-5-2-5 4-5" fill="none" stroke="#a02020" stroke-width="1.1"/>' : bandeirinha(147, 63, !!(dados && dados.ouro))) + "</g>";
        if (caida) s += fumaca(146, 70);
        else s += andantes(130, 99.6, 20) + (dados && dados.reconstruida ? bronzinho(142, 100) : "");
        return s;
      },
    };
    function juntas(x0, yT, bp, hp) {
      var d = "";
      for (var y = yT + 8; y < yT + hp - 4; y += 8) d += "M" + r1(x0) + " " + r1(y) + "h" + r1(bp);
      return d;
    }
  })();

  // =====================================================================
  // BLOCO 1 · CELEIRO (telhado no vão, paredes no vento)
  // =====================================================================
  (function () {
    var TEL = {
      trelica: { id: "trelica", nome: "Treliça de madeira", resumo: "triângulos que não mudam de forma · aguenta 60 kN·m por metro", cap: 60, preco: 2.2, moedas: "●●●", runa: "1.3", laudo: "treliça de madeira, 60 kN·m/m",
        seda: "Treliça: triângulos travados. Empurra um canto e nada mexe. É o segredo das pontes de aço.",
        icone: '<svg viewBox="0 0 48 30" aria-hidden="true"><path d="M3 26L24 4l21 22zM3 26h42M13 26l11-11 11 11M24 4v22" fill="none" stroke="#5a3a1c" stroke-width="2" stroke-linejoin="round"/></svg>' },
      vigas: { id: "vigas", nome: "Vigas retas", resumo: "caibros soltos, sem triângulo · aguentam 15 kN·m por metro", cap: 15, preco: 1.4, moedas: "●●", runa: "5.4", laudo: "caibros retos sem travamento, 15 kN·m/m",
        seda: "Caibros retos e soltos? Num vão curto passam. Num vão longo, vergam e abrem as paredes.",
        icone: '<svg viewBox="0 0 48 30" aria-hidden="true"><path d="M3 26L24 6l21 20M3 26h42" fill="none" stroke="#5a3a1c" stroke-width="2.4" stroke-linejoin="round"/><path d="M14 16l6 5M34 16l-6 5" stroke="#a02020" stroke-width="1.2"/></svg>' },
      bambu: { id: "bambu", nome: "Tesoura de bambu", resumo: "viva, leve e barata · 28 kN·m por metro · cupim e umidade à espreita", cap: 28, preco: 0.8, moedas: "●", runa: "1.6", fraca: true, laudo: "tesoura de bambu, 28 kN·m/m, sem tratamento",
        seda: "Bambu! Leve, forte, cresce sozinho. Só não gosta de cupim nem de chuva sem tratamento.",
        icone: '<svg viewBox="0 0 48 30" aria-hidden="true"><path d="M3 26L24 5l21 21zM3 26h42M24 5v21M12 17l12 9M36 17L24 26" fill="none" stroke="#6b8e3a" stroke-width="2" stroke-linejoin="round"/><path d="M10 20h3M20 10h3M36 20h3" stroke="#3b2412" stroke-width="1.2"/></svg>' },
    };
    var PAR = {
      amarrada: { id: "amarrada", nome: "Tijolo amarrado", resumo: "fiadas travadas, cantos em L, cinta no topo · 3× mais firme", fator: 3, preco: 0.6, moedas: "●●", runa: "1.1", laudo: "alvenaria de tijolo amarrada, com cinta",
        seda: "Tijolo amarrado: paredes que se abraçam nos cantos e uma cinta no topo. Assim a alvenaria aguenta o empurrão.",
        icone: '<svg viewBox="0 0 48 30" aria-hidden="true"><g fill="#c9734f" stroke="#3b2412" stroke-width="1.1"><rect x="4" y="6" width="14" height="6"/><rect x="20" y="6" width="14" height="6"/><rect x="4" y="14" width="7" height="6"/><rect x="13" y="14" width="14" height="6"/><rect x="29" y="14" width="10" height="6"/><rect x="4" y="22" width="14" height="6"/><rect x="20" y="22" width="14" height="6"/></g><rect x="2" y="2" width="40" height="4" fill="#8f8a7f" stroke="#3b2412" stroke-width="1"/></svg>' },
      solta: { id: "solta", nome: "Tijolo empilhado solto", resumo: "sem amarração nem cinta · só o peso segura", fator: 1, preco: 0.5, moedas: "●", runa: "1.1", laudo: "tijolo empilhado sem amarração",
        seda: "Empilhado e pronto? Alvenaria aguenta peso, não empurrão. O vento vai descobrir isso antes de ti.",
        icone: '<svg viewBox="0 0 48 30" aria-hidden="true"><g fill="#c9734f" stroke="#3b2412" stroke-width="1.1"><rect x="6" y="4" width="14" height="6"/><rect x="6" y="12" width="14" height="6"/><rect x="6" y="20" width="14" height="6"/><rect x="24" y="4" width="14" height="6" transform="rotate(6 31 7)"/><rect x="24" y="12" width="14" height="6"/><rect x="24" y="20" width="14" height="6"/></g><path d="M20 13h4M20 21h4" stroke="#a02020" stroke-width="1.2"/></svg>' },
      madeira: { id: "madeira", nome: "Madeira com postes na terra", resumo: "firme no vento · postes enterrados sem base: apodrecem", cap: 40, preco: 50, fixo: true, moedas: "50 moedas", runa: "1.3", fraca: true, laudo: "paredes de madeira, postes enterrados sem base de pedra",
        seda: "Madeira é forte e avisa rangendo. Mas poste enterrado na terra úmida apodrece calado.",
        icone: '<svg viewBox="0 0 48 30" aria-hidden="true"><path d="M8 28V6M20 28V6M32 28V6M44 28V6M4 10h42M4 18h42" stroke="#8a5a2b" stroke-width="2.4"/><path d="M2 28h44" stroke="#3b2412" stroke-width="1.2"/><path d="M6 26q2 3 4 0M30 26q2 3 4 0" stroke="#6b4a2b" stroke-width="1.2" fill="none"/></svg>' },
    };
    var EST = [
      { id: "colheita", emoji: "🌾", nome: "a colheita enche o celeiro", qr: 0.9, w: 0.3, nota: "telhas 0,9 kN/m², brisa 0,3 kPa" },
      { id: "vendaval", emoji: "💨", nome: "o vendaval bate na parede", qr: 0.9, w: 0.9, nota: "vento de 0,9 kPa" },
      { id: "tempestade", emoji: "⛈️", nome: "a tempestade despeja água no telhado", qr: 1.68, w: 2.08, nota: "telhas + água 1,4 kN/m² ×1,2 · vento 1,6 kPa ×1,3" },
    ];
    var H = 4, C = 16, GAMA = 18, FUND = 20, ORC = 150, ESCB = 6, XC = 180, YC = 146;
    OBRAS.bloco1 = {
      id: "bloco1", nome: "Celeiro do Vilarejo", icone: "🏚️", guardia: "Brunilda, a Mestra Carpinteira", emoji: "🔨", orcamento: ORC,
      falas: {
        nova: "Chega mais, aprendiz. O vilarejo precisa de um celeiro: telhado que vença o vão e parede que vença o vento. Escolhe a tesoura, escolhe a parede, acerta o vão e a espessura. 150 moedas.",
        pe: "Obra aceita e sem ressalvas! Telhado firme, parede travada. A colheita dorme seca.",
        ouro: "De pé e barato: isso é carpintaria de mestre. Sobrou moeda para a festa da colheita.",
        fraca: "De pé... mas com um parafuso faltando. Ou a folga é curta, ou tem madeira apodrecendo calada. Reforça.",
        ferida: "Caiu. O vento ou o vão venceram. Nenhuma obra se entrega assim: lê o laudo, lê a runa e volta à bancada.",
        reconstruida: "Reconstruído! Quem volta à bancada depois da queda é carpinteiro de verdade. Placa de bronze.",
        orcamento: "O tesoureiro cruzou os braços: isso custa mais do que o vilarejo tem. Afina o projeto.",
        voltarFerida: "De volta à bancada. O laudo disse o que cedeu: telhado ou parede. Mexe ali.", voltarPe: "De volta à bancada. Mais largo? Mais barato? Tua a escolha.",
      },
      cartas: [
        { id: "telhado", titulo: "O telhado: como vencer o vão", opcoes: TEL, ordem: ["trelica", "vigas", "bambu"] },
        { id: "parede", titulo: "As paredes: como segurar o vento", opcoes: PAR, ordem: ["amarrada", "solta", "madeira"] },
      ],
      ajustes: [
        { id: "vao", rotulo: "Vão do telhado", min: 6, max: 16, passo: 1, padrao: 10, dica: "Largura do celeiro. O momento no telhado cresce com o vão ao quadrado.",
          formatar: function (v) { return fmt(v) + " m  (celeiro de " + fmt(v) + " × " + C + " m)"; },
          falas: { alto: "Dezesseis metros de vão? Lembra: o momento cresce com o quadrado. Dobra o vão, quadruplica o esforço.", baixo: "Vão curto é fácil de vencer. Mas cabe a colheita?" } },
        { id: "espessura", rotulo: "Espessura da parede", min: 0.2, max: 0.6, passo: 0.05, padrao: 0.3, dica: "Parede grossa pesa mais e resiste melhor ao empurrão do vento (só para tijolo).",
          formatar: function (v, cfg) { return fmt(v * 100) + " cm" + (cfg.parede === "madeira" ? "  (não muda a madeira)" : "  (peso " + fmt(GAMA * v * H, 1) + " kN por metro)"); },
          falas: { alto: "Parede grossa segura o vento, mas come tijolo e moeda.", baixo: "Vinte centímetros? Um tijolo de pé. O vento vai rir." } },
      ],
      estagios: EST,
      medidor: { titulo: "Esforço × capacidade", valor: function (e) { return fmt(e.razao * 100) + " %"; }, sub: function (e) { return e.pior === "telhado" ? "pior: o telhado" : "pior: a parede"; } },
      tiles: [
        { rotulo: "Carga no telhado", valor: function (e) { return fmt(e.cargaTelhado) + " kN"; }, sub: function (e) { return e.nota; }, vazio: "kN sobre o celeiro" },
        { rotulo: "Fator de segurança", fs: true, sub: "o menor entre telhado e parede (meta ≥ 1,5)" },
        { rotulo: "Momento no telhado", valor: function (e) { return fmt(e.M, 1) + " kN·m/m"; }, sub: function (e) { return "a tesoura aguenta " + fmt(e.capT) + " kN·m/m"; } },
        { rotulo: "Empurrão na parede", valor: function (e) { return fmt(e.Mv, 1) + " kN·m/m"; }, sub: function (e) { return "a parede segura " + fmt(e.Mr, 1) + " kN·m/m"; } },
      ],
      escala: function (cfg) { return "1 : 170 · corte transversal"; },
      calcular: function (cfg) {
        var tel = TEL[cfg.telhado], par = PAR[cfg.parede];
        var S = limitar(Number(cfg.vao), 6, 16), t = limitar(Number(cfg.espessura), 0.2, 0.6);
        var r = { completo: !!(tel && par) };
        r.custo = custoDe([{ rotulo: "telhado", valor: tel ? tel.preco * S * C / 10 : 0 }, { rotulo: "paredes", valor: par ? (par.fixo ? par.preco : par.preco * t * 2 * (S + C) * H) : 0 }, { rotulo: "fundação corrida", valor: FUND }], ORC);
        if (!r.completo) return r;
        var ests = EST.map(function (def, i) {
          var M = def.qr * S * S / 8, Mv = def.w * H * H / 2;
          var Mr = par.fixo ? par.cap : GAMA * t * H * (t / 2) * par.fator;
          var rT = M / tel.cap, rP = Mv / Mr;
          var e = estagio(def, { indice: i, M: M, capT: tel.cap, Mv: Mv, Mr: Mr, cargaTelhado: def.qr * S * C, fs: Math.min(tel.cap / M, Mr / Mv), razao: Math.max(rT, rP), pior: rT >= rP ? "telhado" : "parede",
            cargaTexto: fmt(def.qr * S * C) + " kN", esforcoTexto: fmt(Math.max(rT, rP) * 100) + " %", deflPx: limitar(rT * 10, 0, 14) });
          if (M >= tel.cap) { e.resultado = "falha"; e.falha = tel.id === "vigas" ? "verga" : "quebra"; e.runa = tel.id === "vigas" ? "5.4" : "1.3"; e.porque = "O telhado recebeu um momento de " + fmt(M, 1) + " kN·m por metro, e " + (tel.id === "vigas" ? "caibros retos e soltos só aguentam " + fmt(tel.cap) + ": vergaram e abriram as paredes. Vão longo pede triângulo (runas 5.4 e 1.3)." : "a tesoura só aguentava " + fmt(tel.cap) + ": quebrou na cumeeira (runa 1.3).") ; }
          else if (Mv >= Mr) { e.resultado = "falha"; e.falha = "tomba"; e.runa = "1.1"; e.porque = "O vento empurrou a parede com " + fmt(Mv, 1) + " kN·m por metro e ela só segurava " + fmt(Mr, 1) + ". Alvenaria aguenta peso, não empurrão: sem amarração e cinta, tombou (runa 1.1)."; }
          return e;
        });
        var extras = [];
        if (tel.fraca) extras.push({ runa: "1.6", texto: "o bambu passou, mas sem tratamento o cupim e a umidade comem a tesoura em poucos invernos (runa 1.6)" });
        if (par.fraca) extras.push({ runa: "1.3", texto: "os postes enterrados na terra úmida apodrecem calados; madeira podre quebra sem aviso (runa 1.3)" });
        fecharVeredito(r, ests, extras);
        r.resumo = "Fator de segurança de " + fmt(r.fsMin, 2) + " no pior estágio: telhado e paredes com folga.";
        r.itens = ["<strong>Telhado:</strong> " + esc(tel.laudo), "<strong>Paredes:</strong> " + esc(par.laudo) + (par.fixo ? "" : ", " + fmt(t * 100) + " cm"),
          "<strong>Geometria:</strong> vão de " + fmt(S) + " m, celeiro de " + fmt(S) + " × " + C + " m, pé-direito de " + H + " m"];
        r.nota = "Modelo simplificado da Mesa: momento M = qS²/8 por metro de telhado; parede como bloco rígido no vento, Mr = peso × t/2 (× 3 quando amarrada e cintada).";
        return r;
      },
      planta: {
        fundo: function () { return ceu() + '<path class="ob-margem" d="M0 146h360v64H0z"/><path class="ob-margem-borda" d="M0 146h360"/><path class="ob-campo" d="M0 146q60-10 120-4t120 0 120 4v2H0z"/>'; },
        estrutura: function (cfg) {
          var tel = TEL[cfg.telhado], par = PAR[cfg.parede], esb = !tel || !par;
          var S = Number(cfg.vao), t = Number(cfg.espessura), sp = S * ESCB, hp = H * ESCB, rise = sp / 4, tp = par && par.fixo ? 4 : Math.max(3, t * 16);
          var xl = XC - sp / 2, xr = XC + sp / 2, yTop = YC - hp, yC = yTop - rise;
          var corP = par ? ({ amarrada: "#c9734f", solta: "#c9734f", madeira: "#a8733d" })[par.id] : "#ddd0b0";
          var s = '<rect class="ob-fundacao" x="' + r1(xl - 6) + '" y="146" width="' + r1(sp + 12) + '" height="6"/>' +
            '<path class="ob-feno" d="M' + r1(xl + 6) + ' 146q' + r1(sp / 4) + '-18 ' + r1(sp / 2) + '-6q' + r1(sp / 4) + '-10 ' + r1(sp / 2 - 12) + ' 6z"/>' +
            '<g class="ob-ce-paredes"><rect class="ob-ce-parede ob-ce-parede-e' + (esb ? " ob-esboco" : "") + '" x="' + r1(xl) + '" y="' + r1(yTop) + '" width="' + r1(tp) + '" height="' + r1(hp) + '" style="fill:' + corP + ';transform-origin:' + r1(xl) + 'px 146px"/>' +
            '<rect class="ob-ce-parede ob-ce-parede-d' + (esb ? " ob-esboco" : "") + '" x="' + r1(xr - tp) + '" y="' + r1(yTop) + '" width="' + r1(tp) + '" height="' + r1(hp) + '" style="fill:' + corP + ';transform-origin:' + r1(xr) + 'px 146px"/>' +
            (par && par.id === "amarrada" ? '<path class="ob-ce-cinta" d="M' + r1(xl - 1) + ' ' + r1(yTop) + 'h' + r1(tp + 2) + 'v3h-' + r1(tp + 2) + 'zM' + r1(xr - tp - 1) + ' ' + r1(yTop) + 'h' + r1(tp + 2) + 'v3h-' + r1(tp + 2) + 'z"/>' : "") +
            (par && par.id === "madeira" ? '<path class="ob-ce-podre" d="M' + r1(xl) + ' 146v6M' + r1(xr) + ' 146v6"/>' : "") + "</g>";
          // telhado (grupo que verga/quebra)
          var tr = "M" + r1(xl - 6) + " " + r1(yTop) + "L" + XC + " " + r1(yC) + "L" + r1(xr + 6) + " " + r1(yTop);
          var cor = tel ? ({ trelica: "#8a5a2b", vigas: "#8a5a2b", bambu: "#6b8e3a" })[tel.id] : "#b8a07a";
          s += '<g class="ob-ce-telhado' + (esb ? " ob-esboco" : "") + '" style="transform-origin:' + XC + 'px ' + r1(yTop) + 'px">' +
            '<path class="ob-ce-tesoura" d="' + tr + 'M' + r1(xl) + ' ' + r1(yTop) + 'H' + r1(xr) + '" style="stroke:' + cor + '"/>';
          if (tel && tel.id === "trelica") s += '<path class="ob-ce-barras" d="M' + XC + ' ' + r1(yC) + 'V' + r1(yTop) + 'M' + r1(xl + sp / 4) + ' ' + r1(yTop) + 'L' + r1(XC - sp / 4) + ' ' + r1((yC + yTop) / 2) + 'M' + r1(xr - sp / 4) + ' ' + r1(yTop) + 'L' + r1(XC + sp / 4) + ' ' + r1((yC + yTop) / 2) + 'M' + r1(xl + sp / 4) + ' ' + r1(yTop) + 'L' + XC + ' ' + r1((yC + yTop) / 2 + 4) + 'L' + r1(xr - sp / 4) + ' ' + r1(yTop) + '" style="stroke:' + cor + '"/>';
          if (tel && tel.id === "bambu") s += '<path class="ob-ce-barras" d="M' + XC + ' ' + r1(yC) + 'V' + r1(yTop) + 'M' + r1(xl + sp / 3) + ' ' + r1(yTop) + 'L' + XC + ' ' + r1((yC + yTop) / 2) + 'L' + r1(xr - sp / 3) + ' ' + r1(yTop) + '" style="stroke:' + cor + ';stroke-dasharray:6 2"/>';
          s += '<path class="ob-ce-telhas" d="' + tr + '"/><path class="ob-trinca" d="M' + r1(XC - 3) + ' ' + r1(yC + 2) + 'l4 6-3 4 4 5"/>' + bandeira(XC, yC) + "</g>" +
            '<g class="ob-cotas"><path d="M' + r1(xl) + ' 170v-6M' + r1(xr) + ' 170v-6M' + r1(xl) + ' 167H' + r1(xr) + '"/><text x="' + XC + '" y="180" text-anchor="middle">vão ' + fmt(S) + ' m</text></g>' +
            '<g class="ob-carga ob-carga-colheita">' + carrocas(1, 146, xr + 10) + '</g>' +
            '<g class="ob-carga ob-carga-vendaval ob-setas-vento"><path d="M' + r1(xl - 60) + ' ' + r1(yTop + 6) + 'h40l-6-4M' + r1(xl - 20) + ' ' + r1(yTop + 6) + 'l-6 4M' + r1(xl - 60) + ' ' + r1(yTop + 16) + 'h40l-6-4M' + r1(xl - 20) + ' ' + r1(yTop + 16) + 'l-6 4"/></g>' +
            '<g class="ob-carga ob-carga-tempestade ob-setas-vento ob-setas-forte"><path d="M' + r1(xl - 70) + ' ' + r1(yTop + 4) + 'h50l-6-4M' + r1(xl - 20) + ' ' + r1(yTop + 4) + 'l-6 4M' + r1(xl - 70) + ' ' + r1(yTop + 12) + 'h50l-6-4M' + r1(xl - 20) + ' ' + r1(yTop + 12) + 'l-6 4M' + r1(xl - 70) + ' ' + r1(yTop + 20) + 'h50l-6-4M' + r1(xl - 20) + ' ' + r1(yTop + 20) + 'l-6 4"/></g>' +
            '<g class="ob-andantes-planta">' + figuras(2, 146, xr + 16) + "</g>";
          return s;
        },
        legendaErguer: "🏗️ Levantando as paredes, içando a tesoura, pregando as telhas...",
      },
      mapa: function (sit, dados) {
        if (sit === "terreno") return '<path d="M134 102h24" stroke="' + TINTA + '" stroke-width="1" opacity=".45"/><path d="M136 102v-5M141 102v-5M136 99h5"' + T + ' stroke-width="1" opacity=".6"/><path d="M152 102v-8" stroke="#5a3d22" stroke-width="2.2"/><path d="M144 86h16l-1 8h-14z" fill="#d6c39b"' + T + ' stroke-width="1"/><path d="M147 89.5h10M147 92h6"' + T + ' stroke-width=".8" opacity=".7"/>';
        var caida = sit === "ferida";
        var s = '<rect class="ob-mp-deck' + (sit === "fraca" ? " ob-m-range" : "") + '" x="134" y="86" width="24" height="16"' + T + ' stroke-width=".9"/><path d="M142 102v-7h6v7z" fill="#3b2412"/>' +
          (caida ? '<path d="M132 88l14-8 14 10" fill="#8a5a2b"' + T + ' stroke-width=".9" transform="rotate(-18 146 88)"/><path d="M138 98l3-4-2-4 3-4" fill="none" stroke="#a02020" stroke-width="1.1"/>' + fumaca(150, 84)
            : '<path d="M132 86l14-10 14 10z" fill="#8a5a2b"' + T + ' stroke-width=".9"/>' + bandeirinha(146, 76, !!(dados && dados.ouro)) + andantes(126, 97.6, 14) + (dados && dados.reconstruida ? bronzinho(136, 98) : ""));
        return s;
      },
    };
  })();

  // =====================================================================
  // BLOCO 2 · PONTE DO MERCADO (viga biapoiada: medir, calcular, ensaiar)
  // =====================================================================
  (function () {
    var MED = {
      corrente: { id: "corrente", nome: "Medir com a corrente", resumo: "corrente de agrimensor, três vezes · vão exato: 24,0 m", Lv: 24, preco: 10, moedas: "10 moedas", runa: "2.1", laudo: "vão medido com corrente de agrimensor: 24,0 m",
        seda: "Medir três vezes, cortar uma. Vinte e quatro metros exatos. Agora sim calculamos.",
        icone: '<svg viewBox="0 0 48 30" aria-hidden="true"><path d="M3 20h42" stroke="#3b2412" stroke-width="1.6"/><path d="M3 15v10M45 15v10M10 18v4M17 18v4M24 16v8M31 18v4M38 18v4" stroke="#3b2412" stroke-width="1.2"/><text x="20" y="11" font-size="8" fill="#3b2412">24 m</text></svg>' },
      planta: { id: "planta", nome: "Confiar na planta antiga", resumo: "o rio mudou: a viga vem com 23,0 m · apoio curto", Lv: 23, preco: 0, moedas: "de graça", runa: "2.1", fraca: true, laudo: "vão tirado de uma planta antiga: viga de 23,0 m para um vão de 24,0 m",
        seda: "A planta antiga? Rios se movem, margens desbarrancam. Um metro a menos de viga é um apoio no fio da navalha.",
        icone: '<svg viewBox="0 0 48 30" aria-hidden="true"><path d="M6 4h30l6 6v18H6z" fill="#e9dcbc" stroke="#3b2412" stroke-width="1.2"/><path d="M10 12h22M10 17h18M10 22h24" stroke="#3b2412" stroke-width="1" opacity=".6"/><path d="M30 6l4 6" stroke="#a02020" stroke-width="1.2"/></svg>' },
      olho: { id: "olho", nome: "Estimar a olho", resumo: "'uns vinte metros' · a viga vem com 20,5 m", Lv: 20.5, preco: 0, moedas: "de graça", runa: "2.1", laudo: "vão estimado a olho: viga de 20,5 m para um vão de 24,0 m",
        seda: "A olho?! No Condado, um milímetro separa o monumento da ruína. Ajusta o monóculo.",
        icone: '<svg viewBox="0 0 48 30" aria-hidden="true"><path d="M6 15q18-16 36 0q-18 16-36 0z" fill="#fbf3dc" stroke="#3b2412" stroke-width="1.4"/><circle cx="24" cy="15" r="5" fill="#3b2412"/><text x="34" y="27" font-size="9" fill="#a02020">?</text></svg>' },
    };
    var ENS = {
      completo: { id: "completo", nome: "Ensaio de carga completo", resumo: "carroças de pedra antes de abrir · defeito escondido aparece", fe: 1.0, preco: 20, moedas: "20 moedas", runa: "2.6", laudo: "ensaio de carga completo antes de abrir",
        seda: "Ensaio completo: um erro no teste custa trocados de cobre; na feira lotada, custa o reino.",
        icone: '<svg viewBox="0 0 48 30" aria-hidden="true"><path d="M4 22h40" stroke="#3b2412" stroke-width="2.4"/><rect x="12" y="8" width="10" height="10" fill="#6d6d6d" stroke="#3b2412" stroke-width="1.2"/><rect x="26" y="8" width="10" height="10" fill="#6d6d6d" stroke="#3b2412" stroke-width="1.2"/><path d="M4 22l-2 6M44 22l2 6" stroke="#3b2412" stroke-width="1.2"/><path d="M38 4l3 3 5-6" fill="none" stroke="#3e5a2b" stroke-width="1.6"/></svg>' },
      parcial: { id: "parcial", nome: "Ensaio rápido", resumo: "uma carroça, um olhar · pega parte dos defeitos (capacidade ×0,85)", fe: 0.85, preco: 8, moedas: "8 moedas", runa: "2.6", laudo: "ensaio rápido, capacidade considerada ×0,85",
        seda: "Um ensaio rápido vê a metade. A outra metade, só a feira descobre.",
        icone: '<svg viewBox="0 0 48 30" aria-hidden="true"><path d="M4 22h40" stroke="#3b2412" stroke-width="2.4"/><rect x="19" y="8" width="10" height="10" fill="#6d6d6d" stroke="#3b2412" stroke-width="1.2"/><path d="M4 22l-2 6M44 22l2 6" stroke="#3b2412" stroke-width="1.2"/></svg>' },
      nenhum: { id: "nenhum", nome: "Sem ensaio", resumo: "abrir logo · um defeito escondido vale capacidade ×0,7", fe: 0.7, preco: 0, moedas: "de graça", runa: "2.6", laudo: "sem ensaio: capacidade considerada ×0,7 (defeito escondido)",
        seda: "Abrir sem testar? Então a feira é o teu laboratório, e os feirantes, os teus pesos.",
        icone: '<svg viewBox="0 0 48 30" aria-hidden="true"><path d="M4 22h40" stroke="#3b2412" stroke-width="2.4"/><path d="M4 22l-2 6M44 22l2 6" stroke="#3b2412" stroke-width="1.2"/><path d="M22 10l4 7-3 4 4 5" fill="none" stroke="#a02020" stroke-width="1.4"/><text x="30" y="12" font-size="9" fill="#a02020">?</text></svg>' },
    };
    var EST = [
      { id: "feira", emoji: "🧺", nome: "a feira abre", q: 16, fator: 1.0, nota: "barracas e gente 16 kN/m" },
      { id: "carrocas", emoji: "🐴", nome: "as carroças pesadas passam", q: 20, fator: 1.2, nota: "carroças 20 kN/m, solavanco ×1,2" },
      { id: "procissao", emoji: "🎺", nome: "a procissão marcha no mesmo passo", q: 20, fator: 1.4, nota: "multidão em ritmo 20 kN/m ×1,4" },
    ];
    var L = 24, GD = 12, ORC = 170, E = 200e6, XA = 70, XB = 290, YD = 140, ESCP = 220 / 24;
    OBRAS.bloco2 = {
      id: "bloco2", nome: "Ponte do Mercado", icone: "🌁", guardia: "Voltério, o Barão das Engrenagens", emoji: "⚙️", orcamento: ORC,
      falas: {
        nova: "Precisão, aprendiz! O mercado quer uma ponte de vigas sobre o canal. Primeiro: quanto mede o vão? Depois: ensaias antes de abrir? Então escolhes a altura e o número de vigas. 170 moedas, e nem uma a mais.",
        pe: "Calibração perfeita. Medida certa, viga certa, ensaio feito. O Condado atravessa em paz.",
        ouro: "De pé e dentro de 80% do orçamento. Vigas altas e poucas: tu entendeste que a altura entra ao quadrado.",
        fraca: "De pé... por um fio. Ou o apoio é curto, ou a folga é. Um milímetro separa o monumento da ruína.",
        ferida: "Ruiu. No Condado, um erro de medida ou um defeito escondido custa a ponte inteira. Lê o laudo, lê a runa, mede de novo.",
        reconstruida: "Reconstruída, e com a medida certa. A placa de bronze é tua, aprendiz da precisão.",
        orcamento: "O tesoureiro cruzou os braços: isso custa mais do que o Condado tem. Afina o projeto.",
        voltarFerida: "De volta à mesa. O laudo apontou: medida, ensaio ou viga. Mexe ali.", voltarPe: "De volta à mesa. Dá para fazer mais barato? Pensa na altura da viga.",
      },
      cartas: [
        { id: "medicao", titulo: "O vão: como medir", opcoes: MED, ordem: ["corrente", "planta", "olho"] },
        { id: "ensaio", titulo: "Antes de abrir: ensaiar?", opcoes: ENS, ordem: ["completo", "parcial", "nenhum"] },
      ],
      ajustes: [
        { id: "altura", rotulo: "Altura da viga", min: 0.4, max: 1.4, passo: 0.1, padrao: 0.8, dica: "A capacidade cresce com a altura ao quadrado. O custo, só com a altura.",
          formatar: function (v) { return fmt(v, 1) + " m  (capacidade por viga " + fmt(3125 * v * v) + " kN·m)"; },
          falas: { alto: "Viga alta: resiste ao quadrado e custa na razão. É a melhor moeda que o Condado gasta.", baixo: "Baixa assim, ela verga só de olhar. A altura entra ao quadrado, aprendiz." } },
        { id: "vigas", rotulo: "Número de vigas", min: 2, max: 6, passo: 1, padrao: 3, dica: "Vigas lado a lado dividem a carga. Mais vigas, mais aço.",
          formatar: function (v) { return fmt(v) + " vigas de aço"; },
          falas: { alto: "Seis vigas? Dividem bem a carga, mas o tesoureiro conta cada uma.", baixo: "Duas vigas só. Se uma tiver defeito, a outra carrega tudo." } },
      ],
      estagios: EST,
      medidor: { titulo: "Momento na viga", valor: function (e) { return fmt(e.M) + " kN·m"; }, sub: function (e) { return "capacidade " + fmt(e.cap) + " kN·m"; } },
      tiles: [
        { rotulo: "Carga total", valor: function (e) { return fmt(e.cargaTotal) + " kN"; }, sub: function (e) { return fmt(e.w) + " kN/m · " + e.nota; }, vazio: "kN sobre o vão" },
        { rotulo: "Fator de segurança", fs: true, sub: "capacidade ÷ momento (meta ≥ 1,5)" },
        { rotulo: "Flecha da viga", valor: function (e) { return fmt(e.flecha, 1) + " cm"; }, sub: function (e) { return "1/" + fmt(L * 100 / Math.max(e.flecha, 0.01)) + " do vão"; } },
        { rotulo: "Vigas", valor: function (e, cfg) { return fmt(cfg.vigas) + " × " + fmt(cfg.altura, 1) + " m"; }, sub: function (e) { return "com " + fmt(e.Lv, 1) + " m de comprimento"; } },
      ],
      escala: function () { return "1 : 110 · vão de 24 m"; },
      calcular: function (cfg) {
        var med = MED[cfg.medicao], ens = ENS[cfg.ensaio];
        var Hv = limitar(Number(cfg.altura), 0.4, 1.4), n = Math.round(limitar(Number(cfg.vigas), 2, 6));
        var r = { completo: !!(med && ens) };
        r.custo = custoDe([{ rotulo: "vigas", valor: n * Hv * L * 2 }, { rotulo: "medição", valor: med ? med.preco : 0 }, { rotulo: "ensaio", valor: ens ? ens.preco : 0 }], ORC);
        if (!r.completo) return r;
        var cap = n * 3125 * Hv * Hv * ens.fe, I = n * 0.00625 * Hv * Hv * Hv;
        var ests = EST.map(function (def, i) {
          var w = GD + def.q * def.fator, M = w * L * L / 8, flecha = 5 * w * Math.pow(L, 4) / (384 * E * I) * 100;
          var e = estagio(def, { indice: i, w: w, cargaTotal: w * L, M: M, cap: cap, flecha: flecha, Lv: med.Lv, fs: cap / M, razao: M / cap, cargaTexto: fmt(w * L) + " kN", esforcoTexto: fmt(M) + " / " + fmt(cap) + " kN·m", deflPx: limitar(flecha / 100 * ESCP * 6, 0, 22) });
          if (med.Lv < L - 1.5) { e.resultado = "falha"; e.falha = "curta"; e.runa = "2.1"; e.porque = "Mediste a olho: a viga veio com " + fmt(med.Lv, 1) + " m para um vão de " + fmt(L, 1) + " m. Faltaram " + fmt(L - med.Lv, 1) + " m: ela não alcançou a outra margem e caiu no canal antes de a feira abrir. Mede três vezes (runa 2.1)."; }
          else if (M >= cap) { e.resultado = "falha"; e.falha = "rompe"; e.runa = ens.fe < 1 ? "2.6" : "2.3"; e.porque = "O momento chegou a " + fmt(M) + " kN·m e as vigas só aguentavam " + fmt(cap) + (ens.fe < 1 ? " (uma delas tinha um defeito escondido que o ensaio teria mostrado)" : "") + ". Romperam no meio do vão (runa " + (ens.fe < 1 ? "2.6" : "2.3") + ")."; }
          return e;
        });
        var extras = med.fraca ? [{ runa: "2.1", texto: "a viga de 23 m apoia só meio metro em cada margem: qualquer recuo a derruba (runa 2.1)" }] : [];
        fecharVeredito(r, ests, extras);
        r.resumo = "Fator de segurança de " + fmt(r.fsMin, 2) + " no pior estágio e medida conferida.";
        r.itens = ["<strong>Medição:</strong> " + esc(med.laudo), "<strong>Ensaio:</strong> " + esc(ens.laudo),
          "<strong>Vigas:</strong> " + fmt(n) + " vigas de aço com " + fmt(Hv, 1) + " m de altura (capacidade " + fmt(cap) + " kN·m)"];
        r.nota = "Modelo simplificado da Mesa: viga biapoiada, M = wL²/8, capacidade ≈ 3.125·H² kN·m por viga, flecha 5wL⁴/384EI.";
        return r;
      },
      planta: {
        fundo: function () {
          return ceu() + '<path class="ob-rio" d="M' + XA + ' 160q110 8 ' + (XB - XA) + ' 0v50H' + XA + 'z"/><path class="ob-onda" d="M110 172q8-3 16 0M180 178q8-3 16 0M250 171q8-3 16 0"/>' +
            '<path class="ob-margem" d="M0 146h' + XA + 'l-6 64H0z"/><path class="ob-margem" d="M360 146h-' + (360 - XB) + 'l6 64h64z"/><path class="ob-margem-borda" d="M0 146h' + XA + 'M' + XB + ' 146h70"/>' +
            '<rect class="ob-fundacao" x="' + (XA - 14) + '" y="138" width="14" height="30"/><rect class="ob-fundacao" x="' + XB + '" y="138" width="14" height="30"/>';
        },
        estrutura: function (cfg) {
          var med = MED[cfg.medicao], ens = ENS[cfg.ensaio], esb = !med || !ens;
          var Hv = Number(cfg.altura), n = Math.round(Number(cfg.vigas)), hp = Math.max(4, Hv * ESCP * 1.6), Lv = med ? med.Lv : L, lp = Lv * ESCP;
          var x0 = XA - 8, s = "";
          s += '<g class="ob-pm-viga' + (esb ? " ob-esboco" : "") + '" style="transform-origin:' + x0 + 'px ' + YD + 'px">' +
            '<rect class="ob-pm-aco" x="' + x0 + '" y="' + YD + '" width="' + r1(lp) + '" height="' + r1(hp) + '"/><path class="ob-pm-vigas-linhas" d="' + linhas(x0, YD, lp, hp, n) + '"/>' +
            '<path class="ob-tabuleiro ob-pm-deck" d="M' + x0 + ' ' + YD + 'Q' + r1(x0 + lp / 2) + ' ' + YD + ' ' + r1(x0 + lp) + ' ' + YD + '"/>' +
            '<path class="ob-pm-guarda" d="' + guarda(x0, YD, lp) + '"/>' +
            '<g class="ob-pm-barracas"><path d="M' + (x0 + 30) + ' ' + (YD - 2) + 'l6-12 6 12zM' + (x0 + 32) + ' ' + (YD - 2) + 'v-6h8v6M' + (x0 + lp - 60) + ' ' + (YD - 2) + 'l6-12 6 12zM' + (x0 + lp - 58) + ' ' + (YD - 2) + 'v-6h8v6"/></g>' +
            '<path class="ob-trinca" d="M' + r1(x0 + lp / 2 - 3) + ' ' + YD + 'l5 ' + r1(hp / 2) + '-4 ' + r1(hp / 3) + ' 5 ' + r1(hp / 3) + '"/>' +
            (med && med.fraca ? '<path class="ob-pm-apoio-curto" d="M' + r1(x0 + lp - 4) + ' ' + (YD + hp + 2) + 'l4 6M' + r1(x0 + lp) + ' ' + (YD + hp + 2) + 'l-4 6"/>' : "") + bandeira(x0 + lp / 2, YD - 14) + "</g>" +
            '<g class="ob-pm-secao"><rect class="ob-pm-secao-caixa" x="300" y="48" width="52" height="30" rx="2"/>' + secao(n, Hv) + '<text class="ob-pm-secao-txt" x="326" y="86" text-anchor="middle">' + fmt(n) + " vigas · " + fmt(Hv, 1) + " m</text></g>" +
            '<g class="ob-cotas"><path d="M' + XA + ' 200v-6M' + XB + ' 200v-6M' + XA + ' 197H' + XB + '"/><text x="180" y="208" text-anchor="middle">vão real 24,0 m · viga de ' + fmt(Lv, 1) + ' m</text></g>' +
            '<g class="ob-carga ob-carga-feira">' + figuras(6, YD, 0) + '</g><g class="ob-carga ob-carga-carrocas">' + carrocas(2, YD, 0) + '</g><g class="ob-carga ob-carga-procissao">' + figuras(9, YD, 0) + '<path class="ob-pm-estandarte" d="M60 ' + (YD - 11) + 'v-16l10 3-10 3"/></g>' +
            '<g class="ob-andantes-planta">' + figuras(3, YD, 20) + "</g>";
          return s;
        },
        deformar: function (el, cfg, px) {
          var med = MED[cfg.medicao], Lv = med ? med.Lv : L, lp = Lv * ESCP, x0 = XA - 8;
          var d = el.querySelector(".ob-pm-deck");
          if (d) d.setAttribute("d", "M" + x0 + " " + YD + "Q" + r1(x0 + lp / 2) + " " + r1(YD + 2 * px) + " " + r1(x0 + lp) + " " + YD);
          var a = el.querySelector(".ob-pm-aco");
          if (a) a.style.transform = "translateY(" + r1(px * 0.5) + "px)";
        },
        quedaPx: { rompe: 30 },
        legendaErguer: "🏗️ Medindo as margens, içando as vigas, assentando o tabuleiro...",
      },
      mapa: function (sit, dados) {
        if (sit === "terreno") return placaTerreno(100, 104);
        var caida = sit === "ferida";
        var s = '<rect x="132" y="94" width="6" height="8" fill="#b39c72"' + T + ' stroke-width=".8"/><rect x="152" y="94" width="6" height="8" fill="#b39c72"' + T + ' stroke-width=".8"/><path d="M138 100q7 3 14 0" fill="none" stroke="#5a7f9a" stroke-width="1"/>';
        if (caida) return s + '<path d="M136 94l20 8" stroke="' + TINTA + '" stroke-width="2.4"/><path d="M146 92l3 3-2 3" fill="none" stroke="#a02020" stroke-width="1.1"/>' + fumaca(148, 90);
        return s + '<path class="ob-mp-deck' + (sit === "fraca" ? " ob-m-range" : "") + '" d="M131 92h28v3h-28z"' + T + ' stroke-width=".8"/><path d="M133 92v-3M139 92v-3M145 92v-3M151 92v-3M157 92v-3M133 89.5h24"' + T + ' stroke-width=".6"/>' + andantes(133, 86.6, 22) + (sit === "pe" ? bandeirinha(145, 89, !!(dados && dados.ouro)) : "") + (dados && dados.reconstruida ? bronzinho(140, 96) : "");
      },
    };
    function linhas(x0, y, lp, hp, n) {
      var d = "";
      for (var i = 1; i < Math.min(n, 4); i++) d += "M" + x0 + " " + r1(y + hp * i / Math.min(n, 4)) + "h" + r1(lp);
      return d;
    }
    function guarda(x0, y, lp) {
      var d = "M" + x0 + " " + (y - 5) + "h" + r1(lp);
      for (var x = x0 + 6; x < x0 + lp; x += 14) d += "M" + r1(x) + " " + y + "v-5";
      return d;
    }
    function secao(n, Hv) {
      var s = "", larg = 44 / n, hh = Math.max(4, Hv * 16);
      for (var i = 0; i < n; i++) {
        var cx = 304 + larg * (i + 0.5);
        s += '<path class="ob-pm-i" d="M' + r1(cx - larg * 0.3) + ' ' + r1(74 - hh) + 'h' + r1(larg * 0.6) + 'M' + r1(cx) + ' ' + r1(74 - hh) + 'V74M' + r1(cx - larg * 0.3) + ' 74h' + r1(larg * 0.6) + '"/>';
      }
      return s;
    }
  })();

  // =====================================================================
  // BLOCO 4 · SINO DA FORJA (tirante: tensão, canto vivo e fadiga)
  // =====================================================================
  (function () {
    var MAT = {
      aco: { id: "aco", nome: "Tirante de aço", resumo: "escoa a 250 MPa · abaixo de 150 MPa aguenta badaladas sem fim", limite: 250, fadiga: 150, ductil: true, preco: 2.5, moedas: "●●", runa: "4.4", laudo: "tirante de aço, escoamento 250 MPa, limite de fadiga 150 MPa",
        seda: "Aço: aguenta o puxão e, se a tensão ficar abaixo do limite de fadiga, badala para sempre.",
        icone: '<svg viewBox="0 0 48 30" aria-hidden="true"><rect x="21" y="2" width="6" height="26" rx="1" fill="#8f8a7f" stroke="#3b2412" stroke-width="1.3"/><path d="M24 6v18" stroke="#fbf3dc" stroke-width="1" stroke-dasharray="2 3"/></svg>' },
      fundido: { id: "fundido", nome: "Tirante de ferro fundido", resumo: "rompe a 150 MPa · frágil: o badalo bate e ele não avisa", limite: 150, fragil: 1.5, ductil: false, preco: 1.2, moedas: "●", runa: "2.3", laudo: "tirante de ferro fundido, ruptura 150 MPa, frágil",
        seda: "Ferro fundido segurando um sino que balança? Cada badalada é um soco. Frágil não aguenta soco.",
        icone: '<svg viewBox="0 0 48 30" aria-hidden="true"><rect x="20" y="2" width="8" height="26" rx="1" fill="#6d6d6d" stroke="#3b2412" stroke-width="1.3"/><circle cx="24" cy="10" r="1.2" fill="#fbf3dc"/><circle cx="25" cy="20" r="1" fill="#fbf3dc"/><path d="M22 14l3 3-2 3" fill="none" stroke="#a02020" stroke-width="1.2"/></svg>' },
      aluminio: { id: "aluminio", nome: "Tirante de alumínio", resumo: "leve e bonito · escoa a 240 MPa · sem limite de fadiga: um dia cede", limite: 240, fadiga: 100, ductil: true, semLimite: true, preco: 3.5, moedas: "●●●", runa: "4.4", laudo: "tirante de alumínio, 240 MPa, sem limite de fadiga",
        seda: "Alumínio: leve, brilhante... e sem limite de fadiga. Com badaladas suficientes, sempre acaba cedendo.",
        icone: '<svg viewBox="0 0 48 30" aria-hidden="true"><rect x="21" y="2" width="6" height="26" rx="1" fill="#dfe3e6" stroke="#3b2412" stroke-width="1.3"/><path d="M23 4v22" stroke="#fff" stroke-width="1.2"/></svg>' },
    };
    var LIG = {
      olhal: { id: "olhal", nome: "Olhal forjado e pino", resumo: "cantos arredondados · concentração de tensão ×1,0", kt: 1.0, preco: 15, moedas: "15 moedas", runa: "4.4", laudo: "olhal forjado com pino, cantos arredondados (Kt 1,0)",
        seda: "Olhal forjado, cantos redondos: a força escorrega suave, sem canto onde a trinca nasça.",
        icone: '<svg viewBox="0 0 48 30" aria-hidden="true"><circle cx="24" cy="10" r="7" fill="none" stroke="#3b2412" stroke-width="2.4"/><rect x="21" y="16" width="6" height="12" fill="#8f8a7f" stroke="#3b2412" stroke-width="1.2"/><circle cx="24" cy="10" r="2.5" fill="#3b2412"/></svg>' },
      solda: { id: "solda", nome: "Solda improvisada de canto vivo", resumo: "canto reto · concentração de tensão ×2,0", kt: 2.0, preco: 5, moedas: "5 moedas", runa: "4.4", laudo: "solda improvisada com canto vivo (Kt 2,0)",
        seda: "Solda de canto vivo? É ali, no cantinho reto, que a trinca mora e espera.",
        icone: '<svg viewBox="0 0 48 30" aria-hidden="true"><path d="M8 6h32v6H27v16h-6V12H8z" fill="#8f8a7f" stroke="#3b2412" stroke-width="1.2"/><path d="M27 12l3 4-2 3 3 4" fill="none" stroke="#a02020" stroke-width="1.3"/></svg>' },
      corda: { id: "corda", nome: "Amarra de corda", resumo: "barata · rompe a 40 kN · esgarça com o tempo", kt: 1.0, cordaKN: 40, preco: 2, moedas: "2 moedas", runa: "4.6", fraca: true, laudo: "amarra de corda, 40 kN, esgarça com o uso",
        seda: "Corda? Para pendurar o sino do padeiro, talvez. Este é o sino da forja.",
        icone: '<svg viewBox="0 0 48 30" aria-hidden="true"><path d="M24 2q-6 6 0 12t0 12" fill="none" stroke="#a8733d" stroke-width="3.5"/><path d="M24 2q6 6 0 12t0 12" fill="none" stroke="#6b4a2b" stroke-width="1.5"/></svg>' },
    };
    var EST = [
      { id: "pendurar", emoji: "🔔", nome: "o sino é pendurado", fator: 1.0, nota: "só o peso do sino" },
      { id: "badalar", emoji: "🔊", nome: "o sino badala", fator: 2.0, nota: "o balanço dobra o puxão (×2,0)" },
      { id: "festa", emoji: "🎉", nome: "festa da colheita: 10.000 badaladas", fator: 2.0, fadiga: true, nota: "×2,0 repetido 10.000 vezes" },
    ];
    var ORC = 150, M_MIN = 3000, PORTICO = 30, XC = 180, YV = 72, YC = 146;
    OBRAS.bloco4 = {
      id: "bloco4", nome: "Sino da Forja", icone: "🔔", guardia: "Brutus, o Titã das Colunas", emoji: "💪", orcamento: ORC,
      falas: {
        nova: "HA! A forja quer um sino que se ouça no vale inteiro: pelo menos 3.000 kg de bronze. Escolhe o tirante, escolhe como prendê-lo, acerta a massa e a espessura. 150 moedas. Lembra: cada badalada é um soco no tirante.",
        pe: "Agora sim! Badala, badala e o tirante nem sente. Tensão baixa, canto redondo: a fadiga não acha onde entrar.",
        ouro: "Sino grande, tirante justo, cofre com sobra. Força não é grossura: é saber onde a tensão passa.",
        fraca: "Está pendurado... mas rangeu. Folga curta, material que cansa ou corda que esgarça. Reforça antes da festa.",
        ferida: "CAIU! O sino está no chão da forja. Não foi o peso: foi o soco repetido, ou o canto vivo. Lê o laudo e volta.",
        reconstruida: "Pendurado de novo, e desta vez para ficar. A placa de bronze é tua, igual ao sino.",
        orcamento: "O tesoureiro cruzou os braços: isso custa mais do que a forja tem. Afina o projeto.",
        voltarFerida: "De volta à mesa. O laudo disse: tensão, canto vivo ou fadiga. Mexe ali.", voltarPe: "De volta à mesa. Sino maior? Tirante mais fino? Vê a tensão.",
      },
      cartas: [
        { id: "material", titulo: "O tirante: material", opcoes: MAT, ordem: ["aco", "fundido", "aluminio"] },
        { id: "ligacao", titulo: "A ligação: como prender", opcoes: LIG, ordem: ["olhal", "solda", "corda"] },
      ],
      ajustes: [
        { id: "massa", rotulo: "Massa do sino", min: 1000, max: 12000, passo: 500, padrao: 4000, dica: "Sino pesado soa longe e puxa forte: peso = massa × 9,81.",
          formatar: function (v) { return fmt(v) + " kg  (peso " + fmt(v * 9.81 / 1000, 1) + " kN" + (v >= M_MIN ? ", ouve-se no vale" : ", baixo demais: mínimo " + fmt(M_MIN) + " kg") + ")"; },
          falas: { alto: "Doze toneladas? O sino do rei! Vê quanto bronze o cofre paga.", baixo: "Mil quilos? Sininho de capela. A forja quer trovão." } },
        { id: "diametro", rotulo: "Diâmetro do tirante", min: 1, max: 5, passo: 0.25, padrao: 2.5, dica: "Tensão = força ÷ área. A área cresce com o diâmetro ao quadrado.",
          formatar: function (v) { return fmt(v, 2) + " cm  (área " + fmt(Math.PI * v * v / 4, 2) + " cm²)"; },
          falas: { alto: "Grosso como o meu braço. Nunca cansa... e o tesoureiro chora.", baixo: "Fino assim? Tensão é força sobre área, aprendiz. Área pequena, tensão gigante." } },
      ],
      estagios: EST,
      medidor: { titulo: "Tensão no tirante", valor: function (e) { return fmt(e.sigma) + " MPa"; }, sub: function (e) { return (e.fadiga ? "limite de fadiga " : "limite ") + fmt(e.limite) + " MPa"; } },
      tiles: [
        { rotulo: "Puxão no tirante", valor: function (e) { return fmt(e.F, 1) + " kN"; }, sub: function (e) { return e.nota; }, vazio: "kN no tirante" },
        { rotulo: "Fator de segurança", fs: true, sub: "limite ÷ tensão (meta ≥ 1,5)" },
        { rotulo: "Concentração de tensão", valor: function (e) { return "×" + fmt(e.kt, 1); }, sub: function (e) { return e.kt > 1 ? "canto vivo: a tensão dobra na quina" : "canto redondo: sem quina"; } },
        { rotulo: "Badaladas", valor: function (e) { return e.fadiga ? "10.000" : (e.indice === 1 ? "1" : "0"); }, sub: function (e) { return e.fadiga ? "cada uma é um ciclo de tensão" : "ciclos de carga"; } },
      ],
      escala: function () { return "1 : 60 · pórtico da forja"; },
      calcular: function (cfg) {
        var mat = MAT[cfg.material], lig = LIG[cfg.ligacao];
        var m = limitar(Number(cfg.massa), 1000, 12000), d = limitar(Number(cfg.diametro), 1, 5);
        var area = Math.PI * Math.pow(d * 10 / 2, 2), F0 = m * 9.81 / 1000;
        var r = { completo: !!(mat && lig) };
        r.custo = custoDe([{ rotulo: "tirante", valor: mat ? mat.preco * d * d : 0 }, { rotulo: "ligação", valor: lig ? lig.preco : 0 }, { rotulo: "sino de bronze", valor: m / 100 }, { rotulo: "pórtico", valor: PORTICO }], ORC);
        if (!r.completo) return r;
        var ests = EST.map(function (def, i) {
          var F = F0 * def.fator, din = def.fator > 1;
          var sigma = F * lig.kt * 1000 / area * (!mat.ductil && din ? mat.fragil : 1);
          var limite = def.fadiga ? mat.fadiga || mat.limite : mat.limite;
          var e = estagio(def, { indice: i, F: F, sigma: sigma, limite: limite, kt: lig.kt, fadiga: !!def.fadiga, fs: limite / sigma, razao: sigma / limite, cargaTexto: fmt(F, 1) + " kN", esforcoTexto: fmt(sigma) + " / " + fmt(limite) + " MPa", deflPx: din ? 4 : 1 });
          if (lig.cordaKN && F >= lig.cordaKN) { e.resultado = "falha"; e.falha = "corda"; e.runa = "4.6"; e.porque = "A corda aguentava " + fmt(lig.cordaKN) + " kN e o sino, balançando, puxou " + fmt(F, 1) + " kN. Esgarçou e partiu. Cada material tem seu poder e seu medo (runa 4.6)."; }
          else if (!mat.ductil && sigma >= limite) { e.resultado = "falha"; e.falha = "rompe"; e.runa = "2.3"; e.porque = "Com o balanço, a tensão chegou a " + fmt(sigma) + " MPa (×1,5 por ser frágil e dinâmico) contra " + fmt(limite) + " de ruptura. O ferro fundido partiu seco, sem esticar. Frágil não aguenta soco (runa 2.3)."; }
          else if (sigma >= mat.limite) { e.resultado = "falha"; e.falha = "escoa"; e.runa = "4.1"; e.porque = "Tensão de " + fmt(sigma) + " MPa" + (lig.kt > 1 ? " (dobrada no canto vivo da solda)" : "") + " contra " + fmt(mat.limite) + " de escoamento: o tirante esticou de vez, afinou e cedeu. Tensão é força sobre área (runas 4.1 e 3.4)."; }
          else if (def.fadiga && sigma > limite) { e.resultado = "falha"; e.falha = "fadiga"; e.runa = "4.4"; e.porque = "Cada badalada é um ciclo: " + fmt(sigma) + " MPa, 10.000 vezes, acima do limite de fadiga de " + fmt(limite) + " MPa" + (lig.kt > 1 ? ", e nascendo no canto vivo da solda" : "") + ". A trinca cresceu calada até romper. É o clipe dobrado e desdobrado (runa 4.4)."; }
          return e;
        });
        var extras = [];
        if (!mat.ductil) extras.push({ runa: "2.3", texto: "ferro fundido não avisa: pode partir de surpresa numa badalada qualquer (runa 2.3)" });
        if (mat.semLimite) extras.push({ runa: "4.4", texto: "alumínio não tem limite de fadiga: com badaladas suficientes, um dia cede (runa 4.4)" });
        if (lig.fraca) extras.push({ runa: "4.6", texto: "corda esgarça com o uso e o tempo; é preciso trocar e vigiar (runa 4.6)" });
        if (m < M_MIN) extras.push({ runa: null, texto: "o sino tem " + fmt(m) + " kg e a forja pedia " + fmt(M_MIN) + ": pendurado, mas ninguém o ouve no vale" });
        fecharVeredito(r, ests, extras);
        r.resumo = "Fator de segurança de " + fmt(r.fsMin, 2) + " no pior estágio, inclusive contra a fadiga das 10.000 badaladas.";
        r.itens = ["<strong>Tirante:</strong> " + esc(mat.laudo) + ", ⌀ " + fmt(d, 2) + " cm (área " + fmt(area / 100, 2) + " cm²)", "<strong>Ligação:</strong> " + esc(lig.laudo), "<strong>Sino:</strong> " + fmt(m) + " kg de bronze (" + fmt(F0, 1) + " kN)"];
        r.nota = "Modelo simplificado da Mesa: σ = F·Kt/A; o balanço dobra o puxão; frágil ×1,5 sob impacto; fadiga quando σ > limite de fadiga em 10.000 ciclos.";
        return r;
      },
      planta: {
        fundo: function () { return ceu() + '<path class="ob-margem" d="M0 146h360v64H0z"/><path class="ob-margem-borda" d="M0 146h360"/><path class="ob-forja" d="M20 146V96h70v50zM30 96l25-24 25 24"/><path class="ob-forja-boca" d="M42 146v-20q13-12 26 0v20z"/>'; },
        estrutura: function (cfg) {
          var mat = MAT[cfg.material], lig = LIG[cfg.ligacao], esb = !mat || !lig;
          var m = Number(cfg.massa), d = Number(cfg.diametro), rs = 8 + Math.cbrt(m) * 0.75, tr = Math.max(1.2, d * 1.6);
          var cor = mat ? ({ aco: "#8f8a7f", fundido: "#5c5c5c", aluminio: "#dfe3e6" })[mat.id] : "#b8a07a", ySino = YV + 14; // desenho: até 12.000 kg o sino fica acima do chão
          return '<g class="ob-sf-portico' + (esb ? " ob-esboco" : "") + '"><rect class="ob-sf-poste" x="124" y="' + YV + '" width="8" height="' + (YC - YV) + '"/><rect class="ob-sf-poste" x="228" y="' + YV + '" width="8" height="' + (YC - YV) + '"/><rect class="ob-sf-trave" x="118" y="' + (YV - 8) + '" width="124" height="8"/>' + bandeira(236, YV - 8) + "</g>" +
            '<g class="ob-sf-sino' + (esb ? " ob-esboco" : "") + '" style="transform-origin:' + XC + 'px ' + YV + 'px">' +
            '<path class="ob-sf-tirante" d="M' + XC + ' ' + YV + 'V' + ySino + '" style="stroke:' + cor + ';stroke-width:' + r1(tr) + 'px"/>' +
            (lig && lig.id === "olhal" ? '<circle class="ob-sf-olhal" cx="' + XC + '" cy="' + (YV + 3) + '" r="4"/>' : lig && lig.id === "solda" ? '<path class="ob-sf-solda" d="M' + (XC - 6) + ' ' + YV + 'h12v3h-12z"/>' : lig ? '<path class="ob-sf-corda" d="M' + (XC - 3) + ' ' + YV + 'q3 3 0 6t0 6"/>' : "") +
            '<path class="ob-trinca" d="M' + (XC - 1) + ' ' + (YV + 6) + 'l3 4-2 3 3 4"/>' +
            '<path class="ob-sf-bronze" d="M' + XC + ' ' + ySino + 'q-' + r1(rs * 0.5) + ' 2 -' + r1(rs * 0.6) + ' ' + r1(rs) + 'q-' + r1(rs * 0.3) + ' ' + r1(rs * 0.5) + ' -' + r1(rs * 0.4) + ' ' + r1(rs * 0.8) + 'h' + r1(rs * 2) + 'q-' + r1(rs * 0.1) + ' -' + r1(rs * 0.3) + ' -' + r1(rs * 0.4) + ' -' + r1(rs * 0.8) + 'q-' + r1(rs * 0.1) + ' -' + r1(rs * 0.8) + ' -' + r1(rs * 0.6) + ' -' + r1(rs) + 'z"/>' +
            '<circle class="ob-sf-badalo" cx="' + XC + '" cy="' + r1(ySino + rs * 1.9) + '" r="' + r1(rs * 0.16) + '"/></g>' +
            '<g class="ob-cotas"><text x="' + (XC + 30) + '" y="' + r1(ySino + rs) + '">' + fmt(m) + ' kg</text><text x="' + (XC + 8) + '" y="' + (YV + 16) + '">⌀ ' + fmt(d, 2) + ' cm</text></g>' +
            '<g class="ob-carga ob-carga-pendurar ob-sf-polia"><path d="M' + (XC - 40) + ' ' + (YV - 20) + 'q40-16 80 0" /></g>' +
            '<g class="ob-carga ob-carga-festa">' + figuras(5, 146, 250) + '</g>' +
            '<g class="ob-andantes-planta">' + figuras(2, 146, 262) + "</g>";
        },
        quedaPx: {},
        legendaErguer: "🏗️ Erguendo o pórtico, içando o sino de bronze, prendendo o tirante...",
      },
      mapa: function (sit, dados) {
        if (sit === "terreno") return '<path d="M136 104h22" stroke="' + TINTA + '" stroke-width="1" opacity=".45"/><path d="M138 104v-5M143 104v-5M138 101h5"' + T + ' stroke-width="1" opacity=".6"/><path d="M152 104v-8" stroke="#5a3d22" stroke-width="2.2"/><path d="M144 88h16l-1 8h-14z" fill="#d6c39b"' + T + ' stroke-width="1"/><path d="M147 91.5h10M147 94h6"' + T + ' stroke-width=".8" opacity=".7"/>';
        var caida = sit === "ferida";
        var s = '<rect x="138" y="78" width="3" height="26" fill="#5a3d22"' + T + ' stroke-width=".7"/><rect x="153" y="78" width="3" height="26" fill="#5a3d22"' + T + ' stroke-width=".7"/><rect x="136" y="76" width="22" height="3" fill="#5a3d22"' + T + ' stroke-width=".7"/>';
        if (caida) return s + '<path d="M147 79v6" stroke="#a02020" stroke-width="1" stroke-dasharray="1.5 1"/><path d="M142 104q0-8 6-9q6 1 6 9z" fill="#c9a14a"' + T + ' stroke-width=".8" transform="rotate(-28 148 104)"/>' + fumaca(150, 92);
        return s + '<path class="' + (sit === "fraca" ? "ob-m-range" : "") + '" d="M147 79v4" stroke="#3b2412" stroke-width="1"/><path d="M142 94q0-10 5-11q5 1 5 11z" fill="#c9a14a"' + T + ' stroke-width=".8"/><circle cx="147" cy="95" r="1" fill="#3b2412"/>' + (sit === "pe" ? bandeirinha(156, 76, !!(dados && dados.ouro)) : "") + andantes(128, 99.6, 10) + (dados && dados.reconstruida ? bronzinho(142, 100) : "");
      },
    };
  })();

  // =====================================================================
  // BLOCO 5 · MIRANTE TRELIÇADO (balanço: apoio, banzos e osso extra)
  // =====================================================================
  (function () {
    var APO = {
      contrapeso: { id: "contrapeso", nome: "Engaste com contrapeso", resumo: "bloco de pedra atrás da borda · resiste 1.200 kN·m", Mr: 1200, preco: 40, moedas: "40 moedas", runa: "5.3", laudo: "engaste com contrapeso de pedra, 1.200 kN·m",
        seda: "Contrapeso atrás da borda. A gangorra só funciona se alguém sentar do outro lado.",
        icone: '<svg viewBox="0 0 48 30" aria-hidden="true"><path d="M2 28V12h22v16z" fill="#cdbb8c" stroke="#3b2412" stroke-width="1.3"/><rect x="4" y="4" width="14" height="8" fill="#8f8a7f" stroke="#3b2412" stroke-width="1.2"/><path d="M18 12h28" stroke="#5a3a1c" stroke-width="2.4"/><path d="M24 12l4 6h14" stroke="#5a3a1c" stroke-width="1.2" fill="none"/></svg>' },
      tirante: { id: "tirante", nome: "Tirante até a rocha", resumo: "cabo preso na rocha acima · resiste 900 kN·m", Mr: 900, preco: 25, moedas: "25 moedas", runa: "5.3", laudo: "tirante ancorado na rocha, 900 kN·m",
        seda: "Um tirante preso na rocha lá em cima. O puxão vira apoio. Elegante, se a rocha for honesta.",
        icone: '<svg viewBox="0 0 48 30" aria-hidden="true"><path d="M2 28V8h20v20z" fill="#cdbb8c" stroke="#3b2412" stroke-width="1.3"/><path d="M22 16h24" stroke="#5a3a1c" stroke-width="2.4"/><path d="M8 4l34 12" stroke="#3b2412" stroke-width="1.4"/><circle cx="8" cy="4" r="2" fill="#3b2412"/></svg>' },
      borda: { id: "borda", nome: "Só apoiado na borda", resumo: "a treliça descansa na beira · resiste 0 kN·m", Mr: 0, preco: 0, moedas: "de graça", runa: "5.3", laudo: "apoiado só na borda do penhasco",
        seda: "Só apoiado na beira? Quando a multidão for à ponta, a gangorra decide. E não é a teu favor.",
        icone: '<svg viewBox="0 0 48 30" aria-hidden="true"><path d="M2 28V14h18v14z" fill="#cdbb8c" stroke="#3b2412" stroke-width="1.3"/><path d="M14 14h32" stroke="#5a3a1c" stroke-width="2.4" transform="rotate(10 20 14)"/><text x="34" y="10" font-size="9" fill="#a02020">?</text></svg>' },
    };
    var TRV = {
      redundante: { id: "redundante", nome: "Treliça com barra extra", resumo: "hiperestática: se uma barra falha, outra segura · capacidade ×1,25", fator: 1.25, preco: 20, moedas: "20 moedas", runa: "5.6", laudo: "treliça hiperestática com barra extra (×1,25)",
        seda: "Barra extra: o osso de reserva. Se um caminho fecha, a força acha outro.",
        icone: '<svg viewBox="0 0 48 30" aria-hidden="true"><path d="M3 8h42M3 24h42M3 8v16M17 8v16M31 8v16M45 8v16M3 8l14 16M17 8l14 16M31 8l14 16M17 24L31 8" fill="none" stroke="#5a3a1c" stroke-width="1.6"/><path d="M17 24L31 8" stroke="#3e5a2b" stroke-width="2.2"/></svg>' },
      isostatica: { id: "isostatica", nome: "Treliça mínima", resumo: "isostática: cada barra é essencial · capacidade ×1,0", fator: 1.0, preco: 10, moedas: "10 moedas", runa: "5.6", laudo: "treliça isostática mínima (×1,0)",
        seda: "Treliça mínima: nenhuma barra sobra. Funciona... enquanto nenhuma falhar.",
        icone: '<svg viewBox="0 0 48 30" aria-hidden="true"><path d="M3 8h42M3 24h42M3 8v16M17 8v16M31 8v16M45 8v16M3 8l14 16M17 8l14 16M31 8l14 16" fill="none" stroke="#5a3a1c" stroke-width="1.6"/></svg>' },
      soltas: { id: "soltas", nome: "Barras sem travamento", resumo: "quadrados sem diagonal · viram losango", fator: 0, preco: 0, moedas: "de graça", runa: "1.3", laudo: "barras sem diagonais (mecanismo)",
        seda: "Quadrados sem diagonal? Empurra um canto e vira losango. Isso não é esqueleto, é dobradiça.",
        icone: '<svg viewBox="0 0 48 30" aria-hidden="true"><path d="M3 8h42M3 24h42M3 8v16M17 8v16M31 8v16M45 8v16" fill="none" stroke="#5a3a1c" stroke-width="1.6"/><path d="M8 4l8 8" stroke="#a02020" stroke-width="1.4"/></svg>' },
    };
    var EST = [
      { id: "visitantes", emoji: "🚶", nome: "os primeiros visitantes chegam", q: 1.5, fator: 1.0, ponta: 1.0, nota: "1,5 kPa espalhados" },
      { id: "multidao", emoji: "👥", nome: "a multidão corre para a ponta", q: 4, fator: 1.2, ponta: 1.3, nota: "4 kPa ×1,2, concentrados na ponta ×1,3" },
      { id: "festa", emoji: "🎆", nome: "festa dos fogos com vento", q: 5, fator: 1.4, ponta: 1.3, nota: "5 kPa ×1,4 na ponta ×1,3" },
    ];
    var LARG = 3, GD = 6, CAP = 400, A = 0.004, E = 200e6, ORC = 170, C_MIN = 5, XB = 130, YD = 118, ESCM = 12;
    OBRAS.bloco5 = {
      id: "bloco5", nome: "Mirante da Cachoeira", icone: "🏞️", guardia: "Ossaldo, o Arquiteto dos Esqueletos", emoji: "🦴", orcamento: ORC,
      falas: {
        nova: "Shhh... ouves a cachoeira? O reino quer um mirante em balanço sobre o abismo: pelo menos 5 metros para fora. Escolhe o apoio, escolhe o travamento, acerta o balanço e a altura da treliça. 170 moedas.",
        pe: "O esqueleto dança no vento e não cai. Cada osso no lugar, e um de reserva. Olha a cachoeira, aprendiz.",
        ouro: "De pé, em balanço, e barato. Treliça alta pede pouco aço: a altura é a alavanca do engenheiro.",
        fraca: "Está de pé... mas conta história pela metade. Ou a folga é curta, ou falta o osso extra, ou a vista é curta.",
        ferida: "Desabou no abismo. A gangorra, a barra ou a dobradiça venceram. Lê o laudo, lê a runa, e dá ao esqueleto o que faltou.",
        reconstruida: "Reconstruído, e agora com osso de reserva. A placa de bronze é tua.",
        orcamento: "O tesoureiro cruzou os braços: isso custa mais do que o reino tem. Afina o projeto.",
        voltarFerida: "De volta à mesa. Apoio, banzo ou travamento: o laudo disse qual.", voltarPe: "De volta à mesa. Mais longe sobre o abismo? Vê a altura da treliça.",
      },
      cartas: [
        { id: "apoio", titulo: "O apoio: quem segura a gangorra", opcoes: APO, ordem: ["contrapeso", "tirante", "borda"] },
        { id: "travamento", titulo: "O esqueleto: travamento", opcoes: TRV, ordem: ["redundante", "isostatica", "soltas"] },
      ],
      ajustes: [
        { id: "balanco", rotulo: "Balanço sobre o abismo", min: 3, max: 12, passo: 0.5, padrao: 6, dica: "Comprimento para fora da borda. O momento na raiz cresce com o quadrado.",
          formatar: function (v) { return fmt(v, 1) + " m" + (v >= C_MIN ? "  (vê a cachoeira)" : "  (curto: mínimo " + C_MIN + " m)"); },
          falas: { alto: "Doze metros para fora? O momento na raiz cresce ao quadrado. Pensa na gangorra.", baixo: "Três metros? Daqui não se vê a cachoeira, só a beira." } },
        { id: "altura", rotulo: "Altura da treliça", min: 0.6, max: 2.4, passo: 0.1, padrao: 1.2, dica: "Força nos banzos = momento ÷ altura. Treliça alta, banzo aliviado.",
          formatar: function (v) { return fmt(v, 1) + " m  (banzos a " + fmt(v, 1) + " m um do outro)"; },
          falas: { alto: "Treliça alta: a força nos banzos cai na mesma proporção. É o segredo das pontes de ferro.", baixo: "Baixa assim, os banzos sofrem tudo. Momento dividido por quase nada." } },
      ],
      estagios: EST,
      medidor: { titulo: "Força no banzo", valor: function (e) { return fmt(e.F) + " kN"; }, sub: function (e) { return "capacidade " + fmt(e.cap) + " kN"; } },
      tiles: [
        { rotulo: "Carga na plataforma", valor: function (e) { return fmt(e.cargaTotal) + " kN"; }, sub: function (e) { return fmt(e.w, 1) + " kN/m · " + e.nota; }, vazio: "kN sobre o balanço" },
        { rotulo: "Fator de segurança", fs: true, sub: "o menor entre banzo e tombamento (meta ≥ 1,5)" },
        { rotulo: "Momento na raiz", valor: function (e) { return fmt(e.M) + " kN·m"; }, sub: function (e, cfg) { return "o apoio resiste a " + fmt(APO[cfg.apoio].Mr) + " kN·m"; } },
        { rotulo: "Flecha na ponta", valor: function (e) { return fmt(e.flecha, 1) + " cm"; }, sub: "desenho exagerado 6×" },
      ],
      escala: function () { return "1 : 85 · corte pelo penhasco"; },
      calcular: function (cfg) {
        var apo = APO[cfg.apoio], trv = TRV[cfg.travamento];
        var c = limitar(Number(cfg.balanco), 3, 12), h = limitar(Number(cfg.altura), 0.6, 2.4);
        var r = { completo: !!(apo && trv) };
        r.custo = custoDe([{ rotulo: "treliça", valor: 6 * c * (1 + h) }, { rotulo: "apoio", valor: apo ? apo.preco : 0 }, { rotulo: "travamento", valor: trv ? trv.preco : 0 }], ORC);
        if (!r.completo) return r;
        var cap = CAP * trv.fator, I = A * h * h / 2;
        var ests = EST.map(function (def, i) {
          var w = (GD + def.q * LARG * def.fator) * def.ponta, M = w * c * c / 2, F = M / h, flecha = w * Math.pow(c, 4) / (8 * E * I) * 100;
          var e = estagio(def, { indice: i, w: w, cargaTotal: w * c, M: M, F: F, cap: cap, flecha: flecha, fs: Math.min(cap / Math.max(F, 1e-9), apo.Mr / M), razao: cap > 0 ? F / cap : 2, cargaTexto: fmt(w * c) + " kN", esforcoTexto: fmt(F) + " / " + fmt(cap) + " kN", deflPx: limitar(flecha / 100 * ESCM * 6, 0, 24) });
          if (trv.fator === 0) { e.resultado = "falha"; e.falha = "mecanismo"; e.runa = "1.3"; e.porque = "Sem diagonais, cada quadrado da treliça virou losango ao primeiro peso: um mecanismo, não uma estrutura. Só o triângulo não muda de forma (runa 1.3)."; }
          else if (apo.Mr <= M) { e.resultado = "falha"; e.falha = "tomba"; e.runa = "5.3"; e.porque = "O momento na raiz chegou a " + fmt(M) + " kN·m e o apoio só segurava " + fmt(apo.Mr) + ". A gangorra girou sobre a borda e o mirante foi para o abismo. Apoio é quem decide (runas 5.3 e 0.7)."; }
          else if (F >= cap) { e.resultado = "falha"; e.falha = "rompe"; e.runa = "5.4"; e.porque = "O banzo recebeu " + fmt(F) + " kN (momento " + fmt(M) + " ÷ altura " + fmt(h, 1) + " m) e só aguentava " + fmt(cap) + ". Rompeu na raiz. Treliça mais alta divide melhor (runas 5.4 e 4.1)."; }
          return e;
        });
        var extras = [];
        if (trv.id === "isostatica") { var fsm = Math.min.apply(null, ests.map(function (e) { return e.fs; })); if (fsm < 2) extras.push({ runa: "5.6", texto: "treliça mínima sem osso extra: se uma barra falhar, nada segura o resto, e a folga é pouca (runa 5.6)" }); }
        if (c < C_MIN) extras.push({ runa: null, texto: "o balanço tem " + fmt(c, 1) + " m e o reino pedia " + C_MIN + " m para ver a cachoeira: de pé, mas sem cumprir a missão" });
        fecharVeredito(r, ests, extras);
        r.resumo = "Fator de segurança de " + fmt(r.fsMin, 2) + " no pior estágio, com caminho alternativo para as forças.";
        r.itens = ["<strong>Apoio:</strong> " + esc(apo.laudo), "<strong>Travamento:</strong> " + esc(trv.laudo), "<strong>Geometria:</strong> balanço de " + fmt(c, 1) + " m, treliça de " + fmt(h, 1) + " m de altura, plataforma de 3 m de largura"];
        r.nota = "Modelo simplificado da Mesa: balanço com carga uniforme, M = wc²/2, força nos banzos F = M/h, banzos de 400 kN, flecha wc⁴/8EI.";
        return r;
      },
      planta: {
        fundo: function () {
          return ceu() + '<path class="ob-rocha" d="M0 60h40l20 20 30 10 40 28v92H0z"/><path class="ob-hachura-forte" d="' + hachura(30, 130, 8, 12, 8) + '"/>' +
            '<path class="ob-cascata" d="M300 60q-10 60 0 150h18q8-80 0-150z"/><path class="ob-onda" d="M296 90q6-2 12 0M298 130q6-2 12 0M296 170q6-2 12 0"/><path class="ob-rocha" d="M318 60h42v150h-42z"/>' +
            '<path class="ob-rio" d="M130 200q90-6 190 0v10H130z"/>';
        },
        estrutura: function (cfg) {
          var apo = APO[cfg.apoio], trv = TRV[cfg.travamento], esb = !apo || !trv;
          var c = Number(cfg.balanco), h = Number(cfg.altura), cp = c * ESCM, hp = h * ESCM, xT = XB + cp, yB = YD + hp;
          var s = "";
          if (apo && apo.id === "contrapeso") s += '<rect class="ob-fundacao" x="86" y="' + (YD - 18) + '" width="40" height="18"/><path class="ob-mi-raiz" d="M86 ' + YD + 'h44v' + r1(hp) + 'H86z"/>';
          if (apo && apo.id === "tirante") s += '<path class="ob-mi-tirante" d="M' + (XB + 14) + ' ' + YD + 'L44 64"/><circle class="ob-mi-pino" cx="44" cy="64" r="3"/>';
          var diag = "";
          for (var x = XB; x < xT - 1; x += 24) {
            var x2 = Math.min(x + 24, xT);
            diag += "M" + r1(x) + " " + YD + "V" + r1(yB) + "M" + r1(x2) + " " + YD + "V" + r1(yB);
            if (trv && trv.fator > 0) diag += "M" + r1(x) + " " + r1(yB) + "L" + r1(x2) + " " + YD;
            if (trv && trv.id === "redundante") diag += "M" + r1(x) + " " + YD + "L" + r1(x2) + " " + r1(yB);
          }
          s += '<g class="ob-mi-trelica' + (esb ? " ob-esboco" : "") + '" style="transform-origin:' + XB + 'px ' + YD + 'px">' +
            '<path class="ob-mi-barras" d="' + diag + '"/><path class="ob-mi-banzo ob-mi-banzo-inf" d="M' + XB + ' ' + r1(yB) + 'H' + r1(xT) + '"/><path class="ob-tabuleiro ob-mi-deck" d="M' + XB + ' ' + YD + 'Q' + r1((XB + xT) / 2) + ' ' + YD + ' ' + r1(xT) + ' ' + YD + '"/>' +
            '<path class="ob-mi-guarda" d="' + guarda(XB, YD, cp) + '"/><path class="ob-trinca" d="M' + (XB + 4) + ' ' + YD + 'l4 ' + r1(hp / 2) + '-3 ' + r1(hp / 3) + ' 4 ' + r1(hp / 4) + '"/>' + bandeira(xT - 4, YD - 12) +
            '<g class="ob-carga ob-carga-visitantes">' + figuras(2, YD, XB + 10) + '</g><g class="ob-carga ob-carga-multidao">' + figuras(4, YD, xT - 72) + '</g><g class="ob-carga ob-carga-festa">' + figuras(5, YD, xT - 90) + '<path class="ob-mi-fogos" d="M' + r1(xT + 20) + ' 60l6-8 6 8M' + r1(xT + 26) + ' 52v-8M' + r1(xT + 40) + ' 70l4-6 4 6"/></g>' +
            '<g class="ob-andantes-planta">' + figuras(2, YD, XB + 6) + "</g></g>" +
            '<g class="ob-cotas"><path d="M' + XB + ' ' + (yB + 14) + 'v-6M' + r1(xT) + ' ' + (yB + 14) + 'v-6M' + XB + ' ' + (yB + 11) + 'H' + r1(xT) + '"/><text x="' + r1((XB + xT) / 2) + '" y="' + (yB + 24) + '" text-anchor="middle">balanço ' + fmt(c, 1) + ' m</text>' +
            '<path d="M' + r1(xT + 10) + ' ' + YD + 'h6M' + r1(xT + 10) + ' ' + r1(yB) + 'h6M' + r1(xT + 13) + ' ' + YD + 'V' + r1(yB) + '"/><text x="' + r1(xT + 20) + '" y="' + r1((YD + yB) / 2 + 3) + '">h = ' + fmt(h, 1) + ' m</text></g>';
          return s;
        },
        deformar: function (el, cfg, px) {
          var c = Number(cfg.balanco), cp = c * ESCM, xT = XB + cp;
          var d = el.querySelector(".ob-mi-deck");
          if (d) d.setAttribute("d", "M" + XB + " " + YD + "Q" + r1((XB + xT) / 2) + " " + r1(YD + px * 0.5) + " " + r1(xT) + " " + r1(YD + px));
          var t = el.querySelector(".ob-mi-trelica");
          if (t) t.style.transform = "rotate(" + r1(Math.atan2(px, cp) * 180 / Math.PI * 0.5) + "deg)";
        },
        quedaPx: { rompe: 30 },
        legendaErguer: "🏗️ Cravando o apoio na rocha, montando a treliça barra a barra, estendendo a plataforma sobre o abismo...",
      },
      mapa: function (sit, dados) {
        if (sit === "terreno") return '<path d="M120 104h36" stroke="' + TINTA + '" stroke-width="1" opacity=".45"/><path d="M122 104v-5M127 104v-5M122 101h5"' + T + ' stroke-width="1" opacity=".6"/><path d="M148 104v-8" stroke="#5a3d22" stroke-width="2.2"/><path d="M140 88h16l-1 8h-14z" fill="#d6c39b"' + T + ' stroke-width="1"/><path d="M143 91.5h10M143 94h6"' + T + ' stroke-width=".8" opacity=".7"/>';
        var caida = sit === "ferida";
        var s = '<path d="M114 104V88l10-4 8 4v16z" fill="#cdbb8c"' + T + ' stroke-width=".9"/><path d="M118 98l-3 3M124 96l-4 4"' + T + ' stroke-width=".7" opacity=".6"/>';
        if (caida) return s + '<path d="M130 88l24 10" stroke="#5a3a1c" stroke-width="2"/><path d="M134 90l6 6M140 88l6 6" stroke="#5a3a1c" stroke-width="1"/><path d="M138 90l3 3-2 3" fill="none" stroke="#a02020" stroke-width="1.1"/>' + fumaca(150, 92);
        return s + '<g class="' + (sit === "fraca" ? "ob-m-range" : "") + '"><path class="ob-mp-deck" d="M128 88h28v2.5h-28z"' + T + ' stroke-width=".7"/><path d="M130 90.5v5h24v-5M136 90.5l6 5M142 90.5l6 5M148 90.5l6 5" fill="none"' + T + ' stroke-width=".8"/><path d="M130 88v-3M138 88v-3M146 88v-3M154 88v-3M130 85.5h24"' + T + ' stroke-width=".6"/></g>' + andantes(130, 82.6, 22) + (sit === "pe" ? bandeirinha(155, 85, !!(dados && dados.ouro)) : "") + (dados && dados.reconstruida ? bronzinho(132, 96) : "");
      },
    };
    function guarda(x0, y, lp) {
      var d = "M" + x0 + " " + (y - 6) + "h" + r1(lp);
      for (var x = x0 + 6; x < x0 + lp; x += 12) d += "M" + r1(x) + " " + y + "v-6";
      return d;
    }
  })();

  // =====================================================================
  // BLOCO 6 · CIDADELA DA ALIANÇA (beleza × segurança, fundação, arco, cerco)
  // =====================================================================
  (function () {
    var FUN = {
      rocha: { id: "rocha", nome: "Alicerce na rocha", resumo: "o chão aguenta 500 kPa", cap: 500, preco: 40, moedas: "40 moedas", runa: "1.4", laudo: "alicerce na rocha, 500 kPa",
        seda: "Rocha sob a cidadela. Os sete reinos concordam: tudo começa pela base.",
        icone: '<svg viewBox="0 0 48 30" aria-hidden="true"><path d="M2 28l8-12 10 2 8-8 10 8 8 10z" fill="#cdbb8c" stroke="#3b2412" stroke-width="1.3"/><rect x="12" y="10" width="24" height="8" fill="#b39c72" stroke="#3b2412" stroke-width="1.2"/></svg>' },
      estacas: { id: "estacas", nome: "Estacas até a rocha", resumo: "atravessam a lama · 500 kPa, mais caras", cap: 500, preco: 60, moedas: "60 moedas", runa: "1.4", laudo: "estacas cravadas até a rocha, 500 kPa",
        seda: "Estacas até a rocha: caras, mas transformam lama em chão firme.",
        icone: '<svg viewBox="0 0 48 30" aria-hidden="true"><path d="M2 14h44v14H2z" fill="#9c8a6a" stroke="#3b2412" stroke-width="1.2"/><path d="M10 10v16M24 10v16M38 10v16" stroke="#5a3a1c" stroke-width="3"/><rect x="4" y="4" width="40" height="6" fill="#b39c72" stroke="#3b2412" stroke-width="1.2"/><path d="M2 28h44" stroke="#3b2412" stroke-width="1.6"/></svg>' },
      mole: { id: "mole", nome: "Direto no solo mole", resumo: "o chão aguenta 120 kPa", cap: 120, preco: 0, moedas: "de graça", runa: "1.4", laudo: "direto no solo mole, 120 kPa",
        seda: "Na lama? Muralha pesada em chão mole é a história de Pisa contada de novo.",
        icone: '<svg viewBox="0 0 48 30" aria-hidden="true"><path d="M2 28q8-6 16-2t14 0 14 2v2H2z" fill="#9c8a6a" stroke="#3b2412" stroke-width="1.2"/><rect x="14" y="6" width="20" height="14" fill="#d9c49a" stroke="#3b2412" stroke-width="1.2" transform="rotate(6 24 20)"/></svg>' },
    };
    var SAL = {
      contrafortes: { id: "contrafortes", nome: "Arco com contrafortes", resumo: "o empuxo do arco encontra ombros · resiste 600 kN", capH: 600, preco: 40, moedas: "40 moedas", runa: "0.8", laudo: "arco de pedra com contrafortes, 600 kN de empuxo",
        seda: "Arco com contrafortes: o arco empurra para fora, e os ombros de pedra respondem. Ação e reação em pedra.",
        icone: '<svg viewBox="0 0 48 30" aria-hidden="true"><path d="M10 28V14q14-16 28 0v14" fill="none" stroke="#3b2412" stroke-width="2.4"/><path d="M2 28V18h8v10M38 28V18h8v10" fill="#cdbb8c" stroke="#3b2412" stroke-width="1.2"/></svg>' },
      sem: { id: "sem", nome: "Arco sem contrafortes", resumo: "mais leve e barato · a muralha segura só 150 kN de empuxo", capH: 150, preco: 20, moedas: "20 moedas", runa: "0.8", laudo: "arco de pedra sem contrafortes, 150 kN",
        seda: "Arco sem contrafortes? Lindo no desenho. Mas quem segura o empurrão para fora, aprendiz?",
        icone: '<svg viewBox="0 0 48 30" aria-hidden="true"><path d="M10 28V14q14-16 28 0v14" fill="none" stroke="#3b2412" stroke-width="2.4"/><path d="M6 18l-4 3M42 18l4 3" stroke="#a02020" stroke-width="1.4"/></svg>' },
      madeira: { id: "madeira", nome: "Vigas de madeira no vão", resumo: "sem empuxo · 12 m de vão vergam com os anos", capH: 1e9, preco: 15, moedas: "15 moedas", runa: "1.3", fraca: true, laudo: "vigas de madeira de 12 m, sem empuxo",
        seda: "Madeira no vão grande: não empurra as paredes, mas verga com os anos e apodrece calada.",
        icone: '<svg viewBox="0 0 48 30" aria-hidden="true"><path d="M6 12h36" stroke="#a8733d" stroke-width="4"/><path d="M6 12v16M42 12v16" stroke="#3b2412" stroke-width="2"/><path d="M14 14q10 6 20 0" fill="none" stroke="#6b4a2b" stroke-width="1.2"/></svg>' },
    };
    var EST = [
      { id: "inauguracao", emoji: "👑", nome: "a inauguração lota os salões", q: 4, fator: 1.0, nota: "multidão de 4 kPa nos salões" },
      { id: "cerco", emoji: "⚔️", nome: "o cerco: o aríete bate na muralha", q: 1, fator: 1.0, ariete: 240, nota: "aríete de 240 kN a meia altura" },
      { id: "tempestade", emoji: "⛈️", nome: "a tempestade de inverno", q: 1, fator: 1.0, vento: 2.08, nota: "vento 1,6 kPa ×1,3, chuva" },
    ];
    var ORC = 170, PER = 120, GAMA = 24, PRECO_M3 = 0.015, S = 12, RISE = 3, W_ARC = 20, NORMA = 30, BELEZA_OURO = 35, H_MIN = 8, XC = 180, YC = 146;
    function espessura(beleza, h, fun, sal) {
      var estrutural = (100 - beleza) / 100 * ORC - (fun ? fun.preco : 0) - (sal ? sal.preco : 0);
      return limitar(estrutural / (PER * h * PRECO_M3), 0.3, 3.0);
    }
    OBRAS.bloco6 = {
      id: "bloco6", nome: "Cidadela da Aliança", icone: "🏰", guardia: "Concórdia, a Rainha da Aliança", emoji: "👑", orcamento: ORC,
      falas: {
        nova: "Aproxima-te do trono. A cidadela é a obra dos sete reinos: fundação, arco, muralha, e beleza. O cofre tem 170 moedas: o que fores gastar em vitrais e torres, falta na espessura da muralha. A norma do reino exige pelo menos 30% em segurança. O conselho quer muralhas de 8 m.",
        pe: "A Grande Aliança está selada em pedra. Bela e segura, como uma cidade deve ser.",
        ouro: "Bela E segura: eis a Cidade Completa. Quem acha que é um ou outro ainda não entendeu a Aliança.",
        fraca: "De pé, mas a Aliança não está inteira. Falta folga, falta altura, ou há madeira que o tempo vai cobrar.",
        ferida: "A cidadela ruiu, ou o fiscal a interditou. Nenhum reino sozinho a salva: lê o laudo e une-os de novo.",
        reconstruida: "Reconstruída pela segunda aliança. A placa de bronze é tua, construtor de reinos.",
        orcamento: "O tesoureiro cruzou os braços: isso custa mais do que o reino tem. Afina o projeto.",
        voltarFerida: "De volta ao trono. Fundação, arco, muralha ou norma: o laudo disse qual.", voltarPe: "De volta ao trono. Mais beleza cabe? Só se a muralha aguentar.",
      },
      cartas: [
        { id: "fundacao", titulo: "A fundação: onde apoiar", opcoes: FUN, ordem: ["rocha", "estacas", "mole"] },
        { id: "salao", titulo: "O salão: como vencer o vão de 12 m", opcoes: SAL, ordem: ["contrafortes", "sem", "madeira"] },
      ],
      ajustes: [
        { id: "beleza", rotulo: "Parte do cofre para a beleza", min: 0, max: 80, passo: 5, padrao: 30, dica: "Vitrais, torres e douração. O que vai para a beleza sai da espessura da muralha. A norma exige 30% de segurança.",
          formatar: function (v, cfg) { var fun = FUN[cfg.fundacao], sal = SAL[cfg.salao]; return fmt(v) + " % beleza · " + fmt(100 - v) + " % segurança  (muralha de " + fmt(espessura(v, cfg.altura, fun, sal), 2) + " m)"; },
          falas: { alto: "Tanto em vitrais? Linda... mas passa de 70% e o fiscal a interdita antes da festa. A norma pede 30% de segurança.", baixo: "Zero de beleza? Segura como um calabouço. Ninguém quer morar num." } },
        { id: "altura", rotulo: "Altura das muralhas", min: 6, max: 18, passo: 1, padrao: 10, dica: "Muralha alta impõe respeito, custa pedra e dá braço ao vento e ao aríete.",
          formatar: function (v) { return fmt(v) + " m" + (v >= H_MIN ? "  (o conselho aprova)" : "  (baixa: o conselho pede " + H_MIN + " m)"); },
          falas: { alto: "Dezoito metros de muralha! O mesmo cofre, espalhado em mais altura, fica fino.", baixo: "Seis metros? Qualquer escada de cerco a vence." } },
      ],
      estagios: EST,
      medidor: { titulo: "Esforço × capacidade", valor: function (e) { return fmt(e.razao * 100) + " %"; }, sub: function (e) { return "pior: " + e.pior; } },
      tiles: [
        { rotulo: "Espessura da muralha", valor: function (e) { return fmt(e.t, 2) + " m"; }, sub: "o que sobrou do cofre virou pedra", vazio: "m que o cofre comprou" },
        { rotulo: "Fator de segurança", fs: true, sub: "o menor entre solo, arco e muralha (meta ≥ 1,5)" },
        { rotulo: "Empuxo do arco", valor: function (e) { return fmt(e.Harc) + " kN"; }, sub: function (e, cfg) { return "o salão resiste a " + (SAL[cfg.salao].capH > 1e6 ? "∞ (sem empuxo)" : fmt(SAL[cfg.salao].capH) + " kN"); } },
        { rotulo: "Pressão no solo", valor: function (e) { return fmt(e.p) + " kPa"; }, sub: function (e, cfg) { return "o chão aguenta " + fmt(FUN[cfg.fundacao].cap) + " kPa"; } },
      ],
      escala: function (cfg) { return "1 : 240 · " + fmt(100 - cfg.beleza) + " % segurança"; },
      calcular: function (cfg) {
        var fun = FUN[cfg.fundacao], sal = SAL[cfg.salao];
        var beleza = limitar(Number(cfg.beleza), 0, 80), h = limitar(Number(cfg.altura), 6, 18);
        var t = espessura(beleza, h, fun, sal);
        var r = { completo: !!(fun && sal), t: t };
        r.custo = custoDe([{ rotulo: "fundação", valor: fun ? fun.preco : 0 }, { rotulo: "salão", valor: sal ? sal.preco : 0 }, { rotulo: "muralhas", valor: PER * h * t * PRECO_M3 }, { rotulo: "beleza", valor: beleza / 100 * ORC }], ORC);
        r.custo.dentro = true; // a beleza é o que sobra: o cofre fecha sempre
        if (!r.completo) return r;
        var W = GAMA * t * h, p = W / (t + 0.6), Mr = GAMA * t * h * t / 2;
        var ests = EST.map(function (def, i) {
          var Harc = (W_ARC + def.q * def.fator * 3) * S * S / (8 * RISE);
          var Mv = def.ariete ? def.ariete * (h / 2) / 4 : def.vento ? def.vento * h * h / 2 : 0.2 * h * h / 2;
          var rs = p / fun.cap, ra = sal.capH > 1e6 ? 0 : Harc / sal.capH, rm = Mv / Mr;
          var pior = rs >= ra && rs >= rm ? "o solo" : ra >= rm ? "o arco" : "a muralha";
          var e = estagio(def, { indice: i, t: t, p: p, Harc: Harc, Mv: Mv, Mr: Mr, fs: Math.min(fun.cap / p, sal.capH / Math.max(Harc, 1e-9), Mr / Math.max(Mv, 1e-9)), razao: Math.max(rs, ra, rm), pior: pior,
            cargaTexto: def.ariete ? fmt(def.ariete) + " kN" : def.vento ? fmt(def.vento, 2) + " kPa" : fmt(def.q) + " kPa", esforcoTexto: fmt(Math.max(rs, ra, rm) * 100) + " %", deflPx: 0 });
          if (i === 0 && 100 - beleza < NORMA) { e.resultado = "falha"; e.falha = "norma"; e.runa = "6.4"; e.porque = "Só " + fmt(100 - beleza) + " % do cofre foi para a segurança, e a norma do reino exige no mínimo " + NORMA + " %. O fiscal interditou a cidadela antes da inauguração: abaixo da norma, nenhuma beleza salva a obra (runa 6.4)."; }
          else if (p >= fun.cap) { e.resultado = "falha"; e.falha = "afunda"; e.runa = "1.4"; e.porque = "A muralha de " + fmt(t, 2) + " m pediu ao chão " + fmt(p) + " kPa e ele só aguentava " + fmt(fun.cap) + ". Afundou de um lado e rachou. Fundação é o primeiro reino (runas 1.4 e E.5)."; }
          else if (Harc >= sal.capH) { e.resultado = "falha"; e.falha = "abre"; e.runa = "0.8"; e.porque = "O arco do salão empurrou as paredes para fora com " + fmt(Harc) + " kN e, sem contrafortes, elas só seguravam " + fmt(sal.capH) + ". Abriram, e a pedra de fecho caiu. Todo arco precisa de ombros (runa 0.8)."; }
          else if (Mv >= Mr) { e.resultado = "falha"; e.falha = "tomba"; e.runa = "6.1"; e.porque = (def.ariete ? "O aríete bateu com " + fmt(def.ariete) + " kN" : "O vento empurrou") + " e fez " + fmt(Mv) + " kN·m por metro de muralha; com " + fmt(t, 2) + " m de espessura ela só resistia " + fmt(Mr) + ". Tombou. Beleza demais, muralha de menos (runas 6.1 e 6.4)."; }
          return e;
        });
        var extras = [];
        if (sal.fraca) extras.push({ runa: "1.3", texto: "vigas de madeira de 12 m vergam com os anos e apodrecem caladas (runa 1.3)" });
        if (h < H_MIN) extras.push({ runa: null, texto: "muralhas de " + fmt(h) + " m; o conselho pedia " + H_MIN + " m: de pé, mas sem cumprir o que o reino pediu" });
        r.ouroExtra = beleza >= BELEZA_OURO; // ouro só se também for bela
        fecharVeredito(r, ests, extras);
        r.ouro = r.veredito === "pe" && beleza >= BELEZA_OURO;
        r.resumo = "Fator de segurança de " + fmt(r.fsMin, 2) + " no pior estágio, com " + fmt(beleza) + " % do cofre em beleza.";
        r.itens = ["<strong>Fundação:</strong> " + esc(fun.laudo), "<strong>Salão:</strong> " + esc(sal.laudo), "<strong>Muralhas:</strong> " + fmt(h) + " m de altura, " + fmt(t, 2) + " m de espessura (" + fmt(100 - beleza) + " % do cofre em segurança)", "<strong>Beleza:</strong> " + fmt(beleza) + " % do cofre em vitrais, torres e douração"];
        r.nota = "Modelo simplificado da Mesa: a espessura da muralha é o que o cofre compra depois da beleza; p = W/(t+0,6); empuxo do arco H = wS²/8f; muralha no aríete e no vento como bloco rígido (Mr = W·t/2).";
        return r;
      },
      planta: {
        fundo: function () { return ceu() + '<path class="ob-colina" d="M0 150q90-30 180-24t180 24v60H0z"/><path class="ob-margem" d="M0 146h360v64H0z"/><path class="ob-margem-borda" d="M0 146h360"/>'; },
        estrutura: function (cfg) {
          var fun = FUN[cfg.fundacao], sal = SAL[cfg.salao], esb = !fun || !sal;
          var beleza = Number(cfg.beleza), h = Number(cfg.altura), t = espessura(beleza, h, fun, sal), hp = h * 4.2, tp = Math.max(3, t * 7), yT = YC - hp;
          var torres = beleza >= 20 ? 2 : beleza >= 10 ? 1 : 0, vitrais = beleza >= 30, ouro = beleza >= 50;
          var s = "";
          if (fun && fun.id === "rocha") s += '<path class="ob-rocha" d="M40 146l12-8 16 2 12-6 200 0 12 6 16-2 12 8v16H40z"/>';
          if (fun && fun.id === "estacas") s += '<path class="ob-lama" d="M40 146h280v14H40z"/><path class="ob-estacas" d="M70 146v18M110 146v18M150 146v18M210 146v18M250 146v18M290 146v18"/>';
          if (fun && fun.id === "mole") s += '<path class="ob-lama" d="M40 146h280v14H40z"/><path class="ob-pontos" d="M60 152h1M90 155h1M130 151h1M230 155h1M270 151h1M300 154h1"/>';
          // muralhas esquerda e direita (grupos que tombam/afundam)
          s += '<g class="ob-ci-muralha ob-ci-mur-e' + (esb ? " ob-esboco" : "") + '" style="transform-origin:60px 146px"><rect class="ob-ci-pedra" x="60" y="' + r1(yT) + '" width="60" height="' + r1(hp) + '"/><path class="ob-ci-ameias" d="M58 ' + r1(yT) + 'h64v-6h-6v4h-7v-4h-7v4h-7v-4h-7v4h-7v-4h-7v4h-7v-4h-9z"/><path class="ob-ci-esp" d="M60 ' + r1(yT + 4) + 'h' + r1(tp) + 'v' + r1(hp - 4) + 'h-' + r1(tp) + 'z"/></g>' +
            '<g class="ob-ci-muralha ob-ci-mur-d' + (esb ? " ob-esboco" : "") + '" style="transform-origin:300px 146px"><rect class="ob-ci-pedra" x="240" y="' + r1(yT) + '" width="60" height="' + r1(hp) + '"/><path class="ob-ci-ameias" d="M238 ' + r1(yT) + 'h64v-6h-6v4h-7v-4h-7v4h-7v-4h-7v4h-7v-4h-7v4h-7v-4h-9z"/><path class="ob-ci-esp" d="M' + r1(300 - tp) + ' ' + r1(yT + 4) + 'h' + r1(tp) + 'v' + r1(hp - 4) + 'h-' + r1(tp) + 'z"/></g>';
          // salão central com arco (ou vigas)
          var yS = Math.min(yT + 10, 112);
          s += '<g class="ob-ci-salao' + (esb ? " ob-esboco" : "") + '"><rect class="ob-ci-pedra" x="120" y="' + r1(yS) + '" width="120" height="' + r1(YC - yS) + '"/>';
          if (sal && sal.id !== "madeira") s += '<path class="ob-ci-arco" d="M150 146V128q30-30 60 0v18"/><path class="ob-ci-fecho" d="M176 113h8l-1 6h-6z"/>';
          else if (sal) s += '<path class="ob-ci-vigas" d="M126 122h108M126 128h108"/><path class="ob-ci-arco" d="M150 146v-18h60v18" style="stroke-dasharray:none"/>';
          if (sal && sal.id === "contrafortes") s += '<path class="ob-ci-contraforte" d="M120 146v-24l-14 6v18zM240 146v-24l14 6v18z"/>';
          if (vitrais) s += '<path class="ob-ci-vitral" d="M136 ' + r1(yS + 10) + 'h8v12h-8zM216 ' + r1(yS + 10) + 'h8v12h-8z"/>';
          s += '<path class="ob-ci-cupula' + (ouro ? " ob-ci-ouro" : "") + '" d="M150 ' + r1(yS) + 'q30-26 60 0z"/>' + (ouro ? '<circle class="ob-ci-ouro" cx="180" cy="' + r1(yS - 15) + '" r="2.5"/>' : "") + bandeira(180, yS - 13) + "</g>";
          for (var i = 0; i < torres; i++) { var xt = i === 0 ? 48 : 312; s += '<g class="ob-ci-torre' + (esb ? " ob-esboco" : "") + '"><rect class="ob-ci-pedra" x="' + (xt - 8) + '" y="' + r1(yT - 16) + '" width="16" height="' + r1(hp + 16) + '"/><path class="ob-ci-teto' + (ouro ? " ob-ci-ouro" : "") + '" d="M' + (xt - 10) + ' ' + r1(yT - 16) + 'l10-14 10 14z"/><path class="ob-ci-flamula" d="M' + xt + ' ' + r1(yT - 30) + 'v-8l8 2-8 2"/></g>'; }
          s += '<path class="ob-trinca" d="M130 ' + r1(yT + 10) + 'l5 8-4 5 6 6"/><path class="ob-ci-fita" d="M40 120h280"/><text class="ob-ci-fita-txt" x="180" y="117" text-anchor="middle">INTERDITADA PELA NORMA</text>' +
            '<g class="ob-cotas"><path d="M30 ' + r1(yT) + 'h6M30 146h6M33 ' + r1(yT) + 'V146"/><text x="27" y="' + r1((yT + 146) / 2) + '" text-anchor="middle" transform="rotate(-90 27 ' + r1((yT + 146) / 2) + ')">h = ' + fmt(h) + ' m</text><text x="180" y="175" text-anchor="middle">muralha de ' + fmt(t, 2) + ' m · beleza ' + fmt(beleza) + ' %</text></g>' +
            '<g class="ob-carga ob-carga-inauguracao">' + figuras(5, 146, 150) + '</g>' +
            '<g class="ob-carga ob-carga-cerco ob-ci-ariete"><rect x="0" y="' + r1(YC - hp / 2 - 4) + '" width="34" height="8" rx="2"/><circle cx="6" cy="' + r1(YC - 3) + '" r="3"/><circle cx="28" cy="' + r1(YC - 3) + '" r="3"/><path d="M6 ' + r1(YC - hp / 2) + 'v' + r1(hp / 2 - 6) + 'M28 ' + r1(YC - hp / 2) + 'v' + r1(hp / 2 - 6) + '"/></g>' +
            '<g class="ob-andantes-planta">' + figuras(3, 146, 150) + "</g>";
          return s;
        },
        quedaPx: {},
        legendaErguer: "🏗️ Alicerçando, erguendo as muralhas, fechando o arco do salão, dourando as torres...",
      },
      mapa: function (sit, dados) {
        if (sit === "terreno") return '<path d="M144 104h14" stroke="' + TINTA + '" stroke-width="1" opacity=".45"/><path d="M146 104v-4M150 104v-4M146 101.5h4"' + T + ' stroke-width="1" opacity=".6"/><path d="M155 104v-7" stroke="#5a3d22" stroke-width="2"/><path d="M148 90h12l-1 7h-10z" fill="#d6c39b"' + T + ' stroke-width="1"/><path d="M150 93h8M150 95h5"' + T + ' stroke-width=".8" opacity=".7"/>';
        var caida = sit === "ferida";
        var s = '<g' + (caida ? ' transform="rotate(14 157 100)"' : "") + ' class="' + (sit === "fraca" ? "ob-m-range" : "") + '"><rect class="ob-mp-deck" x="147" y="70" width="11" height="30"' + T + ' stroke-width=".9"/><path d="M146 70h13v-3h-3v2h-3v-2h-3v2h-3v-2h-1z" fill="#cdbb8c"' + T + ' stroke-width=".7"/><path d="M152.5 76v3M152.5 86v3"' + T + ' stroke-width="1"/>' +
          (caida ? '<path d="M149 96l3-5-2-5 3-4" fill="none" stroke="#a02020" stroke-width="1.1"/>' : bandeirinha(152.5, 67, !!(dados && dados.ouro))) + "</g>";
        return s + (caida ? fumaca(150, 74) : andantes(130, 95.6, 14) + (dados && dados.reconstruida ? bronzinho(147, 96) : ""));
      },
    };
  })();

  window.OBRAS_CATALOGO = { ordem: ORDEM, obras: OBRAS, util: util };
})();
