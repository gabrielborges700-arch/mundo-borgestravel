/**
 * glossario.js — GLOSSÁRIO MÁGICO
 *
 * O QUE ELE FAZ
 *  - Quando uma runa abre, as palavras difíceis do texto ("tração", "viga",
 *    "flambagem"...) ganham um sublinhado pontilhado. Tocar na palavra abre
 *    um balãozinho com a explicação em linguagem de criança.
 *  - Só a 1ª vez que cada palavra aparece na runa é marcada, e no máximo 10
 *    palavras por runa, para o texto não virar um "mar de pontinhos".
 *  - Cada palavra tocada entra na coleção "Palavras descobertas", que
 *    aparece no Diário (📖). A coleção fica salva no navegador, na chave
 *    "borgestravel_glossario" (nova; nenhuma chave antiga muda).
 *
 * COMO MEXER NAS PALAVRAS
 *  Cada item da lista PALAVRAS tem:
 *    id     → nome interno (não mude depois de publicado: é o que fica salvo);
 *    nome   → como aparece no balão;
 *    padrao → como achar a palavra no texto (expressão regular);
 *    def    → a explicação.
 *  A ORDEM da lista é a prioridade: quando uma runa tem mais de 10 palavras
 *  do glossário, as primeiras da lista ganham o sublinhado.
 *
 * Sem bibliotecas e sem "module": funciona abrindo o index.html direto.
 * Nenhum .js existente é editado: este arquivo "encadeia" abrirModalRuna,
 * abrirModalRunaNegra e abrirModalDiario (o mesmo jeito do painel-reino.js).
 */
