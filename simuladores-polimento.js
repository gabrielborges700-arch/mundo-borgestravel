/**
 * simuladores-polimento.js — Polimento dos 16 painéis de simulação
 *
 * Roda DEPOIS que o simuladores.js monta cada painel e só acrescenta coisas
 * por cima: nomes acessíveis, regiões vivas, classes de legibilidade, o
 * slider da Forja e três visores desenhados (Blocos 1, 3 e 4, mais a
 * balança opcional do Bloco 6). REGRA DE OURO: nenhum controle, faixa
 * (min/max/step/value), número, fórmula ou texto do simulador muda — os
 * desafios das runas mandam a criança LER esses números, e o professor
 * projeta isso na aula. Por isso:
 *   - o simuladores.js NÃO é editado; este arquivo encadeia a função global
 *     criarPainelSimulacao (que o app.js chama pelo nome ao abrir a runa);
 *   - as cores inline do simulador não são reescritas pelo JS: o contraste
 *     vem de classes (.sim-mostrador, .sim-veredito, .sim-texto-ouro) e do
 *     CSS da seção 26 do style.css;
 *   - os visores (svg .sim-visor, aria-hidden) não têm nenhum texto nem
 *     número: só LEEM o que o simulador já escreveu no DOM.
 *
 * Os listeners daqui ficam no painel (fase de bolha) e são registrados
 * depois dos do simulador, que ficam nos próprios controles. Então rodam
 * DEPOIS dos handlers dele e já encontram o DOM atualizado.
 *
 * Carregar logo DEPOIS do simuladores.js (usa SIMULADORES_POR_RUNA e
 * criarPainelSimulacao). Função pública:
 *   polirPainelSimulacao(painel, runaId) — idempotente
 */

// Nome acessível e texto do valor (com unidade) de cada slider, por id.
// O texto acompanha o número que o simulador mostra; nada aqui muda a faixa.
const SIM_POLIR_SLIDERS = {
  "slider-vento": { nome: "Velocidade do vento, em km/h", texto: (v) => `${v} km/h` },
  "slider-forca": { nome: "Força aplicada na viga, em kN", texto: (v) => `${v} kN` },
  "slider-ano": { nome: "Ano na linha do tempo", texto: (v) => `Ano ${v}` },
  "slider-carga": { nome: "Carga no pilar, em toneladas-força", texto: (v) => `${v} tf` },
  "slider-medicao": { nome: "Posição do cursor de medição, em milímetros", texto: (v) => `${v} mm` },
  "slider-rigidez": { nome: "Rigidez do cabo (k)", texto: (v) => `k = ${v}` },
  "slider-extensao": { nome: "Extensão do cabo (x)", texto: (v) => `x = ${v}` },
  "slider-estresse": { nome: "Estresse por ciclo, em MPa", texto: (v) => `${v} MPa` },
  "slider-vao": { nome: "Vão da viga (L), em metros", texto: (v) => `${v} m` },
  "slider-carga-p": { nome: "Carga central (P), em kN", texto: (v) => `${v} kN` },
  "slider-seguranca": { nome: "Pontos de segurança", texto: (v) => `${v} pontos` },
  "slider-estetica": { nome: "Pontos de estética", texto: (v) => `${v} pontos` },
};

// Botões que só mostram símbolo ("L −", "R +"): o leitor de tela ouvia "L menos"
const SIM_POLIR_NOMES_BOTOES = {
  "peso-menos": "Diminuir o peso da esquerda (L)",
  "peso-mais": "Aumentar o peso da esquerda (L)",
  "peso-dir-menos": "Diminuir o peso da direita (R)",
  "peso-dir-mais": "Aumentar o peso da direita (R)",
  "col-menos": "Diminuir a reação da coluna da esquerda (L)",
  "col-mais": "Aumentar a reação da coluna da esquerda (L)",
  "col-dir-menos": "Diminuir a reação da coluna da direita (R)",
  "col-dir-mais": "Aumentar a reação da coluna da direita (R)",
};

// Mensagens de resultado anunciadas pelo leitor de tela quando mudam.
// Leituras contínuas (#leitura-desvio, #valor-*) ficam de fora: o
// aria-valuetext do slider já fala o valor sem inundar o leitor.
const SIM_POLIR_REGIOES_VIVAS = [
  "#resultado-equilibrio", "#status-colapso", "#mensagem-perfeita", "#mensagem-colapso",
  "#mensagem-orcamento", "#mensagem-forjado", "#ponte-veredito", "#mapa-detalhe",
  "#fato-exibido", "#mapa-progresso",
];

