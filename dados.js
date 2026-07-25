/**
 * dados.js — Conteúdo unificado do Mundo Borgestrável
 * Consolidado a partir de 3 fontes: Lovable, Base44 e BORGESTR-VEL.
 * Este arquivo não tem lógica, só dados (textos, cores, estrutura dos 7 blocos e 45 runas).
 */

// Estrutura dos 7 blocos e seus subtemas (runas)
const reinosDados = [
  {
    "id": "bloco0",
    "num": 0,
    "title": "🗺️ Bloco 0 — Portal de Entrada",
    "subtitle": "Introdução e Conceitos Intuitivos",
    "hex": "#5c6bc0",
    "subtemas": [
      {
        "id": "0.1",
        "title": "🗺️ 0.1 — O Mapa do Mundo"
      },
      {
        "id": "0.2",
        "title": "📖 0.2 — O Diário de Bordo"
      },
      {
        "id": "0.3",
        "title": "🧭 0.3 — A Pergunta do Aprendiz"
      },
      {
        "id": "0.4",
        "title": "🔑 0.4 — O Selo do Aprendiz"
      },
      {
        "id": "0.5",
        "title": "🕰️ 0.5 — A Linha do Tempo Mágica"
      },
      {
        "id": "0.6",
        "title": "🌍 0.6 — O Mundo Real Espiando"
      },
      {
        "id": "0.7",
        "title": "⚖️ 0.7 — O Empate Perfeito"
      },
      {
        "id": "0.8",
        "title": "🧩 0.8 — Tudo é Feito de Peças"
      },
      {
        "id": "0.9",
        "title": "🔮 0.9 — A Bola de Cristal do Engenheiro"
      }
    ]
  },
  {
    "id": "bloco1",
    "num": 1,
    "title": "🏘️ Bloco 1 — Vilarejo dos Sistemas Construtivos",
    "subtitle": "A Base Concreta da Construção",
    "hex": "#ff7043",
    "subtemas": [
      {
        "id": "1.1",
        "title": "🧱 1.1 — Casas de Alvenaria"
      },
      {
        "id": "1.2",
        "title": "🏗️ 1.2 — Torres de Concreto Armado"
      },
      {
        "id": "1.3",
        "title": "🪵 1.3 — Pontes de Madeira e Aço"
      },
      {
        "id": "1.4",
        "title": "🪨 1.4 — Os Primeiros Construtores"
      },
      {
        "id": "1.5",
        "title": "🏭 1.5 — A Fábrica de Peças"
      },
      {
        "id": "1.6",
        "title": "🌱 1.6 — Construções Vivas"
      }
    ]
  },
  {
    "id": "bloco2",
    "num": 2,
    "title": "🏙️ Bloco 2 — Condado de MecTec",
    "subtitle": "Cidade de Comerciantes e Pontes Técnicas",
    "hex": "#e0a83e",
    "subtemas": [
      {
        "id": "2.1",
        "title": "📏 2.1 — A Régua Mágica"
      },
      {
        "id": "2.2",
        "title": "🌬️ 2.2 — O Peso Invisível"
      },
      {
        "id": "2.3",
        "title": "💔 2.3 — O Ponto de Ruptura"
      },
      {
        "id": "2.4",
        "title": "🧭 2.4 — A Bússola das Direções"
      },
      {
        "id": "2.5",
        "title": "⏳ 2.5 — O Tempo da Força"
      },
      {
        "id": "2.6",
        "title": "🔬 2.6 — O Laboratório do Aprendiz"
      }
    ]
  },
  {
    "id": "bloco3",
    "num": 3,
    "title": "⚙️ Bloco 3 — Reino NEXUS (Tendões)",
    "subtitle": "Mecânica dos Sólidos e os Elos das Forças",
    "hex": "#9e9e9e",
    "subtemas": [
      {
        "id": "3.1",
        "title": "🩸 3.1 — O Elo Secreto (Tendões)"
      },
      {
        "id": "3.2",
        "title": "🌀 3.2 — A Lei da Reação"
      },
      {
        "id": "3.3",
        "title": "⚙️ 3.3 — A Régua Universal"
      },
      {
        "id": "3.4",
        "title": "🧪 3.4 — A Poção da Elasticidade"
      },
      {
        "id": "3.5",
        "title": "🪞 3.5 — O Espelho das Forças"
      },
      {
        "id": "3.6",
        "title": "🗝️ 3.6 — A Chave-Mestra"
      }
    ]
  },
  {
    "id": "bloco4",
    "num": 4,
    "title": "💪 Bloco 4 — Reino dos Músculos",
    "subtitle": "Resistência dos Materiais e as Fibras Internas",
    "hex": "#c0392b",
    "subtemas": [
      {
        "id": "4.1",
        "title": "😠 4.1 — O \"Stress\" (Tensão)"
      },
      {
        "id": "4.2",
        "title": "🥨 4.2 — Mudar de Forma (Deformação)"
      },
      {
        "id": "4.3",
        "title": "🦹 4.3 — Os 5 Super Vilões"
      },
      {
        "id": "4.4",
        "title": "😴 4.4 — A Fadiga do Herói"
      },
      {
        "id": "4.5",
        "title": "🛡️ 4.5 — O Fator de Segurança"
      },
      {
        "id": "4.6",
        "title": "🥋 4.6 — Poderes Diferentes por Material"
      }
    ]
  },
  {
    "id": "bloco5",
    "num": 5,
    "title": "🦴 Bloco 5 — Reino dos Esqueletos",
    "subtitle": "Análise Estrutural e o Equilíbrio Estático",
    "hex": "#00e5ff",
    "subtemas": [
      {
        "id": "5.1",
        "title": "⚖️ 5.1 — A Regra da Estátua (Equilíbrio)"
      },
      {
        "id": "5.2",
        "title": "💨 5.2 — Os Inimigos (Forças)"
      },
      {
        "id": "5.3",
        "title": "👟 5.3 — Os Pés no Chão (Apoios)"
      },
      {
        "id": "5.4",
        "title": "🌉 5.4 — Vãos e Vigas"
      },
      {
        "id": "5.5",
        "title": "🎒 5.5 — Cargas Vivas vs Cargas Mortas"
      },
      {
        "id": "5.6",
        "title": "🦴 5.6 — Osso Extra de Segurança"
      }
    ]
  },
  {
    "id": "bloco6",
    "num": 6,
    "title": "🏰 Bloco 6 — A Grande Aliança Estrutural",
    "subtitle": "O Clímax do Engenheiro Arcano",
    "hex": "#ab47bc",
    "subtemas": [
      {
        "id": "6.1",
        "title": "⚔️ 6.1 — A Batalha Final"
      },
      {
        "id": "6.2",
        "title": "🤝 6.2 — O Selo dos Dois Reinos"
      },
      {
        "id": "6.3",
        "title": "🎓 6.3 — O Diploma do Engenheiro Mágico"
      },
      {
        "id": "6.4",
        "title": "🏙️ 6.4 — A Cidade Completa"
      },
      {
        "id": "6.5",
        "title": "🧠 6.5 — O Desafio do Mestre"
      },
      {
        "id": "6.6",
        "title": "🌟 6.6 — O Salão da Fama"
      }
    ]
  }
];

// Brasões heráldicos de cada bloco (origem: Lovable)
const brasoesPorBloco = {
  "0": {
    "campo": "#1e3a8a",
    "campoEscuro": "#0f1f52",
    "borda": "#d4af37",
    "carga": "compasso",
    "lema": "INITIUM SAPIENTIAE"
  },
  "1": {
    "campo": "#991b1b",
    "campoEscuro": "#5c0f0f",
    "borda": "#e2b94a",
    "carga": "torre",
    "lema": "FUNDAMENTUM FIRMUM"
  },
  "2": {
    "campo": "#b45309",
    "campoEscuro": "#6b2f04",
    "borda": "#fff2c4",
    "carga": "regua",
    "lema": "MENSURA ET VIS"
  },
  "3": {
    "campo": "#3a3540",
    "campoEscuro": "#1c1a20",
    "borda": "#c0c0c0",
    "carga": "engrenagem",
    "lema": "VINCULA OCCULTA"
  },
  "4": {
    "campo": "#4e342e",
    "campoEscuro": "#241512",
    "borda": "#d4af37",
    "carga": "coluna",
    "lema": "FORTITUDO MATERIAE"
  },
  "5": {
    "campo": "#14532d",
    "campoEscuro": "#062112",
    "borda": "#00e5ff",
    "carga": "olho",
    "lema": "RATIO REGIT"
  },
  "6": {
    "campo": "#4a1d80",
    "campoEscuro": "#25103f",
    "borda": "#ab47bc",
    "carga": "espadas",
    "lema": "UNITAS AETERNA"
  }
};

