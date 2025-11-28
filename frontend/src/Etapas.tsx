import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { producao, type Etapa, type Aeronave, type Peca } from './mockData';
import Modal from './Modal';

interface OutletContextType {
  etapas: Etapa[];
  setEtapas: React.Dispatch<React.SetStateAction<Etapa[]>>;
  aeronaves: Aeronave[];
  pecas: Peca[];
  setPecas: React.Dispatch<React.SetStateAction<Peca[]>>;
}

function Etapas() {
  const { etapas, setEtapas, aeronaves } = useOutletContext<OutletContextType>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEtapa, setEditingEtapa] = useState<Etapa | null>(null);
  const initialEtapaState: Etapa = {
    id: 0,
    nome: '',
    dataPrevista: '',
    status: producao.Pendente,
    aeronaveId: aeronaves[0]?.codigo || 0,
  };
  const [currentEtapa, setCurrentEtapa] = useState<Etapa>(initialEtapaState);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentEtapa(prev => ({
      ...prev,
      [name]: name === 'aeronaveId' ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEtapa) {
      setEtapas(etapas.map(e => e.id === editingEtapa.id ? currentEtapa : e));
    } else {
      const newEntry: Etapa = {
        ...currentEtapa,
        id: Math.floor(Math.random() * 10000) + 100,
        status: producao.Pendente,
      };
      setEtapas(prev => [...prev, newEntry]);
    }
    setIsModalOpen(false);
    setEditingEtapa(null);
    setCurrentEtapa(initialEtapaState);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir esta etapa?")) {
      setEtapas(etapas.filter((e) => e.id !== id));
    }
  };

  const handleStatusChange = (id: number, newStatus: producao) => {
    setEtapas(etapas.map(e =>
      e.id === id ? { ...e, status: newStatus } : e
    ));
  };

  const openModal = () => {
    setEditingEtapa(null);
    setCurrentEtapa(initialEtapaState);
    setIsModalOpen(true);
  };

  const handleEdit = (etapa: Etapa) => {
    setEditingEtapa(etapa);
    setCurrentEtapa(etapa);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEtapa(null);
    setCurrentEtapa(initialEtapaState);
  };

  return (
    <div>
      <h1>Etapas de Produção</h1>

      <Modal title={editingEtapa ? "Editar Etapa" : "Criar Nova Etapa"} isOpen={isModalOpen} onClose={closeModal}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nome">Nome da Etapa</label>
            <input type="text" id="nome" name="nome" value={currentEtapa.nome} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="dataPrevista">Data de Conclusão Prevista</label>
            <input type="date" id="dataPrevista" name="dataPrevista" value={currentEtapa.dataPrevista} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="aeronaveId">Aeronave</label>
            <select id="aeronaveId" name="aeronaveId" value={currentEtapa.aeronaveId} onChange={handleInputChange} disabled={aeronaves.length === 0}>
              {aeronaves.map(a => <option key={a.codigo} value={a.codigo}>{a.modelo} ({a.codigo})</option>)}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="funcionarios">Funcionários Designados (separados por vírgula)</label>
            <input type="text" id="funcionarios" name="funcionarios" placeholder="Ex: João Silva, Maria Souza" />
          </div>
          <button type="submit" className="btn-primary">Salvar</button>
        </form>
      </Modal>

      <div className="card">
        <div className="table-actions">
            <button className="btn-primary" onClick={openModal}>Criar Nova Etapa</button>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Data Prevista</th>
              <th>Status</th>
              <th>Aeronave ID</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {etapas.map((etapa) => (
              <tr key={etapa.id}>
                <td>{etapa.id}</td>
                <td>{etapa.nome}</td>
                <td>{etapa.dataPrevista}</td>
                <td>
                  <select
                    value={etapa.status}
                    onChange={(e) => handleStatusChange(etapa.id, e.target.value as producao)}
                    disabled={etapa.status === producao.Concluido}
                  >
                    {Object.values(producao).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td>{etapa.aeronaveId}</td>
                <td className="actions-cell">
                  <button className="btn-secondary" onClick={() => handleEdit(etapa)}>Editar</button>
                  <button className="btn-danger" onClick={() => handleDelete(etapa.id)}>
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

export default Etapas;