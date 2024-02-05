document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
});

function loadProducts() {
  fetch("/products")
    .then((response) => response.json())
    .then((data) => {
      const productTable = document.getElementById("productTable");
      productTable.innerHTML =
        "<tr><th>ID</th><th>Nome</th><th>Código</th><th>Descrição</th><th>Preço</th><th>Ações</th></tr>";

      data.products.forEach((product) => {
        const row = productTable.insertRow(-1);
        row.innerHTML = `<td>${product.id}</td>
                                 <td>${product.nome}</td>
                                 <td>${product.codigo}</td>
                                 <td>${product.descricao}</td>
                                 <td>${product.preco}</td>
                                 <td>
                                     <button onclick="editProduct(${product.id})">Editar</button>
                                     <button onclick="deleteProduct(${product.id})">Deletar</button>
                                 </td>`;
      });
    });
}

function addProduct() {
  const nome = document.getElementById("nome").value;
  const codigo = document.getElementById("codigo").value;
  const descricao = document.getElementById("descricao").value;
  const preco = document.getElementById("preco").value;

  fetch("/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nome, codigo, descricao, preco }),
  })
    .then((response) => response.json())
    .then(() => {
      loadProducts();
      document.getElementById("addForm").reset();
    });
}

function editProduct(id) {
  fetch(`/products/${id}`)
    .then((response) => response.json())
    .then((data) => {
      const { nome, codigo, descricao, preco } = data;
      document.getElementById("nome").value = nome;
      document.getElementById("codigo").value = codigo;
      document.getElementById("descricao").value = descricao;
      document.getElementById("preco").value = preco;

      const updateButton = document.createElement("button");
      updateButton.textContent = "Atualizar";
      updateButton.onclick = () => updateProduct(id);

      document.getElementById("addForm").appendChild(updateButton);
    });
}

function updateProduct(id) {
  const nome = document.getElementById("nome").value;
  const codigo = document.getElementById("codigo").value;
  const descricao = document.getElementById("descricao").value;
  const preco = document.getElementById("preco").value;

  fetch(`/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nome, codigo, descricao, preco }),
  })
    .then((response) => response.json())
    .then(() => {
      loadProducts();
      document.getElementById("addForm").reset();
    });
}

function deleteProduct(id) {
  fetch(`/products/${id}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then(() => {
      loadProducts();
    });
}
