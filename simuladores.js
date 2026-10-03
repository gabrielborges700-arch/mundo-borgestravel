/**
 * simuladores.js — Simuladores interativos de física estrutural (Fase 6)
 *
 * Cada função monta um "painel de simulação" que é inserido dentro do
 * modal de leitura quando a runa correspondente é aberta. Cobre os 16
 * simuladores/painéis: os 9 exclusivos do Bloco 0 (0.1 a 0.9), os 6
 * compartilhados (um por bloco) dos Blocos 1 a 6 e o "Monte Sua Ponte"
 * da runa negra E.7 (Ilha Amaldiçoada). Todos são interativos — até os
 * painéis introdutórios 0.1 (mapa clicável dos reinos) e 0.2 (diário de
 * bordo com botão de registrar) respondem a cliques; os demais usam
 * sliders, cálculos e montagem.
 *
 * Convenção: cada runa que tem simulador usa o id dela (ex: "0.3") pra
 * decidir qual função chamar. Isso é lido em app.js.
 */

// Mapa: id da runa -> função que constrói o simulador dela
const SIMULADORES_POR_RUNA = {
  "0.1": painelMapaInicial,
  "0.2": painelDiarioDeBordo,
  "0.3": simuladorVento,
  "0.4": simuladorForjaDoSelo,
  "0.5": simuladorLinhaDoTempo,
  "0.6": simuladorFatosDePortais,
  "0.7": simuladorEquilibrio,
  "0.8": simuladorArco,
  "0.9": simuladorViga,
  "E.7": simuladorMonteSuaPonte, // Ilha Amaldiçoada — runa da Redenção
};

// Um simulador só por bloco (1 a 6) — vale pra qualquer runa daquele bloco
const SIMULADORES_POR_BLOCO = {
  "1": simuladorBloco1Materiais,
  "2": simuladorBloco2Precisao,
  "3": simuladorBloco3LeiDeHooke,
  "4": simuladorBloco4Fadiga,
  "5": simuladorBloco5MomentoFletor,
  "6": simuladorBloco6OrcamentoConstrutor,
};

// Ponto de entrada usado pelo app.js
function criarPainelSimulacao(runaId) {
  // Primeiro tenta achar um simulador específico pra essa runa (caso do Bloco 0).
  // Se não achar, tenta achar um simulador geral do bloco (blocos 1 a 6).
  const numeroBloco = runaId.split(".")[0];
  const construtor = SIMULADORES_POR_RUNA[runaId] || SIMULADORES_POR_BLOCO[numeroBloco];
  if (!construtor) return null;

  const painel = document.createElement("div");
  painel.className = "painel-pergaminho-velho";
  painel.style.cssText = "padding: 1rem; border-radius: 10px; margin: 1rem 0;";

  const titulo = document.createElement("h4");
  titulo.className = "font-display";
  titulo.style.cssText = "margin: 0 0 0.75rem; font-size: 0.9rem; display:flex; justify-content:space-between; border-bottom: 1px solid rgba(140,98,57,0.4); padding-bottom: 0.5rem;";
  titulo.innerHTML = `🛠️ Painel de Simulação Mecânica`;
  painel.appendChild(titulo);

  construtor(painel);

  // Hook do sistema de jogo (jogo.js) — concede XP na primeira interação real
  // (mover slider, clicar botão) dentro do painel de simulação dessa runa.
  const notificarInteracao = () => {
    if (typeof notificarSimuladorUsado === "function") notificarSimuladorUsado(runaId);
  };
  painel.addEventListener("input", notificarInteracao);
  painel.addEventListener("click", (evento) => {
    if (evento.target.closest("button")) notificarInteracao();
  });

  return painel;
}