// Vereditos com fundo tingido translúcido (ficavam ilegíveis sobre o pergaminho)
const SIM_POLIR_VEREDITOS = [
  "#resultado-equilibrio", "#mensagem-perfeita", "#mensagem-colapso",
  "#mensagem-orcamento", "#mensagem-forjado",
];

// Desenhos que não carregam informação própria (o número está ao lado)
const SIM_POLIR_DECORATIVOS = ["#torre", "#seta-carga", "#viga", "#visual-arco", "#ponte-cena"];

// Fundos das caixas de leitura escritos pelo simulador (mostradores dos
// Blocos 1–5, diagrama do Bloco 5 e o selo de leitura do 0.3)
const SIM_POLIR_FUNDOS_MOSTRADOR = ["rgba(0, 0, 0, 0.4)", "rgba(0, 0, 0, 0.5)"];

// Estado "selecionado" (aria-pressed). Isso LÊ a marcação visual que o
// próprio simulador escreve (texto do botão ou cor de fundo inline), sem
// tocar no estado interno dele: se o simulador pinta, o leitor de tela ouve.
const SIM_POLIR_REGRAS_SELECAO = [
  { seletor: "#botao-reforco", ativo: (b) => b.textContent.includes("Ligados") },
  { seletor: "#botoes-material > button, #icones-selo > button", ativo: (b) => b.style.backgroundColor === "rgb(28, 30, 34)" },
  { seletor: "#botoes-pedras > button", ativo: (b) => b.style.backgroundColor === "rgb(6, 95, 70)" },
  { seletor: "#ponte-paleta button", ativo: (b) => b.textContent.trim().startsWith("◉") },
  { seletor: "#mapa-reinos > button", ativo: (b) => String(b.style.background).includes("ciano") },
];

const SIM_POLIR_SVG_NS = "http://www.w3.org/2000/svg";

// Painéis já polidos (idempotência sem gravar nada no DOM)
const SIM_POLIR_PAINEIS = new WeakSet();

// Contador de execuções do MutationObserver — instrumentação pros testes
// (garante que o observador não entra em laço com as próprias escritas)
let polirExecucoesObservador = 0;

// Mesma escolha de chave do criarPainelSimulacao: id da runa (Bloco 0, E.7)
// ou "bloco" + número. Necessária porque há ids repetidos entre simuladores
// (ex.: #valor-forca existe no 0.9 e no Bloco 3).
function polirChaveSimulador(runaId) {
  const id = String(runaId || "");
  if (typeof SIMULADORES_POR_RUNA !== "undefined" && SIMULADORES_POR_RUNA[id]) return id;
  return "bloco" + id.split(".")[0];
}

// Define um atributo só quando muda (não acorda o observador à toa)
function polirAtributo(elemento, nome, valor) {
  if (elemento && elemento.getAttribute(nome) !== valor) elemento.setAttribute(nome, valor);
}

// Lê um número que o simulador escreveu num elemento (NaN se não houver)
function polirLerNumero(painel, seletor) {
  const el = painel.querySelector(seletor);
  return el ? Number(String(el.textContent).trim()) : NaN;
}

function polirLimitar(valor, minimo, maximo) {
  return Math.min(maximo, Math.max(minimo, valor));
}

// Cria um elemento SVG com atributos
function polirSvg(tag, atributos) {
  const el = document.createElementNS(SIM_POLIR_SVG_NS, tag);
  Object.keys(atributos || {}).forEach((nome) => el.setAttribute(nome, atributos[nome]));
  return el;
}

// Moldura comum dos visores: svg decorativo, sem texto, fora do foco
function polirCriarVisor(classeExtra, viewBox) {
  return polirSvg("svg", { class: "sim-visor " + classeExtra, viewBox, "aria-hidden": "true", focusable: "false" });
}

// Aplica um transform só quando muda (visores)
function polirTransformar(elemento, valor) {
  if (elemento.style.transform !== valor) elemento.style.transform = valor;
}

