import React from 'react';
import Cookies from 'universal-cookie';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import '../css/myStyles.css'
import Swal from "sweetalert2";

const cookies = new Cookies();

const cerrarSesion = () => {
    cookies.remove('sesion_usuario', { path: "/" });
    window.location.href = "./*";
};
const NavBar = () => {


    const mostrarModalSalir = () => {

        Swal.fire({
            title: 'Esta por salir',
            text: "Desea cerrar sesion?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, continuar',
            cancelButtonText: 'No, volver'
        }).then((result) => {
            if (result.isConfirmed) {
                cerrarSesion();
            }
        })
    }
    return (

        <nav 
        className="navbar  navbar-expand-lg  bg-transparent bg-opacity-10" 
        style={{border : 0}}>
            <form className="container-fluid justify-content-start">


                <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <h2 className="font-weight-bold text-white">Sistema de facturacion</h2>
                        </li>
                    </ul>
                    <button type="button" className="btn btn-danger" onClick={() => mostrarModalSalir()}>Cerrar Sesión</button>
                </div>
            </form>
        </nav>
    );
};

export default NavBar;