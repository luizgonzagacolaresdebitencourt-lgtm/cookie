# 🍪 Exemplo de Cookies no Navegador

Um exemplo prático e interativo que demonstra como usar cookies no navegador com HTML, CSS e JavaScript.

## 📋 O que são Cookies?

Cookies são pequenos arquivos de texto armazenados no navegador que permitem persistir dados do lado do cliente. Eles são úteis para:

- **Preferências do usuário** (tema, idioma, etc.)
- **Autenticação e sessões**
- **Rastreamento de comportamento**
- **Personalização de experiência**

## 📁 Estrutura do Projeto

```
cookie/
├── index.html    - Interface web interativa
├── style.css     - Estilos e temas
├── script.js     - Lógica de cookies e interações
└── README.md     - Esta documentação
```

## 🚀 Como Usar

### 1. Abrir no Navegador

Simplesmente abra o arquivo `index.html` em qualquer navegador moderno:
- Clique duplo em `index.html`
- Ou arraste para o navegador
- Ou use um servidor local (recomendado)

### 2. Usar um Servidor Local (Recomendado)

```bash
# Com Python 3
python -m http.server 8000

# Com Node.js (http-server)
npx http-server

# Com PHP
php -S localhost:8000
```

Então acesse: `http://localhost:8000`

## 🎯 Funcionalidades

### ✅ Criar um Cookie
- Digite o nome e valor do cookie
- Defina a duração em dias
- Clique em "Criar Cookie"

### 📖 Listar Cookies
- Visualize todos os cookies salvos
- Veja nome e valor de cada um
- Delete cookies individuais

### 🔍 Ler um Cookie Específico
- Digite o nome do cookie
- Clique em "Ler"
- Veja o valor armazenado

### 🗑️ Deletar Cookies
- Delete cookies individuais
- Ou limpe todos de uma vez

### 🎨 Exemplo Prático: Tema
- Troque entre tema claro, escuro e padrão
- A preferência é salva em um cookie
- A preferência é recuperada ao recarregar a página

## 💻 Exemplos de Código

### Criar um Cookie

```javascript
function criarCookie(nome, valor, dias) {
    let dataExpiracao = '';
    
    if (dias > 0) {
        const data = new Date();
        data.setTime(data.getTime() + (dias * 24 * 60 * 60 * 1000));
        dataExpiracao = '; expires=' + data.toUTCString();
    }

    document.cookie = `${nome}=${encodeURIComponent(valor)}${dataExpiracao}; path=/`;
}

// Uso:
criarCookie('usuario', 'João Silva', 7);
```

### Ler um Cookie

```javascript
function lerCookie(nome) {
    const nomeCodificado = `${nome}=`;
    const cookies = document.cookie.split(';');
    
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.indexOf(nomeCodificado) === 0) {
            return decodeURIComponent(cookie.substring(nomeCodificado.length));
        }
    }
    
    return null;
}

// Uso:
const usuario = lerCookie('usuario');
console.log(usuario); // "João Silva"
```

### Deletar um Cookie

```javascript
function deletarCookie(nome) {
    document.cookie = `${nome}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

// Uso:
deletarCookie('usuario');
```

### Obter Todos os Cookies

```javascript
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

// Uso:
console.log(obterTodosCookies());
```

## 🔧 Console do Navegador

Você pode testar os cookies direto no console do navegador:

1. Abra o Developer Tools (F12 ou Ctrl+Shift+I)
2. Vá para a aba "Console"
3. Use os comandos abaixo:

```javascript
// Criar um cookie
criarCookie('teste', 'valor123', 7);

// Ler um cookie
lerCookie('teste');

// Listar todos
obterTodosCookies();

// Deletar um cookie
deletarCookie('teste');

// Exemplo: Contar visitas
exemploContarVisitas();

// Exemplo: Salvar carrinho
exemploSalvarCarrinho(['item1', 'item2']);
exemploRecuperarCarrinho();
```

## 📊 Características dos Cookies

| Aspecto | Detalhes |
|---------|----------|
| **Tamanho Máximo** | ~4KB por cookie |
| **Número Máximo** | ~180 cookies por domínio |
| **Tempo de Vida** | Configurável (sessão ou permanente) |
| **Armazenamento** | Local do navegador |
| **Segurança** | Evite dados sensíveis |
| **Acesso** | JavaScript (lado do cliente) |

## ⚠️ Importante

### ✅ Boas Práticas
- Use cookies para preferências não-sensíveis
- Defina tempos de expiração apropriados
- Codifique valores especiais
- Use `path=/` para cookies do site inteiro
- Informe ao usuário sobre cookies (LGPD/GDPR)

### ❌ O que Evitar
- **NUNCA** salve senhas em cookies
- Evite dados pessoais sensíveis
- Cuidado com cookies de terceiros
- Não confie em dados do cliente
- Não salve informações que devem ser secretas

## 🌐 Domínios e Atributos

```javascript
// Cookie com atributos completos
document.cookie = "nome=valor; expires=Sun, 31 Dec 2025 23:59:59 UTC; path=/; domain=seusite.com; secure; samesite=Strict";
```

- **expires**: Data de expiração (UTC)
- **path**: Caminho do site (/contas, /)
- **domain**: Domínio do cookie
- **secure**: Apenas HTTPS
- **samesite**: Proteção contra CSRF

## 📚 Casos de Uso Práticos

1. **Preferências do Usuário**
   ```javascript
   criarCookie('idioma', 'pt-br', 365);
   criarCookie('tema', 'escuro', 365);
   ```

2. **Carrinho de Compras**
   ```javascript
   const carrinho = [{id: 1, nome: 'Produto'}, {id: 2, nome: 'Produto 2'}];
   criarCookie('carrinho', JSON.stringify(carrinho), 1);
   ```

3. **ID de Sessão**
   ```javascript
   criarCookie('sessionId', 'abc123def456', 0); // Expira ao fechar navegador
   ```

4. **Lembrar-se de Dados**
   ```javascript
   criarCookie('email', 'usuario@email.com', 30);
   ```

## 🔍 Inspecionando Cookies

**No DevTools do Navegador:**
1. Abra F12
2. Vá para "Application" ou "Storage"
3. Selecione "Cookies"
4. Veja todos os cookies salvos

## 📖 Referências

- [MDN - Document.cookie](https://developer.mozilla.org/pt-BR/docs/Web/API/Document/cookie)
- [MDN - HTTP cookies](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Cookies)
- [LGPD e Cookies](https://www.gov.br/cidadania/pt-br/acesso-a-informacao/lgpd)

## 📝 Licença

Este projeto é de código aberto e pode ser usado livremente para fins educacionais.

---

**Autor:** Exemplo Educacional  
**Última Atualização:** 2024  
**Compatibilidade:** Todos os navegadores modernos
