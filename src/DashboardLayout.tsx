import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './css/Dashboard.css';
import { mockPecas, mockEtapas, mockAeronaves, type Peca, type Etapa, type Aeronave } from './mockData';

function DashboardLayout() {
  const [pecas, setPecas] = useState<Peca[]>(mockPecas);
  const [etapas, setEtapas] = useState<Etapa[]>(mockEtapas);
  const [aeronaves, setAeronaves] = useState<Aeronave[]>(mockAeronaves);

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2 className="sidebar-title">Aerocode</h2>
        <nav>
          <ul>
            <li><NavLink to="/dashboard/aeronaves">Aeronaves</NavLink></li>
            <li><NavLink to="/dashboard/pecas">Peças</NavLink></li>
            <li><NavLink to="/dashboard/etapas">Etapas de Produção</NavLink></li>
            <li><NavLink to="/dashboard/testes">Controle de Testes</NavLink></li>
            <li><NavLink to="/dashboard/relatorios">Relatórios</NavLink></li>
            <li><NavLink to="/dashboard/funcionarios">Funcionários</NavLink></li>
          </ul>
        </nav>
      </aside>
      <main className="main-content">
        <Outlet context={{ pecas, setPecas, etapas, setEtapas, aeronaves, setAeronaves }} />
      </main>
    </div>
  );
}

export default DashboardLayout;