// Conteúdo detalhado de cada uma das 45 runas (origem: Base44, versão mais completa)
const dadosEspecificosCards = {
  "0.1": {
    "title": "🗺️ 0.1 — O Mapa do Mundo",
    "subtitle": "Descobre a totalidade da tua jornada arcana",
    "desc": "Antes de colocar o primeiro tijolo no solo, o grande Engenheiro Mágico projeta os olhos sobre o horizonte inteiro. Este mapa representa os 7 reinos que irás conquistar.",
    "principal": "A Grande Muralha da China estende-se por mais de 21 mil quilómetros através de relevos impiedosos!",
    "secreta1": "Aqui Há Dragões: Cartógrafos antigos usavam ilustrações de feras e dragões para preencher terras inexploradas. Num globo de cobre de 1510, no meio do leste asiático, está gravado \"HC SVNT DRACONES\" (Aqui há dragões).",
    "secreta2": "A Ilha Que Não Existia: Por mais de 100 anos, os reis europeus planeavam expedições navais guiados por mapas oficiais que representavam a península da Califórnia como se fosse uma colossal ilha separada do continente.",
    "dica": "💡 Um mapa errado repetido por preguiça vira dogma. O engenheiro confere as suas fundações e as suas medidas pessoalmente, sem confiar no boato.",
    "desafio": "Desbloqueia os territórios arrastando o teu progresso na árvore rúnica!",
    "fechamento": "Todo o grande construtor domina a visão do todo antes de esculpir a primeira pedra."
  },
  "0.2": {
    "title": "📖 0.2 — O Diário de Bordo",
    "subtitle": "O registo imutável do teu progresso",
    "desc": "O diário de bordo é a tua memória viva. Sem o registo de cada avanço, a maior das catedrais desmorona-se em confusão e desordem.",
    "principal": "Os engenheiros modernos são legalmente obrigados a registar os factos diários das construções no Diário de Obra!",
    "secreta1": "O Diário Mais Velho do Mundo: Em 2013, arqueólogos encontraram num porto do Mar Vermelho o \"Papiro de Merer\" — o diário de bordo de 4.500 anos escrito pelo inspetor egípcio encarregado de carregar as pedras de calcário de Tura para a Grande Pirâmide de Gizé!",
    "secreta2": "A Origem do Diário (Log Book): Os marinheiros antigos jogavam ao mar uma placa de madeira amarrada a uma linha cheia de nós e mediam os nós que passavam com uma ampulheta. Registavam este \"log\" (tronco) no livro que media a velocidade.",
    "dica": "💡 Registar cada evento, todo o santo dia, é o escudo supremo que separa um mestre confiável de um aventureiro imprudente.",
    "desafio": "Customiza o teu diário mudando a cor rúnica do teu painel!",
    "fechamento": "A caneta e a pedra guardam a mesma verdade quando escritas com disciplina."
  },
  "0.3": {
    "title": "🧭 0.3 — A Pergunta do Aprendiz",
    "subtitle": "A eterna batalha do equilíbrio contra a força invisível",
    "desc": "O aprendiz pergunta: Como é que as maiores estruturas do mundo, como arranha-céus e pontes estendidas sobre oceanos, suportam o empurrão constante dos ventos sem caírem no chão?",
    "principal": "Arranha-céus de aço e betão, como o Burj Khalifa, são desenhados para oscilar mais de 1,5 metros no topo, libertando a energia do vento de forma segura!",
    "secreta1": "Por que ficam de pé? Toda a estrutura está numa eterna queda de braço invisível: a gravidade puxa as pedras implacavelmente para baixo, enquanto a rigidez dos materiais e as fundações respondem empurrando o exato mesmo peso para cima! Se der empate perfeito (Ação = Reação), a torre fica imóvel.",
    "secreta2": "Por que caem? Estruturas caem quando esse empate falha. A Torre de Pisa inclina-se porque o solo lamacento de um dos lados cedeu sob o peso das fundações, que não conseguiram empurrar a gravidade de volta com a mesma força.",
    "dica": "💡 Rigidez extrema racha e parte sob pressão. O segredo da engenharia moderna está na tolerância, na elasticidade programada e em bases sólidas.",
    "desafio": "Utiliza o painel à direita para testar a flexibilidade e oscilação de uma torre rúnica sob a ação do vento!",
    "fechamento": "O silêncio do edifício é, na verdade, uma dança de forças que empatam a cada milésimo de segundo."
  },
  "0.4": {
    "title": "🔑 0.4 — O Selo do Aprendiz",
    "subtitle": "A tua marca imutável no Mundo Borgestrável",
    "desc": "Para assinar os teus diários e as tuas futures pontes, deves forjar um selo pessoal na bigorna rúnica do reino. Quem és tu na hierarquia dos construtores?",
    "principal": "Os construtores das catedrais góticas esculpiam pequenas runas secretas de identificação em cada pedra para comprovar a autoria do trabalho!",
    "secreta1": "O que é ser um Engenheiro Mágico? Ser engenheiro é usar a física e a matemática como feitiços de verdade. Em vez de conjurar relâmpagos, utilizas a inteligência para canalizar forças gigantescas pelas vigas, mantendo as pessoas seguras e as cidades vivas!",
    "secreta2": "O Selo de Cera e Cinza: No Império Romano, os planos arquitetónicos oficiais eram chancelados com selos de cera misturada com finas cinzas vulcânicas, tornando o selo imutável e à prova de água do mar.",
    "dica": "💡 O brasão que esculpes na tua bigorna é a garantia de que as tuas pontes suportarão os exércitos e as tempestades.",
    "desafio": "Usa a bigorna rúnica à direita, digita o teu nome de mestre, escolhe o teu símbolo e forge o teu brasão!",
    "fechamento": "O selo de um construtor é a sua palavra gravada sobre a matéria."
  },
  "0.5": {
    "title": "🕰️ 0.5 — A Linha do Tempo Mágica",
    "subtitle": "Como evoluímos da cabana de gravetos ao titã de aço",
    "desc": "A engenharia é uma corrente de conhecimentos que atravessa as eras. Cada geração apoia-se nas costas dos construtores que vieram antes.",
    "principal": "As imponentes Catedrais Góticas da Idade Média demoravam mais de um século a erguer-se, atravessando gerações inteiras de mestres.",
    "secreta1": "O Hamster Humano: Os engenheiros romanos erguiam pedras monumentais de 3 toneladas usando o \"Polyspastos\" — um guindaste de madeira gigante onde escravos caminhavam no interior de uma roda de madeira para girar as polias!",
    "secreta2": "O Grande Salto do Ferro: Até ao século XVIII, pontes sobre rios profundos eram limitadas a pedra ou madeira. A Iron Bridge (Inglaterra, 1779) chocou o mundo como a primeira estrutura de ferro fundido, abrindo caminho para a era do aço.",
    "dica": "💡 Nunca desprezes os métodos antigos: a gravidade trabalha exatamente da mesma forma desde o Big Bang.",
    "desafio": "Desliza o tempo e clica nos monumentos para revelar os avanços dos materiais!",
    "fechamento": "Erguemo-nos mais alto porque subimos nos tijolos assentados pelos nossos antepassados."
  },
  "0.6": {
    "title": "🌍 0.6 — O Mundo Real Espiando",
    "subtitle": "Quatro monumentos reais revelados pelos portais mágicos",
    "desc": "Através destes portais, o nosso reino medieval conecta-se diretamente com o futuro. Observa como os conceitos que estudas sustentam colossos modernos de concreto e aço!",
    "principal": "Portais ativos revelando a Torre Eiffel, Golden Gate, Cristo Redentor e o lendário Coliseu de Roma!",
    "secreta1": "O Coliseu Inundado: A engenharia hidráulica romana era tão avançada que conseguia encher a arena do Coliseu com mais de 3,5 milhões de litros de água em poucas horas para simular batalhas navais reais com navios de verdade!",
    "secreta2": "O Laranja Contra a Neblina: A Golden Gate foi pintada com um laranja brilhante (\"International Orange\") não por capricho estético, mas para que os navios conseguissem detetar a ponte na densa neblina da baía.",
    "dica": "💡 A boa engenharia resolve problemas geográficos e de segurança com soluções elegantes e funcionalidade.",
    "desafio": "Toca nos 4 portais mágicos no simulador à direita para cruzar o limiar e ler as revelações de cada colosso!",
    "fechamento": "O concreto armado do presente é apenas a pedra filosofal que os antigos romanos já previam."
  },
  "0.7": {
    "title": "⚖️ 0.7 — O Empate Perfeito",
    "subtitle": "A eterna lição de que forças opostas criam a paz",
    "desc": "Como fazer com que as coisas fiquem quietas? Para que uma casa ou ponte permaneça em repouso absoluto, a soma de todas as forças que tentam derrubá-la ou puxá-la para baixo deve ser anulada pelas forças de reação.",
    "principal": "A estátua do Cristo Redentor mantém-se estável sob os ventos do Corcovado porque o seu centro de massa foi calculado milimetricamente para equilibrar os momentos.",
    "secreta1": "A Primeira Lei da Estrutura: Se aplicares uma carga de 10 toneladas sobre uma viga, as colunas de apoio devem empurrar exatamente as mesmas 10 toneladas de volta para o céu (F = 0). Se empurrarem menos, quebram. Se empurrarem mais, o prédio levita!",
    "secreta2": "A Força do Solo: As fundações não sustentam o edifício sozinhas. É a terra abaixo delas que deve ter força suficiente para suportar a pressão sem que as pedras afundem na areia.",
    "dica": "💡 No repouso de uma ponte reside o combate físico mais feroz que existe: o empate eterno entre a ação e a reação.",
    "desafio": "Adiciona pesos na nossa viga rúnica e equilibra com colunas de suporte até zerar o estresse no painel de balança!",
    "fechamento": "Uma estrutura perfeita é aquela onde o conflito físico termina num silêncio absoluto."
  },
  "0.8": {
    "title": "🧩 0.8 — Tudo é Feito de Peças",
    "subtitle": "A decomposição dos colossos estruturais",
    "desc": "Nenhum edifício gigante é esculpido num único bloco de pedra. Tudo o que vês no mundo — desde uma simples cabana até ao arranha-céus mais alto — é o encaixe ordenado de peças mais simples.",
    "principal": "Pontes romanas em arco resistem há mais de 2.000 anos sem uma única gota de cimento, apenas pelo encaixe perfeito das suas pedras sob pressão.",
    "secreta1": "A Runa Central do Arco: A pedra localizada no topo do arco romano é chamada de \"Pedra de Fecho\" (ou aduela de fecho). É ela que recebe as pressões das laterais e distribui o esforço para os pilares das extremidades.",
    "secreta2": "Modularidade Moderna: As pontes modernas são montadas como Legos gigantes, usando vigas pré-fabricadas em fôrmas industriais de altíssima precisão e levadas ao local por guindastes titânicos.",
    "dica": "💡 Se queres construir o impossível, divide o colosso em pequenas pedras que consigas carregar com as tuas próprias mãos.",
    "desafio": "Monta as pedras do arco rúnico romano no simulador e coloca a Pedra de Fecho para travar o sistema!",
    "fechamento": "Separadas, as pedras caem; encaixadas sob a pressão certa, suportam o próprio mundo."
  },
  "0.9": {
    "title": "🔮 0.9 — A Bola de Cristal do Engenheiro",
    "subtitle": "Prever o estresse interno da matéria antes que ela quebre",
    "desc": "Como podemos garantir que uma viga suportará o peso sem estalar ou deformar? Os engenheiros usam equações de feitiçaria matemática para espreitar o interior da matéria, sabendo exatamente onde ela sofrerá mais esforço.",
    "principal": "A engenharia moderna usa programas de simulação chamados \"Elementos Finitos\" para pintar o estresse interno das vigas com cores brilhantes na tela.",
    "secreta1": "Gaudí e as Maquetes Invertidas: Para projetar os arcos inclinados da Sagrada Família, o mestre Antoni Gaudí pendurava maquetes feitas de cordas e saquinhos de areia de cabeça para baixo! A gravidade gerava a curva de tração perfeita que ele invertia para criar arcos em compressão pura.",
    "secreta2": "A Cor do Perigo: Nas simulações visuais, o azul geralmente representa o material a ser esmagado (Compressão) e o vermelho brilhante representa o material a ser esticado até estalar (Tração).",
    "dica": "💡 Um bom engenheiro consegue enxergar as linhas de força invisíveis cruzando a viga antes mesmo do material reclamar.",
    "desafio": "Coloca cargas diferentes na viga e observa na nossa bola de cristal o espectro de tensões mudando de cor!",
    "fechamento": "Cálculo não é para decorar, é o par de óculos mágicos que nos deixa ver o invisível."
  },
  "1.1": {
    "title": "🧱 1.1 — Casas de Alvenaria",
    "subtitle": "Como as paredes de tijolos suportam o peso do lar",
    "desc": "Aprende como os pequenos blocos cerâmicos empilhados se apoiam uns nos outros para criar uma barreira rígida e protetora contra as forças exteriores.",
    "principal": "O tijolo de barro cozido é um dos materiais artificiais mais antigos criados pela humanidade, com vestígios que datam de 7000 a.C.!",
    "secreta1": "A Argamassa de Arroz: Na China imperial, os construtores misturavam sopa de arroz pegajoso com cal apagada para criar uma cola química super elástica que resiste a sismos e tempestades há séculos!",
    "secreta2": "Adobe Antigo: Se não cozesses o barro no forno, ele tornava-se adobe (seco apenas ao sol). Se houvesse uma cheia muito prolongada, a casa literalmente derretia de volta para a lama!",
    "dica": "💡 A alvenaria é incrível a suportar cargas verticais, mas péssima a aguentar empurrões de lado (forças horizontais). Precisa de pilares para se travar!",
    "fechamento": "De tijolo em tijolo erguem-se as muralhas que vencem o tempo."
  },
  "1.2": {
    "title": "🏗️ 1.2 — Torres de Concreto Armado",
    "subtitle": "O casamento de pedra líquida e garras de aço",
    "desc": "O concreto armado é a espinha dorsal das nossas metrópoles. Descobre como a flexibilidade do ferro se funde com a brutalidade do cimento.",
    "principal": "O betão (concreto) é o segundo material mais consumido no planeta Terra pelas sociedades humanas, sendo superado apenas pela água!",
    "secreta1": "O Jardineiro Visionário: O concreto armado não foi inventado por um engenheiro, mas sim por um jardineiro francês chamado Joseph Monier em 1867, que queria fazer vasos de flores que não partissem com o crescimento das raízes!",
    "secreta2": "Cinza Vulcânica Romana: O segredo do betão romano durar 2000 anos no mar é a reação química da \"pozzolana\" (cinza de vulcão), que cria cristais minerais que fecham as fendas espontaneamente.",
    "dica": "💡 O betão é a pedra artificial que suporta o esmagamento. O aço é o tendão elástico que evita que o betão trinque ao ser dobrado.",
    "fechamento": "Onde o betão cinzento deita raízes, o aço heróico segura o céu."
  },
  "1.3": {
    "title": "🪵 1.3 — Pontes de Madeira e Aço",
    "subtitle": "Caminhos rígidos que cruzam desfiladeiros selvagens",
    "desc": "A madeira foi a primeira a curvar-se para ligar duas margens. Agora, as treliças de metal e os cabos de suspensão fazem o milagre do vão livre.",
    "principal": "A geometria de triângulos nas pontes de treliça é usada porque o triângulo é a única forma geométrica que não se deforma sob carga!",
    "secreta1": "A Ponte de César sobre o Reno: Em apenas 10 dias, os legionários de Júlio César ergueram uma ponte de madeira monumental sobre um rio caudaloso só para mostrar poder, destruindo-a logo a seguir.",
    "secreta2": "Pontes de Massa: Estudantes de engenharia competem mundialmente construindo pontes feitas de esparguete cru e cola que chegam a aguentar mais de 300 kg de carga real!",
    "dica": "💡 A madeira avisa quando vai falhar (começa a estalar e fazer barulho). O aço suporta tensões extremas mas requer tratamentos contra a ferrugem.",
    "fechamento": "Tender caminhos sobre abismos é a expressão máxima da inteligência rúnica."
  },
  "1.4": {
    "title": "🪨 1.4 — Os Primeiros Construtores",
    "subtitle": "A engenharia animal inspirando os homens",
    "desc": "Antes do primeiro humano cavar fundações, a natureza já projetava as suas próprias represas e ninhos ultra-resistentes.",
    "principal": "As colossais represas construídas por castores podem desviar rios inteiros e criar ecossistemas aquáticos completamente novos!",
    "secreta1": "Visível do Espaço: A maior represa de castor do mundo fica no Canadá, tem mais de 850 metros de comprimento e foi descoberta através de fotografias de satélite!",
    "secreta2": "Ar Condicionado de Terra: Os cupins africanos constroem torres de argila de 8 metros com chaminés térmicas integradas que mantêm o interior fresco mesmo com calor desértico de 45°C.",
    "dica": "💡 Olhar para a natureza e copiar as suas soluções estruturais chama-se biomimética, a mais nobre escola de design.",
    "fechamento": "Toda a técnica é apenas a continuação dos segredos que a terra já sussurrava."
  },
  "1.5": {
    "title": "🏭 1.5 — A Fábrica de Peças",
    "subtitle": "Pré-fabricação e a montagem rápida de reinos",
    "desc": "Porque haveríamos de moldar tudo no meio da lama? A fabricação modular de vigas e lajes fora da obra acelera a conquista das alturas.",
    "principal": "Arranha-céus pré-fabricados modernos de 30 andares podem ser erguidos do chão em apenas 15 dias de montagem mecânica no local!",
    "secreta1": "Casas por Correio: Na década de 1920, era comum comprar casas inteiras modulares por catálogo. Recebias todas as tábuas e parafusos de comboio e montavas com os vizinhos!",
    "secreta2": "O Palácio de Cristal: Construído em Londres em 1851, foi o primeiro grande edifício modular do mundo, montado em tempo recorde usando apenas ferro fundido e vidro padronizados.",
    "dica": "💡 A precisão da fábrica evita falhas no canteiro de obras. Menos desperdício de material, maior controle de qualidade.",
    "fechamento": "Encaixar com exatidão é poupar tempo na forja do amanhã."
  },
  "1.6": {
    "title": "🌱 1.6 — Construções Vivas",
    "subtitle": "A simbiose entre as plantas e as colunas de metal",
    "desc": "Os edifícios do futuro não são blocos estéreis. Eles respiram, purificam o ar e até regeneram as suas próprias fendas minerais.",
    "principal": "O concreto auto-regenerativo contém esporos de bactérias dormentes que acordam com a humidade de uma fissura e geram calcário para curar a racha!",
    "secreta1": "Pontes de Raízes Vivas: Na floresta tropical de Meghalaya, na Índia, a tribo Khasi treina raízes de ficus vivas sobre rios para criar pontes naturais que ficam mais fortes à medida que a árvore envelhece.",
    "secreta2": "Arquitetura Esponja: Cidades-esponja usam pavimentos permeáveis e fachadas verdes que conseguem absorver até 80% das águas das chuvas para evitar inundações urbanas.",
    "dica": "💡 Integrar a vida vegetal na fachada ajuda a resfriar o edifício naturalmente, poupando energia mágica de climatização.",
    "fechamento": "A estrutura perfeita não combate o ecossistema; ela vive nele."
  },
  "2.1": {
    "title": "📏 2.1 — A Régua Mágica",
    "subtitle": "A busca da exatidão dimensional das coisas",
    "desc": "Antes de calcular uma força, deves saber exatamente onde ela atua. A medição precisa impede que as colunas fiquem desalinhadas no espaço.",
    "principal": "No antigo Egito, a unidade padrão de comprimento era o côvado real, medido pelo braço do Faraó!",
    "secreta1": "Mudou o Rei, Corta a Régua: Quando um novo Faraó subia ao trono, todas as réguas de madeira do império tinham de ser recalibradas pelo comprimento do seu novo antebraço.",
    "secreta2": "A Polegada de Três Grãos: Em 1324, o rei Eduardo II de Inglaterra decretou que uma polegada oficial correspondia ao comprimento de exatamente três grãos de cevada secos postos em fila.",
    "dica": "💡 Um milímetro de desvio no topo de uma coluna pode causar toneladas de momento fletor indesejado na base. Mede três vezes, corta uma!",
    "fechamento": "A régua divide o domínio da física e o desastre do colapso."
  },
  "2.2": {
    "title": "🌬️ 2.2 — O Peso Invisível",
    "subtitle": "Pressão atmosférica, gravidade e ventos de cisalhamento",
    "desc": "O ar parece leve, mas em massa gigante torna-se uma muralha em movimento que empurra as fachadas dos nossos arranha-céus.",
    "principal": "O ar acima de ti exerce uma força de aproximadamente 10 toneladas por cada metro quadrado de solo, mas não és esmagado porque tens a mesma pressão dentro do corpo!",
    "secreta1": "Os Cavalos de Magdeburg: Em 1654, duas esferas vazias de ar foram unidas apenas pela pressão exterior. Nem dois grupos de 8 cavalos a puxar em direções opostas conseguiram separá-las!",
    "secreta2": "Pontes na Lua: Se construísses uma ponte de pedra na Lua, ela aguentaria 6 vezes mais carga do que na Terra, pois a gravidade lá atrai as massas com muito menos força.",
    "dica": "💡 Prédios altos são como asas de avião verticais; o vento cria pressões e sucções gigantescas nas suas janelas laterais.",
    "fechamento": "As forças que os olhos não veem são as que exigem maior cautela do construtor."
  },
  "2.3": {
    "title": "💔 2.3 — O Ponto de Ruptura",
    "subtitle": "A fronteira final da resistência mecânica",
    "desc": "Todos os materiais do universo têm um limite onde as ligações atómicas simplesmente se rompem. Descobre como prever esse momento fatal.",
    "principal": "O vidro comum aguenta pressões de esmagamento gigantescas, mas estala imediatamente à mínima força de torção ou tração!",
    "secreta1": "A Explosão Silenciosa: Painéis de vidro temperado podem explodir espontaneamente anos após a montagem devido a dilatações térmicas de impurezas microscópicas de sulfeto de níquel.",
    "secreta2": "Dúctil vs Frágil: Materiais como o aço dobram-se muito antes de partir (dúcteis), dando tempo de salvar vidas. Materiais como o vidro ou gesso quebram de surpresa (frágeis).",
    "dica": "💡 Nunca uses materiais frágeis em elementos que sofrem flexão pura sem um reforço dúctil integrado no interior.",
    "fechamento": "Mapear a falha é desenhar o limite seguro da sobrevivência."
  },
  "2.4": {
    "title": "🧭 2.4 — A Bússola das Direções",
    "subtitle": "Vetores mecânicos e a canalização de forças",
    "desc": "Uma força não é apenas um peso; ela tem uma direção e um sentido. Desviar vetores é o truque de mágica favorito dos arquitetos.",
    "principal": "Os antigos arquitetos de catedrais inclinavam os pilares exteriores para interceptar as linhas diagonais de força dos arcos internos!",
    "secreta1": "Cantos Redondos Salvadores: Prédios aerodinâmicos com cantos arredondados desviam o vento de forma suave, reduzindo em até 30% a força total de arrasto horizontal.",
    "secreta2": "Pontes Rotativas: Algumas pontes rodoviárias não sobem; giram lateralmente sobre um pilar central para desviar o caminho e dar passagem aos mastros dos navios.",
    "dica": "💡 Um vetor diagonal pode ser decomposto em duas forças: uma vertical (que vai para o chão) e outra horizontal (que tenta abrir a parede).",
    "fechamento": "A força sem rumo destrói; o vetor direcionado ampara."
  },
  "2.5": {
    "title": "⏳ 2.5 — O Tempo da Força",
    "subtitle": "Cargas estáticas permanentes e o impacto dinâmico",
    "desc": "Um peso aplicado suavemente é diferente de um golpe rápido. O tempo de atuação de uma força altera completamente a resposta da matéria.",
    "principal": "O concreto líquido leva 28 dias após ser deitado nas fôrmas para atingir a resistência de projeto oficial, mas continua a endurecer durante décadas!",
    "secreta1": "Argamassa Medieval: Algumas pontes de pedra europeias usavam argamassas tão lentas a secar que a estrutura só assentava por completo 100 anos após o término da obra.",
    "secreta2": "Velocidade Assassina: Se deixares cair uma colher de metal de uma torre alta, ela perfura o teto de um carro devido à aceleração da gravidade transformada em força de impacto.",
    "dica": "💡 Cargas vivas que se movem rápido causam vibrações na estrutura. É preciso amortecer para evitar ressonâncias perigosas.",
    "fechamento": "A paciência da matéria vence a impetuosidade do impacto."
  },
  "2.6": {
    "title": "🔬 2.6 — O Laboratório do Aprendiz",
    "subtitle": "Testar maquetes para garantir o sucesso dos gigantes",
    "desc": "Antes de erguer a torre de 100 metros, testa-se a maquete na mesa de vibração do laboratório para observar o fluxo das fendas virtuais.",
    "principal": "Os túneis de vento modernos usam réplicas em miniatura de bairros inteiros para ver como os novos arranha-céus alteram as correntes de ar na rua!",
    "secreta1": "Maquete de Destruição: Para testar grandes barragens de betão, os cientistas constroem secções gigantes das paredes em escala real e esmagam-nas com prensas hidráulicas colossais.",
    "secreta2": "Mesas Sísmicas: Plataformas hidráulicas gigantes sacodem modelos de edifícios inteiros para certificar que os sistemas flexíveis aguentam sismos de grau 9.",
    "dica": "💡 Um erro detetado no modelo virtual ou de madeira custa uns trocos de cobre. Um erro na obra real custa o colapso do reino.",
    "fechamento": "No pequeno teste esconde-se o triunfo da grande obra."
  },
  "3.1": {
    "title": "🩸 3.1 — O Elo Secreto (Tendões)",
    "subtitle": "Como as conexões e os nós estabilizam as treliças",
    "desc": "Nenhuma viga trabalha sozinha. Os tendões mecânicos e os nós de união transferem os esforços de tração e compressão por toda a teia rígida.",
    "principal": "Os nós geométricos de uma treliça metálica convertem momentos complexos em forças puras de puxar ou empurrar pelas barras!",
    "secreta1": "Kigumi Japonesa: Os carpinteiros tradicionais japoneses criavam templos sagrados de cinco andares sem um único prego ou parafuso de metal, usando encaixes de madeira que travam com o sismo.",
    "secreta2": "Os Rebites de Eiffel: A Torre Eiffel foi montada com 2,5 milhões de rebites de ferro aplicados ao rubro. Ao arrefecer, o ferro contraiu-se, apertando as peças com pressões brutais.",
    "dica": "💡 Pensa nos cabos de aço como os tendões do corpo: eles não aguentam compressão (ficam frouxos), mas suportam trações colossais.",
    "fechamento": "O elo forte distribui a força; o nó firme une o esqueleto."
  },
  "3.2": {
    "title": "🌀 3.2 — A Lei da Reação",
    "subtitle": "Ação e reação no combate eterno contra o solo",
    "desc": "Se o prédio empurra o solo para baixo, o solo tem de ter energia rúnica suficiente para empurrar o prédio de volta com a mesma força exata.",
    "principal": "Quando dás um passo na terra, o planeta inteiro empurra a sola do teu pé com a exata mesma força para cima que fazes para baixo!",
    "secreta1": "O Coice da Catapulta: As catapultas medievais precisavam de estacas de retenção profundas na terra para evitar que a traseira do chassis levantasse voo com o coice de reação.",
    "secreta2": "Prédios de Ventosa: Em zonas de vento de furacão, as coberturas das casas são presas ao solo com tirantes profundos para evitar que a sucção do ar arranque o telhado como uma asa.",
    "dica": "💡 O equilíbrio estático exige que a soma de todas as forças verticais e reações das fundações resulte em zero absoluto.",
    "fechamento": "Empurra a terra com sabedoria, e ela amparará os teus pés."
  },
  "3.3": {
    "title": "⚙️ 3.3 — A Régua Universal",
    "subtitle": "Densidade e o cálculo do peso próprio das coisas",
    "desc": "Um cubo de madeira não pesa o mesmo que um cubo de ferro. Dominar a densidade das substâncias é crucial para não sobrecarregar as colunas.",
    "principal": "O aço estrutural é incrivelmente denso: um metro cúbico deste metal pesa 7,8 toneladas, enquanto o mesmo volume de água pesa apenas 1 tonelada!",
    "secreta1": "Barcos de Concreto: Durante as guerras mundiais, devido à escassez de aço, foram construídos cargueiros inteiros feitos de concreto armado que flutuavam graças ao volume de água deslocado.",
    "secreta2": "O Fumo Sólido: O aerogel de grafeno é tão incrivelmente leve que pode ser apoiado em cima das pétalas de uma rosa viva sem as dobrar ou danificar.",
    "dica": "💡 Metade do esforço de uma coluna é apenas para aguentar o próprio peso do prédio acima dela. Leveza com resistência é o Santo Graal.",
    "fechamento": "A balança justa equilibra a matéria densa e a geometria leve."
  },
  "3.4": {
    "title": "🧪 3.4 — A Poção da Elasticidade",
    "subtitle": "A Lei de Hooke e o limite elástico dos metais",
    "desc": "O aço é como uma mola gigante. Desde que não puxes demasiado, ele deforma-se sob o peso e volta sempre ao tamanho original.",
    "principal": "O aço estrutural é um dos materiais mais elásticos do mundo, deformando-se linearmente em proporção exata à força aplicada!",
    "secreta1": "Relógio de Fita: Os primeiros relógios de bolso medievais funcionavam graças a fitas elásticas de metal espiraladas que libertavam torque constante de rotação.",
    "secreta2": "Fadiga do Elástico: Se esticares demasiado um elástico, ultrapassas o seu \"ponto de cedência\" e ele fica frouxo para sempre. O mesmo acontece às vigas metálicas sobrecarregadas.",
    "dica": "💡 Garante sempre que as tensões de serviço do teu projeto ficam bem abaixo do limite de proporcionalidade elástica do material.",
    "fechamento": "Dobrar-se com honra para recuperar a postura é a dança da estabilidade."
  },
  "3.5": {
    "title": "🪞 3.5 — O Espelho das Forças",
    "subtitle": "A simetria espacial e a partilha justa de cargas",
    "desc": "Se o teu prédio for simétrico, o peso divide-se de forma idêntica entre as colunas esquerda e direita, trazendo paz imediata ao esqueleto.",
    "principal": "Estruturas simétricas anulam naturalmente os momentos laterais de rotação, facilitando a vida aos construtores!",
    "secreta1": "O Desafio Assimétrico: Edifícios modernos curvos ou inclinados (como o Museu de Bilbau) exigem computadores avançados para calcular o desvio do centro de gravidade.",
    "secreta2": "O Peso da Lança: Se uma estátua medieval segurar uma alabarda comprida num braço, a perna oposta tem de contrair os seus músculos estruturais com o dobro do estresse.",
    "dica": "💡 Se o projeto exigir assimetria, compensa adicionando contra-pesos ou fundações mais largas do lado mais carregado.",
    "fechamento": "Na partilha igual de deveres estruturais reside a estabilidade do reino."
  },
  "3.6": {
    "title": "🗝️ 3.6 — A Chave-Mestra",
    "subtitle": "Alavancas, momentos e o binário de forças",
    "desc": "A força não se mede apenas em kg, mas sim na distância que ela está do apoio. O momento fletor é o pior pesadelo do iniciante.",
    "principal": "O filósofo Arquimedes exclamou: \"Dêem-me uma alavanca e um ponto de apoio, e eu moverei a Terra inteira!\"",
    "secreta1": "O Guindaste dos Imperadores: Os romanos erguiam blocos de 5 toneladas usando polias multiplicadoras de força ativadas por escravos que caminhavam em rodas gigantes.",
    "secreta2": "O Segredo da Chave de Rodas: É muito mais fácil desapertar o parafuso enferrujado de um carro se alongares o braço da chave, pois geras um momento de rotação muito maior com o mesmo esforço.",
    "dica": "💡 Momento é igual a Força multiplicada pela Distância. Vigas longas sem apoios intermédios geram momentos massivos nas paredes de fixação.",
    "fechamento": "A distância multiplica a força; o mestre domina o braço da alavanca."
  },
  "4.1": {
    "title": "😠 4.1 — O \"Stress\" (Tensão)",
    "subtitle": "Força dividida pela área da secção transversal",
    "desc": "Tensão é a medida do estresse que as moléculas sentem ao ser espremidas. Pensa nisto como a densidade da força dentro do material.",
    "principal": "Uma mulher a caminhar com sapatos de salto agulha exerce mais pressão sobre o pavimento do que um elefante de 4 toneladas apoiado nas suas quatro patas largas!",
    "secreta1": "Estresse Rúnico Programado: Vidros de carros são temperados de forma a terem tensões internas constantes. Se bateres neles, fragmentam-se em pequenos cubos inofensivos em vez de lançar lâminas afiadas.",
    "secreta2": "O Ponto Fraco do Couro: Correntes de suspensão falham nas curvas dos elos onde a área útil de metal é menor, concentrando ali todo o estresse molecular.",
    "dica": "💡 Para acalmar o estresse molecular do teu material, aumenta a área útil da viga ou engrossa a coluna.",
    "fechamento": "A tensão é o clamor microscópico da matéria sob pressão."
  },
  "4.2": {
    "title": "🥨 4.2 — Mudar de Forma (Deformação)",
    "subtitle": "Alongamentos e encurtamentos microscópicos",
    "desc": "Tudo no universo se deforma quando pressionado. Até a rocha mais sólida do castelo encolhe alguns micrómetros sob o peso das ameias.",
    "principal": "Todas as estruturas de concreto ou aço deformam-se ligeiramente sob cargas comuns, mesmo que essa mudança seja imperceptível à vista desimpedida!",
    "secreta1": "O Prédio que Encolhe: Torres de escritórios muito altas feitas de betão chegam a encolher até 5 centímetros nos primeiros 3 anos após a cura completa do material!",
    "secreta2": "A Cedência Plástica: Se ultrapassares a zona de deformação elástica, o aço deforma-se plasticamente de forma irreversível, esticando como plasticina até romper.",
    "dica": "💡 Desenha as estruturas para terem deformações dentro de limites controláveis para evitar rachas em tetos e vidros de janelas.",
    "fechamento": "Ceder com elegância é o truque de mágica que afasta a rutura fria."
  },
  "4.3": {
    "title": "🦹 4.3 — Os 5 Super Vilões",
    "subtitle": "Tração, compressão, flexão, torção e cisalhamento",
    "desc": "Estes são os cinco demónios da física que tentam partir e rasgar as vigas e os pilares das nossas fortificações.",
    "principal": "Qualquer colapso estrutural no planeta Terra é causado por um destes cinco esforços elementares ou pela sua perigosa combinação!",
    "secreta1": "A Tragédia de Tacoma Narrows: Em 1940, o vento forte criou forças de torção harmónica que fizeram uma ponte de aço oscilar como um tapete em movimento até se desfazer em pedaços.",
    "secreta2": "Cisalhamento de Cisne: O cisalhamento é a força que tenta rasgar uma secção paralela à outra, como o corte limpo de uma guilhotina.",
    "dica": "💡 Identifica qual vilão está ativo em cada secção da viga para escolheres a armadura de aço correta para o teu betão.",
    "fechamento": "Os cinco demónios do colapso vigiam as fraquezas da tua fundação."
  },
  "4.4": {
    "title": "😴 4.4 — A Fadiga do Herói",
    "subtitle": "Como as vibrações repetidas cansam o metal",
    "desc": "O aço pode aguentar uma força gigante de uma vez, mas racha sob forças pequeninas se essas forças forem aplicadas e retiradas milhões de vezes.",
    "principal": "Consegues quebrar um clipe de arame de papel muito facilmente apenas dobrando-o repetidas vezes para a frente e para trás com os dedos!",
    "secreta1": "O Cansaço dos Eixos: O desastre de Versalhes em 1842, que matou dezenas de passageiros, ocorreu porque o eixo de ferro de uma locomotiva rachou por fadiga interna indetetável.",
    "secreta2": "Vento Vibratório: Pontes estaiadas sofrem fadiga nos seus cabos devido à vibração harmónica causada pelas pequenas rajadas de vento do dia-a-dia.",
    "dica": "💡 Evita cantos retos em peças metálicas sujeitas a vibrações; os cantos arredondados suavizam o fluxo de estresse e evitam o início de fendas.",
    "fechamento": "Até as pedras mais duras se cansam se o combate se repetir sem tréguas."
  },
  "4.5": {
    "title": "🛡️ 4.5 — O Fator de Segurança",
    "subtitle": "Multiplicar a resistência para salvaguardar vidas",
    "desc": "Nunca desenhamos uma viga mesmo no limite da força. Adicionamos uma margem generosa de segurança para absorver tempestades e erros humanos.",
    "principal": "Os cabos dos elevadores de passageiros modernos são calculados para aguentar até dez vezes o peso máximo permitido na cabine!",
    "secreta1": "Olho por Olho na Babilónia: No famoso Código de Hamurabi, se um edifício desabasse e matasse o filho do proprietário, o próprio filho do construtor era executado!",
    "secreta2": "Segurança Aeroespacial: Ao contrário dos edifícios, os foguetões têm fatores de segurança baixos (como 1.25) para economizar massa, exigindo tolerâncias de fabrico milimétricas.",
    "dica": "💡 Em obras civis, usamos fatores entre 1.4 (para peso próprio conhecido) e 2.0 (para cargas variáveis como ventos e multidões imprevisíveis).",
    "fechamento": "A margem do sábio protege o repouso do inocente."
  },
  "4.6": {
    "title": "🥋 4.6 — Poderes Diferentes por Material",
    "subtitle": "A liga metálica, a pedra antiga e as fibras modernas",
    "desc": "Cada material tem uma personalidade estrutural. A pedra adora ser esmagada; a madeira é flexível e leve; o aço resiste a tudo.",
    "principal": "O concreto armado é excelente a compressão; o aço heróico resiste à tração; a madeira macia amortece choques e vibrações.",
    "secreta1": "Fios de Seda Estruturais: A teia de aranha natural é, em proporção de peso, 5 vezes mais resistente do que o aço e mais elástica do que o nylon de alta densidade.",
    "secreta2": "Fibra de Carbono Arcana: Tecidos de carbono são aplicados como adesivos em pontes de pedra antigas para multiplicar a sua resistência sem acrescentar peso morto à estrutura.",
    "dica": "💡 Conhecer a fobia de cada material evita desastres: nunca uses pedra ou concreto puro para segurar forças de tração diagonal.",
    "fechamento": "Cada material guarda uma runa de força; o mestre combina as suas naturezas."
  },
  "5.1": {
    "title": "⚖️ 5.1 — A Regra da Estátua (Equilíbrio)",
    "subtitle": "Soma de forças e momentos igual a zero",
    "desc": "A primeira regra de ouro da engenharia civil é que a estrutura deve ficar parada! Nenhum movimento horizontal, vertical ou rotação é permitido.",
    "principal": "Um guindaste de torre equilibra-se graças a um contrapeso na traseira, calculado para anular exatamente o momento gerado pela carga suspensa na ponta da lança — se a carga for pesada demais, o equilíbrio falha e o guindaste tomba!",
    "secreta1": "O Centro de Massa Sagrado: A Torre de Pisa inclina-se assustadoramente, mas não cai porque o seu vetor de peso total ainda aterra dentro do perímetro de suporte do seu solo.",
    "secreta2": "Boneco Teimoso: Brinquedos que se levantam sozinhos usam uma base semi-esférica super pesada que coloca o centro de gravidade no ponto mais baixo possível, forçando o equilíbrio.",
    "dica": "💡 Para equilibrar momentos, lembra-te que a força rotacional de um lado do apoio deve ser anulada pela força do lado contrário.",
    "fechamento": "A imobilidade é o estado de paz mecânica que anula o peso do mundo."
  },
  "5.2": {
    "title": "💨 5.2 — Os Inimigos (Forças)",
    "subtitle": "Mapeamento de cargas móveis, ventos e terramotos",
    "desc": "Quem tenta derrubar o nosso castelo? Mapear as cargas móveis e as forças da natureza é o passo inicial de qualquer dimensionamento.",
    "principal": "Pontes urbanas têm de suportar não apenas o peso próprio das suas vigas, mas também a carga dinâmica de milhares de camiões em andamento!",
    "secreta1": "O Peso da Neve Alquímica: Em climas frios, a inclinação dos telhados é rigorosamente calculada para que a neve acumulada escorregue antes de esmagar as vigas de madeira.",
    "secreta2": "Liquefação do Solo: Durante sismos violentos, solos arenosos húmidos podem perder toda a rigidez e comportar-se como água, engolindo edifícios inteiros de surpresa.",
    "dica": "💡 Cargas mortas são permanentes (peso próprio); cargas vivas são temporárias (pessoas, móveis, vento). Mapeia ambas com rigor.",
    "fechamento": "Enxergar o inimigo invisível é a primeira virtude do bom construtor."
  },
  "5.3": {
    "title": "👟 5.3 — Os Pés no Chão (Apoios)",
    "subtitle": "Apoios articulados, roletes e o engaste perfeito",
    "desc": "Como a nossa viga toca as colunas? A forma como amarramos as extremidades determina como o esqueleto do prédio descarrega as tensões.",
    "principal": "Um engaste perfeito bloqueia todos os movimentos e rotações (como um poste de iluminação profundamente engatado no betão do passeio)!",
    "secreta1": "Pontes sobre Patins: Grandes viadutos de auto-estrada apoiam-se em blocos de borracha espessa (neoprene) para permitir que a ponte dilate com o sol do verão sem rachar os pilares.",
    "secreta2": "Fundações Isoladas: Arranha-céus modernos no Japão assentam sobre colossais molas de aço e sistemas hidráulicos que isolam o edifício das vibrações do solo.",
    "dica": "💡 Apoios articulados deixam a viga girar ligeiramente, reduzindo as tensões internas nos pilares de sustentação.",
    "fechamento": "A flexibilidade do pé garante a estabilidade do topo."
  },
  "5.4": {
    "title": "🌉 5.4 — Vãos e Vigas",
    "subtitle": "A distância horizontal e a deflexão central",
    "desc": "Quanto maior o espaço entre duas colunas, mais a viga central vai vergar com o peso. Aprende a controlar a deflexão geométrica.",
    "principal": "O momento fletor gerado no centro de uma viga suspensa cresce de forma quadrática em proporção direta à distância do vão livre!",
    "secreta1": "O Recorde do Vão Suspenso: A ponte de Çanakkale na Turquia possui o maior vão livre central do planeta, sustentando mais de 2 quilómetros de estrada sem pilares de apoio na água!",
    "secreta2": "O Perfil em I: Vigas de metal têm o formato da letra I porque o estresse de dobrar concentra-se todo no topo (compressão) e na base (tração), permitindo esvaziar o miolo para poupar aço.",
    "dica": "💡 Se dobrares a distância entre os pilares de suporte, a deflexão (barriga) no centro da viga aumenta 16 vezes!",
    "fechamento": "Estender caminhos sobre o vazio é triunfar sobre a gravidade."
  },
  "5.5": {
    "title": "🎒 5.5 — Cargas Vivas vs Cargas Mortas",
    "subtitle": "O peso do próprio corpo contra a carga da vida útil",
    "desc": "O esqueleto estrutural tem de carregar duas coisas: o peso dos seus próprios materiais pesados e a carga mutável das pessoas que o habitam.",
    "principal": "O peso próprio de uma grande catedral de pedra representa mais de 90% de toda a carga vertical que as suas fundações suportam!",
    "secreta1": "O Peso da Sabedoria: Engenheiros de bibliotecas públicas usam fatores de carga viva especiais porque o papel prensado de milhares de livros guardados pesa muito mais do que mobiliário comum.",
    "secreta2": "A Ressonância de Multidões: Se milhares de pessoas saltarem ao mesmo ritmo num concerto de música, criam forças de impacto repetidas que podem destruir uma bancada de estádio.",
    "dica": "💡 Para aliviar o esqueleto, tenta usar divisórias de parede leves (como gesso cartonado) no interior do teu edifício.",
    "fechamento": "O esqueleto ergue a matéria própria para poder acolher com segurança o sopro da vida."
  },
  "5.6": {
    "title": "🦴 5.6 — Osso Extra de Segurança",
    "subtitle": "Redundância hiperestática contra colapsos repentinos",
    "desc": "O que acontece se uma coluna falhar na batalha? Um bom esqueleto tem caminhos alternativos para as forças fugirem sem que o prédio caia.",
    "principal": "Sistemas hiperestáticos têm redundância mecânica: se um elemento de suporte for destruído, os vizinhos absorvem a carga imediatamente!",
    "secreta1": "O Exemplo das Torres Gémeas: No terrível impacto inicial de 2001, as torres não caíram na hora porque as suas colunas de fachada eram unidas por uma malha de aço hiperestática que desviou o peso do topo.",
    "secreta2": "O Perigo Isostático: Pontes apoiadas de forma simples não têm redundância. Se partires uma única coluna de apoio, a viga cai no abismo no mesmo milésimo de segundo.",
    "dica": "💡 Cria sempre ligações hiperestáticas em vigas contínuas; dá segurança e margem de tempo crucial em caso de acidente.",
    "fechamento": "Vários caminhos para as forças garantem o repouso do esqueleto rúnico."
  },
  "6.1": {
    "title": "⚔️ 6.1 — A Batalha Final",
    "subtitle": "O teste de esforço derradeiro das nossas metrópoles",
    "desc": "Músculos (Materiais) e Esqueletos (Análise) unem-se no combate contra os cinco super-vilões mecânicos sob uma tempestade simulada.",
    "principal": "A boa engenharia é a conciliação perfeita entre a espessura do pilar, a resistência do betão e o percurso dos vetores de força!",
    "secreta1": "A Queda das Catedrais: A abóbada gótica de Beauvais ruiu em 1284 porque os mestres forçaram vãos demasiado largos com colunas finas que cederam sob a flexão do vento.",
    "secreta2": "O Pêndulo de Taipé: A torre Taipei 101 usa um pêndulo gigante de aço dourado de 660 toneladas no topo para contrariar os ventos de tufões e tremores de terra.",
    "dica": "💡 Na fusão dos dois reinos, lembra-te: a forma do esqueleto deve amparar o limite elástico do teu músculo molecular.",
    "fechamento": "Na aliança das partes ergue-se o colosso que nenhuma força vergará."
  },
  "6.2": {
    "title": "🤝 6.2 — O Selo dos Dois Reinos",
    "subtitle": "A chancela oficial da estabilidade e resistência",
    "desc": "O teu selo de Engenheiro Mágico gravado na pedra atesta a segurança do projeto. Assinar a obra é um pacto de honra e integridade.",
    "principal": "O carimbo de um engenheiro habilitado nos planos oficiais assume total responsabilidade jurídica e moral pela estabilidade das vidas no edifício!",
    "secreta1": "O Teste do Construtor Medievo: Nos tempos antigos, o mestre de obras era obrigado a colocar-se debaixo do arco de pedra quando os andaimes eram retirados, provando a estabilidade com a própria vida.",
    "secreta2": "Chancelas de Cera: No império de Bizâncio, os projetos hidráulicos levavam selos de chumbo e cera para atestar que os canos de pressão aguentariam a força da água das montanhas.",
    "dica": "💡 Assinar um projeto sem verificar pessoalmente as armaduras de aço é o maior crime que um engenheiro pode cometer.",
    "fechamento": "A palavra gravada do mestre dá estabilidade ao reino dos homens."
  },
  "6.3": {
    "title": "🎓 6.3 — O Diploma do Engenheiro Mágico",
    "subtitle": "A sagração oficial do aprendiz a mestre arquiteto",
    "desc": "Receber o diploma de mestre é o reconhecimento de que dominas a matemática celeste e os segredos profundos da física dos sólidos.",
    "principal": "A primeira escola formal de Engenharia Civil do mundo (École des Ponts et Chaussées) foi fundada em Paris no ano de 1747!",
    "secreta1": "O Anel de Ferro de Ritual: No Canadá, os engenheiros recém-formados recebem um anel de ferro simples feito com as vigas de uma ponte que colapsou devido a erro de cálculo, lembrando a responsabilidade.",
    "secreta2": "O Título Imperial: No Brasil de D. Pedro II, os primeiros graduados de engenharia militar recebiam espadas cerimoniais com réguas gravadas a ouro na lâmina.",
    "dica": "💡 O diploma abre as portas do reino, mas é a tua humildade e atenção no canteiro de obras diário que te transformará num verdadeiro mestre.",
    "fechamento": "A fundação do saber é o diploma; a tua catedral ergue-se todos os dias."
  },
  "6.4": {
    "title": "🏙️ 6.4 — A Cidade Completa",
    "subtitle": "Cidades inteligentes, infraestruturas e vias elevadas",
    "desc": "Nenhum edifício vive sozinho. Ruas, pontes, redes de água e saneamento trabalham juntas para manter o grande reino habitável e saudável.",
    "principal": "Uma metrópole funcional é uma criatura viva, onde os viadutos são as artérias e os canos de água são os tendões de abastecimento!",
    "secreta1": "A Higiene de Pompeia: A cidade romana de Pompeia tinha passadeiras de pedra elevadas nas estradas para que as pessoas cruzassem as ruas sem tocar na água suja e canos de chumbo sob os passeios.",
    "secreta2": "Metrópoles Flutuantes: Existem planos contemporâneos para criar bairros modulares flutuantes ancorados que sobem e descem conforme a maré dos oceanos, adaptando-se às alterações do clima.",
    "dica": "💡 Desenha as estruturas pensando sempre em como as redes de energia, água e tráfego se vão conectar sem danificar as vigas de suporte.",
    "fechamento": "A grande cidade é o mosaico harmonioso onde as pedras individuais se amparam mutuamente."
  },
  "6.5": {
    "title": "🧠 6.5 — O Desafio do Mestre",
    "subtitle": "Resolver imprevistos complexos no canteiro de obras",
    "desc": "A teoria é limpa, mas a lama da obra traz surpresas. O verdadeiro engenheiro destaca-se quando resolve crises inesperadas na fundação.",
    "principal": "A capacidade de improvisar soluções seguras e rápidas com base em princípios físicos puros é o que separa um calculista de um mestre de obras!",
    "secreta1": "Desencalhar com a Lua: Quando um navio cargueiro gigante bloqueou o Canal de Suez em 2021, os engenheiros calcularam a força de maré gerada pela lua cheia ao minuto para ajudar a soltar a quilha.",
    "secreta2": "Congelar a Terra: Ao escavar túneis de metro sob monumentos históricos de Londres, os engenheiros injetam nitrogénio líquido para congelar a humidade do solo, tornando a areia firme até o concreto secar.",
    "dica": "💡 Se o solo ceder de surpresa na tua obra, suspende as cargas secundárias e reforça a base com estacas de injeção de betão sob pressão.",
    "fechamento": "O obstáculo inesperado é a bigorna onde se forja a verdadeira perícia."
  },
  "6.6": {
    "title": "🌟 6.6 — O Salão da Fama",
    "subtitle": "Os gigantes da história da mecânica e da construção",
    "desc": "Presta homenagem aos heróis do passado que rasgaram os céus com as suas estruturas, legando as equações matemáticas que amparam o nosso presente.",
    "principal": "O salão da fama guarda os nomes e as fórmulas dos colossos que provaram que o intelecto humano molda a força bruta da matéria!",
    "secreta1": "A Mulher que Ergueu o Brooklyn: Emily Roebling assumiu o cargo de engenheira chefe de campo da Ponte de Brooklyn durante 11 anos quando o seu marido adoeceu, negociando com industriais e dominando a matemática de cabos de suspensão.",
    "secreta2": "Cozinhando Concreto: O cimento moderno (Portland) foi patenteado em 1824 por Joseph Aspdin, um pedreiro inglês que cozia misturas de calcário e argila no fogão de ferro da cozinha da sua casa!",
    "dica": "💡 Estuda as pontes de Robert Maillart e os arcos de fita fina de concreto para entenderes como as curvas geométricas puras economizam material e criam arte.",
    "fechamento": "Caminhamos sobre a terra com segurança porque subimos nos ombros dos colossos do passado."
  }
};