// =====================================================================
// Sliders: nome acessível, valor falado com unidade e preenchimento
// =====================================================================
function polirSincronizarSliders(painel) {
  painel.querySelectorAll('input[type="range"]').forEach((slider) => {
    const config = SIM_POLIR_SLIDERS[slider.id];
    const valor = Number(slider.value);
    const minimo = Number(slider.min || 0);
    const maximo = Number(slider.max || 100);

    if (config) polirAtributo(slider, "aria-label", config.nome);
    polirAtributo(slider, "aria-valuetext", config ? config.texto(valor) : String(valor));

    // Trilho dourado até o polegar (CSS da seção 26 lê --sim-preenchimento)
    const fracao = maximo > minimo ? (valor - minimo) / (maximo - minimo) : 0;
    const preenchimento = `${Number((polirLimitar(fracao, 0, 1) * 100).toFixed(2))}%`;
    if (slider.style.getPropertyValue("--sim-preenchimento") !== preenchimento) {
      slider.style.setProperty("--sim-preenchimento", preenchimento);
    }
  });
}

// Bloco 2: marca fina do alvo no trilho, sem texto. O alvo é lido do
// próprio parágrafo do painel ("(75 mm)"); se não achar, não desenha.
function polirMarcarAlvo(painel) {
  const slider = painel.querySelector("#slider-medicao");
  const paragrafo = painel.querySelector("p");
  if (!slider || !paragrafo) return;
  const achado = /\((\d+)\s*mm\)/.exec(paragrafo.textContent);
  if (!achado) return;
  const minimo = Number(slider.min || 0);
  const maximo = Number(slider.max || 100);
  if (!(maximo > minimo)) return;
  // Fração 0–1 (a porcentagem ÷ 100): o CSS posiciona a marca no centro
  // exato do polegar com calc(11px + fração × (100% − 22px))
  const fracao = polirLimitar((Number(achado[1]) - minimo) / (maximo - minimo), 0, 1);
  slider.style.setProperty("--sim-alvo", String(Number(fracao.toFixed(4))));
  slider.classList.add("sim-com-alvo");
}

// =====================================================================
// Parte dinâmica (botões recriados pelo simulador): roda no início e a
// cada lote de mutações do painel
// =====================================================================
function polirAplicarDinamico(painel) {
  painel.querySelectorAll("button").forEach((botao) => {
    // Botão sem type dentro de um <form> enviaria o formulário
    if (!botao.hasAttribute("type")) botao.setAttribute("type", "button");
    const nome = SIM_POLIR_NOMES_BOTOES[botao.id];
    if (nome) polirAtributo(botao, "aria-label", nome);
  });
  painel.querySelectorAll("#icones-selo > button").forEach((botao) => {
    polirAtributo(botao, "aria-label", "Estandarte " + botao.textContent.trim());
  });
  painel.querySelectorAll("#mapa-reinos > button").forEach((botao) => {
    if (botao.title) polirAtributo(botao, "aria-label", botao.title);
  });
  SIM_POLIR_REGRAS_SELECAO.forEach((regra) => {
    painel.querySelectorAll(regra.seletor).forEach((botao) => {
      polirAtributo(botao, "aria-pressed", regra.ativo(botao) ? "true" : "false");
    });
  });
}

