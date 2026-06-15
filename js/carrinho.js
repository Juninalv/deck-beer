let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

let localizacaoCliente = "";

function toggleCarrinho() {
  document.getElementById("cartSidebar").classList.toggle("active");
}

function salvarCarrinho() {
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function adicionarLanche(botao, nome, preco) {
  const itemInfo = botao.closest(".item-info");
  const select = itemInfo.querySelector(".adicional-select");

  let nomeFinal = nome;
  let precoFinal = preco;

  if (select && select.value !== "") {
    nomeFinal += ` + ${select.value}`;
    precoFinal += 5;
  }

  adicionarAoCarrinho(nomeFinal, precoFinal);
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
          <button onclick="alterarQtd('${item.nome}', -1)">-</button>

          ${item.qtd}

          <button onclick="alterarQtd('${item.nome}', 1)">+</button>
        </div>
      </div>
    `;
  });

  contador.innerText = quantidade;
  totalElemento.innerText = `R$ ${total.toFixed(2).replace(".", ",")}`;

  salvarCarrinho();
}

function alterarTipoPedido() {
  const tipo = document.getElementById("tipoPedido").value;

  document.getElementById("campoMesa").style.display =
    tipo === "local" ? "block" : "none";

  document.getElementById("camposDelivery").style.display =
    tipo === "delivery" ? "block" : "none";
}

function alterarPagamento() {
  const pagamento = document.getElementById("formaPagamento").value;

  document.getElementById("campoTroco").style.display =
    pagamento === "Dinheiro" ? "block" : "none";
}

function capturarLocalizacao() {
  if (!navigator.geolocation) {
    alert("Seu navegador não suporta localização.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      localizacaoCliente = `https://maps.google.com/?q=${lat},${lng}`;

      alert("Localização capturada com sucesso!");
    },
    () => {
      alert("Não foi possível obter sua localização.");
    },
  );
}

function enviarPedido() {
  if (carrinho.length === 0) {
    alert("Adicione itens ao pedido.");
    return;
  }

  const cliente = document.getElementById("cliente").value.trim();
  const tipo = document.getElementById("tipoPedido").value;
  const observacao = document.getElementById("observacao").value.trim();

  const mesa = document.getElementById("mesa")?.value.trim() || "";

  const endereco = document.getElementById("endereco")?.value.trim() || "";

  const numero = document.getElementById("numero")?.value.trim() || "";

  const complemento =
    document.getElementById("complemento")?.value.trim() || "";

  const formaPagamento = document.getElementById("formaPagamento")?.value || "";

  const troco = document.getElementById("troco")?.value.trim() || "";

  if (tipo === "local") {
    if (!cliente || !mesa) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }
  }

  if (tipo === "retirada") {
    if (!cliente) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }
  }

  if (tipo === "delivery") {
    if (!cliente || !endereco || !numero || !formaPagamento) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    if (formaPagamento === "Dinheiro" && !troco) {
      alert("Informe o valor para troco.");
      return;
    }
  }

  let total = 0;

  let msg = "*PEDIDO DECK BEER*\n\n";

  msg += `Cliente: ${cliente}\n`;

  if (tipo === "local") {
    msg += "Tipo: Consumir no Local\n";
    msg += `Mesa: ${mesa}\n`;
  }

  if (tipo === "retirada") {
    msg += "Tipo: Retirada no Balcão\n";
  }

  if (tipo === "delivery") {
    msg += "Tipo: Entrega (Delivery)\n";
    msg += `Endereço: ${endereco}\n`;
    msg += `Número: ${numero}\n`;

    if (complemento) {
      msg += `Complemento: ${complemento}\n`;
    }

    msg += `Forma de Pagamento: ${formaPagamento}\n`;

    if (formaPagamento === "Dinheiro") {
      msg += `Troco para: ${troco}\n`;
    }

    if (localizacaoCliente) {
      msg += `Localização:\n${localizacaoCliente}\n`;
    }
  }

  msg += "\n";

  carrinho.forEach((item) => {
    const subtotal = item.preco * item.qtd;

    total += subtotal;

    msg += `${item.qtd}x ${item.nome}\n`;
    msg += `R$ ${subtotal.toFixed(2).replace(".", ",")}\n\n`;
  });

  msg += `Total: R$ ${total.toFixed(2).replace(".", ",")}\n`;

  msg += `\nObservações:\n${observacao}`;

  window.open(
    `https://wa.me/5512974038736?text=${encodeURIComponent(msg)}`,
    "_blank",
  );

  carrinho = [];
  localStorage.removeItem("carrinho");

  document.getElementById("cart-items").innerHTML = "";
  document.getElementById("cart-count").innerText = "0";
  document.getElementById("cart-total").innerText = "R$ 0,00";

  document.getElementById("cliente").value = "";
  document.getElementById("observacao").value = "";

  if (document.getElementById("mesa"))
    document.getElementById("mesa").value = "";

  if (document.getElementById("endereco"))
    document.getElementById("endereco").value = "";

  if (document.getElementById("numero"))
    document.getElementById("numero").value = "";

  if (document.getElementById("complemento"))
    document.getElementById("complemento").value = "";

  if (document.getElementById("troco"))
    document.getElementById("troco").value = "";

  localizacaoCliente = "";

  document.getElementById("cartSidebar").classList.remove("active");
}

atualizarCarrinho();
alterarTipoPedido();
