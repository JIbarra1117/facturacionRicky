import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Facturacion from "../pages/Facturacion";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import '../css/routes.css'
import Ventas from "../pages/Ventas";
import ReporteFacturas from "../pages/ReporteFacturas";

function App() {
  return (
    <>
    <BrowserRouter>
        <div className="content">
          <div className="fondo">
          <Routes>
            <Route  path="/*" element={<Login/>}/>
            <Route  path="/facturacion" element={<Facturacion/>}/>
            <Route  path="/ventas" element={<Ventas/>}/>
            <Route  path="/reportes" element={<ReporteFacturas/>}/>
          </Routes>
          </div>
        </div>
    </BrowserRouter>
    </>
  );
}

export default App;
