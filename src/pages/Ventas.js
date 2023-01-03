import React, {  useState } from 'react'
import Sidebar from "../components/SideBar";
import Autosuggest from 'react-autosuggest';
import NavBar from "../components/NavBar";
import { Card, CardBody, CardHeader, Col, FormGroup, Input, InputGroup, InputGroupText, Label, Row, Table, Button } from "reactstrap";
import Swal from 'sweetalert2'
import Cookies from 'universal-cookie';
import '../css/routes.css'
import '../css/ventas.css'
import 'bootstrap-icons/font/bootstrap-icons.css';
import ModalProductos from '../components/ModalTabla';

const cookies = new Cookies();

function Ventas() {


    // Propiedades para el modal productos
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    //

    const [a_Productos, setA_Productos] = useState([])
    const [a_Busqueda, setA_Busqueda] = useState("")

    const [documentoCliente, setDocumentoCliente] = useState("")
    const [nombreCliente, setNombreCliente] = useState("")

    const [tipoDocumento, setTipoDocumento] = useState("Factura")
    const [productos, setProductos] = useState([])
    const [total, setTotal] = useState(0)
    const [subTotal, setSubTotal] = useState(0)
    const [igv, setIgv] = useState(0)

    const reestablecer = () => {
        setDocumentoCliente("");
        setNombreCliente("")
        setTipoDocumento("Factura")
        setProductos([])
        setTotal(0)
        setSubTotal(0)
        setIgv(0)
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
    const sugerenciaValidada = (event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) => {
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
                            "Debe ingresar un valor númerico"
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

    const eliminarProducto = (id) => {

        let listaproductos = productos.filter(p => p.idProducto !== id)

        setProductos(listaproductos)

        calcularTotal(listaproductos)
    }

    const calcularTotal = (arrayProductos) => {
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

        //IGV = (Monto con IGV) – (Monto Base)

        setSubTotal(st.toFixed(2))
        setIgv(imp.toFixed(2))
        setTotal(t.toFixed(2))
    }

    const terminarVenta = () => {

        
    if(documentoCliente.length < 1){
        Swal.fire(
            'Opps!',
            'La cedula del cliente no ha sido asignado',
            'error'
        )
        return
    }else{
        if(nombreCliente.length<1){
            Swal.fire(
                'Opps!',
                'El cliente no ha sido asignado',
                'error'
            )
            return
        }else{
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

            }).catch((error) => {
                Swal.fire(
                    'Opps!',
                    'No se pudo crear la venta',
                    'error'
                )
                console.log("No se pudo enviar la venta ", error)
            })

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
                                        <Row >
                                            <Col sm={6}>
                                                <FormGroup>
                                                    <Label>Número de cédula</Label>
                                                    <Input bsSize="sm" value={documentoCliente} onChange={(e) => setDocumentoCliente(e.target.value)} />
                                                </FormGroup>
                                            </Col>
                                            <Col sm={6}>
                                                <FormGroup>
                                                    <Label>Nombres</Label>
                                                    <Input bsSize="sm" value={nombreCliente} onChange={(e) => setNombreCliente(e.target.value)} />
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
                                                    <button type="button" className='btn btn-outline-light' title="Tooltip on right" onClick={handleShow}> 
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
                                                                                    onClick={() => eliminarProducto(item.idProducto)}
                                                                                >
                                                                                    <i className="fas fa-trash-alt"></i>
                                                                                </Button>
                                                                            </td>
                                                                            <td style={{ color: "white" }}>{item.descripcion}</td>
                                                                            <td style={{ color: "white" }}>{item.cantidad}</td>
                                                                            <td style={{ color: "white", textAlign: "right" }}>{item.precio}</td>
                                                                            <td style={{ color: "white", textAlign: "right" }}>{item.total}</td>
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
        <ModalProductos show={show} handleClose={handleClose}/>
    </>
    )
}

export default Ventas