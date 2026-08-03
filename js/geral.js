/* NAVBAR */
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 50);
});

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
  slides.forEach((slide) => slide.classList.remove("active"));
  slides[index].classList.add("active");
}

if (slides.length <= 1 && nextBtn && prevBtn) {
  nextBtn.style.display = "none";
  prevBtn.style.display = "none";
}

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
