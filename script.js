// ============================
// FUNÇÕES BÁSICAS DE COOKIES
// ============================

/**
 * Cria um novo cookie
 * @param {string} nome - Nome do cookie
 * @param {string} valor - Valor do cookie
 * @param {number} dias - Número de dias até expiração (0 = sessão)
 */
function criarCookie(nome, valor, dias) {
    // Se os parâmetros não foram fornecidos, pega do formulário
    if (arguments.length === 0) {
        nome = document.getElementById('cookieName').value;
        valor = document.getElementById('cookieValue').value;
        dias = parseInt(document.getElementById('cookieDays').value);
    }

    if (!nome.trim() || !valor.trim()) {
        alert('Por favor, preencha nome e valor do cookie!');
        return;
    }

    let dataExpiracao = '';
    
    if (dias > 0) {
        const data = new Date();
        data.setTime(data.getTime() + (dias * 24 * 60 * 60 * 1000));
        dataExpiracao = '; expires=' + data.toUTCString();
    }

    document.cookie = `${nome}=${encodeURIComponent(valor)}${dataExpiracao}; path=/`;
    
    console.log(`✓ Cookie criado: ${nome} = ${valor}`);
    alert(`Cookie '${nome}' criado com sucesso!`);
    
    // Atualiza a lista de cookies
    listarCookies();
    
    // Limpa o formulário
    document.getElementById('cookieName').value = '';
    document.getElementById('cookieValue').value = '';
}

/**
 * Lê um cookie específico pelo nome
 * @param {string} nome - Nome do cookie
 * @returns {string|null} - Valor do cookie ou null se não encontrado
 */
function lerCookie(nome) {
    const nomeCodificado = `${nome}=`;
    const cookies = document.cookie.split(';');
    
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.indexOf(nomeCodificado) === 0) {
            const valor = cookie.substring(nomeCodificado.length);
            return decodeURIComponent(valor);
        }
    }
    
    return null;
}

/**
 * Retorna todos os cookies em um objeto
 * @returns {object} - Objeto com todos os cookies
 */
function obterTodosCookies() {
    const cookies = {};
    const listaCookies = document.cookie.split(';');
    
    listaCookies.forEach(cookie => {
        cookie = cookie.trim();
        const [nome, valor] = cookie.split('=');
        if (nome && valor) {
            cookies[nome] = decodeURIComponent(valor);
        }
    });
    
    return cookies;
}

/**
 * Deleta um cookie pelo nome
 * @param {string} nome - Nome do cookie
 */
function deletarCookie(nome) {
    // Se o parâmetro não foi fornecido, pega do formulário
    if (arguments.length === 0) {
        nome = document.getElementById('deleteCookieName').value;
    }

    if (!nome.trim()) {
        alert('Por favor, digite o nome do cookie!');
        return;
    }

    // Define a expiração para o passado para deletar
    document.cookie = `${nome}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    
    console.log(`✓ Cookie deletado: ${nome}`);
    alert(`Cookie '${nome}' deletado!`);
    
    // Atualiza a lista
    listarCookies();
}

/**
 * Limpa todos os cookies
 */
function limparTodosCookies() {
    const cookies = obterTodosCookies();
    
    Object.keys(cookies).forEach(nome => {
        document.cookie = `${nome}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
    
    console.log('✓ Todos os cookies foram deletados');
    alert('Todos os cookies foram removidos!');
    
    // Atualiza a lista
    listarCookies();
}

// ============================
// FUNÇÕES DE INTERFACE
// ============================

/**
 * Lista todos os cookies na interface
 */
function listarCookies() {
    const cookies = obterTodosCookies();
    const cookieList = document.getElementById('cookieList');
    
    if (Object.keys(cookies).length === 0) {
        cookieList.innerHTML = '<p class="empty-message">Nenhum cookie encontrado. Crie um novo!</p>';
        return;
    }

    let html = '';
    Object.entries(cookies).forEach(([nome, valor]) => {
        html += `
            <div class="cookie-item">
                <div class="cookie-info">
                    <div class="cookie-name">🍪 ${nome}</div>
                    <div class="cookie-value">${valor}</div>
                </div>
                <button class="btn btn-danger" onclick="deletarCookieUI('${nome}')" style="margin: 0;">
                    Deletar
                </button>
            </div>
        `;
    });
    
    cookieList.innerHTML = html;
}

/**
 * Lê um cookie específico e mostra na interface
 */
function lerCookieEspecifico() {
    const nome = document.getElementById('readCookieName').value;
    const resultBox = document.getElementById('readResult');
    
    if (!nome.trim()) {
        resultBox.innerHTML = '<strong style="color: #f56565;">⚠️ Digite o nome do cookie!</strong>';
        resultBox.classList.add('show', 'error');
        return;
    }

    const valor = lerCookie(nome);
    
    if (valor) {
        resultBox.innerHTML = `
            <strong style="color: #48bb78;">✓ Cookie encontrado!</strong><br>
            <strong>Nome:</strong> ${nome}<br>
            <strong>Valor:</strong> ${valor}
        `;
        resultBox.classList.remove('error');
        resultBox.classList.add('show', 'success');
    } else {
        resultBox.innerHTML = `<strong style="color: #f56565;">✗ Cookie '${nome}' não encontrado!</strong>`;
        resultBox.classList.remove('success');
        resultBox.classList.add('show', 'error');
    }
}

