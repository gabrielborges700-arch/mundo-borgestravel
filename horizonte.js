/**
 * horizonte.js — Horizonte do Reino: castelo cujos vitrais acendem a cada reino concluído
 *
 * Cena estática no fim da página, logo depois da Galeria de Conquistas:
 * montanhas, chão e um castelo gótico com 7 vitrais ogivais, um por reino
 * (Bloco 0 a Bloco 6, da esquerda para a direita). O vitral acende na cor do
 * reino quando TODAS as runas dele foram lidas; com os 7 acesos, um
 * estandarte dourado sobe no torreão. Só leitura do progresso: nada aqui é
 * clicável, nada tranca conteúdo e o hero não é mexido.
 *
 * Origem: CasteloElaborado, MontanhasFundo e ChaoDoReino do protótipo
 * BORGESTR-VEL (React), recoloridos para a Forja Real (sem o roxo antigo) e
 * com as 5 janelas do original redesenhadas como 7 ogivas iguais. Ficaram de
 * fora de propósito: EstandarteTitulo (duplica o título do hero), PlacaReino
 * (placas de 2 reinos antigos) e EstrelasCadentes, VeusDeAurora, NuvensDeriva,
 * CriaturaVoadora e PoeiraMagica (animação contínua; o efeitos.js já tem
 * estrelas, névoa e partículas).
 *
 * "Recém-aceso": os vitrais que a criança já VIU acesos ficam numa chave
 * nova, "borgestravel_horizonte" (array JSON de ids de bloco), lida e gravada
 * só pelo armazenamentoLer/armazenamentoGravar do navegacao.js. Quando a
 * seção entra na tela e há vitral aceso fora dessa lista, ele pulsa 2 vezes
 * (uma animação só, 1,4 s) e a lista é regravada. Na primeira visita (sem a
 * chave) o estado atual é gravado sem animar; com movimento reduzido, só acende.
 *
 * Carregar DEPOIS do jogo.js (e do cadeados.js/painel-reino.js, se existirem):
 * encadeia aposRenderizarBlocos (ver o fim do arquivo). Depende de reinosDados
 * (dados.js), armazenamentoLer/armazenamentoGravar (navegacao.js) e
 * calcularProgressoBloco (app.js) — todos consultados com typeof.
 */

const HORIZONTE_SVG_NS = "http://www.w3.org/2000/svg";
const CHAVE_HORIZONTE = "borgestravel_horizonte";

// Cores da Forja Real (o original usava #3D2B56/#4a3568)
const HORIZONTE_COR_CASTELO = "#0e1014";
const HORIZONTE_FILETE = "rgba(212,175,55,.42)";   // luz dourada no contorno do topo (era .22: some no celular)
const HORIZONTE_VIDRO_APAGADO = "#07080a";
const HORIZONTE_CAIXILHO = "rgba(140,98,57,.55)";  // bronze envelhecido
const HORIZONTE_OURO = "#d4af37";
const HORIZONTE_OURO_CONTORNO = "#3a2410";

// Corpo central do castelo (viewBox 600×170): os vitrais têm 22 de largura,
// igualmente espaçados entre x=177 e x=423
const HORIZONTE_CORPO_X0 = 177;
const HORIZONTE_CORPO_X1 = 423;
const HORIZONTE_VITRAL_LARGURA = 22;

// Estado da seção montada (null até o DOMContentLoaded)
let horizonteSecao = null;
let horizonteNaTela = false; // sem IntersectionObserver vira true ao montar

// ---------- Desenho (SVG inline estático, zero imagens) ----------

// Ameias (merlons) de x0 a x1 sobre a linha "topo": n dentes de altura "alto",
// com dente nas duas pontas. Parte de (x0, topo) e termina em (x1, topo);
// devolve só V/H (inteiros) pra o markup ficar curto.
function horizonteAmeias(x0, x1, topo, n, alto) {
  const passo = (x1 - x0) / (2 * n - 1);
  let d = "";
  for (let k = 0; k < n; k++) {
    const b = Math.round(x0 + (2 * k + 1) * passo);
    d += `V${topo - alto}H${b}V${topo}`;
    if (k < n - 1) d += `H${Math.round(x0 + (2 * k + 2) * passo)}`;
  }
  return d;
}

