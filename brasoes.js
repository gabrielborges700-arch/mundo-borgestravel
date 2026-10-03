/**
 * brasoes.js — Brasões heráldicos desenhados dos 7 reinos + Ilha Amaldiçoada
 *
 * Desenha em SVG o escudo de cada reino a partir de brasoesPorBloco (dados.js):
 * campo (degradê campo → campoEscuro), borda metálica, chefe escurecido e a
 * figura (carga) do reino. Origem do desenho: componente <Brasao /> do Lovable,
 * redesenhado com traços mais grossos pra continuar legível em 36–46px.
 *
 * Carregar DEPOIS do dados.js e ANTES do app.js. Funções públicas:
 *   criarBrasaoSVG(blocoId, tamanho, opcoes) → elemento <svg>
 *   brasaoHTML(blocoId, tamanho, opcoes)     → o mesmo <svg> como texto (pros templates do app.js)
 *   medalhaoBrasaoHTML(blocoId, tamanho)     → brasão + gema com o número, no lugar do .tile-numero
 *   lemaReinoHTML(blocoId)                   → legenda discreta com o lema em latim e a tradução
 * blocoId aceita "bloco0".."bloco6", 0..6, "0".."6" ou "ilha".
 */

const SVG_NS_BRASAO = "http://www.w3.org/2000/svg";

// Cor clara das figuras (marfim) — contrasta com todos os campos escuros
const COR_FIGURA_BRASAO = "#fff5cc";

// Contador pros ids dos degradês: o mesmo reino aparece no tile E no painel
// aberto, e id repetido no documento faz um degradê "roubar" o do outro.
let contadorBrasoes = 0;

// Tradução dos lemas pra criançada (o latim fica, a tradução vai junto na legenda)
const TRADUCAO_LEMAS_BRASAO = {
  "INITIUM SAPIENTIAE": "o início da sabedoria",
  "FUNDAMENTUM FIRMUM": "fundação firme",
  "MENSURA ET VIS": "medida e força",
  "VINCULA OCCULTA": "vínculos ocultos",
  "FORTITUDO MATERIAE": "a força da matéria",
  "RATIO REGIT": "a razão governa",
  "UNITAS AETERNA": "união eterna",
  "ERRANDO DISCITUR": "errando se aprende"
};

// Brasão da Ilha Amaldiçoada — não existe em brasoesPorBloco, então mora aqui.
// Campo rubro-sangue (#7a1414, a cor da ilha) afundando no quase-preto.
const BRASAO_ILHA = {
  campo: "#7a1414",
  campoEscuro: "#240505",
  borda: "#c93030",
  carga: "ponte-partida",
  lema: "ERRANDO DISCITUR"
};

// ---------- Dados ----------

// Converte qualquer forma de id ("bloco3", 3, "3", "ilha") na chave do brasão
function chaveBrasao(blocoId) {
  if (blocoId === "ilha" || (typeof ilhaAmaldicoada !== "undefined" && blocoId === ilhaAmaldicoada.id)) {
    return "ilha";
  }
  const numero = String(blocoId).replace("bloco", "");
  return /^[0-6]$/.test(numero) ? numero : null;
}

function obterDadosBrasao(blocoId) {
  const chave = chaveBrasao(blocoId);
  if (chave === "ilha") return BRASAO_ILHA;
  if (chave === null || typeof brasoesPorBloco === "undefined") return null;
  return brasoesPorBloco[chave] || null;
}

// Nome do reino sem o emoji do começo (pro <title> do SVG)
function nomeReinoBrasao(blocoId) {
  let titulo = "";
  if (chaveBrasao(blocoId) === "ilha") {
    titulo = typeof ilhaAmaldicoada !== "undefined" ? ilhaAmaldicoada.title : "Ilha Amaldiçoada";
  } else if (typeof reinosDados !== "undefined") {
    const bloco = reinosDados.find((b) => String(b.num) === chaveBrasao(blocoId));
    if (bloco) titulo = bloco.title;
  }
  // tira o emoji/símbolo inicial: tudo antes da primeira letra ou dígito
  return titulo.replace(/^[^\p{L}\p{N}]+/u, "");
}

// ---------- Desenho ----------

// Atalho pra criar um nó SVG com atributos
function elementoSVG(tag, atributos) {
  const elemento = document.createElementNS(SVG_NS_BRASAO, tag);
  Object.keys(atributos || {}).forEach((nome) => elemento.setAttribute(nome, atributos[nome]));
  return elemento;
}

