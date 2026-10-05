/**
 * app.js — Lógica principal do Mundo Borgestrável (Fase 4)
 *
 * Renderiza os 7 blocos como painéis clicáveis. Ao clicar num bloco,
 * ele expande e mostra as runas (subtemas) dentro. Ao clicar numa runa,
 * abre um modal de leitura com o conteúdo completo (curiosidades, dica,
 * desafio quando existir).
 *
 * Usa reinosDados e dadosEspecificosCards, que vêm do dados.js
 * (carregado antes deste arquivo no index.html).
 */

let blocoAbertoId = null; // qual bloco está expandido (modo lista/celular)
let blocosAbertosDesktop = []; // ids abertos no Mapa do Reino (telas largas), em ordem de abertura

// Mistura a cor do reino com outra (branco pra clarear, preto pra escurecer),
// canal a canal no sRGB — a mesma conta do color-mix(in srgb, ...) do CSS.
// Misturar só com branco ou só com preto não mexe no matiz. Serve de cor
// pronta pra navegador sem color-mix (iPads antigos). fracaoCor: 0 a 1.
function misturarCorReino(hex, alvoHex, fracaoCor) {
  const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const cor = rgb(hex);
  const alvo = rgb(alvoHex);
  return "#" + cor.map((c, i) => {
    const v = Math.round(c * fracaoCor + alvo[i] * (1 - fracaoCor));
    return v.toString(16).padStart(2, "0");
  }).join("");
}

// O Mapa do Reino só existe em telas largas; abaixo disso vale o acordeão vertical de sempre
function modoMapaDesktop() {
  return window.matchMedia("(min-width: 1024px)").matches;
}

// ---------- Renderização dos blocos ----------

function renderizarListaBlocos() {
  const container = document.getElementById("lista-blocos");
  container.innerHTML = "";

  if (modoMapaDesktop()) {
    renderizarMapaReino(container);
  } else {
    renderizarAcordeaoBlocos(container);
  }

  // Hook do sistema de jogo (jogo.js) — injeta botões de missão nos blocos
  // completos toda vez que a lista de blocos é (re)desenhada.
  if (typeof aposRenderizarBlocos === "function") aposRenderizarBlocos();

  // Hook da barra de navegação (navegacao.js) — o innerHTML acima destruiu
  // os painéis que o observador de "bloco ativo" acompanhava; reanexa neles.
  if (typeof reobservarSecaoAtiva === "function") reobservarSecaoAtiva();
}

// ---------- Modo lista (celular/tablet) — comportamento original intacto ----------

function renderizarAcordeaoBlocos(container) {
  reinosDados.forEach((bloco) => {
    const painel = document.createElement("div");
    painel.className = "painel-reino-premium";
    painel.style.marginBottom = "1.5rem";
    painel.style.cursor = "pointer";
    painel.style.setProperty("--cor-reino", bloco.hex); // tinte e brilho do reino via CSS
    // Título clareado (60% + branco) já calculado: vale mesmo sem color-mix
    painel.style.setProperty("--cor-reino-titulo", misturarCorReino(bloco.hex, "#ffffff", 0.6));
    painel.dataset.blocoId = bloco.id;

    const aberto = blocoAbertoId === bloco.id;

    painel.innerHTML = `
      <div class="cabecalho-bloco" style="display:flex; justify-content:space-between; align-items:center;">
        <div class="cabecalho-identidade">
          ${typeof medalhaoBrasaoHTML === "function" ? medalhaoBrasaoHTML(bloco.id, 40) : ""}
          <div>
            <h2 class="font-display titulo-reino" style="margin: 0 0 0.25rem; font-size: 1.3rem;">
              ${bloco.title}
            </h2>
            <p class="font-body" style="color: var(--pergaminho-escuro); margin: 0;">
              ${bloco.subtitle}
            </p>
            ${aberto && typeof lemaReinoHTML === "function" ? lemaReinoHTML(bloco.id) : ""}
          </div>
        </div>
        <span style="color: var(--ouro-velho); font-size: 1.5rem; transition: transform 0.3s ease; transform: rotate(${aberto ? "180deg" : "0deg"});">
          ▾
        </span>
      </div>
      <div class="divisor-rune"></div>
      <div class="lista-runas" style="display:${aberto ? "grid" : "none"}; gap: 0.75rem; margin-top: 1rem;"></div>
    `;

    // Clicar no cabeçalho abre/fecha o bloco
    painel.querySelector(".cabecalho-bloco").addEventListener("click", () => {
      blocoAbertoId = aberto ? null : bloco.id;
      // Sino do reino (som.js) e transição de portal (portal.js) — só ao ENTRAR no reino
      if (!aberto && typeof somTocar === "function") somTocar("reino", bloco.id);
      if (!aberto && typeof portalAoAbrirReino === "function") portalAoAbrirReino(bloco.id);
      renderizarListaBlocos();
    });

    container.appendChild(painel);

    // Se estiver aberto, preenche as runas dentro dele (com o guardião no topo)
    if (aberto) {
      const listaRunas = painel.querySelector(".lista-runas");
      const faixa = criarFaixaGuardiao(bloco.id, calcularProgressoBloco(bloco));
      if (faixa) painel.insertBefore(faixa, listaRunas);
      // Link pro capítulo deste reino na Crônica Fundadora (cronica.js)
      if (typeof criarLinkCronicaReino === "function") {
        const linkCronica = criarLinkCronicaReino(bloco.id);
        if (linkCronica) painel.insertBefore(linkCronica, listaRunas);
      }
      bloco.subtemas.forEach((subtema) => {
        listaRunas.appendChild(criarCardRuna(subtema, bloco));
      });
    }
  });

  // Ilha Amaldiçoada (conteúdo bônus) — painel escuro extra após os 7 reinos
  if (typeof ilhaAmaldicoada !== "undefined") {
    container.appendChild(criarPainelIlhaAcordeao());
  }
}

