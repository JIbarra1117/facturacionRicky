import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import { useSortBy, useTable, useGlobalFilter, usePagination } from 'react-table';
import { GlobalFilter } from '../components/TableModal/GlobalFilter';
import ModalCliente from './ModalCliente';

export const ModalTabla = ({ show, handleClose, titulo, DATA, COLUMNS, onChange }) => {
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
    const initialState = { hiddenColumns: ['idProducto', 'esActivo'] };

    function handleButtonClickProducto() {
        onChange(dataSeleccionada);
    }
    console.log(DATA)
    console.log(COLUMNS)
    console.log(data)
    console.log(columns)
    useEffect(() => {
        console.log(dataSeleccionada);
        handleButtonClickProducto();
    }, [dataSeleccionada]);

    const tableInstance = useTable({
        columns,
        data,
        initialState,
    }, useGlobalFilter, useSortBy, usePagination);
    const {
        getTableProps, // table props from react-table
        getTableBodyProps, // table body props from react-table
        headerGroups, // headerGroups, if your table has groupings
        page, // rows for the table based on the data passed
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        pageOptions,
        prepareRow, // Prepare the row (this function needs to be called for each row before getting the row props)
        state,
        setGlobalFilter,
    } = tableInstance;
    const { globalFilter } = state;
    const { pageIndex } = state;

    function abrirModalCli() {
        handleShowCli();
        cerrarModal();
    }

    function cerrarModal() {
        columns = {};
        data = {};
        handleClose();
        //setDataSelecciona({});
    }
    function handleClienteInsertado(newValue) {
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
                        onClick={() => cerrarModal()}>
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <div className='container-fluid'>
                        <div className='row'>

                            <div className='col'>
                                <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} /></div>
                            <div className='col'>
                                {titulo == "Clientes" ?
                                    (
                                        <button className='btn btn-outline-success' onClick={() => abrirModalCli()}>Crear cliente</button>
                                    ) : ""}
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
                                {page.map((row) => {
                                    prepareRow(row);
                                    return (
                                        <tr style={{ cursor: 'pointer' }} {...row.getRowProps()} onClick={() => setDataSelecciona(row.original)}>
                                            {row.cells.map(cell => {
                                                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        <div className='container'>
                            <div className='row'>
                                <div className='col-md'>
                                    <span>
                                        Page{' '}
                                        <strong>
                                            {pageIndex + 1} of {pageOptions.length}
                                        </strong>{' '}
                                    </span>
                                </div>
                                <div className='col-md'>
                                    <button className="btn btn-outline-success" onClick={() => previousPage()} disabled={!canPreviousPage} >
                                        <a class="page-link" >{!canPreviousPage ? "No hay" : "Anterior"}</a>
                                    </button>
                                    <button className="btn btn-outline-success" onClick={() => nextPage()} disabled={!canNextPage}>
                                        <a class="page-link">{!canNextPage ? "No hay" : "Siguiente"}</a>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>

            </Modal>
            {
                showCli ?
                    (<ModalCliente showCli={showCli} handleCloseCli={handleCloseCli} onChange={handleClienteInsertado} />)
                    :
                    ""
            }
        </>
    )
}

export default ModalTabla;