// Crônica fundadora do mundo (lore narrativa) — origem: Base44
const CRONICA_FUNDADORA = "O IMPÉRIO DO ESQUELETO INVISÍVEL - Crônicas da Grande Aliança Estrutural\n\nO Portal de Entrada — A Porta Índigo\nNenhum viajante chega ao Império das Estruturas sem antes atravessar o Portal Índigo. Dizem os antigos manuscritos que esta passagem não foi construída por mãos humanas, mas descoberta. Ela existe no limite entre a imaginação e a matéria, entre aquilo que um homem sonha construir e aquilo que o mundo permite permanecer de pé.\n\"Toda grande obra começa como uma ideia frágil na mente de alguém. A engenharia é a arte de convencer essa ideia a sobreviver no mundo real.\"\n\nO Vilarejo dos Sistemas Construtivos — Onde os Sonhos Ganham Forma\nSão os mestres das ferramentas, das técnicas e dos métodos. Sabem como uma pedra percorre até se tornar uma muralha. \"Nenhuma torre nasce no céu. Antes de tocar as nuvens, ela precisa aprender a existir no chão.\"\n\nO Condado de MecTec — A Cidade dos Comerciantes das Forças Invisíveis\nOs habitantes de MecTec negociam forças. Comercializam conhecimento sobre equilíbrio, movimento, energia e interação. Descobriram que uma ponte não permanece firme por vontade própria — ela existe porque milhares de forças invisíveis travam uma batalha silenciosa em seu interior.\n\nO Reino dos Tendões — Mecânica dos Sólidos\nPara eles, toda estrutura é um organismo. A madeira possui fibras como tendões. A pedra possui resistência como ossos antigos. O aço possui uma força semelhante à de criaturas forjadas no fogo. \"Conhecer uma força é inútil se você não conhece o corpo que a recebe.\"\n\nO Reino dos Músculos — Resistência dos Materiais\nOs juízes dos materiais perguntam: \"Quanto tempo ela resistirá?\" Criaram os grandes testes: tração, compressão, flexão, torção, fadiga. \"A força verdadeira não está em nunca sofrer. Está em conhecer exatamente quanto sofrimento se pode suportar.\"\n\nO Reino dos Esqueletos — Análise Estrutural\nOs Guardiões da Linha Invisível possuem o dom mais raro: enxergar aquilo que ninguém vê. Veem forças viajando, tensões escondidas, o destino de uma construção antes mesmo dela existir. As vigas são ossos, os pilares são membros, as ligações são articulações, as fundações são raízes.\n\nA Grande Aliança Estrutural — O Super Reino Roxo\nA união de todos os reinos. Onde a força encontra a matéria. Onde o cálculo encontra a criatividade. Onde o conhecimento encontra a coragem de construir.\n\"Quando os homens compreenderem que uma estrutura não é apenas aquilo que permanece de pé, mas aquilo que luta silenciosamente para permanecer, eles terão finalmente descoberto o verdadeiro segredo do mundo: Engenharia.\"";