// Silhueta inteira num path só (assim o filete dourado contorna só a borda de
// fora, sem riscar onde uma torre encosta na outra). Da esquerda pra direita:
// torre lateral, muralha, torre cônica, corpo gótico com o torreão central
// assimétrico (torre alta + torrinha cônica à direita), torre cônica mais alta
// e a outra torre lateral.
function horizonteSilhueta() {
  return "M20,170V104" + horizonteAmeias(20, 62, 104, 3, 8) + "V128H68" +
    horizonteAmeias(68, 94, 128, 2, 8) + "H100" +
    "V84H96L120,52 144,84H140V128H146" +
    horizonteAmeias(146, 171, 128, 2, 8) + "H177V76" +
    horizonteAmeias(177, 270, 76, 4, 8) +
    "V50H266L295,20 324,50H320V60H326L333,46 340,60H346V76" +
    horizonteAmeias(346, 423, 76, 3, 8) + "V128H429" +
    horizonteAmeias(429, 454, 128, 2, 8) + "H460" +
    "V80H456L482,42 508,80H504V128H510" +
    horizonteAmeias(510, 532, 128, 2, 8) + "H538V100" +
    horizonteAmeias(538, 580, 100, 3, 8) + "V170Z";
}

// Ogiva no formato "M x,150 L x,112 Q x+11,94 x+22,112 L x+22,150 Z",
// opcionalmente ampliada (escala) em torno do centro dela, (x+11, 122).
// O halo usa a ampliação 1,6× com as coordenadas já calculadas: um transform
// no atributo seria sobrescrito pelo transform da animação CSS.
function horizonteOgiva(x, escala) {
  const cx = x + 11, cy = 122;
  const p = (px, py) => `${+(cx + (px - cx) * escala).toFixed(1)},${+(cy + (py - cy) * escala).toFixed(1)}`;
  return `M${p(x, 150)} L${p(x, 112)} Q${p(x + 11, 94)} ${p(x + 22, 112)} L${p(x + 22, 150)} Z`;
}

// "⚙️ Bloco 3 — Reino NEXUS (Tendões)" → "Bloco 3 — Reino NEXUS"
function horizonteNomeReino(bloco) {
  return String(bloco.title).replace(/^[^B]*(?=Bloco)/, "").replace(/\s*\([^)]*\)\s*$/, "").trim();
}

function horizonteTituloVitral(bloco, aceso) {
  return `${horizonteNomeReino(bloco)}: ${aceso ? "reino concluído!" : "leia todas as runas para acender"}`;
}

// ["A", "B", "C"] → "A, B e C"
function horizonteListar(itens) {
  return itens.length < 2 ? itens.join("") : `${itens.slice(0, -1).join(", ")} e ${itens[itens.length - 1]}`;
}

// Nome acessível do castelo (aria-label do <svg role="img">). Os <title> de
// cada vitral nunca chegavam ao leitor de tela (filhos de role="img" são
// apresentacionais e a seção não recebe o mouse), então a frase diz QUAIS
// reinos acenderam e quais faltam.
function horizonteDescricao(concluidos) {
  const acesos = reinosDados.filter((bloco) => concluidos.includes(bloco.id)).map(horizonteNomeReino);
  const apagados = reinosDados.filter((bloco) => !concluidos.includes(bloco.id)).map(horizonteNomeReino);
  const total = reinosDados.length;
  if (apagados.length === 0) return `Castelo do Reino: os ${total} vitrais estão acesos e o estandarte dourado tremula no torreão!`;
  if (acesos.length === 0) return `Castelo do Reino: nenhum dos ${total} vitrais aceso ainda. Cada reino com todas as runas lidas acende um vitral.`;
  return `Castelo do Reino: ${acesos.length} de ${total} vitrais acesos. Acesos: ${horizonteListar(acesos)}. ` +
    `Ainda apagados: ${horizonteListar(apagados)}.`;
}

