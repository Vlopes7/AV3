import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/Login.css';
import { useAuth } from './AuthContext';


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    const success = login(email, password);

    if (success) {
      navigate('/dashboard');
    } else {
      setError('Credenciais inválidas. Tente "admin@aerocode.com" ou "op@aerocode.com" com a senha "123".');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form card">
        <h1>Aerocode</h1>
        <p>Faça seu login para continuar</p>
        {error && <p className="error-message">{error}</p>}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail"
        />
        <div className="password-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="show-password-btn">
            {showPassword ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

export default Login;