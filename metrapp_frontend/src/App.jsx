import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegistroUsuario from './components/RegistroUsuario';
import Login from './components/Login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Reportes from './components/Reportes';
import RegistrarInstrumento from "./components/RegistrarInstrumento";
import VerInstrumentos from "./components/VerInstrumentos";

function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/registro" element={<RegistroUsuario />} />
    
      {/* Rutas protegidas dentro del Layout */}
      <Route path="/" element={<Layout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="reportes" element={<Reportes />} />
        <Route path="registrar-instrumento" element={<RegistrarInstrumento />} />
        <Route path="ver-instrumentos" element={<VerInstrumentos />} />
      </Route>
    </Routes>
</Router>

  );
}

export default App;