// =====================================================================
// 0.3 — Vento e deflexão da torre
// =====================================================================
function simuladorVento(painel) {
  let windSpeed = 30;
  let reinforced = false;

  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <p style="font-size:0.85rem; margin:0 0 0.75rem;">
      Aumenta a velocidade do vento e observa como o topo da torre se desloca.
      Desafio: se o vento dobrar, o empurrão dobra ou fica QUATRO vezes maior? Testa no slider!
      Depois liga os amortecedores rúnicos: um pêndulo gigante lá no alto que balança ao contrário da torre e engole a energia do balanço.
      (A fundação segura a torre no chão; quem acalma o balanço é o amortecedor. Mas o empurrão constante do vento continua lá: compare o Desvio e o Balanço!)
    </p>
    <div style="height:180px; background:var(--pedra-ardosia); border:1px solid var(--bronze-envelhecido); border-radius:8px;
                position:relative; overflow:hidden; display:flex; align-items:flex-end; justify-content:center; padding:8px 0;">
      <div id="torre" style="width:48px; height:110px; background:linear-gradient(to top, #64748b, #94a3b8);
                  border:2px solid var(--ouro-velho); border-top-width:2px; border-radius:4px 4px 0 0;
                  transform-origin:bottom; transition:transform 0.3s ease;">
      </div>
      <div id="leitura-desvio" style="position:absolute; top:8px; right:8px; background:rgba(0,0,0,0.5); color:var(--ciano-mistico);
                  font-family:monospace; font-size:0.7rem; padding:2px 6px; border-radius:4px; border:1px solid rgba(0,229,255,0.2);">
        Desvio: 0.0 cm
      </div>
    </div>
    <label style="display:flex; justify-content:space-between; font-size:0.75rem; font-weight:bold; margin:0.75rem 0 0.25rem;">
      <span id="label-vento">Velocidade do Vento: 30 km/h</span>
      <span id="alerta-tempestade"></span>
    </label>
    <input id="slider-vento" type="range" min="0" max="150" value="30" style="width:100%;">
    <button id="botao-reforco" class="btn-gotico" style="width:100%; margin-top:0.75rem; font-size:0.75rem;">
      ⚡ Ligar Amortecedores Rúnicos
    </button>
  `;
  painel.appendChild(wrapper);

  const torre = wrapper.querySelector("#torre");
  const leituraDesvio = wrapper.querySelector("#leitura-desvio");
  const labelVento = wrapper.querySelector("#label-vento");
  const alertaTempestade = wrapper.querySelector("#alerta-tempestade");
  const slider = wrapper.querySelector("#slider-vento");
  const botaoReforco = wrapper.querySelector("#botao-reforco");

  function atualizar() {
    // Desvio médio (empurrão constante, cresce com v²): o amortecedor NÃO muda.
    // Balanço (vai e vem): o amortecedor engole a maior parte dele.
    const deflexao = 0.00387 * windSpeed * windSpeed;
    const balanco = deflexao * (reinforced ? 0.08 : 0.4);
    torre.style.transform = `skewX(${deflexao}deg)`;
    torre.style.boxShadow = reinforced ? "0 0 15px rgba(0,229,255,0.4)" : "none";
    leituraDesvio.textContent = `Desvio: ${deflexao.toFixed(1)} cm · Balanço: ±${balanco.toFixed(1)} cm`;
    labelVento.textContent = `Velocidade do Vento: ${windSpeed} km/h`;
    alertaTempestade.textContent = windSpeed < 1 ? "Calmaria" : windSpeed < 39 ? "Brisa" : windSpeed < 62 ? "Vento forte" : windSpeed < 89 ? "Ventania" : windSpeed < 118 ? "TEMPESTADE!" : "FURACÃO!";
    alertaTempestade.style.color = windSpeed >= 89 ? "#cc0000" : "inherit";
    botaoReforco.textContent = reinforced ? "🛡️ Amortecedores Rúnicos Ligados" : "⚡ Ligar Amortecedores Rúnicos";
    botaoReforco.style.background = reinforced ? "var(--ciano-mistico)" : "";
    botaoReforco.style.color = reinforced ? "#06070a" : "";
  }

  slider.addEventListener("input", (e) => {
    windSpeed = Number(e.target.value);
    atualizar();
  });
  botaoReforco.addEventListener("click", () => {
    reinforced = !reinforced;
    atualizar();
  });

  atualizar();
}

// =====================================================================
// 0.7 — Equilíbrio de forças na viga
// =====================================================================
function simuladorEquilibrio(painel) {
  let loadWeights = [5, 5];
  let columnReactions = [4, 4];

  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <p style="font-size:0.85rem; margin:0 0 0.75rem;">
      Pra viga ficar parada (em repouso), a soma de todas as forças precisa dar zero.
      Ajusta o peso e as colunas até equilibrar!
    </p>
    <div style="background:var(--pedra-ardosia); border:1px solid var(--bronze-envelhecido); border-radius:8px; padding:0.75rem;">
      <div style="display:flex; justify-content:space-between; font-size:0.7rem; color:var(--laranja-forja); font-family:monospace;">
        <span id="peso-esq">Gravidade L: 5 kN ▼</span><span id="peso-dir">Gravidade R: 5 kN ▼</span>
      </div>
      <div style="height:10px; background:linear-gradient(90deg,#b45309,#78350f); border:1px solid var(--ouro-velho); border-radius:2px;
                  margin:0.5rem 0; display:flex; align-items:center; justify-content:center;">
        <span id="soma-forcas" style="font-size:0.65rem; color:#fff; font-family:monospace;">Soma F: 2 kN</span>
      </div>
      <div style="display:flex; justify-content:space-between; font-size:0.7rem; color:var(--ciano-mistico); font-family:monospace;">
        <span id="col-esq">Coluna L: 4 kN ▲</span><span id="col-dir">Coluna R: 4 kN ▲</span>
      </div>
    </div>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-top:0.75rem;">
      <div style="background:rgba(255,106,0,0.1); border:1px solid rgba(140,98,57,0.4); border-radius:6px; padding:0.5rem;">
        <div style="font-size:0.65rem; font-weight:bold; text-transform:uppercase; color:var(--laranja-forja);">Gravidade (peso)</div>
        <div style="display:flex; gap:0.5rem; margin-top:0.4rem;">
          <button id="peso-menos" class="btn-gotico" style="flex:1; padding:0.3rem; font-size:0.8rem;">−</button>
          <button id="peso-mais" class="btn-gotico" style="flex:1; padding:0.3rem; font-size:0.8rem;">+</button>
        </div>
      </div>
      <div style="background:rgba(0,229,255,0.08); border:1px solid rgba(0,229,255,0.3); border-radius:6px; padding:0.5rem;">
        <div style="font-size:0.65rem; font-weight:bold; text-transform:uppercase; color:var(--ciano-mistico);">Colunas (reação)</div>
        <div style="display:flex; gap:0.5rem; margin-top:0.4rem;">
          <button id="col-menos" class="btn-gotico" style="flex:1; padding:0.3rem; font-size:0.8rem;">−</button>
          <button id="col-mais" class="btn-gotico" style="flex:1; padding:0.3rem; font-size:0.8rem;">+</button>
        </div>
      </div>
    </div>
    <div id="resultado-equilibrio" style="margin-top:0.75rem; padding:0.5rem; border-radius:6px; text-align:center; font-size:0.8rem; font-weight:bold;"></div>
  `;
  painel.appendChild(wrapper);

  const somaEl = wrapper.querySelector("#soma-forcas");
  const resultadoEl = wrapper.querySelector("#resultado-equilibrio");

  function atualizar() {
    wrapper.querySelector("#peso-esq").textContent = `Gravidade L: ${loadWeights[0]} kN ▼`;
    wrapper.querySelector("#peso-dir").textContent = `Gravidade R: ${loadWeights[1]} kN ▼`;
    wrapper.querySelector("#col-esq").textContent = `Coluna L: ${columnReactions[0]} kN ▲`;
    wrapper.querySelector("#col-dir").textContent = `Coluna R: ${columnReactions[1]} kN ▲`;

    const soma = loadWeights.reduce((a, b) => a + b, 0) - columnReactions.reduce((a, b) => a + b, 0);
    somaEl.textContent = `Soma F: ${soma} kN`;

    if (soma === 0) {
      resultadoEl.textContent = "🎉 EQUILÍBRIO PERFEITO ALCANÇADO!";
      resultadoEl.style.background = "rgba(0,229,255,0.15)";
      resultadoEl.style.color = "var(--ciano-mistico)";
      resultadoEl.style.border = "1px solid var(--ciano-mistico)";
    } else {
      resultadoEl.textContent = `⚠️ Desequilíbrio de ${Math.abs(soma)} kN`;
      resultadoEl.style.background = "rgba(204,0,0,0.12)";
      resultadoEl.style.color = "#e05555";
      resultadoEl.style.border = "1px solid rgba(224,85,85,0.4)";
    }
  }

  wrapper.querySelector("#peso-menos").addEventListener("click", () => { loadWeights[0] = Math.max(0, loadWeights[0] - 1); atualizar(); });
  wrapper.querySelector("#peso-mais").addEventListener("click", () => { loadWeights[0] += 1; atualizar(); });
  wrapper.querySelector("#col-menos").addEventListener("click", () => { columnReactions[0] = Math.max(0, columnReactions[0] - 1); atualizar(); });
  wrapper.querySelector("#col-mais").addEventListener("click", () => { columnReactions[0] += 1; atualizar(); });

  atualizar();
}

