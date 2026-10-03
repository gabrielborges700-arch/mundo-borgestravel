/**
 * jogo.js — Sistema de jogo do Mundo Borgestrável (Poder Rúnico, Conquistas e Missões)
 *
 * Camada opcional por cima do que já existe (leitura de runas, simuladores).
 * Não substitui nada: só observa o que já é salvo e reage a isso.
 *
 * - XP ("Poder Rúnico"): +10 na primeira leitura de cada runa, +5 na
 *   primeira interação real com o simulador dela.
 * - Conquistas: selos automáticos por marcos (primeira runa, bloco
 *   completo, todas as 45 runas, todos os simuladores experimentados).
 * - Missões: ao terminar todas as runas de um bloco, libera um
 *   "Julgamento do Reino" (quiz de 3 perguntas). Acertar 2 de 3 dá um
 *   selo especial e um bônus de XP.
 * - Quizzes (Julgamentos, Sprint, Torre): a ORDEM das opções é embaralhada
 *   a cada vez que a pergunta aparece; a correção usa sempre o índice
 *   original (p.correta), então dados.js não muda.
 *
 * Guarda tudo numa única chave do localStorage: "borgestravel_jogo" (só o
 * nome do certificado fica à parte, em "borgestravel_nome"). Todo acesso
 * passa por armazenamentoLer/armazenamentoGravar (navegacao.js), que caem
 * pra memória quando o navegador bloqueia o localStorage.
 * Depende de reinosDados, missoesPorBloco (dados.js), obterRunasLidas(),
 * runaFoiLida() e do wrapper de armazenamento (navegacao.js) já estarem
 * carregados antes.
 */

const CHAVE_JOGO = "borgestravel_jogo";

// Mínimos de PR de cada nível. Sem atividades diárias dá pra juntar ≈1345 PR
// (runas + simuladores ≈675, Julgamentos 210, Supremos 350, desafios, Ilha).
// Ler tudo sozinho leva até o nível 4-5; o Mestre exige vencer os Julgamentos
// Supremos. Só o nível EXIBIDO depende disso — o XP salvo nunca muda.
const NIVEIS = [
  { min: 0, nome: "Aprendiz de Pedra" },
  { min: 100, nome: "Aprendiz de Argamassa" },
  { min: 250, nome: "Andarilho dos Alicerces" },
  { min: 450, nome: "Guardião das Vigas" },
  { min: 700, nome: "Cavaleiro do Aço" },
  { min: 950, nome: "Arquiteto Rúnico" },
  { min: 1200, nome: "Mestre do Reino das Super Estruturas" },
];

// Selos especiais concedidos manualmente ao vencer a missão de cada bloco
const SELOS_MISSAO = {
  bloco0: { nome: "Selo do Portal", icone: "🗺️" },
  bloco1: { nome: "Selo do Vilarejo", icone: "🏘️" },
  bloco2: { nome: "Selo de MecTec", icone: "🏙️" },
  bloco3: { nome: "Selo do Reino NEXUS", icone: "⚙️" },
  bloco4: { nome: "Selo dos Músculos", icone: "💪" },
  bloco5: { nome: "Selo dos Esqueletos", icone: "🦴" },
  bloco6: { nome: "Selo da Grande Aliança", icone: "🏰" },
};

// Selos especiais concedidos ao vencer o "Julgamento Supremo" (mini-boss) de cada bloco
const SELOS_BOSS = {
  bloco0: { nome: "Supremo do Portal", icone: "👑" },
  bloco1: { nome: "Supremo do Vilarejo", icone: "👑" },
  bloco2: { nome: "Supremo de MecTec", icone: "👑" },
  bloco3: { nome: "Supremo do Reino NEXUS", icone: "👑" },
  bloco4: { nome: "Supremo dos Músculos", icone: "👑" },
  bloco5: { nome: "Supremo dos Esqueletos", icone: "👑" },
  bloco6: { nome: "Supremo da Grande Aliança", icone: "👑" },
};

// ---------- Estado (localStorage) ----------

function obterEstadoJogo() {
  try {
    const salvo = armazenamentoLer(CHAVE_JOGO);
    if (!salvo) return estadoJogoPadrao();
    const estado = JSON.parse(salvo);
    return Object.assign(estadoJogoPadrao(), estado);
  } catch (erro) {
    return estadoJogoPadrao();
  }
}

function estadoJogoPadrao() {
  return {
    xp: 0,
    runasComXP: [],
    simuladoresComXP: [],
    conquistas: [],
    missoesCompletas: [],
    missoesBossCompletas: [],
    desafiosResolvidos: [],
    ultimaVisita: null,
    streakDias: 0,
    streakRecorde: 0,
    consolosXP: [],          // item 6: blocos que já deram o XP de consolo por errar a missão
    runasFavoritas: [],      // item 8: runas marcadas com estrela pra revisar depois
    sprintUltimoDia: null,   // item 9: última data em que o sprint premiou XP (1x por dia)
    sprintRecorde: 0,        // item 9: recorde de acertos num sprint
    constancia: {},          // item 11: mapa "AAAA-MM-DD" -> runaId (1 simulador novo por dia)
    runasNegrasLidas: [],    // Ilha Amaldiçoada: ids "E.x" já lidos (separado das 45 runas
                             // de propósito — não pode inflar o contador nem o certificado)
    torreRecorde: 0,         // Torre do Desafio Infinito: andar mais alto já alcançado
    torreUltimoDia: null,    // Torre: última data em que premiou XP (1x por dia)
    notasRunas: {},          // Caderno do Aprendiz: mapa runaId -> texto da anotação
  };
}

function salvarEstadoJogo(estado) {
  try {
    // se o navegador bloquear localStorage, o wrapper guarda em memória e o
    // jogo continua funcionando na sessão atual, só não salva entre visitas
    armazenamentoGravar(CHAVE_JOGO, JSON.stringify(estado));
  } catch (erro) {
    // estado impossível de serializar: melhor perder esse save do que travar o jogo
  }
}

// ---------- Nível ----------

function calcularNivel(xp) {
  let atual = NIVEIS[0];
  let indice = 0;
  for (let i = 0; i < NIVEIS.length; i++) {
    if (xp >= NIVEIS[i].min) {
      atual = NIVEIS[i];
      indice = i;
    }
  }
  const proximo = NIVEIS[indice + 1] || null;
  return { nome: atual.nome, indice, proximoLimite: proximo ? proximo.min : null };
}

// ---------- Streak diário ("Chama do Forjador") ----------

// Bônus de XP concedido ao bater certos marcos de dias seguidos
const MARCOS_STREAK = { 3: 15, 7: 40, 14: 80, 30: 200 };

// Formata como "AAAA-MM-DD" no fuso LOCAL do jogador. (toISOString usa UTC:
// em Brasília o "dia" virava às 21h.) Streak, Sprint, Torre e constância
// comparam essas strings, então o formato precisa ser sempre este.
function formatarDiaLocal(data) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

function dataDeHoje() {
  return formatarDiaLocal(new Date()); // formato "AAAA-MM-DD"
}

// Hoje deslocado em dias (−1 = ontem, +1 = amanhã), no mesmo formato
function diaDeslocado(dias) {
  const data = new Date();
  data.setDate(data.getDate() + dias);
  return formatarDiaLocal(data);
}

function atualizarStreak() {
  const estado = obterEstadoJogo();
  const hoje = dataDeHoje();

  if (estado.ultimaVisita === hoje) return; // já contou hoje, não faz nada

  // Saves antigos gravavam o dia em UTC: quem visitou à noite pode ter
  // "amanhã" salvo. Conta como hoje, senão a troca pro horário local
  // apagaria a chama de quem volta na mesma noite.
  if (estado.ultimaVisita === diaDeslocado(1)) return;

  const ontemStr = diaDeslocado(-1);

  if (estado.ultimaVisita === ontemStr) {
    estado.streakDias += 1; // visitou ontem também: streak continua
  } else {
    estado.streakDias = 1; // quebrou a sequência (ou é a primeira visita): reinicia
  }

  estado.ultimaVisita = hoje;
  if (estado.streakDias > estado.streakRecorde) estado.streakRecorde = estado.streakDias;

  const bonus = MARCOS_STREAK[estado.streakDias] || 0;
  if (bonus > 0) estado.xp += bonus;

  salvarEstadoJogo(estado);

  if (bonus > 0) {
    mostrarToast(`Chama de ${estado.streakDias} dias seguidos! +${bonus} PR`, "🔥");
  } else if (estado.streakDias > 1) {
    mostrarToast(`Chama do Forjador: ${estado.streakDias} dias seguidos`, "🔥");
  }
}

function montarChamaForjador() {
  const barra = document.getElementById("barra-navegacao");
  if (!barra) return;

  const elemento = document.createElement("span");
  elemento.id = "chama-forjador";
  elemento.title = "Dias seguidos visitando o reino";
  elemento.className = "widget-chama";
  barra.appendChild(elemento);
  atualizarChamaForjador();
}

function atualizarChamaForjador() {
  const elemento = document.getElementById("chama-forjador");
  if (!elemento) return;
  const estado = obterEstadoJogo();
  elemento.textContent = estado.streakDias > 0 ? `🔥 ${estado.streakDias}d` : "";
}

// ---------- Desafios resolvidos (marcação manual pelo jogador) ----------

function desafioFoiResolvido(runaId) {
  return obterEstadoJogo().desafiosResolvidos.includes(runaId);
}

function marcarDesafioResolvido(runaId) {
  const estado = obterEstadoJogo();
  if (estado.desafiosResolvidos.includes(runaId)) return;
  estado.desafiosResolvidos.push(runaId);
  estado.xp += 5;
  salvarEstadoJogo(estado);
  atualizarBarraXP();
  mostrarToast("Desafio resolvido! +5 Poder Rúnico", "🏆");
  verificarConquistas();
}