// Traço "duplo": um contorno grosso na cor da borda e o miolo marfim por cima.
// Assim uma linha fina continua visível em cima de qualquer campo, mesmo pequena.
function tracoDuplo(grupo, d, cor, largura) {
  grupo.appendChild(elementoSVG("path", {
    d, fill: "none", stroke: cor, "stroke-width": largura + 3,
    "stroke-linecap": "round", "stroke-linejoin": "round"
  }));
  grupo.appendChild(elementoSVG("path", {
    d, fill: "none", stroke: COR_FIGURA_BRASAO, "stroke-width": largura,
    "stroke-linecap": "round", "stroke-linejoin": "round"
  }));
}

// Figura de cada reino, desenhada dentro do viewBox 0 0 100 120 (miolo ~ x 20–80, y 34–96)
function desenharCarga(grupo, dados) {
  const borda = dados.borda;
  const escuro = dados.campoEscuro;
  const peca = (tag, atributos) =>
    grupo.appendChild(elementoSVG(tag, Object.assign({ fill: COR_FIGURA_BRASAO, stroke: borda, "stroke-width": 2.5 }, atributos)));

  switch (dados.carga) {
    case "compasso": // Bloco 0 — o compasso do projetista
      tracoDuplo(grupo, "M50 42 L30 90", borda, 4.5);
      tracoDuplo(grupo, "M50 42 L70 90", borda, 4.5);
      tracoDuplo(grupo, "M34 77 Q50 87 66 77", borda, 3.5);
      tracoDuplo(grupo, "M50 28 L50 35", borda, 3.5);
      peca("circle", { cx: 50, cy: 41, r: 7, "stroke-width": 3 });
      peca("circle", { cx: 50, cy: 41, r: 2.5, fill: escuro, stroke: "none" });
      break;

    case "torre": // Bloco 1 — torre com ameias
      peca("rect", { x: 31, y: 40, width: 9, height: 12 });
      peca("rect", { x: 45.5, y: 40, width: 9, height: 12 });
      peca("rect", { x: 60, y: 40, width: 9, height: 12 });
      peca("rect", { x: 33, y: 50, width: 34, height: 40, "stroke-width": 3 });
      peca("rect", { x: 47, y: 56, width: 6, height: 8, fill: escuro, stroke: "none" });
      peca("path", { d: "M43 90 L43 77 Q50 68 57 77 L57 90 Z", fill: escuro, stroke: "none" });
      peca("rect", { x: 28, y: 88, width: 44, height: 6, rx: 1 });
      break;

    case "regua": // Bloco 2 — a força (seta) sobre a régua de medir
      tracoDuplo(grupo, "M50 34 L50 58", borda, 5);
      peca("path", { d: "M39 56 L61 56 L50 71 Z", "stroke-linejoin": "round" });
      peca("rect", { x: 20, y: 76, width: 60, height: 13, rx: 2, "stroke-width": 3 });
      [27, 34, 41, 48, 55, 62, 69, 76].forEach((x, i) => {
        grupo.appendChild(elementoSVG("line", {
          x1: x, y1: 77.5, x2: x, y2: i % 2 ? 82 : 85, stroke: escuro, "stroke-width": 2.2
        }));
      });
      break;

    case "engrenagem": // Bloco 3 — engrenagem (os vínculos que ninguém vê)
      for (let angulo = 0; angulo < 360; angulo += 45) {
        peca("rect", {
          x: 44.5, y: 37, width: 11, height: 12, rx: 1.5,
          transform: `rotate(${angulo} 50 64)`
        });
      }
      peca("circle", { cx: 50, cy: 64, r: 20, "stroke-width": 3 });
      peca("circle", { cx: 50, cy: 64, r: 13, fill: "none", stroke: escuro, "stroke-width": 1.5, opacity: 0.45 });
      peca("circle", { cx: 50, cy: 64, r: 7, fill: escuro, "stroke-width": 2 });
      break;

    case "coluna": // Bloco 4 — coluna clássica (a força dos materiais)
      peca("rect", { x: 27, y: 37, width: 46, height: 7, rx: 1 });
      peca("rect", { x: 32, y: 44, width: 36, height: 6 });
      peca("rect", { x: 38, y: 50, width: 24, height: 32, "stroke-width": 3 });
      [44, 50, 56].forEach((x) => {
        grupo.appendChild(elementoSVG("line", { x1: x, y1: 53, x2: x, y2: 79, stroke: borda, "stroke-width": 2 }));
      });
      peca("rect", { x: 33, y: 82, width: 34, height: 5 });
      peca("rect", { x: 28, y: 87, width: 44, height: 6, rx: 1 });
      break;

    case "olho": // Bloco 5 — o olho da análise dentro do triângulo
      grupo.appendChild(elementoSVG("path", {
        d: "M50 33 L81 89 L19 89 Z", fill: "none", stroke: borda,
        "stroke-width": 5, "stroke-linejoin": "round"
      }));
      peca("path", { d: "M33 72 Q50 58 67 72 Q50 86 33 72 Z", "stroke-linejoin": "round" });
      peca("circle", { cx: 50, cy: 72, r: 7, fill: dados.campo, stroke: "none" });
      peca("circle", { cx: 50, cy: 72, r: 3.2, fill: "#06070a", stroke: "none" });
      break;

    case "espadas": { // Bloco 6 — espadas cruzadas (a grande aliança)
      // Cada espada sai da ponta (em cima) e desce até o pomo; a lâmina
      // afina até a ponta, a guarda é perpendicular à lâmina.
      const espada = (pontaX, pontaY, pomoX, pomoY) => {
        const dx = pomoX - pontaX, dy = pomoY - pontaY;
        const comprimento = Math.hypot(dx, dy);
        const ux = dx / comprimento, uy = dy / comprimento; // ao longo da lâmina
        const nx = -uy, ny = ux; // perpendicular
        const ponto = (t, lado) => `${(pontaX + ux * t + nx * lado).toFixed(1)} ${(pontaY + uy * t + ny * lado).toFixed(1)}`;
        const guarda = comprimento * 0.76;
        // cabo
        grupo.appendChild(elementoSVG("path", {
          d: `M${ponto(guarda, 0)} L${ponto(comprimento - 3, 0)}`,
          stroke: "#1a0f08", "stroke-width": 6.5, "stroke-linecap": "round"
        }));
        grupo.appendChild(elementoSVG("path", {
          d: `M${ponto(guarda, 0)} L${ponto(comprimento - 3, 0)}`,
          stroke: borda, "stroke-width": 3.5, "stroke-linecap": "round"
        }));
        // lâmina
        peca("path", { d: `M${ponto(0, 0)} L${ponto(guarda, 4.5)} L${ponto(guarda, -4.5)} Z`, stroke: escuro, "stroke-width": 1.8, "stroke-linejoin": "round" });
        // guarda
        tracoDuplo(grupo, `M${ponto(guarda, -9)} L${ponto(guarda, 9)}`, borda, 3.5);
        // pomo
        peca("circle", { cx: pomoX, cy: pomoY, r: 4, "stroke-width": 2 });
      };
      espada(27, 35, 71, 88);
      espada(73, 35, 29, 88);
      break;
    }

    case "ponte-partida": { // Ilha — a ponte que caiu (Reino dos Erros Famosos)
      const osso = "#e8dcc4";
      const pedra = ({ tag, ...atributos }) =>
        grupo.appendChild(elementoSVG(tag || "path", Object.assign({ fill: osso, stroke: "#120303", "stroke-width": 2 }, atributos)));
      // rachadura atravessando o escudo de cima a baixo
      grupo.appendChild(elementoSVG("path", {
        d: "M60 12 L55 22 L61 29 L56 38", fill: "none", stroke: "#120303",
        "stroke-width": 2.5, "stroke-linecap": "round", "stroke-linejoin": "round"
      }));
      // as duas metades da ponte em arco (pilar + meio arco), com a ponta quebrada
      pedra({ d: "M16 50 L46 50 L42 55 L47 60 L44 60 Q32 62 29 76 L29 88 L20 88 L20 60 L16 60 Z", "stroke-linejoin": "round" });
      pedra({ d: "M84 50 L55 50 L58 54 L53 60 L56 60 Q68 62 71 76 L71 88 L80 88 L80 60 L84 60 Z", "stroke-linejoin": "round" });
      // pedaços caindo no rio
      pedra({ tag: "rect", x: 45, y: 68, width: 9, height: 9, transform: "rotate(24 49.5 72.5)" });
      pedra({ tag: "rect", x: 52, y: 82, width: 5, height: 5, transform: "rotate(-18 54.5 84.5)" });
      // ondas do rio
      grupo.appendChild(elementoSVG("path", {
        d: "M28 95 Q33 91 38 95 T48 95 T58 95 T68 95", fill: "none", stroke: osso,
        "stroke-width": 2.5, "stroke-linecap": "round", opacity: 0.75
      }));
      break;
    }
  }
}

