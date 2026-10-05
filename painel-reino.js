/**
 * painel-reino.js — Anéis de progresso por reino e Painel do Reino com Coroas
 *
 * Duas peças, só visuais, com números REAIS do save (nada fixo no código):
 * A) Anel pequeno no cabeçalho de cada reino do acordeão (celular/tablet),
 *    na cor do reino: "3/6" de relance, que antes só o mapa desktop mostrava.
 * B) Painel do Reino dentro do Diário (📖): três anéis grandes (runas lidas,
 *    simuladores testados, desafios resolvidos) e a faixa das 7 Coroas dos
 *    Julgamentos — acende com o Julgamento, crava o rubi com o Supremo.
 * Não tranca nada nem cria seção nova na página: é leitura do progresso.
 *
 * Origem: AnelProgresso, Coroa e FaixaConquistas do protótipo BORGESTR-VEL
 * (React) e o Painel do Reino do Base44, que só tinham números de exemplo.
 * Ficaram de fora de propósito: CardTempo (dado inventado), AguiaDecorativa
 * (flutuação infinita) e GaleriaReinos (reinos "EM BREVE" trancados).
 *
 * Carregar DEPOIS do jogo.js (e do cadeados.js, se existir): encadeia
 * aposRenderizarBlocos e abrirModalDiario (ver o fim do arquivo). Depende de
 * reinosDados, dadosEspecificosCards, ilhaAmaldicoada (dados.js),
 * obterRunasLidas (navegacao.js), modoMapaDesktop, calcularProgressoBloco,
 * calcularProgressoIlha (app.js) e obterEstadoJogo (jogo.js) — todos
 * consultados com typeof.
 */

const ANEL_SVG_NS = "http://www.w3.org/2000/svg";

// Anel do cabeçalho: viewBox 36, raio 15, traço 3,5 (o CSS fixa 34px; 28px em 320–374px)
const ANEL_REINO_RAIO = 15;
const ANEL_REINO_TRACO = 3.5;
// Cor do arco no cabeçalho fica no CSS (seção 28): var(--cor-reino), que o app.js
// já põe no painel; a Ilha não tem essa variável e usa o rubro #c93030 (o mesmo
// do .painel-ilha .anel-reino; o título da Ilha agora é o clareado #df8383).

// Anéis grandes do Diário: viewBox 80, raio 32, traço 7 (72px na tela)
const ANEL_GRANDE_RAIO = 32;
const ANEL_GRANDE_TRACO = 7;

// Cores pensadas pro FUNDO CLARO do Diário (pergaminho): ciano ou ouro ali
// dariam 1,3–1,7:1. Todas ficam ≥ 3:1 (arco) contra o papel; o texto #3e3222, ≥ 4,5:1.
const ANEL_CORES_DIARIO = {
  runas: "#1c3b8c",       // --lapis
  simuladores: "#3a6b5a", // --verdigris
  desafios: "#8c6239",    // --bronze-envelhecido
};

// Coroas (Coroa do BORGESTR-VEL, viewBox 0 0 60 50): apagada, dourada e com rubi
const ANEL_COROA_CONTORNO = "#3e3222";
const ANEL_COROA_APAGADA = "#8a8577";
const ANEL_COROA_OURO = "#d4af37";
const ANEL_COROA_FAIXA = "#c9975b";
const ANEL_COROA_PEROLA = "#f2ead3";
const ANEL_COROA_ENGASTE = "#8c6239"; // engaste vazio, esperando o rubi do Supremo
const ANEL_COROA_RUBI = "#a02020";

// ---------- Desenho do anel (origem: AnelProgresso do BORGESTR-VEL) ----------