// ---------- Concessão de XP ----------

function concederXPLeitura(runaId) {
  const estado = obterEstadoJogo();
  if (estado.runasComXP.includes(runaId)) return;
  estado.runasComXP.push(runaId);
  estado.xp += 10;
  salvarEstadoJogo(estado);
  atualizarBarraXP();
  mostrarToast(`+10 Poder Rúnico`, "✨");
  verificarConquistas();
}

// ---------- Ilha Amaldiçoada (runas negras) ----------

function runaNegraFoiLida(runaId) {
  return (obterEstadoJogo().runasNegrasLidas || []).includes(runaId);
}

function concederXPRunaNegra(runaId) {
  const estado = obterEstadoJogo();
  if (!estado.runasNegrasLidas) estado.runasNegrasLidas = [];
  if (estado.runasNegrasLidas.includes(runaId)) return;
  estado.runasNegrasLidas.push(runaId);
  estado.xp += 10;
  salvarEstadoJogo(estado);
  atualizarBarraXP();
  mostrarToast("+10 Poder Rúnico", "💀");
  verificarConquistas();
}

function notificarSimuladorUsado(runaId) {
  const estado = obterEstadoJogo();

  // Item 11: registra o uso pro selo de constância (independe do XP,
  // conta também quando o jogador REVISITA um simulador em outro dia)
  const registrouConstancia = registrarConstancia(estado, runaId);

  const primeiraVez = !estado.simuladoresComXP.includes(runaId);
  if (primeiraVez) {
    estado.simuladoresComXP.push(runaId);
    estado.xp += 5;
  }

  if (!primeiraVez && !registrouConstancia) return; // nada mudou, não salva à toa

  salvarEstadoJogo(estado);
  if (primeiraVez) {
    atualizarBarraXP();
    mostrarToast(`+5 Poder Rúnico`, "🛠️");
  }
  verificarConquistas();
}

// Item 11 ("Forjador Constante"): guarda no máximo 1 simulador por dia,
// e só se for um simulador que ainda não contou em nenhum outro dia.
// Retorna true se registrou algo novo.
function registrarConstancia(estado, runaId) {
  if (!estado.constancia) estado.constancia = {};
  const hoje = dataDeHoje();
  if (estado.constancia[hoje]) return false; // hoje já contou
  if (Object.values(estado.constancia).includes(runaId)) return false; // esse simulador já contou noutro dia
  estado.constancia[hoje] = runaId;
  return true;
}

function blocosComSimuladorUsado(estado) {
  const blocos = new Set();
  estado.simuladoresComXP.forEach((runaId) => blocos.add(runaId.split(".")[0]));
  return Array.from(blocos);
}

// ---------- Conquistas ----------

const CONQUISTAS_DEFINICOES = [
  {
    id: "primeiro-passo",
    nome: "Primeiro Passo",
    desc: "Leu a primeira runa do reino",
    icone: "🥾",
    condicao: (estado, lidas) => lidas.length >= 1,
  },
  ...reinosDados.map((bloco) => ({
    id: "guardiao-" + bloco.id,
    nome: "Guardião: " + (bloco.title.split("—")[1] || bloco.title).trim(),
    desc: "Leu todas as runas deste reino",
    icone: bloco.title.split(" ")[0],
    condicao: (estado, lidas) => bloco.subtemas.every((st) => lidas.includes(st.id)),
  })),
  {
    id: "mestre-runico",
    nome: "Mestre Rúnico",
    desc: "Leu as 45 runas do reino inteiro",
    icone: "📜",
    condicao: (estado, lidas) => lidas.length >= 45,
  },
  {
    id: "curioso-nato",
    nome: "Curioso Nato",
    desc: "Interagiu com o simulador de todos os 7 reinos",
    icone: "🔍",
    condicao: (estado) => blocosComSimuladorUsado(estado).length >= 7,
  },
  {
    id: "forjador-constante",
    nome: "Forjador Constante",
    desc: "Usou 5 simuladores diferentes em 5 dias diferentes",
    icone: "🔁",
    condicao: (estado) => Object.keys(estado.constancia || {}).length >= 5,
  },
  {
    id: "explorador-da-ilha",
    nome: "Explorador da Ilha",
    desc: "Leu as 6 runas negras da Ilha Amaldiçoada",
    icone: "🏴‍☠️",
    condicao: (estado) => (estado.runasNegrasLidas || []).length >= 6,
  },
  {
    id: "escriba-do-reino",
    nome: "Escriba do Reino",
    desc: "Escreveu anotações próprias em 5 runas no Caderno do Aprendiz",
    icone: "✍️",
    condicao: (estado) => Object.keys(estado.notasRunas || {}).length >= 5,
  },
  // Concedida manualmente pelo simulador Monte Sua Ponte (E.7) — só no SUCESSO,
  // não em qualquer interação, por isso não tem condição automática
  {
    id: "ponte-redimida",
    nome: "Ponte Redimida",
    desc: "Montou a ponte que resiste aos três julgamentos na Ilha Amaldiçoada",
    icone: "🌉",
    condicao: null,
  },
  // Selos de missão: concedidos manualmente em abrirModalMissao, não têm condição automática
  ...reinosDados.map((bloco) => ({
    id: "selo-" + bloco.id,
    nome: SELOS_MISSAO[bloco.id].nome,
    desc: "Venceu o Julgamento deste reino",
    icone: SELOS_MISSAO[bloco.id].icone,
    condicao: null,
  })),
  // Selos de boss: concedidos manualmente em abrirModalMissaoBoss, não têm condição automática
  ...reinosDados.map((bloco) => ({
    id: "boss-" + bloco.id,
    nome: SELOS_BOSS[bloco.id].nome,
    desc: "Venceu o Julgamento Supremo (desafio extra) deste reino",
    icone: SELOS_BOSS[bloco.id].icone,
    condicao: null,
  })),
];

function verificarConquistas() {
  const estado = obterEstadoJogo();
  const lidas = obterRunasLidas();
  let novaConquista = false;

  CONQUISTAS_DEFINICOES.forEach((def) => {
    if (!def.condicao) return; // selos de missão são manuais
    if (estado.conquistas.includes(def.id)) return;
    if (def.condicao(estado, lidas)) {
      estado.conquistas.push(def.id);
      novaConquista = true;
      mostrarToast(`Conquista: ${def.nome}`, def.icone);
    }
  });

  if (novaConquista) {
    salvarEstadoJogo(estado);
    atualizarGaleriaConquistas();
  }
}

// ---------- Toast (aviso flutuante) ----------

// Coluna fixa no canto onde os toasts se empilham. Antes cada toast era fixed no
// mesmo bottom/right, e os disparados juntos (ex.: conquista + "Julgamento
// superado") nasciam um por cima do outro, cortados.
function obterPilhaToasts() {
  let pilha = document.getElementById("pilha-toasts");
  if (!pilha) {
    pilha = document.createElement("div");
    pilha.id = "pilha-toasts";
    pilha.style.cssText = `
      position: fixed; bottom: 1rem; right: 1rem; z-index: 60;
      display: flex; flex-direction: column; align-items: flex-end; gap: 0.5rem;
    `;
    document.body.appendChild(pilha);
  }
  return pilha;
}

function mostrarToast(texto, icone) {
  const toast = document.createElement("div");
  toast.textContent = `${icone} ${texto}`;
  toast.style.cssText = `
    background: var(--pedra-ardosia); color: var(--ouro-velho);
    border: 1px solid var(--bronze-envelhecido); border-radius: 8px;
    padding: 0.6rem 1rem; font-size: 0.8rem; font-weight: bold;
    box-shadow: 0 4px 14px rgba(0,0,0,0.6);
    opacity: 0; transform: translateY(10px); transition: opacity 0.3s ease, transform 0.3s ease;
  `;
  obterPilhaToasts().appendChild(toast); // o mais novo entra embaixo e empurra os outros pra cima
  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";
  });
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    setTimeout(() => toast.remove(), 350);
  }, 2600);
}

// ---------- Barra de XP (inserida na barra de navegação) ----------

function montarBarraXP() {
  const barra = document.getElementById("barra-navegacao");
  if (!barra) return;

  const container = document.createElement("div");
  container.id = "barra-xp";
  container.className = "widget-xp";
  container.innerHTML = `
    <span id="xp-nivel-nome" class="widget-xp-nome"></span>
    <div class="widget-xp-trilho">
      <div id="xp-barra-preenchida" class="widget-xp-preenchida"></div>
    </div>
  `;
  barra.appendChild(container);
  atualizarBarraXP();
}

function atualizarBarraXP() {
  const nomeEl = document.getElementById("xp-nivel-nome");
  const barraEl = document.getElementById("xp-barra-preenchida");
  if (!nomeEl || !barraEl) return;

  const estado = obterEstadoJogo();
  const nivel = calcularNivel(estado.xp);
  const limiteAtual = NIVEIS[nivel.indice].min;
  const limiteProximo = nivel.proximoLimite;

  nomeEl.textContent = `Nv.${nivel.indice + 1} ${nivel.nome} — ${estado.xp} PR`;

  if (limiteProximo === null) {
    barraEl.style.width = "100%";
  } else {
    const progresso = ((estado.xp - limiteAtual) / (limiteProximo - limiteAtual)) * 100;
    barraEl.style.width = `${Math.max(0, Math.min(100, progresso))}%`;
  }

  // Item 10: o brasão do cabeçalho evolui junto com o nível
  atualizarBrasaoAvatar();
}

// ---------- Galeria de conquistas ----------

function montarGaleriaConquistas() {
  const secao = document.getElementById("galeria-conquistas");
  if (!secao) return;
  atualizarGaleriaConquistas();
}