// ---------- Ilha Amaldiçoada (Reino dos Erros Famosos) ----------

function criarPainelIlhaAcordeao() {
  const aberto = blocoAbertoId === ilhaAmaldicoada.id;

  const painel = document.createElement("div");
  painel.className = "painel-reino-premium painel-ilha";
  painel.style.marginBottom = "1.5rem";
  painel.style.cursor = "pointer";
  painel.dataset.blocoId = ilhaAmaldicoada.id;

  // Título (classe .titulo-reino) e ▾ no rubro da Ilha clareado (#df8383):
  // o #c93030 puro dava ~2,8:1 sobre o vidro escuro
  painel.innerHTML = `
    <div class="cabecalho-bloco" style="display:flex; justify-content:space-between; align-items:center;">
      <div class="cabecalho-identidade">
        ${typeof medalhaoBrasaoHTML === "function" ? medalhaoBrasaoHTML(ilhaAmaldicoada.id, 40) : ""}
        <div>
          <h2 class="font-display titulo-reino" style="margin: 0 0 0.25rem; font-size: 1.3rem;">
            ${ilhaAmaldicoada.title}
          </h2>
          <p class="font-body" style="color: var(--pergaminho-escuro); margin: 0;">
            ${ilhaAmaldicoada.subtitle}
          </p>
          ${aberto && typeof lemaReinoHTML === "function" ? lemaReinoHTML(ilhaAmaldicoada.id) : ""}
        </div>
      </div>
      <span style="color: #df8383; font-size: 1.5rem; transition: transform 0.3s ease; transform: rotate(${aberto ? "180deg" : "0deg"});">
        ▾
      </span>
    </div>
    <div class="divisor-rune"></div>
    <div class="lista-runas" style="display:${aberto ? "grid" : "none"}; gap: 0.75rem; margin-top: 1rem;"></div>
  `;

  painel.querySelector(".cabecalho-bloco").addEventListener("click", () => {
    blocoAbertoId = aberto ? null : ilhaAmaldicoada.id;
    // Sino (som.js) e portal (portal.js) — só ao ENTRAR na Ilha
    if (!aberto && typeof somTocar === "function") somTocar("reino", ilhaAmaldicoada.id);
    if (!aberto && typeof portalAoAbrirReino === "function") portalAoAbrirReino(ilhaAmaldicoada.id);
    renderizarListaBlocos();
  });

  if (aberto) {
    const lista = painel.querySelector(".lista-runas");
    const faixa = criarFaixaGuardiao(ilhaAmaldicoada.id, calcularProgressoIlha());
    if (faixa) painel.insertBefore(faixa, lista);
    ilhaAmaldicoada.runasNegras.forEach((runa) => lista.appendChild(criarCardRunaNegra(runa)));
  }

  return painel;
}

// ---------- Guardiões dos Reinos ----------

function calcularProgressoIlha() {
  // A E.7 (simulador) fica fora da conta de leitura — o desafio dela é a ponte
  const cronicas = ilhaAmaldicoada.runasNegras.filter((r) => !r.simulador);
  const total = cronicas.length;
  const lidas = cronicas.filter(
    (r) => typeof runaNegraFoiLida === "function" && runaNegraFoiLida(r.id)
  ).length;
  return { lidas, total, completo: total > 0 && lidas === total, iniciado: lidas > 0 };
}

