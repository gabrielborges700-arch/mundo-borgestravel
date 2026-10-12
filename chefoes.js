/**
 * chefoes.js — CHEFÕES DO JULGAMENTO SUPREMO
 *
 * O QUE ELE FAZ
 *  Cada reino tem um vilão no topo do Julgamento Supremo, com 5 corações
 *  (um por pergunta). A criança responde tudo e, ao CONFIRMAR, cada acerto
 *  vira um golpe: o vilão treme e perde um coração. Com 4 golpes ou mais ele
 *  é derrotado (é a mesma regra de sempre: 4 de 5 para passar).
 *  Nada da regra do jogo muda: o resultado continua vindo do jogo.js, e este
 *  arquivo só "encena" a luta. Quem pediu "menos movimento" no aparelho vê o
 *  resultado direto, sem tremer nem cair.
 *
 * COMO MEXER NOS VILÕES
 *  Na lista VILOES: nome, ícone, a provocação (fala) e a frase da derrota.
 *
 * Sem bibliotecas e sem "module". Nenhum .js existente é editado: este
 * arquivo encadeia abrirModalMissaoBoss (o mesmo jeito do painel-reino.js).
 */
(function () {
  "use strict";

  var VILOES = {
    bloco0: { nome: "Achômetro, o Construtor no Chute", icone: "🎲",
      fala: "Calcular dá trabalho... Eu construo tudo no chute!",
      derrota: "Nada de chute: quem calcula constrói para durar!" },
    bloco1: { nome: "Infiltra, a Goteira Sorrateira", icone: "💧",
      fala: "Uma gotinha aqui, outra ali... e as suas paredes serão minhas!",
      derrota: "Construção bem feita não deixa a água entrar!" },
    bloco2: { nome: "Desaprumo, o Torto", icone: "📐",
      fala: "Um pilarzinho fora do prumo não faz mal nenhum... ou faz?",
      derrota: "Medida certa, coluna no prumo!" },
    bloco3: { nome: "Tração, o Esticador", icone: "🪢",
      fala: "Vou puxar, puxar, puxar... até tudo arrebentar!",
      derrota: "Os seus cabos aguentaram todos os meus puxões!" },
    bloco4: { nome: "Fadiga, a Rachadora Paciente", icone: "🕸️",
      fala: "Não preciso de força. Só de paciência: vai e volta, vai e volta...",
      derrota: "Você conhece os meus truques: com margem de segurança, eu não racho nada!" },
    bloco5: { nome: "Flexão, a Entortadora de Vigas", icone: "📏",
      fala: "Vou entortar as suas vigas até elas cederem!",
      derrota: "Viga bem pensada não cede!" },
    bloco6: { nome: "Colapso, o Dragão das Rachaduras", icone: "🐉",
      fala: "Tire uma peça só, e eu derrubo TUDO!",
      derrota: "Com caminhos de sobra para as forças, o castelo continua de pé!" }
  };
  var VIDAS = 5;
  var GOLPE_MS = 450;

  function movimentoReduzido() {
    try { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; }
  }

  function montarArena(vilao, jaVencido) {
    var arena = document.createElement("div");
    arena.className = "chefe-arena";
    arena.setAttribute("role", "group");
    arena.setAttribute("aria-label", "Chefão do Julgamento: " + vilao.nome);
    var coracoes = "";
    for (var i = 0; i < VIDAS; i++) coracoes += '<span class="chefe-coracao" aria-hidden="true">♥</span>';
    arena.innerHTML =
      '<div class="chefe-retrato" aria-hidden="true"><span class="chefe-icone">' + vilao.icone + '</span></div>' +
      '<div class="chefe-info">' +
        '<p class="chefe-nome">' + vilao.nome + '</p>' +
        '<div class="chefe-vida" role="img" aria-label="Vida do chefão: ' + VIDAS + ' de ' + VIDAS + '">' + coracoes + '</div>' +
        '<p class="chefe-fala" aria-live="polite">“' + vilao.fala + '”</p>' +
        (jaVencido ? '<p class="chefe-marca">✔ Você já derrotou este chefão. Lute de novo para treinar!</p>' : '') +
      '</div>';
    return arena;
  }

  // Encena a luta: um golpe por acerto e, no fim, a vitória ou a provocação
  function encenar(arena, vilao, acertos) {
    var venceu = acertos >= 4;
    var coracoes = arena.querySelectorAll(".chefe-coracao");
    var vida = arena.querySelector(".chefe-vida");
    var fala = arena.querySelector(".chefe-fala");
    // recomeça do zero (a criança pode confirmar de novo depois de trocar respostas)
    (arena._timers || []).forEach(clearTimeout);
    arena._timers = [];
    arena.classList.remove("chefe-derrotado", "chefe-resiste", "chefe-golpe");
    for (var i = 0; i < coracoes.length; i++) coracoes[i].classList.remove("perdido");

    function final() {
      var resta = VIDAS - acertos;
      vida.setAttribute("aria-label", "Vida do chefão: " + resta + " de " + VIDAS);
      if (venceu) {
        arena.classList.add("chefe-derrotado");
        fala.textContent = "💥 Derrotado! “" + vilao.derrota + "”";
      } else {
        arena.classList.add("chefe-resiste");
        fala.textContent = "“Ha! Ainda tenho " + resta + (resta === 1 ? " coração" : " corações") + ". Releia as runas deste reino e volte!”";
      }
    }

    if (movimentoReduzido()) {
      for (var j = 0; j < acertos; j++) coracoes[j].classList.add("perdido");
      final();
      return;
    }
    fala.textContent = "⚔️ A luta começou!";
    for (var g = 0; g < acertos; g++) {
      (function (g) {
        arena._timers.push(setTimeout(function () {
          arena.classList.remove("chefe-golpe");
          void arena.offsetWidth; // recomeça o tremor do zero
          arena.classList.add("chefe-golpe");
          coracoes[g].classList.add("perdido");
          var dano = document.createElement("span");
          dano.className = "chefe-dano";
          dano.setAttribute("aria-hidden", "true");
          dano.textContent = "−1";
          arena.querySelector(".chefe-retrato").appendChild(dano);
          arena._timers.push(setTimeout(function () { if (dano.parentNode) dano.parentNode.removeChild(dano); }, 900));
        }, 250 + g * GOLPE_MS));
      })(g);
    }
    arena._timers.push(setTimeout(function () { arena.classList.remove("chefe-golpe"); final(); }, 250 + acertos * GOLPE_MS + 250));
  }

  function aposAbrirJulgamentoSupremo(blocoId) {
    var vilao = VILOES[blocoId];
    var painel = document.querySelector("#modal-missao-boss-overlay .painel-leitura");
    if (!vilao || !painel || painel.querySelector(".chefe-arena")) return;
    var jaVencido = false;
    try { jaVencido = obterEstadoJogo().missoesBossCompletas.indexOf(blocoId) >= 0; } catch (e) {}
    var arena = montarArena(vilao, jaVencido);
    var titulo = painel.querySelector("h2");
    if (titulo && titulo.nextElementSibling) painel.insertBefore(arena, titulo.nextElementSibling);
    else painel.insertBefore(arena, painel.firstChild);

    var confirmar = painel.querySelector("#confirmar-missao-boss");
    if (!confirmar) return;
    // Este "ouvinte" é ligado DEPOIS do do jogo.js: quando ele roda, o resultado já foi escrito
    confirmar.addEventListener("click", function () {
      var resultado = painel.querySelector("#resultado-missao-boss strong");
      var achado = resultado && /(\d+)\s*\/\s*5/.exec(resultado.textContent);
      if (!achado) return; // faltou responder alguma pergunta: o jogo.js já avisou
      encenar(arena, vilao, Math.min(VIDAS, parseInt(achado[1], 10)));
      if (arena.scrollIntoView) {
        try { arena.scrollIntoView({ block: "nearest", behavior: movimentoReduzido() ? "auto" : "smooth" }); } catch (e) { arena.scrollIntoView(); }
      }
    });
  }

  if (typeof abrirModalMissaoBoss === "function") {
    var abrirModalMissaoBossSemChefe = abrirModalMissaoBoss;
    abrirModalMissaoBoss = function (blocoId) {
      var resultado = abrirModalMissaoBossSemChefe.apply(this, arguments);
      try { aposAbrirJulgamentoSupremo(blocoId); } catch (erro) {}
      return resultado;
    };
  }
})();