// =====================================================================
// 0.8 — Montagem do arco (ordem certa das pedras)
// =====================================================================
function simuladorArco(painel) {
  const nomesPedras = ["Pilar Esquerdo 🪨", "Pilar Direito 🪨", "Ombro Esquerdo 🪨", "Ombro Direito 🪨", "Pedra de Fecho 🔑"];
  let montadas = [];

  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <p style="font-size:0.85rem; margin:0 0 0.75rem;">
      Clica nas pedras na ordem certa de encaixe: pilares da base primeiro, depois os ombros, e por fim a pedra-chave no topo!
    </p>
    <div id="visual-arco" style="height:120px; background:var(--pedra-ardosia); border:1px solid var(--bronze-envelhecido); border-radius:8px;
                display:flex; align-items:flex-end; justify-content:center;"></div>
    <div id="botoes-pedras" style="display:flex; flex-wrap:wrap; gap:0.4rem; justify-content:center; margin-top:0.75rem;"></div>
  `;
  painel.appendChild(wrapper);

  const visual = wrapper.querySelector("#visual-arco");
  const botoesContainer = wrapper.querySelector("#botoes-pedras");

  // 5 blocos visuais simples representando as pedras do arco
  const posicoes = ["margin: 0 60px 0 0;", "margin: 0 0 0 60px;", "margin: 0 20px;", "margin: 0 20px;", "margin: 0 -4px;"];

  function desenharVisual() {
    visual.innerHTML = "";
    nomesPedras.forEach((_, i) => {
      const pedra = document.createElement("div");
      const encaixada = montadas.includes(i);
      pedra.style.cssText = `width:32px; height:${i < 2 ? 40 : 32}px; border-radius:4px; margin-bottom:8px;
        background:${encaixada ? "var(--ouro-velho)" : "rgba(255,255,255,0.08)"};
        border:1px solid ${encaixada ? "#fff2c4" : "rgba(255,255,255,0.2)"};
        transition: background 0.3s ease;`;
      visual.appendChild(pedra);
    });
  }

  function desenharBotoes() {
    botoesContainer.innerHTML = "";
    nomesPedras.forEach((nome, i) => {
      const botao = document.createElement("button");
      const encaixada = montadas.includes(i);
      botao.textContent = nome;
      botao.style.cssText = `padding:0.3rem 0.6rem; border-radius:6px; font-size:0.7rem; font-weight:bold; cursor:pointer;
        background:${encaixada ? "#065f46" : "var(--pergaminho)"}; color:${encaixada ? "#fff" : "#3e3222"};
        border:1px solid ${encaixada ? "#10b981" : "rgba(140,98,57,0.4)"};`;
      botao.addEventListener("click", () => {
        if (montadas.includes(i)) return;
        if (montadas.length === i) {
          montadas.push(i);
          desenharVisual();
          desenharBotoes();
        }
      });
      botoesContainer.appendChild(botao);
    });
  }

  desenharVisual();
  desenharBotoes();
}

// =====================================================================
// 0.9 — Compressão e tração na viga
// =====================================================================
function simuladorViga(painel) {
  let loadIntensity = 20;

  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <p style="font-size:0.85rem; margin:0 0 0.75rem;">
      Aumenta a força aplicada na viga. Repara: a parte de cima (ciano) sofre compressão,
      a parte de baixo (vermelha) sofre tração — são esticadas em direções opostas.
    </p>
    <div style="height:120px; background:var(--pedra-ardosia); border:1px solid var(--bronze-envelhecido); border-radius:8px;
                display:flex; flex-direction:column; align-items:center; justify-content:center; padding:0.75rem; position:relative;">
      <div id="seta-carga" style="color:#cc0000; font-weight:bold; font-size:1.1rem;">▼</div>
      <div id="viga" style="width:180px; height:32px; border-radius:4px; border:1px solid rgba(255,255,255,0.2);
                  display:flex; flex-direction:column; justify-content:space-between; overflow:hidden;">
        <div style="font-size:0.6rem; text-align:center; color:#e0f7fa; text-transform:uppercase; font-weight:bold;">Compressão</div>
        <div style="font-size:0.6rem; text-align:center; color:#ffe0e0; text-transform:uppercase; font-weight:bold;">Tração</div>
      </div>
    </div>
    <label style="display:block; font-size:0.75rem; font-weight:bold; margin:0.75rem 0 0.25rem;">
      Força aplicada: <span id="valor-forca">20</span> kN
    </label>
    <input id="slider-forca" type="range" min="5" max="100" value="20" style="width:100%;">
  `;
  painel.appendChild(wrapper);

  const viga = wrapper.querySelector("#viga");
  const seta = wrapper.querySelector("#seta-carga");
  const valorForca = wrapper.querySelector("#valor-forca");
  const slider = wrapper.querySelector("#slider-forca");

  function atualizar() {
    const intensidade = loadIntensity / 100;
    viga.style.background = `linear-gradient(to bottom, rgba(0,229,255,${intensidade}), rgba(204,0,0,${intensidade}))`;
    viga.style.transform = `translateY(${loadIntensity / 10}px)`;
    seta.style.transform = `scale(${1 + loadIntensity / 100})`;
    valorForca.textContent = loadIntensity;
  }

  slider.addEventListener("input", (e) => {
    loadIntensity = Number(e.target.value);
    atualizar();
  });

  atualizar();
}

// =====================================================================
// 0.1 — Mapa inicial (painel introdutório, sem interação de física)
// =====================================================================
function painelMapaInicial(painel) {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <p style="font-size:0.85rem; margin:0 0 0.75rem; text-align:center;">
      Toca em cada reino do mapa pra revelar o que te espera lá dentro.
    </p>
    <div id="mapa-reinos" style="display:grid; grid-template-columns:repeat(4, 1fr); gap:6px;"></div>
    <div id="mapa-detalhe" style="min-height:70px; margin-top:0.75rem; padding:0.6rem; background:var(--pedra-ardosia);
                border:1px solid var(--bronze-envelhecido); border-radius:8px; font-size:0.78rem; line-height:1.4;">
      Escolhe um reino no mapa acima pra ler sobre ele.
    </div>
    <div id="mapa-progresso" style="margin-top:0.6rem; font-size:0.72rem; text-align:center; color:var(--ouro-velho);">
      0 de 7 reinos explorados
    </div>
  `;
  painel.appendChild(wrapper);

  const grid = wrapper.querySelector("#mapa-reinos");
  const detalhe = wrapper.querySelector("#mapa-detalhe");
  const progresso = wrapper.querySelector("#mapa-progresso");
  const explorados = new Set();

  reinosDados.forEach((bloco, i) => {
    const btn = document.createElement("button");
    btn.className = "btn-gotico";
    btn.style.cssText = "font-size:1.3rem; padding:0.5rem 0; cursor:pointer;";
    btn.textContent = bloco.title.split(" ")[0]; // usa o emoji do título
    btn.title = bloco.title;
    btn.addEventListener("click", () => {
      explorados.add(bloco.id);
      detalhe.innerHTML = `<strong>${bloco.title}</strong><br>${bloco.subtitle}`;
      btn.style.background = "var(--ciano-mistico)";
      btn.style.color = "#06070a";
      progresso.textContent = `${explorados.size} de 7 reinos explorados`;
      if (explorados.size === 7) {
        progresso.textContent = "🏆 Mapa completo! Conheces todo o horizonte.";
      }
    });
    grid.appendChild(btn);
  });
}

// =====================================================================
// 0.2 — Diário de bordo (painel introdutório)
// =====================================================================
function painelDiarioDeBordo(painel) {
  const eventosPossiveis = [
    "Fundação inspecionada e aprovada",
    "Entrega de tijolos conferida",
    "Prumo verificado na coluna 3",
    "Argamassa testada — cura dentro do prazo",
    "Vistoria de segurança sem pendências",
    "Andaime reforçado após chuva forte",
  ];

  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <p style="font-size:0.85rem; margin:0 0 0.6rem; text-align:center;">
      Clica pra registrar eventos da obra. Sem registro, a confiabilidade do mestre desmorona!
    </p>
    <button id="botao-registrar" class="btn-gotico" style="width:100%; font-size:0.78rem;">
      ✒️ Registrar Evento no Diário
    </button>
    <div style="margin:0.6rem 0 0.2rem; font-size:0.72rem; font-weight:bold; display:flex; justify-content:space-between;">
      <span>Confiabilidade do Mestre</span>
      <span id="confiabilidade-valor">0%</span>
    </div>
    <div style="height:10px; background:var(--pedra-ardosia); border:1px solid var(--bronze-envelhecido); border-radius:5px; overflow:hidden;">
      <div id="barra-confiabilidade" style="height:100%; width:0%; background:var(--ciano-mistico); transition:width 0.3s ease;"></div>
    </div>
    <div id="lista-diario" style="margin-top:0.7rem; max-height:130px; overflow-y:auto; font-family:monospace; font-size:0.7rem;
                background:var(--pergaminho-escuro); border:1px solid var(--bronze-envelhecido); border-radius:6px; padding:0.5rem;">
      <em>O diário está vazio. Nenhum evento registrado ainda.</em>
    </div>
  `;
  painel.appendChild(wrapper);

  const botao = wrapper.querySelector("#botao-registrar");
  const valorConfiab = wrapper.querySelector("#confiabilidade-valor");
  const barra = wrapper.querySelector("#barra-confiabilidade");
  const lista = wrapper.querySelector("#lista-diario");
  let registros = 0;

  botao.addEventListener("click", () => {
    if (registros === 0) lista.innerHTML = "";
    registros++;
    const evento = eventosPossiveis[(registros - 1) % eventosPossiveis.length];
    const linha = document.createElement("div");
    linha.textContent = `Dia ${registros}: ${evento}`;
    lista.appendChild(linha);
    lista.scrollTop = lista.scrollHeight;

    const confiab = Math.min(100, registros * 20);
    valorConfiab.textContent = `${confiab}%`;
    barra.style.width = `${confiab}%`;
    if (confiab === 100) {
      valorConfiab.textContent = "100% — Mestre Confiável!";
      barra.style.background = "var(--ouro-velho)";
    }
  });
}

