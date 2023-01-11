import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import { useSortBy, useTable, useGlobalFilter } from 'react-table';
import { GlobalFilter } from '../components/TableModal/GlobalFilter';


export const ModalTabla = ({ show, handleClose, titulo, DATA, COLUMNS,onChange }) => {
    const [dataSeleccionada, setDataSelecciona] = useState({});
    const columns = React.useMemo(() => COLUMNS, []);
    const data = React.useMemo(() => DATA, []);
    const initialState = { hiddenColumns: ['idProducto'] };

    function handleButtonClickProducto() {
        onChange(dataSeleccionada);
    }
    
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
                    <div className='container-fluid'>
                        <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter}/>
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
        </>
    )
}

export default ModalTabla;