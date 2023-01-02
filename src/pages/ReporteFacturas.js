import React, { Component } from 'react'
import Sidebar from '../components/SideBar'
import '../css/routes.css'

export default class ReporteFacturas extends Component {
  render() {
    return (
    <>
    <div className="flex">
        <Sidebar />
        <div>
            <h1>
              Hola reportes
            </h1>
        </div>
    </div>
    </>
    )
  }
}
