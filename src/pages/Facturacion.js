import React, { Component, useState } from "react";
import Cookies from "universal-cookie";
import Sidebar from "../components/SideBar";
import NavBar from "../components/NavBar";
import Card from "../components/card";
import '../css/routes.css'

const cookies = new Cookies();
var usuario = cookies.get('sesion_usuario') === undefined ? "" : cookies.get('sesion_usuario');

class Facturacion extends Component {
    dataCard = {
        id: 3,
        title: "",
        image: "https://img.freepik.com/foto-gratis/textura-pared-estuco-azul-marino-relieve-decorativo-abstracto-grunge-fondo-color-rugoso-gran-angular_1258-28311.jpg?w=996&t=st=1671703442~exp=1671704042~hmac=1c26b661217a7eb2a6cc74f8fa2b434f5699bb609b75aed5a3b0cd42765f7171"
    };
    //Validar que si no estas logeado no se deba ingresar a la facturacion
    componentDidMount() {
        if (!cookies.get('sesion_usuario')) { window.location.href = "./" };
    }

    render() {
        return (
            <>

                <div className="flex">
                    <Sidebar />
                    <div className="container-xxl "  >
                        <NavBar />
                        <div style={{height:120}}></div>
                        <div className="container  d-flex justify-content-center align-items-center ">
                    
                        <div className="row">
                            
                            <div className="">
                            
                                <Card imageSource={this.dataCard.image} text={usuario.nombre + " " + usuario.apellido} title={"Bienvenido"}>
                                </Card>
                            </div>
                        </div>
                    </div>
                    </div>
                    <br></br>
                    
                </div>
            </>
        )
    }
}

export default Facturacion;