import React, {useState, useEffect} from 'react'
import Modal from 'react-bootstrap/Modal'
import 'react-table'


export const ModalTabla = ({ show, handleClose, titulo,rows, columns }) => {
    const [productos,setProductos] = useState(rows);
    const [columnas, setColumnas] = useState(columns);
    console.log(productos);
    console.log(columns);

    useEffect(()=>{ 
        setColumnas(columns);
        setProductos(rows);
    },[,columnas,rows])
    return (
        <>
            <Modal show={show} onHide={handleClose} size='xl' >
                <Modal.Header >
                    <Modal.Title>{titulo}</Modal.Title>
                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        onClick={handleClose}>
                    </button>
                </Modal.Header>
                <Modal.Body>
                    {
                        productos.length <1 ? (<h1>No hay data</h1>) : 
                        productos.map((item)=>(
                            <h1 key={item.idProducto}>{item.marca}</h1>
                        ))
                    }
                    
                </Modal.Body>

            </Modal>
        </>
    )
}

export default ModalTabla;