// =====================================================================
// Parte estática: papéis, regiões vivas, decorativos e legibilidade
// =====================================================================
function polirAplicarEstatico(painel, runaId) {
  painel.classList.add("sim-painel");
  polirAtributo(painel, "role", "group");
  polirAtributo(painel, "aria-label", "Painel de simulação da runa " + runaId);
  // O <h4> "Painel de Simulação Mecânica" fica intocado (o teste acha o painel por ele)

  SIM_POLIR_REGIOES_VIVAS.forEach((seletor) => {
    const el = painel.querySelector(seletor);
    if (!el) return;
    polirAtributo(el, "role", "status");
    polirAtributo(el, "aria-live", "polite");
  });

  SIM_POLIR_DECORATIVOS.forEach((seletor) => {
    polirAtributo(painel.querySelector(seletor), "aria-hidden", "true");
  });
  // Escudo desenhado do selo 0.4 (o ícone e o nome ao lado continuam legíveis)
  const iconeSelo = painel.querySelector("#icone-exibido");
  if (iconeSelo && iconeSelo.parentElement) {
    polirAtributo(iconeSelo.parentElement.querySelector("svg"), "aria-hidden", "true");
  }
  // Só o <svg> do diagrama do Bloco 5: o #valor-momento continua sendo lido
  const linhaMomento = painel.querySelector("#linha-momento");
  if (linhaMomento) polirAtributo(linhaMomento.closest("svg"), "aria-hidden", "true");

  // Mostradores: caixas escuras translúcidas que o simulador pinta inline
  painel.querySelectorAll("div, span").forEach((el) => {
    if (SIM_POLIR_FUNDOS_MOSTRADOR.includes(el.style.backgroundColor)) el.classList.add("sim-mostrador");
  });
  const mapaDetalhe = painel.querySelector("#mapa-detalhe");
  if (mapaDetalhe) mapaDetalhe.classList.add("sim-mostrador");
  // 0.7: caixas de controle com laranja/ciano sobre fundo claro tingido
  ["#peso-menos", "#col-menos"].forEach((seletor) => {
    const botao = painel.querySelector(seletor);
    const caixa = botao && botao.parentElement && botao.parentElement.parentElement;
    if (caixa && caixa !== painel) caixa.classList.add("sim-mostrador");
  });

  // Fileiras de botões que transbordavam o painel em 320px (0.7 e Bloco 4):
  // a classe só deixa a fileira quebrar linha, os botões continuam os mesmos
  ["#peso-menos", "#col-menos", "#botao-ciclo"].forEach((seletor) => {
    const botao = painel.querySelector(seletor);
    if (botao && botao.parentElement && botao.parentElement !== painel) botao.parentElement.classList.add("sim-linha-flexivel");
  });

  SIM_POLIR_VEREDITOS.forEach((seletor) => {
    const el = painel.querySelector(seletor);
    if (el) el.classList.add("sim-veredito");
  });
  const mapaProgresso = painel.querySelector("#mapa-progresso");
  if (mapaProgresso) mapaProgresso.classList.add("sim-texto-ouro");
}

// =====================================================================
// Visores (svg aria-hidden, sem nenhum nó de texto)
// Cada um devolve uma função atualizar() que LÊ o DOM do simulador.
// =====================================================================

// Bloco 3 — Lei de Hooke: mola em zigue-zague presa a uma parede
function polirVisorHooke(painel) {
  const forca = painel.querySelector("#valor-forca");
  const caixa = forca && forca.closest("div");
  if (!caixa) return null;

  const svg = polirCriarVisor("sim-visor-hooke", "0 0 300 64");
  // Parede com hachura
  svg.appendChild(polirSvg("rect", { x: 6, y: 8, width: 10, height: 48, rx: 1, fill: "#8c6239" }));
  [14, 24, 34, 44].forEach((y) => {
    svg.appendChild(polirSvg("line", { x1: 7, y1: y + 6, x2: 15, y2: y - 2, stroke: "#3a2a1a", "stroke-width": 1.5 }));
  });
  // Mola desenhada com 100 unidades de comprimento; o transform estica
  const mola = polirSvg("g", { class: "sim-visor-anima" });
  const zigue = polirSvg("polyline", {
    points: "0,32 6,32 10,21 18,43 26,21 34,43 42,21 50,43 58,21 66,43 74,21 82,43 90,21 94,32 100,32",
    fill: "none", stroke: "#d4af37", "stroke-linejoin": "round", "stroke-linecap": "round",
    "vector-effect": "non-scaling-stroke",
  });
  mola.appendChild(zigue);
  svg.appendChild(mola);
  // Ponta (presilha) e seta de força acompanham o fim da mola
  const ponta = polirSvg("g", { class: "sim-visor-anima" });
  ponta.appendChild(polirSvg("rect", { x: 0, y: 21, width: 12, height: 22, rx: 2, fill: "#a7b0bb", stroke: "#565c63" }));
  const seta = polirSvg("g", { transform: "translate(16 0)" });
  const haste = polirSvg("rect", { class: "sim-visor-anima", x: 0, y: 30, width: 60, height: 4, rx: 1, fill: "#00e5ff" });
  const cabeca = polirSvg("polygon", { class: "sim-visor-anima", points: "0,24 12,32 0,40", fill: "#00e5ff" });
  seta.appendChild(haste);
  seta.appendChild(cabeca);
  ponta.appendChild(seta);
  svg.appendChild(ponta);
  caixa.insertAdjacentElement("afterend", svg);

  return function atualizar() {
    const extensao = polirLerNumero(painel, "#valor-extensao");
    const rigidez = polirLerNumero(painel, "#valor-rigidez");
    const f = polirLerNumero(painel, "#valor-forca");
    if (![extensao, rigidez, f].every(Number.isFinite)) return;
    // Comprimento ∝ extensão (1–15), traço ∝ rigidez (1–10), seta ∝ k·x (máx. 150)
    const comprimento = 30 + ((polirLimitar(extensao, 1, 15) - 1) / 14) * 150;
    const espessura = (1.2 + ((polirLimitar(rigidez, 1, 10) - 1) / 9) * 3.8).toFixed(2);
    const fracaoForca = polirLimitar(f / 150, 0, 1);
    polirTransformar(mola, `translate(16px, 0px) scaleX(${(comprimento / 100).toFixed(3)})`);
    polirAtributo(zigue, "stroke-width", espessura);
    polirTransformar(ponta, `translateX(${(16 + comprimento).toFixed(1)}px)`);
    polirTransformar(haste, `scaleX(${fracaoForca.toFixed(3)})`);
    polirTransformar(cabeca, `translateX(${(60 * fracaoForca).toFixed(1)}px)`);
  };
}

