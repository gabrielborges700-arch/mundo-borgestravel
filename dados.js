/**
 * dados.js — Conteúdo unificado do Mundo Borgestrável
 * Nasceu da junção de 3 protótipos (Lovable, Base44 e BORGESTR-VEL) e foi
 * ampliado depois com o sistema de jogo.
 * Este arquivo não tem lógica, só dados (textos, cores e estrutura):
 *  - os 7 blocos (0 a 6) com 45 runas, mais a Ilha Amaldiçoada com
 *    7 runas negras (E.1 a E.7) — 52 runas no total;
 *  - as missões de cada bloco, as perguntas extras do boss
 *    ("Julgamento Supremo") e os guardiões dos reinos.
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
    "subtitle": "Descubra a totalidade da sua jornada arcana",
    "desc": "Antes de colocar o primeiro tijolo no solo, o grande Engenheiro Mágico projeta os olhos sobre o horizonte inteiro. Este mapa representa os 7 reinos que você vai conquistar.",
    "principal": "Se você somar todos os trechos que várias dinastias ergueram ao longo de mais de dois mil anos, a Grande Muralha da China passa de 21 mil quilômetros, mais da metade da volta da Terra! Só que ela não é uma muralha só. É um labirinto de muros, fossos e fortes, com trechos reconstruídos em cima de outros mais antigos, e até rios e montanhas usados como barreira. Então, quanto mede a muralha de verdade? Depende do que você decide contar!",
    "secreta1": "Aqui Há Dragões: Cartógrafos antigos usavam ilustrações de feras e dragões para preencher terras inexploradas. Num pequeno globo de cobre feito por volta de 1510, o Globo Hunt-Lenox, está gravado perto da costa leste da Ásia, logo abaixo da linha do Equador: \"HC SVNT DRACONES\" (Aqui há dragões).",
    "secreta2": "A Ilha Que Não Existia: Por mais de 100 anos, mapas famosos espalhados pela Europa desenharam a península da Califórnia como uma ilha gigante, separada do continente. O mais curioso: navegadores espanhóis já tinham ido até o fundo do golfo em 1539 e visto que ali era terra firme! Mesmo assim, o erro foi copiado de mapa em mapa, até que, em 1747, o rei Fernando VI da Espanha decretou que a Califórnia não era uma ilha.",
    "dica": "💡 Um mapa errado copiado de mestre em mestre vira dogma, e nem quem vai lá ver com os próprios olhos consegue derrubá-lo fácil. O engenheiro confere as suas fundações e as suas medidas pessoalmente, sem confiar no boato.",
    "desafio": "Toque nos 7 reinos do mapa até aparecer 'Mapa completo!' e leia o subtítulo de cada um. Repare na ordem: Mecânica dos Sólidos, depois Resistência dos Materiais, depois Análise Estrutural. Se você fosse o mestre, mudaria essa ordem? Qual desses três reinos não dá para pular sem que os seguintes desabem, e por quê?",
    "fechamento": "Todo grande construtor domina a visão do todo antes de esculpir a primeira pedra."
  },
  "0.2": {
    "title": "📖 0.2 — O Diário de Bordo",
    "subtitle": "O registro imutável do seu progresso",
    "desc": "O diário de bordo é a sua memória viva. Sem o registro de cada avanço, a maior das catedrais desmorona em confusão e desordem.",
    "principal": "No Diário de Obra, o engenheiro anota os acontecimentos importantes da construção: o começo, cada etapa, os acidentes, os dias parados por causa da chuva. Em vários países, como Portugal, a lei obriga a manter na obra um livro assim, o Livro de Obra. No Brasil, o Diário de Obra é exigido em muitos contratos, principalmente nas obras públicas, e muitas obras exigem que se escreva nele todos os dias. E onde a lei não obriga, nenhum bom engenheiro trabalha sem ele: se um dia a obra der problema, é o diário que conta o que aconteceu!",
    "secreta1": "O Diário Mais Velho do Mundo: Em 2013, arqueólogos encontraram num antigo porto do Mar Vermelho o \"Diário de Merer\", os papiros escritos mais antigos já achados, com uns 4.500 anos. Dia após dia, provavelmente pela mão de um escriba, ele registra o trabalho da equipe do inspetor egípcio Merer, que levava de barco blocos de calcário branco das pedreiras de Tura até a Grande Pirâmide de Gizé!",
    "secreta2": "A Origem do Diário (Log Book): Há uns 400 anos, os marinheiros jogavam ao mar uma tábua de madeira (o 'log', que em inglês quer dizer 'tora') presa a uma linha cheia de nós. Depois contavam quantos nós escapavam pelas mãos enquanto a areia de uma pequena ampulheta caía. É por isso que até hoje a velocidade dos navios se mede em nós! Quem media a velocidade era a tora, junto com a corda cheia de nós. O livro não media nada: só guardava os números que o 'log' revelava, e por isso ganhou o nome de 'log book'.",
    "dica": "💡 Registrar cada evento, todo o santo dia, é o escudo supremo que separa um mestre confiável de um aventureiro imprudente.",
    "desafio": "Clique em Registrar Evento no Diário e conte quantos registros levam a Confiabilidade do Mestre a 100%. Continue até o Dia 7 e leia a lista com atenção: o que há de estranho nela? Se você achasse isso num diário de obra de verdade, o que desconfiaria?",
    "fechamento": "A caneta e a pedra guardam a mesma verdade quando escritas com disciplina."
  },
  "0.3": {
    "title": "🧭 0.3 — A Pergunta do Aprendiz",
    "subtitle": "A eterna batalha do equilíbrio contra a força invisível",
    "desc": "O aprendiz pergunta: Como é que as maiores estruturas do mundo, como arranha-céus e pontes que cruzam braços de mar por dezenas de quilômetros, aguentam os empurrões do vento, que nunca para mas também nunca sopra igual e chega em rajadas, sem caírem no chão?",
    "principal": "Arranha-céus de concreto e aço, como o Burj Khalifa, são feitos para vergar um pouquinho com o vento, como uma vara de pescar gigante, em vez de resistir duros como pedra. O topo balança de verdade! Mas balançar não faz a energia do vento sumir: ela fica guardada na estrutura, como numa mola esticada, e é o amortecimento (atritos minúsculos dentro dos materiais e nas ligações) que vai gastando essa energia aos poucos. Por isso os engenheiros também atacam o problema pela forma: o Burj Khalifa tem planta em Y e vai 'encolhendo' em degraus que sobem em espiral. A cada andar, o vento encontra um formato diferente e não consegue organizar os redemoinhos que empurrariam o prédio sempre no mesmo ritmo. O engenheiro dele diz que o prédio 'confunde o vento'!",
    "secreta1": "Por que ficam de pé? Toda estrutura está numa eterna queda de braço invisível: a gravidade puxa as pedras implacavelmente para baixo, enquanto a rigidez dos materiais e as fundações respondem empurrando o exato mesmo peso para cima! Se der empate perfeito (todas as forças sobre a torre somam zero e nenhuma consegue fazê-la girar), a torre fica imóvel. Os engenheiros escrevem assim: ΣF = 0 e ΣM = 0. Atenção, aprendiz: isso não é o 'ação e reação' de Newton! Esse par de forças existe sempre, até numa pedra em queda livre: a Terra puxa a pedra, a pedra puxa a Terra de volta, e mesmo assim a pedra despenca.",
    "secreta2": "Por que caem? Estruturas caem quando esse empate falha. A Torre de Pisa se inclina porque foi erguida sobre camadas moles de argila, areia fina e silte, deixadas há milhares de anos pelo rio Arno e pelo mar, apoiada numa fundação de só uns 3 metros de profundidade. Do lado sul o terreno é ainda mais mole e afundou mais do que do lado norte sob o peso da torre. Repare no truque: o chão continua empurrando para cima exatamente o peso da torre. Esse empate nunca falhou, senão ela já teria desabado! O que falhou foi o chão não ser igualmente firme dos dois lados. E aí vem a armadilha: quanto mais a torre se inclina, mais peso vai para o lado mole, que afunda ainda mais. Ela já se inclinava em 1178, quando só três andares estavam prontos, e no fim do século XX chegou perto de tombar. Para salvá-la, os engenheiros tiraram terra de baixo do lado norte, e a torre voltou um pouquinho para trás.",
    "dica": "💡 Cuidado com a armadilha: rígido não é o mesmo que frágil! O aço é quase três vezes mais rígido que o vidro e, mesmo assim, entorta e avisa antes de romper, enquanto o vidro se estilhaça sem aviso. O inimigo do engenheiro não é a rigidez, é a fragilidade. O segredo da engenharia moderna está na tolerância, na elasticidade programada e em bases sólidas.",
    "desafio": "Com o vento em 30 km/h, o Desvio é 3,5 cm. Antes de mexer, preveja o Desvio em 60 e em 120 km/h; depois confira no slider. Agora ligue os Amortecedores Rúnicos: qual número muda, o Desvio ou o Balanço? Por que o pêndulo lá no alto acalma um deles e não o outro?",
    "fechamento": "O silêncio do edifício é, na verdade, uma dança de forças que empatam a cada milésimo de segundo."
  },
  "0.4": {
    "title": "🔑 0.4 — O Selo do Aprendiz",
    "subtitle": "A sua marca imutável no Mundo Borgestrável",
    "desc": "Para assinar os seus diários e as suas futuras pontes, você deve forjar um selo pessoal na bigorna rúnica do reino. Quem é você na hierarquia dos construtores?",
    "principal": "Os canteiros das catedrais góticas gravavam pequenas marcas de linhas e ângulos, verdadeiras runas de pedreiro, em muitas das pedras que talhavam, e muitas vezes bem à vista! Elas serviam para contar quantas peças cada um tinha feito (e quanto ia receber) e para saber quem tinha talhado cada pedra se algo saísse errado. Quer um enigma? Na catedral de Lincoln, onde se pagava por peça, há marcas por toda parte. Na de Exeter, onde se pagava salário por semana, quase não há. Adivinhe por quê?",
    "secreta1": "O que é ser um Engenheiro Mágico? Ser engenheiro é usar a física e a matemática como feitiços de verdade. Em vez de conjurar relâmpagos, você usa a inteligência para canalizar forças gigantescas pelas vigas, mantendo as pessoas seguras e as cidades vivas!",
    "secreta2": "O Selo e a Cinza: no Império Romano, documentos importantes, como testamentos, eram escritos em tabuinhas de cera, amarradas com um fio e lacradas com os selos de várias testemunhas, impressos com anéis-sinete. O truque é o contrário do que parece: o selo não era indestrutível, era feito para ser quebrado! Para ler o texto de dentro era preciso rompê-lo, e qualquer fraude ficava à vista. Já a cinza vulcânica ia para outro lugar: o concreto. Misturada com cal, ela reage com a água do mar e forma cristais raros que ajudam píeres e quebra-mares romanos a resistir há cerca de 2.000 anos.",
    "dica": "💡 O brasão que você esculpe na sua bigorna é a garantia de que as suas pontes suportarão os exércitos e as tempestades.",
    "desafio": "Digite seu nome de mestre, escolha um dos 5 estandartes e clique em Forjar Selo na Bigorna. Agora pense: numa catedral com 100 pedreiros e só esses 5 símbolos, como saber quem talhou cada pedra? Invente no papel uma marca só sua, feita só de linhas retas. Por que linhas retas, e não curvas ou o nome inteiro?",
    "fechamento": "O selo de um construtor é a sua palavra gravada sobre a matéria."
  },
  "0.5": {
    "title": "🕰️ 0.5 — A Linha do Tempo Mágica",
    "subtitle": "Como evoluímos da cabana de gravetos ao titã de aço",
    "desc": "A engenharia é uma corrente de conhecimentos que atravessa as eras. Cada geração se apoia nas costas dos construtores que vieram antes.",
    "principal": "Muitas catedrais góticas da Idade Média levaram mais de um século para ficar prontas: Notre-Dame de Paris levou cerca de 180 anos, e a de Colônia, começada em 1248, só foi concluída em 1880, depois de ficar quase 400 anos parada pela metade! Atravessaram gerações inteiras de mestres. Mas nem todas: o corpo principal da Catedral de Chartres subiu em uns 26 anos. Que segredo terão tido aqueles construtores?",
    "secreta1": "O Hamster Humano: os engenheiros romanos erguiam pedras enormes com o \"polyspastos\", um guindaste de madeira gigante cheio de polias! Girando um guincho, quatro homens levantavam cerca de 3 toneladas, segundo cálculos modernos. Mas o guincho podia ser trocado por uma enorme roda de madeira com trabalhadores caminhando lá dentro, como hamsters. A roda girava um eixo que enrolava a corda, e as polias multiplicavam a força deles: a carga podia dobrar para cerca de 6 toneladas, com metade da equipe! Por que será que uma roda maior dá mais força? (E quem eram esses 'hamsters'? As fontes antigas só dizem 'homens': podiam ser escravos ou trabalhadores pagos.)",
    "secreta2": "O Grande Salto do Ferro: até o século XVIII, quase todas as pontes da Europa eram de pedra ou de madeira. (Do outro lado do mundo, os chineses já penduravam pontes em correntes de ferro, como a de Luding, de 1706, e os incas teciam pontes de corda sobre os abismos dos Andes!) A Iron Bridge (Inglaterra, 1779) espantou o mundo como a primeira grande ponte de ferro fundido e abriu caminho para as pontes e os prédios de metal: primeiro veio quase um século de ferro e, só depois, a era do aço! (Mas atenção: os chineses já tinham fundido uma torre inteira de ferro em 1061...)",
    "dica": "💡 Nunca despreze os métodos antigos: a gravidade trabalha exatamente da mesma forma desde o Big Bang.",
    "desafio": "Arraste a linha do tempo do ano 1 até 2026 e anote em que anos o Material Dominado muda. Repare: o concreto aparece com os romanos, some da lista por mais de mil anos e só volta no fim, já com ferro dentro. Por que o concreto sozinho não bastava para erguer um arranha-céu?",
    "fechamento": "Nós nos erguemos mais alto porque subimos nos tijolos assentados pelos nossos antepassados."
  },
  "0.6": {
    "title": "🌍 0.6 — O Mundo Real Espiando",
    "subtitle": "Quatro monumentos reais revelados pelos portais mágicos",
    "desc": "Através destes portais, o nosso reino medieval se conecta diretamente com o futuro. Observe como os conceitos que você estuda sustentam colossos de todas as eras: o Coliseu, de pedra, tijolo e concreto romano; a Torre Eiffel, de ferro; o Cristo Redentor, de concreto armado coberto de pedra-sabão; e a Golden Gate, de aço. Materiais diferentes, as mesmas leis!",
    "principal": "Portais ativos revelando a Torre Eiffel, Golden Gate, Cristo Redentor e o lendário Coliseu de Roma!",
    "secreta1": "O Coliseu Inundado? Dois historiadores romanos contam que a arena foi alagada para batalhas navais de mentirinha (as naumaquias). Só que um deles escreveu mais de cem anos depois, e o hipogeu, o labirinto de túneis construído logo em seguida debaixo da arena, deixou o alagamento quase impossível. Faça a conta: uma arena de uns 83 m por 48 m, com 1,5 m de água, daria uns 4,7 milhões de litros, quase duas piscinas olímpicas. Em 2007, um engenheiro calculou que um aqueduto encheria tudo em 2 a 5 horas. Possível no papel; provado, nunca! E por que um navio de guerra de verdade encalharia ali?",
    "secreta2": "O Laranja Contra a Neblina: a Marinha dos EUA queria a Golden Gate pintada com listras pretas e amarelas, para que os navios a vissem bem. Mas venceu o arquiteto Irving Morrow, com o \"Laranja Internacional\". Ele escolheu a cor porque a achou bonita com as colinas ao redor, o mar azul e a neblina cinza, e de quebra ela ajuda a ponte a ser vista nos dias de nevoeiro. Uma única cor resolveu beleza e segurança ao mesmo tempo: engenharia também é arte!",
    "dica": "💡 A boa engenharia resolve problemas geográficos e de segurança com soluções elegantes e funcionalidade.",
    "desafio": "Abra os 4 portais e leia cada fato. Para o enigma do Cristo Redentor, teste em casa: segure um livro com o braço esticado e depois junto ao peito. Qual posição cansa mais rápido? O que isso revela sobre os braços abertos do Cristo, com 28 m de ponta a ponta, num dia de ventania?",
    "fechamento": "O concreto armado do presente é herdeiro do concreto romano. Os romanos ergueram o Panteão, que ainda hoje é a maior cúpula de concreto sem armadura do mundo, mas nunca puseram ferro dentro do concreto. E o concreto puro aguenta muito bem ser esmagado, mas racha fácil quando é puxado. Só no século XIX alguém teve a ideia de esconder barras de ferro lá dentro, e aí nasceu a verdadeira pedra filosofal."
  },
  "0.7": {
    "title": "⚖️ 0.7 — O Empate Perfeito",
    "subtitle": "A eterna lição de que forças opostas criam a paz",
    "desc": "Como fazer com que as coisas fiquem quietas? Para que uma casa ou ponte permaneça em repouso absoluto, não basta que as forças de reação anulem todas as forças que a puxam para baixo ou a empurram de lado: os giros (momentos) também precisam se anular (ΣF = 0 e ΣM = 0). Senão, mesmo com as forças empatadas, ela pode tombar, como um livro em pé que você empurra pela ponta de cima.",
    "principal": "O Cristo Redentor tem 30 metros de altura, fora o pedestal, e seus braços abertos medem 28 metros de ponta a ponta, o comprimento de uma quadra oficial de basquete. O vento do Corcovado empurra a estátua e cria um momento que tenta tombá-la. Quem segura é o esqueleto de concreto armado escondido dentro dela, preso firme ao pedestal, e não um centro de massa 'perfeito'. Esse esqueleto foi projetado pelo engenheiro Heitor da Silva Costa, com cálculos atribuídos ao francês Albert Caquot. Na base, a estrutura reage com um momento igual e contrário ao do vento: é o empate perfeito, ΣM = 0! E os braços abertos funcionam como vigas em balanço gigantes. Desafio: por que braços tão compridos, presos só pelo 'ombro', não despencam?",
    "secreta1": "A Primeira Lei da Estrutura (o nome verdadeiro é Equilíbrio Estático, herdeiro da 1ª Lei de Newton): se você colocar uma carga de 10 toneladas sobre uma viga, as colunas de apoio precisam empurrar de volta para o céu essas 10 toneladas e mais o peso da própria viga. A soma de todas as forças precisa dar zero: ΣF = 0. As colunas são preguiçosas: empurram só o tanto que a carga pede, nem um grama a mais (se empurrassem mais, o prédio levitaria!). Mas toda coluna tem limite. Se a carga passar do que ela aguenta, ela se esmaga ou se entorta de lado (os engenheiros chamam isso de flambagem). Sem conseguir devolver o empurrão, deixa a viga despencar.",
    "secreta2": "A Força do Solo: As fundações não sustentam o edifício sozinhas. É a terra abaixo delas que deve ter força suficiente para suportar a pressão sem que as pedras afundem na areia.",
    "dica": "💡 No repouso de uma ponte reside o combate físico mais feroz que existe: o empate eterno entre a ação e a reação.",
    "desafio": "Adicione pesos na nossa viga rúnica e equilibre com colunas de suporte até zerar o estresse no painel de balança!",
    "fechamento": "Uma estrutura perfeita é aquela onde o conflito físico termina num silêncio absoluto."
  },
  "0.8": {
    "title": "🧩 0.8 — Tudo é Feito de Peças",
    "subtitle": "A decomposição dos colossos estruturais",
    "desc": "Quase tudo o que você vê no mundo — desde uma simples cabana até o arranha-céu mais alto — é o encaixe ordenado de peças mais simples. Quase todo edifício gigante é montado com muitas peças, mas existem exceções incríveis. O Templo Kailasa, na Índia, e as igrejas de Lalibela, na Etiópia, foram esculpidos de cima para baixo na rocha viva, como uma escultura do tamanho de um prédio. Ali, um golpe errado não tinha conserto: não dava para trocar a peça! Repare que até eles foram feitos peça por peça, só que ao contrário, tirando pedra em vez de colocar.",
    "principal": "Algumas pontes romanas em arco estão de pé há mais de 2.000 anos, como a Ponte Fabrício, em Roma, de 62 a.C.! O segredo dos arcos está nas pedras em forma de cunha (as aduelas), que se apertam umas contra as outras sob compressão. Em alguns arcos, como os da Pont du Gard, na França, os blocos foram encaixados sem nenhuma argamassa. Em muitas outras obras, os romanos usaram sua arma secreta: um concreto feito com cal e cinza de vulcão, tão resistente que dura até hoje.",
    "secreta1": "A Runa Central do Arco: A pedra localizada no topo do arco romano é chamada de \"Pedra de Fecho\" (ou aduela de fecho). É ela que recebe as pressões das laterais e distribui o esforço para os pilares das extremidades.",
    "secreta2": "Modularidade Moderna: As pontes modernas são montadas como Legos gigantes, usando vigas pré-fabricadas em fôrmas industriais de altíssima precisão e levadas ao local por guindastes titânicos.",
    "dica": "💡 Se você quer construir o impossível, divida o colosso em pequenas pedras que consiga carregar com as suas próprias mãos.",
    "desafio": "Monte as pedras do arco rúnico romano no simulador e coloque a Pedra de Fecho para travar o sistema!",
    "fechamento": "Separadas, as pedras caem; encaixadas sob a pressão certa, suportam o próprio mundo."
  },
  "0.9": {
    "title": "🔮 0.9 — A Bola de Cristal do Engenheiro",
    "subtitle": "Prever o estresse interno da matéria antes que ela quebre",
    "desc": "Como podemos garantir que uma viga suportará o peso sem estalar ou deformar? Os engenheiros usam equações de feitiçaria matemática para espiar o interior da matéria, sabendo exatamente onde ela sofrerá mais esforço.",
    "principal": "A engenharia moderna usa programas de simulação chamados \"Elementos Finitos\" para pintar o estresse interno das vigas com cores brilhantes na tela.",
    "secreta1": "Gaudí e as Maquetes Invertidas: para projetar a igreja da Colônia Güell, o mestre Antoni Gaudí pendurou de cabeça para baixo uma enorme maquete de cordões, esticados por centenas de saquinhos de chumbinho (bolinhas de chumbo de caça)! Cada cordão puxado pelo peso desenhava sozinho a curva ideal de um arco. Por que de ponta-cabeça? Uma corda pendurada só pode ser puxada. Desvire a mesma forma e ela vira um arco de pedra que só é empurrado. Foi nesse laboratório que ele testou as colunas inclinadas que depois levou para a Sagrada Família.",
    "secreta2": "A Cor do Perigo: Nas simulações, as cores são uma régua que vai do azul (fundo da escala) ao vermelho (topo). No mapa mais usado, o de von Mises, o vermelho marca onde o material está sendo mais exigido e o azul onde está mais folgado, esteja ele esticado ou esmagado! Já no mapa 'com sinal', o vermelho costuma mostrar o material sendo esticado (Tração) e o azul o material sendo esmagado (Compressão). E atenção: vermelho não quer dizer 'vai estalar'. O computador pinta de vermelho o maior valor do modelo, mesmo que esteja longe de romper. Só comparando com a resistência do material dá para saber!",
    "dica": "💡 Um bom engenheiro consegue enxergar as linhas de força invisíveis cruzando a viga antes mesmo do material reclamar.",
    "desafio": "Coloque cargas diferentes na viga e observe na nossa bola de cristal o espectro de tensões mudando de cor!",
    "fechamento": "Cálculo não é para decorar, é o par de óculos mágicos que nos deixa ver o invisível."
  },
  "1.1": {
    "title": "🧱 1.1 — Casas de Alvenaria",
    "subtitle": "Como as paredes de tijolos suportam o peso do lar",
    "desc": "Aprenda como os pequenos blocos cerâmicos empilhados se apoiam uns nos outros para criar uma barreira rígida e protetora contra as forças exteriores.",
    "principal": "O tijolo é um dos materiais artificiais mais antigos da humanidade! Há mais de 9.000 anos já se moldavam tijolos de barro secos ao sol. Mas o truque de cozinhá-los no fogo, que os deixa duros como pedra, demorou milênios para aparecer: os tijolos cozidos mais antigos que conhecemos vêm da China e têm cerca de 6.400 anos (c. 4400 a.C.). Quanto tempo será que alguém levou para ter essa ideia?",
    "secreta1": "A Argamassa de Arroz: na China imperial, os construtores misturavam sopa de arroz grudento com cal! Uma substância do arroz, a amilopectina, organiza os cristais da cal num bloco bem compacto. O resultado é uma argamassa mais forte e mais resistente à água do que a de cal pura. Algumas muralhas feitas com ela estão de pé há séculos e aguentaram até terremotos. Quem diria que o segredo estava na cozinha?",
    "secreta2": "Adobe Antigo: Se o barro não fosse cozido no forno, ele virava adobe (seco apenas ao sol). Se houvesse uma enchente muito prolongada, a casa literalmente derretia de volta para a lama!",
    "dica": "💡 A alvenaria é incrível para suportar cargas verticais, mas péssima para aguentar empurrões de lado (forças horizontais). Precisa de pilares para se travar!",
    "desafio": "No simulador, descubra a menor carga que derruba a Alvenaria 🧱. Mas esse teste só aperta de cima! Agora monte com dominós deitados duas paredinhas: uma com as juntas alinhadas em coluna, outra com cada fileira deslocada meio bloco. Empurre com um dedo, na horizontal, o meio de cada uma. Qual se desmancha antes, e por quê?",
    "fechamento": "De tijolo em tijolo se erguem as muralhas que vencem o tempo."
  },
  "1.2": {
    "title": "🏗️ 1.2 — Torres de Concreto Armado",
    "subtitle": "O casamento de pedra líquida e garras de aço",
    "desc": "O concreto armado é a espinha dorsal das nossas metrópoles. Descubra como a flexibilidade do ferro se funde com a brutalidade do cimento.",
    "principal": "O concreto é o segundo material mais consumido no planeta Terra pelas sociedades humanas, sendo superado apenas pela água!",
    "secreta1": "O Jardineiro Visionário: um dos grandes nomes do concreto armado não era engenheiro, mas um jardineiro francês, Joseph Monier, cansado de ver vasos de barro quebrarem e tinas de madeira apodrecerem. Em 1867, ele patenteou vasos de concreto com uma rede de ferro escondida por dentro. Outros já tinham testado a ideia antes (houve até um barco de concreto e ferro, em 1848!), mas foi Monier quem a levou dos vasos para tubos, lajes, vigas e pontes. O segredo? O ferro aguenta os puxões e o concreto aguenta os apertos.",
    "secreta2": "Cinza Vulcânica Romana: há cerca de 2.000 anos, o concreto romano resiste dentro do mar graças à pozolana, uma cinza de vulcão. A água do mar se infiltra, reage com a cal e a cinza e faz crescer cristais novos que reforçam a pedra por dentro. Ou seja, o mar, que costuma desgastar o concreto moderno, deixa o romano mais forte! E tem mais: pedrinhas de cal escondidas na mistura se dissolvem quando surge uma rachadura e a 'cicatrizam' sozinhas.",
    "dica": "💡 O concreto é a pedra artificial que suporta o esmagamento. O aço é o tendão que aguenta o puxão: quando uma viga apoiada nas pontas se dobra, a parte de baixo é esticada e o concreto ali chega a trincar, em fissuras finíssimas (a norma só tolera uns poucos décimos de milímetro). Quem segura a tração daí em diante é o aço, que impede que a viga se parta ao meio.",
    "desafio": "No simulador, descubra quantas vezes mais carga o pilar de Concreto 🏗️ aguenta que o de Alvenaria 🧱. Depois risque linhas retas numa esponja e dobre-a apoiada nas pontas: de que lado os riscos se afastam? É ali que o aço trabalha. E numa marquise presa só numa ponta, você poria o aço em cima ou embaixo? Teste com a esponja!",
    "fechamento": "Onde o concreto cinzento cria raízes, o aço heroico segura o céu."
  },
  "1.3": {
    "title": "🪵 1.3 — Pontes de Madeira e Aço",
    "subtitle": "Caminhos rígidos que cruzam desfiladeiros selvagens",
    "desc": "Provavelmente, a primeira ponte foi um tronco de árvore que o vento derrubou sobre um riacho, ligando as duas margens muito antes dos arcos de pedra. Mas como provar? A madeira apodrece e quase não deixa pistas. É por isso que as pontes mais antigas que ainda existem são de pedra! Agora, as treliças de metal e os cabos de suspensão fazem o milagre do vão livre.",
    "principal": "A geometria de triângulos nas pontes de treliça tem um segredo: com as juntas articuladas, o triângulo é o único polígono que não muda de forma! Empurre um quadrado pelo canto e ele vira um losango. Já para deformar um triângulo, seria preciso esticar ou esmagar uma das barras, e elas são feitas justamente para aguentar isso, cedendo só milímetros. É por isso que toda treliça é uma fileira de triângulos.",
    "secreta1": "A Ponte de César sobre o Reno: em apenas 10 dias, os legionários de Júlio César ergueram uma ponte de madeira enorme sobre um rio largo e caudaloso. O objetivo era castigar tribos germânicas e, acima de tudo, mostrar que Roma chegava aonde quisesse. César passou 18 dias do outro lado e, ao voltar, mandou destruir a ponte. Por que construir algo tão incrível só para derrubar depois?",
    "secreta2": "Pontes de Massa: Estudantes de engenharia competem mundialmente construindo pontes feitas de espaguete cru e cola que chegam a aguentar mais de 300 kg de carga real!",
    "dica": "💡 Muitas madeiras avisam antes de quebrar: começam a estalar e a ranger. Os mineiros antigos escutavam as escoras de madeira das minas para saber a hora de correr! Mas cuidado: madeira podre ou muito rígida pode quebrar de repente, sem aviso. O aço suporta tensões extremas mas requer tratamentos contra a ferrugem.",
    "desafio": "Passe um barbante por dentro de canudos e monte um quadrado e um triângulo com os cantos soltos. Empurre um canto de cada. Agora trave o quadrado com o menor número de canudos extras: que tamanho esse canudo precisa ter? E para travar um hexágono, quantos canudos extras você aposta que bastam? Monte e confira!",
    "fechamento": "Estender caminhos sobre abismos é a expressão máxima da inteligência rúnica."
  },
  "1.4": {
    "title": "🪨 1.4 — Os Primeiros Construtores",
    "subtitle": "A engenharia animal inspirando os homens",
    "desc": "Antes do primeiro humano cavar fundações, a natureza já projetava as suas próprias represas e ninhos ultrarresistentes.",
    "principal": "As represas dos castores conseguem empurrar um riacho para fora do leito, abrir caminhos novos para a água e transformar o fundo de um vale num pântano cheio de vida. É um ecossistema aquático completamente novo, construído por um roedor!",
    "secreta1": "Vista do Espaço (por um satélite!): a maior represa de castor do mundo fica no Canadá, no Parque Nacional Wood Buffalo, e tem cerca de 850 metros de comprimento, o mesmo que uns 8 campos de futebol enfileirados! Ninguém a tinha notado até 2007, quando um pesquisador a encontrou olhando imagens de satélite no Google Earth: ela fica num lugar tão isolado que quase ninguém chega lá a pé. Ela é 'visível do espaço' pela câmera de um satélite, não a olho nu. Quantas gerações de castores você acha que trabalharam nessa obra?",
    "secreta2": "O Pulmão de Terra: Alguns cupins africanos erguem torres de terra que, nas maiores, passam de 8 metros, mais altas que uma casa de dois andares, feitas por insetos de poucos milímetros! Dentro delas há túneis e chaminés por onde o ar circula, movido pelo vento e pelo calor do dia. Por muito tempo se contou que isso era um 'ar-condicionado', e até um prédio no Zimbábue foi projetado com essa ideia. Mas, quando cientistas mediram, viram que o ninho fica quase na temperatura do solo: a torre serve mesmo é para a colônia respirar. O ar-condicionado era lenda; o pulmão é real!",
    "dica": "💡 Olhar para a natureza e copiar as suas soluções estruturais se chama biomimética, a mais nobre escola de design.",
    "desafio": "Numa assadeira um pouco inclinada, monte uma represa de castor só com gravetos e pedrinhas e despeje água devagar do lado mais alto. Depois tape as frestas com terra molhada e folhas, primeiro do lado seco e depois do lado da água. Qual vaza menos? De que lado você acha que o castor põe a lama, e por quê?",
    "fechamento": "Toda técnica é apenas a continuação dos segredos que a terra já sussurrava."
  },
  "1.5": {
    "title": "🏭 1.5 — A Fábrica de Peças",
    "subtitle": "Pré-fabricação e a montagem rápida de reinos",
    "desc": "Por que haveríamos de moldar tudo no meio da lama? A fabricação modular de vigas e lajes fora da obra acelera a conquista das alturas.",
    "principal": "Arranha-céus pré-fabricados modernos de 30 andares podem ser erguidos do chão em apenas 15 dias de montagem mecânica no local!",
    "secreta1": "Casas pelo Correio: Nos Estados Unidos dos anos 1920, dava para escolher uma casa inteira num catálogo, como quem escolhe um brinquedo! Ela chegava de trem num kit com milhares de peças de madeira já cortadas e numeradas, centenas de quilos de pregos, telhas, portas, janelas e um manual. A família, os vizinhos ou um carpinteiro contratado montavam tudo sobre uma fundação feita no próprio terreno. Não era uma casa modular, que chega em blocos prontos: era um quebra-cabeça gigante de até 30 mil peças!",
    "secreta2": "O Palácio de Cristal: Erguido em Londres entre 1850 e 1851 para a Grande Exposição, foi um dos primeiros grandes edifícios pré-fabricados da história. Milhares de peças padronizadas de ferro fundido, ferro forjado, vidro e madeira foram feitas em fábricas e só encaixadas no local, em poucos meses. E, como tinha sido montado, pôde ser desmontado e erguido de novo em outro bairro de Londres! Um prédio que muda de endereço: quem disse que construção tem que ser para sempre?",
    "dica": "💡 A precisão da fábrica evita falhas no canteiro de obras. Menos desperdício de material, maior controle de qualidade.",
    "desafio": "Peça para alguém cronometrar: monte uma torre de 20 peças de Lego (ou outro brinquedo de encaixe) catando cada peça num monte bagunçado. Depois separe as peças antes, como numa fábrica, e cronometre só a montagem. Somando o tempo de separar, a fábrica ainda ganha? E se ela trabalhar enquanto o terreno é preparado?",
    "fechamento": "Encaixar com exatidão é poupar tempo na forja do amanhã."
  },
  "1.6": {
    "title": "🌱 1.6 — Construções Vivas",
    "subtitle": "A simbiose entre as plantas e as colunas de metal",
    "desc": "Os edifícios do futuro não são blocos estéreis. Eles respiram, purificam o ar e até regeneram as suas próprias fendas minerais.",
    "principal": "O concreto autorregenerativo contém esporos de bactérias dormentes que acordam com a umidade de uma fissura e geram calcário para curar a rachadura!",
    "secreta1": "Pontes de Raízes Vivas: nas florestas úmidas de Meghalaya, na Índia, os povos Khasi e Jaintia guiam as raízes aéreas de uma figueira (Ficus elastica) de uma margem do rio até a outra. Costuma levar mais de uma década até a ponte aguentar gente. E aí acontece o contrário de uma ponte comum: em vez de se desgastar com o tempo, ela fica mais forte, porque a árvore continua viva, as raízes engrossam e se fundem umas às outras. Algumas já têm centenas de anos! Uma ponte que cresce sozinha... qual engenheiro não queria uma dessas?",
    "secreta2": "Arquitetura Esponja: cidades-esponja usam pavimentos que deixam a água passar, telhados e fachadas verdes e jardins de chuva para 'beber' a água das tempestades. A meta da China é ousada: até 2030, 80% das áreas urbanas devem conseguir segurar ou reaproveitar cerca de 70% da chuva que cai nelas ao longo do ano. Repare: 80% é a parte da CIDADE, não da chuva! E numa tempestade gigante, fora do comum, será que a esponja dá conta de tudo?",
    "dica": "💡 Integrar a vida vegetal na fachada ajuda a resfriar o edifício naturalmente, poupando energia mágica de climatização.",
    "desafio": "Na pia, despeje meio copo de água numa bandeja inclinada e meio copo num vaso com terra fofa. Para onde vai a água em cada um? Depois jogue um copo cheio de uma vez no vaso. A terra dá conta de beber tudo? O que isso diz sobre uma cidade-esponja numa tempestade gigante?",
    "fechamento": "A estrutura perfeita não combate o ecossistema; ela vive nele."
  },
  "2.1": {
    "title": "📏 2.1 — A Régua Mágica",
    "subtitle": "A busca da exatidão dimensional das coisas",
    "desc": "Antes de calcular uma força, você precisa saber exatamente onde ela atua. A medição precisa impede que as colunas fiquem desalinhadas no espaço.",
    "principal": "No antigo Egito, a unidade padrão de comprimento era o côvado real, com cerca de 52 cm, dividido em 7 palmos. A ideia de côvado vem do antebraço humano, do cotovelo à ponta dos dedos. Muita gente conta que era o braço do próprio Faraó, mas não há prova disso. Pense: se fosse o braço de cada Faraó, a medida mudaria a cada novo rei. Só que as réguas antigas que chegaram até nós medem quase o mesmo durante séculos! E tem mais: 52 cm é mais comprido que o antebraço da maioria dos adultos. Meça o seu e compare!",
    "secreta1": "Mudou o Rei, Mudou a Régua? Muita gente conta que, a cada novo Faraó, todas as réguas do império eram cortadas no tamanho do braço dele. Mas os arqueólogos encontraram réguas de reinados diferentes que medem quase o mesmo, com diferença de poucos milímetros! Faz sentido: uma medida só serve se NÃO muda. Imagine erguer uma pirâmide com a régua trocando de tamanho no meio da obra! E nem todas eram de madeira: as do dia a dia eram, mas os egípcios também faziam réguas de pedra, e até de madeira coberta de ouro! Algumas foram colocadas em túmulos, junto com os tesouros dos mortos. Por que alguém levaria uma régua para a outra vida? Para um arquiteto egípcio, sua régua era motivo de orgulho!",
    "secreta2": "A Polegada de Três Grãos: um antigo estatuto inglês da Idade Média dizia que uma polegada valia três grãos de cevada, secos e redondos, postos em fila. Muitos livros dizem que foi o rei Eduardo II, em 1324, mas os historiadores não têm certeza da data nem do rei. E pense bem: será que todo grão de cevada tem exatamente o mesmo tamanho?",
    "dica": "💡 Um milímetro de desvio no topo de uma coluna pode causar toneladas de momento fletor indesejado na base. Meça três vezes, corte uma!",
    "desafio": "No simulador, descubra quantas posições do cursor acendem a mensagem de tolerância. Agora imagine uma régua marcada só de 5 em 5 mm, ou só em palmos egípcios (uns 7,5 cm): daria para garantir esse ±1 mm com ela? O que uma régua precisa ter para medir com essa exatidão?",
    "fechamento": "A régua divide o domínio da física e o desastre do colapso."
  },
  "2.2": {
    "title": "🌬️ 2.2 — O Peso Invisível",
    "subtitle": "Pressão atmosférica, gravidade e ventos de cisalhamento",
    "desc": "O ar parece leve, mas em massa gigante se torna uma muralha em movimento que empurra as fachadas dos nossos arranha-céus.",
    "principal": "O ar acima de você exerce uma força de aproximadamente 10 toneladas por cada metro quadrado de solo, mas você não é esmagado porque tem a mesma pressão dentro do corpo!",
    "secreta1": "Os Cavalos de Magdeburgo: em 1654, na cidade de Ratisbona, Otto von Guericke mostrou ao imperador o poder do vácuo. Alguns anos depois, em Magdeburgo, cidade onde era prefeito, ele encaixou duas meias-esferas de cobre, tirou o ar de dentro com uma bomba e mandou dois grupos de 8 cavalos puxarem, um para cada lado. Os cavalos quase nunca conseguiam separá-las! Nas poucas vezes em que conseguiam, as metades se soltavam com um estrondo comparado a um tiro de canhão. Mas bastava abrir uma torneirinha e deixar o ar entrar para que elas se separassem com facilidade. Se lá dentro não havia nada, quem estava segurando as metades juntas: o metal... ou o ar?",
    "secreta2": "Pontes na Lua: Se você construísse uma ponte de pedra na Lua, ela aguentaria 6 vezes mais carga do que na Terra, pois a gravidade lá atrai as massas com muito menos força.",
    "dica": "💡 Prédios altos são como asas de avião verticais; o vento cria pressões e sucções gigantescas nas suas janelas laterais.",
    "desafio": "Sobre a pia, encha um copo plástico até a boca, tampe com um cartão, vire de cabeça para baixo segurando o cartão e depois solte a mão. Agora, com um adulto, faça um furinho com uma tachinha no fundo do copo e repita, prevendo antes o que vai mudar. Se a água é a mesma, por que um furinho tão pequeno muda tudo?",
    "fechamento": "As forças que os olhos não veem são as que exigem maior cautela do construtor."
  },
  "2.3": {
    "title": "💔 2.3 — O Ponto de Ruptura",
    "subtitle": "A fronteira final da resistência mecânica",
    "desc": "Todos os materiais do universo têm um limite onde as ligações atômicas simplesmente se rompem. Descubra como prever esse momento fatal.",
    "principal": "O vidro comum aguenta pressões de esmagamento gigantescas, mas estala imediatamente com a mínima força de torção ou tração!",
    "secreta1": "A Explosão Silenciosa: painéis de vidro temperado podem estourar sozinhos, anos depois de instalados! O culpado pode ser um grãozinho microscópico de sulfeto de níquel preso no miolo do vidro. O resfriamento brusco da têmpera 'congela' esse grão numa forma de cristal instável. Com os anos, seus átomos se rearrumam devagar e o grão incha cerca de 4%. Como o vidro temperado vive esticado por dentro, ele se desfaz em milhares de pedacinhos. O calor do sol acelera essa transformação.",
    "secreta2": "Dúctil vs Frágil: Materiais como o aço dobram muito antes de quebrar (dúcteis), dando tempo de salvar vidas. Materiais como o vidro ou gesso quebram de surpresa (frágeis).",
    "dica": "💡 Nunca use materiais frágeis em elementos que sofrem flexão pura sem um reforço dúctil integrado no interior.",
    "desafio": "Corte duas tiras iguais de papel de caderno, de uns 2 cm de largura, e faça com a tesoura um piquezinho de 2 mm na borda de uma delas. Puxe as pontas de cada tira até rasgar: onde o rasgo começou e qual foi mais fácil? Use isso para explicar por que o vidraceiro risca o vidro antes de quebrá-lo.",
    "fechamento": "Mapear a falha é desenhar o limite seguro da sobrevivência."
  },
  "2.4": {
    "title": "🧭 2.4 — A Bússola das Direções",
    "subtitle": "Vetores mecânicos e a canalização de forças",
    "desc": "Uma força não é apenas um peso; ela tem uma direção e um sentido. Desviar vetores é o truque de mágica favorito dos arquitetos.",
    "principal": "Os antigos arquitetos de catedrais inclinavam os pilares externos para interceptar as linhas diagonais de força dos arcos internos!",
    "secreta1": "Cantos Redondos Salvadores: Prédios com cantos arredondados ou recortados 'enganam' o vento. O ar contorna a torre com mais suavidade, a força de arrasto diminui e ficam mais fracos os redemoinhos que balançam o prédio de um lado para o outro. Quanto diminui? Não existe um número mágico: depende do tamanho da curva, da direção e da velocidade do vento. Por isso os engenheiros testam maquetes da torre em túneis de vento antes de construir. Você aposta em qual forma: quadrada, redonda ou com cantos recortados?",
    "secreta2": "Pontes Rotativas: Algumas pontes rodoviárias não sobem; giram lateralmente sobre um pilar central para desviar o caminho e dar passagem aos mastros dos navios.",
    "dica": "💡 Um vetor diagonal pode ser decomposto em duas forças: uma vertical (que vai para o chão) e outra horizontal (que tenta abrir a parede).",
    "desafio": "Amarre um estojo leve no meio de um barbante e segure uma ponta em cada mão. Afaste as mãos devagar, tentando deixar o barbante perfeitamente reto na horizontal: você consegue, e o que suas mãos sentem quanto mais reto ele fica? Explique usando a ideia de que a força do barbante tem uma parte vertical e outra horizontal.",
    "fechamento": "A força sem rumo destrói; o vetor direcionado ampara."
  },
  "2.5": {
    "title": "⏳ 2.5 — O Tempo da Força",
    "subtitle": "Cargas estáticas permanentes e o impacto dinâmico",
    "desc": "Um peso aplicado suavemente é diferente de um golpe rápido. O tempo de atuação de uma força altera completamente a resposta da matéria.",
    "principal": "O concreto líquido leva 28 dias após ser despejado nas fôrmas para atingir a resistência de projeto oficial, mas continua endurecendo durante décadas!",
    "secreta1": "Argamassa Medieval: Muitas pontes de pedra antigas usavam argamassa de cal, que não endurece só secando. Ela precisa 'respirar' o gás carbônico do ar, que reage com a cal e a transforma de novo em uma espécie de pedra. No miolo de um pilar grosso, onde o ar quase não chega, esse endurecimento pode demorar muitos e muitos anos. Uma ponte que ainda está terminando de endurecer por dentro... e mesmo assim já aguenta carroças! Como isso é possível?",
    "secreta2": "Velocidade Limitada: Se uma colher cair de uma torre altíssima, será que ela fura o teto de um carro? Não! Enquanto cai, a colher bate no ar, e o ar empurra para cima cada vez mais forte, até ela parar de acelerar: é a 'velocidade terminal'. A partir daí, cair de 50 ou de 500 metros dá quase no mesmo. O ar é um freio invisível! Mas atenção: objetos pesados e compactos chegam bem mais rápido ao chão, e mesmo uma colher pode machucar alguém. Por isso, nunca se joga nada do alto de uma torre.",
    "dica": "💡 Cargas vivas que se movem rápido causam vibrações na estrutura. É preciso amortecer para evitar ressonâncias perigosas.",
    "desafio": "Prenda a ponta de um elástico na beirada da mesa com livros por cima, pendure um estojo e meça quanto ele esticou parado. Depois segure o estojo onde o elástico fica sem esticar e solte, com uma almofada embaixo e o rosto longe, enquanto alguém marca o ponto mais baixo. Antes, preveja: quanto a mais ele estica, e por quê, se o peso é o mesmo?",
    "fechamento": "A paciência da matéria vence a impetuosidade do impacto."
  },
  "2.6": {
    "title": "🔬 2.6 — O Laboratório do Aprendiz",
    "subtitle": "Testar maquetes para garantir o sucesso dos gigantes",
    "desc": "Antes de erguer a torre de 100 metros, a maquete é testada na mesa de vibração do laboratório para observar o fluxo das fendas virtuais.",
    "principal": "Os túneis de vento modernos usam réplicas em miniatura de bairros inteiros para ver como os novos arranha-céus alteram as correntes de ar na rua!",
    "secreta1": "Maquete de Destruição: Como testar uma barragem gigante sem destruí-la? Os engenheiros fazem cilindros com a mesma receita de concreto da barragem e os esmagam em prensas hidráulicas enormes até eles se quebrarem. Também constroem maquetes da barragem em escala reduzida (algumas são carregadas até quebrar, de propósito!) e simulam tudo no computador. Afinal, uma barragem de verdade só pode ser testada uma vez... e ninguém quer que esse teste falhe!",
    "secreta2": "Mesas Sísmicas: Plataformas hidráulicas gigantes sacodem modelos de edifícios inteiros para garantir que os sistemas flexíveis aguentam terremotos de grau 9.",
    "dica": "💡 Um erro detectado no modelo virtual ou de madeira custa uns trocados de cobre. Um erro na obra real custa o colapso do reino.",
    "desafio": "Seja o cientista do laboratório: no simulador, anote a Exatidão Rúnica em 70, 65 e 80 mm e descubra a regra que transforma o erro em porcentagem. Com a sua regra, preveja em que posição, descendo o cursor, a Exatidão chega a zero, e só depois teste. Por que 70 e 80 dão o mesmo resultado?",
    "fechamento": "No pequeno teste se esconde o triunfo da grande obra."
  },
  "3.1": {
    "title": "🩸 3.1 — O Elo Secreto (Tendões)",
    "subtitle": "Como as conexões e os nós estabilizam as treliças",
    "desc": "Nenhuma viga trabalha sozinha. Os tendões mecânicos e os nós de união transferem os esforços de tração e compressão por toda a teia rígida.",
    "principal": "Os nós geométricos de uma treliça metálica convertem momentos complexos em forças puras de puxar ou empurrar pelas barras!",
    "secreta1": "Kigumi Japonês: os carpinteiros japoneses ergueram pagodes de cinco andares que aguentam terremotos há mais de mil anos. O esqueleto é feito de encaixes de madeira, peças que se prendem umas nas outras como um quebra-cabeça. Muita gente jura que não há nenhum prego. É lenda: os carpinteiros também usavam pregos de ferro forjados um a um, os wakugi, em partes como os beirais. E contra o tremor? Os encaixes não travam. Eles deixam cada andar balançar e escorregar um pouquinho, e o atrito entre as peças vai 'comendo' a energia do terremoto. No centro há um enorme pilar, o shinbashira, e os engenheiros ainda discutem exatamente como ele ajuda. Às vezes, ser flexível é mais forte do que ser rígido!",
    "secreta2": "Os Rebites de Eiffel: A Torre Eiffel foi montada com 2,5 milhões de rebites de ferro aplicados em brasa. Ao esfriar, o ferro se contraiu, apertando as peças com pressões brutais.",
    "dica": "💡 Pense nos cabos de aço como os tendões do corpo: eles não aguentam compressão (ficam frouxos), mas suportam trações colossais.",
    "desafio": "Monte um quadrado com 4 tiras de papelão presas nos cantos por colchetes bailarina e empurre um canto: ele vira losango. Estique um barbante numa diagonal, amarrado nos cantos, e empurre de um lado e depois do outro: por que ele só segura num sentido? Quantos barbantes você precisa para travar o quadrado nos dois?",
    "fechamento": "O elo forte distribui a força; o nó firme une o esqueleto."
  },
  "3.2": {
    "title": "🌀 3.2 — A Lei da Reação",
    "subtitle": "Ação e reação no combate eterno contra o solo",
    "desc": "Se o prédio empurra o solo para baixo, o solo precisa ter energia rúnica suficiente para empurrar o prédio de volta com a mesma força exata.",
    "principal": "Quando você dá um passo na terra, o planeta inteiro empurra a sola do seu pé para cima com exatamente a mesma força que você faz para baixo!",
    "secreta1": "O Coice da Catapulta: ação e reação! Toda máquina de arremesso leva um tranco de volta ao disparar. O onagro, uma catapulta romana, dava um solavanco tão violento que, segundo o escritor romano Amiano Marcelino, uma base de pedra embaixo dele se despedaçava. Por isso ele ficava sobre torrões de terra ou tijolos, que amortecem o golpe. Já os grandes trabucos medievais de contrapeso tinham armações enormes que balançavam no disparo, e alguns até ganharam rodas para que a máquina pudesse se mexer. Por que será que deixar a máquina se mover pode ser melhor do que prendê-la com força ao chão?",
    "secreta2": "Prédios de Ventosa: num furacão, o vento que passa por cima do telhado o puxa para cima, como a asa de um avião! Por isso, em zonas de furacão, o telhado é amarrado às paredes com cintas de aço, e as paredes são presas à fundação com chumbadores. Tudo forma uma corrente contínua até o chão, e o peso da casa e da fundação segura o telhado. Mas uma corrente é tão forte quanto o seu elo mais fraco: se um só elo falhar, o telhado sai voando.",
    "dica": "💡 O equilíbrio estático exige que a soma de todas as forças verticais e reações das fundações resulte em zero absoluto.",
    "desafio": "De pé numa balança de banheiro, ao lado de uma mesa firme e pesada, anote o número e preveja: ele sobe ou desce se você apertar o tampo para baixo com as mãos, e se empurrar a borda de leve para cima, por baixo? Teste e explique: quem passou a empurrar você, e para que lado?",
    "fechamento": "Empurre a terra com sabedoria, e ela amparará os seus pés."
  },
  "3.3": {
    "title": "⚙️ 3.3 — A Régua Universal",
    "subtitle": "Densidade e o cálculo do peso próprio das coisas",
    "desc": "Um cubo de madeira não pesa o mesmo que um cubo de ferro. Dominar a densidade das substâncias é crucial para não sobrecarregar as colunas.",
    "principal": "O aço estrutural é incrivelmente denso: um metro cúbico deste metal pesa 7,8 toneladas, enquanto o mesmo volume de água pesa apenas 1 tonelada!",
    "secreta1": "Barcos de Concreto: Durante as guerras mundiais, devido à escassez de aço, foram construídos cargueiros inteiros feitos de concreto armado que flutuavam graças ao volume de água deslocado.",
    "secreta2": "A Fumaça Sólida: o aerogel de grafeno criado na China em 2013 é tão absurdamente leve que um bloco dele fica em pé sobre uma flor de cerejeira, ou na pontinha de uma espiga de capim, sem dobrá-la! O esqueleto de carbono pesa menos do que o ar que caberia no mesmo espaço... então por que ele não sai voando como um balão?",
    "dica": "💡 Num prédio de concreto, a maior parte do esforço de uma coluna (muitas vezes três quartos ou mais) serve só para aguentar o peso do próprio prédio acima dela: lajes, vigas, paredes e pisos. Pessoas e móveis pesam bem menos do que você imagina. O maior peso que um prédio carrega é ele mesmo! Leveza com resistência é o Santo Graal.",
    "desafio": "Com uma balança de cozinha, pese o mesmo copo cheio de água, depois de sal, depois de pipoca, descontando o copo vazio (200 mL de água devem dar uns 200 g: confira!). Se uma coluna tivesse de sustentar um bloco de cada, todos do mesmo tamanho, qual pediria a coluna mais forte, e quantas vezes mais que a da pipoca?",
    "fechamento": "A balança justa equilibra a matéria densa e a geometria leve."
  },
  "3.4": {
    "title": "🧪 3.4 — A Poção da Elasticidade",
    "subtitle": "A Lei de Hooke e o limite elástico dos metais",
    "desc": "O aço é como uma mola gigante. Desde que você não puxe demais, ele se deforma sob o peso e sempre volta ao tamanho original.",
    "principal": "O aço estrutural é um dos materiais mais elásticos do mundo, deformando-se linearmente em proporção exata à força aplicada!",
    "secreta1": "Relógio de Fita: os primeiros relógios portáteis apareceram no início dos anos 1500, logo depois da Idade Média, e eram pendurados no pescoço, não guardados no bolso! Eles funcionavam com uma fita de aço enrolada em espiral, a mola real. Mas a mola tinha um defeito: dava muita força quando estava bem enrolada e pouca quando estava quase solta, e o relógio adiantava ou atrasava. Nada de força constante! Para igualar a força, os relojoeiros usavam o fuso, um cone com um cordão enrolado, que dá mais alavanca justamente quando a mola está mais fraca. Consegue imaginar como um cone resolve isso?",
    "secreta2": "A Mola que Não Voltou: Se você esticar demais uma mola de metal, você ultrapassa o seu 'limite de escoamento' e ela nunca mais volta ao formato original. O mesmo acontece com as vigas metálicas sobrecarregadas: ficam deformadas para sempre. E o elástico de borracha? Ele é um bicho estranho: estica várias vezes o próprio tamanho e quase sempre volta, só fica um pouco mais mole depois do primeiro grande esticão. Ah, e atenção: nada disso é fadiga! Fadiga é o cansaço causado por esforços pequenos repetidos milhões de vezes (você vai enfrentá-la na runa 4.4).",
    "dica": "💡 Garanta sempre que as tensões de serviço do seu projeto fiquem bem abaixo do limite de proporcionalidade elástica do material.",
    "desafio": "No simulador, deixe a rigidez em 4 e ponha a extensão em 2, depois 4, depois 8: o que acontece com a força? Agora pendure num elástico um saquinho e vá pondo 1, 2, 3, 4, 5 punhados iguais de feijão, medindo com a régua quanto ele estica a cada punhado. O elástico segue a mesma regra do cabo do começo ao fim?",
    "fechamento": "Dobrar-se com honra para recuperar a postura é a dança da estabilidade."
  },
  "3.5": {
    "title": "🪞 3.5 — O Espelho das Forças",
    "subtitle": "A simetria espacial e a divisão justa de cargas",
    "desc": "Se o seu prédio for simétrico, o peso se divide de forma idêntica entre as colunas esquerda e direita, trazendo paz imediata ao esqueleto.",
    "principal": "Estruturas simétricas anulam naturalmente os momentos laterais de rotação, facilitando a vida dos construtores!",
    "secreta1": "O Desafio Assimétrico: o Museu Guggenheim de Bilbao, de Frank Gehry, tem curvas tão malucas que foi projetado com o CATIA, um programa criado para desenhar aviões de caça! O computador transformou as maquetes em números, calculou a posição de cada barra da estrutura de aço e o formato exato de cada uma das 33 mil chapas de titânio, e ainda guiou as máquinas que as cortaram. Pense bem: como você explicaria a um ferreiro o formato de uma parede que nunca é reta?",
    "secreta2": "O Peso da Lança: Se uma estátua medieval segurar uma alabarda comprida esticada para um lado, o centro de gravidade do conjunto escorrega para esse lado. Resultado: o pé desse lado passa a carregar mais peso do que o outro. E se o centro de gravidade sair da área entre os pés, a estátua tomba! Por isso os escultores costumam apoiar a ponta da alabarda no chão: ela vira um terceiro apoio e devolve o equilíbrio.",
    "dica": "💡 Se o projeto exigir assimetria, compense adicionando contrapesos ou fundações mais largas do lado mais carregado.",
    "desafio": "Uma viga leve, pendurada em dois cabos iguais, leva 60 kN bem no meio. No simulador, com rigidez 5, descubra quanto cada cabo estica. Agora a carga escorrega para perto do cabo esquerdo, que passa a segurar 40 kN: quanto estica cada cabo, e para que lado a viga se inclina?",
    "fechamento": "Na divisão igual de deveres estruturais reside a estabilidade do reino."
  },
  "3.6": {
    "title": "🗝️ 3.6 — A Chave-Mestra",
    "subtitle": "Alavancas, momentos e o binário de forças",
    "desc": "Uma força não vale só pelo seu tamanho (medido em newtons; o kg mede massa!). O poder que ela tem de fazer algo girar, chamado momento, depende também da distância até o apoio. Duvida? Tente abrir uma porta empurrando bem pertinho da dobradiça. O momento fletor é o pior pesadelo do iniciante.",
    "principal": "Contam escritores antigos, que viveram séculos depois dele, que o matemático e engenheiro Arquimedes, encantado com as máquinas que multiplicam a força, teria dito: \"Dê-me um lugar onde me apoiar, e eu moverei a Terra!\" Hoje a frase é lembrada como o grito de guerra da alavanca. Mas faça as contas: que comprimento essa alavanca precisaria ter? E onde, no espaço, ficaria o ponto de apoio?",
    "secreta1": "O Guindaste dos Imperadores: os romanos erguiam blocos de várias toneladas com o polyspastos, um guindaste de madeira cheio de polias que multiplicavam a força. O motor? Homens caminhando dentro de uma enorme roda de madeira, como hamsters numa rodinha! Estudiosos de hoje estimam que, com essa roda, o guindaste levantasse cerca de 6 toneladas. E quem eram esses caminhantes? Vitrúvio, o engenheiro romano que descreveu a máquina, escreveu só 'homens'. Podiam ser escravos, trabalhadores livres pagos por dia, ou os dois. A fonte não conta. E você, como descobriria?",
    "secreta2": "O Segredo da Chave de Rodas: É muito mais fácil afrouxar o parafuso enferrujado de um carro se você alongar o braço da chave, pois você gera um momento de rotação muito maior com o mesmo esforço.",
    "dica": "💡 Momento é igual a Força multiplicada pela Distância. Vigas longas sem apoios intermediários geram momentos massivos nas paredes de fixação.",
    "desafio": "Equilibre uma régua de 30 cm sobre um lápis, na marca de 15 cm, e empilhe 2 moedas iguais a 5 cm do lápis: preveja e teste onde 1 moeda sozinha equilibra do outro lado. E se fossem 4 moedas empilhadas no mesmo lugar, onde teria de ficar a moeda solitária, e o que Arquimedes pediria para resolver?",
    "fechamento": "A distância multiplica a força; o mestre domina o braço da alavanca."
  },
  "4.1": {
    "title": "😠 4.1 — O \"Estresse\" (Tensão)",
    "subtitle": "Força dividida pela área da seção transversal",
    "desc": "Tensão é a medida do estresse que as moléculas sentem ao ser espremidas. Pense nisso como a densidade da força dentro do material.",
    "principal": "Uma mulher caminhando com sapatos de salto agulha exerce mais pressão sobre o piso do que um elefante de 4 toneladas apoiado nas suas quatro patas largas!",
    "secreta1": "Estresse Rúnico Programado: Vidros de carros são temperados de forma a terem tensões internas constantes. Se você bater neles, eles se fragmentam em pequenos cubos inofensivos em vez de lançar lâminas afiadas.",
    "secreta2": "O Ponto Fraco do Couro: quando uma corrente é puxada com força, os elos costumam se romper nas curvas das pontas. Mas espere: o arame tem a mesma grossura no elo inteiro! Então por que ali? Porque na curva o elo não é só esticado: ele também é dobrado e ainda é espremido pelo elo vizinho. E, com o uso, o atrito entre os elos vai gastando justamente essa curva. Esforço extra num lugar que vai ficando mais fino: é por ali que as rachaduras costumam começar.",
    "dica": "💡 Para acalmar o estresse molecular do seu material, aumente a área útil da viga ou engrosse a coluna.",
    "desafio": "Segure uma lapiseira entre as palmas das mãos (pouco grafite para fora, a ponta numa palma e a borracha na outra) e aperte de leve por 3 segundos, sem forçar. A lapiseira empurra as duas palmas com a mesma força: então por que uma delas reclama muito mais? Explique com a ideia de tensão desta runa.",
    "fechamento": "A tensão é o clamor microscópico da matéria sob pressão."
  },
  "4.2": {
    "title": "🥨 4.2 — Mudar de Forma (Deformação)",
    "subtitle": "Alongamentos e encurtamentos microscópicos",
    "desc": "Tudo no universo se deforma quando pressionado. Até a rocha mais sólida do castelo encolhe alguns micrômetros sob o peso das ameias.",
    "principal": "Todas as estruturas de concreto ou aço se deformam ligeiramente sob cargas comuns, mesmo que essa mudança seja imperceptível a olho nu!",
    "secreta1": "O Prédio que Encolhe: arranha-céus de concreto encolhem! Enquanto os andares de cima ainda estão subindo, os pilares de baixo já vão sendo espremidos pelo peso. Depois, o concreto continua perdendo água e se contraindo (retração) e vai se deformando bem devagar sob a carga (fluência). Nas torres mais altas isso passa de 10 centímetros: no Burj Khalifa, o prédio mais alto do mundo, os engenheiros calcularam uns 30 centímetros! A maior parte acontece nos primeiros anos, mas o encolhimento continua, cada vez mais lento, por décadas. Por isso os engenheiros constroem cada andar um tiquinho mais alto do que o desenho manda. Quanto mais alto você acha que o 100º andar precisa nascer?",
    "secreta2": "A Cedência Plástica: Se você ultrapassar a zona de deformação elástica, o aço se deforma plasticamente de forma irreversível, esticando como massinha de modelar até romper.",
    "dica": "💡 Projete as estruturas para terem deformações dentro de limites controláveis para evitar rachaduras em tetos e vidros de janelas.",
    "desafio": "Pendure um estojo leve num elástico e meça com a régua quanto ele esticou; depois repita com dois elásticos iguais emendados em fila. Preveja antes: o esticão muda? Meça e divida cada esticão pelo comprimento do elástico (ou da fila) antes de pendurar: o que você descobre?",
    "fechamento": "Ceder com elegância é o truque de mágica que afasta a ruptura fria."
  },
  "4.3": {
    "title": "🦹 4.3 — Os 5 Super Vilões",
    "subtitle": "Tração, compressão, flexão, torção e cisalhamento",
    "desc": "Estes são os cinco demônios da física que tentam quebrar e rasgar as vigas e os pilares das nossas fortificações.",
    "principal": "Qualquer colapso estrutural no planeta Terra é causado por um destes cinco esforços elementares ou pela sua perigosa combinação!",
    "secreta1": "A Tragédia de Tacoma Narrows: em 1940, um vento de quase 70 km/h (forte, mas nada de furacão) fez o tabuleiro de uma ponte pênsil começar a torcer. Cada torção mudava o jeito como o ar passava pela ponte, e o ar empurrava ainda mais: um ciclo que se alimentava sozinho, chamado drapejamento (flutter, em inglês). Não foi uma simples ressonância, como muita gente pensa! A ponte se retorceu como uma fita ao vento até o tabuleiro do vão central se partir e despencar na água, enquanto as torres continuaram de pé. Enigma: como um vento que sopra quase sempre igual pode criar um balanço que só aumenta?",
    "secreta2": "Cisalhamento de Cisne: O cisalhamento é a força que tenta rasgar uma seção paralela à outra, como o corte limpo de uma guilhotina.",
    "dica": "💡 Identifique qual vilão está ativo em cada seção da viga para escolher a armadura de aço correta para o seu concreto.",
    "desafio": "Desenhe uma grade de quadradinhos numa esponja de cozinha e então estique, aperte, dobre, torça e, segurando a base, empurre o topo para o lado. Em quais vilões os quadradinhos viram paralelogramos (será que é só um)? E quando você dobra a esponja, que lado espreme e qual estica?",
    "fechamento": "Os cinco demônios do colapso vigiam as fraquezas da sua fundação."
  },
  "4.4": {
    "title": "😴 4.4 — A Fadiga do Herói",
    "subtitle": "Como as vibrações repetidas cansam o metal",
    "desc": "O aço pode aguentar uma força gigante de uma vez, mas racha sob forças pequeninas se essas forças forem aplicadas e retiradas milhões de vezes.",
    "principal": "Você consegue quebrar um clipe de papel muito facilmente apenas dobrando-o repetidas vezes para a frente e para trás com os dedos!",
    "secreta1": "O Cansaço dos Eixos: em 1842, na ferrovia entre Versalhes e Paris, o eixo de ferro de uma locomotiva se partiu. O trem descarrilou, os vagões se amontoaram e pegaram fogo, e dezenas de passageiros morreram. O eixo tinha 'cansado': a cada volta da roda, o metal era dobrado para um lado e para o outro. Uma trinca minúscula foi crescendo, escondida, volta após volta. Na época, nem existia o conceito de fadiga: muitos achavam que o ferro 'cristalizava' com o tempo. Pouco depois, o engenheiro Rankine mostrou que essas trincas nascem em cantos vivos da peça. Como pode um metal forte se quebrar com uma força que ele sempre aguentou?",
    "secreta2": "Vento Vibratório: os cabos das pontes estaiadas podem começar a balançar com um vento apenas moderado. O caso mais curioso acontece com vento e chuva juntos: a água que escorre forma um 'trilho' no cabo e muda o jeito como o ar passa por ele, e o cabo começa a dançar. Milhões de oscilações repetidas podem cansar o aço com o tempo. Por isso muitos cabos ganham amortecedores e uma espiral em relevo na capa. Da próxima vez que cruzar uma ponte estaiada, procure essa espiral: para que ela serve?",
    "dica": "💡 Evite cantos retos em peças metálicas sujeitas a vibrações; os cantos arredondados suavizam o fluxo de estresse e evitam o início de trincas.",
    "desafio": "No simulador, ponha o Estresse por Ciclo em 40, depois em 60 e em 80 MPa, clicando em Aplicar Ciclo de Força até a peça romper e anotando os ciclos. Depois desça até aparecer o ∞. Esse ∞ garante que a peça nunca vai quebrar? Pense numa peça de alumínio, ou num caminhão pesado demais passando de vez em quando.",
    "fechamento": "Até as pedras mais duras se cansam se o combate se repetir sem tréguas."
  },
  "4.5": {
    "title": "🛡️ 4.5 — O Fator de Segurança",
    "subtitle": "Multiplicar a resistência para salvaguardar vidas",
    "desc": "Nunca projetamos uma viga bem no limite da força. Adicionamos uma margem generosa de segurança para absorver tempestades e erros humanos.",
    "principal": "Os cabos dos elevadores de passageiros têm uma folga enorme! Pela norma europeia, juntos eles precisam aguentar PELO MENOS 12 vezes a força que sofrem com a cabine lotada, e 16 vezes se forem só dois cabos. Nos Estados Unidos, o mínimo vai de cerca de 7,6 a 12 vezes, e quanto mais rápido o elevador, maior a folga. Por que será que aqui os engenheiros exageram tanto, se num prédio a folga total fica perto de 2?",
    "secreta1": "Olho por Olho na Babilônia: No famoso Código de Hamurabi, se um edifício desabasse e matasse o filho do proprietário, o próprio filho do construtor era executado!",
    "secreta2": "Segurança Aeroespacial: Ao contrário dos prédios, os foguetes usam fatores de segurança baixos, de cerca de 1,25 a 1,4, porque cada quilo de estrutura a mais é um quilo a menos de carga levada ao espaço. O preço disso? Os engenheiros precisam conhecer as cargas e os materiais com enorme precisão, seguir processos de fabricação rigorosamente controlados e testar tudo antes do voo. Quanto menos folga, mais conhecimento é preciso!",
    "dica": "💡 Em obras civis, as normas usam dois escudos: no cálculo, as cargas são 'infladas' e os materiais são 'enfraquecidos'. Num prédio de concreto no Brasil, tanto o peso próprio quanto as cargas variáveis (vento, multidões) são multiplicados por 1,4, enquanto a resistência do concreto é dividida por 1,4 e a do aço por 1,15. Na Europa, as cargas imprevisíveis levam um fator maior (1,5) do que o peso próprio, que é mais conhecido (1,35). Junte os dois escudos do concreto: qual é a folga total?",
    "desafio": "Sua ponte de aço trabalha a 20 MPa no dia a dia, mas num temporal o esforço sobe 50%: teste 20 e depois 30 MPa no simulador com Aplicar Ciclo de Força. Ela aguenta temporais repetidos? Qual o maior esforço do dia a dia que deixaria até o temporal sem passar de 25 MPa? Calcule e confira.",
    "fechamento": "A margem do sábio protege o repouso do inocente."
  },
  "4.6": {
    "title": "🥋 4.6 — Poderes Diferentes por Material",
    "subtitle": "A liga metálica, a pedra antiga e as fibras modernas",
    "desc": "Cada material tem uma personalidade estrutural. A pedra adora ser esmagada; a madeira é flexível e leve; o aço aguenta puxões e empurrões como poucos, mas também tem inimigos: a ferrugem, o fogo, a fadiga e a flambagem (quando uma peça fina demais, comprimida, entorta de lado).",
    "principal": "O concreto armado é excelente na compressão; o aço heroico resiste à tração; a madeira macia amortece choques e vibrações.",
    "secreta1": "Fios de Seda Estruturais: o fio de segurança da aranha (o mesmo da moldura e dos raios da teia) é, pelo mesmo peso, cerca de 5 vezes mais forte do que o aço. E ele tem outro truque: estica cerca de um quarto do próprio comprimento antes de arrebentar, e por isso absorve cerca de 3 vezes mais energia do que o Kevlar, a fibra dos coletes à prova de bala. Por que esticar seria tão útil para parar uma mosca em pleno voo?",
    "secreta2": "Fibra de Carbono Arcana: tecidos de fibra de carbono, colados com resina como um curativo gigante, reforçam vigas e pontes de concreto quase sem acrescentar peso. Em pontes de pedra antigas, o feitiço já foi testado em laboratório (alguns arcos aguentaram duas, três vezes mais carga!) e em algumas obras, mas os guardiões do patrimônio discutem: depois de colado, ele é muito difícil de tirar sem estragar a pedra. E tem limite: se o tecido descolar, o reforço some, então as regras exigem que a estrutura original ainda aguente sozinha boa parte da carga. Por que será que os engenheiros não confiam tudo ao feitiço?",
    "dica": "💡 Conhecer a fobia de cada material evita desastres: nunca use pedra ou concreto puro para segurar forças de tração diagonal.",
    "desafio": "Puxe uma tira de papel pelas pontas e depois empurre uma ponta contra a outra; faça o mesmo com um giz de lousa: aperte pelas pontas e depois tente dobrá-lo. Qual material é bom de puxão e qual é bom de aperto? Como você juntaria os dois numa viga que não quebra?",
    "fechamento": "Cada material guarda uma runa de força; o mestre combina as suas naturezas."
  },
  "5.1": {
    "title": "⚖️ 5.1 — A Regra da Estátua (Equilíbrio)",
    "subtitle": "Soma de forças e momentos igual a zero",
    "desc": "A primeira regra de ouro da engenharia civil é que a estrutura deve ficar parada! Nenhum movimento horizontal, vertical ou rotação é permitido.",
    "principal": "Um guindaste de torre tem um contrapeso na traseira. Mas pense neste enigma: a carga muda a cada içamento e o carrinho corre para a frente e para trás na lança... como um contrapeso FIXO poderia anular EXATAMENTE o momento da carga? Não pode! Ele é escolhido como um meio-termo: sem carga, o guindaste tende a girar para trás; com carga, para a frente. O momento que sobra desce pela torre até uma fundação pesada. Por isso todo guindaste tem uma tabela de carga (quanto mais perto da ponta, menos peso ele pode erguer) e um limitador de momento, que trava o içamento perto do limite. Se alguém passar do limite, o equilíbrio falha e o guindaste pode tombar!",
    "secreta1": "O Centro de Massa Sagrado: A Torre de Pisa se inclina assustadoramente, mas não cai porque o seu vetor de peso total ainda chega ao chão dentro do perímetro de suporte da sua base.",
    "secreta2": "Boneco Teimoso: Brinquedos que se levantam sozinhos usam uma base semiesférica superpesada que coloca o centro de gravidade no ponto mais baixo possível, forçando o equilíbrio.",
    "dica": "💡 Para equilibrar momentos, lembre-se de que a força rotacional de um lado do apoio deve ser anulada pela força do lado contrário.",
    "desafio": "Equilibre uma régua de 30 cm pelo meio, sobre um lápis. Ponha 2 moedas empilhadas a 5 cm do centro e ache onde 1 moeda igual, do outro lado, deixa tudo parado; depois leve as 2 moedas para 10 cm e tente de novo. O que aconteceu, e o que isso revela sobre a tabela de carga de um guindaste?",
    "fechamento": "A imobilidade é o estado de paz mecânica que anula o peso do mundo."
  },
  "5.2": {
    "title": "💨 5.2 — Os Inimigos (Forças)",
    "subtitle": "Mapeamento de cargas móveis, ventos e terremotos",
    "desc": "Quem tenta derrubar o nosso castelo? Mapear as cargas móveis e as forças da natureza é o passo inicial de qualquer dimensionamento.",
    "principal": "Pontes urbanas precisam suportar não apenas o peso próprio das suas vigas, mas também a carga dinâmica de milhares de caminhões em movimento!",
    "secreta1": "O Peso da Neve Alquímica: Em climas frios, os mestres-construtores calculam quanto pesa a neve que pode se juntar no telhado. Quanto mais inclinado ele é, mais fácil a neve escorrega, e menos peso as vigas precisam aguentar. Acima de uns 60°, os livros de regras nem contam mais a neve! Mas nem todo telhado de montanha é pontudo: muitos chalés dos Alpes têm telhados largos e pouco inclinados, de propósito, para a neve ficar em cima como um cobertor que guarda o calor da casa. Aí as vigas precisam ser bem mais fortes. E cuidado: neve que escorrega toda de uma vez cai como uma avalanche em miniatura em cima de quem passa embaixo!",
    "secreta2": "Liquefação do Solo: Durante terremotos fortes, um chão de areia encharcada pode perder a firmeza de repente e passar a se comportar como um líquido grosso. Em Niigata, no Japão, em 1964, prédios de apartamentos de 4 andares afundaram e tombaram de lado. Um deles ficou quase deitado, inclinado uns 80°! E mesmo assim, em alguns prédios, nem as janelas quebraram. O prédio aguentou firme. Quem traiu foi o chão.",
    "dica": "💡 Cargas permanentes (as 'cargas mortas') ficam lá para sempre: o peso próprio da estrutura, das paredes e dos pisos. Cargas variáveis vêm e vão: as cargas de uso, ou 'cargas vivas' (pessoas, móveis), e as forças da natureza, como o vento, que têm regras de cálculo próprias. Mapeie todas com rigor e descubra qual combinação delas é a mais traiçoeira!",
    "desafio": "Com o vão do painel em 6 m, preveja antes de testar: que carga P, parada bem no meio da ponte, leva o momento a 60 kN·m? Depois pense nos outros inimigos: o vento, que empurra a ponte de lado, e a neve, espalhada por ela toda, caberiam nesse controle? Por quê?",
    "fechamento": "Enxergar o inimigo invisível é a primeira virtude do bom construtor."
  },
  "5.3": {
    "title": "👟 5.3 — Os Pés no Chão (Apoios)",
    "subtitle": "Apoios articulados, roletes e o engaste perfeito",
    "desc": "Como a nossa viga toca as colunas? A forma como amarramos as extremidades determina como o esqueleto do prédio descarrega as tensões.",
    "principal": "Um engaste perfeito bloqueia todos os movimentos e rotações (como um poste de iluminação profundamente engastado no concreto da calçada)!",
    "secreta1": "Pontes sobre Patins: Grandes viadutos de rodovia se apoiam em blocos de borracha grossa (neoprene) para permitir que a ponte se dilate com o sol do verão sem rachar os pilares.",
    "secreta2": "Isolamento Sísmico: Muitos prédios modernos no Japão, até alguns bem altos, não ficam presos direto ao chão. Eles se apoiam em grandes almofadas feitas de camadas de borracha e aço, algumas com um miolo de chumbo, e em amortecedores a óleo. Quando a terra treme, o chão se mexe rápido embaixo, e o prédio balança devagar em cima, como um barco numa onda lenta.",
    "dica": "💡 Apoios articulados deixam a viga girar ligeiramente, reduzindo as tensões internas nos pilares de sustentação.",
    "desafio": "Apoie uma régua de plástico entre duas pilhas de livros, só encostada, e aperte o meio com o dedo, de olho nas pontas. Depois prenda as pontas com livros pesados por cima e aperte com a mesma força. Em qual caso ela verga menos, e o que exatamente os livros de cima impediram as pontas de fazer?",
    "fechamento": "A flexibilidade do pé garante a estabilidade do topo."
  },
  "5.4": {
    "title": "🌉 5.4 — Vãos e Vigas",
    "subtitle": "A distância horizontal e a deflexão central",
    "desc": "Quanto maior o espaço entre duas colunas, mais a viga central vai vergar com o peso. Aprenda a controlar a deflexão geométrica.",
    "principal": "O momento fletor gerado no centro de uma viga suspensa cresce de forma quadrática em proporção direta à distância do vão livre!",
    "secreta1": "O Recorde do Vão Suspenso: A ponte de Çanakkale na Turquia possui o maior vão livre central do planeta, sustentando mais de 2 quilômetros de estrada sem pilares de apoio na água!",
    "secreta2": "O Perfil em I: Vigas de metal têm o formato da letra I porque o estresse de dobrar se concentra todo no topo (compressão) e na base (tração), permitindo esvaziar o miolo para economizar aço.",
    "dica": "💡 Se você dobrar a distância entre os pilares de suporte, a deflexão (barriga) no centro da viga aumenta 16 vezes!",
    "desafio": "No painel, ponha L = 4 m e P = 20 kN e anote o momento. Uma viga duas vezes mais comprida também pesa o dobro: leve L para 8 e P para 40 e compare. Quantas vezes o momento cresceu, quantas cresceria dobrando só o vão, e por que vigas compridas sofrem mais do que parece?",
    "fechamento": "Estender caminhos sobre o vazio é triunfar sobre a gravidade."
  },
  "5.5": {
    "title": "🎒 5.5 — Cargas Vivas vs Cargas Mortas",
    "subtitle": "O peso do próprio corpo contra a carga da vida útil",
    "desc": "O esqueleto estrutural precisa carregar duas coisas: o peso dos seus próprios materiais pesados e a carga mutável das pessoas que o habitam.",
    "principal": "Numa grande catedral de pedra, quase toda a carga que as fundações suportam vem do peso das próprias pedras! Lote a catedral de gente, coloque todos os bancos e ainda junte neve no telhado: tudo isso é quase nada perto das paredes, dos pilares e das abóbadas. O maior desafio de quem construía uma catedral era fazer ela aguentar... ela mesma.",
    "secreta1": "O Peso da Sabedoria: Engenheiros de bibliotecas públicas usam fatores de carga viva especiais porque o papel prensado de milhares de livros guardados pesa muito mais do que mobiliário comum.",
    "secreta2": "A Ressonância de Multidões: Quando milhares de pessoas pulam no mesmo ritmo num show, criam impactos repetidos que podem fazer uma bancada de estádio balançar de um jeito assustador. E, se a estrutura tiver um ponto fraco, ela pode até ceder: em 2021, no estádio Goffert, na Holanda, um pedaço de arquibancada desabou enquanto torcedores pulavam comemorando um gol. Por sorte, ninguém se feriu, e a investigação achou um erro de cálculo no projeto. Por isso os engenheiros calculam o 'ritmo natural' de cada bancada, para que ele fique bem longe do ritmo dos pulos.",
    "dica": "💡 Para aliviar o esqueleto, tente usar divisórias de parede leves (como gesso acartonado) no interior do seu edifício.",
    "desafio": "Duas passarelas de faz de conta, com vão de 10 m no painel: uma pesada de concreto (P = 35) e uma leve de aço (P = 15). Ponha 10 kN de gente em cada uma (45 e 25) e compare com o momento sem ninguém. Em qual a multidão pesa mais na conta, em proporção, e qual você acha que vai sentir mais os pulos de um show?",
    "fechamento": "O esqueleto ergue a matéria própria para poder acolher com segurança o sopro da vida."
  },
  "5.6": {
    "title": "🦴 5.6 — Osso Extra de Segurança",
    "subtitle": "Redundância hiperestática contra colapsos repentinos",
    "desc": "O que acontece se uma coluna falhar na batalha? Um bom esqueleto tem caminhos alternativos para as forças fugirem sem que o prédio caia.",
    "principal": "Sistemas hiperestáticos têm redundância mecânica: se um elemento de suporte for destruído, os vizinhos absorvem a carga imediatamente!",
    "secreta1": "O Exemplo das Torres Gêmeas: No terrível ataque de 2001, as torres não caíram na hora porque sua estrutura era hiperestática, cheia de caminhos alternativos para a carga. As colunas da fachada eram unidas por chapas de aço e, junto com os pisos e uma grande treliça no topo, essa trama desviou o peso das colunas destruídas para as que continuaram inteiras. A Torre Sul resistiu 56 minutos e a Torre Norte, 102. Foi o fogo, amolecendo o aço, que acabou derrubando as duas.",
    "secreta2": "O Perigo Isostático: Uma viga simplesmente apoiada não tem nenhum apoio sobrando: cada um é indispensável. Se você quebrar uma única coluna de apoio, as forças não têm outro caminho, e a viga despenca sem aviso. Quanto tempo ela leva? Para cair só 1 metro, um objeto leva quase meio segundo. Parece pouco, mas é tempo de sobra para a física agir e curto demais para alguém sair correndo de baixo dela!",
    "dica": "💡 Crie sempre ligações hiperestáticas em vigas contínuas; isso dá segurança e margem de tempo crucial em caso de acidente.",
    "desafio": "Faça uma ponte com uma régua sobre três pilhas de livros, com uma borracha no meio de cada vão, e puxe devagar a pilha do meio: a ponte caiu ou só vergou? Repita com só duas pilhas e tire uma. Qual ponte tinha um osso extra, e o que a régua precisou ter de sobra para vencer, de repente, o dobro do vão?",
    "fechamento": "Vários caminhos para as forças garantem o repouso do esqueleto rúnico."
  },
  "6.1": {
    "title": "⚔️ 6.1 — A Batalha Final",
    "subtitle": "O teste de esforço derradeiro das nossas metrópoles",
    "desc": "Músculos (Materiais) e Esqueletos (Análise) se unem no combate contra os cinco super-vilões mecânicos sob uma tempestade simulada.",
    "principal": "A boa engenharia é a conciliação perfeita entre a espessura do pilar, a resistência do concreto e o percurso dos vetores de força!",
    "secreta1": "A Queda das Catedrais: Numa noite de novembro de 1284, parte da abóbada da catedral de Beauvais desabou. Era a abóbada gótica mais alta já construída, com cerca de 48 m. Até hoje os engenheiros discutem o porquê. Uns culpam uma tempestade que torceu e quebrou os arcobotantes. Outros culpam pilares finos demais, que foram se entortando devagar sob o peso. Uma pista para você investigar: na reconstrução, os mestres dobraram o número de pilares do coro para encurtar os vãos. O que isso sugere sobre a causa?",
    "secreta2": "O Pêndulo de Taipé: Bem no alto da torre Taipei 101, mas não na ponta, entre os andares 87 e 92, fica pendurada uma esfera dourada de aço de 660 toneladas. Quando o vento de um tufão empurra o prédio para um lado, ela balança para o lado contrário e corta o balanço da torre em até cerca de 40%. Em 2015, no tufão Soudelor, ela chegou a se deslocar 1 metro! Nos terremotos ela também ajuda um pouco, mas o grande escudo contra os tremores é outro: o esqueleto gigante de megapilares e treliças da própria torre.",
    "dica": "💡 Na fusão dos dois reinos, lembre-se: a forma do esqueleto deve amparar o limite elástico do seu músculo molecular.",
    "desafio": "Apoie um caderno leve sobre 4 tubos de papel enrolado, um em cada canto, e tire um deles: o que acontece? Agora arrume tubos extras para poder tirar QUALQUER tubo sem o caderno tombar, usando o menor número de tubos que conseguir. Quantos você usou e onde ficaram, e por que um pilar que parece sobrando pode salvar a estrutura?",
    "fechamento": "Na aliança das partes ergue-se o colosso que nenhuma força vergará."
  },
  "6.2": {
    "title": "🤝 6.2 — O Selo dos Dois Reinos",
    "subtitle": "A chancela oficial da estabilidade e resistência",
    "desc": "O seu selo de Engenheiro Mágico gravado na pedra atesta a segurança do projeto. Assinar a obra é um pacto de honra e integridade.",
    "principal": "A assinatura de um engenheiro habilitado nos planos oficiais é um juramento com força de lei. No Brasil, ela fica registrada numa ART, a Anotação de Responsabilidade Técnica, no CREA. Mas atenção: ninguém carrega sozinho o prédio inteiro! Quem projeta responde pelo projeto, e quem constrói assina outra ART e responde pela obra. Cada guardião jura pela sua parte das vidas que vão morar ali.",
    "secreta1": "A Lenda do Construtor Romano: Conta uma lenda famosa que, na Roma Antiga, o construtor precisava ficar debaixo do arco quando tiravam o cimbre, a armação de madeira que segura o arco enquanto ele é construído. Mas os historiadores nunca acharam essa regra em nenhum texto antigo: a versão escrita mais antiga que se conhece é de um fórum da internet de 2004! Já esta lei existiu de verdade: há mais de 3.700 anos, o Código de Hamurabi, da Babilônia, mandava executar o construtor cuja casa desabasse e matasse o dono.",
    "secreta2": "Chancelas de Chumbo: No Império Bizantino, cartas e documentos oficiais eram fechados com selos de chumbo (às vezes de cera, ou até de ouro) para provar quem os tinha enviado. Muito antes, os romanos já gravavam nos próprios canos de chumbo o nome do imperador, do dono ou do fabricante. Assim dava para saber de quem era cada cano e flagrar quem fazia ligações clandestinas para roubar água!",
    "dica": "💡 Antes de o concreto engolir o aço para sempre, o engenheiro responsável pela obra confere cada barra da armadura com o projeto: a bitola, a quantidade, o espaçamento e a posição. Depois da concretagem, nenhum olho consegue enxergar um erro escondido lá dentro!",
    "desafio": "Antes de assinar a ART, teste o limite: arraste o controle Segurança para a esquerda até aparecer o aviso de perigo. Qual é o menor valor que ainda passa sem aviso? Você assinaria a obra exatamente nesse número, sabendo que responde pelas vidas lá dentro, e por quê?",
    "fechamento": "A palavra gravada do mestre dá estabilidade ao reino dos homens."
  },
  "6.3": {
    "title": "🎓 6.3 — O Diploma do Engenheiro Mágico",
    "subtitle": "A sagração oficial do aprendiz a mestre arquiteto",
    "desc": "Receber o diploma de mestre é o reconhecimento de que você domina a matemática celeste e os segredos profundos da física dos sólidos.",
    "principal": "A primeira escola formal de Engenharia Civil do mundo (École des Ponts et Chaussées) foi fundada em Paris no ano de 1747!",
    "secreta1": "O Anel de Ferro de Ritual: No Canadá, quem termina engenharia pode receber, num ritual, um anel simples (os primeiros eram de ferro; hoje a maioria é de aço inoxidável) para lembrar a responsabilidade. Diz a lenda que os anéis foram forjados com o metal da Ponte de Quebec, que desabou em 1907 por erros de projeto e de cálculo. Mas é só lenda: os primeiros foram martelados à mão por veteranos da Primeira Guerra num hospital militar de Toronto!",
    "secreta2": "A Academia Real: Muito antes de D. Pedro II, em 1792, o Rio de Janeiro já tinha a Real Academia de Artilharia, Fortificação e Desenho. Ali se formavam engenheiros militares e também civis, com aulas de pontes, canais, estradas e hidráulica, e dela descendem o IME e a Escola Politécnica da UFRJ! Por aqui ela é chamada de primeira escola de engenharia das Américas, mas o México abriu seu Real Seminário de Mineração em janeiro daquele mesmo ano. Quem chegou primeiro? Depende do que você conta como 'escola de engenharia'...",
    "dica": "💡 O diploma abre as portas do reino, mas é a sua humildade e atenção no canteiro de obras diário que transformará você num verdadeiro mestre.",
    "desafio": "Prenda um elástico de cabelo, sem apertar, no dedo mínimo da mão com que você escreve e desenhe uma ponte: onde ele encosta? Engenheiros canadenses usam o Anel de Ferro nesse mesmo dedo. Por que um lembrete que raspa no papel a cada traço pode funcionar melhor do que um diploma pendurado na parede?",
    "fechamento": "A fundação do saber é o diploma; a sua catedral se ergue todos os dias."
  },
  "6.4": {
    "title": "🏙️ 6.4 — A Cidade Completa",
    "subtitle": "Cidades inteligentes, infraestruturas e vias elevadas",
    "desc": "Nenhum edifício vive sozinho. Ruas, pontes, redes de água e saneamento trabalham juntas para manter o grande reino habitável e saudável.",
    "principal": "Uma metrópole funcional é uma criatura viva, onde os viadutos são as artérias e os canos de água são os tendões de abastecimento!",
    "secreta1": "A Higiene de Pompeia: A cidade romana de Pompeia tinha pedras elevadas no meio das ruas, como faixas de pedestre, para que as pessoas atravessassem sem tocar na água suja, e canos de chumbo sob as calçadas.",
    "secreta2": "Metrópoles Flutuantes: Existem planos contemporâneos para criar bairros modulares flutuantes ancorados que sobem e descem conforme a maré dos oceanos, adaptando-se às mudanças do clima.",
    "dica": "💡 Projete as estruturas pensando sempre em como as redes de energia, água e tráfego vão se conectar sem danificar as vigas de suporte.",
    "desafio": "Arraste Estética até 90 e leia o aviso. Em 2007, leitores de uma revista médica britânica elegeram a água limpa e a coleta de esgoto o maior avanço da medicina desde 1840. Se o simulador ganhasse um 3º controle, Saneamento, dentro dos mesmos 100 pontos, de onde você tiraria pontos para ele, e por quê?",
    "fechamento": "A grande cidade é o mosaico harmonioso onde as pedras individuais se amparam mutuamente."
  },
  "6.5": {
    "title": "🧠 6.5 — O Desafio do Mestre",
    "subtitle": "Resolver imprevistos complexos no canteiro de obras",
    "desc": "A teoria é limpa, mas a lama da obra traz surpresas. O verdadeiro engenheiro se destaca quando resolve crises inesperadas na fundação.",
    "principal": "Quando algo dá errado no meio da obra, nem sempre dá tempo de refazer o projeto inteiro: o engenheiro precisa achar uma solução segura e rápida usando os princípios da física, como o equilíbrio, o caminho das forças e a resistência dos materiais. Improvisar com ciência é bem diferente de improvisar no chute! E quem conhece a obra de perto, como o mestre de obras, costuma ser o melhor parceiro nessa hora.",
    "secreta1": "Desencalhar com a Lua: Em março de 2021, o gigantesco porta-contêineres Ever Given, com 400 metros de comprimento, ficou atravessado no Canal de Suez, com a proa cravada no barranco. Durante seis dias, os engenheiros dragaram cerca de 30 mil metros cúbicos de areia e argila e puxaram o navio com mais de uma dezena de rebocadores. E tinham um aliado no céu: a lua cheia trouxe uma maré de sizígia, capaz de subir a água do canal até uns 45 centímetros a mais. Com tudo isso junto, no dia 29 de março o gigante finalmente flutuou. Pense: como a Lua, a 384 mil km daqui, consegue ajudar a mover um navio de mais de 200 mil toneladas?",
    "secreta2": "Congelar a Terra: Escavar um túnel em areia encharcada é pedir para tudo desmoronar. Para abrir passagens entre túneis debaixo de Londres (até sob o rio Tâmisa!), os engenheiros cravam canos no solo e fazem circular por eles salmoura a mais de 30 graus abaixo de zero. Em obras pequenas ou de emergência, às vezes usam nitrogênio líquido, a 196 graus abaixo de zero, que também corre dentro dos canos e depois escapa para o ar como gás: ele nunca é injetado direto na terra. A água entre os grãos vira gelo e 'cola' a areia como se fosse rocha, e o solo precisa continuar congelado até o revestimento de concreto do túnel endurecer e aguentar sozinho. Já para cavar a estação de metrô de Westminster, colada ao Big Ben, o truque foi outro: injetar argamassa no solo, aos poucos, para compensar a terra escavada e não deixar a torre entortar perigosamente. E repare: o concreto não 'seca'. Ele endurece numa reação química com a água!",
    "dica": "💡 Se o solo ceder de surpresa na sua obra, suspenda as cargas secundárias e reforce a base com estacas de injeção de concreto sob pressão.",
    "desafio": "Imprevisto: o solo cedeu e a cidade agora exige Segurança 75, sem nenhum ponto a mais no orçamento; ponha o controle em 75 e leia o aviso. Segurança e beleza precisam mesmo disputar os mesmos pontos? Invente ou descubra uma peça de construção que proteja e embeleze ao mesmo tempo e explique como ela dribla a regra do simulador.",
    "fechamento": "O obstáculo inesperado é a bigorna onde se forja a verdadeira perícia."
  },
  "6.6": {
    "title": "🌟 6.6 — O Salão da Fama",
    "subtitle": "Os gigantes da história da mecânica e da construção",
    "desc": "Preste homenagem aos heróis do passado que rasgaram os céus com as suas estruturas, legando as equações matemáticas que amparam o nosso presente.",
    "principal": "O salão da fama guarda os nomes e as fórmulas dos colossos que provaram que o intelecto humano molda a força bruta da matéria!",
    "secreta1": "A Mulher que Ergueu o Brooklyn: Quando o engenheiro-chefe Washington Roebling, seu marido, ficou de cama por causa da 'doença dos caixões', Emily Roebling virou os olhos, os ouvidos e a voz dele na obra da Ponte do Brooklyn por cerca de 11 anos (1872–1883). Ela nunca teve título oficial, mas levava as ordens dele aos engenheiros, negociava com fornecedores e políticos e estudou a fundo resistência dos materiais e a matemática dos cabos de suspensão, até as curvas catenárias! Ela entendia tanto do assunto que correu o boato de que a verdadeira engenheira-chefe era ela. E, quando a ponte foi inaugurada, foi a primeira pessoa a atravessá-la.",
    "secreta2": "Fornalha de Pedra Artificial: O nome 'cimento Portland' nasceu em 1824, na patente do pedreiro inglês Joseph Aspdin, que queimava calcário e argila em fornos para fabricar uma 'pedra artificial'. Mas o cimento Portland moderno só surgiu por volta de 1842, quando o filho dele, William Aspdin, passou a queimar a mistura num fogo muito mais quente (acima de 1.300 °C), até ela virar o 'clínquer'. Já a história de que Joseph cozinhava tudo no fogão de casa é lenda: nenhum documento da época confirma isso, e um fogão de cozinha nem chegaria perto desse calor!",
    "dica": "💡 Estude as pontes do engenheiro suíço Robert Maillart. Na Salginatobel (1930), o arco de concreto armado é mais fino no topo e nas bases e só engrossa onde os esforços são maiores. Na Schwandbach (1933), o arco tem apenas 20 cm de espessura, e quem impede que ele se dobre é o tabuleiro rígido apoiado sobre ele! Descubra como seguir o caminho das forças economiza material e transforma uma ponte em arte.",
    "desafio": "Pendure um colar pelas pontas na frente de uma folha presa à parede, copie a curva e vire a folha de cabeça para baixo. Em 1675, Robert Hooke escondeu numa charada de letras embaralhadas, em latim, que essa é a forma ideal de um arco. Por que uma curva que só puxa, quando invertida, vira um arco que só empurra?",
    "fechamento": "Caminhamos sobre a terra com segurança porque subimos nos ombros dos colossos do passado."
  }
};

// Crônica fundadora do mundo (lore narrativa) — origem: Base44
const CRONICA_FUNDADORA = "O IMPÉRIO DO ESQUELETO INVISÍVEL - Crônicas da Grande Aliança Estrutural\n\nO Portal de Entrada — A Porta Índigo\nNenhum viajante chega ao Império das Estruturas sem antes atravessar o Portal Índigo. Dizem os antigos manuscritos que esta passagem não foi construída por mãos humanas, mas descoberta. Ela existe no limite entre a imaginação e a matéria, entre aquilo que um homem sonha construir e aquilo que o mundo permite permanecer de pé.\n\"Toda grande obra começa como uma ideia frágil na mente de alguém. A engenharia é a arte de convencer essa ideia a sobreviver no mundo real.\"\n\nO Vilarejo dos Sistemas Construtivos — Onde os Sonhos Ganham Forma\nSão os mestres das ferramentas, das técnicas e dos métodos. Sabem como uma pedra percorre até se tornar uma muralha. \"Nenhuma torre nasce no céu. Antes de tocar as nuvens, ela precisa aprender a existir no chão.\"\n\nO Condado de MecTec — A Cidade dos Comerciantes das Forças Invisíveis\nOs habitantes de MecTec negociam forças. Comercializam conhecimento sobre equilíbrio, movimento, energia e interação. Descobriram que uma ponte não permanece firme por vontade própria — ela existe porque milhares de forças invisíveis travam uma batalha silenciosa em seu interior.\n\nO Reino dos Tendões — Mecânica dos Sólidos\nPara eles, toda estrutura é um organismo. A madeira possui fibras como tendões. A pedra possui resistência como ossos antigos. O aço possui uma força semelhante à de criaturas forjadas no fogo. \"Conhecer uma força é inútil se você não conhece o corpo que a recebe.\"\n\nO Reino dos Músculos — Resistência dos Materiais\nOs juízes dos materiais perguntam: \"Quanto tempo ela resistirá?\" Criaram os grandes testes: tração, compressão, flexão, torção, fadiga. \"A força verdadeira não está em nunca sofrer. Está em conhecer exatamente quanto sofrimento se pode suportar.\"\n\nO Reino dos Esqueletos — Análise Estrutural\nOs Guardiões da Linha Invisível possuem o dom mais raro: enxergar aquilo que ninguém vê. Veem forças viajando, tensões escondidas, o destino de uma construção antes mesmo dela existir. As vigas são ossos, os pilares são membros, as ligações são articulações, as fundações são raízes.\n\nA Grande Aliança Estrutural — O Super Reino Roxo\nA união de todos os reinos. Onde a força encontra a matéria. Onde o cálculo encontra a criatividade. Onde o conhecimento encontra a coragem de construir.\n\"Quando os homens compreenderem que uma estrutura não é apenas aquilo que permanece de pé, mas aquilo que luta silenciosamente para permanecer, eles terão finalmente descoberto o verdadeiro segredo do mundo: Engenharia.\"";

// Banco de curiosidades históricas reais de engenharia — origem: Base44
const CURIOSIDADES_DIVERSOES = "O Esqueleto Invisível do Mundo: Uma História Alternativa da Engenharia Civil\n\nA ORIGEM UNIFICADA: Da Defesa ao Domínio da Natureza\nA engenharia nasceu de necessidades bem concretas: abrigar-se, defender-se, levar água às plantações e erguer monumentos que desafiassem o tempo. Durante muitos séculos, quem abria estradas também podia montar máquinas de cerco. O título de 'engenheiro' pertencia sobretudo aos exércitos. Só no século XVIII as obras de paz ganharam engenheiros próprios: a França criou seu corpo de engenheiros de pontes e estradas em 1716. Pense nisto: a mesma ciência que derruba muralhas também ergue pontes. A palavra 'engenho' vem do latim ingenium, que queria dizer 'talento, esperteza': o 'gênio' com que a pessoa nasce. Só mais tarde, no latim tardio e medieval, ingenium passou a nomear máquinas de guerra, como aríetes e catapultas. O ingeniator era o mestre que as construía. Repare: 'engenheiro' e 'engenhoso' são da mesma família. Será coincidência?\n\nA DIVISÃO (Civil vs. Militar): John Smeaton (1724-1792), o \"Pai da Engenharia Civil\", foi o primeiro a se chamar de 'engenheiro civil': um construtor de obras para a vida das pessoas, e não para a guerra. Em 1771, reuniu colegas na Sociedade de Engenheiros Civis, a primeira sociedade de engenharia do mundo. Depois da morte dele, ela passou a se chamar Sociedade Smeatoniana e existe até hoje. Construiu o terceiro Farol de Eddystone (1759) com blocos de granito intertravados e redescobriu a cal hidráulica.\n\nA FRAGMENTAÇÃO: George Stephenson, o \"Pai das Ferrovias\", era autodidata e analfabeto até os 18 anos. Em 1847, Stephenson e um grupo de engenheiros de locomotivas fundaram a Institution of Mechanical Engineers (a 'guilda' dos engenheiros mecânicos), e o velho mestre das ferrovias virou o primeiro presidente. Seu biógrafo, Samuel Smiles, contou que tudo começou com uma ofensa: a Institution of Civil Engineers teria exigido que Stephenson escrevesse uma redação para provar que era engenheiro! Mas atenção, aventureiro: os historiadores desconfiam que Smiles exagerou, e o mais provável é que os engenheiros mecânicos só quisessem uma guilda própria. Como você separaria a história verdadeira da história bem contada?\n\nA BATALHA DAS BITOLAS (1840s): Stephenson adotou bitola estreita (1435 mm); Isambard Kingdom Brunel propôs bitola larga (2140 mm) para a Great Western Railway. Em 1846, a Railway Regulation (Gauge) Act mandou que as novas ferrovias de passageiros da Grã-Bretanha usassem trilhos separados por 1435 mm. Mas a lei não matou a bitola larga de uma vez: abriu exceções para a Great Western, que até ganhou linhas novas no sudoeste da Inglaterra e no País de Gales, e seus trilhos largos resistiram até 1892! A Irlanda ficou com uma bitola própria, de 1600 mm. Uma lei pode decidir o futuro, mas o passado de ferro já estava pregado no chão.\n\nMATERIAIS ESTRANHOS DO PASSADO:\n- Concreto romano (opus caementicium): cal + cinza vulcânica (pozolana) + pedaços de pedra e tijolo. Você pode ler por aí que os romanos misturavam sangue e gordura de animais, e que gordura + cal virava sabão (a saponificação), cheio de bolhinhas contra o gelo. Mas Vitrúvio, autor do 'manual' de construção romano, não fala disso, e as análises de laboratório das ruínas nunca encontraram esses ingredientes.\n- O truque das bolhas contra o gelo é real e foi descoberto por acidente, nos anos 1930: engenheiros perceberam que um aditivo jogado na moagem do cimento enchia o concreto de bolhinhas que o protegiam do congela-descongela. Nascia o concreto com 'ar incorporado': quando a água congela e incha, ela tem um 'quartinho' vazio para ocupar sem rachar a pedra.\n- Sangue na argamassa existiu, sim, só que na China: segundo registros, o piso do palácio de Xianyang (dinastia Qin) levou sangue de porco.\n- O segredo comprovado do concreto romano era químico: a cal reage com a cinza do vulcão e forma uma 'cola de pedra' que dura milênios, grumos de cal fecham as próprias rachaduras e, nos portos, crescem cristais com a água do mar.\n- Argamassa de arroz pegajoso na China imperial (muito usada na dinastia Ming): o amido do arroz controlava o crescimento dos cristais de calcita, que ficavam pequenos e bem encaixados. O resultado era uma argamassa compacta, mais resistente à água e ao tempo. Uma receita de cozinha que segurou muralhas, túmulos e pagodes por séculos!\n- Clara de ovo (albumina) na argamassa? Estudos de hoje colocam o ovo na lista dos ingredientes antigos da massa de cal, ao lado de sangue, leite e cola animal, e há quem diga que os antigos cretenses já misturavam ovo nos rebocos decorativos. Mas usado na Europa só 'entre os séculos XVII e XIX'? Não há prova dessa data! E provar que havia ovo DENTRO das paredes velhas é difícil.\n- A Ponte Carlos, em Praga, começada em 1357, tem a lenda dos ovos na massa. Em 2008, químicos de Praga anunciaram: 'é verdade!'. Em 2010, os mesmos químicos voltaram atrás: 'não havia ovo nenhum'.\n- A química do ovo na argamassa é conhecida: na massa de cal, que é muito básica, as proteínas do ovo se desenrolam (desnaturam) e se agarram ao cálcio. Além disso, prendem bolhinhas de ar, como num suspiro batido, e testes de laboratório mostram que um pouco de clara deixa a massa mais fácil de trabalhar e mais firme. Polimerização? Não! A proteína já nasce como uma cadeia gigante.\n- Onde o ovo aparece com certeza é na tinta: pintores como Giotto, há uns 700 anos, pintavam com tinta de ovo sobre o reboco de cal. Quer ver a cal mexendo com um ovo? Na China, o 'ovo centenário' é curtido numa pasta com cal e cinzas, e a clara vira uma gelatina escura sem ir ao fogo! Receita de livro ou ingrediente de verdade? Investigue!\n\nDESASTRES HISTÓRICOS:\n- Colapso do Anfiteatro de Fidenas (27 d.C.): um liberto (ex-escravizado) chamado Atílio ergueu um anfiteatro de madeira sem fundação firme, só para ganhar dinheiro, e ele desabou cheio de gente. O historiador Suetônio fala em mais de 20 mil mortos; Tácito, em 50 mil mortos ou feridos. Uma diferença de 30 mil pessoas: em quem você confiaria? Depois disso, o Senado romano decidiu que nenhum anfiteatro seria erguido sem que a firmeza do solo fosse comprovada, e Atílio foi mandado para o exílio. Não foi a primeira lei contra construtor descuidado: quase 1.800 anos antes, o Código de Hamurabi já punia quem fizesse uma casa que desabasse!\n- Grande Inundação de Melaço de Boston (1919): um tanque se rompeu e soltou cerca de 8,7 milhões de litros de melaço, numa onda grudenta que matou 21 pessoas. Quem cuidou da obra foi um tesoureiro sem nenhuma formação de engenheiro, e o 'teste' do tanque foi feito com só uns 15 centímetros de água! Logo depois, Boston passou a exigir que os cálculos de engenheiros e arquitetos fossem entregues junto com as plantas, e que os desenhos carimbados fossem assinados. Não foi a primeira lei de engenheiro registrado (essa é de 1907, no Wyoming), mas virou um marco: quem calcula responde pelo que calculou.\n- Ponte de Quebec (1907 e 1916): 75 + 13 mortos. Em 1907, o projeto foi esticado para um vão maior, mas ninguém refez a conta do peso próprio: a ponte ficou bem mais pesada que o previsto. Uma barra comprimida, cuja 'costura' de chapinhas era fraca demais, entortou até ceder, e a estrutura despencou. Na segunda tentativa, em 1916, a causa foi outra: quebrou uma peça do mecanismo que içava o vão central, e ele caiu no rio. Dois desastres, dois erros diferentes!\n- Anel de Ferro dos Engenheiros Canadenses: criado em 1922 em resposta à tragédia da Ponte de Quebec.\n\nRIVALIDADES HISTÓRICAS:\n- Brunelleschi vs. Ghiberti: a cúpula de Florença (concurso em 1418; obra de 1420 a 1436). Diz a lenda, contada por biógrafos fãs de Brunelleschi, que ele se fingiu de doente para provar que Ghiberti não dava conta da obra sozinho. Mas os registros mostram Ghiberti ali como ajudante oficial, ganhando o mesmo salário que ele: verdade ou história de fã? O que é certo: Brunelleschi assentou os tijolos em espinha de peixe e ergueu a primeira cúpula octogonal sem a gigantesca armação de madeira que todos achavam indispensável.\n- Bernini vs. Borromini: as torres sineiras de São Pedro. Em 1641, a fachada começou a rachar debaixo da torre nova de Bernini. Borromini foi quem mais gritou: disse que a basílica inteira ia ruir e pôs toda a culpa no rival. Em 1646, o papa, inimigo dos antigos protetores de Bernini, mandou demolir as torres. Só que as investigações acharam outro culpado: as fundações fracas que Carlo Maderno tinha feito décadas antes. Humilhado, Bernini começou a esculpir \"A Verdade Revelada pelo Tempo\". Segundo o filho dele, era um recado: um dia o Tempo mostraria quem tinha razão. E mostrou: em 1680, uma nova investigação o inocentou! Ironia: a figura do Tempo nunca foi esculpida, e a estátua continua inacabada até hoje, na Galleria Borghese, em Roma.\n\nCÁLCULO SEM SILÍCIO: Mestres medievais usavam ad quadratum e ad triangulum. As \"salas de tração\" tinham desenhos em escala real (1:1) em gesso de Paris.\n\nA FADIGA E A MENTIRA DA CRISTALIZAÇÃO:\n- Catástrofe de Versalhes (1842): eixo de ferro partiu por fadiga.\n- Logo depois do desastre de Versalhes, o jovem engenheiro escocês William Rankine foi investigar eixos de trem que quebravam \"do nada\". Muita gente jurava que o ferro \"cristalizava\" com o uso. Rankine viu outra coisa: a trinca nascia num canto vivo do eixo, onde o esforço se concentra, e crescia aos pouquinhos, viagem após viagem, até a peça partir. O mais incrível? Quase ninguém deu ouvidos a ele.\n- O mito da \"cristalização\" dizia que a vibração transformava o ferro em \"cristal\" quebradiço. Por causa dele, por mais de meio século muitos engenheiros ignoraram quem explicava a fadiga do jeito certo, e os eixos continuaram quebrando. Em 1903, James Ewing e J. C. W. Humfrey olharam o metal ao microscópio e viram trincas minúsculas nascendo e crescendo a cada vai e vem. O culpado nunca foi o cristal: foi a repetição. Já pensou quantas vezes uma ponte balança por dia?\n- August Wöhler, engenheiro das ferrovias alemãs, passou mais de uma década (do fim dos anos 1850 até 1870) construindo máquinas que giravam e entortavam eixos de trem e barras de metal sem parar, até eles quebrarem. Ele queria descobrir quanto esforço repetido o metal aguenta antes de ceder. Dos ensaios dele nasceram as curvas S-N (esforço contra número de repetições) e a ideia de limite de fadiga: abaixo de certo esforço, o aço aguenta repetições quase sem fim.\n\nA CATENÁRIA INVERTIDA:\n- Em 1675, Robert Hooke publicou sua descoberta sobre arcos como um enigma: um anagrama, com todas as letras da frase embaralhadas em ordem alfabética. A resposta só foi revelada em 1705, depois que ele morreu: \"Ut pendet continuum flexile, sic stabit contiguum rigidum inversum\". Quer dizer: assim como pende um cabo flexível, assim ficam de pé, invertidas, as peças rígidas de um arco, encostadas umas nas outras. As pedras só não caem porque se apertam!\n- Poleni (1743) usou modelo de corrente suspensa para analisar a cúpula da Basílica de São Pedro.\n- Regra do Terço Central: e ≤ h/6 para evitar tração em alvenaria.\n- Antoni Gaudí montou uma maquete pendurada, com 4 metros de altura, para a igreja da Colônia Güell, perto de Barcelona: cordas com saquinhos cheios de chumbinho de caça. Cada saquinho fazia o papel do peso que aquele ponto da igreja teria que segurar. Depois ele fotografou a maquete e virou a foto de cabeça para baixo: as curvas das cordas viravam arcos e colunas que só trabalham apertados. O que aprendeu ali foi parar na Sagrada Família: colunas inclinadas que se ramificam como árvores de pedra.";

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
      pergunta: "Num mapa de cores de uma simulação de elementos finitos em que esticar conta como positivo e espremer como negativo, que cor costuma marcar a tração (material sendo esticado)?",
      opcoes: ["Azul", "Verde", "Vermelho"],
      correta: 2,
    },
  ],
  bloco1: [
    {
      pergunta: "Por que as pontes de treliça usam triângulos na sua estrutura?",
      opcoes: ["Porque é mais bonito", "Porque, com as juntas articuladas, o triângulo é o único polígono que não muda de forma sem esticar ou esmagar uma das barras", "Porque três barras sempre pesam menos que quatro, seja qual for o tamanho delas"],
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
      pergunta: "Por que a maior parte da carga que desce por uma coluna de prédio alto (muitas vezes dois terços ou mais!) vem só do peso do próprio edifício acima dela?",
      opcoes: ["Porque as colunas de baixo são feitas de material mais fraco", "Porque o peso próprio de todos os andares de cima se acumula nelas", "Isso é um mito: as colunas só sustentam pessoas e móveis"],
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
      pergunta: "Por que sistemas hiperestáticos (com caminhos alternativos de força) costumam resistir melhor à quebra de uma peça do que sistemas isostáticos simples?",
      opcoes: ["Não resistem melhor: se uma peça quebra, tudo cai do mesmo jeito", "Se um elemento falhar, os vizinhos podem absorver a carga, evitando o colapso imediato", "Porque são feitos de um material mais forte"],
      correta: 1,
    },
    {
      pergunta: "Se você dobrar o vão entre dois apoios de uma viga sob a mesma carga distribuída, o que acontece com a deflexão no centro?",
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
      pergunta: "Copiar as soluções estruturais da natureza tem nome: biomimética. O que ela faz na engenharia moderna?",
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
      pergunta: "O 'Espelho das Forças' ilustra qual princípio?",
      opcoes: ["Que, com carga simétrica, o peso se divide igual entre os dois apoios", "Que forças só existem em pares visualmente idênticos", "Que espelhos mágicos conseguem anular forças estruturais"],
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
      opcoes: ["A estrutura sempre perde essa disputa e cede aos poucos, sem remédio", "As forças internas equilibram as cargas, e o material aguenta isso com folga", "Esse equilíbrio só aparece durante terremotos e ventanias fortes"],
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
      emProgresso: "As engrenagens já giram a teu favor. Cada runa calibra teu olhar — um instrumento afiado vale por dez chutes.",
      quaseLa: "Resta um único dente na engrenagem do teu saber. Encaixa-o, e o mecanismo do Condado girará completo!",
      completo: "Calibração perfeita! O Condado te reconhece como mestre da medida exata. Nada aqui range sem tua permissão.",
    },
  },
  bloco3: {
    nome: "Seda, a Tecelã dos Tendões de Aço",
    emoji: "🪢",
    falas: {
      saudacao: "Vês estes cabos, aprendiz? Finos como fio de teia, fortes como juramento. No Reino NEXUS aprenderás que puxar também é sustentar. Tece tua primeira runa.",
      emProgresso: "Teu fio ganha têmpera a cada runa. O aço tracionado é honesto: avisa esticando antes de romper. Mas desconfia do vidro e do ferro fundido, que partem quase sem aviso. Escuta o material e segue tecendo.",
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
      completo: "O esqueleto está inteiro e dança sem cair! Tu enxergas agora o que se esconde atrás das paredes — e sabes que, às vezes, a própria parede é o herói estrutural.",
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
      desc: "No estado de Washington foi erguida uma ponte pênsil moderna, esbelta e elegante como uma lâmina de aço. Ainda durante a construção, os próprios operários a apelidaram de 'Gertie Galopante', porque com qualquer vento o tabuleiro subia e descia como o dorso de um cavalo a galope. Depois da inauguração, motoristas vinham de longe só para 'cavalgar' a ponte, como numa montanha-russa. Ninguém imaginava que aquela brincadeira era um aviso... Quatro meses após a inauguração, num vento de apenas 68 km/h, ela se torceu como um pergaminho até se romper.",
      principal: "O tabuleiro era fino, sólido e sem aberturas: uma verdadeira parede de aço contra o vento. Naquela manhã ele já subia e descia; por volta das 10 horas, uma braçadeira escorregou no cabo, no meio da ponte, e a dança de sobe e desce virou uma torção de um lado para o outro. E aqui está o enigma: o vento daquele dia não precisava bater num ritmo certo. Era a própria ponte que, ao torcer, moldava os redemoinhos do ar, e eles empurravam sempre no instante exato de aumentar a torção — a ponte roubava um pouco de energia do vento a cada balanço. Uma armadilha que se alimentava sozinha! A estrutura respondia dançando cada vez mais forte (o temível 'flutter' aeroelástico). Depois de quase uma hora se contorcendo, os pendurais que seguravam o tabuleiro foram arrebentando um a um, como cordas de alaúde, e um pedaço de uns 180 metros despencou nas águas. Curioso: as torres e os grandes cabos continuaram de pé!",
      secreta1: "O Último Passageiro: a única vítima foi um cão chamado Tubby, que se recusou a sair do carro abandonado no meio do vão. Todos os humanos escaparam.",
      secreta2: "Aula Eterna: o colapso foi filmado em película e até hoje é exibido nas universidades de engenharia do mundo inteiro — o desastre se tornou o professor.",
      dica: "💡 Vento não é só força que empurra: é força que DANÇA. Estruturas esbeltas precisam de rigidez à torção e de formas que quebrem o ritmo dos redemoinhos.",
      licao: {
        runaId: "0.3",
        texto: "O segredo estava na runa do vento: quem entende como o ar ataca uma estrutura projeta tabuleiros que cortam a dança antes do primeiro passo. Hoje, toda grande ponte pênsil é testada antes de existir: um modelo em miniatura enfrenta tempestades de mentira num túnel de vento, e computadores simulam o ar passando por ela, para que a ponte de verdade nunca dance com o vento.",
      },
      fechamento: "A Gertie caiu para que nenhuma outra ponte precisasse dançar.",
    },
    {
      id: "E.2",
      title: "🌉 E.2 — O Gigante Que Subestimou o Próprio Peso",
      subtitle: "Ponte de Quebec, 1907 — a soberba antes da queda",
      desc: "No Canadá, estava sendo construída a maior ponte em balanço do mundo, um colosso de aço sobre o rio São Lourenço. Mas o peso próprio real da estrutura era maior do que o dos cálculos originais. Quando o inspetor avisou que as barras de aço já estavam se curvando, os engenheiros da obra acharam que a curva tinha vindo de fábrica. O mestre-engenheiro, que comandava de longe, em Nova York, mandou um telegrama: 'Não ponham mais carga na ponte!'. Mas a ordem ficou parada no escritório da empresa, longe da obra, e os homens continuaram trabalhando lá em cima... até as cinco e meia da tarde.",
      principal: "Semanas antes da queda, o inspetor já anotava barras comprimidas do braço sul saindo da linha reta. Dois dias antes, viu que justamente as barras que iam falhar estavam curvadas, e a curva crescia dia após dia. Mesmo assim, a obra não parou. Em 29 de agosto de 1907, em quinze segundos, 19 mil toneladas de aço desabaram, levando 75 trabalhadores. Em 1916, na segunda tentativa, o vão central caiu durante o içamento — mais 13 vidas. Só em 1917 o gigante ficou de pé.",
      secreta1: "O Anel de Ferro: os engenheiros canadenses usam um anel no dedo mínimo como voto de humildade. Conta a lenda que os anéis seriam forjados do aço da ponte caída. Lenda bonita, mas falsa: os primeiros foram feitos por veteranos feridos na Primeira Guerra, num hospital militar de Toronto, e hoje a maioria é de aço inoxidável. Por que será que uma história inventada pega tão bem?",
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
      desc: "Em Kansas City, três passarelas suspensas cruzavam o salão de um hotel luxuoso. Duas delas, a do 2º e a do 4º andar, ficavam exatamente uma sobre a outra, penduradas nas mesmas barras de aço. Durante um baile com o salão lotado, as duas despencaram sobre a multidão: 114 vidas perdidas. Muitos dizem que foi o desabamento acidental mais mortal da história dos EUA. Mas uma fábrica que ruiu em 1860 pode ter matado ainda mais gente, e os registros antigos não batem. Quem tem razão?",
      principal: "No projeto original, um único tirante contínuo atravessava as duas passarelas, e cada uma se pendurava nele de forma independente. Durante a construção, o fabricante do aço propôs trocar por DOIS tirantes, e os engenheiros do projeto aprovaram sem refazer as contas. Ninguém percebeu que a conexão da passarela de cima passaria a segurar também todo o peso da de baixo. Uma troca que parecia inocente dobrou a carga naquela junta.",
      secreta1: "A Prova do Cotidiano: o engenheiro Henry Petroski explicou o erro com uma corda pendurada num celeiro e dois homens. Se cada um segura a corda com as próprias mãos, cada mão aguenta só o próprio dono. Mas se cortarem a corda entre os dois e o de baixo se agarrar ao de cima, as mãos do de cima passam a aguentar os DOIS.",
      secreta2: "O Legado: o caso virou um dos exemplos mais estudados de ética profissional no mundo. Os engenheiros responsáveis perderam suas licenças, e a profissão aprendeu a lição do jeito mais duro: uma mudança num detalhe, como a ligação de uma barra, precisa ser revisada e aprovada pelo engenheiro responsável pelo projeto antes de ir para a obra. Afinal, quem confere a mudança que parece pequena? Uma troca 'pequena' pode dobrar a carga numa peça!",
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
      principal: "Ao sentir o piso oscilar de leve, cada pessoa abria mais as pernas e ajustava o passo para não perder o equilíbrio. Muitas acabavam pisando no mesmo ritmo do balanço e, todas juntas, empurravam a ponte sem querer. Sem perceber, a multidão virou um motor empurrando a ponte lateralmente, num ciclo que se realimentava (excitação lateral sincronizada).",
      secreta1: "O Apelido: os londrinos a batizaram de 'Wobbly Bridge' — a Ponte Bamba. O nome pegou mais que o oficial.",
      secreta2: "A Cura: quase dois anos, 37 amortecedores viscosos e uns 50 amortecedores de massa sintonizada depois, ela reabriu. E nunca mais balançou daquele jeito. Hoje é uma das travessias mais amadas de Londres.",
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
      desc: "Na Itália, os construtores de um campanário de mármore ergueram três andares antes de perceber o impensável: a torre afundava de um lado. O solo — argila mole e areia — cedia sob a fundação rasa de apenas três metros. A obra parou por quase um século… e a torre continuou se inclinando, século após século, até os engenheiros do fim do século XX conseguirem segurá-la. E depois disso ela até 'desentortou' sozinha mais uns 4 centímetros!",
      principal: "Fundação rasa demais sobre solo mole e desigual: o lado sul afundou mais que o norte, e cada andar novo aumentava o peso e o desaprumo. Os construtores seguintes até curvaram o eixo da torre tentando compensar — por isso ela tem um leve formato de banana.",
      secreta1: "O Resgate Moderno: a torre ficou fechada de 1990 a 2001. Primeiro os engenheiros testaram cintas de aço e centenas de toneladas de chumbo como contrapeso. Depois, entre 1999 e 2001, tiraram solo com todo o cuidado de baixo do lado ALTO da fundação e deixaram a torre 'cair de volta' quase meio metro (cerca de 45 centímetros no topo). Ela está estável — e ainda torta, como o mundo a quer.",
      secreta2: "Sorte de Séculos: cálculos modernos mostram que a torre esteve várias vezes à beira do colapso. E o que a salvou foi justamente a obra ter parado! As guerras interromperam a construção por décadas, e nesse tempo o solo argiloso foi se apertando sob o peso e ficando mais firme. Se tivessem construído tudo de uma vez, o chão teria cedido. O charme sobreviveu por pouco — e por muito socorro.",
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
      desc: "O rei da Suécia encomendou um dos navios de guerra mais bem armados do seu tempo, com 64 canhões, a maioria de bronze, enfileirados em DUAS cobertas, e tinha pressa. Conta-se que ele exigiu a segunda coberta no meio da obra, mas os arqueólogos examinaram o casco tábua por tábua e não acharam nenhum remendo. O perigo já estava no desenho: peso demais lá em cima, casco estreito demais e pouco lastro lá embaixo. O Vasa zarpou majestoso diante de toda Estocolmo e navegou cerca de 1300 metros. Na primeira rajada de vento, deitou de lado e voltou a se aprumar. Na segunda, deitou de novo, e a água entrou pelas portinholas dos canhões de baixo, que estavam abertas para a salva de tiros da festa. Em minutos, o navio afundou diante da multidão.",
      principal: "Canhões e madeiramento a mais lá no alto elevaram demais o centro de gravidade, e o casco esguio não tinha lastro suficiente embaixo para responder. Estabilidade é uma disputa entre o peso lá em cima e o lastro cá embaixo — e no Vasa, o orgulho do rei pesou mais.",
      secreta1: "O Teste Ignorado: antes da viagem, trinta homens correram de um bordo ao outro do convés — o navio balançou tanto que o teste foi interrompido. Zarparam mesmo assim. O rei estava longe, em guerra, e cobrava pressa. Ninguém na época sabia calcular a estabilidade de um navio. E quem teria coragem de segurar no porto a joia da coroa sem uma ordem dele?",
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
      subtitle: "Monte a ponte que a Ilha nunca conseguiu erguer",
      simulador: true, // runa especial: sem XP de leitura — o desafio é o simulador
      desc: "No coração da Ilha jaz um vão que nunca foi vencido. Os fantasmas dos seis erros rondam cada peça do estaleiro: o solo mole de Pisa, o peso subestimado e as barras mal travadas de Quebec, a lâmina fina da Gertie... Escolha fundação, estrutura e tabuleiro com sabedoria — e erga a ponte que redime todas as quedas.",
      principal: "Aqui não há crônica pra ler — há uma ponte pra construir. Cada peça amaldiçoada repete um erro famoso das runas negras, e só a combinação sábia sobrevive aos três julgamentos: os pedestres, as carroças e a tempestade.",
      dica: "💡 Se a ponte cair, repara em COMO ela caiu — cada colapso aponta exatamente pra crônica que ensina a evitá-lo.",
      fechamento: "Quem aprende com as quedas dos outros constrói pontes que não caem.",
    },
  ],
};