// Monta a faixa avatar + balão de fala do guardião do bloco.
// A fala muda conforme o progresso: 0 lidas → saudação; no meio → em
// progresso; falta 1 → quase lá; tudo lido → completo.
function criarFaixaGuardiao(blocoId, progresso) {
  if (typeof guardioesPorBloco === "undefined") return null;
  const guardiao = guardioesPorBloco[blocoId];
  if (!guardiao) return null;

  let fala;
  if (progresso.total > 0 && progresso.lidas >= progresso.total) {
    fala = guardiao.falas.completo;
  } else if (progresso.total - progresso.lidas === 1) {
    fala = guardiao.falas.quaseLa;
  } else if (progresso.lidas > 0) {
    fala = guardiao.falas.emProgresso;
  } else {
    fala = guardiao.falas.saudacao;
  }

  const faixa = document.createElement("div");
  faixa.className = "guardiao-faixa";
  faixa.innerHTML = `
    <span class="guardiao-avatar" aria-hidden="true">${guardiao.emoji}</span>
    <div class="balao-fala guardiao-balao">
      <strong class="font-display guardiao-nome">${guardiao.nome}</strong>
      <span class="font-body">${fala}</span>
    </div>
  `;
  return faixa;
}

function criarCardRunaNegra(runa) {
  const lida = typeof runaNegraFoiLida === "function" && runaNegraFoiLida(runa.id);
  // E.7 (simulador): o "check" dela é ter interagido com a ponte
  const construiu = runa.simulador && typeof obterEstadoJogo === "function" &&
    (obterEstadoJogo().simuladoresComXP || []).includes(runa.id);

  const card = document.createElement("div");
  card.className = "espada-card theme-oxblood runa-negra";
  if (lida || construiu) card.style.opacity = "0.7";

  card.innerHTML = `
    <span class="font-display runa-numero">${runa.id}</span>
    <span class="font-body" style="color: var(--pergaminho); flex:1;">
      ${runa.title}
    </span>
    ${construiu ? '<span style="font-size: 0.9rem;" title="Ponte trabalhada na forja">⚒️</span>' : ""}
    ${lida ? '<span style="color: #c93030; font-size: 0.9rem;" title="Já explorada">✓</span>' : ""}
  `;

  card.addEventListener("click", () => abrirModalRunaNegra(runa.id));

  return card;
}

function abrirModalRunaNegra(runaId) {
  const runa = ilhaAmaldicoada.runasNegras.find((r) => r.id === runaId);
  if (!runa) return;
  if (typeof somTocar === "function") somTocar("runa"); // som de abrir a runa (som.js)

  // XP próprio da Ilha — NUNCA passa por marcarRunaComoLida (contador das 45).
  // A runa E.7 (simulador) não dá XP de leitura: quem pontua lá é o simulador.
  if (!runa.simulador && typeof concederXPRunaNegra === "function") concederXPRunaNegra(runaId);
  renderizarListaBlocos(); // atualiza o ✓ no card por trás do modal

  fecharModalRuna();

  const overlay = document.createElement("div");
  overlay.id = "modal-overlay";
  overlay.style.cssText = `
    position: fixed; inset: 0; z-index: 50;
    background: rgba(6,7,10,0.85);
    display: flex; align-items: center; justify-content: center;
    padding: 1rem;
  `;

  const painel = document.createElement("div");
  painel.className = "painel-leitura capitular modal-runa-negra";
  painel.style.cssText = `
    max-width: 600px; width: 100%; max-height: 85vh; overflow-y: auto;
    padding: 2rem; position: relative;
  `;

  painel.innerHTML = `
    <button id="fechar-modal" aria-label="Fechar" class="btn-gotico"
      style="position:absolute; top:0.75rem; right:0.75rem; padding:0.3rem 0.7rem; font-size:0.9rem;">
      ✕
    </button>

    <h2 class="font-display" style="margin-top:0;">${runa.title}</h2>
    <p style="font-style: italic; opacity: 0.85;">${runa.subtitle}</p>

    <p>${runa.desc}</p>

    <div class="divisor-losango"><span>❖</span></div>

    <p><strong>⚰️ O que deu errado:</strong> ${runa.principal}</p>

    ${runa.secreta1 ? `<p><strong>🗝️ Segredo:</strong> ${runa.secreta1}</p>` : ""}
    ${runa.secreta2 ? `<p><strong>🗝️ Segredo:</strong> ${runa.secreta2}</p>` : ""}

    ${runa.dica ? `<p>${runa.dica}</p>` : ""}

    ${runa.licao ? `
      <div class="painel-pergaminho-velho" style="padding: 1rem; border-radius: 10px; margin: 1rem 0;">
        <strong>🕯️ A lição:</strong> ${runa.licao.texto}
        ${runa.licao.runaId ? `
          <button id="botao-runa-salvadora" class="btn-gotico" style="display:block; margin-top:0.75rem; font-size:0.75rem;">
            🔮 Estudar a runa salvadora (${runa.licao.runaId})
          </button>
        ` : ""}
      </div>
    ` : ""}

    <div class="divisor-rune"></div>
    <p style="font-style: italic; text-align: center;">${runa.fechamento || ""}</p>
  `;

  // Runa E.7: insere o simulador Monte Sua Ponte antes do fechamento
  if (runa.simulador && typeof criarPainelSimulacao === "function") {
    const painelSimulacao = criarPainelSimulacao(runa.id);
    if (painelSimulacao) {
      const divisor = painel.querySelector(".divisor-rune:last-of-type");
      painel.insertBefore(painelSimulacao, divisor);
    }
  }

  const botaoSalvadora = painel.querySelector("#botao-runa-salvadora");
  if (botaoSalvadora) {
    botaoSalvadora.addEventListener("click", () => abrirModalRuna(runa.licao.runaId));
  }

  overlay.appendChild(painel);
  document.body.appendChild(overlay);

  overlay.addEventListener("click", (evento) => {
    if (evento.target === overlay) fecharModalRuna();
  });
  document.getElementById("fechar-modal").addEventListener("click", fecharModalRuna);
  document.addEventListener("keydown", fecharComEsc);
}

