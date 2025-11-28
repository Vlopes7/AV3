export enum tipoAeronave {
  Comercial = "Comercial",
  Militar = "Militar",
}

export enum tipoPeca {
  Nacional = "Nacional",
  Internacional = "Internacional",
}

export enum statusPeca {
  Producao = "Em Produção",
  Estoque = "Em Estoque",
  Pronta = "Pronta",
}

export enum producao {
  Pendente = "Pendente",
  Andamento = "Em Andamento",
  Concluido = "Concluído",
}

export enum tipoTeste {
  Estrutural = "Estrutural",
  Avionico = "Aviônico",
  Motor = "Motor",
  Voo = "Voo",
}

export enum Hierarquia {
  Administrador = "Administrador",
  Gerente = "Gerente",
  Operador = "Operador",
}

export interface Aeronave {
  codigo: number;
  modelo: string;
  tipo: tipoAeronave;
  capacidade: number;
  autonomia: number;
}

export interface Peca {
  id: number;
  nome: string;
  tipo: tipoPeca;
  fornecedor: string;
  status: statusPeca;
  aeronaveId: number;
}

export interface Etapa {
  id: number;
  nome: string;
  dataPrevista: string;
  status: producao;
  aeronaveId: number;
}

export interface Teste {
  id: number;
  tipo: tipoTeste;
  data: string;
  resultado: "Aprovado" | "Reprovado";
  aeronaveId: number;
}

export interface Relatorio {
  id: number;
  data: string;
  autor: string;
  aeronaveId: number;
}

export interface Funcionario {
  id: number;
  nome: string;
  cpf: string;
  cargo: Hierarquia;
  login: string;
  senha?: string;
}