// Monta o markup da seção (≤ 6 KB): montanhas, castelo, chão e legenda
function horizonteMarkup() {
  const total = reinosDados.length;
  const vao = (HORIZONTE_CORPO_X1 - HORIZONTE_CORPO_X0 - total * HORIZONTE_VITRAL_LARGURA) / (total + 1);
  const vitrais = reinosDados.map((bloco, i) => {
    const x = +(HORIZONTE_CORPO_X0 + vao + i * (HORIZONTE_VITRAL_LARGURA + vao)).toFixed(1);
    const meio = +(x + 11).toFixed(1);
    // halo e brilho começam escondidos (display="none"); o vidro, apagado.
    // A cruz escura no fim é o chumbo do vitral (some no vidro apagado).
    // stroke-width 1,2 vem herdado do <svg> do castelo (economiza markup).
    return `<g class="horizonte-vitral" data-vitral="${bloco.id}">` +
      `<title>${horizonteTituloVitral(bloco, false)}</title>` +
      `<path class="vitral-halo" d="${horizonteOgiva(x, 1.6)}" opacity=".3" display="none"/>` +
      `<path class="vitral-vidro" d="${horizonteOgiva(x, 1)}" fill="${HORIZONTE_VIDRO_APAGADO}" stroke="${HORIZONTE_CAIXILHO}"/>` +
      `<path class="vitral-brilho" d="M${+(x + 4).toFixed(1)},146 V110 L${+(x + 7).toFixed(1)},106 V146 Z" fill="#fff" fill-opacity=".25" display="none"/>` +
      `<path d="M${meio},101 V150 M${x},128 H${+(x + 22).toFixed(1)}" stroke="${HORIZONTE_VIDRO_APAGADO}"/>` +
      `</g>`;
  }).join("");

  return `<div class="horizonte-cena">` +
    `<svg class="horizonte-montanhas" viewBox="0 0 1200 130" preserveAspectRatio="none" aria-hidden="true">` +
      `<path d="M0,130 L0,80 L150,25 L300,75 L430,15 L600,80 L760,30 L900,85 L1050,20 L1200,70 L1200,130 Z" fill="#1a1d24" opacity=".85"/>` +
      `<path d="M0,130 L0,100 L180,50 L360,95 L520,45 L700,100 L880,55 L1050,100 L1200,60 L1200,130 Z" fill="#121418"/>` +
    `</svg>` +
    `<svg class="horizonte-castelo" viewBox="0 0 600 170" preserveAspectRatio="xMidYMax meet" role="img" aria-label="Castelo do Reino" stroke-width="1.2">` +
      `<path d="${horizonteSilhueta()}" fill="${HORIZONTE_COR_CASTELO}" stroke="${HORIZONTE_FILETE}" stroke-linejoin="round"/>` +
      // Estandarte (mastro + flâmula de rabo de andorinha) no topo do torreão
      `<g class="horizonte-estandarte" display="none">` +
        `<path d="M295,21 V1" stroke="${HORIZONTE_OURO_CONTORNO}" stroke-width="1.6"/>` +
        `<path d="M296,2 H322 L315,7.5 L322,13 H296 Z" fill="${HORIZONTE_OURO}" stroke="${HORIZONTE_OURO_CONTORNO}" stroke-width="1"/>` +
      `</g>` +
      vitrais +
    `</svg>` +
    `<svg class="horizonte-chao" viewBox="0 0 1200 30" preserveAspectRatio="none" aria-hidden="true">` +
      `<path d="M0,30 L0,12 Q60,4 120,10 T240,9 T360,12 T480,7 T600,11 T720,8 T840,12 T960,9 T1080,10 T1200,9 L1200,30 Z" fill="#0b0c0f"/>` +
    `</svg>` +
    `</div>` +
    `<p class="horizonte-legenda" id="horizonte-legenda"></p>`;
}