// ---------- Mapa do Reino (telas largas) ----------

// Conta quantas runas do bloco já foram lidas (usa o progresso salvo do navegacao.js)
function calcularProgressoBloco(bloco) {
  const total = bloco.subtemas.length;
  const lidas = bloco.subtemas.filter(
    (st) => typeof runaFoiLida === "function" && runaFoiLida(st.id)
  ).length;
  return { lidas, total, completo: total > 0 && lidas === total, iniciado: lidas > 0 };
}

// Estado VISUAL do bloco no mapa — puramente cosmético, nenhum bloco fica travado
function estadoVisualBloco(progresso) {
  if (progresso.completo) return "completo";
  if (progresso.iniciado) return "em-progresso";
  return "nao-iniciado";
}

const ICONES_ESTADO_BLOCO = { "nao-iniciado": "○", "em-progresso": "◐", "completo": "✓" };

function renderizarMapaReino(container) {
  // A barra de navegação (irParaBloco) só conhece blocoAbertoId; aqui esse
  // pedido é incorporado à lista de blocos abertos do mapa.
  if (blocoAbertoId && !blocosAbertosDesktop.includes(blocoAbertoId)) {
    blocosAbertosDesktop.push(blocoAbertoId);
  }

  const grid = document.createElement("div");
  grid.className = "mapa-reino-grid";

  reinosDados.forEach((bloco) => {
    const progresso = calcularProgressoBloco(bloco);
    const estado = estadoVisualBloco(progresso);
    const aberto = blocosAbertosDesktop.includes(bloco.id);
    const rotuloEstado =
      estado === "completo"
        ? "todas as runas lidas!"
        : `${progresso.lidas} de ${progresso.total} runas lidas`;

    const tile = document.createElement("div");
    tile.className =
      `painel-reino-premium tile-reino tile-pos-${bloco.num} estado-${estado}` +
      (aberto ? " tile-aberto" : "");
    tile.style.setProperty("--cor-reino", bloco.hex); // medalhão, tinte e brilho via CSS
    tile.dataset.blocoId = bloco.id;

    tile.innerHTML = `
      <div class="cabecalho-bloco tile-cabecalho" role="button" tabindex="0"
           aria-expanded="${aberto}" aria-label="${bloco.title} — ${rotuloEstado}">
        ${typeof medalhaoBrasaoHTML === "function"
          ? medalhaoBrasaoHTML(bloco.id, 46)
          : `<span class="tile-numero">${bloco.num}</span>`}
        <h2 class="font-display tile-titulo">${bloco.title}</h2>
        <p class="font-body tile-subtitulo">${bloco.subtitle}</p>
        <span class="tile-estado" title="${rotuloEstado}">
          ${ICONES_ESTADO_BLOCO[estado]} ${progresso.lidas}/${progresso.total}
        </span>
      </div>
      <span class="tile-clima" aria-hidden="true"></span>
    `;

    const alternarBloco = () => {
      if (blocosAbertosDesktop.includes(bloco.id)) {
        blocosAbertosDesktop = blocosAbertosDesktop.filter((id) => id !== bloco.id);
        if (blocoAbertoId === bloco.id) blocoAbertoId = null;
      } else {
        blocosAbertosDesktop.push(bloco.id);
        blocoAbertoId = bloco.id; // mantém o modo celular apontando pro último aberto
        // Sino do reino (som.js) e transição de portal (portal.js)
        if (typeof somTocar === "function") somTocar("reino", bloco.id);
        if (typeof portalAoAbrirReino === "function") portalAoAbrirReino(bloco.id);
      }
      renderizarListaBlocos();
    };

    const cabecalho = tile.querySelector(".tile-cabecalho");
    cabecalho.addEventListener("click", alternarBloco);
    cabecalho.addEventListener("keydown", (evento) => {
      if (evento.key === "Enter" || evento.key === " ") {
        evento.preventDefault();
        alternarBloco();
      }
    });

    grid.appendChild(tile);
  });

  // Tile da Ilha Amaldiçoada (bônus) — ocupa a célula vazia do grid, fora da trilha dourada
  if (typeof ilhaAmaldicoada !== "undefined") {
    grid.appendChild(criarTileIlha());
  }

  container.appendChild(grid);

  // Painéis largos com as runas de cada bloco aberto, na ordem em que foram abertos
  blocosAbertosDesktop.forEach((blocoId) => {
    if (typeof ilhaAmaldicoada !== "undefined" && blocoId === ilhaAmaldicoada.id) {
      container.appendChild(criarPainelRunasIlha());
      return;
    }
    const bloco = reinosDados.find((b) => b.id === blocoId);
    if (bloco) container.appendChild(criarPainelRunasAberto(bloco));
  });
}