// Bloco 4 — Fadiga: barra-peça com trinca que cresce em ciclos ÷ vida
function polirVisorFadiga(painel) {
  const ciclos = painel.querySelector("#valor-ciclos");
  const caixa = ciclos && ciclos.closest("div");
  if (!caixa) return null;

  const svg = polirCriarVisor("sim-visor-fadiga", "0 0 300 64");
  // Garras da máquina de ensaio
  svg.appendChild(polirSvg("rect", { x: 6, y: 16, width: 16, height: 32, rx: 2, fill: "#565c63" }));
  svg.appendChild(polirSvg("rect", { x: 278, y: 16, width: 16, height: 32, rx: 2, fill: "#565c63" }));
  // Contorno verde de peça íntegra (aparece com "∞")
  svg.appendChild(polirSvg("rect", { class: "sim-visor-anima sim-visor-brilho", x: 19, y: 19, width: 262, height: 26, rx: 3, fill: "none", stroke: "#34d399", "stroke-width": 2 }));
  // Peça em duas metades (a quebra separa as duas)
  const metadeEsq = polirSvg("g", { class: "sim-visor-anima sim-visor-metade-esq" });
  metadeEsq.appendChild(polirSvg("rect", { x: 20, y: 20, width: 130, height: 24, fill: "#94a3b8" }));
  metadeEsq.appendChild(polirSvg("rect", { x: 20, y: 20, width: 130, height: 4, fill: "#cbd5e1" }));
  const metadeDir = polirSvg("g", { class: "sim-visor-anima sim-visor-metade-dir" });
  metadeDir.appendChild(polirSvg("rect", { x: 150, y: 20, width: 130, height: 24, fill: "#94a3b8" }));
  metadeDir.appendChild(polirSvg("rect", { x: 150, y: 20, width: 130, height: 4, fill: "#cbd5e1" }));
  svg.appendChild(metadeEsq);
  svg.appendChild(metadeDir);
  // Trinca: desce do topo da peça; o scaleY revela a proporção
  const trinca = polirSvg("g", { class: "sim-visor-anima sim-visor-trinca" });
  const caminho = "M150 20 L144 25 L154 29 L145 34 L153 38 L147 42 L150 44";
  trinca.appendChild(polirSvg("path", { d: caminho, fill: "none", stroke: "#1c130a", "stroke-width": 4, "stroke-linejoin": "round" }));
  trinca.appendChild(polirSvg("path", { d: caminho, fill: "none", stroke: "#fb923c", "stroke-width": 1.5, "stroke-linejoin": "round" }));
  svg.appendChild(trinca);
  caixa.insertAdjacentElement("afterend", svg);

  return function atualizar() {
    const feitos = polirLerNumero(painel, "#valor-ciclos");
    const limiteEl = painel.querySelector("#valor-limite");
    const colapso = painel.querySelector("#mensagem-colapso");
    if (!limiteEl || !Number.isFinite(feitos)) return;
    const textoLimite = String(limiteEl.textContent).trim();
    const infinito = textoLimite === "∞";
    const vida = Number(textoLimite);
    const partida = !!colapso && colapso.style.display !== "none";
    const fracao = infinito || !(vida > 0) ? 0 : polirLimitar(feitos / vida, 0, 1);
    svg.classList.toggle("sim-visor-integra", infinito);
    svg.classList.toggle("sim-visor-partida", partida);
    polirTransformar(trinca, `scaleY(${fracao.toFixed(3)})`);
  };
}

