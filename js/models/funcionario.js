/**
 * Classe modelo para Funcionário
 */
export class Funcionario {
    /**
     * Cria uma nova instância de Funcionário
     * @param {number|null} id - ID do funcionário (null para novos funcionários)
     * @param {string} nome - Nome completo do funcionário
     * @param {string} email - Email do funcionário
     * @param {string} cargo - Cargo do funcionário
     * @param {string} departamento - Departamento do funcionário
     * @param {string} dataAdmissao - Data de admissão (formato YYYY-MM-DD)
     */
    constructor(id, nome, email, cargo, departamento, dataAdmissao) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.cargo = cargo;
        this.departamento = departamento;
        this.dataAdmissao = dataAdmissao;
        this.dataCadastro = new Date().toISOString();
    }
    
    /**
     * Retorna a representação em objeto do funcionário para envio à API
     * @returns {Object} Objeto com os dados do funcionário
     */
    paraAPI() {
        return {
            id: this.id,
            nome: this.nome,
            email: this.email,
            cargo: this.cargo,
            departamento: this.departamento,
            dataAdmissao: this.dataAdmissao,
            dataCadastro: this.dataCadastro
        };
    }
    
    /**
     * Cria uma instância de Funcionário a partir de dados da API
     * @param {Object} dados - Dados do funcionário recebidos da API
     * @returns {Funcionario} Nova instância de Funcionário
     */
    static deAPI(dados) {
        return new Funcionario(
            dados.id,
            dados.nome,
            dados.email,
            dados.cargo,
            dados.departamento,
            dados.dataAdmissao
        );
    }
    
    /**
     * Verifica se o funcionário é um gerente com base no cargo
     * @returns {boolean} Verdadeiro se for gerente
     */
    isGerente() {
        return this.cargo.toLowerCase().includes('gerente') || 
               this.cargo.toLowerCase().includes('gestor') || 
               this.cargo.toLowerCase().includes('diretor');
    }
    
    /**
     * Calcula o tempo de empresa em meses
     * @returns {number} Tempo de empresa em meses
     */
    tempoEmpresa() {
        const admissao = new Date(this.dataAdmissao);
        const hoje = new Date();
        const diffAnos = hoje.getFullYear() - admissao.getFullYear();
        const diffMeses = hoje.getMonth() - admissao.getMonth();
        
        return diffAnos * 12 + diffMeses;
    }
}