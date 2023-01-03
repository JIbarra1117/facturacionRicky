import React, {useState, useEffect} from 'react'
import Modal from 'react-bootstrap/Modal'


export const ModalTabla = ({ show, handleClose, titulo,rows, columns }) => {
    const [productos] = useState(rows);

    console.log(productos);
    console.log(columns);

    useEffect(()=>{

    },[])

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
                        rows.map((item)=>(
                            <h1 key={item.idProducto}>{item.marca}</h1>
                        ))
                    }
                </Modal.Body>

            </Modal>
        </>
    )
}

export default ModalTabla;