// =====================================================================
// 0.4 — Forja do selo do construtor
// =====================================================================
function simuladorForjaDoSelo(painel) {
  let sealIcon = "⚡";
  let forjado = false;
  const icones = ["⚡", "🏹", "🛡️", "⚙️", "🏰"];

  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <div style="display:flex; gap:0.75rem; align-items:flex-start;">
      <div style="flex:1; display:flex; flex-direction:column; gap:0.4rem;">
        <label style="font-size:0.7rem; font-weight:bold;">Nome do Construtor:</label>
        <input id="nome-construtor" type="text" value="Borga Aprendiz"
          style="padding:0.4rem; border-radius:4px; border:1px solid var(--bronze-envelhecido); background:var(--pergaminho); color:#3e3222; font-size:0.75rem;">
        <label style="font-size:0.7rem; font-weight:bold; margin-top:0.4rem;">Estandarte Rúnico:</label>
        <div id="icones-selo" style="display:flex; gap:0.4rem;"></div>
      </div>
      <div style="width:96px; height:112px; background:var(--pedra-ardosia); border-radius:8px; border:2px solid var(--ouro-velho);
                  display:flex; flex-direction:column; align-items:center; justify-content:center; padding:0.5rem; position:relative;">
        <svg width="48" height="56" viewBox="0 0 100 120">
          <path d="M50,5 L87,17 C87,48 85,77 50,110 C15,77 13,48 13,17 Z" fill="var(--laranja-forja)" stroke="#d4af37" stroke-width="2"/>
        </svg>
        <span id="icone-exibido" style="position:absolute; top:38px; font-size:1.2rem;">⚡</span>
        <span id="nome-exibido" style="font-size:0.6rem; color:var(--pergaminho); margin-top:0.4rem; text-align:center;">Borga Aprendiz</span>
      </div>
    </div>
    <button id="botao-forjar" class="btn-gotico" style="width:100%; margin-top:0.75rem; font-size:0.75rem;
      background:linear-gradient(90deg, #991b1b, var(--laranja-forja));">
      🔥 Forjar Selo na Bigorna 🔥
    </button>
    <div id="mensagem-forjado" style="display:none; margin-top:0.5rem; padding:0.5rem; text-align:center; font-size:0.75rem;
      color:var(--ciano-mistico); border:1px solid rgba(0,229,255,0.3); border-radius:6px;">
      🎉 Selo de Engenheiro Mágico registrado no reino! 🎉
    </div>
  `;
  painel.appendChild(wrapper);

  const iconesContainer = wrapper.querySelector("#icones-selo");
  const iconeExibido = wrapper.querySelector("#icone-exibido");
  const nomeExibido = wrapper.querySelector("#nome-exibido");
  const nomeInput = wrapper.querySelector("#nome-construtor");

  function desenharIcones() {
    iconesContainer.innerHTML = "";
    icones.forEach((icone) => {
      const botao = document.createElement("button");
      botao.textContent = icone;
      botao.style.cssText = `width:26px; height:26px; border-radius:4px; font-size:0.8rem; cursor:pointer;
        background:${icone === sealIcon ? "#1c1e22" : "var(--pergaminho-escuro)"};
        color:${icone === sealIcon ? "#fff" : "#3e3222"};
        border:1px solid ${icone === sealIcon ? "#fff" : "rgba(140,98,57,0.4)"};`;
      botao.addEventListener("click", () => {
        sealIcon = icone;
        iconeExibido.textContent = sealIcon;
        desenharIcones();
      });
      iconesContainer.appendChild(botao);
    });
  }

  nomeInput.addEventListener("input", (e) => {
    nomeExibido.textContent = e.target.value || "Borga Aprendiz";
  });

  wrapper.querySelector("#botao-forjar").addEventListener("click", () => {
    forjado = true;
    wrapper.querySelector("#mensagem-forjado").style.display = "block";
  });

  desenharIcones();
}

// =====================================================================
// 0.5 — Linha do tempo das técnicas construtivas
// =====================================================================
function simuladorLinhaDoTempo(painel) {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <div style="background:var(--pedra-ardosia); border-radius:8px; padding:0.75rem; border:1px solid var(--bronze-envelhecido);">
      <h5 id="epoca-titulo" class="font-display" style="margin:0; font-size:0.85rem; color:var(--ouro-velho);"></h5>
      <span id="epoca-material" style="font-size:0.7rem; color:var(--ciano-mistico); font-weight:bold; display:block; margin:0.25rem 0;"></span>
      <p id="epoca-desc" style="font-size:0.75rem; margin:0; color:var(--pergaminho-escuro);"></p>
    </div>
    <input id="slider-ano" type="range" min="1" max="2026" value="1" style="width:100%; margin-top:0.75rem;">
    <div style="display:flex; justify-content:space-between; font-size:0.65rem; font-weight:bold; margin-top:0.25rem;">
      <span>Ano 1 d.C.</span><span>Idade Média</span><span>Ano 2026</span>
    </div>
  `;
  painel.appendChild(wrapper);

  const epocas = [
    { max: 500, title: "🏛️ 1. Coliseu e Panteão de Roma", mat: "Pedra Travertino, Tijolo e Concreto de Cinza Vulcânica", desc: "Grandes arcos descarregam um peso imenso até as bases. A cúpula do Panteão tem 43 m de concreto sem nenhum ferro dentro e está de pé há quase 1.900 anos! E as cabanas de galhos e barro? Ficaram milhares de anos antes, na Pré-história." },
    { max: 1200, title: "🏰 2. Santa Sofia e Castelos Românicos", mat: "Tijolo, Pedra e Argamassa", desc: "Em 537, Constantinopla ergueu a Santa Sofia, com uma cúpula de uns 31 m que parece flutuar sobre a luz. Depois do ano 1000, a Europa se encheu de castelos e igrejas de paredes grossas e arcos redondos, herança direta de Roma." },
    { max: 1800, title: "⛪ 3. Catedrais Góticas e Cúpulas do Renascimento", mat: "Pedra Talhada e Tijolo", desc: "Arcobotantes seguram as paredes por fora para elas subirem altíssimas e cheias de vitrais. Depois, Brunelleschi fechou a cúpula de Florença sem um cimbre (molde) gigante de madeira. Como?" },
    { max: Infinity, title: "🏙️ 4. Da Ponte de Ferro ao Arranha-céu de Aço", mat: "Ferro, Aço Estrutural e Concreto Armado", desc: "Por quase 90 anos o ferro reinou em pontes e fábricas. Então o aço barato de Bessemer (1856) permitiu esqueletos metálicos, e em 1885 Chicago ganhou o primeiro arranha-céu. Por que o aço venceu o ferro fundido?" },
  ];

  function atualizar(ano) {
    const epoca = epocas.find((e) => ano < e.max);
    wrapper.querySelector("#epoca-titulo").textContent = epoca.title;
    wrapper.querySelector("#epoca-material").textContent = `Material Dominado: ${epoca.mat}`;
    wrapper.querySelector("#epoca-desc").textContent = epoca.desc;
  }

  wrapper.querySelector("#slider-ano").addEventListener("input", (e) => atualizar(Number(e.target.value)));
  atualizar(0);
}

// =====================================================================
// 0.6 — Fatos de portais (construções famosas)
// =====================================================================
function simuladorFatosDePortais(painel) {
  const fatos = {
    "Torre Eiffel": "Construída pra durar só 20 anos como atração provisória, virou o maior ícone e antena de Paris.",
    "Golden Gate": "A Marinha americana queria a ponte pintada com listras pretas e amarelas, para os navios a enxergarem. O arquiteto Irving Morrow defendeu outra ideia: um laranja forte, o 'Laranja Internacional', que combina com as colinas, contrasta com o céu e o mar e ainda aparece no meio da neblina. Os responsáveis pela ponte toparam! E você, qual escolheria para um navio no nevoeiro?",
    "Cristo Redentor": "Lá no alto do Corcovado, a uns 700 m de altura, ele enfrenta ventanias e até raios sem sair do lugar. O segredo não é ser flexível: é um esqueleto rígido de concreto armado (concreto com barras de aço por dentro), bem preso ao pedestal sobre a rocha. Por fora, veste uma 'cota de malha' de milhares de plaquinhas triangulares de pedra-sabão, que não seguram nada: são só a pele. Enigma: por que os braços abertos, que pegam vento como velas de navio, são a parte mais difícil de segurar?",
    "Coliseu": "O hipogeu subterrâneo tinha dezenas de montas mecânicas operadas por roldanas manuais para erguer jaulas de leões direto pra arena!",
  };

  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <div id="botoes-portais" style="display:grid; grid-template-columns:1fr 1fr; gap:0.4rem;"></div>
    <div id="fato-exibido" style="display:none; margin-top:0.6rem; padding:0.6rem; background:var(--pedra-ardosia);
      border:1px solid var(--ouro-velho); border-radius:6px; font-size:0.75rem; color:var(--pergaminho);"></div>
  `;
  painel.appendChild(wrapper);

  const botoesContainer = wrapper.querySelector("#botoes-portais");
  const fatoExibido = wrapper.querySelector("#fato-exibido");

  Object.keys(fatos).forEach((nome) => {
    const botao = document.createElement("button");
    botao.textContent = nome;
    botao.style.cssText = `padding:0.4rem; border-radius:6px; font-size:0.7rem; font-weight:bold; cursor:pointer;
      background:var(--pergaminho); color:#3e3222; border:1px solid rgba(140,98,57,0.4);`;
    botao.addEventListener("click", () => {
      fatoExibido.style.display = "block";
      fatoExibido.innerHTML = `<strong>🕵️ Fato do Portal (${nome}):</strong> ${fatos[nome]}`;
    });
    botoesContainer.appendChild(botao);
  });
}

