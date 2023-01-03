import React, {useState, useEffect} from 'react'
import Modal from 'react-bootstrap/Modal'
import axios from 'axios';


export const ModalTabla = ({ show, handleClose, titulo,rows, columns }) => {
    const [productos,setProductos] = useState([]);
    const URLproductos = "http://localhost:8090/productos";
    function testClickEvent(param) {
        alert(param);
    } 

    const  solicitudProductos = async()=>{
        await axios.get(URLproductos)
        .then(response =>{
            setProductos(response.data)
        })
    }

    useEffect(()=>{
        solicitudProductos();
    },[])

    const data = () => {
        return {
            columns: [
                {
                    label: 'Name',
                    field: 'name',
                    width: 150,
                    attributes: {
                        'aria-controls': 'DataTable',
                        'aria-label': 'Name',
                    },
                },
                {
                    label: 'Position',
                    field: 'position',
                    width: 270,
                },
                {
                    label: 'Office',
                    field: 'office',
                    width: 200,
                },
                {
                    label: 'Age',
                    field: 'age',
                    sort: 'asc',
                    width: 100,
                },
                {
                    label: 'Start date',
                    field: 'date',
                    sort: 'asc',
                    width: 150,
                },
                {
                    label: 'Salary',
                    field: 'salary',
                    sort: 'disabled',
                    width: 100,
                },
            ],
            rows: [
                {
                    name: 'Tiger Nixon',
                    position: 'System Architect',
                    office: 'Edinburgh',
                    age: '61',
                    date: '2011/04/25',
                    salary: '$320',
                    clickEvent: () => testClickEvent(1),
                },
                {
                    name: 'Garrett Winters',
                    position: 'Accountant',
                    office: 'Tokyo',
                    age: '63',
                    date: '2011/07/25',
                    salary: '$170',
                },
                {
                    name: 'Ashton Cox',
                    position: 'Junior Technical Author',
                    office: 'San Francisco',
                    age: '66',
                    date: '2009/01/12',
                    salary: '$86',
                },
                {
                    name: 'Cedric Kelly',
                    position: 'Senior Javascript Developer',
                    office: 'Edinburgh',
                    age: '22',
                    date: '2012/03/29',
                    salary: '$433',
                },
                {
                    name: 'Airi Satou',
                    position: 'Accountant',
                    office: 'Tokyo',
                    age: '33',
                    date: '2008/11/28',
                    salary: '$162',
                },
                {
                    name: 'Brielle Williamson',
                    position: 'Integration Specialist',
                    office: 'New York',
                    age: '61',
                    date: '2012/12/02',
                    salary: '$372',
                },
                {
                    name: 'Herrod Chandler',
                    position: 'Sales Assistant',
                    office: 'San Francisco',
                    age: '59',
                    date: '2012/08/06',
                    salary: '$137',
                },
            ],
        };
    };
    return (
        <>
            <Modal show={show} onHide={handleClose} size='xl'>
                <Modal.Header >
                    <Modal.Title>Productos</Modal.Title>
                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        onClick={handleClose}>
                    </button>
                </Modal.Header>
                <Modal.Body>

                </Modal.Body>

            </Modal>
        </>
    )
}

export default ModalTabla;