// Cria um <svg> com trilho + preenchimento girado -90° (começa às 12h) e o
// texto central. Devolve as peças que mudam, pra atualizar sem redesenhar.
function anelReinoCriarSVG(tamanhoViewBox, raio, traco, classe) {
  const centro = tamanhoViewBox / 2;
  const svg = document.createElementNS(ANEL_SVG_NS, "svg");
  svg.setAttribute("viewBox", `0 0 ${tamanhoViewBox} ${tamanhoViewBox}`);
  svg.setAttribute("class", classe);
  svg.setAttribute("aria-hidden", "true"); // quem fala é o role="img" do invólucro
  svg.setAttribute("focusable", "false");

  const trilho = document.createElementNS(ANEL_SVG_NS, "circle");
  trilho.setAttribute("class", "trilho");
  trilho.setAttribute("cx", centro);
  trilho.setAttribute("cy", centro);
  trilho.setAttribute("r", raio);
  trilho.setAttribute("stroke-width", traco);

  const circunferencia = 2 * Math.PI * raio;
  const preenchimento = document.createElementNS(ANEL_SVG_NS, "circle");
  preenchimento.setAttribute("class", "preenchimento");
  preenchimento.setAttribute("cx", centro);
  preenchimento.setAttribute("cy", centro);
  preenchimento.setAttribute("r", raio);
  preenchimento.setAttribute("stroke-width", traco);
  preenchimento.setAttribute("transform", `rotate(-90 ${centro} ${centro})`);
  preenchimento.style.strokeDasharray = `${circunferencia} ${circunferencia}`;
  preenchimento.style.strokeDashoffset = `${circunferencia}`;

  // dy .35em centraliza na vertical sem depender de dominant-baseline
  const texto = document.createElementNS(ANEL_SVG_NS, "text");
  texto.setAttribute("class", "anel-texto");
  texto.setAttribute("x", centro);
  texto.setAttribute("y", centro);
  texto.setAttribute("dy", "0.35em");
  texto.setAttribute("text-anchor", "middle");

  svg.appendChild(trilho);
  svg.appendChild(preenchimento);
  svg.appendChild(texto);
  return { svg, preenchimento, texto, circunferencia };
}

// Quanto do traço fica escondido pra mostrar a fração (0 = cheio).
// Com 0 o arco some de vez: o cabo redondo deixaria um pontinho às 12h.
function anelReinoAplicarFracao(preenchimento, circunferencia, fracao) {
  const f = Math.max(0, Math.min(1, fracao || 0));
  preenchimento.style.strokeDashoffset = `${circunferencia * (1 - f)}`;
  preenchimento.style.strokeOpacity = f > 0 ? "" : "0";
}

// ---------- Parte A: anel no cabeçalho do acordeão ----------

// Rótulo do anel (leitor de tela e dica do mouse)
function anelReinoRotulo(lidas, total, ehIlha) {
  const base = ehIlha
    ? `${lidas} de ${total} runas negras exploradas`
    : `${lidas} de ${total} runas lidas`;
  return total > 0 && lidas >= total ? `${base}: reino completo` : base;
}

// Põe (ou só atualiza) o anel no .cabecalho-bloco de um painel do acordeão.
// Idempotente: se o anel já existe, mexe só no dashoffset, no texto e na aria.
function anelReinoDesenharNoPainel(painel) {
  const cabecalho = painel.querySelector(":scope > .cabecalho-bloco");
  if (!cabecalho) return;

  const ehIlha = typeof ilhaAmaldicoada !== "undefined" && painel.dataset.blocoId === ilhaAmaldicoada.id;
  let progresso = null;
  if (ehIlha) {
    if (typeof calcularProgressoIlha === "function") progresso = calcularProgressoIlha();
  } else {
    const bloco = reinosDados.find((b) => b.id === painel.dataset.blocoId);
    if (bloco && typeof calcularProgressoBloco === "function") progresso = calcularProgressoBloco(bloco);
  }
  if (!progresso) return;

  const { lidas, total } = progresso;
  const completo = total > 0 && lidas >= total;
  const rotulo = anelReinoRotulo(lidas, total, ehIlha);

  let anel = cabecalho.querySelector(".anel-reino");
  if (!anel) {
    anel = document.createElement("span");
    anel.className = "anel-reino";
    anel.setAttribute("role", "img");
    anel.appendChild(anelReinoCriarSVG(36, ANEL_REINO_RAIO, ANEL_REINO_TRACO, "anel-reino-svg").svg);
    // Antes do último filho (o ▾), pra seta continuar colada na borda direita
    cabecalho.insertBefore(anel, cabecalho.lastElementChild);
  }

  const preenchimento = anel.querySelector(".preenchimento");
  const texto = anel.querySelector(".anel-texto");
  const circunferencia = 2 * Math.PI * ANEL_REINO_RAIO;
  anelReinoAplicarFracao(preenchimento, circunferencia, total > 0 ? lidas / total : 0);
  texto.textContent = completo ? "✓" : `${lidas}/${total}`;
  anel.classList.toggle("anel-reino-completo", completo);
  anel.setAttribute("aria-label", rotulo);
  anel.setAttribute("title", rotulo);
}