// =====================================================================
// BLOCO 1 — Estabilidade de materiais sob carga
// =====================================================================
function simuladorBloco1Materiais(painel) {
  let material = "Alvenaria 🧱";
  let carga = 30;
  const materiais = ["Alvenaria 🧱", "Concreto 🏗️", "Madeira 🪵"];

  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <p style="font-size:0.85rem; margin:0 0 0.75rem;">
      Testa a estabilidade vertical dos principais sistemas construtivos! Neste teste do vilarejo, o concreto aguenta 120, a madeira 80 e a alvenaria 40.
      Mas desconfia da tabela: espremida no sentido das fibras, uma madeira dura de boa qualidade aguenta tanto quanto um concreto comum, e pesando bem menos!
      Agora aperta a mesma madeira de lado, atravessando as fibras, e ela amassa fácil. Quem decide é o material, a direção da força e a grossura da peça.
    </p>
    <div id="botoes-material" style="display:flex; gap:0.4rem; justify-content:center; margin-bottom:0.75rem;"></div>
    <div style="background:rgba(0,0,0,0.4); border-radius:6px; padding:0.6rem; text-align:center;">
      <span style="display:block; font-size:0.8rem; color:var(--ciano-mistico);">Carga: <span id="valor-carga">30</span> toneladas</span>
      <span style="display:block; font-size:0.65rem; color:rgba(255,255,255,0.5);">Resistência Máxima deste pilar de teste: <span id="valor-max">40</span> toneladas (num pilar de verdade, depende do material E da grossura da peça!)</span>
      <span id="status-colapso" style="display:block; font-size:0.8rem; font-weight:bold; margin-top:0.4rem;"></span>
    </div>
    <input id="slider-carga" type="range" min="10" max="150" value="30" style="width:100%; margin-top:0.75rem;">
  `;
  painel.appendChild(wrapper);

  const botoesContainer = wrapper.querySelector("#botoes-material");
  const valorCarga = wrapper.querySelector("#valor-carga");
  const valorMax = wrapper.querySelector("#valor-max");
  const statusColapso = wrapper.querySelector("#status-colapso");
  const slider = wrapper.querySelector("#slider-carga");

  function resistenciaMaxima() {
    if (material.includes("Alvenaria")) return 40;
    if (material.includes("Concreto")) return 120;
    return 80; // Madeira
  }

  function desenharBotoes() {
    botoesContainer.innerHTML = "";
    materiais.forEach((mat) => {
      const botao = document.createElement("button");
      botao.textContent = mat;
      const ativo = mat === material;
      botao.style.cssText = `padding:0.3rem 0.6rem; border-radius:6px; font-size:0.7rem; font-weight:bold; cursor:pointer;
        background:${ativo ? "#1c1e22" : "var(--pergaminho)"}; color:${ativo ? "#fff" : "#3e3222"};
        border:1px solid ${ativo ? "#fff" : "rgba(140,98,57,0.4)"};`;
      botao.addEventListener("click", () => {
        material = mat;
        desenharBotoes();
        atualizar();
      });
      botoesContainer.appendChild(botao);
    });
  }

  function atualizar() {
    const maxCarga = resistenciaMaxima();
    const colapsou = carga > maxCarga;
    valorCarga.textContent = carga;
    valorMax.textContent = maxCarga;
    statusColapso.textContent = colapsou ? "🚨 COLAPSO ESTRUTURAL!" : "🟢 ESTRUTURA SEGURA";
    statusColapso.style.color = colapsou ? "#e05555" : "#34d399";
  }

  slider.addEventListener("input", (e) => {
    carga = Number(e.target.value);
    atualizar();
  });

  desenharBotoes();
  atualizar();
}

// =====================================================================
// BLOCO 2 — Medição de precisão
// =====================================================================
function simuladorBloco2Precisao(painel) {
  const alvo = 75;
  let medicao = 40;

  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <p style="font-size:0.85rem; margin:0 0 0.75rem;">
      Alinha o cursor com o alvo mecânico (${alvo} mm):
    </p>
    <input id="slider-medicao" type="range" min="0" max="100" value="40" style="width:100%;">
    <div style="display:flex; justify-content:space-between; background:rgba(0,0,0,0.4); border-radius:6px; padding:0.5rem; margin-top:0.5rem; font-family:monospace; font-size:0.75rem;">
      <span style="color:#fbbf24;">Medido: <span id="valor-medicao">40</span> mm</span>
      <span style="color:#34d399;">Exatidão Rúnica: <span id="valor-precisao">0</span>%</span>
    </div>
    <div id="mensagem-perfeita" style="display:none; margin-top:0.5rem; padding:0.4rem; text-align:center; background:rgba(52,211,153,0.2); color:#34d399; border-radius:6px; font-size:0.75rem; font-weight:bold;">
      🎯 DENTRO DA TOLERÂNCIA (±1 mm)! Nenhuma medida é perfeita: todo instrumento tem erro. O engenheiro vence quando o erro cabe no limite combinado.
    </div>
  `;
  painel.appendChild(wrapper);

  const valorMedicao = wrapper.querySelector("#valor-medicao");
  const valorPrecisao = wrapper.querySelector("#valor-precisao");
  const mensagemPerfeita = wrapper.querySelector("#mensagem-perfeita");

  function atualizar() {
    const erro = Math.abs(medicao - alvo);
    const precisao = Math.max(0, 100 - erro * 4);
    valorMedicao.textContent = medicao;
    valorPrecisao.textContent = precisao.toFixed(0);
    mensagemPerfeita.style.display = precisao > 95 ? "block" : "none";
  }

  wrapper.querySelector("#slider-medicao").addEventListener("input", (e) => {
    medicao = Number(e.target.value);
    atualizar();
  });

  atualizar();
}

