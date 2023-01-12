import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import Swal from 'sweetalert2';
import axios from 'axios';
import { validarCedula } from '../controllers/validaciones';

export const ModalCliente = ({ showCli, handleCloseCli, onChange }) => {
    const [data, setData] = useState({});
    const [cedula, setCedula] = useState("");
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [nombre2, setNombre2] = useState("");
    const [apellido2, setApellido2] = useState("");


    useEffect(() => {
        handleButtonClickProducto();
    }, data)

    function cerrarModal() {
        handleCloseCli();
    }

    function handleButtonClickProducto() {
        onChange(data);
    }

    function subirCliente() {
        if (cedula.length > 0) {
            if (validarCedula(cedula)) {
                if (nombre.length > 0) {
                    if (apellido.length > 0) {
                        setData({cedulaCliente:cedula,
                        nombre:nombre,
                        apellido:apellido})
                        ingresarCliente();
                    }else{
                        Swal.fire(
                            'Opps!',
                            'El apellido no ha sido ingresada',
                            'error'
                        )
                    }
                } else {
                    Swal.fire(
                        'Opps!',
                        'Nombre no ingresado!',
                        'error'
                    )
                }
            } else {
                Swal.fire(
                    'Opps!',
                    'Cedula incorrecta!',
                    'error'
                )
            }
        } else {

            Swal.fire(
                'Opps!',
                'La cedula no ha sido ingresada',
                'error'
            )
        }
    }
    const ingresarCliente = async () => {
        const json = JSON.stringify({
            cedulaCliente: cedula,
            nombre: nombre+" "+nombre2,
            apellido: apellido +" "+apellido2
        });
        console.log(json)
        await axios.put("http://localhost:8090/clientes",
            json,
            {
                headers: {
                    // Overwrite Axios's automatically set Content-Type
                    'Content-Type': 'application/json'
                }
            })
            .then((res) => {
                console.log(res.status)
                Swal.fire(
                    'Cliente ingresado correctamente!',
                    'Cédula: ' + JSON.parse(json).cedulaCliente + '\n Nombres: ' + JSON.parse(json).nombre + '\n Apellidos: ' + JSON.parse(json).apellido,
                    'success'
                )
                handleCloseCli();
                //setProductosFact(res.data);
            }).catch((error) => {
                Swal.fire(
                    'Opps!',
                    'El servidor no responde'+'\n'+error,
                    'error'
                )
                console.log(error)
            })
    }
    function handleChangeSoloNumeros(event) {
        const newValue = event.target.value;
        if (/^\d*\.?\d*$/.test(newValue)) {
            setCedula(newValue);
        }
    }
    function handleChangeSoloLetrasNombre(event) {
        const newValue = event.target.value;
        if (/^[A-Za-zÑñ]*$/.test(newValue)) {
            setNombre(newValue);
        }
    }
    
    function handleChangeSoloLetrasApellido(event) {
        const newValue = event.target.value;
        if (/^[A-Za-zÑñ]*$/.test(newValue)) {
            setApellido(newValue);
        }
    }
    function handleChangeSoloLetrasNombre2(event) {
        const newValue = event.target.value;
        if (/^[A-Za-zÑñ]*$/.test(newValue)) {
            setNombre2(newValue);
        }
    }
    
    function handleChangeSoloLetrasApellido2(event) {
        const newValue = event.target.value;
        if (/^[A-Za-zÑñ]*$/.test(newValue)) {
            setApellido2(newValue);
        }
    }

    return (
        <>
            <Modal show={showCli} onHide={handleCloseCli} size='lg' >
                <Modal.Header >
                    <Modal.Title>Insertar cliente</Modal.Title>
                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        onClick={() => cerrarModal()}>
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <div className='container'>
                        <form class="needs-validation" novalidate>
                            <div className='form-row'>
                                <div className='col-2'>
                                </div>
                                <div className='col'>
                                    <div className='row'>
                                        <div className='col-10'>
                                            <div class="input-group mb-3">
                                                <div class="input-group-prepend">
                                                    <span class="input-group-text" id="basic-addon1">No. Cedula</span>
                                                </div>
                                                <input type="text" class="form-control" aria-describedby="basic-addon1"
                                                    maxLength={10}
                                                    value={cedula}
                                                    onChange={handleChangeSoloNumeros/*(e) => setCedula(e.target.value)*/}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-10'>
                                            <div class="input-group mb-3">
                                                <div class="input-group-prepend">
                                                    <span class="input-group-text" id="basic-addon1">Nombre</span>
                                                </div>
                                                <input type="text" class="form-control" aria-describedby="basic-addon1"
                                                    value={nombre}
                                                    onChange={handleChangeSoloLetrasNombre/*(e) => setNombre(e.target.value)*/}
                                                />
                                                <input type="text" class="form-control" aria-describedby="basic-addon1"
                                                    value={nombre2}
                                                    onChange={handleChangeSoloLetrasNombre2/*(e) => setNombre(e.target.value)*/}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-10'>
                                            <div class="input-group mb-3">
                                                <div class="input-group-prepend">
                                                    <span class="input-group-text" id="basic-addon1">Apellidos</span>
                                                </div>
                                                <input type="text" class="form-control" aria-describedby="basic-addon1"
                                                    value={apellido}
                                                    onChange={handleChangeSoloLetrasApellido/*(e) => setApellido(e.target.value)*/}
                                                />
                                                <input type="text" class="form-control" aria-describedby="basic-addon1"
                                                value={apellido2}
                                                onChange={handleChangeSoloLetrasApellido2/*(e) => setApellido(e.target.value)*/}
                                            />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col'><span> </span></div>
                                    </div>
                                </div>
                                <div className='col-3'>
                                    <button
                                        className='btn btn-outline-success'
                                        type="button"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                        onClick={() => subirCliente()}>
                                        Ingresar
                                    </button>
                                </div>
                            </div>
                        </form>

                    </div>

                </Modal.Body>

            </Modal>
        </>
    )
}

export default ModalCliente;