// Chamado (pelo encadeamento) no fim de todo renderizarListaBlocos — inclusive
// a cada runa lida — e direto depois de vencer um Julgamento, sem re-render.
// Sem animação aqui de propósito: o cabeçalho é redesenhado a cada leitura e o
// arco "encheria do zero" toda vez, piscando.
// No Mapa do Reino (desktop) NÃO entra anel: os tiles já mostram o .tile-estado
// com "◐ 3/6", e um segundo contador no mesmo tile seria repetição.
function desenharAneisDosReinos() {
  const lista = document.getElementById("lista-blocos");
  if (!lista || typeof reinosDados === "undefined") return;

  if (typeof modoMapaDesktop === "function" && modoMapaDesktop()) {
    lista.querySelectorAll(".anel-reino").forEach((sobra) => sobra.remove());
    return;
  }

  lista.querySelectorAll("[data-bloco-id]").forEach((painel) => anelReinoDesenharNoPainel(painel));
}

// ---------- Parte B: Painel do Reino no Diário ----------

// Os três números do painel, sempre calculados a partir dos dados
function painelDoReinoContar() {
  const idsRunas = Object.keys(dadosEspecificosCards);
  const ehRuna = (id) => Object.prototype.hasOwnProperty.call(dadosEspecificosCards, id);
  const estado = obterEstadoJogo();
  const lidas = typeof obterRunasLidas === "function" ? obterRunasLidas() : [];

  // Conjuntos (sem repetição) e só com ids das runas: a E.7 da Ilha, que
  // também é simulador, fica fora — igual ao contador das 45 runas.
  const unicos = (lista) => [...new Set((lista || []).filter(ehRuna))];
  const comDesafio = idsRunas.filter((id) => dadosEspecificosCards[id].desafio);
  const desafios = unicos(estado.desafiosResolvidos).filter((id) => dadosEspecificosCards[id].desafio);

  return {
    estado,
    aneis: [
      { chave: "runas", rotulo: "Runas lidas", feito: unicos(lidas).length, total: idsRunas.length },
      // Toda runa tem simulador (SIMULADORES_POR_RUNA/POR_BLOCO), então o total é o das runas
      { chave: "simuladores", rotulo: "Simuladores testados", feito: unicos(estado.simuladoresComXP).length, total: idsRunas.length },
      { chave: "desafios", rotulo: "Desafios resolvidos", feito: desafios.length, total: comDesafio.length },
    ],
  };
}

// Um anel grande (72px) com o rótulo embaixo. Começa vazio; quem enche é o
// painelDoReinoAnimar, no quadro seguinte.
function painelDoReinoCriarAnel(dado) {
  const caixa = document.createElement("div");
  caixa.className = `anel-progresso-grande anel-${dado.chave}`;
  caixa.setAttribute("role", "img");
  const rotulo = `${dado.rotulo}: ${dado.feito} de ${dado.total}`;
  caixa.setAttribute("aria-label", rotulo);
  caixa.setAttribute("title", rotulo);

  const pecas = anelReinoCriarSVG(80, ANEL_GRANDE_RAIO, ANEL_GRANDE_TRACO, "anel-grande-svg");
  pecas.preenchimento.style.stroke = ANEL_CORES_DIARIO[dado.chave];
  pecas.texto.textContent = `${dado.feito}/${dado.total}`;
  // Guarda o alvo; com 0 o arco já nasce escondido (sem o pontinho do cabo redondo)
  pecas.preenchimento.dataset.fracao = String(dado.total > 0 ? dado.feito / dado.total : 0);
  if (!(dado.feito > 0)) pecas.preenchimento.style.strokeOpacity = "0";

  const legenda = document.createElement("span");
  legenda.className = "anel-rotulo font-display";
  legenda.textContent = dado.rotulo;

  caixa.appendChild(pecas.svg);
  caixa.appendChild(legenda);
  return caixa;
}