// Banco de curiosidades históricas reais de engenharia — origem: Base44
const CURIOSIDADES_DIVERSOES = "O Esqueleto Invisível do Mundo: Uma História Alternativa da Engenharia Civil\n\nA ORIGEM UNIFICADA: Da Defesa ao Domínio da Natureza\nA engenharia nasceu como um instinto brutal de sobrevivência. A distinção entre um construtor de estradas e um estrategista de cerco era inexistente. O termo \"engenho\" deriva do latim ingenium, associado à capacidade de criar dispositivos mecânicos de guerra.\n\nA DIVISÃO (Civil vs. Militar): John Smeaton (1724-1792), o \"Pai da Engenharia Civil\", pendurou uma placa à porta do seu escritório em 1776: \"JOHN SMEATON, CIVIL ENGINEER\". Construiu o terceiro Farol de Eddystone (1759) com blocos de granito intertravados e redescobriu a cal hidráulica.\n\nA FRAGMENTAÇÃO: George Stephenson, o \"Pai dos Caminhos de Ferro\", era autodidata e analfabeto até aos 18 anos. Sentindo-se insultado pela Institution of Civil Engineers, fundou a Institution of Mechanical Engineers em 1847.\n\nA BATALHA DAS BITOLAS (1840s): Stephenson adotou bitola estreita (1435 mm); Isambard Kingdom Brunel propôs bitola larga (2140 mm) para a Great Western Railway. A Railway Regulation Act de 1846 decretou a bitola de 1435 mm como padrão nacional.\n\nMATERIAIS ESTRANHOS DO PASSADO:\n- Betão romano (opus caementicium): cinzas vulcânicas (pozzolana) + cal viva + sangue animal e gordura. A saponificação gerava microbolhas de ar (incorporador de ar) que davam resistência ao gelo-degelo.\n- Argamassa de arroz pegajoso na China imperial: o amido interagia com o carbonato de cálcio, criando matriz hidrofóbica.\n- Clara de ovo (albumina) na Europa (sécs. XVII-XIX): polimerização de cadeias proteicas em meio básico.\n\nDESASTRES HISTÓRICOS:\n- Colapso do Anfiteatro de Fidenas (27 d.C.): 20.000 mortos, primeiras leis de vistoria.\n- Grande Inundação de Melaço de Boston (1919): 2,3 milhões de galões, 21 mortos. Origem do carimbo de engenheiro profissional.\n- Ponte de Quebec (1907 e 1916): 75 + 13 mortos. Erro de cálculo de peso próprio.\n- Anel de Ferro dos Engenheiros Canadianos: criado em 1922 em resposta à tragédia da Ponte de Quebec.\n\nRIVALIDADES HISTÓRICAS:\n- Brunelleschi vs. Ghiberti: A cúpula de Florença (1418). Brunelleschi fingiu doença para desmascarar a incompetência de Ghiberti. Usou tijolos em espinha de peixe sem escoramento.\n- Bernini vs. Borromini: Torres sineiras de São Pedro (1646). Borromini provou que as fundações de Bernini eram catastróficas. Bernini esculpiu \"A Verdade Revelada pelo Tempo\" em resposta.\n\nCÁLCULO SEM SILÍCIO: Mestres medievais usavam ad quadratum e ad triangulum. As \"salas de tração\" tinham desenhos à escala real (1:1) em gesso de Paris.\n\nA FADIGA E A MENTIRA DA RECRISTALIZAÇÃO:\n- Catástrofe de Versalhes (1842): eixo de ferro partiu por fadiga.\n- William Rankine identificou a nucleação e propagação de fendas.\n- O mito da \"recristalização\" (metal que se torna cristalino por vibração) atrasou a ciência décadas.\n- August Wöhler (1860) estabeleceu as curvas S-N e o conceito de limite de fadiga.\n\nA CATENÁRIA INVERTIDA:\n- Robert Hooke (1675): \"Ut pendet continuum flexile, sic stabit contiguum rigidum inversum\" (Como pende um cabo flexível, assim se manterá, invertida, a peça rígida de um arco).\n- Poleni (1743) usou modelo de corrente suspensa para analisar a cúpula da Basílica de São Pedro.\n- Regra do Terço Central: e ≤ h/6 para evitar tração em alvenaria.\n- Antoni Gaudí: maquetes invertidas de cordas e saquinhos de areia para a Sagrada Família. Colunas ramificadas como árvores de pedra.";