(function () {
  "use strict";

  var PALAVRAS = [
    // ---- Os esforços (os "5 vilões") e a tensão ----
    { id: "tracao", nome: "Tração", padrao: "tração", def: "Esforço de PUXAR: tenta esticar a peça, como as duas equipes de um cabo de guerra puxando a corda." },
    { id: "compressao", nome: "Compressão", padrao: "compressão", def: "Esforço de APERTAR: tenta esmagar ou encurtar a peça, como quando você pisa num marshmallow." },
    { id: "flexao", nome: "Flexão", padrao: "flexão", def: "Esforço de DOBRAR: a peça entorta, apertando um lado e esticando o outro, como uma prancha de piscina com alguém na ponta." },
    { id: "torcao", nome: "Torção", padrao: "torção", def: "Esforço de TORCER: as pontas da peça giram para lados opostos, como quando você torce uma toalha molhada." },
    { id: "cisalhamento", nome: "Cisalhamento", padrao: "cisalhamento", def: "Esforço de CORTAR: duas forças deslizam em sentidos contrários, uma colada na outra, como as lâminas de uma tesoura." },
    { id: "tensao", nome: "Tensão", padrao: "tens(?:ão|ões)", def: "O aperto (ou o puxão) que cada pedacinho do material sente por dentro: é a força dividida pela área onde ela age. Mede-se em pascal (Pa) ou megapascal (MPa)." },
    // ---- Cargas e peças da estrutura ----
    { id: "carga", nome: "Carga", padrao: "cargas?", def: "Tudo o que pesa ou empurra uma estrutura: o peso dela mesma, pessoas, móveis, carros, vento, água..." },
    { id: "peso-proprio", nome: "Peso próprio", padrao: "peso próprio", def: "O peso da própria estrutura. É uma carga que está sempre lá, mesmo com o prédio vazio." },
    { id: "viga", nome: "Viga", padrao: "vigas?", def: "Peça deitada que vence um vão e leva o peso até os apoios, como uma prateleira entre dois suportes." },
    { id: "pilar", nome: "Pilar", padrao: "pilar(?:es)?", def: "Peça em pé que recebe o peso das vigas e lajes lá de cima e o leva para baixo, até a fundação." },
    { id: "coluna", nome: "Coluna", padrao: "(?<!em )colunas?", def: "Peça em pé que sustenta peso. Na engenharia, é a mesma ideia do pilar." },
    { id: "laje", nome: "Laje", padrao: "lajes?", def: "Placa (quase sempre de concreto) que forma o piso ou o teto de um andar e passa o peso para as vigas ou os pilares." },
    { id: "fundacao", nome: "Fundação", padrao: "funda(?:ção|ções)(?! do saber)", def: "A parte da construção que fica no chão, quase sempre enterrada, e passa todo o peso do prédio para o solo." },
    // "vão" só como o vão da ponte (nunca o verbo: "eles vão")
    { id: "vao", nome: "Vão", padrao: "(?<=(?<![\\p{L}])(?:o|do|no|um|maior|cada|grande) )vão|vãos", def: "A distância livre entre dois apoios, que a viga, a laje ou a ponte precisa vencer sem nada embaixo." },
    { id: "arco", nome: "Arco", padrao: "arcos?", def: "Estrutura curva em que as peças se empurram umas contra as outras: tudo trabalha apertado (compressão). Por isso dá para fazer arco até com pedras sem nada colando." },
    { id: "aduela", nome: "Aduela", padrao: "aduelas?", def: "Cada pedra em forma de cunha que forma um arco." },
    { id: "trelica", nome: "Treliça", padrao: "treliças?", def: "Estrutura de barras retas ligadas formando triângulos. O triângulo não se deforma fácil, por isso as treliças aparecem em pontes, torres e telhados." },
    { id: "cabo", nome: "Cabo", padrao: "cabos?", def: "Fio grosso, quase sempre de aço, que só trabalha sendo PUXADO (tração). Empurrado, ele fica mole e não segura nada." },
    { id: "apoio", nome: "Apoio", padrao: "apoios?", def: "Ponto onde a estrutura se segura: no chão, num pilar, numa parede. Ele empurra a estrutura de volta (a reação) para ela ficar parada." },
    { id: "engaste", nome: "Engaste", padrao: "engaste|engastad[oa]s?", def: "Ligação que trava a peça por completo: ela não pode deslizar nem girar, como uma prateleira chumbada na parede." },
    { id: "em-balanco", nome: "Em balanço", padrao: "(?<=(?<![\\p{L}])em )balanço", def: "Peça presa só de um lado, com a outra ponta solta no ar, como um trampolim de piscina ou uma marquise." },
    // "momento" só no sentido de giro (nunca "naquele momento")
    { id: "momento", nome: "Momento", padrao: "momentos? fletor(?:es)?|momentos", def: "O efeito de GIRO de uma força: é a força vezes a distância até o ponto de giro. Por isso é mais fácil abrir a porta empurrando longe da dobradiça." },
    { id: "equilibrio", nome: "Equilíbrio", padrao: "equilíbrio", def: "Quando todas as forças e todos os giros se anulam: a estrutura fica parada, sem andar nem girar." },
    // ---- Materiais ----
    { id: "concreto-armado", nome: "Concreto armado", padrao: "concreto armado", def: "Concreto com barras de aço escondidas dentro. O concreto aguenta os apertos (compressão) e o aço aguenta os puxões (tração)." },
    { id: "concreto", nome: "Concreto", padrao: "concreto(?! armado)", def: "Mistura de cimento, areia, pedra britada e água que endurece numa reação química com a água (não é só secando). Aguenta muito bem ser apertado, mas racha fácil quando é puxado." },
    { id: "aco", nome: "Aço", padrao: "aços?", def: "Ferro misturado com um pouquinho de carbono. É forte tanto para ser puxado quanto para ser apertado, e entorta bastante antes de quebrar." },
    { id: "alvenaria", nome: "Alvenaria", padrao: "alvenaria", def: "Paredes feitas de tijolos, blocos ou pedras empilhados e grudados com argamassa." },
    { id: "argamassa", nome: "Argamassa", padrao: "argamassa", def: "Massa de cimento ou cal, areia e água que gruda tijolos e pedras e reveste paredes." },
    { id: "pozolana", nome: "Pozolana", padrao: "pozolana", def: "Cinza vulcânica que os romanos misturavam à cal para fazer um concreto muito durável, que resiste até dentro do mar." },
    // ---- Medidas ----
    { id: "mpa", nome: "MPa (megapascal)", padrao: "MPa", sensivel: true, def: "Unidade de tensão e de pressão: 1 MPa é 1 milhão de pascals, mais ou menos o peso de 10 kg apoiado em cada centímetro quadrado." },
    { id: "kn", nome: "kN (quilonewton)", padrao: "kN", sensivel: true, def: "Unidade de força: 1 kN são mil newtons, mais ou menos o peso de um saco de 100 kg aqui na Terra." },
    { id: "newton", nome: "Newton", padrao: "newtons?", sensivel: true, def: "Unidade de força (símbolo N). Uma maçã pequena, de uns 100 gramas, pesa mais ou menos 1 newton." },
    { id: "pressao", nome: "Pressão", padrao: "press(?:ão|ões)", def: "Força dividida pela área onde ela age. A mesma força numa área menor faz mais pressão: por isso o salto fino afunda na grama e o tênis não." },
    // ---- Como os materiais se comportam ----
    { id: "elastico", nome: "Elástico", padrao: "elástic[oa]s?|elasticidade", def: "Comportamento elástico: o material deforma com a carga e VOLTA ao normal quando ela sai, como um elástico de dinheiro." },
    { id: "rigidez", nome: "Rigidez", padrao: "rigidez|rígid[oa]s?", def: "O quanto uma peça resiste a se deformar: uma peça rígida quase não entorta nem estica." },
    { id: "ductil", nome: "Dúctil", padrao: "dúctil|dúcteis", def: "Material que estica e entorta bastante antes de quebrar, dando aviso, como o aço." },
    { id: "fragil", nome: "Frágil", padrao: "frágil|frágeis", def: "Material que quebra de repente, quase sem entortar antes, como o vidro." },
    { id: "escoamento", nome: "Escoamento", padrao: "escoamento", def: "O ponto em que o aço deixa de ser elástico: dali em diante ele se deforma e não volta mais ao normal." },
    { id: "fadiga", nome: "Fadiga", padrao: "fadiga", def: "Quando uma peça racha depois de ser carregada e descarregada milhares de vezes, mesmo com cargas pequenas, como um clipe que quebra de tanto dobrar." },
    { id: "flambagem", nome: "Flambagem", padrao: "flambagem", def: "Quando uma peça comprida e fina, apertada pelas pontas, de repente entorta para o lado. Experimente apertar uma régua em pé!" },
    { id: "fluencia", nome: "Fluência", padrao: "fluência", def: "Deformação bem lenta que o concreto vai sofrendo, por anos, quando fica muito tempo carregado." },
    { id: "retracao", nome: "Retração", padrao: "retração", def: "O encolhimento do concreto conforme ele perde água e endurece." },
    { id: "ressonancia", nome: "Ressonância", padrao: "ressonância", def: "Quando empurrões no ritmo certo fazem a estrutura balançar cada vez mais, como empurrar um balanço sempre na hora certa." },
    { id: "vibracao", nome: "Vibração", padrao: "vibra(?:ção|ções)", def: "Movimento de vai e vem de uma estrutura, rápido ou lento." },
    { id: "amortecedor", nome: "Amortecedor", padrao: "amortecedor(?:es)?", def: "Peça que \"bebe\" a energia do movimento e diminui as vibrações e os balanços." },
    { id: "pendulo", nome: "Pêndulo", padrao: "pêndulos?", def: "Peso pendurado que balança de um lado para o outro, sempre no mesmo ritmo." },
    { id: "estabilidade", nome: "Estabilidade", padrao: "estabilidade", def: "Capacidade de a estrutura ficar de pé e no lugar, sem tombar, escorregar ou entortar de repente." },
    { id: "centro-gravidade", nome: "Centro de gravidade", padrao: "centro de gravidade", def: "O ponto onde dá para imaginar todo o peso de um corpo concentrado. Se ele sai de cima da base, o objeto tomba." },
    { id: "lastro", nome: "Lastro", padrao: "lastro", def: "Peso colocado no fundo do navio para baixar o centro de gravidade e o navio não virar." },
    { id: "contrapeso", nome: "Contrapeso", padrao: "contrapesos?", def: "Peso colocado do outro lado para equilibrar, como na gangorra ou no braço de um guindaste." },
    // ---- Máquinas e ferramentas de cálculo ----
    { id: "alavanca", nome: "Alavanca", padrao: "alavancas?", def: "Barra que gira em torno de um ponto de apoio e multiplica a força, como a gangorra ou o pé de cabra." },
    { id: "polia", nome: "Polia", padrao: "polias?", def: "Roda com um sulco por onde passa uma corda. Juntando várias polias, dá para levantar muito peso com menos força." },
    { id: "guindaste", nome: "Guindaste", padrao: "guindastes?", def: "Máquina que levanta peças pesadas com cabos, polias e contrapeso." },
    { id: "vetor", nome: "Vetor", padrao: "vetor(?:es)?", def: "Seta que representa uma força: o tamanho mostra a intensidade, e a ponta mostra para onde ela empurra." },
    { id: "atrito", nome: "Atrito", padrao: "atrito", def: "Força que aparece quando uma superfície tenta escorregar sobre outra e segura o movimento." },
    { id: "hooke", nome: "Lei de Hooke", padrao: "lei de hooke", def: "Enquanto o material é elástico, a deformação cresce na mesma proporção da força: o dobro de força dá o dobro de esticada." },
    // ---- Tipos de ponte e de estrutura ----
    { id: "pensil", nome: "Ponte pênsil", padrao: "pênsil|pênseis", def: "Ponte com o tabuleiro pendurado em cabos que passam por cima de torres altas, como a Golden Gate." },
    { id: "estaiada", nome: "Ponte estaiada", padrao: "estaiad[oa]s?", def: "Ponte em que o tabuleiro é segurado por cabos retos (os estais) que descem direto das torres." },
    { id: "tirante", nome: "Tirante", padrao: "tirantes?", def: "Barra ou cabo que trabalha só puxado, segurando duas partes para não se afastarem." },
    { id: "hiperestatica", nome: "Isostática e hiperestática", padrao: "hiperestátic[oa]s?|isostátic[oa]s?", def: "Estrutura isostática tem só os apoios necessários para ficar parada. A hiperestática tem apoios \"de sobra\": se algo falhar, as forças têm outros caminhos." },
    { id: "elementos-finitos", nome: "Elementos finitos", padrao: "elementos finitos", def: "Método de computador que divide a estrutura em milhares de pedacinhos e calcula como cada um se comporta." },
    { id: "von-mises", nome: "Von Mises", padrao: "von mises", def: "Uma conta que junta todos os esforços de um ponto num número só, para comparar com o limite do material. Nas simulações, vira o mapa de cores." },
    { id: "esbelto", nome: "Esbelto", padrao: "esbelt[oa]s?", def: "Comprido e fino. Peças esbeltas economizam material, mas balançam e flambam com mais facilidade." },
    { id: "prefabricado", nome: "Pré-fabricado", padrao: "pré-fabricad[oa]s?|pré-moldad[oa]s?", def: "Peça feita numa fábrica e só montada na obra, como peças de montar gigantes." },
    { id: "cupula", nome: "Cúpula", padrao: "cúpulas?", def: "Teto em forma de meia esfera, como um arco que dá a volta inteira." },
    { id: "rebite", nome: "Rebite", padrao: "rebites?", def: "Pino de metal colocado em brasa: ao esfriar, ele encolhe e aperta as peças com muita força." },
    { id: "estaca", nome: "Estaca", padrao: "estacas?", def: "Coluna enterrada fundo no chão para levar o peso da construção até camadas de solo mais firmes." },
    { id: "argila", nome: "Argila", padrao: "argila", def: "Solo de grãos finíssimos. Molhada, fica mole e pode ceder devagar sob o peso de uma construção." },
    { id: "adobe", nome: "Adobe", padrao: "adobe", def: "Tijolo de barro cru (terra, água e às vezes palha) secado ao sol, sem ir ao forno." },
    { id: "maquete", nome: "Maquete", padrao: "maquetes?", def: "Modelo em miniatura de uma construção, usado para estudar e testar ideias antes de construir de verdade." }
  ];

  var CHAVE = "borgestravel_glossario";
  var MAX_POR_RUNA = 10;
  // Onde NUNCA marcar: títulos, botões, campos, simuladores, o próprio balão
  var IGNORAR = "h1, h2, h3, h4, button, textarea, input, select, a, .btn-gotico, .sim-painel, .termo-glossario, .glossario-balao, [aria-hidden='true'], script, style";

  // Navegador antigo sem "olhar para trás" nas buscas (Safari < 16.4):
  // as palavras não são marcadas, mas a coleção do Diário continua aparecendo.
  var buscaOk = true;
  try { new RegExp("(?<=a)b(?![\\p{L}])", "u"); } catch (e) { buscaOk = false; }

  var porId = {};
  PALAVRAS.forEach(function (p) {
    porId[p.id] = p;
    if (!buscaOk) return;
    // a palavra não pode estar grudada em outra letra ("aço" não acha "espaço")
    p.re = new RegExp("(?<![\\p{L}\\p{N}])(?:" + p.padrao + ")(?![\\p{L}\\p{N}])", p.sensivel ? "u" : "iu");
  });

  // ---------- Coleção (palavras já tocadas) ----------
  function lerColecao() {
    try {
      var bruto = typeof armazenamentoLer === "function" ? armazenamentoLer(CHAVE) : window.localStorage.getItem(CHAVE);
      var lista = bruto ? JSON.parse(bruto) : [];
      return Array.isArray(lista) ? lista.filter(function (id) { return porId[id]; }) : [];
    } catch (e) { return []; }
  }
  function gravarColecao(lista) {
    var texto = JSON.stringify(lista);
    try {
      if (typeof armazenamentoGravar === "function") armazenamentoGravar(CHAVE, texto);
      else window.localStorage.setItem(CHAVE, texto);
    } catch (e) {}
  }
  // Devolve true se a palavra é nova na coleção
  function colecionar(id) {
    var lista = lerColecao();
    if (lista.indexOf(id) >= 0) return false;
    lista.push(id);
    gravarColecao(lista);
    if (typeof mostrarToast === "function") {
      if (lista.length === 1) mostrarToast("Nova palavra no Glossário! Veja a coleção no Diário 📖", "📖");
      else if (lista.length % 10 === 0) mostrarToast(lista.length + " palavras descobertas no Glossário!", "📖");
    }
    return true;
  }

  // ---------- Marcar as palavras numa janela de runa ----------
  function nosDeTexto(raiz) {
    var lista = [];
    var andador = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT, {
      acceptNode: function (no) {
        if (!no.data || !no.data.trim()) return NodeFilter.FILTER_REJECT;
        var pai = no.parentElement;
        if (!pai || pai.closest(IGNORAR)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    while (andador.nextNode()) lista.push(andador.currentNode);
    return lista;
  }

  function criarTermo(palavra, texto) {
    var botao = document.createElement("button");
    botao.type = "button";
    botao.className = "termo-glossario";
    botao.textContent = texto;
    botao.setAttribute("data-termo", palavra.id);
    botao.setAttribute("aria-expanded", "false");
    botao.setAttribute("aria-label", texto + " (palavra do glossário: toque para ver o que é)");
    return botao;
  }

  function marcarTermos(raiz) {
    if (!buscaOk || !raiz || raiz.getAttribute("data-glossario") === "ok") return;
    raiz.setAttribute("data-glossario", "ok");
    var nos = nosDeTexto(raiz);
    var marcadas = 0;
    for (var p = 0; p < PALAVRAS.length && marcadas < MAX_POR_RUNA; p++) {
      var palavra = PALAVRAS[p];
      for (var i = 0; i < nos.length; i++) {
        var no = nos[i];
        palavra.re.lastIndex = 0;
        var achado = palavra.re.exec(no.data);
        if (!achado) continue;
        var meio = no.splitText(achado.index);
        var depois = meio.splitText(achado[0].length);
        meio.parentNode.replaceChild(criarTermo(palavra, achado[0]), meio);
        nos.splice(i + 1, 0, depois); // o resto do texto continua disponível para as outras palavras
        marcadas++;
        break; // só a 1ª vez de cada palavra
      }
    }
  }

  // ---------- Balão com a explicação ----------
  var balao = null;
  var termoAberto = null;

  function fecharBalao(devolverFoco) {
    if (!balao) return;
    var focoDentro = balao.contains(document.activeElement);
    if (balao.parentNode) balao.parentNode.removeChild(balao);
    balao = null;
    if (termoAberto) {
      termoAberto.setAttribute("aria-expanded", "false");
      termoAberto.removeAttribute("aria-controls");
      if (devolverFoco || focoDentro) { try { termoAberto.focus(); } catch (e) {} }
    }
    termoAberto = null;
  }

  function abrirBalao(termo) {
    var palavra = porId[termo.getAttribute("data-termo")];
    if (!palavra) return;
    if (termoAberto === termo) { fecharBalao(true); return; }
    fecharBalao(false);
    var nova = colecionar(palavra.id);
    if (termo.classList.contains("termo-colecao")) termo.classList.add("descoberta");

    balao = document.createElement("span");
    balao.className = "glossario-balao";
    balao.id = "glossario-balao";
    balao.setAttribute("role", "dialog");
    balao.setAttribute("aria-label", "Glossário: " + palavra.nome);
    balao.innerHTML =
      '<strong class="glossario-balao-titulo">📖 ' + palavra.nome + '</strong>' +
      '<span class="glossario-balao-texto">' + palavra.def + '</span>' +
      (nova ? '<span class="glossario-balao-novo">⭐ Nova palavra na sua coleção!</span>' : '') +
      '<button type="button" class="glossario-balao-fechar" aria-label="Fechar a explicação">✕</button>';
    // logo depois da palavra: quem usa leitor de tela ou Tab chega nele na ordem certa
    termo.parentNode.insertBefore(balao, termo.nextSibling);
    termoAberto = termo;
    termo.setAttribute("aria-expanded", "true");
    termo.setAttribute("aria-controls", balao.id);
    posicionar(termo);
  }

  // O balão é "absoluto": fica embaixo da palavra, sem passar das bordas da janela
  function posicionar(termo) {
    var pai = balao.offsetParent || termo.closest(".painel-leitura") || document.body;
    var rp = pai.getBoundingClientRect();
    var rt = termo.getBoundingClientRect();
    var largura = Math.max(160, Math.min(300, pai.clientWidth - 16));
    balao.style.width = largura + "px";
    var esquerda = rt.left - rp.left - pai.clientLeft + pai.scrollLeft + rt.width / 2 - largura / 2;
    esquerda = Math.max(8, Math.min(esquerda, pai.clientWidth - largura - 8));
    balao.style.left = Math.round(esquerda) + "px";
    balao.style.top = Math.round(rt.bottom - rp.top - pai.clientTop + pai.scrollTop + 6) + "px";
  }

  document.addEventListener("click", function (evento) {
    var alvo = evento.target;
    if (!alvo || !alvo.closest) return;
    var termo = alvo.closest(".termo-glossario");
    if (termo) { evento.preventDefault(); abrirBalao(termo); return; }
    if (alvo.closest(".glossario-balao-fechar")) { fecharBalao(true); return; }
    if (balao && !alvo.closest(".glossario-balao")) fecharBalao(false);
  });
  // Esc fecha só o balão (e não a janela da runa inteira)
  window.addEventListener("keydown", function (evento) {
    if (balao && (evento.key === "Escape" || evento.key === "Esc")) {
      evento.preventDefault();
      evento.stopImmediatePropagation();
      fecharBalao(true);
    }
  }, true);
  window.addEventListener("resize", function () { fecharBalao(false); });

  // ---------- Encadeia nas janelas de runa ----------
  function aposAbrirRuna() {
    fecharBalao(false);
    var painel = document.querySelector("#modal-overlay .painel-leitura");
    if (painel) marcarTermos(painel);
  }
  ["abrirModalRuna", "abrirModalRunaNegra"].forEach(function (nome) {
    var original = window[nome];
    if (typeof original !== "function") return;
    window[nome] = function () {
      var resultado = original.apply(this, arguments);
      try { aposAbrirRuna(); } catch (erro) {}
      return resultado;
    };
  });

  // ---------- Coleção no Diário ----------
  function inserirColecaoNoDiario() {
    var painel = document.querySelector("#modal-diario-overlay .painel-leitura");
    if (!painel || painel.querySelector(".glossario-diario")) return;
    var lista = lerColecao();
    var secao = document.createElement("section");
    secao.className = "glossario-diario";
    var chips = PALAVRAS.filter(function (p) { return lista.indexOf(p.id) >= 0; })
      .sort(function (a, b) { return a.nome.localeCompare(b.nome, "pt-BR"); })
      .map(function (p) {
        return '<button type="button" class="termo-glossario termo-colecao" data-termo="' + p.id + '" aria-expanded="false">' + p.nome + '</button>';
      }).join("");
    secao.innerHTML =
      '<h3 class="font-display" style="font-size:0.95rem;">📖 Palavras descobertas (' + lista.length + ' de ' + PALAVRAS.length + ')</h3>' +
      (lista.length
        ? '<p class="glossario-diario-dica">Toque numa palavra para ler a explicação de novo.</p><div class="glossario-diario-lista">' + chips + '</div>'
        : '<p class="glossario-diario-dica">Nas runas, as palavras com sublinhado pontilhado são do Glossário. Toque nelas para começar a sua coleção!</p>');
    // logo depois do "Caderno do Aprendiz" (ou no fim, se não achar)
    var titulos = painel.querySelectorAll("h3");
    var depoisDe = null;
    for (var i = 0; i < titulos.length; i++) {
      if (/Caderno do Aprendiz/.test(titulos[i].textContent)) depoisDe = titulos[i].nextElementSibling;
    }
    if (depoisDe && depoisDe.parentNode === painel) painel.insertBefore(secao, depoisDe.nextSibling);
    else painel.appendChild(secao);
  }
  if (typeof abrirModalDiario === "function") {
    var abrirModalDiarioSemGlossario = abrirModalDiario;
    abrirModalDiario = function () {
      abrirModalDiarioSemGlossario.apply(this, arguments);
      try { inserirColecaoNoDiario(); } catch (erro) {}
    };
  }
})();