function criarTileIlha() {
  const { lidas, total } = calcularProgressoIlha();
  const aberto = blocosAbertosDesktop.includes(ilhaAmaldicoada.id);
  const rotulo = total > 0 && lidas >= total
    ? "todas as runas negras exploradas!"
    : `${lidas} de ${total} runas negras exploradas`;

  const tile = document.createElement("div");
  tile.className =
    "painel-reino-premium tile-reino tile-pos-ilha painel-ilha" + (aberto ? " tile-aberto" : "");
  tile.style.setProperty("--cor-reino", ilhaAmaldicoada.hex);
  tile.dataset.blocoId = ilhaAmaldicoada.id;

  tile.innerHTML = `
    <div class="cabecalho-bloco tile-cabecalho" role="button" tabindex="0"
         aria-expanded="${aberto}" aria-label="${ilhaAmaldicoada.title} — ${rotulo}">
      ${typeof medalhaoBrasaoHTML === "function"
        ? medalhaoBrasaoHTML(ilhaAmaldicoada.id, 46)
        : '<span class="tile-numero">💀</span>'}
      <h2 class="font-display tile-titulo titulo-reino">${ilhaAmaldicoada.title}</h2>
      <p class="font-body tile-subtitulo">${ilhaAmaldicoada.subtitle}</p>
      <span class="tile-estado" title="${rotulo}">${lidas}/${total}</span>
    </div>
    <span class="tile-clima" aria-hidden="true"></span>
  `;

  const alternarIlha = () => {
    if (blocosAbertosDesktop.includes(ilhaAmaldicoada.id)) {
      blocosAbertosDesktop = blocosAbertosDesktop.filter((id) => id !== ilhaAmaldicoada.id);
      if (blocoAbertoId === ilhaAmaldicoada.id) blocoAbertoId = null;
    } else {
      blocosAbertosDesktop.push(ilhaAmaldicoada.id);
      blocoAbertoId = ilhaAmaldicoada.id;
      // Sino (som.js) e portal (portal.js)
      if (typeof somTocar === "function") somTocar("reino", ilhaAmaldicoada.id);
      if (typeof portalAoAbrirReino === "function") portalAoAbrirReino(ilhaAmaldicoada.id);
    }
    renderizarListaBlocos();
  };

  const cabecalho = tile.querySelector(".tile-cabecalho");
  cabecalho.addEventListener("click", alternarIlha);
  cabecalho.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter" || evento.key === " ") {
      evento.preventDefault();
      alternarIlha();
    }
  });

  return tile;
}

