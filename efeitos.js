/**
 * efeitos.js — Efeitos visuais ambientais do Mundo Borgestrável (Fase 3)
 *
 * Popula o div#fundo-magico com: estrelas piscando, a lua, partículas
 * douradas flutuando e névoa na base da tela. Também aplica um efeito
 * de parallax simples ao rolar a página (a lua e as estrelas se movem
 * mais devagar que o resto do conteúdo).
 *
 * Sem bibliotecas — só JavaScript puro manipulando o DOM.
 */

const QUANTIDADE_ESTRELAS = 60;
const QUANTIDADE_PARTICULAS = 18;

function criarEstrelas(container) {
  for (let i = 0; i < QUANTIDADE_ESTRELAS; i++) {
    const estrela = document.createElement("div");
    estrela.className = "estrela";

    const tamanho = Math.random() * 2 + 1; // entre 1px e 3px
    estrela.style.width = `${tamanho}px`;
    estrela.style.height = `${tamanho}px`;
    estrela.style.top = `${Math.random() * 100}%`;
    estrela.style.left = `${Math.random() * 100}%`;
    estrela.style.animationDelay = `${Math.random() * 3}s`;
    estrela.style.animationDuration = `${2 + Math.random() * 3}s`;

    container.appendChild(estrela);
  }
}

function criarLua(container) {
  const lua = document.createElement("div");
  lua.className = "lua";
  lua.id = "lua-parallax";
  lua.style.top = "8%";
  lua.style.right = "12%";
  container.appendChild(lua);
}

function criarParticulasDouradas(container) {
  for (let i = 0; i < QUANTIDADE_PARTICULAS; i++) {
    const particula = document.createElement("div");
    particula.className = "particula-dourada";
    particula.style.left = `${Math.random() * 100}%`;
    particula.style.top = `${50 + Math.random() * 50}%`;
    particula.style.animationDuration = `${4 + Math.random() * 4}s`;
    particula.style.animationDelay = `${Math.random() * 5}s`;
    container.appendChild(particula);
  }
}

function criarNevoa(container) {
  const nevoa1 = document.createElement("div");
  nevoa1.className = "nevoa nevoa-drift";
  container.appendChild(nevoa1);

  const nevoa2 = document.createElement("div");
  nevoa2.className = "nevoa nevoa-drift-2";
  nevoa2.style.opacity = "0.6";
  container.appendChild(nevoa2);
}

// Parallax simples: quanto mais rola a página, mais a lua e as
// estrelas sobem devagar (ficam "para trás" em relação ao conteúdo).
function ativarParallax() {
  const lua = document.getElementById("lua-parallax");
  const estrelas = document.querySelectorAll(".estrela");
  if (!lua) return;

  let ticking = false;

  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      lua.style.transform = `translateY(${scrollY * 0.08}px)`;
      estrelas.forEach((estrela, i) => {
        // pequenas variações entre estrelas pra não moverem todas iguais
        const fator = 0.03 + (i % 5) * 0.005;
        estrela.style.transform = `translateY(${scrollY * fator}px)`;
      });
      ticking = false;
    });
  });
}

// Header compacto: encolhe o brasão e o padding do hero quando a página rola.
// Histerese (liga acima de 160px, desliga abaixo de 80px) evita o header
// ficar "piscando" entre os dois estados na fronteira do limiar.
function ativarHeroCompacto() {
  const hero = document.querySelector(".hero-principal");
  if (!hero) return;

  let ticking = false;

  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      const rolagem = window.scrollY;
      if (rolagem > 160) hero.classList.add("hero-compacto");
      else if (rolagem < 80) hero.classList.remove("hero-compacto");
      ticking = false;
    });
  });
}

function inicializarEfeitos() {
  const container = document.getElementById("fundo-magico");
  if (!container) return;

  criarEstrelas(container);
  criarLua(container);
  criarParticulasDouradas(container);
  criarNevoa(container);
  ativarParallax();
  ativarHeroCompacto();
}

document.addEventListener("DOMContentLoaded", inicializarEfeitos);