function atualizarGaleriaConquistas() {
  const secao = document.getElementById("galeria-conquistas");
  if (!secao) return;

  const estado = obterEstadoJogo();

  secao.innerHTML = `
    <h2 class="font-display" style="text-align:center; font-size:1.2rem; color: var(--ouro-velho); margin-bottom:0.25rem;">
      🏅 Galeria de Conquistas
    </h2>
    <p class="font-body" style="text-align:center; opacity:0.75; font-size:0.8rem; margin-bottom:1rem;">
      ${estado.conquistas.length} de ${CONQUISTAS_DEFINICOES.length} selos conquistados
    </p>
    <div id="grade-conquistas" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(90px, 1fr)); gap:0.6rem;"></div>
  `;

  const grade = secao.querySelector("#grade-conquistas");
  CONQUISTAS_DEFINICOES.forEach((def) => {
    const conquistada = estado.conquistas.includes(def.id);
    const item = document.createElement("div");
    item.title = `${def.nome} — ${def.desc}`;
    item.style.cssText = `
      display:flex; flex-direction:column; align-items:center; gap:0.25rem;
      padding:0.6rem 0.3rem; border-radius:10px; text-align:center;
      background: var(--pedra-ardosia); border: 1px solid var(--bronze-envelhecido);
      opacity: ${conquistada ? "1" : "0.35"};
    `;
    item.innerHTML = `
      <span style="font-size:1.6rem; filter: grayscale(${conquistada ? "0" : "1"});">${def.icone}</span>
      <span style="font-size:0.62rem; color: var(--pergaminho); line-height:1.2;">${def.nome}</span>
    `;
    grade.appendChild(item);
  });

  // Botão do card compartilhável — sempre disponível
  const botaoCard = document.createElement("button");
  botaoCard.className = "btn-gotico";
  botaoCard.style.cssText = "display:block; margin:1rem auto 0; padding:0.5rem 1rem; font-size:0.75rem;";
  botaoCard.textContent = "📤 Gerar Card de Conquistas";
  botaoCard.addEventListener("click", abrirModalCardConquista);
  secao.appendChild(botaoCard);

  // Botão do Sprint Rúnico (item 9) — sempre visível; se nenhum reino
  // estiver completo ainda, o clique mostra um aviso explicando
  const botaoSprint = document.createElement("button");
  botaoSprint.className = "btn-gotico";
  botaoSprint.style.cssText = "display:block; margin:0.6rem auto 0; padding:0.5rem 1rem; font-size:0.75rem;";
  botaoSprint.textContent = "⚡ Sprint Rúnico (desafio cronometrado)";
  botaoSprint.addEventListener("click", abrirModalSprint);
  secao.appendChild(botaoSprint);

  // Botão da Torre do Desafio Infinito — mesma regra do Sprint: sempre
  // visível, e sem reino completo o clique explica como liberar
  const botaoTorre = document.createElement("button");
  botaoTorre.className = "btn-gotico";
  botaoTorre.style.cssText = "display:block; margin:0.6rem auto 0; padding:0.5rem 1rem; font-size:0.75rem;";
  botaoTorre.textContent = "🗼 Torre do Desafio Infinito";
  botaoTorre.addEventListener("click", abrirModalTorre);
  secao.appendChild(botaoTorre);

  // Botão do certificado — só aparece quando o jogador termina 100% (45 runas + 7 missões)
  if (concluiuTudo(estado)) {
    const botaoCert = document.createElement("button");
    botaoCert.className = "btn-gotico";
    botaoCert.style.cssText = "display:block; margin:0.6rem auto 0; padding:0.6rem 1.2rem; font-size:0.8rem; border-color:var(--ouro-velho);";
    botaoCert.textContent = "🎓 Baixar Certificado de Mestre Rúnico";
    botaoCert.addEventListener("click", abrirModalCertificado);
    secao.appendChild(botaoCert);
  }
}

function concluiuTudo(estado) {
  const totalRunas = Object.keys(dadosEspecificosCards).length;
  return obterRunasLidas().length >= totalRunas && estado.missoesCompletas.length >= reinosDados.length;
}

// ---------- Certificado final (imprimível / salvar como PDF) ----------

function abrirModalCertificado() {
  fecharModalRuna();
  const nomeSalvo = armazenamentoLer("borgestravel_nome") || "";

  const overlay = document.createElement("div");
  overlay.id = "modal-certificado-overlay";
  overlay.style.cssText = "position: fixed; inset:0; z-index:70; background:rgba(6,7,10,0.92); display:flex; align-items:center; justify-content:center; padding:1rem;";

  const painel = document.createElement("div");
  painel.className = "painel-leitura";
  painel.style.cssText = "max-width:520px; width:100%; max-height:90vh; overflow-y:auto; padding:1.5rem; position:relative;";
  painel.innerHTML = `
    <div id="area-nao-imprimir">
      <button id="fechar-modal-certificado" aria-label="Fechar" class="btn-gotico" style="position:absolute; top:0.75rem; right:0.75rem; padding:0.3rem 0.7rem; font-size:0.9rem;">✕</button>
      <h2 class="font-display" style="margin-top:0;">🎓 Gerar Certificado</h2>
      <p>Parabéns por completar o Reino inteiro! Digite seu nome pra aparecer no certificado:</p>
      <input id="input-nome-certificado" type="text" placeholder="Seu nome" class="chat-input" style="width:100%; padding:0.5rem; margin:0.5rem 0; box-sizing:border-box;">
      <button id="botao-gerar-certificado" class="btn-gotico" style="width:100%; margin-top:0.5rem;">🖨️ Gerar e Imprimir / Salvar como PDF</button>
      <p style="font-size:0.75rem; opacity:0.7; margin-top:0.5rem;">Na janela de impressão que abrir, escolha "Salvar como PDF" no destino.</p>
    </div>
    <div id="certificado-imprimivel"></div>
  `;
  // O nome entra pelo DOM, não pelo HTML: um nome com aspas ou "<" quebrava o atributo value
  painel.querySelector("#input-nome-certificado").value = nomeSalvo;
  overlay.appendChild(painel);
  document.body.appendChild(overlay);

  overlay.addEventListener("click", (evento) => { if (evento.target === overlay) fecharModalCertificado(); });
  painel.querySelector("#fechar-modal-certificado").addEventListener("click", fecharModalCertificado);

  painel.querySelector("#botao-gerar-certificado").addEventListener("click", () => {
    const nome = painel.querySelector("#input-nome-certificado").value.trim() || "Aprendiz do Reino";
    armazenamentoGravar("borgestravel_nome", nome);

    const estado = obterEstadoJogo();
    const nivel = calcularNivel(estado.xp);
    const dataStr = new Date().toLocaleDateString("pt-BR");

    const certEl = painel.querySelector("#certificado-imprimivel");
    certEl.innerHTML = `
      <div class="certificado-conteudo">
        <div class="certificado-borda">
          <span style="font-size:3rem;">🏰</span>
          <h1 class="font-display">Certificado de Mestre Rúnico</h1>
          <p>O Mundo Borgestrável reconhece que</p>
          <h2 class="font-display"></h2>
          <p>concluiu todas as 45 runas e os 7 Julgamentos do Reino, alcançando o título de<br><strong>${nivel.nome}</strong></p>
          <p style="margin-top:2rem; font-style:italic;">Data: ${dataStr}</p>
          <p style="margin-top:1rem;">— Mago Aurelius, Guardião do Reino das Super Estruturas</p>
        </div>
      </div>
    `;
    certEl.querySelector("h2").textContent = nome; // texto puro: o nome digitado nunca vira HTML

    document.body.classList.add("modo-impressao-certificado");
    window.print();
  });

  window.addEventListener("afterprint", removerModoImpressaoCertificado);
}

function removerModoImpressaoCertificado() {
  document.body.classList.remove("modo-impressao-certificado");
  window.removeEventListener("afterprint", removerModoImpressaoCertificado);
}

function fecharModalCertificado() {
  const overlay = document.getElementById("modal-certificado-overlay");
  if (overlay) overlay.remove();
  document.body.classList.remove("modo-impressao-certificado");
}

// ---------- Card de conquistas compartilhável (imagem via canvas) ----------

function abrirModalCardConquista() {
  fecharModalRuna();
  const estado = obterEstadoJogo();
  const nivel = calcularNivel(estado.xp);
  const nomeSalvo = armazenamentoLer("borgestravel_nome") || "Aprendiz do Reino";

  const overlay = document.createElement("div");
  overlay.id = "modal-card-overlay";
  overlay.style.cssText = "position:fixed; inset:0; z-index:70; background:rgba(6,7,10,0.92); display:flex; align-items:center; justify-content:center; padding:1rem;";

  const painel = document.createElement("div");
  painel.className = "painel-leitura";
  painel.style.cssText = "max-width:420px; width:100%; padding:1.5rem; text-align:center; position:relative;";
  painel.innerHTML = `
    <button id="fechar-modal-card" aria-label="Fechar" class="btn-gotico" style="position:absolute; top:0.75rem; right:0.75rem; padding:0.3rem 0.7rem; font-size:0.9rem;">✕</button>
    <h2 class="font-display" style="margin-top:0;">📤 Card de Conquistas</h2>
    <canvas id="canvas-card-conquista" width="600" height="750" style="width:100%; max-width:280px; border-radius:10px; margin:1rem auto; display:block; box-shadow:0 4px 14px rgba(0,0,0,0.5);"></canvas>
    <a id="link-baixar-card" class="btn-gotico" style="display:inline-block; text-decoration:none; padding:0.6rem 1.2rem;" download="mundo-borgestravel-conquistas.png">⬇️ Baixar imagem</a>
  `;
  overlay.appendChild(painel);
  document.body.appendChild(overlay);

  overlay.addEventListener("click", (evento) => { if (evento.target === overlay) fecharModalCardConquista(); });
  painel.querySelector("#fechar-modal-card").addEventListener("click", fecharModalCardConquista);

  desenharCardConquista(painel.querySelector("#canvas-card-conquista"), nomeSalvo, nivel, estado);
}

