/**
 * cronica.js — Tela da Crônica Fundadora (o "livro de história" do Império)
 *
 * Mostra o texto COMPLETO da Crônica Fundadora num modal de pergaminho,
 * um capítulo por reino (blocos 0 a 6, na mesma ordem do mapa). A versão
 * condensada (CRONICA_FUNDADORA, em dados.js) continua lá, mas hoje nenhum
 * script a usa; aqui fica o texto inteiro, fiel ao original do autor (é o canon do
 * universo: nada foi inventado, só organizado em capítulos).
 *
 * - abrirCronica(blocoIdOpcional): abre no capítulo do reino pedido
 *   ("bloco3", 3 ou "3"). Sem reino, reabre onde a criança parou.
 * - Navegação: botões ◀ / ▶, medalhões numerados dos 7 capítulos e as
 *   setas ← / → do teclado. Fecha com ✕, com Esc ou clicando fora.
 * - Acessibilidade: role="dialog" + aria-modal, foco preso dentro do
 *   modal enquanto ele está aberto e devolvido a quem abriu ao fechar;
 *   a troca de capítulo é anunciada numa região aria-live.
 * - Qualquer elemento com o atributo data-abrir-cronica abre a Crônica
 *   (o valor é o id do reino, ou vazio pra continuar de onde parou).
 *   O clique é tratado por delegação no document, então funciona mesmo
 *   nos painéis que o app.js redesenha a toda hora.
 * - criarLinkCronicaReino(blocoId): monta o link "Ler a crônica deste
 *   reino" pros painéis de reino do app.js.
 * - Guarda o último capítulo e os capítulos já lidos em
 *   "borgestravel_cronica" via armazenamentoLer/armazenamentoGravar
 *   (navegacao.js), no formato {"ultimo":2,"lidos":["bloco0","bloco1"]}.
 *
 * Depende de reinosDados (dados.js) e do wrapper de armazenamento
 * (navegacao.js). Se brasoes.js estiver carregado, o capítulo mostra o
 * brasão do reino no cabeçalho; sem ele, aparece o medalhão numerado.
 * Estilos na seção "Crônica Fundadora" do style.css (classes .cronica-*).
 */

const CHAVE_CRONICA = "borgestravel_cronica";

const CRONICA_TITULO = "O Império do Esqueleto Invisível";
const CRONICA_SUBTITULO = "Crônicas da Grande Aliança Estrutural";

// ---------- Texto completo da Crônica (um capítulo por reino) ----------
// Cada trecho é um parágrafo do original. Strings comuns são texto corrido;
// { citacao } são as frases gravadas em pedra/bronze (em itálico no
// original); { fecho } é a palavra final da Crônica, que ganha destaque.

