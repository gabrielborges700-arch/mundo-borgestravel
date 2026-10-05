/**
 * cadeados.js — Escudos trancados: cadeado nas provas que o jogo JÁ trava
 *
 * Camada só visual por cima do jogo.js: não tranca nada novo. Mostra um
 * brasão acorrentado com cadeado onde hoje existe uma prova ainda fechada,
 * pra criança enxergar a meta ("leia mais 3 runas") em vez de um vazio:
 * - Julgamento do Reino: reino com runas ainda não lidas.
 * - Julgamento Supremo: reino completo, mas com o Julgamento ainda não vencido.
 * - Sprint e Torre: sem nenhum reino completo (continuam clicáveis; o aviso
 *   do jogo.js continua igual).
 * - Certificado: enquanto concluiuTudo() for falso.
 * - Selos ainda não conquistados da Galeria (e ficam legíveis: antes a
 *   opacidade 0,35 deixava o nome com ≈2,8:1 de contraste).
 * Runas, simuladores, reinos, a Ilha e a Crônica NUNCA recebem cadeado.
 *
 * Os cadeados são informativos: <div role="note">, sem clique, sem botão e
 * SEM data-bloco-id (esse atributo é o contrato dos painéis com jogo.js/app.js,
 * e o teste conta os botões filhos diretos de [data-bloco-id]).
 *
 * "Destrancou nesta visita" fica só em memória (nada vai pro armazenamento):
 * toast 🔓 + brilho dourado no botão recém-liberado até o primeiro clique.
 *
 * Carregar DEPOIS do jogo.js: encadeia aposRenderizarBlocos e
 * atualizarGaleriaConquistas (ver o fim do arquivo). Depende de reinosDados,
 * dadosEspecificosCards (dados.js), criarBrasaoSVG (brasoes.js),
 * runaFoiLida (navegacao.js), blocoAbertoId/modoMapaDesktop (app.js) e
 * obterEstadoJogo/montarPoolSprint/concluiuTudo/mostrarToast (jogo.js) —
 * todos consultados com typeof.
 */

const CADEADO_SVG_NS = "http://www.w3.org/2000/svg";

// Paleta do cadeado (bronze do EscudoModulo do Base44): contorno quase preto,
// elos de bronze e corpo marfim — o marfim fica bem acima de 3:1 sobre o
// brasão escurecido pelo .escudo-modulo-bloqueado.
const CADEADO_COR_CONTORNO = "#161018";
const CADEADO_COR_CORRENTE = "#b08850";
const CADEADO_COR_CORPO = "#f1e4c3";

// Tamanhos do brasão: faixa do painel (celular) e versão compacta do tile (mapa)
const CADEADO_TAMANHO_BRASAO = 36;
const CADEADO_TAMANHO_COMPACTO = 24;

// Quanto o cadeado cresce sobre o escudo (legibilidade em 18–36px)
const CADEADO_ESCALA_NO_ESCUDO = 1.5;

// Texto lido pelo leitor de tela nos botões Sprint/Torre trancados
const CADEADO_DICA_DESAFIOS = "Trancado: leia todas as runas de um reino para destrancar.";

// Estado da passada anterior: { julgamento: Set, supremo: Set } com os ids
// dos reinos que estavam com cada cadeado. null = página acabou de abrir.
let cadeadosEstadoAnterior = null;

// Provas destrancadas nesta visita ("bloco0:julgamento", "bloco0:supremo"):
// o botão do jogo.js ganha brilho até o primeiro clique. Só em memória.
const cadeadosRecemAbertos = new Set();

// ---------- Desenho do cadeado ----------