function fecharModalCardConquista() {
  const overlay = document.getElementById("modal-card-overlay");
  if (overlay) overlay.remove();
}

function desenharCardConquista(canvas, nome, nivel, estado) {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    // Navegador sem canvas 2D (ou com ele bloqueado): o modal abre mesmo
    // assim, só esconde o botão de baixar, que não teria imagem nenhuma
    const linkSemImagem = document.getElementById("link-baixar-card");
    if (linkSemImagem) linkSemImagem.style.display = "none";
    return;
  }
  const largura = canvas.width;
  const altura = canvas.height;

  const gradiente = ctx.createLinearGradient(0, 0, 0, altura);
  gradiente.addColorStop(0, "#0d0f12");
  gradiente.addColorStop(1, "#2d3238");
  ctx.fillStyle = gradiente;
  ctx.fillRect(0, 0, largura, altura);

  ctx.strokeStyle = "#d4af37";
  ctx.lineWidth = 6;
  ctx.strokeRect(15, 15, largura - 30, altura - 30);

  ctx.textAlign = "center";
  ctx.fillStyle = "#e6c34a";
  ctx.font = "bold 34px serif";
  ctx.fillText("🏰 MUNDO BORGESTRÁVEL", largura / 2, 100);

  ctx.fillStyle = "#f1e4c3";
  ctx.font = "italic 22px serif";
  ctx.fillText(nome, largura / 2, 160);

  ctx.fillStyle = "#00e5ff";
  ctx.font = "bold 26px serif";
  ctx.fillText(nivel.nome, largura / 2, 210);

  ctx.fillStyle = "#f1e4c3";
  ctx.font = "20px serif";
  ctx.fillText(`⚡ ${estado.xp} Poder Rúnico`, largura / 2, 260);

  const totalRunas = Object.keys(dadosEspecificosCards).length;
  ctx.fillText(`📜 ${obterRunasLidas().length} / ${totalRunas} runas lidas`, largura / 2, 295);
  ctx.fillText(`🏅 ${estado.conquistas.length} / ${CONQUISTAS_DEFINICOES.length} conquistas`, largura / 2, 330);

  const conquistadas = CONQUISTAS_DEFINICOES.filter((def) => estado.conquistas.includes(def.id));
  ctx.font = "36px serif";
  const iconesPorLinha = 6;
  const inicioY = 400;
  conquistadas.slice(0, 24).forEach((def, indice) => {
    const coluna = indice % iconesPorLinha;
    const linha = Math.floor(indice / iconesPorLinha);
    const x = 90 + coluna * 75;
    const y = inicioY + linha * 70;
    ctx.fillText(def.icone, x, y);
  });

  ctx.fillStyle = "rgba(241,228,195,0.6)";
  ctx.font = "italic 16px serif";
  ctx.fillText("mundoborgestravel", largura / 2, altura - 40);

  const link = document.getElementById("link-baixar-card");
  if (link && canvas.toBlob) {
    canvas.toBlob((blob) => {
      if (blob) link.href = URL.createObjectURL(blob);
    });
  }
}

// ---------- Item 6: XP de consolo por errar uma missão ----------

// Concede +5 XP na PRIMEIRA derrota em cada Julgamento (normal ou Supremo),
// pra não desmotivar quem errou. Só uma vez por julgamento — errar de novo
// não dá mais nada (senão viraria farm de XP). Retorna true se concedeu.
function concederXPConsolo(chave) {
  const estado = obterEstadoJogo();
  if (!estado.consolosXP) estado.consolosXP = [];
  if (estado.consolosXP.includes(chave)) return false;
  estado.consolosXP.push(chave);
  estado.xp += 5;
  salvarEstadoJogo(estado);
  atualizarBarraXP();
  mostrarToast("Esforço reconhecido: +5 Poder Rúnico", "✨");
  return true;
}

// ---------- Item 8: Runas favoritas (estrela pra revisar depois) ----------

function runaEhFavorita(runaId) {
  const estado = obterEstadoJogo();
  return (estado.runasFavoritas || []).includes(runaId);
}

// Alterna favorito e devolve o novo estado (true = agora é favorita)
function alternarRunaFavorita(runaId) {
  const estado = obterEstadoJogo();
  if (!estado.runasFavoritas) estado.runasFavoritas = [];
  const indice = estado.runasFavoritas.indexOf(runaId);
  let favoritaAgora;
  if (indice === -1) {
    estado.runasFavoritas.push(runaId);
    favoritaAgora = true;
    mostrarToast("Runa favoritada pra revisão", "⭐");
  } else {
    estado.runasFavoritas.splice(indice, 1);
    favoritaAgora = false;
    mostrarToast("Runa removida das favoritas", "☆");
  }
  salvarEstadoJogo(estado);
  return favoritaAgora;
}

// ---------- Item 10: Brasão do cabeçalho evolui com o nível ----------

// Um ícone por nível (índices 0 a 6), do humilde 🪨 até o 🏰 de Mestre
const ICONES_BRASAO = ["🪨", "🧱", "🏗️", "🛡️", "⚔️", "🔮", "🏰"];

function atualizarBrasaoAvatar() {
  const elemento = document.getElementById("brasao-avatar");
  if (!elemento) return;
  const estado = obterEstadoJogo();
  const nivel = calcularNivel(estado.xp);
  const novoIcone = ICONES_BRASAO[nivel.indice] || "🏰";
  if (elemento.textContent !== novoIcone) elemento.textContent = novoIcone;
  elemento.title = `Nível ${nivel.indice + 1}: ${nivel.nome}`;
}

// ---------- Item 7: Diário do Aprendiz ----------

function montarBotaoDiario() {
  const barra = document.getElementById("barra-navegacao");
  if (!barra) return;

  const botao = document.createElement("button");
  botao.id = "botao-diario";
  botao.title = "Diário do Aprendiz — resumo do teu progresso";
  botao.setAttribute("aria-label", "Abrir o Diário do Aprendiz");
  botao.textContent = "📖";
  botao.className = "widget-diario";
  botao.addEventListener("click", abrirModalDiario);
  barra.appendChild(botao);
}

// Sugere o próximo passo natural: primeira runa não lida; se o bloco está
// todo lido, a missão pendente; depois o Julgamento Supremo; e por fim o certificado.
function sugerirProximoPasso() {
  const estado = obterEstadoJogo();
  const lidas = obterRunasLidas();

  for (const bloco of reinosDados) {
    const nomeBloco = (bloco.title.split("—")[1] || bloco.title).trim();

    const runaPendente = bloco.subtemas.find((st) => !lidas.includes(st.id));
    if (runaPendente) {
      return {
        texto: `Lê a runa ${runaPendente.title}`,
        acao: () => { fecharModalDiario(); abrirModalRuna(runaPendente.id); },
      };
    }
    if (!estado.missoesCompletas.includes(bloco.id)) {
      return {
        texto: `Encara o Julgamento do reino "${nomeBloco}"`,
        acao: () => { fecharModalDiario(); abrirModalMissao(bloco.id); },
      };
    }
    if (!estado.missoesBossCompletas.includes(bloco.id)) {
      return {
        texto: `Desafia o Julgamento Supremo de "${nomeBloco}"`,
        acao: () => { fecharModalDiario(); abrirModalMissaoBoss(bloco.id); },
      };
    }
  }

  return { texto: "Tudo completo! Baixa teu Certificado de Mestre Rúnico 🎓", acao: null };
}