// =====================================================================
// BLOCO 3 — Lei de Hooke (força do cabo tendão)
// =====================================================================
function simuladorBloco3LeiDeHooke(painel) {
  let rigidez = 5;
  let extensao = 8;

  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <p style="font-size:0.85rem; margin:0 0 0.75rem;">
      Lei de Hooke (F = k × x): altera a rigidez e a extensão do cabo tendão:
    </p>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;">
      <div>
        <label style="font-size:0.75rem; font-weight:bold;">Rigidez (k): <span id="valor-rigidez">5</span></label>
        <input id="slider-rigidez" type="range" min="1" max="10" value="5" style="width:100%;">
      </div>
      <div>
        <label style="font-size:0.75rem; font-weight:bold;">Extensão (x): <span id="valor-extensao">8</span></label>
        <input id="slider-extensao" type="range" min="1" max="15" value="8" style="width:100%;">
      </div>
    </div>
    <div style="background:rgba(0,0,0,0.4); border-radius:6px; padding:0.6rem; text-align:center; margin-top:0.75rem; font-family:monospace;">
      <span style="color:var(--ciano-mistico); font-size:0.85rem;">Força de Tração no Cabo: <span id="valor-forca">40</span> kN</span>
    </div>
  `;
  painel.appendChild(wrapper);

  function atualizar() {
    wrapper.querySelector("#valor-rigidez").textContent = rigidez;
    wrapper.querySelector("#valor-extensao").textContent = extensao;
    wrapper.querySelector("#valor-forca").textContent = rigidez * extensao;
  }

  wrapper.querySelector("#slider-rigidez").addEventListener("input", (e) => { rigidez = Number(e.target.value); atualizar(); });
  wrapper.querySelector("#slider-extensao").addEventListener("input", (e) => { extensao = Number(e.target.value); atualizar(); });

  atualizar();
}

// =====================================================================
// BLOCO 4 — Teste de fadiga (ciclos repetidos de estresse)
// =====================================================================
function simuladorBloco4Fadiga(painel) {
  let ciclos = 0;
  let estresse = 40;

  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <p style="font-size:0.85rem; margin:0 0 0.75rem;">
      Teste de Fadiga: aplica ciclos repetidos de tensão. Acima do limite de fadiga (aqui, 25 MPa), cada ciclo faz uma trinca invisível crescer até a peça romper.
      Abaixo dele, o aço comum aguenta dezenas de milhões de ciclos e nos testes parece que nunca vai quebrar (∞). Mas atenção: o alumínio não tem esse limite. Com ciclos suficientes, ele sempre acaba cedendo!
      Aqui a magia acelera tudo: acima do limite, uma barra de aço de verdade levaria milhares ou milhões de vaivéns para romper. Teste abaixo de 25 MPa e veja o ∞! Então por que pontes e trens ainda quebram por fadiga?
    </p>
    <div style="display:flex; justify-content:space-between; background:rgba(0,0,0,0.4); border-radius:6px; padding:0.5rem; font-family:monospace; font-size:0.75rem;">
      <span>Ciclos: <span id="valor-ciclos">0</span></span>
      <span style="color:#f87171;">Limite de Ruptura (ritmo mágico do teste): <span id="valor-limite">24</span></span>
    </div>
    <label style="display:block; font-size:0.7rem; font-weight:bold; margin-top:0.6rem;">Estresse por Ciclo: <span id="valor-estresse">40</span> MPa</label>
    <input id="slider-estresse" type="range" min="10" max="100" value="40" style="width:100%;">
    <div style="display:flex; gap:0.5rem; margin-top:0.6rem;">
      <button id="botao-ciclo" class="btn-gotico" style="flex:1; font-size:0.75rem; background:linear-gradient(90deg,#7f1d1d,#991b1b);">🔄 Aplicar Ciclo de Força</button>
      <button id="botao-reset" class="btn-gotico" style="font-size:0.75rem;">Reset</button>
    </div>
    <div id="mensagem-colapso" style="display:none; margin-top:0.5rem; padding:0.4rem; text-align:center; background:rgba(220,38,38,0.25); color:#f87171; border-radius:6px; font-size:0.75rem; font-weight:bold;">
      💥 PEÇA COLAPSOU POR FADIGA ACUMULADA!
    </div>
  `;
  painel.appendChild(wrapper);

  // Abaixo do limite de fadiga (25 MPa neste teste mágico) o aço não rompe: ∞
  const LIMITE_FADIGA = 25;
  function limite() { return estresse <= LIMITE_FADIGA ? Infinity : Math.round(1000 / (estresse + 1)); }
  function fadigado() { return ciclos >= limite(); }

  function atualizar() {
    wrapper.querySelector("#valor-ciclos").textContent = ciclos;
    wrapper.querySelector("#valor-limite").textContent = limite() === Infinity ? "∞" : limite();
    wrapper.querySelector("#valor-estresse").textContent = estresse;
    wrapper.querySelector("#mensagem-colapso").style.display = fadigado() ? "block" : "none";
  }

  wrapper.querySelector("#slider-estresse").addEventListener("input", (e) => {
    estresse = Number(e.target.value);
    ciclos = 0;
    atualizar();
  });
  wrapper.querySelector("#botao-ciclo").addEventListener("click", () => {
    if (!fadigado()) ciclos += 1;
    atualizar();
  });
  wrapper.querySelector("#botao-reset").addEventListener("click", () => {
    ciclos = 0;
    atualizar();
  });

  atualizar();
}

