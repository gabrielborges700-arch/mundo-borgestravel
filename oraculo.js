/**
 * oraculo.js — O Oráculo do Mago Aurelius (Fase 7)
 *
 * IMPORTANTE: este site é 100% estático (HTML/CSS/JS puro, sem servidor).
 * Por isso o Oráculo NÃO usa uma IA externa de verdade (isso exigiria
 * uma chave de API secreta, que não pode ficar exposta num arquivo
 * público). Em vez disso, ele responde com base no banco de
 * curiosidades e na lógica de palavras-chave — o mesmo esquema de
 * "resposta offline" que já existia nos protótipos originais.
 *
 * Se no futuro você quiser um oráculo com IA de verdade, dá pra criar
 * um pequeno servidor (ex: Cloudflare Workers) que guarda a chave em
 * segredo e faz a chamada por trás — isso fica pra uma fase separada,
 * se você quiser.
 */

// Extrai fatos curtos (linhas que começam com "- ") do grande texto de curiosidades
function extrairFatosCuriosidade() {
  return CURIOSIDADES_DIVERSOES
    .split("\n")
    .filter((linha) => linha.trim().startsWith("- "))
    .map((linha) => linha.trim().replace(/^- /, ""));
}

const FATOS_CURIOSIDADE = extrairFatosCuriosidade();

const SAUDACAO_INICIAL =
  "Saudações, aprendiz de construtor! Eu sou o Mago Aurelius. Que enigmas estruturais de forças, materiais ou pontes tentas resolver hoje?";

const RESPOSTA_PADRAO =
  "As correntes do éter mágico estão adormecidas no momento, mas a minha sabedoria antiga permanece: na engenharia, toda força invisível deve encontrar seu caminho até a terra sem que a matéria se quebra!";

// Respostas por palavra-chave (ordem importa: a primeira que bater, ganha)
const REGRAS_PALAVRA_CHAVE = [
  {
    palavras: ["curiosidade", "conta", "sabia", "fato"],
    responder: () => FATOS_CURIOSIDADE[Math.floor(Math.random() * FATOS_CURIOSIDADE.length)],
  },
  {
    palavras: ["vento", "deflex", "torre"],
    responder: () =>
      "Ah, o vento! Ele empurra as torres como um gigante invisível. Quanto mais alta e rígida a estrutura, maior o desafio — por isso os engenheiros usam amortecedores e fundações profundas para domar essa força. Vai até a runa 0.3 pra sentir isso na prática!",
  },
  {
    palavras: ["arco", "ponte"],
    responder: () =>
      "O arco é uma das invenções mais espertas da engenharia: ele transforma o peso de cima em compressão, empurrando as forças pelas próprias pedras até o chão — sem precisar de argamassa forte! Experimenta montar um na runa 0.8.",
  },
  {
    palavras: ["forca", "força", "equilibrio", "equilíbrio"],
    responder: () =>
      "Toda estrutura parada obedece a uma lei sagrada: a soma de todas as forças deve ser zero. Peso pra baixo, reação pra cima — se não empatar, ela desaba! Vai na runa 0.7 pra testar esse equilíbrio com as próprias mãos.",
  },
  {
    palavras: ["material", "concreto", "aço", "pedra"],
    responder: () =>
      "Cada era escolheu seu material: pedra e tijolo pros antigos, aço e concreto armado pros modernos. O concreto é forte na compressão mas fraco na tração — por isso colocamos barras de aço dentro dele, que fazem o trabalho inverso!",
  },
  {
    palavras: ["ola", "olá", "oi", "quem"],
    responder: () => SAUDACAO_INICIAL,
  },
];

function obterRespostaOraculo(pergunta) {
  const perguntaMin = pergunta.toLowerCase();

  for (const regra of REGRAS_PALAVRA_CHAVE) {
    if (regra.palavras.some((palavra) => perguntaMin.includes(palavra))) {
      return regra.responder();
    }
  }

  return RESPOSTA_PADRAO;
}

// ---------- Interface do Oráculo (avatar flutuante + balão de chat) ----------

let chatAberto = false;
let historicoChat = [{ autor: "mago", texto: SAUDACAO_INICIAL }];

