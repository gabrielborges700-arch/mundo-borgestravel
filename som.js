/**
 * som.js — Sons do Mundo Borgestrável (efeitos curtos + ambiente opcional)
 *
 * Tudo sintetizado com Web Audio (osciladores), sem nenhum arquivo de áudio.
 * Adaptado do motor de áudio do protótipo Base44 (tocarRuna, tocarConquista,
 * drone por reino), com volume mais baixo pra sala de aula.
 *
 * - O AudioContext só nasce DEPOIS do primeiro gesto do usuário (toque,
 *   clique ou tecla). Antes disso somTocar() não faz nada: nenhum som
 *   toca sozinho ao abrir a página (políticas de autoplay + bom senso).
 * - Efeitos (abrir runa, +XP, conquista, acerto, erro, abrir reino):
 *   ligados por padrão. Ambiente (drone grave por reino): DESLIGADO por padrão.
 * - Botão flutuante de mudo (🔊/🔇) no canto inferior esquerdo, acima do
 *   "voltar ao topo", e um botão menor 🎶 pra ligar/desligar o ambiente.
 * - Preferências salvas em "borgestravel_som" via armazenamentoGravar()
 *   (navegacao.js), no formato {"mudo":false,"ambiente":false}.
 * - Navegador sem Web Audio (ou que bloqueia): tudo vira silêncio, sem erro.
 *
 * API pública (funções de topo, chamadas por app.js, jogo.js e navegacao.js
 * sempre com guarda `typeof somTocar === "function"`):
 *   somTocar(tipo, blocoId?) — tipo: "runa" | "xp" | "conquista" | "acerto" |
 *                              "erro" | "reino" (blocoId afina o tom do reino)
 *   somMudo()                — true se está silenciado; somMudo(true/false) define
 *   somAlternarMudo()        — inverte o mudo e devolve o novo estado
 *   somAmbiente() / somAlternarAmbiente() — mesmo esquema pro drone
 */

const CHAVE_SOM = "borgestravel_som";

// Volume geral bem baixo: o pico de um efeito fica em torno de 10% da escala
const VOLUME_GERAL = 0.5;
const VOLUME_EFEITOS = 0.32;
const VOLUME_AMBIENTE = 0.05;

// Notas raiz (drone grave) dos 7 reinos — escala mística ascendente (Base44).
// A Ilha Amaldiçoada ganha um Sol grave, mais sombrio que o do bloco 0.
const RAIZES_REINOS = [110.0, 130.81, 146.83, 164.81, 196.0, 220.0, 246.94];
const RAIZ_ILHA = 98.0;

let somContexto = null; // AudioContext (criado preguiçosamente)
let somMestre = null; // ganho final: o mudo faz rampa aqui
let somBarramentoEfeitos = null; // efeitos passam por um filtro que tira o agudo estridente
let somEco = null; // um único eco curto compartilhado (antes era um por som)
let somGestoOcorreu = false;
let somIndisponivel = false; // sem Web Audio ou o construtor falhou: desiste de vez
let somInstanteLivre = 0; // fila curta: sons disparados juntos saem em sequência
const somUltimoPorTipo = {}; // evita o mesmo efeito duas vezes no mesmo instante

let somAmbienteAtivo = null; // { nos: [...osciladores], ganho, raiz }
let somRaizAmbiente = RAIZES_REINOS[0];

// ---------- Preferências (mudo / ambiente) ----------

function lerPreferenciasSom() {
  const padrao = { mudo: false, ambiente: false };
  try {
    const salvo = typeof armazenamentoLer === "function" ? armazenamentoLer(CHAVE_SOM) : null;
    const dados = salvo ? JSON.parse(salvo) : null;
    if (!dados || typeof dados !== "object") return padrao;
    return { mudo: dados.mudo === true, ambiente: dados.ambiente === true };
  } catch (erro) {
    return padrao; // JSON corrompido: volta pro padrão sem quebrar nada
  }
}

const preferenciasSom = lerPreferenciasSom();

function salvarPreferenciasSom() {
  if (typeof armazenamentoGravar !== "function") return;
  armazenamentoGravar(CHAVE_SOM, JSON.stringify(preferenciasSom));
}