const cronicaCapitulos = [
  {
    blocoId: "bloco0",
    titulo: "O Portal de Entrada",
    subtitulo: "A Porta Índigo",
    trechos: [
      "Nenhum viajante chega ao Império das Estruturas sem antes atravessar o Portal Índigo.",
      "Dizem os antigos manuscritos que esta passagem não foi construída por mãos humanas, mas descoberta.",
      "Ela existe no limite entre a imaginação e a matéria, entre aquilo que um homem sonha construir e aquilo que o mundo permite permanecer de pé.",
      "Sobre seus arcos de pedra está gravada uma frase dos primeiros mestres construtores:",
      { citacao: "\"Toda grande obra começa como uma ideia frágil na mente de alguém. A engenharia é a arte de convencer essa ideia a sobreviver no mundo real.\"" },
      "Aqueles que atravessam o Portal Índigo deixam para trás o mundo comum e entram nos domínios onde pedras possuem memória, metais possuem temperamento e forças invisíveis governam silenciosamente todas as coisas.",
      "Ali começa a jornada dos aprendizes da antiga Arte Estrutural."
    ]
  },
  {
    blocoId: "bloco1",
    titulo: "O Vilarejo dos Sistemas Construtivos",
    subtitulo: "Onde os Sonhos Ganham Forma",
    trechos: [
      "O primeiro território encontrado pelos viajantes é um pequeno vilarejo cercado por oficinas, pedreiras e grandes campos de construção.",
      "Chamam-no de Vilarejo dos Sistemas Construtivos.",
      "É um lugar humilde, porém essencial.",
      "Seus habitantes não são conhecidos por realizar os cálculos mais complexos nem por dominar os mistérios mais profundos da natureza.",
      "Sua magia é outra:",
      "Eles sabem transformar ideias em realidade.",
      "São os mestres das ferramentas, das técnicas e dos métodos.",
      "Conhecem o caminho que uma pedra percorre até se tornar uma muralha.",
      "Sabem como uma floresta se transforma em vigas.",
      "Sabem como uma mistura simples de minerais pode se tornar uma fundação capaz de desafiar séculos.",
      "Os moradores desse vilarejo carregam uma sabedoria antiga:",
      { citacao: "\"Nenhuma torre nasce no céu. Antes de tocar as nuvens, ela precisa aprender a existir no chão.\"" },
      "Porém, aqueles que permanecem tempo suficiente percebem algo inquietante.",
      "Construir não era suficiente.",
      "Era necessário compreender as leis invisíveis que decidiam se uma obra viveria ou morreria.",
      "Então os viajantes seguem adiante."
    ]
  },
  {
    blocoId: "bloco2",
    titulo: "O Condado de MecTec",
    subtitulo: "A Cidade dos Comerciantes das Forças Invisíveis",
    trechos: [
      "Após deixar as pequenas oficinas do vilarejo, surge diante dos olhos dos viajantes uma cidade muito mais grandiosa.",
      "Torres de observação, mercados de instrumentos, bibliotecas de cálculos e grandes salões de negociação dominam a paisagem.",
      "Este é o Condado de MecTec.",
      "Diferente dos construtores do vilarejo, os habitantes de MecTec não negociam pedras, madeira ou aço.",
      "Eles negociam algo muito mais raro:",
      "Forças.",
      "Nesta cidade vivem os mercadores das leis naturais.",
      "Eles comercializam conhecimento sobre equilíbrio, movimento, energia e interação.",
      "Seus sábios descobriram que uma ponte não permanece firme por vontade própria.",
      "Ela existe porque milhares de forças invisíveis travam uma batalha silenciosa em seu interior.",
      "Os comerciantes de MecTec foram os primeiros a mapear essas forças e transformá-las em linguagem.",
      "Criaram símbolos.",
      "Criaram regras.",
      "Criaram uma nova forma de enxergar o mundo.",
      "Mas ainda faltava compreender aqueles que recebiam essas forças.",
      "A matéria.",
      "E assim nasceu o próximo grande domínio."
    ]
  },
  {
    blocoId: "bloco3",
    titulo: "O Reino da Mecânica dos Sólidos",
    subtitulo: "O Reino dos Tendões",
    trechos: [
      "Entre montanhas antigas e fortalezas de pedra está o Reino dos Tendões.",
      "Aqui vivem os estudiosos da matéria.",
      "Eles não olham para construções como simples objetos.",
      "Para eles, toda estrutura é um organismo.",
      "A madeira possui fibras como tendões.",
      "A pedra possui resistência como ossos antigos.",
      "O aço possui uma força semelhante à de criaturas forjadas no fogo.",
      "Os sábios deste reino dedicaram suas vidas a uma pergunta:",
      { citacao: "\"Como a matéria suporta aquilo que o mundo coloca sobre ela?\"" },
      "Eles estudaram deformações, comportamentos internos e respostas dos materiais.",
      "Descobriram que toda substância possui uma personalidade.",
      "Algumas cedem antes de quebrar.",
      "Outras permanecem rígidas até o instante da ruína.",
      "Algumas suportam batalhas violentas.",
      "Outras são destruídas por pequenos ataques repetidos durante anos.",
      "O Reino dos Tendões ensinou ao império uma verdade fundamental:",
      { citacao: "\"Conhecer uma força é inútil se você não conhece o corpo que a recebe.\"" }
    ]
  },
  {
    blocoId: "bloco4",
    titulo: "O Reino dos Músculos",
    subtitulo: "A Fortaleza de Bronze da Resistência dos Materiais",
    trechos: [
      "Além das fronteiras dos Tendões existe o majestoso Reino dos Músculos.",
      "Suas muralhas são feitas de bronze, símbolo da força conquistada através da experiência.",
      "Aqui habitam os juízes dos materiais.",
      "Eles não perguntam apenas:",
      "\"Quanto peso uma estrutura suporta?\"",
      "Eles perguntam:",
      "\"Quanto tempo ela resistirá?\"",
      "\"Quanto ela pode suportar antes de mudar?\"",
      "\"Qual será seu último suspiro antes da ruptura?\"",
      "Os mestres deste reino criaram os grandes testes da resistência.",
      "Eles colocaram materiais diante de desafios:",
      "A tração.",
      "A compressão.",
      "A flexão.",
      "A torção.",
      "A fadiga.",
      "O Reino dos Músculos revelou que até os maiores guerreiros possuem limites.",
      "Até o aço mais poderoso pode ser vencido por pequenas feridas repetidas.",
      "Até a maior estrutura pode cair quando seus limites são ignorados.",
      "Seus habitantes carregam um lema gravado em bronze:",
      { citacao: "\"A força verdadeira não está em nunca sofrer. Está em conhecer exatamente quanto sofrimento se pode suportar.\"" }
    ]
  },
  {
    blocoId: "bloco5",
    titulo: "O Reino dos Esqueletos",
    subtitulo: "O Domínio Verde-Água da Análise Estrutural",
    trechos: [
      "Nas regiões mais elevadas do império encontra-se o Reino dos Esqueletos.",
      "É uma terra de torres translúcidas, pontes suspensas e grandes observatórios.",
      "Seus habitantes são chamados de Guardiões da Linha Invisível.",
      "Eles possuem o dom mais raro de todos:",
      "Enxergar aquilo que ninguém vê.",
      "Quando observam uma ponte, eles não veem apenas madeira, aço ou concreto.",
      "Eles veem caminhos.",
      "Veem forças viajando.",
      "Veem tensões escondidas.",
      "Veem o destino de uma construção antes mesmo dela existir.",
      "Os mestres esqueletais compreendem que uma estrutura é um grande corpo.",
      "As vigas são seus ossos.",
      "Os pilares são seus membros.",
      "As ligações são suas articulações.",
      "E as fundações são suas raízes.",
      "Eles são os profetas capazes de prever se uma obra resistirá ao tempo ou se carregará dentro de si a semente da própria destruição."
    ]
  },
  {
    blocoId: "bloco6",
    titulo: "A Grande Aliança Estrutural",
    subtitulo: "O Super Reino Roxo",
    trechos: [
      "No centro de todo o império existe um território que nenhum mapa comum consegue representar.",
      "Ele não é apenas mais um reino.",
      "Ele é a união de todos.",
      "A Grande Aliança Estrutural.",
      "O Super Reino Roxo.",
      "Durante séculos, os povos acreditaram que cada conhecimento existia separado.",
      "Os habitantes de MecTec dominavam as forças.",
      "Os Tendões compreendiam a matéria.",
      "Os Músculos conheciam os limites.",
      "Os Esqueletos enxergavam o comportamento das estruturas.",
      "Mas finalmente os antigos mestres compreenderam a verdade esquecida:",
      "Nenhum reino sozinho poderia criar as maiores maravilhas do mundo.",
      "Uma ponte magnífica precisava da força de todos.",
      "Uma catedral eterna precisava da sabedoria de todos.",
      "Um arranha-céu capaz de tocar as nuvens precisava da união de todos.",
      "Então os quatro grandes domínios selaram o pacto definitivo.",
      "Nasceu a Grande Aliança Estrutural.",
      "O lugar onde todas as magias se encontram.",
      "Onde a força encontra a matéria.",
      "Onde o cálculo encontra a criatividade.",
      "Onde o conhecimento encontra a coragem de construir.",
      "E desde então existe uma antiga profecia escrita nas pedras do Super Reino:",
      { citacao: "\"Quando os homens compreenderem que uma estrutura não é apenas aquilo que permanece de pé, mas aquilo que luta silenciosamente para permanecer, eles terão finalmente descoberto o verdadeiro segredo do mundo.\"" },
      "Esse segredo possui muitos nomes.",
      "Mas os antigos o chamavam simplesmente de:",
      { fecho: "Engenharia." }
    ]
  }
];

