// Módulo principal da aplicação
import { DOMHandler } from './Projetos/RegistrodePonto/js/domHandler.js';
import { FormHandler } from './formHandler.js';
import { RegistroPonto } from './models/registroPonto.js';
import { Funcionario } from '../../funcionario.js';
import { ApiService } from './Projetos/RegistrodePonto/js/services/apiService.js';

// Classe principal da aplicação
class App {
    constructor() {
        // Inicializar serviços
        this.apiService = new ApiService();
        this.domHandler = new DOMHandler();
        this.formHandler = new FormHandler();
        
        // Registros de ponto e funcionários
        this.registrosPonto = [];
        this.funcionarios = [];
        
        // Inicializar a aplicação
        this.init();
    }
    
    async init() {
        try {
            // Configurar relógio
            this.configurarRelogio();
            
            // Carregar dados iniciais
            await this.carregarDados();
            
            // Inicializar manipuladores de eventos
            this.inicializarEventos();
            
            // Configurar formulários
            this.formHandler.inicializarFormularios();
            
            // Inicializar navegação ativa
            this.domHandler.inicializarNavegacaoAtiva();
            
            // Definir data atual nos campos de data
            this.definirDataAtual();
        } catch (error) {
            console.error('Erro ao inicializar a aplicação:', error);
            this.domHandler.mostrarErro('Não foi possível inicializar a aplicação. Por favor, tente novamente mais tarde.');
        }
    }
    
    configurarRelogio() {
        const atualizarHora = () => {
            const agora = new Date();
            
            // Formatar hora
            const horas = String(agora.getHours()).padStart(2, '0');
            const minutos = String(agora.getMinutes()).padStart(2, '0');
            const segundos = String(agora.getSeconds()).padStart(2, '0');
            const horaFormatada = `${horas}:${minutos}:${segundos}`;
            
            // Formatar data
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const dataFormatada = agora.toLocaleDateString('pt-BR', options);
            
            // Atualizar elementos no DOM
            document.getElementById('clock').textContent = horaFormatada;
            document.getElementById('date').textContent = dataFormatada;
        };
        
        // Atualizar imediatamente e depois a cada segundo
        atualizarHora();
        setInterval(atualizarHora, 1000);
    }
    
    async carregarDados() {
        try {
            // Mostrar indicador de carregamento
            this.domHandler.mostrarCarregando(true);
            
            // Carregar funcionários
            this.funcionarios = await this.apiService.obterFuncionarios();
            
            // Carregar registros de ponto
            this.registrosPonto = await this.apiService.obterRegistrosPonto();
            
            // Atualizar a interface
            this.atualizarListaFuncionarios();
            this.atualizarTabelaRegistros();
            
            // Esconder indicador de carregamento
            this.domHandler.mostrarCarregando(false);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            this.domHandler.mostrarCarregando(false);
            this.domHandler.mostrarErro('Falha ao carregar dados. Verifique sua conexão e tente novamente.');
        }
    }
    
    inicializarEventos() {
        // Evento para registrar ponto
        document.getElementById('registro-form').addEventListener('submit', this.registrarPonto.bind(this));
        
        // Evento para cadastrar funcionário
        document.getElementById('cadastro-form').addEventListener('submit', this.cadastrarFuncionario.bind(this));
        
        // Evento para filtrar registros
        document.getElementById('btn-filtrar').addEventListener('click', this.filtrarRegistros.bind(this));
        
        // Evento para limpar filtros quando o campo de busca estiver vazio
        document.getElementById('busca-funcionario').addEventListener('keyup', (e) => {
            if (e.target.value === '') {
                this.atualizarTabelaRegistros();
            }
        });
    }
    
    definirDataAtual() {
        const dataAtual = new Date().toISOString().split('T')[0];
        document.getElementById('data').value = dataAtual;
        
        const horaAtual = new Date().toTimeString().slice(0, 5);
        document.getElementById('hora').value = horaAtual;
    }
    
    async registrarPonto(event) {
        event.preventDefault();
        
        try {
            const form = event.target;
            const funcionarioId = parseInt(form.funcionario_id.value);
            const tipoRegistro = form.tipo_registro.value;
            const data = form.data.value;
            const hora = form.hora.value;
            const observacao = form.observacao.value;
            const localizacao = form.localizacao.value;
            
            // Validar se o funcionário existe
            const funcionarioExiste = this.funcionarios.some(f => f.id === funcionarioId);
            if (!funcionarioExiste) {
                this.formHandler.mostrarMensagemValidacao('funcionario_id', 'Funcionário não encontrado');
                return;
            }
            
            // Criar novo registro
            const novoRegistro = new RegistroPonto(
                null, // ID será gerado pela API
                funcionarioId,
                tipoRegistro,
                data,
                hora,
                observacao,
                localizacao
            );
            
            // Enviar para a API
            const registroSalvo = await this.apiService.adicionarRegistroPonto(novoRegistro);
            
            // Adicionar à lista e atualizar a tabela
            this.registrosPonto.push(registroSalvo);
            this.atualizarTabelaRegistros();
            
            // Limpar formulário e mostrar mensagem de sucesso
            form.reset();
            this.definirDataAtual();
            this.domHandler.mostrarMensagemSucesso('Ponto registrado com sucesso!');
        } catch (error) {
            console.error('Erro ao registrar ponto:', error);
            this.domHandler.mostrarErro('Falha ao registrar ponto. Tente novamente.');
        }
    }
    
