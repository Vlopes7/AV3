import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { type Aeronave } from './mockData';

interface OutletContextType {
  aeronaves: Aeronave[];
}

function Relatorios() {
  const { aeronaves } = useOutletContext<OutletContextType>();
  const [selectedAeronaveId, setSelectedAeronaveId] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div>
      <h1>Geração de Relatórios</h1>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="aeronaveId">Selecione a Aeronave</label>
            <select id="aeronaveId" name="aeronaveId" value={selectedAeronaveId} onChange={e => setSelectedAeronaveId(e.target.value)} required>
              <option value="">-- Selecione --</option>
              {aeronaves.map(a => <option key={a.codigo} value={a.codigo}>{a.modelo} ({a.codigo})</option>)}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="autor">Autor do Relatório</label>
            <input type="text" id="autor" name="autor" defaultValue="Usuário Padrão" required />
          </div>
          <button type="submit" className="btn-primary">Gerar Relatório</button>
        </form>
      </div>
    </div>
  );
}

export default Relatorios;