function montarOraculo() {
  const container = document.createElement("div");
  container.id = "oraculo-container";
  container.style.cssText = "position: fixed; bottom: 1rem; right: 1rem; z-index: 60; display:flex; flex-direction:column; align-items:flex-end; gap:0.5rem;";
  document.body.appendChild(container);

  renderizarOraculo();
}

function renderizarOraculo() {
  const container = document.getElementById("oraculo-container");
  container.innerHTML = "";

  if (chatAberto) {
    const balao = document.createElement("div");
    balao.className = "balao-fala";
    balao.style.cssText = "width: min(90vw, 300px); height: 400px; display:flex; flex-direction:column; overflow:hidden;";

    balao.innerHTML = `
      <div style="background:#1c1e22; color:var(--ouro-velho); padding:0.6rem; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--bronze-envelhecido);">
        <span class="font-display" style="font-size:0.8rem; font-weight:bold;">🔮 Aurelius Arcano</span>
        <button id="fechar-oraculo" style="background:none; border:none; color:var(--pergaminho); cursor:pointer; font-size:0.9rem;">✖</button>
      </div>
      <div id="mensagens-oraculo" style="flex:1; overflow-y:auto; padding:0.6rem; display:flex; flex-direction:column; gap:0.5rem; background:#f4e8cc;"></div>
      <form id="form-oraculo" style="padding:0.5rem; background:#e3d5b5; border-top:1px solid var(--bronze-envelhecido); display:flex; gap:0.4rem;">
        <input id="input-oraculo" type="text" placeholder="Indaga o Mago..." class="chat-input" style="flex:1; padding:0.4rem 0.6rem; border-radius:6px; font-size:0.75rem;">
        <button type="submit" style="background:#1c1e22; color:var(--ouro-velho); border:none; padding:0.4rem 0.7rem; border-radius:6px; font-weight:bold; cursor:pointer;">✨</button>
      </form>
    `;
    container.appendChild(balao);

    const mensagensEl = balao.querySelector("#mensagens-oraculo");
    historicoChat.forEach((msg) => mensagensEl.appendChild(criarBolhaMensagem(msg)));
    mensagensEl.scrollTop = mensagensEl.scrollHeight;

    balao.querySelector("#fechar-oraculo").addEventListener("click", () => {
      chatAberto = false;
      renderizarOraculo();
    });

    balao.querySelector("#form-oraculo").addEventListener("submit", (evento) => {
      evento.preventDefault();
      const input = balao.querySelector("#input-oraculo");
      const pergunta = input.value.trim();
      if (!pergunta) return;

      historicoChat.push({ autor: "usuario", texto: pergunta });
      input.value = "";
      renderizarOraculo();

      // Pequeno atraso simulado, pra parecer que o mago está "consultando os tomos"
      setTimeout(() => {
        historicoChat.push({ autor: "mago", texto: obterRespostaOraculo(pergunta) });
        renderizarOraculo();
      }, 500);
    });

    // Foca no input automaticamente ao abrir
    balao.querySelector("#input-oraculo").focus();
  } else {
    const botao = document.createElement("button");
    botao.className = "avatar-mago flutuando";
    botao.style.cssText = "width:56px; height:56px; border-radius:50%; background:#1c1e22; border:none; font-size:1.5rem; cursor:pointer;";
    botao.textContent = "🧙‍♂️";
    botao.setAttribute("aria-label", "Abrir o Oráculo do Mago Aurelius");
    botao.addEventListener("click", () => {
      chatAberto = true;
      renderizarOraculo();
    });
    container.appendChild(botao);
  }
}

function criarBolhaMensagem(msg) {
  const bolha = document.createElement("div");
  const doUsuario = msg.autor === "usuario";
  bolha.style.cssText = `
    padding:0.6rem; border-radius:8px; font-size:0.75rem; line-height:1.4; max-width:85%;
    align-self:${doUsuario ? "flex-end" : "flex-start"};
    background:${doUsuario ? "#1c1e22" : "#e3d5b5"};
    color:${doUsuario ? "var(--pergaminho)" : "#3e3222"};
    border:1px solid ${doUsuario ? "var(--ciano-mistico)" : "var(--bronze-envelhecido)"};
  `;
  bolha.textContent = msg.texto;
  return bolha;
}

document.addEventListener("DOMContentLoaded", montarOraculo);
