/* NAVBAR */
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 50);
});

const menuHamburguer = document.getElementById("menuHamburguer");
const menuMobile = document.getElementById("menuMobile");
const linksMenuMobile = document.querySelectorAll(".menu-mobile a");

function fecharMenuMobile() {
  if (!menuHamburguer || !menuMobile) return;

  menuHamburguer.classList.remove("ativo");
  menuMobile.classList.remove("ativo");

  menuHamburguer.setAttribute("aria-expanded", "false");
  menuHamburguer.setAttribute("aria-label", "Abrir menu");
  menuMobile.setAttribute("aria-hidden", "true");
}

if (menuHamburguer && menuMobile) {
  menuHamburguer.addEventListener("click", () => {
    const menuAberto = menuMobile.classList.toggle("ativo");

    menuHamburguer.classList.toggle("ativo", menuAberto);
    menuHamburguer.setAttribute("aria-expanded", menuAberto);
    menuHamburguer.setAttribute(
      "aria-label",
      menuAberto ? "Fechar menu" : "Abrir menu",
    );
    menuMobile.setAttribute("aria-hidden", !menuAberto);
  });

  linksMenuMobile.forEach((link) => {
    link.addEventListener("click", fecharMenuMobile);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      fecharMenuMobile();
    }
  });
}

/* SOBRE */
const btnHistoria = document.getElementById("btnHistoria");
const historia = document.querySelector(".historia-completa");

if (btnHistoria && historia) {
  btnHistoria.addEventListener("click", () => {
    const historiaAberta = historia.classList.toggle("ativo");

    btnHistoria.textContent = historiaAberta
      ? "Ler menos"
      : "Ler história completa";

    btnHistoria.setAttribute("aria-expanded", historiaAberta);
    historia.setAttribute("aria-hidden", !historiaAberta);
  });
}

/* EVENTOS */
const slides = document.querySelectorAll(".slide");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");

let current = 0;

function showSlide(index) {
  if (slides.length === 0) return;

  slides.forEach((slide) => slide.classList.remove("active"));
  slides[index].classList.add("active");
}

if (slides.length <= 1 && nextBtn && prevBtn) {
  nextBtn.style.display = "none";
  prevBtn.style.display = "none";
}

if (slides.length > 1 && nextBtn && prevBtn) {
  nextBtn.addEventListener("click", () => {
    current++;

    if (current >= slides.length) {
      current = 0;
    }

    showSlide(current);
  });

  prevBtn.addEventListener("click", () => {
    current--;

    if (current < 0) {
      current = slides.length - 1;
    }

    showSlide(current);
  });
}
