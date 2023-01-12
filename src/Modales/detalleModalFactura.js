import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import axios from 'axios'
export const ModaleDetalleFactura = ({ dataFactura, show, handleClose }) => {
  const facturaGeneral = dataFactura;
  //Solicitar los productos de la factura a visualizar
  const [productos, setProductos] = useState([]);
  var contador = 0;
  const solicitudProductos = async () => {

    const json = JSON.stringify({
      numeroDocumento: facturaGeneral.numeroDocumento.toString()
    });
    await axios.post("http://localhost:8090/facturas",
      json,
      {
        headers: {
          // Overwrite Axios's automatically set Content-Type
          'Content-Type': 'application/json'
        }
      })
      .then((res) => {
        //console.log(res.data)
        setProductos(res.data);
      }).catch((error) => {
        console.log(error)
      })
  }
  useEffect(() => {
    console.log(productos)
    solicitudProductos();
  }, [])
  useEffect(() => {
    solicitudProductos();
  }, [productos])
  //
  function cerrarModal() {
    setProductos([]);
    handleClose();
  }

  function formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('/');
  }
  return (
    <Modal show={show} onHide={handleClose} size='xl' >
      <Modal.Header >
        <Modal.Title><h1>Factura No. {dataFactura.numeroDocumento}</h1></Modal.Title>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
          onClick={() => { cerrarModal() }}>
        </button>
      </Modal.Header>
      <Modal.Body>
        <div className='container-fluid'>
          <div className='row'>
            <div className='col'>
              Empleado:
            </div>
            <div className='col-10'>
              {facturaGeneral.Empleado}
            </div>
          </div>
          <div className='row'>
            <div className='col'>
              Fecha registrado:
            </div>
            <div className='col-10'>
              {formatDate(facturaGeneral.fechaRegistro)}
            </div>
          </div>
          <div className='row'>
            <div className='col'>
                Cliente: 
            </div>            
            <div className='col-10'>
              {facturaGeneral.nombreCliente}
            </div>

          </div>
          <div className='row'>
          <div className='col'>
            Cédula: 
          </div>
          <div className='col-10'>
          {facturaGeneral.documentoCliente}
          </div>
          </div>
          <div className='row'>
            <div className='col'>
              <table class="table">
                <thead>
                  <tr>
                    <th>Marca</th>
                    <th>Descripcion</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>

                  {
                    productos.length > 0 ? productos.map(producto => {
                      return (
                        <tr >
                          <td>{producto.marca}</td>
                          <td>{producto.descripcion}</td>
                          <td>{producto.cantidad}</td>
                          <td className='text-end' style={{color:""}}>{producto.precio.toFixed(2)} {" $"}</td>
                          <td className='text-end' style={{color:""}}>{producto.total.toFixed(2)} {" $"}</td>
                        </tr>
                      )
                    }) : "No hay datos"
                  }
                  <tr >
                    <td className='border-0'></td>
                    <td className='border-0'></td>
                    <td className='border-0'></td>
                    <td className='text-end border-0'><b>Subtotal:</b></td>
                    <td className='text-end border-0' style={{color:"green"}}>{(facturaGeneral.subTotal).toFixed(2)}{" $"}</td>
                  </tr>
                  <tr >
                  <td className='border-0'></td>
                    <td className='border-0'></td>
                    <td className='border-0'></td>
                    <td className='text-end border-0'><b>IVA 12%:</b></td>
                    <td className='text-end border-0' style={{color:"green"}}>{(facturaGeneral.total-facturaGeneral.subTotal).toFixed(2)} {" $"}</td>
                  </tr>
                  <tr >
                  <td className='border-0'></td>
                    <td className='border-0'></td>
                    <td className='border-0'></td>
                    <td className='text-end border-0'><b>Total:</b></td>
                    <td className='text-end border-0' style={{color:"green"}}>{facturaGeneral.total.toFixed(2)} {" $"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Modal.Body>

    </Modal>
  )
}

export default ModaleDetalleFactura;