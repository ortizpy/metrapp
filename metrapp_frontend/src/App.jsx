import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegistroUsuario from './components/RegistroUsuario';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<RegistroUsuario />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
