/**
 * Classe modelo para Registro de Ponto
 */
export class RegistroPonto {
    /**
     * Cria uma nova instância de Registro de Ponto
     * @param {number|null} id - ID do registro (null para novos registros)
     * @param {number} funcionarioId - ID do funcionário
     * @param {string} tipoRegistro - Tipo de registro (entrada, saida_almoco, retorno_almoco, saida)
     * @param {string} data - Data do registro (formato YYYY-MM-DD)
     * @param {string} hora - Hora do registro (formato HH:MM)
     * @param {string} observacao - Observação opcional
     * @param {string} localizacao - Local do registro (presencial, remoto)
     */
    constructor(id, funcionarioId, tipoRegistro, data, hora, observacao, localizacao) {
        this.id = id;
        this.funcionarioId = funcionarioId;
        this.tipoRegistro = tipoRegistro;
        this.data = data;
        this.hora = hora;
        this.observacao = observacao;
        this.localizacao = localizacao;
        this.dataCriacao = new Date().toISOString();
    }
    
    /**
     * Retorna a representação em objeto do registro para envio à API
     * @returns {Object} Objeto com os dados do registro
     */
    paraAPI() {
        return {
            id: this.id,
            funcionarioId: this.funcionarioId,
            tipoRegistro: this.tipoRegistro,
            data: this.data,
            hora: this.hora,
            observacao: this.observacao,
            localizacao: this.localizacao,
            dataCriacao: this.dataCriacao
        };
    }
    
    /**
     * Cria uma instância de RegistroPonto a partir de dados da API
     * @param {Object} dados - Dados do registro recebidos da API
     * @returns {RegistroPonto} Nova instância de RegistroPonto
     */
    static deAPI(dados) {
        return new RegistroPonto(
            dados.id,
            dados.funcionarioId,
            dados.tipoRegistro,
            dados.data,
            dados.hora,
            dados.observacao,
            dados.localizacao
        );
    }
}