// ---------- Estado da tela ----------

let capituloCronicaAtual = 0;
let elementoFocoAntesCronica = null; // quem abriu a Crônica (o foco volta pra ele ao fechar)

// ---------- Progresso salvo (último capítulo e capítulos lidos) ----------

function obterProgressoCronica() {
  try {
    const salvo = typeof armazenamentoLer === "function" ? armazenamentoLer(CHAVE_CRONICA) : null;
    const dados = salvo ? JSON.parse(salvo) : null;
    if (!dados || typeof dados !== "object") return { ultimo: 0, lidos: [] };
    const ultimo = Number.isInteger(dados.ultimo) && dados.ultimo >= 0 && dados.ultimo < cronicaCapitulos.length ? dados.ultimo : 0;
    return { ultimo, lidos: Array.isArray(dados.lidos) ? dados.lidos : [] };
  } catch (erro) {
    return { ultimo: 0, lidos: [] }; // save corrompido: começa do primeiro capítulo
  }
}

function salvarProgressoCronica(indice) {
  if (typeof armazenamentoGravar !== "function") return;
  const progresso = obterProgressoCronica();
  const blocoId = cronicaCapitulos[indice].blocoId;
  if (!progresso.lidos.includes(blocoId)) progresso.lidos.push(blocoId);
  progresso.ultimo = indice;
  armazenamentoGravar(CHAVE_CRONICA, JSON.stringify(progresso));
}

