const items = [
    { id: 0, 
    nome: 'Club 6 - Intenso',
     preco: 129.90,
      img: 'imagemclub.jpg',
       quantidade: 0,
       estoque: 2, 
       categoria: 'masculino'
     },
    { id: 1, 
        nome: 'Club 6 - Spotlight', 
        preco: 129.90, 
        img: 'imagem2.jpg', 
        quantidade: 0, 
        estoque: 3, 
        categoria: 'masculino' 
    },
    { id: 2, 
        nome: 'Strong Intention', 
        preco: 129.90, 
        img: 'imagem3.jpg', 
        quantidade: 0, 
        estoque: 3, 
        categoria: 'masculino' 
    },
    { id: 3, 
        nome: 'Malbec Tradicional', 
        preco: 189.90, 
        img: 'imagem4.jpg', 
        quantidade: 0, 
        estoque: 6, 
        categoria: 'masculino' 
    },
    { id: 4, 
        nome: 'Connexion', 
        preco: 129.90, 
        img: 'imagem5.jpg', 
        quantidade: 0, 
        estoque: 1, 
        categoria: 'masculino' 
    },
    { id: 5, 
        nome: 'Uomini Black', 
        preco: 149.90, 
        img: 'imagem6.jpg', 
        quantidade: 0, 
        estoque: 3, 
        categoria: 'masculino' 
    },
    { id: 6, 
        nome: 'Inebriante Zayd - Elixir', 
        preco: 390.00, 
        img: 'imagem8.jpg', 
        quantidade: 0, 
        estoque: 1, 
        categoria: 'masculino' 
    },
    { id: 7, 
        nome: 'Inebriante - Parfum', 
        preco: 280.00, 
        img: 'imagem7.jpg', 
        quantidade: 0, 
        estoque: 1, 
        categoria: 'masculino' 
    },
    { id: 8, 
        nome: 'Malbec Magnetic', 
        preco: 199.90, 
        img: 'imagem9.webp', 
        quantidade: 0, 
        estoque: 3, 
        categoria: 'masculino' 
    },
    /* Feminino */
    {
        id: 9,
        nome: 'Ekos - Pitanga',
        preco: 119.90,
        img: 'Ekos P.jpg',
        quantidade: 0,
        estoque: 1,
        categoria: 'feminino'
    },
    {
        id: 10,
        nome: 'Violet Dahlia',
        preco: 119.90,
        img: 'violet.jpg',
        quantidade: 0,
        estoque: 1,
        categoria: 'feminino'
    },
    {
        id: 11,
        nome: 'Liz - Tradicional',
        preco: 129.90,
        img: 'liz2.jpg',
        quantidade: 0,
        estoque: 1,
        categoria: 'feminino'
    }
    
];

let filtroPreco = 'todos'; 
// 'todos' | 'menor' | 'maior'
function setFiltroPreco(tipo) {
    filtroPreco = tipo;
    renderProdutos();
}




/* =====================
   LOCAL STORAGE
===================== */
function salvarCarrinho() {
    localStorage.setItem('carrinho', JSON.stringify(items));
}

function carregarCarrinho() {
    const dados = JSON.parse(localStorage.getItem('carrinho'));
    if (dados) dados.forEach((d, i) => items[i].quantidade = d.quantidade);
}

/* =====================
   BADGE
===================== */
function atualizarBadge() {
    const badge = document.getElementById('cart-count');
    if (!badge) return;

    const total = items.reduce((s, i) => s + i.quantidade, 0);
    badge.innerText = total;

    badge.style.transform = 'scale(1.3)';
    setTimeout(() => badge.style.transform = 'scale(1)', 200);
}

/* =====================
   DETECTAR PÁGINA
===================== */
function categoriaAtual() {
    if (location.pathname.includes('feminino')) return 'feminino';
    if (location.pathname.includes('masculino')) return 'masculino';
    return null;
}

/* =====================
   RENDER PRODUTOS
===================== */
function renderProdutos() {
    const container = document.getElementById('produtos');
    if (!container) return;

    container.innerHTML = '';
    const categoria = categoriaAtual();

    let produtosFiltrados = items.filter(item =>
        !categoria || item.categoria === categoria
    );

    // 🔽 FILTRO DA IMAGEM
    if (filtroPreco === 'menor') {
        produtosFiltrados.sort((a, b) => a.preco - b.preco);
    }

    if (filtroPreco === 'maior') {
        produtosFiltrados.sort((a, b) => b.preco - a.preco);
    }

    produtosFiltrados.forEach((item, index) => {
        const produto = document.createElement('div');
        produto.className = 'produto-single';

        produto.innerHTML = `
            <img src="${item.img}">
            <p>${item.nome}</p>
            <p><strong>R$ ${item.preco.toFixed(2)}</strong></p>
            <p>Estoque: ${item.estoque - item.quantidade}</p>
            <button onclick="adicionarAoCarrinho(${item.id}, this)">
                Adicionar
            </button>
        `;

        container.appendChild(produto);
        setTimeout(() => produto.classList.add('show'), index * 120);
    });
}