// Monta o <svg> do brasão. tamanho = largura em px (a altura é 1,2× a largura).
// opcoes.decorativo = true → aria-hidden (quando o nome já está escrito ao lado).
function criarBrasaoSVG(blocoId, tamanho, opcoes) {
  const dados = obterDadosBrasao(blocoId);
  if (!dados) return null;
  const largura = tamanho || 44;
  const config = opcoes || {};
  const id = `brasao-${chaveBrasao(blocoId)}-${++contadorBrasoes}`;

  const svg = elementoSVG("svg", {
    viewBox: "0 0 100 120",
    width: largura,
    height: Math.round(largura * 1.2),
    class: "brasao-svg",
    focusable: "false"
  });
  if (config.decorativo) {
    svg.setAttribute("aria-hidden", "true");
  } else {
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-labelledby", `${id}-titulo`);
  }

  // <title> com o lema: é o nome acessível do brasão e vira tooltip no mouse
  const traducao = TRADUCAO_LEMAS_BRASAO[dados.lema];
  const nome = nomeReinoBrasao(blocoId);
  const titulo = elementoSVG("title", { id: `${id}-titulo` });
  titulo.textContent = `Brasão${nome ? ": " + nome : ""}. Lema: ${dados.lema}${traducao ? " (" + traducao + ")" : ""}`;
  svg.appendChild(titulo);

  // Degradês: campo de cima pra baixo e um brilho de vidro na metade esquerda
  const defs = elementoSVG("defs");
  const gradCampo = elementoSVG("linearGradient", { id: `${id}-campo`, x1: "0", y1: "0", x2: "0", y2: "1" });
  gradCampo.appendChild(elementoSVG("stop", { offset: "0%", "stop-color": dados.campo }));
  gradCampo.appendChild(elementoSVG("stop", { offset: "100%", "stop-color": dados.campoEscuro }));
  const gradBrilho = elementoSVG("linearGradient", { id: `${id}-brilho`, x1: "0", y1: "0", x2: "1", y2: "1" });
  gradBrilho.appendChild(elementoSVG("stop", { offset: "0%", "stop-color": "#fff", "stop-opacity": "0.28" }));
  gradBrilho.appendChild(elementoSVG("stop", { offset: "60%", "stop-color": "#fff", "stop-opacity": "0" }));
  defs.appendChild(gradCampo);
  defs.appendChild(gradBrilho);
  svg.appendChild(defs);

  const contorno = "M50 4 L92 12 L92 56 Q92 96 50 116 Q8 96 8 56 L8 12 Z";

  // Sombra escura atrás da borda: separa o escudo do vidro do painel
  svg.appendChild(elementoSVG("path", { d: contorno, fill: "none", stroke: "rgba(0,0,0,0.55)", "stroke-width": 9, "stroke-linejoin": "round" }));
  // Campo
  svg.appendChild(elementoSVG("path", { d: contorno, fill: `url(#${id}-campo)` }));
  // Chefe (faixa de cima, escurecida)
  svg.appendChild(elementoSVG("path", { d: "M8 12 L50 4 L92 12 L92 28 Q50 34 8 28 Z", fill: "rgba(0,0,0,0.3)" }));
  // Filete interno
  svg.appendChild(elementoSVG("path", {
    d: "M50 11 L85 17.5 L85 56 Q85 90 50 108 Q15 90 15 56 L15 17.5 Z",
    fill: "none", stroke: dados.borda, "stroke-width": 1.2, opacity: 0.45
  }));

  // Figura
  const carga = elementoSVG("g", { class: "brasao-carga" });
  desenharCarga(carga, dados);
  svg.appendChild(carga);

  // Brilho de vidro + borda metálica por cima de tudo
  svg.appendChild(elementoSVG("path", { d: "M50 4 L8 12 L8 56 Q8 96 50 116 Z", fill: `url(#${id}-brilho)`, "pointer-events": "none" }));
  svg.appendChild(elementoSVG("path", { d: contorno, fill: "none", stroke: dados.borda, "stroke-width": 4, "stroke-linejoin": "round" }));

  return svg;
}