// origem: EscudoModulo do BORGESTR-VEL e do Base44 — o grupo do estado
// bloqueado (4 elos inclinados −25° + cadeado), com as coordenadas do
// viewBox 200×240 divididas por 2 pro 100×120 dos brasões.
// mini = true → só o cadeado, num viewBox recortado em volta dele
// (selos da galeria, botões e certificado: em 12–22px os elos virariam borrão).
function criarSvgCadeado(mini) {
  // Cria um elemento SVG com atributos (mesmo jeito do brasoes.js)
  const criarElementoCadeado = (tag, atributos) => {
    const el = document.createElementNS(CADEADO_SVG_NS, tag);
    Object.keys(atributos || {}).forEach((nome) => el.setAttribute(nome, atributos[nome]));
    return el;
  };
  const svg = criarElementoCadeado("svg", {
    viewBox: mini ? "37 61 26 27" : "0 0 100 120",
    class: mini ? "cadeado-svg cadeado-svg-mini" : "cadeado-svg",
    "aria-hidden": "true",
    focusable: "false"
  });

  if (!mini) {
    // Correntes: cada elo desenhado 2 vezes — contorno escuro por baixo e
    // bronze por cima — pra continuar visível sobre qualquer campo de brasão
    const elos = [[35, 44], [46, 51], [57, 58], [68, 65]];
    [[CADEADO_COR_CONTORNO, 3.6], [CADEADO_COR_CORRENTE, 2]].forEach(([cor, largura]) => {
      elos.forEach(([cx, cy]) => {
        svg.appendChild(criarElementoCadeado("ellipse", {
          cx, cy, rx: 5.5, ry: 3.5, fill: "none", stroke: cor, "stroke-width": largura,
          transform: `rotate(-25 ${cx} ${cy})`
        }));
      });
    });
  }

  // O cadeado mora num grupo próprio. No escudo ele cresce 1,5× a partir do
  // topo da alça (50,64), crescendo pra baixo: com o desenho original, num
  // brasão de 36px o corpo teria só 5px. Os elos e as coordenadas não mudam.
  const cadeado = criarElementoCadeado("g", mini ? {} : { transform: `translate(50 64) scale(${CADEADO_ESCALA_NO_ESCUDO}) translate(-50 -64)` });
  // Alça em arco: contorno escuro por baixo, marfim por cima
  const alca = "M45,75 L45,69 A5,5 0 0,1 55,69 L55,75";
  cadeado.appendChild(criarElementoCadeado("path", { d: alca, fill: "none", stroke: CADEADO_COR_CONTORNO, "stroke-width": 4.5 }));
  cadeado.appendChild(criarElementoCadeado("path", { d: alca, fill: "none", stroke: CADEADO_COR_CORPO, "stroke-width": 2.5 }));
  // Corpo e buraco da chave
  cadeado.appendChild(criarElementoCadeado("rect", {
    x: 43, y: 75, width: 14, height: 12, rx: 2,
    fill: CADEADO_COR_CORPO, stroke: CADEADO_COR_CONTORNO, "stroke-width": 1
  }));
  cadeado.appendChild(criarElementoCadeado("circle", { cx: 50, cy: 80.5, r: 1.5, fill: CADEADO_COR_CONTORNO }));
  svg.appendChild(cadeado);

  return svg;
}

// ---------- Cadeados dos Julgamentos (painéis e tiles) ----------

// Monta a faixa (ou a versão compacta do tile) de uma prova trancada.
// tipo: "julgamento" (faltam = runas que ainda faltam) ou "supremo".
function criarProvaTrancada(bloco, tipo, lidas, total, compacta) {
  const faltam = total - lidas;
  const titulo = tipo === "julgamento" ? "Julgamento do Reino" : "Julgamento Supremo";
  const acao = tipo === "julgamento"
    ? `Leia mais ${faltam} ${faltam === 1 ? "runa" : "runas"} deste reino para destrancar`
    : "Vença o Julgamento do Reino para destrancar";

  const prova = document.createElement("div");
  prova.className = compacta ? "prova-trancada prova-compacta" : "prova-trancada";
  prova.setAttribute("role", "note");
  prova.title = `${titulo} trancado: ${acao.charAt(0).toLowerCase()}${acao.slice(1)}.`;

  // Brasão do reino escurecido + cadeado sobreposto. O cadeado fica FORA do
  // elemento filtrado (irmão, em position absolute): se ficasse dentro, o
  // grayscale/brightness do .escudo-modulo-bloqueado apagaria o cadeado junto.
  const tamanho = compacta ? CADEADO_TAMANHO_COMPACTO : CADEADO_TAMANHO_BRASAO;
  const escudo = document.createElement("span");
  escudo.className = "escudo-trancado";
  escudo.setAttribute("aria-hidden", "true");
  const brasao = typeof criarBrasaoSVG === "function"
    ? criarBrasaoSVG(bloco.id, tamanho, { decorativo: true })
    : null;
  if (brasao) {
    brasao.classList.add("escudo-modulo-bloqueado");
    // Sem o <title> do lema: senão a dica do mouse sobre o escudo mostraria
    // o lema em vez da frase do cadeado (o title da faixa)
    const tituloBrasao = brasao.querySelector("title");
    if (tituloBrasao) tituloBrasao.remove();
    escudo.appendChild(brasao);
  } else {
    // sem brasoes.js: reserva o mesmo espaço pro cadeado não ficar solto
    escudo.style.width = `${tamanho}px`;
    escudo.style.height = `${Math.round(tamanho * 1.2)}px`;
  }
  escudo.appendChild(criarSvgCadeado(false));
  prova.appendChild(escudo);

  const texto = document.createElement("div");
  texto.className = "prova-trancada-texto";

  if (compacta) {
    // No tile do mapa: uma linha só; a frase completa fica no title (e no leitor de tela).
    // Sem o 🔒 no texto: o cadeado já está desenhado sobre o brasão, logo ao lado
    const linha = document.createElement("span");
    linha.textContent = tipo === "julgamento"
      ? `Julgamento: faltam ${faltam}`
      : "Supremo: vença o Julgamento";
    const leitor = document.createElement("span");
    leitor.className = "sr-only";
    leitor.textContent = ` (${titulo}: ${acao.charAt(0).toLowerCase()}${acao.slice(1)})`;
    texto.appendChild(linha);
    texto.appendChild(leitor);
  } else {
    const forte = document.createElement("strong");
    forte.className = "font-display";
    forte.textContent = titulo;
    const linha = document.createElement("span");
    linha.textContent = `🔒 ${acao}`;
    texto.appendChild(forte);
    texto.appendChild(linha);
    // Trilho lidas/total na cor do reino (--cor-reino, que o painel já define)
    if (tipo === "julgamento") {
      const trilho = document.createElement("span");
      trilho.className = "prova-trancada-trilho";
      trilho.setAttribute("aria-hidden", "true");
      const preenchido = document.createElement("span");
      preenchido.style.width = `${total > 0 ? Math.round((lidas / total) * 100) : 0}%`;
      trilho.appendChild(preenchido);
      texto.appendChild(trilho);
    }
  }

  prova.appendChild(texto);
  return prova;
}