// ---------- Contexto de áudio (só depois de um gesto) ----------

function garantirContextoSom() {
  if (somIndisponivel || !somGestoOcorreu) return null;
  if (!somContexto) {
    try {
      const Contexto = window.AudioContext || window.webkitAudioContext;
      if (!Contexto) {
        somIndisponivel = true;
        return null;
      }
      somContexto = new Contexto();

      somMestre = somContexto.createGain();
      somMestre.gain.value = preferenciasSom.mudo ? 0 : VOLUME_GERAL;
      somMestre.connect(somContexto.destination);

      // Passa-baixa suave: corta o "chiado" dos harmônicos em caixinha de som de notebook
      const filtro = somContexto.createBiquadFilter();
      filtro.type = "lowpass";
      filtro.frequency.value = 4200;
      somBarramentoEfeitos = somContexto.createGain();
      somBarramentoEfeitos.gain.value = VOLUME_EFEITOS;
      somBarramentoEfeitos.connect(filtro);
      filtro.connect(somMestre);

      // Eco curto (cauda "mágica") com realimentação baixa, criado uma vez só
      somEco = somContexto.createDelay(1);
      somEco.delayTime.value = 0.14;
      const realimentacao = somContexto.createGain();
      realimentacao.gain.value = 0.28;
      somEco.connect(realimentacao);
      realimentacao.connect(somEco);
      somEco.connect(somBarramentoEfeitos);
    } catch (erro) {
      somIndisponivel = true; // navegador recusou o áudio: o site segue mudo
      somContexto = null;
      return null;
    }
  }
  if (somContexto.state === "suspended" && !document.hidden) {
    try {
      const promessa = somContexto.resume();
      if (promessa && promessa.catch) promessa.catch(() => {});
    } catch (erro) {
      // resume pode falhar fora de um gesto; o próximo gesto tenta de novo
    }
  }
  return somContexto;
}

// Primeiro gesto libera o áudio. O ouvinte fica ativo (é barato) porque alguns
// navegadores só aceitam o resume() de dentro de um gesto.
// Teclas que o Chrome NÃO conta como gesto (Esc, Tab e modificadores sozinhos)
const TECLAS_SEM_GESTO_SOM = ["Escape", "Tab", "Shift", "Control", "Alt", "Meta", "CapsLock"];

function aoGestoUsuarioSom(evento) {
  if (evento && evento.type === "keydown" && TECLAS_SEM_GESTO_SOM.includes(evento.key)) return;
  somGestoOcorreu = true;
  if (!preferenciasSom.mudo) {
    garantirContextoSom();
    if (preferenciasSom.ambiente) atualizarAmbiente();
  }
}

// pointerup (e não pointerdown/touchstart): no toque, a ativação do navegador só vem ao soltar o dedo
["pointerup", "keydown"].forEach((tipo) => {
  window.addEventListener(tipo, aoGestoUsuarioSom, { capture: true, passive: true });
});

// ---------- Notas (blocos básicos dos efeitos) ----------

// Uma nota com ataque curto e queda exponencial (soa como sininho, não como bipe)
function tocarNota(freq, inicio, duracao, tipo, volume, destino) {
  const c = somContexto;
  const osc = c.createOscillator();
  const ganho = c.createGain();
  osc.type = tipo || "sine";
  osc.frequency.setValueAtTime(freq, inicio);
  ganho.gain.setValueAtTime(0.0001, inicio);
  ganho.gain.linearRampToValueAtTime(volume, inicio + 0.015);
  ganho.gain.exponentialRampToValueAtTime(0.0001, inicio + duracao);
  osc.connect(ganho);
  ganho.connect(destino || somBarramentoEfeitos);
  osc.start(inicio);
  osc.stop(inicio + duracao + 0.05);
  return osc;
}

// Reserva o horário de início na fila: abrir runa + XP + conquista disparam
// quase juntos e virariam um "acorde" embolado; assim saem um atrás do outro.
// Fila com mais de 0,7 s de espera descarta o som (cliques rápidos no Sprint).
function reservarInicioSom(ocupacao) {
  const agora = somContexto.currentTime + 0.01;
  const inicio = Math.max(agora, somInstanteLivre);
  if (inicio - agora > 0.7) return null;
  somInstanteLivre = inicio + ocupacao;
  return inicio;
}