// =====================================================================
// BLOCO 5 — Diagrama de momento fletor
// =====================================================================
function simuladorBloco5MomentoFletor(painel) {
  let vao = 4;
  let carga = 20;

  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <p style="font-size:0.85rem; margin:0 0 0.75rem;">
      Diagrama de Momento Fletor (M = P × L ÷ 4):
    </p>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;">
      <div>
        <label style="font-size:0.75rem; font-weight:bold;">Vão da Viga (L): <span id="valor-vao">4</span>m</label>
        <input id="slider-vao" type="range" min="2" max="10" value="4" style="width:100%;">
      </div>
      <div>
        <label style="font-size:0.75rem; font-weight:bold;">Carga Central (P): <span id="valor-carga-p">20</span>kN</label>
        <input id="slider-carga-p" type="range" min="5" max="50" value="20" style="width:100%;">
      </div>
    </div>
    <div style="height:70px; background:rgba(0,0,0,0.5); border-radius:6px; border:1px solid rgba(255,255,255,0.1); position:relative; margin-top:0.75rem; overflow:hidden;">
      <svg viewBox="0 0 340 70" style="position:absolute; inset:0; width:100%; height:100%;">
        <path id="linha-momento" d="M 20 35 L 170 35 L 320 35" fill="none" stroke="var(--laranja-forja)" stroke-width="2"/>
      </svg>
      <span id="valor-momento" style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-family:monospace; font-size:0.75rem; color:var(--ciano-mistico);"></span>
    </div>
  `;
  painel.appendChild(wrapper);

  function atualizar() {
    const momento = Math.round((carga * vao) / 4);
    wrapper.querySelector("#valor-vao").textContent = vao;
    wrapper.querySelector("#valor-carga-p").textContent = carga;
    wrapper.querySelector("#valor-momento").textContent = `Momento Central Máximo: ${((carga * vao) / 4).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} kN·m`;
    wrapper.querySelector("#linha-momento").setAttribute("d", `M 20 35 L 170 ${35 + momento / 3} L 320 35`);
  }

  wrapper.querySelector("#slider-vao").addEventListener("input", (e) => { vao = Number(e.target.value); atualizar(); });
  wrapper.querySelector("#slider-carga-p").addEventListener("input", (e) => { carga = Number(e.target.value); atualizar(); });

  atualizar();
}

// =====================================================================
// BLOCO 6 — Orçamento do construtor (segurança vs. estética)
// =====================================================================
function simuladorBloco6OrcamentoConstrutor(painel) {
  let seguranca = 50;
  let estetica = 50;

  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <p style="font-size:0.85rem; margin:0 0 0.75rem;">
      Orçamento do Construtor: distribui 100 pontos entre Estética e Segurança:
    </p>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;">
      <div>
        <label style="font-size:0.75rem; font-weight:bold;">Segurança 🛡️: <span id="valor-seguranca">50</span></label>
        <input id="slider-seguranca" type="range" min="10" max="90" value="50" style="width:100%;">
      </div>
      <div>
        <label style="font-size:0.75rem; font-weight:bold;">Estética 🎨: <span id="valor-estetica">50</span></label>
        <input id="slider-estetica" type="range" min="10" max="90" value="50" style="width:100%;">
      </div>
    </div>
    <div id="mensagem-orcamento" style="margin-top:0.75rem; padding:0.5rem; text-align:center; font-size:0.75rem; font-weight:bold; border-radius:6px;"></div>
  `;
  painel.appendChild(wrapper);

  const mensagem = wrapper.querySelector("#mensagem-orcamento");

  function atualizar() {
    wrapper.querySelector("#valor-seguranca").textContent = seguranca;
    wrapper.querySelector("#valor-estetica").textContent = estetica;

    if (seguranca < 30) {
      mensagem.textContent = "⚠️ A cidade está perigosa e pode ruir!";
      mensagem.style.background = "rgba(220,38,38,0.25)";
      mensagem.style.color = "#f87171";
    } else if (estetica < 30) {
      mensagem.textContent = "⚠️ Os cidadãos acham a cidade feia e triste!";
      mensagem.style.background = "rgba(217,119,6,0.25)";
      mensagem.style.color = "#fbbf24";
    } else {
      mensagem.textContent = "🎉 Equilíbrio perfeito na Grande Aliança!";
      mensagem.style.background = "rgba(52,211,153,0.2)";
      mensagem.style.color = "#34d399";
    }
  }

  wrapper.querySelector("#slider-seguranca").addEventListener("input", (e) => {
    seguranca = Number(e.target.value);
    estetica = 100 - seguranca;
    wrapper.querySelector("#slider-estetica").value = estetica;
    atualizar();
  });
  wrapper.querySelector("#slider-estetica").addEventListener("input", (e) => {
    estetica = Number(e.target.value);
    seguranca = 100 - estetica;
    wrapper.querySelector("#slider-seguranca").value = seguranca;
    atualizar();
  });

  atualizar();
}