// Desenha os cadeados dos Julgamentos. Idempotente: começa tirando tudo o
// que uma passada anterior pôs (pode rodar várias vezes sem re-render).
function desenharCadeadosReinos() {
  const lista = document.getElementById("lista-blocos");
  if (!lista || typeof reinosDados === "undefined" || typeof obterEstadoJogo !== "function") return;

  lista.querySelectorAll(".prova-trancada").forEach((antiga) => antiga.remove());

  const estado = obterEstadoJogo();
  const missoes = estado.missoesCompletas || [];
  const mapa = typeof modoMapaDesktop === "function" && modoMapaDesktop();
  const abertoId = typeof blocoAbertoId !== "undefined" ? blocoAbertoId : null;
  const trancadosAgora = { julgamento: new Set(), supremo: new Set() };

  reinosDados.forEach((bloco) => {
    if (bloco.id === "ilha") return; // a Ilha nunca recebe cadeado
    const total = bloco.subtemas.length;
    const lidas = bloco.subtemas.filter((st) => typeof runaFoiLida === "function" && runaFoiLida(st.id)).length;
    const completo = lidas >= total;
    const missaoFeita = missoes.includes(bloco.id);

    let tipo = null;
    if (!completo) tipo = "julgamento";
    else if (!missaoFeita) tipo = "supremo";
    if (!tipo) return;
    trancadosAgora[tipo].add(bloco.id); // o estado vale pra todos os reinos, mesmo os que não mostram nada

    // Sempre no MESMO lugar onde o botão do jogo.js nasce ao destrancar: no fim do painel/tile
    if (mapa) {
      // Mapa desktop: versão compacta em todos os tiles dos 7 reinos
      const tile = lista.querySelector(`.tile-reino[data-bloco-id="${bloco.id}"]`);
      if (tile) tile.appendChild(criarProvaTrancada(bloco, tipo, lidas, total, true));
    } else if (abertoId === bloco.id) {
      // Celular/tablet: só no painel aberto (painéis fechados ficam limpos)
      const painel = lista.querySelector(`[data-bloco-id="${bloco.id}"]`);
      if (painel) painel.appendChild(criarProvaTrancada(bloco, tipo, lidas, total, false));
    }
  });

  // Destrancou nesta visita? Compara com a passada anterior; na primeira
  // passada (abertura da página) só guarda o estado, sem toast.
  if (cadeadosEstadoAnterior) {
    reinosDados.forEach((bloco) => {
      const nome = (bloco.title.split("—")[1] || bloco.title).trim(); // igual ao jogo.js
      if (cadeadosEstadoAnterior.julgamento.has(bloco.id) && !trancadosAgora.julgamento.has(bloco.id)) {
        cadeadosRecemAbertos.add(`${bloco.id}:julgamento`);
        if (typeof mostrarToast === "function") mostrarToast(`Julgamento destrancado: ${nome}!`, "🔓");
      } else if (cadeadosEstadoAnterior.supremo.has(bloco.id) && !trancadosAgora.supremo.has(bloco.id)
        && !trancadosAgora.julgamento.has(bloco.id)) {
        cadeadosRecemAbertos.add(`${bloco.id}:supremo`);
        if (typeof mostrarToast === "function") mostrarToast(`Julgamento Supremo destrancado: ${nome}!`, "🔓");
      }
    });
  }
  // Se uma prova voltou a trancar (progresso apagado), o brilho não vale mais
  cadeadosRecemAbertos.forEach((chave) => {
    const [blocoId, tipo] = chave.split(":");
    if (trancadosAgora.julgamento.has(blocoId) || (tipo === "supremo" && trancadosAgora.supremo.has(blocoId))) {
      cadeadosRecemAbertos.delete(chave);
    }
  });
  cadeadosEstadoAnterior = trancadosAgora;

  // Brilho dourado nos botões do jogo.js recém-destrancados (sem som novo:
  // a conquista Guardião já toca no mesmo instante). O 1º botão
  // .botao-julgamento-reino do painel/tile é o Julgamento; o 2º, o Supremo.
  cadeadosRecemAbertos.forEach((chave) => {
    const [blocoId, tipo] = chave.split(":");
    lista.querySelectorAll(`[data-bloco-id="${blocoId}"]`).forEach((painelDom) => {
      const botao = painelDom.querySelectorAll(".botao-julgamento-reino")[tipo === "supremo" ? 1 : 0];
      if (!botao) return;
      botao.classList.add("botao-recem-destrancado");
      // Listener próprio (o do jogo.js continua abrindo o Julgamento normalmente)
      botao.addEventListener("click", () => {
        cadeadosRecemAbertos.delete(chave);
        botao.classList.remove("botao-recem-destrancado");
      }, { once: true });
    });
  });

  // O certificado mostra "X/45": ler uma runa redesenha a lista, mas nem
  // sempre a galeria (só quando sai selo novo) — então atualiza junto aqui.
  decorarGaleriaComCadeados();
}