function criarPainelRunasIlha() {
  const painel = document.createElement("div");
  painel.className = "painel-reino-premium painel-runas-aberto painel-ilha animate-fadeIn";
  painel.style.setProperty("--cor-reino", ilhaAmaldicoada.hex);

  painel.innerHTML = `
    <div class="painel-runas-cabecalho">
      <div class="painel-runas-identidade">
        ${typeof medalhaoBrasaoHTML === "function"
          ? medalhaoBrasaoHTML(ilhaAmaldicoada.id, 40, "painel-runas-medalhao")
          : '<span class="tile-numero painel-runas-medalhao">💀</span>'}
        <div>
          <h3 class="font-display titulo-reino" style="margin:0 0 0.25rem; font-size:1.2rem;">${ilhaAmaldicoada.title}</h3>
          <p class="font-body" style="color: var(--pergaminho-escuro); margin:0;">${ilhaAmaldicoada.subtitle}</p>
          ${typeof lemaReinoHTML === "function" ? lemaReinoHTML(ilhaAmaldicoada.id) : ""}
        </div>
      </div>
      <button class="btn-gotico botao-fechar-painel" aria-label="Fechar runas da Ilha Amaldiçoada"
        style="padding:0.3rem 0.7rem; font-size:0.9rem;">✕</button>
    </div>
    <div class="divisor-rune"></div>
    <div class="lista-runas" style="display:grid; gap:0.75rem; margin-top:1rem;"></div>
  `;

  const lista = painel.querySelector(".lista-runas");
  const faixa = criarFaixaGuardiao(ilhaAmaldicoada.id, calcularProgressoIlha());
  if (faixa) painel.insertBefore(faixa, lista);
  ilhaAmaldicoada.runasNegras.forEach((runa) => lista.appendChild(criarCardRunaNegra(runa)));

  painel.querySelector(".botao-fechar-painel").addEventListener("click", () => {
    blocosAbertosDesktop = blocosAbertosDesktop.filter((id) => id !== ilhaAmaldicoada.id);
    if (blocoAbertoId === ilhaAmaldicoada.id) blocoAbertoId = null;
    renderizarListaBlocos();
  });

  return painel;
}

function criarPainelRunasAberto(bloco) {
  const painel = document.createElement("div");
  painel.className = "painel-reino-premium painel-runas-aberto animate-fadeIn";
  painel.style.setProperty("--cor-reino", bloco.hex);
  painel.style.setProperty("--cor-reino-titulo", misturarCorReino(bloco.hex, "#ffffff", 0.6));

  painel.innerHTML = `
    <div class="painel-runas-cabecalho">
      <div class="painel-runas-identidade">
        ${typeof medalhaoBrasaoHTML === "function"
          ? medalhaoBrasaoHTML(bloco.id, 40, "painel-runas-medalhao")
          : `<span class="tile-numero painel-runas-medalhao">${bloco.num}</span>`}
        <div>
          <h3 class="font-display titulo-reino" style="margin:0 0 0.25rem; font-size:1.2rem;">${bloco.title}</h3>
          <p class="font-body" style="color: var(--pergaminho-escuro); margin:0;">${bloco.subtitle}</p>
          ${typeof lemaReinoHTML === "function" ? lemaReinoHTML(bloco.id) : ""}
        </div>
      </div>
      <button class="btn-gotico botao-fechar-painel" aria-label="Fechar runas de ${bloco.title}"
        style="padding:0.3rem 0.7rem; font-size:0.9rem;">✕</button>
    </div>
    <div class="divisor-rune"></div>
    <div class="lista-runas" style="display:grid; gap:0.75rem; margin-top:1rem;"></div>
  `;

  const lista = painel.querySelector(".lista-runas");
  const faixa = criarFaixaGuardiao(bloco.id, calcularProgressoBloco(bloco));
  if (faixa) painel.insertBefore(faixa, lista);
  // Link pro capítulo deste reino na Crônica Fundadora (cronica.js)
  if (typeof criarLinkCronicaReino === "function") {
    const linkCronica = criarLinkCronicaReino(bloco.id);
    if (linkCronica) painel.insertBefore(linkCronica, lista);
  }
  bloco.subtemas.forEach((subtema) => {
    lista.appendChild(criarCardRuna(subtema, bloco));
  });

  painel.querySelector(".botao-fechar-painel").addEventListener("click", () => {
    blocosAbertosDesktop = blocosAbertosDesktop.filter((id) => id !== bloco.id);
    if (blocoAbertoId === bloco.id) blocoAbertoId = null;
    renderizarListaBlocos();
  });

  return painel;
}

// ---------- Card de cada runa (dentro do bloco) ----------