// Bloco 1 — Materiais: pilar-medidor preenchido em carga ÷ resistência
function polirVisorPilar(painel) {
  const carga = painel.querySelector("#valor-carga");
  const caixa = carga && carga.closest("div");
  if (!caixa) return null;

  const svg = polirCriarVisor("sim-visor-pilar-medidor", "0 0 300 80");
  svg.appendChild(polirSvg("rect", { x: 60, y: 72, width: 180, height: 4, rx: 1, fill: "#3a2a1a" }));
  const pilar = polirSvg("g", { class: "sim-visor-anima sim-visor-pilar" });
  pilar.appendChild(polirSvg("rect", { x: 115, y: 64, width: 70, height: 8, rx: 1, fill: "#565c63" }));
  pilar.appendChild(polirSvg("rect", { x: 127, y: 12, width: 46, height: 52, fill: "#2d3238", stroke: "#8c6239" }));
  const preenche = polirSvg("rect", { class: "sim-visor-anima sim-visor-preenche", x: 129, y: 14, width: 42, height: 48, fill: "#34d399" });
  pilar.appendChild(preenche);
  pilar.appendChild(polirSvg("rect", { x: 115, y: 6, width: 70, height: 6, rx: 1, fill: "#565c63" }));
  // Marcas dos limiares do simulador: 60% (sem margem) e 100% (colapso)
  pilar.appendChild(polirSvg("line", { x1: 175, y1: 33.2, x2: 189, y2: 33.2, stroke: "#fbbf24", "stroke-width": 2 }));
  pilar.appendChild(polirSvg("line", { x1: 175, y1: 14, x2: 189, y2: 14, stroke: "#f87171", "stroke-width": 2 }));
  svg.appendChild(pilar);
  caixa.insertAdjacentElement("afterend", svg);

  return function atualizar() {
    const c = polirLerNumero(painel, "#valor-carga");
    const max = polirLerNumero(painel, "#valor-max");
    if (!Number.isFinite(c) || !(max > 0)) return;
    // Mesmos limiares do simulador: semMargem = carga > 0,6·max; colapso = carga > max
    const colapso = c > max;
    const semMargem = !colapso && c > max * 0.6;
    svg.classList.toggle("sim-visor-colapso", colapso);
    svg.classList.toggle("sim-visor-sem-margem", semMargem);
    polirTransformar(preenche, `scaleY(${polirLimitar(c / max, 0, 1).toFixed(3)})`);
  };
}

// Bloco 6 (opcional) — balança inclinando conforme segurança − estética
function polirVisorBalanca(painel) {
  const mensagem = painel.querySelector("#mensagem-orcamento");
  if (!mensagem) return null;

  const svg = polirCriarVisor("sim-visor-balanca", "0 0 300 76");
  svg.appendChild(polirSvg("rect", { x: 125, y: 68, width: 50, height: 6, rx: 2, fill: "#565c63" }));
  svg.appendChild(polirSvg("rect", { x: 147, y: 18, width: 6, height: 52, fill: "#8c6239" }));
  const braco = polirSvg("g", { class: "sim-visor-anima sim-visor-braco" });
  braco.appendChild(polirSvg("rect", { x: 60, y: 16, width: 180, height: 4, rx: 2, fill: "#d4af37" }));
  // Prato da segurança (esquerda, escudo) e da estética (direita, joia)
  braco.appendChild(polirSvg("line", { x1: 72, y1: 20, x2: 72, y2: 40, stroke: "#8c6239", "stroke-width": 1.5 }));
  braco.appendChild(polirSvg("line", { x1: 228, y1: 20, x2: 228, y2: 40, stroke: "#8c6239", "stroke-width": 1.5 }));
  braco.appendChild(polirSvg("path", { class: "sim-visor-escudo", d: "M60 40 L84 40 C84 52 78 58 72 62 C66 58 60 52 60 40 Z", fill: "#34d399" }));
  braco.appendChild(polirSvg("circle", { cx: 228, cy: 50, r: 10, fill: "#ab47bc", stroke: "#e1bee7", "stroke-width": 1.5 }));
  braco.appendChild(polirSvg("circle", { cx: 150, cy: 18, r: 4, fill: "#fff2c4" }));
  svg.appendChild(braco);
  mensagem.insertAdjacentElement("afterend", svg);

  return function atualizar() {
    const seguranca = polirLerNumero(painel, "#valor-seguranca");
    const estetica = polirLerNumero(painel, "#valor-estetica");
    if (!Number.isFinite(seguranca) || !Number.isFinite(estetica)) return;
    // Lado mais pesado desce (y cresce pra baixo: ângulo negativo baixa a esquerda)
    const angulo = polirLimitar((estetica - seguranca) / 80, -1, 1) * 12;
    polirTransformar(braco, `rotate(${angulo.toFixed(2)}deg)`);
    // Mesmo limiar da mensagem do simulador (segurança < 30 = perigo)
    svg.classList.toggle("sim-visor-perigo", seguranca < 30);
  };
}