/**
 * Deleta um cookie a partir da interface (com confirmação)
 */
function deletarCookieUI(nome) {
    if (confirm(`Tem certeza que deseja deletar o cookie '${nome}'?`)) {
        deletarCookie(nome);
    }
}

// ============================
// EXEMPLO PRÁTICO: TEMA DO SITE
// ============================

/**
 * Troca o tema do site e salva a preferência em um cookie
 * @param {string} tema - 'claro', 'escuro' ou 'padrao'
 */
function trocarTema(tema) {
    const body = document.body;
    
    // Remove todas as classes de tema
    body.classList.remove('tema-claro', 'tema-escuro');
    
    // Aplica o novo tema
    if (tema === 'claro') {
        body.classList.add('tema-claro');
    } else if (tema === 'escuro') {
        body.classList.add('tema-escuro');
    }
    
    // Salva a preferência em um cookie (expires em 30 dias)
    criarCookie('temaSite', tema, 30);
    
    // Atualiza a mensagem de informação
    atualizarInfoTema(tema);
}

/**
 * Atualiza a mensagem de informação do tema
 */
function atualizarInfoTema(tema) {
    const temaInfo = document.getElementById('temaInfo');
    const temaFormatado = tema.charAt(0).toUpperCase() + tema.slice(1);
    
    temaInfo.innerHTML = `
        <strong>Tema Atual:</strong> ${temaFormatado}<br>
        <em>✓ Sua preferência foi salva em um cookie chamado 'temaSite'</em>
    `;
}

/**
 * Carrega o tema salvo do cookie ao abrir a página
 */
function carregarTemaSalvo() {
    const temaSalvo = lerCookie('temaSite');
    
    if (temaSalvo) {
        console.log(`Tema carregado do cookie: ${temaSalvo}`);
        trocarTema(temaSalvo);
    } else {
        atualizarInfoTema('padrao');
    }
}

// ============================
// EXEMPLOS ADICIONAIS
// ============================

/**
 * Exemplo: Salvar dados de login
 */
function exemploSalvarLogin(email, senha) {
    // ⚠️ AVISO: Nunca salve senhas em cookies!
    // Este é apenas um exemplo educacional.
    
    criarCookie('emailUsuario', email, 7);
    console.log('✓ Email salvo em cookie');
}

/**
 * Exemplo: Contar visitas
 */
function exemploContarVisitas() {
    const visitas = parseInt(lerCookie('numeroVisitas') || 0);
    const novasVisitas = visitas + 1;
    
    criarCookie('numeroVisitas', novasVisitas, 365);
    console.log(`Você visitou esta página ${novasVisitas} vez(es)`);
    
    return novasVisitas;
}

/**
 * Exemplo: Salvar itens do carrinho
 */
function exemploSalvarCarrinho(itens) {
    // Converte o array para JSON
    const carrinho = JSON.stringify(itens);
    
    criarCookie('carrinho', carrinho, 1);
    console.log('✓ Carrinho salvo em cookie');
}

/**
 * Exemplo: Recuperar carrinho
 */
function exemploRecuperarCarrinho() {
    const carrinhoCookie = lerCookie('carrinho');
    
    if (carrinhoCookie) {
        const carrinho = JSON.parse(carrinhoCookie);
        console.log('Carrinho recuperado:', carrinho);
        return carrinho;
    }
    
    return [];
}

// ============================
// INICIALIZAÇÃO
// ============================

// Carrega o tema salvo quando a página inicia
document.addEventListener('DOMContentLoaded', function() {
    carregarTemaSalvo();
    listarCookies();
    
    console.log('%c🍪 Demonstração de Cookies Carregada!', 'color: #667eea; font-size: 14px; font-weight: bold;');
    console.log('Cookies salvos:', obterTodosCookies());
});

// ============================
// INSTRUÇÕES DE USO
// ============================

/*
EXEMPLOS DE USO NO CONSOLE:

1. Criar um cookie:
   criarCookie('meuCookie', 'valor123', 7)

2. Ler um cookie:
   lerCookie('meuCookie')

3. Obter todos os cookies:
   obterTodosCookies()

4. Deletar um cookie:
   deletarCookie('meuCookie')

5. Exemplo: Salvar preferências
   criarCookie('idioma', 'pt-br', 365)
   criarCookie('tema', 'escuro', 365)

6. Exemplo: Contar visitas
   exemploContarVisitas()

7. Exemplo: Carrinho de compras
   exemploSalvarCarrinho(['item1', 'item2', 'item3'])
   exemploRecuperarCarrinho()

*/