function abrirModalDiario() {
  fecharModalRuna();
  fecharModalDiario(); // evita empilhar dois diários

  const estado = obterEstadoJogo();
  const lidas = obterRunasLidas();
  const nivel = calcularNivel(estado.xp);
  const totalRunas = Object.keys(dadosEspecificosCards).length;

  const overlay = document.createElement("div");
  overlay.id = "modal-diario-overlay";
  overlay.style.cssText = "position:fixed; inset:0; z-index:50; background:rgba(6,7,10,0.85); display:flex; align-items:center; justify-content:center; padding:1rem;";

  const painel = document.createElement("div");
  painel.className = "painel-leitura";
  painel.style.cssText = "max-width:520px; width:100%; max-height:85vh; overflow-y:auto; padding:1.5rem 2rem; position:relative;";

  // Progresso por bloco (linha a linha)
  const linhasBlocos = reinosDados.map((bloco) => {
    const lidasNoBloco = bloco.subtemas.filter((st) => lidas.includes(st.id)).length;
    const totalNoBloco = bloco.subtemas.length;
    const completo = lidasNoBloco === totalNoBloco;
    const missao = estado.missoesCompletas.includes(bloco.id) ? " ⚔️" : "";
    const boss = estado.missoesBossCompletas.includes(bloco.id) ? " 👑" : "";
    return `<li style="margin-bottom:0.3rem; ${completo ? "opacity:0.85;" : ""}">
      <span style="color:${bloco.hex}; font-weight:bold;">${bloco.title}</span>
      — ${lidasNoBloco}/${totalNoBloco} runas${completo ? " ✓" : ""}${missao}${boss}
    </li>`;
  }).join("");

  // Lista de favoritas (item 8) — clicáveis pra abrir direto a runa
  const favoritas = (estado.runasFavoritas || []).filter((id) => dadosEspecificosCards[id]);
  const listaFavoritas = favoritas.length
    ? favoritas.map((id) => `
        <button type="button" class="btn-gotico botao-favorita-diario" data-runa-id="${id}"
          style="display:block; width:100%; text-align:left; font-size:0.75rem; padding:0.4rem 0.7rem; margin-bottom:0.35rem;">
          ⭐ ${dadosEspecificosCards[id].title}
        </button>`).join("")
    : `<p style="font-size:0.8rem; opacity:0.7;">Nenhuma favorita ainda. Abre uma runa e clica na ☆ pra marcar pra revisão.</p>`;

  // Anotações do Caderno do Aprendiz — mesma mecânica das favoritas
  const idsComNota = Object.keys(estado.notasRunas || {}).filter((id) => dadosEspecificosCards[id]);
  const listaNotas = idsComNota.length
    ? idsComNota.map((id) => `
        <button type="button" class="btn-gotico botao-nota-diario" data-runa-id="${id}"
          style="display:block; width:100%; text-align:left; font-size:0.75rem; padding:0.4rem 0.7rem; margin-bottom:0.35rem;">
          📝 ${dadosEspecificosCards[id].title}
        </button>`).join("")
    : `<p style="font-size:0.8rem; opacity:0.7;">Nenhuma anotação ainda. Abre uma runa e escreve no 📝 Caderno do Aprendiz.</p>`;

  const passo = sugerirProximoPasso();

  painel.innerHTML = `
    <button id="fechar-modal-diario" aria-label="Fechar" class="btn-gotico"
      style="position:absolute; top:0.75rem; right:0.75rem; padding:0.3rem 0.7rem; font-size:0.9rem;">✕</button>

    <h2 class="font-display" style="margin-top:0;">📖 Diário do Aprendiz</h2>
    <p style="font-style:italic; opacity:0.85; margin-top:-0.25rem;">O registro da tua jornada pelo Reino.</p>
    <div class="divisor-rune"></div>

    <p><strong>${ICONES_BRASAO[nivel.indice] || "🏰"} Nível ${nivel.indice + 1}: ${nivel.nome}</strong> — ${estado.xp} Poder Rúnico</p>
    <p>🔥 Chama do Forjador: ${estado.streakDias || 0} dia(s) seguidos (recorde: ${estado.streakRecorde || 0})</p>
    <p>📜 Runas lidas: ${lidas.length}/${totalRunas} &nbsp;·&nbsp; ⚔️ Julgamentos: ${estado.missoesCompletas.length}/7 &nbsp;·&nbsp; 👑 Supremos: ${estado.missoesBossCompletas.length}/7</p>
    <p>🏆 Desafios resolvidos: ${estado.desafiosResolvidos.length} &nbsp;·&nbsp; 🏅 Selos: ${estado.conquistas.length}/${CONQUISTAS_DEFINICOES.length}${estado.sprintRecorde ? ` &nbsp;·&nbsp; ⚡ Recorde no Sprint: ${estado.sprintRecorde}` : ""}${estado.torreRecorde ? ` &nbsp;·&nbsp; 🗼 Torre: andar ${estado.torreRecorde}` : ""}</p>

    <div class="divisor-losango"><span>❖</span></div>

    <h3 class="font-display" style="font-size:0.95rem;">Progresso por reino</h3>
    <ul style="list-style:none; padding:0; font-size:0.8rem;">${linhasBlocos}</ul>

    <h3 class="font-display" style="font-size:0.95rem;">⭐ Runas favoritas (revisão)</h3>
    ${listaFavoritas}

    <h3 class="font-display" style="font-size:0.95rem;">📝 Caderno do Aprendiz</h3>
    ${listaNotas}

    <div class="divisor-rune"></div>

    <div class="painel-pergaminho-velho" style="padding:1rem; border-radius:10px;">
      <strong>👉 Próximo passo sugerido:</strong>
      <p style="margin:0.5rem 0 0;">${passo.texto}</p>
      ${passo.acao ? '<button id="botao-proximo-passo" class="btn-gotico" style="display:block; margin-top:0.75rem; font-size:0.75rem;">Ir agora ➜</button>' : ""}
    </div>
  `;

  overlay.appendChild(painel);
  document.body.appendChild(overlay);

  overlay.addEventListener("click", (evento) => { if (evento.target === overlay) fecharModalDiario(); });
  painel.querySelector("#fechar-modal-diario").addEventListener("click", fecharModalDiario);

  const botaoPasso = painel.querySelector("#botao-proximo-passo");
  if (botaoPasso && passo.acao) botaoPasso.addEventListener("click", passo.acao);

  painel.querySelectorAll(".botao-favorita-diario").forEach((botao) => {
    botao.addEventListener("click", () => {
      fecharModalDiario();
      abrirModalRuna(botao.dataset.runaId);
    });
  });

  painel.querySelectorAll(".botao-nota-diario").forEach((botao) => {
    botao.addEventListener("click", () => {
      fecharModalDiario();
      abrirModalRuna(botao.dataset.runaId);
    });
  });

  document.addEventListener("keydown", fecharComEscDiario);
}

function fecharComEscDiario(evento) {
  if (evento.key === "Escape") fecharModalDiario();
}

function fecharModalDiario() {
  const overlay = document.getElementById("modal-diario-overlay");
  if (overlay) overlay.remove();
  document.removeEventListener("keydown", fecharComEscDiario);
}

// ---------- Item 9: Sprint Rúnico (desafio cronometrado) ----------

const SPRINT_DURACAO_SEGUNDOS = 60;
let sprintTimerId = null; // guarda o setInterval pra poder cancelar ao fechar

// Monta o banco de perguntas do sprint: só perguntas JÁ liberadas —
// missões normais dos blocos com todas as runas lidas, e perguntas do
// boss dos blocos cuja missão normal já foi vencida.
function montarPoolSprint() {
  const estado = obterEstadoJogo();
  const lidas = obterRunasLidas();
  const pool = [];

  reinosDados.forEach((bloco) => {
    const blocoCompleto = bloco.subtemas.every((st) => lidas.includes(st.id));
    if (!blocoCompleto) return;
    (missoesPorBloco[bloco.id] || []).forEach((p) => pool.push(p));
    if (estado.missoesCompletas.includes(bloco.id)) {
      (missoesBossPorBloco[bloco.id] || []).forEach((p) => pool.push(p));
    }
  });

  return pool;
}