const SIM_POLIR_VISORES = {
  bloco1: polirVisorPilar,
  bloco3: polirVisorHooke,
  bloco4: polirVisorFadiga,
  bloco6: polirVisorBalanca,
};

// =====================================================================
// Ponto de entrada
// =====================================================================
function polirPainelSimulacao(painel, runaId) {
  if (!painel || SIM_POLIR_PAINEIS.has(painel)) return painel;
  SIM_POLIR_PAINEIS.add(painel);
  const chave = polirChaveSimulador(runaId);

  polirAplicarEstatico(painel, runaId);
  polirAplicarDinamico(painel);
  polirSincronizarSliders(painel);
  if (chave === "bloco2") polirMarcarAlvo(painel);

  // Visores entram ANTES do observador começar (a inserção não conta)
  const construtorVisor = SIM_POLIR_VISORES[chave];
  const atualizarVisor = construtorVisor ? construtorVisor(painel) : null;
  if (atualizarVisor) atualizarVisor();

  // Depois dos handlers do simulador (que ficam nos controles): re-sincroniza
  // TODOS os sliders, porque no Bloco 6 o simulador muda o outro slider via
  // .value sem disparar evento
  painel.addEventListener("input", () => {
    polirSincronizarSliders(painel);
    if (atualizarVisor) atualizarVisor();
  });
  painel.addEventListener("click", () => {
    if (atualizarVisor) atualizarVisor();
  });

  // Botões recriados pelo simulador (material, pedras, estandartes, paleta
  // da ponte) e cores trocadas inline: recalcula aria-pressed/nomes
  if (typeof MutationObserver === "function") {
    let agendado = false;
    const agendar = typeof queueMicrotask === "function"
      ? queueMicrotask
      : (tarefa) => Promise.resolve().then(tarefa);
    const observador = new MutationObserver((mutacoes) => {
      // Ignora o próprio slider (--sim-preenchimento) e os visores: como as
      // escritas daqui só acontecem quando o valor muda, não há laço
      const relevante = mutacoes.some((m) => {
        const alvo = m.target;
        if (!alvo || alvo.nodeType !== 1) return true;
        if (alvo.matches('input[type="range"]')) return false;
        return !alvo.closest(".sim-visor");
      });
      if (!relevante || agendado) return;
      agendado = true;
      agendar(() => {
        agendado = false;
        polirExecucoesObservador++;
        polirAplicarDinamico(painel);
      });
    });
    observador.observe(painel, { childList: true, subtree: true, attributes: true, attributeFilter: ["style"] });
  }
  return painel;
}

// Encadeia o ponto de entrada global: o app.js chama criarPainelSimulacao
// pelo nome, então reatribuir a função basta. Se o polimento falhar, o
// painel original segue intacto.
if (typeof criarPainelSimulacao === "function") {
  const criarPainelSimulacaoSemPolimento = criarPainelSimulacao;
  criarPainelSimulacao = function (runaId) {
    const painel = criarPainelSimulacaoSemPolimento(runaId);
    if (painel) {
      try { polirPainelSimulacao(painel, runaId); } catch (erro) { /* polimento nunca derruba o simulador */ }
    }
    return painel;
  };
}