/* =====================
   CARRINHO
===================== */
function adicionarAoCarrinho(id, botao) {
    if (items[id].quantidade < items[id].estoque) {
        const card = botao.closest('.produto-single');
        const img = card.querySelector('img');

        animarParaCarrinho(img);

        items[id].quantidade++;
        salvarCarrinho();
        renderCarrinho();
        renderProdutos();
        atualizarBadge();
    }
}


function removerDoCarrinho(id) {
    const itemEl = document.getElementById(`item-${id}`);
    if (!itemEl) return;

    itemEl.classList.add('removendo');

    setTimeout(() => {
        items[id].quantidade--;
        salvarCarrinho();
        renderCarrinho();
        renderProdutos();
        atualizarBadge();
    }, 350);
}

function renderCarrinho() {
    const container = document.getElementById('carrinho');
    if (!container) return;

    container.innerHTML = '<h2>Carrinho</h2>';
    let total = 0;

    items.forEach(item => {
        if (item.quantidade > 0) {
            total += item.preco * item.quantidade;

            container.innerHTML += `
                <div class="item-carrinho" id="item-${item.id}">
                    <p>${item.nome}<br>${item.quantidade} x R$ ${item.preco.toFixed(2)}</p>
                    <button onclick="removerDoCarrinho(${item.id})">Remover</button>
                    <hr>
                </div>
            `;
        }
    });

    if (total > 0) {
        container.innerHTML += `
            <p><strong>Total: R$ ${total.toFixed(2)}</strong></p>
            <button onclick="finalizarCompra()">Finalizar compra</button>
        `;
    }
}

/* =====================
   CHECKOUT
===================== */
function finalizarCompra() {
    document.getElementById('checkout-modal')?.classList.remove('hidden');
    const lista = document.getElementById('checkout-itens');
    if (!lista) return;

    lista.innerHTML = '';
    let total = 0;

    items.forEach(item => {
        if (item.quantidade > 0) {
            total += item.preco * item.quantidade;
            lista.innerHTML += `<p>${item.nome} — ${item.quantidade}x</p>`;
        }
    });

    lista.innerHTML += `<strong>Total: R$ ${total.toFixed(2)}</strong>`;
}

function fecharModal() {
    document.getElementById('checkout-modal')?.classList.add('hidden');
}

function confirmarCompra() {

    // Fecha modal de resumo
    fecharModal();

    // Mostra loading
    document.getElementById('loading-modal').classList.remove('hidden');

    setTimeout(() => {

        // Esconde loading
        document.getElementById('loading-modal').classList.add('hidden');

        // Mostra sucesso
        document.getElementById('sucesso-modal').classList.remove('hidden');

        // Limpa carrinho
        items.forEach(item => item.quantidade = 0);
        salvarCarrinho();
        renderCarrinho();
        renderProdutos();
        atualizarBadge();

    }, 1500); // tempo do loading
}

function fecharSucesso() {
    document.getElementById('sucesso-modal').classList.add('hidden');
}



/* =====================
   INIT
===================== */
carregarCarrinho();
renderProdutos();
renderCarrinho();
atualizarBadge();

const footers = document.querySelectorAll('footer');

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('footer-animado');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

footers.forEach(footer => observer.observe(footer));

function animarParaCarrinho(imagemElemento) {
    const cart = document.querySelector('.cart-badge');
    const imgRect = imagemElemento.getBoundingClientRect();
    const cartRect = cart.getBoundingClientRect();

    const imgClone = imagemElemento.cloneNode(true);
    imgClone.classList.add('flying-img');

    imgClone.style.left = imgRect.left + 'px';
    imgClone.style.top = imgRect.top + 'px';

    document.body.appendChild(imgClone);

    requestAnimationFrame(() => {
        imgClone.style.left = cartRect.left + 'px';
        imgClone.style.top = cartRect.top + 'px';
        imgClone.style.width = '20px';
        imgClone.style.opacity = '0.3';
    });

    setTimeout(() => {
        imgClone.remove();
    }, 700);
}

