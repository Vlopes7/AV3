export enum Hierarquia {
  Administrador = 'Administrador',
  Engenheiro = 'Engenheiro',
  Operador = 'Operador',
}

export enum tipoAeronave {
  Comercial = 'Comercial', 
  Militar = 'Militar',
}

export enum statusPeca {
  Producao = 'Em produção',
  Transporte = 'Em transporte',
  Pronta = 'Pronta para uso',
}

export enum tipoPeca {
  Nacional = 'Nacional',
  Importada = 'Importada',
}

export enum producao {
  Pendente = 'Pendente',
  EmAndamento = 'Em andamento',
  Concluido = 'Concluído',
}

export enum tipoTeste {
  Eletrico = 'Elétrico',
  Hidraulico = 'Hidráulico',
  Aerodinamico = 'Aerodinâmico',
}

export interface Funcionario {
  id: number;
  nome: string;
  cpf: string;
  cargo: Hierarquia;
  login: string;
  senha?: string;
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

export const mockFuncionarios: Funcionario[] = [
  {
    id: 1,
    nome: 'Admin Geral',
    cpf: '111.111.111-11',
    cargo: Hierarquia.Administrador,
    login: 'admin@aerocode.com',
    senha: '123',
  },
  {
    id: 2,
    nome: 'Operador Padrão',
    cpf: '222.222.222-22',
    cargo: Hierarquia.Operador,
    login: 'op@aerocode.com',
    senha: '123',
  },
];

export const mockAeronaves: Aeronave[] = [
    { codigo: 737, modelo: 'Boeing 737', tipo: tipoAeronave.Comercial, capacidade: 189, autonomia: 5400 },
    { codigo: 320, modelo: 'Airbus A320', tipo: tipoAeronave.Comercial, capacidade: 180, autonomia: 6100 },
    { codigo: 130, modelo: 'Lockheed C-130', tipo: tipoAeronave.Militar, capacidade: 92, autonomia: 3800 },
];

export const mockPecas: Peca[] = [
  { id: 1, nome: 'Turbina GE90', tipo: tipoPeca.Importada, fornecedor: 'General Electric', status: statusPeca.Pronta, aeronaveId: 737 },
  { id: 2, nome: 'Assento Classe Executiva', tipo: tipoPeca.Nacional, fornecedor: 'AeroComfort', status: statusPeca.Producao, aeronaveId: 320 },
];

export const mockEtapas: Etapa[] = [
  { id: 1, nome: 'Montagem da Fuselagem', dataPrevista: '2024-10-20', status: producao.Concluido, aeronaveId: 737 },
  { id: 2, nome: 'Instalação Elétrica', dataPrevista: '2024-10-25', status: producao.EmAndamento, aeronaveId: 737 },
  { id: 3, nome: 'Montagem das Asas', dataPrevista: '2024-11-05', status: producao.Pendente, aeronaveId: 320 },
];