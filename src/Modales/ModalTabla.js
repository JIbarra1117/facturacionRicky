import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import { useSortBy, useTable, useGlobalFilter } from 'react-table';
import { GlobalFilter } from '../components/TableModal/GlobalFilter';
import ModalCliente from './ModalCliente';

export const ModalTabla = ({ show, handleClose, titulo, DATA, COLUMNS,onChange }) => {
    const [dataSeleccionada, setDataSelecciona] = useState({});
    // Propiedades para el modal productos
    const [showCli, setShowCli] = useState(false);

    const handleCloseCli = () => setShowCli(false);
    const handleShowCli = () => setShowCli(true);

    var columns = React.useMemo(() => {
        let columnasA = COLUMNS;
        return columnasA
    });
    var data = React.useMemo(() => {
        let datos = DATA;
        return datos
    });
    const initialState = { hiddenColumns: ['idProducto'] };

    function handleButtonClickProducto() {
        onChange(dataSeleccionada);
    }
    console.log(DATA)
    console.log(COLUMNS)
    console.log(data)
    console.log(columns)
    useEffect(()=>{
        console.log(dataSeleccionada);
        handleButtonClickProducto();
    },[dataSeleccionada]);

    const tableInstance = useTable({
        columns,
        data,
        initialState,
    },useGlobalFilter, useSortBy);
    const {
        getTableProps, // table props from react-table
        getTableBodyProps, // table body props from react-table
        headerGroups, // headerGroups, if your table has groupings
        rows, // rows for the table based on the data passed
        prepareRow, // Prepare the row (this function needs to be called for each row before getting the row props)
        state,
        setGlobalFilter,
    } = tableInstance;
    const {globalFilter} = state;

    function abrirModalCli(){
        handleShowCli();
        cerrarModal();        
    }
        
    function cerrarModal(){
        columns={};
        data={};
        handleClose();
        //setDataSelecciona({});
    }
    function handleClienteInsertado(newValue){
        setDataSelecciona(newValue);
    }
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
                        onClick={()=> cerrarModal()}>
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <div className='container-fluid'>
                    <div className='row'>

                        <div className='col'><GlobalFilter filter={globalFilter} setFilter={setGlobalFilter}/></div>                        
                        <div className='col'>
                            {titulo=="Clientes"?
                        (
                        <button className='btn btn-outline-success' onClick={()=>abrirModalCli()}>Crear cliente</button>
                        ):""}
                        </div>
                        
                        </div>
                        <table className='table table-hover table-responsive' {...getTableProps()}>
                            <thead>
                                {headerGroups.map(headerGroup => (
                                    <tr {...headerGroup.getHeaderGroupProps()}>
                                        {headerGroup.headers.map(column => (
                                            <th {...column.getHeaderProps(column.getSortByToggleProps())}
                                            >{column.render("Header")}
                                                <span>
                                                    
                                                    {column.isSorted ? (column.isSortedDesc ? (<i className='bi bi-arrow-up'></i>) : (<i className='bi bi-arrow-down'></i>)) : (<i className='bi bi-arrow-down-up'></i>)}
                                                </span>
                                            </th>

                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody {...getTableBodyProps()}>
                                {rows.map((row) => {
                                    prepareRow(row);
                                    return (
                                        <tr style={{cursor:'pointer'}} {...row.getRowProps()} onClick = {()=> setDataSelecciona(row.original)}>
                                            {row.cells.map(cell => {
                                                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </Modal.Body>

            </Modal>            
        {
            showCli?
            (<ModalCliente showCli={showCli} handleCloseCli={handleCloseCli}  onChange={handleClienteInsertado} />)
            :
            ""
        }
        </>
    )
}

export default ModalTabla;