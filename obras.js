/**
 * obras.js — OBRAS DO REINO: o MOTOR da Mesa de Projeto (etapa A2 do "Reino Vivo")
 * O visual fica em estilos/obras.css. As obras (dados, física e desenhos)
 * ficam em obras-catalogo.js, que precisa ser carregado ANTES deste arquivo.
 *
 * O QUE ELE FAZ
 *  Cada reino ganha UMA obra, projetada numa MESA DE PROJETO:
 *   - a criança escolhe CARTAS (2 decisões de 3 opções cada), e a planta da
 *     obra (um desenho em escala, em SVG) muda na hora;
 *   - ajusta duas RÉGUAS (parâmetros contínuos), com CUSTO contra o orçamento;
 *   - "Erguer e testar" monta a obra e aplica 3 estágios de carga, com
 *     MEDIDORES de verdade (um mostrador e quatro quadrinhos);
 *   - no fim sai um LAUDO DA OBRA selado: APROVADA, COM RESSALVA (obra fraca,
 *     que a grande tempestade da etapa B derruba) ou INTERDITADA (ferida);
 *   - o resultado FICA: no save e desenhado DENTRO do lugar do reino no mapa.
 *     De pé dá +20 PR uma vez; medalha de ouro dá +10 PR uma vez. Ferida não
 *     tira ponto. Reformar é de graça; reconstruída depois de queda ganha
 *     placa de bronze.
 *
 * O CONTRATO COM O CATÁLOGO (window.OBRAS_CATALOGO = { ordem, obras, util })
 *  Cada obra tem: id, nome, icone, guardia, emoji, orcamento, falas
 *  (nova, pe, ouro, fraca, ferida, reconstruida, orcamento, voltarFerida,
 *  voltarPe), cartas [{ id, titulo, opcoes, ordem }], ajustes [{ id, rotulo,
 *  min, max, passo, padrao, dica, formatar(v, cfg), falas { alto, baixo } }],
 *  estagios, medidor { titulo, valor(e), sub(e, cfg) }, tiles [{ rotulo,
 *  valor(e) | fs, sub, vazio }], escala(cfg), calcular(cfg) (função pura) e
 *  planta { fundo(), estrutura(cfg), deformar?(el, cfg, px), quedaPx?,
 *  legendaErguer }, mapa(situacao, dados).
 *  calcular devolve { completo, custo { itens, total, orcamento, dentro },
 *  estagios [{ id, nome, emoji, nota, fs, razao, deflPx, cargaTexto,
 *  esforcoTexto, resultado }], veredito, fsMin, motivosFraca, ouro, queda,
 *  resumo, itens (HTML), nota }.
 *
 * REGRAS
 *  - Nenhum arquivo antigo é alterado: este arquivo encadeia
 *    aposRenderizarBlocos (carregado DEPOIS do mapa-mundo.js, para os lugares
 *    do mapa já existirem) e só usa as funções globais com typeof.
 *  - Chave no localStorage: borgestravel_obras, pelo wrapper do navegacao.js.
 *    O formato é o mesmo da etapa A1 ({ bloco3: { estado, fraca, cfg, laudo,
 *    ... } }), então o save da Ponte dos Tendões continua valendo.
 *  - Poder Rúnico nunca diminui. Só opacity e transform se animam; com
 *    "reduzir movimento" tudo aparece na hora.
 *
 * PARA TESTES
 *  window.obrasReino: OBRAS, ORDEM, calcular(id, cfg), obterEstadoObras,
 *  situacao, abrirModalObra, fecharModalObra, decorar, DURACAO_ESTAGIO (ms por
 *  estágio; padrão 1800) e DURACAO_ERGUER (ms da montagem; padrão 1400).
 *  Cartas: [data-ob-carta][data-ob-opcao] (e também data-ob-<carta>="<opção>");
 *  réguas: #ob-aj-<id>.
 */