// ---------- Estado ----------

function horizonteMovimentoReduzido() {
  try {
    return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  } catch (erro) {
    return false;
  }
}

// Ids dos blocos com todas as runas lidas (mesma regra do mapa: app.js)
function horizonteBlocosConcluidos() {
  if (typeof reinosDados === "undefined" || typeof calcularProgressoBloco !== "function") return [];
  return reinosDados.filter((bloco) => calcularProgressoBloco(bloco).completo).map((bloco) => bloco.id);
}

// Lista dos vitrais que a criança já VIU acesos; null se a chave não existe
// (primeira visita) ou veio corrompida
function horizonteLerVistos() {
  if (typeof armazenamentoLer !== "function") return null;
  const texto = armazenamentoLer(CHAVE_HORIZONTE);
  if (texto === null || texto === undefined) return null;
  try {
    const lista = JSON.parse(texto);
    return Array.isArray(lista) ? lista.filter((id) => typeof id === "string") : null;
  } catch (erro) {
    return null;
  }
}

function horizonteGravarVistos(ids) {
  if (typeof armazenamentoGravar === "function") armazenamentoGravar(CHAVE_HORIZONTE, JSON.stringify(ids));
}

// ---------- Atualização ----------

// Acende/apaga os vitrais, mostra o estandarte e reescreve a legenda.
// Só mexe em atributos: o SVG nunca é redesenhado (nem a animação reinicia).
function atualizarHorizonte() {
  if (!horizonteSecao || typeof reinosDados === "undefined") return;
  const concluidos = horizonteBlocosConcluidos();
  const total = reinosDados.length;

  reinosDados.forEach((bloco) => {
    const g = horizonteSecao.querySelector(`[data-vitral="${bloco.id}"]`);
    if (!g) return;
    const aceso = concluidos.includes(bloco.id);
    g.classList.toggle("vitral-aceso", aceso);
    g.querySelector("title").textContent = horizonteTituloVitral(bloco, aceso);
    // as cores dos reinos vêm do dados.js e não mudam
    g.querySelector(".vitral-vidro").setAttribute("fill", aceso ? bloco.hex : HORIZONTE_VIDRO_APAGADO);
    const halo = g.querySelector(".vitral-halo");
    halo.setAttribute("fill", bloco.hex);
    [halo, g.querySelector(".vitral-brilho")].forEach((peca) => {
      if (aceso) peca.removeAttribute("display");
      else peca.setAttribute("display", "none");
    });
  });

  const completo = total > 0 && concluidos.length === total;
  horizonteSecao.classList.toggle("horizonte-completo", completo);
  const estandarte = horizonteSecao.querySelector(".horizonte-estandarte");
  if (completo) estandarte.removeAttribute("display");
  else estandarte.setAttribute("display", "none");

  // Legenda visível: quantos e QUAIS (pelo número do bloco, pra caber no celular);
  // o aria-label do castelo leva os nomes completos, acesos e apagados
  const numeros = reinosDados.filter((bloco) => concluidos.includes(bloco.id)).map((bloco) => bloco.num);
  const quais = numeros.length === 0 || completo
    ? ""
    : ` (${numeros.length === 1 ? "Bloco" : "Blocos"} ${horizonteListar(numeros.map(String))})`;
  horizonteSecao.querySelector(".horizonte-legenda").textContent = completo
    ? `🏰 ${concluidos.length} de ${total} vitrais acesos — o estandarte dourado tremula no torreão!`
    : `🏰 ${concluidos.length} de ${total} vitrais acesos${quais} — cada reino concluído acende um vitral do castelo.`;
  horizonteSecao.querySelector(".horizonte-castelo").setAttribute("aria-label", horizonteDescricao(concluidos));

  if (horizonteNaTela) horizonteRevelarRecemAcesos();
}

