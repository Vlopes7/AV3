import { useState } from 'react';
import { mockFuncionarios, Hierarquia, type Funcionario } from './mockData';
import Modal from './Modal';

function Employees() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>(mockFuncionarios);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const initialEmployeeState: Omit<Funcionario, 'id'> = {
    nome: '',
    cpf: '',
    cargo: Hierarquia.Operador,
    login: '',
    senha: '',
  };
  const [newEmployee, setNewEmployee] = useState(initialEmployeeState);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewEmployee(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: Funcionario = {
      ...newEmployee,
      id: Math.floor(Math.random() * 1000),
    };
    setFuncionarios(prev => [...prev, newEntry]);
    setNewEmployee(initialEmployeeState);
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este funcionário?")) {
      setFuncionarios(funcionarios.filter((f) => f.id !== id));
    }
  };

  const openModal = () => {
    setNewEmployee(initialEmployeeState);
    setIsModalOpen(true);
  };

  return (
    <div>
      <h1>Gerenciamento de Funcionários</h1>

      <Modal title="Cadastrar Novo Funcionário" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nome">Nome Completo</label>
            <input type="text" id="nome" name="nome" onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="cpf">CPF</label>
            <input type="text" id="cpf" name="cpf" onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="cargo">Cargo</label>
            <select id="cargo" name="cargo" value={newEmployee.cargo} onChange={handleInputChange}>
              {Object.values(Hierarquia).map(h => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="login">Login (e-mail)</label>
            <input type="email" id="login" name="login" onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input type="password" id="senha" name="senha" onChange={handleInputChange} required />
          </div>
          <button type="submit" className="btn-primary">Salvar</button>
        </form>
      </Modal>

      <div className="card">
        <div className="table-actions">
            <button className="btn-primary" onClick={openModal}>Cadastrar Novo Funcionário</button>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>CPF</th>
              <th>Cargo</th>
              <th>Login</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {funcionarios.map((f) => (
              <tr key={f.id}>
                <td>{f.id}</td>
                <td>{f.nome}</td>
                <td>{f.cpf}</td>
                <td>{f.cargo}</td>
                <td>{f.login}</td>
                <td className="actions-cell">
                  <button className="btn-danger" onClick={() => handleDelete(f.id)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Employees;