// Prompt-base para o Oráculo Mago Aurelius (a ser usado futuramente na integração com IA) — origem: Base44
const SYSTEM_PROMPT_AURELIUS = "Atue como Aurelius, um sábio Mago Engenheiro civil da época medieval (com tom encorajador, misturando linguagem rúnica e termos estruturais reais). Responda sempre em português (do Brasil ou de Portugal), de forma lúdica mas extremamente precisa tecnicamente, em no máximo 3 frases curtas. Use analogias com catapultas, castelos, arcos de pedra ou fundações antigas.\n\nVocê é o guardião do Império do Esqueleto Invisível, um reino mágico onde a engenharia civil é ensinada como arte arcana. O império possui 7 blocos de conhecimento:\n- Bloco 0: Portal de Entrada (Introdução e Conceitos Intuitivos)\n- Bloco 1: Vilarejo dos Sistemas Construtivos (Alvenaria, Concreto, Madeira, Pré-fabricação)\n- Bloco 2: Condado de MecTec (Forças, Medição, Vetores, Impacto dinâmico)\n- Bloco 3: Reino NEXUS / Tendões (Mecânica dos Sólidos, Lei de Hooke, Alavancas)\n- Bloco 4: Reino dos Músculos (Resistência dos Materiais, Tensão, Deformação, Fadiga, Fator de Segurança)\n- Bloco 5: Reino dos Esqueletos (Análise Estrutural, Equilíbrio, Apoios, Vigas, Cargas)\n- Bloco 6: Grande Aliança Estrutural (Síntese final, Cidades, Desafios do Mestre)\n\nBANCO DE CONHECIMENTO - CRÔNICA FUNDADORA:\nO IMPÉRIO DO ESQUELETO INVISÍVEL - Crônicas da Grande Aliança Estrutural\n\nO Portal de Entrada — A Porta Índigo\nNenhum viajante chega ao Império das Estruturas sem antes atravessar o Portal Índigo. Dizem os antigos manuscritos que esta passagem não foi construída por mãos humanas, mas descoberta. Ela existe no limite entre a imaginação e a matéria, entre aquilo que um homem sonha construir e aquilo que o mundo permite permanecer de pé.\n\"Toda grande obra começa como uma ideia frágil na mente de alguém. A engenharia é a arte de convencer essa ideia a sobreviver no mundo real.\"\n\nO Vilarejo dos Sistemas Construtivos — Onde os Sonhos Ganham Forma\nSão os mestres das ferramentas, das técnicas e dos métodos. Sabem como uma pedra percorre até se tornar uma muralha. \"Nenhuma torre nasce no céu. Antes de tocar as nuvens, ela precisa aprender a existir no chão.\"\n\nO Condado de MecTec — A Cidade dos Comerciantes das Forças Invisíveis\nOs habitantes de MecTec negociam forças. Comercializam conhecimento sobre equilíbrio, movimento, energia e interação. Descobriram que uma ponte não permanece firme por vontade própria — ela existe porque milhares de forças invisíveis travam uma batalha silenciosa em seu interior.\n\nO Reino dos Tendões — Mecânica dos Sólidos\nPara eles, toda estrutura é um organismo. A madeira possui fibras como tendões. A pedra possui resistência como ossos antigos. O aço possui uma força semelhante à de criaturas forjadas no fogo. \"Conhecer uma força é inútil se você não conhece o corpo que a recebe.\"\n\nO Reino dos Músculos — Resistência dos Materiais\nOs juízes dos materiais perguntam: \"Quanto tempo ela resistirá?\" Criaram os grandes testes: tração, compressão, flexão, torção, fadiga. \"A força verdadeira não está em nunca sofrer. Está em conhecer exatamente quanto sofrimento se pode suportar.\"\n\nO Reino dos Esqueletos — Análise Estrutural\nOs Guardiões da Linha Invisível possuem o dom mais raro: enxergar aquilo que ninguém vê. Veem forças viajando, tensões escondidas, o destino de uma construção antes mesmo dela existir. As vigas são ossos, os pilares são membros, as ligações são articulações, as fundações são raízes.\n\nA Grande Aliança Estrutural — O Super Reino Roxo\nA união de todos os reinos. Onde a força encontra a matéria. Onde o cálculo encontra a criatividade. Onde o conhecimento encontra a coragem de construir.\n\"Quando os homens compreenderem que uma estrutura não é apenas aquilo que permanece de pé, mas aquilo que luta silenciosamente para permanecer, eles terão finalmente descoberto o verdadeiro segredo do mundo: Engenharia.\"\n\nBANCO DE CONHECIMENTO - CURIOSIDADES E DIVERSÕES:\nO Esqueleto Invisível do Mundo: Uma História Alternativa da Engenharia Civil\n\nA ORIGEM UNIFICADA: Da Defesa ao Domínio da Natureza\nA engenharia nasceu como um instinto brutal de sobrevivência. A distinção entre um construtor de estradas e um estrategista de cerco era inexistente. O termo \"engenho\" deriva do latim ingenium, associado à capacidade de criar dispositivos mecânicos de guerra.\n\nA DIVISÃO (Civil vs. Militar): John Smeaton (1724-1792), o \"Pai da Engenharia Civil\", pendurou uma placa à porta do seu escritório em 1776: \"JOHN SMEATON, CIVIL ENGINEER\". Construiu o terceiro Farol de Eddystone (1759) com blocos de granito intertravados e redescobriu a cal hidráulica.\n\nA FRAGMENTAÇÃO: George Stephenson, o \"Pai dos Caminhos de Ferro\", era autodidata e analfabeto até aos 18 anos. Sentindo-se insultado pela Institution of Civil Engineers, fundou a Institution of Mechanical Engineers em 1847.\n\nA BATALHA DAS BITOLAS (1840s): Stephenson adotou bitola estreita (1435 mm); Isambard Kingdom Brunel propôs bitola larga (2140 mm) para a Great Western Railway. A Railway Regulation Act de 1846 decretou a bitola de 1435 mm como padrão nacional.\n\nMATERIAIS ESTRANHOS DO PASSADO:\n- Betão romano (opus caementicium): cinzas vulcânicas (pozzolana) + cal viva + sangue animal e gordura. A saponificação gerava microbolhas de ar (incorporador de ar) que davam resistência ao gelo-degelo.\n- Argamassa de arroz pegajoso na China imperial: o amido interagia com o carbonato de cálcio, criando matriz hidrofóbica.\n- Clara de ovo (albumina) na Europa (sécs. XVII-XIX): polimerização de cadeias proteicas em meio básico.\n\nDESASTRES HISTÓRICOS:\n- Colapso do Anfiteatro de Fidenas (27 d.C.): 20.000 mortos, primeiras leis de vistoria.\n- Grande Inundação de Melaço de Boston (1919): 2,3 milhões de galões, 21 mortos. Origem do carimbo de engenheiro profissional.\n- Ponte de Quebec (1907 e 1916): 75 + 13 mortos. Erro de cálculo de peso próprio.\n- Anel de Ferro dos Engenheiros Canadianos: criado em 1922 em resposta à tragédia da Ponte de Quebec.\n\nRIVALIDADES HISTÓRICAS:\n- Brunelleschi vs. Ghiberti: A cúpula de Florença (1418). Brunelleschi fingiu doença para desmascarar a incompetência de Ghiberti. Usou tijolos em espinha de peixe sem escoramento.\n- Bernini vs. Borromini: Torres sineiras de São Pedro (1646). Borromini provou que as fundações de Bernini eram catastróficas. Bernini esculpiu \"A Verdade Revelada pelo Tempo\" em resposta.\n\nCÁLCULO SEM SILÍCIO: Mestres medievais usavam ad quadratum e ad triangulum. As \"salas de tração\" tinham desenhos à escala real (1:1) em gesso de Paris.\n\nA FADIGA E A MENTIRA DA RECRISTALIZAÇÃO:\n- Catástrofe de Versalhes (1842): eixo de ferro partiu por fadiga.\n- William Rankine identificou a nucleação e propagação de fendas.\n- O mito da \"recristalização\" (metal que se torna cristalino por vibração) atrasou a ciência décadas.\n- August Wöhler (1860) estabeleceu as curvas S-N e o conceito de limite de fadiga.\n\nA CATENÁRIA INVERTIDA:\n- Robert Hooke (1675): \"Ut pendet continuum flexile, sic stabit contiguum rigidum inversum\" (Como pende um cabo flexível, assim se manterá, invertida, a peça rígida de um arco).\n- Poleni (1743) usou modelo de corrente suspensa para analisar a cúpula da Basílica de São Pedro.\n- Regra do Terço Central: e ≤ h/6 para evitar tração em alvenaria.\n- Antoni Gaudí: maquetes invertidas de cordas e saquinhos de areia para a Sagrada Família. Colunas ramificadas como árvores de pedra.\n\nUse este conhecimento para enriquecer suas respostas com curiosidades históricas reais, analogias medievais e precisão técnica absoluta. Quando o aprendiz perguntar sobre um conceito, conecte-o ao reino correspondente e ofereça um fato histórico fascinante do seu banco de conhecimento.";

