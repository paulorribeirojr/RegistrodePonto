/**
 * Classe responsável por lidar com manipulações do DOM
 */
export class DOMHandler {
    constructor() {
        this.messageTimeout = null;
    }
    
    /**
     * Mostra ou esconde o indicador de carregamento
     * @param {boolean} mostrar - Se o indicador deve ser mostrado ou escondido
     */
    mostrarCarregando(mostrar = true) {
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.style.display = mostrar ? 'block' : 'none';
        }
    }
    
    /**
     * Mostra uma mensagem de erro na interface
     * @param {string} mensagem - A mensagem de erro a ser exibida
     */
    mostrarErro(mensagem) {
        const errorElement = document.getElementById('error-message');
        if (errorElement) {
            errorElement.textContent = mensagem;
            errorElement.style.display = 'block';
            
            // Esconder a mensagem após 5 segundos
            clearTimeout(this.messageTimeout);
            this.messageTimeout = setTimeout(() => {
                errorElement.style.display = 'none';
            }, 5000);
        }
    }
    
    /**
     * Cria e mostra uma mensagem de sucesso temporária
     * @param {string} mensagem - A mensagem de sucesso a ser exibida
     */
    mostrarMensagemSucesso(mensagem) {
        // Verificar se já existe um toast
        let toastContainer = document.querySelector('.toast-container');
        
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            toastContainer.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 1000;
            `;
            document.body.appendChild(toastContainer);
        }
        
        // Criar novo toast
        const toast = document.createElement('div');
        toast.className = 'toast success';
        toast.style.cssText = `
            background-color: var(--success-color);
            color: white;
            padding: 1rem;
            border-radius: 5px;
            margin-top: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            animation: fadeIn 0.3s, fadeOut 0.3s 4.7s;
        `;
        toast.innerHTML = `
            <div style="display: flex; align-items: center;">
                <i class="fas fa-check-circle" style="margin-right: 10px;"></i>
                <span>${mensagem}</span>
            </div>
        `;
        
        // Adicionar toast ao container
        toastContainer.appendChild(toast);
        
        // Remover toast após 5 segundos
        setTimeout(() => {
            toast.remove();
            
            // Remover container se estiver vazio
            if (toastContainer.children.length === 0) {
                toastContainer.remove();
            }
        }, 5000);
        
        // Adicionar estilos para as animações se ainda não existirem
        if (!document.getElementById('toast-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-styles';
            style.textContent = `
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeOut {
                    from { opacity: 1; transform: translateY(0); }
                    to { opacity: 0; transform: translateY(-20px); }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    /**
     * Cria e insere um elemento no DOM
     * @param {string} tag - Tag do elemento a ser criado
     * @param {Object} attributes - Atributos do elemento
     * @param {string|Node} content - Conteúdo do elemento
     * @param {Element} parent - Elemento pai onde o novo elemento será inserido
     * @returns {Element} O elemento criado
     */
    criarElemento(tag, attributes = {}, content = '', parent = null) {
        const element = document.createElement(tag);
        
        // Definir atributos
        Object.entries(attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
        
        // Definir conteúdo
        if (typeof content === 'string') {
            element.innerHTML = content;
        } else if (content instanceof Node) {
            element.appendChild(content);
        }
        
        // Adicionar ao pai se fornecido
        if (parent) {
            parent.appendChild(element);
        }
        
        return element;
    }
    
    /**
     * Limpa todo o conteúdo de um elemento
     * @param {Element|string} elemento - O elemento ou ID do elemento a ser limpo
     */
    limparElemento(elemento) {
        const el = typeof elemento === 'string' ? document.getElementById(elemento) : elemento;
        if (el) {
            el.innerHTML = '';
        }
    }
    
    /**
     * Inicializa o sistema de navegação que marca como ativa a seção atual
     * durante a rolagem ou quando o hash da URL muda
     */
    inicializarNavegacaoAtiva() {
        // Selecionar todos os links do menu de navegação
        const navLinks = document.querySelectorAll('nav ul li a');
        
        // Função para definir o link ativo com base na seção visível ou hash
        const definirLinkAtivo = () => {
            // Verificar se há um hash na URL
            if (window.location.hash) {
                // Remover a classe 'active' de todos os links
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Adicionar a classe 'active' ao link correspondente ao hash atual
                const activeLink = document.querySelector(`nav ul li a[href="${window.location.hash}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            } else {
                // Se não estiver usando hash, verificar quais seções estão visíveis
                const sections = document.querySelectorAll('section');
                let currentSection = '';
                
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.clientHeight;
                    
                    // -100 para dar margem antes de mudar a seção ativa
                    if (window.scrollY >= (sectionTop - 100)) {
                        currentSection = '#' + section.getAttribute('id');
                    }
                });
                
                // Atualizar o link ativo
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === currentSection) {
                        link.classList.add('active');
                    }
                });
            }
        };
        
        // Adicionar eventos de clique aos links de navegação para rolagem suave
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href');
                
                if (targetId.startsWith('#')) {
                    const targetSection = document.querySelector(targetId);
                    
                    if (targetSection) {
                        e.preventDefault();
                        
                        // Rolagem suave até a seção
                        window.scrollTo({
                            top: targetSection.offsetTop,
                            behavior: 'smooth'
                        });
                        
                        // Atualizar URL sem recarregar a página
                        history.pushState(null, null, targetId);
                        
                        // Atualizar link ativo
                        navLinks.forEach(l => l.classList.remove('active'));
                        link.classList.add('active');
                    }
                }
            });
        });
        
        // Adicionar eventos para monitorar mudanças
        window.addEventListener('scroll', definirLinkAtivo);
        window.addEventListener('load', definirLinkAtivo);
        window.addEventListener('hashchange', definirLinkAtivo);
    }
}