function raizDoReino(blocoId) {
  if (blocoId === "ilha") return RAIZ_ILHA;
  const numero = parseInt(String(blocoId || "").replace(/\D/g, ""), 10);
  return RAIZES_REINOS[numero] || RAIZES_REINOS[0];
}

// ---------- Efeitos ----------
// Cada efeito: [quanto tempo "ocupa" a fila, função que toca a partir de t]

const EFEITOS_SOM = {
  // Abrir runa: dois sininhos (quinta) com eco curto
  runa: [0.14, (t) => {
    tocarNota(880, t, 0.35, "sine", 0.55, somEco);
    tocarNota(1318.5, t + 0.04, 0.4, "sine", 0.3, somEco);
    tocarNota(659.25, t + 0.06, 0.3, "triangle", 0.25);
  }],
  // Ler runa (+XP): faísca de três notas subindo, bem leve
  xp: [0.16, (t) => {
    [783.99, 987.77, 1174.66].forEach((f, i) => tocarNota(f, t + i * 0.06, 0.25, "sine", 0.35, somEco));
  }],
  // Conquista: arpejo de Dó maior com o brilho da oitava (Base44)
  conquista: [0.45, (t) => {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
      tocarNota(f, t + i * 0.09, 0.6, "sine", 0.5, somEco);
      tocarNota(f * 2, t + i * 0.09, 0.45, "triangle", 0.12);
    });
  }],
  // Acerto: "plim-plim" subindo
  acerto: [0.14, (t) => {
    tocarNota(587.33, t, 0.18, "sine", 0.45);
    tocarNota(880, t + 0.08, 0.3, "sine", 0.45, somEco);
  }],
  // Erro: "ô-ôu" grave e macio (triângulo, sem nada áspero) — avisa sem assustar
  erro: [0.2, (t) => {
    tocarNota(329.63, t, 0.2, "triangle", 0.4);
    tocarNota(261.63, t + 0.14, 0.32, "triangle", 0.4);
  }],
  // Abrir reino: sino grave no tom do reino (oitava + quinta da raiz do drone)
  reino: [0.3, (t, blocoId) => {
    const raiz = raizDoReino(blocoId) * 2;
    tocarNota(raiz, t, 1.3, "sine", 0.45, somEco);
    tocarNota(raiz * 1.5, t + 0.05, 1.1, "sine", 0.22);
    tocarNota(raiz * 2, t + 0.1, 0.9, "triangle", 0.08);
  }],
  // Confirmação ao religar o som (o próprio clique no botão é o gesto)
  clique: [0.08, (t) => {
    tocarNota(1046.5, t, 0.15, "sine", 0.3);
  }],
};

function somTocar(tipo, blocoId) {
  try {
    const efeito = EFEITOS_SOM[tipo];
    if (!efeito || preferenciasSom.mudo || !somGestoOcorreu) return;
    // Aba escondida: nada de som (e o ambiente fica suspenso)
    if (document.hidden) return;
    const c = garantirContextoSom();
    if (!c) return;

    // Mesmo efeito pedido duas vezes no mesmo instante (dois hooks): toca uma só.
    // Relógio do sistema (e não o do áudio, que fica parado enquanto suspenso).
    const agora = Date.now();
    if (somUltimoPorTipo[tipo] !== undefined && agora - somUltimoPorTipo[tipo] < 80) return;
    somUltimoPorTipo[tipo] = agora;

    // O sino do reino também troca o drone (se o ambiente estiver ligado)
    if (tipo === "reino") definirReinoSom(blocoId);

    const inicio = reservarInicioSom(efeito[0]);
    if (inicio === null) return;
    efeito[1](inicio, blocoId);
  } catch (erro) {
    // som é enfeite: qualquer falha aqui fica em silêncio
  }
}

// ---------- Ambiente (drone por reino, desligado por padrão) ----------

