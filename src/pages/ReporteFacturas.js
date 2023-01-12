import React, { useEffect, useState } from 'react'
import Sidebar from '../components/SideBar'
import '../css/routes.css'
import axios from 'axios';
import NavBar from '../components/NavBar';
import Cookies from "universal-cookie";
import { useSortBy, useTable, useGlobalFilter, usePagination } from 'react-table';
import { GlobalFilter } from '../components/TableModal/GlobalFilter';
import { Card, CardBody, CardHeader } from 'reactstrap';
import ModaleDetalleFactura from '../Modales/detalleModalFactura';

const cookies = new Cookies();
var usuario = cookies.get('sesion_usuario') === undefined ? "" : cookies.get('sesion_usuario');
export function ReporteFacturas() {
  const [facturas, setFacturas] = useState([]);
  const initialState = { hiddenColumns: ['idVenta'] };
  const [show, setShow] = useState(false);
  const [rowSelected, setrowSelected] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //obtener tabla de facturas
  const solicitudProductos = async () => {
    try {
      const facturas = await axios.get("http://localhost:8090/facturas");
      setFacturas(facturas.data);
    } catch (e) { console.log(e) }
  }
  useEffect(() => {if (!cookies.get('sesion_usuario')) { window.location.href = "./" }else{
    solicitudProductos();}
  }, [])


  useEffect(() => {
    handleShow();
    //if(!show){setrowSelected([])}
  }, [rowSelected])


  const columnas = [

    {
      Header: 'Id',
      //id: 'idProducto',
      accessor: 'idVenta',
      Cell: ({cell}) => (<div style={{color:"white"}}> {cell.value} </div>)
    },
    {
      Header: 'No. Factura',
      //id: 'codigo',
      accessor: 'numeroDocumento',
      Cell: ({cell}) => (<div style={{color:"white"}}> {cell.value} </div>)
    },
    {
      Header: 'Fecha registrado',
      //id: 'marca',
      accessor: 'fechaRegistro',
      Cell: ({cell}) => (<div style={{color:"white"}}> {formatDate(cell.value)} </div>)
    },
    {
      Header: 'Empleado',
      //id: 'descripcion',
      accessor: 'Empleado',
      Cell: ({cell}) => (<div style={{color:"white"}}> {cell.value} </div>)
    },
    {
      Header: 'Cedula Cliente',
      //id: 'idCategoria',
      accessor: 'documentoCliente',
      Cell: ({cell}) => (<div style={{color:"white"}}> {cell.value} </div>)
    },
    {
      Header: 'Cliente',
      //id: 'stock',
      accessor: 'nombreCliente',
      Cell: ({cell}) => (<div style={{color:"white"}}> {cell.value} </div>)
    },
    {
      Header: 'Subtotal',
      //id: 'precio',
      accessor: 'subTotal',
      Cell: ({cell}) => (<div className='text-end' style={{color:"greenyellow"}}> {cell.value} <span >$</span></div>)
    },
    {
      Header: 'Total',
      //id: 'esActivo',
      accessor: 'total',
      Cell: ({cell}) => (<div className='text-end' style={{color:"greenyellow"}}> {cell.value} <span >$</span></div>)
    },
  ];
  //Establecer columnas y datas para la tabla
  const columns = React.useMemo(() => columnas, []);
  const data = React.useMemo(() => facturas, []);

  // Crear instancia de la tabla
  const tableInstance = useTable({
    columns,
    data: facturas.length > 0 ? facturas : data,
    initialState
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

  // Funciones para modelar AJAX
  
function formatDate(date) {
  const d = new Date(date);
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month ,day].join('-');
}
  
  const { globalFilter } = state;

  const { pageIndex } = state;
  function ejercerMdalFactura(data){
    setrowSelected(data);
    handleShow();
  }
  return (
    <>
      <div className="flex">
        <Sidebar />
        <div className="container-xxl "  >
          <NavBar />
          <Card className='border-0 bg-light bg-opacity-25' style={{ backdropFilter: "blur( 8.5px )" }}>
            <CardHeader className=' border-0' style={{ backgroundColor: "rgba( 127, 17, 224, 0.50 )", color: "white" }}>
              Facturas
            </CardHeader>
            <CardBody className='text-white'>
              <div className='container-fluid' style={{ color: "white" }}>
                <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
                <table className='table table-hover table-sm' {...getTableProps()}  >
                  <thead style={{ color: "white" }}>
                    {headerGroups.map(headerGroup => (
                      <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                          <th  {...column.getHeaderProps(column.getSortByToggleProps())}
                          >{column.render("Header")}
                          {''}
                            <span style={{color:"lightcyan"}}>
                              {column.isSorted ? (column.isSortedDesc ? (<i className='bi bi-arrow-up'></i>) : (<i className='bi bi-arrow-down'></i>)) : (<i className='bi bi-arrow-down-up'></i>)}
                            </span>
                          </th>

                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody {...getTableBodyProps()} style={{ color: "white" }}>
                    {page.map((row) => {
                      prepareRow(row);
                      return (
                        <tr style={{ cursor: 'pointer' }} {...row.getRowProps()} onClick={() => ejercerMdalFactura(row.original)}>
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
                 
                      <button className="btn btn-outline-light" onClick={() => previousPage()} disabled={!canPreviousPage} >
                        <a class="page-link" >{!canPreviousPage? "No hay":"Anterior"}</a>
                      </button>
                      <button className="btn btn-outline-light" onClick={() => nextPage()} disabled={!canNextPage}>
                        <a class="page-link">{!canNextPage? "No hay":"Siguiente"}</a>
                      </button>
                  </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
      {
            rowSelected!=null ?
                (<ModaleDetalleFactura show={show} handleClose={handleClose} dataFactura={rowSelected}  />)
                :
                console.log("No esta cargada la data en el modal....")
        }
    </>
  )
}


export default ReporteFacturas;