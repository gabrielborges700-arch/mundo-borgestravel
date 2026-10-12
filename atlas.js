/**
 * atlas.js — ATLAS DAS MARAVILHAS
 *
 * O QUE ELE FAZ
 *  - Um mapa-múndi desenhado a tinta (imagens/atlas-mundo.svg) com as obras
 *    reais citadas nas runas. ★ dourada = maravilha; ☠ vermelha = erro famoso
 *    da Ilha Amaldiçoada.
 *  - No Mundo aparecem 3 regiões (Américas, Europa, África e Ásia); tocar
 *    numa região aproxima o mapa. Tocar num ponto mostra a ficha da obra
 *    (onde fica, quando foi feita, uma curiosidade tirada da própria runa)
 *    e o botão "Ler a runa".
 *  - Abre pelo botão "🗺️ Atlas das Maravilhas" do topo e pelo link
 *    "Ver no Atlas" que aparece nas runas que citam alguma dessas obras.
 *  - Embaixo do mapa há a lista de todos os lugares (também serve para quem
 *    navega pelo teclado ou com leitor de tela).
 *
 * DE ONDE VÊM OS DADOS
 *  As frases vêm do texto das runas (já conferido). O contorno dos
 *  continentes é do Natural Earth (domínio público). As posições estão em
 *  latitude/longitude; o mapa é "equiretangular" (longitude vira x,
 *  latitude vira y), por isso a conta para pôr o ponto no lugar é simples.
 *
 * Sem bibliotecas e sem "module": funciona abrindo o index.html direto.
 * Nenhum .js existente é editado (encadeia abrirModalRuna e abrirModalRunaNegra).
 */