function criarPadAmbiente(freq) {
  const c = somContexto;
  const ganho = c.createGain();
  ganho.gain.value = 0.0001;
  ganho.connect(somMestre);

  const osc1 = c.createOscillator();
  osc1.type = "sine";
  osc1.frequency.value = freq;
  const osc2 = c.createOscillator();
  osc2.type = "sine";
  osc2.frequency.value = freq * 1.007; // levemente desafinado: dá o "batimento" que respira

  const filtro = c.createBiquadFilter();
  filtro.type = "lowpass";
  filtro.frequency.value = 700;
  filtro.Q.value = 0.8;
  osc1.connect(filtro);
  osc2.connect(filtro);
  filtro.connect(ganho);

  // Oitava em triângulo bem baixinha: em alto-falante pequeno o grave some sem ela
  const osc3 = c.createOscillator();
  osc3.type = "triangle";
  osc3.frequency.value = freq * 2;
  const ganho3 = c.createGain();
  ganho3.gain.value = 0.12;
  osc3.connect(ganho3);
  ganho3.connect(ganho);

  // LFO lento abrindo e fechando o filtro
  const lfo = c.createOscillator();
  lfo.type = "sine";
  lfo.frequency.value = 0.05;
  const ganhoLfo = c.createGain();
  ganhoLfo.gain.value = 160;
  lfo.connect(ganhoLfo);
  ganhoLfo.connect(filtro.frequency);

  [osc1, osc2, osc3, lfo].forEach((o) => o.start());
  return { nos: [osc1, osc2, osc3, lfo], ganho, raiz: freq };
}

function desligarPadAmbiente(pad, segundos) {
  const c = somContexto;
  try {
    pad.ganho.gain.cancelScheduledValues(c.currentTime);
    pad.ganho.gain.setValueAtTime(pad.ganho.gain.value, c.currentTime);
    pad.ganho.gain.linearRampToValueAtTime(0.0001, c.currentTime + segundos);
  } catch (erro) {
    // sem rampa: para direto abaixo
  }
  setTimeout(() => {
    pad.nos.forEach((no) => {
      try { no.stop(); } catch (erro) { /* já parado */ }
    });
    try { pad.ganho.disconnect(); } catch (erro) { /* já desconectado */ }
  }, segundos * 1000 + 200);
}

// Liga, troca de reino (cross-fade de 2,5 s) ou desliga o drone conforme as preferências
function atualizarAmbiente() {
  try {
    const deveTocar = preferenciasSom.ambiente && !preferenciasSom.mudo && somGestoOcorreu;
    if (!deveTocar) {
      if (somAmbienteAtivo && somContexto) desligarPadAmbiente(somAmbienteAtivo, 1.2);
      somAmbienteAtivo = null;
      return;
    }
    const c = garantirContextoSom();
    if (!c) return;
    if (somAmbienteAtivo && somAmbienteAtivo.raiz === somRaizAmbiente) return;

    const novo = criarPadAmbiente(somRaizAmbiente);
    novo.ganho.gain.setValueAtTime(0.0001, c.currentTime);
    novo.ganho.gain.linearRampToValueAtTime(VOLUME_AMBIENTE, c.currentTime + 2.5);
    if (somAmbienteAtivo) desligarPadAmbiente(somAmbienteAtivo, 2.5);
    somAmbienteAtivo = novo;
  } catch (erro) {
    somAmbienteAtivo = null;
  }
}

// Chamado pelo sino do reino (somTocar("reino", id)); também pode ser chamado direto
function definirReinoSom(blocoId) {
  somRaizAmbiente = raizDoReino(blocoId);
  if (somAmbienteAtivo) atualizarAmbiente();
}

// Aba escondida (trocou de aba, bloqueou o celular): suspende tudo; volta ao reabrir
document.addEventListener("visibilitychange", () => {
  if (!somContexto) return;
  try {
    if (document.hidden) {
      const p = somContexto.suspend();
      if (p && p.catch) p.catch(() => {});
    } else if (!preferenciasSom.mudo) {
      const p = somContexto.resume();
      if (p && p.catch) p.catch(() => {});
    }
  } catch (erro) {
    // navegador antigo sem suspend/resume: segue como está
  }
});

