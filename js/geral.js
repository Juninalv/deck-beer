/* NAVBAR */
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 50);
});

/* SOBRE */

const btnHistoria = document.getElementById("btnHistoria");
const historia = document.querySelector(".historia-completa");

btnHistoria.addEventListener("click", () => {
  historia.classList.toggle("ativo");

  if (historia.classList.contains("ativo")) {
    btnHistoria.textContent = "Ler menos";
  } else {
    btnHistoria.textContent = "Ler história completa";
  }
});
