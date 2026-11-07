/**
 * livro.js — A runa vira um LIVRO com abas (redesign "avançado", 07/11/2026)
 *
 * Antes, a janela da runa era um paredão de texto. Agora ela é um livro:
 *   📜 História · 🗝️ Segredos · ⚙️ Simulador · ⚔️ Desafio
 * (na Ilha Amaldiçoada: História · O Erro · Simulador · A Lição).
 * Cada aba mostra uma "página"; trocar de aba vira a página. Dá para
 * navegar pelas abas, pelos botões ‹ › do rodapé, pelas setas ← → do
 * teclado e deslizando o dedo no celular.
 *
 * COMO FUNCIONA (e por que nada quebra):
 *   - nenhum elemento sai do lugar: o app.js, o glossário, o Atlas, o
 *     vida.js e os testes continuam achando tudo onde sempre esteve.
 *     Este arquivo só ETIQUETA cada filho do painel com data-livro-pg e
 *     o CSS (estilos/livro.css) esconde o que não é da página atual;
 *   - entram só 3 peças novas: a barra de abas (logo depois do subtítulo),
 *     o rodapé com ‹ › e uma folha decorativa para a animação;
 *   - sem JavaScript ou com erro aqui, a runa abre inteira como antes.
 *
 * Carregar DEPOIS de atlas.js, glossario.js e vida.js (eles também
 * encadeiam abrirModalRuna/abrirModalRunaNegra e precisam ter terminado
 * de mexer no painel quando o livro for montado). O index.html carrega
 * este arquivo no fim, junto com o mapa-mundo.js.
 */