(function () {
  "use strict";

  // ---------- As obras ----------
  var OBRAS = {
    muralha: { nome: "Grande Muralha da China", onde: "China", quando: "erguida e refeita por mais de 2 mil anos", tipo: "maravilha", runa: "0.1",
      frase: "Somando os trechos de várias dinastias, ela passa de 21 mil quilômetros: mais da metade da volta da Terra!" },
    piramide: { nome: "Grande Pirâmide de Gizé", onde: "Egito", quando: "por volta de 2560 a.C.", tipo: "maravilha", runa: "0.2",
      frase: "Um diário de papiro do inspetor Merer conta como a equipe dele levava de barco blocos de calcário das pedreiras de Tura até a pirâmide." },
    suez: { nome: "Canal de Suez", onde: "Egito", quando: "inaugurado em 1869", tipo: "maravilha", runa: "6.5",
      frase: "Em 2021, o navio gigante Ever Given ficou atravessado no canal por seis dias, até ser desencalhado com a ajuda da maré da lua cheia." },
    burj: { nome: "Burj Khalifa", onde: "Dubai, Emirados Árabes Unidos", quando: "2010", tipo: "maravilha", runa: "4.2",
      frase: "O prédio mais alto do mundo. Os engenheiros calcularam que o concreto dele encolheria uns 30 centímetros com o tempo." },
    taipei: { nome: "Taipei 101", onde: "Taipé, Taiwan", quando: "2004", tipo: "maravilha", runa: "6.1",
      frase: "Entre os andares 87 e 92 fica pendurada uma esfera de aço de 660 toneladas que corta o balanço da torre em até cerca de 40%." },
    coliseu: { nome: "Coliseu", onde: "Roma, Itália", quando: "inaugurado no ano 80", tipo: "maravilha", runa: "0.6",
      frase: "Feito de pedra, tijolo e concreto romano. Dois historiadores romanos contam que a arena chegou a ser alagada para batalhas de navios!" },
    panteao: { nome: "Panteão", onde: "Roma, Itália", quando: "por volta do ano 125", tipo: "maravilha", runa: "0.6",
      frase: "A cúpula dele ainda é a maior do mundo feita de concreto sem armadura de aço." },
    pontdugard: { nome: "Pont du Gard", onde: "Sul da França", quando: "século I", tipo: "maravilha", runa: "0.8",
      frase: "Uma ponte-aqueduto romana feita de arcos. Em alguns deles, as pedras foram encaixadas sem nenhuma argamassa." },
    notredame: { nome: "Catedral de Notre-Dame", onde: "Paris, França", quando: "obras de 1163 a cerca de 1345", tipo: "maravilha", runa: "0.5",
      frase: "Levou cerca de 180 anos para ficar pronta: gerações inteiras de construtores trabalharam nela." },
    chartres: { nome: "Catedral de Chartres", onde: "Chartres, França", quando: "corpo principal de 1194 a uns 1220", tipo: "maravilha", runa: "0.5",
      frase: "Enquanto outras catedrais levavam séculos, o corpo principal desta subiu em uns 26 anos." },
    eiffel: { nome: "Torre Eiffel", onde: "Paris, França", quando: "1889", tipo: "maravilha", runa: "3.1",
      frase: "Foi montada com 2,5 milhões de rebites de ferro colocados em brasa, que apertaram as peças ao esfriar." },
    sagrada: { nome: "Sagrada Família", onde: "Barcelona, Espanha", quando: "obras começaram em 1882", tipo: "maravilha", runa: "0.9",
      frase: "Gaudí descobria a forma ideal dos arcos com correntes penduradas de ponta-cabeça e levou essas ideias para as colunas inclinadas da basílica." },
    bigben: { nome: "Big Ben (Torre Elizabeth)", onde: "Londres, Inglaterra", quando: "1859", tipo: "maravilha", runa: "6.5",
      frase: "Para cavar uma estação de metrô colada nela, os engenheiros injetaram argamassa no solo aos poucos, para a torre não entortar." },
    brooklyn: { nome: "Ponte do Brooklyn", onde: "Nova York, EUA", quando: "1883", tipo: "maravilha", runa: "6.6",
      frase: "Quando o engenheiro-chefe adoeceu, Emily Roebling virou os olhos, os ouvidos e a voz dele na obra por cerca de 11 anos." },
    goldengate: { nome: "Ponte Golden Gate", onde: "São Francisco, EUA", quando: "1937", tipo: "maravilha", runa: "0.6",
      frase: "Uma das pontes pênseis mais famosas do mundo, feita de aço." },
    cristo: { nome: "Cristo Redentor", onde: "Rio de Janeiro, Brasil", quando: "1931", tipo: "maravilha", runa: "0.6",
      frase: "De concreto armado coberto de pedra-sabão, com braços de 28 metros de ponta a ponta." },
    // Erros famosos (runas negras da Ilha Amaldiçoada)
    millennium: { nome: "Millennium Bridge", onde: "Londres, Inglaterra", quando: "2000", tipo: "erro", runa: "E.4",
      frase: "No dia da inauguração, os passos da multidão entraram no ritmo do balanço e a ponte começou a balançar de lado. Foi fechada dois dias depois." },
    tacoma: { nome: "Ponte de Tacoma Narrows", onde: "Washington, EUA", quando: "1940", tipo: "erro", runa: "E.1",
      frase: "A \"Gertie Galopante\" se torceu num vento de apenas 68 km/h e desabou quatro meses depois de inaugurada." },
    quebec: { nome: "Ponte de Quebec", onde: "Quebec, Canadá", quando: "1907", tipo: "erro", runa: "E.2",
      frase: "Desabou durante a obra: o peso real da estrutura era maior do que o dos cálculos." },
    hyatt: { nome: "Hotel Hyatt Regency", onde: "Kansas City, EUA", quando: "1981", tipo: "erro", runa: "E.3",
      frase: "Uma mudança num detalhe das barras que penduravam as passarelas dobrou a carga numa ligação, e elas caíram durante um baile." },
    pisa: { nome: "Torre de Pisa", onde: "Pisa, Itália", quando: "obras começaram em 1173", tipo: "erro", runa: "E.5",
      frase: "O chão mole e a fundação rasa, de só 3 metros, fizeram a torre começar a inclinar ainda durante a construção." },
    vasa: { nome: "Navio Vasa", onde: "Estocolmo, Suécia", quando: "1628", tipo: "erro", runa: "E.6",
      frase: "Carregado de canhões em duas cobertas e com pouco lastro, virou e afundou na viagem de estreia." }
  };

  // ---------- Os pontos no mapa (obras muito perto uma da outra dividem o ponto) ----------
  var LUGARES = [
    { id: "tacoma", nome: "Tacoma", lat: 47.27, lon: -122.55, regiao: "americas", obras: ["tacoma"] },
    { id: "goldengate", nome: "São Francisco", lat: 37.82, lon: -122.48, regiao: "americas", obras: ["goldengate"] },
    { id: "hyatt", nome: "Kansas City", lat: 39.09, lon: -94.58, regiao: "americas", obras: ["hyatt"] },
    { id: "quebec", nome: "Quebec", lat: 46.75, lon: -71.29, regiao: "americas", obras: ["quebec"] },
    { id: "brooklyn", nome: "Nova York", lat: 40.71, lon: -74.00, regiao: "americas", obras: ["brooklyn"] },
    { id: "cristo", nome: "Rio de Janeiro", lat: -22.95, lon: -43.21, regiao: "americas", obras: ["cristo"] },
    { id: "londres", nome: "Londres", lat: 51.51, lon: -0.11, regiao: "europa", obras: ["bigben", "millennium"] },
    { id: "paris", nome: "Paris e Chartres", lat: 48.70, lon: 2.05, regiao: "europa", obras: ["eiffel", "notredame", "chartres"] },
    { id: "pontdugard", nome: "Pont du Gard", lat: 43.95, lon: 4.54, regiao: "europa", obras: ["pontdugard"] },
    { id: "sagrada", nome: "Barcelona", lat: 41.40, lon: 2.17, regiao: "europa", obras: ["sagrada"] },
    { id: "pisa", nome: "Pisa", lat: 43.72, lon: 10.40, regiao: "europa", obras: ["pisa"] },
    { id: "roma", nome: "Roma", lat: 41.89, lon: 12.49, regiao: "europa", obras: ["coliseu", "panteao"] },
    { id: "vasa", nome: "Estocolmo", lat: 59.33, lon: 18.09, regiao: "europa", obras: ["vasa"] },
    { id: "egito", nome: "Egito", lat: 30.00, lon: 31.80, regiao: "africaAsia", obras: ["piramide", "suez"] },
    { id: "burj", nome: "Dubai", lat: 25.20, lon: 55.27, regiao: "africaAsia", obras: ["burj"] },
    { id: "muralha", nome: "Grande Muralha", lat: 40.43, lon: 116.57, regiao: "africaAsia", obras: ["muralha"] },
    { id: "taipei", nome: "Taipé", lat: 25.03, lon: 121.56, regiao: "africaAsia", obras: ["taipei"] }
  ];

  // ---------- Os recortes do mapa (oeste, leste, norte, sul em graus) ----------
  var VISTAS = {
    mundo: { nome: "🌍 Mundo", oeste: -180, leste: 180, norte: 84, sul: -58 },
    americas: { nome: "🌎 Américas", oeste: -128, leste: -34, norte: 55, sul: -35 },
    // a Europa tem um mapa próprio, mais detalhado (o recorte dele é exatamente este)
    europa: { nome: "🏰 Europa", oeste: -10, leste: 26, norte: 61.5, sul: 35, img: "imagens/atlas-europa.svg" },
    africaAsia: { nome: "🐫 África e Ásia", oeste: 26, leste: 135, norte: 52, sul: 5 }
  };
  var ORDEM_VISTAS = ["mundo", "americas", "europa", "africaAsia"];

  // ---------- Ajudantes ----------
  function runaLida(runa) {
    try {
      if (/^E\./.test(runa)) return typeof runaNegraFoiLida === "function" && runaNegraFoiLida(runa);
      return typeof obterRunasLidas === "function" && obterRunasLidas().indexOf(runa) >= 0;
    } catch (e) { return false; }
  }
  function lugarDaObra(obraId) {
    for (var i = 0; i < LUGARES.length; i++) if (LUGARES[i].obras.indexOf(obraId) >= 0) return LUGARES[i];
    return null;
  }
  function pct(valor) { return (Math.round(valor * 1000) / 1000) + "%"; }

  // ---------- A janela do Atlas ----------
  var quemAbriu = null;

  function fecharAtlas() {
    var overlay = document.getElementById("modal-atlas-overlay");
    if (overlay) overlay.parentNode.removeChild(overlay);
    document.removeEventListener("keydown", fecharComEsc);
    if (quemAbriu && document.contains(quemAbriu)) { try { quemAbriu.focus(); } catch (e) {} }
    quemAbriu = null;
  }
  function fecharComEsc(evento) { if (evento.key === "Escape" || evento.key === "Esc") fecharAtlas(); }

  function abrirAtlas(opcoes) {
    opcoes = opcoes || {};
    if (typeof fecharModalRuna === "function") fecharModalRuna();
    fecharAtlas();
    quemAbriu = document.activeElement;

    var overlay = document.createElement("div");
    overlay.id = "modal-atlas-overlay";
    overlay.style.cssText = "position:fixed; inset:0; z-index:50; background:var(--veu-sepia, rgba(28,17,8,0.86)); display:flex; align-items:center; justify-content:center; padding:1rem;";

    var painel = document.createElement("div");
    painel.className = "painel-leitura atlas-painel";
    painel.setAttribute("role", "dialog");
    painel.setAttribute("aria-modal", "true");
    painel.setAttribute("aria-labelledby", "atlas-titulo");
    painel.style.cssText = "max-width:760px; width:100%; max-height:88vh; overflow-y:auto; padding:2rem; position:relative;";

    var abas = ORDEM_VISTAS.map(function (id) {
      return '<button type="button" class="atlas-aba" data-vista="' + id + '" aria-pressed="false">' + VISTAS[id].nome + '</button>';
    }).join("");

    var totalLidas = Object.keys(OBRAS).filter(function (id) { return runaLida(OBRAS[id].runa); }).length;

    painel.innerHTML =
      '<button id="fechar-modal-atlas" aria-label="Fechar o Atlas" class="btn-gotico" style="position:absolute; top:0.75rem; right:0.75rem; padding:0.3rem 0.7rem; font-size:0.9rem;">✕</button>' +
      '<h2 id="atlas-titulo" class="font-display" tabindex="-1" style="margin-top:0;">🗺️ Atlas das Maravilhas</h2>' +
      '<p class="atlas-intro">As obras de verdade que aparecem nas runas. <span class="atlas-legenda"><span class="atlas-leg-maravilha">★ maravilha</span> <span class="atlas-leg-erro">☠ erro famoso (Ilha)</span></span></p>' +
      '<p class="atlas-contagem">Você já leu as runas de ' + totalLidas + ' de ' + Object.keys(OBRAS).length + ' obras.</p>' +
      '<div class="atlas-abas" role="group" aria-label="Escolha a região do mapa">' + abas + '</div>' +
      '<div class="atlas-mapa-moldura"><div class="atlas-mapa"></div></div>' +
      '<div class="atlas-ficha" aria-live="polite"><p class="atlas-ficha-vazia">Toque numa região e depois num ponto do mapa para ver a obra.</p></div>' +
      '<details class="atlas-todas"><summary>📋 Ver a lista de todos os lugares</summary><div class="atlas-todas-lista"></div></details>';

    overlay.appendChild(painel);
    document.body.appendChild(overlay);

    overlay.addEventListener("click", function (evento) { if (evento.target === overlay) fecharAtlas(); });
    painel.querySelector("#fechar-modal-atlas").addEventListener("click", fecharAtlas);
    document.addEventListener("keydown", fecharComEsc);

    painel.querySelector(".atlas-abas").addEventListener("click", function (evento) {
      var aba = evento.target.closest(".atlas-aba");
      if (aba) mostrarVista(painel, aba.getAttribute("data-vista"));
    });
    montarListaTodos(painel);

    // Abertura pedida por uma runa: mostra as obras dela
    if (opcoes.obras && opcoes.obras.length) {
      var regioes = {};
      opcoes.obras.forEach(function (id) { var l = lugarDaObra(id); if (l) regioes[l.regiao] = true; });
      var lista = Object.keys(regioes);
      mostrarVista(painel, lista.length === 1 ? lista[0] : "mundo");
      mostrarFicha(painel, opcoes.obras);
    } else {
      mostrarVista(painel, "mundo");
    }
    try { painel.querySelector("#atlas-titulo").focus(); } catch (e) {}
  }

  function mostrarVista(painel, vistaId) {
    var vista = VISTAS[vistaId] || VISTAS.mundo;
    var largura = vista.leste - vista.oeste;
    var altura = vista.norte - vista.sul;
    var mapa = painel.querySelector(".atlas-mapa");
    mapa.setAttribute("data-vista", vistaId);
    mapa.style.paddingBottom = pct(altura / largura * 100); // mantém a proporção do recorte
    // A imagem do mundo inteiro (360° × 180°) é esticada e deslocada para mostrar só o recorte
    var html = vista.img
      ? '<img class="atlas-mapa-img" src="' + vista.img + '" alt="" aria-hidden="true" draggable="false" style="width:100%; height:100%; left:0; top:0;">'
      : '<img class="atlas-mapa-img" src="imagens/atlas-mundo.svg" alt="" aria-hidden="true" draggable="false" style="' +
        "width:" + pct(360 / largura * 100) + "; height:" + pct(180 / altura * 100) + "; left:" + pct(-(vista.oeste + 180) / largura * 100) + "; top:" + pct(-(90 - vista.norte) / altura * 100) + ';">';

    if (vistaId === "mundo") {
      ["americas", "europa", "africaAsia"].forEach(function (id) {
        var r = VISTAS[id];
        html += '<button type="button" class="atlas-regiao" data-vista="' + id + '" style="left:' + pct((r.oeste - vista.oeste) / largura * 100) +
          "; top:" + pct((vista.norte - r.norte) / altura * 100) + "; width:" + pct((r.leste - r.oeste) / largura * 100) +
          "; height:" + pct((r.norte - r.sul) / altura * 100) + ';" aria-label="Aproximar: ' + r.nome.replace(/^\S+ /, "") + '"><span>' + r.nome + '</span></button>';
      });
    } else {
      LUGARES.filter(function (l) { return l.regiao === vistaId; }).forEach(function (l) {
        var obras = l.obras.map(function (id) { return OBRAS[id]; });
        var temMaravilha = obras.some(function (o) { return o.tipo === "maravilha"; });
        var temErro = obras.some(function (o) { return o.tipo === "erro"; });
        var todasLidas = obras.every(function (o) { return runaLida(o.runa); });
        var classe = "atlas-ponto " + (temMaravilha ? "atlas-ponto-maravilha" : "atlas-ponto-erro") + (todasLidas ? " lido" : "");
        var rotulo = l.nome + ": " + obras.map(function (o) { return o.nome; }).join(", ") + (temErro ? " (tem erro famoso)" : "") + (todasLidas ? ", já lida" : "");
        html += '<button type="button" class="' + classe + '" data-lugar="' + l.id + '" style="left:' + pct((l.lon - vista.oeste) / largura * 100) +
          "; top:" + pct((vista.norte - l.lat) / altura * 100) + ';" aria-label="' + rotulo + '">' +
          '<span class="atlas-ponto-simbolo" aria-hidden="true">' + (temMaravilha ? "★" : "☠") + '</span>' +
          (l.obras.length > 1 ? '<span class="atlas-ponto-num" aria-hidden="true">' + l.obras.length + '</span>' : "") +
          (temMaravilha && temErro ? '<span class="atlas-ponto-caveira" aria-hidden="true">☠</span>' : "") +
          '<span class="atlas-ponto-nome" aria-hidden="true">' + l.nome + '</span></button>';
      });
    }
    mapa.innerHTML = html;
    // Região nova: a ficha volta a explicar o que fazer (a obra anterior pode nem estar nesta região)
    painel.querySelector(".atlas-ficha").innerHTML = '<p class="atlas-ficha-vazia">' +
      (vistaId === "mundo" ? "Toque numa região e depois num ponto do mapa para ver a obra." : "Toque num ponto do mapa para ver a obra.") + "</p>";

    var abas = painel.querySelectorAll(".atlas-aba");
    for (var i = 0; i < abas.length; i++) abas[i].setAttribute("aria-pressed", abas[i].getAttribute("data-vista") === vistaId ? "true" : "false");

    mapa.onclick = function (evento) {
      var regiao = evento.target.closest(".atlas-regiao");
      if (regiao) { mostrarVista(painel, regiao.getAttribute("data-vista")); return; }
      var ponto = evento.target.closest(".atlas-ponto");
      if (ponto) {
        var lugar = LUGARES.filter(function (l) { return l.id === ponto.getAttribute("data-lugar"); })[0];
        if (lugar) mostrarFicha(painel, lugar.obras, ponto);
      }
    };
  }

  function mostrarFicha(painel, obraIds, pontoAtivo) {
    var ficha = painel.querySelector(".atlas-ficha");
    var pontos = painel.querySelectorAll(".atlas-ponto");
    for (var i = 0; i < pontos.length; i++) pontos[i].classList.toggle("ativo", pontos[i] === pontoAtivo);
    ficha.innerHTML = obraIds.map(function (id) {
      var o = OBRAS[id];
      if (!o) return "";
      var lida = runaLida(o.runa);
      var erro = o.tipo === "erro";
      return '<article class="atlas-obra ' + (erro ? "atlas-obra-erro" : "atlas-obra-maravilha") + '">' +
        '<h3 class="font-display">' + (erro ? "☠ " : "★ ") + o.nome + '</h3>' +
        '<p class="atlas-obra-onde">' + o.onde + ' · ' + o.quando + '</p>' +
        '<p class="atlas-obra-frase">' + o.frase + '</p>' +
        '<button type="button" class="btn-gotico atlas-ler" data-runa="' + o.runa + '">' + (erro ? "☠ Ler a runa negra " : "📜 Ler a runa ") + o.runa + '</button>' +
        (lida ? ' <span class="atlas-obra-lida">✓ você já leu</span>' : "") +
        '</article>';
    }).join("");
    ficha.onclick = function (evento) {
      var botao = evento.target.closest(".atlas-ler");
      if (!botao) return;
      var runa = botao.getAttribute("data-runa");
      fecharAtlas();
      if (/^E\./.test(runa)) { if (typeof abrirModalRunaNegra === "function") abrirModalRunaNegra(runa); }
      else if (typeof abrirModalRuna === "function") abrirModalRuna(runa);
    };
  }

  function montarListaTodos(painel) {
    var html = "";
    ["americas", "europa", "africaAsia"].forEach(function (regiao) {
      html += '<h3 class="font-display">' + VISTAS[regiao].nome + '</h3><ul>';
      LUGARES.filter(function (l) { return l.regiao === regiao; }).forEach(function (l) {
        l.obras.forEach(function (id) {
          var o = OBRAS[id];
          html += '<li><button type="button" class="atlas-item" data-obra="' + id + '">' + (o.tipo === "erro" ? "☠ " : "★ ") + o.nome + ' <span>(' + o.onde + ')</span></button></li>';
        });
      });
      html += "</ul>";
    });
    var lista = painel.querySelector(".atlas-todas-lista");
    lista.innerHTML = html;
    lista.addEventListener("click", function (evento) {
      var item = evento.target.closest(".atlas-item");
      if (!item) return;
      var id = item.getAttribute("data-obra");
      var lugar = lugarDaObra(id);
      if (lugar) mostrarVista(painel, lugar.regiao);
      var ponto = lugar ? painel.querySelector('.atlas-ponto[data-lugar="' + lugar.id + '"]') : null;
      mostrarFicha(painel, [id], ponto);
      var ficha = painel.querySelector(".atlas-ficha");
      if (ficha.scrollIntoView) { try { ficha.scrollIntoView({ block: "nearest" }); } catch (e) {} }
    });
  }

  window.abrirAtlas = abrirAtlas;

  // ---------- Botão no topo, ao lado da Crônica ----------
  function criarBotaoTopo() {
    var cronica = document.getElementById("botao-cronica-hero");
    if (!cronica || document.getElementById("botao-atlas-hero")) return;
    var botao = document.createElement("button");
    botao.type = "button";
    botao.id = "botao-atlas-hero";
    botao.className = "btn-gotico hero-botao-cronica";
    botao.setAttribute("aria-label", "Abrir o Atlas das Maravilhas: o mapa das obras de verdade citadas nas runas");
    botao.title = "Ver no mapa as obras de verdade citadas nas runas";
    botao.textContent = "🗺️ Atlas das Maravilhas";
    botao.addEventListener("click", function () { abrirAtlas(); });
    cronica.parentNode.insertBefore(botao, cronica.nextSibling);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", criarBotaoTopo);
  else criarBotaoTopo();

  // ---------- "Ver no Atlas" dentro das runas que citam alguma obra ----------
  function aposAbrirRuna(runaId) {
    var obras = Object.keys(OBRAS).filter(function (id) { return OBRAS[id].runa === runaId; });
    var painel = document.querySelector("#modal-overlay .painel-leitura");
    if (!obras.length || !painel || painel.querySelector(".atlas-ver-no-mapa")) return;
    var caixa = document.createElement("p");
    caixa.className = "atlas-ver-no-mapa";
    var nomes = obras.map(function (id) { return OBRAS[id].nome; });
    caixa.innerHTML = '<button type="button" class="btn-gotico">🗺️ Ver no Atlas: ' + (nomes.length > 2 ? nomes.slice(0, 2).join(", ") + " e mais" : nomes.join(" e ")) + '</button>';
    caixa.querySelector("button").addEventListener("click", function () { abrirAtlas({ obras: obras }); });
    // antes do Caderno do Aprendiz (o 2º divisor), ou no fim
    var divisores = painel.querySelectorAll(".divisor-rune");
    if (divisores.length > 1) painel.insertBefore(caixa, divisores[1]);
    else painel.appendChild(caixa);
  }
  ["abrirModalRuna", "abrirModalRunaNegra"].forEach(function (nome) {
    var original = window[nome];
    if (typeof original !== "function") return;
    window[nome] = function (runaId) {
      var resultado = original.apply(this, arguments);
      try { aposAbrirRuna(runaId); } catch (erro) {}
      return resultado;
    };
  });
})();