// Nome curto do reino pra coroa: "⚙️ Bloco 3 — Reino NEXUS (Tendões)" → "Bloco 3 — Reino NEXUS"
function painelDoReinoNomeCurto(bloco) {
  const semEmoji = bloco.title.slice(Math.max(0, bloco.title.indexOf("Bloco")));
  return semEmoji.replace(/\s*\([^)]*\)\s*$/, "").trim();
}

// Coroa portada do BORGESTR-VEL: corpo de 3 pontas, faixa e 3 gemas.
// A gema do meio é o engaste: vazio no Julgamento, rubi no Supremo.
function painelDoReinoCriarCoroa(bloco, julgamento, supremo) {
  const estadoCoroa = supremo ? "coroa-rubi" : julgamento ? "coroa-dourada" : "coroa-apagada";
  const acesa = julgamento || supremo;
  const nome = painelDoReinoNomeCurto(bloco);
  const situacao = supremo
    ? "Julgamento e Supremo vencidos"
    : julgamento
      ? "Julgamento vencido, Supremo ainda não"
      : "Julgamento ainda não vencido";

  const coroa = document.createElement("div");
  coroa.className = `coroa-julgamento ${estadoCoroa}`;
  coroa.setAttribute("role", "img");
  coroa.setAttribute("aria-label", `${nome}: ${situacao}`);
  coroa.setAttribute("title", `${nome}: ${situacao}`);
  coroa.dataset.coroaBloco = bloco.id;

  const svg = document.createElementNS(ANEL_SVG_NS, "svg");
  svg.setAttribute("viewBox", "0 0 60 50");
  svg.setAttribute("class", "coroa-svg");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");

  const forma = (tag, atributos) => {
    const el = document.createElementNS(ANEL_SVG_NS, tag);
    Object.keys(atributos).forEach((k) => el.setAttribute(k, atributos[k]));
    svg.appendChild(el);
    return el;
  };
  const corCorpo = acesa ? ANEL_COROA_OURO : ANEL_COROA_APAGADA;
  forma("path", {
    d: "M8,40 L8,22 L18,32 L30,12 L42,32 L52,22 L52,40 Z",
    fill: corCorpo, stroke: ANEL_COROA_CONTORNO, "stroke-width": "1.5", "stroke-linejoin": "round",
  });
  forma("rect", {
    x: "8", y: "40", width: "44", height: "7", rx: "2",
    fill: acesa ? ANEL_COROA_FAIXA : ANEL_COROA_APAGADA, stroke: ANEL_COROA_CONTORNO, "stroke-width": "1.5",
  });
  forma("circle", { cx: "18", cy: "30", r: "2.6", fill: acesa ? ANEL_COROA_PEROLA : ANEL_COROA_CONTORNO });
  forma("circle", { cx: "42", cy: "30", r: "2.6", fill: acesa ? ANEL_COROA_PEROLA : ANEL_COROA_CONTORNO });
  // Halo fixo atrás do rubi (o "brilho" é estático: nada de animação contínua)
  if (supremo) forma("circle", { class: "coroa-halo-rubi", cx: "30", cy: "17", r: "6.5", fill: "rgba(255,96,96,0.45)" });
  forma("circle", {
    class: "coroa-gema-central", cx: "30", cy: "17", r: supremo ? "3.6" : "3.2",
    fill: supremo ? ANEL_COROA_RUBI : acesa ? ANEL_COROA_ENGASTE : ANEL_COROA_CONTORNO,
    stroke: ANEL_COROA_CONTORNO, "stroke-width": "1",
  });
  // Reflexo no rubi
  if (supremo) forma("circle", { cx: "28.8", cy: "15.8", r: "1.1", fill: "#ffd9d9" });

  const numero = document.createElement("span");
  numero.className = "coroa-numero font-display";
  numero.setAttribute("aria-hidden", "true");
  numero.textContent = String(bloco.num);

  coroa.appendChild(svg);
  coroa.appendChild(numero);
  return coroa;
}

