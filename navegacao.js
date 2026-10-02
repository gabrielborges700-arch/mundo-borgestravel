/**
 * navegacao.js — Navegação entre blocos e progresso salvo (Fase 8)
 *
 * - Barra fixa no topo com atalho pra cada um dos 7 blocos (rola a
 *   página até o bloco e já abre ele).
 * - Progresso salvo no navegador (localStorage): quais das 45 runas
 *   você já leu. Continua salvo mesmo se fechar a aba ou desligar o PC
 *   (só se perde se limpar os dados do navegador).
 * - Contador "X / 45 runas lidas" na barra de navegação.
 * - Botão flutuante "voltar ao topo".
 */

const CHAVE_PROGRESSO = "borgestravel_runas_lidas";

// ---------- Progresso (localStorage) ----------

function obterRunasLidas() {
  try {
    const salvo = localStorage.getItem(CHAVE_PROGRESSO);
    return salvo ? JSON.parse(salvo) : [];
  } catch (erro) {
    return []; // se der erro (ex: navegador bloqueando), só não salva progresso
  }
}

function marcarRunaComoLida(runaId) {
  const lidas = obterRunasLidas();
  const jaEstavaLida = lidas.includes(runaId);
  if (!jaEstavaLida) {
    lidas.push(runaId);
    try {
      localStorage.setItem(CHAVE_PROGRESSO, JSON.stringify(lidas));
    } catch (erro) {
      // se o navegador bloquear localStorage, o site continua funcionando normal,
      // só não salva o progresso entre visitas
    }
  }
  atualizarContadorProgresso();
  // Hook do sistema de jogo (jogo.js) — concede XP só na primeira leitura da runa
  if (!jaEstavaLida && typeof concederXPLeitura === "function") {
    concederXPLeitura(runaId);
  }
}

function runaFoiLida(runaId) {
  return obterRunasLidas().includes(runaId);
}

function atualizarContadorProgresso() {
  const contador = document.getElementById("contador-progresso");
  if (!contador) return;
  const total = Object.keys(dadosEspecificosCards).length;
  contador.textContent = `${obterRunasLidas().length} / ${total} runas lidas`;
}

// ---------- Barra de navegação fixa ----------

function montarBarraNavegacao() {
  const barra = document.createElement("nav");
  barra.id = "barra-navegacao";
  barra.className = "barra-navegacao";
  barra.setAttribute("aria-label", "Navegação entre blocos");

  const listaBotoes = document.createElement("div");
  listaBotoes.className = "barra-navegacao-lista";

  reinosDados.forEach((bloco) => {
    const botao = document.createElement("button");
    botao.textContent = bloco.num;
    botao.title = bloco.title;
    botao.className = "botao-bloco-nav";
    // "data-nav-bloco" (e NÃO "data-bloco-id") de propósito: o atributo
    // data-bloco-id é o contrato dos painéis com jogo.js/app.js, e usá-lo
    // aqui faria os botões da barra serem confundidos com os painéis.
    botao.dataset.navBloco = bloco.id;
    // A cor vem dos dados de cada bloco; o CSS deriva gradiente e brilho dela
    botao.style.setProperty("--cor-reino", bloco.hex);
    botao.addEventListener("click", () => irParaBloco(bloco.id));
    listaBotoes.appendChild(botao);
  });

  // Ilha Amaldiçoada (conteúdo bônus) — botão 💀 no fim da fileira
  if (typeof ilhaAmaldicoada !== "undefined") {
    const botaoIlha = document.createElement("button");
    botaoIlha.textContent = "💀";
    botaoIlha.title = ilhaAmaldicoada.title;
    botaoIlha.className = "botao-bloco-nav";
    botaoIlha.dataset.navBloco = ilhaAmaldicoada.id;
    botaoIlha.style.setProperty("--cor-reino", ilhaAmaldicoada.hex);
    botaoIlha.addEventListener("click", () => irParaBloco(ilhaAmaldicoada.id));
    listaBotoes.appendChild(botaoIlha);
  }

  const contador = document.createElement("span");
  contador.id = "contador-progresso";
  contador.className = "contador-progresso";

  barra.appendChild(listaBotoes);
  barra.appendChild(contador);
  document.body.insertBefore(barra, document.body.firstChild);

  atualizarContadorProgresso();
}

// ---------- Indicador de "bloco ativo" na barra ----------
// Observa os painéis dos blocos e acende o botão correspondente na barra
// quando o painel cruza a faixa central da tela.

let observadorSecaoAtiva = null;

function configurarObservadorSecaoAtiva() {
  if (!("IntersectionObserver" in window)) return; // navegador antigo: só não acende, sem erro

  observadorSecaoAtiva = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        const blocoId = entrada.target.dataset.blocoId;
        document.querySelectorAll(".botao-bloco-nav").forEach((botao) => {
          botao.classList.toggle("ativo", botao.dataset.navBloco === blocoId);
        });
      });
    },
    // Só "conta" quando o painel cruza a faixa central da tela (10% do meio)
    { rootMargin: "-45% 0px -45% 0px" }
  );
}

// Chamado pelo app.js no fim de cada renderizarListaBlocos(): o innerHTML
// destrói os painéis antigos, então é preciso observar os recém-criados.
function reobservarSecaoAtiva() {
  if (!observadorSecaoAtiva) return;
  observadorSecaoAtiva.disconnect();
  document
    .querySelectorAll("#lista-blocos [data-bloco-id]")
    .forEach((painel) => observadorSecaoAtiva.observe(painel));
}

// Rola até o bloco e garante que ele esteja aberto (função de app.js)
function irParaBloco(blocoId) {
  blocoAbertoId = blocoId;
  renderizarListaBlocos();

  // Espera o próximo frame pra garantir que o bloco já foi desenhado antes de rolar até ele
  requestAnimationFrame(() => {
    const alvo = document.querySelector(`[data-bloco-id="${blocoId}"]`);
    if (alvo) alvo.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

// ---------- Botão "voltar ao topo" ----------

function montarBotaoVoltarTopo() {
  const botao = document.createElement("button");
  botao.id = "botao-topo";
  botao.setAttribute("aria-label", "Voltar ao topo");
  botao.textContent = "↑";
  botao.style.cssText = `
    position: fixed; bottom: 1rem; left: 1rem; z-index: 55;
    width: 42px; height: 42px; border-radius: 50%;
    background: var(--pedra-ardosia); color: var(--ouro-velho);
    border: 1px solid var(--bronze-envelhecido); font-size: 1.1rem; cursor: pointer;
    box-shadow: 0 4px 10px rgba(0,0,0,0.5);
    display: none;
  `;
  botao.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  document.body.appendChild(botao);

  window.addEventListener("scroll", () => {
    botao.style.display = window.scrollY > 400 ? "block" : "none";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  montarBarraNavegacao();
  montarBotaoVoltarTopo();
  configurarObservadorSecaoAtiva();
});
