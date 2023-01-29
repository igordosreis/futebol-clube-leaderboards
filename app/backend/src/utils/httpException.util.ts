class HttpException extends Error {
  status: number;
  timestamp: string;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.timestamp = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
  }
}

export default HttpException;