// ---------- Galeria de Conquistas ----------

// Decora a galeria que o atualizarGaleriaConquistas (jogo.js) acabou de montar
function decorarGaleriaComCadeados() {
  const secao = document.getElementById("galeria-conquistas");
  const grade = document.getElementById("grade-conquistas");
  if (!secao || !grade || typeof obterEstadoJogo !== "function" || typeof CONQUISTAS_DEFINICOES === "undefined") return;

  const estado = obterEstadoJogo();
  const conquistas = estado.conquistas || [];

  // Selos: mesma ordem do CONQUISTAS_DEFINICOES. Continuam <div>.
  const itens = grade.children;
  CONQUISTAS_DEFINICOES.forEach((def, i) => {
    const item = itens[i];
    if (!item || conquistas.includes(def.id) || item.classList.contains("selo-trancado")) return;
    item.classList.add("selo-trancado");
    item.style.opacity = "";      // tira o 0,35 inline: a diferença agora é tracejado + cadeado
    // O tracejado vem só do CSS (.selo-trancado, seção 27). Zerar borderStyle aqui
    // partia o "border: 1px solid var(...)" inline em longhands vazios
    const [icone, nome] = item.querySelectorAll(":scope > span");
    if (icone) icone.classList.add("selo-icone");
    if (nome) {
      nome.classList.add("selo-nome");
      nome.style.color = ""; // a cor (legível, ≈6:1) vem do .selo-trancado .selo-nome
    }
    const cadeado = document.createElement("span");
    cadeado.className = "selo-cadeado";
    cadeado.setAttribute("aria-hidden", "true");
    cadeado.appendChild(criarSvgCadeado(true));
    item.appendChild(cadeado);
    const leitor = document.createElement("span");
    leitor.className = "sr-only";
    leitor.textContent = " (trancado)";
    item.appendChild(leitor);
  });

  // Sprint e Torre: continuam clicáveis (o jogo.js já explica no clique);
  // aqui só ganham o cadeado enquanto não há nenhuma pergunta liberada.
  const botoes = [...secao.querySelectorAll(":scope > button")];
  const botaoSprint = botoes.find((b) => b.textContent.includes("Sprint"));
  const botaoTorre = botoes.find((b) => b.textContent.includes("Torre"));
  const poolVazio = typeof montarPoolSprint === "function" && montarPoolSprint().length === 0;
  if (poolVazio) {
    let dica = secao.querySelector("#dica-cadeado-desafios");
    if (!dica) {
      dica = document.createElement("span");
      dica.id = "dica-cadeado-desafios";
      dica.className = "sr-only";
      dica.textContent = CADEADO_DICA_DESAFIOS;
      secao.appendChild(dica);
    }
    [botaoSprint, botaoTorre].forEach((botao) => {
      if (!botao || botao.classList.contains("botao-trancado")) return;
      botao.classList.add("botao-trancado");
      botao.setAttribute("aria-describedby", "dica-cadeado-desafios");
      const mini = document.createElement("span");
      mini.className = "selo-cadeado-mini";
      mini.setAttribute("aria-hidden", "true");
      mini.appendChild(criarSvgCadeado(true));
      botao.insertBefore(mini, botao.firstChild);
    });
  } else {
    // Já há perguntas liberadas: desfaz o cadeado (pode rodar fora do redesenho da galeria)
    [botaoSprint, botaoTorre].forEach((botao) => {
      if (!botao || !botao.classList.contains("botao-trancado")) return;
      botao.classList.remove("botao-trancado");
      botao.removeAttribute("aria-describedby");
      const mini = botao.querySelector(".selo-cadeado-mini");
      if (mini) mini.remove();
    });
    const dica = secao.querySelector("#dica-cadeado-desafios");
    if (dica) dica.remove();
  }

  // Certificado: enquanto não termina tudo, mostra a meta no lugar do botão 🎓
  secao.querySelectorAll(".certificado-trancado").forEach((antigo) => antigo.remove());
  if (typeof concluiuTudo === "function" && !concluiuTudo(estado) && typeof dadosEspecificosCards !== "undefined") {
    const idsRunas = Object.keys(dadosEspecificosCards);
    const totalRunas = idsRunas.length;
    const lidas = idsRunas.filter((id) => typeof runaFoiLida === "function" && runaFoiLida(id)).length;
    const totalReinos = reinosDados.length;
    const vencidos = Math.min((estado.missoesCompletas || []).length, totalReinos);

    const cert = document.createElement("div");
    cert.className = "prova-trancada certificado-trancado";
    cert.setAttribute("role", "note");
    const mini = document.createElement("span");
    mini.className = "certificado-cadeado";
    mini.setAttribute("aria-hidden", "true");
    mini.appendChild(criarSvgCadeado(true));
    const texto = document.createElement("div");
    texto.className = "prova-trancada-texto";
    const forte = document.createElement("strong");
    forte.className = "font-display";
    forte.textContent = "Certificado de Mestre Rúnico";
    const linha = document.createElement("span");
    linha.textContent = `🔒 Leia as ${totalRunas} runas (${lidas}/${totalRunas}) e vença os ${totalReinos} Julgamentos (${vencidos}/${totalReinos}) para destrancar`;
    texto.appendChild(forte);
    texto.appendChild(linha);
    cert.appendChild(mini);
    cert.appendChild(texto);

    if (botaoTorre) botaoTorre.insertAdjacentElement("afterend", cert);
    else secao.appendChild(cert);
  }
}