// Aceita "bloco3", 3 ou "3"; devolve o índice do capítulo ou -1
function indiceCapituloCronica(blocoId) {
  if (blocoId === undefined || blocoId === null || blocoId === "") return -1;
  const texto = String(blocoId);
  const id = /^\d+$/.test(texto) ? "bloco" + texto : texto;
  return cronicaCapitulos.findIndex((capitulo) => capitulo.blocoId === id);
}

// Dados do reino (cor, número, nome) que acompanham o capítulo
function reinoDoCapitulo(capitulo) {
  return reinosDados.find((bloco) => bloco.id === capitulo.blocoId) || null;
}

// ---------- Abrir / fechar ----------

function abrirCronica(blocoIdOpcional) {
  const pedido = indiceCapituloCronica(blocoIdOpcional);
  const indice = pedido >= 0 ? pedido : obterProgressoCronica().ultimo;

  // Já aberta (ex.: chamada de novo por outro botão): só troca o capítulo
  if (document.getElementById("cronica-overlay")) {
    mostrarCapituloCronica(indice);
    return;
  }

  elementoFocoAntesCronica = document.activeElement;

  const overlay = document.createElement("div");
  overlay.id = "cronica-overlay";
  overlay.className = "cronica-overlay";

  const painel = document.createElement("div");
  painel.className = "cronica-pergaminho";
  painel.setAttribute("role", "dialog");
  painel.setAttribute("aria-modal", "true");
  painel.setAttribute("aria-labelledby", "cronica-titulo-capitulo");

  // Medalhões dos 7 capítulos (atalho direto pra qualquer reino)
  const medalhoes = cronicaCapitulos.map((capitulo, i) => {
    const reino = reinoDoCapitulo(capitulo);
    const cor = reino ? reino.hex : "#d4af37";
    return `<button type="button" class="cronica-medalhao" data-capitulo="${i}" style="--cor-reino:${cor}"
      aria-label="Capítulo ${i + 1}: ${capitulo.titulo}" title="${capitulo.titulo}">${reino ? reino.num : i}</button>`;
  }).join("");

  painel.innerHTML = `
    <div class="cronica-topo">
      <div class="cronica-topo-titulos">
        <span class="font-display cronica-kicker">📜 ${CRONICA_TITULO}</span>
        <span class="cronica-kicker-sub">${CRONICA_SUBTITULO}</span>
      </div>
      <button type="button" id="fechar-cronica" class="btn-gotico cronica-fechar"
        aria-label="Fechar a Crônica" title="Fechar a Crônica (Esc)">✕</button>
    </div>
    <nav class="cronica-capitulos" aria-label="Capítulos da Crônica">${medalhoes}</nav>
    <article class="cronica-texto" tabindex="0" aria-label="Texto do capítulo"></article>
    <div class="cronica-rodape">
      <button type="button" class="btn-gotico cronica-anterior" aria-label="Capítulo anterior" title="Capítulo anterior (←)">◀ <span class="cronica-rotulo-botao">Anterior</span></button>
      <span class="cronica-paginacao" aria-hidden="true"></span>
      <button type="button" class="btn-gotico cronica-proximo" aria-label="Próximo capítulo" title="Próximo capítulo (→)"><span class="cronica-rotulo-botao">Próximo</span> ▶</button>
    </div>
    <p class="sr-only cronica-anuncio" aria-live="polite"></p>
  `;

  overlay.appendChild(painel);
  document.body.appendChild(overlay);

  // Fecha ao clicar fora do pergaminho ou no ✕
  overlay.addEventListener("click", (evento) => {
    if (evento.target === overlay) fecharCronica();
  });
  painel.querySelector("#fechar-cronica").addEventListener("click", fecharCronica);

  painel.querySelectorAll(".cronica-medalhao").forEach((botao) => {
    botao.addEventListener("click", () => mostrarCapituloCronica(Number(botao.dataset.capitulo), true));
  });
  painel.querySelector(".cronica-anterior").addEventListener("click", () => {
    mostrarCapituloCronica(capituloCronicaAtual - 1, true);
  });
  painel.querySelector(".cronica-proximo").addEventListener("click", () => {
    // No último capítulo o botão vira "Fechar o livro"
    if (capituloCronicaAtual >= cronicaCapitulos.length - 1) fecharCronica();
    else mostrarCapituloCronica(capituloCronicaAtual + 1, true);
  });

  document.addEventListener("keydown", teclasCronica);

  mostrarCapituloCronica(indice, false);

  // Foco inicial no ✕: leitor de tela anuncia o diálogo e Esc/Tab já funcionam
  painel.querySelector("#fechar-cronica").focus();
}