function embaralhar(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

// Opções de uma pergunta na ordem de EXIBIÇÃO (embaralhada a cada chamada).
// Quase todas as respostas certas em dados.js estão na opção do meio; sem
// isso dava pra acertar tudo no chute. Cada item leva o índice ORIGINAL,
// que é o que p.correta usa — a correção continua igual.
function opcoesEmbaralhadas(pergunta) {
  return embaralhar(pergunta.opcoes.map((texto, indiceOriginal) => ({ texto, indiceOriginal })));
}

function abrirModalSprint() {
  const pool = montarPoolSprint();
  if (pool.length === 0) {
    mostrarToast("Completa as runas de um reino primeiro pra liberar o Sprint!", "⚡");
    return;
  }

  fecharModalRuna();
  fecharModalSprint();

  const overlay = document.createElement("div");
  overlay.id = "modal-sprint-overlay";
  overlay.style.cssText = "position:fixed; inset:0; z-index:70; background:rgba(6,7,10,0.92); display:flex; align-items:center; justify-content:center; padding:1rem;";

  const painel = document.createElement("div");
  painel.className = "painel-leitura";
  painel.style.cssText = "max-width:520px; width:100%; max-height:85vh; overflow-y:auto; padding:1.5rem 2rem; position:relative;";

  const estado = obterEstadoJogo();
  const premiaHoje = estado.sprintUltimoDia !== dataDeHoje();

  painel.innerHTML = `
    <button id="fechar-modal-sprint" aria-label="Fechar" class="btn-gotico"
      style="position:absolute; top:0.75rem; right:0.75rem; padding:0.3rem 0.7rem; font-size:0.9rem;">✕</button>
    <h2 class="font-display" style="margin-top:0;">⚡ Sprint Rúnico</h2>
    <p style="font-style:italic; opacity:0.85;">Responde o máximo de perguntas em ${SPRINT_DURACAO_SEGUNDOS} segundos! São as perguntas dos Julgamentos que já liberaste (${pool.length} no banco), embaralhadas.</p>
    <p style="font-size:0.78rem;">Cada acerto vale <strong>+2 Poder Rúnico</strong> — mas o prêmio só é pago <strong>uma vez por dia</strong> (o recorde conta sempre).${premiaHoje ? "" : " <strong>Hoje já foi premiado — esse sprint vale só pelo recorde e pela prática!</strong>"}</p>
    <div class="divisor-rune"></div>
    <div id="area-sprint" style="min-height:220px;">
      <button id="comecar-sprint" class="btn-gotico" style="display:block; width:100%; padding:0.8rem;">🏁 Começar o Sprint!</button>
    </div>
  `;

  overlay.appendChild(painel);
  document.body.appendChild(overlay);

  overlay.addEventListener("click", (evento) => { if (evento.target === overlay) fecharModalSprint(); });
  painel.querySelector("#fechar-modal-sprint").addEventListener("click", fecharModalSprint);
  painel.querySelector("#comecar-sprint").addEventListener("click", () => iniciarSprint(painel));

  document.addEventListener("keydown", fecharComEscSprint);
}

function iniciarSprint(painel) {
  const area = painel.querySelector("#area-sprint");
  let fila = embaralhar(montarPoolSprint());
  let indice = 0;
  let acertos = 0;
  let respondidas = 0;
  let segundosRestantes = SPRINT_DURACAO_SEGUNDOS;

  area.innerHTML = `
    <div style="display:flex; justify-content:space-between; font-weight:bold; margin-bottom:0.75rem;">
      <span id="sprint-timer" style="color:#ff7043;">⏱️ ${segundosRestantes}s</span>
      <span id="sprint-placar" style="color:var(--ciano-mistico);">✅ 0 / 0</span>
    </div>
    <div id="sprint-pergunta"></div>
  `;

  const timerEl = area.querySelector("#sprint-timer");
  const placarEl = area.querySelector("#sprint-placar");
  const perguntaEl = area.querySelector("#sprint-pergunta");

  function mostrarProximaPergunta() {
    if (indice >= fila.length) { // esgotou o banco: re-embaralha e continua
      fila = embaralhar(fila);
      indice = 0;
    }
    const p = fila[indice];
    indice++;

    perguntaEl.innerHTML = `<p style="font-weight:bold; margin-bottom:0.5rem; font-size:0.85rem;">${p.pergunta}</p>`;
    const opcoesContainer = document.createElement("div");
    opcoesContainer.style.cssText = "display:flex; flex-direction:column; gap:0.4rem;";

    // ordem embaralhada na tela; indiceOpcao é o índice ORIGINAL (o de p.correta)
    opcoesEmbaralhadas(p).forEach(({ texto: textoOpcao, indiceOriginal: indiceOpcao }) => {
      const botaoOpcao = document.createElement("button");
      botaoOpcao.type = "button";
      botaoOpcao.className = "btn-gotico";
      botaoOpcao.style.cssText = "text-align:left; font-size:0.78rem; padding:0.5rem 0.75rem;";
      botaoOpcao.textContent = textoOpcao;
      botaoOpcao.addEventListener("click", () => {
        respondidas++;
        if (indiceOpcao === p.correta) acertos++;
        placarEl.textContent = `✅ ${acertos} / ${respondidas}`;
        mostrarProximaPergunta();
      });
      opcoesContainer.appendChild(botaoOpcao);
    });
    perguntaEl.appendChild(opcoesContainer);
  }

  sprintTimerId = setInterval(() => {
    segundosRestantes--;
    timerEl.textContent = `⏱️ ${segundosRestantes}s`;
    if (segundosRestantes <= 10) timerEl.style.color = "#c0392b";
    if (segundosRestantes <= 0) {
      clearInterval(sprintTimerId);
      sprintTimerId = null;
      encerrarSprint(area, acertos, respondidas);
    }
  }, 1000);

  mostrarProximaPergunta();
}

function encerrarSprint(area, acertos, respondidas) {
  const estado = obterEstadoJogo();
  const hoje = dataDeHoje();

  let xpGanho = 0;
  if (estado.sprintUltimoDia !== hoje && acertos > 0) {
    xpGanho = acertos * 2;
    estado.xp += xpGanho;
    estado.sprintUltimoDia = hoje;
  }

  const novoRecorde = acertos > (estado.sprintRecorde || 0);
  if (novoRecorde) estado.sprintRecorde = acertos;

  salvarEstadoJogo(estado);
  atualizarBarraXP();
  if (xpGanho > 0) mostrarToast(`Sprint concluído! +${xpGanho} Poder Rúnico`, "⚡");
  verificarConquistas();

  area.innerHTML = `
    <div class="painel-pergaminho-velho" style="padding:1rem; border-radius:10px; text-align:center;">
      <strong style="font-size:1rem;">⏱️ Tempo esgotado!</strong>
      <p style="margin:0.5rem 0;">Acertaste <strong>${acertos}</strong> de ${respondidas} pergunta(s).</p>
      ${novoRecorde ? `<p style="margin:0.5rem 0;"><strong>🏆 Novo recorde pessoal!</strong></p>` : `<p style="margin:0.5rem 0; font-size:0.8rem;">Recorde atual: ${estado.sprintRecorde}</p>`}
      ${xpGanho > 0 ? `<p style="margin:0.5rem 0;"><strong>⚡ +${xpGanho} Poder Rúnico!</strong></p>` : `<p style="margin:0.5rem 0; font-size:0.8rem;">Sem XP dessa vez (prêmio diário já pago) — mas a prática forja o mestre!</p>`}
      <button id="repetir-sprint" class="btn-gotico" style="margin-top:0.5rem; font-size:0.75rem;">🔄 Correr de novo</button>
    </div>
  `;
  const botaoRepetir = area.querySelector("#repetir-sprint");
  botaoRepetir.addEventListener("click", () => iniciarSprint(document.querySelector("#modal-sprint-overlay .painel-leitura")));
}

function fecharComEscSprint(evento) {
  if (evento.key === "Escape") fecharModalSprint();
}

function fecharModalSprint() {
  if (sprintTimerId) {
    clearInterval(sprintTimerId);
    sprintTimerId = null;
  }
  const overlay = document.getElementById("modal-sprint-overlay");
  if (overlay) overlay.remove();
  document.removeEventListener("keydown", fecharComEscSprint);
}

// ---------- Torre do Desafio Infinito ----------
// Por turnos, sem cronômetro: sobe 1 andar por acerto, perde 1 vida por
// erro, 0 vidas encerra. Usa o mesmo banco de perguntas liberadas do
// Sprint (montarPoolSprint). Anti-farm: +1 PR por andar, teto de
// TORRE_TETO_XP_DIA por dia, prêmio pago 1x por dia (torreUltimoDia).

const TORRE_VIDAS = 3;
const TORRE_TETO_XP_DIA = 30;

function abrirModalTorre() {
  const pool = montarPoolSprint(); // mesmas perguntas já liberadas do Sprint
  if (pool.length === 0) {
    mostrarToast("Completa as runas de um reino primeiro pra liberar a Torre!", "🗼");
    return;
  }

  fecharModalRuna();
  fecharModalTorre();

  const overlay = document.createElement("div");
  overlay.id = "modal-torre-overlay";
  overlay.style.cssText = "position:fixed; inset:0; z-index:70; background:rgba(6,7,10,0.92); display:flex; align-items:center; justify-content:center; padding:1rem;";

  const painel = document.createElement("div");
  painel.className = "painel-leitura";
  painel.style.cssText = "max-width:520px; width:100%; max-height:85vh; overflow-y:auto; padding:1.5rem 2rem; position:relative;";

  const estado = obterEstadoJogo();
  const premiaHoje = estado.torreUltimoDia !== dataDeHoje();

  painel.innerHTML = `
    <button id="fechar-modal-torre" aria-label="Fechar" class="btn-gotico"
      style="position:absolute; top:0.75rem; right:0.75rem; padding:0.3rem 0.7rem; font-size:0.9rem;">✕</button>
    <h2 class="font-display" style="margin-top:0;">🗼 Torre do Desafio Infinito</h2>
    <p style="font-style:italic; opacity:0.85;">Sobe um andar a cada acerto — sem tempo, mas com apenas ${TORRE_VIDAS} vidas. Erra ${TORRE_VIDAS} vezes e a escalada acaba! (${pool.length} pergunta(s) no banco${estado.torreRecorde ? ` · recorde: andar ${estado.torreRecorde}` : ""})</p>
    <p style="font-size:0.78rem;">Cada andar vale <strong>+1 Poder Rúnico</strong> (máx. ${TORRE_TETO_XP_DIA} por dia, prêmio pago <strong>uma vez por dia</strong> — o recorde conta sempre).${premiaHoje ? "" : " <strong>Hoje já foi premiado — essa escalada vale pelo recorde e pela prática!</strong>"}</p>
    <div class="divisor-rune"></div>
    <div id="area-torre" style="min-height:220px;">
      <button id="comecar-torre" class="btn-gotico" style="display:block; width:100%; padding:0.8rem;">🧗 Começar a escalada!</button>
    </div>
  `;

  overlay.appendChild(painel);
  document.body.appendChild(overlay);

  overlay.addEventListener("click", (evento) => { if (evento.target === overlay) fecharModalTorre(); });
  painel.querySelector("#fechar-modal-torre").addEventListener("click", fecharModalTorre);
  painel.querySelector("#comecar-torre").addEventListener("click", () => iniciarTorre(painel));

  document.addEventListener("keydown", fecharComEscTorre);
}

function iniciarTorre(painel) {
  const area = painel.querySelector("#area-torre");
  let fila = embaralhar(montarPoolSprint());
  let indice = 0;
  let andar = 0;
  let vidas = TORRE_VIDAS;

  area.innerHTML = `
    <div style="display:flex; justify-content:space-between; font-weight:bold; margin-bottom:0.75rem;">
      <span id="torre-andar" style="color:var(--ouro-velho);">🗼 Andar 0</span>
      <span id="torre-vidas">${"❤️".repeat(vidas)}</span>
    </div>
    <div id="torre-pergunta"></div>
  `;

  const andarEl = area.querySelector("#torre-andar");
  const vidasEl = area.querySelector("#torre-vidas");
  const perguntaEl = area.querySelector("#torre-pergunta");

  function mostrarProximaPergunta() {
    if (indice >= fila.length) { // esgotou o banco: re-embaralha e continua
      fila = embaralhar(fila);
      indice = 0;
    }
    const p = fila[indice];
    indice++;

    perguntaEl.innerHTML = `<p style="font-weight:bold; margin-bottom:0.5rem; font-size:0.85rem;">${p.pergunta}</p>`;
    const opcoesContainer = document.createElement("div");
    opcoesContainer.style.cssText = "display:flex; flex-direction:column; gap:0.4rem;";

    // ordem embaralhada na tela; indiceOpcao é o índice ORIGINAL (o de p.correta)
    opcoesEmbaralhadas(p).forEach(({ texto: textoOpcao, indiceOriginal: indiceOpcao }) => {
      const botaoOpcao = document.createElement("button");
      botaoOpcao.type = "button";
      botaoOpcao.className = "btn-gotico";
      botaoOpcao.style.cssText = "text-align:left; font-size:0.78rem; padding:0.5rem 0.75rem;";
      botaoOpcao.textContent = textoOpcao;
      botaoOpcao.addEventListener("click", () => {
        if (indiceOpcao === p.correta) {
          andar++;
          andarEl.textContent = `🗼 Andar ${andar}`;
        } else {
          vidas--;
          vidasEl.textContent = "❤️".repeat(vidas) + "🖤".repeat(TORRE_VIDAS - vidas);
          if (vidas <= 0) {
            encerrarTorre(area, andar);
            return;
          }
        }
        mostrarProximaPergunta();
      });
      opcoesContainer.appendChild(botaoOpcao);
    });
    perguntaEl.appendChild(opcoesContainer);
  }

  mostrarProximaPergunta();
}

function encerrarTorre(area, andar) {
  const estado = obterEstadoJogo();
  const hoje = dataDeHoje();

  let xpGanho = 0;
  if (estado.torreUltimoDia !== hoje && andar > 0) {
    xpGanho = Math.min(andar, TORRE_TETO_XP_DIA);
    estado.xp += xpGanho;
    estado.torreUltimoDia = hoje;
  }

  const novoRecorde = andar > (estado.torreRecorde || 0);
  if (novoRecorde) estado.torreRecorde = andar;

  salvarEstadoJogo(estado);
  atualizarBarraXP();
  if (xpGanho > 0) mostrarToast(`Escalada concluída! +${xpGanho} Poder Rúnico`, "🗼");
  verificarConquistas();

  area.innerHTML = `
    <div class="painel-pergaminho-velho" style="padding:1rem; border-radius:10px; text-align:center;">
      <strong style="font-size:1rem;">💔 As vidas acabaram!</strong>
      <p style="margin:0.5rem 0;">Chegaste ao <strong>andar ${andar}</strong> da Torre.</p>
      ${novoRecorde ? `<p style="margin:0.5rem 0;"><strong>🏆 Novo recorde pessoal!</strong></p>` : `<p style="margin:0.5rem 0; font-size:0.8rem;">Recorde atual: andar ${estado.torreRecorde}</p>`}
      ${xpGanho > 0 ? `<p style="margin:0.5rem 0;"><strong>🗼 +${xpGanho} Poder Rúnico!</strong></p>` : `<p style="margin:0.5rem 0; font-size:0.8rem;">Sem XP dessa vez (prêmio diário já pago) — mas cada escalada afia a lâmina!</p>`}
      <button id="repetir-torre" class="btn-gotico" style="margin-top:0.5rem; font-size:0.75rem;">🔄 Escalar de novo</button>
    </div>
  `;
  const botaoRepetir = area.querySelector("#repetir-torre");
  botaoRepetir.addEventListener("click", () => iniciarTorre(document.querySelector("#modal-torre-overlay .painel-leitura")));
}

function fecharComEscTorre(evento) {
  if (evento.key === "Escape") fecharModalTorre();
}

function fecharModalTorre() {
  const overlay = document.getElementById("modal-torre-overlay");
  if (overlay) overlay.remove();
  document.removeEventListener("keydown", fecharComEscTorre);
}

// Chamada pelo simulador Monte Sua Ponte (simuladores.js) quando a ponte
// sobrevive aos 3 estágios de carga. 1x só — depois vira no-op.
function concederConquistaPonte() {
  const estado = obterEstadoJogo();
  if (estado.conquistas.includes("ponte-redimida")) return;
  estado.conquistas.push("ponte-redimida");
  salvarEstadoJogo(estado);
  mostrarToast("Conquista: Ponte Redimida", "🌉");
  atualizarGaleriaConquistas();
}

// ---------- Caderno do Aprendiz (anotações por runa) ----------
// Sem XP direto de propósito (anti-farm): escrever premia só via a
// conquista "Escriba do Reino" (5 runas com nota).

const NOTA_RUNA_MAX = 600;

function obterNotaRuna(runaId) {
  const notas = obterEstadoJogo().notasRunas || {};
  return notas[runaId] || "";
}

function salvarNotaRuna(runaId, texto) {
  const estado = obterEstadoJogo();
  if (!estado.notasRunas) estado.notasRunas = {};
  const limpo = (texto || "").slice(0, NOTA_RUNA_MAX).trim();
  if (limpo) {
    estado.notasRunas[runaId] = limpo;
  } else {
    delete estado.notasRunas[runaId]; // nota apagada não ocupa o save
  }
  salvarEstadoJogo(estado);
  verificarConquistas();
}

// ---------- Missões dos blocos ("Julgamento do Reino") ----------

// Chamado toda vez que app.js redesenha a lista de blocos — e também direto
// ao vencer um Julgamento, SEM re-render (pra não fechar os painéis abertos).
// Por isso tira antes os botões que uma chamada anterior já tinha posto;
// senão os reinos completos acumulavam botões repetidos.
function aposRenderizarBlocos() {
  const estado = obterEstadoJogo();
  const lidas = obterRunasLidas();

  document.querySelectorAll(".botao-julgamento-reino").forEach((botaoAntigo) => botaoAntigo.remove());

  document.querySelectorAll("[data-bloco-id]").forEach((painelDom) => {
    const blocoId = painelDom.dataset.blocoId;
    const bloco = reinosDados.find((b) => b.id === blocoId);
    if (!bloco) return;

    const blocoCompleto = bloco.subtemas.every((st) => lidas.includes(st.id));
    if (!blocoCompleto) return; // ainda não liberou nada pra esse bloco

    const missaoFeita = estado.missoesCompletas.includes(blocoId);
    const cabecalho = painelDom.querySelector(".cabecalho-bloco");
    if (!cabecalho) return;

    const botao = document.createElement("button");
    botao.className = "btn-gotico botao-julgamento-reino"; // a 2ª classe marca o botão pra remoção acima
    botao.style.cssText = "margin-top:0.75rem; width:100%; font-size:0.75rem;";
    botao.textContent = missaoFeita ? "✅ Julgamento superado" : "🎯 Julgamento do Reino liberado!";
    if (missaoFeita) botao.style.opacity = "0.6";

    botao.addEventListener("click", (evento) => {
      evento.stopPropagation(); // não fecha/abre o bloco ao clicar no botão
      abrirModalMissao(blocoId);
    });

    painelDom.appendChild(botao);

    // Julgamento Supremo (mini-boss): só aparece depois que a missão normal já foi vencida
    if (missaoFeita) {
      const bossFeito = estado.missoesBossCompletas.includes(blocoId);
      const botaoBoss = document.createElement("button");
      botaoBoss.className = "btn-gotico botao-julgamento-reino";
      botaoBoss.style.cssText = "margin-top:0.5rem; width:100%; font-size:0.75rem; border-color:#c0392b;";
      botaoBoss.textContent = bossFeito ? "👑 Julgamento Supremo superado" : "🔥 Julgamento Supremo (desafio extra)";
      if (bossFeito) botaoBoss.style.opacity = "0.6";

      botaoBoss.addEventListener("click", (evento) => {
        evento.stopPropagation();
        abrirModalMissaoBoss(blocoId);
      });

      painelDom.appendChild(botaoBoss);
    }
  });
}

function abrirModalMissao(blocoId) {
  const bloco = reinosDados.find((b) => b.id === blocoId);
  const perguntas = missoesPorBloco[blocoId];
  if (!bloco || !perguntas) return;

  fecharModalRuna(); // reaproveita a função de fechar modal do app.js

  const overlay = document.createElement("div");
  overlay.id = "modal-missao-overlay";
  overlay.style.cssText = `
    position: fixed; inset: 0; z-index: 50;
    background: rgba(6,7,10,0.9);
    display: flex; align-items: center; justify-content: center;
    padding: 1rem;
  `;

  const painel = document.createElement("div");
  painel.className = "painel-leitura";
  painel.style.cssText = "max-width: 560px; width: 100%; max-height: 85vh; overflow-y: auto; padding: 2rem; position: relative;";

  const respostas = new Array(perguntas.length).fill(null);

  painel.innerHTML = `
    <button id="fechar-modal-missao" aria-label="Fechar" class="btn-gotico"
      style="position:absolute; top:0.75rem; right:0.75rem; padding:0.3rem 0.7rem; font-size:0.9rem;">
      ✕
    </button>
    <h2 class="font-display" style="margin-top:0;">⚔️ Julgamento: ${(bloco.title.split("—")[1] || bloco.title).trim()}</h2>
    <p style="font-style: italic; opacity: 0.85;">O Mago Aurelius testa o que aprendeste. Acerta pelo menos 2 de 3 perguntas para conquistar o selo deste reino.</p>
    <div class="divisor-rune"></div>
    <div id="lista-perguntas-missao"></div>
    <button id="confirmar-missao" class="btn-gotico" style="width:100%; margin-top:1rem;">Confirmar respostas</button>
    <div id="resultado-missao" style="margin-top:1rem;"></div>
  `;

  const listaPerguntas = painel.querySelector("#lista-perguntas-missao");
  perguntas.forEach((p, indicePergunta) => {
    const bloco2 = document.createElement("div");
    bloco2.style.cssText = "margin-bottom:1.2rem;";
    bloco2.innerHTML = `<p style="font-weight:bold; margin-bottom:0.5rem;">${indicePergunta + 1}. ${p.pergunta}</p>`;

    const opcoesContainer = document.createElement("div");
    opcoesContainer.style.cssText = "display:flex; flex-direction:column; gap:0.4rem;";

    // ordem embaralhada na tela; indiceOpcao é o índice ORIGINAL (o de p.correta)
    opcoesEmbaralhadas(p).forEach(({ texto: textoOpcao, indiceOriginal: indiceOpcao }) => {
      const botaoOpcao = document.createElement("button");
      botaoOpcao.type = "button";
      botaoOpcao.className = "btn-gotico";
      botaoOpcao.style.cssText = "text-align:left; font-size:0.78rem; padding:0.5rem 0.75rem;";
      botaoOpcao.textContent = textoOpcao;
      botaoOpcao.addEventListener("click", () => {
        respostas[indicePergunta] = indiceOpcao;
        // marca visualmente qual opção está selecionada nessa pergunta
        // (texto escuro no ciano: o creme do btn-gotico ficava ilegível, contraste 1,14:1)
        opcoesContainer.querySelectorAll("button").forEach((b) => {
          b.style.background = "";
          b.style.color = "";
        });
        botaoOpcao.style.background = "var(--ciano-mistico)";
        botaoOpcao.style.color = "var(--accent-foreground)";
      });
      opcoesContainer.appendChild(botaoOpcao);
    });

    bloco2.appendChild(opcoesContainer);
    listaPerguntas.appendChild(bloco2);
  });

  overlay.appendChild(painel);
  document.body.appendChild(overlay);

  overlay.addEventListener("click", (evento) => {
    if (evento.target === overlay) fecharModalMissao();
  });
  painel.querySelector("#fechar-modal-missao").addEventListener("click", fecharModalMissao);

  painel.querySelector("#confirmar-missao").addEventListener("click", () => {
    if (respostas.includes(null)) {
      mostrarToast("Responde todas as perguntas antes de confirmar!", "⚠️");
      return;
    }
    let acertos = 0;
    perguntas.forEach((p, i) => {
      if (respostas[i] === p.correta) acertos++;
    });

    const resultadoEl = painel.querySelector("#resultado-missao");
    const passou = acertos >= 2;

    if (passou) {
      const estado = obterEstadoJogo();
      if (!estado.missoesCompletas.includes(blocoId)) {
        estado.missoesCompletas.push(blocoId);
        estado.xp += 30;
        const selo = "selo-" + blocoId;
        if (!estado.conquistas.includes(selo)) estado.conquistas.push(selo);
        salvarEstadoJogo(estado);
        atualizarBarraXP();
        atualizarGaleriaConquistas();
        mostrarToast(`Julgamento superado! +30 PR`, SELOS_MISSAO[blocoId].icone);
      }
      resultadoEl.innerHTML = `
        <div class="painel-pergaminho-velho" style="padding:1rem; border-radius:10px;">
          <strong>${acertos}/3 corretas — Julgamento superado! 🏆</strong>
          <p style="margin-top:0.5rem; font-style:italic;">"O Reino reconhece a tua sabedoria. Que a próxima runa te espere de braços abertos." — Mago Aurelius</p>
        </div>
      `;
      aposRenderizarBlocos(); // troca (sem duplicar) o botão do bloco pra "Julgamento superado"
    } else {
      const consolo = concederXPConsolo("missao-" + blocoId);
      resultadoEl.innerHTML = `
        <div class="painel-pergaminho-velho" style="padding:1rem; border-radius:10px;">
          <strong>${acertos}/3 corretas — quase lá!</strong>
          <p style="margin-top:0.5rem;">Relê as runas deste reino e tenta de novo quando quiseres. Fecha esta janela e reabre o Julgamento quando estiver pronto.</p>
          ${consolo ? '<p style="margin-top:0.5rem;"><strong>✨ Teu esforço não foi em vão: +5 Poder Rúnico!</strong></p>' : ""}
        </div>
      `;
    }
  });

  document.addEventListener("keydown", fecharComEscMissao);
}

function fecharComEscMissao(evento) {
  if (evento.key === "Escape") fecharModalMissao();
}

function fecharModalMissao() {
  const overlay = document.getElementById("modal-missao-overlay");
  if (overlay) overlay.remove();
  document.removeEventListener("keydown", fecharComEscMissao);
}

function abrirModalMissaoBoss(blocoId) {
  const bloco = reinosDados.find((b) => b.id === blocoId);
  const perguntasBase = missoesPorBloco[blocoId] || [];
  const perguntasExtras = missoesBossPorBloco[blocoId] || [];
  const perguntas = [...perguntasBase, ...perguntasExtras]; // 5 perguntas no total
  if (!bloco || perguntas.length === 0) return;

  fecharModalRuna();
  fecharModalMissao();

  const overlay = document.createElement("div");
  overlay.id = "modal-missao-boss-overlay";
  overlay.style.cssText = `
    position: fixed; inset: 0; z-index: 50;
    background: rgba(6,7,10,0.9);
    display: flex; align-items: center; justify-content: center;
    padding: 1rem;
  `;

  const painel = document.createElement("div");
  painel.className = "painel-leitura";
  painel.style.cssText = "max-width: 560px; width: 100%; max-height: 85vh; overflow-y: auto; padding: 2rem; position: relative; border-color:#c0392b;";

  const respostas = new Array(perguntas.length).fill(null);

  painel.innerHTML = `
    <button id="fechar-modal-missao-boss" aria-label="Fechar" class="btn-gotico"
      style="position:absolute; top:0.75rem; right:0.75rem; padding:0.3rem 0.7rem; font-size:0.9rem;">
      ✕
    </button>
    <h2 class="font-display" style="margin-top:0;">👑 Julgamento Supremo: ${(bloco.title.split("—")[1] || bloco.title).trim()}</h2>
    <p style="font-style: italic; opacity: 0.85;">O desafio extra do Mago Aurelius. Acerta pelo menos 4 de 5 perguntas para conquistar o selo supremo deste reino.</p>
    <div class="divisor-rune"></div>
    <div id="lista-perguntas-missao-boss"></div>
    <button id="confirmar-missao-boss" class="btn-gotico" style="width:100%; margin-top:1rem;">Confirmar respostas</button>
    <div id="resultado-missao-boss" style="margin-top:1rem;"></div>
  `;

  const listaPerguntas = painel.querySelector("#lista-perguntas-missao-boss");
  perguntas.forEach((p, indicePergunta) => {
    const blocoPergunta = document.createElement("div");
    blocoPergunta.style.cssText = "margin-bottom:1.2rem;";
    blocoPergunta.innerHTML = `<p style="font-weight:bold; margin-bottom:0.5rem;">${indicePergunta + 1}. ${p.pergunta}</p>`;

    const opcoesContainer = document.createElement("div");
    opcoesContainer.style.cssText = "display:flex; flex-direction:column; gap:0.4rem;";

    // ordem embaralhada na tela; indiceOpcao é o índice ORIGINAL (o de p.correta)
    opcoesEmbaralhadas(p).forEach(({ texto: textoOpcao, indiceOriginal: indiceOpcao }) => {
      const botaoOpcao = document.createElement("button");
      botaoOpcao.type = "button";
      botaoOpcao.className = "btn-gotico";
      botaoOpcao.style.cssText = "text-align:left; font-size:0.78rem; padding:0.5rem 0.75rem;";
      botaoOpcao.textContent = textoOpcao;
      botaoOpcao.addEventListener("click", () => {
        respostas[indicePergunta] = indiceOpcao;
        opcoesContainer.querySelectorAll("button").forEach((b) => (b.style.background = ""));
        botaoOpcao.style.background = "#c0392b";
      });
      opcoesContainer.appendChild(botaoOpcao);
    });

    blocoPergunta.appendChild(opcoesContainer);
    listaPerguntas.appendChild(blocoPergunta);
  });

  overlay.appendChild(painel);
  document.body.appendChild(overlay);

  overlay.addEventListener("click", (evento) => {
    if (evento.target === overlay) fecharModalMissaoBoss();
  });
  painel.querySelector("#fechar-modal-missao-boss").addEventListener("click", fecharModalMissaoBoss);

  painel.querySelector("#confirmar-missao-boss").addEventListener("click", () => {
    if (respostas.includes(null)) {
      mostrarToast("Responde todas as perguntas antes de confirmar!", "⚠️");
      return;
    }
    let acertos = 0;
    perguntas.forEach((p, i) => {
      if (respostas[i] === p.correta) acertos++;
    });

    const resultadoEl = painel.querySelector("#resultado-missao-boss");
    const passou = acertos >= 4;

    if (passou) {
      const estado = obterEstadoJogo();
      if (!estado.missoesBossCompletas.includes(blocoId)) {
        estado.missoesBossCompletas.push(blocoId);
        estado.xp += 50;
        const selo = "boss-" + blocoId;
        if (!estado.conquistas.includes(selo)) estado.conquistas.push(selo);
        salvarEstadoJogo(estado);
        atualizarBarraXP();
        atualizarGaleriaConquistas();
        mostrarToast(`Julgamento Supremo superado! +50 PR`, "👑");
      }
      resultadoEl.innerHTML = `
        <div class="painel-pergaminho-velho" style="padding:1rem; border-radius:10px;">
          <strong>${acertos}/5 corretas — Julgamento Supremo superado! 👑</strong>
          <p style="margin-top:0.5rem; font-style:italic;">"Poucos chegam tão longe. O Reino te reconhece como verdadeiro Mestre." — Mago Aurelius</p>
        </div>
      `;
      aposRenderizarBlocos(); // troca (sem duplicar) o botão pra "Julgamento Supremo superado"
    } else {
      const consolo = concederXPConsolo("boss-" + blocoId);
      resultadoEl.innerHTML = `
        <div class="painel-pergaminho-velho" style="padding:1rem; border-radius:10px;">
          <strong>${acertos}/5 corretas — ainda não é dessa vez</strong>
          <p style="margin-top:0.5rem;">O Julgamento Supremo é exigente. Relê as runas deste reino e tenta de novo quando quiseres.</p>
          ${consolo ? '<p style="margin-top:0.5rem;"><strong>✨ Teu esforço não foi em vão: +5 Poder Rúnico!</strong></p>' : ""}
        </div>
      `;
    }
  });

  document.addEventListener("keydown", fecharComEscMissaoBoss);
}

function fecharComEscMissaoBoss(evento) {
  if (evento.key === "Escape") fecharModalMissaoBoss();
}

function fecharModalMissaoBoss() {
  const overlay = document.getElementById("modal-missao-boss-overlay");
  if (overlay) overlay.remove();
  document.removeEventListener("keydown", fecharComEscMissaoBoss);
}

// ---------- Inicialização ----------

document.addEventListener("DOMContentLoaded", () => {
  montarBarraXP();
  montarChamaForjador();
  montarBotaoDiario();
  atualizarStreak();
  atualizarChamaForjador();
  montarGaleriaConquistas();
  verificarConquistas();
  atualizarBrasaoAvatar();
});