    async cadastrarFuncionario(event) {
        event.preventDefault();
        
        try {
            const form = event.target;
            const nome = form.nome.value;
            const email = form.email.value;
            const cargo = form.cargo.value;
            const departamento = form.departamento.value;
            const dataAdmissao = form.data_admissao.value;
            
            // Criar novo funcionário
            const novoFuncionario = new Funcionario(
                null, // ID será gerado pela API
                nome,
                email,
                cargo,
                departamento,
                dataAdmissao
            );
            
            // Enviar para a API
            const funcionarioSalvo = await this.apiService.adicionarFuncionario(novoFuncionario);
            
            // Adicionar à lista e atualizar a UI
            this.funcionarios.push(funcionarioSalvo);
            this.atualizarListaFuncionarios();
            
            // Limpar formulário e mostrar mensagem de sucesso
            form.reset();
            this.domHandler.mostrarMensagemSucesso('Funcionário cadastrado com sucesso!');
        } catch (error) {
            console.error('Erro ao cadastrar funcionário:', error);
            this.domHandler.mostrarErro('Falha ao cadastrar funcionário. Tente novamente.');
        }
    }
    
    filtrarRegistros() {
        const termoBusca = document.getElementById('busca-funcionario').value.trim();
        
        if (!termoBusca) {
            this.atualizarTabelaRegistros();
            return;
        }
        
        const funcionarioId = parseInt(termoBusca);
        const registrosFiltrados = this.registrosPonto.filter(registro => 
            registro.funcionarioId === funcionarioId
        );
        
        this.atualizarTabelaRegistros(registrosFiltrados);
    }
    
    atualizarListaFuncionarios() {
        const listaEl = document.getElementById('lista-funcionarios');
        listaEl.innerHTML = '';
        
        if (this.funcionarios.length === 0) {
            listaEl.innerHTML = '<li>Nenhum funcionário cadastrado</li>';
            return;
        }
        
        this.funcionarios.forEach(funcionario => {
            const li = document.createElement('li');
            li.textContent = `${funcionario.id} - ${funcionario.nome} (${funcionario.cargo})`;
            listaEl.appendChild(li);
        });
    }
    
    atualizarTabelaRegistros(registros = null) {
        const tbody = document.getElementById('registros-tbody');
        tbody.innerHTML = '';
        
        // Usar registros passados como parâmetro ou todos os registros
        const registrosParaExibir = registros || this.registrosPonto;
        
        if (registrosParaExibir.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = '<td colspan="6" class="text-center">Nenhum registro encontrado</td>';
            tbody.appendChild(tr);
            return;
        }
        
        // Ordenar registros por data/hora (mais recentes primeiro)
        const registrosOrdenados = [...registrosParaExibir].sort((a, b) => {
            const dataA = new Date(`${a.data}T${a.hora}`);
            const dataB = new Date(`${b.data}T${b.hora}`);
            return dataB - dataA;
        });
        
        registrosOrdenados.forEach(registro => {
            const tr = document.createElement('tr');
            
            // Encontrar nome do funcionário
            const funcionario = this.funcionarios.find(f => f.id === registro.funcionarioId) || 
                                { nome: 'Desconhecido' };
            
            // Formatar data
            const data = new Date(registro.data);
            const dataFormatada = data.toLocaleDateString('pt-BR');
            
            // Formatar tipo de registro
            const tiposRegistro = {
                'entrada': 'Entrada',
                'saida_almoco': 'Saída (Almoço)',
                'retorno_almoco': 'Retorno (Almoço)',
                'saida': 'Saída'
            };
            
            tr.innerHTML = `
                <td>${registro.funcionarioId}</td>
                <td>${funcionario.nome}</td>
                <td>${dataFormatada}</td>
                <td>${registro.hora}</td>
                <td>${tiposRegistro[registro.tipoRegistro] || registro.tipoRegistro}</td>
                <td>${registro.localizacao === 'presencial' ? 'Presencial' : 'Remoto'}</td>
            `;
            
            tbody.appendChild(tr);
        });
    }
}