function fecharCronica() {
  const overlay = document.getElementById("cronica-overlay");
  if (overlay) overlay.remove();
  document.removeEventListener("keydown", teclasCronica);

  // Devolve o foco pra quem abriu (se ainda existir na página — o app.js
  // pode ter redesenhado o painel enquanto a Crônica estava aberta)
  const anterior = elementoFocoAntesCronica;
  elementoFocoAntesCronica = null;
  if (anterior && document.body.contains(anterior) && typeof anterior.focus === "function") {
    anterior.focus();
  }
}

// ---------- Desenho de um capítulo ----------

// Troca as aspas retas do texto original por aspas curvas na hora de mostrar
// (só tipografia: o texto guardado em cronicaCapitulos continua igual ao do autor)
function aspasCurvasCronica(texto) {
  return texto.replace(/"([^"]*)"/g, "\u201C$1\u201D");
}

// anunciar = true quando a troca veio de um clique/tecla (avisa o leitor de tela)
function mostrarCapituloCronica(indice, anunciar) {
  const painel = document.querySelector("#cronica-overlay .cronica-pergaminho");
  if (!painel) return;

  capituloCronicaAtual = Math.max(0, Math.min(cronicaCapitulos.length - 1, indice));
  const capitulo = cronicaCapitulos[capituloCronicaAtual];
  const reino = reinoDoCapitulo(capitulo);
  const total = cronicaCapitulos.length;

  painel.style.setProperty("--cor-reino", reino ? reino.hex : "#d4af37");

  // Brasão desenhado (brasoes.js) se existir; senão o medalhão com o número
  const emblema = typeof brasaoHTML === "function"
    ? `<span class="cronica-emblema cronica-emblema-brasao" aria-hidden="true">${brasaoHTML(capitulo.blocoId, 54, { decorativo: true })}</span>`
    : `<span class="cronica-emblema" aria-hidden="true">${reino ? reino.num : capituloCronicaAtual}</span>`;

  const nomeReino = reino && typeof nomeCurtoReino === "function" ? nomeCurtoReino(reino.title) : "";

  const texto = painel.querySelector(".cronica-texto");
  texto.innerHTML = `
    <header class="cronica-cabecalho-capitulo">
      ${emblema}
      <div>
        <span class="cronica-numero-capitulo">Capítulo ${capituloCronicaAtual + 1} de ${total}${reino ? ` · Bloco ${reino.num}${nomeReino ? " — " + nomeReino : ""}` : ""}</span>
        <h2 id="cronica-titulo-capitulo" class="font-display cronica-titulo">${capitulo.titulo}</h2>
        <p class="cronica-subtitulo">${capitulo.subtitulo}</p>
      </div>
    </header>
    <div class="divisor-losango cronica-divisor"><span>❖</span></div>
  `;

  // Parágrafos montados com textContent (o texto é dado puro, sem HTML)
  capitulo.trechos.forEach((trecho, i) => {
    let elemento;
    if (typeof trecho === "string") {
      elemento = document.createElement("p");
      elemento.className = i === 0 ? "cronica-paragrafo cronica-capitular" : "cronica-paragrafo";
      elemento.textContent = aspasCurvasCronica(trecho);
    } else if (trecho.citacao) {
      elemento = document.createElement("blockquote");
      elemento.className = "cronica-citacao";
      elemento.textContent = aspasCurvasCronica(trecho.citacao);
    } else if (trecho.fecho) {
      elemento = document.createElement("p");
      elemento.className = "font-display cronica-fecho";
      elemento.textContent = trecho.fecho;
    }
    if (elemento) texto.appendChild(elemento);
  });

  // Animação de "virar página" (o CSS desliga com prefers-reduced-motion)
  texto.classList.remove("cronica-virando");
  void texto.offsetWidth; // reinicia a animação mesmo clicando rápido
  texto.classList.add("cronica-virando");
  texto.scrollTop = 0;

  // Medalhões: atual em destaque, lidos com marquinha
  salvarProgressoCronica(capituloCronicaAtual);
  const lidos = obterProgressoCronica().lidos;
  painel.querySelectorAll(".cronica-medalhao").forEach((botao) => {
    const i = Number(botao.dataset.capitulo);
    const atual = i === capituloCronicaAtual;
    botao.classList.toggle("atual", atual);
    botao.classList.toggle("lido", lidos.includes(cronicaCapitulos[i].blocoId));
    if (atual) botao.setAttribute("aria-current", "step");
    else botao.removeAttribute("aria-current");
  });

  // Rodapé: ◀ some no 1º capítulo; no último, ▶ vira "Fechar o livro"
  const botaoAnterior = painel.querySelector(".cronica-anterior");
  const botaoProximo = painel.querySelector(".cronica-proximo");
  const primeiro = capituloCronicaAtual === 0;
  const ultimo = capituloCronicaAtual === total - 1;

  // Se o foco estava no ◀ que vai ser desativado, passa pro ▶ (senão o foco cai no body)
  if (primeiro && document.activeElement === botaoAnterior) botaoProximo.focus();
  botaoAnterior.disabled = primeiro;

  botaoProximo.innerHTML = ultimo
    ? `<span class="cronica-rotulo-botao">Fechar o livro</span> ✓`
    : `<span class="cronica-rotulo-botao">Próximo</span> ▶`;
  botaoProximo.setAttribute("aria-label", ultimo ? "Fim da Crônica: fechar o livro" : "Próximo capítulo");
  botaoProximo.title = ultimo ? "Fim da Crônica: fechar o livro" : "Próximo capítulo (→)";

  painel.querySelector(".cronica-paginacao").textContent = `${capituloCronicaAtual + 1} / ${total}`;

  if (anunciar) {
    painel.querySelector(".cronica-anuncio").textContent =
      `Capítulo ${capituloCronicaAtual + 1} de ${total}: ${capitulo.titulo} — ${capitulo.subtitulo}`;
  }
}