// =====================================================================
// E.7 — Monte Sua Ponte (Ilha Amaldiçoada, runa da Redenção)
// Clique-pra-montar no molde do simuladorArco: 3 slots, 3 peças por
// slot (1 correta + 2 amaldiçoadas que repetem erros das runas E.1-E.6).
// Teste em 3 estágios de carga; peça amaldiçoada = colapso temático
// apontando pra crônica correspondente. Combo correto = redenção + selo.
// =====================================================================
function simuladorMonteSuaPonte(painel) {
  const SLOTS = [
    {
      chave: "fundacao",
      rotulo: "1️⃣ Fundação",
      opcoes: [
        { texto: "Estacas até a rocha firme", boa: true },
        { texto: "Base rasa em solo mole", boa: false, runaErro: "E.5", estagioFalha: 1,
          colapso: "A fundação rasa afunda mais de um lado e a ponte entorta até tombar! A Torre de Pisa começou a inclinar pelo mesmo motivo, ainda durante a obra, e chegou a correr risco de cair, até que, por volta do ano 2000, engenheiros tiraram terra de baixo do lado mais alto para endireitá-la um pouquinho." },
        { texto: "Topo pesado, base leve", boa: false, runaErro: "E.6", estagioFalha: 1,
          colapso: "O centro de gravidade lá no alto vira a ponte na primeira carga — o destino do navio Vasa!" },
      ],
    },
    {
      chave: "estrutura",
      rotulo: "2️⃣ Estrutura",
      opcoes: [
        { texto: "Treliça calculada com folga de segurança", boa: true },
        { texto: "Barras comprimidas com travamento interno economizado", boa: false, runaErro: "E.2", estagioFalha: 2,
          colapso: "As barras comprimidas flambam com o peso das carroças, o mesmo erro da Ponte de Quebec! Só que lá, em 1907, nem precisou de carroça: a ponte ainda estava em obra e desabou com o próprio peso, que era bem maior do que a conta dizia." },
        { texto: "Tirante duplo improvisado", boa: false, runaErro: "E.3", estagioFalha: 2,
          colapso: "A junta improvisada carrega o dobro do previsto e rompe — o erro fatal do Hyatt Regency!" },
      ],
    },
    {
      chave: "tabuleiro",
      rotulo: "3️⃣ Tabuleiro",
      opcoes: [
        { texto: "Tabuleiro rígido e aerodinâmico", boa: true },
        { texto: "Lâmina fina e flexível", boa: false, runaErro: "E.1", estagioFalha: 3,
          colapso: "Um vento de uns 68 km/h, forte mas nada fora do comum, fez o tabuleiro dançar em torção até romper: a Gertie Galopante renasceu! A culpa não foi da força do vento. Foi do formato da ponte." },
        { texto: "Passarela leve sem amortecedores", boa: false, runaErro: "E.4", estagioFalha: 3,
          colapso: "A multidão entra no ritmo do balanço, e quanto mais ela acompanha, mais a passarela balança: a Ponte Bamba de Londres! Ela fechou dois dias depois da inauguração e só reabriu quase dois anos depois, cheia de amortecedores." },
      ],
    },
  ];
  const ESTAGIOS = [
    { emoji: "🚶", nome: "os pedestres atravessam" },
    { emoji: "🐴", nome: "as carroças pesadas passam" },
    { emoji: "⛈️", nome: "a tempestade castiga o vão" },
  ];

  const escolhas = { fundacao: null, estrutura: null, tabuleiro: null };
  let testando = false;

  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <p style="font-size:0.8rem; margin:0 0 0.6rem;">Escolhe <strong>uma peça de cada grupo</strong> e testa a ponte contra três julgamentos de carga:</p>
    <div id="ponte-cena" style="position:relative; height:92px; background:linear-gradient(to top, rgba(28,59,140,0.25), transparent 70%); border:1px solid rgba(140,98,57,0.35); border-radius:8px; overflow:hidden; margin-bottom:0.75rem;">
      <div id="ponte-tabuleiro" style="position:absolute; left:8%; right:8%; top:36px; height:10px; background:linear-gradient(180deg,#8c6239,#5a3d22); border-radius:3px; transition: transform 0.8s ease, opacity 0.8s ease;"></div>
      <div id="ponte-pilar-1" style="position:absolute; left:24%; top:46px; bottom:6px; width:12px; background:linear-gradient(90deg,#565c63,#3a3f45); transition: transform 0.8s ease;"></div>
      <div id="ponte-pilar-2" style="position:absolute; right:24%; top:46px; bottom:6px; width:12px; background:linear-gradient(90deg,#565c63,#3a3f45); transition: transform 0.8s ease;"></div>
      <span id="ponte-carga" style="position:absolute; left:6%; top:14px; font-size:1.05rem; transition: left 0.9s linear;"></span>
    </div>
    <div id="ponte-paleta"></div>
    <button id="ponte-testar" class="btn-gotico" disabled
      style="display:block; width:100%; margin-top:0.75rem; padding:0.6rem; font-size:0.8rem; opacity:0.5;">
      ⚒️ Escolhe as 3 peças pra testar
    </button>
    <div id="ponte-veredito" style="margin-top:0.75rem;"></div>
  `;
  painel.appendChild(wrapper);

  const cena = {
    tabuleiro: wrapper.querySelector("#ponte-tabuleiro"),
    pilar1: wrapper.querySelector("#ponte-pilar-1"),
    pilar2: wrapper.querySelector("#ponte-pilar-2"),
    carga: wrapper.querySelector("#ponte-carga"),
  };
  const botaoTestar = wrapper.querySelector("#ponte-testar");
  const veredito = wrapper.querySelector("#ponte-veredito");

  function restaurarCena() {
    cena.tabuleiro.style.transform = "";
    cena.tabuleiro.style.opacity = "1";
    cena.pilar1.style.transform = "";
    cena.pilar2.style.transform = "";
    cena.carga.textContent = "";
    cena.carga.style.left = "6%";
  }

  function desenharPaleta() {
    const paleta = wrapper.querySelector("#ponte-paleta");
    paleta.innerHTML = "";
    SLOTS.forEach((slot) => {
      const grupo = document.createElement("div");
      grupo.style.cssText = "margin-bottom:0.5rem;";
      grupo.innerHTML = `<strong style="font-size:0.75rem; display:block; margin-bottom:0.3rem;">${slot.rotulo}</strong>`;
      const linha = document.createElement("div");
      linha.style.cssText = "display:flex; flex-wrap:wrap; gap:0.35rem;";
      slot.opcoes.forEach((opcao, indice) => {
        const botao = document.createElement("button");
        botao.type = "button";
        botao.className = "btn-gotico";
        const escolhida = escolhas[slot.chave] === indice;
        botao.style.cssText = `font-size:0.68rem; padding:0.35rem 0.55rem; letter-spacing:0.03em; flex:1 1 auto; ${escolhida ? "border-color: var(--ouro-velho); color:#fff5cc; box-shadow: 0 0 10px rgba(212,175,55,0.4);" : ""}`;
        botao.textContent = (escolhida ? "◉ " : "○ ") + opcao.texto;
        botao.addEventListener("click", () => {
          if (testando) return;
          escolhas[slot.chave] = indice;
          veredito.innerHTML = "";
          restaurarCena();
          desenharPaleta();
          atualizarBotaoTestar();
        });
        linha.appendChild(botao);
      });
      grupo.appendChild(linha);
      paleta.appendChild(grupo);
    });
  }

  function atualizarBotaoTestar() {
    const completa = SLOTS.every((slot) => escolhas[slot.chave] !== null);
    botaoTestar.disabled = !completa || testando;
    botaoTestar.style.opacity = completa && !testando ? "1" : "0.5";
    botaoTestar.textContent = completa ? "⚒️ Testar a Ponte!" : "⚒️ Escolhe as 3 peças pra testar";
  }

  // Se houver mais de uma peça amaldiçoada, a ponte cai no estágio da
  // que falha primeiro (fundação antes de estrutura, estrutura antes do tabuleiro)
  function pecaAmaldicoada() {
    let pior = null;
    SLOTS.forEach((slot) => {
      const opcao = slot.opcoes[escolhas[slot.chave]];
      if (opcao && !opcao.boa && (!pior || opcao.estagioFalha < pior.estagioFalha)) pior = opcao;
    });
    return pior;
  }

  function animarColapso(runaErro) {
    if (runaErro === "E.5" || runaErro === "E.6") {
      // afunda/tomba (Pisa, Vasa)
      cena.pilar1.style.transform = "translateY(16px) rotate(-9deg)";
      cena.pilar2.style.transform = "translateY(8px) rotate(4deg)";
      cena.tabuleiro.style.transform = "rotate(-8deg) translateY(14px)";
    } else if (runaErro === "E.2" || runaErro === "E.3") {
      // flamba/rompe a junta (Quebec, Hyatt)
      cena.pilar1.style.transform = "skewX(14deg) scaleY(0.82)";
      cena.pilar2.style.transform = "skewX(-12deg) scaleY(0.86)";
      cena.tabuleiro.style.transform = "translateY(18px) rotate(3deg)";
    } else {
      // torce/balança (Tacoma, Millennium)
      cena.tabuleiro.style.transform = "rotate(12deg) scaleY(1.6)";
      cena.tabuleiro.style.opacity = "0.45";
    }
  }

  function mostrarColapso(ruim) {
    animarColapso(ruim.runaErro);
    veredito.innerHTML = `
      <div style="padding:0.75rem; border-radius:8px; background:rgba(160,32,32,0.18); border:1px solid rgba(160,32,32,0.5); font-size:0.8rem;">
        <strong>💥 COLAPSO!</strong> ${ruim.colapso}
        <button type="button" id="ponte-reler" class="btn-gotico" style="display:block; margin-top:0.6rem; font-size:0.7rem;">
          📖 Reler a crônica ${ruim.runaErro}
        </button>
      </div>`;
    veredito.querySelector("#ponte-reler").addEventListener("click", () => {
      if (typeof abrirModalRunaNegra === "function") abrirModalRunaNegra(ruim.runaErro);
    });
    testando = false;
    atualizarBotaoTestar();
  }

  function mostrarSucesso() {
    veredito.innerHTML = `
      <div style="padding:0.75rem; border-radius:8px; background:rgba(52,211,153,0.15); border:1px solid rgba(52,211,153,0.5); font-size:0.8rem;">
        <strong>🎉 A ponte resiste aos três julgamentos!</strong>
        A Ilha começa a se redimir — construíste com a sabedoria de quem leu as quedas.
      </div>`;
    if (typeof concederConquistaPonte === "function") concederConquistaPonte();
    testando = false;
    atualizarBotaoTestar();
  }

  function testarPonte() {
    if (testando) return;
    testando = true;
    atualizarBotaoTestar();
    restaurarCena();

    const ruim = pecaAmaldicoada();

    function rodarEstagio(numero) {
      const atual = ESTAGIOS[numero - 1];
      cena.carga.textContent = atual.emoji;
      cena.carga.style.left = "6%";
      veredito.innerHTML = `<p style="font-size:0.78rem; margin:0; opacity:0.85;">${atual.emoji} Estágio ${numero}: ${atual.nome}...</p>`;
      // dispara a travessia no próximo frame pra transição CSS pegar
      requestAnimationFrame(() => { cena.carga.style.left = "82%"; });
      setTimeout(() => {
        if (ruim && ruim.estagioFalha === numero) return mostrarColapso(ruim);
        if (numero >= ESTAGIOS.length) return mostrarSucesso();
        rodarEstagio(numero + 1);
      }, 1000);
    }

    rodarEstagio(1);
  }

  botaoTestar.addEventListener("click", testarPonte);

  desenharPaleta();
  atualizarBotaoTestar();
}
