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
    /*
     Se a função for chamada sem argumentos, assumimos que o usuário
     acionou a ação via interface (formulário). Neste caso lemos os
     valores diretamente dos campos do formulário para manter a
     função reutilizável tanto em chamadas programáticas quanto na UI.
    */
    if (arguments.length === 0) {
        nome = document.getElementById('cookieName').value;
        valor = document.getElementById('cookieValue').value;
        dias = parseInt(document.getElementById('cookieDays').value);
    }

    /*
     Validação simples: impede criação de cookies com nome ou valor
     vazios. Usamos `trim()` para ignorar espaços em branco acidentais.
     Se a validação falhar, informamos o usuário e interrompemos a execução.
    */
    if (!nome.trim() || !valor.trim()) {
        alert('Por favor, preencha nome e valor do cookie!');
        return;
    }

    /*
     Construímos a parte 'expires' do cookie apenas quando o usuário
     informou um número de dias maior que zero. Para isso calculamos
     o timestamp futuro em milissegundos e convertemos para UTC string
     no formato aceito pelos navegadores.
    */
    let dataExpiracao = '';
    if (dias > 0) {
        const data = new Date();
        data.setTime(data.getTime() + (dias * 24 * 60 * 60 * 1000));
        dataExpiracao = '; expires=' + data.toUTCString();
    }

    /*
     Gravamos o cookie no `document.cookie`. Usamos `encodeURIComponent`
     para escapar caracteres especiais no valor. Adicionamos `path=/`
     para que o cookie esteja disponível em todo o site.
     Após criar o cookie atualizamos a interface e limpamos os campos
     do formulário para melhorar a experiência do usuário.
    */
    document.cookie = `${nome}=${encodeURIComponent(valor)}${dataExpiracao}; path=/`;
    //no codigo acima, foi criado um cookie com o nome e valor fornecidos.
    console.log(`✓ Cookie criado: ${nome} = ${valor}`);
    alert(`Cookie '${nome}' criado com sucesso!`);
    listarCookies();
    document.getElementById('cookieName').value = '';
    document.getElementById('cookieValue').value = '';
}

/**
 * Lê um cookie específico pelo nome
 * @param {string} nome - Nome do cookie
 * @returns {string|null} - Valor do cookie ou null se não encontrado
 */
function lerCookie(nome) {
    /*
     Procuramos o cookie pelo prefixo "nome=", porque `document.cookie`
     retorna uma única string com pares separados por `;`. Dividimos a
     string, removemos espaços e verificamos se algum par começa com o
     prefixo desejado; se encontrado extraímos e decodificamos o valor.
     Retornamos `null` quando não há correspondência.
    */
    const nomeCodificado = `${nome}=`;
    const cookies = document.cookie.split(';');
    // o código acima divide a string de cookies em um array, onde cada elemento é um cookie individual.
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
    /*
     Montamos um objeto com todos os cookies presentes em
     `document.cookie`. Cada item da string é dividido em nome/valor
     e o valor é decodificado para que possa ser usado diretamente
     em JavaScript (ex.: JSON parse após recuperar um carrinho).
    */
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
    /*
     Se nenhum nome for passado, assumimos ação via UI e lemos o
     campo de exclusão. Para remover o cookie definimos sua data
     de expiração para uma data no passado — técnica padrão para
     instruir o navegador a apagar o cookie. Em seguida atualizamos
     a interface e notificamos o usuário.
    */
    if (arguments.length === 0) {
        nome = document.getElementById('deleteCookieName').value;
    }
    if (!nome.trim()) {
        alert('Por favor, digite o nome do cookie!');
        return;
    }
    document.cookie = `${nome}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    console.log(`✓ Cookie deletado: ${nome}`);
    alert(`Cookie '${nome}' deletado!`);
    listarCookies();
}

/**
 * Limpa todos os cookies
 */
function limparTodosCookies() {
    /*
     Para limpar todos os cookies obtém-se todos os nomes e aplica-se
     a mesma técnica de expiração no passado para cada um. Isso não
     remove cookies com atributos de domínio/path diferentes do atual,
     mas cobre os cookies criados por este script com `path=/`.
    */
    const cookies = obterTodosCookies();
    Object.keys(cookies).forEach(nome => {
        document.cookie = `${nome}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
    console.log('✓ Todos os cookies foram deletados');
    alert('Todos os cookies foram removidos!');
    listarCookies();
}

