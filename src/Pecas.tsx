import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { tipoPeca, statusPeca, type Peca, type Aeronave, type Etapa } from './mockData';
import Modal from './Modal';

interface OutletContextType {
  pecas: Peca[];
  setPecas: React.Dispatch<React.SetStateAction<Peca[]>>;
  aeronaves: Aeronave[];
  etapas: Etapa[];
  setEtapas: React.Dispatch<React.SetStateAction<Etapa[]>>;
}

function Pecas() {
  const { pecas, setPecas, aeronaves } = useOutletContext<OutletContextType>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPeca, setEditingPeca] = useState<Peca | null>(null);

  const initialPecaState: Peca = {
    id: 0,
    nome: '',
    tipo: tipoPeca.Nacional,
    fornecedor: '',
    status: statusPeca.Producao,
    aeronaveId: aeronaves[0]?.codigo || 0,
  };
  const [currentPeca, setCurrentPeca] = useState<Peca>(initialPecaState);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentPeca(prev => ({
      ...prev,
      [name]: name === 'aeronaveId' ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPeca) {
      setPecas(pecas.map(p => p.id === editingPeca.id ? currentPeca : p));
    } else {
      const newEntry: Peca = {
        ...currentPeca,
        id: Math.floor(Math.random() * 10000) + 100,
      };
      setPecas(prev => [...prev, newEntry]);
    }

    setIsModalOpen(false);
    setEditingPeca(null);
    setCurrentPeca(initialPecaState);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir esta peça?")) {
      setPecas(pecas.filter((p) => p.id !== id));
    }
  };

  const handleStatusChange = (id: number, newStatus: statusPeca) => {
    setPecas(pecas.map(p =>
      p.id === id ? { ...p, status: newStatus } : p
    ));
  };

  const openModal = () => {
    setEditingPeca(null);
    setCurrentPeca(initialPecaState);
    setIsModalOpen(true);
  };

  const handleEdit = (peca: Peca) => {
    setEditingPeca(peca);
    setCurrentPeca(peca);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPeca(null);
    setCurrentPeca(initialPecaState);
  }

  return (
    <div>
      <h1>Gerenciamento de Peças</h1>

      <Modal title={editingPeca ? "Editar Peça" : "Cadastrar Nova Peça"} isOpen={isModalOpen} onClose={closeModal}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nome">Nome da Peça</label>
            <input type="text" id="nome" name="nome" onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="tipo">Tipo</label>
            <select id="tipo" name="tipo" value={currentPeca.tipo} onChange={handleInputChange}>
              {Object.values(tipoPeca).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="fornecedor">Fornecedor</label>
            <input type="text" id="fornecedor" name="fornecedor" value={currentPeca.fornecedor} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="aeronaveId">Aeronave Associada</label>
            <select id="aeronaveId" name="aeronaveId" value={currentPeca.aeronaveId} onChange={handleInputChange} disabled={aeronaves.length === 0}>
              {aeronaves.map(a => <option key={a.codigo} value={a.codigo}>{a.modelo} ({a.codigo})</option>)}
            </select>
          </div>
          <button type="submit" className="btn-primary">Salvar</button>
        </form>
      </Modal>

      <div className="card">
        <div className="table-actions">
            <button className="btn-primary" onClick={openModal}>Cadastrar Nova Peça</button>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Tipo</th>
              <th>Fornecedor</th>
              <th>Status</th>
              <th>Aeronave ID</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pecas.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.nome}</td>
                <td>{p.tipo}</td>
                <td>{p.fornecedor}</td>
                <td>
                  <select
                    value={p.status}
                    onChange={(e) => handleStatusChange(p.id, e.target.value as statusPeca)}
                    disabled={p.status === statusPeca.Pronta}
                  >
                    {Object.values(statusPeca).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td>{p.aeronaveId}</td>
                <td className="actions-cell">
                  <button className="btn-secondary" onClick={() => handleEdit(p)}>Editar</button>
                  <button className="btn-danger" onClick={() => handleDelete(p.id)}>
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

export default Pecas;