(function () {
  "use strict";
  if (typeof reinosDados === "undefined" || typeof document === "undefined") return;
  var CAT = window.OBRAS_CATALOGO;
  if (!CAT || !CAT.obras) return; // sem catálogo, sem obras (nada quebra)

  var CHAVE = "borgestravel_obras";
  var XP_OBRA = 20;
  var XP_OURO = 10;
  var OBRAS = CAT.obras;
  var ORDEM = (CAT.ordem || Object.keys(OBRAS)).filter(function (id) { return !!OBRAS[id]; });
  var movimento = !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  // ---------------------------------------------------------------------
  // Números em português e utilidades
  // ---------------------------------------------------------------------
  function fmt(n, casas) {
    casas = casas || 0;
    try { return Number(n).toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas }); }
    catch (e) { return String(Math.round(n * Math.pow(10, casas)) / Math.pow(10, casas)).replace(".", ","); }
  }
  function escapar(texto) {
    return String(texto).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  var ILHA = typeof ilhaAmaldicoada !== "undefined" ? ilhaAmaldicoada : null;
  function blocoDe(id) {
    if (ILHA && id === ILHA.id) return ILHA;
    return reinosDados.find(function (b) { return b.id === id; });
  }
  function nomeCurto(bloco) {
    var partes = String(bloco.title).split(/\s+[—-]\s+/);
    return (partes.length > 1 ? partes.slice(1).join(" — ") : partes[0]).replace(/^[^0-9A-Za-zÀ-ÿ]+/, "").trim();
  }
  function diaDeHoje() {
    var d = new Date();
    var m = String(d.getMonth() + 1), dia = String(d.getDate());
    return d.getFullYear() + "-" + (m.length < 2 ? "0" + m : m) + "-" + (dia.length < 2 ? "0" + dia : dia);
  }
  function diaPorExtenso(iso) {
    var p = String(iso || "").split("-");
    return p.length === 3 ? p[2] + "/" + p[1] + "/" + p[0] : "";
  }
  function limitar(v, a, b) { return Math.max(a, Math.min(b, v)); }
  // texto vindo do catálogo: valor fixo ou função; se a função não puder
  // responder ainda (ex.: precisa do estágio), devolve o reserva
  function texto(valor, args, reserva) {
    if (typeof valor !== "function") return valor == null ? reserva : valor;
    try { var v = valor.apply(null, args); return v == null ? reserva : v; } catch (e) { return reserva; }
  }
  function juntarComE(lista) {
    if (lista.length <= 1) return lista.join("");
    return lista.slice(0, -1).join(", ") + " e " + lista[lista.length - 1];
  }

  // ---------------------------------------------------------------------
  // Estado (localStorage, pelo wrapper do navegacao.js)
  //   { blocoX: { estado: "pe" | "ferida", fraca, cfg: { <carta>: opção,
  //               <ajuste>: número }, laudo: {...}, xpDado, xpOuroDado,
  //               reconstruida, ouro, quedas, dia } }
  // ---------------------------------------------------------------------
  function ler(chave) {
    if (typeof armazenamentoLer === "function") return armazenamentoLer(chave);
    try { return window.localStorage.getItem(chave); } catch (e) { return null; }
  }
  function gravar(chave, valor) {
    if (typeof armazenamentoGravar === "function") return armazenamentoGravar(chave, valor);
    try { window.localStorage.setItem(chave, valor); } catch (e) { /* bloqueado: segue só na memória */ }
  }
  function obterEstadoObras() {
    try {
      var salvo = ler(CHAVE);
      var obj = salvo ? JSON.parse(salvo) : {};
      return obj && typeof obj === "object" ? obj : {};
    } catch (e) { return {}; }
  }
  function salvarEstadoObras(estado) {
    try { gravar(CHAVE, JSON.stringify(estado)); } catch (e) { /* nunca derruba o jogo */ }
  }
  function cfgValida(obra, cfg) {
    if (!cfg) return false;
    return obra.cartas.every(function (c) { return !!c.opcoes[cfg[c.id]]; }) &&
      obra.ajustes.every(function (a) { return isFinite(cfg[a.id]); });
  }
  function cfgInicial(obra, dados) {
    var cfg = {};
    var salva = dados && cfgValida(obra, dados.cfg);
    obra.cartas.forEach(function (c) { cfg[c.id] = salva ? dados.cfg[c.id] : null; });
    obra.ajustes.forEach(function (a) { cfg[a.id] = salva ? limitar(Number(dados.cfg[a.id]), a.min, a.max) : a.padrao; });
    return cfg;
  }
  function copiarCfg(obra, cfg) {
    var c = {};
    obra.cartas.forEach(function (k) { c[k.id] = cfg[k.id]; });
    obra.ajustes.forEach(function (k) { c[k.id] = cfg[k.id]; });
    return c;
  }
  function situacao(dados) {
    if (!dados || !dados.estado) return "terreno";
    if (dados.estado === "ferida") return "ferida";
    return dados.fraca ? "fraca" : "pe";
  }
  function calcular(id, cfg) {
    var obra = OBRAS[id];
    return obra ? obra.calcular(cfg) : null;
  }
  // "economia" (dentro de 80% do orçamento) ou "beleza" (Cidadela)
  function motivoOuro(r) { return typeof r.ouroExtra === "boolean" ? "beleza" : "economia"; }

  // ---------------------------------------------------------------------
  // Mostrador (meio-círculo de latão com ponteiro)
  // ---------------------------------------------------------------------
  function svgMedidor() {
    return '<svg class="ob-medidor-svg" viewBox="0 0 120 72" aria-hidden="true" focusable="false">' +
      '<path class="ob-med-aro" d="M8 64A52 52 0 0 1 112 64"/>' +
      '<path class="ob-med-verde" d="M8 64A52 52 0 0 1 32.4 19.6"/>' +
      '<path class="ob-med-ambar" d="M32.4 19.6A52 52 0 0 1 86 18.9"/>' +
      '<path class="ob-med-vermelho" d="M86 18.9A52 52 0 0 1 112 64"/>' +
      '<path class="ob-med-ticks" d="M12 64h6M60 12v6M106 64h-6M30.9 23.6l3.1 4.4M86.5 18.6l-1.8 5.1"/>' +
      '<text class="ob-med-txt" x="14" y="58">0</text><text class="ob-med-txt" x="78" y="30">limite</text>' +
      '<g class="ob-med-ponteiro"><path d="M60 64L58 60 60 18 62 60z"/><circle cx="60" cy="64" r="4"/></g>' +
      "</svg>";
  }

  // ---------------------------------------------------------------------
  // O MAPA: a obra DENTRO do lugar do reino (mesmo viewBox 160×120 da
  // ilustração do mapa-mundo.js, sobreposta)
  // ---------------------------------------------------------------------
  function svgMapa(obra, dados) {
    var sit = situacao(dados);
    var miolo = "";
    try { miolo = obra.mapa(sit, dados) || ""; } catch (e) { miolo = ""; }
    return '<svg class="ob-mapa-svg ob-mapa-' + sit + '" viewBox="0 0 160 120" aria-hidden="true" focusable="false">' + miolo + "</svg>";
  }

  // Sobrepõe (ou atualiza) a obra num .mm-local / .mm-cena-reino. Idempotente:
  // só redesenha se a situação mudou, para não repetir animação a cada render.
  function marcarLocal(local, obra, dados) {
    var sit = situacao(dados);
    var chave = sit + (dados && dados.reconstruida ? "-bronze" : "") + (dados && dados.ouro ? "-ouro" : "");
    var atual = local.querySelector(":scope > .ob-mapa");
    if (atual && atual.getAttribute("data-ob-chave") === chave) return;
    if (!atual) {
      atual = document.createElement("span");
      atual.className = "ob-mapa";
      atual.setAttribute("aria-hidden", "true");
      local.appendChild(atual);
    }
    atual.setAttribute("data-ob-chave", chave);
    atual.setAttribute("data-ob-situacao", sit);
    atual.setAttribute("data-ob-obra", obra.id);
    atual.innerHTML = svgMapa(obra, dados);
  }

  // Quadro do reino aberto agora (onde a placa entra)
  function paineisAbertos(id) {
    var bloco = blocoDe(id);
    if (!bloco) return [];
    var lista = [];
    document.querySelectorAll("#lista-blocos .painel-runas-aberto").forEach(function (p) {
      var cor = (p.style.getPropertyValue("--cor-reino") || "").trim().toLowerCase();
      if (cor && cor === String(bloco.hex).toLowerCase()) lista.push(p);
    });
    document.querySelectorAll('#lista-blocos > [data-bloco-id="' + id + '"]').forEach(function (p) {
      var runas = p.querySelector(":scope > .lista-runas");
      if (runas && runas.style.display !== "none" && !p.classList.contains("tile-reino")) lista.push(p);
    });
    return lista;
  }

  function textoPlaca(obra, dados) {
    var sit = situacao(dados);
    var laudo = dados && dados.laudo;
    if (sit === "terreno") {
      var reguas = obra.ajustes.map(function (a) { return String(a.rotulo).toLowerCase(); });
      return { icone: "📐", titulo: "Mesa de Projeto: " + obra.nome, sub: "Terreno pronto, " + fmt(obra.orcamento) + " moedas no cofre. Escolha as cartas e acerte " + juntarComE(reguas) + ".", botao: "Projetar" };
    }
    if (sit === "ferida") return { icone: "💥", titulo: obra.nome + ": interditada", sub: (laudo && laudo.nomeQueda ? "Caiu quando " + laudo.nomeQueda + ". " : "") + (laudo && laudo.runa ? "A runa " + laudo.runa + " ensina a consertar." : ""), botao: "Reformar" };
    if (sit === "fraca") return { icone: obra.icone, titulo: obra.nome + ": de pé, com ressalva", sub: "Passou no teste" + (laudo && laudo.fsMin ? " com fator de segurança " + fmt(laudo.fsMin, 2) : "") + ". Reforça antes da grande tempestade.", botao: "Reforçar" };
    var extras = [];
    if (laudo && laudo.fsMin) extras.push("FS " + fmt(laudo.fsMin, 2));
    if (laudo && laudo.custo) extras.push(fmt(laudo.custo) + " de " + fmt(obra.orcamento) + " moedas");
    var medalha = laudo && laudo.ouroMotivo === "beleza" ? "Medalha de ouro: segura e bela." : "Medalha de ouro da economia.";
    return {
      icone: obra.icone,
      titulo: obra.nome + ": de pé" + (dados.ouro ? " · ouro" : "") + (dados.reconstruida ? " · reconstruída" : ""),
      sub: (extras.length ? extras.join(" · ") + ". " : "") + (dados.ouro ? medalha : "") + (dados.reconstruida ? " Placa de bronze: caiu uma vez e voltou mais forte." : ""),
      botao: "Ver a obra",
    };
  }

  function colocarPlaca(painel, obra, dados) {
    var chave = obra.id + "|" + situacao(dados) + "|" + (dados && dados.reconstruida ? "b" : "") + (dados && dados.ouro ? "o" : "") + "|" + (dados && dados.laudo ? dados.laudo.custo + "-" + dados.laudo.fsMin : "");
    var atual = painel.querySelector(":scope > .ob-placa");
    if (atual && atual.getAttribute("data-ob-chave") === chave) return;
    var t = textoPlaca(obra, dados);
    var placa = document.createElement("div");
    placa.className = "ob-placa ob-placa-" + situacao(dados);
    placa.setAttribute("data-ob-chave", chave);
    placa.setAttribute("data-ob-situacao", situacao(dados));
    placa.innerHTML =
      '<span class="ob-placa-icone" aria-hidden="true">' + t.icone + "</span>" +
      '<span class="ob-placa-texto"><strong class="ob-placa-titulo">' + escapar(t.titulo) + "</strong>" +
      '<span class="ob-placa-sub">' + escapar(t.sub) + "</span></span>" +
      '<button type="button" class="btn-gotico ob-botao" data-ob-abrir="' + obra.id + '" aria-label="' + escapar(t.botao + ": " + obra.nome) + '">' + escapar(t.botao) + "</button>";
    if (atual) atual.replaceWith(placa);
    else {
      var runas = painel.querySelector(":scope > .lista-runas");
      if (runas) painel.insertBefore(placa, runas); else painel.appendChild(placa);
    }
  }

  // ---------------------------------------------------------------------
  // A ILHA: com a conquista "Ponte Redimida" (simulador da runa E.7), a
  // ponte quebrada do desenho da ilha ganha uma ponte nova por cima
  // ---------------------------------------------------------------------
  var CONQUISTA_ILHA = "ponte-redimida";
  function ilhaRedimida() {
    try { return typeof obterEstadoJogo === "function" && (obterEstadoJogo().conquistas || []).indexOf(CONQUISTA_ILHA) >= 0; } catch (e) { return false; }
  }
  function svgPonteIlha() {
    var T = ' stroke="#3b2412" stroke-linejoin="round" stroke-linecap="round"';
    var anda = CAT.util && CAT.util.andantes ? CAT.util.andantes(8, 77.4, 38) : "";
    return '<svg class="ob-mapa-svg" viewBox="0 0 160 120" aria-hidden="true" focusable="false">' +
      '<path d="M10 86v19M24 86v18M38 86v17"' + T + ' stroke-width="2.2" fill="none"/>' +
      '<path d="M10 92l14 8M24 92l-14 8M24 92l14 8M38 92l-14 8"' + T + ' stroke-width=".8" fill="none" opacity=".7"/>' +
      '<rect class="ob-ilha-deck" x="1" y="82" width="54" height="4.4" rx=".8" fill="#a8733d"' + T + ' stroke-width="1"/>' +
      '<path d="M1 77h54M7 82v-5M15 82v-5M23 82v-5M31 82v-5M39 82v-5M47 82v-5"' + T + ' stroke-width=".8" fill="none"/>' +
      '<path d="M5 77v-9"' + T + ' stroke-width=".9"/><path d="M5 68l7 2.4-7 2.4z" fill="#d4af37"' + T + ' stroke-width=".6"/>' +
      anda + "</svg>";
  }
  function decorarIlha() {
    if (!ILHA) return;
    var lugares = Array.prototype.slice.call(document.querySelectorAll('#lista-blocos [data-bloco-id="' + ILHA.id + '"] .mm-local'));
    paineisAbertos(ILHA.id).forEach(function (painel) {
      var cena = painel.querySelector(".mm-cena-reino");
      if (cena) lugares.push(cena);
    });
    var redimida = ilhaRedimida();
    lugares.forEach(function (local) {
      var atual = local.querySelector(":scope > .ob-ilha-ponte");
      if (!redimida) { if (atual) atual.remove(); return; }
      if (atual) return;
      var span = document.createElement("span");
      span.className = "ob-mapa ob-ilha-ponte";
      span.setAttribute("aria-hidden", "true");
      span.setAttribute("data-ob-obra", ILHA.id);
      span.setAttribute("data-ob-situacao", "pe");
      span.innerHTML = svgPonteIlha();
      local.appendChild(span);
    });
  }

  function decorar() {
    try { decorarIlha(); } catch (e) { /* enfeite: nunca derruba o mapa */ }
    var estado = obterEstadoObras();
    ORDEM.forEach(function (id) {
      var obra = OBRAS[id], dados = estado[id];
      if (!blocoDe(id)) return;
      document.querySelectorAll('#lista-blocos [data-bloco-id="' + id + '"] .mm-local').forEach(function (local) {
        marcarLocal(local, obra, dados);
      });
      paineisAbertos(id).forEach(function (painel) {
        colocarPlaca(painel, obra, dados);
        var cena = painel.querySelector(".mm-cena-reino");
        if (cena) marcarLocal(cena, obra, dados);
      });
    });
  }

  // ---------------------------------------------------------------------
  // A MESA DE PROJETO (janela)
  // ---------------------------------------------------------------------
  var focoAnterior = null;

  function duracoes() {
    var cfg = window.obrasReino || {};
    var e = Number(cfg.DURACAO_ESTAGIO), m = Number(cfg.DURACAO_ERGUER);
    return { estagio: movimento ? (isFinite(e) ? e : 1800) : 0, erguer: movimento ? (isFinite(m) ? m : 1400) : 0 };
  }
  // interpolação simples com requestAnimationFrame (só muda atributos d)
  function tween(ms, passo, fim) {
    if (!(ms > 0) || typeof requestAnimationFrame !== "function") { passo(1); if (fim) fim(); return; }
    var t0 = null;
    function quadro(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min(1, (ts - t0) / ms);
      var s = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p; // ease in-out
      passo(s);
      if (p < 1) requestAnimationFrame(quadro); else if (fim) fim();
    }
    requestAnimationFrame(quadro);
  }

  function cartaHTML(carta, opcao, selecionado) {
    var preco = opcao.moedas || (opcao.preco ? fmt(opcao.preco) + " moedas" : "de graça");
    return '<button type="button" class="ob-carta' + (selecionado ? " ob-carta-marcada" : "") + '" data-ob-carta="' + escapar(carta.id) + '" data-ob-opcao="' + escapar(opcao.id) + '" data-ob-' + escapar(carta.id) + '="' + escapar(opcao.id) + '" aria-pressed="' + (selecionado ? "true" : "false") + '">' +
      '<span class="ob-carta-icone">' + (opcao.icone || "") + "</span>" +
      '<span class="ob-carta-nome">' + escapar(opcao.nome) + "</span>" +
      '<span class="ob-carta-resumo">' + escapar(opcao.resumo || "") + "</span>" +
      '<span class="ob-carta-preco" title="custo relativo">' + escapar(preco) + "</span></button>";
  }

  var ROMANOS = ["I", "II", "III", "IV", "V", "VI"];

  function abrirModalObra(id) {
    var obra = OBRAS[id], bloco = blocoDe(id);
    if (!obra || !bloco) return;
    fecharModalObra();
    focoAnterior = document.activeElement;

    var dados = obterEstadoObras()[id] || null;
    var cfg = cfgInicial(obra, dados);
    var testando = false;
    var numerosCartas = obra.cartas.map(function (c, i) { return ROMANOS[i]; });

    var overlay = document.createElement("div");
    overlay.id = "modal-obra-overlay";
    overlay.className = "ob-overlay";
    var painel = document.createElement("div");
    painel.className = "painel-leitura ob-janela ob-obra-" + id;
    painel.setAttribute("role", "dialog");
    painel.setAttribute("aria-modal", "true");
    painel.setAttribute("aria-labelledby", "ob-titulo");
    painel.style.setProperty("--cor-reino", bloco.hex);

    var tilesHTML = obra.tiles.map(function (t, i) {
      var sub = typeof t.sub === "string" ? t.sub : (t.vazio || "");
      return '<div class="ob-tile"><span class="ob-tile-rotulo">' + escapar(t.rotulo) + '</span><strong class="ob-tile-valor" id="' + (t.fs ? "ob-m-fs" : "ob-m-tile-" + i) + '">—</strong><span class="ob-tile-sub" id="ob-m-tile-' + i + '-sub">' + escapar(sub) + "</span></div>";
    }).join("");
    var cartasHTML = obra.cartas.map(function (c, i) {
      return '<div class="ob-secao" role="group" aria-labelledby="ob-sec-' + (i + 1) + '"><h3 id="ob-sec-' + (i + 1) + '" class="font-display ob-secao-titulo"><span class="ob-romano">' + ROMANOS[i] + "</span> " + escapar(c.titulo) + '</h3><div class="ob-cartas" id="ob-cartas-' + escapar(c.id) + '"></div></div>';
    }).join("");
    var nAj = obra.cartas.length + 1;
    var ajustesHTML = obra.ajustes.map(function (a) {
      return '<label class="ob-ajuste"><span class="ob-ajuste-rotulo">' + escapar(a.rotulo) + ' <output id="ob-aj-' + escapar(a.id) + '-valor"></output></span><input type="range" id="ob-aj-' + escapar(a.id) + '" data-ob-ajuste="' + escapar(a.id) + '" min="' + a.min + '" max="' + a.max + '" step="' + a.passo + '" value="' + cfg[a.id] + '"><span class="ob-ajuste-dica">' + escapar(a.dica || "") + "</span></label>";
    }).join("");

    painel.innerHTML =
      '<button type="button" id="ob-fechar" class="btn-gotico ob-fechar" aria-label="Fechar a mesa de projeto">✕</button>' +
      '<span class="ob-kicker">Mesa de Projeto · ' + escapar(nomeCurto(bloco)) + "</span>" +
      '<h2 id="ob-titulo" class="font-display ob-titulo">' + obra.icone + " " + escapar(obra.nome) + "</h2>" +
      '<div class="ob-guardia"><span class="ob-guardia-avatar" aria-hidden="true">' + obra.emoji + "</span>" +
      '<div class="ob-guardia-balao"><strong class="font-display ob-guardia-nome">' + escapar(obra.guardia) + "</strong>" +
      '<span class="font-body" id="ob-fala" aria-live="polite"></span></div></div>' +
      // a prancha
      '<div class="ob-prancha" id="ob-prancha">' +
        '<div class="ob-prancha-cab"><span class="ob-prancha-rotulo">Prancha I · planta da obra, em escala</span><span class="ob-prancha-escala" id="ob-escala"></span></div>' +
        '<svg class="ob-cena-svg" id="ob-cena" viewBox="0 36 360 174" aria-hidden="true" focusable="false"><g class="ob-fundo">' + obra.planta.fundo() + '</g><g class="ob-estrutura" id="ob-estrutura"></g></svg>' +
        '<p class="ob-cena-legenda" id="ob-legenda" aria-live="polite"></p>' +
      "</div>" +
      // medidores
      '<div class="ob-medidores" id="ob-medidores">' +
        '<div class="ob-medidor"><span class="ob-med-titulo">' + escapar(obra.medidor.titulo) + "</span>" + svgMedidor() + '<strong class="ob-med-valor" id="ob-m-medidor">—</strong><span class="ob-med-sub" id="ob-m-medidor-sub">—</span></div>' +
        '<div class="ob-tiles">' + tilesHTML + "</div>" +
      "</div>" +
      '<div class="divisor-rune"></div>' +
      cartasHTML +
      '<div class="ob-secao" role="group" aria-labelledby="ob-sec-' + nAj + '"><h3 id="ob-sec-' + nAj + '" class="font-display ob-secao-titulo"><span class="ob-romano">' + ROMANOS[nAj - 1] + "</span> Os ajustes</h3>" +
        '<div class="ob-ajustes">' + ajustesHTML + "</div>" +
      "</div>" +
      // o orçamento
      '<div class="ob-orcamento" id="ob-orcamento" aria-live="polite"><div class="ob-orc-cab"><span class="ob-orc-rotulo">Custo da obra</span><strong class="ob-orc-valor" id="ob-orc-valor"></strong></div>' +
        '<div class="ob-orc-barra" id="ob-orc-barra" aria-hidden="true"></div>' +
        '<span class="ob-orc-detalhe" id="ob-orc-detalhe"></span></div>' +
      '<button type="button" id="ob-erguer" class="btn-gotico ob-erguer" disabled></button>' +
      '<div id="ob-laudo" class="ob-laudo-area" aria-live="polite"></div>';

    var cena = painel.querySelector("#ob-cena");
    var estrutura = painel.querySelector("#ob-estrutura");
    var legenda = painel.querySelector("#ob-legenda");
    var fala = painel.querySelector("#ob-fala");
    var botaoErguer = painel.querySelector("#ob-erguer");
    var areaLaudo = painel.querySelector("#ob-laudo");
    var classesEstagio = obra.estagios.map(function (e) { return "ob-est-" + e.id; });

    function dizer(t) { fala.textContent = t; }

    function desenharCartas() {
      obra.cartas.forEach(function (c) {
        painel.querySelector("#ob-cartas-" + c.id).innerHTML = c.ordem.map(function (k) { return cartaHTML(c, c.opcoes[k], cfg[c.id] === k); }).join("");
      });
    }

    function atualizarPlanta() {
      estrutura.innerHTML = obra.planta.estrutura(cfg);
      cena.setAttribute("class", "ob-cena-svg");
      legenda.textContent = "";
    }

    function atualizarAjustes() {
      obra.ajustes.forEach(function (a) {
        painel.querySelector("#ob-aj-" + a.id + "-valor").textContent = texto(a.formatar, [cfg[a.id], cfg], fmt(cfg[a.id], 1));
      });
      var r = obra.calcular(cfg);
      painel.querySelector("#ob-escala").textContent = texto(obra.escala, [cfg], "");
      // orçamento: uma faixa por item de custo
      var orc = r.custo, sobra = orc.orcamento;
      painel.querySelector("#ob-orc-valor").textContent = fmt(orc.total) + " de " + fmt(orc.orcamento) + " moedas";
      painel.querySelector("#ob-orc-barra").innerHTML = orc.itens.map(function (it, i) {
        var largura = Math.max(0, Math.min(it.valor, sobra));
        sobra -= largura;
        return '<i class="ob-orc-seg ob-orc-seg-' + i + '" style="width:' + (100 * largura / orc.orcamento) + '%"></i>';
      }).join("");
      painel.querySelector("#ob-orc-detalhe").textContent = orc.itens.map(function (it) { return it.rotulo + " " + fmt(it.valor); }).join(" · ") + (orc.dentro ? "" : " · o tesoureiro nega: passa do orçamento");
      painel.querySelector("#ob-orcamento").classList.toggle("ob-orc-estourado", !orc.dentro);
      // subtítulos que já dá para mostrar só com as cartas
      painel.querySelector("#ob-m-medidor-sub").textContent = r.completo ? texto(obra.medidor.sub, [null, cfg], "—") : "—";
      obra.tiles.forEach(function (t, i) {
        if (typeof t.sub === "string") return;
        painel.querySelector("#ob-m-tile-" + i + "-sub").textContent = r.completo ? texto(t.sub, [null, cfg], t.vazio || "") : (t.vazio || "");
      });
      atualizarBotao(r);
    }

    function atualizarBotao(r) {
      r = r || obra.calcular(cfg);
      var pode = r.completo && r.custo.dentro && !testando;
      botaoErguer.disabled = !pode;
      botaoErguer.textContent = !r.completo ? "⚒️ Escolha as cartas " + juntarComE(numerosCartas) : !r.custo.dentro ? "⚒️ Passa do orçamento: afine o projeto" : testando ? "⚒️ Erguendo e testando..." : "⚒️ Erguer e testar a obra";
    }

    function limparMedidores() {
      painel.querySelector("#ob-m-medidor").textContent = "—";
      obra.tiles.forEach(function (t, i) {
        var el = painel.querySelector("#" + (t.fs ? "ob-m-fs" : "ob-m-tile-" + i));
        el.textContent = "—";
        el.className = "ob-tile-valor";
      });
      var r = obra.calcular(cfg);
      obra.tiles.forEach(function (t, i) {
        if (typeof t.sub === "string") return;
        painel.querySelector("#ob-m-tile-" + i + "-sub").textContent = r.completo ? texto(t.sub, [null, cfg], t.vazio || "") : (t.vazio || "");
      });
      painel.querySelector(".ob-med-ponteiro").style.transform = "rotate(-90deg)";
    }
    function mostrarMedidores(est) {
      painel.querySelector("#ob-m-medidor").textContent = texto(obra.medidor.valor, [est, cfg], "—");
      painel.querySelector("#ob-m-medidor-sub").textContent = texto(obra.medidor.sub, [est, cfg], "—");
      obra.tiles.forEach(function (t, i) {
        var el = painel.querySelector("#" + (t.fs ? "ob-m-fs" : "ob-m-tile-" + i));
        if (t.fs) {
          el.textContent = fmt(est.fs, 2);
          el.className = "ob-tile-valor " + (est.fs >= 1.5 ? "ob-bom" : est.fs >= 1 ? "ob-atencao" : "ob-ruim");
        } else {
          el.textContent = texto(t.valor, [est, cfg], "—");
        }
        if (typeof t.sub !== "string") painel.querySelector("#ob-m-tile-" + i + "-sub").textContent = texto(t.sub, [est, cfg], t.vazio || "");
      });
      var razao = isFinite(est.razao) ? est.razao : (est.fs > 0 ? 1 / est.fs : 0);
      painel.querySelector(".ob-med-ponteiro").style.transform = "rotate(" + (-90 + 180 * Math.min(Math.max(razao, 0) / 1.5, 1)) + "deg)";
    }

    // deforma a obra até o deslocamento do estágio (exagerado), se ela souber
    var deflAtual = 0;
    function deformar(paraPx, ms, fim) {
      if (typeof obra.planta.deformar !== "function") { if (fim) fim(); return; }
      var de = deflAtual;
      tween(ms, function (s) {
        var px = de + (paraPx - de) * s;
        deflAtual = px;
        try { obra.planta.deformar(estrutura, cfg, px); } catch (e) { /* desenho é enfeite */ }
      }, fim);
    }
    function pxDaQueda(tipo) {
      var q = obra.planta.quedaPx || {};
      return isFinite(q[tipo]) ? q[tipo] : null;
    }

    function erguerETestar() {
      var r = obra.calcular(cfg);
      if (testando || !r.completo || !r.custo.dentro) return;
      testando = true;
      areaLaudo.innerHTML = "";
      deflAtual = 0;
      atualizarPlanta();
      limparMedidores();
      atualizarBotao(r);
      var dur = duracoes();
      cena.style.setProperty("--ob-dur", (dur.estagio / 1000) + "s");
      cena.classList.add("ob-erguendo");
      legenda.textContent = obra.planta.legendaErguer || "🏗️ Erguendo a obra...";
      setTimeout(function () {
        cena.classList.remove("ob-erguendo");
        cena.classList.add("ob-erguida");
        estagio(0, r);
      }, dur.erguer);
    }

    function estagio(i, r) {
      var est = r.estagios[i];
      var dur = duracoes();
      classesEstagio.forEach(function (c) { cena.classList.remove(c); });
      cena.classList.add("ob-est-" + est.id);
      legenda.textContent = est.emoji + " Estágio " + (i + 1) + ": " + est.nome + (est.nota ? " (" + est.nota + ")" : "");
      mostrarMedidores(est);
      deformar(isFinite(est.deflPx) ? est.deflPx : 0, Math.min(700, dur.estagio * 0.4));
      setTimeout(function () {
        if (est.resultado === "falha") return concluir(r);
        if (i + 1 >= r.estagios.length) return concluir(r);
        estagio(i + 1, r);
      }, dur.estagio);
    }

    function runaDoLaudo(r) {
      if (r.veredito === "ferida") return r.queda.runa || null;
      for (var i = 0; i < r.motivosFraca.length; i++) if (r.motivosFraca[i].runa) return r.motivosFraca[i].runa;
      return null;
    }

    function concluir(r) {
      var estado = obterEstadoObras();
      var antes = estado[id] || {};
      var caiu = r.veredito === "ferida";
      var novo = {
        estado: caiu ? "ferida" : "pe",
        fraca: r.veredito === "fraca",
        cfg: copiarCfg(obra, cfg),
        laudo: {
          veredito: r.veredito, custo: r.custo.total, fsMin: r.fsMin, runa: runaDoLaudo(r),
          estagioQueda: caiu ? r.queda.estagio : null, tipoQueda: caiu ? r.queda.tipo : null, nomeQueda: caiu ? r.queda.nome : null,
          ouroMotivo: motivoOuro(r),
        },
        xpDado: !!antes.xpDado, xpOuroDado: !!antes.xpOuroDado,
        reconstruida: !!antes.reconstruida || (!caiu && antes.estado === "ferida"),
        ouro: !caiu && (r.ouro || !!antes.ouro),
        quedas: (antes.quedas || 0) + (caiu ? 1 : 0),
        dia: diaDeHoje(),
      };
      var reconstruiuAgora = !caiu && antes.estado === "ferida";
      var ganhouXP = 0;
      if (!caiu && !novo.xpDado) { novo.xpDado = true; ganhouXP += XP_OBRA; }
      if (!caiu && r.ouro && !novo.xpOuroDado) { novo.xpOuroDado = true; ganhouXP += XP_OURO; }
      estado[id] = novo;
      salvarEstadoObras(estado);

      // a cena cai ou comemora
      if (caiu) {
        cena.classList.add("ob-caiu", "ob-falha-" + r.queda.tipo);
        var px = pxDaQueda(r.queda.tipo);
        if (px !== null) deformar(px, 600);
      } else {
        cena.classList.add(novo.fraca ? "ob-range" : "ob-ok");
        deformar(0, 500);
      }
      legenda.textContent = caiu ? "💥 Estágio " + r.queda.estagio + ": " + r.queda.nome + "... e a obra cai." : (novo.fraca ? "⚠️ Passou nos três estágios, rangendo." : "🎉 Passou nos três estágios.");
      if (typeof somTocar === "function") { try { somTocar(caiu ? "erro" : "acerto"); } catch (e) {} }

      if (ganhouXP && typeof obterEstadoJogo === "function" && typeof salvarEstadoJogo === "function") {
        try {
          var jogo = obterEstadoJogo();
          jogo.xp += ganhouXP;
          salvarEstadoJogo(jogo);
          if (typeof atualizarBarraXP === "function") atualizarBarraXP();
          if (typeof mostrarToast === "function") mostrarToast("Obra de pé! +" + ganhouXP + " PR", r.ouro ? "🏅" : "🏗️");
          if (typeof verificarConquistas === "function") verificarConquistas();
        } catch (e) { /* o XP é um bônus: a obra continua salva */ }
      }

      // selo Mestre de Obras: confere toda vez que uma obra fica de pé
      if (!caiu && !ganhouXP && typeof verificarConquistas === "function") { try { verificarConquistas(); } catch (e) {} }

      areaLaudo.innerHTML = laudoHTML(r, novo, reconstruiuAgora, ganhouXP);
      var falaFinal = caiu ? obra.falas.ferida : reconstruiuAgora ? obra.falas.reconstruida : novo.fraca ? obra.falas.fraca : r.ouro ? obra.falas.ouro : obra.falas.pe;
      dizer(falaFinal);

      var voltar = areaLaudo.querySelector("#ob-voltar");
      if (voltar) voltar.addEventListener("click", function () {
        areaLaudo.innerHTML = "";
        deflAtual = 0;
        atualizarPlanta();
        limparMedidores();
        dizer(caiu ? obra.falas.voltarFerida : obra.falas.voltarPe);
        var primeira = painel.querySelector(".ob-carta");
        if (primeira) primeira.focus();
      });
      areaLaudo.querySelectorAll("[data-ob-ler]").forEach(function (b) {
        b.addEventListener("click", function () {
          var runa = b.getAttribute("data-ob-ler");
          fecharModalObra();
          if (typeof abrirModalRuna === "function") abrirModalRuna(runa);
        });
      });

      testando = false;
      atualizarBotao(r);
      try { decorar(); } catch (e) {}
      if (typeof areaLaudo.scrollIntoView === "function") { try { areaLaudo.scrollIntoView({ block: "nearest", behavior: movimento ? "smooth" : "auto" }); } catch (e) {} }
    }

    function laudoHTML(r, novo, reconstruiuAgora, ganhouXP) {
      var carimbo = r.veredito === "pe" ? "Aprovada" : r.veredito === "fraca" ? "Com ressalva" : "Interditada";
      var colEsforco = String(obra.medidor.titulo).split(/\s+/)[0];
      var linhas = r.estagios.map(function (e) {
        var marca = e.resultado === "ok" ? "✓" : e.resultado === "range" ? "⚠" : e.resultado === "falha" ? "✗" : "—";
        var cls = e.resultado === "ok" ? "ob-bom" : e.resultado === "range" ? "ob-atencao" : e.resultado === "falha" ? "ob-ruim" : "ob-neutro";
        var vazio = e.resultado === "nao";
        return "<tr><td>" + e.emoji + " " + escapar(e.nome.charAt(0).toUpperCase() + e.nome.slice(1)) + "</td>" +
          "<td>" + (vazio ? "—" : escapar(e.cargaTexto || "")) + "</td><td>" + (vazio ? "—" : escapar(e.esforcoTexto || "")) + "</td><td>" + (vazio ? "—" : fmt(e.fs, 2)) + '</td><td class="' + cls + '">' + marca + "</td></tr>";
      }).join("");
      var beleza = motivoOuro(r) === "beleza";
      var t;
      if (r.veredito === "ferida") t = r.queda.porque;
      else if (r.veredito === "fraca") t = "Passou, mas " + r.motivosFraca.map(function (m) { return m.texto; }).join("; e ") + ". A obra fica de pé com ressalva: a grande tempestade decide.";
      else t = (r.resumo || "") + (r.ouro ? (beleza ? " Segura e bela: medalha de ouro do reino." : " E custou " + fmt(r.custo.total) + " moedas, dentro de 80% do orçamento: medalha de ouro da economia.") : "");
      var runaLink = runaDoLaudo(r);
      var medalha = r.ouro ? (beleza ? "🏅 Medalha de ouro: segura e bela. " : "🏅 Medalha de ouro da economia. ") : "";
      var bronze = novo.reconstruida && r.veredito !== "ferida" ? "🥉 Placa de bronze: reconstruída depois de uma queda." : "";
      return '<div class="ob-laudo ob-laudo-' + r.veredito + '">' +
        '<div class="ob-laudo-cab"><span class="ob-kicker">Laudo da Obra · ' + escapar(diaPorExtenso(novo.dia)) + "</span><h3 class=\"font-display\">" + escapar(obra.nome) + "</h3>" +
        '<span class="ob-carimbo" aria-label="Veredito: ' + carimbo + '">' + carimbo + "</span></div>" +
        '<div class="ob-laudo-tabela-caixa"><table class="ob-laudo-tabela"><thead><tr><th>Estágio</th><th>Carga</th><th>' + escapar(colEsforco) + "</th><th>FS</th><th></th></tr></thead><tbody>" + linhas + "</tbody></table></div>" +
        '<p class="ob-laudo-texto">' + escapar(t) + "</p>" +
        '<ul class="ob-laudo-itens">' +
          (r.itens || []).map(function (h) { return "<li>" + h + "</li>"; }).join("") + // HTML montado pelo catálogo (valores já escapados lá)
          "<li><strong>Custo:</strong> " + fmt(r.custo.total) + " de " + fmt(obra.orcamento) + " moedas</li>" +
        "</ul>" +
        (medalha || bronze ? '<p class="ob-laudo-medalha">' + medalha + bronze + "</p>" : "") +
        (ganhouXP ? '<p class="ob-xp">✨ +' + ganhouXP + " Poder Rúnico</p>" : "") +
        '<p class="ob-assinatura">Assinado e selado: ' + escapar(obra.guardia) + "</p>" +
        '<div class="ob-acoes">' + (runaLink ? '<button type="button" class="btn-gotico" data-ob-ler="' + escapar(runaLink) + '">📖 Ler a runa ' + escapar(runaLink) + "</button>" : "") +
          '<button type="button" class="btn-gotico" id="ob-voltar">' + (r.veredito === "ferida" ? "🔨 Reformar (de graça)" : "📐 Voltar à mesa") + "</button></div>" +
        (r.nota ? '<p class="ob-nota">' + escapar(r.nota) + "</p>" : "") +
        "</div>";
    }

    // ---- eventos ----
    painel.addEventListener("click", function (ev) {
      var carta = ev.target.closest ? ev.target.closest(".ob-carta") : null;
      if (!carta || testando) return;
      var cId = carta.getAttribute("data-ob-carta"), oId = carta.getAttribute("data-ob-opcao");
      var def = obra.cartas.find(function (c) { return c.id === cId; });
      if (!def || !def.opcoes[oId]) return;
      cfg[cId] = oId;
      dizer(def.opcoes[oId].seda || "");
      areaLaudo.innerHTML = "";
      deflAtual = 0;
      desenharCartas();
      atualizarPlanta();
      atualizarAjustes();
      limparMedidores();
      var marcada = painel.querySelector('[data-ob-carta="' + cId + '"][data-ob-opcao="' + oId + '"]');
      if (marcada && typeof marcada.focus === "function") marcada.focus(); // o foco não se perde ao redesenhar
    });
    obra.ajustes.forEach(function (a) {
      var el = painel.querySelector("#ob-aj-" + a.id);
      el.addEventListener("input", function () {
        if (testando) { el.value = cfg[a.id]; return; }
        cfg[a.id] = Number(el.value);
        areaLaudo.innerHTML = "";
        deflAtual = 0;
        atualizarPlanta();
        atualizarAjustes();
        limparMedidores();
        var faixa = (a.max - a.min) * 0.15;
        var f = a.falas || {};
        if (f.baixo && cfg[a.id] <= a.min + faixa) dizer(f.baixo);
        else if (f.alto && cfg[a.id] >= a.max - faixa) dizer(f.alto);
        else if (!obra.calcular(cfg).custo.dentro) dizer(obra.falas.orcamento);
      });
    });
    botaoErguer.addEventListener("click", erguerETestar);
    painel.querySelector("#ob-fechar").addEventListener("click", fecharModalObra);
    overlay.addEventListener("click", function (ev) { if (ev.target === overlay) fecharModalObra(); });
    overlay.appendChild(painel);
    document.body.appendChild(overlay);
    document.addEventListener("keydown", fecharComEsc);

    // ---- estado inicial ----
    desenharCartas();
    atualizarPlanta();
    atualizarAjustes();
    limparMedidores();
    var sit = situacao(dados);
    if (sit === "ferida" && dados.laudo) {
      cena.classList.add("ob-erguida", "ob-caiu", "ob-falha-" + (dados.laudo.tipoQueda || "queda"));
      var pxQ = pxDaQueda(dados.laudo.tipoQueda);
      if (pxQ !== null) deformar(pxQ, 0);
      legenda.textContent = "💥 Interditada: caiu quando " + (dados.laudo.nomeQueda || "a carga chegou") + ". Reforme o projeto e teste de novo.";
      dizer(obra.falas.ferida);
    } else if (sit === "pe" || sit === "fraca") {
      cena.classList.add("ob-erguida", sit === "fraca" ? "ob-range" : "ob-ok");
      legenda.textContent = sit === "fraca" ? "⚠️ De pé, com ressalva. Dá para reforçar." : "🎉 De pé. Dá para refazer mais barato?";
      dizer(sit === "fraca" ? obra.falas.fraca : dados.ouro ? obra.falas.ouro : obra.falas.pe);
    } else {
      dizer(obra.falas.nova);
    }
    var fechar = painel.querySelector("#ob-fechar");
    if (fechar && typeof fechar.focus === "function") fechar.focus();
  }

  function fecharComEsc(ev) {
    if (ev.key === "Escape") fecharModalObra();
  }
  function fecharModalObra() {
    var overlay = document.getElementById("modal-obra-overlay");
    if (!overlay) return;
    overlay.remove();
    document.removeEventListener("keydown", fecharComEsc);
    if (focoAnterior && typeof focoAnterior.focus === "function" && document.contains(focoAnterior)) {
      try { focoAnterior.focus(); } catch (e) {}
    }
    focoAnterior = null;
  }

  // ---------------------------------------------------------------------
  // Encadeamentos
  // ---------------------------------------------------------------------
  document.addEventListener("click", function (ev) {
    var alvo = ev.target && ev.target.closest ? ev.target.closest("[data-ob-abrir]") : null;
    if (!alvo) return;
    ev.preventDefault();
    ev.stopPropagation(); // não abre/fecha o reino ao clicar no botão da placa
    abrirModalObra(alvo.getAttribute("data-ob-abrir"));
  });

  if (typeof aposRenderizarBlocos === "function") {
    var aposOriginal = aposRenderizarBlocos;
    aposRenderizarBlocos = function () {
      var resultado = aposOriginal.apply(this, arguments);
      try { decorar(); } catch (e) { /* a obra nunca derruba o jogo */ }
      return resultado;
    };
  }
  if (document.readyState !== "loading") { try { decorar(); } catch (e) {} }

  // Selo "Mestre de Obras": as 7 obras de pé (com ressalva também conta).
  // Entra no FIM da lista (a Galeria e os cadeados leem pela ordem dela).
  function obrasDePe() {
    var estado = obterEstadoObras();
    return ORDEM.filter(function (id) { return estado[id] && estado[id].estado === "pe"; }).length;
  }
  if (typeof CONQUISTAS_DEFINICOES !== "undefined" && Array.isArray(CONQUISTAS_DEFINICOES) &&
      !CONQUISTAS_DEFINICOES.some(function (d) { return d.id === "mestre-de-obras"; })) {
    CONQUISTAS_DEFINICOES.push({
      id: "mestre-de-obras", nome: "Mestre de Obras", icone: "🏗️",
      desc: "Deixou de pé as " + ORDEM.length + " obras do reino, uma em cada Mesa de Projeto",
      condicao: function () { return obrasDePe() >= ORDEM.length; },
    });
    if (typeof atualizarGaleriaConquistas === "function") { try { atualizarGaleriaConquistas(); } catch (e) {} }
  }
  // a ponte da Ilha aparece na hora em que a conquista é ganha
  if (typeof concederConquistaPonte === "function") {
    var concederOriginal = concederConquistaPonte;
    concederConquistaPonte = function () {
      var resultado = concederOriginal.apply(this, arguments);
      try { decorar(); } catch (e) {}
      return resultado;
    };
  }

  window.obrasReino = {
    OBRAS: OBRAS, ORDEM: ORDEM,
    DURACAO_ESTAGIO: 1800, DURACAO_ERGUER: 1400,
    calcular: calcular, obterEstadoObras: obterEstadoObras, situacao: situacao, obrasDePe: obrasDePe,
    abrirModalObra: abrirModalObra, fecharModalObra: fecharModalObra, decorar: decorar,
  };
  document.documentElement.classList.add("ob-ativo");
})();