// Função utilitária: extrai o "nome curto" de um bloco a partir do título completo
function nomeCurtoReino(title) {
  const parts = title.split("—");
  return (parts[1] || title).trim();
}

// ---------------------------------------------------------------------
// Missões dos blocos ("Julgamento do Reino") — 3 perguntas por bloco,
// liberadas quando todas as runas daquele bloco já foram lidas.
// Cada pergunta usa fatos e conceitos que já aparecem nas curiosidades
// das próprias runas do bloco, então não exige conteúdo novo.
// ---------------------------------------------------------------------
const missoesPorBloco = {
  bloco0: [
    {
      pergunta: "Para uma estrutura ficar parada (em equilíbrio), o que deve acontecer com a soma de todas as forças que atuam nela?",
      opcoes: ["Deve ser zero", "Deve ser igual ao peso do telhado", "Deve dobrar a cada segundo"],
      correta: 0,
    },
    {
      pergunta: "Num arco de pedra sem cimento, como os blocos se sustentam?",
      opcoes: ["Colados com argamassa forte", "Pelo encaixe sob compressão, empurrando uns aos outros", "Amarrados com cordas de fibra"],
      correta: 1,
    },
    {
      pergunta: "Nas simulações de elementos finitos, que cor costuma indicar tração (material sendo esticado)?",
      opcoes: ["Azul", "Verde", "Vermelho"],
      correta: 2,
    },
  ],
  bloco1: [
    {
      pergunta: "Por que as pontes de treliça usam triângulos na sua estrutura?",
      opcoes: ["Porque é mais bonito", "Porque o triângulo é a única forma que não se deforma sob carga", "Porque usa menos material que um quadrado"],
      correta: 1,
    },
    {
      pergunta: "No concreto armado, qual é o papel do aço dentro do concreto?",
      opcoes: ["Deixar o concreto mais bonito", "Resistir à tração, já que o concreto sozinho racha ao ser esticado", "Acelerar a secagem do concreto"],
      correta: 1,
    },
    {
      pergunta: "Qual é a fraqueza clássica da alvenaria simples (tijolos empilhados)?",
      opcoes: ["Não aguenta cargas verticais", "É péssima resistindo a empurrões horizontais", "Não existe fraqueza, é perfeita"],
      correta: 1,
    },
  ],
  bloco2: [
    {
      pergunta: "O que diferencia um material dúctil (como o aço) de um material frágil (como o vidro) na hora de romper?",
      opcoes: ["O dúctil racha sem aviso", "O dúctil se deforma visivelmente antes de romper, dando tempo de reação", "Ambos rompem exatamente da mesma forma"],
      correta: 1,
    },
    {
      pergunta: "Por que os engenheiros decompõem uma força diagonal em componentes vertical e horizontal?",
      opcoes: ["Só para complicar os cálculos", "Para entender separadamente o que a força faz para baixo e para os lados", "Porque forças diagonais não existem na natureza"],
      correta: 1,
    },
    {
      pergunta: "Por que se testam maquetes em laboratório antes de construir a estrutura real?",
      opcoes: ["É uma tradição sem utilidade prática", "Para detectar erros com baixo custo, antes que um erro real cause um colapso caro", "Só para fotos de divulgação"],
      correta: 1,
    },
  ],
  bloco3: [
    {
      pergunta: "Segundo a Lei da Ação e Reação, quando um prédio empurra o solo pra baixo, o que o solo faz?",
      opcoes: ["Nada, ele só absorve", "Empurra o prédio de volta com a mesma força exata", "Empurra com metade da força"],
      correta: 1,
    },
    {
      pergunta: "Por que cabos de aço são ótimos para tração mas péssimos para compressão?",
      opcoes: ["Eles enferrujam rápido", "Por serem finos e flexíveis, ficam frouxos ao serem comprimidos, mas esticam com firmeza sob tração", "Eles não suportam nenhum tipo de força"],
      correta: 1,
    },
    {
      pergunta: "Por que metade do esforço de uma coluna de prédio alto é só pra sustentar o peso do próprio edifício acima dela?",
      opcoes: ["Porque as colunas são fracas", "Porque o peso próprio da estrutura (carga morta) já é, sozinho, uma carga enorme acumulada de todos os andares", "Isso é um mito, colunas só sustentam pessoas"],
      correta: 1,
    },
  ],
  bloco4: [
    {
      pergunta: "O que é 'tensão' (stress) na engenharia estrutural?",
      opcoes: ["O nervosismo do engenheiro", "A força interna distribuída pela área da seção do material", "Só existe em materiais líquidos"],
      correta: 1,
    },
    {
      pergunta: "O que causa a fadiga de um material metálico (como um eixo ou cabo)?",
      opcoes: ["Uma única força gigante aplicada uma vez", "Pequenas forças repetidas milhões de vezes, mesmo que fracas individualmente", "Exposição à luz do sol"],
      correta: 1,
    },
    {
      pergunta: "Por que os engenheiros usam um 'fator de segurança' em vez de projetar no limite exato da força do material?",
      opcoes: ["Para gastar mais material sem motivo", "Para ter margem contra erros, imprevistos e desgaste ao longo do tempo", "É só uma formalidade sem função real"],
      correta: 1,
    },
  ],
  bloco5: [
    {
      pergunta: "O que são 'cargas mortas' numa estrutura?",
      opcoes: ["Cargas temporárias, como pessoas e móveis", "O peso permanente da própria estrutura (paredes, vigas, telhado)", "Cargas que já causaram um colapso"],
      correta: 1,
    },
    {
      pergunta: "Por que sistemas hiperestáticos (com caminhos alternativos de força) são mais seguros que sistemas isostáticos simples?",
      opcoes: ["Não são mais seguros, só mais caros", "Se um elemento falhar, os vizinhos podem absorver a carga, evitando colapso imediato", "Eles usam menos material"],
      correta: 1,
    },
    {
      pergunta: "Se dobrares o vão entre dois apoios de uma viga sob a mesma carga distribuída, o que acontece com a deflexão no centro?",
      opcoes: ["Diminui pela metade", "Aumenta 16 vezes", "Permanece exatamente igual"],
      correta: 1,
    },
  ],
  bloco6: [
    {
      pergunta: "Qual é o papel do carimbo/selo de um engenheiro num projeto oficial?",
      opcoes: ["É só uma decoração no papel", "Assume a responsabilidade jurídica e moral pela segurança da estrutura", "Serve apenas para identificar o escritório"],
      correta: 1,
    },
    {
      pergunta: "O que tornou os sistemas hiperestáticos (como a malha de aço das antigas Torres Gêmeas) importantes em situações extremas?",
      opcoes: ["Eles tornam o edifício mais barato", "Distribuem a carga por caminhos alternativos, ganhando tempo crucial em caso de dano", "Não têm nenhuma vantagem prática"],
      correta: 1,
    },
    {
      pergunta: "Por que uma cidade funcional é comparada a um organismo vivo?",
      opcoes: ["Porque tem batimento cardíaco literal", "Porque suas redes (vias, água, energia) trabalham interligadas, como órgãos que dependem uns dos outros", "É só uma metáfora sem relação com engenharia real"],
      correta: 1,
    },
  ],
};

