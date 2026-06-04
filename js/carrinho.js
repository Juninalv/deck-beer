let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

function toggleCarrinho() {
  document.getElementById("cartSidebar").classList.toggle("active");
}

function salvarCarrinho() {
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function adicionarAoCarrinho(nome, preco) {
  const item = carrinho.find((p) => p.nome === nome);

  if (item) {
    item.qtd++;
  } else {
    carrinho.push({
      nome,
      preco,
      qtd: 1,
    });
  }

  atualizarCarrinho();
}

function alterarQtd(nome, valor) {
  const item = carrinho.find((p) => p.nome === nome);

  if (!item) return;

  item.qtd += valor;

  if (item.qtd <= 0) {
    carrinho = carrinho.filter((p) => p.nome !== nome);
  }

  atualizarCarrinho();
}

function atualizarCarrinho() {
  const lista = document.getElementById("cart-items");

  const contador = document.getElementById("cart-count");

  const totalElemento = document.getElementById("cart-total");

  lista.innerHTML = "";

  let total = 0;
  let quantidade = 0;

  carrinho.forEach((item) => {
    total += item.preco * item.qtd;
    quantidade += item.qtd;

    lista.innerHTML += `
      <div class="cart-item">

        <div>
          <strong>${item.nome}</strong>
          <br>
          R$ ${(item.preco * item.qtd).toFixed(2).replace(".", ",")}
        </div>

        <div class="cart-controls">

          <button onclick="alterarQtd('${item.nome}', -1)">
            -
          </button>

          ${item.qtd}

          <button onclick="alterarQtd('${item.nome}', 1)">
            +
          </button>

        </div>

      </div>
    `;
  });

  contador.innerText = quantidade;

  totalElemento.innerText = `R$ ${total.toFixed(2).replace(".", ",")}`;

  salvarCarrinho();
}

function enviarPedido() {
  if (carrinho.length === 0) {
    alert("Adicione itens ao pedido.");
    return;
  }

  const cliente = document.getElementById("cliente").value.trim();

  const tipo = document.getElementById("tipoPedido").value;

  const mesa = document.getElementById("mesa").value.trim();

  const observacao = document.getElementById("observacao").value.trim();

  let total = 0;

  let msg = " *PEDIDO DECK BEER*\n\n";

  msg += ` Cliente: ${cliente || "Não informado"}\n`;
  msg += ` Tipo: ${tipo}\n`;

  if (mesa) {
    msg += ` Mesa: ${mesa}\n`;
  }

  msg += "\n";

  carrinho.forEach((item) => {
    const subtotal = item.preco * item.qtd;

    total += subtotal;

    msg += `${item.qtd}x ${item.nome}\n`;
    msg += `R$ ${subtotal.toFixed(2).replace(".", ",")}\n\n`;
  });

  msg += ` Total: R$ ${total.toFixed(2).replace(".", ",")}\n`;

  if (observacao) {
    msg += `\n Observação:\n${observacao}`;
  }

  window.open(
    `https://wa.me/5512974038736?text=${encodeURIComponent(msg)}`,
    "_blank",
  );

  carrinho = [];
  localStorage.removeItem("carrinho");

  setTimeout(() => {
    location.reload();
  }, 300);
}

atualizarCarrinho();
