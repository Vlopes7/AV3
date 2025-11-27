import { useState, type ChangeEvent, type FormEvent } from "react";
import { useOutletContext } from "react-router-dom";
import Modal from "./Modal";

import {
  tipoAeronave,
  type Aeronave,
  type Peca,
} from "./mockData";

const estadoInicialForm: Omit<Aeronave, 'codigo'> = {
  modelo: "",
  tipo: tipoAeronave.Comercial,
  capacidade: 0,
  autonomia: 0,
};

interface OutletContextType {
  aeronaves: Aeronave[];
  setAeronaves: React.Dispatch<React.SetStateAction<Aeronave[]>>;
  pecas: Peca[];
  // Adicione outros estados do contexto se necessário
}

export function Aircrafts() {
  const { aeronaves, setAeronaves } = useOutletContext<OutletContextType>();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [novaAeronave, setNovaAeronave] = useState(estadoInicialForm);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNovaAeronave({
      ...novaAeronave,
      [name]:
        name === "capacidade" || name === "autonomia"
          ? Number(value)
          : value,
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newEntry: Aeronave = {
      ...novaAeronave,
      codigo: Math.floor(Math.random() * 1000) + 100, // Código aleatório para mock
    };
    setAeronaves([...aeronaves, newEntry]);
    
    setIsModalOpen(false);
    setNovaAeronave(estadoInicialForm);
  };

  const handleDelete = (codigo: number) => {
    if (window.confirm("Tem certeza que deseja excluir esta aeronave?")) {
      setAeronaves(aeronaves.filter((a) => a.codigo !== codigo));
    }
  };
  
  const handleEdit = (aeronave: Aeronave) => {
    console.log("Editar:", aeronave);
    alert("Funcionalidade de Editar ainda não implementada.");
  };

  return (
    <div className="main-content">
      <h1>Gerenciamento de Aeronaves</h1>

      <div className="table-actions">
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          Cadastrar Aeronave
        </button>
      </div>

      <div className="card">
        <table className="data-table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Modelo</th>
            <th>Tipo</th>
            <th>Capacidade</th>
            <th>Autonomia (km)</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {aeronaves.map((aeronave) => (
            <tr key={aeronave.codigo}>
              <td>{aeronave.codigo}</td>
              <td>{aeronave.modelo}</td>
              <td>{aeronave.tipo}</td>
              <td>{aeronave.capacidade}</td>
              <td>{aeronave.autonomia} km</td>
              <td className="actions-cell">
                <button
                  className="btn-secondary"
                  onClick={() => handleEdit(aeronave)}
                >
                  Editar
                </button>
                <button
                  className="btn-danger"
                  onClick={() => handleDelete(aeronave.codigo)}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      <Modal title="Cadastrar Nova Aeronave" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="modelo">Modelo</label>
            <input
              type="text"
              id="modelo"
              name="modelo"
              value={novaAeronave.modelo}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="tipo">Tipo de Aeronave</label>
            <select
              id="tipo"
              name="tipo"
              value={novaAeronave.tipo}
              onChange={handleInputChange}
            >
              {Object.values(tipoAeronave).map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="capacidade">Capacidade (Passageiros)</label>
            <input
              type="number"
              id="capacidade"
              name="capacidade"
              value={novaAeronave.capacidade}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="autonomia">Autonomia (km)</label>
            <input
              type="number"
              id="autonomia"
              name="autonomia"
              value={novaAeronave.autonomia}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              Salvar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}