// Pulsa (uma vez) os vitrais acesos que a criança ainda não tinha visto e
// regrava a lista. Chamado quando a seção entra na tela.
function horizonteRevelarRecemAcesos() {
  if (!horizonteSecao) return;
  const acesos = horizonteBlocosConcluidos();
  const vistos = horizonteLerVistos();
  if (vistos === null) {
    horizonteGravarVistos(acesos); // primeira visita: grava sem animar
    return;
  }
  const novos = acesos.filter((id) => !vistos.includes(id));
  if (novos.length === 0) return;

  if (!horizonteMovimentoReduzido()) {
    novos.forEach((id) => {
      const g = horizonteSecao.querySelector(`[data-vitral="${id}"]`);
      if (g) horizonteAnimarUmaVez(g, "vitral-recem-aceso");
    });
    if (horizonteSecao.classList.contains("horizonte-completo")) {
      horizonteAnimarUmaVez(horizonteSecao.querySelector(".horizonte-estandarte"), "estandarte-recem-hasteado");
    }
  }
  // a lista nova é o estado atual (se o progresso foi zerado, o vitral pode pulsar de novo depois)
  horizonteGravarVistos(acesos);
}

// Põe a classe da animação (finita) e tira no animationend (que sobe do halo
// até o <g>), pra não ficar classe velha pendurada; o reflow no meio garante
// que ela recomeça
function horizonteAnimarUmaVez(elemento, classe) {
  if (!elemento) return;
  elemento.classList.remove(classe);
  void elemento.getBoundingClientRect();
  elemento.classList.add(classe);
  elemento.addEventListener("animationend", () => elemento.classList.remove(classe), { once: true });
}

// ---------- Montagem ----------

function montarHorizonte() {
  if (horizonteSecao || typeof reinosDados === "undefined" || reinosDados.length === 0) return;
  const secao = document.createElement("section");
  secao.className = "horizonte-reino";
  secao.setAttribute("aria-label", "Castelo do Reino");
  secao.innerHTML = horizonteMarkup();

  // fora do <main>: não mexe no max-width nem no observador de seção ativa
  const rodape = document.querySelector("body > footer");
  if (rodape) rodape.before(secao);
  else document.body.appendChild(secao);
  horizonteSecao = secao;

  // primeira visita (sem a chave): grava o que já está aceso, sem animar
  if (horizonteLerVistos() === null) horizonteGravarVistos(horizonteBlocosConcluidos());

  if ("IntersectionObserver" in window) {
    const observador = new IntersectionObserver((entradas) => {
      entradas.forEach((entrada) => {
        horizonteNaTela = entrada.isIntersecting;
        if (horizonteNaTela) horizonteRevelarRecemAcesos();
      });
    }, { threshold: 0.4 });
    observador.observe(secao);
  } else {
    horizonteNaTela = true; // sem IO: revela ao montar
  }
  atualizarHorizonte();
}

document.addEventListener("DOMContentLoaded", () => {
  try { montarHorizonte(); } catch (erro) {}
});

// ---------- Encadeamento com app.js/jogo.js (sem editar nenhum dos dois) ----------

// aposRenderizarBlocos: o app.js chama (com typeof) no fim de todo
// renderizarListaBlocos — inclusive logo depois de marcar uma runa como lida —
// e o jogo.js chama direto depois de vencer um Julgamento. A anterior
// (jogo.js, ou os invólucros do cadeados.js/painel-reino.js) roda primeiro,
// uma vez; um erro nosso nunca derruba o jogo.
if (typeof aposRenderizarBlocos === "function") {
  const aposRenderizarBlocosSemHorizonte = aposRenderizarBlocos;
  aposRenderizarBlocos = function () {
    aposRenderizarBlocosSemHorizonte.apply(this, arguments);
    try { atualizarHorizonte(); } catch (erro) {}
  };
}
