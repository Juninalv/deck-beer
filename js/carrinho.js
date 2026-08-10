let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

let localizacaoCliente = "";

function permitirSomenteNumeros(id) {
  const campo = document.getElementById(id);

  if (!campo) return;

  campo.addEventListener("input", () => {
    campo.value = campo.value.replace(/\D/g, "");
  });
}

function permitirValorMonetario(id) {
  const campo = document.getElementById(id);

  if (!campo) return;

  campo.addEventListener("input", () => {
    campo.value = campo.value
      .replace(/[^0-9,.]/g, "")
      .replace(/([,.].*)[,.]/g, "$1");
  });
}

function toggleCarrinho() {
  document.getElementById("cartSidebar").classList.toggle("active");
}

function salvarCarrinho() {
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function adicionarLanche(botao, nome, preco) {
  const itemInfo = botao.closest(".item-info");

  const adicionaisMarcados = itemInfo.querySelectorAll(
    ".adicionais input[type='checkbox']:checked",
  );

  let nomeFinal = nome;
  let precoFinal = preco;

  const adicionais = [];

  adicionaisMarcados.forEach((item) => {
    adicionais.push(item.value);
    precoFinal += Number(item.dataset.preco);
  });

  if (adicionais.length > 0) {
    nomeFinal += " + " + adicionais.join(", ");
  }

  adicionarAoCarrinho(nomeFinal, precoFinal);
}

function limitarOpcaoGratuita(opcaoSelecionada) {
  const itemInfo = opcaoSelecionada.closest(".item-info");

  const opcoes = itemInfo.querySelectorAll(".opcao-gratis-pizza");

  if (!opcaoSelecionada.checked) return;

  opcoes.forEach((opcao) => {
    if (opcao !== opcaoSelecionada) {
      opcao.checked = false;
    }
  });
}

function adicionarPizza(botao) {
  const itemInfo = botao.closest(".item-info");

  const sabores = itemInfo.querySelectorAll(".sabor-pizza:checked");

  const extra = itemInfo.querySelector(".extra-pizza:checked");

  const opcaoGratuita = itemInfo.querySelector(".opcao-gratis-pizza:checked");

  const limite = extra ? 4 : 3;

  if (sabores.length === 0) {
    alert("Escolha pelo menos 1 sabor.");
    return;
  }

  if (sabores.length > limite) {
    alert(`Você pode escolher no máximo ${limite} sabores.`);
    return;
  }

  let preco = 25;
  let nome = "Pizza Rap 10";

  const listaSabores = [];

  sabores.forEach((sabor) => {
    listaSabores.push(sabor.value);
  });

  nome += " - " + listaSabores.join(" / ");

  if (extra) {
    preco += 5;
    nome += " + 1 sabor extra";
  }

  if (opcaoGratuita) {
    nome += ` + ${opcaoGratuita.value}`;
  }

  adicionarAoCarrinho(nome, preco);
}

function adicionarSobremesa(botao) {
  const itemInfo = botao.closest(".item-info");

  const saborSelecionado = itemInfo.querySelector(".sabor-sobremesa:checked");

  if (!saborSelecionado) {
    alert("Escolha um sabor.");
    return;
  }

  const nome = itemInfo.querySelector("h3").innerText;

  const precoTexto = itemInfo.querySelector("span").innerText;

  const preco = Number(
    precoTexto.replace("R$", "").replace(".", "").replace(",", ".").trim(),
  );

  const sabor = saborSelecionado.value;

  const nomeFinal = `${nome} - ${sabor}`;

  adicionarAoCarrinho(nomeFinal, preco);
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

function limparCarrinho() {
  if (carrinho.length === 0) {
    alert("O carrinho já está vazio.");
    return;
  }

  const confirmarLimpeza = confirm(
    "Tem certeza que deseja remover todos os itens do carrinho?",
  );

  if (!confirmarLimpeza) return;

  carrinho = [];
  localStorage.removeItem("carrinho");

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

const semTroco = document.getElementById("semTroco");
const campoTrocoInput = document.getElementById("troco");

if (semTroco && campoTrocoInput) {
  semTroco.addEventListener("change", () => {
    if (semTroco.checked) {
      campoTrocoInput.value = "";
      campoTrocoInput.disabled = true;
    } else {
      campoTrocoInput.disabled = false;
    }
  });
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

  const semTroco = document.getElementById("semTroco")?.checked || false;

  /* CALCULA TOTAL DO PEDIDO */

  let total = 0;

  carrinho.forEach((item) => {
    total += item.preco * item.qtd;
  });

  /* VALIDAÇÕES */

  if (tipo === "local") {
    if (!cliente || !mesa) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    if (!/^\d+$/.test(mesa)) {
      alert("Informe apenas números no campo Mesa.");
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

    if (!/^\d+$/.test(numero)) {
      alert("Informe apenas números no campo Número.");
      return;
    }
    if (formaPagamento === "Dinheiro") {
      if (!semTroco && !troco) {
        alert("Informe o valor para troco ou marque 'Não preciso de troco'.");
        return;
      }

      if (!semTroco) {
        const valorTroco = Number(
          troco
            .replace("R$", "")
            .replace(/\s/g, "")
            .replace(/\./g, "")
            .replace(",", "."),
        );

        if (isNaN(valorTroco)) {
          alert("Informe um valor válido para o troco.");
          return;
        }

        if (valorTroco < total) {
          alert(
            `O valor para troco não pode ser menor que o total do pedido (R$ ${total
              .toFixed(2)
              .replace(".", ",")}).`,
          );
          return;
        }
      }
    }
  }

  /* MONTA MENSAGEM */

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
      if (semTroco) {
        msg += "Troco: Não precisa de troco\n";
      } else {
        msg += `Troco para: R$ ${troco}\n`;
      }
    }

    if (localizacaoCliente) {
      msg += `Localização:\n${localizacaoCliente}\n`;
    }
  }

  msg += "\n";

  carrinho.forEach((item) => {
    const subtotal = item.preco * item.qtd;

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

  if (document.getElementById("troco")) {
    document.getElementById("troco").value = "";
    document.getElementById("troco").disabled = false;
  }

  if (document.getElementById("semTroco")) {
    document.getElementById("semTroco").checked = false;
  }

  localizacaoCliente = "";

  document.getElementById("cartSidebar").classList.remove("active");
}

function adicionarCaipirinha(botao) {
  const itemInfo = botao.closest(".item-info");

  const saborSelecionado = itemInfo.querySelector(".sabor-caipirinha:checked");

  const bebidaSelecionada = itemInfo.querySelector(
    ".bebida-caipirinha:checked",
  );

  if (!saborSelecionado) {
    alert("Escolha o sabor da caipirinha.");
    return;
  }

  if (!bebidaSelecionada) {
    alert("Escolha entre cachaça ou vodka.");
    return;
  }

  const nome = `Caipirinha ${saborSelecionado.value} com ${bebidaSelecionada.value}`;
  const preco = 29.9;

  adicionarAoCarrinho(nome, preco);
}

function adicionarSucoMisto(botao) {
  const item = botao.closest(".porcao-item");

  const sabores = [...item.querySelectorAll(".sabor-suco-misto:checked")].map(
    (input) => input.value,
  );

  if (sabores.length !== 2) {
    alert("Escolha exatamente 2 sabores para o suco misto.");
    return;
  }

  adicionarAoCarrinho(`Suco Misto (${sabores.join(" + ")})`, 15);
}

atualizarCarrinho();
alterarTipoPedido();

permitirSomenteNumeros("mesa");
permitirSomenteNumeros("numero");
permitirValorMonetario("troco");