// Perguntas extras (mais difíceis) do "Julgamento Supremo" — mini-boss opcional de cada bloco.
// Somadas às 3 perguntas normais de missoesPorBloco, formam um total de 5 perguntas (precisa 4/5 pra passar).
const missoesBossPorBloco = {
  bloco0: [
    {
      pergunta: "A 'Bola de Cristal do Engenheiro' representa, na prática, qual ferramenta moderna?",
      opcoes: ["Um instrumento de medição de peso", "Simulações computacionais que preveem o comportamento da estrutura antes de ela ser construída", "Uma superstição sem uso real"],
      correta: 1,
    },
    {
      pergunta: "Qual destes é um exemplo do 'Mundo Real' da engenharia estrutural no dia a dia?",
      opcoes: ["Só pontes e arranha-céus gigantes", "Também elementos comuns, como estantes, playgrounds e passarelas de pedestres", "Apenas prédios tombados como patrimônio histórico"],
      correta: 1,
    },
  ],
  bloco1: [
    {
      pergunta: "O que caracteriza as 'construções vivas' (bio-inspiradas) na engenharia moderna?",
      opcoes: ["Estruturas feitas literalmente de plantas vivas, sem nenhuma parte técnica", "O uso de princípios encontrados na natureza (como a forma de ossos ou colmeias) pra otimizar estruturas", "Um conceito sem aplicação real"],
      correta: 1,
    },
    {
      pergunta: "Qual é a principal vantagem de fabricar peças estruturais numa fábrica (pré-moldados) em vez de tudo no canteiro de obras?",
      opcoes: ["Não tem vantagem, é só mais caro", "Maior controle de qualidade e mais rapidez na montagem no local", "Impede o uso de concreto"],
      correta: 1,
    },
  ],
  bloco2: [
    {
      pergunta: "O 'Peso Invisível' estudado no Condado de MecTec se refere a qual tipo de carga?",
      opcoes: ["O peso de pessoas dentro do prédio", "Cargas como o vento e a pressão do ar, que não se veem mas empurram a estrutura", "O peso do próprio ar dentro da sala"],
      correta: 1,
    },
    {
      pergunta: "Por que o 'Tempo da Força' importa tanto — ou seja, por que a velocidade de aplicação de uma carga faz diferença (ex: impacto vs. carga lenta)?",
      opcoes: ["Não importa, só a intensidade da força conta", "Cargas aplicadas rapidamente (impacto) podem gerar efeitos bem mais severos que a mesma carga aplicada devagar", "O tempo só afeta a cor do material"],
      correta: 1,
    },
  ],
  bloco3: [
    {
      pergunta: "Na 'Poção da Elasticidade', o que caracteriza o comportamento elástico de um material?",
      opcoes: ["Ele quebra imediatamente sob qualquer força", "Ele se deforma sob carga, mas volta à forma original quando a carga é removida, até um certo limite", "Ele nunca retorna à forma original"],
      correta: 1,
    },
    {
      pergunta: "O 'Espelho das Forças' ilustra qual princípio físico fundamental?",
      opcoes: ["Que toda ação tem uma reação igual e oposta", "Que forças só existem em pares visualmente idênticos", "Que espelhos anulam forças estruturais"],
      correta: 0,
    },
  ],
  bloco4: [
    {
      pergunta: "Quais são, em geral, os principais 'vilões' (modos de falha) que ameaçam uma estrutura?",
      opcoes: ["Só o vento e a chuva", "Tração excessiva, compressão excessiva, cisalhamento, flambagem e fadiga, entre outros", "Apenas o peso próprio da estrutura"],
      correta: 1,
    },
    {
      pergunta: "Por que materiais diferentes (aço, madeira, concreto) têm propriedades mecânicas tão diferentes entre si?",
      opcoes: ["Todos os materiais se comportam exatamente igual sob carga", "Cada um tem uma estrutura interna própria, que define sua resistência, rigidez e comportamento sob força", "É só uma questão da cor do material"],
      correta: 1,
    },
  ],
  bloco5: [
    {
      pergunta: "Qual é a diferença entre um apoio fixo e um apoio móvel (tipo rolete) numa estrutura?",
      opcoes: ["Não existe diferença prática", "O apoio fixo restringe mais direções de movimento, enquanto o móvel permite deslocamento numa direção, absorvendo dilatação térmica, por exemplo", "O apoio móvel não suporta nenhuma carga"],
      correta: 1,
    },
    {
      pergunta: "O que são 'cargas vivas' numa estrutura?",
      opcoes: ["O peso permanente da própria estrutura", "Cargas variáveis e temporárias, como pessoas, móveis e veículos", "Cargas que já causaram um colapso"],
      correta: 1,
    },
  ],
  bloco6: [
    {
      pergunta: "Numa estrutura em equilíbrio, o que precisa acontecer entre as forças internas (tensões) e as cargas externas?",
      opcoes: ["A estrutura sempre perde essa disputa", "A resistência interna do material precisa vencer, ou pelo menos igualar, as solicitações externas, sem isso haver colapso", "Esse equilíbrio só existe durante terremotos"],
      correta: 1,
    },
    {
      pergunta: "Por que a integração entre diferentes sistemas estruturais (fundações, vigas, colunas, lajes) é chamada de 'Grande Aliança'?",
      opcoes: ["Porque cada sistema funciona isolado, sem depender dos outros", "Porque cada parte depende das outras pra formar um conjunto seguro e funcional, como aliados numa mesma missão", "É apenas um nome decorativo, sem significado técnico"],
      correta: 1,
    },
  ],
};

// =====================================================================
// Ilha Amaldiçoada — Reino dos Erros Famosos (conteúdo bônus)
//
// Fica FORA de reinosDados e de dadosEspecificosCards de propósito:
// o certificado final e o contador "X/45 runas lidas" derivam daquelas
// estruturas, e as runas negras não podem inflar essas contas.
// A leitura das runas negras é guardada em runasNegrasLidas (jogo.js),
// nunca em borgestravel_runas_lidas.
// =====================================================================

// =====================================================================
// Guardiões dos Reinos — um personagem por bloco (+ o Cronista da Ilha).
// A fala certa é escolhida pelo app.js conforme o progresso do jogador:
// saudacao (0 runas) → emProgresso → quaseLa (falta 1) → completo.
// Voz no estilo do Mago Aurelius: "tu", 2-3 frases, 1 analogia + 1 empurrão.
// =====================================================================

const guardioesPorBloco = {
  bloco0: {
    nome: "Aldric, o Porteiro do Portal",
    emoji: "🗝️",
    falas: {
      saudacao: "Bem-vindo ao limiar, aprendiz! Todo castelo começa com uma porta — e toda sabedoria, com uma primeira runa. Escolhe uma e gira a chave.",
      emProgresso: "Sinto o Portal reconhecer teus passos. Cada runa lida é uma dobradiça a menos rangendo — segue em frente!",
      quaseLa: "Uma única runa te separa de atravessar o Portal por inteiro. Não deixes a porta entreaberta, aprendiz!",
      completo: "O Portal está escancarado e te saúda! Que os outros reinos ouçam teus passos, mestre das primeiras pedras.",
    },
  },
  bloco1: {
    nome: "Brunilda, a Mestra Carpinteira",
    emoji: "🔨",
    falas: {
      saudacao: "Chega mais perto da bancada, aprendiz! Aqui no Vilarejo cada sistema construtivo é uma ferramenta — e ninguém constrói castelo só com martelo. Pega a primeira runa.",
      emProgresso: "Teu cinto de ferramentas já tem peso! Cada técnica que aprendes é uma parede que não cai. Continua batendo prego.",
      quaseLa: "Falta UMA runa pra tua caixa de ferramentas ficar completa. Nenhuma obra se entrega com parafuso faltando!",
      completo: "Obra aceita e sem ressalvas! Agora conheces os ofícios do Vilarejo inteiro. Vai, que outros reinos precisam de ti.",
    },
  },
  bloco2: {
    nome: "Voltério, o Barão das Engrenagens",
    emoji: "⚙️",
    falas: {
      saudacao: "Precisão, aprendiz, precisão! No Condado de MecTec um milímetro separa o monumento da ruína. Ajusta o monóculo e abre a primeira runa.",
      emProgresso: "As engrenagens já giram no teu favor. Cada runa calibra teu olhar — um instrumento afiado vale por dez chutes.",
      quaseLa: "Resta um único dente na engrenagem do teu saber. Encaixa-o, e o mecanismo do Condado girará completo!",
      completo: "Calibração perfeita! O Condado te reconhece como mestre da medida exata. Nada aqui range sem tua permissão.",
    },
  },
  bloco3: {
    nome: "Seda, a Tecelã dos Tendões de Aço",
    emoji: "🪢",
    falas: {
      saudacao: "Vês estes cabos, aprendiz? Finos como fio de teia, fortes como juramento. No Reino NEXUS aprenderás que puxar também é sustentar. Tece tua primeira runa.",
      emProgresso: "Teu fio ganha têmpera a cada runa. A tração é honesta: avisa esticando antes de romper. Escuta-a e segue tecendo.",
      quaseLa: "Um último fio e tua teia estará inteira. Nenhum tendão aguenta sozinho o que a teia completa sustenta!",
      completo: "A teia está tecida e canta ao vento sem se romper. O NEXUS te chama de irmão dos cabos, aprendiz — honra rara.",
    },
  },
  bloco4: {
    nome: "Brutus, o Titã das Colunas",
    emoji: "💪",
    falas: {
      saudacao: "HA! Mais um ombro pra segurar o teto do mundo! No Reino dos Músculos, a compressão é rainha. Empurra a primeira runa e mostra tua força.",
      emProgresso: "Teus ombros já aguentam mais peso que ontem! Mas cuidado: coluna forte não é coluna grossa — é coluna esperta. Segue treinando.",
      quaseLa: "UMA runa, aprendiz! Um último agachamento e carregas o reino inteiro nas costas. Não amoleças agora!",
      completo: "Agora sim! Nem Atlas seguraria este reino melhor que tu. Os Músculos rugem teu nome pelos corredores de pedra!",
    },
  },
  bloco5: {
    nome: "Ossaldo, o Arquiteto dos Esqueletos",
    emoji: "🦴",
    falas: {
      saudacao: "Shhh... escuta o esqueleto do edifício rangendo suas histórias. Cada osso no lugar certo, e o corpo fica de pé sozinho. Abre a primeira runa, sem medo.",
      emProgresso: "Vértebra por vértebra, montas o esqueleto do teu saber. Estrutura boa é como espinha reta: ninguém nota, até faltar.",
      quaseLa: "Falta um osso no teu esqueleto de conhecimento — e esqueleto sem um osso conta história pela metade. Completa-o!",
      completo: "O esqueleto está inteiro e dança sem cair! Tu enxergas agora o que se esconde sob toda parede: o verdadeiro herói estrutural.",
    },
  },
  bloco6: {
    nome: "Concórdia, a Rainha da Aliança",
    emoji: "👑",
    falas: {
      saudacao: "Aproxima-te do trono, aprendiz. Aqui os reinos deixam de ser sete e tornam-se UM. A Grande Aliança te aguarda — sela a primeira runa.",
      emProgresso: "Vejo os reinos se unindo no teu entendimento. Fundação fala com coluna, coluna com viga — e tu começas a ouvir a conversa.",
      quaseLa: "Um selo final te separa de unir todos os reinos sob uma só bandeira. A Aliança sussurra teu nome, aprendiz!",
      completo: "A Grande Aliança está selada! Ergue a cabeça, pois não és mais aprendiz diante deste trono — és um construtor de reinos.",
    },
  },
  ilha: {
    nome: "O Cronista Caído",
    emoji: "🕯️",
    falas: {
      saudacao: "Aproxima-te da vela, viajante... Eu registro os erros que o orgulho tentou apagar. Lê estas crônicas sombrias — cada queda aqui escrita salvou mil obras lá fora.",
      emProgresso: "Sim... tu lês sem desviar os olhos. É preciso coragem pra aprender com ruínas. As crônicas restantes ainda sussurram — volta a elas.",
      quaseLa: "Resta uma única crônica sem leitura... Termina-a, e nenhum erro desta ilha te pegará desprevenido no mundo dos vivos.",
      completo: "Leste todas as quedas... e te ergueste com elas. A Ilha nada mais tem a te ensinar — apenas a te agradecer. Constrói o que nós não conseguimos.",
    },
  },
};