function criarCardRuna(subtema, bloco) {
  const dadosRuna = dadosEspecificosCards[subtema.id];
  const lida = runaFoiLida(subtema.id);
  const desafioResolvido = !!(dadosRuna && dadosRuna.desafio && typeof desafioFoiResolvido === "function" && desafioFoiResolvido(subtema.id));

  const card = document.createElement("div");
  card.className = `espada-card theme-${temaCorPorBloco(bloco.num)}${desafioResolvido ? " runa-desafio-resolvido" : ""}`;
  if (lida) card.style.opacity = "0.7";

  card.innerHTML = `
    <span class="font-display runa-numero">${subtema.id}</span>
    <span class="font-body" style="color: var(--pergaminho); flex:1;">
      ${dadosRuna ? dadosRuna.title : subtema.title}
    </span>
    ${typeof runaEhFavorita === "function" && runaEhFavorita(subtema.id) ? '<span style="font-size:0.9rem;" title="Favorita — marcada pra revisão">⭐</span>' : ""}
    ${desafioResolvido ? '<span style="font-size:0.9rem;" title="Desafio resolvido">🏆</span>' : ""}
    ${lida ? '<span style="color: var(--ciano-mistico); font-size: 0.9rem;" title="Já lida">✓</span>' : ""}
  `;

  card.addEventListener("click", () => abrirModalRuna(subtema.id));

  return card;
}

// Associa um bloco a uma variação de cor de hover já existente no CSS
function temaCorPorBloco(blocoId) {
  const temas = ["indigo", "laranja", "ambar", "cinza", "vermelho", "ciano", "roxo"];
  return temas[blocoId] || "cinza";
}

// ---------- Modal de leitura de uma runa ----------