// Mesmo brasão, como texto — pra entrar direto nos templates `...` do app.js
function brasaoHTML(blocoId, tamanho, opcoes) {
  const svg = criarBrasaoSVG(blocoId, tamanho, opcoes);
  return svg ? svg.outerHTML : "";
}

// Medalhão do tile/painel: o brasão no lugar da gema redonda, com uma gema
// pequena com o número do reino no canto (a Ilha não tem número).
// Mantém a classe .tile-numero pra quem já procura o medalhão por ela.
function medalhaoBrasaoHTML(blocoId, tamanho, classeExtra) {
  const chave = chaveBrasao(blocoId);
  if (chave === null) return "";
  const numero = chave === "ilha" ? "" : `<span class="brasao-numero" aria-hidden="true">${chave}</span>`;
  return `<span class="tile-numero tile-brasao ${classeExtra || ""}" data-brasao="${chave}">` +
    brasaoHTML(blocoId, tamanho) + numero + `</span>`;
}

// Legenda discreta com o lema, pro painel aberto do reino
function lemaReinoHTML(blocoId) {
  const dados = obterDadosBrasao(blocoId);
  if (!dados) return "";
  const traducao = TRADUCAO_LEMAS_BRASAO[dados.lema];
  return `<p class="lema-reino" title="Lema do reino, em latim${traducao ? ": " + traducao : ""}">` +
    `<span class="lema-latim">✦ ${dados.lema} ✦</span>` +
    (traducao ? ` <span class="lema-traducao">${traducao}</span>` : "") +
    `</p>`;
}