// ---------- Encadeamento com o jogo.js (sem editar jogo.js nem app.js) ----------

// Por que funciona: aposRenderizarBlocos e atualizarGaleriaConquistas são
// declarações de função de script comum, ou seja, propriedades globais
// regraváveis. O app.js chama aposRenderizarBlocos (com typeof) no fim de
// todo renderizarListaBlocos, e o jogo.js a chama direto depois de vencer um
// Julgamento, SEM re-render — as duas chamadas procuram o nome global na
// hora, então caem neste invólucro. A original roda UMA vez só, antes;
// um erro aqui nunca derruba o jogo.
if (typeof aposRenderizarBlocos === "function") {
  const aposRenderizarBlocosSemCadeados = aposRenderizarBlocos;
  aposRenderizarBlocos = function () {
    aposRenderizarBlocosSemCadeados.apply(this, arguments);
    try { desenharCadeadosReinos(); } catch (erro) {}
  };
}

// Mesmo esquema pra galeria: montarGaleriaConquistas, verificarConquistas e
// os Julgamentos chamam atualizarGaleriaConquistas pelo nome global.
if (typeof atualizarGaleriaConquistas === "function") {
  const atualizarGaleriaConquistasSemCadeados = atualizarGaleriaConquistas;
  atualizarGaleriaConquistas = function () {
    atualizarGaleriaConquistasSemCadeados.apply(this, arguments);
    try { decorarGaleriaComCadeados(); } catch (erro) {}
  };
}