function abrirModalRuna(runaId) {
  const dadosRuna = dadosEspecificosCards[runaId];
  if (!dadosRuna) return;
  if (typeof somTocar === "function") somTocar("runa"); // antes do XP: na fila sai "runa" e depois a faísca do +XP

  marcarRunaComoLida(runaId);
  renderizarListaBlocos(); // atualiza o ✓ no card por trás do modal

  fecharModalRuna(); // garante que não abre 2 modais empilhados

  const overlay = document.createElement("div");
  overlay.id = "modal-overlay";
  overlay.style.cssText = `
    position: fixed; inset: 0; z-index: 50;
    background: rgba(6,7,10,0.85);
    display: flex; align-items: center; justify-content: center;
    padding: 1rem;
  `;

  const painel = document.createElement("div");
  painel.className = "painel-leitura capitular";
  painel.style.cssText = `
    max-width: 600px; width: 100%; max-height: 85vh; overflow-y: auto;
    padding: 2rem; position: relative;
  `;

  painel.innerHTML = `
    <button id="fechar-modal" aria-label="Fechar" class="btn-gotico"
      style="position:absolute; top:0.75rem; right:0.75rem; padding:0.3rem 0.7rem; font-size:0.9rem;">
      ✕
    </button>

    ${typeof runaEhFavorita === "function" ? `
      <button id="botao-favoritar-runa" aria-label="Favoritar runa" class="btn-gotico"
        title="Marcar/desmarcar pra revisar depois"
        style="position:absolute; top:0.75rem; right:3.4rem; padding:0.3rem 0.7rem; font-size:0.9rem;">
        ${runaFoiFavoritadaTexto(runaId)}
      </button>
    ` : ""}

    <h2 class="font-display" style="margin-top:0;">${dadosRuna.title}</h2>
    <p style="font-style: italic; opacity: 0.85;">${dadosRuna.subtitle}</p>

    <p>${dadosRuna.desc}</p>

    <div class="divisor-losango"><span>❖</span></div>

    <p><strong>🔮 Curiosidade principal:</strong> ${dadosRuna.principal}</p>

    ${dadosRuna.secreta1 ? `<p><strong>🗝️ Segredo:</strong> ${dadosRuna.secreta1}</p>` : ""}
    ${dadosRuna.secreta2 ? `<p><strong>🗝️ Segredo:</strong> ${dadosRuna.secreta2}</p>` : ""}

    ${dadosRuna.desafio ? `
      <div class="painel-pergaminho-velho" style="padding: 1rem; border-radius: 10px; margin: 1rem 0;">
        <strong>⚔️ Desafio:</strong> ${dadosRuna.desafio}
        <button id="botao-desafio-resolvido" class="btn-gotico" style="display:block; margin-top:0.75rem; font-size:0.75rem;"
          ${typeof desafioFoiResolvido === "function" && desafioFoiResolvido(runaId) ? "disabled" : ""}>
          ${typeof desafioFoiResolvido === "function" && desafioFoiResolvido(runaId) ? "✅ Desafio resolvido!" : "✅ Marcar como resolvido"}
        </button>
      </div>
    ` : ""}

    ${dadosRuna.dica ? `<p>${dadosRuna.dica}</p>` : ""}

    <div class="divisor-rune"></div>
    <p style="font-style: italic; text-align: center;">${dadosRuna.fechamento || ""}</p>

    ${typeof obterNotaRuna === "function" ? `
      <div class="divisor-rune"></div>
      <h3 class="font-display" style="font-size:0.95rem; margin-bottom:0.4rem;">📝 Caderno do Aprendiz</h3>
      <textarea id="caderno-runa" class="caderno-textarea" maxlength="600" rows="4"
        placeholder="Escreva aqui, com suas palavras, o que você aprendeu nesta runa..."></textarea>
      <p style="font-size:0.7rem; opacity:0.7; margin:0.25rem 0 0;">Salvo automaticamente no seu navegador. Faça anotações em 5 runas e ganhe o selo ✍️ Escriba do Reino!</p>
    ` : ""}
  `;

  // Se essa runa tiver um simulador interativo (definido em simuladores.js),
  // ele é inserido logo depois da dica, antes da frase de fechamento.
  // Usa o PRIMEIRO .divisor-rune (o do fechamento) — o Caderno do Aprendiz
  // adicionou um segundo divisor no fim, então ":last-of-type" pegaria o errado.
  const painelSimulacao = criarPainelSimulacao(runaId);
  if (painelSimulacao) {
    const divisor = painel.querySelector(".divisor-rune");
    painel.insertBefore(painelSimulacao, divisor);
  }

  const botaoFavoritar = painel.querySelector("#botao-favoritar-runa");
  if (botaoFavoritar) {
    botaoFavoritar.addEventListener("click", () => {
      if (typeof alternarRunaFavorita === "function") {
        const favoritaAgora = alternarRunaFavorita(runaId);
        botaoFavoritar.textContent = favoritaAgora ? "⭐" : "☆";
        renderizarListaBlocos(); // atualiza a ⭐ no card por trás do modal
      }
    });
  }

  // Caderno do Aprendiz: carrega a nota salva e salva conforme se escreve
  const caderno = painel.querySelector("#caderno-runa");
  if (caderno) {
    caderno.value = obterNotaRuna(runaId);
    let timerNota = null;
    caderno.addEventListener("input", () => {
      clearTimeout(timerNota);
      timerNota = setTimeout(() => salvarNotaRuna(runaId, caderno.value), 400);
    });
    caderno.addEventListener("blur", () => {
      clearTimeout(timerNota);
      salvarNotaRuna(runaId, caderno.value);
    });
  }

  const botaoDesafio = painel.querySelector("#botao-desafio-resolvido");
  if (botaoDesafio) {
    botaoDesafio.addEventListener("click", () => {
      if (typeof marcarDesafioResolvido === "function") {
        marcarDesafioResolvido(runaId);
        botaoDesafio.textContent = "✅ Desafio resolvido!";
        botaoDesafio.disabled = true;
        renderizarListaBlocos(); // atualiza o troféu no card por trás do modal
      }
    });
  }

  overlay.appendChild(painel);
  document.body.appendChild(overlay);

  // Fecha ao clicar fora do painel ou no botão X
  overlay.addEventListener("click", (evento) => {
    if (evento.target === overlay) fecharModalRuna();
  });
  document.getElementById("fechar-modal").addEventListener("click", fecharModalRuna);

  // Fecha com a tecla Esc
  document.addEventListener("keydown", fecharComEsc);
}

// Estrela cheia se a runa já é favorita, vazia se não (usado no botão do modal)
function runaFoiFavoritadaTexto(runaId) {
  return typeof runaEhFavorita === "function" && runaEhFavorita(runaId) ? "⭐" : "☆";
}

function fecharComEsc(evento) {
  if (evento.key === "Escape") fecharModalRuna();
}

function fecharModalRuna() {
  const overlay = document.getElementById("modal-overlay");
  if (overlay) overlay.remove();
  document.removeEventListener("keydown", fecharComEsc);
}

// ---------- Inicialização ----------

// Redesenha ao cruzar a fronteira celular/desktop (girar tablet, redimensionar janela)
let estavaNoMapaDesktop = null;
let timerResizeMapa = null;

window.addEventListener("resize", () => {
  clearTimeout(timerResizeMapa);
  timerResizeMapa = setTimeout(() => {
    const agora = modoMapaDesktop();
    if (agora !== estavaNoMapaDesktop) {
      estavaNoMapaDesktop = agora;
      renderizarListaBlocos();
    }
  }, 150);
});

document.addEventListener("DOMContentLoaded", () => {
  estavaNoMapaDesktop = modoMapaDesktop();
  renderizarListaBlocos();
});
