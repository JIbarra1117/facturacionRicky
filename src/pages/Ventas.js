import React, { useState, useEffect } from 'react'
import Sidebar from "../components/SideBar";
import Autosuggest from 'react-autosuggest';
import NavBar from "../components/NavBar";
import { Card, CardBody, CardHeader, Col, FormGroup, Input, InputGroup, InputGroupText, Label, Row, Table, Button } from "reactstrap";
import Swal from 'sweetalert2'
import Cookies from 'universal-cookie';
import '../css/routes.css'
import '../css/ventas.css'
import 'bootstrap-icons/font/bootstrap-icons.css';
import ModalTabla from '../Modales/ModalTabla';
import axios from 'axios';
import { CheckCircle, XCircleFill } from 'react-bootstrap-icons';
import ModaleDetalleFactura from '../Modales/detalleModalFactura';
import ModalCliente from '../Modales/ModalCliente';

const cookies = new Cookies();

function Ventas() {


    // Propiedades para el modal productos
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // Propiedades para el modal productos
    const [showFact, setshowFact] = useState(false);

    const handleCloseFact = () => setshowFact(false);
    const handleShowFact = () => setshowFact(true);

    const [factCreada, setFactCreada] = useState(null);
    const [productosFact, setProductosFact] = useState(null);

    const [productosGeneral, setProductosGeneral] = useState([]);
    const [clientesGeneral, setClientesGeneral] = useState([]);

    const [row, setRow] = useState([]);
    const [column, setColumn] = useState([]);
    const [tituloModal, setTituloModal] = useState("");
    const [dataCompartida, setDataCompartida] = useState(null);
    //
    const [dataCliente,setDataCliente]= useState([])
    const [a_Productos, setA_Productos] = useState([]);
    const [a_Busqueda, setA_Busqueda] = useState("");

    const [documentoCliente, setDocumentoCliente] = useState("");
    const [nombreCliente, setNombreCliente] = useState("");

    const [tipoDocumento, setTipoDocumento] = useState("Factura");
    const [productos, setProductos] = useState([]);
    const [total, setTotal] = useState(0);
    const [subTotal, setSubTotal] = useState(0);
    const [igv, setIgv] = useState(0);


    useEffect(() => {
        if (!cookies.get('sesion_usuario')) { window.location.href = "./" }else{
        solicitudProductos();
        solicitudClientes();}
    }, [])

    useEffect(() => {
        console.log(clientesGeneral);
        console.log(productosGeneral);
        switch (tituloModal) {
            case "Productos":
                setColumn(columnasProductos);
                setRow(productosGeneral);
                break;
            case "Clientes":
                setRow(clientesGeneral);
                setColumn(columnasClientes);
                break;
        }
    }, [tituloModal,clientesGeneral,productosGeneral])

    useEffect(() => {
        console.log(row)
        handleShow();
    }, [row, column])

    //Para ingresar data del padre al modal ventas
    useEffect(() => {
        handleClose();
        if (!(dataCompartida === null)) {
            if (!(Object.keys(dataCompartida).length === 0)) {
                console.log(dataCompartida)
                //Insertar la data necesaria
                switch (tituloModal) {
                    case 'Productos':
                        let producto = productos.filter(p => p.idProducto == dataCompartida.idProducto)[0];

                        console.log(producto)
                        if (producto == undefined) {
                            console.log(dataCompartida);

                            Swal.fire({
                                title: "Producto\n" + dataCompartida.marca + " - " + dataCompartida.descripcion,
                                html: `<p>Stock [` + dataCompartida.stock + `]<p/>
                                  <p>Ingresa la cantidad<p/>
                                  `,
                                input: "number",
                                inputAttributes: {
                                    autocapitalize: 'off',
                                    max: dataCompartida.stock,
                                    min: 1
                                },
                                showCancelButton: true,
                                confirmButtonText: 'Aceptar',
                                cancelButtonText: 'Volver',
                                showLoaderOnConfirm: true,
                                preConfirm: (inputValue) => {

                                    if (isNaN(inputValue) === true) {
                                        setA_Busqueda("")
                                        Swal.showValidationMessage(
                                            "Debe ingresar un valor n??merico"
                                        )
                                    } else {
                                        //console.log(suggestion.stock+"  "+inputValue)
                                        if (parseInt(inputValue) > dataCompartida.stock) {
                                            setA_Busqueda("");
                                            Swal.showValidationMessage("No hay suficiente stock");
                                        } else {
                                            let productoIngresar = {
                                                idProducto: dataCompartida.idProducto,
                                                descripcion: dataCompartida.descripcion,
                                                cantidad: inputValue,//ver la forma de insertar un valor
                                                precio: dataCompartida.precio,
                                                total: dataCompartida.precio * (inputValue)
                                            }
                                            let array = [...productos, productoIngresar];
                                            calcularTotal(array)
                                            console.log(productoIngresar);
                                            setProductos((anterior) => [...anterior, productoIngresar]);
                                        }
                                    }
                                },
                                allowOutsideClick: () => !Swal.isLoading()

                            }).then((result) => {
                                if (result.isConfirmed) {
                                    setA_Busqueda("")
                                } else {
                                    setA_Busqueda("")
                                }
                            })

                        } else {
                            Swal.fire(
                                'Opps!',
                                'Ya haz seleccionado el producto [ ' + dataCompartida.marca + ' - ' + dataCompartida.descripcion + ' ]',
                                'error'
                            )
                        }
                        setDataCompartida(null);
                        break;
                    case 'Clientes':
                        console.log(dataCompartida)
                        setNombreCliente(dataCompartida.nombre+" "+dataCompartida.apellido);
                        setDocumentoCliente(dataCompartida.cedulaCliente);
                        break;
                    default:
                        break;
                }
            }
        }

    }, [dataCompartida])

    useEffect(()=>{
        //console.log(factCreada)
        //Ejecutar solicitud de productos de factura para validar el ingreso jeje
        if(factCreada!=null){solicitudProductosFact()}else{console.log("No vale")}      
    },[factCreada])
    
    useEffect(()=>{
        if(productosFact!=null){
            handleShowFact()
        }
    },[productosFact])

    useEffect(()=>{
        if(!show){
            //setRow([])
        }
    },[show])
    //Solicitud para obtener productos
    const solicitudProductos = async () => {
        try {
            const productos = await axios.get("http://localhost:8090/productos");
            setProductosGeneral(productos.data);
        } catch (e) { console.log(e) }
    }
    //Solicitud para obtener productos
    const solicitudClientes = async () => {
        await axios.get("http://localhost:8090/clientes")
            .then(response => {
                setClientesGeneral(response.data)
            })
    }
    const solicitudProductosFact = async () => {

        const json = JSON.stringify({
          numeroDocumento: factCreada.numeroDocumento.toString()
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
            setProductosFact(res.data);
          }).catch((error) => {
            console.log(error)
          })
      }

    const columnasProductos = [

        {
            Header: 'Id',
            //id: 'idProducto',
            accessor: 'idProducto',
            show: false,
        },
        {
            Header: 'Codigo',
            //id: 'codigo',
            accessor: 'codigo',
        },
        {
            Header: 'Marca',
            //id: 'marca',
            accessor: 'marca'
        },
        {
            Header: 'Descripcion',
            //id: 'descripcion',
            accessor: 'descripcion'
        },
        {
            Header: 'Categoria',
            //id: 'idCategoria',
            accessor: 'idCategoria'
        },
        {
            Header: 'Stock' ,
            //id: 'stock',
            accessor: 'stock'
        },
        {
            Header: 'Precio',
            //id: 'precio',
            accessor: 'precio',
            Cell: ({cell}) => (<div className='text-end' style={{color:"green"}}> {cell.value} <span >$</span></div>)
        },
        {
            Header: 'Activo',
            //id: 'esActivo',
            accessor: 'esActivo',
            Cell: ({ cell }) => cell.value ? (<div className='text-center'> <CheckCircle color='green' size={16} /></div>) :
                (<XCircleFill color='red' size={16} />)
        },
        {
            Header: 'Fecha Registro',
            //id: 'fechaRegistro',
            accessor: 'fechaRegistro',
            Cell: ({ cell }) => formatDate(cell.value),
        }
    ];

    const columnasClientes = [

        {
            Header: 'Cedula',
            //id: 'idProducto',
            accessor: 'cedulaCliente',
            show: false,
        },
        {
            Header: 'Nombres',
            //id: 'codigo',
            accessor: 'nombre',
        },
        {
            Header: 'Apellidos',
            //id: 'marca',
            accessor: 'apellido'
        },];
        
    const propsModalTabla = (titulo) => {
        solicitudProductos();
        solicitudClientes();
        setTituloModal(titulo);
        if (row.length > 0) {
            handleShow();
        }
    }

    const reestablecer = () => {
        setDocumentoCliente("");
        setNombreCliente("")
        setProductos([])
        setTotal(0)
        setSubTotal(0)
        setIgv(0)
        setDataCliente({})
    }

    //para obtener la lista de sugerencias
    const onSuggestionsFetchRequested = ({ value }) => {

        const api = fetch("http://localhost:8090/productos/" + value)
            .then((response) => {
                return response.ok ? response.json() : Promise.reject(response);
            })
            .then((dataJson) => {
                setA_Productos(dataJson)
            }).catch((error) => {
                console.log("No se pudo obtener datos, mayor detalle: ", error)
            })

    }


    //funcion que nos permite borrar las sugerencias
    const onSuggestionsClearRequested = () => {
        setA_Productos([])
    }

    //devuelve el texto que se mostrara en la caja de texto del autocomplete cuando seleccionas una sugerencia (item)
    const getSuggestionValue = (sugerencia) => {

        return sugerencia.codigo + " - " + sugerencia.marca + " - " + sugerencia.descripcion
    }


    //como se debe mostrar las sugerencias - codigo htmlf
    const renderSuggestion = (sugerencia) => (
        <span>
            {(sugerencia.codigo + " - " + sugerencia.marca + " - " + sugerencia.descripcion + " - Stock " + sugerencia.stock + " - Precio   " + sugerencia.precio)}

        </span>
    )

    //evento cuando cambie el valor del texto de busqueda
    const onChange = (e, { newValue }) => {
        setA_Busqueda(newValue)
    }

    const inputProps = {
        placeholder: "Buscar producto",
        value: a_Busqueda,
        onChange
    }
    // Validar que los productos no se repitan en el detalle
    const sugerenciaValidada = (event, { suggestion }) => {//
        //buscar el producto que se repite en el detalle
        var validar = false //Se repite el producto?
        var producto = [...productos] //generar copia de productos

        producto.forEach(item => {
            //console.log('asignada'+suggestion.idProducto + '|| lista:' + item.idProducto)   
            if (suggestion.idProducto === item.idProducto) {
                validar = true;
            }
        });
        //mostrar el mensaje respectivo
        if (validar) { //Se repite el producto?
            //Mostrar que si se repite
            Swal.fire(
                'Opps!',
                'Ya haz seleccionado el producto [ ' + suggestion.marca + ' - ' + suggestion.descripcion + ' ]',
                'error'
            )
            return
        } else {
            //Mostrar si no se repite
            Swal.fire({
                title: "Producto\n" + suggestion.marca + " - " + suggestion.descripcion,
                html: `<p>Stock [` + suggestion.stock + `]<p/>
                  <p>Ingresa la cantidad<p/>
                  `,
                input: "number",
                inputAttributes: {
                    autocapitalize: 'off',
                    max: suggestion.stock,
                    min: 1
                },
                showCancelButton: true,
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Volver',
                showLoaderOnConfirm: true,
                preConfirm: (inputValue) => {

                    if (isNaN(inputValue) === true) {
                        setA_Busqueda("")
                        Swal.showValidationMessage(
                            "Debe ingresar un valor n??merico"
                        )
                    } else {
                        //console.log(suggestion.stock+"  "+inputValue)
                        if (parseInt(inputValue) > suggestion.stock) {
                            setA_Busqueda("");
                            Swal.showValidationMessage("No hay suficiente stock");
                        } else {


                            let producto = {
                                idProducto: suggestion.idProducto,
                                descripcion: suggestion.descripcion,
                                cantidad: (inputValue),
                                precio: suggestion.precio,
                                total: suggestion.precio * (inputValue)
                            }
                            let arrayProductos = []
                            arrayProductos.push(...productos)
                            arrayProductos.push(producto)
                            console.log(productos)
                            setProductos((anterior) => [...anterior, producto])
                            calcularTotal(arrayProductos)
                        }
                    }
                },
                allowOutsideClick: () => !Swal.isLoading()

            }).then((result) => {
                if (result.isConfirmed) {
                    setA_Busqueda("")
                } else {
                    setA_Busqueda("")
                }
            })
            producto = []
        }
    }

    //Para pasar la data del modal al padre ventas

    function handleProdutoModal(newValue) {
        //newValue = [...newValue];
        console.log(newValue)
        setDataCompartida(newValue);
    }

    const eliminarProducto = (id) => {

        let listaproductos = productos.filter(p => p.idProducto !== id)

        setProductos(listaproductos)

        calcularTotal(listaproductos)
    }

    const editarStockProducto = (item) => {

        let stock = productosGeneral.filter(p => p.idProducto == item.idProducto)[0].stock;

        console.log(item);
        Swal.fire({
            title: "Editar cantidad del producto\n" + " > " + item.descripcion + " < ",
            html: `<p>Stock [` + stock + `]<p/>
                  <p>Ingresa la cantidad<p/>
                  `,
            input: "number",
            inputAttributes: {
                autocapitalize: 'off',
                max: stock,
                min: 1
            },
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Volver',
            showLoaderOnConfirm: true,
            preConfirm: (inputValue) => {

                if (isNaN(inputValue) === true) {
                    setA_Busqueda("")
                    Swal.showValidationMessage(
                        "Debe ingresar un valor n??merico"
                    )
                } else {
                    if (parseInt(inputValue) > stock) {
                        setA_Busqueda("");
                        Swal.showValidationMessage("No hay suficiente stock");
                    } else {

                        eliminarProducto(item.idProducto)
                        let producto = {
                            idProducto: item.idProducto,
                            descripcion: item.descripcion,
                            cantidad: (inputValue),
                            precio: item.precio,
                            total: item.precio * (inputValue)
                        }

                        let arrayProductos = []
                        arrayProductos.push(...productos)
                        arrayProductos = arrayProductos.filter(p => p.idProducto !== producto.idProducto)
                        arrayProductos.push(producto)
                        setProductos((anterior) => [...anterior, producto])
                        calcularTotal(arrayProductos)
                    }
                }
            },
            allowOutsideClick: () => !Swal.isLoading()

        }).then((result) => {
            if (result.isConfirmed) {
                setA_Busqueda("")
            } else {
                setA_Busqueda("")
            }
        });
    }

    const calcularTotal = (arrayProductos) => {
        console.log(arrayProductos)
        let t = 0;
        let st = 0;
        let imp = 0;

        if (arrayProductos.length > 0) {

            arrayProductos.forEach((p) => {
                t = p.total + t
            })

            st = t / (1.12);
            imp = t - st;
        }

        //Monto Base = (Monto con IGV) / (1.18)

        //IGV = (Monto con IGV) ??? (Monto Base)

        setSubTotal(st.toFixed(2))
        setIgv(imp.toFixed(2))
        setTotal(t.toFixed(2))
    }

    const terminarVenta = () => {
        if (nombreCliente.length <1) {
            Swal.fire(
                'Opps!',
                'La cedula del cliente no ha sido asignado',
                'error'
            )
            return
        } else {
            if (documentoCliente.length < 1) {
                Swal.fire(
                    'Opps!',
                    'El cliente no ha sido asignado',
                    'error'
                )
                return
            } else {
                if (productos.length < 1) {
                    Swal.fire(
                        'Opps!',
                        'No existen productos',
                        'error'
                    )
                    return
                }
            }
        }

        let venta = {
            documentoCliente: documentoCliente,
            nombreCliente: nombreCliente,
            tipoDocumento: tipoDocumento,
            idUsuario: cookies.get('sesion_usuario').idUsuario,
            subTotal: parseFloat(subTotal),
            impuestoTotal: parseFloat(igv),
            total: parseFloat(total),
            productos: productos
        }

        //console.log(venta)

        const api = fetch("http://localhost:8090/ventas", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(venta)
        })
            .then((response) => {
                return response.ok ? response.json() : Promise.reject(response);
            })
            .then((dataJson) => {
                console.log(dataJson);
                reestablecer();
                var data = dataJson;
                Swal.fire(
                    'Venta Creada!',
                    'Numero de venta : ' + data.numeroDocumento,
                    'success'
                )
                const tiempoTranscurrido = Date.now();
                setFactCreada({...venta,
                                numeroDocumento:data.numeroDocumento,
                                fechaRegistro:  new Date(tiempoTranscurrido),
                            Empleado:cookies.get('sesion_usuario').nombre + " "+ cookies.get('sesion_usuario').apellido});
            }).catch((error) => {
                Swal.fire(
                    'Opps!',
                    'No se pudo crear la venta',
                    'error'
                )
                console.log("No se pudo enviar la venta ", error)
            })

    }

    //M??todos para establecer limpieza de datos

    function formatDate(date) {
        const d = new Date(date);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month ,day].join('-');
    }

    return (<>

        <div className="flex">
            <Sidebar />

            <div className='container-xxl'>
                <NavBar />
                <Row>
                    <Col sm={8}>

                        <Row className="mb-2 ">
                            <Col sm={12}>
                                <Card className='border-0 bg-light bg-opacity-25' style={{ backdropFilter: "blur( 8.5px )" }}>
                                    <CardHeader className=' border-0' style={{ backgroundColor: "rgba( 127, 17, 224, 0.50 )", color: "white" }}>
                                        Cliente
                                    </CardHeader>
                                    <CardBody className='text-white'>
                                        <div className='container-fluid'>
                                            <Row onClick={() => propsModalTabla("Clientes")} style={{cursor:"pointer"}}>
                                                <Col sm={6}>
                                                    <FormGroup>
                                                        <Label>N??mero de c??dula</Label>
                                                        <Input  disabled style={{cursor:"pointer"}} bsSize="sm" value={documentoCliente}  onChange={(e) => setDocumentoCliente(e.target.value)} />
                                                    </FormGroup>
                                                </Col>
                                                <Col sm={6}>
                                                    <FormGroup>
                                                        <Label>Nombres</Label>
                                                        <Input disabled style={{cursor:"pointer"}} bsSize="sm" value={nombreCliente}  onChange={(e) => setNombreCliente(e.target.value)} />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={12}>
                                <Card className='border-0 bg-light bg-opacity-25' style={{ backdropFilter: "blur( 8.5px )" }}>
                                    <CardHeader className=' border-0' style={{ backgroundColor: "rgba( 127, 17, 224, 0.50 )", color: "white" }}>
                                        Productos
                                    </CardHeader>
                                    <CardBody>
                                        <div className='container-fluid'>
                                            <Row className="mb-2">
                                                <Col sm={10}>
                                                    <FormGroup>
                                                        <Autosuggest
                                                            suggestions={a_Productos}
                                                            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                                                            onSuggestionsClearRequested={onSuggestionsClearRequested}
                                                            getSuggestionValue={getSuggestionValue}
                                                            renderSuggestion={renderSuggestion}
                                                            inputProps={inputProps}
                                                            onSuggestionSelected={sugerenciaValidada}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col sm={1}>
                                                    <FormGroup>
                                                        <button type="button" className='btn btn-outline-light' title="Tooltip on right" onClick={() => propsModalTabla("Productos")}>
                                                            <i className="bi bi-receipt-cutoff"></i>
                                                        </button>
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col sm={12}>
                                                    <Table striped size="sm" className='text-white'>
                                                        <thead>
                                                            <tr>
                                                                <th></th>
                                                                <th>Producto</th>
                                                                <th>Cantidad</th>
                                                                <th>Precio</th>
                                                                <th>Total</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                (productos.length < 1) ? (
                                                                    <tr>
                                                                        <td style={{ color: "white" }} colSpan="5">Sin productos</td>
                                                                    </tr>
                                                                ) :
                                                                    (
                                                                        productos.map((item) => (
                                                                            <tr key={item.idProducto} >
                                                                                <td >
                                                                                    <Button color="danger" size="sm"
                                                                                        onClick={() => eliminarProducto(item.idProducto)}>
                                                                                        <i className="fas fa-trash-alt"></i>
                                                                                    </Button>
                                                                                    <Button
                                                                                        color="success" size="sm"
                                                                                        onClick={() => editarStockProducto(item)}>
                                                                                        <i className="fas fa-edit"></i>
                                                                                    </Button>
                                                                                </td>
                                                                                <td style={{ color: "white" }}>{item.descripcion}</td>
                                                                                <td style={{ color: "white" }}>{item.cantidad}</td>
                                                                                <td style={{ color: "white", textAlign: "right" }}>{(item.precio).toFixed(2)}</td>
                                                                                <td style={{ color: "white", textAlign: "right" }}>{(item.total).toFixed(2)}</td>
                                                                            </tr>
                                                                        ))
                                                                    )


                                                            }
                                                        </tbody>
                                                    </Table>
                                                </Col>

                                            </Row>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Col>

                    <Col sm={4}>
                        <Row className="mb-5">
                            <Col sm={12}>
                                <Card className='border-0 bg-light bg-opacity-25' style={{ backdropFilter: "blur( 8.5px )" }}>
                                    <CardHeader className=' border-0' style={{ backgroundColor: "rgba( 127, 17, 224, 0.50 )", color: "white" }}>
                                        Detalle
                                    </CardHeader>
                                    <CardBody >

                                        <div className='container-fluid'>
                                            <Row className="mb-2">
                                                <Col sm={12}>
                                                    <InputGroup size="sm" >
                                                        <InputGroupText>Tipo:</InputGroupText>
                                                        <Input type="select" value={tipoDocumento} onChange={(e) => setTipoDocumento(e.target.value)}>
                                                            <option value="Factura">Factura</option>
                                                        </Input>
                                                    </InputGroup>
                                                </Col>
                                            </Row>
                                            <Row className="mb-2">
                                                <Col sm={12}>
                                                    <InputGroup size="sm" >
                                                        <InputGroupText>Sub Total:</InputGroupText>
                                                        <Input disabled value={subTotal} style={{ textAlign: "right" }} />
                                                    </InputGroup>
                                                </Col>
                                            </Row>
                                            <Row className="mb-2">
                                                <Col sm={12}>
                                                    <InputGroup size="sm" >
                                                        <InputGroupText>IVA (12%):</InputGroupText>
                                                        <Input disabled value={igv} style={{ textAlign: "right" }} />
                                                    </InputGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col sm={12}>
                                                    <InputGroup size="sm" >
                                                        <InputGroupText>Total:</InputGroupText>
                                                        <Input disabled value={total} style={{ textAlign: "right" }} />
                                                    </InputGroup>
                                                </Col>
                                            </Row>
                                        </div>


                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={12}>
                                <Card className='border-0 bg-light bg-opacity-25'>

                                    <Button className='btn' color="success" block onClick={terminarVenta} >
                                        <i className="fas fa-money-check"></i> Terminar Venta
                                    </Button>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                </Row>

            </div>
        </div>
        {
            row.length > 0 ?
                (<ModalTabla show={show} handleClose={handleClose} titulo={tituloModal} DATA={row} COLUMNS={column} onChange={handleProdutoModal} />)
                :
                console.log("No esta cargada la data....")
        }

        {
            showFact ?
                (<ModaleDetalleFactura show={showFact} handleClose={handleCloseFact} dataFactura={factCreada}  />
                )
                :
                console.log("No esta cargada la data en el modal....")
        }
        
    </>
    )
}

export default Ventas