(function () {
  "use strict";

  function combina(consulta) {
    try { return !!(window.matchMedia && window.matchMedia(consulta).matches); } catch (e) { return false; }
  }
  var movimento = !combina("(prefers-reduced-motion: reduce)");

  var PAGINAS = {
    normal: [
      { id: "historia", icone: "📜", nome: "História" },
      { id: "segredos", icone: "🗝️", nome: "Segredos" },
      { id: "simulador", icone: "⚙️", nome: "Simulador" },
      { id: "desafio", icone: "⚔️", nome: "Desafio" },
    ],
    negra: [
      { id: "historia", icone: "📜", nome: "História" },
      { id: "segredos", icone: "⚰️", nome: "O Erro" },
      { id: "simulador", icone: "⚙️", nome: "Simulador" },
      { id: "desafio", icone: "🕯️", nome: "A Lição" },
    ],
  };

  function romano(n) {
    return ["", "i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"][n] || String(n);
  }

  function ehSimulador(el) {
    var h4 = el.querySelector && el.querySelector(":scope > h4");
    return !!(h4 && /Painel de Simula/.test(h4.textContent));
  }
  function textoForte(el) {
    var forte = el.querySelector && el.querySelector(":scope > strong");
    return forte ? forte.textContent.trim() : "";
  }

  // Etiqueta cada filho do painel com a página a que ele pertence
  function classificar(painel) {
    var filhos = Array.prototype.slice.call(painel.children);
    var atual = null;          // página corrente enquanto percorre o painel
    var depoisDoCaderno = false;
    var cabecaVista = 0;       // h2 + subtítulo
    var usadas = {};

    filhos.forEach(function (el) {
      if (el.matches("button[id^='fechar-modal'], #botao-favoritar-runa, .livro-abas, .livro-rodape, .livro-folha, .livro-fita")) return;
      if (cabecaVista < 2 && (el.tagName === "H2" || (cabecaVista === 1 && el.tagName === "P"))) {
        cabecaVista++;
        if (cabecaVista === 2) atual = "historia";
        return;
      }
      var pagina;
      var forte = textoForte(el);
      if (ehSimulador(el)) {
        pagina = "simulador";
        atual = "fecho";
      } else if (/^\u{1F52E}/u.test(forte)) { // 🔮 curiosidade principal: fecha a página da História
        pagina = "historia";
      } else if (/^(\u{1F5DD}|⚰)/u.test(forte)) { // 🗝 segredos e ⚰ o erro (com ou sem o seletor de variação)
        pagina = atual = "segredos";
      } else if (/^(⚔|\u{1F56F})/u.test(forte) || el.querySelector("#botao-desafio-resolvido, #botao-runa-salvadora")) { // ⚔ 🕯
        pagina = "desafio"; // o desafio não muda a página corrente (a dica vem depois dele)
      } else if (el.classList.contains("atlas-ver-no-mapa")) {
        pagina = "historia";
      } else if (el.classList.contains("divisor-rune")) {
        if (atual === "fecho" || atual === "segredos" || atual === "historia") {
          // 1º divisor: abre o fechamento; o 2º abre o Caderno do Aprendiz
          if (usadas.fecho) { depoisDoCaderno = true; pagina = atual = "desafio"; }
          else { pagina = atual = "fecho"; }
        } else {
          depoisDoCaderno = true;
          pagina = atual = "desafio";
        }
      } else if (depoisDoCaderno || el.id === "caderno-runa") {
        pagina = "desafio";
      } else {
        pagina = atual || "historia";
      }
      el.setAttribute("data-livro-pg", pagina);
      usadas[pagina] = true;
    });
    return usadas;
  }

  function montarLivro(negra) {
    var painel = document.querySelector("#modal-overlay .painel-leitura");
    if (!painel || painel.classList.contains("livro")) return;

    var usadas = classificar(painel);
    var modelo = PAGINAS[negra ? "negra" : "normal"].filter(function (p) { return usadas[p.id]; });
    if (modelo.length < 2) {
      // nada para folhear: devolve o painel como era
      painel.querySelectorAll("[data-livro-pg]").forEach(function (el) { el.removeAttribute("data-livro-pg"); });
      return;
    }
    // O fechamento ("fecho") vai junto com a ÚLTIMA página do livro
    var ultima = modelo[modelo.length - 1].id;
    painel.querySelectorAll('[data-livro-pg="fecho"]').forEach(function (el) { el.setAttribute("data-livro-pg", ultima); });

    painel.classList.add("livro");
    painel.setAttribute("data-livro-total", String(modelo.length));

    // Barra de abas, logo depois do subtítulo
    var abas = document.createElement("div");
    abas.className = "livro-abas";
    abas.setAttribute("role", "tablist");
    abas.setAttribute("aria-label", "Páginas da runa");
    modelo.forEach(function (p, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "livro-aba";
      b.setAttribute("role", "tab");
      b.setAttribute("data-livro-ir", p.id);
      b.setAttribute("aria-selected", "false");
      b.setAttribute("tabindex", "-1");
      b.innerHTML = '<span class="livro-aba-icone" aria-hidden="true">' + p.icone + "</span>" +
        '<span class="livro-aba-nome">' + p.nome + "</span>" +
        '<span class="livro-aba-num" aria-hidden="true">' + (i + 1) + "</span>";
      abas.appendChild(b);
    });
    var h2 = painel.querySelector(":scope > h2");
    var subtitulo = h2 && h2.nextElementSibling && h2.nextElementSibling.tagName === "P" ? h2.nextElementSibling : h2;
    if (subtitulo && subtitulo.parentNode === painel) painel.insertBefore(abas, subtitulo.nextSibling);
    else painel.insertBefore(abas, painel.firstChild);

    // Fita marcadora de seda (só enfeite)
    var fita = document.createElement("span");
    fita.className = "livro-fita";
    fita.setAttribute("aria-hidden", "true");
    painel.appendChild(fita);

    // Folha que vira (só enfeite) e rodapé com ‹ ›
    var folha = document.createElement("span");
    folha.className = "livro-folha";
    folha.setAttribute("aria-hidden", "true");
    painel.appendChild(folha);

    var rodape = document.createElement("div");
    rodape.className = "livro-rodape";
    rodape.innerHTML =
      '<button type="button" class="livro-virar livro-anterior" aria-label="Página anterior">‹ <span>Anterior</span></button>' +
      '<span class="livro-meio" aria-hidden="true"><span class="livro-pontos">' + modelo.map(function () { return "<i></i>"; }).join("") + "</span>" +
      '<span class="livro-folio"></span></span>' +
      '<span class="livro-contagem" aria-live="polite"></span>' +
      '<button type="button" class="livro-virar livro-proxima" aria-label="Próxima página"><span>Próxima</span> ›</button>';
    painel.appendChild(rodape);

    var ordem = modelo.map(function (p) { return p.id; });
    var indice = 0;

    function irPara(novo, focar) {
      if (novo < 0 || novo >= ordem.length) return;
      var direcao = novo >= indice ? "frente" : "tras";
      var mudou = novo !== indice || !painel.hasAttribute("data-pagina");
      indice = novo;
      painel.setAttribute("data-pagina", ordem[indice]);
      abas.querySelectorAll(".livro-aba").forEach(function (b, i) {
        var ativa = i === indice;
        b.setAttribute("aria-selected", ativa ? "true" : "false");
        b.setAttribute("tabindex", ativa ? "0" : "-1");
        if (ativa && focar) b.focus();
      });
      rodape.querySelectorAll(".livro-pontos i").forEach(function (p, i) { p.classList.toggle("ativo", i === indice); });
      rodape.querySelector(".livro-contagem").textContent = "Página " + (indice + 1) + " de " + ordem.length + ": " + modelo[indice].nome;
      rodape.querySelector(".livro-folio").textContent = "fólio " + romano(indice + 1) + " de " + romano(ordem.length);
      rodape.querySelector(".livro-anterior").disabled = indice === 0;
      var proxima = rodape.querySelector(".livro-proxima");
      proxima.disabled = indice === ordem.length - 1;
      if (indice < ordem.length - 1) proxima.querySelector("span").textContent = modelo[indice + 1].nome;
      else proxima.querySelector("span").textContent = "Fim";
      if (mudou && painel.hasAttribute("data-livro-pronto")) {
        try { painel.scrollTop = 0; } catch (e) {}
        if (movimento) {
          painel.classList.remove("livro-virando-frente", "livro-virando-tras");
          void painel.offsetWidth;
          painel.classList.add("livro-virando-" + direcao);
          clearTimeout(painel._livroTimer);
          painel._livroTimer = setTimeout(function () {
            painel.classList.remove("livro-virando-frente", "livro-virando-tras");
          }, 650);
        }
      }
    }

    abas.addEventListener("click", function (ev) {
      var b = ev.target.closest(".livro-aba");
      if (b) irPara(ordem.indexOf(b.getAttribute("data-livro-ir")), false);
    });
    abas.addEventListener("keydown", function (ev) {
      var alvo = null;
      if (ev.key === "ArrowRight") alvo = Math.min(ordem.length - 1, indice + 1);
      else if (ev.key === "ArrowLeft") alvo = Math.max(0, indice - 1);
      else if (ev.key === "Home") alvo = 0;
      else if (ev.key === "End") alvo = ordem.length - 1;
      if (alvo === null) return;
      ev.preventDefault();
      irPara(alvo, true);
    });
    rodape.querySelector(".livro-anterior").addEventListener("click", function () { irPara(indice - 1, false); });
    rodape.querySelector(".livro-proxima").addEventListener("click", function () { irPara(indice + 1, false); });

    // Setas do teclado em qualquer lugar do livro (menos em campos e sliders)
    painel.addEventListener("keydown", function (ev) {
      if (ev.defaultPrevented || (ev.key !== "ArrowRight" && ev.key !== "ArrowLeft")) return;
      var t = ev.target;
      if (t && t.closest && t.closest("input, textarea, select, [contenteditable], .livro-abas")) return;
      ev.preventDefault();
      irPara(indice + (ev.key === "ArrowRight" ? 1 : -1), false);
    });

    // Deslizar o dedo (fora do simulador, onde os sliders usam o arrasto)
    var toque = null;
    painel.addEventListener("touchstart", function (ev) {
      var t = ev.target;
      if (ev.touches.length !== 1 || (t && t.closest && t.closest("input, textarea, [data-livro-pg='simulador'], .sv-palco"))) { toque = null; return; }
      toque = { x: ev.touches[0].clientX, y: ev.touches[0].clientY, t: Date.now() };
    }, { passive: true });
    painel.addEventListener("touchend", function (ev) {
      if (!toque || !ev.changedTouches.length) return;
      var dx = ev.changedTouches[0].clientX - toque.x;
      var dy = ev.changedTouches[0].clientY - toque.y;
      var rapido = Date.now() - toque.t < 700;
      toque = null;
      if (rapido && Math.abs(dx) > 70 && Math.abs(dy) < 45) irPara(indice + (dx < 0 ? 1 : -1), false);
    }, { passive: true });

    irPara(0, false);
    painel.setAttribute("data-livro-pronto", "");

    // Acessível pelo console/testes
    painel._livroIrPara = function (id) { irPara(ordem.indexOf(id), false); };
  }

  function encadear(nome, negra) {
    var original = window[nome];
    if (typeof original !== "function") return;
    window[nome] = function () {
      var resultado = original.apply(this, arguments);
      try { montarLivro(negra); } catch (e) { /* sem livro, a runa abre inteira como antes */ }
      return resultado;
    };
  }
  encadear("abrirModalRuna", false);
  encadear("abrirModalRunaNegra", true);

  window.livroRuna = {
    irPara: function (id) {
      var painel = document.querySelector("#modal-overlay .painel-leitura.livro");
      if (painel && painel._livroIrPara) painel._livroIrPara(id);
    },
  };
})();