// ============================
// FUNÇÕES DE INTERFACE
// ============================

/**
 * Lista todos os cookies na interface
 */
function listarCookies() {
    /*
     Renderiza a lista de cookies na interface. Primeiro transformamos
     o objeto de cookies em uma coleção de itens HTML. Se não houver
     cookies exibimos uma mensagem amigável. Cada item inclui um
     botão que permite deletar o cookie correspondente.
    */
    const cookies = obterTodosCookies();
    const cookieList = document.getElementById('cookieList');
    // o código acima pega o elemento HTML onde os cookies serão listados e armazena em uma variável para manipulação posterior.
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
    /*
     Lê um cookie específico solicitado pelo usuário via input.
     Exibimos mensagens claras na UI: erro quando o campo está
     vazio, sucesso quando o cookie é encontrado, ou aviso quando
     não existe. As classes CSS são alternadas para controlar o
     estilo visual da caixa de resultado.
    */
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
    /*
     Pergunta confirmação ao usuário antes de deletar. A confirmação
     evita remoções acidentais; quando confirmada delegamos a ação
     para `deletarCookie` que cuida da lógica de remoção e atualização
     da interface.
    */
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
    /*
     Função responsável por alternar classes CSS que definem o tema
     visual do site. Primeiro removemos qualquer classe de tema para
     evitar acúmulo. Em seguida aplicamos a classe correspondente ao
     tema solicitado. Finalmente salvamos a preferência do usuário em
     um cookie para que a escolha persista em futuras visitas e
     atualizamos a seção informativa da UI.
    */
    const body = document.body;
    body.classList.remove('tema-claro', 'tema-escuro');
    if (tema === 'claro') {
        body.classList.add('tema-claro');
    } else if (tema === 'escuro') {
        body.classList.add('tema-escuro');
    }
    criarCookie('temaSite', tema, 30);
    atualizarInfoTema(tema);
}

/**
 * Atualiza a mensagem de informação do tema
 */
function atualizarInfoTema(tema) {
    /*
     Atualiza a área que mostra qual tema está ativo. Fazemos uma
     formatação simples do nome (primeira letra em maiúscula) e
     exibimos uma nota informando que a preferência foi salva em
     cookie, para dar feedback ao usuário.
    */
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
    /*
     Ao carregar a página tentamos recuperar a preferência do tema
     no cookie `temaSite`. Se encontrada aplicamos o tema correspondente
     para que a interface reflita a escolha anterior do usuário. Caso
     contrário mostramos o estado padrão sem alterar classes.
    */
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
    
    /*
     Exemplo didático: salva o email do usuário em cookie. Em
     aplicações reais nunca se deve salvar senhas ou informações
     sensíveis em cookies sem criptografia/segurança apropriada.
    */
    criarCookie('emailUsuario', email, 7);
    console.log('✓ Email salvo em cookie');
}

/**
 * Exemplo: Contar visitas
 */
function exemploContarVisitas() {
    /*
     Demonstração simples de persistência: lemos um cookie que guarda
     o contador de visitas, incrementamos e salvamos novamente. Isso
     permite mostrar ao usuário quantas vezes ele visitou o site
     sem necessidade de backend.
    */
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
    /*
     Para persistir um array/objeto em cookie convertê-lo em JSON
     é a abordagem comum. Atenção ao tamanho: cookies têm limite de
     tamanho (~4KB) e não devem ser usados para armazenar grandes
     volumes de dados. Aqui salvamos o carrinho por 1 dia.
    */
    const carrinho = JSON.stringify(itens);
    criarCookie('carrinho', carrinho, 1);
    console.log('✓ Carrinho salvo em cookie');
}

/**
 * Exemplo: Recuperar carrinho
 */
function exemploRecuperarCarrinho() {
    /*
     Recupera e desserializa o carrinho salvo em cookie. Se o cookie
     existir fazemos parse do JSON e retornamos o array; caso contrário
     retornamos um array vazio para facilitar o uso pelo código
     chamador sem precisar checar `null`.
    */
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
    // Ao iniciar: aplicamos tema salvo e preenchemos a lista de cookies
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