// ---------- API: mudo e ambiente ----------

function somMudo(valor) {
  if (typeof valor !== "boolean") return preferenciasSom.mudo;
  preferenciasSom.mudo = valor;
  salvarPreferenciasSom();
  try {
    if (somContexto && somMestre) {
      // rampa curta em vez de corte seco (corte seco dá "estalo"); ao religar é
      // mais rápida, senão o "plim" de confirmação nasceria quase sem volume
      const t = somContexto.currentTime;
      somMestre.gain.cancelScheduledValues(t);
      somMestre.gain.setValueAtTime(somMestre.gain.value, t);
      somMestre.gain.linearRampToValueAtTime(valor ? 0 : VOLUME_GERAL, t + (valor ? 0.25 : 0.05));
    }
  } catch (erro) {
    // sem rampa disponível: o próximo somTocar já respeita o mudo
  }
  atualizarAmbiente();
  atualizarBotoesSom();
  return valor;
}

function somAlternarMudo() {
  const novo = somMudo(!preferenciasSom.mudo);
  if (!novo) somTocar("clique"); // religou: um "plim" baixinho confirma que o som voltou
  return novo;
}

function somAmbiente(valor) {
  if (typeof valor !== "boolean") return preferenciasSom.ambiente;
  preferenciasSom.ambiente = valor;
  salvarPreferenciasSom();
  atualizarAmbiente();
  atualizarBotoesSom();
  return valor;
}

function somAlternarAmbiente() {
  return somAmbiente(!preferenciasSom.ambiente);
}

// ---------- Botões flutuantes (🔊/🔇 e 🎶) ----------

function montarControlesSom() {
  if (document.getElementById("som-controles")) return;

  const grupo = document.createElement("div");
  grupo.id = "som-controles";
  grupo.className = "som-controles";
  grupo.setAttribute("role", "group");
  grupo.setAttribute("aria-label", "Controles de som");

  // Ambiente (menor, em cima). Some quando está tudo mudo — não faz sentido sem som.
  const botaoAmbiente = document.createElement("button");
  botaoAmbiente.type = "button";
  botaoAmbiente.id = "botao-ambiente";
  botaoAmbiente.className = "botao-som botao-som-ambiente";
  botaoAmbiente.setAttribute("aria-label", "Música ambiente dos reinos");
  botaoAmbiente.textContent = "🎶";
  botaoAmbiente.addEventListener("click", somAlternarAmbiente);

  // Mudo: aria-label fixo + aria-pressed (padrão de botão liga/desliga acessível)
  const botaoMudo = document.createElement("button");
  botaoMudo.type = "button";
  botaoMudo.id = "botao-mudo";
  botaoMudo.className = "botao-som botao-som-mudo";
  botaoMudo.setAttribute("aria-label", "Silenciar sons");
  botaoMudo.addEventListener("click", somAlternarMudo);

  grupo.appendChild(botaoAmbiente);
  grupo.appendChild(botaoMudo);
  document.body.appendChild(grupo);

  atualizarBotoesSom();
}

function atualizarBotoesSom() {
  const botaoMudo = document.getElementById("botao-mudo");
  const botaoAmbiente = document.getElementById("botao-ambiente");
  if (botaoMudo) {
    const mudo = preferenciasSom.mudo;
    botaoMudo.textContent = mudo ? "🔇" : "🔊";
    botaoMudo.setAttribute("aria-pressed", String(mudo));
    botaoMudo.title = mudo ? "Som desligado — toque pra ligar" : "Som ligado — toque pra silenciar";
    botaoMudo.classList.toggle("ativo", mudo);
  }
  if (botaoAmbiente) {
    const ligado = preferenciasSom.ambiente;
    botaoAmbiente.setAttribute("aria-pressed", String(ligado));
    botaoAmbiente.title = ligado ? "Música ambiente ligada — toque pra desligar" : "Música ambiente desligada — toque pra ligar";
    botaoAmbiente.classList.toggle("ativo", ligado);
    botaoAmbiente.hidden = preferenciasSom.mudo;
  }
}

document.addEventListener("DOMContentLoaded", montarControlesSom);