// ---------- Teclado: Esc fecha, ← / → trocam de capítulo, Tab fica preso no modal ----------

function teclasCronica(evento) {
  const painel = document.querySelector("#cronica-overlay .cronica-pergaminho");
  if (!painel) return;

  if (evento.key === "Escape") {
    evento.preventDefault();
    fecharCronica();
    return;
  }

  if (evento.key === "ArrowLeft" || evento.key === "ArrowRight") {
    if (evento.altKey || evento.ctrlKey || evento.metaKey) return; // atalhos do navegador
    evento.preventDefault();
    const passo = evento.key === "ArrowLeft" ? -1 : 1;
    const destino = capituloCronicaAtual + passo;
    if (destino >= 0 && destino < cronicaCapitulos.length) mostrarCapituloCronica(destino, true);
    return;
  }

  if (evento.key === "Tab") {
    const focaveis = Array.from(painel.querySelectorAll("button, [tabindex]"))
      .filter((el) => !el.disabled && el.tabIndex >= 0);
    if (!focaveis.length) return;
    const primeiro = focaveis[0];
    const ultimo = focaveis[focaveis.length - 1];
    const dentro = painel.contains(document.activeElement);

    if (evento.shiftKey && (document.activeElement === primeiro || !dentro)) {
      evento.preventDefault();
      ultimo.focus();
    } else if (!evento.shiftKey && (document.activeElement === ultimo || !dentro)) {
      evento.preventDefault();
      primeiro.focus();
    }
  }
}

// ---------- Link "Ler a crônica deste reino" (usado pelo app.js) ----------

// Devolve o botão pronto, ou null se o reino não tem capítulo (ex.: Ilha Amaldiçoada)
function criarLinkCronicaReino(blocoId) {
  const indice = indiceCapituloCronica(blocoId);
  if (indice < 0) return null;
  const capitulo = cronicaCapitulos[indice];

  const link = document.createElement("button");
  link.type = "button";
  link.className = "link-cronica-reino";
  link.dataset.abrirCronica = capitulo.blocoId; // o clique é tratado pela delegação abaixo
  link.setAttribute("aria-label", `Ler a crônica deste reino: ${capitulo.titulo}`);
  link.title = `Crônica Fundadora — ${capitulo.titulo}`;
  link.innerHTML = `<span aria-hidden="true">📜</span> Ler a crônica deste reino`;
  return link;
}

// ---------- Delegação: qualquer [data-abrir-cronica] abre a Crônica ----------

document.addEventListener("click", (evento) => {
  const alvo = evento.target.closest ? evento.target.closest("[data-abrir-cronica]") : null;
  if (!alvo) return;
  evento.preventDefault();
  abrirCronica(alvo.dataset.abrirCronica);
});
