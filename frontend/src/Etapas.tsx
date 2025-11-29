import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";

enum producao {
  Pendente = "Pendente",
  Em_andamento = "Em_andamento",
  Concluido = "Concluido",
}

interface Etapa {
  id: number;
  nome: string;
  dataPrevista: string;
  status: producao;
  aeronaveId: number;
  funcionarios?: {
    funcionarioId: number;
    funcionario?: { nome: string };
  }[];
}

interface Aeronave {
  codigo: number;
  modelo: string;
}

interface Peca {
  id: number;
  nome: string;
}

interface FuncionarioMin {
  id: number;
  nome: string;
  cargo: string;
}

interface OutletContextType {
  etapas: Etapa[];
  setEtapas: React.Dispatch<React.SetStateAction<Etapa[]>>;
  aeronaves: Aeronave[];
  pecas: Peca[];
  setPecas: React.Dispatch<React.SetStateAction<Peca[]>>;
}

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 font-bold"
          >
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

function Etapas() {
  const { etapas, setEtapas, aeronaves } =
    useOutletContext<OutletContextType>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEtapa, setEditingEtapa] = useState<Etapa | null>(null);
  const [funcionariosList, setFuncionariosList] = useState<FuncionarioMin[]>(
    []
  );
  const [selectedFuncionarioIds, setSelectedFuncionarioIds] = useState<
    number[]
  >([]);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const initialEtapaState: Etapa = {
    id: 0,
    nome: "",
    dataPrevista: "",
    status: producao.Pendente,
    aeronaveId: aeronaves[0]?.codigo || 0,
    funcionarios: [],
  };
  const [currentEtapa, setCurrentEtapa] = useState<Etapa>(initialEtapaState);

  const isConcluido =
    editingEtapa !== null && editingEtapa.status === producao.Concluido;

  const fetchFuncionarios = async () => {
    try {
      const response = await fetch("http://localhost:3000/funcionariosListAll");
      if (response.ok) {
        const data = await response.json();
        setFuncionariosList(data);
      } else {
        console.error("Falha ao carregar funcionários.");
      }
    } catch (error) {
      console.error("Erro de conexão ao buscar funcionários:", error);
    }
  };

  const fetchEtapas = async () => {
    try {
      const response = await fetch("http://localhost:3000/etapasList");
      if (response.ok) {
        const data = await response.json();
        const formatData = data.map((e: Etapa) => ({
          ...e,
          dataPrevista: e.dataPrevista.split("T")[0],
        }));
        setEtapas(formatData);
      } else {
        setFetchError("Falha ao carregar etapas.");
      }
    } catch (error) {
      setFetchError("Erro de conexão com o servidor ao carregar etapas.");
    }
  };

  useEffect(() => {
    fetchFuncionarios();
    fetchEtapas();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCurrentEtapa((prev) => ({
      ...prev,
      [name]: name === "aeronaveId" ? parseInt(value, 10) : value,
    }));
  };

  const handleSelectFuncionarioChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const options = Array.from(e.target.selectedOptions, (option) =>
      Number(option.value)
    );
    setSelectedFuncionarioIds(options);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFetchError(null);

    const dataPrevistaFormatada = currentEtapa.dataPrevista;

    const dadosEtapa = {
      id: editingEtapa ? editingEtapa.id : undefined,
      nome: currentEtapa.nome,
      dataPrevista: dataPrevistaFormatada,
      status: editingEtapa ? currentEtapa.status : producao.Pendente,
      aeronaveId: currentEtapa.aeronaveId,
      funcionarioIds: selectedFuncionarioIds,
    };

    const url = editingEtapa
      ? "http://localhost:3000/etapaEdit"
      : "http://localhost:3000/etapa";
    const method = editingEtapa ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosEtapa),
      });

      const data = await response.json();

      if (response.ok) {
        await fetchEtapas();
        setFetchError(
          `Etapa ${editingEtapa ? "atualizada" : "criada"} com sucesso!`
        );
        closeModal();
      } else {
        setFetchError(
          data.error ||
            `Falha ao ${editingEtapa ? "atualizar" : "criar"} etapa.`
        );
      }
    } catch (error) {
      setFetchError("Erro de conexão com o servidor.");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir esta etapa?")) {
      try {
        const response = await fetch(
          `http://localhost:3000/etapaDelete/${id}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          await fetchEtapas();
          setFetchError("Etapa excluída com sucesso!");
        } else {
          const data = await response.json();
          setFetchError(data.error || "Falha ao excluir etapa.");
        }
      } catch (error) {
        setFetchError("Erro de conexão ao excluir etapa.");
      }
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as producao;
    setCurrentEtapa((prev) => ({
      ...prev,
      status: newStatus,
    }));
  };

  const openModal = () => {
    setEditingEtapa(null);
    setCurrentEtapa(initialEtapaState);
    setSelectedFuncionarioIds([]);
    setIsModalOpen(true);
  };

  const handleEdit = (etapa: Etapa) => {
    setEditingEtapa(etapa);
    setCurrentEtapa(etapa);
    setIsModalOpen(true);

    if (etapa.funcionarios) {
      const ids = etapa.funcionarios.map((a) => a.funcionarioId);
      setSelectedFuncionarioIds(ids);
    } else {
      setSelectedFuncionarioIds([]);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEtapa(null);
    setCurrentEtapa(initialEtapaState);
    setSelectedFuncionarioIds([]);
  };

  const formatarData = (isoString: string) => {
    if (!isoString) return "";
    const [year, month, day] = isoString.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <div>
      <h1>Etapas de Produção</h1>

      {fetchError && (
        <div
          className={`p-4 mb-4 rounded-lg text-white ${
            fetchError.includes("sucesso") ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {fetchError}
        </div>
      )}

      <Modal
        title={editingEtapa ? "Editar Etapa" : "Criar Nova Etapa"}
        isOpen={isModalOpen}
        onClose={closeModal}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nome">Nome da Etapa</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={currentEtapa.nome}
              onChange={handleInputChange}
              required
              disabled={isConcluido}
            />
          </div>

          <div className="form-group">
            <label htmlFor="dataPrevista">Data de Conclusão Prevista</label>
            <input
              type="date"
              id="dataPrevista"
              name="dataPrevista"
              value={currentEtapa.dataPrevista}
              onChange={handleInputChange}
              required
              disabled={isConcluido}
            />
          </div>

          <div className="form-group">
            <label htmlFor="aeronaveId">Aeronave</label>
            <select
              id="aeronaveId"
              name="aeronaveId"
              value={currentEtapa.aeronaveId}
              onChange={handleInputChange}
              disabled={aeronaves.length === 0 || isConcluido}
            >
              {aeronaves.map((a) => (
                <option key={a.codigo} value={a.codigo}>
                  {a.modelo} ({a.codigo})
                </option>
              ))}
            </select>
          </div>

          {editingEtapa && (
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={currentEtapa.status}
                onChange={handleStatusChange}
                disabled={isConcluido}
              >
                {Object.values(producao).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {isConcluido && (
                <small className="text-red-500">
                  Etapa concluída não pode ter o status reaberto.
                </small>
              )}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="funcionarios">Funcionários Designados</label>
            <select
              id="funcionarios"
              name="funcionarios"
              multiple
              value={selectedFuncionarioIds.map(String)}
              onChange={handleSelectFuncionarioChange}
              disabled={isConcluido}
            >
              {funcionariosList.length === 0 ? (
                <option disabled>Carregando funcionários...</option>
              ) : (
                funcionariosList.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.nome} ({f.cargo})
                  </option>
                ))
              )}
            </select>
            <small className="text-gray-500">
              Use Ctrl/Cmd para selecionar múltiplos.
            </small>
          </div>

          <button type="submit" className="btn-primary" disabled={isConcluido}>
            Salvar
          </button>
        </form>
      </Modal>

      {/* INÍCIO DO CARD REVERTIDO */}
      <div className="card">
        <div className="table-actions">
          {/* BOTÃO "Criar Nova Etapa" REMOVIDO daqui, mantendo-o apenas no Modal */}
          {/* Se você precisar do botão Criar Nova Etapa aqui, adicione: 
                    <button className="btn-primary" onClick={openModal}>Criar Nova Etapa</button>
                    */}
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Data Prevista</th>
              <th>Status</th>
              <th>Aeronave ID</th>
              <th>Funcionários</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {etapas.map((etapa) => (
              <tr key={etapa.id}>
                <td>{etapa.id}</td>
                <td>{etapa.nome}</td>
                <td>{formatarData(etapa.dataPrevista)}</td>
                <td>{etapa.status}</td>
                <td>{etapa.aeronaveId}</td>
                <td>
                  {(etapa.funcionarios &&
                    etapa.funcionarios
                      .map((f) => f.funcionario?.nome)
                      .filter(Boolean)
                      .join(", ")) ||
                    "Nenhum"}
                </td>
                <td className="actions-cell">
                  <button
                    className="btn-secondary"
                    onClick={() => handleEdit(etapa)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => handleDelete(etapa.id)}
                    disabled={etapa.status === producao.Concluido}
                  >
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