// Monta a <section> inteira (anéis + coroas + legenda)
function painelDoReinoCriar() {
  const { estado, aneis } = painelDoReinoContar();
  const missoes = estado.missoesCompletas || [];
  const supremos = estado.missoesBossCompletas || [];

  const secao = document.createElement("section");
  secao.className = "painel-do-reino";
  secao.setAttribute("aria-label", "Painel do Reino");

  const titulo = document.createElement("h3");
  titulo.className = "font-display painel-do-reino-titulo";
  titulo.textContent = "🏰 Painel do Reino";
  secao.appendChild(titulo);

  const linhaAneis = document.createElement("div");
  linhaAneis.className = "painel-do-reino-aneis";
  aneis.forEach((dado) => linhaAneis.appendChild(painelDoReinoCriarAnel(dado)));
  secao.appendChild(linhaAneis);

  const faixa = document.createElement("div");
  faixa.className = "faixa-coroas";
  reinosDados.forEach((bloco) => {
    faixa.appendChild(painelDoReinoCriarCoroa(bloco, missoes.includes(bloco.id), supremos.includes(bloco.id)));
  });
  secao.appendChild(faixa);

  const legenda = document.createElement("p");
  legenda.className = "faixa-coroas-legenda";
  legenda.textContent = "Cada Julgamento vencido acende uma coroa; o Supremo crava o rubi.";
  secao.appendChild(legenda);

  return secao;
}

// Enche os anéis: o dashoffset parte da circunferência (vazio) e vai ao valor
// no quadro seguinte, com a transition de 1,2s do CSS. Com movimento reduzido,
// a regra global da seção 3 do style.css zera a duração e o anel já aparece cheio.
function painelDoReinoAnimar(secao) {
  const arcos = [...secao.querySelectorAll(".anel-progresso-grande .preenchimento")];
  const circunferencia = 2 * Math.PI * ANEL_GRANDE_RAIO;
  const encher = () => arcos.forEach((arco) => {
    anelReinoAplicarFracao(arco, circunferencia, parseFloat(arco.dataset.fracao));
  });
  if (typeof requestAnimationFrame !== "function") { encher(); return; }
  // Lê o estilo uma vez pra o navegador registrar o "vazio" antes da troca
  if (arcos[0] && typeof getComputedStyle === "function") getComputedStyle(arcos[0]).strokeDashoffset;
  requestAnimationFrame(encher);
}

// Encaixa o painel logo depois do PRIMEIRO .divisor-rune do Diário; o resto fica igual
function inserirPainelDoReinoNoDiario() {
  const overlay = document.getElementById("modal-diario-overlay");
  if (!overlay || typeof reinosDados === "undefined" || typeof dadosEspecificosCards === "undefined"
    || typeof obterEstadoJogo !== "function") return;
  const painel = overlay.querySelector(".painel-leitura");
  if (!painel) return;

  const antigo = painel.querySelector(".painel-do-reino");
  if (antigo) antigo.remove(); // o Diário fecha antes de reabrir, mas por garantia

  const divisor = painel.querySelector(".divisor-rune");
  const secao = painelDoReinoCriar();
  if (divisor) divisor.insertAdjacentElement("afterend", secao);
  else painel.appendChild(secao);
  painelDoReinoAnimar(secao);
}

// ---------- Encadeamento com app.js/jogo.js (sem editar nenhum dos dois) ----------

// aposRenderizarBlocos: o app.js chama (com typeof) no fim de todo
// renderizarListaBlocos e o jogo.js chama direto depois de vencer um
// Julgamento — as duas procuram o nome global na hora, então caem aqui.
// A anterior (jogo.js, ou o invólucro do cadeados.js) roda primeiro, uma vez;
// um erro nosso nunca derruba o jogo.
if (typeof aposRenderizarBlocos === "function") {
  const aposRenderizarBlocosSemAneis = aposRenderizarBlocos;
  aposRenderizarBlocos = function () {
    aposRenderizarBlocosSemAneis.apply(this, arguments);
    try { desenharAneisDosReinos(); } catch (erro) {}
  };
}

// abrirModalDiario: o jogo.js liga o botão 📖 com
// addEventListener("click", abrirModalDiario) DENTRO do DOMContentLoaded, que
// roda depois deste arquivo — então o botão já pega esta versão encadeada.
if (typeof abrirModalDiario === "function") {
  const abrirModalDiarioSemPainel = abrirModalDiario;
  abrirModalDiario = function () {
    abrirModalDiarioSemPainel.apply(this, arguments);
    try { inserirPainelDoReinoNoDiario(); } catch (erro) {}
  };
}
