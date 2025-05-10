import { Funcionario } from '../../../../funcionario.js';
import { RegistroPonto } from '../../../../registroPonto.js';

/**
 * Classe para comunicação com a API externa
 */
export class ApiService {
    constructor() {
        // URL base da API
        this.baseUrl = 'https://jsonplaceholder.typicode.com';
        
        // Dados simulados para uso quando a API não estiver disponível
        this.dadosSimulados = this.gerarDadosSimulados();
    }
    
    /**
     * Realiza requisições HTTP para a API
     * @param {string} endpoint - Endpoint da API
     * @param {string} metodo - Método HTTP (GET, POST, PUT, DELETE)
     * @param {Object} dados - Dados a serem enviados (para POST e PUT)
     * @returns {Promise<Object>} Resposta da API
     */
    async requisitar(endpoint, metodo = 'GET', dados = null) {
        try {
            const url = `${this.baseUrl}/${endpoint}`;
            const config = {
                method: metodo,
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            
            if (dados && (metodo === 'POST' || metodo === 'PUT')) {
                config.body = JSON.stringify(dados);
            }
            
            const resposta = await fetch(url, config);
            
            if (!resposta.ok) {
                throw new Error(`Erro ${resposta.status}: ${resposta.statusText}`);
            }
            
            return await resposta.json();
        } catch (error) {
            console.error(`Erro na requisição para ${endpoint}:`, error);
            
            // Usar dados simulados em caso de erro na API
            console.log('Usando dados simulados devido a falha na API');
            
            // Simular um atraso na resposta
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // Retornar dados simulados com base no endpoint
            if (endpoint.includes('users')) {
                return this.dadosSimulados.funcionarios;
            } else if (endpoint.includes('posts')) {
                return this.dadosSimulados.registros;
            } else if (metodo === 'POST' && endpoint.includes('users')) {
                return { id: Date.now(), ...dados };
            } else if (metodo === 'POST' && endpoint.includes('posts')) {
                return { id: Date.now(), ...dados };
            } else {
                return {};
            }
        }
    }
    
    /**
     * Obtém a lista de funcionários da API
     * @returns {Promise<Array<Funcionario>>} Lista de funcionários
     */
    async obterFuncionarios() {
        try {
            const dados = await this.requisitar('users');
            
            // Converter dados da API para objetos Funcionario
            if (Array.isArray(dados)) {
                // Se retornou dados da API jsonplaceholder, converter formato
                if (dados[0] && 'name' in dados[0]) {
                    return dados.map(f => new Funcionario(
                        f.id,
                        f.name,
                        f.email,
                        this.gerarCargoAleatorio(),
                        this.gerarDepartamentoAleatorio(),
                        this.gerarDataAdmissaoAleatoria()
                    ));
                } 
                // Se já estiver no formato esperado
                else {
                    return dados.map(f => Funcionario.deAPI(f));
                }
            }
            
            return [];
        } catch (error) {
            console.error('Erro ao obter funcionários:', error);
            return this.dadosSimulados.funcionarios.map(f => Funcionario.deAPI(f));
        }
    }
    
    /**
     * Obtém a lista de registros de ponto da API
     * @returns {Promise<Array<RegistroPonto>>} Lista de registros de ponto
     */
    async obterRegistrosPonto() {
        try {
            const dados = await this.requisitar('posts');
            
            // Converter dados da API para objetos RegistroPonto
            if (Array.isArray(dados)) {
                // Se retornou dados da API jsonplaceholder, converter formato
                if (dados[0] && 'title' in dados[0]) {
                    return dados.slice(0, 20).map(p => new RegistroPonto(
                        p.id,
                        p.userId || Math.floor(Math.random() * 10) + 1,
                        this.gerarTipoRegistroAleatorio(),
                        this.gerarDataAleatoria(),
                        this.gerarHoraAleatoria(),
                        p.body.substring(0, 50),
                        Math.random() > 0.5 ? 'presencial' : 'remoto'
                    ));
                } 
                // Se já estiver no formato esperado
                else {
                    return dados.map(r => RegistroPonto.deAPI(r));
                }
            }
            
            return [];
        } catch (error) {
            console.error('Erro ao obter registros de ponto:', error);
            return this.dadosSimulados.registros.map(r => RegistroPonto.deAPI(r));
        }
    }
    
    /**
     * Adiciona um novo funcionário
     * @param {Funcionario} funcionario - O funcionário a ser adicionado
     * @returns {Promise<Funcionario>} O funcionário adicionado com ID
     */
    async adicionarFuncionario(funcionario) {
        try {
            const dados = await this.requisitar('users', 'POST', funcionario.paraAPI());
            return Funcionario.deAPI({ ...funcionario.paraAPI(), id: dados.id });
        } catch (error) {
            console.error('Erro ao adicionar funcionário:', error);
            // Gerar ID aleatório para simulação
            const novoId = Date.now();
            return Funcionario.deAPI({ ...funcionario.paraAPI(), id: novoId });
        }
    }
    
    /**
     * Adiciona um novo registro de ponto
     * @param {RegistroPonto} registro - O registro a ser adicionado
     * @returns {Promise<RegistroPonto>} O registro adicionado com ID
     */
    async adicionarRegistroPonto(registro) {
        try {
            const dados = await this.requisitar('posts', 'POST', registro.paraAPI());
            return RegistroPonto.deAPI({ ...registro.paraAPI(), id: dados.id });
        } catch (error) {
            console.error('Erro ao adicionar registro de ponto:', error);
            // Gerar ID aleatório para simulação
            const novoId = Date.now();
            return RegistroPonto.deAPI({ ...registro.paraAPI(), id: novoId });
        }
    }
    
    /**
     * Gera dados simulados para uso offline
     * @returns {Object} Objeto contendo dados simulados
     */
    gerarDadosSimulados() {
        // Gerar funcionários simulados
        const funcionarios = [];
        for (let i = 1; i <= 10; i++) {
            funcionarios.push({
                id: i,
                nome: `Funcionário ${i}`,
                email: `funcionario${i}@empresa.com`,
                cargo: this.gerarCargoAleatorio(),
                departamento: this.gerarDepartamentoAleatorio(),
                dataAdmissao: this.gerarDataAdmissaoAleatoria(),
                dataCadastro: new Date().toISOString()
            });
        }
        
        // Gerar registros de ponto simulados
        const registros = [];
        for (let i = 1; i <= 40; i++) {
            const funcionarioId = Math.floor(Math.random() * 10) + 1;
            const tipoRegistro = this.gerarTipoRegistroAleatorio();
            const data = this.gerarDataAleatoria();
            const hora = this.gerarHoraAleatoria();
            
            registros.push({
                id: i,
                funcionarioId,
                tipoRegistro,
                data,
                hora,
                observacao: `Registro ${i} - ${tipoRegistro}`,
                localizacao: Math.random() > 0.5 ? 'presencial' : 'remoto',
                dataCriacao: new Date().toISOString()
            });
        }
        
        return { funcionarios, registros };
    }
    
    /**
     * Gera um cargo aleatório
     * @returns {string} Cargo aleatório
     */
    gerarCargoAleatorio() {
        const cargos = [
            'Analista',
            'Desenvolvedor',
            'Designer',
            'Gerente',
            'Coordenador',
            'Assistente',
            'Estagiário',
            'Diretor'
        ];
        
        return cargos[Math.floor(Math.random() * cargos.length)];
    }
    
    /**
     * Gera um departamento aleatório
     * @returns {string} Departamento aleatório
     */
    gerarDepartamentoAleatorio() {
        const departamentos = [
            'TI',
            'RH',
            'Financeiro',
            'Marketing',
            'Vendas',
            'Operações',
            'Administrativo',
            'Jurídico'
        ];
        
        return departamentos[Math.floor(Math.random() * departamentos.length)];
    }
    
    /**
     * Gera uma data de admissão aleatória
     * @returns {string} Data no formato YYYY-MM-DD
     */
    gerarDataAdmissaoAleatoria() {
        const hoje = new Date();
        const anoInicial = hoje.getFullYear() - 5;
        const anoFinal = hoje.getFullYear();
        
        const ano = Math.floor(Math.random() * (anoFinal - anoInicial + 1)) + anoInicial;
        const mes = Math.floor(Math.random() * 12) + 1;
        const dia = Math.floor(Math.random() * 28) + 1; // Limitado a 28 para evitar problemas com fevereiro
        
        return `${ano}-${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
    }
    
    /**
     * Gera um tipo de registro aleatório
     * @returns {string} Tipo de registro
     */
    gerarTipoRegistroAleatorio() {
        const tipos = ['entrada', 'saida_almoco', 'retorno_almoco', 'saida'];
        return tipos[Math.floor(Math.random() * tipos.length)];
    }
    
    /**
     * Gera uma data aleatória dos últimos 30 dias
     * @returns {string} Data no formato YYYY-MM-DD
     */
    gerarDataAleatoria() {
        const hoje = new Date();
        const diasAtras = Math.floor(Math.random() * 30);
        
        const data = new Date(hoje);
        data.setDate(hoje.getDate() - diasAtras);
        
        const ano = data.getFullYear();
        const mes = data.getMonth() + 1;
        const dia = data.getDate();
        
        return `${ano}-${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
    }
    
    /**
     * Gera uma hora aleatória
     * @returns {string} Hora no formato HH:MM
     */
    gerarHoraAleatoria() {
        const hora = Math.floor(Math.random() * 9) + 8; // Entre 8h e 17h
        const minuto = Math.floor(Math.random() * 60);
        
        return `${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`;
    }
}