const ilhaAmaldicoada = {
  id: "ilha",
  num: "☠",
  title: "💀 Ilha Amaldiçoada — Reino dos Erros Famosos",
  subtitle: "Colapsos reais que ensinaram o mundo a construir",
  hex: "#7a1414",
  runasNegras: [
    {
      id: "E.1",
      title: "🌪️ E.1 — A Ponte Que Dançou Até Cair",
      subtitle: "Tacoma Narrows, 1940 — quando o vento virou maestro",
      desc: "No estado de Washington ergueu-se uma ponte pênsil moderna, esbelta e elegante como uma lâmina de aço. O povo apelidou-a de 'Gertie Galopante', porque o tabuleiro ondulava como o dorso de um cavalo. Quatro meses após a inauguração, num vento de apenas 68 km/h, ela torceu-se como um pergaminho até se romper.",
      principal: "O tabuleiro era fino, sólido e sem aberturas — o vento, ao passar, criava redemoinhos que empurravam a ponte num ritmo certeiro. A estrutura respondia dançando cada vez mais forte (o temível 'flutter' aeroelástico), até a torção ultrapassar o que o aço suportava.",
      secreta1: "O Último Passageiro: a única vítima foi um cão chamado Tubby, que se recusou a sair do carro abandonado no meio do vão. Todos os humanos escaparam.",
      secreta2: "Aula Eterna: o colapso foi filmado em película e até hoje é exibido nas universidades de engenharia do mundo inteiro — o desastre tornou-se o professor.",
      dica: "💡 Vento não é só força que empurra: é força que DANÇA. Estruturas esbeltas precisam de rigidez à torção e de formas que quebrem o ritmo dos redemoinhos.",
      licao: {
        runaId: "0.3",
        texto: "O segredo estava na runa do vento: quem entende como o ar ataca uma estrutura projeta tabuleiros que cortam a dança antes do primeiro passo. Hoje, toda ponte pênsil passa por testes em túnel de vento.",
      },
      fechamento: "A Gertie caiu para que nenhuma outra ponte precisasse dançar.",
    },
    {
      id: "E.2",
      title: "🌉 E.2 — O Gigante Que Subestimou o Próprio Peso",
      subtitle: "Ponte de Quebec, 1907 — a soberba antes da queda",
      desc: "No Canadá, construía-se a maior ponte em balanço do mundo, um colosso de aço sobre o rio São Lourenço. Mas o peso próprio real da estrutura era maior do que o dos cálculos originais — e os avisos de que as barras já se curvavam foram ignorados por quem comandava de longe.",
      principal: "As barras comprimidas do vão sul começaram a flambar (dobrar sob compressão) semanas antes da queda. Em 29 de agosto de 1907, em quinze segundos, 19 mil toneladas de aço desabaram, levando 75 trabalhadores. Em 1916, no segundo intento, o vão central caiu durante o içamento — mais 13 vidas. Só em 1917 o gigante ficou de pé.",
      secreta1: "O Anel de Ferro: conta a lenda que os anéis dos engenheiros canadenses — usados no dedo mínimo como voto de humildade — teriam sido forjados do aço da ponte caída.",
      secreta2: "Ela Vive: a Ponte de Quebec está de pé até hoje, ainda como a ponte em balanço de maior vão do mundo. A vitória final honrou os que tombaram.",
      dica: "💡 O peso próprio é a primeira carga de toda estrutura — e a mais traiçoeira de subestimar, porque cresce junto com cada correção do projeto.",
      licao: {
        runaId: "0.9",
        texto: "A runa das vigas guarda a resposta: toda barra tem um limite de compressão antes de flambar, e recalcular o peso a cada mudança não é fraqueza — é ofício. Ouvir o aviso da obra teria salvado 75 vidas.",
      },
      fechamento: "Quem carrega o próprio peso com humildade jamais desaba de soberba.",
    },
    {
      id: "E.3",
      title: "🏨 E.3 — A Passarela Pendurada Pela Metade",
      subtitle: "Hyatt Regency, 1981 — o detalhe que dobrou a carga",
      desc: "Em Kansas City, duas passarelas suspensas cruzavam o salão de um hotel luxuoso, uma sobre a outra. Durante um baile com o salão lotado, as duas despencaram sobre a multidão — 114 vidas perdidas, o colapso estrutural mais mortal da história dos EUA até então.",
      principal: "No projeto original, um único tirante contínuo atravessava as duas passarelas, e cada uma pendurava-se nele de forma independente. Na obra, trocaram por DOIS tirantes — e a conexão da passarela de cima passou a segurar também todo o peso da de baixo. Uma troca que parecia inocente dobrou a carga naquela junta.",
      secreta1: "A Prova do Cotidiano: engenheiros explicam o erro com uma corda e dois alpinistas — é diferente cada um se pendurar na corda ou um se pendurar nos pés do outro.",
      secreta2: "O Legado: o caso virou o exemplo mundial de ética profissional — hoje, toda mudança de detalhe construtivo exige nova verificação assinada por engenheiro.",
      dica: "💡 Numa estrutura, o caminho que a carga percorre até o chão é sagrado. Mudar um detalhe de conexão muda o caminho inteiro — e precisa de novo cálculo, sempre.",
      licao: {
        runaId: "0.7",
        texto: "A runa do equilíbrio ensina a seguir o caminho das forças com os próprios olhos: some os pesos que cada junta realmente carrega, e a troca fatal teria sido reprovada em minutos.",
      },
      fechamento: "Não há detalhe pequeno quando pessoas caminham por cima dele.",
    },
    {
      id: "E.4",
      title: "🚶 E.4 — A Ponte Que Sincronizou a Multidão",
      subtitle: "Millennium Bridge, 2000 — o passo que virou pêndulo",
      desc: "Londres inaugurou sua elegante ponte de pedestres sobre o Tâmisa para celebrar o novo milênio. No dia da abertura, milhares atravessaram — e a ponte começou a balançar de um lado para o outro. Quanto mais gente, mais balanço. Dois dias depois, foi fechada.",
      principal: "Ao sentir o piso oscilar de leve, cada pessoa ajustava o passo para se equilibrar — todas no mesmo ritmo do balanço. Sem perceber, a multidão virou um motor sincronizado empurrando a ponte lateralmente, num ciclo que se realimentava (excitação lateral sincronizada).",
      secreta1: "O Apelido: os londrinos batizaram-na de 'Wobbly Bridge' — a Ponte Bamba. O nome pegou mais que o oficial.",
      secreta2: "A Cura: dois anos e 37 amortecedores viscosos depois, ela reabriu — e nunca mais tremeu. Hoje é uma das travessias mais amadas de Londres.",
      dica: "💡 Pessoas também são carga dinâmica: caminham, correm, dançam — e podem, sem querer, entrar em ritmo com a estrutura. Frequência própria não é detalhe: é destino.",
      licao: {
        runaId: "0.3",
        texto: "A mesma sabedoria da runa do vento vale para multidões: toda estrutura tem um ritmo natural, e o projeto precisa afastá-lo do ritmo de quem a usa — ou amortecê-lo, como fizeram os curandeiros da Ponte Bamba.",
      },
      fechamento: "Até o passo mais leve derruba gigantes, quando mil passos batem juntos.",
    },
    {
      id: "E.5",
      title: "🗼 E.5 — A Torre Que Tropeçou e Virou Lenda",
      subtitle: "Pisa, 1173 — o erro que o mundo aprendeu a amar",
      desc: "Na Itália, os construtores de um campanário de mármore ergueram três andares antes de perceber o impensável: a torre afundava de um lado. O solo — argila mole e areia — cedia sob a fundação rasa de apenas três metros. A obra parou por quase um século… e a torre nunca parou de se inclinar.",
      principal: "Fundação rasa demais sobre solo mole e desigual: o lado sul afundou mais que o norte, e cada andar novo aumentava o peso e o desaprumo. Os construtores seguintes até curvaram o eixo da torre tentando compensar — por isso ela tem um leve formato de banana.",
      secreta1: "O Resgate Moderno: entre 1990 e 2001, engenheiros removeram solo cuidadosamente do lado ALTO da fundação, deixando a torre 'cair de volta' 44 centímetros. Ela está estável — e ainda torta, como o mundo a quer.",
      secreta2: "Sorte de Séculos: cálculos modernos mostram que a torre esteve muitas vezes à beira do colapso. O charme sobreviveu por pouco — e por muito socorro.",
      dica: "💡 Nenhuma estrutura é mais forte que o chão que a segura. Investigar o solo antes de fundar não é gasto: é a diferença entre monumento e ruína.",
      licao: {
        runaId: "0.7",
        texto: "A runa do equilíbrio conta a mesma história: peso mal distribuído sobre apoio desigual gera tombamento. Fundações profundas até o solo firme teriam feito de Pisa… apenas mais um campanário reto e esquecido.",
      },
      fechamento: "Pisa ensina rindo o que outras ruínas ensinaram chorando.",
    },
    {
      id: "E.6",
      title: "⛵ E.6 — O Navio Que Afundou na Estreia",
      subtitle: "Vasa, 1628 — o orgulho mais pesado que o lastro",
      desc: "O rei da Suécia encomendou o navio de guerra mais poderoso do seu tempo — e, no meio da construção, exigiu uma segunda coberta de canhões. O Vasa zarpou majestoso diante de toda Estocolmo, navegou cerca de 1300 metros, adernou com a primeira brisa forte… e afundou diante da multidão.",
      principal: "Canhões e madeiramento a mais lá no alto elevaram demais o centro de gravidade, e o casco esguio não tinha lastro suficiente embaixo para responder. Estabilidade é uma disputa entre o peso lá em cima e o lastro cá embaixo — e no Vasa, o orgulho do rei pesou mais.",
      secreta1: "O Teste Ignorado: antes da viagem, trinta homens correram de um bordo ao outro do convés — o navio balançou tanto que o teste foi interrompido. Zarparam mesmo assim: ninguém ousava contrariar o rei.",
      secreta2: "A Ressurreição: em 1961, após 333 anos no fundo gelado do porto, o Vasa foi içado quase intacto. Hoje é o museu mais visitado da Escandinávia — o fracasso virou tesouro.",
      dica: "💡 Mudar o projeto no meio da obra sem recalcular o conjunto é convidar a física para o naufrágio. E nenhum teste reprovado deve ser silenciado por autoridade nenhuma.",
      licao: {
        runaId: "0.7",
        texto: "A runa do equilíbrio rege até os mares: centro de gravidade alto e base leve derrubam navios, torres e empilhamentos igualmente. Quem faz o teste — e respeita o resultado — não afunda na estreia.",
      },
      fechamento: "O mar não reconhece coroas: reconhece centros de gravidade.",
    },
    {
      id: "E.7",
      title: "🌉 E.7 — A Redenção",
      subtitle: "Monta a ponte que a Ilha nunca conseguiu erguer",
      simulador: true, // runa especial: sem XP de leitura — o desafio é o simulador
      desc: "No coração da Ilha jaz um vão que nunca foi vencido. Os fantasmas dos seis erros rondam cada peça do estaleiro: o solo mole de Pisa, a emenda economizada de Quebec, a lâmina fina da Gertie... Escolhe fundação, estrutura e tabuleiro com sabedoria — e ergue a ponte que redime todas as quedas.",
      principal: "Aqui não há crônica pra ler — há uma ponte pra construir. Cada peça amaldiçoada repete um erro famoso das runas negras, e só a combinação sábia sobrevive aos três julgamentos: os pedestres, as carroças e a tempestade.",
      dica: "💡 Se a ponte cair, repara em COMO ela caiu — cada colapso aponta exatamente pra crônica que ensina a evitá-lo.",
      fechamento: "Quem aprende com as quedas dos outros constrói pontes que não caem.",
    },
  ],
};
