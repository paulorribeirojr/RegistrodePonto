/**
 * Classe responsável por lidar com validação e manipulação de formulários
 */
export class FormHandler {
    constructor() {
        this.formValidators = {};
    }
    
    /**
     * Inicializa os formulários da aplicação com validação
     */
    inicializarFormularios() {
        // Formulário de registro de ponto
        this.inicializarValidacaoFormulario('registro-form', {
            'funcionario_id': {
                required: true,
                pattern: /^\d+$/,
                mensagem: {
                    required: 'ID do funcionário é obrigatório',
                    pattern: 'Formato inválido. Use apenas números'
                }
            },
            'tipo_registro': {
                required: true,
                mensagem: {
                    required: 'Tipo de registro é obrigatório'
                }
            },
            'data': {
                required: true,
                mensagem: {
                    required: 'Data é obrigatória'
                }
            },
            'hora': {
                required: true,
                mensagem: {
                    required: 'Hora é obrigatória'
                }
            },
            'confirmar': {
                required: true,
                mensagem: {
                    required: 'Você deve confirmar as informações'
                }
            }
        });
        
        // Formulário de cadastro de funcionário
        this.inicializarValidacaoFormulario('cadastro-form', {
            'nome': {
                required: true,
                minLength: 3,
                mensagem: {
                    required: 'Nome é obrigatório',
                    minLength: 'Nome deve ter pelo menos 3 caracteres'
                }
            },
            'email': {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                mensagem: {
                    required: 'E-mail é obrigatório',
                    pattern: 'Formato de e-mail inválido'
                }
            },
            'cargo': {
                required: true,
                mensagem: {
                    required: 'Cargo é obrigatório'
                }
            },
            'departamento': {
                required: true,
                mensagem: {
                    required: 'Departamento é obrigatório'
                }
            },
            'data_admissao': {
                required: true,
                mensagem: {
                    required: 'Data de admissão é obrigatória'
                }
            }
        });
    }
    
    /**
     * Inicializa as validações para um formulário específico
     * @param {string} formId - ID do formulário
     * @param {Object} validadores - Objeto com regras de validação
     */
    inicializarValidacaoFormulario(formId, validadores) {
        const form = document.getElementById(formId);
        if (!form) return;
        
        // Armazenar validadores
        this.formValidators[formId] = validadores;
        
        // Adicionar evento de validação em cada campo
        Object.keys(validadores).forEach(campo => {
            const input = form.elements[campo];
            if (input) {
                input.addEventListener('blur', () => {
                    this.validarCampo(formId, campo, input.value);
                });
                
                input.addEventListener('input', () => {
                    // Remover mensagem de erro ao digitar
                    this.removerMensagemValidacao(campo);
                });
            }
        });
        
        // Validar todo o formulário no submit
        form.addEventListener('submit', (e) => {
            if (!this.validarFormulario(formId)) {
                e.preventDefault();
            }
        });
    }
    
    /**
     * Valida um formulário inteiro
     * @param {string} formId - ID do formulário
     * @returns {boolean} Se o formulário é válido
     */
    validarFormulario(formId) {
        const form = document.getElementById(formId);
        const validadores = this.formValidators[formId];
        if (!form || !validadores) return true;
        
        let isValid = true;
        
        // Validar cada campo
        Object.keys(validadores).forEach(campo => {
            const input = form.elements[campo];
            if (input) {
                const campoValido = this.validarCampo(formId, campo, input.value);
                if (!campoValido) isValid = false;
            }
        });
        
        return isValid;
    }
    
    /**
     * Valida um campo específico
     * @param {string} formId - ID do formulário
     * @param {string} campo - Nome do campo
     * @param {string} valor - Valor do campo
     * @returns {boolean} Se o campo é válido
     */
    validarCampo(formId, campo, valor) {
        const validadores = this.formValidators[formId];
        if (!validadores || !validadores[campo]) return true;
        
        const regras = validadores[campo];
        const mensagens = regras.mensagem || {};
        
        // Validar regras
        if (regras.required && (!valor || valor.trim() === '')) {
            this.mostrarMensagemValidacao(campo, mensagens.required || 'Campo obrigatório');
            return false;
        }
        
        if (regras.minLength && valor.length < regras.minLength) {
            this.mostrarMensagemValidacao(campo, mensagens.minLength || `Mínimo de ${regras.minLength} caracteres`);
            return false;
        }
        
        if (regras.pattern && !regras.pattern.test(valor)) {
            this.mostrarMensagemValidacao(campo, mensagens.pattern || 'Formato inválido');
            return false;
        }
        
        // Se chegou aqui, o campo é válido
        this.removerMensagemValidacao(campo);
        return true;
    }
    
    /**
     * Mostra uma mensagem de validação para um campo
     * @param {string} campo - ID ou nome do campo
     * @param {string} mensagem - Mensagem de erro
     */
    mostrarMensagemValidacao(campo, mensagem) {
        const input = document.getElementById(campo) || document.getElementsByName(campo)[0];
        if (!input) return;
        
        // Remover mensagem existente
        this.removerMensagemValidacao(campo);
        
        // Adicionar classe de erro
        input.classList.add('input-error');
        
        // Criar elemento de mensagem
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message-validation';
        errorDiv.id = `error-${campo}`;
        errorDiv.textContent = mensagem;
        errorDiv.style.cssText = `
            color: var(--danger-color);
            font-size: 0.85rem;
            margin-top: 0.25rem;
        `;
        
        // Inserir depois do input ou do seu container
        const parentEl = input.parentElement;
        parentEl.appendChild(errorDiv);
    }
    
    /**
     * Remove a mensagem de validação de um campo
     * @param {string} campo - ID ou nome do campo
     */
    removerMensagemValidacao(campo) {
        const input = document.getElementById(campo) || document.getElementsByName(campo)[0];
        if (!input) return;
        
        // Remover classe de erro
        input.classList.remove('input-error');
        
        // Remover mensagem de erro
        const errorDiv = document.getElementById(`error-${campo}`);
        if (errorDiv) {
            errorDiv.remove();
        }
    }
}