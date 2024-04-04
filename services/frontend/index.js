function newBook(book) {
    const div = document.createElement('div');
    div.className = 'column is-4';
    div.innerHTML = `
        <div class="card is-shady">
            <div class="card-image">
                <figure class="image is-4by3">
                    <img
                        src="${book.photo}"
                        alt="${book.name}"
                        class="modal-button"
                    />
                </figure>
            </div>
            <div class="card-content">
                <div class="content book" data-id="${book.id}">
                    <div class="book-meta">
                        <p class="is-size-4">R$${book.price.toFixed(2)}</p>
                        <p class="is-size-6">Disponível em estoque: 5</p>
                        <h4 class="is-size-3 title">${book.name}</h4>
                        <p class="subtitle">${book.author}</p>
                    </div>
                    <div class="field has-addons">
                        <div class="control">
                            <input class="input" type="text" placeholder="Digite o CEP" />
                        </div>
                        <div class="control">
                            <a class="button button-shipping is-info" data-id="${book.id}"> Calcular Frete </a>
                        </div>
                    </div>
                    <button class="button button-buy is-success is-fullwidth">Comprar</button>
                </div>
            </div>
        </div>`;
    return div;
}

    function displayBookDetails(book) {
        // Implemente a lógica para exibir os detalhes do livro na página
        // Por exemplo, você pode atualizar o conteúdo de uma div com os detalhes do livro
        var bookDetailsDiv = document.getElementById('bookDetails');
        bookDetailsDiv.style.display = 'block'; // Exibir a seção de detalhes do livro
        bookDetailsDiv.innerHTML = `
                    <div class="column is-centered">
                        <div class="card">
                            <div class="card-content">
                                <div class="content">
                                    <p class="title">${book.name}</p>
                                    <p>ID: ${book.id}</p>
                                    <p>Quantidade: ${book.quantity}</p>
                                    <p>Preço: ${book.price}</p>
                                    <p>Autor: ${book.author}</p>
                                </div>
                            </div>
                            <div class="card-image" style="display: flex; justify-content: center;">
                                <img
                                    src="${book.photo}"
                                    alt="${book.name}"
                                    class="modal-button"
                                    style="max-width: 300px; max-height: 300px;"
                                />
                            </div>
                        </div>
                    </div>
        `;
    }

    document.addEventListener('DOMContentLoaded', function () {
        const searchButton = document.getElementById('searchButton');
        searchButton.addEventListener('click', function () {
            const bookId = document.getElementById('bookIdInput').value;
            fetch('http://localhost:3000/product/' + bookId)
                .then(response => response.json())
                .then(book => {
                    displayBookDetails(book);
                })
                .catch(error => {
                    console.error('Erro ao pesquisar por ID:', error);
                    swal('Erro', 'Erro ao pesquisar por ID do livro', 'error');
                });
        });
    });

function calculateShipping(id, cep) {
    fetch('http://localhost:3000/shipping/' + cep)
        .then((data) => {
            if (data.ok) {
                return data.json();
            }
            throw data.statusText;
        })
        .then((data) => {
            swal('Frete', `O frete é: R$${data.value.toFixed(2)}`, 'success');
        })
        .catch((err) => {
            swal('Erro', 'Erro ao consultar frete', 'error');
            console.error(err);
        });
}

document.addEventListener('DOMContentLoaded', function () {
    const books = document.querySelector('.books');

    fetch('http://localhost:3000/products')
        .then((data) => {
            if (data.ok) {
                return data.json();
            }
            throw data.statusText;
        })
        .then((data) => {
            if (data) {
                data.forEach((book) => {
                    books.appendChild(newBook(book));
                });

                document.querySelectorAll('.button-shipping').forEach((btn) => {
                    btn.addEventListener('click', (e) => {
                        const id = e.target.getAttribute('data-id');
                        const cep = document.querySelector(`.book[data-id="${id}"] input`).value;
                        calculateShipping(id, cep);
                    });
                });

                document.querySelectorAll('.button-buy').forEach((btn) => {
                    btn.addEventListener('click', (e) => {
                        swal('Compra de livro', 'Sua compra foi realizada com sucesso', 'success');
                    });
                });
            }
        })
        .catch((err) => {
            swal('Erro', 'Erro ao listar os produtos', 'error');
            console.error(err);
        });
});
