import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegistroUsuario from './components/RegistroUsuario';
import Login from './components/Login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Reportes from './components/Reportes';
import RegistrarInstrumento from "./components/RegistrarInstrumento";
import VerInstrumentos from "./components/VerInstrumentos";
import './styles/tailwind-utils.css';
import FormularioSimple from "./components/FormularioSimple";

function App() {
  return (
    <Router>
    <Routes>
      <Route index element={<Login />} />
      <Route path="/registro" element={<RegistroUsuario />} />
    
      {/* Rutas protegidas dentro del Layout */}
      <Route path="/" element={<Layout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="reportes" element={<Reportes />} />
        <Route path="registrar-instrumento" element={<RegistrarInstrumento />} />
        <Route path="ver-instrumentos" element={<VerInstrumentos />} />
        <Route path="form-test" element={<FormularioSimple />} />
      </Route>
    </Routes>
</Router>

  );
}

export default App;
