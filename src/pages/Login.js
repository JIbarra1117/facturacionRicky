
import '../css/Login.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import React, { Component } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
const cookies = new Cookies();

class Login extends Component{
  qs = require('qs');
  state={
      form:{
          Correo:'',
          Clave: ''
      }
  }

    handleChange = async e =>{
        await this.setState({
            form:{
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        });
        //console.log(this.state.form); //Descomentar para comprobar parametros del usuario en el formulario 
    }
iniciarSesion = async()=>{
  //console.log(this.state.form.Correo+' '+this.state.form.Clave);
  const json = JSON.stringify({ 
    correo : this.state.form.Correo, 
    clave  : this.state.form.Clave
  });
  //console.log(json);
  await axios.post("http://localhost:8090/usuarios/singin/", 
                    json,
                    {
                      headers: {
                        // Overwrite Axios's automatically set Content-Type
                        'Content-Type': 'application/json'
                      }
                    })
                  .then((res) => {
                    //console.log(res.data)
                    return res.data;
                  }).then((res) => {
                    if((Object.entries(res).length === 0)){
                      alert("El usuario o la contraseña no son correctos!");
                    }else{
                      alert("El usuario o la contraseña son correctos!");
                      //var dataUsuario = res;
                      console.log(res);
                      cookies.set('sesion_usuario',res,{path:"/"});
                      window.location.href="./facturacion";
                    }
                  }).catch((error) => {
                    console.log(error)
                  })
  }

  componentDidMount(){
    if(cookies.get('sesion_usuario')){
      window.location.href="./facturacion";
    }
  }

    render(){
        return (
            <div className="containerPrincipal">
            <div className="containerSecundario">
              <div className="form-group">
                <label>Correo</label>
                <br />
                <input
                  type="text"
                  className="form-control shadow-none "
                  name="Correo"
                  onChange={this.handleChange}
                />
                <br />
                <label>Clave </label>
                <br />
                <input
                  type="password"
                  className="form-control shadow-none"
                  name="Clave"
                  onChange={this.handleChange}
                />
                <br />
                <button color='#fff' className="btn btn-light" onClick={()=> this.iniciarSesion()}>Iniciar Sesión</button>
              </div>
            </div>
          </div>
        );
    }
}

export default Login;